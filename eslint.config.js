import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import sortKeysPlugin from 'eslint-plugin-sort-keys';
import sortClassMembersPlugin from 'eslint-plugin-sort-class-members';
import importPlugin from 'eslint-plugin-import';

// Get all available configs from the plugin
const recommendedConfig = plugin.configs.recommended || {};
const strictConfig = plugin.configs.strict || {};
const stylisticConfig = plugin.configs.stylistic || {};
const recommendedTypeCheckedConfig =
	plugin.configs['recommended-type-checked'] ||
	plugin.configs.recommendedTypeChecked ||
	{};
const strictTypeCheckedConfig =
	plugin.configs['strict-type-checked'] ||
	plugin.configs.strictTypeChecked ||
	{};

// Enable all rules from all configs
const configRules = {
	// Enable all TypeScript ESLint recommended rules
	...(recommendedConfig.rules || {}),
	// Enable all TypeScript ESLint strict rules
	...(strictConfig.rules || {}),
	// Enable all TypeScript ESLint stylistic rules
	...(stylisticConfig.rules || {}),
	// Enable all TypeScript ESLint type-checked rules
	...(recommendedTypeCheckedConfig.rules || {}),
	...(strictTypeCheckedConfig.rules || {}),
};

// Enable all individual rules from the plugin that aren't in configs
// This ensures every rule is enabled, not just those in presets
const allPluginRules = {};
if (plugin.rules) {
	for (const [ruleName, rule] of Object.entries(plugin.rules)) {
		const fullRuleName = `@typescript-eslint/${ruleName}`;
		// Only enable if not already set by a config (configs take precedence)
		if (!(fullRuleName in configRules)) {
			// Enable the rule (use 'error' as default, can be overridden)
			allPluginRules[fullRuleName] = 'error';
		}
	}
}

// Combine all rules
const allRules = {
	// Disable base ESLint rules that conflict with TypeScript versions
	'no-unused-vars': 'off',
	'no-redeclare': 'off',
	'no-undef': 'off',
	// All rules from configs
	...configRules,
	// All individual plugin rules not in configs
	...allPluginRules,
	// Customize specific rules (these override any config defaults)
};

export default [
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
				project: './tsconfig.eslint.json',
			},
		},
		plugins: {
			'@typescript-eslint': plugin,
			jsdoc: jsdocPlugin,
			'sort-keys': sortKeysPlugin,
			'sort-class-members': sortClassMembersPlugin,
			import: importPlugin,
		},
		rules: {
			...allRules,
			// JSDoc rules - all enabled with 'error' severity
			'jsdoc/check-access': 'error',
			'jsdoc/check-alignment': 'error',
			'jsdoc/check-indentation': 'error',
			'jsdoc/check-line-alignment': 'error',
			'jsdoc/check-param-names': 'error',
			'jsdoc/check-property-names': 'error',
			'jsdoc/check-syntax': 'error',
			'jsdoc/check-tag-names': 'error',
			'jsdoc/check-template-names': 'error',
			'jsdoc/check-types': 'error',
			'jsdoc/check-values': 'error',
			'jsdoc/convert-to-jsdoc-comments': 'error',
			'jsdoc/empty-tags': 'error',
			'jsdoc/escape-inline-tags': 'error',
			'jsdoc/implements-on-classes': 'error',
			'jsdoc/imports-as-dependencies': 'error',
			'jsdoc/informative-docs': 'error',
			'jsdoc/lines-before-block': 'error',
			'jsdoc/match-description': 'error',
			'jsdoc/match-name': 'off',
			'jsdoc/multiline-blocks': 'error',
			'jsdoc/no-bad-blocks': 'error',
			'jsdoc/no-blank-block-descriptions': 'error',
			'jsdoc/no-defaults': 'error',
			'jsdoc/no-missing-syntax': 'off',
			'jsdoc/no-multi-asterisks': 'error',
			'jsdoc/no-restricted-syntax': 'off',
			'jsdoc/no-types': 'error',
			'jsdoc/no-undefined-types': 'error',
			'jsdoc/reject-any-type': 'error',
			'jsdoc/reject-function-type': 'error',
			'jsdoc/require-asterisk-prefix': 'error',
			'jsdoc/require-description': 'error',
			'jsdoc/require-description-complete-sentence': 'error',
			'jsdoc/require-example': 'off',
			'jsdoc/require-file-overview': 'error',
			'jsdoc/require-hyphen-before-param-description': 'error',
			'jsdoc/require-jsdoc': 'error',
			'jsdoc/require-next-description': 'error',
			'jsdoc/require-next-type': 'error',
			'jsdoc/require-param-description': 'error',
			'jsdoc/require-param-name': 'error',
			'jsdoc/require-param-type': 'off',
			'jsdoc/require-param': 'error',
			'jsdoc/require-property-description': 'error',
			'jsdoc/require-property-name': 'error',
			'jsdoc/require-property-type': 'error',
			'jsdoc/require-property': 'error',
			'jsdoc/require-rejects': 'off',
			'jsdoc/require-returns-check': 'error',
			'jsdoc/require-returns-description': 'error',
			'jsdoc/require-returns-type': 'off',
			'jsdoc/require-returns': 'error',
			'jsdoc/require-template': 'error',
			'jsdoc/require-template-description': 'error',
			'jsdoc/require-throws': 'error',
			'jsdoc/require-throws-description': 'error',
			'jsdoc/require-throws-type': 'error',
			'jsdoc/require-yields-check': 'error',
			'jsdoc/require-yields-description': 'error',
			'jsdoc/require-yields-type': 'error',
			'jsdoc/require-yields': 'error',
			'jsdoc/sort-tags': 'error',
			'jsdoc/tag-lines': 'error',
			'jsdoc/text-escaping': 'off',
			'jsdoc/ts-method-signature-style': 'error',
			'jsdoc/ts-prefer-function-type': 'error',
			'jsdoc/ts-no-unnecessary-template-expression': 'error',
			'jsdoc/type-formatting': 'error',
			'jsdoc/valid-types': 'error',
			// Sorting rules - all enabled with 'error' severity
			'sort-keys/sort-keys-fix': 'error',
			'sort-class-members/sort-class-members': 'error',
			'import/order': 'error',
			'import/newline-after-import': 'error',
			'import/group-exports': 'error',
			// TypeScript ESLint sorting rules (already enabled via allRules, but listed here for clarity)
			'@typescript-eslint/sort-type-constituents': 'error',
			'@typescript-eslint/member-ordering': 'error',
		},
	},
	{
		ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
	},
];
