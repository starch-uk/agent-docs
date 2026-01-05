/**
 * @file Tests for extract-content helper functions (findInShadowDOM, removeElements, filterBodyTextDocParagraphs).
 * All tests run offline using jsdom - no network access required.
 */

import { beforeEach, describe, it, expect, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import {
	findInShadowDOM,
	filterBodyTextDocParagraphs,
	removeElements,
	processMainElement,
} from '../../src/utils/extract-content-helpers.js';
import {
	tryBodyTextContent,
	tryLastResortBodyText,
	tryRawBodyText,
	processMainSelectors,
} from '../../src/utils/extract-content-fallbacks.js';

const COUNT_2 = 2;
const COUNT_3 = 3;
const COUNT_10 = 10;
const COUNT_15 = 15;
const COUNT_20 = 20;
const COUNT_100 = 100;
const SHADOW_DOM_DEPTH_15 = 15;
const MIN_LENGTH_1000 = 1000;
const ZERO = 0;
const REPEAT_COUNT_10 = 10;
const REPEAT_COUNT_100 = 100;
const REPEAT_COUNT_250 = 250;

describe('findInShadowDOM', () => {
	const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
		url: 'https://test.example.com',
	});
	const { document } = dom.window;

	it('should return null for null element', () => {
		expect(findInShadowDOM(null, '.test')).toBeNull();
	});

	it('should return null when element has no shadow root', () => {
		const element = document.createElement('div');
		expect(findInShadowDOM(element, '.test')).toBeNull();
	});

	it('should find element in shadow root', () => {
		const element = document.createElement('div');
		const shadowRoot = element.attachShadow({ mode: 'open' });
		const target = document.createElement('div');
		target.className = 'test';
		shadowRoot.appendChild(target);

		const result = findInShadowDOM(element, '.test');
		expect(result).toBe(target);
	});

	it('should find element in nested shadow root', () => {
		const element = document.createElement('div');
		const shadowRoot = element.attachShadow({ mode: 'open' });
		const nested = document.createElement('div');
		const nestedShadowRoot = nested.attachShadow({ mode: 'open' });
		const target = document.createElement('div');
		target.className = 'test';
		nestedShadowRoot.appendChild(target);
		shadowRoot.appendChild(nested);

		const result = findInShadowDOM(element, '.test');
		expect(result).toBe(target);
	});

	it('should cover traverse return branch when result is not null (line 64)', () => {
		// Test to cover the branch in traverse where result !== null and we return early
		const element = document.createElement('div');
		const shadowRoot = element.attachShadow({ mode: 'open' });
		const child1 = document.createElement('div');
		const child1Shadow = child1.attachShadow({ mode: 'open' });
		const target = document.createElement('div');
		target.className = 'target';
		child1Shadow.appendChild(target);
		shadowRoot.appendChild(child1);
		// Add another child to ensure we traverse multiple children
		const child2 = document.createElement('div');
		shadowRoot.appendChild(child2);

		const result = findInShadowDOM(element, '.target');
		expect(result).toBe(target);
	});

	it('should continue when traverse result is null (line 64 branch)', () => {
		// Test to cover the branch where result is null and we continue to next child
		const element = document.createElement('div');
		const shadowRoot = element.attachShadow({ mode: 'open' });
		// Add first child without target (result will be null)
		const child1 = document.createElement('div');
		shadowRoot.appendChild(child1);
		// Add second child with target
		const child2 = document.createElement('div');
		const child2Shadow = child2.attachShadow({ mode: 'open' });
		const target = document.createElement('div');
		target.className = 'target';
		child2Shadow.appendChild(target);
		shadowRoot.appendChild(child2);

		const result = findInShadowDOM(element, '.target');
		expect(result).toBe(target);
	});

	it('should respect maxDepth limit', () => {
		const element = document.createElement('div');
		let current = element;
		// Create 15 levels of shadow DOM
		for (let i = ZERO; i < SHADOW_DOM_DEPTH_15; i++) {
			const shadowRoot = current.attachShadow({ mode: 'open' });
			const next = document.createElement('div');
			shadowRoot.appendChild(next);
			current = next;
		}
		const target = document.createElement('div');
		target.className = 'test';
		const lastShadowRoot = current.attachShadow({ mode: 'open' });
		lastShadowRoot.appendChild(target);

		// Should not find it because maxDepth is 10 by default
		const result = findInShadowDOM(element, '.test');
		expect(result).toBeNull();
	});

	it('should find element in regular children', () => {
		const element = document.createElement('div');
		const child = document.createElement('div');
		child.className = 'test';
		element.appendChild(child);

		// findInShadowDOM only searches shadow roots, not regular children
		// So this should return null since there's no shadow root
		const result = findInShadowDOM(element, '.test');
		expect(result).toBeNull();
	});

	it('should continue when traverse result is null in regular children loop (line 64 branch)', () => {
		// Test to cover the branch where result is null and we continue to next child in regular children loop
		const element = document.createElement('div');
		// Add first child without target (result will be null, continues loop)
		const child1 = document.createElement('div');
		element.appendChild(child1);
		// Add second child with shadow root containing target
		const child2 = document.createElement('div');
		const child2Shadow = child2.attachShadow({ mode: 'open' });
		const target = document.createElement('div');
		target.className = 'target';
		child2Shadow.appendChild(target);
		element.appendChild(child2);

		const result = findInShadowDOM(element, '.target');
		expect(result).toBe(target);
	});

	it('should handle querySelector errors gracefully', () => {
		const element = document.createElement('div');
		const shadowRoot = element.attachShadow({ mode: 'open' });
		// Create an element that will cause querySelector to fail
		const invalid = document.createElement('div');
		shadowRoot.appendChild(invalid);

		/**
		 * Mock querySelector to throw an error.
		 */
		// eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/no-deprecated
		const originalQuerySelector = shadowRoot.querySelector;
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		shadowRoot.querySelector = vi.fn(() => {
			throw new Error('Invalid selector');
		});

		const result = findInShadowDOM(element, '.test');
		expect(result).toBeNull();

		/**
		 * Restore.
		 */
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		shadowRoot.querySelector = originalQuerySelector;
	});

	it('should handle querySelectorAll errors gracefully', () => {
		const element = document.createElement('div');
		const shadowRoot = element.attachShadow({ mode: 'open' });
		const target = document.createElement('div');
		target.className = 'test';
		shadowRoot.appendChild(target);

		// eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/no-deprecated
		const originalQuerySelectorAll = shadowRoot.querySelectorAll;
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		shadowRoot.querySelectorAll = vi.fn(() => {
			throw new Error('Invalid selectorAll');
		});

		const result = findInShadowDOM(element, '.test');

		/**
		 * Should still find the direct match.
		 */
		expect(result).toBe(target);
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		shadowRoot.querySelectorAll = originalQuerySelectorAll;
	});
});

