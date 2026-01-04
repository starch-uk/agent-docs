/**
 * @file Vitest configuration for the project.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			exclude: [
				'node_modules/',
				'dist/',
				'tests/',
				'check-coverage.js',
				'**/types.ts',
				// Browser-side code files that run in page.evaluate() cannot be unit tested
				'**/crawler-content-extraction-helpers.ts',
				'**/crawler-content-extraction-processors.ts',
				'**/crawler-content-extraction.ts',
				'**/crawler-content-helpers.ts',
				'**/crawler-content-processors.ts',
				'**/crawler-fallback-extraction.ts',
				'**/crawler-search.ts',
				'**/crawler-page-setup.ts',
				'**/crawler-crawl.ts',
				'**/crawler.ts',
			],
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			thresholds: {
				branches: 100,
				functions: 100,
				lines: 100,
				statements: 100,
			},
		},
		environment: 'node',
		globals: true,
		sequence: {
			concurrent: false,
		},
		setupFiles: ['./tests/setup.ts'],
		testTimeout: 10_000,
	},
});
