# ESLint Reference

**Version:** 1.0.0

## Overview

ESLint: JS/TS/LWC static analysis. ESLint v8 and v9 support.

**typescript-eslint**: Parser (`@typescript-eslint/parser`) + 100+ rules
(`@typescript-eslint/eslint-plugin`) + type-aware linting + configs
(recommended/strict/stylistic) + Project Service.

## Prerequisites

**v9**: Node `^18.18.0|^20.9.0|>=21.1.0`+SSL | **v8**: Node
`^12.22.0|^14.17.0|^16.0.0|^18.0.0|^20.0.0`

## Quick Start

```bash
npm init @eslint/config@latest  # OR: npm i -D eslint @eslint/js && npx eslint .
# TypeScript: npm i -D eslint @eslint/js typescript typescript-eslint
```

**eslint.config.mjs** (TS):

```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
);
```

## ESLint Configuration

ESLint can be configured using flat config (v9) or legacy config (v8) formats.

## Config Formats

### Flat (v9) - `eslint.config.js`

```javascript
export default [
	{
		files: ['**/*.js'],
		languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
		rules: { 'no-console': 'error' },
	},
];
```

Array-based, `files` matching, `languageOptions` replaces `parserOptions`+`env`,
no cascading.

### Flat TS Config

```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.ts'],
		rules: { '@typescript-eslint/no-explicit-any': 'warn' },
	},
);
```

### Legacy (v8) - `.eslintrc.json`

```json
{
	"env": { "browser": true },
	"extends": ["eslint:recommended"],
	"parserOptions": { "ecmaVersion": 2021 },
	"rules": { "no-console": "error" }
}
```

Cascading, `extends`, `env`, `.eslintignore`.

### Legacy TS Config

```json
{
	"parser": "@typescript-eslint/parser",
	"extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	"parserOptions": { "project": "./tsconfig.json" },
	"plugins": ["@typescript-eslint"]
}
```

**Migration**: `npx @eslint/migrate-config` | Legacy files→v8, flat→v9

## Version Detection

ESLint v9 uses flat config by default. If `.eslintrc.*` files are present,
ESLint v8 is used.

## Config Merging

Array concat (flat) → object merge (later wins) → plugin version comparison
(higher wins) → your severity overrides.

## ESLint Process

Parse→AST → Traverse→rules visit nodes → Report→violations → Fix→`--fix`

## Rules

Severity: `off`/0, `warn`/1, `error`/2

```javascript
rules:{'no-console':'error','max-len':['error',{max:100}],'@typescript-eslint/no-explicit-any':['warn',{ignoreRestArgs:true}]}
```

Severity mapping: `warn` (1) and `error` (2) are standard ESLint severity
levels.

## Bundled Rules

JS: Standard ESLint | TS: @typescript-eslint | LWC:
@salesforce/eslint-config-lwc + @lwc/eslint-plugin-lwc-platform | SLDS:
@salesforce-ux/eslint-plugin-slds

## Plugins

### Flat

```javascript
import plugin from 'eslint-plugin-name';
export default [{ plugins: { name: plugin }, rules: { 'name/rule': 'error' } }];
```

### Legacy

```json
{ "plugins": ["name"], "rules": { "name/rule": "error" } }
```

Package: `eslint-plugin-{name}` → ref: `{name}` | Rule: `{plugin}/{rule}`

## Parser Config

### Flat

```javascript
import tsParser from '@typescript-eslint/parser';
export default [
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: { project: './tsconfig.json' },
		},
	},
];
```

### TS Parser Options

```javascript
parserOptions:{
  project:['./tsconfig.json'],  // or projectService:true (recommended for large projects)
  tsconfigRootDir:import.meta.dirname,
  ecmaVersion:2022,sourceType:'module',
  extraFileExtensions:['.vue'],
  ecmaFeatures:{jsx:true}
}
```

**Project Service**: Auto-detects projects, better perf, monorepo support.
`projectService:true`

## Language Options

```javascript
languageOptions:{ecmaVersion:2022,sourceType:'module',globals:{console:'readonly'},parser:p,parserOptions:{ecmaFeatures:{jsx:true}}}
```

Use `globals` pkg: `...globals.browser`, `...globals.node`

## Ignores

**Flat**: `export default [{ignores:['dist/**','node_modules/**']}];`
**Legacy**: `.eslintignore` file. Glob syntax, `!` negation.

## Inline Comments

```javascript
// eslint-disable-next-line rule
/* eslint-disable rule */
/* eslint-enable rule */
// eslint-disable-next-line r1,r2 -- reason
```

## SLDS Rules

`@salesforce-ux/eslint-plugin-slds`: `enforce-bem-usage`,
`no-deprecated-classes-slds2`, `modal-close-button-issue` Disable:
`disable_slds_base_config:true`

## LWC Rules

