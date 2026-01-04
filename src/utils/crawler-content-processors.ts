/**
 * @file Content processing functions for extraction.
 * This code runs inside page.evaluate() in the browser context.
 */

/* v8 ignore file -- Browser-side code in page.evaluate() cannot be unit tested in Node.js */

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- DOM API types cannot be made readonly */
/* eslint-disable @typescript-eslint/no-unnecessary-condition -- Runtime checks needed for DOM API nullability */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Magic numbers are used for lengths and DOM operations */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion -- DOM API types require assertions */

import {
	removeElements,
	extractLinkTitles,
} from './crawler-content-helpers.ts';

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
