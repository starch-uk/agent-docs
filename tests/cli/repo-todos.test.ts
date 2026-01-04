/**
 * @file Tests for repo-todos CLI script.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { writeFile } from 'fs/promises';
import { resolve } from 'node:path';
import { main, parseArgs } from '../../src/cli/repo-todos.js';
import * as repoTodosUtils from '../../src/utils/repo-todos.js';

vi.mock('fs/promises');
vi.mock('../../src/utils/repo-todos.js');

// Mock process.exit and console methods
const originalExit = process.exit;
const originalError = console.error;
const originalLog = console.log;

describe('repo-todos CLI', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.exit = originalExit;
		console.error = originalError;
		console.log = originalLog;
		vi.spyOn(console, 'error').mockImplementation(() => {
			// Intentionally empty for test mocking
		});
		vi.spyOn(console, 'log').mockImplementation(() => {
			// Intentionally empty for test mocking
		});
		vi.spyOn(process, 'exit').mockImplementation((() => {
			// Intentionally empty for test mocking
		}) as typeof process.exit);
	});

	describe('parseArgs', () => {
		it('should parse repo path', () => {
			const result = parseArgs(['/tmp/repo']);
			expect(result.repoPath).toBe('/tmp/repo');
			expect(result.outputFile).toBeUndefined();
		});

		it('should parse repo path with --output', () => {
			const result = parseArgs(['/tmp/repo', '--output', 'todos.json']);
			expect(result.repoPath).toBe('/tmp/repo');
			expect(result.outputFile).toBe('todos.json');
		});

		it('should parse repo path with -o', () => {
			const result = parseArgs(['/tmp/repo', '-o', 'todos.json']);
			expect(result.repoPath).toBe('/tmp/repo');
			expect(result.outputFile).toBe('todos.json');
		});

		it('should handle missing repo path', () => {
			const result = parseArgs([]);
			expect(result.repoPath).toBeUndefined();
		});
	});

	describe('main', () => {
		it('should handle missing repo path', async () => {
			// Ensure process.exit is mocked before calling main
			vi.spyOn(process, 'exit').mockImplementation((() => {
				// Intentionally empty for test mocking
			}) as typeof process.exit);
			
			await main([]);
			
			expect(console.error).toHaveBeenCalledWith(
				'Usage: pnpm repo-todos <repo-path> [--output <file>]',
			);
			expect(process.exit).toHaveBeenCalledWith(1);
		});

		it('should handle empty repo path', async () => {
			vi.spyOn(process, 'exit').mockImplementation((() => {
				// Intentionally empty for test mocking
			}) as typeof process.exit);
			
			await main(['']);

			expect(console.error).toHaveBeenCalled();
			expect(process.exit).toHaveBeenCalledWith(1);
		});

		it('should generate todos and output to stdout', async () => {
			const mockTodos = [
				{ id: 'file-1', status: 'pending' as const, content: 'Inspect file1.ts' },
				{ id: 'file-2', status: 'pending' as const, content: 'Inspect file2.ts' },
			];

			vi.mocked(repoTodosUtils.generateRepoTodos).mockResolvedValue(mockTodos);
			vi.mocked(repoTodosUtils.validateTodoCount).mockReturnValue(true);
			vi.mocked(repoTodosUtils.findDuplicateIds).mockReturnValue([]);

			await main(['/tmp/test-repo']);

			expect(repoTodosUtils.generateRepoTodos).toHaveBeenCalledWith({
				repoPath: expect.stringContaining('/tmp/test-repo'),
			});
			expect(console.log).toHaveBeenCalled();
			const logCall = vi.mocked(console.log).mock.calls[0]?.[0];
			expect(logCall).toContain('file-1');
		});

		it('should generate todos and write to file with --output', async () => {
			const mockTodos = [
				{ id: 'file-1', status: 'pending' as const, content: 'Inspect file1.ts' },
			];

			vi.mocked(repoTodosUtils.generateRepoTodos).mockResolvedValue(mockTodos);
			vi.mocked(repoTodosUtils.validateTodoCount).mockReturnValue(true);
			vi.mocked(repoTodosUtils.findDuplicateIds).mockReturnValue([]);
			vi.mocked(writeFile).mockResolvedValue(undefined);

			await main(['/tmp/test-repo', '--output', 'todos.json']);

			expect(writeFile).toHaveBeenCalledWith(
				'todos.json',
				expect.stringContaining('file-1'),
				'utf8',
			);
			expect(console.error).toHaveBeenCalledWith(
				expect.stringContaining('Generated'),
			);
		});

		it('should exit with error if todo count validation fails', async () => {
			vi.spyOn(process, 'exit').mockImplementation((() => {
				// Intentionally empty for test mocking
			}) as typeof process.exit);
			
			const mockTodos = [
				{ id: 'file-1', status: 'pending' as const, content: 'Inspect file1.ts' },
			];

			vi.mocked(repoTodosUtils.generateRepoTodos).mockResolvedValue(mockTodos);
			vi.mocked(repoTodosUtils.validateTodoCount).mockReturnValue(false);
			vi.mocked(repoTodosUtils.findDuplicateIds).mockReturnValue([]);

			await main(['/tmp/test-repo']);

			expect(console.error).toHaveBeenCalledWith(
				'ERROR: Todo count does not match file count!',
			);
			expect(process.exit).toHaveBeenCalledWith(1);
		});

		it('should exit with error if duplicate IDs found', async () => {
			vi.spyOn(process, 'exit').mockImplementation((() => {
				// Intentionally empty for test mocking
			}) as typeof process.exit);
			
			const mockTodos = [
				{ id: 'file-1', status: 'pending' as const, content: 'Inspect file1.ts' },
			];

			vi.mocked(repoTodosUtils.generateRepoTodos).mockResolvedValue(mockTodos);
			vi.mocked(repoTodosUtils.validateTodoCount).mockReturnValue(true);
			vi.mocked(repoTodosUtils.findDuplicateIds).mockReturnValue(['file-1']);

			await main(['/tmp/test-repo']);

			expect(console.error).toHaveBeenCalledWith(
				expect.stringContaining('ERROR: Found'),
			);
			expect(process.exit).toHaveBeenCalledWith(1);
		});

		it('should handle errors during todo generation', async () => {
			vi.spyOn(process, 'exit').mockImplementation((() => {
				// Intentionally empty for test mocking
			}) as typeof process.exit);
			
			vi.mocked(repoTodosUtils.generateRepoTodos).mockRejectedValue(
				new Error('Test error'),
			);

			await main(['/tmp/test-repo']);

			expect(console.error).toHaveBeenCalledWith(
				'Error generating todos:',
				expect.any(Error),
			);
			expect(process.exit).toHaveBeenCalledWith(1);
		});
	});
});

