# ESLint Plugin JSDoc Reference

**Version:** 1.0.0

> **Purpose**: JSDoc linting rules for ESLint. Validates syntax, types, params,
> returns, completeness. **Node**: >=20.11.0 | **ESLint**: ^7.0.0 | ^8.0.0 |
> ^9.0.0

---

## Installation

```bash
npm install --save-dev eslint-plugin-jsdoc
```

---

## Configuration

### Flat Config (ESLint v9) — Procedural (Recommended)

```javascript
import { jsdoc } from 'eslint-plugin-jsdoc';

export default [
	jsdoc({
		config: 'flat/recommended',
		rules: {
			'jsdoc/require-description': 'warn',
		},
		// Uncomment this if you wish your `settings` to overwrite the config's own settings;
		//   otherwise, the default behavior is to merge recursively
		// mergeSettings: false,
		settings: {
			// No `jsdoc` child object needed here
			structuredTags: {
				see: { name: 'namepath-referencing', required: ['name'] },
			},
		},
	}),
];
```

A `plugins` property can also be supplied to merge with the resulting `jsdoc`
plugin. Other config properties such as `files`, `ignores`, etc. are also copied
over, though noting that if the specified config produces an array, they will
not currently function.

### Flat Config — Declarative

```javascript
import jsdoc from 'eslint-plugin-jsdoc';

export default [
	jsdoc.configs['flat/recommended'],
	{
		files: ['**/*.js'],
		plugins: { jsdoc },
		rules: { 'jsdoc/require-description': 'warn' },
	},
];
```

### Legacy eslintrc

```javascript
module.exports = {
	plugins: ['jsdoc'],
	extends: ['plugin:jsdoc/recommended'],
	rules: { 'jsdoc/require-description': 'error' },
};
```

---

## Presets

### Flat Config Presets

| Preset                                     | Description                                                     |
| ------------------------------------------ | --------------------------------------------------------------- |
| `flat/recommended`                         | Recommended rules (warnings)                                    |
| `flat/recommended-error`                   | Recommended rules (errors)                                      |
| `flat/recommended-typescript`              | TypeScript-aware (warnings)                                     |
| `flat/recommended-typescript-error`        | TypeScript-aware (errors)                                       |
| `flat/recommended-typescript-flavor`       | JS with TS JSDoc flavor (warnings)                              |
| `flat/recommended-typescript-flavor-error` | JS with TS JSDoc flavor (errors)                                |
| `flat/recommended-mixed`                   | TS-flavor for `.js/.jsx/.cjs/.mjs`, TS for `.ts/.tsx/.cts/.mts` |

### Granular Presets (TypeScript-only)

| Category         | Presets                                                                               | Description           |
| ---------------- | ------------------------------------------------------------------------------------- | --------------------- |
| **Contents**     | `flat/contents-typescript[-error]`, `flat/contents-typescript-flavor[-error]`         | Names & descriptions  |
| **Logical**      | `flat/logical-typescript[-error]`, `flat/logical-typescript-flavor[-error]`           | Proper tag values     |
| **Requirements** | `flat/requirements-typescript[-error]`, `flat/requirements-typescript-flavor[-error]` | Tags exist/have types |
| **Stylistic**    | `flat/stylistic-typescript[-error]`, `flat/stylistic-typescript-flavor[-error]`       | Consistent formatting |

**Excluded from granular configs:**

| Category    | Rule                                    | Reason                  |
| ----------- | --------------------------------------- | ----------------------- |
| `required`  | `require-throws`                        | Can't enforce all cases |
|             | `require-file-overview`                 | Too demanding           |
|             | `convert-to-jsdoc-comments`             | Overly aggressive       |
| `logical`   | `no-missing-syntax`                     | No default options      |
|             | `no-restricted-syntax`                  | No default options      |
| `contents`  | `match-name`                            | No default options      |
|             | `require-description`                   | Too demanding           |
|             | `require-description-complete-sentence` | Too demanding           |
| `stylistic` | `check-indentation`                     | May not be desired      |
|             | `sort-tags`                             | Too project-specific    |

### eslintrc Presets

