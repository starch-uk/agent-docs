/**
 * @file Tests for CLI entry point execution.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isMainEntryPoint, executeIfMainEntryPoint, program } from '../../src/cli/index.js';

describe('CLI entry point', () => {
	const originalArgv = process.argv;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		process.argv = originalArgv;
	});

	it('should return true when process.argv includes index.ts', () => {
		process.argv = ['node', '/path/to/index.ts', 'search', 'test'];
		expect(isMainEntryPoint()).toBe(true);
	});

	it('should return true when process.argv includes sf-docs-helper', () => {
		process.argv = ['node', '/path/to/sf-docs-helper', 'search', 'test'];
		expect(isMainEntryPoint()).toBe(true);
	});

	it('should return false when process.argv does not match entry point conditions', () => {
		process.argv = ['node', '/path/to/other-script.js'];
		expect(isMainEntryPoint()).toBe(false);
	});

	it('should call executeIfMainEntryPoint without errors', () => {
		process.argv = ['node', '/path/to/index.ts'];
		const parseSpy = vi.spyOn(program, 'parse').mockImplementation(() => {
			// Mock implementation to avoid actual parsing
		});
		
		// Test that the function can be called (entry point execution happens at module load)
		// The actual execution is tested via the isMainEntryPoint() tests
		expect(() => executeIfMainEntryPoint()).not.toThrow();
		
		parseSpy.mockRestore();
	});
});

