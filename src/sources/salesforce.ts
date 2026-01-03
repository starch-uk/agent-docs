/**
 * @file Salesforce Help content downloader and dumper.
 */

import { mkdtemp, writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { searchSalesforceHelp, crawlSalesforcePage } from '../utils/crawler.ts';

/**
 * Options for Salesforce download operations.
 */
interface SalesforceDownloadOptions {
  verbose?: boolean;
  concurrency?: number;

  /**
   * Maximum number of results to download (default: 20).
   */
  limit?: number;
}

/**
 * Result of a Salesforce download operation.
 */
interface SalesforceDownloadResult {
  folderPath: string;
  fileCount: number;
  todoFilePath: string;
}

// Constants
const DEFAULT_LIMIT = 20;
const DEFAULT_CONCURRENCY = 5;
const DEFAULT_INDEX = 0;
const FIRST_ITEM_INDEX = 1;
const MIN_ARTICLE_ID_LENGTH = 1;
const SINGLE_FILE_COUNT = 1;
const EMPTY_ARRAY_LENGTH = 0;

/**
 * Sanitize a filename from URL or title.
 * @param name - The filename to sanitize.
 * @returns Sanitized filename safe for filesystem use.
 */
function sanitizeFilename(name: string): string {
  const maxLength = 200;
  const startIndex = 0;
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(startIndex, maxLength);
}

/**
 * Get filename from URL by extracting article ID or using fallback index.
 * @param url - The URL to extract filename from.
 * @param index - Fallback index if URL parsing fails.
 * @returns Generated filename.
 */
function getFilenameFromUrl(url: string, index: number): string {
  try {
    const urlObj = new URL(url);
    const {pathname} = urlObj;
    const searchParamId = urlObj.searchParams.get('id');
    const pathnameLast = pathname.split('/').pop();
    const articleId = searchParamId ?? pathnameLast ?? null;

    if (articleId !== null && articleId.length >= MIN_ARTICLE_ID_LENGTH) {
      return `${sanitizeFilename(articleId)}.html`;
    }
  } catch {
    // Invalid URL, use index
  }

  const indexStr = String(index);
  return `article_${indexStr}.html`;
}

/**
 * Download content to a file.
 * @param url - The URL to download content from.
 * @param filePath - The path where the content should be saved.
 * @param options - Download options (verbose, etc.).
 */
async function downloadContentToFile(
  url: Readonly<string>,
  filePath: Readonly<string>,
  options: Readonly<SalesforceDownloadOptions>
): Promise<void> {
  try {
    const content = await crawlSalesforcePage(url);
    await writeFile(filePath, content, 'utf-8');
    if (options.verbose === true) {
      console.log(`Downloaded: ${url} -> ${filePath}`);
    }
  } catch (error) {
    if (options.verbose === true) {
      console.warn(`Failed to download ${url}:`, error);
    }
    // Write error message to file
    const errorMessage = error instanceof Error ? error.message : String(error);
    await writeFile(filePath, `Error downloading: ${errorMessage}\n`, 'utf-8');
  }
}

/**
 * Download content concurrently with concurrency limit.
 * @param urls - Array of URLs with titles to download.
 * @param folderPath - The folder where files should be saved.
 * @param options - Download options (concurrency, verbose, etc.).
 * @returns Array of downloaded file information.
 */
async function downloadConcurrently(
  urls: Readonly<readonly { readonly url: string; readonly title: string }[]>,
  folderPath: Readonly<string>,
  options: Readonly<SalesforceDownloadOptions>
): Promise<{ url: string; filePath: string; title: string }[]> {
  const concurrency = options.concurrency ?? DEFAULT_CONCURRENCY;
  const downloaded: { url: string; filePath: string; title: string }[] =
    [];

  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const promises = batch.map(async (result: Readonly<{ readonly url: string; readonly title: string }>, batchIndex: number) => {
      const index = i + batchIndex;
      const filename = getFilenameFromUrl(result.url, index);
      const filePath = join(folderPath, filename);

      await downloadContentToFile(result.url, filePath, options);

      return {
        filePath,
        title: result.title,
        url: result.url,
      };
    });

    const batchResults = await Promise.all(promises);
    downloaded.push(...batchResults);
  }

  return downloaded;
}

/**
 * Create todo file listing all downloaded documents.
 * @param folderPath - The folder where the TODO file should be created.
 * @param downloaded - Array of downloaded file information.
 * @returns Path to the created TODO file.
 */
