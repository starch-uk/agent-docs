/**
 * @file Tests for delay utility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { delay } from '../../src/utils/delay.js';

describe('delay', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should resolve after the specified delay', async () => {
		const delayMs = 1000;
		const delayPromise = delay(delayMs);

		// Fast-forward time
		await vi.runAllTimersAsync();

		// Promise should resolve
		await expect(delayPromise).resolves.toBeUndefined();
	});

	it('should work with different delay values', async () => {
		const delayMs = 500;
		const delayPromise = delay(delayMs);

		// Fast-forward time
		await vi.runAllTimersAsync();

		// Promise should resolve
		await expect(delayPromise).resolves.toBeUndefined();
	});

	it('should work with zero delay', async () => {
		const delayMs = 0;
		const delayPromise = delay(delayMs);

		// Fast-forward time
		await vi.runAllTimersAsync();

		// Promise should resolve
		await expect(delayPromise).resolves.toBeUndefined();
	});
});


