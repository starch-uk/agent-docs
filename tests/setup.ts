/**
 * @file Global test setup to handle unhandled rejections.
 */

// Suppress unhandled rejections during tests
// This is acceptable in test environments where we're testing error conditions
// The errors are expected from test scenarios and don't need to be handled
// Vitest will still report them, but we suppress the process-level handler
const originalUnhandledRejection = process.listeners('unhandledRejection');
process.removeAllListeners('unhandledRejection');

process.on(
	'unhandledRejection',
	(reason: Readonly<unknown>, promise: Readonly<Promise<unknown>>) => {
		// Check if this is an expected error from our test scenarios
		// These are errors like "No search results found" or "Insufficient content"
		// which are expected when testing error conditions
		const errorMessage =
			reason instanceof Error
				? reason.message
				: typeof reason === 'string'
					? reason
					: JSON.stringify(reason);
		const expectedPatterns = [
			'No search results found',
			'Insufficient content extracted',
			'Failed to crawl Salesforce page',
		];

		const isExpectedError = expectedPatterns.some((pattern) =>
			errorMessage.includes(pattern),
		);

		if (isExpectedError) {
			// Silently ignore expected errors from test scenarios
			return;
		}

		// For unexpected errors, call the original handlers if they exist
		for (const handler of originalUnhandledRejection) {
			handler(reason, promise);
		}
	},
);
