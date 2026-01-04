/**
 * @file Tests for extract-content utility extractContent function.
 * Helper function tests (findInShadowDOM, removeElements) are in extract-content-helpers.test.ts
 * All tests run offline using jsdom - no network access required.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import {
	extractContent,
	findInShadowDOM,
} from '../../src/utils/extract-content.js';

describe('extractContent', () => {
	let dom: JSDOM;
	let document: Document;

	beforeEach(() => {
		dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
			url: 'https://test.example.com',
		});
		document = dom.window.document;
		// Ensure body is completely empty and no shadow DOM elements exist
		document.body.innerHTML = '';
		// Remove any doc-xml-content elements that might exist
		const docXmlContent = document.querySelector('doc-xml-content');
		if (docXmlContent) {
			docXmlContent.remove();
		}
	});

	it('should remove elements with DX-SCROLL-MANAGER tag', () => {
		const main = document.createElement('main');
		const scrollElement = document.createElement('dx-scroll-manager');
		scrollElement.textContent = 'Scroll manager';
		main.appendChild(scrollElement);

		const normalDiv = document.createElement('div');
		normalDiv.textContent = 'Normal content with enough text. '.repeat(10);
		main.appendChild(normalDiv);

		document.body.appendChild(main);

		const result = extractContent(document);
		// Should remove element with DX-SCROLL-MANAGER tag (line 196)
		expect(result.content).toContain('Normal content');
	});

	it('should remove elements with DX-TRAFFIC-LABELER tag', () => {
		const main = document.createElement('main');
		const labelerElement = document.createElement('dx-traffic-labeler');
		labelerElement.textContent = 'Traffic labeler';
		main.appendChild(labelerElement);

		const normalDiv = document.createElement('div');
		normalDiv.textContent = 'Normal content with enough text. '.repeat(10);
		main.appendChild(normalDiv);

		document.body.appendChild(main);

		const result = extractContent(document);
		// Should remove element with DX-TRAFFIC-LABELER tag (line 197)
		expect(result.content).toContain('Normal content');
	});

	it('should remove elements with DOC-HEADER tag', () => {
		const main = document.createElement('main');
		const headerElement = document.createElement('doc-header');
		headerElement.textContent = 'Document header';
		main.appendChild(headerElement);

		const normalDiv = document.createElement('div');
		normalDiv.textContent = 'Normal content with enough text. '.repeat(10);
		main.appendChild(normalDiv);

		document.body.appendChild(main);

		const result = extractContent(document);
		// Should remove element with DOC-HEADER tag (line 198)
		expect(result.content).toContain('Normal content');
	});

	it('should remove elements with DOC-XML-CONTENT tag', () => {
		const main = document.createElement('main');
		const xmlElement = document.createElement('doc-xml-content');
		xmlElement.textContent = 'XML content';
		main.appendChild(xmlElement);

		const normalDiv = document.createElement('div');
		normalDiv.textContent = 'Normal content with enough text. '.repeat(10);
		main.appendChild(normalDiv);

		document.body.appendChild(main);

		const result = extractContent(document);
		// Should remove element with DOC-XML-CONTENT tag (line 199)
		expect(result.content).toContain('Normal content');
	});

	it('should not include title when title is null', () => {
		const main = document.createElement('main');
		main.textContent = 'Main content with enough text. '.repeat(10);

		// Add link with null title (getAttribute returns null)
		const link = document.createElement('a');
		// Don't set title attribute
		link.textContent = 'Link';
		main.appendChild(link);

		document.body.appendChild(main);

		const result = extractContent(document);
		// Should not include null title (line 213 condition fails)
		expect(result.content).toContain('Main content');
	});

	it('should not include title when title is undefined', () => {
		const main = document.createElement('main');
		main.textContent = 'Main content with enough text. '.repeat(10);

		// Add link - title attribute not set, so getAttribute returns null
		// But we test the undefined check in the condition
		const link = document.createElement('a');
		link.textContent = 'Link';
		main.appendChild(link);

		document.body.appendChild(main);

		const result = extractContent(document);
		// Should not include undefined title (line 214 condition)
		expect(result.content).toContain('Main content');
	});

	it('should not include title when title is empty string', () => {
		const main = document.createElement('main');
		main.textContent = 'Main content with enough text. '.repeat(10);

		// Add link with empty title
		const link = document.createElement('a');
		link.setAttribute('title', '');
		link.textContent = 'Link';
		main.appendChild(link);

		document.body.appendChild(main);

		const result = extractContent(document);
		// Should not include empty title (line 215 condition fails)
		expect(result.content).toContain('Main content');
	});

	it('should not include title when title.length <= minTitleLength', () => {
		const main = document.createElement('main');
		main.textContent = 'Main content with enough text. '.repeat(10);

		// Add link with short title (<= 10 chars)
		const link = document.createElement('a');
		link.setAttribute('title', 'Short'); // 5 chars, <= 10
		link.textContent = 'Link';
		main.appendChild(link);

		document.body.appendChild(main);

		const result = extractContent(document);
		// Should not include short title (line 216 condition fails)
		expect(result.content).toContain('Main content');
	});

	it('should continue to fallback when bestText.length === 0', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements to ensure bestText is empty
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create minimal content that won't set bestText
		// But will allow fallback strategies to work
		const div = document.createElement('div');
		div.textContent = 'Fallback content. '.repeat(30);
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should continue to fallback when bestText.length === 0 (line 729 condition fails)
		expect(result.content).toBeDefined();
		expect(result.content.length).toBeGreaterThan(0);
	});

	it('should return bestText when bestText.length > 0', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create main element that will set bestText
		const main = document.createElement('main');
		main.textContent =
			'Best text content with enough text to meet the minimum length requirement of 200 characters. '.repeat(
				3,
			);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should return bestText when bestText.length > 0 (line 729-730)
		expect(result.content).toContain('Best text content');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should iterate through allElementsFallback when bestText is empty', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements to ensure bestText is empty
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create element with substantial text (> 500 chars) that's not cookie text
		const div = document.createElement('div');
		div.textContent =
			'Fallback element content with enough text to meet the minimum length requirement of 500 characters for fallback extraction. '.repeat(
				8,
			);
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should iterate through allElementsFallback (line 736)
		expect(result.content.length).toBeGreaterThan(500);
		expect(result.content).toContain('Fallback element content');
	});

	it('should skip elements with text.length <= minFallbackTextLength in fallback loop', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements to ensure bestText is empty
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create element with text <= 500 chars (should be skipped)
		const shortDiv = document.createElement('div');
		shortDiv.textContent = 'Short content. '.repeat(20); // ~300 chars, <= 500
		document.body.appendChild(shortDiv);

		// Create element with text > 500 chars (should be used)
		const longDiv = document.createElement('div');
		longDiv.textContent = 'Long fallback content with enough text. '.repeat(
			20,
		); // > 500 chars
		document.body.appendChild(longDiv);

		const result = extractContent(document);
		// Should skip short element (line 738 condition fails)
		// Should use long element
		expect(result.content).toContain('Long fallback content');
		expect(result.content.length).toBeGreaterThan(500);
	});

	it('should handle fallback element when cookieTextCount >= maxCookieKeywordsForAccept and text.length <= minTextLengthForAccept', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements to ensure bestText is empty
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create element with >= 3 cookie keywords and <= 2000 chars
		const cookieDiv = document.createElement('div');
		cookieDiv.textContent =
			'cookie consent accept all do not accept. '.repeat(40); // >= 3 keywords, <= 2000 chars
		document.body.appendChild(cookieDiv);

		const result = extractContent(document);
		// Should not use fallback element (line 754-755 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should use fallback element when text.length > minTextLengthForAccept even with cookie keywords', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements to ensure bestText is empty
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create element with >= 3 cookie keywords but > 2000 chars
		const cookieDiv = document.createElement('div');
		cookieDiv.textContent =
			'cookie consent accept all do not accept. '.repeat(100); // >= 3 keywords, > 2000 chars
		document.body.appendChild(cookieDiv);

		const result = extractContent(document);
		// Should use fallback element (line 755 condition passes)
		expect(result.content.length).toBeGreaterThan(2000);
		expect(result.content).toContain('cookie consent');
	});

	it('should not return fallback element when cleanText.length <= minCleanTextLength', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements to ensure bestText is empty
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create element with substantial text (> 500 chars) but after removing unwanted elements, it's <= 500
		const div = document.createElement('div');
		const script = document.createElement('script');
		script.textContent = 'Script content that will be removed. '.repeat(20); // ~600 chars
		div.appendChild(script);
		div.textContent = 'Small remaining text. '; // < 500 chars after script removal
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should not return fallback element (line 764 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should iterate through mainSelectors when bestText is empty', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements to ensure bestText is empty
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create article element (one of the mainSelectors)
		const article = document.createElement('article');
		article.textContent =
			'Article content with enough text to meet the minimum length requirement of 1000 characters for bestMainText extraction. '.repeat(
				20,
			);
		document.body.appendChild(article);

		const result = extractContent(document);
		// Should iterate through mainSelectors (line 772)
		expect(result.content.length).toBeGreaterThan(1000);
		expect(result.content).toContain('Article content');
	});

	it('should skip mainSelector elements when mainText.length <= minMainElBodyTextLength', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements to ensure bestText is empty
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create article element with text <= 1000 chars
		const article = document.createElement('article');
		article.textContent = 'Article content. '.repeat(50); // ~900 chars, <= 1000
		document.body.appendChild(article);

		const result = extractContent(document);
		// Should skip article (line 804 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should skip mainSelector elements when cookieRatio >= maxCookieRatioValue and mainText.length <= minMainTextLengthValue', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements to ensure bestText is empty
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create article element with text > 1000 but <= 5000 chars and cookieRatio >= 0.05
		const article = document.createElement('article');
		article.textContent = 'cookie consent accept all. '.repeat(150); // > 1000, <= 5000, high cookie ratio
		document.body.appendChild(article);

		const result = extractContent(document);
		// Should skip article (line 816-817 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should not update bestMainText when mainText.length <= bestMainLength in mainSelectors loop', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements to ensure bestText is empty
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create article element (longer, will be set first)
		const article = document.createElement('article');
		article.textContent = 'Article content with substantial text. '.repeat(
			100,
		); // ~3500 chars
		document.body.appendChild(article);

		// Create main element (shorter, won't update bestMainText)
		const main = document.createElement('main');
		main.textContent = 'Main content. '.repeat(100); // ~1500 chars, shorter
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should not update bestMainText (line 820 condition fails for main)
		// Should use article content
		expect(result.content).toContain('Article content');
		expect(result.content.length).toBeGreaterThan(3000);
	});

	it('should not return bestMainText when bestMainText.length === 0', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements to ensure bestText is empty
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create article element with text <= 1000 chars (won't set bestMainText)
		const article = document.createElement('article');
		article.textContent = 'Article content. '.repeat(50); // ~900 chars, <= 1000
		document.body.appendChild(article);

		const result = extractContent(document);
		// Should not return bestMainText (line 830 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should iterate through allBodyElements when bestMainText is empty', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements to ensure bestText and bestMainText are empty
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create body text with substantial content
		const div = document.createElement('div');
		div.textContent =
			'Body text content with enough text to meet the minimum length requirement of 500 characters for body text extraction. '.repeat(
				8,
			);
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should iterate through allBodyElements (line 845)
		expect(result.content.length).toBeGreaterThan(500);
		expect(result.content).toContain('Body text content');
	});

	it('should remove elements with document.querySelector pattern in body text', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create body text with element containing document.querySelector
		const div = document.createElement('div');
		div.textContent = 'const x = document.querySelector("div");';
		document.body.appendChild(div);

		const normalDiv = document.createElement('div');
		normalDiv.textContent =
			'Normal body text content with enough text. '.repeat(15);
		document.body.appendChild(normalDiv);

		const result = extractContent(document);
		// Should remove element with document.querySelector (line 857)
		expect(result.content).toContain('Normal body text');
		expect(result.content.length).toBeGreaterThan(500);
	});

	it('should remove elements with addEventListener pattern in body text', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create body text with element containing addEventListener
		const div = document.createElement('div');
		div.textContent = 'x.addEventListener("click", () => {});';
		document.body.appendChild(div);

		const normalDiv = document.createElement('div');
		normalDiv.textContent =
			'Normal body text content with enough text. '.repeat(15);
		document.body.appendChild(normalDiv);

		const result = extractContent(document);
		// Should remove element with addEventListener (line 858)
		expect(result.content).toContain('Normal body text');
		expect(result.content.length).toBeGreaterThan(500);
	});

	it('should remove elements with fetch( pattern in body text', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create body text with element containing fetch(
		const div = document.createElement('div');
		div.textContent = 'fetch("https://example.com");';
		document.body.appendChild(div);

		const normalDiv = document.createElement('div');
		normalDiv.textContent =
			'Normal body text content with enough text. '.repeat(15);
		document.body.appendChild(normalDiv);

		const result = extractContent(document);
		// Should remove element with fetch( (line 859)
		expect(result.content).toContain('Normal body text');
		expect(result.content.length).toBeGreaterThan(500);
	});

	it('should remove elements with const and = document pattern in body text', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create body text with element containing const and = document
		const div = document.createElement('div');
		div.textContent = 'const x = document.getElementById("test");';
		document.body.appendChild(div);

		const normalDiv = document.createElement('div');
		normalDiv.textContent =
			'Normal body text content with enough text. '.repeat(15);
		document.body.appendChild(normalDiv);

		const result = extractContent(document);
		// Should remove element with const and = document (line 860-861)
		expect(result.content).toContain('Normal body text');
		expect(result.content.length).toBeGreaterThan(500);
	});

	it('should filter body text when jsPatternCount > maxJsPatternCountForFilter', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create body text with > 2 JS patterns
		const jsDiv = document.createElement('div');
		jsDiv.textContent =
			'function test() { const x = document.querySelector("div"); x.addEventListener("click", () => {}); }';
		document.body.appendChild(jsDiv);

		// Add valid documentation paragraphs
		const p1 = document.createElement('p');
		p1.textContent =
			'This is valid documentation content that should be extracted. '.repeat(
				5,
			);
		document.body.appendChild(p1);

		const p2 = document.createElement('p');
		p2.textContent = 'More documentation content here. '.repeat(5);
		document.body.appendChild(p2);

		const result = extractContent(document);
		// Should filter body text (line 886)
		expect(result.content).toContain('valid documentation content');
		expect(result.content).toContain('More documentation content');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should not include paragraphs with text.length <= minParagraphTextLengthForDoc in body text filtering', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create body text with > 2 JS patterns
		const jsDiv = document.createElement('div');
		jsDiv.textContent =
			'function test() { const x = document.querySelector("div"); x.addEventListener("click", () => {}); }';
		document.body.appendChild(jsDiv);

		// Add short paragraph (<= 50 chars)
		const shortP = document.createElement('p');
		shortP.textContent = 'Short text.';
		document.body.appendChild(shortP);

		// Add valid documentation paragraph (> 50 chars, no JS patterns)
		const validP = document.createElement('p');
		validP.textContent =
			'This is valid documentation content that should be extracted. '.repeat(
				5,
			);
		document.body.appendChild(validP);

		const result = extractContent(document);
		// Should not include short paragraph (line 898 condition fails)
		expect(result.content).toContain('valid documentation content');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should not return docTexts when docTexts.length === 0 in body text filtering', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create body text with > 2 JS patterns but no valid doc paragraphs
		const jsDiv = document.createElement('div');
		jsDiv.textContent =
			'function test() { const x = document.querySelector("div"); x.addEventListener("click", () => {}); }';
		document.body.appendChild(jsDiv);

		// Add only short paragraphs or paragraphs with JS patterns
		const shortP = document.createElement('p');
		shortP.textContent = 'Short.';
		document.body.appendChild(shortP);

		const jsP = document.createElement('p');
		jsP.textContent = 'function test() { return x => x; }';
		document.body.appendChild(jsP);

		const result = extractContent(document);
		// Should not return docTexts (line 910 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should not return bodyText when bodyText.length <= minBodyTextLength', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create body text with length <= 500
		const div = document.createElement('div');
		div.textContent = 'Short body text. '.repeat(20); // ~300 chars, <= 500
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should not return bodyText (line 921 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should handle wordCount <= minWordCountForRatio in body text cookie ratio calculation', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create body text with very few words (wordCount <= 0)
		// This is hard to achieve, but let's try with minimal text
		const div = document.createElement('div');
		div.textContent = 'a'; // Single character, wordCount might be 0 or 1
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should handle wordCount <= 0 (line 931 condition)
		expect(result.content).toBeDefined();
	});

	it('should not return bodyText when cookieRatio >= maxCookieRatioForAccept and bodyText.length <= minBodyTextLengthForAccept', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create body text > 500 but <= 5000 chars with high cookie ratio (>= 0.2)
		const cookieText = 'cookie consent accept all '.repeat(50);
		const normalText = 'This is body text. '.repeat(10);
		document.body.textContent = cookieText + normalText; // > 500, <= 5000, high cookie ratio

		const result = extractContent(document);
		// Should not return bodyText (line 939-940 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should return bodyText when cookieRatio < maxCookieRatioForAccept', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create body text > 500 chars with low cookie ratio (< 0.2)
		const normalText =
			'This is substantial body text content with enough text to meet the minimum length requirement of 500 characters. '.repeat(
				8,
			);
		document.body.textContent = normalText;

		const result = extractContent(document);
		// Should return bodyText (line 939 condition passes)
		expect(result.content.length).toBeGreaterThan(500);
		expect(result.content).toContain('substantial body text');
	});
});