`@lwc/eslint-plugin-lwc` (v3+: ESLint v9 only) **Base**:
`no-api-reassignments`,`no-deprecated`,`no-document-query`,`valid-api/track/wire`
**Best**: `no-async-operation`,`no-inner-html`,`no-leaky-event-listeners`
**Compat**: `no-async-await`,`no-for-of` (IE11) | **SSR**:
`ssr-no-restricted-browser-globals` Disable: `disable_lwc_base_config:true`

## TypeScript ESLint

### Configs

```javascript
tseslint.configs.recommended; // balanced
tseslint.configs.strict; // + opinionated bug-catching
tseslint.configs.stylistic; // consistent style
```

Combine:
`tseslint.config(eslint.configs.recommended,...tseslint.configs.recommended,...tseslint.configs.strict)`

### Rule Metadata

🔧fixable | 💡suggestions | 💭type-checked | 🧱extension | 💀deprecated

### Extension Rules

Disable base when using TS version:

```javascript
rules:{'no-unused-vars':'off','@typescript-eslint/no-unused-vars':'error'}
```

## Typed Linting

### Setup

```javascript
export default tseslint.config(
	{
		files: ['**/*.ts'],
		languageOptions: {
			parserOptions: {
				project: ['./tsconfig.json'],
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	...tseslint.configs.recommendedTypeChecked,
);
```

Or use Project Service: `parserOptions:{projectService:true}`

### Type-Aware Rules

`no-unsafe-assignment`,`no-unsafe-call`,`no-unsafe-member-access`,`no-unsafe-return`,`no-floating-promises`,`await-thenable`

## TypeScript ESLint Rules Reference

Complete reference of all `@typescript-eslint/eslint-plugin` rules. Rules are
organized alphabetically with metadata indicators:

- ✅ **recommended**: Included in `tseslint.configs.recommended`
- 🔒 **strict**: Included in `tseslint.configs.strict`
- 🎨 **stylistic**: Included in `tseslint.configs.stylistic`
- 🔧 **fixable**: Supports `--fix` auto-fix
- 💡 **suggestions**: Provides fix suggestions
- 💭 **type-checked**: Requires type information (`project` or `projectService`)
- 🧱 **extension**: Extends a core ESLint rule (disable base rule)
- 💀 **deprecated**: Rule is deprecated and will be removed

### Rules List

