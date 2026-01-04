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

/**
 * Handles the search command for finding and downloading Salesforce Help documentation.
 * @param item - The Salesforce item or topic to search for in help documentation.
 * @param options - Configuration options including concurrency, limit, and verbosity.
 */
async function handleSearchCommand(
	item: string,
	options: Readonly<{
		concurrency?: number;
		limit?: number;
		verbose?: boolean;
	}>,
): Promise<void> {
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
			`\nReview the TODO.md file in the folder to process each document.`,
		);
	} catch (error) {
		console.error('Error searching Salesforce Help:', error);
		const EXIT_CODE_ERROR = 1;
		process.exit(EXIT_CODE_ERROR);
	}
}

/**
 * Handles the get command for downloading content from a specific Salesforce Help URL.
 * @param url - The complete URL to the Salesforce Help documentation page.
 * @param options - Configuration options including verbosity settings.
 */
async function handleGetCommand(
	url: string,
	options: Readonly<{ verbose?: boolean }>,
): Promise<void> {
	try {
		const result = await getSalesforceUrl(url, {
			verbose: options.verbose,
		});

		console.log(`\nDownloaded file to:`);
		console.log(result.folderPath);
		console.log(`\nTodo file: ${result.todoFilePath}`);
		console.log(
			`\nReview the TODO.md file in the folder to process the document.`,
		);
	} catch (error) {
		console.error('Error getting Salesforce Help URL:', error);
		const EXIT_CODE_ERROR = 1;
		process.exit(EXIT_CODE_ERROR);
	}
}

/**
 * Handles the dump command for searching and outputting Salesforce Help content as markdown.
 * @param item - The Salesforce item or topic to search for in help documentation.
 * @param options - Configuration options including concurrency, limit, and verbosity.
 */
async function handleDumpCommand(
	item: string,
	options: Readonly<{
		concurrency?: number;
		limit?: number;
		verbose?: boolean;
	}>,
): Promise<void> {
	try {
		await dumpSalesforceHelp(item, {
			concurrency: options.concurrency,
			limit: options.limit,
			verbose: options.verbose,
		});
	} catch (error) {
		console.error('Error dumping Salesforce Help:', error);
		const EXIT_CODE_ERROR = 1;
		process.exit(EXIT_CODE_ERROR);
	}
}

const program = new Command();

program
	.name('sf-docs-helper')
	.description(
		'Helper script for searching and extracting details from Salesforce Help',
	)
	.version('1.0.0');

program
	.command('search')
	.description(
		'Search Salesforce Help, download all results to temporary folder',
	)
	.argument('<item>', 'Salesforce item to search for')
	.option('-v, --verbose', 'Show progress during processing')
	.option('--concurrency <n>', 'Number of concurrent downloads', parseInt)
	.option(
		'--limit <n>',
		'Maximum number of results to download (default: 20)',
		parseInt,
	)
	.action(handleSearchCommand);

program
	.command('get')
	.description(
		'Get content from a Salesforce Help URL, download to temporary folder',
	)
	.argument('<url>', 'Salesforce Help URL')
	.option('-v, --verbose', 'Show progress during processing')
	.action(handleGetCommand);

program
	.command('dump')
	.description(
		'Dump mode: search for item and output all results as markdown to stdout',
	)
	.argument('<item>', 'Salesforce item to search for')
	.option(
		'-v, --verbose',
		'Show progress during processing (outputs to stderr)',
	)
	.option('--concurrency <n>', 'Number of concurrent downloads', parseInt)
	.option(
		'--limit <n>',
		'Maximum number of results to download (default: 20)',
		parseInt,
	)
	.action(handleDumpCommand);

/**
 * Checks if this module is being run as the main entry point of the application.
 * @returns True if this module is being executed directly, false otherwise.
 */
function isMainEntryPoint(): boolean {
	const FIRST_ARG_INDEX = 1;
	return (
		(process.argv[FIRST_ARG_INDEX] &&
			import.meta.url.endsWith(process.argv[FIRST_ARG_INDEX])) ||
		(process.argv[FIRST_ARG_INDEX]?.includes('index.ts') ?? false) ||
		(process.argv[FIRST_ARG_INDEX]?.includes('sf-docs-helper') ?? false)
	);
}

/**
 * Executes the CLI program if this is the main entry point.
 * This function is exported for testing purposes.
 */
function executeIfMainEntryPoint(): void {
	if (isMainEntryPoint()) {
		program.parse();
	}
}

// Export all functions and constants together
export {
	executeIfMainEntryPoint,
	handleDumpCommand,
	handleGetCommand,
	handleSearchCommand,
	isMainEntryPoint,
	program,
};

// Only parse if this file is executed directly (not imported)
executeIfMainEntryPoint();
