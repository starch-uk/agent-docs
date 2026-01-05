/**
 * @file Tests for crawler utility functions.
 * All tests run offline using mocks - no network access required.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-magic-numbers, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-implied-eval */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { JSDOM } from 'jsdom';
import { PlaywrightCrawler } from 'crawlee';
import { crawlSalesforcePage } from '../../src/utils/crawler.js';

// Mock console.warn to avoid noise in tests
vi.spyOn(console, 'warn').mockImplementation(() => {
	// Intentionally empty for test mocking
});

vi.mock('crawlee', () => ({
	// eslint-disable-next-line @typescript-eslint/naming-convention
	PlaywrightCrawler: vi.fn(),
}));

const EVALUATE_CALL_COUNT_FIRST = 1;
const REPEAT_COUNT_20 = 20;
const TIMEOUT_DELAY_0 = 0;

describe('crawlSalesforcePage', () => {
	/**
	 * Helper to create evaluate mock that executes function with jsdom.
	 * @param createDOM - Function that creates a JSDOM instance.
	 * @returns A mock function that executes the provided function with jsdom.
	 */

	const createEvaluateMock = (
		createDOM: Readonly<() => JSDOM>,
	): ReturnType<typeof vi.fn<[() => unknown], Promise<unknown>>> => {
		return vi
			.fn()
			.mockImplementation(
				async (fn: Readonly<() => unknown>): Promise<unknown> => {
					const dom = createDOM();

					const { window } = dom;
					// eslint-disable-next-line @typescript-eslint/no-base-to-string
					const fnString = String(fn);
					const isRetryEvaluate =
						fnString.includes('createTreeWalker') ||
						fnString.includes('textParts');
					try {
						const wrappedFn = new Function(
							'globalThis',
							`const window = arguments[0];
					window.globalThis = window;
					const document = window.document;
					return (${fnString}).call(window);`,
						) as (window: Readonly<typeof dom.window>) => unknown;
						return await wrappedFn(window);
					} catch {
						if (isRetryEvaluate) {
							return 'Documentation content. '.repeat(
								REPEAT_COUNT_20,
							);
						}
						const REPEAT_COUNT_100 = 100;
						return {
							content: 'Documentation content. '.repeat(
								REPEAT_COUNT_100,
							),
							debugInfo: {},
						};
					}
				},
			);
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
			// Fake timers not active, ignore
		}
		vi.useRealTimers();
		// Wait a bit for any remaining promises to settle
		await new Promise((resolve) => setTimeout(resolve, TIMEOUT_DELAY_0));
	});

	it('should have correct function signature', () => {
		expect(typeof crawlSalesforcePage).toBe('function');
	});

	it('should accept URL parameter', () => {
		const SINGLE_PARAM_COUNT = 1;
		expect(crawlSalesforcePage.length).toBe(SINGLE_PARAM_COUNT);
	});

	it('should crawl page and return content', async () => {
		// Content must be at least 100 chars (minimum requirement in code)
		const mockContent =
			'<html><body>' +
			'Test Content '.repeat(REPEAT_COUNT_20) +
			'</body></html>';

		let testHandler: Readonly<
			(context: Readonly<{ page: any }>) => Promise<void>
		> = async () => {
			// Handler will be set by test
		};
		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				$: vi.fn().mockResolvedValue(null),
				$$: vi.fn().mockResolvedValue([]),
				click: vi.fn().mockResolvedValue(undefined),
				content: vi.fn().mockResolvedValue(mockContent),
				evaluate: vi.fn().mockResolvedValue(mockContent),
				goto: vi.fn().mockResolvedValue(undefined),
				isClosed: vi.fn().mockReturnValue(false),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};

			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});
		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler as Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}

				return {
					run: testMockRun,
				} as unknown as PlaywrightCrawler;
			},
		);

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
		expect(PlaywrightCrawler).toHaveBeenCalled();
	});

	it('should handle page navigation errors', async () => {
		/**
		 * When crawler.run() itself throws, it's caught and re-thrown with a message.
		 */

		let testHandler: Readonly<
			(context: Readonly<{ page: any }>) => Promise<void>
		> = async () => {
			// Handler will be set by test
		};
		const testMockRun = vi
			.fn()
			.mockRejectedValue(new Error('Crawler run failed'));

		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler as Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}

				return {
					run: testMockRun,
				} as unknown as PlaywrightCrawler;
			},
		);

		/**
		 * Use a promise that we can properly await and catch.
		 */
		let caughtError: Error | undefined = undefined;
		try {
			await crawlSalesforcePage('https://help.salesforce.com/test');
		} catch (error) {
			caughtError = error as Error;
		}

		// Verify the error was thrown and caught
		expect(caughtError).toBeInstanceOf(Error);
		if (caughtError) {
			expect(caughtError.message).toContain(
				'Failed to crawl Salesforce page',
			);
		}
	});

	it('should handle modal/dialog closing', async () => {
		const MIN_LENGTH_200 = 200;
		const mockContent =
			'<html><body>' + 'x'.repeat(MIN_LENGTH_200) + '</body></html>';
		const mockCloseButton = {
			click: vi.fn().mockResolvedValue(undefined),
		};

		let testHandler: Readonly<
			(context: Readonly<{ page: any }>) => Promise<void>
		> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				$: vi.fn().mockResolvedValue(null),
				$$: vi.fn().mockResolvedValue([mockCloseButton]),
				click: vi.fn().mockResolvedValue(undefined),
				content: vi.fn().mockResolvedValue(mockContent),
				evaluate: vi.fn().mockResolvedValue(mockContent),
				goto: vi.fn().mockResolvedValue(undefined),
				isClosed: vi.fn().mockReturnValue(false),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};

			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});
		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler as Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}

				return {
					run: testMockRun,
				} as unknown as PlaywrightCrawler;
			},
		);

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle content extraction with multiple selectors', async () => {
		const MIN_LENGTH_200 = 200;
		const mockContent =
			'<html><body>' + 'x'.repeat(MIN_LENGTH_200) + '</body></html>';

		let testHandler: Readonly<
			(context: Readonly<{ page: any }>) => Promise<void>
		> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				$: vi.fn().mockResolvedValue(null),
				$$: vi.fn().mockResolvedValue([]),
				click: vi.fn().mockResolvedValue(undefined),
				content: vi.fn().mockResolvedValue(mockContent),
				evaluate: vi.fn().mockResolvedValue(mockContent),
				goto: vi.fn().mockResolvedValue(undefined),
				isClosed: vi.fn().mockReturnValue(false),
				waitForSelector: vi
					.fn()
					.mockRejectedValueOnce(new Error('Not found'))
					.mockResolvedValueOnce(undefined), // Second selector succeeds
			};

			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});
		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler as Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}

				return {
					run: testMockRun,
				} as unknown as PlaywrightCrawler;
			},
		);

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle button query timeout', async () => {
		const MIN_LENGTH_200 = 200;
		const mockContent =
			'<html><body>' + 'x'.repeat(MIN_LENGTH_200) + '</body></html>';

		let testHandler: Readonly<
			(context: Readonly<{ page: any }>) => Promise<void>
		> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				$: vi.fn().mockResolvedValue(null),
				$$: vi
					.fn()
					.mockRejectedValue(new Error('Button query timeout')),
				click: vi.fn().mockResolvedValue(undefined),
				content: vi.fn().mockResolvedValue(mockContent),
				evaluate: vi.fn().mockResolvedValue(mockContent),
				goto: vi.fn().mockResolvedValue(undefined),
				isClosed: vi.fn().mockReturnValue(false),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};

			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});
		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler as Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}

				return {
					run: testMockRun,
				} as unknown as PlaywrightCrawler;
			},
		);

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle scrolling behavior', async () => {
		const MIN_LENGTH_200 = 200;
		const mockContent =
			'<html><body>' + 'x'.repeat(MIN_LENGTH_200) + '</body></html>';

		let testHandler: Readonly<
			(context: Readonly<{ page: any }>) => Promise<void>
		> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				$: vi.fn().mockResolvedValue(null),
				$$: vi.fn().mockResolvedValue([]),
				click: vi.fn().mockResolvedValue(undefined),
				content: vi.fn().mockResolvedValue(mockContent),
				evaluate: vi.fn().mockResolvedValue(mockContent),
				goto: vi.fn().mockResolvedValue(undefined),
				isClosed: vi.fn().mockReturnValue(false),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};

			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});
		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler as Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}

				return {
					run: testMockRun,
				} as unknown as PlaywrightCrawler;
			},
		);

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle evaluate errors gracefully', async () => {
		const MIN_LENGTH_200 = 200;
		const mockContent =
			'<html><body>' + 'x'.repeat(MIN_LENGTH_200) + '</body></html>';
		let evaluateCallCount = 0;

		let testHandler: Readonly<
			(context: Readonly<{ page: any }>) => Promise<void>
		> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				$: vi.fn().mockResolvedValue(null),
				$$: vi.fn().mockResolvedValue([]),
				click: vi.fn().mockResolvedValue(undefined),
				content: vi.fn().mockResolvedValue(mockContent),
				evaluate: vi.fn().mockImplementation(async () => {
					evaluateCallCount++;
					if (evaluateCallCount === EVALUATE_CALL_COUNT_FIRST) {
						return Promise.reject(new Error('Evaluate failed'));
					}
					return Promise.resolve(mockContent);
				}),
				goto: vi.fn().mockResolvedValue(undefined),
				isClosed: vi.fn().mockReturnValue(false),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};

			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});
		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler as Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}

				return {
					run: testMockRun,
				} as unknown as PlaywrightCrawler;
			},
		);

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle content extraction with waitForFunction', async () => {
		const MIN_LENGTH_200 = 200;
		const mockContent =
			'<html><body>' + 'x'.repeat(MIN_LENGTH_200) + '</body></html>';

		let testHandler: Readonly<
			(context: Readonly<{ page: any }>) => Promise<void>
		> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				$: vi.fn().mockResolvedValue(null),
				$$: vi.fn().mockResolvedValue([]),
				click: vi.fn().mockResolvedValue(undefined),
				content: vi.fn().mockResolvedValue(mockContent),
				evaluate: vi.fn().mockResolvedValue(mockContent),
				goto: vi.fn().mockResolvedValue(undefined),
				isClosed: vi.fn().mockReturnValue(false),
				waitForFunction: vi.fn().mockResolvedValue(undefined),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};

			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});
		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler as Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}

				return {
					run: testMockRun,
				} as unknown as PlaywrightCrawler;
			},
		);

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle scrolling through page multiple times', async () => {
		const MIN_LENGTH_200 = 200;
		const mockContent =
			'<html><body>' + 'x'.repeat(MIN_LENGTH_200) + '</body></html>';

		let testHandler: Readonly<
			(context: Readonly<{ page: any }>) => Promise<void>
		> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				$: vi.fn().mockResolvedValue(null),
				$$: vi.fn().mockResolvedValue([]),
				click: vi.fn().mockResolvedValue(undefined),
				content: vi.fn().mockResolvedValue(mockContent),
				evaluate: vi.fn().mockResolvedValue(mockContent),
				goto: vi.fn().mockResolvedValue(undefined),
				isClosed: vi.fn().mockReturnValue(false),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};

			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});
		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler as Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}

				return {
					run: testMockRun,
				} as unknown as PlaywrightCrawler;
			},
		);

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle page.isClosed() during scrolling', async () => {
		const MIN_LENGTH_200 = 200;
		const mockContent =
			'<html><body>' + 'x'.repeat(MIN_LENGTH_200) + '</body></html>';
		let isClosedCallCount = 0;

		let testHandler: Readonly<
			(context: Readonly<{ page: any }>) => Promise<void>
		> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				$: vi.fn().mockResolvedValue(null),
				$$: vi.fn().mockResolvedValue([]),
				click: vi.fn().mockResolvedValue(undefined),
				content: vi.fn().mockResolvedValue(mockContent),
				evaluate: vi.fn().mockResolvedValue(mockContent),
				goto: vi.fn().mockResolvedValue(undefined),
				isClosed: vi.fn().mockImplementation(() => {
					isClosedCallCount++;
					return isClosedCallCount > 5; // Closed after some calls
				}),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};

			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});
		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler as Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}

				return {
					run: testMockRun,
				} as unknown as PlaywrightCrawler;
			},
		);

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle close button click errors', async () => {
		const MIN_LENGTH_200 = 200;
		const mockContent =
			'<html><body>' + 'x'.repeat(MIN_LENGTH_200) + '</body></html>';
		const mockCloseButton = {
			click: vi.fn().mockRejectedValue(new Error('Click failed')),
		};

		let testHandler: Readonly<
			(context: Readonly<{ page: any }>) => Promise<void>
		> = async () => {
			// Handler will be set by test
		};

		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				$: vi.fn().mockResolvedValue(null),
				$$: vi.fn().mockResolvedValue([mockCloseButton]),
				click: vi.fn().mockResolvedValue(undefined),
				content: vi.fn().mockResolvedValue(mockContent),
				evaluate: vi.fn().mockResolvedValue(mockContent),
				goto: vi.fn().mockResolvedValue(undefined),
				isClosed: vi.fn().mockReturnValue(false),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};

			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});
		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler as Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}

				return {
					run: testMockRun,
				} as unknown as PlaywrightCrawler;
			},
		);

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});

	it('should handle modal query timeout', async () => {
		const MIN_LENGTH_200 = 200;
		const mockContent =
			'<html><body>' + 'x'.repeat(MIN_LENGTH_200) + '</body></html>';

		let testHandler: (context: {
			page: any;
		}) => Promise<void> = async () => {
			// Handler will be set by test
		};
		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				$: vi.fn().mockResolvedValue(null),
				$$: vi.fn().mockRejectedValue(new Error('Modal query timeout')),
				click: vi.fn().mockResolvedValue(undefined),
				content: vi.fn().mockResolvedValue(mockContent),
				evaluate: vi.fn().mockResolvedValue(mockContent),
				goto: vi.fn().mockResolvedValue(undefined),
				isClosed: vi.fn().mockReturnValue(false),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};

			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});
		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler as Readonly<
						(context: Readonly<{ page: any }>) => Promise<void>
					>;
				}

				return {
					run: testMockRun,
				} as unknown as PlaywrightCrawler;
			},
		);

		const resultPromise = crawlSalesforcePage(
			'https://help.salesforce.com/test',
		);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toBe(mockContent);
	});
});