| Rule                                                              | Config | Metadata | Description                                                                                                             |
| ----------------------------------------------------------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `@typescript-eslint/adjacent-overload-signatures`                 | 🎨     |          | Require that function overload signatures be consecutive                                                                |
| `@typescript-eslint/array-type`                                   | 🎨     | 🔧       | Require consistently using either `T[]` or `Array<T>` for arrays                                                        |
| `@typescript-eslint/await-thenable`                               | ✅     | 💡💭     | Disallow awaiting a value that is not a Thenable                                                                        |
| `@typescript-eslint/ban-ts-comment`                               | ✅     | 💡       | Disallow `@ts-<directive>` comments or require descriptions after directives                                            |
| `@typescript-eslint/ban-tslint-comment`                           | 🎨     | 🔧       | Disallow `// tslint:<rule-flag>` comments                                                                               |
| `@typescript-eslint/class-literal-property-style`                 | 🎨     | 💡       | Enforce that literals on classes are exposed in a consistent style                                                      |
| `@typescript-eslint/class-methods-use-this`                       | 🧱     |          | Enforce that class methods utilize `this`                                                                               |
| `@typescript-eslint/consistent-generic-constructors`              | 🎨     | 🔧       | Enforce specifying generic type arguments on type annotation or constructor name                                        |
| `@typescript-eslint/consistent-indexed-object-style`              | 🎨     | 🔧💡     | Require or disallow the `Record` type                                                                                   |
| `@typescript-eslint/consistent-return`                            | 💭🧱   |          | Require return statements to either always or never specify values                                                      |
| `@typescript-eslint/consistent-type-assertions`                   | 🎨     | 🔧💡     | Enforce consistent usage of type assertions                                                                             |
| `@typescript-eslint/consistent-type-definitions`                  | 🎨     | 🔧       | Enforce type definitions to consistently use either `interface` or `type`                                               |
| `@typescript-eslint/consistent-type-exports`                      |        | 🔧💭     | Enforce consistent usage of type exports                                                                                |
| `@typescript-eslint/consistent-type-imports`                      |        | 🔧       | Enforce consistent usage of type imports                                                                                |
| `@typescript-eslint/default-param-last`                           | 🧱     |          | Enforce default parameters to be last                                                                                   |
| `@typescript-eslint/dot-notation`                                 | 🎨     | 💡💭🧱   | Enforce dot notation whenever possible                                                                                  |
| `@typescript-eslint/explicit-function-return-type`                |        |          | Require explicit return types on functions and class methods                                                            |
| `@typescript-eslint/explicit-member-accessibility`                |        |          | Require explicit accessibility modifiers on class properties and methods                                                |
| `@typescript-eslint/explicit-module-boundary-types`               |        |          | Require explicit return and argument types on exported functions' and classes' public class methods                     |
| `@typescript-eslint/init-declarations`                            | 🧱     |          | Require or disallow initialization in variable declarations                                                             |
| `@typescript-eslint/max-params`                                   | 🧱     |          | Enforce a maximum number of parameters in function definitions                                                          |
| `@typescript-eslint/member-ordering`                              |        |          | Enforce members of a class to be declared in a particular order                                                         |
| `@typescript-eslint/method-signature-style`                       | 🎨     | 🔧       | Enforce using a particular method signature syntax                                                                      |
| `@typescript-eslint/naming-convention`                            |        |          | Enforce naming conventions for everything across a codebase                                                             |
| `@typescript-eslint/no-array-constructor`                         | 🧱     | 🔧       | Disallow generic `Array` constructors                                                                                   |
| `@typescript-eslint/no-array-delete`                              |        | 💡💭     | Disallow deleting computed property keys                                                                                |
| `@typescript-eslint/no-base-to-string`                            |        | 💡💭     | Require `.toString()` to only be called on objects which provide useful information when stringified                    |
| `@typescript-eslint/no-confusing-non-null-assertion`              | 🎨     | 💡       | Disallow non-null assertion in locations that may be confusing                                                          |
| `@typescript-eslint/no-confusing-void-expression`                 | 🎨     | 💡💭     | Disallow returning a value from a function with the return type `void`                                                  |
| `@typescript-eslint/no-deprecated`                                |        | 💡💭     | Disallow using deprecated APIs                                                                                          |
| `@typescript-eslint/no-dupe-class-members`                        | 🧱     |          | Disallow duplicate class members                                                                                        |
| `@typescript-eslint/no-duplicate-enum-values`                     |        |          | Disallow duplicate enum member values                                                                                   |
| `@typescript-eslint/no-duplicate-type-constituents`               |        | 💡💭     | Disallow duplicate constituents of union or intersection types                                                          |
| `@typescript-eslint/no-dynamic-delete`                            |        | 🔧💡     | Disallow using the `delete` operator on computed key expressions                                                        |
| `@typescript-eslint/no-empty-function`                            | 🧱     |          | Disallow empty functions                                                                                                |
| `@typescript-eslint/no-empty-interface`                           | ✅     | 🔧       | Disallow the declaration of empty interfaces                                                                            |
| `@typescript-eslint/no-empty-object-type`                         |        | 🔧💡     | Disallow empty object types                                                                                             |
| `@typescript-eslint/no-explicit-any`                              | ✅     |          | Disallow the `any` type                                                                                                 |
| `@typescript-eslint/no-extra-non-null-assertion`                  | ✅     | 🔧       | Disallow extra non-null assertions                                                                                      |
| `@typescript-eslint/no-extraneous-class`                          |        | 🔧💡     | Disallow classes used as namespaces                                                                                     |
| `@typescript-eslint/no-floating-promises`                         | ✅     | 💡💭     | Require Promise-like values to be handled appropriately                                                                 |
| `@typescript-eslint/no-for-in-array`                              | ✅     | 💡💭     | Disallow iterating over an array with a for-in loop                                                                     |
| `@typescript-eslint/no-implied-eval`                              | 🧱     | 💡       | Disallow the use of `eval()`-like methods                                                                               |
| `@typescript-eslint/no-import-type-side-effects`                  |        | 💡💭     | Enforce the use of top-level import type qualifier when an import only has specifiers with inline type qualifiers       |
| `@typescript-eslint/no-inferrable-types`                          | ✅     | 🔧       | Disallow explicit type annotations for variables or parameters initialized to a number, string, or boolean              |
| `@typescript-eslint/no-invalid-this`                              | 🧱     |          | Disallow `this` keywords outside of classes or class-like objects                                                       |
| `@typescript-eslint/no-invalid-void-type`                         |        |          | Disallow `void` type outside of generic or return types                                                                 |
| `@typescript-eslint/no-loop-func`                                 | 🧱     |          | Disallow function declarations that contain unsafe references inside loop statements                                    |
| `@typescript-eslint/no-loss-of-precision`                         | 🧱     |          | Disallow literal numbers that lose precision                                                                            |
| `@typescript-eslint/no-magic-numbers`                             |        |          | Disallow magic numbers                                                                                                  |
| `@typescript-eslint/no-meaningless-void-operator`                 | 🎨     | 🔧💡     | Disallow the `void` operator except when used to discard a value                                                        |
| `@typescript-eslint/no-misused-new`                               | ✅     |          | Enforce valid definition of `new` and `constructor`                                                                     |
| `@typescript-eslint/no-misused-promises`                          | ✅     | 💡💭     | Disallow Promises in places not designed to handle them                                                                 |
| `@typescript-eslint/no-misused-spread`                            |        | 💡💭     | Disallow `...rest` parameters that are actually a tuple type                                                            |
| `@typescript-eslint/no-mixed-enums`                               |        | 🔧💡     | Disallow enums from having both number and string members                                                               |
| `@typescript-eslint/no-namespace`                                 | ✅     | 🔧       | Disallow TypeScript namespaces                                                                                          |
| `@typescript-eslint/no-non-null-asserted-nullish-coalescing`      | ✅     | 💡💭     | Disallow non-null assertions in the left operand of a nullish coalescing operator                                       |
| `@typescript-eslint/no-non-null-asserted-optional-chain`          | ✅     | 💡       | Disallow non-null assertions after an optional chain expression                                                         |
| `@typescript-eslint/no-non-null-assertion`                        | ✅     | 💡       | Disallow non-null assertions using the `!` postfix operator                                                             |
| `@typescript-eslint/no-redeclare`                                 | 🧱     |          | Disallow variable redeclaration                                                                                         |
| `@typescript-eslint/no-redundant-type-constituents`               |        | 🔧💡💭   | Disallow members of unions and intersections that do nothing or override type information                               |
| `@typescript-eslint/no-require-imports`                           |        |          | Disallow invocation of `require()`                                                                                      |
| `@typescript-eslint/no-restricted-imports`                        | 🧱     |          | Disallow specified modules when loaded by `import` or `require`                                                         |
| `@typescript-eslint/no-restricted-types`                          |        |          | Disallow certain types                                                                                                  |
| `@typescript-eslint/no-shadow`                                    | 🧱     |          | Disallow variable declarations from shadowing variables declared in the outer scope                                     |
| `@typescript-eslint/no-this-alias`                                |        |          | Disallow aliasing `this`                                                                                                |
| `@typescript-eslint/no-type-alias`                                |        |          | Disallow type aliases                                                                                                   |
| `@typescript-eslint/no-unnecessary-boolean-literal-compare`       | 🎨     | 🔧💡💭   | Disallow unnecessary equality comparisons against boolean literals                                                      |
| `@typescript-eslint/no-unnecessary-condition`                     |        | 💡💭     | Disallow conditionals where the type is always truthy or always falsy                                                   |
| `@typescript-eslint/no-unnecessary-parameter-property-assignment` |        | 💡💭     | Disallow unnecessary parameter property assignments                                                                     |
| `@typescript-eslint/no-unnecessary-qualifier`                     | 🎨     | 🔧💡💭   | Disallow unnecessary namespace qualifiers                                                                               |
| `@typescript-eslint/no-unnecessary-template-expression`           | 🎨     | 🔧💡     | Disallow unnecessary template expressions                                                                               |
| `@typescript-eslint/no-unnecessary-type-arguments`                | 🎨     | 🔧💡💭   | Disallow unnecessary generic type arguments                                                                             |
| `@typescript-eslint/no-unnecessary-type-assertion`                | ✅     | 🔧💡💭   | Disallow type assertions that are unnecessary                                                                           |
| `@typescript-eslint/no-unnecessary-type-constraint`               | 🎨     | 🔧💡💭   | Disallow unnecessary constraints on generic types                                                                       |
| `@typescript-eslint/no-unnecessary-type-conversion`               | 🎨     | 🔧💡💭   | Disallow unnecessary type conversions                                                                                   |
| `@typescript-eslint/no-unnecessary-type-parameters`               | 🎨     | 🔧💡💭   | Disallow unnecessary type parameters                                                                                    |
| `@typescript-eslint/no-unsafe-argument`                           | ✅     | 💡💭     | Disallow calling a function with a value with type `any`                                                                |
| `@typescript-eslint/no-unsafe-assignment`                         | ✅     | 💡💭     | Disallow assigning a value with type `any` to variables and properties                                                  |
| `@typescript-eslint/no-unsafe-call`                               | ✅     | 💡💭     | Disallow calling a value with type `any`                                                                                |
| `@typescript-eslint/no-unsafe-declaration-merging`                |        | 💡💭     | Disallow unsafe declaration merging                                                                                     |
| `@typescript-eslint/no-unsafe-enum-comparison`                    |        | 💡💭     | Disallow comparing an enum value with a non-enum value                                                                  |
| `@typescript-eslint/no-unsafe-function-type`                      |        | 💡💭     | Disallow function types that are unsafe                                                                                 |
| `@typescript-eslint/no-unsafe-member-access`                      | ✅     | 💡💭     | Disallow member access on a value with type `any`                                                                       |
| `@typescript-eslint/no-unsafe-return`                             | ✅     | 💡💭     | Disallow returning a value with type `any` from a function                                                              |
| `@typescript-eslint/no-unsafe-type-assertion`                     |        | 💡💭     | Disallow type assertions that are unsafe                                                                                |
| `@typescript-eslint/no-unsafe-unary-minus`                        |        | 💡💭     | Disallow unary minus operator on non-numeric types                                                                      |
| `@typescript-eslint/no-unused-expressions`                        | 🧱     |          | Disallow unused expressions                                                                                             |
| `@typescript-eslint/no-unused-private-class-members`              |        |          | Disallow unused private class members                                                                                   |
| `@typescript-eslint/no-unused-vars`                               | ✅     | 🧱       | Disallow unused variables                                                                                               |
| `@typescript-eslint/no-use-before-define`                         | 🧱     |          | Disallow the use of variables before they are defined                                                                   |
| `@typescript-eslint/no-useless-constructor`                       | 🧱     | 🔧       | Disallow unnecessary constructors                                                                                       |
| `@typescript-eslint/no-useless-default-assignment`                |        | 🔧💡💭   | Disallow useless default assignments                                                                                    |
| `@typescript-eslint/no-useless-empty-export`                      |        | 🔧       | Disallow empty exports that don't change anything in a module file                                                      |
| `@typescript-eslint/no-var-requires`                              | ✅     |          | Disallow `require` statements except in import statements                                                               |
| `@typescript-eslint/no-wrapper-object-types`                      |        | 🔧💡💭   | Disallow using wrapper objects (String, Number, Boolean) as types                                                       |
| `@typescript-eslint/non-nullable-type-assertion-style`            | 🎨     | 🔧💡💭   | Enforce non-null assertions over explicit type assertions                                                               |
| `@typescript-eslint/only-throw-error`                             | 🔒     | 💡💭     | Enforce throwing only `Error` objects                                                                                   |
| `@typescript-eslint/parameter-properties`                         |        |          | Require or disallow parameter properties in class constructors                                                          |
| `@typescript-eslint/prefer-as-const`                              | ✅     | 🔧       | Require `as const` for literal expressions that are never reassigned                                                    |
| `@typescript-eslint/prefer-destructuring`                         | 🧱     | 💡       | Require destructuring from arrays and/or objects                                                                        |
| `@typescript-eslint/prefer-enum-initializers`                     |        | 🔧💡     | Require each enum member value to be explicitly initialized                                                             |
| `@typescript-eslint/prefer-find`                                  | 🎨     | 🔧💡💭   | Enforce using `Array.find()` instead of `Array.filter()[0]`                                                             |
| `@typescript-eslint/prefer-for-of`                                | 🎨     |          | Enforce the use of `for-of` loops over the standard `for` loop where possible                                           |
| `@typescript-eslint/prefer-function-type`                         | 🎨     | 🔧       | Enforce using function types instead of interfaces with call signatures                                                 |
| `@typescript-eslint/prefer-includes`                              | 🎨     | 🔧💡💭   | Enforce using `String#includes()` instead of `String#indexOf()` or `String#search()`                                    |
| `@typescript-eslint/prefer-literal-enum-member`                   |        |          | Require all enum members to be literal values                                                                           |
| `@typescript-eslint/prefer-namespace-keyword`                     | ✅     | 🔧       | Require using `namespace` keyword instead of `module` keyword to declare custom TypeScript modules                      |
| `@typescript-eslint/prefer-nullish-coalescing`                    | 🎨     | 🔧💡💭   | Enforce using the nullish coalescing operator instead of logical chaining                                               |
| `@typescript-eslint/prefer-optional-chain`                        | 🎨     | 🔧💡💭   | Enforce using concise optional chain expressions instead of chained logical ands, negated logical ors, or empty objects |
| `@typescript-eslint/prefer-promise-reject-errors`                 | ✅     | 💭🧱     | Require using Error objects as Promise rejection reasons                                                                |
| `@typescript-eslint/prefer-readonly`                              |        | 🔧💭     | Require private members to be marked as `readonly` if they're never modified outside of the constructor                 |
| `@typescript-eslint/prefer-readonly-parameter-types`              |        | 💭       | Require function parameters to be typed as `readonly` to prevent accidental mutation of inputs                          |
| `@typescript-eslint/prefer-reduce-type-parameter`                 | 🔒     | 🔧💭     | Enforce using type parameter when calling `Array#reduce` instead of using a type assertion                              |
| `@typescript-eslint/prefer-regexp-exec`                           | 🎨     | 🔧💭     | Enforce `RegExp#exec` over `String#match` if no global flag is provided                                                 |
| `@typescript-eslint/prefer-return-this-type`                      | 🔒     | 🔧💭     | Enforce that `this` is used when only `this` type is returned                                                           |
| `@typescript-eslint/prefer-string-starts-ends-with`               | 🎨     | 🔧💭     | Enforce using `String#startsWith` and `String#endsWith` over other equivalent methods of checking substrings            |
| `@typescript-eslint/prefer-ts-expect-error`                       |        | 🔧💀     | Enforce using `@ts-expect-error` over `@ts-ignore`                                                                      |
| `@typescript-eslint/promise-function-async`                       |        | 🔧💭     | Require any function or method that returns a Promise to be marked `async`                                              |
| `@typescript-eslint/related-getter-setter-pairs`                  | 🔒     | 💭       | Enforce that `get()` types should be assignable to their equivalent `set()` type                                        |
| `@typescript-eslint/require-array-sort-compare`                   |        | 💭       | Require `Array#sort` and `Array#toSorted` calls to always provide a `compareFunction`                                   |
| `@typescript-eslint/require-await`                                | ✅     | 💡💭🧱   | Disallow async functions which do not return promises and have no `await` expression                                    |
| `@typescript-eslint/restrict-plus-operands`                       | ✅     | 💭       | Require both operands of addition to be the same type and be `bigint`, `number`, or `string`                            |
| `@typescript-eslint/restrict-template-expressions`                | ✅     | 💭       | Enforce template literal expressions to be of string type                                                               |
| `@typescript-eslint/return-await`                                 | 🔒     | 🔧💡💭   | Enforce consistent awaiting of returned promises                                                                        |
| `@typescript-eslint/sort-type-constituents`                       |        | 🔧💡💀   | Enforce constituents of a type union/intersection to be sorted alphabetically                                           |
| `@typescript-eslint/strict-boolean-expressions`                   |        | 💡💭     | Disallow certain types in boolean expressions                                                                           |
| `@typescript-eslint/switch-exhaustiveness-check`                  |        | 💡💭     | Require switch-case statements to be exhaustive                                                                         |
| `@typescript-eslint/triple-slash-reference`                       | ✅     |          | Disallow certain triple slash directives in favor of ES6-style import declarations                                      |
| `@typescript-eslint/typedef`                                      |        | 💀       | Require type annotations in certain places                                                                              |
| `@typescript-eslint/unbound-method`                               | ✅     | 💭       | Enforce unbound methods are called with their expected scope                                                            |
| `@typescript-eslint/unified-signatures`                           | 🔒     |          | Disallow two overloads that could be unified into one with a union or an optional/rest parameter                        |
| `@typescript-eslint/use-unknown-in-catch-callback-variable`       | 🔒     | 💡💭     | Enforce typing arguments in Promise rejection callbacks as `unknown`                                                    |

