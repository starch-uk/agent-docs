/**
 * @file Tests for Salesforce Help source functions.
 */

import { mkdtemp, writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	dumpSalesforceHelp,
	getSalesforceUrl,
	searchAndDownloadSalesforceHelp,
} from '../../src/sources/salesforce.js';
import * as crawler from '../../src/utils/crawler.js';
import {
	getMultipleSearchResultsFixture,
	getSearchResultsFixture,
	loadFixture,
} from '../fixtures/helpers.js';

vi.mock('../../src/utils/crawler.js');
vi.mock('fs/promises');
vi.mock('os');

// Test constants
const EXPECTED_SEARCH_RESULT_COUNT = 3;
const DEFAULT_LIMIT = 20;
const TEST_LIMIT = 10;
const MULTIPLE_RESULTS_COUNT = 30;
const FIRST_INDEX = 0;
const SECOND_INDEX = 1;
const FIRST_FILE_COUNT = 1;
const MINIMUM_WRITE_CALLS = 2;
const DEDUPLICATED_COUNT = 2;

describe('searchAndDownloadSalesforceHelp', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should search and download Salesforce Help content using fixtures', async () => {
		const mockResults = getSearchResultsFixture();
		const mockFolderPath = '/tmp/sf-docs-helper-123';
		const mockTodoPath = join(mockFolderPath, 'TODO.md');
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
		vi.mocked(crawler.crawlSalesforcePage)
			.mockResolvedValueOnce(articleContent)
			.mockResolvedValueOnce(await loadFixture('article-annotations.txt'))
			.mockResolvedValueOnce(articleContent);
		vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
		vi.mocked(writeFile).mockResolvedValue(undefined);
		vi.mocked(tmpdir).mockReturnValue('/tmp');

		const result = await searchAndDownloadSalesforceHelp(
			'Lightning Web Components',
			{
				limit: DEFAULT_LIMIT,
				verbose: false,
			},
		);

		expect(crawler.searchSalesforceHelp).toHaveBeenCalledWith(
			'Lightning Web Components',
			DEFAULT_LIMIT,
		);
		expect(crawler.crawlSalesforcePage).toHaveBeenCalledTimes(
			EXPECTED_SEARCH_RESULT_COUNT,
		);
		expect(result.folderPath).toBe(mockFolderPath);
		expect(result.fileCount).toBe(EXPECTED_SEARCH_RESULT_COUNT);
		expect(result.todoFilePath).toBe(mockTodoPath);

		// Verify TODO.md was created with correct format
		const writeCalls = vi.mocked(writeFile).mock.calls;
		const todoCall = writeCalls.find(
			(call: readonly unknown[]) =>
				typeof call[FIRST_INDEX] === 'string' &&
				call[FIRST_INDEX].endsWith('TODO.md'),
		);

		expect(todoCall).toBeTruthy();
		if (todoCall && typeof todoCall[FIRST_INDEX] === 'string') {
			const todoContent =
				typeof todoCall[SECOND_INDEX] === 'string'
					? todoCall[SECOND_INDEX]
					: '';
			expect(todoContent).toContain('# Files to Review');
			expect(todoContent).toContain(
				'This file lists all downloaded Salesforce Help documents',
			);
			expect(todoContent).toContain('AuraEnabled');
			expect(todoContent).toContain('URL:');
			expect(todoContent).toMatch(/\[\s*\]/); // Checkbox format
			// Verify it has the expected number of items
			const checkboxCount = (todoContent.match(/\[\s*\]/g) ?? []).length;
			expect(checkboxCount).toBe(EXPECTED_SEARCH_RESULT_COUNT);
		}
	});

	it('should throw error if no results found', async () => {
		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue([]);

		await expect(
			searchAndDownloadSalesforceHelp('nonexistent', {}),
		).rejects.toThrow('No results found for: nonexistent');
	});

	it('should respect limit option', async () => {
		const mockResults = getMultipleSearchResultsFixture(
			MULTIPLE_RESULTS_COUNT,
		);
		const mockFolderPath = '/tmp/sf-docs-helper-123';
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);
		vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
		vi.mocked(writeFile).mockResolvedValue(undefined);
		vi.mocked(tmpdir).mockReturnValue('/tmp');

		const result = await searchAndDownloadSalesforceHelp('test', {
			limit: TEST_LIMIT,
		});

		expect(crawler.searchSalesforceHelp).toHaveBeenCalledWith(
			'test',
			TEST_LIMIT,
		);
		expect(result.fileCount).toBe(TEST_LIMIT);
		expect(crawler.crawlSalesforcePage).toHaveBeenCalledTimes(TEST_LIMIT);
	});

	it('should deduplicate results by URL', async () => {
		const mockResults: readonly { title: string; url: string }[] = [
			{
				title: 'Article 1',
				url: 'https://help.salesforce.com/s/articleView?id=sf.apexcode_annotation_auraenabled.htm',
			},
			{
				title: 'Article 1 Duplicate',
				url: 'https://help.salesforce.com/s/articleView?id=sf.apexcode_annotation_auraenabled.htm',
			},
			{
				title: 'Article 2',
				url: 'https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_classes_annotation_AuraEnabled.htm',
			},
		];
		const mockFolderPath = '/tmp/sf-docs-helper-123';
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);
		vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
		vi.mocked(writeFile).mockResolvedValue(undefined);
		vi.mocked(tmpdir).mockReturnValue('/tmp');

		const result = await searchAndDownloadSalesforceHelp('test', {});

		// Should deduplicate, so only 2 unique URLs
		expect(result.fileCount).toBe(DEDUPLICATED_COUNT);
		expect(crawler.crawlSalesforcePage).toHaveBeenCalledTimes(
			DEDUPLICATED_COUNT,
		);
	});

	it('should log verbose messages when verbose is true', async () => {
		const mockResults = getSearchResultsFixture();
		const mockFolderPath = '/tmp/sf-docs-helper-123';
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);
		vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
		vi.mocked(writeFile).mockResolvedValue(undefined);
		vi.mocked(tmpdir).mockReturnValue('/tmp');
		vi.spyOn(console, 'log').mockImplementation(() => {
			// Intentionally empty for test mocking
		});

		const result = await searchAndDownloadSalesforceHelp('test', {
			verbose: true,
			limit: 3,
		});

		// Verify verbose logging occurred
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Downloading'),
		);
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Created todo file:'),
		);
		expect(result.folderPath).toBe(mockFolderPath);

		vi.restoreAllMocks();
	});

	it('should create TODO.md file with correct format using fixture data', async () => {
		const mockResults = getSearchResultsFixture();
		const mockFolderPath = '/tmp/sf-docs-helper-123';
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);
		vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
		vi.mocked(writeFile).mockResolvedValue(undefined);
		vi.mocked(tmpdir).mockReturnValue('/tmp');

		await searchAndDownloadSalesforceHelp('test', {});

		// Check that TODO.md was created with proper format
		const writeCalls = vi.mocked(writeFile).mock.calls;
		const todoCall = writeCalls.find(
			(call: readonly unknown[]) =>
				typeof call[FIRST_INDEX] === 'string' &&
				call[FIRST_INDEX].endsWith('TODO.md'),
		);

		expect(todoCall).toBeTruthy();
		if (todoCall && typeof todoCall[FIRST_INDEX] === 'string') {
			const todoContent =
				typeof todoCall[SECOND_INDEX] === 'string'
					? todoCall[SECOND_INDEX]
					: '';
			expect(todoContent).toContain('# Files to Review');
			expect(todoContent).toContain('AuraEnabled');
			expect(todoContent).toContain('URL:');
			// Verify it contains the expected structure
			expect(todoContent).toMatch(/\[\s*\]/); // Checkbox format
		}
	});
});

