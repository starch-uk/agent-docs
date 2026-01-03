# Prettier Reference

**Version:** 1.0.0

> **Architecture**: Parse → AST → Doc → Format. Plugins extend via
> parsers/printers. **Philosophy**: Opinionated, correctness over
> configurability, consistency across codebase.

---

## Core APIs

All APIs are **async**. For sync:
[@prettier/sync](https://github.com/prettier/prettier-synchronized)

| Function            | Signature                                                | Purpose                         |
| ------------------- | -------------------------------------------------------- | ------------------------------- |
| `format`            | `(source, options?) → Promise<string>`                   | Format text                     |
| `formatWithCursor`  | `(source, options) → Promise<{formatted, cursorOffset}>` | Format + track cursor           |
| `check`             | `(source, options?) → Promise<boolean>`                  | Check if formatted              |
| `resolveConfig`     | `(path, options?) → Promise<Options\|null>`              | Resolve config for file         |
| `resolveConfigFile` | `(path?) → Promise<string\|null>`                        | Find config file path           |
| `clearConfigCache`  | `() → Promise<void>`                                     | Clear config cache              |
| `getFileInfo`       | `(file, options?) → Promise<{ignored, inferredParser}>`  | Get file info                   |
| `getSupportInfo`    | `(options?) → Promise<SupportInfo>`                      | Get supported languages/options |
| `version`           | `string`                                                 | Prettier version                |

### Key Options

```typescript
{
  parser: string,              // Required unless filepath provided
  filepath?: string,           // For parser inference
  plugins?: Plugin[],          // Plugins to use
  printWidth?: number,         // Default: 80
  tabWidth?: number,           // Default: 2
  useTabs?: boolean,           // Default: false
  // ...all formatting options
}
```

---

## Debug APIs

Via `prettier.__debug` namespace (internal/testing):

| Function           | Signature                                                         | Purpose                       |
| ------------------ | ----------------------------------------------------------------- | ----------------------------- |
| `parse`            | `(text, options, devOptions?) → {ast, text}`                      | Parse to AST                  |
| `formatAST`        | `(ast, options) → string`                                         | Format AST directly           |
| `formatDoc`        | `(doc, options) → string`                                         | Format Doc to string          |
| `printToDoc`       | `(text, options) → Doc`                                           | Parse+print to Doc            |
| `printDocToString` | `(doc, options) → {formatted, cursorNodeStart?, cursorNodeText?}` | Doc to string                 |
| `printDocToDebug`  | `(doc) → string`                                                  | Doc to readable JS expression |

### CLI Debug Options

```bash
--debug-print-doc      # Print Doc representation
--debug-print-ast      # Print AST as JSON
--debug-print-comments # Print comments array
--debug-check          # Verify idempotency
--debug-repeat N       # Repeat N times, measure duration
--debug-benchmark      # Performance mode
```

---

## CLI

```bash
prettier [options] [file/dir/glob ...]
```

### Exit Codes

| Code | Meaning                 |
| ---- | ----------------------- |
| 0    | Everything formatted    |
| 1    | Unformatted files found |
| 2    | Prettier error          |

### Key Options

| Option                    | Description                |
| ------------------------- | -------------------------- |
| `--write` (`-w`)          | Format in-place            |
| `--check` (`-c`)          | Check formatting           |
| `--list-different` (`-l`) | List unformatted files     |
| `--debug-check`           | Verify code correctness    |
| `--config <path>`         | Specify config file        |
| `--no-config`             | Ignore config files        |
| `--ignore-path <path>`    | Path to ignore file        |
| `--cache`                 | Enable caching             |
| `--cache-strategy`        | `metadata` or `content`    |
| `--stdin-filepath <path>` | Parser inference for stdin |

---

## Plugin API

### Plugin Interface

```typescript
interface Plugin<T = any> {
  languages?: SupportLanguage[];
  parsers?: { [name: string]: Parser<T> };
  printers?: { [astFormat: string]: Printer<T> };
  options?: SupportOptions;
  defaultOptions?: Partial<RequiredOptions>;
}
```

### Parser Interface

```typescript
interface Parser<T = any> {
  parse: (text: string, options: ParserOptions<T>) => T | Promise<T>;
  astFormat: string; // Must match printer key
  locStart: (node: T) => number; // Required
  locEnd: (node: T) => number; // Required
  hasPragma?: (text: string) => boolean; // Detect @format/@prettier
  hasIgnorePragma?: (text: string) => boolean; // Detect @prettier-ignore
  preprocess?: (text: string, options) => string | Promise<string>;
}
```

### Printer Interface

```typescript
interface Printer<T = any> {
  // Required
  print: (
    path: AstPath<T>,
    options: ParserOptions<T>,
    print: (path) => Doc,
    args?
  ) => Doc;

  // Optional
  embed?: (
    path,
    options
  ) => ((textToDoc, print, path, options) => Doc | Promise<Doc>) | Doc | null;
  preprocess?: (ast: T, options) => T | Promise<T>;
  massageAstNode?: (original, cloned, parent) => any;
  hasPrettierIgnore?: (path: AstPath<T>) => boolean;
  printPrettierIgnored?: (path, options, print, args?) => Doc;
  insertPragma?: (text: string) => string;

  // Comment handling
  canAttachComment?: (node: T, ancestors: T[]) => boolean;
  isBlockComment?: (node: T) => boolean;
  printComment?: (commentPath: AstPath<T>, options) => Doc;
  willPrintOwnComments?: (path: AstPath<T>) => boolean;
  getCommentChildNodes?: (node: T, options) => T[] | undefined;
  handleComments?: {
    ownLine?: (comment, text, options, ast, isLast) => boolean;
    endOfLine?: (comment, text, options, ast, isLast) => boolean;
    remaining?: (comment, text, options, ast, isLast) => boolean;
  };

  // Traversal
  getVisitorKeys?: (node: T, nonTraversableKeys: Set<string>) => string[];

  // Features
  features?: {
    experimental_avoidAstMutation?: boolean;
    experimental_frontMatterSupport?: { massageAstNode?; embed?; print? };
  };
}
```

### SupportLanguage

```typescript
interface SupportLanguage {
  name: string; // Required
  parsers: string[]; // Required
  extensions?: string[]; // e.g., [".cls", ".trigger"]
  filenames?: string[]; // e.g., ["Dockerfile"]
  aliases?: string[];
  interpreters?: string[]; // Shebang detection
  group?: string;
  tmScope?: string;
  aceMode?: string;
  codemirrorMode?: string;
  codemirrorMimeType?: string;
  linguistLanguageId?: number;
  vscodeLanguageIds?: string[];
  isSupported?: (options: { filepath: string }) => boolean;
}
```

---

## AstPath API

```typescript
class AstPath<T = any> {
  // Properties
  get key(): string | null; // Property key in parent
  get index(): number | null; // Array index if in array
  get node(): T; // Current node
  get parent(): T | null; // Direct parent
  get grandparent(): T | null;
  get isInArray(): boolean;
  get siblings(): T[] | null;
  get next(): T | null;
  get previous(): T | null;
  get isFirst(): boolean;
  get isLast(): boolean;
  get isRoot(): boolean;
  get root(): T;
  get ancestors(): T[];

  // Methods
  call<U>(callback: (path) => U, ...props: PropertyKey[]): U;
  each(callback: (path) => void, ...props: PropertyKey[]): void;
  map<U>(callback: (path) => U, ...props: PropertyKey[]): U[];
  callParent<U>(callback: (path) => U, count?: number): U;
  getNode(count?: number): T | null;
  getParentNode(count?: number): T | null;
  match(...predicates: ((node, key, index) => boolean)[]): boolean;
}
```

### Usage Examples

```typescript
// Print child property
path.call(print, 'body');

// Print nested property
path.call(print, 'dottedExpr', 'value');

// Map over array property
path.map(print, 'parameters'); // Returns Doc[]

// Get parent node
const parent = path.getParentNode();

// Check ancestry
path.match((node) => node.type === 'Function');
```

---

## Doc Builders

Via `prettier.doc.builders`:

### Line Breaks

| Builder       | Description                         |
| ------------- | ----------------------------------- |
| `line`        | Soft break (breaks if group breaks) |
| `softline`    | Soft break (prefer single line)     |
| `hardline`    | Always breaks                       |
| `literalline` | Preserves indentation               |
| `breakParent` | Forces parent group to break        |

### Grouping & Indentation

| Builder            | Signature                      | Description                 |
| ------------------ | ------------------------------ | --------------------------- |
| `group`            | `(contents, options?) → Group` | Group with break behavior   |
| `conditionalGroup` | `(states[], options?) → Doc`   | Try states until one fits   |
| `indent`           | `(contents) → Indent`          | Add one indent level        |
| `dedent`           | `(contents) → Doc`             | Remove one indent level     |
| `dedentToRoot`     | `(contents) → Doc`             | Remove all indentation      |
| `align`            | `(width, contents) → Align`    | Align to column/string/root |
| `markAsRoot`       | `(contents) → Align`           | Mark alignment root         |

### Conditional

| Builder         | Signature                                              | Description                  |
| --------------- | ------------------------------------------------------ | ---------------------------- |
| `ifBreak`       | `(breakContents, flatContents?, {groupId?}) → IfBreak` | Content based on break state |
| `indentIfBreak` | `(contents, {groupId, negate?}) → IndentIfBreak`       | Indent if group breaks       |

### Layout

| Builder              | Signature                     | Description              |
| -------------------- | ----------------------------- | ------------------------ |
| `join`               | `(separator, docs[]) → Doc[]` | Join with separator      |
| `fill`               | `(docs[]) → Fill`             | Wrap like text           |
| `lineSuffix`         | `(contents) → LineSuffix`     | Append after line break  |
| `lineSuffixBoundary` | constant                      | Boundary for line suffix |
| `trim`               | constant                      | Trim whitespace          |
| `cursor`             | constant                      | Cursor position marker   |

### Group Options

```typescript
interface GroupOptions {
  id?: symbol; // For ifBreak/indentIfBreak reference
  shouldBreak?: boolean; // Force break
  expandedStates?: Doc[]; // Alternative states
}
```

### Doc Type

```typescript
type Doc = string | Doc[] | Group | Indent | Align | Line | IfBreak | Fill | ...
```

---

## Doc Utilities

Via `prettier.doc.utils`:

| Function                | Signature                                               | Description              |
| ----------------------- | ------------------------------------------------------- | ------------------------ |
| `willBreak`             | `(doc) → boolean`                                       | Check if doc will break  |
| `canBreak`              | `(doc) → boolean`                                       | Check if doc can break   |
| `traverseDoc`           | `(doc, onEnter?, onExit?, traverseConditional?) → void` | Traverse doc tree        |
| `findInDoc`             | `(doc, callback, defaultValue) → T`                     | Find value in doc        |
| `mapDoc`                | `(doc, callback) → T`                                   | Map doc tree             |
| `removeLines`           | `(doc) → Doc`                                           | Remove line breaks       |
| `stripTrailingHardline` | `(doc) → Doc`                                           | Remove trailing hardline |
| `replaceEndOfLine`      | `(doc, replacement?) → Doc`                             | Replace end of line      |

---

## Doc Printer

```typescript
printDocToString(doc: Doc, options: {
  printWidth: number;
  tabWidth: number;
  useTabs: boolean;
  parentParser?: string;
}): { formatted: string; cursorNodeStart?: number; cursorNodeText?: string }
```

---

## Options

### RequiredOptions

| Option                       | Type                                    | Default     | Description               |
| ---------------------------- | --------------------------------------- | ----------- | ------------------------- |
| `printWidth`                 | number                                  | 80          | Max line width            |
| `tabWidth`                   | number                                  | 2           | Spaces per tab            |
| `useTabs`                    | boolean                                 | false       | Use tabs                  |
| `semi`                       | boolean                                 | true        | Add semicolons            |
| `singleQuote`                | boolean                                 | false       | Use single quotes         |
| `jsxSingleQuote`             | boolean                                 | false       | Single quotes in JSX      |
| `trailingComma`              | `'none'\|'es5'\|'all'`                  | 'all'       | Trailing commas           |
| `bracketSpacing`             | boolean                                 | true        | Spaces in object literals |
| `bracketSameLine`            | boolean                                 | false       | `>` on same line in JSX   |
| `arrowParens`                | `'avoid'\|'always'`                     | 'always'    | Arrow function parens     |
| `proseWrap`                  | `'always'\|'never'\|'preserve'`         | 'preserve'  | Prose wrapping            |
| `htmlWhitespaceSensitivity`  | `'css'\|'strict'\|'ignore'`             | 'css'       | HTML whitespace           |
| `endOfLine`                  | `'auto'\|'lf'\|'crlf'\|'cr'`            | 'lf'        | Line ending               |
| `quoteProps`                 | `'as-needed'\|'consistent'\|'preserve'` | 'as-needed' | Object prop quotes        |
| `embeddedLanguageFormatting` | `'auto'\|'off'`                         | 'auto'      | Embedded languages        |
| `singleAttributePerLine`     | boolean                                 | false       | HTML/JSX attributes       |
| `parser`                     | string                                  | —           | Parser name               |
| `filepath`                   | string                                  | —           | File path (for inference) |
| `plugins`                    | Plugin[]                                | []          | Plugins                   |
| `requirePragma`              | boolean                                 | false       | Require @format pragma    |
| `insertPragma`               | boolean                                 | false       | Insert pragma             |

### ParserOptions (extends RequiredOptions)

| Property         | Type                | Description      |
| ---------------- | ------------------- | ---------------- |
| `locStart`       | `(node) → number`   | Node start index |
| `locEnd`         | `(node) → number`   | Node end index   |
| `originalText`   | string              | Original source  |
| `getVisitorKeys` | `(node) → string[]` | Keys to traverse |
| `printer`        | Printer             | Printer instance |

### SupportOption

```typescript
interface SupportOption {
  type: 'int' | 'string' | 'boolean' | 'choice' | 'path';
  category: string;
  default?: Value | Array<{ value: Value }>;
  description?: string;
  deprecated?: true | string;
  range?: { start: number; end: number };
  choices?: Array<{ value: Value; description: string }>;
  array?: boolean;
  oppositeDescription?: string;
}
```

---

## Config

### Config Interface

```typescript
interface Config extends Options {
  overrides?: Array<{
    files: string | string[]; // Glob patterns
    excludeFiles?: string | string[];
    options?: Options;
  }>;
}
```

### Resolution Order

1. `package.json` → `"prettier"` key
2. `.prettierrc` (JSON/YAML)
3. `.prettierrc.json`, `.prettierrc.yml`, `.prettierrc.yaml`,
   `.prettierrc.json5`
4. `.prettierrc.js`, `prettier.config.js`, `.prettierrc.ts`,
   `prettier.config.ts`
5. `.prettierrc.mjs`, `prettier.config.mjs`, `.prettierrc.mts`,
   `prettier.config.mts`
6. `.prettierrc.cjs`, `prettier.config.cjs`, `.prettierrc.cts`,
   `prettier.config.cts`
7. `.prettierrc.toml`

Search walks up directory tree. No global config.

### EditorConfig Mapping

| EditorConfig              | Prettier     |
| ------------------------- | ------------ |
| `end_of_line`             | `endOfLine`  |
| `indent_style`            | `useTabs`    |
| `indent_size`/`tab_width` | `tabWidth`   |
| `max_line_length`         | `printWidth` |

---

## Utilities

Via `prettier.util`:

### String

| Function           | Signature                                | Description                  |
| ------------------ | ---------------------------------------- | ---------------------------- |
| `getStringWidth`   | `(text) → number`                        | Visual width (Unicode-aware) |
| `getAlignmentSize` | `(text, tabWidth, startIndex?) → number` | Alignment size               |
| `getIndentSize`    | `(value, tabWidth) → number`             | Indent size in spaces        |
| `makeString`       | `(rawText, quote, unescape?) → string`   | Escape for quotes            |

### Skip Functions

All return `number | false`:

| Function                                            | Purpose                         |
| --------------------------------------------------- | ------------------------------- |
| `skipWhitespace(text, idx, {backwards?})`           | Skip whitespace                 |
| `skipSpaces(text, idx, {backwards?})`               | Skip spaces                     |
| `skipNewline(text, idx, {backwards?})`              | Skip newline                    |
| `skipInlineComment(text, idx)`                      | Skip `//` comment               |
| `skipTrailingComment(text, idx)`                    | Skip trailing comment           |
| `skipToLineEnd(text, idx, {backwards?})`            | Skip to line end                |
| `skipEverythingButNewLine(text, idx, {backwards?})` | Skip to newline                 |
| `skip(chars)`                                       | Returns skip function for chars |

### Check Functions

| Function              | Signature                   | Returns |
| --------------------- | --------------------------- | ------- |
| `hasNewline`          | `(text, idx, {backwards?})` | boolean |
| `hasNewlineInRange`   | `(text, start, end)`        | boolean |
| `hasSpaces`           | `(text, idx, {backwards?})` | boolean |
| `isNextLineEmpty`     | `(text, idx)`               | boolean |
| `isPreviousLineEmpty` | `(text, idx)`               | boolean |

### Character

| Function                                  | Signature              | Returns         |
| ----------------------------------------- | ---------------------- | --------------- |
| `getNextNonSpaceNonCommentCharacterIndex` | `(text, idx)`          | number \| false |
| `getNextNonSpaceNonCommentCharacter`      | `(text, idx)`          | string          |
| `getMaxContinuousCount`                   | `(text, searchString)` | number          |

### Quote

| Function            | Signature           | Returns        |
| ------------------- | ------------------- | -------------- |
| `getPreferredQuote` | `(text, preferred)` | `'"'` or `"'"` |

### Comment Attachment

| Function             | Signature                 | Description          |
| -------------------- | ------------------------- | -------------------- |
| `addLeadingComment`  | `(node, comment)`         | Add leading comment  |
| `addTrailingComment` | `(node, comment)`         | Add trailing comment |
| `addDanglingComment` | `(node, comment, marker)` | Add dangling comment |

---

## Architecture

### Formatting Pipeline

1. **Normalize** → BOM, EOL, indexes
2. **Check pragmas** → requirePragma, checkIgnorePragma
3. **Parse** → `parser.preprocess()` → `parser.parse()` → AST
4. **Prepare** → Extract comments, attach to nodes, `printer.preprocess()`
5. **Massage** → `printer.massageAstNode()` clones/transforms AST
6. **Embed** → `printer.embed()` processes embedded languages
7. **Print** → `printer.print()` → Doc (with caching)
8. **Format** → `printDocToString()` → string
9. **Insert pragma** → `printer.insertPragma()` if option set
10. **Restore BOM**

### Plugin Loading

- String/URL paths resolved via import
- Plugins cached by name + cwd
- Last plugin wins (override order)
- Parser/Printer can be lazy (function returns Parser/Printer)

### Parser Resolution

1. Search plugins in reverse order
2. Match by parser name
3. Parser must have matching printer via `astFormat`

### Parser Inference

From filepath: extension → filename → shebang → isSupported function

---

## Symbols

### Global (Symbol.for)

| Symbol                                   | Purpose                       |
| ---------------------------------------- | ----------------------------- |
| `Symbol.for("comments")`                 | All comments array in options |
| `Symbol.for("printedComments")`          | Set of printed comments       |
| `Symbol.for("PRETTIER_IS_FRONT_MATTER")` | Front matter node marker      |

### Internal

| Symbol             | Purpose                             |
| ------------------ | ----------------------------------- |
| `Symbol("cursor")` | Cursor marker in diff algorithm     |
| Group ID Symbols   | For ifBreak/indentIfBreak reference |

---

## Ignored Regions

### Pragma Comments

| Language      | Format                     |
| ------------- | -------------------------- |
| JavaScript    | `// prettier-ignore`       |
| JSX           | `{/* prettier-ignore */}`  |
| HTML/Markdown | `<!-- prettier-ignore -->` |
| CSS           | `/* prettier-ignore */`    |
| YAML/GraphQL  | `# prettier-ignore`        |
| Handlebars    | `{{! prettier-ignore }}`   |

### Special

- HTML attributes: `<!-- prettier-ignore-attribute -->` or
  `<!-- prettier-ignore-attribute (name) -->`
- Markdown range: `<!-- prettier-ignore-start -->` ...
  `<!-- prettier-ignore-end -->`
- `.prettierignore` uses gitignore syntax

### Default Ignores

`.git`, `.jj`, `.sl`, `.svn`, `.hg`, `node_modules`

---

## Comment Handling

### Flow

1. Extract from `AST.comments` array
2. Attach via `decorateComment` (leading, trailing, dangling)
3. Store in `options[Symbol.for("comments")]`
4. Track printed in `options[Symbol.for("printedComments")]`
5. Print via `printComments()` after node (unless `willPrintOwnComments`)

### handleComments Parameters

Each handler receives:

```typescript
(
  comment: {
    value: string;
    location: { startIndex: number; endIndex: number };
    trailing?: boolean;
    leading?: boolean;
    printed?: boolean;
    enclosingNode?: any;
    followingNode?: any;
    precedingNode?: any;
    placement: 'ownLine' | 'endOfLine' | 'remaining';
  },
  text: string,
  options: ParserOptions,
  ast: any,
  isLastComment: boolean
) => boolean; // true = handled, false = let Prettier handle
```

---

## Error Types

| Error                  | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `ConfigError`          | Configuration errors (parser/printer not found) |
| `UndefinedParserError` | Parser could not be inferred                    |
| `InvalidDocError`      | Invalid document structure                      |

---

## Browser/Standalone

```typescript
import * as prettier from 'prettier/standalone';
import * as apexPlugin from 'prettier-plugin-apex';

await prettier.format(code, {
  parser: 'apex',
  plugins: [apexPlugin], // REQUIRED in standalone
});
```

Plugins: `https://unpkg.com/prettier@VERSION/plugins/PLUGIN.mjs`

---

## Patterns

### Plugin Structure

```typescript
const plugin: Plugin = {
  languages: [{ name: 'MyLang', parsers: ['my-parser'], extensions: ['.ext'] }],
  parsers: {
    'my-parser': {
      parse: (text, options) => parseToAST(text),
      astFormat: 'my-ast',
      locStart: (node) => node.start,
      locEnd: (node) => node.end,
    },
  },
  printers: {
    'my-ast': {
      print: (path, options, print) => {
        const node = path.node;
        return doc.builders.group([
          /* ... */
        ]);
      },
    },
  },
  options: {
    myOption: {
      type: 'boolean',
      category: 'Format',
      default: false,
      description: 'My option',
    },
  },
};
```

### Print Function

```typescript
print: (path, options, print) => {
  const node = path.node;
  if (node.type === 'TypeA') return printTypeA(path, options, print);
  return print('children');
};
```

### Embed Function

```typescript
embed: (path, options) => {
  const node = path.node;
  if (isEmbeddedCode(node)) {
    return async (textToDoc, print, path, options) => {
      return await textToDoc(extractCode(node), { parser: 'javascript' });
    };
  }
  return null;
};
```

---

## Formatting Behavior Notes

| Behavior                     | Rule                                                              |
| ---------------------------- | ----------------------------------------------------------------- |
| **Quotes**                   | Fewest escapes wins; tie → double quotes                          |
| **Empty lines**              | Preserved, multiple collapsed to one, removed at block boundaries |
| **Multi-line objects**       | Preserved if newline exists between `{` and first key             |
| **Print width**              | Guideline, not hard rule; some exceptions allowed                 |
| **Comments**                 | Content unchanged, placement preserved roughly                    |
| **What Prettier doesn't do** | No transforms (quote conversion, string breaking, sorting)        |