async function createTodoFile(
  folderPath: Readonly<string>,
  downloaded: Readonly<readonly { readonly url: string; readonly filePath: string; readonly title: string }[]>
): Promise<string> {
  const todoPath = join(folderPath, 'TODO.md');
  const lines = [
    '# Files to Review',
    '',
    'This file lists all downloaded Salesforce Help documents that should be reviewed.',
    '',
    ...downloaded.map((item: Readonly<{ readonly url: string; readonly filePath: string; readonly title: string }>, index: number) => {
      const relativePath = item.filePath.replace(folderPath + '/', '');
      const indexStr = String(index + FIRST_ITEM_INDEX);
      return `${indexStr}. [ ] ${relativePath} - ${item.title}\n   URL: ${item.url}`;
    }),
  ];

  await writeFile(todoPath, lines.join('\n'), 'utf-8');
  return todoPath;
}

/* eslint-disable jsdoc/check-tag-names -- @rejects is required by jsdoc/require-rejects but not recognized by jsdoc/check-tag-names */

/**
 * Search Salesforce Help and download all results to temporary folder.
 * @param item - The search query item.
 * @param options - Download options (limit, verbose, concurrency, etc.).
 * @returns Result containing folder path, file count, and TODO file path.
 * @throws {Error} When no search results are found.
 * @rejects {Error} When no search results are found.
 */
/* eslint-enable jsdoc/check-tag-names */
async function searchAndDownloadSalesforceHelp( // eslint-disable-line jsdoc/require-jsdoc -- JSDoc is above the eslint-disable/enable block
  item: Readonly<string>,
  options: Readonly<SalesforceDownloadOptions> = {}
): Promise<SalesforceDownloadResult> {
  if (options.verbose === true) {
    console.log(`Searching Salesforce Help for: ${item}`);
  }

  // Search Salesforce Help with configurable limit
  // Note: When filtered to Developer Documentation and Product Documentation content types,
  // searches like "Apex Annotations" may return 1,776+ total results
  const limit = options.limit ?? DEFAULT_LIMIT;
  const searchResults = await searchSalesforceHelp(item, limit);

  if (searchResults.length === EMPTY_ARRAY_LENGTH) {
    throw new Error(`No results found for: ${item}`);
  }

  if (options.verbose === true) {
    const resultCountStr = String(searchResults.length);
    const limitStr = String(limit);
    console.log(
      `Found ${resultCountStr} results (limited to top ${limitStr})`
    );
  }

  // Deduplicate results by URL (should already be deduplicated, but ensure)
  const uniqueResults = Array.from(
    new Map(searchResults.map((r: Readonly<{ url: string; title: string }>) => [r.url, r])).values()
  );

  if (options.verbose === true) {
    const uniqueCountStr = String(uniqueResults.length);
    console.log(`After deduplication: ${uniqueCountStr} unique results`);
  }

  // Limit to specified number of results (searchSalesforceHelp already does this, but ensure)
  const limitedResults = uniqueResults.slice(DEFAULT_INDEX, limit);

  // Create temporary folder
  const tempPrefix = `sf-docs-helper-${String(Date.now())}-`;
  const folderPath = await mkdtemp(join(tmpdir(), tempPrefix));

  if (options.verbose === true) {
    console.log(`Created temporary folder: ${folderPath}`);
  }

  // Download content concurrently (limited to specified limit)
  if (options.verbose === true) {
    const limitedCountStr = String(limitedResults.length);
    const limitStr = String(limit);
    console.log(
      `Downloading ${limitedCountStr} files (top ${limitStr} results)...`
    );
  }

  const downloaded = await downloadConcurrently(
    limitedResults,
    folderPath,
    options
  );

  // Create todo file
  const todoFilePath = await createTodoFile(folderPath, downloaded);

  if (options.verbose === true) {
    console.log(`Created todo file: ${todoFilePath}`);
  }

  return {
    fileCount: downloaded.length,
    folderPath,
    todoFilePath,
  };
}

/**
 * Get content from a single Salesforce Help URL and download to temporary folder.
 * @param url - The Salesforce Help URL to download.
 * @param options - Download options (verbose, etc.).
 * @returns Result containing folder path, file count, and TODO file path.
 */
