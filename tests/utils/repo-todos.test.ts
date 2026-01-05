/**
 * @file Tests for repository todo utilities.
 */

import { readdir } from 'fs/promises';
import { join } from 'path';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	generateRepoTodos,
	pathToTodoId,
	validateTodoCount,
	findDuplicateIds,
} from '../../src/utils/repo-todos.js';

vi.mock('fs/promises', () => ({
	readdir: vi.fn(),
}));

describe('pathToTodoId', () => {
	it('should convert file path to valid todo ID', () => {
		expect(pathToTodoId('src/index.ts')).toBe('file-src-index-ts');
		expect(pathToTodoId('./src/index.ts')).toBe('file-src-index-ts');
		expect(pathToTodoId('src/utils/helper.ts')).toBe(
			'file-src-utils-helper-ts',
		);
	});

	it('should handle special characters in path', () => {
		expect(pathToTodoId('src/test-file.ts')).toBe('file-src-test-file-ts');
		// Underscores are replaced with hyphens (non-alphanumeric except hyphens)
		expect(pathToTodoId('src/test_file.ts')).toBe('file-src-test-file-ts');
		expect(pathToTodoId('src/test@file.ts')).toBe('file-src-test-file-ts');
	});

	it('should use custom prefix', () => {
		expect(pathToTodoId('src/index.ts', 'custom-')).toBe(
			'custom-src-index-ts',
		);
	});

	it('should handle paths with multiple separators', () => {
		expect(pathToTodoId('src/utils/helper.ts')).toBe(
			'file-src-utils-helper-ts',
		);
	});

	it('should remove leading and trailing hyphens', () => {
		expect(pathToTodoId('-test-')).toBe('file-test');
	});
});

describe('validateTodoCount', () => {
	it('should return true when counts match', () => {
		const files = ['file1.ts', 'file2.ts'];
		const todos = [
			{ content: 'test', id: '1', status: 'pending' as const },
			{ content: 'test', id: '2', status: 'pending' as const },
		];
		expect(validateTodoCount(files, todos)).toBe(true);
	});

	it('should return false when counts do not match', () => {
		const files = ['file1.ts', 'file2.ts'];
		const todos = [
			{ content: 'test', id: '1', status: 'pending' as const },
		];
		expect(validateTodoCount(files, todos)).toBe(false);
	});

	it('should return true for empty arrays', () => {
		expect(validateTodoCount([], [])).toBe(true);
	});
});

describe('findDuplicateIds', () => {
	it('should return empty array when no duplicates', () => {
		const todos = [
			{ content: 'test', id: '1', status: 'pending' as const },
			{ content: 'test', id: '2', status: 'pending' as const },
		];
		expect(findDuplicateIds(todos)).toEqual([]);
	});

	it('should find duplicate IDs', () => {
		const todos = [
			{ content: 'test', id: '1', status: 'pending' as const },
			{ content: 'test', id: '1', status: 'pending' as const },
			{ content: 'test', id: '2', status: 'pending' as const },
		];
		expect(findDuplicateIds(todos)).toEqual(['1']);
	});

	it('should find multiple duplicate IDs', () => {
		const todos = [
			{ content: 'test', id: '1', status: 'pending' as const },
			{ content: 'test', id: '1', status: 'pending' as const },
			{ content: 'test', id: '2', status: 'pending' as const },
			{ content: 'test', id: '2', status: 'pending' as const },
		];
		const duplicates = findDuplicateIds(todos);
		expect(duplicates).toContain('1');
		expect(duplicates).toContain('2');
		const EXPECTED_DUPLICATE_COUNT = 2;
		expect(duplicates.length).toBe(EXPECTED_DUPLICATE_COUNT);
	});
});

