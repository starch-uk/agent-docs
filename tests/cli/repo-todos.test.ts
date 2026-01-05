/**
 * @file Tests for repo-todos CLI script.
 */

import { writeFile } from 'fs/promises';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { main, parseArgs } from '../../src/cli/repo-todos.js';
import * as repoTodosUtils from '../../src/utils/repo-todos.js';

vi.mock('fs/promises');
vi.mock('../../src/utils/repo-todos.js');

/**
 * Mock process.exit and console methods.
 */
// eslint-disable-next-line @typescript-eslint/unbound-method
const originalExit = process.exit;
const originalError = console.error;
const originalLog = console.log;

describe('repo-todos CLI', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.exit = originalExit.bind(process);
		console.error = originalError;
		console.log = originalLog;
		vi.spyOn(console, 'error').mockImplementation(() => {
			// Intentionally empty for test mocking
		});
		vi.spyOn(console, 'log').mockImplementation(() => {
			// Intentionally empty for test mocking
		});
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
		vi.spyOn(process, 'exit').mockImplementation((() => {
			// Intentionally empty for test mocking
		}) as (code?: number) => never);
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
		/**
		 * Ensure process.exit is mocked before calling main.
		 */
		it('should handle missing repo path', async () => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
			vi.spyOn(process, 'exit').mockImplementation((() => {
				// Intentionally empty for test mocking
			}) as (code?: number) => never);

			await main([]);

			expect(console.error).toHaveBeenCalledWith(
				'Usage: pnpm repo-todos <repo-path> [--output <file>]',
			);
			const EXIT_CODE_ERROR = 1;
			// eslint-disable-next-line @typescript-eslint/unbound-method
			expect(process.exit).toHaveBeenCalledWith(EXIT_CODE_ERROR);
		});

		it('should handle empty repo path', async () => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
			vi.spyOn(process, 'exit').mockImplementation((() => {
				// Intentionally empty for test mocking
			}) as (code?: number) => never);

			await main(['']);

			expect(console.error).toHaveBeenCalled();
			const EXIT_CODE_ERROR = 1;
			// eslint-disable-next-line @typescript-eslint/unbound-method
			expect(process.exit).toHaveBeenCalledWith(EXIT_CODE_ERROR);
		});

		it('should generate todos and output to stdout', async () => {
			const mockTodos = [
				{
					content: 'Inspect file1.ts',
					id: 'file-1',
					status: 'pending' as const,
				},
				{
					content: 'Inspect file2.ts',
					id: 'file-2',
					status: 'pending' as const,
				},
			];

			vi.mocked(repoTodosUtils.generateRepoTodos).mockResolvedValue(
				mockTodos,
			);
			vi.mocked(repoTodosUtils.validateTodoCount).mockReturnValue(true);
			vi.mocked(repoTodosUtils.findDuplicateIds).mockReturnValue([]);

			await main(['/tmp/test-repo']);

			expect(repoTodosUtils.generateRepoTodos).toHaveBeenCalledWith({
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				repoPath: expect.stringContaining('/tmp/test-repo'),
			});
			expect(console.log).toHaveBeenCalled();
			const ZERO = 0;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
			const logCall = vi.mocked(console.log).mock.calls[ZERO]?.[ZERO] as
				| string
				| undefined;

			if (logCall !== undefined && logCall !== '') {
				expect(logCall).toContain('file-1');
			}
		});

		it('should generate todos and write to file with --output', async () => {
			const mockTodos = [
				{
					content: 'Inspect file1.ts',
					id: 'file-1',
					status: 'pending' as const,
				},
			];

			vi.mocked(repoTodosUtils.generateRepoTodos).mockResolvedValue(
				mockTodos,
			);
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
			// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
			vi.spyOn(process, 'exit').mockImplementation((() => {
				// Intentionally empty for test mocking
			}) as (code?: number) => never);

			const mockTodos = [
				{
					content: 'Inspect file1.ts',
					id: 'file-1',
					status: 'pending' as const,
				},
			];

			vi.mocked(repoTodosUtils.generateRepoTodos).mockResolvedValue(
				mockTodos,
			);
			vi.mocked(repoTodosUtils.validateTodoCount).mockReturnValue(false);
			vi.mocked(repoTodosUtils.findDuplicateIds).mockReturnValue([]);

			await main(['/tmp/test-repo']);

			expect(console.error).toHaveBeenCalledWith(
				'ERROR: Todo count does not match file count!',
			);
			const EXIT_CODE_ERROR = 1;
			// eslint-disable-next-line @typescript-eslint/unbound-method
			expect(process.exit).toHaveBeenCalledWith(EXIT_CODE_ERROR);
		});

		it('should exit with error if duplicate IDs found', async () => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
			vi.spyOn(process, 'exit').mockImplementation((() => {
				// Intentionally empty for test mocking
			}) as (code?: number) => never);

			const mockTodos = [
				{
					content: 'Inspect file1.ts',
					id: 'file-1',
					status: 'pending' as const,
				},
			];

			vi.mocked(repoTodosUtils.generateRepoTodos).mockResolvedValue(
				mockTodos,
			);
			vi.mocked(repoTodosUtils.validateTodoCount).mockReturnValue(true);
			vi.mocked(repoTodosUtils.findDuplicateIds).mockReturnValue([
				'file-1',
			]);

			await main(['/tmp/test-repo']);

			expect(console.error).toHaveBeenCalledWith(
				expect.stringContaining('ERROR: Found'),
			);
			const EXIT_CODE_ERROR = 1;
			// eslint-disable-next-line @typescript-eslint/unbound-method
			expect(process.exit).toHaveBeenCalledWith(EXIT_CODE_ERROR);
		});

		it('should handle errors during todo generation', async () => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
			vi.spyOn(process, 'exit').mockImplementation((() => {
				// Intentionally empty for test mocking
			}) as (code?: number) => never);

			vi.mocked(repoTodosUtils.generateRepoTodos).mockRejectedValue(
				new Error('Test error'),
			);

			await main(['/tmp/test-repo']);

			expect(console.error).toHaveBeenCalledWith(
				'Error generating todos:',
				expect.any(Error),
			);
			const EXIT_CODE_ERROR = 1;
			// eslint-disable-next-line @typescript-eslint/unbound-method
			expect(process.exit).toHaveBeenCalledWith(EXIT_CODE_ERROR);
		});
	});
});
