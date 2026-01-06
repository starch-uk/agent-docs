# JSDoc Reference

> **Version**: 1.0.0

> **Purpose**: API documentation generator for JavaScript. Extracts `/** ... */`
> comments → HTML docs. **Node**: ^20.19.0 | ^22.12.0 | >=23.0.0 (JSDoc 5.x)

---

## Quick Start

```bash
# Install
npm install -g jsdoc          # Global
npm install --save-dev jsdoc  # Local

# Run
jsdoc file.js                 # Single file
jsdoc -r src/                 # Recursive
jsdoc -c conf.json            # With config
jsdoc -d docs/ file.js        # Custom output dir
```

**Default output**: `out/` directory

---

## CLI Options

| Option          | Short | Description                          |
| --------------- | ----- | ------------------------------------ |
| `--configure`   | `-c`  | Config file path                     |
| `--destination` | `-d`  | Output directory (default: `./out/`) |
| `--recurse`     | `-r`  | Recurse into subdirectories          |
| `--private`     | —     | Include `@private` symbols           |
| `--package`     | `-P`  | Include `package.json` info          |
| `--readme`      | `-R`  | Include README file                  |
| `--tutorials`   | `-u`  | Tutorials directory                  |
| `--template`    | `-t`  | Template directory                   |
| `--encoding`    | `-e`  | File encoding (default: `utf8`)      |
| `--explain`     | `-X`  | Output doclets as JSON               |
| `--help`        | `-h`  | Show help                            |
| `--version`     | `-v`  | Show version                         |
| `--verbose`     | —     | Verbose output                       |
| `--pedantic`    | —     | Treat warnings as errors             |
| `--query`       | `-q`  | Query string for template            |

---

## Configuration

### File Formats

**JSON** (conf.json) — supports comments in JSDoc 3.3.0+:

```json
{
	"source": {
		"include": ["src/"],
		"exclude": ["src/tests/"],
		"includePattern": ".+\\.js(doc|x)?$",
		"excludePattern": "(^|\\/|\\\\)_"
	},
	"sourceType": "module",
	"plugins": ["plugins/markdown"],
	"recurseDepth": 10,
	"tags": {
		"allowUnknownTags": true,
		"dictionaries": ["jsdoc", "closure"]
	},
	"templates": {
		"cleverLinks": false,
		"monospaceLinks": false,
		"default": { "outputSourceFiles": true }
	},
	"opts": {
		"destination": "./out/",
		"recurse": true,
		"tutorials": "tutorials/"
	}
}
```

**CommonJS** (conf.js) — JSDoc 3.5.0+:

```javascript
module.exports = {
	/* same structure */
};
```

### Configuration Options

| Option                     | Type    | Default               | Description                   |
| -------------------------- | ------- | --------------------- | ----------------------------- |
| `source.include`           | array   | `[]`                  | Paths to include              |
| `source.exclude`           | array   | `[]`                  | Paths to exclude (precedence) |
| `source.includePattern`    | string  | `".+\\.js(doc\|x)?$"` | File match regex              |
| `source.excludePattern`    | string  | `"(^\|\/\|\\\\)_"`    | File exclude regex            |
| `sourceType`               | string  | `"module"`            | `"module"` or `"script"`      |
| `plugins`                  | array   | `[]`                  | Plugin paths                  |
| `recurseDepth`             | number  | `10`                  | Max recursion depth           |
| `tags.allowUnknownTags`    | boolean | `true`                | Allow custom tags             |
| `tags.dictionaries`        | array   | `["jsdoc","closure"]` | Tag dictionaries              |
| `templates.cleverLinks`    | boolean | `false`               | Smart link rendering          |
| `templates.monospaceLinks` | boolean | `false`               | Monospace links               |
| `opts.destination`         | string  | `"./out/"`            | Output directory              |
| `opts.recurse`             | boolean | `false`               | Recurse subdirs               |
| `opts.private`             | boolean | `false`               | Include private               |
| `opts.tutorials`           | string  | `null`                | Tutorials path                |
| `opts.template`            | string  | `null`                | Template path                 |

---

## Block Tags

