/**
 * @file Content extraction logic for Salesforce Help pages.
 * This code runs inside page.evaluate() in the browser context.
 *
 * NOTE: All helper and processor functions are inlined here because
 * getFunctionString() stringifies the function, and imports don't work
 * in the browser context. The separate helper/processor files exist
 * for maintainability but are not used at runtime.
 */

/* v8 ignore file -- Browser-side code in page.evaluate() cannot be unit tested in Node.js */

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- DOM API types cannot be made readonly */
/* eslint-disable @typescript-eslint/no-unnecessary-condition -- Runtime checks needed for DOM API nullability */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Magic numbers are used for lengths and DOM operations */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion -- DOM API types require assertions */

/**
 * Inline helper functions (must be in same scope for stringification).
 * Searches for an element within Shadow DOM trees.
 * @param element - Root element to search from.
 * @param selector - CSS selector to find.
 * @returns Found element or null.
 */
function findInShadowDOM(
	element: Element | null,
	selector: Readonly<string>,
): Element | null {
	if (element === null) return null;
	const traverse = (
		el: Element | null,
		depth: Readonly<number> = 0,
	): Element | null => {
		const maxDepth = 10;
		if (el === null || depth > maxDepth) return null;
		if (el.shadowRoot) {
			try {
				const shadowResult = el.shadowRoot.querySelector(selector);
				if (shadowResult) return shadowResult;
			} catch {
				// Continue if querySelector fails
			}
			try {
				const shadowChildren = el.shadowRoot.querySelectorAll('*');
				for (const child of shadowChildren) {
					const result = traverse(child, depth + 1);
					if (result !== null) return result;
				}
			} catch {
				// Continue if querySelectorAll fails
			}
		}
		const children = Array.from(el.children);
		for (const child of children) {
			const result = traverse(child, depth);
			if (result !== null) return result;
		}
		return null;
	};
	return traverse(element, 0);
}

/**
 * Removes elements matching the given selectors.
 * @param element - Document or element to search within.
 * @param selectors - CSS selectors for elements to remove.
 */
function removeElements(
	element: Document | Element,
	selectors: Readonly<string>,
): void {
	const unwanted = element.querySelectorAll(selectors);
	unwanted.forEach((el: Element) => {
		el.remove();
	});
}

/**
 * Extracts title attributes from links.
 * @param element - Element to search within.
 * @returns Array of title texts.
 */
function extractLinkTitles(element: Element): string[] {
	const linksWithTitles = element.querySelectorAll('a[title]');
	const titleTexts: string[] = [];
	const minTitleLength = 10;
	linksWithTitles.forEach((link: Readonly<Element>) => {
		const title = link.getAttribute('title')?.trim();
		if (
			title !== null &&
			title !== undefined &&
			title !== '' &&
			title.length > minTitleLength
		) {
			titleTexts.push(title);
		}
	});
	return titleTexts;
}

/**
 * Inline processor functions (must be in same scope for stringification).
 * Processes main element content to extract text.
 * @param mainElement - Main element to process.
 * @param debugInfo - Debug information object.
 * @returns Best text and length or null.
 */
