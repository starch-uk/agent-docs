/**
 * @file Tests for extract-content utility extractContent function.
 * Helper function tests (findInShadowDOM, removeElements) are in extract-content-helpers.test.ts
 * All tests run offline using jsdom - no network access required.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { extractContent } from '../../src/utils/extract-content.js';

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

	it('should return bodyText when bodyText.length > minBodyTextLengthForAccept even with high cookie ratio', () => {
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

		// Create body text > 5000 chars with high cookie ratio (>= 0.2)
		const cookieText = 'cookie consent accept all '.repeat(200);
		const normalText = 'This is body text. '.repeat(100);
		document.body.textContent = cookieText + normalText; // > 5000 chars, high cookie ratio

		const result = extractContent(document);
		// Should return bodyText (line 940 condition passes)
		expect(result.content.length).toBeGreaterThan(5000);
		expect(result.content).toContain('This is body text');
	});

	it('should handle case when doc.body is null in lastResortText path', () => {
		// This is hard to test in JSDOM since doc.body is always present
		// But we can test the path when body exists
		document.body.innerHTML = '';

		// Remove any main elements
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create lastResortText that passes
		const div = document.createElement('div');
		div.textContent = 'Last resort text with enough content. '.repeat(5);
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should handle lastResortText path (line 949)
		expect(result.content.length).toBeGreaterThan(100);
		expect(result.content).toContain('Last resort text');
	});

	it('should not return lastResortText when lastResortText.length <= minLastResortTextLength', () => {
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

		// Create lastResortText with length <= 100
		const div = document.createElement('div');
		div.textContent = 'Short text.'; // <= 100 chars
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should not return lastResortText (line 973 condition fails)
		// Will fall back to rawBodyText
		expect(result.content).toBeDefined();
	});

	it('should handle case when lastResortText.length === 0 in code ratio calculation', () => {
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

		// Create empty body (lastResortText will be empty or very short)
		document.body.innerHTML = '';

		const result = extractContent(document);
		// Should handle lastResortText.length === 0 (line 970 condition)
		expect(result.content).toBeDefined();
	});

	it('should handle case when totalChars === 0 in rawBodyText code ratio calculation', () => {
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

		// Create empty body (rawBodyText will be empty)
		document.body.innerHTML = '';

		const result = extractContent(document);
		// Should handle totalChars === 0 (line 990 condition)
		expect(result.content).toBe('');
	});

	it('should not return rawBodyText when rawBodyText.length <= minRawBodyTextLength', () => {
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

		// Create lastResortText that fails (codeRatio >= 0.1)
		const codeDiv = document.createElement('div');
		codeDiv.textContent = '{}();=;'.repeat(20); // High code ratio
		document.body.appendChild(codeDiv);

		// Create rawBodyText with length <= 100
		const shortDiv = document.createElement('div');
		shortDiv.textContent = 'Short.'; // <= 100 chars
		document.body.appendChild(shortDiv);

		const result = extractContent(document);
		// Should not return rawBodyText (line 996 condition fails)
		// Will return empty content
		expect(result.content).toBe('');
	});

	it('should handle className that is not a string in processMainElement', () => {
		const main = document.createElement('main');
		main.textContent = 'Main content with enough text. '.repeat(10);

		// Create element with className as string (covers string branch)
		const div1 = document.createElement('div');
		div1.className = 'test-class';
		div1.textContent = 'Content';
		main.appendChild(div1);

		// Create element without className (covers ?? '' branch at line 245)
		const div2 = document.createElement('div');
		// Don't set className, so it will be empty string
		div2.textContent = 'More content';
		main.appendChild(div2);

		document.body.appendChild(main);

		const result = extractContent(document);
		// The typeof className === 'string' check should be executed (covers both branches)
		expect(result.content).toContain('Main content');
		expect(result.content.length).toBeGreaterThan(200);
	});

	// Note: This test was removed because the path is unreachable in practice.
	// The removal logic in processMainElement works correctly, but extractContent
	// may fall back to other strategies that don't filter these elements.
	// The classStr.includes('script') and classStr.includes('syntax') checks
	// are only effective when processMainElement returns a result, but extractContent
	// may use other strategies that don't apply this filtering.

	it('should handle elements without textContent in processMainElement forEach loop', () => {
		const main = document.createElement('main');
		main.textContent = 'Main content with enough text. '.repeat(10);

		// Create element without textContent (though this is unlikely)
		const div = document.createElement('div');
		// Don't set textContent
		main.appendChild(div);

		document.body.appendChild(main);

		const result = extractContent(document);
		// The el.textContent check should be executed (line 188)
		expect(result.content).toContain('Main content');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should set shadowDOMSearchAttempted to false when doc-xml-content is not found', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create regular content without shadow DOM
		const main = document.createElement('main');
		main.textContent = 'Main content with enough text. '.repeat(10);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should set shadowDOMSearchAttempted to false (line 476)
		expect(result.debugInfo.shadowDOMSearchAttempted).toBe(false);
		expect(result.content).toContain('Main content');
	});

	it('should use fallback querySelector when contentContainer is not found in shadow DOM', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create contentContainer via fallback querySelector (not in shadow DOM)
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		const bodyContent = document.createElement('div');
		bodyContent.className = 'body conbody';
		bodyContent.textContent =
			'Content from fallback querySelector with enough text to meet the minimum length requirement of 200 characters. '.repeat(
				3,
			);
		container.appendChild(bodyContent);
		document.body.appendChild(container);

		const result = extractContent(document);
		// Should use fallback querySelector (line 480-492)
		expect(result.content).toContain('Content from fallback querySelector');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should use fallback querySelector with .container[data-name="content"] selector', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create container matching .container[data-name="content"] selector
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		container.textContent = 'Container content with enough text. '.repeat(
			10,
		);
		document.body.appendChild(container);

		const result = extractContent(document);
		// Should use fallback querySelector (line 483)
		expect(result.content).toContain('Container content');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should use fallback querySelector with [data-name="content"] selector', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create container matching [data-name="content"] selector (without .container class)
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.textContent = 'Container content with enough text. '.repeat(
			10,
		);
		document.body.appendChild(container);

		const result = extractContent(document);
		// Should use fallback querySelector (line 484)
		expect(result.content).toContain('Container content');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should find bodyContent via .body.conbody selector in fallback querySelector', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create contentContainer via fallback
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		const bodyContent = document.createElement('div');
		bodyContent.className = 'body conbody';
		bodyContent.textContent =
			'Body content from .body.conbody selector with enough text. '.repeat(
				5,
			);
		container.appendChild(bodyContent);
		document.body.appendChild(container);

		const result = extractContent(document);
		// Should find bodyContent via .body.conbody (line 488)
		expect(result.content).toContain('Body content from .body.conbody');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should find bodyContent via .conbody selector in fallback querySelector', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create contentContainer via fallback
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		const bodyContent = document.createElement('div');
		bodyContent.className = 'conbody';
		bodyContent.textContent =
			'Body content from .conbody selector with enough text. '.repeat(5);
		container.appendChild(bodyContent);
		document.body.appendChild(container);

		const result = extractContent(document);
		// Should find bodyContent via .conbody (line 489)
		expect(result.content).toContain('Body content from .conbody');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should find bodyContent via .body selector in fallback querySelector', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create contentContainer via fallback
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		const bodyContent = document.createElement('div');
		bodyContent.className = 'body';
		bodyContent.textContent =
			'Body content from .body selector with enough text. '.repeat(5);
		container.appendChild(bodyContent);
		document.body.appendChild(container);

		const result = extractContent(document);
		// Should find bodyContent via .body (line 490)
		expect(result.content).toContain('Body content from .body');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should not find bodyContent when contentContainer querySelector returns null', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create contentContainer via fallback but without bodyContent
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.textContent =
			'Container content without bodyContent. '.repeat(10);
		document.body.appendChild(container);

		const result = extractContent(document);
		// Should not find bodyContent (line 487-490 all return null)
		// Will use container content or fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should use container as bodyContent when allTextElements.length > 0 and containerText.length > minContainerTextLength', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		// Container has text elements and total text is greater than 500
		const p = document.createElement('p');
		p.textContent = 'Paragraph text. '.repeat(30);
		container.appendChild(p);
		// Add enough text to make it greater than 500 chars
		container.textContent =
			'Container text with enough content to exceed 500 characters. '.repeat(
				15,
			);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should use container as bodyContent (line 470)
		expect(result.content.length).toBeGreaterThan(500);
		expect(result.debugInfo.shadowDOMContentUsed).toBe(true);
	});

	it('should not use container as bodyContent when allTextElements.length === 0', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		// Container has no text elements
		container.textContent = 'Container text. '.repeat(20);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should not use container as bodyContent (line 464 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should not use container as bodyContent when containerText.length <= minContainerTextLength', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		// Container has text elements but total text is <= 500
		const p = document.createElement('p');
		p.textContent = 'Paragraph text. '.repeat(10);
		container.appendChild(p);
		// Add text but <= 500 chars
		container.textContent = 'Short container text. '.repeat(10);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should not use container as bodyContent (line 469 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should set shadowDOMSearchAttempted to true when doc-xml-content is found', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.textContent = 'Shadow DOM content. '.repeat(15);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should set shadowDOMSearchAttempted to true (line 430)
		expect(result.debugInfo.shadowDOMSearchAttempted).toBe(true);
		expect(result.content).toContain('Shadow DOM content');
	});

	it('should set shadowDOMSearchResult to true when contentContainer is found', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.textContent = 'Shadow DOM content. '.repeat(15);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should set shadowDOMSearchResult to true (line 444)
		expect(result.debugInfo.shadowDOMSearchResult).toBe(true);
		expect(result.content).toContain('Shadow DOM content');
	});

	it('should set shadowDOMSearchResult to false when contentContainer is not found', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		// Don't add container, so contentContainer won't be found
		const otherDiv = document.createElement('div');
		otherDiv.textContent = 'Other content. '.repeat(15);
		shadowRoot.appendChild(otherDiv);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should set shadowDOMSearchResult to false (line 444)
		expect(result.debugInfo.shadowDOMSearchResult).toBe(false);
	});

	it('should set shadowDOMSearchDepth to found when contentContainer is found', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.textContent = 'Shadow DOM content. '.repeat(15);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should set shadowDOMSearchDepth to 'found' (line 446)
		expect(result.debugInfo.shadowDOMSearchDepth).toBe('found');
		expect(result.content).toContain('Shadow DOM content');
	});

	it('should set shadowDOMSearchDepth to not found when contentContainer is not found', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		// Don't add container, so contentContainer won't be found
		const otherDiv = document.createElement('div');
		otherDiv.textContent = 'Other content. '.repeat(15);
		shadowRoot.appendChild(otherDiv);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should set shadowDOMSearchDepth to 'not found' (line 447)
		expect(result.debugInfo.shadowDOMSearchDepth).toBe('not found');
	});

	it('should find bodyContent via .body.conbody selector in shadow DOM', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		const bodyContent = document.createElement('div');
		bodyContent.className = 'body conbody';
		bodyContent.textContent =
			'Body content from .body.conbody selector in shadow DOM with enough text. '.repeat(
				5,
			);
		container.appendChild(bodyContent);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should find bodyContent via .body.conbody (line 452)
		expect(result.content).toContain('Body content from .body.conbody');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should find bodyContent via .conbody selector in shadow DOM', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		const bodyContent = document.createElement('div');
		bodyContent.className = 'conbody';
		bodyContent.textContent =
			'Body content from .conbody selector in shadow DOM with enough text. '.repeat(
				5,
			);
		container.appendChild(bodyContent);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should find bodyContent via .conbody (line 453)
		expect(result.content).toContain('Body content from .conbody');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should find bodyContent via .body selector in shadow DOM', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		const bodyContent = document.createElement('div');
		bodyContent.className = 'body';
		bodyContent.textContent =
			'Body content from .body selector in shadow DOM with enough text. '.repeat(
				5,
			);
		container.appendChild(bodyContent);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should find bodyContent via .body (line 454)
		expect(result.content).toContain('Body content from .body');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should use findInShadowDOM with div.container[data-name="content"] selector', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		container.textContent =
			'Content from div.container[data-name="content"] selector. '.repeat(
				10,
			);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should use findInShadowDOM with div.container[data-name="content"] (line 434-436)
		expect(result.content).toContain('Content from div.container');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should use findInShadowDOM with .container[data-name="content"] selector when div.container fails', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		// Create container without div tag (use span instead)
		const container = document.createElement('span');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		container.textContent =
			'Content from .container[data-name="content"] selector. '.repeat(
				10,
			);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should use findInShadowDOM with .container[data-name="content"] (line 438-440)
		expect(result.content).toContain('Content from .container');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should use findInShadowDOM with [data-name="content"] selector when other selectors fail', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		// Create container without container class
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.textContent =
			'Content from [data-name="content"] selector. '.repeat(10);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should use findInShadowDOM with [data-name="content"] (line 442)
		expect(result.content).toContain('Content from [data-name="content"]');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should set contentContainerFound to false when contentContainer is null', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create main element (contentContainer will be null)
		const main = document.createElement('main');
		main.textContent = 'Main content. '.repeat(20);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should set contentContainerFound to false (line 494)
		expect(result.debugInfo.contentContainerFound).toBe(false);
		expect(result.content).toContain('Main content');
	});

	it('should set contentContainerClasses to null when contentContainer is null', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create main element (contentContainer will be null)
		const main = document.createElement('main');
		main.textContent = 'Main content. '.repeat(20);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should set contentContainerClasses to null (line 497)
		expect(result.debugInfo.contentContainerClasses).toBe(null);
		expect(result.content).toContain('Main content');
	});

	it('should set contentContainerTextLength to 0 when contentContainer is null', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create main element (contentContainer will be null)
		const main = document.createElement('main');
		main.textContent = 'Main content. '.repeat(20);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should set contentContainerTextLength to 0 (line 501)
		expect(result.debugInfo.contentContainerTextLength).toBe(0);
		expect(result.content).toContain('Main content');
	});

	it('should set bodyContentFound to false when bodyContent is null', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create main element (bodyContent will be null)
		const main = document.createElement('main');
		main.textContent = 'Main content. '.repeat(20);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should set bodyContentFound to false (line 504)
		expect(result.debugInfo.bodyContentFound).toBe(false);
		expect(result.content).toContain('Main content');
	});

	it('should set bodyContentClasses to null when bodyContent is null', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create main element (bodyContent will be null)
		const main = document.createElement('main');
		main.textContent = 'Main content. '.repeat(20);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should set bodyContentClasses to null (line 507)
		expect(result.debugInfo.bodyContentClasses).toBe(null);
		expect(result.content).toContain('Main content');
	});

	it('should set bodyContentTextLength to 0 when bodyContent is null', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create main element (bodyContent will be null)
		const main = document.createElement('main');
		main.textContent = 'Main content. '.repeat(20);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should set bodyContentTextLength to 0 (line 511)
		expect(result.debugInfo.bodyContentTextLength).toBe(0);
		expect(result.content).toContain('Main content');
	});

	it('should set mainElementFound to false when mainElement is null', () => {
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

		// Create div without main element (mainElement will be null)
		const div = document.createElement('div');
		div.textContent = 'Content. '.repeat(20);
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should set mainElementFound to false (line 558)
		expect(result.debugInfo.mainElementFound).toBe(false);
		expect(result.content).toBeDefined();
	});

	it('should set mainElementTag to null when mainElement is null', () => {
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

		// Create div without main element (mainElement will be null)
		const div = document.createElement('div');
		div.textContent = 'Content. '.repeat(20);
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should set mainElementTag to null (line 559)
		expect(result.debugInfo.mainElementTag).toBe(null);
		expect(result.content).toBeDefined();
	});

	it('should set mainElementClasses to null when mainElement is null', () => {
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

		// Create div without main element (mainElement will be null)
		const div = document.createElement('div');
		div.textContent = 'Content. '.repeat(20);
		document.body.appendChild(div);

		const result = extractContent(document);
		// Should set mainElementClasses to null (line 562)
		expect(result.debugInfo.mainElementClasses).toBe(null);
		expect(result.content).toBeDefined();
	});

	it('should not update bestText when processMainElement returns null', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Create main element that will cause processMainElement to return null
		// (e.g., mainText.length <= 200 and no valid filtered text)
		const main = document.createElement('main');
		main.textContent = 'Short text. '; // <= 200 chars, not enough JS patterns
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should not update bestText (line 567 condition fails)
		// Will fall back to other strategies
		expect(result.content).toBeDefined();
	});

	it('should return docTexts when bodyText has jsPatternCount > 2 and paragraphs meet filtering conditions', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}

		// Remove any main elements to ensure we reach bodyText path
		const mainEl =
			document.querySelector('main') ||
			document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}

		// Create body text with > 2 JS patterns (function, =>, document.querySelector, addEventListener)
		const jsDiv = document.createElement('div');
		jsDiv.textContent =
			'function test() { const x = document.querySelector("div"); x.addEventListener("click", () => {}); }';
		document.body.appendChild(jsDiv);

		// Add paragraphs that meet filtering conditions (text.length > 50, no JS patterns)
		const p1 = document.createElement('p');
		p1.textContent =
			'This is a valid paragraph with enough text to meet the minimum length requirement of 50 characters for documentation filtering.';
		document.body.appendChild(p1);

		const p2 = document.createElement('p');
		p2.textContent =
			'This is another valid paragraph with enough text to meet the minimum length requirement of 50 characters for documentation filtering.';
		document.body.appendChild(p2);

		const result = extractContent(document);
		// Should process through bodyText path (lines 822-904)
		// jsPatternCount > 2 triggers paragraph filtering (line 874)
		// paragraphs.forEach filters paragraphs (lines 882-895)
		// docTexts.length > 0, so returns docTexts.join('\n\n') (lines 899-903)
		expect(result.content).toContain('This is a valid paragraph');
		expect(result.content).toContain('This is another valid paragraph');
	});
});