async function getSalesforceUrl(
  url: Readonly<string>,
  options: Readonly<SalesforceDownloadOptions> = {}
): Promise<SalesforceDownloadResult> {
  if (options.verbose === true) {
    console.log(`Getting content from: ${url}`);
  }

  // Create temporary folder
  const tempPrefix = `sf-docs-helper-get-${String(Date.now())}-`;
  const folderPath = await mkdtemp(join(tmpdir(), tempPrefix));

  if (options.verbose === true) {
    console.log(`Created temporary folder: ${folderPath}`);
  }

  // Download content
  const filename = getFilenameFromUrl(url, DEFAULT_INDEX);
  const filePath = join(folderPath, filename);

  await downloadContentToFile(url, filePath, options);

  // Create todo file
  const downloaded = [{ filePath, title: filename, url }];
  const todoFilePath = await createTodoFile(folderPath, downloaded);

  if (options.verbose === true) {
    console.log(`Created todo file: ${todoFilePath}`);
  }

  return {
    fileCount: SINGLE_FILE_COUNT,
    folderPath,
    todoFilePath,
  };
}

/* eslint-disable jsdoc/check-tag-names -- @rejects is required by jsdoc/require-rejects but not recognized by jsdoc/check-tag-names */

/**
 * Dump Salesforce Help content to stdout in markdown format.
 * Follows links to help.salesforce.com or developer.salesforce.com only.
 * Queries all pages in parallel.
 * @param item - The search query item.
 * @param options - Download options (limit, verbose, etc.).
 * @throws {Error} When no search results are found.
 * @rejects {Error} When no search results are found.
 */
/* eslint-enable jsdoc/check-tag-names */
async function dumpSalesforceHelp( // eslint-disable-line jsdoc/require-jsdoc -- JSDoc is above the eslint-disable/enable block
  item: Readonly<string>,
  options: Readonly<SalesforceDownloadOptions> = {}
): Promise<void> {
  if (options.verbose === true) {
    console.error(`Searching Salesforce Help for: ${item}`);
  }

  // Search Salesforce Help with configurable limit
  const limit = options.limit ?? DEFAULT_LIMIT;
  const searchResults = await searchSalesforceHelp(item, limit);

  if (searchResults.length === EMPTY_ARRAY_LENGTH) {
    throw new Error(`No results found for: ${item}`);
  }

  if (options.verbose === true) {
    const resultCountStr = String(searchResults.length);
    const limitStr = String(limit);
    console.error(
      `Found ${resultCountStr} results (limited to top ${limitStr})`
    );
  }

  // Deduplicate results by URL
  const uniqueResults = Array.from(
    new Map(searchResults.map((r: Readonly<{ url: string; title: string }>) => [r.url, r])).values()
  );

  // Limit to specified number of results
  const limitedResults = uniqueResults.slice(DEFAULT_INDEX, limit);

  // Collect all URLs to fetch (initial results + links from pages)
  const urlsToFetch = new Map<string, { url: string; title: string }>();

  // Add initial search results
  for (const result of limitedResults) {
    urlsToFetch.set(result.url, result);
  }

  // Fetch all initial pages in parallel
  const pagesToProcess = Array.from(urlsToFetch.values());

  if (options.verbose === true) {
    const pagesCountStr = String(pagesToProcess.length);
    console.error(`Fetching ${pagesCountStr} pages in parallel...`);
  }

  // Fetch all pages in parallel (removed extractSalesforceLinks to avoid multiple crawlers hanging)
  const pageContents = await Promise.all(
    pagesToProcess.map(async (result: Readonly<{ url: string; title: string }>) => {
      try {
        const content = await crawlSalesforcePage(result.url);
        return { content, title: result.title, url: result.url };
      } catch (error: unknown) {
        if (options.verbose === true) {
          const errorStr = String(error);
          console.error(`Failed to fetch ${result.url}: ${errorStr}`);
        }
        const errorStr = String(error);
        return {
          content: `Error: ${errorStr}`,
          title: result.title,
          url: result.url,
        };
      }
    })
  );

  // Use page contents directly (removed link extraction to prevent hanging from multiple crawlers)
  const allContents = pageContents;

  // Output markdown to stdout
  console.log('# Salesforce Help Documentation\n');
  console.log(`**Search Query:** ${item}\n`);
  const totalPagesStr = String(allContents.length);
  console.log(`**Total Pages:** ${totalPagesStr}\n`);
  console.log('---\n');

  for (const page of allContents) {
    console.log(`## ${page.title}\n`);
    console.log(`**URL:** ${page.url}\n`);
    console.log('---\n');
    console.log(page.content);
    console.log('\n\n');
  }
}

export type { SalesforceDownloadOptions, SalesforceDownloadResult };

export {
  dumpSalesforceHelp,
  getSalesforceUrl,
  searchAndDownloadSalesforceHelp,
};