| Tag            | Description          | Syntax                               |
| -------------- | -------------------- | ------------------------------------ |
| `@abstract`    | Abstract member      | `@abstract`                          |
| `@access`      | Access level         | `@access private\|protected\|public` |
| `@alias`       | Alias name           | `@alias name`                        |
| `@async`       | Async function       | `@async`                             |
| `@augments`    | Extends class        | `@augments ClassName`                |
| `@author`      | Author               | `@author Name <email>`               |
| `@borrows`     | Borrow docs          | `@borrows path as alias`             |
| `@callback`    | Callback typedef     | `@callback Name`                     |
| `@class`       | Class                | `@class [Name]`                      |
| `@constant`    | Constant             | `@constant {type}`                   |
| `@constructor` | Constructor          | `@constructor`                       |
| `@copyright`   | Copyright            | `@copyright text`                    |
| `@default`     | Default value        | `@default [value]`                   |
| `@deprecated`  | Deprecated           | `@deprecated [message]`              |
| `@description` | Description          | `@description text`                  |
| `@enum`        | Enum                 | `@enum {type}`                       |
| `@event`       | Event                | `@event Name`                        |
| `@example`     | Example code         | `@example` + code block              |
| `@exports`     | Module export        | `@exports moduleName`                |
| `@extends`     | Alias for @augments  | `@extends ClassName`                 |
| `@external`    | External symbol      | `@external Name`                     |
| `@file`        | File description     | `@file description`                  |
| `@fires`       | Fires event          | `@fires EventName`                   |
| `@function`    | Function             | `@function [name]`                   |
| `@global`      | Global symbol        | `@global`                            |
| `@ignore`      | Ignore in docs       | `@ignore`                            |
| `@implements`  | Implements interface | `@implements Interface`              |
| `@inheritdoc`  | Inherit docs         | `@inheritdoc`                        |
| `@inner`       | Inner member         | `@inner`                             |
| `@instance`    | Instance member      | `@instance`                          |
| `@interface`   | Interface            | `@interface [Name]`                  |
| `@kind`        | Symbol kind          | `@kind class\|function\|...`         |
| `@lends`       | Lends properties     | `@lends ClassName#`                  |
| `@license`     | License              | `@license identifier`                |
| `@member`      | Member               | `@member {type} [name]`              |
| `@memberof`    | Parent               | `@memberof ParentName`               |
| `@method`      | Method               | `@method [name]`                     |
| `@mixes`       | Mixes in             | `@mixes MixinName`                   |
| `@mixin`       | Mixin                | `@mixin [Name]`                      |
| `@module`      | Module               | `@module [name]`                     |
| `@name`        | Force name           | `@name symbolName`                   |
| `@namespace`   | Namespace            | `@namespace [Name]`                  |
| `@override`    | Override             | `@override`                          |
| `@param`       | Parameter            | `@param {type} name - desc`          |
| `@private`     | Private              | `@private`                           |
| `@property`    | Property             | `@property {type} name - desc`       |
| `@protected`   | Protected            | `@protected`                         |
| `@public`      | Public               | `@public`                            |
| `@readonly`    | Read-only            | `@readonly`                          |
| `@requires`    | Requires module      | `@requires module:name`              |
| `@returns`     | Return value         | `@returns {type} desc`               |
| `@see`         | See also             | `@see namepath`                      |
| `@since`       | Since version        | `@since version`                     |
| `@static`      | Static member        | `@static`                            |
| `@summary`     | Short summary        | `@summary text`                      |
| `@this`        | This context         | `@this ClassName`                    |
| `@throws`      | Exception            | `@throws {type} desc`                |
| `@todo`        | Todo                 | `@todo text`                         |
| `@tutorial`    | Tutorial link        | `@tutorial tutorialId`               |
| `@type`        | Type                 | `@type {type}`                       |
| `@typedef`     | Type definition      | `@typedef {type} Name`               |
| `@variation`   | Variation            | `@variation number`                  |
| `@version`     | Version              | `@version number`                    |
| `@yields`      | Generator yield      | `@yields {type} desc`                |

---

## Inline Tags

Used within descriptions, enclosed in `{}`:

| Tag            | Description         | Syntax                                         |
| -------------- | ------------------- | ---------------------------------------------- |
| `{@link}`      | Link to symbol      | `{@link namepath}` or `{@link namepath\|text}` |
| `{@linkcode}`  | Code-formatted link | `{@linkcode namepath}`                         |
| `{@linkplain}` | Plain text link     | `{@linkplain namepath}`                        |
| `{@tutorial}`  | Tutorial link       | `{@tutorial tutorialId}`                       |

**Escape braces**: `{@link method\|text with \} brace}`

---

## Type Expressions

### Basic Types

```javascript
{string}      {number}       {boolean}      {Object}
{Array}       {Function}     {void}         {undefined}
{null}        {*}            {any}
```

### Modifiers

```javascript
{string[]}                    // Array of strings
{Array.<string>}              // Array (alternative)
{Object.<string, number>}     // Object with string keys, number values
{?string}                     // Nullable (string or null)
{!string}                     // Non-nullable
{string=}                     // Optional parameter
{...string}                   // Rest parameter
{(string|number)}             // Union type
```

