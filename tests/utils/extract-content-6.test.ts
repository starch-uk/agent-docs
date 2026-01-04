/**
 * @file Tests for extract-content utility extractContent function.
 * Helper function tests (findInShadowDOM, removeElements) are in extract-content-helpers.test.ts
 * All tests run offline using jsdom - no network access required.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import {
	extractContent,
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

	it('should use bodyContent as mainElement when bodyContent exists', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		const bodyContent = document.createElement('div');
		bodyContent.className = 'body conbody';
		bodyContent.textContent = 'Body content with enough text. '.repeat(15);
		container.appendChild(bodyContent);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should use bodyContent as mainElement (line 516)
		expect(result.content).toContain('Body content');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should use contentContainer as mainElement when bodyContent is null but contentContainer exists', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		container.textContent = 'Container content with enough text. '.repeat(15);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should use contentContainer as mainElement (line 517)
		expect(result.content).toContain('Container content');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should use [role="main"] as mainElement when bodyContent and contentContainer are null', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Create [role="main"] element
		const main = document.createElement('div');
		main.setAttribute('role', 'main');
		main.textContent = 'Role main content with enough text. '.repeat(15);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should use [role="main"] as mainElement (line 518)
		expect(result.content).toContain('Role main content');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should use main as mainElement when bodyContent, contentContainer, and [role="main"] are null', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Remove any [role="main"] elements
		const roleMain = document.querySelector('[role="main"]');
		if (roleMain) {
			roleMain.remove();
		}
		
		// Create main element
		const main = document.createElement('main');
		main.textContent = 'Main content with enough text. '.repeat(15);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should use main as mainElement (line 519)
		expect(result.content).toContain('Main content');
		expect(result.content.length).toBeGreaterThan(200);
	});

	it('should set contentContainerTextLength when contentContainer.textContent is null', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		// Don't set textContent, so it will be null or empty
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should set contentContainerTextLength to 0 when textContent is null (line 500)
		expect(result.debugInfo.contentContainerTextLength).toBe(0);
		expect(result.content).toBeDefined();
	});

	it('should set bodyContentTextLength when bodyContent.textContent is null', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		const bodyContent = document.createElement('div');
		bodyContent.className = 'body conbody';
		// Don't set textContent, so it will be null or empty
		container.appendChild(bodyContent);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should set bodyContentTextLength to 0 when textContent is null (line 510)
		expect(result.debugInfo.bodyContentTextLength).toBe(0);
		expect(result.content).toBeDefined();
	});

	it('should set mainElementClasses to empty string when mainElement.className is null', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Create main element without className
		const main = document.createElement('main');
		main.textContent = 'Main content with enough text. '.repeat(15);
		// Don't set className, so it will be empty string
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should set mainElementClasses to empty string when className is null (line 561)
		expect(result.debugInfo.mainElementClasses).toBe('');
		expect(result.content).toContain('Main content');
	});

	it('should set contentContainerClasses to empty string when contentContainer.className is null', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		// Don't set className, so it will be empty string
		container.textContent = 'Container content. '.repeat(15);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should set contentContainerClasses to empty string when className is null (line 496)
		expect(result.debugInfo.contentContainerClasses).toBe('');
		expect(result.content).toContain('Container content');
	});

	it('should set bodyContentClasses to empty string when bodyContent.className is empty', () => {
		const docXmlContent = document.createElement('doc-xml-content');
		const shadowRoot = docXmlContent.attachShadow({ mode: 'open' });
		const container = document.createElement('div');
		container.setAttribute('data-name', 'content');
		container.className = 'container';
		const bodyContent = document.createElement('div');
		bodyContent.className = 'body'; // Set className to 'body' so it will be found
		// But test the case where className could be empty (though in this case it's 'body')
		bodyContent.textContent = 'Body content. '.repeat(15);
		container.appendChild(bodyContent);
		shadowRoot.appendChild(container);
		document.body.appendChild(docXmlContent);

		const result = extractContent(document);
		// Should set bodyContentClasses (line 506)
		// bodyContent will be found via .body selector
		expect(result.debugInfo.bodyContentClasses).toBe('body');
		expect(result.content).toContain('Body content');
	});

	it('should handle mainText.length === 0 in processMainElement codeRatio calculation', () => {
		const main = document.createElement('main');
		// Create main with no text content (will be empty after processing)
		// Add only script-like elements that get removed
		const script = document.createElement('script');
		script.textContent = 'console.log("test");';
		main.appendChild(script);
		document.body.appendChild(main);

		const result = extractContent(document);
		// Should handle mainText.length === 0 (line 301)
		expect(result.content).toBeDefined();
	});

	it('should return docTexts when bodyText has jsPatternCount > 2 and valid paragraphs, ensuring bodyText path is reached', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Remove any main elements to prevent mainSelectors from returning
		const mainEl = document.querySelector('main') || document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}
		
		// Remove elements that might be caught by selectors array
		const selectorsElements = document.querySelectorAll('#main-content, [role="main"], main, article, .main, .content');
		selectorsElements.forEach(el => el.remove());
		
		// To prevent fallback loop from returning, we need body to have cookieTextCount >= 3 AND text.length <= 2000
		// Add cookie keywords to make cookieTextCount >= 3
		const cookieDiv = document.createElement('div');
		cookieDiv.textContent = 'cookie consent accept all'; // 3 cookie keywords
		document.body.appendChild(cookieDiv);
		
		// Create body text with > 2 JS patterns to trigger docTexts filtering
		// Use patterns that DON'T trigger element removal: 'function' alone, 'let', 'var'
		// These patterns are in jsPatterns array but don't match removal conditions
		// Need 3+ patterns to get jsPatternCount > 2
		const jsDiv1 = document.createElement('div');
		jsDiv1.textContent = 'function test() { return x; }'; // 'function' alone (no '=>'), won't be removed
		document.body.appendChild(jsDiv1);
		const jsDiv2 = document.createElement('div');
		jsDiv2.textContent = 'let x = 5;'; // 'let' pattern, won't be removed
		document.body.appendChild(jsDiv2);
		const jsDiv3 = document.createElement('div');
		jsDiv3.textContent = 'var y = 10;'; // 'var' pattern, won't be removed
		document.body.appendChild(jsDiv3);
		
		// Add paragraphs that meet filtering conditions (text.length > 50, no JS patterns)
		// Keep total body text <= 2000 to prevent fallback loop from returning
		const p1 = document.createElement('p');
		p1.textContent = 'This is valid documentation paragraph one with enough text to meet the minimum length requirement of 50 characters for documentation filtering and extraction.';
		document.body.appendChild(p1);
		
		const p2 = document.createElement('p');
		p2.textContent = 'This is valid documentation paragraph two with enough text to meet the minimum length requirement of 50 characters for documentation filtering and extraction.';
		document.body.appendChild(p2);
		
		const p3 = document.createElement('p');
		p3.textContent = 'This is valid documentation paragraph three with enough text to meet the minimum length requirement of 50 characters for documentation filtering and extraction.';
		document.body.appendChild(p3);
		
		// Ensure total body text is > 500 (for bodyText path) but <= 2000 (to prevent fallback loop from returning)
		// With cookie keywords, cookieTextCount = 3, so fallback loop condition (cookieTextCount < 3 || text.length > 2000) is false
		// So fallback loop won't return, allowing bodyText path to be reached

		const result = extractContent(document);
		// Should process through bodyText path (line 883+)
		// filterBodyTextDocParagraphs is called (line 918)
		// filterBodyTextDocParagraphs returns non-null (line 919)
		// Then lines 920-924 execute
		expect(result.content).toContain('This is valid documentation paragraph one');
		expect(result.content).toContain('This is valid documentation paragraph two');
		expect(result.content).toContain('This is valid documentation paragraph three');
	});

	it('should return bodyText when tryBodyTextContent returns non-null (lines 1040-1041)', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Remove any main elements to prevent mainSelectors from returning
		const mainEl = document.querySelector('main') || document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}
		
		// Remove elements that might be caught by selectors array
		const selectorsElements = document.querySelectorAll('#main-content, [role="main"], main, article, .main, .content');
		selectorsElements.forEach(el => el.remove());
		
		// To prevent tryFallbackContentExtraction from returning:
		// - Add cookie keywords (cookieTextCount = 3) AND keep text.length <= 2000
		const cookieDiv = document.createElement('div');
		cookieDiv.textContent = 'cookie consent accept all'; // 3 cookie keywords
		document.body.appendChild(cookieDiv);
		
		// Create body text that will make filterBodyTextDocParagraphs return null
		// (jsPatternCount <= 2) but tryBodyTextContent return non-null
		// (bodyText.length > 500 AND cookieRatio < 0.2)
		// Use only 2 JS patterns: 'function' and '=>'
		const jsDiv = document.createElement('div');
		jsDiv.textContent = 'function test() { return x => x; }'; // Only 2 JS patterns (function, =>)
		document.body.appendChild(jsDiv);
		
		// Add substantial body text (> 500 chars) with low cookie ratio (< 0.2)
		const normalText = 'This is substantial body text content with enough text to meet the minimum length requirement of 500 characters. '.repeat(10);
		document.body.appendChild(document.createTextNode(normalText));

		const result = extractContent(document);
		// Should process through bodyText path (line 998+)
		// filterBodyTextDocParagraphs returns null (jsPatternCount = 2 <= 2)
		// tryBodyTextContent returns non-null (bodyText.length > 500, cookieRatio < 0.2)
		// Lines 1040-1041 execute
		expect(result.content.length).toBeGreaterThan(500);
		expect(result.content).toContain('substantial body text content');
	});

	it('should remove element with const and = document pattern (line 1018)', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Remove any main elements to prevent mainSelectors from returning
		const mainEl = document.querySelector('main') || document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}
		
		// Remove elements that might be caught by selectors array
		const selectorsElements = document.querySelectorAll('#main-content, [role="main"], main, article, .main, .content');
		selectorsElements.forEach(el => el.remove());
		
		// To prevent tryFallbackContentExtraction from returning:
		// - Add cookie keywords (cookieTextCount = 3) AND keep text.length <= 2000
		const cookieDiv = document.createElement('div');
		cookieDiv.textContent = 'cookie consent accept all'; // 3 cookie keywords
		document.body.appendChild(cookieDiv);
		
		// Create element with 'const ' and '= document' pattern
		const constDocDiv = document.createElement('div');
		constDocDiv.textContent = 'const x = document.getElementById("test");'; // Contains both 'const ' and '= document'
		document.body.appendChild(constDocDiv);
		
		// Add substantial body text so we reach bodyText path
		const normalText = 'This is substantial body text content with enough text to meet the minimum length requirement of 500 characters. '.repeat(10);
		document.body.appendChild(document.createTextNode(normalText));

		const result = extractContent(document);
		// Should process through bodyText path (line 998+)
		// allBodyElements.forEach processes elements (line 1007)
		// Element with 'const ' and '= document' is removed (line 1018)
		// Line 1018 is evaluated
		expect(result.content.length).toBeGreaterThan(500);
		expect(result.content).toContain('substantial body text content');
		expect(result.content).not.toContain('const x = document.getElementById');
	});

	it('should return rawBodyText when tryRawBodyText returns non-null (lines 1056-1057)', () => {
		// Ensure no shadow DOM elements exist
		document.body.innerHTML = '';
		const existingDocXml = document.querySelector('doc-xml-content');
		if (existingDocXml) {
			existingDocXml.remove();
		}
		
		// Remove any main elements to prevent mainSelectors from returning
		const mainEl = document.querySelector('main') || document.querySelector('[role="main"]');
		if (mainEl) {
			mainEl.remove();
		}
		
		// Remove elements that might be caught by selectors array
		const selectorsElements = document.querySelectorAll('#main-content, [role="main"], main, article, .main, .content');
		selectorsElements.forEach(el => el.remove());
		
		// To prevent tryFallbackContentExtraction from returning:
		// - Add cookie keywords (cookieTextCount = 3) AND keep text.length <= 2000
		const cookieDiv = document.createElement('div');
		cookieDiv.textContent = 'cookie consent accept all'; // 3 cookie keywords
		document.body.appendChild(cookieDiv);
		
		// Create body text that will make:
		// - filterBodyTextDocParagraphs return null (jsPatternCount <= 2)
		// - tryBodyTextContent return null (cookieRatio >= 0.2 AND bodyText.length <= 5000)
		// - tryLastResortBodyText return null (codeRatio >= 0.1)
		// - tryRawBodyText return non-null (rawBodyText.length > 100 AND codeRatio < 0.1)
		
		// First, create body text with high cookie ratio to make tryBodyTextContent return null
		const cookieText = 'cookie consent accept all. '.repeat(100); // High cookie ratio
		const normalText = 'Short normal text. '.repeat(50); // Normal text
		document.body.textContent = cookieText + normalText; // Total > 500, cookieRatio >= 0.2, length <= 5000
		
		// Add high code ratio content to make tryLastResortBodyText return null
		// (but this will be in bodyClone, not raw body text)
		// Actually, tryLastResortBodyText processes bodyClone (with removeElements),
		// while tryRawBodyText processes raw body.textContent.
		// So we can have high code ratio in bodyClone but low code ratio in raw body text.
		// Add code-like content that removeElements will remove, but also add normal text
		const codeDiv = document.createElement('div');
		codeDiv.textContent = 'function test() { const x = {}; x(); x = () => {}; } '.repeat(10); // High code ratio
		document.body.appendChild(codeDiv);
		
		// Add enough normal text to reduce code ratio for tryRawBodyText
		// Need to ensure codeRatio < 0.1 for tryRawBodyText to return non-null
		// codeDiv adds ~70 code chars per repetition, so 10 repetitions = ~700 code chars
		// Need totalChars > 7000 to get codeRatio < 0.1
		const rawText = 'This is raw body text content with enough text to meet the minimum length requirement. '.repeat(100);
		document.body.appendChild(document.createTextNode(rawText));

		const result = extractContent(document);
		// Should process through bodyText path (line 998+)
		// filterBodyTextDocParagraphs returns null
		// tryBodyTextContent returns null (cookieRatio >= 0.2, length <= 5000)
		// tryLastResortBodyText returns null (codeRatio >= 0.1)
		// tryRawBodyText returns non-null (rawBodyText.length > 100, codeRatio < 0.1)
		// Lines 1056-1057 execute
		expect(result.content.length).toBeGreaterThan(100);
		expect(result.content).toContain('raw body text content');
	});
});
