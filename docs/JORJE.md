# Jorje AST Reference

> **Quick Info**: Salesforce's Java-based Apex parser. Consumed via
> `prettier-plugin-apex`. All nodes have `@class` property as type identifier.

---

## Node Structure

```typescript
interface ApexNode {
	'@class': string; // Required: node type (e.g., "apex.jorje.data.ast.Identifier")
	[key: string]: unknown; // Additional properties vary by type
}

// Access patterns
const nodeClass = node['@class'];
const safeClass = node?.['@class'];
```

**Package patterns:**

- `apex.jorje.data.ast.*` — Main AST nodes (expressions, declarations,
  statements)
- `apex.jorje.parser.impl.*` — Parser implementation (comments, tokens)
- `$` separator — Java inner classes (e.g., `NewObject$NewListLiteral`)

---

## Complete Node Types

### Collections

| Apex             | `@class`                                       | Properties        |
| ---------------- | ---------------------------------------------- | ----------------- |
| `new List<T>{}`  | `apex.jorje.data.ast.NewObject$NewListLiteral` | `types`, `values` |
| `new Set<T>{}`   | `apex.jorje.data.ast.NewObject$NewSetLiteral`  | `types`, `values` |
| `new Map<K,V>{}` | `apex.jorje.data.ast.NewObject$NewMapLiteral`  | `types`, `pairs`  |
| Map key-value    | `apex.jorje.data.ast.MapLiteralKeyValue`       | `key`, `value`    |

### Annotations

| Apex              | `@class`                                                     | Properties                        |
| ----------------- | ------------------------------------------------------------ | --------------------------------- |
| `@Name`           | `apex.jorje.data.ast.Modifier$Annotation`                    | `name` (Identifier), `parameters` |
| `key=value` param | `apex.jorje.data.ast.AnnotationParameter$AnnotationKeyValue` | `key`, `value`                    |
| String param      | `apex.jorje.data.ast.AnnotationParameter$AnnotationString`   | `value` (string)                  |
| `true` value      | `apex.jorje.data.ast.AnnotationValue$TrueAnnotationValue`    | —                                 |
| `false` value     | `apex.jorje.data.ast.AnnotationValue$FalseAnnotationValue`   | —                                 |
| String value      | `apex.jorje.data.ast.AnnotationValue$StringAnnotationValue`  | `value` (string)                  |

### Identifiers & Types

| Apex               | `@class`                               | Properties                  |
| ------------------ | -------------------------------------- | --------------------------- |
| Identifier `myVar` | `apex.jorje.data.ast.Identifier`       | `value` (string)            |
| Type ref `String`  | `apex.jorje.data.ast.TypeRef`          | `types` OR `names` (arrays) |
| SOQL from          | `apex.jorje.data.ast.FromExpr`         | (SOQL structure)            |
| Variable type      | `apex.jorje.data.ast.VariableTypeNode` | (type declarations)         |

### Declarations

| Apex      | `@class`                            | Properties                                              |
| --------- | ----------------------------------- | ------------------------------------------------------- |
| Method    | `apex.jorje.data.ast.MethodDecl`    | `name`, `modifiers`, `parameters`, `returnType`, `body` |
| Class     | `apex.jorje.data.ast.ClassDecl`     | `name`, `modifiers`, `extends`, `implements`, `body`    |
| Interface | `apex.jorje.data.ast.InterfaceDecl` | `name`, `modifiers`, `extends`, `body`                  |
| Field     | `apex.jorje.data.ast.FieldDecl`     | `name`, `modifiers`, `type`, `initializer`              |

### Modifiers

| Modifier | `@class` Pattern                                           |
| -------- | ---------------------------------------------------------- |
| Access   | `Modifier$Public`, `$Private`, `$Protected`, `$Global`     |
| Behavior | `$Static`, `$Final`, `$Abstract`, `$Virtual`, `$Transient` |
| Sharing  | `$WithSharing`, `$WithoutSharing`                          |
| Other    | `$Override`, `$WebService`, `$TestMethod`                  |

### Comments

| Type             | `@class`                                           | Properties       |
| ---------------- | -------------------------------------------------- | ---------------- |
| Block `/* */`    | `apex.jorje.parser.impl.HiddenTokens$BlockComment` | `value` (string) |
| Inline `//`      | Pattern: includes `InlineComment`                  | `value` (string) |
| ApexDoc `/** */` | Same as Block (detected by content)                | `value` (string) |

### Expressions

| Apex    | `@class`                          | Properties       |
| ------- | --------------------------------- | ---------------- |
| Literal | `apex.jorje.data.ast.LiteralExpr` | `value` (varies) |