| Preset                                             | Description                        |
| -------------------------------------------------- | ---------------------------------- |
| `plugin:jsdoc/recommended`                         | Recommended (warnings)             |
| `plugin:jsdoc/recommended-error`                   | Recommended (errors)               |
| `plugin:jsdoc/recommended-typescript`              | TypeScript-aware (warnings)        |
| `plugin:jsdoc/recommended-typescript-error`        | TypeScript-aware (errors)          |
| `plugin:jsdoc/recommended-typescript-flavor`       | JS with TS JSDoc flavor (warnings) |
| `plugin:jsdoc/recommended-typescript-flavor-error` | JS with TS JSDoc flavor (errors)   |

---

## Settings

| Setting                       | Type    | Default        | Description                                            |
| ----------------------------- | ------- | -------------- | ------------------------------------------------------ |
| `mode`                        | string  | `'typescript'` | `'typescript'`, `'closure'`, `'jsdoc'`, `'permissive'` |
| `tagNamePreference`           | object  | `{}`           | Tag name aliases                                       |
| `preferredTypes`              | object  | `{}`           | Type replacements for `check-types`                    |
| `structuredTags`              | object  | `{}`           | Tag structure requirements                             |
| `contexts`                    | array   | `[]`           | Default contexts for rules                             |
| `maxLines`                    | number  | `1`            | Max lines before JSDoc block                           |
| `minLines`                    | number  | `0`            | Min lines before JSDoc block                           |
| `ignorePrivate`               | boolean | `false`        | Skip `@private` blocks                                 |
| `ignoreInternal`              | boolean | `false`        | Skip `@internal` blocks                                |
| `ignoreReplacesDocs`          | boolean | `true`         | `@ignore` exempts from require rules                   |
| `overrideReplacesDocs`        | boolean | `true`         | `@override` exempts from require rules                 |
| `augmentsExtendsReplacesDocs` | boolean | `false`        | `@augments`/`@extends` exempts                         |
| `implementsReplacesDocs`      | boolean | `false`        | `@implements` exempts                                  |

### Default Tag Aliases

| Preferred      | Aliases                      |
| -------------- | ---------------------------- |
| `@abstract`    | `@virtual`                   |
| `@augments`    | `@extends`                   |
| `@class`       | `@constructor`               |
| `@constant`    | `@const`                     |
| `@default`     | `@defaultvalue`              |
| `@description` | `@desc`                      |
| `@external`    | `@host`                      |
| `@file`        | `@fileoverview`, `@overview` |
| `@fires`       | `@emits`                     |
| `@function`    | `@func`, `@method`           |
| `@member`      | `@var`                       |
| `@param`       | `@arg`, `@argument`          |
| `@property`    | `@prop`                      |
| `@returns`     | `@return`                    |
| `@throws`      | `@exception`                 |
| `@yields`      | `@yield`                     |

---

## Processors

Lint JavaScript inside `@example` and default value tags.

### Basic Setup

```javascript
import { getJsdocProcessorPlugin } from 'eslint-plugin-jsdoc';

export default [
	{
		files: ['**/*.js'],
		plugins: {
			examples: getJsdocProcessorPlugin({
				// checkDefaults: true,
				// checkParams: true,
				// checkProperties: true
			}),
		},
		processor: 'examples/examples',
	},
	{
		files: ['**/*.md/*.js'], // Target @example blocks
		rules: {
			/* rules for examples */
		},
	},
	{
		files: [
			'**/*.jsdoc-defaults',
			'**/*.jsdoc-params',
			'**/*.jsdoc-properties',
		],
		rules: {
			/* rules for defaults */
		},
	},
];
```

### Built-in Configs

```javascript
import jsdoc from 'eslint-plugin-jsdoc';

export default [
	...jsdoc.configs.examples,
	// ...jsdoc.configs['default-expressions'],
	// ...jsdoc.configs['examples-and-default-expressions'],
];
```

### TypeScript Usage

