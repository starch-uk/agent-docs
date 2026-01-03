/**
 * @file Repository Todo Generator. Utilities for generating todo items for all files in a repository.
 * This is used to automate the file inspection process required by
 * the CREATE.md and UPDATE.md workflows.
 * @example
 * ```typescript
 * import {generateRepoTodos} from './repo-todos.js';
 *
 * const todos = await generateRepoTodos({
 *   repoPath: '/path/to/repository',
 * });
 *
 * // Use with todo_write tool
 * await todo_write({merge: false, todos});
 * ```
 */

import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

/**
 * Options for generating repository todos.
 */
interface RepoTodoOptions {
  /** Repository root path. */
  readonly repoPath: string;
  /** Paths to exclude (relative to repo root). */
  readonly excludePaths?: readonly string[];
  /** Custom prefix for todo IDs (default: 'file-'). */
  readonly todoIdPrefix?: string;
}

/**
 * Todo item structure matching todo_write tool format.
 */
interface RepoTodo {
  readonly id: string;
  readonly status: 'pending';
  readonly content: string;
}

/**
 * Default paths to exclude from file listing.
 */
const DEFAULT_EXCLUDE_PATHS: readonly string[] = [
  '.git',
  'node_modules',
  'dist',
  'coverage',
  '.next',
  'build',
  'out',
] as const;

/**
 * Converts a file path to a valid todo ID.
 * @param filePath - Relative file path.
 * @param prefix - Prefix for todo ID (default: 'file-').
 * @returns Valid todo ID.
 */
function pathToTodoId(filePath: Readonly<string>, prefix = 'file-'): string {
  // Remove leading ./ if present
  const cleanPath = filePath.replace(/^\.\//, '');
  // Replace path separators and special chars with hyphens
  const id = cleanPath
    .replace(/\//g, '-')
    .replace(/\\/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${prefix}${id}`;
}

/**
 * Recursively lists all files in a directory.
 * @param dirPath - Directory path to scan.
 * @param repoRoot - Repository root path (for relative paths).
 * @param excludePaths - Paths to exclude.
 * @returns Array of relative file paths.
 */
async function listFilesRecursive(
  dirPath: Readonly<string>,
  repoRoot: Readonly<string>,
  excludePaths: Readonly<readonly string[]>
): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    const relativePath = relative(repoRoot, fullPath);

    // Check if this path should be excluded
    const shouldExclude = excludePaths.some((exclude) => {
      // Check if path starts with exclude pattern
      if (relativePath.startsWith(exclude)) {
        return true;
      }
      // Check if any part of the path matches exclude
      const pathParts = relativePath.split(/[/\\]/);
      return pathParts.includes(exclude);
    });

    if (shouldExclude) {
      continue;
    }

    if (entry.isDirectory()) {
      const subFiles = await listFilesRecursive(
        fullPath,
        repoRoot,
        excludePaths
      );
      files.push(...subFiles);
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

/**
 * Generates todos for all files in a repository.
 * @param options - Configuration options.
 * @returns Array of todo items for all repository files.
 */
async function generateRepoTodos(
  options: RepoTodoOptions
): Promise<readonly RepoTodo[]> {
  const {
    repoPath,
    excludePaths = DEFAULT_EXCLUDE_PATHS,
    todoIdPrefix = 'file-',
  } = options;

  // Normalize repo path
  const normalizedRepoPath = repoPath.replace(/\/$/, '');

  // List all files
  const files = await listFilesRecursive(
    normalizedRepoPath,
    normalizedRepoPath,
    excludePaths
  );

  // Sort files for consistent ordering
  const sortedFiles = files.sort();

  // Generate todos
  const todos: RepoTodo[] = sortedFiles.map((filePath) => {
    const todoId = pathToTodoId(filePath, todoIdPrefix);
    return {
      content: `Inspect ${filePath}`,
      id: todoId,
      status: 'pending',
    };
  });

  return todos;
}

/**
 * Validates that todos match file count.
 * @param files - Array of file paths.
 * @param todos - Array of generated todos.
 * @returns True if counts match, false otherwise.
 */
function validateTodoCount(
  files: Readonly<readonly string[]>,
  todos: Readonly<readonly RepoTodo[]>
): boolean {
  return files.length === todos.length;
}

/**
 * Finds duplicate todo IDs.
 * @param todos - Array of todos.
 * @returns Array of duplicate IDs.
 */
function findDuplicateIds(todos: Readonly<readonly RepoTodo[]>): string[] {
  const idCounts = new Map<string, number>();
  const duplicates: string[] = [];
  const initialCount = 0;
  const duplicateThreshold = 2;
  const countIncrement = 1;

  for (const todo of todos) {
    const existingCount = idCounts.get(todo.id);
    const count = (existingCount ?? initialCount) + countIncrement;
    idCounts.set(todo.id, count);
    if (count === duplicateThreshold) {
      duplicates.push(todo.id);
    }
  }

  return duplicates;
}

export type { RepoTodoOptions, RepoTodo };
export { generateRepoTodos, pathToTodoId, validateTodoCount, findDuplicateIds };