---

## Property Patterns

| Category         | Properties                                                                       |
| ---------------- | -------------------------------------------------------------------------------- |
| **Collections**  | `values` (array), `pairs` (array), `types` (array)                               |
| **Identifiers**  | `value` (string)                                                                 |
| **Annotations**  | `name` (Identifier), `parameters` (array), `key`, `value`                        |
| **Types**        | `types` (array) OR `names` (array) — not both                                    |
| **Declarations** | `name`, `modifiers`, `body`, `parameters`, `returnType`, `extends`, `implements` |
| **Comments**     | `value` (full text including delimiters)                                         |

---

## Detection Patterns

### Type Detection Functions

```typescript
// Constants
const LIST_CLASS = 'apex.jorje.data.ast.NewObject$NewListLiteral';
const SET_CLASS = 'apex.jorje.data.ast.NewObject$NewSetLiteral';
const MAP_CLASS = 'apex.jorje.data.ast.NewObject$NewMapLiteral';
const IDENTIFIER_CLASS = 'apex.jorje.data.ast.Identifier';
const TYPEREF_CLASS = 'apex.jorje.data.ast.TypeRef';
const ANNOTATION_CLASS = 'apex.jorje.data.ast.Modifier$Annotation';
const BLOCK_COMMENT = 'apex.jorje.parser.impl.HiddenTokens$BlockComment';

// Safe class access
const getNodeClass = (node: ApexNode): string => node['@class'];
const getNodeClassOptional = (node: unknown): string | undefined =>
	node && typeof node === 'object' && '@class' in node
		? (node as ApexNode)['@class']
		: undefined;

// Type guards
const isIdentifier = (node: ApexNode): node is ApexIdentifier =>
	node['@class'] === IDENTIFIER_CLASS ||
	node['@class']?.includes('Identifier');

const isListOrSet = (node: ApexNode): boolean =>
	node['@class'] === LIST_CLASS || node['@class'] === SET_CLASS;

const isCollection = (node: ApexNode): boolean =>
	node['@class'] === LIST_CLASS ||
	node['@class'] === SET_CLASS ||
	node['@class'] === MAP_CLASS;

const isCommentNode = (node: unknown): boolean => {
	const cls = getNodeClassOptional(node);
	return (
		cls === BLOCK_COMMENT ||
		cls?.includes('BlockComment') ||
		cls?.includes('InlineComment')
	);
};

const isTypeRef = (node: ApexNode): boolean =>
	node['@class'] === TYPEREF_CLASS || node['@class']?.includes('TypeRef');
```

### Pattern Matching Rules

| Detection   | Method                     | Example                                                                               |
| ----------- | -------------------------- | ------------------------------------------------------------------------------------- |
| Collections | **Exact match only**       | `cls === LIST_CLASS`                                                                  |
| Identifiers | Exact first, then includes | `cls === ID_CLASS \|\| cls?.includes('Identifier')`                                   |
| Comments    | Includes pattern           | `cls?.includes('BlockComment')`                                                       |
| Types       | Includes with exclusion    | `cls?.includes('TypeRef') \|\| (cls?.includes('Type') && !cls?.includes('Variable'))` |
| Modifiers   | Includes pattern           | `cls?.includes('Static')`                                                             |

**Priority**: Exact match → Partial match (fallback only)

---

## Type Context Detection

```typescript
const isInTypeContext = (path: AstPath<ApexNode>): boolean => {
	const { key, stack } = path;

	// Direct type context keys
	if (
		key === 'types' ||
		key === 'type' ||
		key === 'typeref' ||
		key === 'returntype' ||
		key === 'names'
	) {
		return true;
	}

	// Check parent in stack (offset -2)
	if (Array.isArray(stack) && stack.length >= 2) {
		const parent = stack[stack.length - 2] as ApexNode;
		const parentClass = getNodeClassOptional(parent);

		if (
			parentClass?.includes('TypeRef') ||
			(parentClass?.includes('Type') &&
				!parentClass?.includes('Variable')) ||
			parentClass?.includes('FromExpr')
		) {
			return true;
		}

		if ('types' in parent && Array.isArray(parent.types)) {
			return true;
		}
	}
	return false;
};
```

---

## Path API

