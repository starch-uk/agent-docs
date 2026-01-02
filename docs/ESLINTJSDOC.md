# ESLint Plugin JSDoc Quick Reference

> JSDoc linting rules for ESLint.

## Overview

JSDoc linting rules for ESLint. Supports flat config (ESLint v9) and legacy eslintrc formats. Validates JSDoc syntax, types, parameter names, return values, and documentation completeness.

**Repository:** git+https://github.com/gajus/eslint-plugin-jsdoc.git  
**Version:** 1.0.0  
**License:** BSD-3-Clause

## Core Concepts

- JSDoc comment validation and syntax checking
- Type checking in JSDoc tags (TypeScript, Closure, JSDoc modes)
- Parameter and return value validation
- Tag name and structure validation
- Documentation completeness checks
- Auto-fixable rules for formatting and alignment

## Installation

```bash
npm install --save-dev eslint-plugin-jsdoc
```

Requires ESLint 8.0.0 or higher.

## Configuration

### Flat Config (ESLint v9)

```javascript
import {jsdoc} from 'eslint-plugin-jsdoc';

export default [
  jsdoc({
    config: 'flat/recommended',
  })
];
```

### Legacy eslintrc

```javascript
module.exports = {
  plugins: ['jsdoc'],
  extends: ['plugin:jsdoc/recommended'],
  rules: {
    'jsdoc/require-description': 'error',
    'jsdoc/require-param': 'warn',
  },
};
```

## Settings

| Setting | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| mode | string | 'all' | Validation mode: 'all', 'typescript', 'closure', 'jsdoc' |
| prefer | object | {} | Preferred tag names |
| preferType | object | {} | Preferred type expressions |
| require | object | {} | Required tags |
| contexts | array | [] | Context-specific configurations |
| tagNamePreference | object | {} | Preferred tag name mappings |
| maxLines | number | 1 | Maximum lines before JSDoc block |
| minLines | number | 0 | Minimum lines before JSDoc block |

## Rules

