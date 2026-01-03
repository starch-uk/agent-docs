# Prettier Plugin Apex - AI Agent Reference

**Version:** 1.0.0

> **Quick Info**: Prettier plugin for Apex using Jorje (Salesforce's parser).
> Correctness over configurability. **Source**:
> https://github.com/dangmai/prettier-plugin-apex

---

## Monorepo Structure

| Package                                | Purpose                     |
| -------------------------------------- | --------------------------- |
| `prettier-plugin-apex`                 | Main plugin                 |
| `apex-ast-serializer`                  | Java/Gradle Jorje wrapper   |
| `playground`                           | Web testing interface       |
| `@prettier-apex/apex-ast-serializer-*` | Platform-native executables |

## Core Files

| File             | Role                                |
| ---------------- | ----------------------------------- |
| `parser.ts`      | Source → Jorje AST → enriched AST   |
| `printer.ts`     | AST → Prettier Doc → formatted code |
| `comments.ts`    | Comment attachment/handling         |
| `util.ts`        | Helpers, precedence, AST massage    |
| `constants.ts`   | Node types, operators               |
| `pragma.ts`      | `@format`/`@prettier` detection     |
| `http-server.ts` | Standalone parser server            |

---

## Parser

### Exported Parsers

```typescript
export const parsers = {
  apex: {
    astFormat: 'apex',
    parse,
    locStart,
    locEnd,
    hasPragma,
    preprocess: (text) => text.trim(),
  },
  'apex-anonymous': {
    astFormat: 'apex',
    parse,
    locStart,
    locEnd,
    hasPragma,
    preprocess: (text) => text.trim(),
  },
};
```

### Parser Methods

| Method       | Type                              | Description                                          |
| ------------ | --------------------------------- | ---------------------------------------------------- |
| `parse`      | `(text, options) => Promise<AST>` | **Required**. Source → enriched AST                  |
| `locStart`   | `(node) => number`                | **Required**. Node start index                       |
| `locEnd`     | `(node) => number`                | **Required**. Node end index                         |
| `hasPragma`  | `(text) => boolean`               | Optional. Detects `@format`/`@prettier`              |
| `preprocess` | `(text, options) => string`       | Optional. Transform before parse (default: `trim()`) |

### Parsing Modes

| Mode        | Option Value | Speed   | Notes                              |
| ----------- | ------------ | ------- | ---------------------------------- |
| Java CLI    | `'none'`     | Slowest | Most compatible, requires JRE ≥11  |
| Native      | `'native'`   | Fastest | Default. Falls back to Java        |
| HTTP Server | `'built-in'` | Medium  | Reuses JVM, needs separate process |

### Parse Flow

1. `preprocess` → `text.trim()`
2. External parse → Jorje (via Java/native/HTTP)
3. JSON deserialize → AST object
4. Error check → throw if `parseErrors.length > 0`
5. Comment extract → from `hiddenTokenMap`
6. Enrich locations → `nodeLocationVisitor`
7. Resolve line indices → `lineIndexVisitor`
8. Add metadata → `metadataVisitor`

### Location Functions

```typescript
// Access location
const loc = node.loc ?? node.location;
const start = loc.startIndex;
const end = loc.endIndex;

// Plugin exports
locStart: (node) => node.loc?.startIndex ?? node.location?.startIndex;
locEnd: (node) => node.loc?.endIndex ?? node.location?.endIndex;
```

### External Parse Functions

```typescript
// Spawn (none/native mode)
parseTextWithSpawn(executable: string, text: string, anonymous: boolean): Promise<{stdout, stderr}>
// Args: anonymous ? ['-a'] : []

// HTTP (built-in mode)
parseTextWithHttp(text: string, host: string, port: number, protocol: string, anonymous: boolean): Promise<string>
// POST to ${protocol}://${host}:${port}/api/ast
// Body: { sourceCode: text, anonymous, prettyPrint: false }
```

### AST Enrichment Visitors

Applied via `dfsPostOrderApply(ast, [visitor1, visitor2, ...])` - post-order
DFS.

```typescript
type DfsVisitor<R, C> = {
  accumulator?: (entry, accumulated) => R;
  apply: (node, accumulatedResult, context, childrenContext) => R;
  gatherChildrenContext?: (node, currentContext) => C;
};
```

| Visitor                                     | Purpose                                                   |
| ------------------------------------------- | --------------------------------------------------------- |
| `nodeLocationVisitor(sourceCode, comments)` | Fix/validate node locations                               |
| `lineIndexVisitor(lineIndexes)`             | Add `startLine`, `endLine`, `column`                      |
| `metadataVisitor(emptyLineLocations)`       | Add `trailingEmptyLine`, `forcedHardline`, `ifBlockIndex` |

### Metadata Flags

| Flag                | Purpose                        |
| ------------------- | ------------------------------ |
| `trailingEmptyLine` | Preserve empty line after node |
| `forcedHardline`    | Force line breaks (SOQL/SOSL)  |
| `ifBlockIndex`      | Distinguish `if` vs `else if`  |
| `insideParenthesis` | Flag for parameter nodes       |

### Location Handlers

| Handler                                 | Purpose                           |
| --------------------------------------- | --------------------------------- |
| `handleNodeSurroundedByCharacters`      | Find actual `(` and `)` positions |
| `handleNodeEndedWithCharacter`          | Extend to closing `}`, `)`, `;`   |
| `handleWhereCompoundExpressionLocation` | SOQL WHERE clause                 |
| `handleLimitValueLocation`              | SOQL LIMIT value                  |

---

## Printer

### Exported Printer

```typescript
export const printers = {
  apex: {
    print,
    massageAstNode,
    hasPrettierIgnore,
    insertPragma,
    isBlockComment,
    canAttachComment,
    printComment,
    willPrintOwnComments,
    handleComments: { ownLine, endOfLine, remaining },
  },
};
```

### Printer Methods

| Method                 | Type                                     | Description                  |
| ---------------------- | ---------------------------------------- | ---------------------------- |
| `print`                | `(path, options, print, args?) => Doc`   | **Required**. AST → Doc      |
| `massageAstNode`       | `(original, cloned, parent) => any`      | Normalize for debug-check    |
| `hasPrettierIgnore`    | `(path) => boolean`                      | Check `prettier-ignore`      |
| `insertPragma`         | `(text) => string`                       | Insert `@format` pragma      |
| `isBlockComment`       | `(comment) => boolean`                   | Is `/* */` comment           |
| `canAttachComment`     | `(node, ancestors) => boolean`           | Can attach comment to node   |
| `printComment`         | `(commentPath, options) => Doc`          | Print comment node           |
| `willPrintOwnComments` | `(path) => boolean`                      | Node prints own comments     |
| `printPrettierIgnored` | `(path, options, print, args?) => Doc`   | Format ignored regions       |
| `embed`                | `(path, options) => Fn\|Doc\|null`       | Embedded language formatting |
| `preprocess`           | `(ast, options) => ast`                  | Transform before printing    |
| `getCommentChildNodes` | `(node, options) => nodes[]`             | Comment attachment traversal |
| `getVisitorKeys`       | `(node, nonTraversableKeys) => string[]` | AST traversal keys           |

### Print Dispatch

1. Get `node['@class']`
2. Lookup in `nodeHandler` table
3. If not found → `getParentType()` for parent lookup
4. Call handler → `(path, print, options) => Doc`
5. Apply `handleTrailingEmptyLines()`

### Handler Types

```typescript
type SingleNodeHandler = (
  path: AstPath,
  print: PrintFn,
  options: ParserOptions
) => Doc;
type ChildNodeHandler = (
  childClass: string,
  path: AstPath,
  print: PrintFn,
  options: ParserOptions
) => Doc;
```

### Handler Patterns

```typescript
// Passthrough
handlePassthroughCall('propertyDecl')  // path.call(print, "propertyDecl")

// Inline
() => "break;"
(path, print) => ["throw", " ", path.call(print, "expr"), ";"]

// Child class lookup
(childClass: string) => MODIFIER[childClass]

// Complex
function handleBinaryishExpression(path, print): Doc { /* ... */ }
```

### Doc Builders

From Prettier: `group`, `indent`, `hardline`, `softline`, `line`, `join`,
`align`, `fill`, `ifBreak`

---

## Node Handlers Reference

### Statements

| Type                             | Handler                                         |
| -------------------------------- | ----------------------------------------------- |
| `IF_ELSE_BLOCK`                  | `handleIfElseBlock`                             |
| `IF_BLOCK`                       | `handleIfBlock`                                 |
| `ELSE_BLOCK`                     | `handleElseBlock`                               |
| `EXPRESSION_STATEMENT`           | `handleExpressionStatement`                     |
| `RETURN_STATEMENT`               | `handleReturnStatement`                         |
| `BREAK_STATEMENT`                | `() => "break;"`                                |
| `CONTINUE_STATEMENT`             | `() => "continue;"`                             |
| `THROW_STATEMENT`                | `["throw", " ", path.call(print, "expr"), ";"]` |
| `BLOCK_STATEMENT`                | `handleBlockStatement`                          |
| `VARIABLE_DECLARATION_STATEMENT` | `handlePassthroughCall("variableDecls")`        |
| `STATEMENT`                      | `handleStatement`                               |
| `DML_MERGE_STATEMENT`            | `handleDmlMergeStatement`                       |

### Loops

| Type                   | Handler                    |
| ---------------------- | -------------------------- |
| `WHILE_LOOP`           | `handleWhileLoop`          |
| `DO_LOOP`              | `handleDoLoop`             |
| `FOR_LOOP`             | `handleForLoop`            |
| `FOR_C_STYLE_CONTROL`  | `handleForCStyleControl`   |
| `FOR_ENHANCED_CONTROL` | `handleForEnhancedControl` |
| `FOR_INITS`            | `handleForInits`           |
| `FOR_INIT`             | `handleForInit`            |

### Try-Catch-Finally

| Type                      | Handler                      |
| ------------------------- | ---------------------------- |
| `TRY_CATCH_FINALLY_BLOCK` | `handleTryCatchFinallyBlock` |
| `CATCH_BLOCK`             | `handleCatchBlock`           |
| `FINALLY_BLOCK`           | `handleFinallyBlock`         |

### Switch

| Type               | Handler                         |
| ------------------ | ------------------------------- |
| `SWITCH_STATEMENT` | `handleSwitchStatement`         |
| `VALUE_WHEN`       | `handleValueWhen`               |
| `ELSE_WHEN`        | `handleElseWhen`                |
| `TYPE_WHEN`        | `handleTypeWhen`                |
| `ENUM_CASE`        | `handleEnumCase`                |
| `LITERAL_CASE`     | `handlePassthroughCall("expr")` |

### Declarations

| Type                    | Handler                             |
| ----------------------- | ----------------------------------- |
| `CLASS_DECLARATION`     | `handleClassDeclaration`            |
| `INTERFACE_DECLARATION` | `handleInterfaceDeclaration`        |
| `METHOD_DECLARATION`    | `handleMethodDeclaration`           |
| `VARIABLE_DECLARATION`  | `handleVariableDeclaration`         |
| `ENUM_DECLARATION`      | `handleEnumDeclaration`             |
| `PROPERTY_DECLATION`    | `handlePropertyDeclaration`         |
| `PROPERTY_GETTER`       | `handlePropertyGetterSetter("get")` |
| `PROPERTY_SETTER`       | `handlePropertyGetterSetter("set")` |

### Compilation Units

| Type                         | Handler                         |
| ---------------------------- | ------------------------------- |
| `TRIGGER_DECLARATION_UNIT`   | `handleTriggerDeclarationUnit`  |
| `CLASS_DECLARATION_UNIT`     | `handlePassthroughCall("body")` |
| `ENUM_DECLARATION_UNIT`      | `handlePassthroughCall("body")` |
| `INTERFACE_DECLARATION_UNIT` | `handlePassthroughCall("body")` |
| `ANONYMOUS_BLOCK_UNIT`       | `handleAnonymousBlockUnit`      |

### Block Members

| Type                            | Handler                                  |
| ------------------------------- | ---------------------------------------- |
| `PROPERTY_MEMBER`               | `handlePassthroughCall("propertyDecl")`  |
| `FIELD_MEMBER`                  | `handlePassthroughCall("variableDecls")` |
| `STATEMENT_BLOCK_MEMBER`        | `handleStatementBlockMember()`           |
| `STATIC_STATEMENT_BLOCK_MEMBER` | `handleStatementBlockMember("static")`   |
| `METHOD_MEMBER`                 | `handlePassthroughCall("methodDecl")`    |
| `INNER_CLASS_MEMBER`            | `handlePassthroughCall("body")`          |
| `INNER_ENUM_MEMBER`             | `handlePassthroughCall("body")`          |
| `INNER_INTERFACE_MEMBER`        | `handlePassthroughCall("body")`          |

### Expressions

| Type                          | Handler                                          |
| ----------------------------- | ------------------------------------------------ |
| `BINARY_EXPRESSION`           | `handleBinaryishExpression`                      |
| `BOOLEAN_EXPRESSION`          | `handleBinaryishExpression`                      |
| `ASSIGNMENT_EXPRESSION`       | `handleAssignmentExpression`                     |
| `TERNARY_EXPRESSION`          | `handleTernaryExpression`                        |
| `NESTED_EXPRESSION`           | `handleNestedExpression`                         |
| `VARIABLE_EXPRESSION`         | `handleVariableExpression`                       |
| `JAVA_VARIABLE_EXPRESSION`    | `handleJavaVariableExpression`                   |
| `LITERAL_EXPRESSION`          | `handleLiteralExpression`                        |
| `TRIGGER_VARIABLE_EXPRESSION` | `["Trigger", ".", path.call(print, "variable")]` |
| `THIS_VARIABLE_EXPRESSION`    | `() => "this"`                                   |
| `SUPER_VARIABLE_EXPRESSION`   | `() => "super"`                                  |
| `POSTFIX_EXPRESSION`          | `handlePostfixExpression`                        |
| `PREFIX_EXPRESSION`           | `handlePrefixExpression`                         |
| `CAST_EXPRESSION`             | `handleCastExpression`                           |
| `INSTANCE_OF_EXPRESSION`      | `handleInstanceOfExpression`                     |
| `PACKAGE_VERSION_EXPRESSION`  | `handlePackageVersionExpression`                 |
| `ARRAY_EXPRESSION`            | `handleArrayExpression`                          |
| `CLASS_REF_EXPRESSION`        | `[path.call(print, "type"), ".", "class"]`       |
| `NULL_COALESCING_EXPRESSION`  | `handleNullCoalescingExpression`                 |

### Method Calls

| Type                           | Handler                           |
| ------------------------------ | --------------------------------- |
| `METHOD_CALL_EXPRESSION`       | `handleMethodCallExpression`      |
| `JAVA_METHOD_CALL_EXPRESSION`  | `handleJavaMethodCallExpression`  |
| `SUPER_METHOD_CALL_EXPRESSION` | `handleSuperMethodCallExpression` |
| `THIS_METHOD_CALL_EXPRESSION`  | `handleThisMethodCallExpression`  |
| `NEW_EXPRESSION`               | `handleNewExpression`             |
| `NEW_LIST_INIT`                | `handleNewListInit`               |
| `NEW_MAP_INIT`                 | `handleNewMapInit`                |
| `NEW_SET_INIT`                 | `handleNewSetInit`                |
| `NEW_LIST_LITERAL`             | `handleNewListLiteral`            |
| `NEW_MAP_LITERAL`              | `handleNewMapLiteral`             |
| `NEW_SET_LITERAL`              | `handleNewSetLiteral`             |
| `NEW_STANDARD`                 | `handleNewStandard`               |
| `NEW_KEY_VALUE`                | `handleNewKeyValue`               |
| `SOQL_EXPRESSION`              | `handleSoqlExpression`            |
| `SOSL_EXPRESSION`              | `handleSoslExpression`            |

### Types

| Type             | Handler              |
| ---------------- | -------------------- |
| `TYPE_REF`       | `handleTypeRef`      |
| `ARRAY_TYPE_REF` | `handleArrayTypeRef` |
| `CLASS_TYPE_REF` | `handleClassTypeRef` |

### Annotations

| Type                     | Handler                    |
| ------------------------ | -------------------------- |
| `ANNOTATION`             | `handleAnnotation`         |
| `ANNOTATION_KEY_VALUE`   | `handleAnnotationKeyValue` |
| `ANNOTATION_VALUE`       | `handleAnnotationValue`    |
| `ANNOTATION_TRUE_VALUE`  | `() => "true"`             |
| `ANNOTATION_FALSE_VALUE` | `() => "false"`            |

### Modifiers

| Type       | Handler                                |
| ---------- | -------------------------------------- |
| `MODIFIER` | `(childClass) => MODIFIER[childClass]` |

**Modifier constants:**

```typescript
const MODIFIER = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  PROTECTED: 'protected',
  ABSTRACT: 'abstract',
  FINAL: 'final',
  GLOBAL: 'global',
  INHERITED_SHARING: 'inherited sharing',
  OVERRIDE: 'override',
  STATIC: 'static',
  TEST_METHOD: 'testMethod',
  TRANSIENT: 'transient',
  VIRTUAL: 'virtual',
  WEB_SERVICE: 'webService',
  WITH_SHARING: 'with sharing',
  WITHOUT_SHARING: 'without sharing',
};
```

### DML

| Type                     | Handler                          |
| ------------------------ | -------------------------------- |
| `DML_INSERT_STATEMENT`   | `handleDmlStatement("insert")`   |
| `DML_UPDATE_STATEMENT`   | `handleDmlStatement("update")`   |
| `DML_UPSERT_STATEMENT`   | `handleDmlUpsertStatement`       |
| `DML_DELETE_STATEMENT`   | `handleDmlStatement("delete")`   |
| `DML_UNDELETE_STATEMENT` | `handleDmlStatement("undelete")` |

### SOQL

| Type                          | Handler                                               |
| ----------------------------- | ----------------------------------------------------- |
| `QUERY`                       | `handleQuery`                                         |
| `SELECT_COLUMN`               | `handleSelectColumn`                                  |
| `SELECT_INNER_QUERY`          | `handleSelectInnerQuery`                              |
| `FIELD`                       | `handleField`                                         |
| `FIELD_IDENTIFIER`            | `handleFieldIdentifier`                               |
| `FROM_CLAUSE`                 | `handleFromClause`                                    |
| `FROM_EXPRESSION`             | `handleFromExpression`                                |
| `WHERE_CLAUSE`                | `handleWhereClause`                                   |
| `WHERE_INNER_EXPRESSION`      | `handleWhereInnerExpression`                          |
| `WHERE_OPERATION_EXPRESSION`  | `handleWhereOperationExpression`                      |
| `WHERE_OPERATION_EXPRESSIONS` | `handleWhereOperationExpressions`                     |
| `WHERE_COMPOUND_EXPRESSION`   | `handleWhereCompoundExpression`                       |
| `WHERE_UNARY_EXPRESSION`      | `handleWhereUnaryExpression`                          |
| `WHERE_DISTANCE_EXPRESSION`   | `handleWhereDistanceExpression`                       |
| `ORDER_BY`                    | `handleOrderBy`                                       |
| `ORDER_BY_VALUE`              | `handleOrderByValue`                                  |
| `GROUP_BY`                    | `handleGroupBy`                                       |
| `GROUP_BY_VALUE`              | `handleGroupByValue`                                  |
| `GROUP_BY_TYPE`               | `handleGroupByType`                                   |
| `HAVING_CLAUSE`               | `handleHavingClause`                                  |
| `LIMIT_VALUE`                 | `handleLimitValue`                                    |
| `OFFSET_VALUE`                | `handleOffsetValue`                                   |
| `WITH_VALUE`                  | `handleWithValue`                                     |
| `WITH_DATA_CATEGORY`          | `handleWithDataCategory`                              |
| `DATA_CATEGORY`               | `handleDataCategory`                                  |
| `DATA_CATEGORY_OPERATOR`      | `(childClass) => DATA_CATEGORY_OPERATORS[childClass]` |
| `FOR_CLAUSE`                  | `handleForClause`                                     |
| `UPDATE_STATS_CLAUSE`         | `handleUpdateStatsClause`                             |
| `BIND_CLAUSE`                 | `handleBindClause`                                    |
| `BIND_EXPRESSION`             | `handleBindExpression`                                |

**SOQL Operators:**

```typescript
const QUERY = {
  AND: 'AND',
  OR: 'OR',
  NOT: 'NOT',
  INCLUDES: 'INCLUDES',
  EXCLUDES: 'EXCLUDES',
  LIKE: 'LIKE',
  IN: 'IN',
  NOT_IN: 'NOT IN',
  '=': '=',
  '!=': '!=',
  '<>': '<>',
  '<': '<',
  '>': '>',
  '<=': '<=',
  '>=': '>=',
  ASC: 'ASC',
  DESC: 'DESC',
  NULLS_FIRST: 'NULLS FIRST',
  NULLS_LAST: 'NULLS LAST',
};

const DATA_CATEGORY_OPERATORS = {
  AT: 'AT',
  ABOVE: 'ABOVE',
  BELOW: 'BELOW',
  ABOVE_OR_BELOW: 'ABOVE_OR_BELOW',
};
```

### SOSL

| Type                          | Handler                           |
| ----------------------------- | --------------------------------- |
| `SEARCH`                      | `handleSearch`                    |
| `FIND_CLAUSE`                 | `handleFindClause`                |
| `SEARCH_WITH_CLAUSE`          | `handleSearchWithClause`          |
| `SEARCH_WITH_CLAUSE_VALUE`    | `handleSearchWithClauseValue`     |
| `DIVISION_VALUE`              | `handleDivisionValue`             |
| `RETURNING_CLAUSE`            | `handleReturningClause`           |
| `RETURNING_EXPRESSION`        | `handleReturningExpression`       |
| `RETURNING_SELECT_EXPRESSION` | `handleReturningSelectExpression` |
| `SEARCH_USING_CLAUSE`         | `handleSearchUsingClause`         |

---

## Comments

### Comment Types

| Type    | Detection                                      |
| ------- | ---------------------------------------------- |
| Block   | `node['@class'] === APEX_TYPES.BLOCK_COMMENT`  |
| Inline  | `node['@class'] === APEX_TYPES.INLINE_COMMENT` |
| ApexDoc | Block comment starting with `/**`              |

### Comment Handlers

```typescript
handleComments: {
  ownLine: (comment, text, options, ast, isLast) => boolean,   // Own line
  endOfLine: (comment, text, options, ast, isLast) => boolean, // End of line
  remaining: (comment, text, options, ast, isLast) => boolean  // Between code
}
// Return true = handled; false = let Prettier handle
```

### Comment Properties

```typescript
interface AnnotatedComment {
  value: string; // Comment text
  location: { startIndex; endIndex };
  trailing?: boolean; // After code
  leading?: boolean; // Before code
  printed?: boolean; // Already printed
  enclosingNode?: any; // Containing node
  followingNode?: any; // Next node
  precedingNode?: any; // Previous node
  placement?: string; // "ownLine" | "endOfLine" | "remaining"
  trailingEmptyLine?: boolean; // Preserve empty line after
}
```

### Prettier-Ignore

```typescript
// Detection: exact match "prettier-ignore"
// Formats: // prettier-ignore  OR  /* prettier-ignore */
hasPrettierIgnore: (path) => {
  const comment = path.getValue()?.comments?.find((c) => isPrettierIgnore(c));
  return !!comment;
};
```

### Comment Attachment Constants

```typescript
const ALLOW_DANGLING_COMMENTS = [BLOCK_STATEMENT, CLASS_DECLARATION, INTERFACE_DECLARATION, ENUM_DECLARATION, ...];
```

### Special Comment Cases

| Case           | Handler                                              | Behavior                     |
| -------------- | ---------------------------------------------------- | ---------------------------- |
| Dangling       | `handleDanglingComment`                              | Empty block comments         |
| Block leading  | `handleBlockStatementLeadingComment`                 | Move before `{` inside       |
| Method chain   | `handleLongChainComment`                             | Move to trailing of previous |
| Binary expr    | `handleBinaryishExpressionRightChildTrailingComment` | Attach to right child        |
| Continue/Break | `handleContinueBreakDanglingComment`                 | Move to trailing             |

---

## Options

### Apex-Specific Options

| Option                   | Type                           | Default       | Description       |
| ------------------------ | ------------------------------ | ------------- | ----------------- |
| `apexStandaloneParser`   | `'none'\|'native'\|'built-in'` | `'native'`    | Parser mode       |
| `apexStandaloneHost`     | `string`                       | `'localhost'` | HTTP server host  |
| `apexStandalonePort`     | `number`                       | `2117`        | HTTP server port  |
| `apexStandaloneProtocol` | `'http'\|'https'`              | `'http'`      | HTTP protocol     |
| `apexInsertFinalNewline` | `boolean`                      | `true`        | Add final newline |

### Standard Prettier Options (Apex-Relevant)

| Option          | Type      | Default | Description             |
| --------------- | --------- | ------- | ----------------------- |
| `printWidth`    | `number`  | `80`    | Line wrap width         |
| `tabWidth`      | `number`  | `4`     | Tab spaces              |
| `useTabs`       | `boolean` | `false` | Use tabs                |
| `requirePragma` | `boolean` | `false` | Only format with pragma |
| `insertPragma`  | `boolean` | `false` | Add pragma to output    |

### Options Definition

```typescript
export const options: SupportOptions = {
  apexStandaloneParser: {
    type: 'choice',
    category: 'apex',
    default: 'native',
    choices: [
      { value: 'none', description: 'Java CLI' },
      { value: 'native', description: 'Native executables' },
      { value: 'built-in', description: 'HTTP server' },
    ],
    description: 'Parser mode',
  },
  // ...
};
```

---

## Constants

### APEX_TYPES

Node type constants mapping `@class` strings. Pattern: `apex.jorje.data.ast.*`
or `apex.jorje.parser.impl.*`

```typescript
// Example entries
APEX_TYPES.CLASS_DECLARATION = 'apex.jorje.data.ast.ClassDecl';
APEX_TYPES.METHOD_DECLARATION = 'apex.jorje.data.ast.MethodDecl';
APEX_TYPES.BINARY_EXPRESSION = 'apex.jorje.data.ast.BinaryExpr';
// ... 140+ types
```

**Parent type lookup**: Split on `$` (e.g., `Modifier$Annotation` → parent
`Modifier`)

### Operator Constants

```typescript
const BINARY = { ADDITION: '+', SUBTRACTION: '-', MULTIPLICATION: '*', DIVISION: '/', ... };
const BOOLEAN = { DOUBLE_EQUAL: '==', TRIPLE_EQUAL: '===', NOT_EQUAL: '!=', ... };
const ASSIGNMENT = { EQUALS: '=', ADDITION_EQUALS: '+=', SUBTRACTION_EQUALS: '-=', ... };
const PREFIX = { NEGATIVE: '-', POSITIVE: '+', NOT: '!', BITWISE_NOT: '~', INCREMENT: '++', DECREMENT: '--' };
const POSTFIX = { INCREMENT: '++', DECREMENT: '--' };
```

### Precedence (Apex-specific)

```
1. || (lowest)
2. &&
3. | ^ &
4. == === != !== <> < > <= >=  (SAME tier in Apex!)
5. >> << >>>
6. + -
7. * / % (highest)
```

### Metadata Arrays

```typescript
const ALLOW_TRAILING_EMPTY_LINE = [CLASS_DECLARATION, METHOD_DECLARATION, ...];
const ALLOW_DANGLING_COMMENTS = [BLOCK_STATEMENT, CLASS_DECLARATION, ...];
```

---

## Utilities

### Key Functions

| Function                                        | Purpose                      |
| ----------------------------------------------- | ---------------------------- |
| `isBinaryish(node)`                             | Is binary/boolean expression |
| `isApexDocComment(comment)`                     | Is `/**` ApexDoc             |
| `getPrecedence(op)`                             | Operator precedence level    |
| `getParentType(className)`                      | Parent from `$` split        |
| `findNextUncommentedCharacter(text, idx, char)` | Skip comments when searching |
| `shouldDottedExpressionBreak(path)`             | Method chain breaking logic  |
| `getEmptyLineLocations(src)`                    | Array of empty line numbers  |
| `getLineIndexes(src)`                           | Array of line start indices  |

### AST Massage (Debug-Check)

Normalizes AST for comparison:

```typescript
massageAstNode(original, cloned, parent) {
  // Remove: loc, comments, trailingEmptyLine, forcedHardline, etc.
  // Normalize: scope → uppercase
  // Flatten: WHERE compound expressions, dotted expression names
  // Normalize: ApexDoc whitespace
}
```

---

## Plugin API

### Exported Interface

```typescript
export default {
  languages: [{ name: 'Apex', parsers: ['apex', 'apex-anonymous'], extensions: ['.cls', '.trigger'] }],
  parsers: { apex, 'apex-anonymous' },
  printers: { apex },
  options: { apexStandaloneParser, ... },
  defaultOptions: { tabWidth: 4 }
};
```

### Override Plugin

```typescript
import originalPlugin from 'prettier-plugin-apex';

export default {
  ...originalPlugin,
  parsers: {
    ...originalPlugin.parsers,
    apex: {
      ...originalPlugin.parsers.apex,
      parse: async (text, options) => {
        /* custom */
      },
      preprocess: (text, options) => {
        /* custom */
      },
    },
  },
  printers: {
    ...originalPlugin.printers,
    apex: {
      ...originalPlugin.printers.apex,
      print: (path, options, print) => {
        /* custom */
      },
    },
  },
};
```

---

## Override Points Summary

| Category      | Point                  | Location                                  |
| ------------- | ---------------------- | ----------------------------------------- |
| **Parser**    | `parse`                | `parsers.apex.parse`                      |
|               | `locStart`             | `parsers.apex.locStart`                   |
|               | `locEnd`               | `parsers.apex.locEnd`                     |
|               | `hasPragma`            | `parsers.apex.hasPragma`                  |
|               | `preprocess`           | `parsers.apex.preprocess`                 |
| **Printer**   | `print`                | `printers.apex.print`                     |
|               | `massageAstNode`       | `printers.apex.massageAstNode`            |
|               | `hasPrettierIgnore`    | `printers.apex.hasPrettierIgnore`         |
|               | `insertPragma`         | `printers.apex.insertPragma`              |
|               | `isBlockComment`       | `printers.apex.isBlockComment`            |
|               | `canAttachComment`     | `printers.apex.canAttachComment`          |
|               | `printComment`         | `printers.apex.printComment`              |
|               | `willPrintOwnComments` | `printers.apex.willPrintOwnComments`      |
| **Comments**  | `ownLine`              | `handleComments.ownLine`                  |
|               | `endOfLine`            | `handleComments.endOfLine`                |
|               | `remaining`            | `handleComments.remaining`                |
| **Location**  | handlers               | `parser.ts` - `locationGenerationHandler` |
| **Visitors**  | `nodeLocationVisitor`  | `parser.ts`                               |
|               | `lineIndexVisitor`     | `parser.ts`                               |
|               | `metadataVisitor`      | `parser.ts`                               |
| **Handlers**  | `nodeHandler`          | `printer.ts`                              |
| **Utils**     | `getPrecedence`        | `util.ts`                                 |
|               | `isBinaryish`          | `util.ts`                                 |
|               | `isApexDocComment`     | `util.ts`                                 |
| **Options**   | `options`              | `index.ts`                                |
|               | `defaultOptions`       | `index.ts`                                |
| **Constants** | `APEX_TYPES`           | `constants.ts`                            |
|               | operators              | `constants.ts`                            |

---

## Binary Expression Handling

### Precedence Check

```typescript
function shouldFlatten(parent, node) {
  const parentOp = parent.op?.['@class'];
  const nodeOp = node.op?.['@class'];
  return getPrecedence(parentOp) === getPrecedence(nodeOp);
}
```

### Grouping Logic

```typescript
// Same precedence: flatten
// Different precedence: group child
// Left/right asymmetry: special handling for readability
```

---

## SOQL/SOSL Formatting

- Preserves user line breaks via `forcedHardline`
- Complex WHERE clause: flattening + indentation
- Query literals: special string handling
- Order/Group by: consistent formatting

---

## CLI / Usage

```bash
# Format file
npx prettier --plugin prettier-plugin-apex --write MyClass.cls

# Check formatting
npx prettier --plugin prettier-plugin-apex --check MyClass.cls

# Debug output
npx prettier --plugin prettier-plugin-apex --debug-check MyClass.cls

# Start HTTP server (for built-in mode)
npx start-apex-server --host localhost --port 2117
```

### Config (.prettierrc)

```json
{
  "plugins": ["prettier-plugin-apex"],
  "apexStandaloneParser": "native",
  "apexInsertFinalNewline": true,
  "printWidth": 120,
  "tabWidth": 4
}
```

---

## Best Practices

### Parser

1. Preserve AST structure
2. Throw descriptive errors
3. Ensure location accuracy
4. Use native executables when possible
5. Test with `--debug-check`

### Printer

1. Use Doc builders correctly
2. Handle precedence/parentheses
3. Preserve comments
4. Apply trailing empty lines

### Overrides

1. Call original functions unless replacing
2. Maintain TypeScript types
3. Preserve error handling
4. Test with `--debug-check`
5. Document changes
6. Consider version compatibility

---

## Related Docs

- `docs/JORJE.md` - Jorje AST details
- `docs/PRETTIER.md` - Prettier architecture
- `docs/ESLINT.md` - ESLint reference
- `docs/VITEST.md` - Vitest testing