```javascript
import { getJsdocProcessorPlugin } from 'eslint-plugin-jsdoc';
import ts, { parser as typescriptEslintParser } from 'typescript-eslint';

export default [
	{
		files: ['**/*.ts'],
		languageOptions: { parser: typescriptEslintParser },
		plugins: {
			examples: getJsdocProcessorPlugin({
				parser: typescriptEslintParser,
				matchingFileName: 'dummy.md/*.ts',
			}),
		},
		processor: 'examples/examples',
	},
	...ts.configs.recommended,
	{
		files: ['**/*.md/*.ts'],
		languageOptions: { parser: typescriptEslintParser },
		rules: {
			'no-extra-semi': 'error',
			...ts.configs.disableTypeChecked.rules, // Required due to issue #1377
		},
	},
];
```

### Processor Options

| Option                       | Type           | Default                                 | Description                             |
| ---------------------------- | -------------- | --------------------------------------- | --------------------------------------- |
| `checkDefaults`              | boolean        | `false`                                 | Check `@default` tags                   |
| `checkExamples`              | boolean        | `true`                                  | Check `@example` tags                   |
| `checkParams`                | boolean        | `false`                                 | Check `@param [name=default]`           |
| `checkProperties`            | boolean        | `false`                                 | Check `@property [name=default]`        |
| `captionRequired`            | boolean        | `false`                                 | Require `<caption>` for `@example`      |
| `paddedIndent`               | number         | `0`                                     | Spaces to strip from lines              |
| `matchingFileName`           | string         | `null`                                  | File pattern for `@example`             |
| `matchingFileNameDefaults`   | string         | `null`                                  | File pattern for `@default`             |
| `matchingFileNameParams`     | string         | `null`                                  | File pattern for `@param`               |
| `matchingFileNameProperties` | string         | `null`                                  | File pattern for `@property`            |
| `exampleCodeRegex`           | string/RegExp  | `null`                                  | Match example code                      |
| `rejectExampleCodeRegex`     | string/RegExp  | `null`                                  | Reject example code                     |
| `allowedLanguagesToProcess`  | string[]/false | `['js','ts','javascript','typescript']` | Fenced block languages                  |
| `sourceType`                 | string         | `'module'`                              | `'script'` or `'module'`                |
| `parser`                     | Parser         | `undefined`                             | Custom parser (e.g., typescript-eslint) |

---

## Rules

**Legend**: ✓ = Recommended | 🔧 = Fixable | TS = TypeScript behavior