### Commonly Used Rules

#### Type Safety Rules

**`@typescript-eslint/no-explicit-any`** (✅)

- Disallows the use of `any` type
- Options: `fixToUnknown`, `ignoreRestArgs`
- Example: `const x: any = 1;` ❌ → `const x: unknown = 1;` ✅

**`@typescript-eslint/no-unsafe-assignment`** (✅💡💭)

- Disallows assigning values with `any` type
- Requires type checking
- Example: `const x: string = anyValue;` ❌

**`@typescript-eslint/no-unsafe-call`** (✅💡💭)

- Disallows calling functions with `any` type
- Requires type checking
- Example: `anyFunction();` ❌

**`@typescript-eslint/no-unsafe-member-access`** (✅💡💭)

- Disallows accessing members on `any` type
- Requires type checking
- Example: `anyValue.property;` ❌

**`@typescript-eslint/no-unsafe-return`** (✅💡💭)

- Disallows returning `any` type from functions
- Requires type checking
- Example: `return anyValue;` ❌

#### Promise Handling Rules

**`@typescript-eslint/no-floating-promises`** (✅💡💭)

- Requires Promise-like values to be handled
- Options: `ignoreVoid`, `ignoreIIFE`
- Example: `promiseFunction();` ❌ → `await promiseFunction();` ✅

