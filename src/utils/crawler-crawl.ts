/**
 * @file Crawl utilities for Salesforce Help pages.
 */

/* v8 ignore file -- Browser-side code in page.evaluate() cannot be unit tested in Node.js */

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- DOM API types and Playwright types cannot be made readonly */
/* eslint-disable @typescript-eslint/no-unnecessary-condition -- Runtime checks needed for DOM API nullability */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Magic numbers are used for timeouts, lengths, and DOM operations */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- page.evaluate returns any type from browser context */

import { PlaywrightCrawler } from 'crawlee';
import {
	setupPage,
	type Page,
	type TimeoutConstants,
} from './crawler-page-setup.ts';
import { extractContentInBrowser } from './crawler-content-extraction.ts';
import {
	extractFallbackContent,
	extractRetryContent,
} from './crawler-fallback-extraction.ts';

/**
 * Get the stringified version of a function for injection into page.evaluate().
 * @param fn - Function to stringify.
 * @returns String representation of the function.
 */
function getFunctionString(fn: () => unknown): string {
	return `(${fn.toString()})()`;
}

/**
 * Crawl a Salesforce Help page using Playwright to handle JavaScript-rendered content.
 * @param url - Salesforce Help page URL.
 * @returns Page content.
 * @throws {Error} When page crawl fails or times out.
 */
async function crawlSalesforcePage(url: Readonly<string>): Promise<string> {
	let content = '';

	// Timeout constants
	const navigationTimeoutMs = 60000;
	const pageInitWaitMs = 2000;
	const buttonClickWaitMs = 1000;
	const scrollWaitMs = 2000;
	const scrollBackWaitMs = 1500;
	const contentWaitMs = 3000;
	const finalWaitMs = 5000;
	const longWaitMs = 10000;
	const clickTimeoutMs = 5000;
	const closeButtonTimeoutMs = 4000;
	const buttonClickTimeoutMs = 3000;
	const scrollCount = 5;
	const scrollDivisor = 5;

	const timeouts: TimeoutConstants = {
		buttonClickTimeoutMs,
		buttonClickWaitMs,
		clickTimeoutMs,
		closeButtonTimeoutMs,
		contentWaitMs,
		finalWaitMs,
		longWaitMs,
		navigationTimeoutMs,
		pageInitWaitMs,
		scrollBackWaitMs,
		scrollCount,
		scrollDivisor,
		scrollWaitMs,
	};

	const crawler = new PlaywrightCrawler({
		headless: true,
		navigationTimeoutSecs: 60,

		async requestHandler({
			page,
		}: Readonly<{
			page: Page;
		}>): Promise<void> {
			// Setup page: navigate and wait for content
			await setupPage(page, url, timeouts);

			// Extract content using page.evaluate
			// Wrap page.evaluate with timeout to prevent hanging
			try {
				if (page.isClosed()) {
					throw new Error('Page is closed');
				}
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- page.evaluate returns any due to overloaded signatures
				const evalResult = await Promise.race([
					page.evaluate(getFunctionString(extractContentInBrowser)),
					new Promise<{ content: string; debugInfo: unknown }>(
						(_, reject) => {
							const evaluateTimeoutMs = 30000;
							setTimeout(() => {
								reject(new Error('page.evaluate timeout'));
							}, evaluateTimeoutMs);
						},
					),
				]);

				// Extract content and debug info from result
				if (
					evalResult !== null &&
					evalResult !== undefined &&
					typeof evalResult === 'object' &&
					'content' in evalResult
				) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- evalResult is any from page.evaluate, content can be null/undefined
					content = evalResult.content ?? '';
				} else {
					// Fallback: treat as string (old format for compatibility)
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- evalResult is any from page.evaluate
					content = (evalResult as string) ?? '';
				}
			} catch {
				content = '';
			}

			// If content is empty or too short, try fallback extraction
			const minContentLength = 100;

			if (
				content === null ||
				content === undefined ||
				content === '' ||
				content.length < minContentLength
			) {
				if (!page.isClosed()) {
					try {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- page.evaluate returns any due to overloaded signatures
						const fallbackContent = await Promise.race([
							page.evaluate(
								getFunctionString(extractFallbackContent),
							),
							new Promise<string>((_, reject) => {
								const fallbackTimeoutMs = 10000;
								setTimeout(() => {
									reject(
										new Error('fallback evaluate timeout'),
									);
								}, fallbackTimeoutMs);
							}),
						]).catch(() => '');

						// Use fallback if it has more content
						if (
							fallbackContent !== null &&
							fallbackContent !== undefined &&
							fallbackContent !== '' &&
							fallbackContent.length > (content?.length ?? 0)
						) {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- fallbackContent is any from page.evaluate
							content = fallbackContent;
						}
					} catch {
						// Ignore fallback errors
					}
				}
			}

			// Debug: Log content length for troubleshooting
			const minContentLengthForRetry = 50;

			if (
				content === null ||
				content === undefined ||
				content === '' ||
				content.length < minContentLengthForRetry
			) {
				// Try one more time with a longer wait and different approach
				await new Promise((resolve) =>
					setTimeout(resolve, finalWaitMs),
				);

				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- page.evaluate returns any due to overloaded signatures
				const retryContent = await page
					.evaluate(getFunctionString(extractRetryContent))
					.catch(() => '');

				const minRetryContentLength = 200;

				if (
					retryContent !== null &&
					retryContent !== undefined &&
					retryContent !== '' &&
					retryContent.length >= minRetryContentLength
				) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- retryContent is any from page.evaluate
					content = retryContent;
				} else {
					const minContentLengthForError = 50;

					if (
						content === null ||
						content === undefined ||
						content === '' ||
						content.length < minContentLengthForError
					) {
						const contentLength = content?.length ?? 0;
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- retryContent is any from page.evaluate, can be null, 0 is default
						const retryLength = retryContent?.length ?? 0;
						const contentLengthStr = String(contentLength);
						const retryLengthStr = String(retryLength);
						throw new Error(
							`Insufficient content extracted from ${url} (got ${contentLengthStr} chars, retry got ${retryLengthStr} chars)`,
						);
					}
				}
			}
		},
		requestHandlerTimeoutSecs: 120,
	});

	try {
		await crawler.run([url]);
		return content;
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		throw new Error(
			`Failed to crawl Salesforce page ${url}: ${errorMessage}`,
		);
	}
}

export { crawlSalesforcePage };