|  ✓   | 🔧  | Rule                                      | Description                                            |
| :--: | :-: | ----------------------------------------- | ------------------------------------------------------ |
|  ✓   |     | `check-access`                            | Valid `@access` values; no mixing/duplicates           |
|  ✓   | 🔧  | `check-alignment`                         | Valid JSDoc asterisk alignment                         |
|      |     | `check-examples`                          | @deprecated (ESLint 7 only); use processor             |
|      |     | `check-indentation`                       | Valid padding inside blocks                            |
|      | 🔧  | `check-line-alignment`                    | Align tag/type/name/description                        |
|  ✓   | 🔧  | `check-param-names`                       | Params match function declaration                      |
|  ✓   | 🔧  | `check-property-names`                    | No duplicate/invalid properties                        |
|      |     | `check-syntax`                            | Reports syntax invalid for mode                        |
|  ✓   | 🔧  | `check-tag-names`                         | Valid block tag names                                  |
|      |     | `check-template-names`                    | `@template` names are used                             |
|  ✓   | 🔧  | `check-types`                             | Reports invalid types                                  |
|  ✓   |     | `check-values`                            | Valid `@version`/`@since`/`@license`/`@author`/`@kind` |
|      | 🔧  | `convert-to-jsdoc-comments`               | Convert non-JSDoc to JSDoc                             |
|  ✓   | 🔧  | `empty-tags`                              | Tags expected empty have no content                    |
|  ✓   | 🔧  | `escape-inline-tags`                      | JSDoc tags in correct positions                        |
|  ✓   |     | `implements-on-classes`                   | `@implements` only on classes                          |
|      |     | `imports-as-dependencies`                 | `import()` in deps/devDeps                             |
|      |     | `informative-docs`                        | No restating attached name                             |
|      | 🔧  | `lines-before-block`                      | Min newlines before JSDoc                              |
|      |     | `match-description`                       | Description matches regex                              |
|      | 🔧  | `match-name`                              | Name matches/doesn't match regex                       |
|  ✓   | 🔧  | `multiline-blocks`                        | Single/multi-line block control                        |
|      | 🔧  | `no-bad-blocks`                           | Multi-line comments must be JSDoc                      |
|      | 🔧  | `no-blank-block-descriptions`             | No empty lines in descriptions                         |
|      | 🔧  | `no-blank-blocks`                         | No empty JSDoc blocks                                  |
|  ✓   | 🔧  | `no-defaults`                             | No defaults on `@param`/`@default`                     |
|      |     | `no-missing-syntax`                       | Require certain structures                             |
|  ✓   | 🔧  | `no-multi-asterisks`                      | No multiple asterisks at line start                    |
|      |     | `no-restricted-syntax`                    | Forbid certain structures                              |
|  TS  | 🔧  | `no-types`                                | No types on `@param`/`@returns` (TS redundant)         |
| ✓\*  |     | `no-undefined-types`                      | All types must be defined                              |
|      | 🔧  | `prefer-import-tag`                       | Prefer `@import` over inline `import()`                |
|  ✓   |     | `reject-any-type`                         | No `any` or `*` type                                   |
|  ✓   |     | `reject-function-type`                    | No `Function` type                                     |
|      | 🔧  | `require-asterisk-prefix`                 | Lines start with `*`                                   |
|      |     | `require-description`                     | Functions have descriptions                            |
|      | 🔧  | `require-description-complete-sentence`   | Complete sentences                                     |
|      | 🔧  | `require-example`                         | Functions have examples                                |
|      |     | `require-file-overview`                   | Files have `@file`/`@fileoverview`                     |
|      | 🔧  | `require-hyphen-before-param-description` | Hyphen before param desc                               |
|  ✓   | 🔧  | `require-jsdoc`                           | JSDoc present on functions                             |
|      |     | `require-next-description`                | `@next` has description                                |
|  ✓   |     | `require-next-type`                       | `@next` has type                                       |
|  ✓   | 🔧  | `require-param`                           | All params documented                                  |
|  ✓   | 🔧  | `require-param-description`               | `@param` has description                               |
|  ✓   |     | `require-param-name`                      | `@param` has name                                      |
| TS\* | 🔧  | `require-param-type`                      | `@param` has type                                      |
|  ✓   | 🔧  | `require-property`                        | `@typedef`/`@namespace` have properties                |
|  ✓   |     | `require-property-description`            | `@property` has description                            |
|  ✓   |     | `require-property-name`                   | `@property` has name                                   |
| TS\* |     | `require-property-type`                   | `@property` has type                                   |
|      |     | `require-rejects`                         | Promise rejections documented                          |
|  ✓   | 🔧  | `require-returns`                         | Returns documented                                     |
|  ✓   |     | `require-returns-check`                   | Return statement matches `@returns`                    |
|  ✓   |     | `require-returns-description`             | `@returns` has description                             |
| TS\* |     | `require-returns-type`                    | `@returns` has type                                    |
|      |     | `require-tags`                            | Specific tags present                                  |
|      |     | `require-template`                        | `@template` for type params                            |
|      |     | `require-template-description`            | `@template` has description                            |
|      |     | `require-throws`                          | Throws documented                                      |
|      |     | `require-throws-description`              | `@throws` has description                              |
|  ✓   |     | `require-throws-type`                     | `@throws` has type                                     |
|  ✓   |     | `require-yields`                          | Yields documented                                      |
|  ✓   |     | `require-yields-check`                    | Yield statement matches `@yields`                      |
|      |     | `require-yields-description`              | `@yields` has description                              |
|  ✓   |     | `require-yields-type`                     | `@yields` has type                                     |
|      | 🔧  | `sort-tags`                               | Sort tags by sequence                                  |
|  ✓   | 🔧  | `tag-lines`                               | Lines before/after/between tags                        |
|      | 🔧  | `text-escaping`                           | Auto-escape characters                                 |
|      | 🔧  | `ts-method-signature-style`               | Prefer function props or method sigs                   |
|  ✓   |     | `ts-no-empty-object-type`                 | No empty object type                                   |
|      | 🔧  | `ts-no-unnecessary-template-expression`   | No unnecessary template expressions                    |
|      | 🔧  | `ts-prefer-function-type`                 | Prefer function types over call sigs                   |
|      | 🔧  | `type-formatting`                         | Format JSDoc types (experimental)                      |
|  ✓   |     | `valid-types`                             | Valid JSDoc/Closure/TS types                           |