**`@typescript-eslint/await-thenable`** (✅💡💭)

- Disallows awaiting non-Thenable values
- Requires type checking
- Example: `await 42;` ❌

**`@typescript-eslint/no-misused-promises`** (✅💡💭)

- Disallows Promises in places not designed to handle them
- Options: `checksConditionals`, `checksVoidReturn`, `checksSpreads`
- Example: `if (promise) { ... }` ❌

#### Code Quality Rules

**`@typescript-eslint/ban-ts-comment`** (✅💡)

- Controls `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, `@ts-check`
- Options: `ts-expect-error`, `ts-ignore`, `ts-nocheck`, `ts-check`,
  `minimumDescriptionLength`
- Example: `// @ts-ignore` ❌ → `// @ts-expect-error: reason` ✅

**`@typescript-eslint/no-unused-vars`** (✅🧱)

- Disallows unused variables
- Options: `args`, `varsIgnorePattern`, `caughtErrors`,
  `destructuredArrayIgnorePattern`
- Example: `const unused = 1;` ❌

**`@typescript-eslint/explicit-function-return-type`**

- Requires explicit return types on functions
- Options: `allowExpressions`, `allowTypedFunctionExpressions`,
  `allowHigherOrderFunctions`, `allowDirectConstAssertionInArrowFunctions`