describe('removeElements', () => {
	const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
		url: 'https://test.example.com',
	});
	const { document } = dom.window;

	it('should remove elements matching selector from document', () => {
		const script = document.createElement('script');
		document.body.appendChild(script);
		expect(document.querySelector('script')).toBeTruthy();

		removeElements(document, 'script');
		expect(document.querySelector('script')).toBeNull();
	});

	it('should remove elements matching selector from element', () => {
		const container = document.createElement('div');
		const script = document.createElement('script');
		container.appendChild(script);
		expect(container.querySelector('script')).toBeTruthy();

		removeElements(container, 'script');
		expect(container.querySelector('script')).toBeNull();
	});

	it('should remove multiple elements', () => {
		const script1 = document.createElement('script');
		const script2 = document.createElement('script');
		document.body.appendChild(script1);
		document.body.appendChild(script2);

		removeElements(document, 'script');
		expect(document.querySelectorAll('script').length).toBe(ZERO);
	});

	it('should handle empty selector gracefully', () => {
		const div = document.createElement('div');
		document.body.appendChild(div);

		removeElements(document, 'nonexistent');

		/**
		 * Element should still exist.
		 */
		expect(document.querySelector('div')).toBeTruthy();
	});
});

describe('filterBodyTextDocParagraphs', () => {
	const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
		url: 'https://test.example.com',
	});
	const { document } = dom.window;
	document.body.innerHTML = '';

	it('should return null when jsPatternCount <= 2', () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
		const bodyClone = document.body.cloneNode(true) as unknown as Element;

		/**
		 * Only 1 JS pattern.
		 */
		const bodyText = 'const x = 5;';

		const result = filterBodyTextDocParagraphs(bodyClone, bodyText);
		expect(result).toBeNull();
	});

	it('should return null when jsPatternCount <= 2 with multiple patterns', () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
		const bodyClone = document.body.cloneNode(true) as Element;

		/**
		 * 2 JS patterns (function, const).
		 */
		const bodyText = 'function test() { const x = 5; }';

		const result = filterBodyTextDocParagraphs(bodyClone, bodyText);
		expect(result).toBeNull();
	});

	it('should return null when no paragraphs meet filtering conditions', () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
		const bodyClone = document.body.cloneNode(true) as Element;
		const jsDiv = document.createElement('div');
		jsDiv.textContent =
			'function test() { const x = document.querySelector("div"); x.addEventListener("click", () => {}); }';
		bodyClone.appendChild(jsDiv);

		// Add short paragraphs (< 50 chars)
		const shortP = document.createElement('p');
		shortP.textContent = 'Short.';
		bodyClone.appendChild(shortP);

		const bodyText = bodyClone.textContent.trim();
		const result = filterBodyTextDocParagraphs(bodyClone, bodyText);
		expect(result).toBeNull();
	});

	it('should return filtered docTexts when jsPatternCount > 2 and paragraphs meet conditions', () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
		const bodyClone = document.body.cloneNode(true) as Element;
		const jsDiv = document.createElement('div');
		jsDiv.textContent =
			'function test() { const x = document.querySelector("div"); x.addEventListener("click", () => {}); }';
		bodyClone.appendChild(jsDiv);

		// Add paragraphs that meet filtering conditions
		const p1 = document.createElement('p');
		p1.textContent =
			'This is valid documentation paragraph one with enough text to meet the minimum length requirement of 50 characters for documentation filtering and extraction.';
		bodyClone.appendChild(p1);

		const p2 = document.createElement('p');
		p2.textContent =
			'This is valid documentation paragraph two with enough text to meet the minimum length requirement of 50 characters for documentation filtering and extraction.';
		bodyClone.appendChild(p2);

		const bodyText = bodyClone.textContent.trim();
		const result = filterBodyTextDocParagraphs(bodyClone, bodyText);
		expect(result).not.toBeNull();
		expect(result).toContain('This is valid documentation paragraph one');
		expect(result).toContain('This is valid documentation paragraph two');
	});

	it('should filter out paragraphs with JavaScript patterns', () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
		const bodyClone = document.body.cloneNode(true) as Element;
		const jsDiv = document.createElement('div');
		jsDiv.textContent =
			'function test() { const x = document.querySelector("div"); x.addEventListener("click", () => {}); }';
		bodyClone.appendChild(jsDiv);

		// Add valid paragraph
		const validP = document.createElement('p');
		validP.textContent =
			'This is valid documentation paragraph with enough text to meet the minimum length requirement of 50 characters for documentation filtering and extraction.';
		bodyClone.appendChild(validP);

		// Add paragraph with JS pattern
		const jsP = document.createElement('p');
		jsP.textContent =
			'function test() { return x => x; } This paragraph has a JavaScript pattern and should be filtered out.';
		bodyClone.appendChild(jsP);

		const bodyText = bodyClone.textContent.trim();
		const result = filterBodyTextDocParagraphs(bodyClone, bodyText);
		expect(result).not.toBeNull();
		expect(result).toContain('This is valid documentation paragraph');
		expect(result).not.toContain('function test()');
	});

	it('should filter out paragraphs with const = document pattern', () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
		const bodyClone = document.body.cloneNode(true) as Element;
		const jsDiv = document.createElement('div');
		jsDiv.textContent =
			'function test() { const x = document.querySelector("div"); x.addEventListener("click", () => {}); }';
		bodyClone.appendChild(jsDiv);

		// Add valid paragraph
		const validP = document.createElement('p');
		validP.textContent =
			'This is valid documentation paragraph with enough text to meet the minimum length requirement of 50 characters for documentation filtering and extraction.';
		bodyClone.appendChild(validP);

		// Add paragraph with const = document pattern (must include both 'const ' and '= document' to trigger line 188 branch)
		const constDocP = document.createElement('p');
		constDocP.textContent =
			'const x = document.getElementById("test"); This paragraph has both const and = document and should be filtered out because it includes both patterns.';
		bodyClone.appendChild(constDocP);

		const bodyText = bodyClone.textContent.trim();
		const result = filterBodyTextDocParagraphs(bodyClone, bodyText);
		expect(result).not.toBeNull();
		expect(result).toContain('This is valid documentation paragraph');
		expect(result).not.toContain('const x = document');
	});
});