| Method                | Purpose              | Example                                   |
| --------------------- | -------------------- | ----------------------------------------- |
| `path.getNode()`      | Get current node     | `const node = path.getNode() as ApexNode` |
| `path.key`            | Current property key | `if (path.key === 'types')`               |
| `path.stack`          | Parent nodes array   | `stack[stack.length - 2]` = parent        |
| `path.map(fn, prop)`  | Map over array prop  | `path.map(print, 'values' as never)`      |
| `path.call(fn, prop)` | Access nested prop   | `path.call(print, 'key' as never)`        |

### Path Patterns

```typescript
// Map collection values
const printedValues = path.map(print, 'values' as never);

// Map map pairs
const printedPairs = path.map(
	(pairPath) => [
		pairPath.call(print, 'key' as never),
		' => ',
		pairPath.call(print, 'value' as never),
	],
	'pairs' as never,
);

// Access parent
const parent = path.stack[path.stack.length - 2] as ApexNode;

// Type assertion for unknown properties
path.map(print, 'values' as never); // Use 'as never' when prop not in type def
```

---

## Property Mutation Pattern

**Always restore mutations** — nodes may be cached/reused:

```typescript
function normalizeIdentifier(
	node: ApexIdentifier,
	print: PrintFn,
	path: AstPath,
): Doc {
	const original = node.value;
	const normalized = normalizeTypeName(original);

	if (normalized === original) return print(path);

	try {
		(node as { value: string }).value = normalized; // Mutate
		return print(path);
	} finally {
		(node as { value: string }).value = original; // Always restore
	}
}
```

---

## Common Code Patterns

### Collection Handling

```typescript
if (node['@class'] === LIST_CLASS || node['@class'] === SET_CLASS) {
	const values = (node as ApexListInitNode).values;
	// values is array of nodes
}

if (node['@class'] === MAP_CLASS) {
	const pairs = (node as ApexMapInitNode).pairs;
	// pairs is array of MapLiteralKeyValue nodes
}
```

### Annotation Handling

```typescript
if (node['@class'] === ANNOTATION_CLASS) {
	const ann = node as ApexAnnotationNode;
	const name = ann.name.value; // Identifier.value
	const params = ann.parameters; // Array

	params.forEach((param) => {
		if (
			param['@class'] ===
			'apex.jorje.data.ast.AnnotationParameter$AnnotationKeyValue'
		) {
			const key = (param as ApexAnnotationKeyValue).key.value;
			const value = (param as ApexAnnotationKeyValue).value;
		}
	});
}
```

### TypeRef Handling

```typescript
if (isTypeRef(node)) {
	// TypeRef has EITHER 'types' OR 'names', not both
	if ('types' in node && Array.isArray(node.types)) {
		// Generic types: List<String>, Map<K,V>
		const types = path.map(print, 'types' as never);
	}
	if ('names' in node && Array.isArray(node.names)) {
		// Interface implementations: implements I1, I2
		const names = path.map(print, 'names' as never);
	}
}
```

### Comment & ApexDoc Handling

```typescript
if (isCommentNode(node)) {
	const comment = node as { value?: string };
	const text = comment.value; // Full text including /** and */

	// ApexDoc detection (multi-line with * prefix)
	const isApexDoc = (text: string): boolean => {
		const lines = text.split('\n');
		return (
			lines.length > 1 &&
			lines.slice(1, -1).every((line) => line.trim()[0] === '*')
		);
	};

	// Code block detection for embed
	if (text?.includes('{@code')) {
		// Extract and format code blocks
	}
}
```

### Modifier Detection

```typescript
const modifiers = (decl as { modifiers?: ApexNode[] }).modifiers;

const hasStatic = modifiers?.some((m) => m['@class']?.includes('Static'));
const hasVirtual = modifiers?.some((m) => m['@class']?.includes('Virtual'));
const isPublic = modifiers?.some((m) => m['@class']?.includes('Public'));
```

### Stack Nesting Detection

```typescript
const isNestedInCollection = (path: AstPath<ApexNode>): boolean => {
	for (const parent of path.stack) {
		if (typeof parent === 'object' && parent && '@class' in parent) {
			const cls = (parent as ApexNode)['@class'];
			if (cls === LIST_CLASS || cls === SET_CLASS || cls === MAP_CLASS)
				return true;
		}
	}
	return false;
};
```

---

## Embed Function Pattern

For async formatting (e.g., code blocks in comments):

```typescript
const customEmbed = (path: AstPath<ApexNode>, options: ParserOptions) => {
	const node = path.getNode() as ApexNode;

	if (
		isCommentNode(node) &&
		'value' in node &&
		typeof node.value === 'string'
	) {
		if (node.value.includes('{@code')) {
			return async (textToDoc, print, path, options) => {
				// Extract code from comment.value
				// Format with textToDoc (recursive Prettier)
				// Store in Map for printComment to retrieve
			};
		}
	}
	return null; // No embedding
};
```

