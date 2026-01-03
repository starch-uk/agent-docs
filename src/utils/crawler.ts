/**
 * @file Utilities for crawling and extracting content from Salesforce Help pages.
 */

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
 * Search Salesforce Help using Playwright to handle JavaScript-rendered pages.
 * Filters to Developer Documentation and Product Documentation content types.
 * Returns top N results (default 20, even if total results are higher, e.g., 1,776 for "Apex Annotations").
 * @param query - Search query.
 * @param limit - Maximum number of results to return (default: 20).
 * @returns Search results (limited to specified limit).
 */

/**
 * Default limit for search results.
 */
const defaultLimit = 20;

/* eslint-disable jsdoc/check-tag-names -- @rejects is required by jsdoc/require-rejects but not recognized by jsdoc/check-tag-names */

/**
 * Search Salesforce Help using Playwright.
 * @param query - The search query string.
 * @param limit - Maximum number of results to return (default: 20).
 * @returns Array of search results with URL and title.
 * @throws {Error} When search fails or times out.
 * @rejects {Error} When search fails or times out.
 */
/* eslint-enable jsdoc/check-tag-names */
async function searchSalesforceHelp( // eslint-disable-line jsdoc/require-jsdoc -- JSDoc is above the eslint-disable/enable block
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
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- page object from PlaywrightCrawler cannot be made readonly
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
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- doc can be undefined
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
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- page object from PlaywrightCrawler cannot be made readonly
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
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- doc can be undefined
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

/* eslint-disable jsdoc/check-tag-names -- @rejects is required by jsdoc/require-rejects but not recognized by jsdoc/check-tag-names */

/**
 * Crawl a Salesforce Help page using Playwright to handle JavaScript-rendered content.
 * @param url - Salesforce Help page URL.
 * @returns Page content.
 * @throws {Error} When page crawl fails or times out.
 * @rejects {Error} When page crawl fails or times out.
 */
/* eslint-enable jsdoc/check-tag-names */
async function crawlSalesforcePage(url: Readonly<string>): Promise<string> {
	// eslint-disable-line jsdoc/require-jsdoc -- JSDoc is above the eslint-disable/enable block
	let content = '';

	// Timeout constants
	const navigationTimeoutMs = 60000;
	const pageInitWaitMs = 2000;
	const cookieBannerWaitMs = 3000;
	const cookieClickWaitMs = 2000;
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

	const crawler = new PlaywrightCrawler({
		headless: true,
		navigationTimeoutSecs: 60,

		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- type definition parameters cannot be readonly
		async requestHandler({
			page,
		}: Readonly<{
			page: {
				goto: (
					url: Readonly<string>,
					options?: Readonly<{
						timeout?: number;
						waitUntil?:
							| 'commit'
							| 'domcontentloaded'
							| 'load'
							| 'networkidle';
					}>,
				) => Promise<unknown>;
				waitForSelector: (
					selector: Readonly<string>,
					options?: Readonly<{ timeout?: number }>,
				) => Promise<unknown>; // eslint-disable-next-line @typescript-eslint/no-explicit-any -- page.evaluate has overloaded signatures that TypeScript can't express cleanly
				evaluate: (...args: any[]) => Promise<any>;
				click: (selector: Readonly<string>) => Promise<unknown>;
				isClosed: () => boolean;
				$: (selector: Readonly<string>) => Promise<{
					click: (
						options?: Readonly<{ timeout?: number }>,
					) => Promise<unknown>;
				} | null>;
				$$: (selector: Readonly<string>) => Promise<
					{
						click: (
							options?: Readonly<{ timeout?: number }>,
						) => Promise<unknown>;
					}[]
				>;
				waitForFunction: (
					fn: () => boolean,
					options?: Readonly<{ timeout?: number }>,
				) => Promise<unknown>;
			};
		}>): Promise<void> {
			// eslint-disable-line @typescript-eslint/prefer-readonly-parameter-types -- fn parameter in type definition cannot be readonly
			// Navigate to page - use domcontentloaded to avoid hanging
			await page.goto(url, {
				timeout: navigationTimeoutMs,
				waitUntil: 'domcontentloaded',
			});

			// Additional wait for page to fully initialize - use setTimeout instead of page.waitForTimeout
			await new Promise((resolve) => setTimeout(resolve, pageInitWaitMs));

			// Handle cookie consent if present - try multiple strategies
			try {
				// Wait a bit for cookie banner to appear - use setTimeout instead of page.waitForTimeout
				await new Promise((resolve) =>
					setTimeout(resolve, cookieBannerWaitMs),
				);

				// Try multiple selectors for accept button - use more specific selectors
				const acceptSelectors = [
					'button:has-text("Accept All Cookies")',
					'button:has-text("Accept All")',
					'button:has-text("Accept")',
					'[aria-label*="Accept All"]',
					'[aria-label*="Accept"]',
					'button[id*="accept"]',
					'button[class*="accept"]',
					'.cookie-consent button',
					'[data-testid*="accept"]',
					'button[type="button"]:has-text("Accept")',
				];

				let cookieHandled = false;
				const acceptLoopStart = 0;
				for (let i = acceptLoopStart; i < acceptSelectors.length; i++) {
					const selector = acceptSelectors[i];
					try {
						if (page.isClosed()) {
							break;
						}
						const acceptButtonTimeoutMs = 2000;

						const acceptButton = await Promise.race([
							page.$(selector),
							new Promise<null>((resolve) =>
								setTimeout(() => {
									resolve(null);
								}, acceptButtonTimeoutMs),
							),
						]).catch(() => null);
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- acceptButton can be null, but linter thinks types have no overlap
						if (
							acceptButton !== null &&
							acceptButton !== undefined
						) {
							// Add timeout to click to avoid hanging
							try {
								await Promise.race([
									acceptButton.click({
										timeout: clickTimeoutMs,
									}),
									new Promise((_, reject) =>
										setTimeout(() => {
											reject(new Error('Click timeout'));
										}, clickTimeoutMs),
									),
								]);
								cookieHandled = true;
							} catch {
								// Click failed or timed out, continue
							}
							if (cookieHandled) {
								// Use regular setTimeout instead of page.waitForTimeout to avoid hanging
								// when page context is invalid
								await new Promise((resolve) =>
									setTimeout(resolve, cookieClickWaitMs),
								);
								break;
							}
						}
					} catch {
						// Try next selector
					}
				}

				// Skip button text search if we already handled cookies - this prevents hanging
				if (!cookieHandled) {
					try {
						// Check if page is still valid before querying
						if (page.isClosed()) {
							throw new Error('Page closed');
						}
						// Limit to first 10 buttons to avoid hanging on many buttons
						// Add timeout to page.$$ to avoid hanging

						const buttons = await Promise.race([
							page.$$('button'),
							new Promise<never>((_, reject) => {
								const buttonQueryTimeoutMs = 5000;
								setTimeout(() => {
									reject(new Error('Button query timeout'));
								}, buttonQueryTimeoutMs);
							}),
						]).catch(() => []);
						const maxButtonsToCheck = 10;

						const buttonLimit = Math.min(
							(buttons as { readonly length: number }).length,
							maxButtonsToCheck,
						);
						const buttonLoopStart = 0;
						for (let i = buttonLoopStart; i < buttonLimit; i++) {
							try {
								// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- buttons is array-like from Playwright
								const button = (buttons as readonly unknown[])[
									i
								] as {
									readonly isVisible: () => Promise<boolean>;
									readonly textContent: () => Promise<
										string | null
									>;
									readonly click: (options?: {
										readonly timeout?: number;
									}) => Promise<unknown>;
								};
								// Quick visibility check with timeout

								const isVisible = await Promise.race([
									button.isVisible(),
									new Promise<boolean>((resolve) =>
										setTimeout(() => {
											resolve(false);
										}, buttonClickWaitMs),
									),
								]).catch(() => false);

								if (!isVisible) continue;

								const text = await Promise.race([
									button.textContent(),
									new Promise<string | null>((resolve) =>
										setTimeout(() => {
											resolve(null);
										}, buttonClickWaitMs),
									),
								]).catch(() => null);

								if (
									text !== null &&
									text !== '' &&
									(text.includes('Accept All') ||
										text.includes('Accept'))
								) {
									// Add timeout to click to avoid hanging

									await Promise.race([
										button.click({
											timeout: buttonClickTimeoutMs,
										}),
										new Promise((_, reject) =>
											setTimeout(() => {
												reject(
													new Error('Click timeout'),
												);
											}, buttonClickTimeoutMs),
										),
									]).catch(() => {
										// Intentionally ignore click errors
									});
									cookieHandled = true;
									await new Promise((resolve) =>
										setTimeout(resolve, buttonClickWaitMs),
									);
									break;
								}
							} catch {
								// Continue to next button
							}
						}
					} catch {
						// Continue
					}
				}

				// Try to close any modal/dialog that might be blocking content
				try {
					if (page.isClosed()) {
						// Page is closed, skip
					} else {
						const closeButtons = await Promise.race([
							page.$$(
								'[aria-label*="Close"], [aria-label*="close"], .close, [class*="close"], [data-dismiss]',
							),
							new Promise<never>((_, reject) =>
								setTimeout(() => {
									reject(new Error('Modal query timeout'));
								}, clickTimeoutMs),
							),
						]).catch(() => []);
						const closeButtonsLoopStart = 0;

						for (
							let i = closeButtonsLoopStart;
							i <
							(closeButtons as { readonly length: number })
								.length;
							i++
						) {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- closeButtons is array-like from Playwright
							const btn = (closeButtons as readonly unknown[])[
								i
							] as {
								readonly isVisible: () => Promise<boolean>;
								readonly click: (options?: {
									readonly timeout?: number;
								}) => Promise<unknown>;
							};
							try {
								// Check if page is still valid before clicking

								if (page.isClosed()) {
									break;
								}
								// Check if button is still attached

								const isVisible = await Promise.race([
									btn.isVisible().catch(() => false),
									new Promise<boolean>((resolve) =>
										setTimeout(() => {
											resolve(false);
										}, buttonClickWaitMs),
									),
								]).catch(() => false);
								if (!isVisible) {
									continue;
								}
								// Wrap click with timeout to prevent hanging

								await Promise.race([
									btn.click({
										timeout: buttonClickTimeoutMs,
									}),
									new Promise((_, reject) =>
										setTimeout(() => {
											reject(
												new Error(
													'Close button click timeout',
												),
											);
										}, closeButtonTimeoutMs),
									),
								]);
								await new Promise((resolve) =>
									setTimeout(resolve, buttonClickWaitMs),
								);
							} catch {
								// Continue to next button
							}
						}
					}
				} catch {
					// Continue
				}

				// Scroll to trigger lazy loading
				try {
					if (!page.isClosed()) {
						await page.evaluate(() => {
							const scrollTopValue = 0;
							const scrollDivisorValue = 2;
							window.scrollTo(
								scrollTopValue,
								document.body.scrollHeight / scrollDivisorValue,
							);
						});
					}
				} catch {
					// Page closed, continue
				}
				await new Promise((resolve) =>
					setTimeout(resolve, scrollWaitMs),
				);

				try {
					if (!page.isClosed()) {
						await page.evaluate(() => {
							const scrollTopValue = 0;
							window.scrollTo(scrollTopValue, scrollTopValue);
						});
					}
				} catch {
					// Page closed, continue
				}
				await new Promise((resolve) =>
					setTimeout(resolve, buttonClickWaitMs),
				);
			} catch {
				// Cookie consent not present or already handled
			}

			// Wait for content to load - use fixed timeout to avoid hanging
			// Don't use networkidle as it can hang indefinitely
			// Use regular setTimeout instead of page.waitForTimeout to avoid hanging
			// when page context is invalid
			const contentLoadWaitMs = 8000;
			await new Promise((resolve) => {
				setTimeout(() => {
					resolve(undefined);
				}, contentLoadWaitMs);
			});

			// Try to wait for content selectors with multiple attempts
			// developer.salesforce.com uses different selectors than help.salesforce.com
			let contentFound = false;
			const contentSelectors = [
				// developer.salesforce.com selectors
				'.slds-text-longform',
				'.slds-text',
				'[role="main"]',
				'main',
				'article',
				'.content',
				'.article-content',
				'#main-content',
				'.documentation-content',
				'.docs-content',
				'[class*="content"]',
				'[class*="article"]',
			];

			const contentSelectorsLoopStart = 0;
			const selectorWaitTimeoutMs = 5000;
			for (
				let i = contentSelectorsLoopStart;
				i < contentSelectors.length;
				i++
			) {
				const selector = contentSelectors[i];
				try {
					if (page.isClosed()) {
						break;
					}
					await page.waitForSelector(selector, {
						timeout: selectorWaitTimeoutMs,
					});
					contentFound = true;
					break;
				} catch {
					// Try next selector
				}
			}

			// Additional wait if content found to ensure full rendering
			// Also scroll more to trigger lazy loading of content
			if (contentFound) {
				// Wait for content to be fully rendered - try waiting for text content
				try {
					if (!page.isClosed()) {
						// Wait for substantial text content to appear in main area
						// Use a more lenient check - just wait for some content to appear
						await Promise.race([
							page
								.waitForFunction(
									(): boolean => {
										// First check for the Salesforce-specific content container
										const contentContainer =
											document.querySelector(
												'div.container[data-name="content"]',
											) ??
											document.querySelector(
												'.container[data-name="content"]',
											) ??
											document.querySelector(
												'[data-name="content"]',
											);
										if (contentContainer !== null) {
											const bodyContent =
												contentContainer.querySelector(
													'.body.conbody',
												) ??
												contentContainer.querySelector(
													'.conbody',
												) ??
												contentContainer.querySelector(
													'.body',
												);
											const target =
												bodyContent ?? contentContainer;
											// target is always truthy here since we checked contentContainer !== null and bodyContent ?? contentContainer will never be null
											// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- cloneNode returns Node, but we know it's an Element
											const clone = target.cloneNode(
												true,
											) as Element;
											const scripts =
												clone.querySelectorAll(
													'script, style, noscript',
												);
											// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Element.remove() mutates the element
											scripts.forEach((el: Element) => {
												el.remove();
											});
											const {
												textContent: textContentValue,
											} = clone;
											// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null
											const text = (
												textContentValue ?? ''
											).trim();
											// Wait for at least 1000 characters of actual content
											const minContentLength = 1000;
											return (
												text.length > minContentLength
											);
										}
										// Fallback to main element
										const main =
											document.querySelector(
												'[role="main"]',
											) ?? document.querySelector('main');
										if (main !== null) {
											// Clone and remove scripts to get actual content length
											// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- cloneNode returns Node, but we know it's an Element
											const clone = main.cloneNode(
												true,
											) as Element;
											const scripts =
												clone.querySelectorAll(
													'script, style, noscript',
												);
											// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Element.remove() mutates the element
											scripts.forEach((el: Element) => {
												el.remove();
											});
											const {
												textContent:
													textContentMainValue,
											} = clone;
											// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null
											const text = (
												textContentMainValue ?? ''
											).trim();
											// Wait for at least 2000 characters of actual content
											const minMainContentLength = 2000;
											return (
												text.length >
												minMainContentLength
											);
										}
										return false;
									},
									{ timeout: longWaitMs },
								)

								.catch(() => {
									// Intentionally ignore timeout errors
								}),
							new Promise((resolve) =>
								setTimeout(resolve, longWaitMs),
							),
						]);
					}
				} catch {
					// Continue
				}

				// Scroll through the page multiple times to trigger lazy loading
				const scrollStart = 0;
				for (let scroll = scrollStart; scroll < scrollCount; scroll++) {
					try {
						if (!page.isClosed()) {
							await page.evaluate(
								(
									args: Readonly<{
										scrollIndex: Readonly<number>;
										divisor: Readonly<number>;
									}>,
								) => {
									const scrollTopValue = 0;
									const scrollIndexOffsetValue = 1;
									window.scrollTo(
										scrollTopValue,
										(document.body.scrollHeight /
											args.divisor) *
											(args.scrollIndex +
												scrollIndexOffsetValue),
									);
								},
								{ divisor: scrollDivisor, scrollIndex: scroll },
							);
							await new Promise((resolve) =>
								setTimeout(resolve, scrollBackWaitMs),
							);
						}
					} catch {
						// Continue
					}
				}
				// Scroll back to top
				try {
					if (!page.isClosed()) {
						await page.evaluate(() => {
							const scrollTopValue = 0;
							const scrollLeftValue = 0;
							window.scrollTo(scrollLeftValue, scrollTopValue);
						});
					}
				} catch {
					// Continue
				}
				// Wait longer for content to fully load
				await new Promise((resolve) =>
					setTimeout(resolve, contentWaitMs),
				);
			} else {
				// Even if no specific selector found, wait for page to stabilize
				await new Promise((resolve) =>
					setTimeout(resolve, finalWaitMs),
				);
			}

			// Extract content using page.evaluate
			// Wrap page.evaluate with timeout to prevent hanging
			// Note: content variable is in outer scope, assign to it directly
			try {
				if (page.isClosed()) {
					throw new Error('Page is closed');
				}
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- page.evaluate returns any due to overloaded signatures
				const evalResult = await Promise.race([
					page.evaluate(() => {
						const doc = (globalThis as { document: Document })
							.document;

						/**
						 * Helper function to traverse shadow DOMs recursively (3 levels deep).
						 * @param element - Element to search in.
						 * @param selector - CSS selector to find.
						 * @returns Found element or null.
						 */
						// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Element is DOM API type that cannot be made readonly
						const findInShadowDOM = (
							element: Element | null,
							selector: Readonly<string>,
						): Element | null => {
							if (element === null) return null;

							/**
							 * Traverse shadow roots recursively.
							 * @param el - Element to traverse.
							 * @param depth - Current depth (default: 0).
							 * @returns Found element or null.
							 */
							// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Element is DOM API type that cannot be made readonly
							const traverse = (
								el: Element | null,
								depth: Readonly<number> = 0,
							): Element | null => {
								// eslint-disable-line @typescript-eslint/no-magic-numbers -- depth default of 0 is standard for recursion
								const maxDepth = 10;
								if (el === null || depth > maxDepth)
									return null; // Safety limit

								// First check if this element itself has a shadow root
								if (el.shadowRoot) {
									// Check shadow root directly for the selector
									try {
										const shadowResult =
											el.shadowRoot.querySelector(
												selector,
											);
										if (shadowResult) return shadowResult;
									} catch {
										// Continue if querySelector fails
									}

									// Recursively traverse all children in the shadow root
									try {
										const shadowChildren =
											el.shadowRoot.querySelectorAll('*');
										for (const child of shadowChildren) {
											const depthIncrement = 1;

											const result = traverse(
												child,
												depth + depthIncrement,
											);
											if (result !== null) return result;
										}
									} catch {
										// Continue if querySelectorAll fails
									}
								}

								// Also check regular children (for elements that might have shadow roots)

								const children = Array.from(el.children);
								for (const child of children) {
									const result = traverse(child, depth);
									if (result !== null) return result;
								}

								return null;
							};

							// Start traversal from the element itself
							const traversalStartDepth = 0;
							return traverse(element, traversalStartDepth);
						};

						// Debug: Check what's actually in the DOM
						const debugInfo: {
							[key: string]: unknown;
							bodyTextLength: number;
							divCount: number;
							mainElements: unknown[];
							paragraphCount: number;
							shadowDOMFound: boolean;
							textElements?: unknown[];
						} = {
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-magic-numbers -- doc.body can be null, 0 is default for length
							bodyTextLength:
								doc.body?.textContent?.trim()?.length ?? 0,
							divCount: doc.querySelectorAll('div').length,
							mainElements: [],
							paragraphCount: doc.querySelectorAll('p').length,
							shadowDOMFound: false,
						};

						// Check for doc-xml-content element (entry point to shadow DOM)
						const docXmlContent =
							doc.querySelector('doc-xml-content');
						debugInfo.docXmlContentFound = docXmlContent !== null;
						if (
							docXmlContent !== null &&
							docXmlContent.shadowRoot !== null
						) {
							debugInfo.shadowDOMFound = true;
						}

						// Check main element
						const mainEl =
							doc.querySelector('[role="main"]') ??
							doc.querySelector('main');
						if (mainEl !== null) {
							const mainElTextLengthDefault = 0;
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent.trim() can return empty string
							const mainElTextLength =
								mainEl.textContent?.trim()?.length ??
								mainElTextLengthDefault;
							debugInfo.mainElements.push({
								children: mainEl.children.length,
								// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- className can be empty string
								className: mainEl.className ?? '',
								tag: mainEl.tagName,
								textLength: mainElTextLength,
							});
						}

						// Try to find elements with substantial text
						const allElements = doc.querySelectorAll('*');
						const textElements: {
							tag: string;
							text: string;
							length: number;
							className?: string;
							textLength?: number;
							textPreview?: string;
						}[] = [];
						const maxElements = 100;
						const textLoopStart = 0;
						for (
							let i = textLoopStart;
							i < Math.min(allElements.length, maxElements);
							i++
						) {
							const el = allElements[i];
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null
							const text = el.textContent?.trim() ?? '';
							const minTextLengthForElement = 200;
							if (
								text.length > minTextLengthForElement &&
								!text.toLowerCase().includes('cookie')
							) {
								const classNameValue = el.className;
								const classNameStr =
									typeof classNameValue === 'string'
										? classNameValue
										: '';
								const textPreviewLength = 100;
								textElements.push({
									className: classNameStr,
									length: text.length,
									tag: el.tagName,
									text,
									textLength: text.length,
									// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 0 is standard substring start
									textPreview: text.substring(
										0,
										textPreviewLength,
									),
								});
							}
						}

						const sliceStart = 0;
						const maxTextElementsSlice = 10;
						debugInfo.textElements = textElements.slice(
							sliceStart,
							maxTextElementsSlice,
						); // First 10

						/**
						 * Function to remove unwanted elements.
						 * @param element - Document or Element to remove from.
						 * @param selectors - CSS selectors for elements to remove.
						 */
						// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Document and Element are DOM API types
						const removeElements = (
							element: Document | Element,
							selectors: Readonly<string>,
						): void => {
							const unwanted =
								element.querySelectorAll(selectors);
							// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Element.remove() mutates the element
							unwanted.forEach((el: Element) => {
								el.remove();
							});
						};

						// Try multiple selector strategies - prioritize developer.salesforce.com selectors
						// First try to find content container in shadow DOM (using docXmlContent already declared above)
						let contentContainer = null;
						let bodyContent = null;

						if (docXmlContent) {
							// Traverse shadow DOMs to find the content container (3 levels deep)
							debugInfo.shadowDOMSearchAttempted = true;

							// Try to find the container - traverse through all shadow DOMs
							contentContainer =
								findInShadowDOM(
									docXmlContent,
									'div.container[data-name="content"]',
								) ??
								findInShadowDOM(
									docXmlContent,
									'.container[data-name="content"]',
								) ??
								findInShadowDOM(
									docXmlContent,
									'[data-name="content"]',
								);

							debugInfo.shadowDOMSearchResult =
								!!contentContainer;
							debugInfo.shadowDOMSearchDepth = contentContainer
								? 'found'
								: 'not found';

							if (contentContainer) {
								// Find body content within the container
								bodyContent =
									contentContainer.querySelector(
										'.body.conbody',
									) ??
									contentContainer.querySelector(
										'.conbody',
									) ??
									contentContainer.querySelector('.body');

								// Also try to get all text directly from the container if body not found
								if (!bodyContent) {
									// Get all paragraphs, divs, and text elements from the container
									const allTextElements =
										contentContainer.querySelectorAll(
											'p, div, span, li, h1, h2, h3, h4, h5, h6',
										);
									// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 0 is standard array length check
									if (allTextElements.length > 0) {
										// Use the container itself if it has substantial text

										const containerText =
											// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- optional chain needed for runtime safety
											contentContainer.textContent?.trim() ??
											'';
										const minContainerTextLength = 500;
										if (
											containerText.length >
											minContainerTextLength
										) {
											bodyContent = contentContainer;
										}
									}
								}
							}
						} else {
							debugInfo.shadowDOMSearchAttempted = false;
						}

						// Fallback to direct querySelector if shadow DOM search failed
						if (!contentContainer) {
							contentContainer =
								doc.querySelector(
									'div.container[data-name="content"]',
								) ??
								doc.querySelector(
									'.container[data-name="content"]',
								) ??
								doc.querySelector('[data-name="content"]');

							if (contentContainer) {
								bodyContent =
									contentContainer.querySelector(
										'.body.conbody',
									) ??
									contentContainer.querySelector(
										'.conbody',
									) ??
									contentContainer.querySelector('.body');
							}
						}

						debugInfo.contentContainerFound = !!contentContainer;

						debugInfo.contentContainerClasses = contentContainer
							? // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- optional chain needed for runtime safety
								(contentContainer.className ?? '')
							: null;

						const contentContainerTextLengthDefault = 0;

						const contentContainerTextLength = contentContainer
							? // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- optional chain needed for runtime safety
								(contentContainer.textContent?.trim()?.length ??
								contentContainerTextLengthDefault)
							: contentContainerTextLengthDefault;
						debugInfo.contentContainerTextLength =
							contentContainerTextLength;

						debugInfo.bodyContentFound = !!bodyContent;

						debugInfo.bodyContentClasses = bodyContent
							? // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- optional chain needed for runtime safety
								(bodyContent.className ?? '')
							: null;

						const bodyContentTextLengthDefault = 0;

						const bodyContentTextLength = bodyContent
							? // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- optional chain needed for runtime safety
								(bodyContent.textContent?.trim()?.length ??
								bodyContentTextLengthDefault)
							: bodyContentTextLengthDefault;
						debugInfo.bodyContentTextLength = bodyContentTextLength;

						// Fallback to main element
						const mainElement =
							bodyContent ??
							contentContainer ??
							doc.querySelector('[role="main"]') ??
							doc.querySelector('main');

						// Try multiple selector strategies - prioritize developer.salesforce.com selectors
						const selectors = [
							// Salesforce-specific content containers (highest priority)
							'div.container[data-name="content"]',
							'.container[data-name="content"]',
							'[data-name="content"]',
							'.body.conbody',
							'.conbody',
							// More specific developer.salesforce.com selectors
							'.slds-text-longform',
							'.slds-text',
							'.slds-text-longform p',
							'.slds-text p',
							'[role="main"]',
							'[role="main"] .slds-text-longform',
							'[role="main"] .slds-text',
							'main',
							'main .slds-text-longform',
							'main .slds-text',
							'article',
							'.content',
							'.article-content',
							'#main-content',
							'.documentation-content',
							'.docs-content',
							'[class*="content"]',
							'[class*="article"]',
							// Try to get all paragraphs in main content
							'[role="main"] p',
							'main p',
						];

						// Simplified approach: Get content from main area directly
						let bestText = '';
						let bestLength = 0;

						// Update debug info with main element details
						debugInfo.mainElementFound = !!mainElement;
						debugInfo.mainElementTag = mainElement
							? mainElement.tagName
							: null;

						debugInfo.mainElementClasses = mainElement
							? // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- optional chain needed for runtime safety
								(mainElement.className ?? '')
							: null;

						// First, try to get comprehensive content from main area
						if (mainElement) {
							// Clone to avoid modifying original
							// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- cloneNode returns Node, but we know it's an Element
							const clone = mainElement.cloneNode(
								true,
							) as Element;
							// Aggressively remove ALL scripts, styles, and non-content elements FIRST
							// This must be done before getting textContent
							removeElements(
								clone,
								'script, style, noscript, iframe, svg, canvas, code, pre',
							);
							removeElements(
								clone,
								'nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"], [class*="banner"], [id*="banner"]',
							);
							removeElements(
								clone,
								'[role="dialog"], [aria-label*="cookie"], [aria-label*="Cookie"], [class*="modal"], [class*="overlay"]',
							);
							removeElements(
								clone,
								'[class*="nav"], [class*="menu"], [class*="sidebar"], [class*="header"], [class*="footer"]',
							);
							// Remove global nav container and related elements
							removeElements(
								clone,
								'.global-nav-container, hgf-c360nav, hgf-c360contextnav, dx-scroll-manager, dx-traffic-labeler, doc-header, doc-xml-content',
							);
							// Also remove any elements with inline scripts or event handlers
							const allElementsClone =
								clone.querySelectorAll('*');
							// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Element.remove() mutates the element
							allElementsClone.forEach((el: Element) => {
								// Remove elements with event handlers or script-like content
								// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- className can be empty string
								const className = el.className ?? '';
								const classStr =
									typeof className === 'string'
										? className
										: '';
								// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Element can be cast to HTMLElement for event handler checks
								const htmlEl = el as HTMLElement;
								if (
									htmlEl.onclick ||
									htmlEl.onload ||
									htmlEl.onerror ||
									el.tagName === 'SCRIPT' ||
									el.tagName === 'STYLE' ||
									(el.textContent &&
										el.textContent.includes('function') &&
										el.textContent.includes('=>')) ||
									classStr.includes('global-nav') ||
									classStr.includes('cookie') ||
									classStr.includes('onetrust') ||
									el.tagName === 'HGF-C360NAV' ||
									el.tagName === 'HGF-C360CONTEXTNAV' ||
									el.tagName === 'DX-SCROLL-MANAGER' ||
									el.tagName === 'DX-TRAFFIC-LABELER' ||
									el.tagName === 'DOC-HEADER' ||
									el.tagName === 'DOC-XML-CONTENT'
								) {
									el.remove();
								}
							});
							// Also extract title attributes from links (important for Salesforce docs)
							const linksWithTitles =
								clone.querySelectorAll('a[title]');
							const titleTexts: string[] = [];
							// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- querySelectorAll returns NodeListOf<Element>, not Readonly
							linksWithTitles.forEach(
								(link: Readonly<Element>) => {
									const title = link
										.getAttribute('title')
										?.trim();
									const minTitleLength = 10;
									// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- title can be null/undefined/empty
									if (
										title !== null &&
										title !== undefined &&
										title !== '' &&
										title.length > minTitleLength
									) {
										titleTexts.push(title);
									}
								},
							);

							// Get text content
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null
							let mainText = clone.textContent?.trim() ?? '';

							// Append title attributes to the text (they contain important documentation)
							// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 0 is standard array length check
							if (titleTexts.length > 0) {
								mainText =
									mainText + '\n\n' + titleTexts.join('\n');
							}

							debugInfo.mainTextLength = mainText.length;
							const textPreviewLength = 300;
							// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 0 is standard substring start
							debugInfo.mainTextPreview = mainText.substring(
								0,
								textPreviewLength,
							);

							// Filter out JavaScript-like content
							const jsPatterns = [
								'function',
								'=>',
								'document.querySelector',
								'addEventListener',
								'fetch(',
								'const ',
								'let ',
								'var ',
							];
							const jsPatternCount = jsPatterns.filter(
								(pattern) => mainText.includes(pattern),
							).length;

							// If it looks like JavaScript code, try to extract only documentation parts
							const minJsPatternCount = 2;
							const minMainTextLengthForJs = 200;
							if (
								jsPatternCount > minJsPatternCount &&
								mainText.length > minMainTextLengthForJs
							) {
								// Extract only from paragraphs and text elements that don't look like code
								const paragraphs = clone.querySelectorAll(
									'p, div, span, li, td, th, dd, dt, h1, h2, h3, h4, h5, h6',
								);
								const docTexts: string[] = [];
								// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- querySelectorAll returns NodeListOf<Element>, not Readonly
								paragraphs.forEach((p: Readonly<Element>) => {
									// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null
									const text = p.textContent?.trim() ?? '';
									// Only include text that doesn't look like JavaScript
									const minTextLengthForDoc = 30;
									if (
										text.length > minTextLengthForDoc &&
										!text.includes('function') &&
										!text.includes('=>') &&
										!text.includes(
											'document.querySelector',
										) &&
										!text.includes('addEventListener') &&
										!text.includes('fetch(') &&
										!(
											text.includes('const ') &&
											text.includes('= document')
										) &&
										!text.includes('console.') &&
										!text.includes('window.')
									) {
										docTexts.push(text);
									}
								});
								// Also include title texts (they're documentation, not code)
								docTexts.push(...titleTexts);
								// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 0 is standard array length check
								if (docTexts.length > 0) {
									const filteredText = docTexts.join('\n\n');
									const minFilteredTextLength = 200;
									if (
										filteredText.length >
										minFilteredTextLength
									) {
										bestText = filteredText;
										bestLength = filteredText.length;
									}
								}
								// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-magic-numbers -- mainText can be empty string, 200 is minimum length threshold
							} else if (
								mainText !== null &&
								mainText !== undefined &&
								mainText !== '' &&
								mainText.length > 200
							) {
								// Check cookie content - be more lenient
								const cookieKeywords = [
									'cookie',
									'consent',
									'accept all',
									'do not accept',
								];
								const cookieTextCount = cookieKeywords.filter(
									(keyword) =>
										mainText
											.toLowerCase()
											.includes(keyword),
								).length;
								// Only reject if it's clearly just cookie text (high ratio and short)
								const minWordCountForRatio = 1;
								const cookieRatio =
									cookieTextCount /
									Math.max(
										minWordCountForRatio,
										mainText.split(/\s+/).length,
									);
								const maxCookieRatioForReject = 0.1;
								const minMainTextLengthForReject = 500;
								if (
									!(
										cookieRatio > maxCookieRatioForReject &&
										mainText.length <
											minMainTextLengthForReject
									)
								) {
									bestText = mainText;
									bestLength = mainText.length;
								}
							}
						}

						// Try to find all paragraphs and divs with substantial text
						const allParagraphs = doc.querySelectorAll(
							'p, div[class*="text"], div[class*="content"], div[class*="article"]',
						);
						debugInfo.paragraphCount = allParagraphs.length;
						const paragraphTexts = [];
						const maxParagraphs = 50;

						const paragraphLoopStart = 0;
						for (
							let i = paragraphLoopStart;
							i < Math.min(allParagraphs.length, maxParagraphs);
							i++
						) {
							const p = allParagraphs[i];
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null
							const text = p.textContent?.trim() ?? '';
							const minParagraphTextLength = 100;
							if (
								text.length > minParagraphTextLength &&
								!text.toLowerCase().includes('cookie') &&
								!text.toLowerCase().includes('consent')
							) {
								paragraphTexts.push(text);
							}
						}
						debugInfo.paragraphTextsCount = paragraphTexts.length;
						// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 0 is standard array length check
						if (paragraphTexts.length > 0) {
							const combinedParagraphText =
								paragraphTexts.join('\n\n');
							if (combinedParagraphText.length > bestLength) {
								bestText = combinedParagraphText;
								bestLength = combinedParagraphText.length;
							}
						}

						// Also try to collect all text elements (p, div, span, li, etc.) with substantial content
						// This helps capture content that might be in different structures
						const allTextElements = doc.querySelectorAll(
							'p, div, span, li, td, th, dd, dt, section, article',
						);
						const collectedTexts: string[] = [];
						const maxTextElementsCollect = 300;
						const textElementsLoopStart = 0;
						for (
							let i = textElementsLoopStart;
							i <
							Math.min(
								allTextElements.length,
								maxTextElementsCollect,
							);
							i++
						) {
							const el = allTextElements[i];
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null, but linter thinks it can't
							const text = el.textContent?.trim() ?? '';
							// Only collect substantial text that's not cookie-related and not already in bestText
							const minTextElementLength = 50;
							if (
								text.length > minTextElementLength &&
								!text.toLowerCase().includes('cookie') &&
								!text.toLowerCase().includes('consent') &&
								!text.toLowerCase().includes('accept all') &&
								!bestText.includes(text)
							) {
								// Check if this text is unique (not a substring of already collected text)
								const isUnique = !collectedTexts.some(
									(ct) =>
										ct.includes(text) || text.includes(ct),
								);
								if (isUnique) {
									collectedTexts.push(text);
								}
							}
						}

						// Combine collected texts
						// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 0 is standard array length check
						if (collectedTexts.length > 0) {
							const combinedText = collectedTexts.join('\n\n');
							if (combinedText.length > bestLength) {
								bestText = combinedText;
								bestLength = combinedText.length;
							}
						}

						// Also check specific selectors for additional content
						for (const selector of selectors) {
							const element = doc.querySelector(selector);
							if (element) {
								// Remove unwanted elements
								removeElements(
									element,
									'script, style, nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"], [class*="banner"], [id*="banner"]',
								);

								// Also remove iframes and other non-content elements
								removeElements(
									element,
									'iframe, noscript, [role="dialog"], [aria-label*="cookie"], [aria-label*="Cookie"], [class*="modal"], [class*="overlay"]',
								);

								// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null, but linter thinks it can't
								const text =
									element.textContent?.trim() ?? null;
								const minSelectorTextLength = 200;
								// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- text can be null/undefined/empty, but linter thinks it can't
								if (
									text !== null &&
									text !== undefined &&
									text !== '' &&
									text.length > minSelectorTextLength
								) {
									// Check if it's not just cookie consent text
									const cookieKeywords = [
										'cookie',
										'consent',
										'accept all',
										'do not accept',
									];
									const cookieTextCount =
										cookieKeywords.filter((keyword) =>
											text
												.toLowerCase()
												.includes(keyword),
										).length;

									// Only consider if it's not mostly cookie text (more than 2 keywords and short text)
									const maxCookieKeywordsForReject = 2;
									const minTextLengthForReject = 1000;
									if (
										!(
											cookieTextCount >
												maxCookieKeywordsForReject &&
											text.length < minTextLengthForReject
										)
									) {
										// Prefer longer content to ensure we get complete documentation
										if (text.length > bestLength) {
											bestText = text;
											bestLength = text.length;
										}
									}
								}
							}
						}

						// PRIORITY: If we found content in shadow DOM, use it immediately
						if (bodyContent) {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- cloneNode returns Node, but we know it's an Element
							const clone = bodyContent.cloneNode(
								true,
							) as Element;
							removeElements(
								clone,
								'script, style, noscript, iframe, svg, canvas, code, pre',
							);
							removeElements(
								clone,
								'nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"]',
							);
							// Extract title attributes from links
							const linksWithTitles =
								clone.querySelectorAll('a[title]');
							const titleTexts: string[] = [];
							// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- querySelectorAll returns NodeListOf<Element>, not Readonly
							linksWithTitles.forEach(
								(link: Readonly<Element>) => {
									const title = link
										.getAttribute('title')
										?.trim();
									const minTitleLengthForCollection = 10;
									// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- title can be null/undefined/empty, but linter thinks types have no overlap
									if (
										title !== null &&
										title !== undefined &&
										title !== '' &&
										title.length >
											minTitleLengthForCollection
									) {
										titleTexts.push(title);
									}
								},
							);
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null, but linter thinks it can't
							let shadowContent = clone.textContent?.trim() ?? '';
							// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 0 is standard array length check
							if (titleTexts.length > 0) {
								shadowContent =
									shadowContent +
									'\n\n' +
									titleTexts.join('\n');
							}
							const minShadowContentLength = 200;
							if (shadowContent.length > minShadowContentLength) {
								debugInfo.shadowDOMContentUsed = true;
								debugInfo.shadowDOMContentLength =
									shadowContent.length;
								return { content: shadowContent, debugInfo };
							}
						}

						// Also try contentContainer if bodyContent wasn't found
						if (contentContainer && !bodyContent) {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- cloneNode returns Node, but we know it's an Element
							const clone = contentContainer.cloneNode(
								true,
							) as Element;
							removeElements(
								clone,
								'script, style, noscript, iframe, svg, canvas, code, pre',
							);
							removeElements(
								clone,
								'nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"]',
							);
							// Extract title attributes from links
							const linksWithTitles =
								clone.querySelectorAll('a[title]');
							const titleTexts: string[] = [];
							// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- querySelectorAll returns NodeListOf<Element>, not Readonly
							linksWithTitles.forEach(
								(link: Readonly<Element>) => {
									const title = link
										.getAttribute('title')
										?.trim();
									const minTitleLengthForCollection = 10;
									// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- title can be null/undefined/empty, but linter thinks types have no overlap
									if (
										title !== null &&
										title !== undefined &&
										title !== '' &&
										title.length >
											minTitleLengthForCollection
									) {
										titleTexts.push(title);
									}
								},
							);
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null, but linter thinks it can't
							let shadowContent = clone.textContent?.trim() ?? '';
							// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 0 is standard array length check
							if (titleTexts.length > 0) {
								shadowContent =
									shadowContent +
									'\n\n' +
									titleTexts.join('\n');
							}
							const minShadowContentLength = 200;
							if (shadowContent.length > minShadowContentLength) {
								debugInfo.shadowDOMContentUsed = true;
								debugInfo.shadowDOMContentLength =
									shadowContent.length;
								return { content: shadowContent, debugInfo };
							}
						}

						// Return the best (longest) text found, or continue to fallback strategies
						const minBestTextLength = 0;
						if (bestText.length > minBestTextLength) {
							return { content: bestText, debugInfo };
						}

						// Fallback: try to get content from any element with substantial text
						const allElementsFallback = doc.querySelectorAll('*');
						const minFallbackTextLength = 500;
						for (const el of allElementsFallback) {
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null, but linter thinks it can't
							const text = el.textContent?.trim() ?? '';
							if (text.length > minFallbackTextLength) {
								// Check if it has actual content (not just cookie text)
								const cookieKeywords = [
									'cookie',
									'consent',
									'accept all',
									'do not accept',
								];
								const cookieTextCount = cookieKeywords.filter(
									(keyword) =>
										text.toLowerCase().includes(keyword),
								).length;

								// If it has substantial content and not mostly cookie text
								const maxCookieKeywordsForAccept = 3;
								const minTextLengthForAccept = 2000;
								if (
									cookieTextCount <
										maxCookieKeywordsForAccept ||
									text.length > minTextLengthForAccept
								) {
									// Remove unwanted elements from this element
									removeElements(
										el,
										'script, style, nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"]',
									);
									// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null, but linter thinks it can't
									const cleanText =
										el.textContent?.trim() ?? '';
									const minCleanTextLength = 500;
									if (cleanText.length > minCleanTextLength) {
										return {
											content: cleanText,
											debugInfo,
										};
									}
								}
							}
						}

						// Last resort: get body text but filter cookie content more aggressively
						const { body } = doc;
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- body can be null, but linter thinks it's always truthy
						if (body) {
							// Remove all unwanted elements more aggressively
							removeElements(
								body,
								'script, style, nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"], [class*="banner"], [id*="banner"], iframe, noscript, [role="dialog"], [class*="modal"], [class*="overlay"], [class*="dialog"]',
							);

							// Try to find and extract from main content areas
							// Collect all candidates and prefer the longest
							let bestMainText = '';
							let bestMainLength = 0;
							const mainSelectors = [
								'main',
								'[role="main"]',
								'article',
								'.main-content',
								'#main',
								'[id*="content"]',
								'[class*="content"]',
							];
							for (const sel of mainSelectors) {
								const mainElBody = body.querySelector(sel);
								if (mainElBody) {
									removeElements(
										mainElBody,
										'script, style, nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"]',
									);
									// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null, but linter thinks it can't
									const mainText =
										mainElBody.textContent?.trim() ?? '';
									const minMainElBodyTextLength = 1000;
									if (
										mainText.length >
										minMainElBodyTextLength
									) {
										// Check cookie content ratio
										const cookieMatches = (
											mainText.match(
												/cookie|consent|accept all/gi,
											) ?? []
										).length;
										const wordCount =
											mainText.split(/\s+/).length;
										const cookieRatio =
											cookieMatches / wordCount;

										// If less than 5% cookie-related words, it's likely real content
										const maxCookieRatioValue = 0.05;
										const minMainTextLengthValue = 5000;
										if (
											cookieRatio < maxCookieRatioValue ||
											mainText.length >
												minMainTextLengthValue
										) {
											// Prefer longer content
											if (
												mainText.length > bestMainLength
											) {
												bestMainText = mainText;
												bestMainLength =
													mainText.length;
											}
										}
									}
								}
							}

							const minBestMainTextLength = 0;
							if (bestMainText.length > minBestMainTextLength) {
								return { content: bestMainText, debugInfo };
							}

							// Get all body text - be less aggressive with filtering
							// Just remove unwanted elements and return the text
							// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- cloneNode returns Node, but we know it's an Element
							const bodyClone = body.cloneNode(true) as Element;
							// Aggressively remove all non-content elements including scripts, styles, and code blocks
							removeElements(
								bodyClone,
								'script, style, noscript, iframe, svg, canvas, nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"], [class*="banner"], [id*="banner"], [role="dialog"], [class*="modal"], [class*="overlay"], [class*="dialog"], [class*="nav"], [class*="menu"], [class*="sidebar"], code, pre, [onclick], [onload], [onerror]',
							);
							// Also manually remove any remaining script-like elements by checking their content
							const allBodyElements =
								bodyClone.querySelectorAll('*');
							// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Element.remove() mutates the element
							allBodyElements.forEach((el: Element) => {
								// Remove elements that look like scripts or contain JavaScript
								// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Element can be cast to HTMLElement for event handler checks
								const htmlEl = el as HTMLElement;
								if (
									el.tagName === 'SCRIPT' ||
									el.tagName === 'STYLE' ||
									htmlEl.onclick ||
									htmlEl.onload ||
									htmlEl.onerror ||
									(el.textContent &&
										((el.textContent.includes('function') &&
											el.textContent.includes('=>')) ||
											el.textContent.includes(
												'document.querySelector',
											) ||
											el.textContent.includes(
												'addEventListener',
											) ||
											el.textContent.includes('fetch(') ||
											(el.textContent.includes(
												'const ',
											) &&
												el.textContent.includes(
													'= document',
												))))
								) {
									el.remove();
								}
							});
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null, but linter thinks it can't
							const bodyText =
								bodyClone.textContent?.trim() ?? '';

							// Filter out JavaScript-like content from the text itself
							// If the text contains too much JavaScript syntax, it's likely script content
							const jsPatterns = [
								'function',
								'=>',
								'document.querySelector',
								'addEventListener',
								'fetch(',
								'const ',
								'let ',
								'var ',
							];
							const jsPatternCount = jsPatterns.filter(
								(pattern) => bodyText.includes(pattern),
							).length;
							// If more than 2 JS patterns found, it's likely script content - try to extract only documentation parts
							const maxJsPatternCountForFilter = 2;
							if (jsPatternCount > maxJsPatternCountForFilter) {
								// Try to extract only paragraphs and text nodes that don't look like code
								const paragraphs = bodyClone.querySelectorAll(
									'p, div, span, li, td, th, dd, dt',
								);
								const docTexts: string[] = [];
								// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- querySelectorAll returns NodeListOf<Element>, not Readonly
								paragraphs.forEach((p: Readonly<Element>) => {
									// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null
									const text = p.textContent?.trim() ?? '';
									// Only include text that doesn't look like JavaScript
									const minParagraphTextLengthForDoc = 50;
									if (
										text.length >
											minParagraphTextLengthForDoc &&
										!text.includes('function') &&
										!text.includes('=>') &&
										!text.includes(
											'document.querySelector',
										) &&
										!text.includes('addEventListener') &&
										!text.includes('fetch(') &&
										!(
											text.includes('const ') &&
											text.includes('= document')
										)
									) {
										docTexts.push(text);
									}
								});
								// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 0 is standard array length check
								if (docTexts.length > 0) {
									return {
										content: docTexts.join('\n\n'),
										debugInfo,
									};
								}
							}

							// If we have substantial text, return it (even if it has some cookie text)
							// The filtering above should have removed most cookie banners
							const minBodyTextLength = 500;
							if (bodyText.length > minBodyTextLength) {
								// Only filter out if it's clearly just cookie consent (very high ratio)
								const cookieMatches = (
									bodyText.match(
										/cookie|consent|accept all/gi,
									) ?? []
								).length;
								const wordCount = bodyText.split(/\s+/).length;

								const cookieRatioDefault = 0;

								const minWordCountForRatio = 0;
								const cookieRatio =
									wordCount > minWordCountForRatio
										? cookieMatches / wordCount
										: cookieRatioDefault;

								// Return if it's not mostly cookies (less than 20% cookie-related words)
								const maxCookieRatioForAccept = 0.2;
								const minBodyTextLengthForAccept = 5000;
								if (
									cookieRatio < maxCookieRatioForAccept ||
									bodyText.length > minBodyTextLengthForAccept
								) {
									return { content: bodyText, debugInfo };
								}
							}
						}

						// Last resort: return whatever body text we have
						// Clone body and remove scripts/styles, then get text
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- doc.body can be null, but linter thinks it's always truthy
						if (doc.body) {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- cloneNode returns Node, but we know it's an Element
							const bodyClone = doc.body.cloneNode(
								true,
							) as Element;
							// Remove non-content elements but be less aggressive
							removeElements(
								bodyClone,
								'script, style, noscript, iframe, svg, canvas',
							);
							removeElements(
								bodyClone,
								'nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"], [class*="banner"], [id*="banner"]',
							);
							removeElements(
								bodyClone,
								'[role="dialog"], [class*="modal"], [class*="overlay"], [class*="dialog"]',
							);
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null, but linter thinks it can't
							const lastResortText =
								bodyClone.textContent?.trim() ?? '';
							// Return if we have any substantial text
							const minLastResortTextLength = 100;
							if (
								lastResortText.length > minLastResortTextLength
							) {
								return { content: lastResortText, debugInfo };
							}
						}

						// Absolute last resort: return body text as-is (might include scripts but better than nothing)
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- doc.body can be null, but linter thinks it's always truthy
						if (doc.body) {
							// Try to get text from body, but filter out obvious script content
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null, but linter thinks it can't
							const rawBodyText =
								doc.body.textContent?.trim() ?? '';
							// Check if it looks like mostly code/scripts (high ratio of special chars)
							const codeCharCount = (
								rawBodyText.match(/[{}();=]/g) ?? []
							).length;
							const totalChars = rawBodyText.length;

							const codeRatioDefault = 0;
							// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 0 is standard comparison value
							const codeRatio =
								totalChars > 0
									? codeCharCount / totalChars
									: codeRatioDefault;

							// If it doesn't look like mostly code, return it
							const minRawBodyTextLength = 100;
							const maxCodeRatio = 0.1;
							if (
								rawBodyText.length > minRawBodyTextLength &&
								codeRatio < maxCodeRatio
							) {
								return { content: rawBodyText, debugInfo };
							}
						}

						return { content: '', debugInfo };
					}),
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
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- evalResult is any from page.evaluate, content can be null/undefined
					content = evalResult.content ?? '';
					// Log debug info to see what happened with shadow DOM
				} else {
					// Fallback: treat as string (old format for compatibility)
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-unnecessary-condition -- evalResult is any from page.evaluate
					content = (evalResult as string) ?? '';
				}
			} catch {
				content = '';
			}

			// If content is empty or too short, try fallback extraction
			const minContentLength = 100;
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- content can be null/undefined/empty, but linter thinks types have no overlap
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
							page.evaluate(() => {
								const { body } = document;
								// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- body can be null, but linter thinks it's always truthy
								if (body) {
									// Clone body to avoid modifying original
									// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- cloneNode returns Node, but we know it's an Element
									const clone = body.cloneNode(
										true,
									) as Element;
									// Remove unwanted elements
									const unwanted = clone.querySelectorAll(
										'script, style, noscript, iframe, svg, canvas, nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"], [class*="banner"], [id*="banner"], [role="dialog"], [class*="modal"], [class*="overlay"]',
									);
									// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Element.remove() mutates the element
									unwanted.forEach((el: Element) => {
										el.remove();
									});
									// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent can be null, but linter thinks it can't
									return clone.textContent?.trim() ?? '';
								}
								return '';
							}),
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
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-magic-numbers -- fallbackContent is any from page.evaluate, content can be null, 0 is default
							fallbackContent.length > (content?.length ?? 0)
						) {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- fallbackContent is any from page.evaluate
							content = fallbackContent;
						}
					} catch {}
				}
			}

			// Debug: Log content length for troubleshooting
			const minContentLengthForRetry = 50;
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- content can be null/undefined/empty, but linter thinks types have no overlap
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
				const retryContent = await page.evaluate(() => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-unsafe-member-access -- DOM API in browser context
					const doc = (globalThis as any).document;

					// Try to get all text content, filtering out cookie content
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- DOM API
					const { body } = doc;
					// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- body can be null
					if (body) {
						// Remove all unwanted elements
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- DOM API
						const unwanted = body.querySelectorAll(
							'script, style, nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"], [class*="banner"], [id*="banner"], iframe, noscript, [role="dialog"]',
						);
						// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- Element.remove() mutates the element, DOM API
						unwanted.forEach((el: Element) => {
							el.remove();
						});

						// Get all text nodes
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- DOM API
						const walker = doc.createTreeWalker(
							body,
							NodeFilter.SHOW_TEXT,
						);
						const textParts: string[] = [];

						let node: Node | null = null;

						// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- DOM API
						while ((node = walker.nextNode())) {
							const text = node.textContent?.trim();
							const minTextNodeLength = 10;
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- text can be null/undefined, but linter thinks it can't
							if (
								text !== null &&
								text !== undefined &&
								text !== '' &&
								text.length > minTextNodeLength
							) {
								// Filter out cookie-related text

								const lowerText = text.toLowerCase();
								if (
									!lowerText.includes('cookie') &&
									!lowerText.includes('consent') &&
									!lowerText.includes('accept all')
								) {
									textParts.push(text);
								}
							}
						}

						const fullText = textParts.join(' ').trim();
						const minFullTextLength = 200;
						if (fullText.length > minFullTextLength) {
							return fullText;
						}
					}

					return '';
				});

				const minRetryContentLength = 200;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- retryContent is any from page.evaluate, can be null/undefined/empty
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
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- content can be null/undefined/empty, but linter thinks types have no overlap
					if (
						content === null ||
						content === undefined ||
						content === '' ||
						content.length < minContentLengthForError
					) {
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-magic-numbers -- content can be null, 0 is default, optional chain needed
						const contentLength = content?.length ?? 0;
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-magic-numbers -- retryContent is any from page.evaluate, can be null, 0 is default
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

export { searchSalesforceHelp, crawlSalesforcePage };
