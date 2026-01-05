/**
 * @file Tests for repo-todos CLI entry point execution.
 */

import { readdir } from 'fs/promises';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	isMainEntryPoint,
	executeIfMainEntryPoint,
} from '../../src/cli/repo-todos.js';
import * as repoTodosUtils from '../../src/utils/repo-todos.js';

vi.mock('../../src/utils/repo-todos.js');
vi.mock('fs/promises');

describe('repo-todos CLI entry point', () => {
	const originalArgv = process.argv;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		process.argv = originalArgv;
	});

	it('should return true when process.argv includes repo-todos', () => {
		process.argv = ['node', '/path/to/repo-todos', '/tmp/repo'];
		expect(isMainEntryPoint()).toBe(true);
	});

	it('should return true when process.argv includes repo-todos (fallback condition)', () => {
		// Force the first condition to be false by using a value that won't match import.meta.url.endsWith()
		// but contains 'repo-todos', ensuring line 140 is evaluated
		process.argv = [
			'node',
			'/absolutely/different/path/repo-todos',
			'/tmp/repo',
		];
		const result = isMainEntryPoint();
		expect(result).toBe(true);
		process.argv = originalArgv;
	});

	it('should handle undefined process.argv[1] for nullish coalescing coverage', () => {
		// Test the ?? false branch when process.argv[1] is undefined
		process.argv = ['node']; // Only one element, so process.argv[1] is undefined
		const result = isMainEntryPoint();
		expect(result).toBe(false);
		process.argv = originalArgv;
	});

	it('should return false when process.argv does not match entry point conditions', () => {
		process.argv = ['node', '/path/to/other-script.js'];
		expect(isMainEntryPoint()).toBe(false);
	});

	it('should call executeIfMainEntryPoint without errors', async () => {
		process.argv = ['node', '/path/to/repo-todos', '/tmp/test-repo'];

		/**
		 * Mock process.exit to prevent actual exit.
		 */
		// eslint-disable-next-line @typescript-eslint/unbound-method
		const originalExit = process.exit;
		const exitSpy = vi.fn() as typeof process.exit;
		process.exit = exitSpy.bind(process);

		/**
		 * Mock file system operations to avoid actual file access.
		 */
		vi.mocked(readdir).mockResolvedValue(
			[] as Awaited<ReturnType<typeof readdir>>,
		);
		vi.mocked(repoTodosUtils.generateRepoTodos).mockResolvedValue([]);

		// Test that the function can be called (entry point execution happens at module load)
		// The actual execution is tested via the isMainEntryPoint() tests
		expect(() => {
			executeIfMainEntryPoint();
		}).not.toThrow();

		// Give async operations time to complete
		const TIMEOUT_DELAY_10 = 10;
		await new Promise((resolve) => setTimeout(resolve, TIMEOUT_DELAY_10));

		process.exit = originalExit;
	});
});
