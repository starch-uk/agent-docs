/**
 * @file Search utilities for Salesforce Help pages.
 */

/* v8 ignore file -- Browser-side code in page.evaluate() cannot be unit tested in Node.js */

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- DOM API types and Playwright types cannot be made readonly */
/* eslint-disable @typescript-eslint/no-unnecessary-condition -- Runtime checks needed for DOM API nullability */

import { PlaywrightCrawler } from 'crawlee';

/**
 * Normalize search query by stripping leading '@' symbols.
 * This allows users to search for annotations like "@AuraEnabled" without the '@' symbol.
 * @param query - Search query.
 * @returns Normalized query with leading '@' symbols removed.
 */
function normalizeQuery(query: Readonly<string>): string {
	return query.replace(/^@+/, '');
}

/**
 * Default limit for search results.
 */
const defaultLimit = 20;

/**
 * Search Salesforce Help using Playwright.
 * @param query - The search query string.
 * @param limit - Maximum number of results to return (default: 20).
 * @returns Array of search results with URL and title.
 * @throws {Error} When search fails or times out.
 */
async function searchSalesforceHelp(
	query: Readonly<string>,
	limit: Readonly<number> = defaultLimit,
): Promise<{ url: string; title: string }[]> {
	// Normalize query by stripping leading '@' symbols
	const normalizedQuery = normalizeQuery(query);
	let results: { url: string; title: string }[] = [];
	const selectorTimeoutMs = 20000;
	const initialWaitMs = 8000;
	const coveoWaitMs = 3000;
	const additionalWaitMs = 2000;

	// Use help.salesforce.com search with correct URL format
	// Format: https://help.salesforce.com/s/search-result?language=en_US#q=QUERY&t=allResultsTab&sort=relevancy&f:@objecttype=[HTDeveloperDocumentsC,HelpDocs]&f:@sflanguage=[en_US]
	const searchUrl = `https://help.salesforce.com/s/search-result?language=en_US#q=${encodeURIComponent(normalizedQuery)}&t=allResultsTab&sort=relevancy&f:@objecttype=[HTDeveloperDocumentsC,HelpDocs]&f:@sflanguage=[en_US]`;

	const crawler = new PlaywrightCrawler({
		headless: true,
		navigationTimeoutSecs: 90,

		async requestHandler({
			page,
		}: {
			page: {
				waitForSelector: (
					selector: string,
					options?: { timeout?: number },
				) => Promise<unknown>;
				evaluate: <T>(
					fn: (maxResults: Readonly<number>) => T,
					...args: unknown[]
				) => Promise<T>;
			};
		}): Promise<void> {
			// Wait for search results to load - JavaScript-rendered pages need more time
			// Coveo search results may take longer to render
			await new Promise((resolve) => setTimeout(resolve, initialWaitMs));

			// Try to wait for Coveo search results first (Salesforce Help uses Coveo)
			try {
				await page.waitForSelector(
					'.coveo-result, .coveo-list-layout, [data-coveo-uri], .CoveoResultLink, a[href*="articleView"]',
					{
						timeout: selectorTimeoutMs,
					},
				);
				// Additional wait for Coveo to fully render results
				const coveoWaitTimeoutMs = coveoWaitMs;
				await new Promise((resolve) =>
					setTimeout(resolve, coveoWaitTimeoutMs),
				);
			} catch {
				// Fallback to other selectors if Coveo not found
				try {
					await page.waitForSelector(
						'a[href*="articleView"], .search-result, [data-result], article, .result',
						{
							timeout: selectorTimeoutMs,
						},
					);
				} catch {
					// Continue even if selector doesn't appear - results might be there
				}
			}

			// Additional wait for dynamic content
			await new Promise((resolve) =>
				setTimeout(resolve, additionalWaitMs),
			);

			// Extract results using page.evaluate to query the rendered DOM
			// Note: page.evaluate runs in browser context where document is available

			const extractedResults = await page.evaluate(
				(
					maxResults: Readonly<number>,
				): { url: string; title: string }[] => {
					const doc = (
						globalThis as {
							readonly document?: {
								readonly querySelectorAll: (
									selector: string,
								) => {
									readonly [index: number]: {
										readonly getAttribute: (
											attr: string,
										) => string | null;
										readonly textContent: string | null;
										readonly parentElement: {
											readonly textContent: string | null;
											readonly querySelector: (
												selector: string,
											) => {
												readonly textContent:
													| string
													| null;
											} | null;
										} | null;
									};
									readonly length: number;
								};
							};
						}
					).document;
					const foundResults: { url: string; title: string }[] = [];
					const seenUrls = new Set<string>();

					// Prioritize Coveo selectors (Salesforce Help uses Coveo for search)
					const selectors = [
						'.coveo-result a',
						'.coveo-list-layout .CoveoResultLink',
						'.coveo-list-layout a',
						'[data-coveo-uri]',
						'.CoveoResult a',
						'.CoveoResultLink',
						'a[href*="developer.salesforce.com/docs/"]',
						'a[href*="articleView"]',
						'a[href*="/s/articleView"]',
						'a[href*="apexcode"]',
						'a[href*="apex"]',
						'.search-result a',
						'.result-item a',
						'.result a',
						'h3 a, h4 a, h2 a',
						'[data-href*="articleView"]',
						'[data-href*="developer.salesforce.com/docs/"]',
						'.slds-text-heading_small a',
						'.slds-text-heading_medium a',
						'article a[href*="articleView"]',
						'article a[href*="developer.salesforce.com/docs/"]',
						'[class*="result"] a',
						'[class*="search"] a',
					];

					for (const selector of selectors) {
						if (doc === null || doc === undefined) continue;
						const links = doc.querySelectorAll(selector);

						const linksLoopStart = 0;
						for (let i = linksLoopStart; i < links.length; i++) {
							const link = links[i];
							// Coveo uses data-coveo-uri attribute, fallback to href
							const href =
								link.getAttribute('href') ??
								link.getAttribute('data-coveo-uri');
							if (href === null || href === '') continue;

							// Normalize URL
							let url = href;
							if (!url.startsWith('http')) {
								url = url.startsWith('/')
									? `https://help.salesforce.com${url}`
									: `https://help.salesforce.com/${url}`;
							}

							// Accept both articleView URLs (help.salesforce.com) and /docs/ URLs (developer.salesforce.com)
							const isArticleView = url.includes('articleView');
							const isDeveloperDocs = url.includes(
								'developer.salesforce.com/docs/',
							);
							if (
								(!isArticleView && !isDeveloperDocs) ||
								seenUrls.has(url)
							)
								continue;

							// Extract title
							let title = link.textContent?.trim() ?? '';
							const minTitleLength = 5;
							if (title.length < minTitleLength) {
								// Try parent or nearby elements

								const parent = link.parentElement;
								if (parent !== null) {
									title = parent.textContent?.trim() ?? '';
									if (title.length < minTitleLength) {
										const heading = parent.querySelector(
											'h3, h4, .title, .result-title',
										);

										title =
											heading?.textContent?.trim() ?? '';
									}
								}
							}

							if (title.length >= minTitleLength) {
								seenUrls.add(url);
								foundResults.push({ title, url });

								if (foundResults.length >= maxResults) {
									return foundResults;
								}
							}
						}

						const noResults = 0;
						if (foundResults.length > noResults) break;
					}

					const sliceStart = 0;
					return foundResults.slice(sliceStart, maxResults);
				},
				limit,
			);

			results = extractedResults;
		},
		requestHandlerTimeoutSecs: 90,
	});

	try {
		await crawler.run([searchUrl]);

		const noResults = 0;
		if (results.length > noResults) {
			return results;
		}
	} catch (error) {
		console.warn(`Error searching help.salesforce.com:`, error);
	}

	// Try alternative help.salesforce.com search format as fallback
	const helpSearchUrl = `https://help.salesforce.com/s/search?q=${encodeURIComponent(normalizedQuery)}&language=en_US`;

	const fallbackCrawler = new PlaywrightCrawler({
		headless: true,
		navigationTimeoutSecs: 90,

		async requestHandler({
			page,
		}: {
			page: {
				waitForSelector: (
					selector: string,
					options?: { timeout?: number },
				) => Promise<unknown>;
				evaluate: <T>(
					fn: (maxResults: Readonly<number>) => T,
					...args: unknown[]
				) => Promise<T>;
			};
		}): Promise<void> {
			// Wait for Coveo search results (Salesforce Help uses Coveo)
			const fallbackWaitMs = 5000;
			await new Promise((resolve) => setTimeout(resolve, fallbackWaitMs));

			try {
				// Prioritize Coveo selectors
				await page.waitForSelector(
					'.coveo-result, .coveo-list-layout, [data-coveo-uri], .CoveoResultLink',
					{
						timeout: selectorTimeoutMs,
					},
				);
				// Additional wait for Coveo to fully render
				await new Promise((resolve) =>
					setTimeout(resolve, coveoWaitMs),
				);
			} catch {
				// Fallback to other selectors
				try {
					await page.waitForSelector(
						'a[href*="articleView"], .search-result, [data-result]',
						{
							timeout: selectorTimeoutMs,
						},
					);
				} catch {
					// Continue even if selector doesn't appear
				}
			}

			const helpResults = await page.evaluate(
				(
					maxResults: Readonly<number>,
				): { url: string; title: string }[] => {
					const doc = (
						globalThis as {
							readonly document?: {
								readonly querySelectorAll: (
									selector: string,
								) => {
									readonly [index: number]: {
										readonly getAttribute: (
											attr: string,
										) => string | null;
										readonly textContent: string | null;
										readonly parentElement: {
											readonly textContent: string | null;
											readonly querySelector: (
												selector: string,
											) => {
												readonly textContent:
													| string
													| null;
											} | null;
										} | null;
									};
									readonly length: number;
								};
							};
						}
					).document;
					const foundResults: { url: string; title: string }[] = [];
					const seenUrls = new Set<string>();

					// Prioritize Coveo selectors (Salesforce Help uses Coveo for search)
					const selectors = [
						'.coveo-result a',
						'.coveo-list-layout .CoveoResultLink',
						'.coveo-list-layout a',
						'[data-coveo-uri]',
						'.CoveoResult a',
						'.CoveoResultLink',
						'a[href*="articleView"]',
						'a[href*="/s/articleView"]',
						'a[href*="apexcode"]',
						'a[href*="apex"]',
						'.search-result a',
						'[data-result] a',
						'[class*="result"] a',
						'[class*="search"] a',
					];

					for (const selector of selectors) {
						if (doc === null || doc === undefined) continue;
						const links = doc.querySelectorAll(selector);

						const helpLinksLoopStart = 0;
						for (
							let i = helpLinksLoopStart;
							i < links.length;
							i++
						) {
							const link = links[i];
							const href =
								link.getAttribute('href') ??
								link.getAttribute('data-coveo-uri');
							if (href === null || href === '') continue;

							let url = href;
							if (!url.startsWith('http')) {
								url = url.startsWith('/')
									? `https://help.salesforce.com${url}`
									: `https://help.salesforce.com/${url}`;
							}

							if (
								!url.includes('articleView') ||
								seenUrls.has(url)
							)
								continue;

							let title = link.textContent?.trim() ?? '';

							// Filter out release notes
							if (
								url.includes('release-notes') ||
								url.includes('/rn_') ||
								(url.includes('release') &&
									title
										.toLowerCase()
										.includes('release notes'))
							) {
								continue;
							}
							const minTitleLength = 5;
							if (title.length < minTitleLength) {
								const parent = link.parentElement;
								if (parent !== null) {
									title = parent.textContent?.trim() ?? '';
								}
							}

							if (title.length >= minTitleLength) {
								seenUrls.add(url);
								foundResults.push({ title, url });

								if (foundResults.length >= maxResults) {
									return foundResults;
								}
							}
						}

						const noResults = 0;
						if (foundResults.length > noResults) break;
					}

					const sliceStart = 0;
					return foundResults.slice(sliceStart, maxResults);
				},
				limit,
			);

			results = helpResults;
		},
		requestHandlerTimeoutSecs: 90,
	});

	try {
		await fallbackCrawler.run([helpSearchUrl]);

		const noResults = 0;
		if (results.length > noResults) {
			return results;
		}
	} catch (error) {
		console.warn(`Error searching help.salesforce.com:`, error);
	}

	// No results found from either source

	/**
	 * @throws {Error} When no search results are found.
	 */
	throw new Error(`No search results found for: ${normalizedQuery}`);
}

export { searchSalesforceHelp, normalizeQuery };
