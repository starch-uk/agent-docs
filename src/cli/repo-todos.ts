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
 * Main function for repo-todos CLI.
 * @returns Promise that resolves when the CLI completes.
 */
async function main(): Promise<void> {
  const argvSkipCount = 2;
  const args = process.argv.slice(argvSkipCount);
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

  if (repoPath === undefined || repoPath === '') {
    console.error('Usage: pnpm repo-todos <repo-path> [--output <file>]');
    console.error('');
    console.error('Generates todos for all files in a repository.');
    console.error('Outputs JSON that can be used with the todo_write tool.');
    console.error('');
    console.error('Options:');
    console.error('  --output, -o    Write output to a file instead of stdout');
    const exitCode = 1;
    process.exit(exitCode);
  }

  const resolvedPath = resolve(repoPath);

  try {
    const todos = await generateRepoTodos({
      repoPath: resolvedPath,
    });

    // Validate todo count
    const inspectPrefix = 'Inspect ';
    const files = todos.map((t: Readonly<{ content: string }>) =>
      t.content.replace(inspectPrefix, '')
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
      console.error(`ERROR: Found ${duplicateCountStr} duplicate todo IDs:`);
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
        `✓ Generated ${todoCountStr} todos and wrote to ${outputFile}`
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

void main();
