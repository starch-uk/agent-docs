/**
 * @file Tests for CLI entry point conditions.
 * Tests that CLI modules can be imported without executing program.parse().
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('CLI entry points', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should allow importing index.ts without executing program.parse', async () => {
		// Import should not throw and should not execute program.parse
		// We test this by importing and checking the module exports exist
		const indexModule = await import('../../src/cli/index.js');

		expect(indexModule).toHaveProperty('handleSearchCommand');
		expect(indexModule).toHaveProperty('handleGetCommand');
		expect(indexModule).toHaveProperty('handleDumpCommand');
	});

	it('should allow importing repo-todos.ts without executing main', async () => {
		// Import should not throw and should not execute main
		const repoTodosModule = await import('../../src/cli/repo-todos.js');

		expect(repoTodosModule).toHaveProperty('parseArgs');
		expect(repoTodosModule).toHaveProperty('main');
	});
});
