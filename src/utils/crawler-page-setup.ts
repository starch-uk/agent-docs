/**
 * @file Page setup utilities for Salesforce Help pages (cookie handling, content waiting).
 */

/* v8 ignore file -- Browser-side code in page.evaluate() cannot be unit tested in Node.js */

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- DOM API types and Playwright types cannot be made readonly */
/* eslint-disable @typescript-eslint/no-unnecessary-condition -- Runtime checks needed for DOM API nullability */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Magic numbers are used for timeouts, lengths, and DOM operations */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- page.evaluate returns any type from browser context */

/**
 * Page type for cookie handling and content waiting.
 */
type Page = {
	goto: (
		url: Readonly<string>,
		options?: Readonly<{
			timeout?: number;
			waitUntil?: 'commit' | 'domcontentloaded' | 'load' | 'networkidle';
		}>,
	) => Promise<unknown>;
	waitForSelector: (
		selector: Readonly<string>,
		options?: Readonly<{ timeout?: number }>,
	) => Promise<unknown>;
	evaluate: (...args: any[]) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any -- page.evaluate has overloaded signatures that TypeScript can't express cleanly
	isClosed: () => boolean;
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
	waitForFunction: (
		fn: () => boolean,
		options?: Readonly<{ timeout?: number }>,
	) => Promise<unknown>;
};

/**
 * Timeout constants for page setup.
 */
type TimeoutConstants = Readonly<{
	buttonClickTimeoutMs: number;
	buttonClickWaitMs: number;
	clickTimeoutMs: number;
	closeButtonTimeoutMs: number;
	contentWaitMs: number;
	cookieBannerWaitMs: number;
	cookieClickWaitMs: number;
	finalWaitMs: number;
	longWaitMs: number;
	navigationTimeoutMs: number;
	pageInitWaitMs: number;
	scrollBackWaitMs: number;
	scrollCount: number;
	scrollDivisor: number;
	scrollWaitMs: number;
}>;

/**
 * Handle cookie consent banner if present.
 * @param page - Playwright page object.
 * @param timeouts - Timeout constants.
 */
async function handleCookieConsent(
	page: Page,
	timeouts: TimeoutConstants,
): Promise<void> {
	// Handle cookie consent if present - try multiple strategies
	try {
		// Wait a bit for cookie banner to appear - use setTimeout instead of page.waitForTimeout
		await new Promise((resolve) =>
			setTimeout(resolve, timeouts.cookieBannerWaitMs),
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

				if (acceptButton !== null && acceptButton !== undefined) {
					// Add timeout to click to avoid hanging
					try {
						await Promise.race([
							acceptButton.click({
								timeout: timeouts.clickTimeoutMs,
							}),
							new Promise((_, reject) =>
								setTimeout(() => {
									reject(new Error('Click timeout'));
								}, timeouts.clickTimeoutMs),
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
							setTimeout(resolve, timeouts.cookieClickWaitMs),
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
						const button = (buttons as readonly unknown[])[i] as {
							readonly isVisible: () => Promise<boolean>;
							readonly textContent: () => Promise<string | null>;
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
								}, timeouts.buttonClickWaitMs),
							),
						]).catch(() => false);

						if (!isVisible) continue;

						const text = await Promise.race([
							button.textContent(),
							new Promise<string | null>((resolve) =>
								setTimeout(() => {
									resolve(null);
								}, timeouts.buttonClickWaitMs),
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
									timeout: timeouts.buttonClickTimeoutMs,
								}),
								new Promise((_, reject) =>
									setTimeout(() => {
										reject(new Error('Click timeout'));
									}, timeouts.buttonClickTimeoutMs),
								),
							]).catch(() => {
								// Intentionally ignore click errors
							});
							cookieHandled = true;
							await new Promise((resolve) =>
								setTimeout(resolve, timeouts.buttonClickWaitMs),
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
						}, timeouts.clickTimeoutMs),
					),
				]).catch(() => []);
				const closeButtonsLoopStart = 0;

				for (
					let i = closeButtonsLoopStart;
					i < (closeButtons as { readonly length: number }).length;
					i++
				) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- closeButtons is array-like from Playwright
					const btn = (closeButtons as readonly unknown[])[i] as {
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
								}, timeouts.buttonClickWaitMs),
							),
						]).catch(() => false);
						if (!isVisible) {
							continue;
						}
						// Wrap click with timeout to prevent hanging

						await Promise.race([
							btn.click({
								timeout: timeouts.buttonClickTimeoutMs,
							}),
							new Promise((_, reject) =>
								setTimeout(() => {
									reject(
										new Error('Close button click timeout'),
									);
								}, timeouts.closeButtonTimeoutMs),
							),
						]);
						await new Promise((resolve) =>
							setTimeout(resolve, timeouts.buttonClickWaitMs),
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
			setTimeout(resolve, timeouts.scrollWaitMs),
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
			setTimeout(resolve, timeouts.buttonClickWaitMs),
		);
	} catch {
		// Cookie consent not present or already handled
	}
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
 * Setup page: navigate, handle cookies, and wait for content.
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

	// Handle cookie consent
	await handleCookieConsent(page, timeouts);

	// Wait for content
	await waitForContent(page, timeouts);
}

export { setupPage, type Page, type TimeoutConstants };
