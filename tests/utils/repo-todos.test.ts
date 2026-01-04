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
		expect(pathToTodoId('src/utils/helper.ts')).toBe('file-src-utils-helper-ts');
	});

	it('should handle special characters in path', () => {
		expect(pathToTodoId('src/test-file.ts')).toBe('file-src-test-file-ts');
		// Underscores are replaced with hyphens (non-alphanumeric except hyphens)
		expect(pathToTodoId('src/test_file.ts')).toBe('file-src-test-file-ts');
		expect(pathToTodoId('src/test@file.ts')).toBe('file-src-test-file-ts');
	});

	it('should use custom prefix', () => {
		expect(pathToTodoId('src/index.ts', 'custom-')).toBe('custom-src-index-ts');
	});

	it('should handle paths with multiple separators', () => {
		expect(pathToTodoId('src/utils/helper.ts')).toBe('file-src-utils-helper-ts');
	});

	it('should remove leading and trailing hyphens', () => {
		expect(pathToTodoId('-test-')).toBe('file-test');
	});
});

describe('validateTodoCount', () => {
	it('should return true when counts match', () => {
		const files = ['file1.ts', 'file2.ts'];
		const todos = [
			{ id: '1', status: 'pending' as const, content: 'test' },
			{ id: '2', status: 'pending' as const, content: 'test' },
		];
		expect(validateTodoCount(files, todos)).toBe(true);
	});

	it('should return false when counts do not match', () => {
		const files = ['file1.ts', 'file2.ts'];
		const todos = [{ id: '1', status: 'pending' as const, content: 'test' }];
		expect(validateTodoCount(files, todos)).toBe(false);
	});

	it('should return true for empty arrays', () => {
		expect(validateTodoCount([], [])).toBe(true);
	});
});

describe('findDuplicateIds', () => {
	it('should return empty array when no duplicates', () => {
		const todos = [
			{ id: '1', status: 'pending' as const, content: 'test' },
			{ id: '2', status: 'pending' as const, content: 'test' },
		];
		expect(findDuplicateIds(todos)).toEqual([]);
	});

	it('should find duplicate IDs', () => {
		const todos = [
			{ id: '1', status: 'pending' as const, content: 'test' },
			{ id: '1', status: 'pending' as const, content: 'test' },
			{ id: '2', status: 'pending' as const, content: 'test' },
		];
		expect(findDuplicateIds(todos)).toEqual(['1']);
	});

	it('should find multiple duplicate IDs', () => {
		const todos = [
			{ id: '1', status: 'pending' as const, content: 'test' },
			{ id: '1', status: 'pending' as const, content: 'test' },
			{ id: '2', status: 'pending' as const, content: 'test' },
			{ id: '2', status: 'pending' as const, content: 'test' },
		];
		const duplicates = findDuplicateIds(todos);
		expect(duplicates).toContain('1');
		expect(duplicates).toContain('2');
		expect(duplicates.length).toBe(2);
	});
});

