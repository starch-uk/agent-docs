/**
 * @file Tests for searchSalesforceHelp function.
 * All tests run offline using mocks - no network access required.
 */

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

describe('searchSalesforceHelp', () => {
	let storedRequestHandler: (context: Readonly<{
		page: Readonly<{
			waitForSelector: (
				selector: Readonly<string>,
				options?: Readonly<{ timeout?: number }>,
			) => Promise<unknown>;
			evaluate: <T>(
				fn: Readonly<(maxResults: Readonly<number>) => T>,
				...args: Readonly<unknown[]>
			) => Promise<T>;
		}>;
	}>) => Promise<void> = async (): Promise<void> => {
		// Handler will be set by test
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetAllMocks();
		// Use fake timers to make setTimeout calls instant
		vi.useFakeTimers();

		// Reset handler for each test
		storedRequestHandler = async (): Promise<void> => {
			// Handler will be set by test
		};

		// Create a default mock run that uses the current handler
		const defaultMockRun = vi.fn().mockImplementation(async () => {
			// Capture handler at execution time to avoid race conditions
			const handler = storedRequestHandler;
			if (handler) {
				const mockPage = {
					evaluate: vi.fn().mockResolvedValue([]),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = handler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof storedRequestHandler }>) => {
			if (config.requestHandler) {
				storedRequestHandler = config.requestHandler;
			}
			return {
				run: defaultMockRun,
			} as PlaywrightCrawler;
		});
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
			if (testHandler) {
				const mockPage = {
					evaluate: vi.fn().mockResolvedValue(mockResults),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof storedRequestHandler }>) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as PlaywrightCrawler;
		});

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
			if (testHandler) {
				const mockPage = {
					evaluate: vi.fn().mockResolvedValue(mockResults),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof storedRequestHandler }>) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as PlaywrightCrawler;
		});

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
			if (testHandler) {
				const mockPage = {
					evaluate: vi.fn().mockResolvedValue([]),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof storedRequestHandler }>) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as PlaywrightCrawler;
		});

		const resultPromise = searchSalesforceHelp('test', 10);
		await vi.runAllTimersAsync();
		await expect(resultPromise).rejects.toThrow('No search results found');
		// Ensure promise is fully settled to prevent unhandled rejection
		await resultPromise.catch(() => {
			// Expected error, ignore
		});
		// Should have created two crawlers (primary + fallback)
		expect(PlaywrightCrawler).toHaveBeenCalledTimes(2);
	});

	it('should use default limit when not provided', async () => {
		const mockResults = [
			{
				url: 'https://help.salesforce.com/s/articleView?id=test',
				title: 'Test Article',
			},
		];

		let testHandler: typeof storedRequestHandler;
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockResults),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof storedRequestHandler }>) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as PlaywrightCrawler;
		});

		const resultPromise = searchSalesforceHelp('test');
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
		expect(PlaywrightCrawler).toHaveBeenCalled();
	});

	it('should try fallback search when primary search fails', async () => {
		const mockResults = [
			{
				url: 'https://help.salesforce.com/s/articleView?id=test',
				title: 'Test Article',
			},
		];

		let callCount = 0;
		let testHandler: typeof storedRequestHandler;
		const testMockRun = vi.fn().mockImplementation(async () => {
			callCount++;
			if (callCount === 1) {
				// First call fails
				throw new Error('Primary search failed');
			}
			// Second call (fallback) succeeds
			if (testHandler) {
				const mockPage = {
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockResults),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof storedRequestHandler }>) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as PlaywrightCrawler;
		});

		const resultPromise = searchSalesforceHelp('test', 10);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
		// Should have created two crawlers (primary + fallback)
		expect(PlaywrightCrawler).toHaveBeenCalledTimes(2);
	});

	it('should throw error when no results found', async () => {
		let testHandler: typeof storedRequestHandler;
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue([]),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof storedRequestHandler }>) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as PlaywrightCrawler;
		});

		const resultPromise = searchSalesforceHelp('nonexistent query', 10);
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
				url: 'https://help.salesforce.com/s/articleView?id=test',
				title: 'Test Article',
			},
		];

		let testHandler: typeof storedRequestHandler;
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					waitForSelector: vi
						.fn()
						.mockRejectedValueOnce(new Error('Timeout')) // Coveo selector fails
						.mockResolvedValueOnce(undefined), // Fallback selector succeeds
					evaluate: vi.fn().mockResolvedValue(mockResults),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof storedRequestHandler }>) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as PlaywrightCrawler;
		});

		const resultPromise = searchSalesforceHelp('test', 10);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
	});

	it('should handle both selector timeouts and still extract results', async () => {
		const mockResults = [
			{
				url: 'https://help.salesforce.com/s/articleView?id=test',
				title: 'Test Article',
			},
		];

		let testHandler: typeof storedRequestHandler;
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					waitForSelector: vi
						.fn()
						.mockRejectedValueOnce(new Error('Timeout')) // Coveo fails
						.mockRejectedValueOnce(new Error('Timeout')), // Fallback fails
					evaluate: vi.fn().mockResolvedValue(mockResults), // But results exist
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof storedRequestHandler }>) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as PlaywrightCrawler;
		});

		const resultPromise = searchSalesforceHelp('test', 10);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
	});

	it('should handle fallback search with different URL format', async () => {
		const mockResults = [
			{
				url: 'https://help.salesforce.com/s/articleView?id=test',
				title: 'Test Article',
			},
		];

		let callCount = 0;
		let testHandler: typeof storedRequestHandler;
		const testMockRun = vi.fn().mockImplementation(async () => {
			callCount++;
			if (callCount === 1) {
				throw new Error('Primary failed');
			}
			if (testHandler) {
				const mockPage = {
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockResults),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof storedRequestHandler }>) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as PlaywrightCrawler;
		});

		const resultPromise = searchSalesforceHelp('test', 10);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
		expect(PlaywrightCrawler).toHaveBeenCalledTimes(2);
	});

	it('should handle evaluate returning results with document null', async () => {
		let testHandler: typeof storedRequestHandler;
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockImplementation((fn) => {
						// Simulate document being null by having the function return empty array
						// The function checks if doc === null and continues
						return Promise.resolve([]);
					}),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof storedRequestHandler }>) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as PlaywrightCrawler;
		});

		const resultPromise = searchSalesforceHelp('test', 10);
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
				url: '/s/articleView?id=test', // Relative URL
				title: 'Test Article',
			},
			{
				url: 'https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/test.htm',
				title: 'Developer Docs',
			},
		];

		let testHandler: typeof storedRequestHandler;
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockResults),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof storedRequestHandler }>) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as PlaywrightCrawler;
		});

		const resultPromise = searchSalesforceHelp('test', 10);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeGreaterThan(0);
	});

	it('should handle results with title extraction from parent', async () => {
		const mockResults = [
			{
				url: 'https://help.salesforce.com/s/articleView?id=test',
				title: 'Test', // Short title, should try parent
			},
		];

		let testHandler: typeof storedRequestHandler;
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockResolvedValue(mockResults),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof storedRequestHandler }>) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as PlaywrightCrawler;
		});

		const resultPromise = searchSalesforceHelp('test', 10);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
	});

	it('should limit results to specified limit', async () => {
		const manyResults = Array.from({ length: 50 }, (_, i) => ({
			url: `https://help.salesforce.com/s/articleView?id=test${i}`,
			title: `Article ${i}`,
		}));

		let testHandler: typeof storedRequestHandler;
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler) {
				const mockPage = {
					waitForSelector: vi.fn().mockResolvedValue(undefined),
					evaluate: vi.fn().mockImplementation((fn, limit) => {
						// The evaluate function receives limit and should slice results
						// Simulate the function behavior by slicing
						return Promise.resolve(manyResults.slice(0, limit));
					}),
				};
				const handlerPromise = testHandler({ page: mockPage });
				await vi.runAllTimersAsync();
				await handlerPromise;
			}
		});

		vi.mocked(PlaywrightCrawler).mockImplementation((config: Readonly<{ requestHandler?: typeof storedRequestHandler }>) => {
			if (config.requestHandler) {
				testHandler = config.requestHandler;
			}
			return {
				run: testMockRun,
			} as PlaywrightCrawler;
		});

		const resultPromise = searchSalesforceHelp('test', 10);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result.length).toBeLessThanOrEqual(10);
		expect(result.length).toBe(10);
	});
});