function processMainElementContent(
	mainElement: Element,
	debugInfo: Record<string, unknown>,
): { bestText: string; bestLength: number } | null {
	const clone = mainElement.cloneNode(true) as Element;
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
	removeElements(
		clone,
		'.global-nav-container, hgf-c360nav, hgf-c360contextnav, dx-scroll-manager, dx-traffic-labeler, doc-header, doc-xml-content',
	);
	const allElementsClone = clone.querySelectorAll('*');
	allElementsClone.forEach((el: Element) => {
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
	const titleTexts = extractLinkTitles(clone);
	let mainText = clone.textContent?.trim() ?? '';
	if (titleTexts.length > 0) {
		mainText = mainText + '\n\n' + titleTexts.join('\n');
	}
	debugInfo.mainTextLength = mainText.length;
	debugInfo.mainTextPreview = mainText.substring(0, 300);
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
	const minJsPatternCount = 2;
	const minMainTextLengthForJs = 200;
	if (
		jsPatternCount > minJsPatternCount &&
		mainText.length > minMainTextLengthForJs
	) {
		const paragraphs = clone.querySelectorAll(
			'p, div, span, li, td, th, dd, dt, h1, h2, h3, h4, h5, h6',
		);
		const docTexts: string[] = [];
		paragraphs.forEach((p: Readonly<Element>) => {
			const text = p.textContent?.trim() ?? '';
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
		const cookieKeywords = [
			'cookie',
			'consent',
			'accept all',
			'do not accept',
		];
		const cookieTextCount = cookieKeywords.filter((keyword) =>
			mainText.toLowerCase().includes(keyword),
		).length;
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
 * Extracts content from Shadow DOM elements.
 * @param element - Element with Shadow DOM.
 * @param debugInfo - Debug information object.
 * @returns Extracted content or null.
 */
function extractShadowDOMContent(
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
 * Tries to extract content from fallback elements.
 * @param doc - Document to search.
 * @param debugInfo - Debug information object.
 * @returns Content and debug info or null.
 */
function tryFallbackElementExtraction(
	doc: Document,
	debugInfo: Record<string, unknown>,
): { content: string; debugInfo: Record<string, unknown> } | null {
	const allElementsFallback = doc.querySelectorAll('*');
	const minFallbackTextLength = 500;
	for (const el of allElementsFallback) {
		const text = el.textContent?.trim() ?? '';
		if (text.length > minFallbackTextLength) {
			const cookieKeywords = [
				'cookie',
				'consent',
				'accept all',
				'do not accept',
			];
			const cookieTextCount = cookieKeywords.filter((keyword) =>
				text.toLowerCase().includes(keyword),
			).length;
			const maxCookieKeywordsForAccept = 3;
			const minTextLengthForAccept = 2000;
			if (
				cookieTextCount < maxCookieKeywordsForAccept ||
				text.length > minTextLengthForAccept
			) {
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
 * Tries to extract text from document body.
 * @param doc - Document to extract from.
 * @param debugInfo - Debug information object.
 * @returns Content and debug info or null.
 */
function tryBodyTextExtraction(
	doc: Document,
	debugInfo: Record<string, unknown>,
): { content: string; debugInfo: Record<string, unknown> } | null {
	const { body } = doc;
	if (body !== null && body !== undefined) {
		removeElements(
			body,
			'script, style, nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"], [class*="banner"], [id*="banner"], iframe, noscript, [role="dialog"], [class*="modal"], [class*="overlay"], [class*="dialog"]',
		);
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
					const cookieMatches = (
						mainText.match(/cookie|consent|accept all/gi) ?? []
					).length;
					const wordCount = mainText.split(/\s+/).length;
					const cookieRatio = cookieMatches / wordCount;
					const maxCookieRatioValue = 0.05;
					const minMainTextLengthValue = 5000;
					if (
						cookieRatio < maxCookieRatioValue ||
						mainText.length > minMainTextLengthValue
					) {
						if (mainText.length > bestMainLength) {
							bestMainText = mainText;
							bestMainLength = mainText.length;
						}
					}
				}
			}
		}
		if (bestMainText.length > 0) {
			return { content: bestMainText, debugInfo };
		}
		const bodyClone = body.cloneNode(true) as Element;
		removeElements(
			bodyClone,
			'script, style, noscript, iframe, svg, canvas, nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"], [class*="banner"], [id*="banner"], [role="dialog"], [class*="modal"], [class*="overlay"], [class*="dialog"], [class*="nav"], [class*="menu"], [class*="sidebar"], code, pre, [onclick], [onload], [onerror]',
		);
		const allBodyElements = bodyClone.querySelectorAll('*');
		allBodyElements.forEach((el: Element) => {
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
		if (jsPatternCount > maxJsPatternCountForFilter) {
			const paragraphs = bodyClone.querySelectorAll(
				'p, div, span, li, td, th, dd, dt',
			);
			const docTexts: string[] = [];
			paragraphs.forEach((p: Readonly<Element>) => {
				const text = p.textContent?.trim() ?? '';
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
		const minBodyTextLength = 500;
		if (bodyText.length > minBodyTextLength) {
			const cookieMatches = (
				bodyText.match(/cookie|consent|accept all/gi) ?? []
			).length;
			const wordCount = bodyText.split(/\s+/).length;
			const cookieRatio = wordCount > 0 ? cookieMatches / wordCount : 0;
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
	if (doc.body !== null && doc.body !== undefined) {
		const bodyClone = doc.body.cloneNode(true) as Element;
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
		const minLastResortTextLength = 100;
		if (lastResortText.length > minLastResortTextLength) {
			return { content: lastResortText, debugInfo };
		}
	}
	if (doc.body !== null && doc.body !== undefined) {
		const rawBodyText = doc.body.textContent?.trim() ?? '';
		const codeCharCount = (rawBodyText.match(/[{}();=]/g) ?? []).length;
		const totalChars = rawBodyText.length;
		const codeRatio = totalChars > 0 ? codeCharCount / totalChars : 0;
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

/**
 * Main content extraction function that runs in browser context.
 * This function is stringified and injected into page.evaluate().
 * @returns Object with content and debugInfo.
 */
export function extractContentInBrowser(): {
	content: string;
	debugInfo: Record<string, unknown>;
} {
	const doc = (globalThis as { document: Document }).document;

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
		bodyTextLength: doc.body?.textContent?.trim()?.length ?? 0,
		divCount: doc.querySelectorAll('div').length,
		mainElements: [],
		paragraphCount: doc.querySelectorAll('p').length,
		shadowDOMFound: false,
	};

	// Check for doc-xml-content element (entry point to shadow DOM)
	const docXmlContent = doc.querySelector('doc-xml-content');
	debugInfo.docXmlContentFound = docXmlContent !== null;
	if (docXmlContent !== null && docXmlContent.shadowRoot !== null) {
		debugInfo.shadowDOMFound = true;
	}

	// Check main element
	const mainEl =
		doc.querySelector('[role="main"]') ?? doc.querySelector('main');
	if (mainEl !== null) {
		const mainElTextLengthDefault = 0;
		const mainElTextLength =
			mainEl.textContent?.trim()?.length ?? mainElTextLengthDefault;
		debugInfo.mainElements.push({
			children: mainEl.children.length,
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
		const text = el.textContent?.trim() ?? '';
		const minTextLengthForElement = 200;
		if (
			text.length > minTextLengthForElement &&
			!text.toLowerCase().includes('cookie')
		) {
			const classNameValue = el.className;
			const classNameStr =
				typeof classNameValue === 'string' ? classNameValue : '';
			const textPreviewLength = 100;
			textElements.push({
				className: classNameStr,
				length: text.length,
				tag: el.tagName,
				text,
				textLength: text.length,
				textPreview: text.substring(0, textPreviewLength),
			});
		}
	}

	const sliceStart = 0;
	const maxTextElementsSlice = 10;
	debugInfo.textElements = textElements.slice(
		sliceStart,
		maxTextElementsSlice,
	); // First 10

	// Try multiple selector strategies - prioritize developer.salesforce.com selectors
	// First try to find content container in shadow DOM
	let contentContainer: Element | null = null;
	let bodyContent: Element | null = null;

	if (docXmlContent) {
		// Traverse shadow DOMs to find the content container
		debugInfo.shadowDOMSearchAttempted = true;

		// Try to find the container - traverse through all shadow DOMs
		contentContainer =
			findInShadowDOM(
				docXmlContent,
				'div.container[data-name="content"]',
			) ??
			findInShadowDOM(docXmlContent, '.container[data-name="content"]') ??
			findInShadowDOM(docXmlContent, '[data-name="content"]');

		debugInfo.shadowDOMSearchResult = !!contentContainer;
		debugInfo.shadowDOMSearchDepth = contentContainer
			? 'found'
			: 'not found';

		if (contentContainer) {
			// Find body content within the container
			bodyContent =
				contentContainer.querySelector('.body.conbody') ??
				contentContainer.querySelector('.conbody') ??
				contentContainer.querySelector('.body');

			// Also try to get all text directly from the container if body not found
			if (!bodyContent) {
				// Get all paragraphs, divs, and text elements from the container
				const allTextElements = contentContainer.querySelectorAll(
					'p, div, span, li, h1, h2, h3, h4, h5, h6',
				);

				if (allTextElements.length > 0) {
					// Use the container itself if it has substantial text
					const containerText =
						contentContainer.textContent?.trim() ?? '';
					const minContainerTextLength = 500;
					if (containerText.length > minContainerTextLength) {
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
			doc.querySelector('div.container[data-name="content"]') ??
			doc.querySelector('.container[data-name="content"]') ??
			doc.querySelector('[data-name="content"]');

		if (contentContainer) {
			bodyContent =
				contentContainer.querySelector('.body.conbody') ??
				contentContainer.querySelector('.conbody') ??
				contentContainer.querySelector('.body');
		}
	}

	debugInfo.contentContainerFound = !!contentContainer;
	debugInfo.contentContainerClasses = contentContainer
		? (contentContainer.className ?? '')
		: null;

	const contentContainerTextLengthDefault = 0;
	const contentContainerTextLength = contentContainer
		? (contentContainer.textContent?.trim()?.length ??
			contentContainerTextLengthDefault)
		: contentContainerTextLengthDefault;
	debugInfo.contentContainerTextLength = contentContainerTextLength;

	debugInfo.bodyContentFound = !!bodyContent;
	debugInfo.bodyContentClasses = bodyContent
		? (bodyContent.className ?? '')
		: null;

	const bodyContentTextLengthDefault = 0;
	const bodyContentTextLength = bodyContent
		? (bodyContent.textContent?.trim()?.length ??
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
	debugInfo.mainElementTag = mainElement ? mainElement.tagName : null;
	debugInfo.mainElementClasses = mainElement
		? (mainElement.className ?? '')
		: null;

	// First, try to get comprehensive content from main area
	if (mainElement) {
		const result = processMainElementContent(mainElement, debugInfo);
		if (result !== null) {
			const { bestLength: resultLength, bestText: resultText } = result;
			bestText = resultText;
			bestLength = resultLength;
		}
	}

	// Try to find all paragraphs and divs with substantial text
	const allParagraphs = doc.querySelectorAll(
		'p, div[class*="text"], div[class*="content"], div[class*="article"]',
	);
	debugInfo.paragraphCount = allParagraphs.length;
	const paragraphTexts: string[] = [];
	const maxParagraphs = 50;

	const paragraphLoopStart = 0;
	for (
		let i = paragraphLoopStart;
		i < Math.min(allParagraphs.length, maxParagraphs);
		i++
	) {
		const p = allParagraphs[i];
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

	if (paragraphTexts.length > 0) {
		const combinedParagraphText = paragraphTexts.join('\n\n');
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
		i < Math.min(allTextElements.length, maxTextElementsCollect);
		i++
	) {
		const el = allTextElements[i];
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
				(ct) => ct.includes(text) || text.includes(ct),
			);
			if (isUnique) {
				collectedTexts.push(text);
			}
		}
	}

	// Combine collected texts
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

			const text = element.textContent?.trim() ?? null;
			const minSelectorTextLength = 200;

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
				const cookieTextCount = cookieKeywords.filter((keyword) =>
					text.toLowerCase().includes(keyword),
				).length;

				// Only consider if it's not mostly cookie text (more than 2 keywords and short text)
				const maxCookieKeywordsForReject = 2;
				const minTextLengthForReject = 1000;
				if (
					!(
						cookieTextCount > maxCookieKeywordsForReject &&
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
		const shadowContent = extractShadowDOMContent(bodyContent, debugInfo);
		if (shadowContent !== null) {
			return { content: shadowContent, debugInfo };
		}
	}

	// Also try contentContainer if bodyContent wasn't found
	if (contentContainer && !bodyContent) {
		const shadowContent = extractShadowDOMContent(
			contentContainer,
			debugInfo,
		);
		if (shadowContent !== null) {
			return { content: shadowContent, debugInfo };
		}
	}

	// Return the best (longest) text found, or continue to fallback strategies
	const minBestTextLength = 0;
	if (bestText.length > minBestTextLength) {
		return { content: bestText, debugInfo };
	}

	// Fallback: try to get content from any element with substantial text
	const fallbackResult = tryFallbackElementExtraction(doc, debugInfo);
	if (fallbackResult !== null) {
		return fallbackResult;
	}

	// Last resort: get body text but filter cookie content more aggressively
	const bodyResult = tryBodyTextExtraction(doc, debugInfo);
	if (bodyResult !== null) {
		return bodyResult;
	}

	return { content: '', debugInfo };
}