describe('generateRepoTodos', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should generate todos for all files in repository', async () => {
		const mockRepoPath = '/tmp/test-repo';
		const mockEntries = [
			{ name: 'file1.ts', isFile: () => true, isDirectory: () => false },
			{ name: 'file2.ts', isFile: () => true, isDirectory: () => false },
			{ name: 'src', isFile: () => false, isDirectory: () => true },
		];
		const mockSrcEntries = [
			{ name: 'index.ts', isFile: () => true, isDirectory: () => false },
		];

		vi.mocked(readdir).mockImplementation(async (dirPath: string, options?: { withFileTypes?: boolean }) => {
			const pathStr = String(dirPath);
			// Normalize paths for comparison - handle both forward and backslashes
			const normalize = (p: string) => p.replace(/\/$/, '').replace(/\\/g, '/').toLowerCase();
			const normalizedPath = normalize(pathStr);
			const normalizedRepoPath = normalize(mockRepoPath);
			const normalizedSrcPath = normalize(join(mockRepoPath, 'src'));
			
			// Match root directory - be flexible with path separators
			if (normalizedPath === normalizedRepoPath || pathStr === mockRepoPath || pathStr.replace(/\\/g, '/') === mockRepoPath.replace(/\\/g, '/')) {
				return mockEntries as unknown as Awaited<ReturnType<typeof readdir>>;
			}
			// Match src subdirectory - check multiple ways
			const srcPathVariants = [
				normalizedSrcPath,
				join(mockRepoPath, 'src'),
				`${mockRepoPath}/src`,
				`${mockRepoPath}\\src`,
			].map(normalize);
			if (srcPathVariants.includes(normalizedPath) || normalizedPath.endsWith('/src') || normalizedPath.endsWith('\\src')) {
				return mockSrcEntries as unknown as Awaited<ReturnType<typeof readdir>>;
			}
			return [] as unknown as Awaited<ReturnType<typeof readdir>>;
		});

		const todos = await generateRepoTodos({ 
			repoPath: mockRepoPath,
			excludePaths: [] // Don't exclude anything for this test
		});

		// Should find file1.ts, file2.ts, and src/index.ts
		// The relative paths should be: file1.ts, file2.ts, src/index.ts
		const filePaths = todos.map(t => t.content.replace('Inspect ', ''));
		expect(filePaths.length).toBe(3);
		expect(filePaths).toContain('file1.ts');
		expect(filePaths).toContain('file2.ts');
		expect(filePaths).toContain('src/index.ts');
		expect(todos[0]).toHaveProperty('id');
		expect(todos[0]).toHaveProperty('status', 'pending');
		expect(todos[0]).toHaveProperty('content');
		expect(todos[0].content).toContain('Inspect');
	});

	it('should exclude default paths', async () => {
		const mockRepoPath = '/tmp/test-repo';
		const mockEntries = [
			{ name: 'file1.ts', isFile: () => true, isDirectory: () => false },
			{ name: 'node_modules', isFile: () => false, isDirectory: () => true },
			{ name: '.git', isFile: () => false, isDirectory: () => true },
		];

		vi.mocked(readdir).mockImplementation(async (dirPath: string) => {
			if (dirPath === mockRepoPath) {
				return mockEntries as unknown as Awaited<ReturnType<typeof readdir>>;
			}
			return [] as unknown as Awaited<ReturnType<typeof readdir>>;
		});

		const todos = await generateRepoTodos({ repoPath: mockRepoPath });

		// Should only include file1.ts, not node_modules or .git
		expect(todos.length).toBe(1);
		expect(todos[0].content).toContain('file1.ts');
	});

	it('should use custom exclude paths', async () => {
		const mockRepoPath = '/tmp/test-repo';
		const mockEntries = [
			{ name: 'file1.ts', isFile: () => true, isDirectory: () => false },
			{ name: 'custom-exclude', isFile: () => false, isDirectory: () => true },
		];

		vi.mocked(readdir).mockImplementation(async (dirPath: string) => {
			if (dirPath === mockRepoPath) {
				return mockEntries as unknown as Awaited<ReturnType<typeof readdir>>;
			}
			return [] as unknown as Awaited<ReturnType<typeof readdir>>;
		});

		const todos = await generateRepoTodos({
			repoPath: mockRepoPath,
			excludePaths: ['custom-exclude'],
		});

		expect(todos.length).toBe(1);
		expect(todos[0].content).toContain('file1.ts');
	});

	it('should use custom todo ID prefix', async () => {
		const mockRepoPath = '/tmp/test-repo';
		const mockEntries = [
			{ name: 'file1.ts', isFile: () => true, isDirectory: () => false },
		];

		vi.mocked(readdir).mockImplementation(async (dirPath: string) => {
			if (dirPath === mockRepoPath) {
				return mockEntries as unknown as Awaited<ReturnType<typeof readdir>>;
			}
			return [] as unknown as Awaited<ReturnType<typeof readdir>>;
		});

		const todos = await generateRepoTodos({
			repoPath: mockRepoPath,
			todoIdPrefix: 'custom-',
		});

		expect(todos[0].id).toMatch(/^custom-/);
	});

	it('should handle empty repository', async () => {
		const mockRepoPath = '/tmp/test-repo';

		vi.mocked(readdir).mockImplementation(async () => {
			return [] as unknown as Awaited<ReturnType<typeof readdir>>;
		});

		const todos = await generateRepoTodos({ repoPath: mockRepoPath });

		expect(todos).toEqual([]);
	});

	it('should sort files consistently', async () => {
		const mockRepoPath = '/tmp/test-repo';
		const mockEntries = [
			{ name: 'z.ts', isFile: () => true, isDirectory: () => false },
			{ name: 'a.ts', isFile: () => true, isDirectory: () => false },
			{ name: 'm.ts', isFile: () => true, isDirectory: () => false },
		];

		vi.mocked(readdir).mockImplementation(async (dirPath: string) => {
			if (dirPath === mockRepoPath) {
				return mockEntries as unknown as Awaited<ReturnType<typeof readdir>>;
			}
			return [] as unknown as Awaited<ReturnType<typeof readdir>>;
		});

		const todos = await generateRepoTodos({ repoPath: mockRepoPath });

		expect(todos.length).toBe(3);
		// Should be sorted
		expect(todos[0].content).toContain('a.ts');
		expect(todos[1].content).toContain('m.ts');
		expect(todos[2].content).toContain('z.ts');
	});

	it('should handle trailing slash in repo path', async () => {
		const mockRepoPath = '/tmp/test-repo/';
		const mockEntries = [
			{ name: 'file1.ts', isFile: () => true, isDirectory: () => false },
		];

		vi.mocked(readdir).mockImplementation(async (dirPath: string) => {
			if (dirPath === '/tmp/test-repo') {
				return mockEntries as unknown as Awaited<ReturnType<typeof readdir>>;
			}
			return [] as unknown as Awaited<ReturnType<typeof readdir>>;
		});

		const todos = await generateRepoTodos({ repoPath: mockRepoPath });

		expect(todos.length).toBe(1);
	});

	it('should handle nested directories with exclusions', async () => {
		const mockRepoPath = '/tmp/test-repo';
		const mockEntries = [
			{ name: 'file1.ts', isFile: () => true, isDirectory: () => false },
			{ name: 'node_modules', isFile: () => false, isDirectory: () => true },
		];
		const mockNodeModulesEntries = [
			{ name: 'package', isFile: () => false, isDirectory: () => true },
		];

		vi.mocked(readdir).mockImplementation(async (dirPath: string) => {
			if (dirPath === mockRepoPath) {
				return mockEntries as unknown as Awaited<ReturnType<typeof readdir>>;
			}
			if (dirPath === join(mockRepoPath, 'node_modules')) {
				return mockNodeModulesEntries as unknown as Awaited<ReturnType<typeof readdir>>;
			}
			return [] as unknown as Awaited<ReturnType<typeof readdir>>;
		});

		const todos = await generateRepoTodos({ repoPath: mockRepoPath });

		// Should exclude node_modules and its contents
		expect(todos.length).toBe(1);
		expect(todos[0].content).toContain('file1.ts');
	});
});

