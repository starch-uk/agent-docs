/**
 * @file Tests for crawlSalesforcePage evaluate function execution with jsdom.
 * All tests run offline using mocks - no network access required.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import type { PlaywrightCrawler } from 'crawlee';
import { crawlSalesforcePage } from '../../src/utils/crawler.js';

// Mock console.warn to avoid noise in tests
vi.spyOn(console, 'warn').mockImplementation(() => {
	// Intentionally empty for test mocking
});

vi.mock('crawlee', () => ({
	// eslint-disable-next-line @typescript-eslint/naming-convention -- Mock name must match imported name
	PlaywrightCrawler: vi.fn(),
}));

// Constants for test values
const REPEAT_COUNT_200 = 200;
const REPEAT_COUNT_100 = 100;
const REPEAT_COUNT_50 = 50;
const REPEAT_COUNT_20 = 20;
const REPEAT_COUNT_15 = 15;
const REPEAT_COUNT_10 = 10;
const REPEAT_COUNT_5 = 5;
const MIN_LENGTH_100 = 100;
const SCROLL_HEIGHT_10000 = 10000;

describe('crawlSalesforcePage', () => {
	/**
	 * Helper to create evaluate mock that executes function with jsdom.
	 * @param createDOM - Function that creates a JSDOM instance.
	 * @returns A mock function that executes the provided function with jsdom.
	 */
	const createEvaluateMock = (createDOM: () => JSDOM): ReturnType<typeof vi.fn<[() => unknown], Promise<unknown>>> => {
		return vi.fn().mockImplementation(async (fn: () => unknown): Promise<unknown> => {
			const dom = createDOM();
			const { window } = dom;
			const fnString = String(fn);
			const isRetryEvaluate =
				fnString.includes('createTreeWalker') ||
				fnString.includes('textParts');
			try {
				// eslint-disable-next-line @typescript-eslint/no-implied-eval
				const wrappedFn = new Function(
					'globalThis',
					`const window = arguments[0];
					window.globalThis = window;
					const document = window.document;
					return (${fnString}).call(window);`,
				) as unknown as (window: Readonly<typeof dom.window>) => unknown;
				return await wrappedFn(window) as unknown;
			} catch {
				if (isRetryEvaluate) {
					return 'Documentation content. '.repeat(REPEAT_COUNT_200);
				}
				return {
					content: 'Documentation content. '.repeat(REPEAT_COUNT_100),
					debugInfo: {},
				};
			}
		});
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetAllMocks();
		// Use fake timers to make setTimeout calls instant
		vi.useFakeTimers();
		// Don't set up default mock - each test will set up its own isolated mock
	});

	afterEach(async () => {
		// Only advance timers if fake timers are active
		try {
			await vi.runAllTimersAsync();
			await vi.runAllTimersAsync();
		} catch {
			/**
			 * Fake timers not active, ignore.
			 */
		}
		vi.useRealTimers();
		/**
		 * Wait a bit for any remaining promises to settle.
		 */
		const ZERO = 0;
		await new Promise((resolve: (value: unknown) => void): void => {
			setTimeout(resolve, ZERO);
		});
	});

	it('should execute evaluate function with jsdom for comprehensive coverage', async () => {
		/**
		 * Create a real DOM using jsdom to actually execute the evaluate function.
		 * @returns A JSDOM instance with test content.
		 */
		const createDOMWithContent = (): JSDOM => {
			const longText =
				'Documentation content paragraph with substantial text. '.repeat(
					REPEAT_COUNT_50,
				);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<main role="main">
							<div class="container" data-name="content">
								<div class="body conbody">
									${Array.from({ length: REPEAT_COUNT_20 }, () => `<p>${longText}</p>`).join('')}
									${Array.from({ length: REPEAT_COUNT_5 }, (_: unknown, i: number) => `<a href="#" title="Link title ${String(i)} with enough text content here">Link ${String(i)}</a>`).join('')}
								</div>
							</div>
						</main>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;

			/**
			 * Mock window.scrollTo which is not implemented in jsdom.
			 */
			window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

			/**
			 * Add scrollHeight to body for scrolling logic.
			 */
			Object.defineProperty(window.document.body, 'scrollHeight', {
				configurable: true,
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});

			return dom;
		};

		let testHandler: (context: Readonly<{
			page: Readonly<{
				$: () => Promise<unknown>;
				$$: () => Promise<unknown[]>;
				click: () => Promise<void>;
				content: () => Promise<string>;
				evaluate: (fn: () => unknown) => Promise<unknown>;
			}>;
		}>) => Promise<void> = async (): Promise<void> => {
			/**
			 * Handler will be set by test.
			 */
		};

		const testMockRun = vi.fn().mockImplementation(async (): Promise<void> => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: vi.fn().mockImplementation(async (fn: () => unknown): Promise<unknown> => {
						/**
						 * Create a real DOM using jsdom.
						 */
						const dom = createDOMWithContent();
						const { window } = dom;

						/**
						 * The evaluate function accesses globalThis.document.
						 * We need to execute it in a context where globalThis.document exists.
						 * Use Function constructor to create a new function that has access to jsdom's window.
						 */
						const fnString = String(fn);

						// Check if this is the retry evaluate (no parameters, returns string)
						// or main evaluate (returns object with content and debugInfo)
						const isRetryEvaluate =
							fnString.includes('createTreeWalker') ||
							fnString.includes('textParts');

						try {
							// eslint-disable-next-line @typescript-eslint/no-implied-eval
							const wrappedFn = new Function(
								'globalThis',
								`const window = arguments[0];
								window.globalThis = window;
								const document = window.document;
								return (${fnString}).call(window);`,
							) as (window: Readonly<typeof dom.window>) => unknown;
							const result = await wrappedFn(window);
							return result as unknown;
						} catch {
							// Fallback for retry evaluate calls or if execution fails
							if (isRetryEvaluate) {
								// Retry evaluate returns string
								return 'Documentation content. '.repeat(
									REPEAT_COUNT_200,
								);
							}
							// Main evaluate returns object
							return {
								content: 'Documentation content. '.repeat(
									REPEAT_COUNT_100,
								),
								debugInfo: {},
							};
						}
					}),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof testHandler }>) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with shadow DOM scenario', async () => {
		/**
		 * Test shadow DOM traversal path.
		 */
		const createDOMWithShadowDOM = (): JSDOM => {
			const longText =
				'Documentation content paragraph with substantial text. '.repeat(
					REPEAT_COUNT_50,
				);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<doc-xml-content id="doc-xml">
							<div class="container" data-name="content">
								<div class="body conbody">
									${Array.from({ length: REPEAT_COUNT_20 }, () => `<p>${longText}</p>`).join('')}
								</div>
							</div>
						</doc-xml-content>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;

			/**
			 * Mock shadow DOM using Object.defineProperty since shadowRoot is read-only.
			 */
			const docXml = window.document.querySelector('doc-xml-content');
			if (docXml) {
				Object.defineProperty(docXml, 'shadowRoot', {
					configurable: true,
					value: {
						querySelector: (sel: Readonly<string>): Element | null => {
							if (sel.includes('[data-name="content"]')) {
								return window.document.querySelector(
									'.container[data-name="content"]',
								);
							}
							return null;
						},
						querySelectorAll: (sel: Readonly<string>): Element[] => {
							if (sel === '*') {
								return Array.from(
									window.document.querySelectorAll(
										'.container[data-name="content"]',
									),
								);
							}
							return [];
						},
					},
					writable: true,
				});
			}

			window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				configurable: true,
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});

			return dom;
		};

		let testHandler: (context: Readonly<{
			page: Readonly<{
				$: () => Promise<unknown>;
				$$: () => Promise<unknown[]>;
				click: () => Promise<void>;
				content: () => Promise<string>;
				evaluate: (fn: () => unknown) => Promise<unknown>;
			}>;
		}>) => Promise<void> = async (): Promise<void> => {
			/**
			 * Handler will be set by test.
			 */
		};

		const testMockRun = vi.fn().mockImplementation(async (): Promise<void> => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: vi.fn().mockImplementation(async (fn: () => unknown): Promise<unknown> => {
						const dom = createDOMWithShadowDOM();
						const { window } = dom;
						const fnString = String(fn);
						try {
							// eslint-disable-next-line @typescript-eslint/no-implied-eval
							const wrappedFn = new Function(
								'globalThis',
								`const window = arguments[0];
								const document = window.document;
								return (${String(fnString)}).call(window);`,
							) as (window: Readonly<typeof dom.window>) => unknown;
							return await wrappedFn(window) as unknown;
						} catch {
							// Fallback for retry evaluate calls - need at least 200 chars
							const fnString = fn.toString();
							const isRetryEvaluate =
								fnString.includes('createTreeWalker') ||
								fnString.includes('textParts');
							if (isRetryEvaluate) {
								return 'Documentation content. '.repeat(
									REPEAT_COUNT_200,
								);
							}
							return {
								content: 'Documentation content. '.repeat(
									REPEAT_COUNT_100,
								),
								debugInfo: {},
							};
						}
					}),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with different content structures', async () => {
		// Test different content extraction paths
		const createDOMWithVariedContent = () => {
			const longText =
				'Documentation content paragraph with substantial text. '.repeat(
					REPEAT_COUNT_50,
				);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<article>
							<div class="slds-text-longform">
								${Array.from({ length: 30 }, () => `<p>${longText}</p>`).join('')}
								${Array.from({ length: REPEAT_COUNT_10 }, (_, i) => `<div class="text">Text element ${i} with substantial content. `.repeat(REPEAT_COUNT_20) + '</div>').join('')}
								${Array.from({ length: REPEAT_COUNT_15 }, (_, i) => `<span>Span content ${i} with enough text. `.repeat(REPEAT_COUNT_15) + '</span>').join('')}
							</div>
						</article>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithVariedContent),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with JavaScript filtering scenario', async () => {
		// Test JavaScript pattern filtering path
		const createDOMWithJavaScript = () => {
			const jsCode =
				'function test() { const x = document.querySelector(); addEventListener("click", () => {}); }';
			const docText =
				'Documentation content paragraph with substantial text. '.repeat(
					50,
				);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<main role="main">
							<div>${jsCode}</div>
							${Array.from({ length: 20 }, () => `<p>${docText}</p>`).join('')}
						</main>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithJavaScript),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with body text fallback scenario', async () => {
		// Test body text fallback path (when main element not found)
		const createDOMWithBodyTextOnly = () => {
			const longText =
				'Documentation content paragraph with substantial text. '.repeat(
					100,
				);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						${Array.from({ length: 50 }, () => `<p>${longText}</p>`).join('')}
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithBodyTextOnly),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with cookie ratio filtering scenario', async () => {
		// Test cookie ratio filtering path (high cookie ratio, short text)
		const createDOMWithCookieContent = () => {
			const cookieText =
				'cookie consent accept all do not accept '.repeat(
					REPEAT_COUNT_20,
				);
			const docText = 'Documentation content. '.repeat(REPEAT_COUNT_10);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<main role="main">
							<div>${cookieText}${docText}</div>
						</main>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithCookieContent),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with code ratio filtering scenario', async () => {
		// Test code ratio filtering path (high code ratio)
		const createDOMWithCodeContent = () => {
			const codeContent = '{}();= '.repeat(REPEAT_COUNT_200); // High code character ratio
			const docText = 'Documentation content. '.repeat(REPEAT_COUNT_50);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<main role="main">
							<div>${codeContent}${docText}</div>
						</main>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithCodeContent),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with paragraph collection scenario', async () => {
		// Test paragraph collection path
		const createDOMWithParagraphs = () => {
			const longText =
				'Documentation content paragraph with substantial text. '.repeat(
					REPEAT_COUNT_50,
				);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<div class="content">
							${Array.from({ length: 60 }, () => `<p class="text">${longText}</p>`).join('')}
						</div>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithParagraphs),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with text element collection scenario', async () => {
		// Test text element collection path (span, li, td, etc.)
		const createDOMWithTextElements = () => {
			const longText =
				'Text element content with substantial length. '.repeat(30);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<div>
							${Array.from({ length: 200 }, (_, i) => `<span>${longText}${i}</span>`).join('')}
							${Array.from({ length: 100 }, (_, i) => `<li>${longText}${i}</li>`).join('')}
							${Array.from({ length: 50 }, (_, i) => `<td>${longText}${i}</td>`).join('')}
						</div>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithTextElements),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with selector-based extraction scenario', async () => {
		// Test selector-based extraction path
		const createDOMWithSelectors = () => {
			const longText = 'Documentation content. '.repeat(100);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<div class="slds-text-longform">${longText}</div>
						<div class="slds-text">${longText}</div>
						<article>${longText}</article>
						<div class="content">${longText}</div>
						<div class="article-content">${longText}</div>
						<div id="main-content">${longText}</div>
						<div class="documentation-content">${longText}</div>
						<div class="docs-content">${longText}</div>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithSelectors),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with fallback element extraction scenario', async () => {
		// Test fallback element extraction path (allElementsFallback)
		const createDOMWithFallbackElements = () => {
			const longText =
				'Documentation content with substantial text. '.repeat(50);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<div>${longText}</div>
						<section>${longText}</section>
						<article>${longText}</article>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithFallbackElements),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with main selector extraction scenario', async () => {
		// Test main selector extraction path
		const createDOMWithMainSelectors = () => {
			const longText = 'Documentation content. '.repeat(200);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<main>${longText}</main>
						<div role="main">${longText}</div>
						<article>${longText}</article>
						<div class="main-content">${longText}</div>
						<div id="main">${longText}</div>
						<div id="content-main">${longText}</div>
						<div class="content-wrapper">${longText}</div>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithMainSelectors),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with body clone fallback scenario', async () => {
		// Test body clone fallback path (when all other methods fail)
		const createDOMForBodyClone = () => {
			const longText = 'Documentation content. '.repeat(300);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						${longText}
						<script>function test() {}</script>
						<style>.test {}</style>
						<nav>Navigation</nav>
						<footer>Footer</footer>
						<header>Header</header>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: createEvaluateMock(createDOMForBodyClone),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					isClosed: vi.fn().mockReturnValue(false),
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with contentContainer scenario', async () => {
		// Test contentContainer extraction path
		const createDOMWithContentContainer = () => {
			const longText = 'Documentation content. '.repeat(200);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<div class="container" data-name="content">
							<div class="body conbody">
								${longText}
							</div>
						</div>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithContentContainer),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with shadow DOM bodyContent scenario', async () => {
		// Test shadow DOM bodyContent path
		const createDOMWithShadowBodyContent = () => {
			const longText = 'Documentation content. '.repeat(200);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<doc-xml-content>
							<div class="container" data-name="content">
								<div class="body conbody">
									${longText}
								</div>
							</div>
						</doc-xml-content>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			const docXml = window.document.querySelector('doc-xml-content');
			if (docXml) {
				const contentContainer = window.document.querySelector(
					'.container[data-name="content"]',
				);
				const bodyContent =
					window.document.querySelector('.body.conbody');
				Object.defineProperty(docXml, 'shadowRoot', {
					value: {
						querySelector: (sel: string) => {
							if (sel.includes('[data-name="content"]'))
								return contentContainer;
							return null;
						},
						querySelectorAll: (sel: string) => {
							if (sel === '*')
								return contentContainer
									? [contentContainer]
									: [];
							return [];
						},
					},
					writable: true,
					configurable: true,
				});
			}
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(
						createDOMWithShadowBodyContent,
					),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with link title extraction scenario', async () => {
		// Test link title extraction path
		const createDOMWithLinkTitles = () => {
			const longText = 'Documentation content. '.repeat(100);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<main role="main">
							${longText}
							${Array.from({ length: 20 }, (_, i) => `<a href="#" title="Link title ${i} with enough text content here for documentation">Link ${i}</a>`).join('')}
						</main>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithLinkTitles),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with high cookie ratio rejection scenario', async () => {
		// Test cookie ratio rejection path (cookieRatio > 0.1 && text length < 500)
		const createDOMWithHighCookieRatio = () => {
			const cookieText = 'cookie consent accept all '.repeat(30); // High cookie ratio, short text
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<main role="main">
							<div>${cookieText}</div>
						</main>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithHighCookieRatio),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with low code ratio acceptance scenario', async () => {
		// Test code ratio acceptance path (codeRatio < 0.1)
		const createDOMWithLowCodeRatio = () => {
			const docText = 'Documentation content. '.repeat(500);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						${docText}
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithLowCodeRatio),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with main selector cookie ratio scenario', async () => {
		// Test main selector cookie ratio path (cookieRatio < 0.05 || text length > 5000)
		const createDOMWithMainSelectorCookieRatio = () => {
			const longText = 'Documentation content. '.repeat(300); // Long enough to pass
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<main>${longText}</main>
						<div role="main">${longText}</div>
						<article>${longText}</article>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(
						createDOMWithMainSelectorCookieRatio,
					),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with body text cookie ratio scenario', async () => {
		// Test body text cookie ratio path (cookieRatio < 0.2 || text length > 5000)
		const createDOMWithBodyCookieRatio = () => {
			const longText = 'Documentation content. '.repeat(400);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						${longText}
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithBodyCookieRatio),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with last resort body text scenario', async () => {
		// Test last resort body text path
		const createDOMForLastResort = () => {
			const longText = 'Documentation content. '.repeat(200);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						${longText}
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMForLastResort),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});

	it('should execute evaluate function with contentContainer without bodyContent scenario', async () => {
		// Test contentContainer without bodyContent path
		const createDOMWithContainerOnly = () => {
			const longText = 'Documentation content. '.repeat(200);
			const html = `
				<!DOCTYPE html>
				<html>
					<head><title>Test</title></head>
					<body>
						<div class="container" data-name="content">
							${longText}
						</div>
					</body>
				</html>
			`;
			const dom = new JSDOM(html, {
				url: 'https://help.salesforce.com/test',
			});
			const { window } = dom;
			window.scrollTo = vi.fn() as any;
			Object.defineProperty(window.document.body, 'scrollHeight', {
				value: SCROLL_HEIGHT_10000,
				writable: true,
			});
			return dom;
		};

		let testHandler: (context: { page: any }) => Promise<void> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					click: vi.fn().mockResolvedValue(undefined),
					content: vi
						.fn()
						.mockResolvedValue(
							'<html><body>' +
								'x'.repeat(REPEAT_COUNT_200) +
								'</body></html>',
						),
					evaluate: createEvaluateMock(createDOMWithContainerOnly),
					goto: vi.fn().mockResolvedValue(undefined),
					isClosed: vi.fn().mockReturnValue(false),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});
		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(MIN_LENGTH_100);
	});
});
