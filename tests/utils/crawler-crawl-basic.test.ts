/**
 * @file Tests for crawler utility functions.
 * All tests run offline using mocks - no network access required.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { PlaywrightCrawler } from 'crawlee';
import { crawlSalesforcePage } from '../../src/utils/crawler.js';

// Mock console.warn to avoid noise in tests
vi.spyOn(console, 'warn').mockImplementation(() => {
	// Intentionally empty for test mocking
});

vi.mock('crawlee', () => ({
	PlaywrightCrawler: vi.fn(),
}));

const MIN_PARAM_COUNT = 1;
const SINGLE_PARAM_COUNT = 1;

describe('crawlSalesforcePage', () => {
	// Helper to create evaluate mock that executes function with jsdom
	const createEvaluateMock = (createDOM: () => JSDOM) => {
		return vi.fn().mockImplementation(async (fn: any) => {
			const dom = createDOM();
			const { window } = dom;
			const fnString = fn.toString();
			const isRetryEvaluate = fnString.includes('createTreeWalker') || fnString.includes('textParts');
			try {
				const wrappedFn = new Function(
					'globalThis',
					`const window = arguments[0];
					window.globalThis = window;
					const document = window.document;
					return (${fnString}).call(window);`
				);
				return await wrappedFn(window);
			} catch {
				if (isRetryEvaluate) {
					return 'Documentation content. '.repeat(200);
				}
				return {
					content: 'Documentation content. '.repeat(100),
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
		} catch (e) {
			// Fake timers not active, ignore
		}
		vi.useRealTimers();
		// Wait a bit for any remaining promises to settle
		await new Promise((resolve) => setTimeout(resolve, 0));
	});

	it('should have correct function signature', () => {
		expect(typeof crawlSalesforcePage).toBe('function');
	});

	it('should accept URL parameter', () => {
		expect(crawlSalesforcePage.length).toBe(SINGLE_PARAM_COUNT);
	});

	it('should crawl page and return content', async () => {
		// Content must be at least 100 chars (minimum requirement in code)
		const mockContent = '<html><body>' + 'Test Content '.repeat(20) + '</body></html>';
		let testHandler: (context: { page: any }) => Promise<void>;
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
		expect(PlaywrightCrawler).toHaveBeenCalled();
	});

	it('should handle page navigation errors', async () => {
		// When crawler.run() itself throws, it's caught and re-thrown with a message
		let testHandler: (context: { page: any }) => Promise<void>;
		const testMockRun = vi.fn().mockRejectedValue(new Error('Crawler run failed'));

		vi.mocked(PlaywrightCrawler).mockImplementation((config) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as unknown as PlaywrightCrawler;
		});

		// Use a promise that we can properly await and catch
		let caughtError: Error | undefined;
		try {
			await crawlSalesforcePage('https://help.salesforce.com/test');
		} catch (error) {
			caughtError = error as Error;
		}
		
		// Verify the error was thrown and caught
		expect(caughtError).toBeInstanceOf(Error);
		if (caughtError) {
			expect(caughtError.message).toContain('Failed to crawl Salesforce page');
		}
	});

	it('should handle cookie banner clicks', async () => {
		// Content must be at least 100 chars
		const mockContent = '<html><body>' + 'Content '.repeat(20) + '</body></html>';
		let testHandler: (context: { page: any }) => Promise<void>;

		const testMockRun = vi.fn().mockImplementation(async () => {

			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn()
						.mockResolvedValueOnce({}) // Cookie banner found
						.mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
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

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
		expect(PlaywrightCrawler).toHaveBeenCalled();
	});

	it('should handle cookie banner with accept button found via $', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';
		const mockAcceptButton = {
			click: vi.fn().mockResolvedValue(undefined),
		};

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
					isClosed: vi.fn().mockReturnValue(false),
					$: vi.fn().mockResolvedValue(mockAcceptButton),
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
		expect(mockAcceptButton.click).toHaveBeenCalled();
	});

	it('should handle cookie banner with button text search', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';
		const mockButton = {
			isVisible: vi.fn().mockResolvedValue(true),
			textContent: vi.fn().mockResolvedValue('Accept All Cookies'),
			click: vi.fn().mockResolvedValue(undefined),
		};

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
					isClosed: vi.fn().mockReturnValue(false),
					$: vi.fn().mockResolvedValue(null), // No selector match
					$$: vi.fn().mockResolvedValue([mockButton]), // But button found via $$
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
		expect(mockButton.click).toHaveBeenCalled();
	});

	it('should handle page.isClosed() during cookie handling', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
					isClosed: vi.fn().mockReturnValue(true), // Page closed
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle modal/dialog closing', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';
		const mockCloseButton = {
			click: vi.fn().mockResolvedValue(undefined),
		};

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
					isClosed: vi.fn().mockReturnValue(false),
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([mockCloseButton]),
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle content extraction with multiple selectors', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn()
						.mockRejectedValueOnce(new Error('Not found'))
						.mockResolvedValueOnce(undefined), // Second selector succeeds
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});


	it('should handle cookie button click timeout', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';
		const mockAcceptButton = {
			click: vi.fn().mockRejectedValue(new Error('Click timeout')),
		};

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
					isClosed: vi.fn().mockReturnValue(false),
					$: vi.fn().mockResolvedValue(mockAcceptButton),
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle button query timeout', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
					isClosed: vi.fn().mockReturnValue(false),
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockRejectedValue(new Error('Button query timeout')),
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle scrolling behavior', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle evaluate errors gracefully', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';
		let evaluateCallCount = 0;

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockImplementation(() => {
						evaluateCallCount++;
						if (evaluateCallCount === 1) {
							return Promise.reject(new Error('Evaluate failed'));
						}
						return Promise.resolve(mockContent);
					}),
					content: vi.fn().mockResolvedValue(mockContent),
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle content extraction with waitForFunction', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
					isClosed: vi.fn().mockReturnValue(false),
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([]),
					waitForFunction: vi.fn().mockResolvedValue(undefined),
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle scrolling through page multiple times', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle page.isClosed() during scrolling', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';
		let isClosedCallCount = 0;

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
					isClosed: vi.fn().mockImplementation(() => {
						isClosedCallCount++;
						return isClosedCallCount > 5; // Closed after some calls
					}),
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle button visibility check returning false', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';
		const mockButton = {
			isVisible: vi.fn().mockResolvedValue(false), // Not visible - should skip
			textContent: vi.fn().mockResolvedValue('Accept All'),
			click: vi.fn().mockResolvedValue(undefined),
		};

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
					isClosed: vi.fn().mockReturnValue(false),
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([mockButton]),
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
		// Button visibility check path is covered - isVisible returns false triggers continue
		expect(mockButton.isVisible).toHaveBeenCalled();
	});

	it('should handle button textContent returning null', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';
		const mockButton = {
			isVisible: vi.fn().mockResolvedValue(true),
			textContent: vi.fn().mockResolvedValue(null), // No text - should skip
			click: vi.fn().mockResolvedValue(undefined),
		};

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
					isClosed: vi.fn().mockReturnValue(false),
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([mockButton]),
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
		// Button textContent null path is covered - null text triggers continue
		expect(mockButton.textContent).toHaveBeenCalled();
	});

	it('should handle close button click errors', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';
		const mockCloseButton = {
			click: vi.fn().mockRejectedValue(new Error('Click failed')),
		};

		let testHandler: (context: { page: any }) => Promise<void>;


		const testMockRun = vi.fn().mockImplementation(async () => {



			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
					isClosed: vi.fn().mockReturnValue(false),
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockResolvedValue([mockCloseButton]),
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
		

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle modal query timeout', async () => {
		const mockContent = '<html><body>' + 'x'.repeat(200) + '</body></html>';

		let testHandler: (context: { page: any }) => Promise<void>;
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					goto: vi.fn().mockResolvedValue(undefined),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					click: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockContent),
					content: vi.fn().mockResolvedValue(mockContent),
					isClosed: vi.fn().mockReturnValue(false),
					$: vi.fn().mockResolvedValue(null),
					$$: vi.fn().mockRejectedValue(new Error('Modal query timeout')),
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

		const resultPromise = crawlSalesforcePage('https://help.salesforce.com/test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});
});
