#!/usr/bin/env node

/**
 * @file CLI entry point for sf-docs-helper tool.
 */

// Disable Crawlee INFO logging by setting environment variable
process.env.CRAWLEE_LOG_LEVEL = process.env.CRAWLEE_LOG_LEVEL ?? 'ERROR';

import { Command } from 'commander';
import {
  searchAndDownloadSalesforceHelp,
  getSalesforceUrl,
  dumpSalesforceHelp,
} from '../sources/salesforce.ts';

const program = new Command();

program
  .name('sf-docs-helper')
  .description(
    'Helper script for searching and extracting details from Salesforce Help'
  )
  .version('1.0.0');

program
  .command('search')
  .description(
    'Search Salesforce Help, download all results to temporary folder'
  )
  .argument('<item>', 'Salesforce item to search for')
  .option('-v, --verbose', 'Show progress during processing')
  .option('--concurrency <n>', 'Number of concurrent downloads', parseInt)
  .option(
    '--limit <n>',
    'Maximum number of results to download (default: 20)',
    parseInt
  )
  .action(
    async (
      item: string,
      options: Readonly<{
        concurrency?: number;
        limit?: number;
        verbose?: boolean;
      }>
    ) => {
      try {
        const result = await searchAndDownloadSalesforceHelp(item, {
          concurrency: options.concurrency,
          limit: options.limit,
          verbose: options.verbose,
        });

        const fileCountStr = String(result.fileCount);
        console.log(`\nDownloaded ${fileCountStr} files to:`);
        console.log(result.folderPath);
        console.log(`\nTodo file: ${result.todoFilePath}`);
        console.log(
          `\nReview the TODO.md file in the folder to process each document.`
        );
      } catch (error) {
        console.error('Error searching Salesforce Help:', error);
        const exitCode = 1;
        process.exit(exitCode);
      }
    }
  );

program
  .command('get')
  .description(
    'Get content from a Salesforce Help URL, download to temporary folder'
  )
  .argument('<url>', 'Salesforce Help URL')
  .option('-v, --verbose', 'Show progress during processing')
  .action(async (url: string, options: Readonly<{ verbose?: boolean }>) => {
    try {
      const result = await getSalesforceUrl(url, {
        verbose: options.verbose,
      });

      console.log(`\nDownloaded file to:`);
      console.log(result.folderPath);
      console.log(`\nTodo file: ${result.todoFilePath}`);
      console.log(
        `\nReview the TODO.md file in the folder to process the document.`
      );
    } catch (error) {
      console.error('Error getting Salesforce Help URL:', error);
      const exitCode = 1;
      process.exit(exitCode);
    }
  });

program
  .command('dump')
  .description(
    'Dump mode: search for item and output all results as markdown to stdout'
  )
  .argument('<item>', 'Salesforce item to search for')
  .option(
    '-v, --verbose',
    'Show progress during processing (outputs to stderr)'
  )
  .option('--concurrency <n>', 'Number of concurrent downloads', parseInt)
  .option(
    '--limit <n>',
    'Maximum number of results to download (default: 20)',
    parseInt
  )
  .action(
    async (
      item: string,
      options: Readonly<{
        concurrency?: number;
        limit?: number;
        verbose?: boolean;
      }>
    ) => {
      try {
        await dumpSalesforceHelp(item, {
          concurrency: options.concurrency,
          limit: options.limit,
          verbose: options.verbose,
        });
      } catch (error) {
        console.error('Error dumping Salesforce Help:', error);
        const exitCode = 1;
        process.exit(exitCode);
      }
    }
  );

program.parse();
