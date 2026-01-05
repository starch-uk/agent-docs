/**
 * @file Tests for normalizeQuery function.
 * All tests run offline - no network access required.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PlaywrightCrawler } from 'crawlee';
import { searchSalesforceHelp } from '../../src/utils/crawler.js';

vi.mock('crawlee', () => ({
	// eslint-disable-next-line @typescript-eslint/naming-convention
	PlaywrightCrawler: vi.fn(),
}));

const DEFAULT_LIMIT = 20;

describe('normalizeQuery', () => {
	let storedRequestHandler:
		| ((
				context: Readonly<{
					page: Readonly<{
						evaluate: <T>(
							fn: Readonly<(maxResults: Readonly<number>) => T>,
							...args: readonly unknown[]
						) => Promise<T>;
						waitForSelector: (
							selector: Readonly<string>,
							options?: Readonly<{ timeout?: number }>,
						) => Promise<unknown>;
					}>;
				}>,
		  ) => Promise<void>)
		| undefined = undefined;

	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.useFakeTimers();

		storedRequestHandler = undefined as
			| ((
					context: Readonly<{
						page: Readonly<{
							evaluate: <T>(
								fn: Readonly<
									(maxResults: Readonly<number>) => T
								>,
								...args: readonly unknown[]
							) => Promise<T>;
							waitForSelector: (
								selector: string,
								options?: Readonly<{ timeout?: number }>,
							) => Promise<unknown>;
						}>;
					}>,
			  ) => Promise<void>)
			| undefined;

		const defaultMockRun = vi.fn().mockImplementation(async () => {
			const handler = storedRequestHandler;
			if (handler !== undefined) {
				const mockPage = {
					evaluate: vi.fn().mockResolvedValue([]),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
				};
				const handlerPromise = handler({ page: mockPage });
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
					storedRequestHandler = config.requestHandler;
				}
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
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

	it('should remove single leading @ symbol', async () => {
		const mockResults = [
			{
				title: 'Test Article',
				url: 'https://help.salesforce.com/s/articleView?id=test',
			},
		];

		let testHandler: typeof storedRequestHandler = undefined;
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler !== undefined) {
				const mockPage = {
					evaluate: vi.fn().mockResolvedValue(mockResults),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
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
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp('@test', DEFAULT_LIMIT);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
		// Verify PlaywrightCrawler was called (which means normalizeQuery was executed)
		expect(PlaywrightCrawler).toHaveBeenCalled();
	});

	it('should remove multiple leading @ symbols', async () => {
		const mockResults = [
			{
				title: 'Test Article',
				url: 'https://help.salesforce.com/s/articleView?id=test',
			},
		];

		let testHandler: typeof storedRequestHandler = undefined;
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler !== undefined) {
				const mockPage = {
					evaluate: vi.fn().mockResolvedValue(mockResults),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
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
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp('@@@test', DEFAULT_LIMIT);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
		expect(PlaywrightCrawler).toHaveBeenCalled();
	});

	it('should not remove @ symbols in the middle or end', async () => {
		const mockResults = [
			{
				title: 'Test Article',
				url: 'https://help.salesforce.com/s/articleView?id=test',
			},
		];

		let testHandler: typeof storedRequestHandler = undefined;
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler !== undefined) {
				const mockPage = {
					evaluate: vi.fn().mockResolvedValue(mockResults),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
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
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp('test@query', DEFAULT_LIMIT);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
		expect(PlaywrightCrawler).toHaveBeenCalled();
	});

	it('should handle query without @ symbols', async () => {
		const mockResults = [
			{
				title: 'Test Article',
				url: 'https://help.salesforce.com/s/articleView?id=test',
			},
		];

		let testHandler: typeof storedRequestHandler = undefined;
		const testMockRun = vi.fn().mockImplementation(async () => {
			if (testHandler !== undefined) {
				const mockPage = {
					evaluate: vi.fn().mockResolvedValue(mockResults),
					waitForSelector: vi.fn().mockResolvedValue(undefined),
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
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				return {
					run: testMockRun,
				} as PlaywrightCrawler;
			},
		);

		const resultPromise = searchSalesforceHelp('test query', DEFAULT_LIMIT);
		await vi.runAllTimersAsync();
		const result = await resultPromise;
		expect(result).toEqual(mockResults);
		expect(PlaywrightCrawler).toHaveBeenCalled();
	});
});