describe('tryBodyTextContent', () => {
	const debugInfo: Record<string, unknown> = {};

	it('should return null when bodyText.length <= 500', () => {
		/**
		 * Short text that should return null.
		 */
		const bodyText = 'Short text';
		const result = tryBodyTextContent(bodyText, debugInfo);
		expect(result).toBeNull();
	});

	it('should return content when cookieRatio < 0.2', () => {
		/**
		 * Body text with low cookie ratio.
		 */
		const bodyText =
			'This is valid documentation content with enough text to meet the minimum length requirement of 500 characters. '.repeat(
				REPEAT_COUNT_10,
			);
		const result = tryBodyTextContent(bodyText, debugInfo);
		expect(result).not.toBeNull();
		expect(result?.content).toBe(bodyText);
	});

	it('should return content when bodyText.length > 5000', () => {
		/**
		 * Body text longer than 5000 characters.
		 */
		const cookieText = 'cookie consent accept all. '.repeat(
			REPEAT_COUNT_100,
		);
		const bodyText = 'This is very long content. '.repeat(REPEAT_COUNT_250);
		/** > 5000 chars. */
		const fullText = cookieText + bodyText;
		const result = tryBodyTextContent(fullText, debugInfo);
		expect(result).not.toBeNull();
		expect(result?.content).toBe(fullText);
	});

	it('should return null when cookieRatio >= 0.2 and bodyText.length <= 5000', () => {
		// Create text with high cookie ratio (>= 0.2) but length <= 5000
		// 'cookie consent accept all' contains 3 cookie keywords
		// Repeat enough times to get cookieRatio >= 0.2 but keep total <= 5000
		/** ~26 chars, 3 keywords. */
		const cookieText = 'cookie consent accept all. ';
		// Need cookieRatio >= 0.2, so cookie matches / wordCount >= 0.2
		// If we repeat 100 times: 300 cookie matches, ~100 words, ratio = 3.0 > 0.2 ✓
		// But we also need length <= 5000: 26 * 100 = 2600 chars ✓
		/** ~2600 chars, cookieRatio > 0.2. */
		const fullText = cookieText.repeat(COUNT_100);
		const result = tryBodyTextContent(fullText, debugInfo);
		expect(result).toBeNull();
	});
});

