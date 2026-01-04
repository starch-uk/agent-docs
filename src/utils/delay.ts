/**
 * @file Utility for creating delays that can be mocked in tests.
 */

/**
 * Creates a promise that resolves after the specified number of milliseconds.
 * This function can be mocked in tests to use fake timers.
 * @param ms - Number of milliseconds to wait.
 * @returns Promise that resolves after the delay.
 */
export function delay(ms: Readonly<number>): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

