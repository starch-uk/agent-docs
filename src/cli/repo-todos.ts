#!/usr/bin/env node

/**
 * @file CLI script to generate todos for repository files.
 * Usage:
 * pnpm repo-todos <repo-path> [--output <file>].
 * Example:
 * pnpm repo-todos /path/to/repository
 * pnpm repo-todos /path/to/repository --output todos.json.
 */

import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';
import {
	generateRepoTodos,
	validateTodoCount,
	findDuplicateIds,
} from '../utils/repo-todos.ts';

/**
 * Parse command line arguments for repo-todos CLI.
 * @param args - Command line arguments (typically process.argv.slice(2)).
 * @returns Parsed arguments with repoPath and outputFile.
 */
export function parseArgs(args: readonly string[]): {
	repoPath: string | undefined;
	outputFile: string | undefined;
} {
	let repoPath: string | undefined = undefined;
	let outputFile: string | undefined = undefined;

	const skipNextIndex = 1;
	const outputFlagIndex = 1;

	// Parse arguments
	for (let i = 0; i < args.length; i++) {
		if (args[i] === '--output' || args[i] === '-o') {
			outputFile = args[i + outputFlagIndex];
			i += skipNextIndex; // Skip the next argument as it's the output file
		} else if (repoPath === undefined && !args[i].startsWith('-')) {
			repoPath = args[i];
		}
	}

	return { outputFile, repoPath };
}

/**
 * Main function for repo-todos CLI.
 * @param args - Optional command line arguments (defaults to process.argv.slice(2)).
 * @returns Promise that resolves when the CLI completes.
 */
export async function main(args?: readonly string[]): Promise<void> {
	const argvSkipCount = 2;
	const cliArgs = args ?? process.argv.slice(argvSkipCount);
	const { outputFile, repoPath } = parseArgs(cliArgs);

	if (repoPath === undefined || repoPath === '') {
		console.error('Usage: pnpm repo-todos <repo-path> [--output <file>]');
		console.error('');
		console.error('Generates todos for all files in a repository.');
		console.error(
			'Outputs JSON that can be used with the todo_write tool.',
		);
		console.error('');
		console.error('Options:');
		console.error(
			'  --output, -o    Write output to a file instead of stdout',
		);
		const exitCode = 1;
		process.exit(exitCode);
		return; // Exit early to satisfy TypeScript
	}

	const resolvedPath = resolve(repoPath);

	try {
		const todos = await generateRepoTodos({
			repoPath: resolvedPath,
		});

		// Validate todo count
		const inspectPrefix = 'Inspect ';
		const files = todos.map((t: Readonly<{ content: string }>) =>
			t.content.replace(inspectPrefix, ''),
		);
		const isValid = validateTodoCount(files, todos);

		if (!isValid) {
			console.error('ERROR: Todo count does not match file count!');
			const exitCode = 1;
			process.exit(exitCode);
		}

		// Check for duplicates
		const duplicates = findDuplicateIds(todos);
		const noDuplicates = 0;
		if (duplicates.length > noDuplicates) {
			const duplicateCountStr = String(duplicates.length);
			console.error(
				`ERROR: Found ${duplicateCountStr} duplicate todo IDs:`,
			);
			duplicates.forEach((id) => {
				console.error(`  - ${id}`);
			});
			const exitCode = 1;
			process.exit(exitCode);
		}

		const jsonIndent = 2;
		const jsonOutput = JSON.stringify(todos, null, jsonIndent);

		// Write to file if specified, otherwise output to stdout
		if (outputFile !== undefined && outputFile !== '') {
			await writeFile(outputFile, jsonOutput, 'utf8');
			const todoCountStr = String(todos.length);
			console.error(
				`✓ Generated ${todoCountStr} todos and wrote to ${outputFile}`,
			);
		} else {
			// Output JSON for use with todo_write tool
			console.log(jsonOutput);
		}
	} catch (error) {
		console.error('Error generating todos:', error);
		const exitCode = 1;
		process.exit(exitCode);
	}
}

/**
 * Check if this module is being run as the main entry point.
 * @returns True if this module is being executed directly.
 */
export function isMainEntryPoint(): boolean {
	return (
		(process.argv[1] && import.meta.url.endsWith(process.argv[1])) ||
		process.argv[1]?.includes('repo-todos') === true
	);
}

/**
 * Execute main if this is the main entry point.
 * This function is exported for testing purposes.
 */
export function executeIfMainEntryPoint(): void {
	if (isMainEntryPoint()) {
		void main();
	}
}

// Only run main if this file is executed directly (not imported)
executeIfMainEntryPoint();