describe('tryLastResortBodyText', () => {
	const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
		url: 'https://test.example.com',
	});
	const { document } = dom.window;
	const { body } = document;
	const debugInfo: Record<string, unknown> = {};

	it('should return null when text.length <= 100', () => {
		body.textContent = 'Short text';
		const result = tryLastResortBodyText(body, debugInfo);
		expect(result).toBeNull();
	});

	it('should return content when codeRatio < 0.1', () => {
		body.textContent =
			'This is valid documentation content with enough text to meet the minimum length requirement of 100 characters. '.repeat(
				COUNT_2,
			);
		const result = tryLastResortBodyText(body, debugInfo);
		expect(result).not.toBeNull();
		expect(result?.content).toContain('valid documentation content');
	});

	it('should return null when codeRatio >= 0.1', () => {
		body.textContent =
			'function test() { const x = {}; x(); x = () => {}; } '.repeat(
				COUNT_10,
			); // High code ratio
		const result = tryLastResortBodyText(body, debugInfo);
		expect(result).toBeNull();
	});
});

describe('tryRawBodyText', () => {
	const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
		url: 'https://test.example.com',
	});
	const { document } = dom.window;
	const { body } = document;
	const debugInfo: Record<string, unknown> = {};

	it('should return null when text.length <= 100', () => {
		body.textContent = 'Short text';
		const result = tryRawBodyText(body, debugInfo);
		expect(result).toBeNull();
	});

	it('should return content when codeRatio < 0.1', () => {
		body.textContent =
			'This is valid documentation content with enough text to meet the minimum length requirement of 100 characters. '.repeat(
				COUNT_2,
			);
		const result = tryRawBodyText(body, debugInfo);
		expect(result).not.toBeNull();
		expect(result?.content).toBe(body.textContent.trim());
	});

	it('should return null when codeRatio >= 0.1', () => {
		body.textContent =
			'function test() { const x = {}; x(); x = () => {}; } '.repeat(
				COUNT_10,
			); // High code ratio
		const result = tryRawBodyText(body, debugInfo);
		expect(result).toBeNull();
	});
});

