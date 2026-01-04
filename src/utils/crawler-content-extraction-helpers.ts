/**
 * @file Helper functions for browser-side content extraction.
 * These functions are used by extractContentInBrowser and must be inlined.
 */

/* v8 ignore file -- Browser-side code in page.evaluate() cannot be unit tested in Node.js */

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- DOM API types cannot be made readonly */
/* eslint-disable @typescript-eslint/no-unnecessary-condition -- Runtime checks needed for DOM API nullability */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Magic numbers are used for lengths and DOM operations */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion -- DOM API types require assertions */

/**
 * Helper function to traverse shadow DOMs recursively.
 * @param element - Element to search in.
 * @param selector - CSS selector to find.
 * @returns Found element or null.
 */
export function findInShadowDOM(
	element: Element | null,
	selector: Readonly<string>,
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
		const maxDepth = 10;
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
				for (const child of shadowChildren) {
					const depthIncrement = 1;
					const result = traverse(child, depth + depthIncrement);
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
	const traversalStartDepth = 0;
	return traverse(element, traversalStartDepth);
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
 * Extract title attributes from links in an element.
 * @param element - Element to search for links.
 * @returns Array of title texts.
 */
export function extractLinkTitles(element: Element): string[] {
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