- Example: `function foo() { return 1; }` ❌ →
  `function foo(): number { return 1; }` ✅

#### Style Rules

**`@typescript-eslint/array-type`** (🎨🔧)

- Enforces consistent array type syntax
- Options: `default`, `readonly`
- Values: `array`, `array-simple`, `generic`, `array-simple`
- Example: `Array<number>` vs `number[]`

**`@typescript-eslint/consistent-type-definitions`** (🎨🔧)

- Enforces `interface` or `type` consistently
- Options: `prefer` (`interface` or `type`)
- Example: `type Foo = {}` vs `interface Foo {}`

**`@typescript-eslint/prefer-nullish-coalescing`** (🎨🔧💡💭)

- Enforces `??` over `||` for null/undefined
- Options: `ignoreConditionalTests`, `ignoreMixedLogicalExpressions`
- Example: `x || y` ❌ → `x ?? y` ✅

**`@typescript-eslint/prefer-optional-chain`** (🎨🔧💡💭)

- Enforces `?.` over `&&` chains
- Example: `obj && obj.prop` ❌ → `obj?.prop` ✅

### Extension Rules

These rules extend core ESLint rules with TypeScript support. **Disable the base
rule** when using the TypeScript version:

```javascript
rules: {
  // Disable base rule
  'no-unused-vars': 'off',
  'no-shadow': 'off',
  'no-use-before-define': 'off',
  // Enable TS version
  '@typescript-eslint/no-unused-vars': 'error',
  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-use-before-define': 'error',
}
```

