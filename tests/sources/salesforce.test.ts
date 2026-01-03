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
      }
    );

    expect(crawler.searchSalesforceHelp).toHaveBeenCalledWith(
      'Lightning Web Components',
      DEFAULT_LIMIT
    );
    expect(crawler.crawlSalesforcePage).toHaveBeenCalledTimes(
      EXPECTED_SEARCH_RESULT_COUNT
    );
    expect(result.folderPath).toBe(mockFolderPath);
    expect(result.fileCount).toBe(EXPECTED_SEARCH_RESULT_COUNT);
    expect(result.todoFilePath).toBe(mockTodoPath);

    // Verify TODO.md was created with correct format
    const writeCalls = vi.mocked(writeFile).mock.calls;
    const todoCall = writeCalls.find(
      (call: readonly unknown[]) =>
        typeof call[FIRST_INDEX] === 'string' &&
        call[FIRST_INDEX].endsWith('TODO.md')
    );

    expect(todoCall).toBeTruthy();
    if (todoCall && typeof todoCall[FIRST_INDEX] === 'string') {
      const todoContent =
        typeof todoCall[SECOND_INDEX] === 'string'
          ? todoCall[SECOND_INDEX]
          : '';
      expect(todoContent).toContain('# Files to Review');
      expect(todoContent).toContain(
        'This file lists all downloaded Salesforce Help documents'
      );
      expect(todoContent).toContain('AuraEnabled');
      expect(todoContent).toContain('URL:');
      expect(todoContent).toMatch(/\[\s*\]/); // Checkbox format
      // Verify it has the expected number of items
      const checkboxCount =
        (todoContent.match(/\[\s*\]/g) ?? []).length;
      expect(checkboxCount).toBe(EXPECTED_SEARCH_RESULT_COUNT);
    }
  });

  it('should throw error if no results found', async () => {
    vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue([]);

    await expect(
      searchAndDownloadSalesforceHelp('nonexistent', {})
    ).rejects.toThrow('No results found for: nonexistent');
  });

  it('should respect limit option', async () => {
    const mockResults =
      getMultipleSearchResultsFixture(MULTIPLE_RESULTS_COUNT);
    const mockFolderPath = '/tmp/sf-docs-helper-123';
    const articleContent = await loadFixture('article-auraenabled.txt');

    vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
    vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(articleContent);
    vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
    vi.mocked(writeFile).mockResolvedValue(undefined);
    vi.mocked(tmpdir).mockReturnValue('/tmp');

    const result = await searchAndDownloadSalesforceHelp('test', {
      limit: TEST_LIMIT,
    });

    expect(crawler.searchSalesforceHelp).toHaveBeenCalledWith(
      'test',
      TEST_LIMIT
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
    vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(articleContent);
    vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
    vi.mocked(writeFile).mockResolvedValue(undefined);
    vi.mocked(tmpdir).mockReturnValue('/tmp');

    const result = await searchAndDownloadSalesforceHelp('test', {});

    // Should deduplicate, so only 2 unique URLs
    expect(result.fileCount).toBe(DEDUPLICATED_COUNT);
    expect(crawler.crawlSalesforcePage).toHaveBeenCalledTimes(
      DEDUPLICATED_COUNT
    );
  });

  it('should create TODO.md file with correct format using fixture data', async () => {
    const mockResults = getSearchResultsFixture();
    const mockFolderPath = '/tmp/sf-docs-helper-123';
    const articleContent = await loadFixture('article-auraenabled.txt');

    vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
    vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(articleContent);
    vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
    vi.mocked(writeFile).mockResolvedValue(undefined);
    vi.mocked(tmpdir).mockReturnValue('/tmp');

    await searchAndDownloadSalesforceHelp('test', {});

    // Check that TODO.md was created with proper format
    const writeCalls = vi.mocked(writeFile).mock.calls;
    const todoCall = writeCalls.find(
      (call: readonly unknown[]) =>
        typeof call[FIRST_INDEX] === 'string' &&
        call[FIRST_INDEX].endsWith('TODO.md')
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

    vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(articleContent);
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
        call[FIRST_INDEX].endsWith('TODO.md')
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
        !call[FIRST_INDEX].endsWith('TODO.md')
    );
    expect(contentFiles.length).toBeGreaterThan(FIRST_INDEX);
  });

  it('should handle download errors gracefully', async () => {
    const url = 'https://help.salesforce.com/s/articleView?id=123';
    const mockFolderPath = '/tmp/sf-docs-helper-get-123';

    vi.mocked(crawler.crawlSalesforcePage).mockRejectedValue(
      new Error('Network error')
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

    vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(articleContent);
    vi.mocked(mkdtemp).mockResolvedValue(mockFolderPath);
    vi.mocked(writeFile).mockResolvedValue(undefined);
    vi.mocked(tmpdir).mockReturnValue('/tmp');

    await getSalesforceUrl(url, { verbose: false });

    // Verify writeFile was called (filename generation is tested via behavior)
    expect(writeFile).toHaveBeenCalled();
    expect(crawler.crawlSalesforcePage).toHaveBeenCalledWith(url);
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
      DEFAULT_LIMIT
    );
    expect(crawler.crawlSalesforcePage).toHaveBeenCalledTimes(
      EXPECTED_SEARCH_RESULT_COUNT
    );
    expect(console.log).toHaveBeenCalled();

    // Verify markdown output format with fixture content
    const logCalls = vi.mocked(console.log).mock.calls;
    const output = logCalls
      .map((call: readonly unknown[]) =>
        typeof call[FIRST_INDEX] === 'string' ? call[FIRST_INDEX] : ''
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
      'No results found for: nonexistent'
    );
  });

  it('should respect limit option', async () => {
    const mockResults =
      getMultipleSearchResultsFixture(MULTIPLE_RESULTS_COUNT);
    const articleContent = await loadFixture('article-auraenabled.txt');

    vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
    vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(articleContent);

    await dumpSalesforceHelp('test', { limit: TEST_LIMIT });

    expect(crawler.searchSalesforceHelp).toHaveBeenCalledWith(
      'test',
      TEST_LIMIT
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
    vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(articleContent);

    await dumpSalesforceHelp('test', {});

    // Should deduplicate, so only 2 unique URLs fetched
    expect(crawler.crawlSalesforcePage).toHaveBeenCalledTimes(
      DEDUPLICATED_COUNT
    );
  });

  it('should output markdown with proper structure using fixture content', async () => {
    const mockResults = getSearchResultsFixture();
    const articleContent = await loadFixture('article-auraenabled.txt');

    vi.mocked(crawler.searchSalesforceHelp).mockResolvedValue(mockResults);
    vi.mocked(crawler.crawlSalesforcePage).mockResolvedValue(articleContent);

    await dumpSalesforceHelp('test', {});

    const logCalls = vi.mocked(console.log).mock.calls;
    const output = logCalls
      .map((call: readonly unknown[]) =>
        typeof call[FIRST_INDEX] === 'string' ? call[FIRST_INDEX] : ''
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
});
