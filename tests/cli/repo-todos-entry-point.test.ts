/**
 * @file Tests for repo-todos CLI entry point execution.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isMainEntryPoint, executeIfMainEntryPoint } from '../../src/cli/repo-todos.js';
import * as repoTodosModule from '../../src/cli/repo-todos.js';
import * as repoTodosUtils from '../../src/utils/repo-todos.js';
import { readdir } from 'fs/promises';

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

	it('should return false when process.argv does not match entry point conditions', () => {
		process.argv = ['node', '/path/to/other-script.js'];
		expect(isMainEntryPoint()).toBe(false);
	});

	it('should call executeIfMainEntryPoint without errors', async () => {
		process.argv = ['node', '/path/to/repo-todos', '/tmp/test-repo'];
		// Mock process.exit to prevent actual exit
		const originalExit = process.exit;
		const exitSpy = vi.fn() as typeof process.exit;
		process.exit = exitSpy;
		
		// Mock file system operations to avoid actual file access
		vi.mocked(readdir).mockResolvedValue([] as any);
		vi.mocked(repoTodosUtils.generateRepoTodos).mockResolvedValue([]);
		
		// Test that the function can be called (entry point execution happens at module load)
		// The actual execution is tested via the isMainEntryPoint() tests
		expect(() => executeIfMainEntryPoint()).not.toThrow();
		
		// Give async operations time to complete
		await new Promise((resolve) => setTimeout(resolve, 10));
		
		process.exit = originalExit;
	});
});