Extension rules: `class-methods-use-this`, `consistent-return`,
`default-param-last`, `dot-notation`, `init-declarations`, `max-params`,
`no-array-constructor`, `no-dupe-class-members`, `no-empty-function`,
`no-implied-eval`, `no-invalid-this`, `no-loop-func`, `no-loss-of-precision`,
`no-redeclare`, `no-restricted-imports`, `no-shadow`, `no-unused-expressions`,
`no-unused-vars`, `no-use-before-define`, `no-useless-constructor`,
`prefer-destructuring`, `prefer-promise-reject-errors`, `require-await`

### Deprecated Rules

- `@typescript-eslint/prefer-ts-expect-error` (💀) - Use `ban-ts-comment`
  instead
- `@typescript-eslint/sort-type-constituents` (💀) - Will be removed in future
  version
- `@typescript-eslint/typedef` (💀) - Use `explicit-function-return-type` and
  similar rules

### Rule Configuration Examples

```javascript
// Type safety
rules: {
  '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
  '@typescript-eslint/no-unsafe-assignment': 'error',
  '@typescript-eslint/no-unsafe-call': 'error',
  '@typescript-eslint/no-unsafe-member-access': 'error',
  '@typescript-eslint/no-unsafe-return': 'error',
}

// Promise handling
rules: {
  '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/no-misused-promises': ['error', {
    checksConditionals: true,
    checksVoidReturn: true,
  }],
}

// Code quality
rules: {
  '@typescript-eslint/ban-ts-comment': ['error', {
    'ts-expect-error': 'allow-with-description',
    'ts-ignore': true,
    'ts-nocheck': true,
    'ts-check': false,
    minimumDescriptionLength: 10,
  }],
  '@typescript-eslint/no-unused-vars': ['error', {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
  }],
  '@typescript-eslint/explicit-function-return-type': ['warn', {
    allowExpressions: true,
    allowTypedFunctionExpressions: true,
  }],
}

// Style
rules: {
  '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/prefer-optional-chain': 'error',
}
```

## Migration v8→v9

| v8              | v9                              |
| --------------- | ------------------------------- |
| `.eslintrc.*`   | `eslint.config.js`              |
| Cascading       | No cascading                    |
| `.eslintignore` | `ignores` prop                  |
| `env`           | `languageOptions.globals`       |
| `parserOptions` | `languageOptions.parserOptions` |
| `extends`       | Import+spread                   |
| `overrides`     | Multiple config objects         |

Tool: `npx @eslint/migrate-config`

## CLI

```bash
eslint [opts] [file|dir|glob]*
```

| Opt                  | Desc                                |
| -------------------- | ----------------------------------- |
| `--fix`              | Auto-fix                            |
| `--fix-dry-run`      | Preview                             |
| `--format <f>`       | stylish,json,compact,unix,tap,junit |
| `--config <p>`       | Config path                         |
| `--cache`            | Cache                               |
| `--quiet`            | Errors only                         |
| `--print-config <f>` | Debug                               |
| `--debug`            | Verbose                             |

Exit: 0=ok, 1=errors, 2=fatal

## Formatters

Built-in: stylish(default),compact,json,unix,tap,junit Custom:
`module.exports=(results,data)=>results.map(r=>`${r.filePath}:${r.messages.length}`).join('\n');`

## Bulk Suppressions

```json
{ "suppressions": [{ "ruleId": "no-console", "files": ["legacy/**/*.js"] }] }
```

## Integrations

Editors: VSCode,WebStorm,Sublime,Vim,Emacs | Build:
Webpack,Rollup,Vite,Gulp,Grunt | CI: GH Actions,GitLab,Jenkins | Pre-commit:
Husky

## Debugging

```bash
eslint --print-config file.js  # merged config
eslint --debug src/            # verbose
pnpm ls eslint-plugin-name      # verify install
```