### Type Definitions

```javascript
/**
 * @typedef {Object} User
 * @property {string} name
 * @property {number} age
 * @property {string} [email] - Optional
 */

/**
 * @callback RequestCallback
 * @param {Error} error
 * @param {Object} response
 */
```

---

## Namepaths

| Syntax               | Description     | Example                  |
| -------------------- | --------------- | ------------------------ |
| `name`               | Global/function | `myFunction`             |
| `Class#member`       | Instance member | `MyClass#method`         |
| `Class.member`       | Static member   | `MyClass.staticMethod`   |
| `Class~member`       | Inner member    | `MyClass~privateFunc`    |
| `module:name`        | Module          | `module:myModule`        |
| `module:name#member` | Module instance | `module:myModule#method` |
| `external:name`      | External        | `external:String`        |
| `event:name`         | Event           | `event:MyEvent`          |

**Separators**:

- `#` — Instance (prototype)
- `.` — Static (class property)
- `~` — Inner (nested/private)

**Special characters**: Quote names with special chars: `chat."#channel".open`

---

## Param Syntax

```javascript
/**
 * @param {string} name - Required param
 * @param {number} [age] - Optional param
 * @param {number} [age=18] - Optional with default
 * @param {Object} options - Object param
 * @param {string} options.id - Object property
 * @param {string} [options.name] - Optional property
 * @param {...string} items - Rest param
 */
```

---

## Common Patterns

### Function

```javascript
/**
 * Brief description.
 * @param {string} name - The name
 * @param {number} [age=0] - Optional age
 * @returns {string} Greeting message
 * @throws {TypeError} If name is not a string
 * @example
 * greet('Alice'); // "Hello, Alice!"
 */
function greet(name, age) {}
```

### ES2015 Class

```javascript
/**
 * Represents a point.
 * @example
 * const p = new Point(10, 20);
 */
class Point {
	/**
	 * @param {number} x - X coordinate
	 * @param {number} y - Y coordinate
	 */
	constructor(x, y) {
		/** @type {number} */
		this.x = x;
		/** @type {number} */
		this.y = y;
	}

	/**
	 * Get distance to another point.
	 * @param {Point} other
	 * @returns {number}
	 */
	distanceTo(other) {}

	/**
	 * Create from string.
	 * @param {string} str - Format: "x,y"
	 * @returns {Point}
	 * @static
	 */
	static fromString(str) {}
}

/**
 * @augments Point
 */
class Dot extends Point {
	constructor(x, y, width) {
		super(x, y);
		/** @type {number} */
		this.width = width;
	}
}
```

### ES2015 Module

```javascript
/**
 * @module color/mixer
 */

/** Module name constant. */
export const name = 'mixer';

/**
 * Blend two colors.
 * @param {string} color1 - Hex color
 * @param {string} color2 - Hex color
 * @returns {string} Blended color
 */
export function blend(color1, color2) {}

/**
 * @default
 * @class
 */
export default class Mixer {}
```

### CommonJS Module

```javascript
/**
 * @module my/utils
 */

/**
 * Format a date.
 * @param {Date} date
 * @returns {string}
 */
exports.formatDate = function (date) {};

// Or module.exports
module.exports = {
	/**
	 * Parse input.
	 * @param {string} input
	 * @returns {Object}
	 */
	parse: function (input) {},
};
```

### AMD Module

```javascript
/**
 * @module my/shirt
 */
define('my/shirt', function () {
	/**
	 * @exports my/shirt
	 */
	return {
		/** @type {string} */
		color: 'black',

		/** Button the shirt. */
		button: function () {},
	};
});
```

---

## Plugins

### Built-in Plugins

| Plugin                  | Description                    |
| ----------------------- | ------------------------------ |
| `plugins/markdown`      | Parse Markdown in descriptions |
| `plugins/summarize`     | Generate summaries             |
| `plugins/tutorials`     | Include tutorials              |
| `plugins/escapeHtml`    | Escape HTML (XSS prevention)   |
| `plugins/comments-only` | Only files with JSDoc comments |

### Markdown Plugin Config

```json
{
	"plugins": ["plugins/markdown"],
	"markdown": {
		"tags": ["@description", "@param", "@returns", "@throws", "@example"],
		"excludeTags": ["@see"],
		"hardwrap": false,
		"idInHeadings": true
	}
}
```

**Default processed tags**: `@author`, `@classdesc`, `@description`, `@param`,
`@property`, `@returns`, `@see`, `@throws`

### Tutorials

