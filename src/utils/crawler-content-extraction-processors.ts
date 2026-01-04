/**
 * @file Processor functions for browser-side content extraction.
 * These functions process elements to extract content.
 */

/* v8 ignore file -- Browser-side code in page.evaluate() cannot be unit tested in Node.js */

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- DOM API types cannot be made readonly */
/* eslint-disable @typescript-eslint/no-unnecessary-condition -- Runtime checks needed for DOM API nullability */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Magic numbers are used for lengths and DOM operations */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion -- DOM API types require assertions */

import {
	findInShadowDOM,
	removeElements,
	extractLinkTitles,
} from './crawler-content-extraction-helpers.js';

/**
 * Process main element to extract content.
 * @param mainElement - Main element to process.
 * @param debugInfo - Debug info object to update.
 * @returns Object with bestText and bestLength, or null if no suitable content found.
 */
export function processMainElementContent(
	mainElement: Element,
	debugInfo: Record<string, unknown>,
): { bestText: string; bestLength: number } | null {
	// Clone to avoid modifying original
	const clone = mainElement.cloneNode(true) as Element;
	// Aggressively remove ALL scripts, styles, and non-content elements FIRST
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
	const allElementsClone = clone.querySelectorAll('*');

	allElementsClone.forEach((el: Element) => {
		// Remove elements with event handlers or script-like content
		const className = el.className ?? '';
		const classStr = typeof className === 'string' ? className : '';
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

	// Extract title attributes from links
	const titleTexts = extractLinkTitles(clone);

	// Get text content
	let mainText = clone.textContent?.trim() ?? '';

	// Append title attributes to the text (they contain important documentation)
	if (titleTexts.length > 0) {
		mainText = mainText + '\n\n' + titleTexts.join('\n');
	}

	debugInfo.mainTextLength = mainText.length;
	const textPreviewLength = 300;
	debugInfo.mainTextPreview = mainText.substring(0, textPreviewLength);

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
	const jsPatternCount = jsPatterns.filter((pattern) =>
		mainText.includes(pattern),
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

		paragraphs.forEach((p: Readonly<Element>) => {
			const text = p.textContent?.trim() ?? '';
			// Only include text that doesn't look like JavaScript
			const minTextLengthForDoc = 30;
			if (
				text.length > minTextLengthForDoc &&
				!text.includes('function') &&
				!text.includes('=>') &&
				!text.includes('document.querySelector') &&
				!text.includes('addEventListener') &&
				!text.includes('fetch(') &&
				!(text.includes('const ') && text.includes('= document')) &&
				!text.includes('console.') &&
				!text.includes('window.')
			) {
				docTexts.push(text);
			}
		});
		// Also include title texts (they're documentation, not code)
		docTexts.push(...titleTexts);

		if (docTexts.length > 0) {
			const filteredText = docTexts.join('\n\n');
			const minFilteredTextLength = 200;
			if (filteredText.length > minFilteredTextLength) {
				return {
					bestLength: filteredText.length,
					bestText: filteredText,
				};
			}
		}
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
		const cookieTextCount = cookieKeywords.filter((keyword) =>
			mainText.toLowerCase().includes(keyword),
		).length;
		// Only reject if it's clearly just cookie text (high ratio and short)
		const minWordCountForRatio = 1;
		const cookieRatio =
			cookieTextCount /
			Math.max(minWordCountForRatio, mainText.split(/\s+/).length);
		const maxCookieRatioForReject = 0.1;
		const minMainTextLengthForReject = 500;
		if (
			!(
				cookieRatio > maxCookieRatioForReject &&
				mainText.length < minMainTextLengthForReject
			)
		) {
			return {
				bestLength: mainText.length,
				bestText: mainText,
			};
		}
	}

	return null;
}

/**
 * Extract content from shadow DOM element.
 * @param element - Element to extract content from.
 * @param debugInfo - Debug info object to update.
 * @returns Extracted content or null if not sufficient.
 */
export function extractShadowDOMContent(
	element: Element,
	debugInfo: Record<string, unknown>,
): string | null {
	const clone = element.cloneNode(true) as Element;
	removeElements(
		clone,
		'script, style, noscript, iframe, svg, canvas, code, pre',
	);
	removeElements(
		clone,
		'nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"]',
	);
	// Extract title attributes from links
	const titleTexts = extractLinkTitles(clone);

	let shadowContent = clone.textContent?.trim() ?? '';

	if (titleTexts.length > 0) {
		shadowContent = shadowContent + '\n\n' + titleTexts.join('\n');
	}
	const minShadowContentLength = 200;
	if (shadowContent.length > minShadowContentLength) {
		debugInfo.shadowDOMContentUsed = true;
		debugInfo.shadowDOMContentLength = shadowContent.length;
		return shadowContent;
	}
	return null;
}

/**
 * Try to extract content from any element with substantial text (fallback strategy).
 * @param doc - Document to search in.
 * @param debugInfo - Debug info object.
 * @returns Extracted content or null if not found.
 */
export function tryFallbackElementExtraction(
	doc: Document,
	debugInfo: Record<string, unknown>,
): { content: string; debugInfo: Record<string, unknown> } | null {
	const allElementsFallback = doc.querySelectorAll('*');
	const minFallbackTextLength = 500;
	for (const el of allElementsFallback) {
		const text = el.textContent?.trim() ?? '';
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

				const cleanText = el.textContent?.trim() ?? '';
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
 * Try to extract content from body text (last resort strategies).
 * @param doc - Document to extract from.
 * @param debugInfo - Debug info object.
 * @returns Extracted content or null if not found.
 */
export function tryBodyTextExtraction(
	doc: Document,
	debugInfo: Record<string, unknown>,
): { content: string; debugInfo: Record<string, unknown> } | null {
	const { body } = doc;
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

				const mainText = mainElBody.textContent?.trim() ?? '';
				const minMainElBodyTextLength = 1000;
				if (mainText.length > minMainElBodyTextLength) {
					// Check cookie content ratio
					const cookieMatches = (
						mainText.match(/cookie|consent|accept all/gi) ?? []
					).length;
					const wordCount = mainText.split(/\s+/).length;
					const cookieRatio = cookieMatches / wordCount;

					// If less than 5% cookie-related words, it's likely real content
					const maxCookieRatioValue = 0.05;
					const minMainTextLengthValue = 5000;
					if (
						cookieRatio < maxCookieRatioValue ||
						mainText.length > minMainTextLengthValue
					) {
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

		// Get all body text - be less aggressive with filtering
		// Just remove unwanted elements and return the text
		const bodyClone = body.cloneNode(true) as Element;
		// Aggressively remove all non-content elements including scripts, styles, and code blocks
		removeElements(
			bodyClone,
			'script, style, noscript, iframe, svg, canvas, nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"], [class*="banner"], [id*="banner"], [role="dialog"], [class*="modal"], [class*="overlay"], [class*="dialog"], [class*="nav"], [class*="menu"], [class*="sidebar"], code, pre, [onclick], [onload], [onerror]',
		);
		// Also manually remove any remaining script-like elements by checking their content
		const allBodyElements = bodyClone.querySelectorAll('*');

		allBodyElements.forEach((el: Element) => {
			// Remove elements that look like scripts or contain JavaScript
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
						el.textContent.includes('document.querySelector') ||
						el.textContent.includes('addEventListener') ||
						el.textContent.includes('fetch(') ||
						(el.textContent.includes('const ') &&
							el.textContent.includes('= document'))))
			) {
				el.remove();
			}
		});

		const bodyText = bodyClone.textContent?.trim() ?? '';

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
		const jsPatternCount = jsPatterns.filter((pattern) =>
			bodyText.includes(pattern),
		).length;
		// If more than 2 JS patterns found, it's likely script content - try to extract only documentation parts
		const maxJsPatternCountForFilter = 2;
		if (jsPatternCount > maxJsPatternCountForFilter) {
			// Try to extract only paragraphs and text nodes that don't look like code
			const paragraphs = bodyClone.querySelectorAll(
				'p, div, span, li, td, th, dd, dt',
			);
			const docTexts: string[] = [];

			paragraphs.forEach((p: Readonly<Element>) => {
				const text = p.textContent?.trim() ?? '';
				// Only include text that doesn't look like JavaScript
				const minParagraphTextLengthForDoc = 50;
				if (
					text.length > minParagraphTextLengthForDoc &&
					!text.includes('function') &&
					!text.includes('=>') &&
					!text.includes('document.querySelector') &&
					!text.includes('addEventListener') &&
					!text.includes('fetch(') &&
					!(text.includes('const ') && text.includes('= document'))
				) {
					docTexts.push(text);
				}
			});

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
				bodyText.match(/cookie|consent|accept all/gi) ?? []
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
	if (doc.body) {
		// Clone body and remove scripts/styles, then get text
		const bodyClone = doc.body.cloneNode(true) as Element;
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

		const lastResortText = bodyClone.textContent?.trim() ?? '';
		// Return if we have any substantial text
		const minLastResortTextLength = 100;
		if (lastResortText.length > minLastResortTextLength) {
			return { content: lastResortText, debugInfo };
		}
	}

	// Absolute last resort: return body text as-is (might include scripts but better than nothing)
	if (doc.body) {
		// Try to get text from body, but filter out obvious script content
		const rawBodyText = doc.body.textContent?.trim() ?? '';
		// Check if it looks like mostly code/scripts (high ratio of special chars)
		const codeCharCount = (rawBodyText.match(/[{}();=]/g) ?? []).length;
		const totalChars = rawBodyText.length;

		const codeRatioDefault = 0;
		const codeRatio =
			totalChars > 0 ? codeCharCount / totalChars : codeRatioDefault;

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

	return null;
}

