/**
 * @file Fallback content extraction logic for Salesforce Help pages.
 * This code runs inside page.evaluate() in the browser context.
 */

/* v8 ignore file -- Browser-side code in page.evaluate() cannot be unit tested in Node.js */

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- DOM API types cannot be made readonly */
/* eslint-disable @typescript-eslint/no-unnecessary-condition -- Runtime checks needed for DOM API nullability */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion -- DOM API types require assertions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- page.evaluate returns any type from browser context */

/**
 * Fallback content extraction function that runs in browser context.
 * This function is stringified and injected into page.evaluate().
 * @returns Extracted content string.
 */
function extractFallbackContent(): string {
	const { body } = document;
	if (body !== null && body !== undefined) {
		// Clone body to avoid modifying original
		const clone = body.cloneNode(true) as Element;
		// Remove unwanted elements
		const unwanted = clone.querySelectorAll(
			'script, style, noscript, iframe, svg, canvas, nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"], [class*="banner"], [id*="banner"], [role="dialog"], [class*="modal"], [class*="overlay"]',
		);

		unwanted.forEach((el: Element) => {
			el.remove();
		});

		return clone.textContent?.trim() ?? '';
	}
	return '';
}

/**
 * Retry content extraction function that runs in browser context.
 * This function is stringified and injected into page.evaluate().
 * @returns Extracted content string.
 */
function extractRetryContent(): string {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment -- DOM API in browser context
	const doc = (globalThis as any).document;

	// Try to get all text content, filtering out cookie content
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- DOM API
	const { body } = doc;
	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- body can be null
	if (body) {
		// Remove all unwanted elements
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call -- DOM API
		const unwanted = body.querySelectorAll(
			'script, style, nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"], [class*="banner"], [id*="banner"], iframe, noscript, [role="dialog"]',
		);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call -- Element.remove() mutates the element, DOM API
		unwanted.forEach((el: Element) => {
			el.remove();
		});

		// Get all text nodes
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call -- DOM API
		const walker = doc.createTreeWalker(body, NodeFilter.SHOW_TEXT);
		const textParts: string[] = [];

		let node: Node | null = null;

		// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call -- DOM API
		while ((node = walker.nextNode())) {
			const text = node.textContent?.trim();
			const minTextNodeLength = 10;

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
}

export { extractFallbackContent, extractRetryContent };
