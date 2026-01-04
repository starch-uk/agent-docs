/**
 * @file Helper functions for DOM content extraction.
 * These functions are designed to be testable in Node.js with jsdom.
 */

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- DOM API types cannot be made readonly */
/* eslint-disable @typescript-eslint/no-unnecessary-condition -- Runtime checks needed for DOM API nullability */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Magic numbers are used for lengths and DOM operations */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion -- DOM API types require assertions */

/**
 * Helper function to traverse shadow DOMs recursively.
 * @param element - Element to search in.
 * @param selector - CSS selector to find.
 * @param maxDepth - Maximum depth to traverse (default: 10).
 * @returns Found element or null.
 */
export function findInShadowDOM(
	element: Element | null,
	selector: Readonly<string>,
	maxDepth: Readonly<number> = 10,
): Element | null {
	if (element === null) return null;

	/**
	 * Traverse shadow roots recursively.
	 * @param el - Element to traverse.
	 * @param depth - Current depth (default: 0).
	 * @returns Found element or null.
	 */
	const traverse = (
		el: Element | null,
		depth: Readonly<number> = 0,
	): Element | null => {
		if (el === null || depth > maxDepth) return null; // Safety limit

		// First check if this element itself has a shadow root
		if (el.shadowRoot) {
			// Check shadow root directly for the selector
			try {
				const shadowResult = el.shadowRoot.querySelector(selector);
				if (shadowResult) return shadowResult;
			} catch {
				// Continue if querySelector fails
			}

			// Recursively traverse all children in the shadow root
			try {
				const shadowChildren = el.shadowRoot.querySelectorAll('*');
				for (let i = 0; i < shadowChildren.length; i++) {
					const child = shadowChildren[i];
					const result = traverse(child, depth + 1);
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
	return traverse(element, 0);
}

/**
 * Function to remove unwanted elements.
 * @param element - Document or Element to remove from.
 * @param selectors - CSS selectors for elements to remove.
 */
export function removeElements(
	element: Document | Element,
	selectors: Readonly<string>,
): void {
	const unwanted = element.querySelectorAll(selectors);
	unwanted.forEach((el: Element) => {
		el.remove();
	});
}

/**
 * Extract content from a shadow DOM element (bodyContent or contentContainer).
 * @param element - Element to extract content from.
 * @param debugInfo - Debug info object to update.
 * @returns Extracted content or null if not sufficient.
 */
export function extractShadowDOMElementContent(
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
	const linksWithTitles = clone.querySelectorAll('a[title]');
	const titleTexts: string[] = [];

	linksWithTitles.forEach((link: Readonly<Element>) => {
		const title = link.getAttribute('title')?.trim();
		const minTitleLengthForCollection = 10;

		if (
			title !== null &&
			title !== undefined &&
			title !== '' &&
			title.length > minTitleLengthForCollection
		) {
			titleTexts.push(title);
		}
	});

	// textContent is always a string in DOM (never null for Element types)
	let shadowContent = clone.textContent.trim();

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
 * Filter body text paragraphs to extract only documentation content.
 * Removes JavaScript-like content and returns filtered paragraphs.
 * @param bodyClone - Cloned body element to filter.
 * @param bodyText - Full body text content.
 * @returns Filtered documentation paragraphs joined by newlines, or null if none found.
 */
export function filterBodyTextDocParagraphs(
	bodyClone: Element,
	bodyText: string,
): string | null {
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
	const maxJsPatternCountForFilter = 2;
	if (jsPatternCount <= maxJsPatternCountForFilter) {
		return null;
	}

	// Try to extract only paragraphs and text nodes that don't look like code
	const paragraphs = bodyClone.querySelectorAll(
		'p, div, span, li, td, th, dd, dt',
	);
	const docTexts: string[] = [];

	paragraphs.forEach((p: Readonly<Element>) => {
		// textContent is always a string in DOM (never null for Element types)
		const text = p.textContent.trim();
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
		return docTexts.join('\n\n');
	}

	return null;
}

/**
 * Process main element to extract best text content.
 * @param mainElement - Main element to process.
 * @param debugInfo - Debug info object to update.
 * @returns Object with bestText and bestLength, or null if no suitable content found.
 */
export function processMainElement(
	mainElement: Element,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	debugInfo: Record<string, unknown>,
): { bestText: string; bestLength: number } | null {
	// Clone to avoid modifying original
	const clone = mainElement.cloneNode(true) as Element;
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
	// Convert to array to avoid issues with live NodeList during removal
	const allElementsClone = Array.from(clone.querySelectorAll('*'));

	allElementsClone.forEach((el: Element) => {
		// Remove elements with event handlers or script-like content
		// className can be a string, DOMTokenList, or other types, but we handle all cases
		const className = el.className;
		// className is never null in DOM, so we can simplify
		const classStr = typeof className === 'string' ? className : String(className);
		const htmlEl = el as HTMLElement;
		if (
			htmlEl.onclick ||
			htmlEl.onload ||
			htmlEl.onerror ||
			classStr.includes('script') ||
			classStr.includes('syntax')
		) {
			el.remove();
		}
	});

	// textContent is always a string in DOM (never null for Element types)
	const mainText = clone.textContent.trim();

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
			// textContent is always a string in DOM (never null for Element types)
			const text = p.textContent.trim();
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
		const linksWithTitles = clone.querySelectorAll('a[title]');
		const titleTexts: string[] = [];

		linksWithTitles.forEach((link: Readonly<Element>) => {
			const title = link.getAttribute('title')?.trim();
			const minTitleLengthForCollection = 10;

			if (
				title !== null &&
				title !== undefined &&
				title !== '' &&
				title.length > minTitleLengthForCollection
			) {
				titleTexts.push(title);
			}
		});
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
		// Extract title attributes from links
		const linksWithTitles = clone.querySelectorAll('a[title]');
		const titleTexts: string[] = [];

		linksWithTitles.forEach((link: Readonly<Element>) => {
			const title = link.getAttribute('title')?.trim();
			const minTitleLengthForCollection = 10;

			if (
				title !== null &&
				title !== undefined &&
				title !== '' &&
				title.length > minTitleLengthForCollection
			) {
				titleTexts.push(title);
			}
		});

		// Append title texts to mainText if any were found
		let finalText = mainText;
		if (titleTexts.length > 0) {
			finalText = mainText + '\n\n' + titleTexts.join('\n');
		}

		// Check code ratio to filter out code-like content
		// Note: finalText.length > 200 is guaranteed by the condition above, so we can simplify
		const codeCharCount = (finalText.match(/[{}();=]/g) ?? []).length;
		const codeRatio = codeCharCount / finalText.length;
		const maxCodeRatio = 0.1;

		// Check cookie content - be more lenient
		const cookieKeywords = [
			'cookie',
			'consent',
			'accept all',
			'do not accept',
		];
		const cookieTextCount = cookieKeywords.filter((keyword) =>
			finalText.toLowerCase().includes(keyword),
		).length;
		// Only reject if it's clearly just cookie text (high ratio and short)
		const minWordCountForRatio = 1;
		const cookieRatio =
			cookieTextCount /
			Math.max(minWordCountForRatio, finalText.split(/\s+/).length);
		const maxCookieRatioForReject = 0.1;
		const minMainTextLengthForReject = 500;
		if (
			codeRatio < maxCodeRatio &&
			!(
				cookieRatio > maxCookieRatioForReject &&
				finalText.length < minMainTextLengthForReject
			)
		) {
			// Use the container itself if it has substantial text
			const containerTextLength = finalText.length;
			const minContainerTextLength = 200;
			if (containerTextLength > minContainerTextLength) {
				return {
					bestLength: containerTextLength,
					bestText: finalText,
				};
			}
		}
	}

	return null;
}