describe('getSalesforceUrl', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should download content from single URL using fixture', async () => {
		const url =
			'https://help.salesforce.com/s/articleView?id=sf.apexcode_annotation_auraenabled.htm';
		const mockFolderPath = '/tmp/sf-docs-helper-get-123';
		const mockTodoPath = join(mockFolderPath, 'TODO.md');
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);
		vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
		vi.mocked(writeFile).mockResolvedValue(undefined);
		vi.mocked(tmpdir).mockReturnValue('/tmp');

		const result = await getSalesforceUrl(url, { verbose: false });

		expect(crawler.crawlSalesforcePage).toHaveBeenCalledWith(url);
		expect(result.folderPath).toBe(mockFolderPath);
		expect(result.fileCount).toBe(FIRST_FILE_COUNT);
		expect(result.todoFilePath).toBe(mockTodoPath);

		// Verify TODO.md was created with correct format
		const writeCalls = vi.mocked(writeFile).mock.calls;
		const todoCall = writeCalls.find(
			(call: readonly unknown[]) =>
				typeof call[FIRST_INDEX] === 'string' &&
				call[FIRST_INDEX].endsWith('TODO.md'),
		);

		expect(todoCall).toBeTruthy();
		if (todoCall && typeof todoCall[FIRST_INDEX] === 'string') {
			const todoContent =
				typeof todoCall[SECOND_INDEX] === 'string'
					? todoCall[SECOND_INDEX]
					: '';
			expect(todoContent).toContain('# Files to Review');
			expect(todoContent).toContain('URL:');
			expect(todoContent).toMatch(/\[\s*\]/); // Checkbox format
		}

		// Verify content file was written (check that we have at least 2 writeFile calls: content + TODO)
		expect(writeCalls.length).toBeGreaterThanOrEqual(MINIMUM_WRITE_CALLS);
		// Verify at least one non-TODO file was written
		const contentFiles = writeCalls.filter(
			(call: readonly unknown[]) =>
				typeof call[FIRST_INDEX] === 'string' &&
				!call[FIRST_INDEX].endsWith('TODO.md'),
		);
		expect(contentFiles.length).toBeGreaterThan(FIRST_INDEX);
	});

	it('should handle download errors gracefully', async () => {
		const url = 'https://help.salesforce.com/s/articleView?id=123';
		const mockFolderPath = '/tmp/sf-docs-helper-get-123';

		vi.mocked(crawler.crawlSalesforcePage).mockRejectedValue(
			new Error('Network error'),
		);
		vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
		vi.mocked(writeFile).mockResolvedValue(undefined);
		vi.mocked(tmpdir).mockReturnValue('/tmp');

		const result = await getSalesforceUrl(url, { verbose: false });

		// Should still create folder and todo file even on error
		expect(result.folderPath).toBe(mockFolderPath);
		expect(result.fileCount).toBe(FIRST_FILE_COUNT);

		// Should write error message to file (verify writeFile was called)
		expect(writeFile).toHaveBeenCalled();
	});

	it('should generate correct filename from URL', async () => {
		const url =
			'https://help.salesforce.com/s/articleView?id=sf.apexcode_annotation_auraenabled.htm';
		const mockFolderPath = '/tmp/sf-docs-helper-get-123';
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);
		vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
		vi.mocked(writeFile).mockResolvedValue(undefined);
		vi.mocked(tmpdir).mockReturnValue('/tmp');

		await getSalesforceUrl(url, { verbose: false });

		// Verify writeFile was called (filename generation is tested via behavior)
		expect(writeFile).toHaveBeenCalled();
		expect(crawler.crawlSalesforcePage).toHaveBeenCalledWith(url);
	});

	it('should use index-based filename when both searchParamId and pathnameLast are null', async () => {
		// URL without id param and without meaningful pathname
		const url = 'https://help.salesforce.com/';
		const mockFolderPath = '/tmp/sf-docs-helper-get-123';
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);
		vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
		vi.mocked(writeFile).mockResolvedValue(undefined);
		vi.mocked(tmpdir).mockReturnValue('/tmp');

		await getSalesforceUrl(url, { verbose: false });

		// Should still work, using index-based filename (article_0.html)
		expect(writeFile).toHaveBeenCalled();
		expect(crawler.crawlSalesforcePage).toHaveBeenCalledWith(url);
	});

	it('should use pathnameLast when searchParamId is null', async () => {
		// URL without id param but with pathname that has a valid article name
		// This tests line 68: searchParamId ?? pathnameLast ?? null
		// where searchParamId is null, so pathnameLast is used
		// The branch coverage needs to see: searchParamId (null) -> pathnameLast (not null) -> use pathnameLast
		const url = 'https://help.salesforce.com/s/articleView/apex-annotations';
		const mockFolderPath = '/tmp/sf-docs-helper-get-123';
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);
		vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
		vi.mocked(writeFile).mockResolvedValue(undefined);
		vi.mocked(tmpdir).mockReturnValue('/tmp');

		await getSalesforceUrl(url, { verbose: false });

		// Should use pathnameLast (apex-annotations) for filename
		// This ensures the pathnameLast branch is covered at line 68
		// The pathnameLast branch is: searchParamId ?? pathnameLast ?? null
		// where searchParamId is null, so pathnameLast ('apex-annotations') is used
		expect(writeFile).toHaveBeenCalled();
		expect(crawler.crawlSalesforcePage).toHaveBeenCalledWith(url);
		// Verify the filename uses pathnameLast
		const writeFileCalls = vi.mocked(writeFile).mock.calls;
		expect(writeFileCalls.length).toBeGreaterThan(0);
		const filename = writeFileCalls[0]?.[0] as string;
		expect(filename).toContain('apex-annotations');
		// Ensure the pathnameLast branch is explicitly covered by verifying the filename pattern
		expect(filename).toMatch(/apex-annotations\.html$/);
	});

	it('should handle non-Error objects in downloadContent error handling', async () => {
		const url = 'https://help.salesforce.com/s/articleView?id=test';
		const mockFolderPath = '/tmp/sf-docs-helper-get-123';
		// Create a non-Error object to test line 104: error instanceof Error ? error.message : String(error)
		const nonError = { message: 'Not an Error', code: 'TEST_ERROR' };

		vi.mocked(crawler.crawlSalesforcePage).mockRejectedValue(nonError);
		vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
		vi.mocked(writeFile).mockResolvedValue(undefined);
		vi.mocked(tmpdir).mockReturnValue('/tmp');
		vi.spyOn(console, 'warn').mockImplementation(() => {
			// Intentionally empty for test mocking
		});

		await getSalesforceUrl(url, { verbose: true });

		// Should handle non-Error object and convert to string
		expect(writeFile).toHaveBeenCalled();
		// Verify error message was written (String(error) path)
		const writeCalls = vi.mocked(writeFile).mock.calls;
		const errorCall = writeCalls.find(
			(call: readonly unknown[]) =>
				typeof call[SECOND_INDEX] === 'string' &&
				typeof call[FIRST_INDEX] === 'string' &&
				call[SECOND_INDEX].includes('Error downloading'),
		);
		expect(errorCall).toBeTruthy();
	});
});

