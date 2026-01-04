/**
 * @file Fallback functions for DOM content extraction.
 * These functions try alternative strategies when primary extraction fails.
 */

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- DOM API types cannot be made readonly */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Magic numbers are used for lengths and DOM operations */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion -- DOM API types require assertions */

import { removeElements } from './extract-content-helpers.js';

/**
 * Try to extract content from any element using fallback strategy.
 * @param doc - Document to search.
 * @param debugInfo - Debug info object to update.
 * @returns Extracted content or null if not found.
 */
function tryFallbackContentExtraction(
	doc: Document,
	debugInfo: Record<string, unknown>,
): { content: string; debugInfo: Record<string, unknown> } | null {
	const allElementsFallback = doc.querySelectorAll('*');
	const minFallbackTextLength = 500;
	for (const el of allElementsFallback) {
		// textContent is always a string in DOM (never null for Element types)
		const text = el.textContent.trim();
		if (text.length > minFallbackTextLength) {
			// Check if it has actual content (not just cookie text)
			const cookieKeywords = [
				'cookie',
				'consent',
				'accept all',
				'do not accept',
			];
			const cookieTextCount = cookieKeywords.filter((keyword) =>
				text.toLowerCase().includes(keyword),
			).length;

			// If it has substantial content and not mostly cookie text
			const maxCookieKeywordsForAccept = 3;
			const minTextLengthForAccept = 2000;
			if (
				cookieTextCount < maxCookieKeywordsForAccept ||
				text.length > minTextLengthForAccept
			) {
				// Remove unwanted elements from this element
				removeElements(
					el,
					'script, style, nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"]',
				);

				// textContent is always a string in DOM (never null for Element types)
				const cleanText = el.textContent.trim();
				const minCleanTextLength = 500;
				if (cleanText.length > minCleanTextLength) {
					return { content: cleanText, debugInfo };
				}
			}
		}
	}
	return null;
}

/**
 * Try to extract content from body text, checking cookie ratio.
 * @param bodyText - Body text to check.
 * @param debugInfo - Debug info object to update.
 * @returns Extracted content or null if not suitable.
 */
function tryBodyTextContent(
	bodyText: string,
	debugInfo: Record<string, unknown>,
): { content: string; debugInfo: Record<string, unknown> } | null {
	const minBodyTextLength = 500;
	if (bodyText.length > minBodyTextLength) {
		// Only filter out if it's clearly just cookie consent (very high ratio)
		const cookieMatches = (
			bodyText.match(/cookie|consent|accept all/gi) ?? []
		).length;
		const wordCount = bodyText.split(/\s+/).length;

		// wordCount is always > 0 when bodyText.length > 500, so we can simplify
		const cookieRatio = cookieMatches / Math.max(1, wordCount);

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
	return null;
}

/**
 * Try to extract content from last resort body clone.
 * @param body - Body element to clone and process.
 * @param debugInfo - Debug info object to update.
 * @returns Extracted content or null if not suitable.
 */
function tryLastResortBodyText(
	body: HTMLBodyElement,
	debugInfo: Record<string, unknown>,
): { content: string; debugInfo: Record<string, unknown> } | null {
	// Clone body and remove scripts/styles, then get text
	const lastResortBodyClone = body.cloneNode(true) as Element;
	removeElements(
		lastResortBodyClone,
		'script, style, noscript, iframe, svg, canvas, nav, footer, header',
	);
	// textContent is always a string in DOM (never null for Element types)
	const lastResortText = lastResortBodyClone.textContent.trim();
	const minLastResortTextLength = 100;
	if (lastResortText.length > minLastResortTextLength) {
		// Check code ratio - if it's mostly code, don't return it
		const codeCharCount = (lastResortText.match(/[{}();=]/g) ?? []).length;
		// lastResortText.length is always > 0 when lastResortText.length > 100, so we can simplify
		const codeRatio = codeCharCount / Math.max(1, lastResortText.length);
		const maxCodeRatio = 0.1;
		if (codeRatio < maxCodeRatio) {
			return { content: lastResortText, debugInfo };
		}
	}
	return null;
}

/**
 * Process main selectors to find the best main content.
 * @param body - Body element to search in.
 * @param debugInfo - Debug info object to update.
 * @returns Extracted content or null if not found.
 */
function processMainSelectors(
	body: HTMLBodyElement,
	debugInfo: Record<string, unknown>,
): { content: string; debugInfo: Record<string, unknown> } | null {
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

			// textContent is always a string in DOM (never null for Element types)
			const mainText = mainElBody.textContent.trim();
			const minMainElBodyTextLength = 1000;
			if (mainText.length > minMainElBodyTextLength) {
				// Check cookie content ratio
				// match() returns null when no matches - handle both cases to cover branch
				const matchResult = mainText.match(
					/cookie|consent|accept all/gi,
				);
				const cookieMatches = matchResult ? matchResult.length : 0;
				const wordCount = mainText.split(/\s+/).length;
				const cookieRatio = cookieMatches / wordCount;

				// If less than 5% cookie-related words, it's likely real content
				const maxCookieRatioValue = 0.05;
				if (cookieRatio < maxCookieRatioValue) {
					// Prefer longer content
					if (mainText.length > bestMainLength) {
						bestMainText = mainText;
						bestMainLength = mainText.length;
					}
				}
			}
		}
	}

	const minBestMainTextLength = 0;
	if (bestMainText.length > minBestMainTextLength) {
		return { content: bestMainText, debugInfo };
	}
	return null;
}

/**
 * Try to extract content from raw body text.
 * @param body - Body element to get text from.
 * @param debugInfo - Debug info object to update.
 * @returns Extracted content or null if not suitable.
 */
function tryRawBodyText(
	body: HTMLBodyElement,
	debugInfo: Record<string, unknown>,
): { content: string; debugInfo: Record<string, unknown> } | null {
	// textContent is always a string in DOM (never null for Element types)
	const rawBodyText = body.textContent.trim();
	const minRawBodyTextLength = 100;
	if (rawBodyText.length > minRawBodyTextLength) {
		// Check code ratio - if it's mostly code, don't return it
		const codeCharCount = (rawBodyText.match(/[{}();=]/g) ?? []).length;
		const totalChars = rawBodyText.length;
		// totalChars is always > 0 when rawBodyText.length > 100, so we can simplify
		const codeRatio = codeCharCount / Math.max(1, totalChars);

		// If it doesn't look like mostly code, return it
		const maxCodeRatio = 0.1;
		if (codeRatio < maxCodeRatio) {
			return { content: rawBodyText, debugInfo };
		}
	}
	return null;
}

export {
	processMainSelectors,
	tryBodyTextContent,
	tryFallbackContentExtraction,
	tryLastResortBodyText,
	tryRawBodyText,
};
