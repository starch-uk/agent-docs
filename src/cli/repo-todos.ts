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
 * Parses command line arguments for the repo-todos CLI tool.
 * @param args - Command line arguments (typically process.argv.slice(2)).
 * @returns Parsed arguments containing repoPath and outputFile.
 */
function parseArgs(args: readonly string[]): {
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
 * Main function for the repo-todos CLI that generates todos for repository files.
 * @param args - Optional command line arguments (defaults to process.argv.slice(2)).
 * @returns Promise that resolves when the CLI completes execution.
 */
async function main(args?: readonly string[]): Promise<void> {
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
		const EXIT_CODE_ERROR = 1;
		process.exit(EXIT_CODE_ERROR);
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
			const EXIT_CODE_ERROR = 1;
			process.exit(EXIT_CODE_ERROR);
		}

		// Check for duplicates
		const duplicates = findDuplicateIds(todos);
		const ZERO = 0;
		if (duplicates.length > ZERO) {
			const duplicateCountStr = String(duplicates.length);
			console.error(
				`ERROR: Found ${duplicateCountStr} duplicate todo IDs:`,
			);
			duplicates.forEach((id) => {
				console.error(`  - ${id}`);
			});
			const EXIT_CODE_ERROR = 1;
			process.exit(EXIT_CODE_ERROR);
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
		const EXIT_CODE_ERROR = 1;
		process.exit(EXIT_CODE_ERROR);
	}
}

/**
 * Checks if this module is being run as the main entry point of the application.
 * @returns True if this module is being executed directly, false otherwise.
 */
function isMainEntryPoint(): boolean {
	const FIRST_ARG_INDEX = 1;
	return (
		(process.argv[FIRST_ARG_INDEX] &&
			import.meta.url.endsWith(process.argv[FIRST_ARG_INDEX])) ||
		(process.argv[FIRST_ARG_INDEX]?.includes('repo-todos') ?? false)
	);
}

/**
 * Executes the main function if this is the main entry point.
 * This function is exported for testing purposes.
 */
function executeIfMainEntryPoint(): void {
	if (isMainEntryPoint()) {
		void main();
	}
}

// Export all functions together
export {
	executeIfMainEntryPoint,
	isMainEntryPoint,
	main,
	parseArgs,
};

// Only run main if this file is executed directly (not imported)
executeIfMainEntryPoint();