**75 rules total**

**TS Notes**:

- `TS` = On in TS; Off in TS flavor
- `TS*` = Off in TS; On in TS flavor
- `✓*` = Off in both TS and TS flavor

---

## Advanced Features

### Contexts (AST Selectors)

Rules with `contexts` option use
[ESLint selectors](https://eslint.org/docs/developer-guide/selectors) (esquery
expressions).

```javascript
{
  rules: {
    'jsdoc/require-description': ['error', {
      contexts: ['FunctionDeclaration', 'ArrowFunctionExpression']
    }]
  }
}
```

**Context object properties**:

| Property                             | Type   | Description                                                  |
| ------------------------------------ | ------ | ------------------------------------------------------------ |
| `context`                            | string | AST selector string                                          |
| `comment`                            | string | JSDoc AST condition (experimental)                           |
| `message`                            | string | Custom message (`no-missing-syntax`, `no-restricted-syntax`) |
| `minimum`                            | number | Min occurrences (`no-missing-syntax`)                        |
| `inlineCommentBlock`, `minLineCount` | —      | (`require-jsdoc` only)                                       |

**AST tools**:

- [AST Explorer](https://astexplorer.net/) — Visualize JS AST
- [@es-joy/jsdoccomment demo](https://es-joy.github.io/jsdoccomment/demo/) —
  JSDoc comment AST
- [jsdoc-type-pratt-parser demo](https://jsdoc-type-pratt-parser.github.io/jsdoc-type-pratt-parser/)
  — Type AST

### Custom Forbid Rules

Create individual rules for forbidden structures:

```javascript
import { jsdoc } from 'eslint-plugin-jsdoc';

export default [
	jsdoc({
		config: 'flat/recommended',
		extraRuleDefinitions: {
			forbid: {
				Any: {
					contexts: [
						{
							comment:
								'JsdocBlock:has(JsdocTypeName[value="any"])',
							context: 'any',
							message: '`any` not allowed',
						},
					],
					description: 'Forbids `any` usage',
					url: 'https://example.com/any-rule',
				},
			},
		},
		rules: {
			'jsdoc/forbid-Any': ['error'],
		},
	}),
];
```

### Custom Prefer Type Rules

Create individual rules for preferred types:

```javascript
import { jsdoc } from 'eslint-plugin-jsdoc';

export default [
	jsdoc({
		config: 'flat/recommended',
		extraRuleDefinitions: {
			preferTypes: {
				promise: {
					description: 'Disallows Promise without generic',
					overrideSettings: {
						Promise: {
							message: 'Add generic type for Promise',
							replacement: false,
							unifyParentAndChildTypeChecks: false,
						},
					},
					url: 'https://example.com/promise-rule',
				},
			},
		},
		rules: {
			'jsdoc/prefer-type-promise': ['error'],
		},
	}),
];
```

---

## Usage Examples

### Basic

```javascript
import { jsdoc } from 'eslint-plugin-jsdoc';

export default [jsdoc({ config: 'flat/recommended' })];
```

### TypeScript

```javascript
import { jsdoc } from 'eslint-plugin-jsdoc';

export default [
	jsdoc({
		config: 'flat/recommended-typescript',
		settings: { mode: 'typescript' },
	}),
];
```

### Custom Rules

```javascript
{
  rules: {
    'jsdoc/require-description': ['error', { contexts: ['FunctionDeclaration'] }],
    'jsdoc/require-param': 'warn',
    'jsdoc/require-returns': ['error', { forceRequireReturn: false }],
    'jsdoc/check-types': 'error',
    'jsdoc/check-param-names': 'error',
  }
}
```

---

## Notes

- Default mode changed from `'all'` to `'typescript'`
- Many rules auto-fixable with `--fix`
- `check-examples` deprecated for ESLint >= 8; use `getJsdocProcessorPlugin`
- TypeScript type-checked rules must be disabled in examples (issue #1377)

---

## Related

- [ESLint](ESLINT.md)
- [JSDoc](JSDOC.md)
- [GitHub](https://github.com/gajus/eslint-plugin-jsdoc)