---

## Parsers

| Parser           | Use Case                  | Example Input                                   |
| ---------------- | ------------------------- | ----------------------------------------------- |
| `apex`           | Full class files (`.cls`) | `public class Test { void method() { } }`       |
| `apex-anonymous` | Standalone snippets       | `List<String> items = new List<String>{ 'a' };` |

**Both produce identical AST** — same Jorje node types, same printer.

---

## Node Discovery

### Methods

1. **Playground**: https://apex.dangmai.net → Enable "Show AST"
2. **Debug log**: `console.log(node['@class'], Object.keys(node))`
3. **Parse directly**:
    ```typescript
    import * as apexPlugin from 'prettier-plugin-apex';
    const ast = await apexPlugin.parsers.apex.parse(code, {});
    console.log(JSON.stringify(ast, null, 2));
    ```

### Recursive Type Collection

```typescript
function collectNodeTypes(node: ApexNode, types: Set<string>): void {
	if (node && typeof node === 'object' && '@class' in node) {
		types.add(node['@class']);
		for (const value of Object.values(node)) {
			if (Array.isArray(value)) {
				value.forEach((child) => {
					if (child && typeof child === 'object')
						collectNodeTypes(child as ApexNode, types);
				});
			} else if (value && typeof value === 'object') {
				collectNodeTypes(value as ApexNode, types);
			}
		}
	}
}
```

---

## ESLint Configuration

Required for Jorje AST files:

```typescript
/* eslint-disable @typescript-eslint/naming-convention */ // '@class' property
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */ // Index signatures
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */ // Node mutations
```

**Why**: `@class` violates naming conventions but is required by Jorje.

---

## Error Handling

```typescript
// Safe node validation
if (!node || typeof node !== 'object') return false;
const nodeClass = getNodeClassOptional(node);
if (!nodeClass) return false;

// Safe property access
const value = isIdentifier(node) ? node.value : undefined;

// Index signature fallback
const prop = (node as { [key: string]: unknown })[propertyName];
```

---

## Key Implementation Notes

| Pattern                  | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| Type normalization       | Identifiers in type contexts → standard casing       |
| Collection formatting    | 2+ entries → forced multiline                        |
| Annotation normalization | Names/options → case-normalized                      |
| ApexDoc processing       | Parse tags, format `{@code}` blocks                  |
| Property mutation        | Always restore (try/finally)                         |
| Path creation            | Spread for temporary mutations                       |
| TypeRef handling         | Check both `types` and `names`                       |
| Comment embed            | Async formatting via embed function                  |
| Parser wrapping          | Both `apex` and `apex-anonymous` wrapped identically |

---

## Node Hierarchy

| Category        | Examples                                                  |
| --------------- | --------------------------------------------------------- |
| **Expression**  | `LiteralExpr`, `BinaryExpression`, `MethodCallExpression` |
| **Statement**   | `IfBlock`, `ForLoop`, `ReturnStatement`                   |
| **Declaration** | `MethodDecl`, `ClassDecl`, `FieldDecl`                    |
| **Type**        | `TypeRef`, `ArrayTypeRef`, `ClassRef`, `VariableTypeNode` |
| **Modifier**    | `Modifier$Annotation`, `Modifier$Public`, etc.            |
| **SOQL/SOSL**   | `FromExpr`                                                |

---

## Performance

- Jorje runs as Java process (via `prettier-plugin-apex`)
- HTTP server mode reduces JVM startup overhead
- AST traversal: fast (in-memory)
- Node type checks: O(1) string comparison

---

## References

- **prettier-plugin-apex**: https://github.com/dangmai/prettier-plugin-apex
- **Playground**: https://apex.dangmai.net
- **Source files**: `src/types.ts`, `src/collections.ts`, `src/annotations.ts`,
  `src/casing.ts`, `src/printer.ts`

---

## Glossary

| Term         | Definition                                                  |
| ------------ | ----------------------------------------------------------- |
| `@class`     | Required property identifying node type                     |
| AST          | Abstract Syntax Tree                                        |
| Jorje        | Salesforce's Apex parser/compiler (Java-based)              |
| Inner class  | Java class inside another (uses `$` separator)              |
| Type guard   | Function narrowing TypeScript types via runtime checks      |
| Type context | AST location where identifiers = type names (not variables) |
| Path stack   | Array of parent nodes (root → current)                      |
| SOQL         | Salesforce Object Query Language                            |
