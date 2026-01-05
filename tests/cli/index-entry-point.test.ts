/**
 * @file Tests for CLI entry point execution.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	isMainEntryPoint,
	executeIfMainEntryPoint,
	program,
} from '../../src/cli/index.js';

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

	it('should return true when process.argv includes index.ts (fallback condition)', () => {
		// Force the first condition to be false by using a value that won't match import.meta.url.endsWith()
		// but contains 'index.ts', ensuring line 164 is evaluated
		// The first condition checks if import.meta.url.endsWith(process.argv[1])
		// import.meta.url will be something like 'file:///.../src/cli/index.ts'
		// So we need a value that contains 'index.ts' but doesn't match the end of import.meta.url
		// Use a path that definitely won't be at the end: add a suffix
		process.argv = [
			'node',
			'/absolutely/different/path/index.ts',
			'search',
			'test',
		];
		const result = isMainEntryPoint();
		expect(result).toBe(true);
		process.argv = originalArgv;
	});

	it('should return true when process.argv includes sf-docs-helper', () => {
		process.argv = ['node', '/path/to/sf-docs-helper', 'search', 'test'];
		expect(isMainEntryPoint()).toBe(true);
	});

	it('should return true when process.argv includes sf-docs-helper (fallback condition)', () => {
		// Force the first two conditions to be false, ensuring line 165 is evaluated
		// First condition: use a path that won't match import.meta.url.endsWith()
		// Second condition: use a path that doesn't contain 'index.ts'
		// Third condition: use a path that contains 'sf-docs-helper'
		process.argv = [
			'node',
			'/absolutely/different/path/sf-docs-helper',
			'search',
			'test',
		];
		const result = isMainEntryPoint();
		expect(result).toBe(true);
		process.argv = originalArgv;
	});

	it('should handle undefined process.argv[1] for nullish coalescing coverage', () => {
		// Test the ?? false branches when process.argv[1] is undefined
		process.argv = ['node']; // Only one element, so process.argv[1] is undefined
		const result = isMainEntryPoint();
		expect(result).toBe(false);
		process.argv = originalArgv;
	});

	it('should return false when process.argv does not match entry point conditions', () => {
		process.argv = ['node', '/path/to/other-script.js'];
		expect(isMainEntryPoint()).toBe(false);
	});

	it('should call executeIfMainEntryPoint without errors', () => {
		process.argv = ['node', '/path/to/index.ts'];
		const parseSpy = vi.spyOn(program, 'parse').mockImplementation(() => {
			// Mock implementation to avoid actual parsing
			return undefined;
		});

		// Test that the function can be called (entry point execution happens at module load)
		// The actual execution is tested via the isMainEntryPoint() tests
		expect(() => {
			executeIfMainEntryPoint();
		}).not.toThrow();

		parseSpy.mockRestore();
	});
});
