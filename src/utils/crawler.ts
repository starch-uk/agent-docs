/**
 * @file Utilities for crawling and extracting content from Salesforce Help pages.
 * Re-exports from split modules for backward compatibility.
 */

/* v8 ignore file -- Browser-side code in page.evaluate() cannot be unit tested in Node.js */

export { searchSalesforceHelp, normalizeQuery } from './crawler-search.ts';
export { crawlSalesforcePage } from './crawler-crawl.ts';
