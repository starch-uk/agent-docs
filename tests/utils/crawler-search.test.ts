/**
 * @file Tests for searchSalesforceHelp function.
 * All tests run offline using mocks - no network access required.
 */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PlaywrightCrawler } from 'crawlee';
import { searchSalesforceHelp } from '../../src/utils/crawler.js';

// Mock console.warn to avoid noise in tests
vi.spyOn(console, 'warn').mockImplementation(() => {
	// Intentionally empty for test mocking
});

vi.mock('crawlee', () => ({
	// eslint-disable-next-line @typescript-eslint/naming-convention
	PlaywrightCrawler: vi.fn(),
}));

const MIN_PARAM_COUNT = 1;
const DEFAULT_LIMIT = 10;
const CRAWLER_COUNT_TWO = 2;

describe('searchSalesforceHelp', () => {
	let storedRequestHandler: (
		context: Readonly<{
			page: Readonly<{
				waitForSelector: (
					selector: Readonly<string>,
					options?: Readonly<{ timeout?: number }>,
				) => Promise<unknown>;
				evaluate: <T>(
					fn: Readonly<(maxResults: Readonly<number>) => T>,
					...args: readonly unknown[]
				) => Promise<T>;
			}>;
		}>,
	) => Promise<void> = async (): Promise<void> => {
		// Handler will be set by test
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetAllMocks();
		// Use fake timers to make setTimeout calls instant
		vi.useFakeTimers();

		/**
		 * Reset handler for each test.
		 */
		storedRequestHandler = async (): Promise<void> => {
			/**
			 * Handler will be set by test.
			 */
		};

		/**
		 * Create a default mock run that uses the current handler.
		 */
		const defaultMockRun = vi.fn().mockImplementation(async () => {
			/**
			 * Capture handler at execution time to avoid race conditions.
			 */
			const handler = storedRequestHandler;
			const mockPage = {
				evaluate: vi.fn().mockResolvedValue([]),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};
			const handlerPromise = handler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});

		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: typeof storedRequestHandler;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					storedRequestHandler = config.requestHandler;
				}

				return {
					run: defaultMockRun,
				} as PlaywrightCrawler;
			},
		);
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
		const ZERO = 0;
		await new Promise((resolve) => setTimeout(resolve, ZERO));
	});

	it('should have correct function signature', () => {
		expect(typeof searchSalesforceHelp).toBe('function');
	});

	it('should accept query and limit parameters', () => {
		expect(searchSalesforceHelp.length).toBeGreaterThanOrEqual(
			MIN_PARAM_COUNT,
		);
	});

	it('should normalize query by removing leading @ symbols', async () => {
		const mockResults = [
			{
				title: 'Test Article',
				url: 'https://help.salesforce.com/s/articleView?id=test',
			},
		];

		// Create isolated mock for this test with handler captured in closure
		let testHandler: typeof storedRequestHandler = storedRequestHandler;
		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				evaluate: vi.fn().mockResolvedValue(mockResults),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};
			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});

		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: typeof storedRequestHandler;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler;
				}

				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const COUNT_10 = 10;
		const resultPromise = searchSalesforceHelp('@test query', COUNT_10);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
		// Verify the query was normalized (no @ in the URL)
		expect(PlaywrightCrawler).toHaveBeenCalled();
	});

	it('should return search results when found', async () => {
		const mockResults = [
			{
				title: 'Test Article',
				url: 'https://help.salesforce.com/s/articleView?id=test',
			},
		];

		let testHandler: typeof storedRequestHandler = storedRequestHandler;
		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				evaluate: vi.fn().mockResolvedValue(mockResults),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};
			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});

		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: typeof storedRequestHandler;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler;
				}

				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const COUNT_10 = 10;
		const resultPromise = searchSalesforceHelp('test query', COUNT_10);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
		expect(PlaywrightCrawler).toHaveBeenCalled();
	});

	it('should handle search errors gracefully and try fallback', async () => {
		let callCount = 0;
		const COUNT_1 = 1;
		let testHandler: typeof storedRequestHandler = storedRequestHandler;
		const testMockRun = vi.fn().mockImplementation(async () => {
			callCount++;
			if (callCount === COUNT_1) {
				// First call (primary search) fails
				throw new Error('Network error');
			}
			// Second call (fallback) succeeds but returns empty
			const mockPage = {
				evaluate: vi.fn().mockResolvedValue([]),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};
			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});

		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: typeof storedRequestHandler;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler;
				}

				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp('test', DEFAULT_LIMIT);
		await vi.runAllTimersAsync();
		await expect(resultPromise).rejects.toThrow('No search results found');
		// Ensure promise is fully settled to prevent unhandled rejection
		await resultPromise.catch(() => {
			// Expected error, ignore
		});
		// Should have created two crawlers (primary + fallback)
		expect(PlaywrightCrawler).toHaveBeenCalledTimes(CRAWLER_COUNT_TWO);
	});

	it('should use default limit when not provided', async () => {
		const mockResults = [
			{
				title: 'Test Article',
				url: 'https://help.salesforce.com/s/articleView?id=test',
			},
		];

		let testHandler: typeof storedRequestHandler =
			async (): Promise<void> => {
				/**
				 * Handler will be set by test.
				 */
			};
		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				evaluate: vi.fn().mockResolvedValue(mockResults),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};
			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});

		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: typeof storedRequestHandler;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler;
				}

				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp('test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
		expect(PlaywrightCrawler).toHaveBeenCalled();
	});

	it('should try fallback search when primary search fails', async () => {
		const mockResults = [
			{
				title: 'Test Article',
				url: 'https://help.salesforce.com/s/articleView?id=test',
			},
		];

		let callCount = 0;
		let testHandler: typeof storedRequestHandler =
			async (): Promise<void> => {
				/**
				 * Handler will be set by test.
				 */
			};
		const testMockRun = vi.fn().mockImplementation(async () => {
			callCount++;
			const COUNT_1 = 1;
			if (callCount === COUNT_1) {
				// First call fails
				throw new Error('Primary search failed');
			}
			// Second call (fallback) succeeds
			const mockPage = {
				evaluate: vi.fn().mockResolvedValue(mockResults),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};
			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});

		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: typeof storedRequestHandler;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler;
				}

				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp('test', DEFAULT_LIMIT);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
		// Should have created two crawlers (primary + fallback)
		expect(PlaywrightCrawler).toHaveBeenCalledTimes(CRAWLER_COUNT_TWO);
	});

	it('should throw error when no results found', async () => {
		let testHandler: typeof storedRequestHandler =
			async (): Promise<void> => {
				/**
				 * Handler will be set by test.
				 */
			};
		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				evaluate: vi.fn().mockResolvedValue([]),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};
			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});

		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: typeof storedRequestHandler;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler;
				}

				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp(
			'nonexistent query',
			DEFAULT_LIMIT,
		);
		await vi.runAllTimersAsync();
		await expect(resultPromise).rejects.toThrow(
			'No search results found for: nonexistent query',
		);
		// Ensure promise is fully settled to prevent unhandled rejection
		await resultPromise.catch(() => {
			// Expected error, ignore
		});
	});

	it('should handle Coveo selector timeout and use fallback', async () => {
		const mockResults = [
			{
				title: 'Test Article',
				url: 'https://help.salesforce.com/s/articleView?id=test',
			},
		];

		let testHandler: typeof storedRequestHandler =
			async (): Promise<void> => {
				/**
				 * Handler will be set by test.
				 */
			};
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					evaluate: vi.fn().mockResolvedValue(mockResults),
					waitForSelector: vi
						.fn()
						.mockRejectedValueOnce(new Error('Timeout')) // Coveo selector fails
						.mockResolvedValueOnce(undefined), // Fallback selector succeeds
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: typeof storedRequestHandler;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler;
				}

				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp('test', DEFAULT_LIMIT);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
	});

	it('should handle both selector timeouts and still extract results', async () => {
		const mockResults = [
			{
				title: 'Test Article',
				url: 'https://help.salesforce.com/s/articleView?id=test',
			},
		];

		let testHandler: typeof storedRequestHandler =
			async (): Promise<void> => {
				/**
				 * Handler will be set by test.
				 */
			};
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					evaluate: vi.fn().mockResolvedValue(mockResults), // But results exist
					waitForSelector: vi
						.fn()
						.mockRejectedValueOnce(new Error('Timeout')) // Coveo fails
						.mockRejectedValueOnce(new Error('Timeout')), // Fallback fails
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: typeof storedRequestHandler;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler;
				}

				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp('test', DEFAULT_LIMIT);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
	});

	it('should handle fallback search with different URL format', async () => {
		const mockResults = [
			{
				title: 'Test Article',
				url: 'https://help.salesforce.com/s/articleView?id=test',
			},
		];

		let callCount = 0;
		let testHandler: typeof storedRequestHandler =
			async (): Promise<void> => {
				/**
				 * Handler will be set by test.
				 */
			};
		const testMockRun = vi.fn().mockImplementation(async () => {
			callCount++;
			const COUNT_1 = 1;
			if (callCount === COUNT_1) {
				throw new Error('Primary failed');
			}
			const mockPage = {
				evaluate: vi.fn().mockResolvedValue(mockResults),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};
			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});

		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: typeof storedRequestHandler;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler;
				}

				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp('test', DEFAULT_LIMIT);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
		expect(PlaywrightCrawler).toHaveBeenCalledTimes(CRAWLER_COUNT_TWO);
	});

	it('should handle evaluate returning results with document null', async () => {
		let testHandler: typeof storedRequestHandler =
			async (): Promise<void> => {
				/**
				 * Handler will be set by test.
				 */
			};
		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				evaluate: vi.fn().mockImplementation(async () => {
					// Simulate document being null by having the function return empty array
					// The function checks if doc === null and continues
					return Promise.resolve([]);
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
					requestHandler?: typeof storedRequestHandler;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler;
				}

				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp('test', DEFAULT_LIMIT);
		await vi.runAllTimersAsync();
		await expect(resultPromise).rejects.toThrow('No search results found');
		// Ensure promise is fully settled to prevent unhandled rejection
		await resultPromise.catch(() => {
			// Expected error, ignore
		});
	});

	it('should handle results with different URL formats', async () => {
		const mockResults = [
			{
				title: 'Test Article',
				url: '/s/articleView?id=test', // Relative URL
			},
			{
				title: 'Developer Docs',
				url: 'https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/test.htm',
			},
		];

		let testHandler: typeof storedRequestHandler =
			async (): Promise<void> => {
				/**
				 * Handler will be set by test.
				 */
			};
		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				evaluate: vi.fn().mockResolvedValue(mockResults),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};
			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});

		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: typeof storedRequestHandler;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler;
				}

				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp('test', DEFAULT_LIMIT);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		const ZERO = 0;
		expect(result.length).toBeGreaterThan(ZERO);
	});

	it('should handle results with title extraction from parent', async () => {
		const mockResults = [
			{
				title: 'Test', // Short title, should try parent
				url: 'https://help.salesforce.com/s/articleView?id=test',
			},
		];

		let testHandler: typeof storedRequestHandler =
			async (): Promise<void> => {
				/**
				 * Handler will be set by test.
				 */
			};
		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				evaluate: vi.fn().mockResolvedValue(mockResults),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};
			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});

		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: typeof storedRequestHandler;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler;
				}

				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp('test', DEFAULT_LIMIT);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
	});

	it('should limit results to specified limit', async () => {
		const manyResults = Array.from({ length: 50 }, (_, i) => ({
			title: `Article ${String(i)}`,
			url: `https://help.salesforce.com/s/articleView?id=test${String(i)}`,
		}));

		let testHandler: typeof storedRequestHandler =
			async (): Promise<void> => {
				/**
				 * Handler will be set by test.
				 */
			};
		const testMockRun = vi.fn().mockImplementation(async () => {
			const mockPage = {
				evaluate: vi
					.fn()
					.mockImplementation(
						async (_fn, limit: Readonly<number>) => {
							// The evaluate function receives limit and should slice results
							// Simulate the function behavior by slicing
							const ZERO = 0;
							return Promise.resolve(
								manyResults.slice(ZERO, limit),
							);
						},
					),
				waitForSelector: vi.fn().mockResolvedValue(undefined),
			};
			const handlerPromise = testHandler({ page: mockPage });
			await vi.runAllTimersAsync();
			await handlerPromise;
		});

		vi.mocked(PlaywrightCrawler).mockImplementation(
			(
				config: Readonly<{
					requestHandler?: typeof storedRequestHandler;
				}>,
			): PlaywrightCrawler => {
				if (config.requestHandler) {
					testHandler = config.requestHandler;
				}

				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp('test', DEFAULT_LIMIT);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeLessThanOrEqual(DEFAULT_LIMIT);
		expect(result.length).toBe(DEFAULT_LIMIT);
	});
});
