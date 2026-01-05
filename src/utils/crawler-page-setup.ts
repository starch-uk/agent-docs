/**
 * @file Page setup utilities for Salesforce Help pages (content waiting).
 */

/* v8 ignore file -- Browser-side code in page.evaluate() cannot be unit tested in Node.js */

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- DOM API types and Playwright types cannot be made readonly */
/* eslint-disable @typescript-eslint/no-unnecessary-condition -- Runtime checks needed for DOM API nullability */

/**
 * Page type for content waiting.
 */
interface Page {
	$: (selector: Readonly<string>) => Promise<{
		click: (options?: Readonly<{ timeout?: number }>) => Promise<unknown>;
	} | null>;
	$$: (selector: Readonly<string>) => Promise<
		{
			click: (
				options?: Readonly<{ timeout?: number }>,
			) => Promise<unknown>;
		}[]
	>;
	evaluate: (...args: any[]) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any -- page.evaluate has overloaded signatures that TypeScript can't express cleanly
	goto: (
		url: Readonly<string>,
		options?: Readonly<{
			timeout?: number;
			waitUntil?: 'commit' | 'domcontentloaded' | 'load' | 'networkidle';
		}>,
	) => Promise<unknown>;
	isClosed: () => boolean;
	waitForFunction: (
		fn: () => boolean,
		options?: Readonly<{ timeout?: number }>,
	) => Promise<unknown>;
	waitForSelector: (
		selector: Readonly<string>,
		options?: Readonly<{ timeout?: number }>,
	) => Promise<unknown>;
}

/**
 * Timeout constants for page setup.
 */
interface TimeoutConstants {
	buttonClickTimeoutMs: number;
	buttonClickWaitMs: number;
	clickTimeoutMs: number;
	closeButtonTimeoutMs: number;
	contentWaitMs: number;
	finalWaitMs: number;
	longWaitMs: number;
	navigationTimeoutMs: number;
	pageInitWaitMs: number;
	scrollBackWaitMs: number;
	scrollCount: number;
	scrollDivisor: number;
	scrollWaitMs: number;
}

/**
 * Wait for content to load and scroll to trigger lazy loading.
 * @param page - Playwright page object.
 * @param timeouts - Timeout constants.
 */
async function waitForContent(
	page: Page,
	timeouts: TimeoutConstants,
): Promise<void> {
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
	for (let i = contentSelectorsLoopStart; i < contentSelectors.length; i++) {
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
										contentContainer.querySelector('.body');
									const target =
										bodyContent ?? contentContainer;
									// target is always truthy here since we checked contentContainer !== null and bodyContent ?? contentContainer will never be null
									// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- cloneNode returns Node, but we know it's an Element
									const clone = target.cloneNode(
										true,
									) as Element;
									const scripts = clone.querySelectorAll(
										'script, style, noscript',
									);

									scripts.forEach((el: Element) => {
										el.remove();
									});
									const { textContent: textContentValue } =
										clone;

									const text = (
										textContentValue ?? ''
									).trim();
									// Wait for at least 1000 characters of actual content
									const minContentLength = 1000;
									return text.length > minContentLength;
								}
								// Fallback to main element
								const main =
									document.querySelector('[role="main"]') ??
									document.querySelector('main');
								if (main !== null) {
									// Clone and remove scripts to get actual content length
									// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- cloneNode returns Node, but we know it's an Element
									const clone = main.cloneNode(
										true,
									) as Element;
									const scripts = clone.querySelectorAll(
										'script, style, noscript',
									);

									scripts.forEach((el: Element) => {
										el.remove();
									});
									const {
										textContent: textContentMainValue,
									} = clone;

									const text = (
										textContentMainValue ?? ''
									).trim();
									// Wait for at least 2000 characters of actual content
									const minMainContentLength = 2000;
									return text.length > minMainContentLength;
								}
								return false;
							},
							{ timeout: timeouts.longWaitMs },
						)

						.catch(() => {
							// Intentionally ignore timeout errors
						}),
					new Promise((resolve) =>
						setTimeout(resolve, timeouts.longWaitMs),
					),
				]);
			}
		} catch {
			// Continue
		}

		// Scroll through the page multiple times to trigger lazy loading
		const scrollStart = 0;
		for (
			let scroll = scrollStart;
			scroll < timeouts.scrollCount;
			scroll++
		) {
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
								(document.body.scrollHeight / args.divisor) *
									(args.scrollIndex + scrollIndexOffsetValue),
							);
						},
						{
							divisor: timeouts.scrollDivisor,
							scrollIndex: scroll,
						},
					);
					await new Promise((resolve) =>
						setTimeout(resolve, timeouts.scrollBackWaitMs),
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
			setTimeout(resolve, timeouts.contentWaitMs),
		);
	} else {
		// Even if no specific selector found, wait for page to stabilize
		await new Promise((resolve) =>
			setTimeout(resolve, timeouts.finalWaitMs),
		);
	}
}

/**
 * Setup page: navigate and wait for content.
 * @param page - Playwright page object.
 * @param url - URL to navigate to.
 * @param timeouts - Timeout constants.
 */
async function setupPage(
	page: Page,
	url: Readonly<string>,
	timeouts: TimeoutConstants,
): Promise<void> {
	// Navigate to page - use domcontentloaded to avoid hanging
	await page.goto(url, {
		timeout: timeouts.navigationTimeoutMs,
		waitUntil: 'domcontentloaded',
	});

	// Additional wait for page to fully initialize - use setTimeout instead of page.waitForTimeout
	await new Promise((resolve) =>
		setTimeout(resolve, timeouts.pageInitWaitMs),
	);

	// Wait for content
	await waitForContent(page, timeouts);
}

export { setupPage, type Page, type TimeoutConstants };
