/**
 * @file Test fixture helpers for Salesforce Help tests.
 */

import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(__filename);

const FIXTURES_DIR = join(__dirname, 'salesforce-help');

/**
 * Load a fixture file from the fixtures directory.
 * @param filename - The name of the fixture file to load.
 * @returns The contents of the fixture file as a string.
 */
async function loadFixture(filename: string): Promise<string> {
	const filePath = join(FIXTURES_DIR, filename);
	return readFile(filePath, 'utf-8');
}

/**
 * Get search results that match real Salesforce Help structure.
 * @returns An array of search results with title and URL.
 */
function getSearchResultsFixture(): {
	title: string;
	url: string;
}[] {
	return [
		{
			title: 'AuraEnabled Annotation',
			url: 'https://help.salesforce.com/s/articleView?id=sf.apexcode_annotation_auraenabled.htm',
		},
		{
			title: 'AuraEnabled Annotation | Apex Developer Guide',
			url: 'https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_classes_annotation_AuraEnabled.htm',
		},
		{
			title: 'Annotations | Apex Developer Guide',
			url: 'https://help.salesforce.com/s/articleView?id=sf.apexcode_annotations.htm',
		},
	];
}

/**
 * Get multiple search results for testing limits.
 * @param count - The number of search results to generate.
 * @returns An array of search results with title and URL.
 */
function getMultipleSearchResultsFixture(
	count: number,
): { title: string; url: string }[] {
	const baseResults = getSearchResultsFixture();
	const results: { title: string; url: string }[] = [];

	for (let i = 0; i < count; i++) {
		if (i < baseResults.length) {
			results.push(baseResults[i]);
		} else {
			results.push({
				title: `Article ${String(i)}`,
				url: `https://help.salesforce.com/s/articleView?id=sf.apexcode_annotation_${String(i)}.htm`,
			});
		}
	}

	return results;
}

export {
	getMultipleSearchResultsFixture,
	getSearchResultsFixture,
	loadFixture,
};
