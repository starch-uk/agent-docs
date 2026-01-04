/**
 * @file Main DOM content extraction utility for Salesforce Help pages.
 * This function orchestrates various helper and fallback strategies.
 */

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- DOM API types cannot be made readonly */
/* eslint-disable @typescript-eslint/no-unnecessary-condition -- Runtime checks needed for DOM API nullability */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Magic numbers are used for lengths and DOM operations */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion -- DOM API types require assertions */

import {
	findInShadowDOM,
	removeElements,
	extractShadowDOMElementContent,
	processMainElement,
	filterBodyTextDocParagraphs,
} from './extract-content-helpers.js';
import {
	tryFallbackContentExtraction,
	tryBodyTextContent,
	tryLastResortBodyText,
	tryRawBodyText,
	processMainSelectors,
} from './extract-content-fallbacks.js';

/**
 * Extract content from a Salesforce Help page DOM.
 * This is the main extraction function that tries multiple strategies.
 * @param doc - Document to extract content from.
 * @returns Object with content and debug info.
 */
export function extractContent(doc: Document): {
	content: string;
	debugInfo: Record<string, unknown>;
} {
	const debugInfo: Record<string, unknown> = {
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
		doc.querySelector('[role="main"]') ??
		doc.querySelector('main');
	if (mainEl !== null) {
		const mainElTextLength =
			mainEl.textContent?.trim()?.length ?? 0;
		debugInfo.mainElements = [
			{
				children: mainEl.children.length,
				className: mainEl.className ?? '',
				tag: mainEl.tagName,
				textLength: mainElTextLength,
			},
		];
	}

	// Try to find elements with substantial text
	const allElements = doc.querySelectorAll('*');
	const textElements: Array<{
		tag: string;
		text: string;
		length: number;
		className?: string;
		textLength?: number;
		textPreview?: string;
	}> = [];
	const maxElements = 100;
	for (let i = 0; i < Math.min(allElements.length, maxElements); i++) {
		const el = allElements[i];
		const text = el.textContent?.trim() ?? '';
		const minTextLengthForElement = 200;
		// Check code ratio to filter out code-like content
		const codeCharCount = (text.match(/[{}();=]/g) ?? []).length;
		const codeRatio = text.length > 0 ? codeCharCount / text.length : 0;
		const maxCodeRatio = 0.1;
		if (
			text.length > minTextLengthForElement &&
			!text.toLowerCase().includes('cookie') &&
			codeRatio < maxCodeRatio
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

	debugInfo.textElements = textElements.slice(0, 10); // First 10

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
			findInShadowDOM(
				docXmlContent,
				'.container[data-name="content"]',
			) ??
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
				const allTextElements =
					contentContainer.querySelectorAll(
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

	const contentContainerTextLength = contentContainer
		? (contentContainer.textContent?.trim()?.length ?? 0)
		: 0;
	debugInfo.contentContainerTextLength = contentContainerTextLength;

	debugInfo.bodyContentFound = !!bodyContent;
	debugInfo.bodyContentClasses = bodyContent
		? (bodyContent.className ?? '')
		: null;

	const bodyContentTextLength = bodyContent
		? (bodyContent.textContent?.trim()?.length ?? 0)
		: 0;
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
		const result = processMainElement(mainElement, debugInfo);
		if (result !== null) {
			bestText = result.bestText;
			bestLength = result.bestLength;
		}
	}

	// Try to find all paragraphs and divs with substantial text
	const allParagraphs = doc.querySelectorAll(
		'p, div[class*="text"], div[class*="content"], div[class*="article"]',
	);
	debugInfo.paragraphCount = allParagraphs.length;
	const paragraphTexts: string[] = [];
	const maxParagraphs = 50;

	for (let i = 0; i < Math.min(allParagraphs.length, maxParagraphs); i++) {
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
	for (
		let i = 0;
		i < Math.min(allTextElements.length, maxTextElementsCollect);
		i++
	) {
		const el = allTextElements[i];
		const text = el.textContent?.trim() ?? '';
		// Only collect substantial text that's not cookie-related and not already in bestText
		const minTextElementLength = 50;
		// Check code ratio to filter out code-like content
		const codeCharCount = (text.match(/[{}();=]/g) ?? []).length;
		const codeRatio = text.length > 0 ? codeCharCount / text.length : 0;
		const maxCodeRatio = 0.1;
		if (
			text.length > minTextElementLength &&
			!text.toLowerCase().includes('cookie') &&
			!text.toLowerCase().includes('consent') &&
			!text.toLowerCase().includes('accept all') &&
			!bestText.includes(text) &&
			codeRatio < maxCodeRatio
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
		const shadowContent = extractShadowDOMElementContent(
			bodyContent,
			debugInfo,
		);
		if (shadowContent !== null) {
			return { content: shadowContent, debugInfo };
		}
	}

	// Also try contentContainer if bodyContent wasn't found
	if (contentContainer && !bodyContent) {
		const shadowContent = extractShadowDOMElementContent(
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
	const fallbackContent = tryFallbackContentExtraction(doc, debugInfo);
	if (fallbackContent !== null) {
		return fallbackContent;
	}

	// Last resort: get body text but filter cookie content more aggressively
	if (doc.body) {
		const body = doc.body;
		// Remove all unwanted elements more aggressively
		removeElements(
			body,
			'script, style, nav, footer, header, .cookie-consent, [class*="cookie"], [id*="cookie"], [class*="banner"], [id*="banner"], iframe, noscript, [role="dialog"], [class*="modal"], [class*="overlay"], [class*="dialog"]',
		);

		// Try to find and extract from main content areas
		const mainSelectorsResult = processMainSelectors(body as HTMLBodyElement, debugInfo);
		if (mainSelectorsResult !== null) {
			return mainSelectorsResult;
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
		// If the text contains too much JavaScript syntax, try to extract only documentation parts
		const filteredDocText = filterBodyTextDocParagraphs(bodyClone, bodyText);
		if (filteredDocText !== null) {
			return {
				content: filteredDocText,
				debugInfo,
			};
		}

		// If we have substantial text, return it (even if it has some cookie text)
		// The filtering above should have removed most cookie banners
		const bodyTextResult = tryBodyTextContent(bodyText, debugInfo);
		if (bodyTextResult !== null) {
			return bodyTextResult;
		}
	}

	// Last resort: return whatever body text we have
	if (doc.body) {
		const lastResortResult = tryLastResortBodyText(doc.body as HTMLBodyElement, debugInfo);
		if (lastResortResult !== null) {
			return lastResortResult;
		}
	}

	// Absolute last resort: return body text as-is (might include scripts but better than nothing)
	if (doc.body) {
		const rawBodyTextResult = tryRawBodyText(doc.body as HTMLBodyElement, debugInfo);
		if (rawBodyTextResult !== null) {
			return rawBodyTextResult;
		}
	}

	return { content: '', debugInfo };
}