**Config**:

```json
{
	"opts": { "tutorials": "tutorials/" }
}
```

**Hierarchy** (`tutorials/tutorials.json`):

```json
{
	"getting-started": {
		"title": "Getting Started",
		"children": {
			"installation": { "title": "Installation" },
			"quick-start": { "title": "Quick Start" }
		}
	}
}
```

**Supported formats**: `.md`, `.markdown`, `.html`, `.htm`, `.xhtml`, `.xml`

**Link in code**:

```javascript
/**
 * @tutorial getting-started
 * See {@tutorial installation} for setup.
 */
```

---

## Custom Plugins

### Structure

```javascript
exports.handlers = {
	parseBegin: function (e) {}, // e.sourcefiles
	fileBegin: function (e) {}, // e.filename
	beforeParse: function (e) {}, // e.filename, e.source (modifiable)
	jsdocCommentFound: function (e) {}, // e.comment, e.filename
	symbolFound: function (e) {}, // e.code, e.filename
	newDoclet: function (e) {}, // e.doclet
	fileComplete: function (e) {}, // e.filename, e.source
	parseComplete: function (e) {}, // e.doclets (array)
};

exports.astNodeVisitor = {
	visitNode: function (node, e, parser, currentSourceName) {},
};
```

### Plugin Events

| Event               | Properties                | Description                               |
| ------------------- | ------------------------- | ----------------------------------------- |
| `parseBegin`        | `e.sourcefiles`           | Before parsing starts                     |
| `fileBegin`         | `e.filename`              | Start parsing file                        |
| `beforeParse`       | `e.filename`, `e.source`  | Before content parsed (source modifiable) |
| `jsdocCommentFound` | `e.comment`, `e.filename` | JSDoc comment found                       |
| `symbolFound`       | `e.code`, `e.filename`    | Symbol identified                         |
| `newDoclet`         | `e.doclet`                | Doclet created                            |
| `fileComplete`      | `e.filename`, `e.source`  | File parsing complete                     |
| `parseComplete`     | `e.doclets`               | All parsing complete                      |

### Example Plugin

```javascript
var env = require('jsdoc/env');

exports.handlers = {
	parseBegin: function (e) {
		var config = env.conf.myplugin || {};
		this.startTime = Date.now();
	},

	newDoclet: function (e) {
		if (e.doclet.kind === 'function') {
			e.doclet.customProp = 'processed';
		}
	},

	parseComplete: function (e) {
		console.log('Done in ' + (Date.now() - this.startTime) + 'ms');
	},
};
```

---

## Templates

### Default Template Config

```json
{
	"templates": {
		"cleverLinks": true,
		"monospaceLinks": false,
		"useShortNamesInLinks": false,
		"default": {
			"outputSourceFiles": true,
			"staticFiles": {
				"include": [],
				"exclude": []
			}
		}
	}
}
```

### Popular Templates

- **docdash** — Clean, responsive
- **minami** — Minimal
- **DocStrap** — Bootstrap 3
- **better-docs** — Component support

```bash
jsdoc file.js -t node_modules/docdash
```

---

## Package Structure (Monorepo)

| Package         | Description                     |
| --------------- | ------------------------------- |
| `@jsdoc/cli`    | CLI                             |
| `@jsdoc/core`   | Core functionality              |
| `@jsdoc/parse`  | Parsing                         |
| `@jsdoc/tag`    | Tag definitions                 |
| `@jsdoc/ast`    | AST utilities                   |
| `@jsdoc/doclet` | Doclet management               |
| `@jsdoc/salty`  | Data storage (replaces taffydb) |

---

## Best Practices

1. **Place comments immediately before code**
2. **First line = brief summary**
3. **Tag order**: description → `@param` → `@returns` → `@throws` → `@example`
4. **Document all public APIs**
5. **Use type annotations**
6. **Include examples for complex functions**
7. **Use `[name]` for optional params, `[name=default]` for defaults**
8. **Use namepaths correctly**: `#` instance, `.` static, `~` inner
9. **Enable Markdown plugin for rich formatting**
10. **Link related symbols with `@see` and `{@link}`**

---

## Notes

- Comments must use `/**` (not `/*` or `//`)
- Tag names are case-sensitive
- Multiple same-type tags allowed (e.g., multiple `@param`)
- JSDoc 4.0.0+ uses semantic versioning
- `@jsdoc/salty` replaces `taffydb` in JSDoc 4.0.0+

---

## Resources

- **Website**: https://jsdoc.app/
- **GitHub**: https://github.com/jsdoc/jsdoc
- **Playground**: https://jsdoc.app/about-commandline.html