describe('processMainSelectors', () => {
	const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
		url: 'https://test.example.com',
	});
	const { document } = dom.window;
	const { body } = document;
	const debugInfo: Record<string, unknown> = {};

	beforeEach(() => {
		// Clear body completely to ensure no other elements interfere
		body.innerHTML = '';
	});

	it('should handle match() returning null (line 171 branch)', () => {
		// Create article with > 1000 chars but NO cookie keywords to make match() return null
		const article = document.createElement('article');
		article.textContent =
			'This is article content with enough text to meet the minimum length requirement of 1000 characters. '.repeat(
				COUNT_15,
			);
		body.appendChild(article);

		const result = processMainSelectors(body, debugInfo);
		expect(result).not.toBeNull();
		expect(result?.content).toContain('article content');
		expect(result?.content.length).toBeGreaterThan(MIN_LENGTH_1000);
	});

	it('should return null when bestMainText is empty (lines 191-192)', () => {
		// Create main element with high cookie ratio (>= 0.05) to ensure bestMainText remains empty
		// This tests the branch where matchResult is not null (line 170) but cookieRatio >= 0.05
		const main = document.createElement('main');
		// Create text with > 1000 chars and high cookie ratio
		// Use "cookie consent accept all" repeated - each has 3 matches, 4 words
		// 30 repetitions = 90 matches in 120 words = ratio 0.75 > 0.05
		const cookiePhrase = 'cookie consent accept all ';
		const REPEAT_COUNT_30 = 30;
		const cookieText = cookiePhrase.repeat(REPEAT_COUNT_30);
		// Add more text to ensure length > 1000 after element removal
		const additionalText = 'additional text content. '.repeat(COUNT_20);
		main.textContent = cookieText + additionalText;
		body.appendChild(main);

		const result = processMainSelectors(body, debugInfo);
		expect(result).toBeNull();
	});

	it('should return null when no main selectors match (lines 191-192)', () => {
		// Ensure body is empty - no elements that match main selectors
		// This ensures bestMainText remains empty and the function returns null
		body.innerHTML = '';

		const result = processMainSelectors(body, debugInfo);
		expect(result).toBeNull();
	});
});

describe('processMainElement', () => {
	const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
		url: 'https://test.example.com',
	});
	const { document } = dom.window;
	const debugInfo: Record<string, unknown> = {};

	it('should remove elements with class names containing script or syntax', () => {
		const main = document.createElement('main');
		const validDiv = document.createElement('div');
		validDiv.textContent = 'Valid content. '.repeat(COUNT_20);
		main.appendChild(validDiv);

		const scriptDiv = document.createElement('div');
		scriptDiv.className = 'my-script-element';
		scriptDiv.textContent = 'This should be removed';
		main.appendChild(scriptDiv);

		const syntaxDiv = document.createElement('div');
		syntaxDiv.className = 'syntax-highlight';
		syntaxDiv.textContent = 'This should also be removed';
		main.appendChild(syntaxDiv);

		const result = processMainElement(main, debugInfo);
		expect(result).not.toBeNull();
		expect(result?.bestText).toContain('Valid content');
		expect(result?.bestText).not.toContain('This should be removed');
		expect(result?.bestText).not.toContain('This should also be removed');
	});

	it('should filter out paragraphs with const and = document pattern (line 188)', () => {
		const main = document.createElement('main');
		// Create main with substantial content first to ensure it returns
		const validDiv = document.createElement('div');
		validDiv.textContent =
			'This is valid documentation content with enough text. '.repeat(
				COUNT_15,
			);
		main.appendChild(validDiv);

		// Add JS patterns in text (not in script elements) to trigger filtering code path
		// Need jsPatternCount > 2 AND mainText.length > 200
		const jsTextDiv = document.createElement('div');
		// This text contains: 'function', 'const', 'document.querySelector', 'addEventListener', 'let', 'var' = 6 patterns
		jsTextDiv.textContent =
			'function test() { const x = document.querySelector("div"); x.addEventListener("click", () => {}); let y = 5; var z = 10; } '.repeat(
				COUNT_3,
			);
		main.appendChild(jsTextDiv);

		// Add valid paragraph (should be included after filtering)
		const validP = document.createElement('p');
		validP.textContent =
			'This is valid documentation paragraph with enough text to meet the minimum length requirement of 30 characters for documentation filtering and extraction.';
		main.appendChild(validP);

		// Add paragraph with const and = document pattern (should be filtered out - line 188 branch)
		const constDocP = document.createElement('p');
		constDocP.textContent =
			'const x = document.getElementById("test"); This paragraph has both const and = document and should be filtered out because it includes both patterns.';
		main.appendChild(constDocP);

		const result = processMainElement(main, debugInfo);
		expect(result).not.toBeNull();
		expect(result?.bestText).toContain('This is valid documentation');
		expect(result?.bestText).not.toContain(
			'const x = document.getElementById',
		);
	});
});