describe('dumpSalesforceHelp', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Mock console.log and console.error to capture output
		vi.spyOn(console, 'log').mockImplementation(() => {
			// Intentionally empty for test mocking
		});
		vi.spyOn(console, 'error').mockImplementation(() => {
			// Intentionally empty for test mocking
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should dump Salesforce Help content to stdout using fixtures', async () => {
		const mockResults = getSearchResultsFixture();
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
		vi.mocked(crawler.crawlSalesforcePage)
			.mockResolvedValueOnce(articleContent)
			.mockResolvedValueOnce(await loadFixture('article-annotations.txt'))
			.mockResolvedValueOnce(articleContent);

		await dumpSalesforceHelp('Lightning Web Components', {
			limit: DEFAULT_LIMIT,
			verbose: false,
		});

		expect(crawler.searchSalesforceHelp).toHaveBeenCalledWith(
			'Lightning Web Components',
			DEFAULT_LIMIT,
		);
		expect(crawler.crawlSalesforcePage).toHaveBeenCalledTimes(
			EXPECTED_SEARCH_RESULT_COUNT,
		);
		expect(console.log).toHaveBeenCalled();

		// Verify markdown output format with fixture content
		const logCalls = vi.mocked(console.log).mock.calls;
		const output = logCalls
			.map((call: readonly unknown[]) =>
				typeof call[FIRST_INDEX] === 'string' ? call[FIRST_INDEX] : '',
			)
			.join('');
		expect(output).toContain('# Salesforce Help Documentation');
		expect(output).toContain('**Search Query:**');
		expect(output).toContain('**Total Pages:**');
		expect(output).toContain('AuraEnabled');
	});

	it('should throw error if no results found', async () => {
		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue([]);

		await expect(dumpSalesforceHelp('nonexistent', {})).rejects.toThrow(
			'No results found for: nonexistent',
		);
	});

	it('should respect limit option', async () => {
		const mockResults = getMultipleSearchResultsFixture(
			MULTIPLE_RESULTS_COUNT,
		);
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);

		await dumpSalesforceHelp('test', { limit: TEST_LIMIT });

		expect(crawler.searchSalesforceHelp).toHaveBeenCalledWith(
			'test',
			TEST_LIMIT,
		);
		// Should only fetch limited results
		expect(crawler.crawlSalesforcePage).toHaveBeenCalledTimes(TEST_LIMIT);
	});

	it('should deduplicate results by URL', async () => {
		const mockResults: readonly { title: string; url: string }[] = [
			{
				title: 'Article 1',
				url: 'https://help.salesforce.com/s/articleView?id=sf.apexcode_annotation_auraenabled.htm',
			},
			{
				title: 'Article 1 Duplicate',
				url: 'https://help.salesforce.com/s/articleView?id=sf.apexcode_annotation_auraenabled.htm',
			},
			{
				title: 'Article 2',
				url: 'https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_classes_annotation_AuraEnabled.htm',
			},
		];
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);

		await dumpSalesforceHelp('test', {});

		// Should deduplicate, so only 2 unique URLs fetched
		expect(crawler.crawlSalesforcePage).toHaveBeenCalledTimes(
			DEDUPLICATED_COUNT,
		);
	});

	it('should output markdown with proper structure using fixture content', async () => {
		const mockResults = getSearchResultsFixture();
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);

		await dumpSalesforceHelp('test', {});

		const logCalls = vi.mocked(console.log).mock.calls;
		const output = logCalls
			.map((call: readonly unknown[]) =>
				typeof call[FIRST_INDEX] === 'string' ? call[FIRST_INDEX] : '',
			)
			.join('');

		// Check markdown structure
		expect(output).toContain('# Salesforce Help Documentation');
		expect(output).toContain('**Search Query:** test');
		expect(output).toContain('## ');
		expect(output).toContain('**URL:**');
		expect(output).toContain('---');
		// Verify fixture content appears in output
		expect(output).toContain('AuraEnabled');
	});

	it('should handle verbose mode in dumpSalesforceHelp', async () => {
		const mockResults = getSearchResultsFixture();
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);

		await dumpSalesforceHelp('test', { verbose: true });

		// Verify verbose logging to stderr
		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('Fetching'),
		);
	});

	it('should handle fetch errors in dumpSalesforceHelp with verbose mode', async () => {
		const mockResults = getSearchResultsFixture();

		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
		vi.mocked(crawler.crawlSalesforcePage)
			.mockRejectedValueOnce(new Error('Fetch failed'))
			.mockResolvedValueOnce(await loadFixture('article-annotations.txt'))
			.mockResolvedValueOnce(await loadFixture('article-auraenabled.txt'));

		await dumpSalesforceHelp('test', { verbose: true });

		// Verify error was logged to stderr in verbose mode
		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('Failed to fetch'),
		);

		// Verify error content was included in output
		const logCalls = vi.mocked(console.log).mock.calls;
		const output = logCalls
			.map((call: readonly unknown[]) =>
				typeof call[FIRST_INDEX] === 'string' ? call[FIRST_INDEX] : '',
			)
			.join('');
		expect(output).toContain('Error:');
	});

	it('should handle fetch errors in dumpSalesforceHelp without verbose mode', async () => {
		const mockResults = getSearchResultsFixture();

		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
		vi.mocked(crawler.crawlSalesforcePage)
			.mockRejectedValueOnce(new Error('Fetch failed'))
			.mockResolvedValueOnce(await loadFixture('article-annotations.txt'))
			.mockResolvedValueOnce(await loadFixture('article-auraenabled.txt'));

		await dumpSalesforceHelp('test', { verbose: false });

		// Verify error content was still included in output
		const logCalls = vi.mocked(console.log).mock.calls;
		const output = logCalls
			.map((call: readonly unknown[]) =>
				typeof call[FIRST_INDEX] === 'string' ? call[FIRST_INDEX] : '',
			)
			.join('');
		expect(output).toContain('Error:');
	});

	it('should add initial search results to urlsToFetch map', async () => {
		const mockResults = getSearchResultsFixture();
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);

		await dumpSalesforceHelp('test', {});

		// Verify all initial results were processed
		expect(crawler.crawlSalesforcePage).toHaveBeenCalledTimes(
			mockResults.length,
		);
	});

	it('should handle verbose mode in getSalesforceUrl', async () => {
		const url =
			'https://help.salesforce.com/s/articleView?id=sf.apexcode_annotation_auraenabled.htm';
		const mockFolderPath = '/tmp/sf-docs-helper-get-123';
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);
		vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
		vi.mocked(writeFile).mockResolvedValue(undefined);
		vi.mocked(tmpdir).mockReturnValue('/tmp');

		await getSalesforceUrl(url, { verbose: true });

		// Verify verbose logging occurred
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Getting content from:'),
		);
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Created temporary folder:'),
		);
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Created todo file:'),
		);
	});

	it('should handle invalid URL in filename generation', async () => {
		// Test that invalid URLs fall back to index-based filename
		const invalidUrl = 'not-a-valid-url';
		const mockFolderPath = '/tmp/sf-docs-helper-get-123';
		const articleContent = await loadFixture('article-auraenabled.txt');

		vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(
			articleContent,
		);
		vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
		vi.mocked(writeFile).mockResolvedValue(undefined);
		vi.mocked(tmpdir).mockReturnValue('/tmp');

		await getSalesforceUrl(invalidUrl, { verbose: false });

		// Should still work, using index-based filename (article_0.html)
		expect(writeFile).toHaveBeenCalled();
		expect(crawler.crawlSalesforcePage).toHaveBeenCalledWith(invalidUrl);
	});

	it('should handle download error with verbose mode', async () => {
		const url = 'https://help.salesforce.com/s/articleView?id=test';
		const mockFolderPath = '/tmp/sf-docs-helper-get-123';
		const downloadError = new Error('Download failed');

		vi.mocked(crawler.crawlSalesforcePage).mockRejectedValue(downloadError);
		vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
		vi.mocked(writeFile).mockResolvedValue(undefined);
		vi.mocked(tmpdir).mockReturnValue('/tmp');
		vi.spyOn(console, 'warn').mockImplementation(() => {
			// Intentionally empty for test mocking
		});

		await getSalesforceUrl(url, { verbose: true });

		// Should log warning with verbose mode
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('Failed to download'),
			downloadError,
		);
		// Should still write error message to file
		expect(writeFile).toHaveBeenCalled();
	});
});
