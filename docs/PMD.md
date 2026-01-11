# PMD Quick Reference

> **Version**: 1.1.0

PMD guide or Salesforce Code Analyzer integration.

**Refs:** [PMD Engine](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/engine-pmd.html) | [Schema](https://pmd.sourceforge.io/ruleset_2_0_0.xsd) | [Apex Docs](https://pmd.github.io/pmd/pmd_languages_apex.html)

**Related:** [Code Analyzer Config](CODEANALYZER.md) | [XPath 3.1](XPATH31.md)

## Installation

Download from [GitHub releases](https://github.com/pmd/pmd/releases), add `bin/` to PATH. Code Analyzer bundles PMD—direct install only for standalone CLI.

## Rulesets

XML defining rules. Reference in `code-analyzer.yml`:

```yaml
engines:
  pmd:
    rulesets:
      - rulesets/design/InnerClassesCannotBeStatic.xml
```

### Structure

```xml
<?xml version="1.0" ?>
<ruleset name="Custom Rules"
  xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd">
  <description>Required description</description>
  <exclude-pattern>.*/test/.*</exclude-pattern>
  <include-pattern>.*/src/.*</include-pattern>
  <!-- Rules -->
</ruleset>
```

**Elements:** `description` (required), `exclude-pattern`*, `include-pattern`*, `rule`+

### Referencing Rules

```xml
<!-- Single -->
<rule ref="category/apex/codestyle.xml/NoMethodCallsInConditionals"/>

<!-- Category with exclusions -->
<rule ref="category/apex/codestyle.xml">
  <exclude name="WhileLoopsMustUseBraces"/>
</rule>
```

## Rule Configuration

### Priority

1=High → 5=Low. Filter: `--minimum-priority`

```xml
<rule ref="category/apex/errorprone.xml/EmptyCatchBlock">
  <priority>5</priority>
</rule>
```

### Properties

**Attrs:** `name` (required), `value`, `description`, `type`, `delimiter`, `min`, `max`

**Important:** Code Analyzer only supports `severity`/`tags` in `code-analyzer.yml`. Property overrides require ruleset XML.

```xml
<!-- Child element (recommended) -->
<property name="reportLevel"><value>150</value></property>

<!-- Attribute -->
<property name="reportLevel" value="150"/>

<!-- Multivalued -->
<property name="legalCollectionTypes" value="java.util.ArrayList,java.util.Vector"/>
```

**Override custom rules:**

```xml
<rule ref="rulesets/design/EnumMinimumValues.xml/EnumMinimumValues">
  <properties>
    <property name="minValues"><value>4</value></property>
  </properties>
</rule>
```

**code-analyzer.yml (severity/tags only):**

```yaml
rules:
  pmd:
    NPathComplexity:
      severity: 'High'
      tags: ['Recommended']
```

**Ref format:** `{ruleset-path}/{rule-name}`

**XPathRule undefined property fallback:**

```xpath
if ('${prop}' = '${prop}') then 'default' else '${prop}'
```

### Rule Element

**Child order:** `description` → `priority` → `properties` → `exclude` → `example`

**Attrs:** `name`, `language`, `minimumLanguageVersion`, `maximumLanguageVersion`, `ref`, `message`, `class`, `since`, `externalInfoUrl`, `deprecated`, `dfa`, `typeResolution`

```xml
<rule name="MyRule" language="apex" message="Custom message">
  <description>Rule description</description>
  <priority>3</priority>
  <properties><!-- XPath --></properties>
  <example><![CDATA[
// Violation
public void bad() { }
// Valid
public void good() { }
  ]]></example>
</rule>
```

## Suppressing Warnings

**Priority:** Fix issue > Improve rule > Annotation > NOPMD > Rule properties

### Annotations

```apex
@SuppressWarnings('PMD')                    // All PMD
@SuppressWarnings('PMD.UnusedLocalVariable') // Specific rule
@SuppressWarnings('PMD.Rule1, PMD.Rule2')    // Multiple (comma-separated, single quotes)
```

### NOPMD Comment

```apex
private int bar; // NOPMD - reason here
```

Must be on same line. Custom marker: `--suppress-marker "CUSTOM"`

### Rule Properties (XML only)

**violationSuppressRegex** — Match violation message:

```xml
<rule ref="category/apex/bestpractices.xml/UnusedFormalParameter">
  <properties>
    <property name="violationSuppressRegex"><value>.*'mySpecialParameter'.*</value></property>
  </properties>
</rule>
```

**violationSuppressXPath** — Match context node (XPath 3.1):

```xml
<property name="violationSuppressXPath">
  <value>./ancestor-or-self::ClassDeclaration[contains(@SimpleName, 'Bean')]</value>
</property>
```

XPath examples:
- `.[pmd-apex:typeIs('String')]` — String type
- `./ancestor-or-self::MethodDeclaration[@Name = ('equals', 'hashCode')]` — specific methods
- `./ancestor-or-self::ClassDeclaration[matches(@SimpleName, '^.*Bean$')]` — regex match

## CLI

```bash
pmd check -d <source> -R <ruleset> -f <format>
```

| Option | Description |
|--------|-------------|
| `-d`, `--dir` | Source directory |
| `-R`, `--rulesets` | Ruleset file |
| `-f`, `--format` | Report format |
| `--minimum-priority` | 1-5 or High/Medium/Low |
| `-l`, `--language` | apex, java, etc. |
| `--use-version` | Language version |
| `--fail-on-violation` | Exit error on violations |
| `--cache` / `--no-cache` | Cache control |

**PMD 6→7:** `-no-cache`→`--no-cache`, `-failOnViolation`→`--fail-on-violation`

**Formats:** `text`, `xml`, `html`, `csv`, `json`, `sarif`, `codeclimate`, `junit`

### CPD (Copy-Paste Detector)

```bash
pmd cpd --minimum-tokens 100 --language apex --files src/
```

**Suppress:** `// CPD-OFF` ... `// CPD-ON`

## GitHub Actions

```yaml
- uses: pmd/pmd-github-action@v2
  with:
    rulesets: 'rulesets/all.xml'
    version: 'latest'
    sourcePath: '.'
    analyzeModifiedFilesOnly: 'true'
```

**Output:** `violations` count. **Limits:** XPath rules only, max 300 files with `analyzeModifiedFilesOnly`

## Apex AST Reference (PMD 7+)

Summit AST parser. **Removed from PMD 6:** `Method/@Synthetic`, `Method/@Namespace`, `ReferenceExpression/@Context`, `BridgeMethodCreator`, `<clinit>`/`<init>` methods.

### Key Rules

1. **Annotations:** Path `*/ModifierNode/Annotation[@Name]` (not `*/Annotation`)
2. **Comments:** Only block comments (`/* */`) in AST; use regex for `//`
3. **Field groups:** Multiple decls share parent `FieldDeclarationStatements/@Type`
4. **Init blocks:** `Method[Identifier='_init']`
5. **Local vars:** `[ancestor::Method]` to filter
6. **Safe nav `?.`:** `@isSafe=true` on `MethodCallExpression`/`ReferenceExpression`
7. **Switch:** `WhenValue` (values), `WhenType` (SObject), `WhenElse` (default)
8. **Location:** Lines 1-based, columns 0-based, end exclusive

### Attributes

| Category | Attributes |
|----------|------------|
| Names | `@Image`, `@Name`, `@SimpleName`, `@MethodName`, `@FullMethodName`, `@VariableName` |
| Location | `@BeginLine`, `@EndLine` (1-based), `@BeginColumn`, `@EndColumn` (0-based, excl) |
| Operators | `@Op` (`+`,`-`,`==`,`!=`,`++`,`--`,`+=`,`&&`,`\|\|`,`??`, etc.) |
| Types | `@Type`, `@ReturnType`, `@LiteralType` |
| Modifiers | `@Static`, `@Final`, `@Abstract`, `@Public`, `@Private`, `@Protected`, `@Override`, `@Global`, `@WebService` |
| Flags | `@Constructor`, `@Interface`, `@Nested`, `@Null`, `@String`, `@Boolean`, `@isSafe` |
| Counts | `@InputParametersSize` |

### Node Reference

#### Root

- **ApexFile/CompilationUnit** — Root. Child: `UserClass`/`UserInterface`/`UserEnum`

#### Declarations

| Node | Key Attrs | Notes |
|------|-----------|-------|
| `Annotation` | `@Name` | Children: `Identifier`, `AnnotationParameter`* |
| `AnnotationParameter` | `@Name`, `@Value` | |
| `EnumValue` | `@Name` | |
| `FieldDeclaration` | `@Name` | Init expr optional |
| `FieldDeclarationStatements` | `@Type` | Children: `ModifierNode`, `TypeRef`, `FieldDeclaration`+ |
| `Method` | `@MethodName`, `@FullMethodName`, `@Constructor`, `@InputParametersSize`, `@ReturnType` | |
| `Parameter` | `@Name`, `@Type` | |
| `Property` | `@Name`, `@Type` | Getter/setter methods |
| `TriggerDeclaration` | `@Name` | Cases: `TRIGGER_{BEFORE\|AFTER}_{INSERT\|UPDATE\|DELETE\|UNDELETE}` |
| `UserClass` | `@Name`, `@Abstract`, `@Nested` | |
| `UserEnum` | `@Name` | Children: `EnumValue`+ |
| `UserInterface` | `@Name`, `@Interface=true` | |
| `VariableDeclaration` | `@Name` | Init expr optional |
| `VariableDeclarationStatements` | `@Type` | Children: `ModifierNode`, `TypeRef`, `VariableDeclaration`+ |

#### Expressions

| Node | Key Attrs | Notes |
|------|-----------|-------|
| `ArrayLoadExpression` | | array, index |
| `AssignmentExpression` | `@Op` (`=`,`+=`,`-=`...) | target, source |
| `BinaryExpression` | `@Op` | `+`,`-`,`*`,`/`,`==`,`!=`,`<`,`<=`,`>`,`>=`,`&&`,`\|\|`,`and`,`or`,`??`,`===`,`!==`,`instanceof`,`&`,`\|`,`^`,`<<`,`>>`,`>>>` |
| `BooleanExpression` | `@Op` | |
| `CastExpression` | | expr, `TypeRef` |
| `InstanceOfExpression` | | expr, `TypeRef` |
| `LiteralExpression` | `@Image`, `@LiteralType`, `@Null`, `@String`, `@Boolean` | Leaf |
| `MapEntryNode` | | key, value |
| `MethodCallExpression` | `@MethodName`, `@FullMethodName`, `@InputParametersSize`, `@isSafe` | `@FullMethodName`: e.g. `'String.join'` |
| `NewObjectExpression` | | `Initializer` |
| `PostfixExpression` | `@Op` (`++`,`--`) | |
| `PrefixExpression` | `@Op` (`++`,`--`) | |
| `ReferenceExpression` | `@Image`, `@isSafe` | |
| `SoqlExpression` | | `SoqlOrSoslBinding`* |
| `SoslExpression` | | `SoqlOrSoslBinding`* |
| `SuperExpression` | | Leaf |
| `TernaryExpression` | | condition, then, else |
| `ThisVariableExpression` | | Leaf |
| `UnaryExpression` | `@Op` (`+`,`-`,`!`,`not`,`~`,`++`,`--`) | |
| `VariableExpression` | `@Image` | |

#### Initializers

| Node | Use |
|------|-----|
| `ConstructorInitializer` | `new Type(args)` |
| `ValuesInitializer` | `new List<T>{...}`, `new Set<T>{...}` |
| `MapInitializer` | `new Map<K,V>{'k'=>'v'}` |
| `SizedArrayInitializer` | `new T[size]` |

#### Modifiers

- **ModifierNode** — Container
- **KeywordModifier** — `ABSTRACT`, `FINAL`, `GLOBAL`, `STATIC`, `PUBLIC`, `PRIVATE`, `PROTECTED`, `OVERRIDE`, `TESTMETHOD`, `TRANSIENT`, `VIRTUAL`, `WEBSERVICE`, `WITHSHARING`, `WITHOUTSHARING`, `INHERITEDSHARING`

#### Statements

| Node | Notes |
|------|-------|
| `BlockStatement`/`CompoundStatement` | Scoping: `SCOPE_BOUNDARY`/`SCOPE_TRANSPARENT` |
| `BreakStatement`, `ContinueStatement`, `EmptyStatement` | Leaf |
| `CatchBlockStatement` | `VariableDeclarationStatements`, body |
| `DoLoopStatement` | condition, body |
| `ExpressionStatement` | expr |
| `ForEachStatement` | `VariableDeclarationStatements`, collection, body |
| `ForLoopStatement` | init, condition, updates, body |
| `IfBlockStatement` | condition, then, else? |
| `IfElseBlockStatement` | `IfBlockStatement`+ |
| `ReturnStatement` | expr? |
| `RunAsStatement` | user exprs, body |
| `SwitchStatement` | condition, `WhenValue`*/`WhenType`*/`WhenElse`? |
| `ThrowStatement` | expr |
| `TryStatement` | body, `CatchBlockStatement`*, finally? |
| `WhileLoopStatement` | condition, body |

**DML** (`@AccessLevel`: `USER_MODE`/`SYSTEM_MODE`): `DmlInsertStatement`, `DmlUpdateStatement`, `DmlDeleteStatement`, `DmlUndeleteStatement`, `DmlUpsertStatement`, `DmlMergeStatement`

#### Other

| Node | Notes |
|------|-------|
| `FormalComment` | Block comments only (`/* */`, `/** */`). `//` NOT in AST |
| `Identifier` | `@Image`; may be synthetic (`'_init'`) |
| `TypeRef` | `components`, `arrayNesting`; void=empty |
| `StandardCondition` | Condition wrapper for if/while/for |

### XPath Patterns

```xpath
# Annotations
//Annotation[@Name='IsTest']
//Method/ModifierNode/Annotation[@Name='SuppressWarnings']

# Modifiers
//Method[ModifierNode[@Static=true()]]
//Field[ModifierNode[@Final=true()]]

# Methods
//Method[@MethodName='methodName']
//Method[@Constructor=true()]
//MethodCallExpression[@FullMethodName='String.join']

# Variables
//VariableDeclaration[ancestor::Method]  # locals only
//VariableExpression[@Image='varName']

# Operators
//BinaryExpression[@Op='==']
//AssignmentExpression[@Op='+=']
//UnaryExpression[@Op='++']

# Literals
//LiteralExpression[@Null=true()]
//LiteralExpression[@String=true()]

# Types
//UserClass[@Nested=true()]
//UserClass[@Abstract=true()]

# DML
//DmlInsertStatement | //DmlUpdateStatement
//Method[.//DmlInsertStatement]

# Control flow
//IfBlockStatement[.//MethodCallExpression]
//SwitchStatement[count(WhenValue)>2]
//SwitchStatement[WhenElse]

# Counts
//Method[count(Parameter)>2]
//IfElseBlockStatement[count(IfBlockStatement)>=3]

# Position
//Parameter[position()=1]
//IfBlockStatement[position()=last()]

# Line checks
//Method[@BeginLine=@EndLine]  # single-line
```

## Metrics

**ApexMetrics:** `CYCLO`, `COGNITIVE_COMPLEXITY`, `NCSS`, `WEIGHED_METHOD_COUNT`

```java
int cyclo = MetricsUtil.computeMetric(ApexMetrics.CYCLO, node);
```

## Rule Categories

Best Practices | Code Style | Design | Documentation | Error Prone | Multithreading | Performance | Security

## Code Analyzer Config

`code-analyzer.yml`:
- `engines.pmd.rulesets` — Ruleset paths
- `rules.pmd.{Rule}.severity` — High/Medium/Low
- `rules.pmd.{Rule}.tags` — Tag array

See [CODEANALYZER.md](CODEANALYZER.md).