| Recommended | Fixable | Rule | Description |
| :---: | :---: | ---- | ----------- |
| ✓ |  | check-access | Checks that `@access` tags have a valid value. |
| ✓ | 🔧 | check-alignment | Reports invalid alignment of JSDoc block asterisks. |
|  |  | check-line-alignment | Reports invalid alignment of JSDoc block lines. |
| ✓ | 🔧 | check-param-names | Checks for dupe `@param` names, that nested param names have roots, and that parameter names in function declarations match JSDoc param names. |
| ✓ | 🔧 | check-property-names | Ensures that property names in JSDoc are not duplicated on the same block and that nested properties have defined roots. |
| ✓ | 🔧 | check-tag-names | Reports invalid block tag names. |
| ✓ | 🔧 | check-types | Reports types deemed invalid (customizable and with defaults, for preventing and/or recommending replacements). |
| ✓ |  | check-values | This rule checks the values for a handful of tags: `@version`, `@since`, `@license` and `@author`. |
|  |  | convert-to-jsdoc-comments | Converts non-JSDoc comments preceding or following nodes into JSDoc ones |
| ✓ | 🔧 | empty-tags | Checks tags that are expected to be empty (e.g., `@abstract` or `@async`), reporting if they have content |
| ✓ | 🔧 | escape-inline-tags | Reports use of JSDoc tags in non-tag positions (in the default "typescript" mode). |
| ✓ |  | implements-on-classes | Prohibits use of `@implements` on non-constructor functions (to enforce the tag only being used on classes/constructors). |
|  |  | lines-before-block | Enforces minimum number of newlines before JSDoc comment blocks |
|  |  | match-name | Reports the name portion of a JSDoc tag if matching or not matching a given regular expression. |
| ✓ | 🔧 | multiline-blocks | Controls how and whether JSDoc blocks can be expressed as single or multiple line blocks. |
|  |  | no-bad-blocks | This rule checks for multi-line-style comments which fail to meet the criteria of a JSDoc block. |
|  |  | no-blank-block-descriptions | If tags are present, this rule will prevent empty lines in the block description. If no tags are present, this rule will prevent extra empty lines in the block description. |
|  |  | no-blank-blocks | Removes empty blocks with nothing but possibly line breaks |
| ✓ | 🔧 | no-defaults | This rule reports defaults being used on the relevant portion of `@param` or `@default`. |
| ✓ | 🔧 | no-multi-asterisks | Prevents use of multiple asterisks at the beginning of lines. |
|  | 🔧 | no-types | This rule reports types being used on `@param` or `@returns` (redundant with TypeScript). |
| ✓ |  | no-undefined-types | Besides some expected built-in types, prohibits any types not specified as globals or within `@typedef`. |
|  |  | prefer-import-tag | Prefer `@import` tags to inline `import()` statements. |
| ✓ |  | reject-any-type | Reports use of `any` or `*` type |
| ✓ |  | reject-function-type | Reports use of `Function` type |
|  |  | require-asterisk-prefix | Requires that each JSDoc line starts with an `*`. |
|  |  | require-description-complete-sentence | Requires that block description, explicit `@description`, and `@param`/`@returns` tag descriptions are written in complete sentences. |
|  |  | require-example | Requires that all functions (and potentially other contexts) have examples. |
|  |  | require-hyphen-before-param-description | Requires a hyphen before the `@param` description (and optionally before `@property` descriptions). |
| ✓ | 🔧 | require-jsdoc | Checks for presence of JSDoc comments, on functions and potentially other contexts (optionally limited to exports). |
| ✓ |  | require-next-type | Requires a type for `@next` tags |
| ✓ | 🔧 | require-param | Requires that all function parameters are documented with a `@param` tag. |
| ✓ | 🔧 | require-param-description | Requires that each `@param` tag has a `description` value. |
| ✓ |  | require-param-name | Requires that all `@param` tags have names. |
| ✓ | 🔧 | require-param-type | Requires that each `@param` tag has a type value (in curly brackets). |
| ✓ | 🔧 | require-property | Requires that all `@typedef` and `@namespace` tags have `@property` when their type is a plain `object`, `Object`, or `PlainObject`. |
| ✓ |  | require-property-description | Requires that each `@property` tag has a `description` value. |
| ✓ |  | require-property-name | Requires that all `@property` tags have names. |
| ✓ |  | require-property-type | Requires that each `@property` tag has a type value (in curly brackets). |
| ✓ | 🔧 | require-returns | Requires that returns are documented with `@returns`. |
| ✓ |  | require-returns-check | Requires a return statement in function body if a `@returns` tag is specified in JSDoc comment(and reports if multiple `@returns` tags are present). |
| ✓ |  | require-returns-description | Requires that the `@returns` tag has a `description` value (not including `void`/`undefined` type returns). |
| ✓ |  | require-returns-type | Requires that `@returns` tag has type value (in curly brackets). |
| ✓ |  | require-throws-type | Requires a type for `@throws` tags |
| ✓ |  | require-yields | Requires yields are documented with `@yields` tags. |
| ✓ |  | require-yields-check | Ensures that if a `@yields` is present that a `yield` (or `yield` with a value) is present in the function body (or that if a `@next` is present that there is a yield with a return value present). |
| ✓ |  | require-yields-type | Requires a type for `@yields` tags |
|  |  | sort-tags | Sorts tags by a specified sequence according to tag name, optionally adding line breaks between tag groups. |
| ✓ | 🔧 | tag-lines | Enforces lines (or no lines) before, after, or between tags. |
|  |  | text-escaping | Auto-escape certain characters that are input within block and tag descriptions. |
|  |  | ts-method-signature-style | Prefers either function properties or method signatures |
| ✓ |  | ts-no-empty-object-type | Warns against use of the empty object type |
|  |  | ts-no-unnecessary-template-expression | Catches unnecessary template expressions such as string expressions within a template literal. |
|  |  | ts-prefer-function-type | Prefers function types over call signatures when there are no other properties. |
|  |  | type-formatting | Formats JSDoc type values. |
| ✓ |  | valid-types | Requires all types/namepaths to be valid JSDoc, Closure compiler, or TypeScript types (configurable in settings). |


*Total: 66 rules*


## Usage Examples

### Basic Setup

```javascript
// eslint.config.js
import {jsdoc} from 'eslint-plugin-jsdoc';

export default [
  jsdoc({
    config: 'flat/recommended',
  })
];
```

### TypeScript Configuration

```javascript
import {jsdoc} from 'eslint-plugin-jsdoc';

export default [
  jsdoc({
    config: 'flat/recommended-typescript',
    settings: {
      jsdoc: {
        mode: 'typescript',
      },
    },
  })
];
```

### Custom Rule Configuration

```javascript
{
  rules: {
    'jsdoc/require-description': ['error', { contexts: ['FunctionDeclaration'] }],
    'jsdoc/require-param': 'warn',
    'jsdoc/require-returns': ['error', { forceRequireReturn: false }],
    'jsdoc/check-types': 'error',
    'jsdoc/check-param-names': 'error',
  },
}
```

## Important Notes

- Requires ESLint 8.0.0 or higher
- Works with JavaScript and TypeScript
- Supports multiple JSDoc dialects: JSDoc, TypeScript, Closure Compiler
- Many rules are auto-fixable with `--fix` flag
- Recommended config includes commonly used rules
- TypeScript-aware rules available in `flat/recommended-typescript` config

## Related Documentation

- [ESLint](ESLINT.md)
- [JSDoc](JSDOC.md)
