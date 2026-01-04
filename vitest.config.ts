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
				'tests/'
			],
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			thresholds: {
				branches: 100,
				functions: 100,
				lines: 100,
				statements: 100,
				// Browser-side code in crawler files cannot be unit tested
				'**/crawler-search.ts': {
					branches: 90,
					functions: 100,
					lines: 43,
					statements: 43,
				},
				'**/crawler-crawl.ts': {
					branches: 86,
					functions: 75,
					lines: 30,
					statements: 30,
				},
			},
		},
		environment: 'node',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
		testTimeout: 10_000,
		sequence: {
			concurrent: false,
		},
	},
});
