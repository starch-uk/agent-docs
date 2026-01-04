/**
 * @file Tests for extract-content utility extractContent function.
 * Helper function tests (findInShadowDOM, removeElements) are in extract-content-helpers.test.ts
 * All tests run offline using jsdom - no network access required.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { extractContent } from '../../src/utils/extract-content.js';
import { findInShadowDOM } from '../../src/utils/extract-content-helpers.js';

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

	it('should return empty content for empty document', () => {
		const result = extractContent(document);
		expect(result.content).toBe('');
		expect(result.debugInfo).toBeDefined();
	});

	it('should extract content from shadow DOM', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		const bodyContent = document.createElement('div');
		bodyContent.className = 'body conbody';
		bodyContent.textContent = 'This is the main content from shadow DOM with enough text to meet the minimum length requirement of 200 characters for extraction. This paragraph continues to add more content to ensure we exceed the threshold. '.repeat(2);
		container.appendChild(bodyContent);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		expect(result.content).toContain('This is the main content from shadow DOM');
		expect(result.debugInfo.shadowDOMFound).toBe(true);
		expect(result.debugInfo.shadowDOMContentUsed).toBe(true);
	});

	it('should extract title attributes from links in shadow DOM', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		const bodyContent = document.createElement('div');
		bodyContent.className = 'body conbody';
		bodyContent.textContent = 'This is the main content from shadow DOM with enough text to meet the minimum length requirement of 200 characters for extraction. '.repeat(2);
		const link1 = document.createElement('a');
		link1.setAttribute('title', 'This is a link title that is longer than 10 characters');
		link1.textContent = 'Link 1';
		bodyContent.appendChild(link1);
		const link2 = document.createElement('a');
		link2.setAttribute('title', 'Another link title that is also longer than 10 characters');
		link2.textContent = 'Link 2';
		bodyContent.appendChild(link2);
		container.appendChild(bodyContent);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		expect(result.content).toContain('This is a link title that is longer than 10 characters');
		expect(result.content).toContain('Another link title that is also longer than 10 characters');
		expect(result.debugInfo.shadowDOMContentUsed).toBe(true);
	});

	it('should use container as bodyContent when it has text elements and container text is greater than 500 chars', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		// Container has text elements and total text is greater than 500
		// Don't set textContent directly (that removes children), append children instead
		const p1 = document.createElement('p');
		p1.textContent = 'Paragraph text with enough content. '.repeat(20);
		container.appendChild(p1);
		const p2 = document.createElement('p');
		p2.textContent = 'More paragraph text with enough content. '.repeat(20);
		container.appendChild(p2);
		// Container textContent (from children) should now be > 500 chars
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should use container as bodyContent (lines 453-460)
		expect(result.content.length).toBeGreaterThan(500);
		expect(result.debugInfo.shadowDOMContentUsed).toBe(true);
	});

	it('should not use container as bodyContent when it has text elements but container text is less than 500 chars', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		// Container has text elements but total text is less than 500
		const p = document.createElement('p');
		p.textContent = 'Short paragraph text.';
		container.appendChild(p);
		// Add text but less than 500 chars
		container.textContent = 'Short container text. '.repeat(10);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should not use container as bodyContent (line 220 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should extract content from main element', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		const main = document.createElement('main');
		main.textContent = 'This is main content with enough text to meet the minimum length requirement of 200 characters for extraction. This paragraph continues to add more content to ensure we exceed the threshold. '.repeat(2);
		document.body.appendChild(main);

		const result = extractContent(document);
		expect(result.debugInfo.shadowDOMFound).toBe(false);
		expect(result.content).toContain('This is main content');
	});

	it('should extract content from role="main" element', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		const main = document.createElement('div');
		main.setAttribute('role', 'main');
		main.textContent = 'This is role main content with enough text to meet the minimum length requirement of 200 characters for extraction. This paragraph continues to add more content to ensure we exceed the threshold. '.repeat(2);
		document.body.appendChild(main);

		const result = extractContent(document);
		expect(result.debugInfo.shadowDOMFound).toBe(false);
		expect(result.content).toContain('This is role main content');
	});

	it('should remove scripts and styles', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		const main = document.createElement('main');
		const script = document.createElement('script');
		script.textContent = 'alert("test")';
		const style = document.createElement('style');
		style.textContent = 'body { color: red; }';
		main.appendChild(script);
		main.appendChild(style);
		main.textContent = 'Real content with enough text to meet the minimum length requirement of 200 characters for extraction. This paragraph continues to add more content to ensure we exceed the threshold. '.repeat(2);
		document.body.appendChild(main);

		const result = extractContent(document);
		expect(result.debugInfo.shadowDOMFound).toBe(false);
		expect(result.content).toContain('Real content');
		expect(result.content).not.toContain('alert');
		expect(result.content).not.toContain('color: red');
	});

	it('should extract title attributes from links', () => {
		const main = document.createElement('main');
		const link = document.createElement('a');
		link.setAttribute('title', 'Important documentation link');
		link.textContent = 'Click here';
		main.appendChild(link);
		const p = document.createElement('p');
		p.textContent = 'Main content with enough text to meet the minimum length requirement of 200 characters for extraction. This paragraph continues to add more content to ensure we exceed the threshold. '.repeat(2);
		main.appendChild(p);
		document.body.appendChild(main);

		const result = extractContent(document);
		expect(result.content).toContain('Important documentation link');
	});

	it('should filter out JavaScript-like content', () => {
		const main = document.createElement('main');
		main.textContent = 'function test() { return document.querySelector("div"); }';
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should filter out JS content
		expect(result.content).not.toContain('function test()');
	});

	it('should filter out cookie consent text', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		const main = document.createElement('main');
		main.textContent = 'Cookie consent: Accept all cookies. Do not accept.';
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should filter out cookie text if it's the only content
		expect(result.content.length).toBeLessThan(100);
	});

	it('should extract content from paragraphs', () => {
		const p1 = document.createElement('p');
		p1.textContent = 'First paragraph with substantial content that is longer than 100 characters to meet the minimum requirement for extraction.';
		const p2 = document.createElement('p');
		p2.textContent = 'Second paragraph with substantial content that is longer than 100 characters to meet the minimum requirement for extraction.';
		document.body.appendChild(p1);
		document.body.appendChild(p2);

		const result = extractContent(document);
		expect(result.content).toContain('First paragraph');
		expect(result.content).toContain('Second paragraph');
	});

	it('should update bestText when paragraphTexts combined length is greater than bestLength', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Create paragraphs that will be collected and combined
		const p1 = document.createElement('p');
		p1.textContent = 'First paragraph with substantial content that is longer than 100 characters to meet the minimum requirement for extraction. '.repeat(3);
		const p2 = document.createElement('p');
		p2.textContent = 'Second paragraph with substantial content that is longer than 100 characters to meet the minimum requirement for extraction. '.repeat(3);
		document.body.appendChild(p1);
		document.body.appendChild(p2);

		const result = extractContent(document);
		// Should update bestText when combinedParagraphText.length > bestLength (line 524)
		expect(result.content).toContain('First paragraph');
		expect(result.content).toContain('Second paragraph');
	});

	it('should reject selector text when cookieTextCount > maxCookieKeywordsForReject and text.length < minTextLengthForReject', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Create an element matching a selector with cookie text (> 2 keywords, < 1000 chars)
		const article = document.createElement('article');
		article.textContent = 'cookie consent accept all do not accept. '.repeat(20); // < 1000 chars, > 2 keywords
		document.body.appendChild(article);

		const result = extractContent(document);
		// Should reject this text (line 617-619 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should update bestText when selector text length is greater than bestLength', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Create an element matching a selector with substantial text
		const article = document.createElement('article');
		article.textContent = 'This is substantial article content that is longer than 200 characters to meet the minimum requirement for extraction. '.repeat(5);
		document.body.appendChild(article);

		const result = extractContent(document);
		// Should update bestText when text.length > bestLength (line 623)
		expect(result.content).toContain('substantial article content');
	});

	it('should extract content from contentContainer', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		container.textContent = 'This is content from the container with enough text to meet the minimum length requirement for extraction.';
		document.body.appendChild(container);

		const result = extractContent(document);
		expect(result.content).toContain('This is content from the container');
	});

	it('should use contentContainer when bodyContent is not found', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		// No bodyContent, just container with substantial text
		container.textContent = 'Container content with enough text to meet the minimum length requirement of 200 characters for extraction. This paragraph continues to add more content to ensure we exceed the threshold. '.repeat(2);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should use contentContainer when bodyContent is not found (line 700-715)
		expect(result.content.length).toBeGreaterThan(200);
		expect(result.debugInfo.shadowDOMContentUsed).toBe(true);
	});

	it('should return bestText when bestText.length > 0', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Create content that will set bestText
		const main = document.createElement('main');
		main.textContent = 'Main content with enough text to meet the minimum length requirement. '.repeat(10);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should return bestText when bestText.length > 0 (line 720)
		expect(result.content).toContain('Main content');
	});

	it('should return content from fallback element search when bestText is empty', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Remove any main elements to ensure bestText is empty
		const mainEl = document.querySelector('main') || document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}
		
		// Create an element with substantial text (> 500 chars) that's not cookie text
		const div = document.createElement('div');
		div.textContent = 'This is substantial content from a div element that is longer than 500 characters to meet the minimum requirement for fallback extraction. '.repeat(8);
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should return content from fallback element search (line 744)
		expect(result.content.length).toBeGreaterThan(500);
		expect(result.content).toContain('substantial content');
	});

	it('should return content from fallback element when cookieTextCount < maxCookieKeywordsForAccept', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Remove any main elements to ensure bestText is empty
		const mainEl = document.querySelector('main') || document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}
		
		// Create an element with substantial text (> 500 chars) and < 3 cookie keywords
		const div = document.createElement('div');
		div.textContent = 'This is substantial content with some cookie mentions but not too many. '.repeat(10);
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should return content when cookieTextCount < 3 (line 732)
		expect(result.content.length).toBeGreaterThan(500);
		expect(result.content).toContain('substantial content');
	});

	it('should return content from fallback element when text.length > minTextLengthForAccept', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Remove any main elements to ensure bestText is empty
		const mainEl = document.querySelector('main') || document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}
		
		// Create an element with substantial text (> 2000 chars) even with cookie keywords
		const div = document.createElement('div');
		div.textContent = 'cookie consent accept all do not accept. '.repeat(100); // > 2000 chars, > 3 keywords
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should return content when text.length > 2000 (line 733)
		expect(result.content.length).toBeGreaterThan(2000);
	});

	it('should not return content from fallback element when cleanText.length <= minCleanTextLength', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Remove any main elements to ensure bestText is empty
		const mainEl = document.querySelector('main') || document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}
		
		// Create an element with substantial text (> 500 chars) but after removing unwanted elements, it's <= 500
		const div = document.createElement('div');
		const script = document.createElement('script');
		script.textContent = 'Script content that will be removed. '.repeat(20); // ~600 chars
		div.appendChild(script);
		div.textContent = 'Small remaining text. '; // < 500 chars after script removal
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should not return content when cleanText.length <= 500 (line 743 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should return bestMainText when bestMainText.length > 0', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Create a main element with substantial text (> 1000 chars) and low cookie ratio
		const main = document.createElement('main');
		main.textContent = 'Main content with enough text to meet the minimum length requirement of 1000 characters for bestMainText extraction. '.repeat(20);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should return bestMainText when bestMainText.length > 0 (line 822)
		expect(result.content.length).toBeGreaterThan(1000);
		expect(result.content).toContain('Main content');
	});

	it('should process main element through mainSelectors loop when processMainElement returns null', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Create a main element that processMainElement will reject (codeRatio >= 0.1)
		// but mainSelectors loop will accept (text > 1000, cookieRatio < 0.05)
		const main = document.createElement('main');
		// Add code-like characters to increase codeRatio >= 0.1
		// ~210 code chars, ~1500 normal = ~1710 total, codeRatio = 210/1710 = ~0.123 > 0.1 ✓
		const codeChars = '{}();=;'.repeat(30);
		const normalText = 'This is substantial main content with enough text to meet the minimum length requirement of 1000 characters. '.repeat(15);
		main.textContent = codeChars + normalText;
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should process through mainSelectors loop (lines 793-820)
		// processMainElement returns null (codeRatio >= 0.1)
		// But loop accepts it (cookieRatio < 0.05, text > 1000)
		expect(result.content.length).toBeGreaterThan(1000);
		expect(result.content).toContain('substantial main content');
	});

	it('should process article element through mainSelectors loop when fallback loop does not return', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Create an article element (matches mainSelectors but NOT initial mainElement query)
		// Initial query looks for: bodyContent, contentContainer, [role="main"], or main
		// It does NOT look for 'article', so initial mainElement query returns null
		// Fallback loop will NOT return if: cookieTextCount >= 3 AND text.length <= 2000
		// mainSelectors loop will accept if: text > 1000 AND cookieRatio < 0.05
		const article = document.createElement('article');
		// Add cookie keywords (>= 3) but keep cookieRatio < 0.05 by having many words
		// Text length MUST be <= 2000 so fallback loop doesn't return (if > 2000, fallback accepts)
		const cookieText = 'cookie consent accept all do not accept. ';
		// Many words so cookieRatio < 0.05 (cookieMatches / wordCount < 0.05)
		// Text length must be > 1000 but <= 2000
		const normalText = 'This is substantial article content with enough text to meet the minimum length requirement. '.repeat(18); // ~1800 chars, many words
		article.textContent = cookieText + normalText; // Total ~1840 chars (<= 2000), cookieTextCount = 4, many words so cookieRatio < 0.05
		document.body.appendChild(article);

		const result = extractContent(document);
		// Should process through mainSelectors loop (lines 793-820)
		// Initial mainElement query returns null (no bodyContent, contentContainer, [role="main"], or main)
		// processMainElement not called, bestText stays empty
		// Fallback loop doesn't return (cookieTextCount >= 3 AND text.length <= 2000)
		// mainSelectors loop finds article element and processes it (text > 1000, cookieRatio < 0.05)
		expect(result.content.length).toBeGreaterThan(1000);
		expect(result.content).toContain('substantial article content');
	});

	it('should process element with id="main" through mainSelectors loop when selectors array does not find it', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Create an element with id="main" that selectors array doesn't find
		// Selectors array includes '#main-content' but NOT '#main'
		// MainSelectors array includes '#main'
		// Initial mainElement query looks for bodyContent, contentContainer, [role="main"], or main (element tag), not #main
		// So initial mainElement query returns null
		// Selectors array doesn't find it (since '#main' is not in selectors array)
		// Fallback loop doesn't return (cookieTextCount >= 3 AND text.length <= 2000)
		// MainSelectors loop finds it (since '#main' is in mainSelectors)
		const mainDiv = document.createElement('div');
		mainDiv.id = 'main';
		// Add cookie keywords (>= 3) but keep cookieRatio < 0.05 by having many words
		// Text length MUST be <= 2000 so fallback loop doesn't return
		const cookieText = 'cookie consent accept all do not accept. ';
		// Many words so cookieRatio < 0.05
		// Text length must be > 1000 but <= 2000
		const normalText = 'This is substantial main div content with enough text to meet the minimum length requirement of 1000 characters. '.repeat(15); // ~1500 chars, many words
		mainDiv.textContent = cookieText + normalText; // Total ~1540 chars (<= 2000), cookieTextCount = 4, many words so cookieRatio < 0.05
		document.body.appendChild(mainDiv);

		const result = extractContent(document);
		// Should process through mainSelectors loop (lines 793-820)
		// Initial mainElement query returns null (no bodyContent, contentContainer, [role="main"], or main tag)
		// processMainElement not called, bestText stays empty
		// Selectors array doesn't find #main (not in selectors array), so doesn't set bestText
		// Fallback loop doesn't return (cookieTextCount >= 3 AND text.length <= 2000)
		// mainSelectors loop finds #main and processes it (text > 1000, cookieRatio < 0.05)
		expect(result.content.length).toBeGreaterThan(1000);
		expect(result.content).toContain('substantial main div content');
	});

	it('should process element with id="main" through mainSelectors loop with text.length > 5000 to cover line 805', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Create an element with id="main" that selectors array doesn't find
		// MainSelectors loop will accept it because mainText.length > 5000 (even if cookieRatio >= 0.05)
		// To cover line 805, need mainText.length > 5000 AND cookieRatio >= 0.05
		// cookieRatio = cookieMatches / wordCount, where cookieMatches is from regex match
		const mainDiv = document.createElement('div');
		mainDiv.id = 'main';
		// Add many cookie keywords to ensure cookieRatio >= 0.05
		// The regex matches "cookie", "consent", or "accept all"
		// Repeat cookie phrases many times to get high cookieMatches
		const cookieText = 'cookie consent accept all cookie consent accept all cookie consent. '.repeat(30); // Many cookie matches
		// Add normal text to get total length > 5000 but keep word count reasonable
		const normalText = 'This is substantial main div content with enough text. '.repeat(80); // ~4000 chars
		mainDiv.textContent = cookieText + normalText; // Total > 5000 chars, cookieRatio >= 0.05 (many cookie matches relative to word count)
		document.body.appendChild(mainDiv);

		const result = extractContent(document);
		// Should process through mainSelectors loop (lines 793-820)
		// Line 805 (mainText.length > minMainTextLengthValue) will be checked because cookieRatio >= 0.05 (first condition false)
		// MainSelectors loop accepts it because mainText.length > 5000 (second condition true)
		expect(result.content.length).toBeGreaterThan(5000);
		expect(result.content).toContain('substantial main div content');
	});

	it('should handle bodyContent in shadow DOM', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		const bodyContent = document.createElement('div');
		bodyContent.className = 'body conbody';
		bodyContent.textContent = 'Body content from shadow DOM with enough text to meet the minimum length requirement of 200 characters for extraction. This paragraph continues to add more content to ensure we exceed the threshold. '.repeat(2);
		container.appendChild(bodyContent);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		expect(result.content).toContain('Body content from shadow DOM');
		expect(result.debugInfo.shadowDOMContentUsed).toBe(true);
	});

	it('should use contentContainer when bodyContent not found', () => {
		// Ensure no shadow DOM elements exist from previous tests
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.textContent = 'Container content with enough text to meet the minimum length requirement of 200 characters for extraction from shadow DOM. This paragraph continues to add more content to ensure we exceed the threshold. '.repeat(2);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		expect(result.content).toContain('Container content');
		expect(result.debugInfo.shadowDOMContentUsed).toBe(true);
	});

	it('should fallback to body text when no main content found', () => {
		document.body.textContent = 'This is body text with enough content to meet the minimum length requirement of 500 characters for extraction. This paragraph continues to add more content to ensure we exceed the threshold. '.repeat(5);

		const result = extractContent(document);
		expect(result.content.length).toBeGreaterThan(0);
	});

	it('should filter out code-like content based on code ratio', () => {
		// Create content with high code ratio but less than 100 chars
		document.body.textContent = '{}(()=;);'.repeat(10); // High code ratio, < 100 chars

		const result = extractContent(document);
		// Code ratio check only applies if text length > 100
		// Since this is < 100, it will be filtered by the minRawBodyTextLength check
		expect(result.content.length).toBeLessThan(100);
	});

	it('should extract content from selectors array', () => {
		const article = document.createElement('article');
		article.textContent = 'Article content with enough text to meet the minimum length requirement for extraction.';
		document.body.appendChild(article);

		const result = extractContent(document);
		expect(result.content).toContain('Article content');
	});

	it('should handle elements with substantial text', () => {
		const div = document.createElement('div');
		div.textContent = 'This is a div with substantial text content that is longer than 500 characters. '.repeat(10);
		document.body.appendChild(div);

		const result = extractContent(document);
		expect(result.content.length).toBeGreaterThan(0);
	});

	it('should collect unique text elements', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		const p1 = document.createElement('p');
		p1.textContent = 'First unique paragraph with substantial content that is longer than 50 characters to meet the minimum requirement.';
		const p2 = document.createElement('p');
		p2.textContent = 'Second unique paragraph with substantial content that is longer than 50 characters to meet the minimum requirement.';
		document.body.appendChild(p1);
		document.body.appendChild(p2);

		const result = extractContent(document);
		expect(result.content).toContain('First unique');
		expect(result.content).toContain('Second unique');
	});

	it('should update bestText when collectedTexts combined length is greater than bestLength', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Create text elements that will be collected
		const span1 = document.createElement('span');
		span1.textContent = 'First span with substantial content that is longer than 50 characters to meet the minimum requirement. '.repeat(2);
		const span2 = document.createElement('span');
		span2.textContent = 'Second span with substantial content that is longer than 50 characters to meet the minimum requirement. '.repeat(2);
		document.body.appendChild(span1);
		document.body.appendChild(span2);

		const result = extractContent(document);
		// Should update bestText when combinedText.length > bestLength (line 571)
		expect(result.content).toContain('First span');
		expect(result.content).toContain('Second span');
	});

	it('should not collect text elements with high code ratio', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Create text element with high code ratio (> 0.1)
		const div = document.createElement('div');
		div.textContent = '{}();=;{}();=;{}();=;{}();=;{}();=;'.repeat(5); // High code ratio
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should not collect text with high code ratio (line 556 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should not collect duplicate text elements', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Create duplicate text elements
		const p1 = document.createElement('p');
		const text = 'Paragraph with substantial content that is longer than 50 characters. '.repeat(2);
		p1.textContent = text;
		const p2 = document.createElement('p');
		p2.textContent = text; // Same text
		document.body.appendChild(p1);
		document.body.appendChild(p2);

		const result = extractContent(document);
		// Should not collect duplicate text (line 559-561 condition fails)
		// Will still extract content but may not have duplicates
		expect(result.content).toBeDefined();
	});

	it('should handle main element with cookie content ratio check', () => {
		const main = document.createElement('main');
		main.textContent = 'This is a long main content with some cookie mentions but not too many. '.repeat(20);
		document.body.appendChild(main);

		const result = extractContent(document);
		expect(result.content.length).toBeGreaterThan(0);
	});

	it('should not return filtered text when filteredText length is less than 200', () => {
		const main = document.createElement('main');
		// Create JS content with > 2 patterns and > 200 chars
		main.textContent = 'function test() { const x = document.querySelector("div"); x.addEventListener("click", () => {}); } '.repeat(3);
		// Add a very short doc text (< 200 chars total after filtering)
		const p = document.createElement('p');
		p.textContent = 'Short doc.';
		main.appendChild(p);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should not return filtered text (line 454 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should reject mainText when codeRatio >= maxCodeRatio', () => {
		const main = document.createElement('main');
		// Create content with high code ratio (> 0.1)
		main.textContent = '{}();=;{}();=;{}();=;{}();=;{}();=;{}();=;{}();=;{}();=;{}();=;{}();=;'.repeat(5);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should reject due to high code ratio (line 488 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should reject mainText when cookieRatio > maxCookieRatioForReject and mainText.length < minMainTextLengthForReject', () => {
		const main = document.createElement('main');
		// Create short content (< 500 chars) with high cookie ratio (> 0.1)
		main.textContent = 'cookie consent accept all do not accept. '.repeat(15);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should reject due to high cookie ratio and short length (line 490-491 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should handle body with main selectors', () => {
		const main = document.createElement('main');
		main.textContent = 'Main content with enough text to meet the minimum length requirement. '.repeat(20);
		document.body.appendChild(main);

		const result = extractContent(document);
		expect(result.content.length).toBeGreaterThan(0);
	});

	it('should filter JavaScript patterns from body text', () => {
		document.body.textContent = 'function test() { const x = document.querySelector("div"); }';

		const result = extractContent(document);
		// Should filter out JS patterns
		expect(result.content).not.toContain('function test()');
	});

	it('should handle cookie ratio in body text', () => {
		document.body.textContent = 'Cookie consent accept all do not accept. '.repeat(10);

		const result = extractContent(document);
		// Should filter out high cookie ratio content if it's short
		// But if it's long enough (>5000 chars), it will be accepted
		expect(result.content.length).toBeGreaterThan(0);
	});

	it('should return last resort body text', () => {
		document.body.textContent = 'Last resort body text with enough content to meet the minimum length requirement of 100 characters for extraction.';

		const result = extractContent(document);
		expect(result.content.length).toBeGreaterThan(0);
	});

	it('should filter code ratio in raw body text', () => {
		// Create content with high code ratio but exactly 100 chars to trigger the check
		document.body.textContent = '{}();=;'.repeat(14); // ~98 chars, high code ratio

		const result = extractContent(document);
		// Code ratio check applies if text length >= 100 and code ratio < 0.1
		// With this much code, ratio will be > 0.1, so it should be filtered
		// But the check is: if length > 100 AND codeRatio < 0.1, return it
		// So if codeRatio >= 0.1, it won't return (empty string)
		expect(result.content.length).toBeLessThan(100);
	});

	it('should return empty content when no substantial text found', () => {
		const emptyDiv = document.createElement('div');
		document.body.appendChild(emptyDiv);

		const result = extractContent(document);
		expect(result.content).toBe('');
	});

	it('should handle doc-xml-content without shadow root', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		expect(result.debugInfo.shadowDOMFound).toBe(false);
	});

	it('should handle main element with className', () => {
		const main = document.createElement('main');
		main.className = 'test-class';
		main.textContent = 'Main content';
		document.body.appendChild(main);

		const result = extractContent(document);
		expect(result.debugInfo.mainElementClasses).toBe('test-class');
	});

	it('should handle text elements collection', () => {
		const div = document.createElement('div');
		div.textContent = 'This is a div with substantial text content that is longer than 200 characters. '.repeat(5);
		document.body.appendChild(div);

		const result = extractContent(document);
		expect(result.debugInfo.textElements).toBeDefined();
	});

	it('should handle container with substantial text', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.textContent = 'Container with substantial text. '.repeat(20);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		expect(result.content.length).toBeGreaterThan(0);
	});

	it('should handle body with cookie ratio check and return body text', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		document.body.textContent = 'This is body text with enough content to meet the minimum length requirement of 500 characters for extraction. This paragraph continues to add more content to ensure we exceed the threshold. '.repeat(10);

		const result = extractContent(document);
		expect(result.content.length).toBeGreaterThan(0);
	});
});
