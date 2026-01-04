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
 * Handle search command.
 * @param item - Salesforce item to search for.
 * @param options - Command options.
 */
export async function handleSearchCommand(
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
		const exitCode = 1;
		process.exit(exitCode);
	}
}

/**
 * Handle get command.
 * @param url - Salesforce Help URL.
 * @param options - Command options.
 */
export async function handleGetCommand(
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
		const exitCode = 1;
		process.exit(exitCode);
	}
}

/**
 * Handle dump command.
 * @param item - Salesforce item to search for.
 * @param options - Command options.
 */
export async function handleDumpCommand(
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
		const exitCode = 1;
		process.exit(exitCode);
	}
}

export const program = new Command();

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
 * Check if this module is being run as the main entry point.
 * @returns True if this module is being executed directly.
 */
export function isMainEntryPoint(): boolean {
	return (
		(process.argv[1] && import.meta.url.endsWith(process.argv[1])) ||
		process.argv[1]?.includes('index.ts') === true ||
		process.argv[1]?.includes('sf-docs-helper') === true
	);
}

/**
 * Execute the CLI program if this is the main entry point.
 * This function is exported for testing purposes.
 */
export function executeIfMainEntryPoint(): void {
	if (isMainEntryPoint()) {
		program.parse();
	}
}

// Only parse if this file is executed directly (not imported)
executeIfMainEntryPoint();