| Issue                  | Fix                                         |
| ---------------------- | ------------------------------------------- |
| Config not found       | Check path,auto_discover,filename           |
| Plugin conflicts       | Disable base configs,check versions         |
| Rules not applying     | Check extensions,names,patterns             |
| Type-aware not working | Add project/projectService to parserOptions |
| Slow linting           | Use projectService:true                     |

| Error                                | Fix                                  |
| ------------------------------------ | ------------------------------------ |
| Cannot find module 'eslint-plugin-x' | `npm i -D eslint-plugin-x`           |
| Parsing error                        | Check parser,ecmaVersion             |
| Rule not defined                     | Check name,plugin loaded             |
| context.getScope not function        | Use `sourceCode.getScope(node)` (v9) |
| Parser requires project              | Add project/projectService           |

## Extending

### Custom Rule

```javascript
module.exports = {
	meta: {
		type: 'problem',
		docs: { description: '...' },
		fixable: 'code',
		schema: [],
		messages: { msg: '{{p}} err' },
	},
	create(ctx) {
		return {
			'CallExpr[callee.name="x"]'(n) {
				ctx.report({ node: n, messageId: 'msg', data: { p: 'v' } });
			},
		};
	},
};
```

### TS-Aware Rule

```javascript
import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator((n) => `url/${n}`);
export default createRule({
	name: 'rule',
	meta: {
		type: 'problem',
		docs: { description: '...', requiresTypeChecking: true },
		messages: { e: 'err' },
		schema: [],
	},
	defaultOptions: [],
	create(ctx) {
		const svc = ESLintUtils.getParserServices(ctx);
		const chk = svc.program.getTypeChecker();
		return {};
	},
});
```

### Test Rules

```javascript
import { RuleTester } from '@typescript-eslint/rule-tester';
new RuleTester({
	languageOptions: {
		parser: '@typescript-eslint/parser',
		parserOptions: { project: './tsconfig.json' },
	},
}).run('rule', rule, { valid: [], invalid: [] });
```

### Processors

```javascript
module.exports = {
	processors: {
		'.md': {
			preprocess(t, f) {
				return [];
			},
			postprocess(m, f) {
				return m[0];
			},
			supportsAutofix: true,
		},
	},
};
```

### Shareable Configs

Package: `eslint-config-{name}` → ref: `{name}`

```javascript
export default [{ rules: { 'no-console': 'error' } }];
```

## Node.js API

```javascript
import { ESLint } from 'eslint';
const e = new ESLint({ fix: true });
const r = await e.lintFiles(['src/**/*.js']);
await ESLint.outputFixes(r);
console.log((await e.loadFormatter('json')).format(r));
```

| Opt        | Type | Desc        |
| ---------- | ---- | ----------- |
| cwd        | str  | Working dir |
| baseConfig | obj  | Base config |
| fix        | bool | Apply fixes |
| cache      | bool | Caching     |

Methods: `lintFiles(patterns)→LintResult[]` | `lintText(code,{filePath})` |
`loadFormatter(name)` | `calculateConfigForFile(path)` | `isPathIgnored(path)` |
`ESLint.outputFixes(results)`

### LintResult

`{filePath,messages[],errorCount,warningCount,fixableErrorCount,fixableWarningCount}`

### Message

`{ruleId,severity:1|2,message,line,column,endLine?,endColumn?,fix?:{range,text}}`

## MCP Server

`npm i -g @eslint/mcp-server` — AI tool protocol for ESLint.

## Feature Flags

`ESLINT_FEATURE_FLAG=name eslint .` — experimental features.

## Packages

**Core**: `@typescript-eslint/eslint-plugin`(rules) |
`@typescript-eslint/parser` | `typescript-eslint`(main) **Dev**:
`@typescript-eslint/utils`(RuleCreator,getParserServices) |
`@typescript-eslint/rule-tester` **Infra**: `scope-manager` |
`typescript-estree`(AST) | `tsconfig-utils` | `type-utils` | `project-service`
**Migration**: `@typescript-eslint/eslint-plugin-tslint`

## TypeScript ESTree AST

Additional nodes:
`TSInterfaceDeclaration`,`TSTypeAliasDeclaration`,`TSEnumDeclaration`,`TSModuleDeclaration`,`TSDecorator`,`TSTypeParameter`
Spec: typescript-eslint.io/packages/typescript-estree/ast-spec

## Glossary

AST=code tree | Rule=pattern checker | Plugin=rules+processors+configs |
Parser=source→AST | Processor=extract JS from non-JS | Formatter=output format |
Severity=off/warn/error | Flat Config=v9 array | Legacy Config=v8 .eslintrc |
Extension Rule=TS replacing base | Type-Checked=needs type info | Project
Service=auto project detection | ESTree=JS AST format | TS ESTree=TS AST in
ESTree format

## Refs

eslint.org/docs | typescript-eslint.io | typescript-eslint.io/rules |
typescript-eslint.io/getting-started/typed-linting |
typescript-eslint.io/users/shared-configs