describe('generateRepoTodos', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should generate todos for all files in repository', async () => {
		const mockRepoPath = '/tmp/test-repo';
		const mockEntries = [
			{
				isDirectory: (): boolean => false,
				isFile: (): boolean => true,
				name: 'file1.ts',
			},
			{
				isDirectory: (): boolean => false,
				isFile: (): boolean => true,
				name: 'file2.ts',
			},
			{
				isDirectory: (): boolean => true,
				isFile: (): boolean => false,
				name: 'src',
			},
		];
		const mockSrcEntries = [
			{
				isDirectory: (): boolean => false,
				isFile: (): boolean => true,
				name: 'index.ts',
			},
		];

		vi.mocked(readdir).mockImplementation(
			async (
				dirPath: Readonly<string>,
			): Promise<Awaited<ReturnType<typeof readdir>>> => {
				await Promise.resolve();
				const pathStr = dirPath;

				/**
				 * Normalize paths for comparison - handle both forward and backslashes.
				 * @param p - Path to normalize.
				 * @returns Normalized path string.
				 */
				const normalize = (p: Readonly<string>): string =>
					p.replace(/\/$/, '').replace(/\\/g, '/').toLowerCase();
				const normalizedPath = normalize(pathStr);
				const normalizedRepoPath = normalize(mockRepoPath);
				const normalizedSrcPath = normalize(join(mockRepoPath, 'src'));

				// Match root directory - be flexible with path separators
				if (
					normalizedPath === normalizedRepoPath ||
					pathStr === mockRepoPath ||
					pathStr.replace(/\\/g, '/') ===
						mockRepoPath.replace(/\\/g, '/')
				) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
					return mockEntries as unknown as Awaited<
						ReturnType<typeof readdir>
					>;
				}

				/**
				 * Match src subdirectory - check multiple ways.
				 */
				const srcPathVariants = [
					normalizedSrcPath,
					join(mockRepoPath, 'src'),
					`${mockRepoPath}/src`,
					`${mockRepoPath}\\src`,
				].map(normalize);
				if (
					srcPathVariants.includes(normalizedPath) ||
					normalizedPath.endsWith('/src') ||
					normalizedPath.endsWith('\\src')
				) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
					return mockSrcEntries as unknown as Awaited<
						ReturnType<typeof readdir>
					>;
				}

				return [] as Awaited<ReturnType<typeof readdir>>;
			},
		);

		const todos = await generateRepoTodos({
			excludePaths: [], // Don't exclude anything for this test
			repoPath: mockRepoPath,
		});

		/**
		 * Should find file1.ts, file2.ts, and src/index.ts.
		 * The relative paths should be: file1.ts, file2.ts, src/index.ts.
		 */
		const COUNT_3 = 3;
		const INDEX_ZERO = 0;
		const filePaths = todos.map((t) => t.content.replace('Inspect ', ''));
		expect(filePaths.length).toBe(COUNT_3);
		expect(filePaths).toContain('file1.ts');
		expect(filePaths).toContain('file2.ts');
		expect(filePaths).toContain('src/index.ts');
		expect(todos[INDEX_ZERO]).toHaveProperty('id');
		expect(todos[INDEX_ZERO]).toHaveProperty('status', 'pending');
		expect(todos[INDEX_ZERO]).toHaveProperty('content');
		expect(todos[INDEX_ZERO].content).toContain('Inspect');
	});

	it('should exclude default paths', async () => {
		const mockRepoPath = '/tmp/test-repo';
		const mockEntries = [
			{
				isDirectory: (): boolean => false,
				isFile: (): boolean => true,
				name: 'file1.ts',
			},
			{
				isDirectory: (): boolean => true,
				isFile: (): boolean => false,
				name: 'node_modules',
			},
			{
				isDirectory: (): boolean => true,
				isFile: (): boolean => false,
				name: '.git',
			},
		];

		vi.mocked(readdir).mockImplementation(
			async (
				dirPath: Readonly<string>,
			): Promise<Awaited<ReturnType<typeof readdir>>> => {
				await Promise.resolve();
				if (dirPath === mockRepoPath) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
					return mockEntries as Awaited<ReturnType<typeof readdir>>;
				}
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				return [] as unknown as Awaited<ReturnType<typeof readdir>>;
			},
		);

		const todos = await generateRepoTodos({ repoPath: mockRepoPath });

		/**
		 * Should only include file1.ts, not node_modules or .git.
		 */
		const COUNT_1 = 1;
		const ZERO = 0;
		expect(todos.length).toBe(COUNT_1);
		expect(todos[ZERO].content).toContain('file1.ts');
	});

	it('should use custom exclude paths', async () => {
		const mockRepoPath = '/tmp/test-repo';
		const mockEntries = [
			{
				isDirectory: (): boolean => false,
				isFile: (): boolean => true,
				name: 'file1.ts',
			},
			{
				isDirectory: (): boolean => true,
				isFile: (): boolean => false,
				name: 'custom-exclude',
			},
		];

		vi.mocked(readdir).mockImplementation(
			async (
				dirPath: Readonly<string>,
			): Promise<Awaited<ReturnType<typeof readdir>>> => {
				await Promise.resolve();
				if (dirPath === mockRepoPath) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
					return mockEntries as Awaited<ReturnType<typeof readdir>>;
				}
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				return [] as unknown as Awaited<ReturnType<typeof readdir>>;
			},
		);

		const todos = await generateRepoTodos({
			excludePaths: ['custom-exclude'],
			repoPath: mockRepoPath,
		});

		const SINGLE_TODO_COUNT = 1;
		const INDEX_ZERO = 0;
		expect(todos.length).toBe(SINGLE_TODO_COUNT);
		expect(todos[INDEX_ZERO].content).toContain('file1.ts');
	});

	it('should use custom todo ID prefix', async () => {
		const mockRepoPath = '/tmp/test-repo';
		const mockEntries = [
			{
				isDirectory: (): boolean => false,
				isFile: (): boolean => true,
				name: 'file1.ts',
			},
		];

		vi.mocked(readdir).mockImplementation(
			async (
				dirPath: Readonly<string>,
			): Promise<Awaited<ReturnType<typeof readdir>>> => {
				await Promise.resolve();
				if (dirPath === mockRepoPath) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
					return mockEntries as Awaited<ReturnType<typeof readdir>>;
				}
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				return [] as unknown as Awaited<ReturnType<typeof readdir>>;
			},
		);

		const todos = await generateRepoTodos({
			repoPath: mockRepoPath,
			todoIdPrefix: 'custom-',
		});

		const INDEX_ZERO = 0;
		expect(todos[INDEX_ZERO].id).toMatch(/^custom-/);
	});

	it('should handle empty repository', async () => {
		const mockRepoPath = '/tmp/test-repo';

		vi.mocked(readdir).mockImplementation(
			async (): Promise<Awaited<ReturnType<typeof readdir>>> => {
				await Promise.resolve();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				return [] as unknown as Awaited<ReturnType<typeof readdir>>;
			},
		);

		const todos = await generateRepoTodos({ repoPath: mockRepoPath });

		expect(todos).toEqual([]);
	});

	it('should sort files consistently', async () => {
		const mockRepoPath = '/tmp/test-repo';
		const mockEntries = [
			{
				isDirectory: (): boolean => false,
				isFile: (): boolean => true,
				name: 'z.ts',
			},
			{
				isDirectory: (): boolean => false,
				isFile: (): boolean => true,
				name: 'a.ts',
			},
			{
				isDirectory: (): boolean => false,
				isFile: (): boolean => true,
				name: 'm.ts',
			},
		];

		vi.mocked(readdir).mockImplementation(
			async (
				dirPath: Readonly<string>,
			): Promise<Awaited<ReturnType<typeof readdir>>> => {
				await Promise.resolve();
				if (dirPath === mockRepoPath) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
					return mockEntries as Awaited<ReturnType<typeof readdir>>;
				}
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				return [] as unknown as Awaited<ReturnType<typeof readdir>>;
			},
		);

		const todos = await generateRepoTodos({ repoPath: mockRepoPath });

		const COUNT_3 = 3;
		const INDEX_ONE = 1;
		const INDEX_TWO = 2;
		const INDEX_ZERO = 0;
		expect(todos.length).toBe(COUNT_3);
		// Should be sorted
		expect(todos[INDEX_ZERO].content).toContain('a.ts');
		expect(todos[INDEX_ONE].content).toContain('m.ts');
		expect(todos[INDEX_TWO].content).toContain('z.ts');
	});

	it('should handle trailing slash in repo path', async () => {
		const mockRepoPath = '/tmp/test-repo/';
		const mockEntries = [
			{
				isDirectory: (): boolean => false,
				isFile: (): boolean => true,
				name: 'file1.ts',
			},
		];

		vi.mocked(readdir).mockImplementation(
			async (
				dirPath: Readonly<string>,
			): Promise<Awaited<ReturnType<typeof readdir>>> => {
				await Promise.resolve();
				if (dirPath === '/tmp/test-repo') {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
					return mockEntries as Awaited<ReturnType<typeof readdir>>;
				}
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				return [] as unknown as Awaited<ReturnType<typeof readdir>>;
			},
		);

		const todos = await generateRepoTodos({ repoPath: mockRepoPath });

		const COUNT_1 = 1;
		expect(todos.length).toBe(COUNT_1);
	});

	it('should handle nested directories with exclusions', async () => {
		const mockRepoPath = '/tmp/test-repo';
		const mockEntries = [
			{
				isDirectory: (): boolean => false,
				isFile: (): boolean => true,
				name: 'file1.ts',
			},
			{
				isDirectory: (): boolean => true,
				isFile: (): boolean => false,
				name: 'node_modules',
			},
		];
		const mockNodeModulesEntries = [
			{
				isDirectory: (): boolean => true,
				isFile: (): boolean => false,
				name: 'package',
			},
		];

		vi.mocked(readdir).mockImplementation(
			async (
				dirPath: Readonly<string>,
			): Promise<Awaited<ReturnType<typeof readdir>>> => {
				await Promise.resolve();
				if (dirPath === mockRepoPath) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
					return mockEntries as Awaited<ReturnType<typeof readdir>>;
				}
				if (dirPath === join(mockRepoPath, 'node_modules')) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
					return mockNodeModulesEntries as unknown as Awaited<
						ReturnType<typeof readdir>
					>;
				}
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				return [] as unknown as Awaited<ReturnType<typeof readdir>>;
			},
		);

		const todos = await generateRepoTodos({ repoPath: mockRepoPath });

		/**
		 * Should exclude node_modules and its contents.
		 */
		const SINGLE_TODO_COUNT = 1;
		const INDEX_ZERO = 0;
		expect(todos.length).toBe(SINGLE_TODO_COUNT);
		expect(todos[INDEX_ZERO].content).toContain('file1.ts');
	});
});
