````markdown
# PMD Quick Reference

**Version:** 1.0.0

Condensed PMD guide for Salesforce Code Analyzer integration.

**Reference:**
[PMD Engine](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/engine-pmd.html)

**Schema:**
[PMD Ruleset XML Schema](https://pmd.sourceforge.io/ruleset_2_0_0.xsd)

## Related Docs

- [Code Analyzer Config](CODEANALYZER.md) - `code-analyzer.yml`
  reference
- [XPath 3.1](XPATH31.md) - XPath syntax for rules
- [Apex AST](#apex-ast-reference) - AST node types/patterns

## Installation

Download from [GitHub releases](https://github.com/pmd/pmd/releases), extract,
add `bin/` to PATH. Salesforce Code Analyzer bundles PMD—direct install only for
standalone CLI.

## Rulesets

XML files defining rules to execute. Reference in `code-analyzer.yml`:

```yaml
engines:
  pmd:
    rulesets:
      - rulesets/design/InnerClassesCannotBeStatic.xml
```
````

### Design

```xml
<?xml version="1.0" ?>
<ruleset
    name="Custom Rules"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd"
>
    <description>My custom rules</description>
    <exclude-pattern>.*/test/.*</exclude-pattern>
    <include-pattern>.*/src/.*</include-pattern>
    <!-- Rules here -->
</ruleset>
```

**Elements:** `<description>` (required), `<exclude-pattern>` (optional,
multiple), `<include-pattern>` (optional, multiple), `<rule>` (required,
multiple)

### Referencing Rules

```xml
<!-- Single rule -->
<rule ref="category/apex/codestyle.xml/NoMethodCallsInConditionals" />

<!-- Category with exclusions -->
<rule ref="category/apex/codestyle.xml">
    <exclude name="WhileLoopsMustUseBraces"/>
</rule>
```

## Rule Configuration

### Priority

1=High, 5=Low. Filter via `--minimum-priority`:

```xml
<rule ref="category/apex/errorprone.xml/EmptyCatchBlock">
    <priority>5</priority>
</rule>
```

### Properties

**Property attributes:** `name` (required), `value` (optional—attr or child),
`description`, `type`, `delimiter`, `min`, `max`

**Important:** Code Analyzer only supports `severity`/`tags` overrides in
`code-analyzer.yml`. Property overrides require ruleset XML.

```xml
<!-- Value as child element (recommended) -->
<property name="reportLevel"><value>150</value></property>

<!-- Value as attribute -->
<property name="reportLevel" value="150" />

<!-- Multivalued (comma-separated) -->
<property name="legalCollectionTypes" value="java.util.ArrayList,java.util.Vector"/>
```

**Override custom rules:**

```xml
<rule ref="rulesets/design/EnumMinimumValues.xml/EnumMinimumValues">
    <properties>
        <property name="minValues">
            <value>4</value>
        </property>
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

**Complete Override Example:**

1. Create `rulesets/custom-overrides.xml`:

```xml
<?xml version="1.0" ?>
<ruleset
    name="Custom Property Overrides"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd"
>
    <description>Custom property overrides</description>
    <rule ref="rulesets/design/EnumMinimumValues.xml/EnumMinimumValues">
        <properties>
            <property name="minValues">
                <value>4</value>
            </property>
        </properties>
    </rule>
    <rule
        ref="rulesets/design/PreferSwitchOverIfElseChains.xml/PreferSwitchOverIfElseChains"
    >
        <properties>
            <property name="minElseIfStatements">
                <value>4</value>
            </property>
        </properties>
    </rule>
</ruleset>
```

2. Reference in `code-analyzer.yml`:

```yaml
engines:
  pmd:
    custom_rulesets:
      - rulesets/design/EnumMinimumValues.xml # Original first
      - rulesets/design/PreferSwitchOverIfElseChains.xml
      - rulesets/custom-overrides.xml # Override after
```

**Ref format:** `{ruleset-path}/{rule-name}`

**XPathRule Custom Properties:** PMD 7.x doesn't validate custom XPathRule
properties. Use substitution pattern:

```xpath
if ('${propertyName}' = '${propertyName}') then 'defaultValue' else '${propertyName}'
```

When undefined, `${propertyName}` stays literal → check true → default used.

### Examples

```xml
<rule name="MyRule" language="apex" ...>
    <description>Rule description</description>
    <priority>3</priority>
    <properties><!-- XPath --></properties>
    <example><![CDATA[
// Violation
public void badExample() { }
// Valid
public void goodExample() { }
    ]]></example>
</rule>
```

### Custom Messages

```xml
<rule
    ref="category/apex/errorprone.xml/EmptyCatchBlock"
    message="Empty catch blocks should be avoided"
/>
```

### Rule Element Structure

**Child elements (order required):** `description` → `priority` → `properties` →
`exclude` → `example`

Verify: `pnpm check-xml-order` | Fix: `pnpm fix-xml-order`

**Attributes:** `name`, `language`, `minimumLanguageVersion`,
`maximumLanguageVersion`, `ref`, `message`, `class`, `since`, `externalInfoUrl`,
`deprecated` (default: false), `dfa`, `typeResolution` (default: false)

## Suppressing Warnings

Quick reference for suppressing PMD rule violations in Apex code. Use
suppressions sparingly—prefer fixing issues or improving rules when possible.

### Suppression Methods (Priority Order)

1. **Fix the issue or improve the rule** (preferred)
2. **Annotations** - Class/method level
3. **NOPMD comment** - Line level
4. **Rule properties** - Global suppression via `violationSuppressRegex` or
   `violationSuppressXPath`

### Annotations

#### Suppress All PMD Warnings

```apex
@SuppressWarnings('PMD')
public class MyClass {
    // All PMD warnings suppressed in this class
}
```

#### Suppress Specific Rule

```apex
@SuppressWarnings('PMD.UnusedLocalVariable')
public class MyClass {
    void method() {
        int unused = 42; // No violation
    }
}
```

#### Suppress Multiple Rules

```apex
@SuppressWarnings('PMD.UnusedLocalVariable, PMD.UnusedPrivateMethod')
public class MyClass {
    private int unused;
    private void unusedMethod() {}
}
```

**Note:** Apex uses single quotes and comma-separated values (not JSON array
syntax like Java).

### NOPMD Comment

Suppress a single line violation:

```apex
public class MyClass {
    private int bar; // NOPMD - accessed by native method
}
```

**Important:** The `// NOPMD` marker must be on the same line as the violation.
Optional message after marker appears in reports:

```apex
if (condition) { // NOPMD - temporary workaround
}
```

#### Custom Suppression Marker

Change the marker via CLI `--suppress-marker` option (default: `NOPMD`):

```bash
sf code-analyzer run --suppress-marker "TURN_OFF_WARNINGS"
```

### Rule Properties (Global Suppression)

**Important:** Salesforce Code Analyzer does not support property overrides via
`code-analyzer.yml`. Configure suppression properties via custom ruleset XML
files using `ref=` syntax.

Create a custom ruleset XML file to suppress violations matching patterns.

#### violationSuppressRegex

Suppress violations where the message matches a regex:

**Custom ruleset XML:**

```xml
<rule ref="category/apex/bestpractices.xml/UnusedFormalParameter">
    <properties>
        <property name="violationSuppressRegex">
            <value>.*'mySpecialParameter'.*</value>
        </property>
    </properties>
</rule>
```

**For custom rules:**

```xml
<rule ref="rulesets/design/SomeRule.xml/SomeRule">
    <properties>
        <property name="violationSuppressRegex">
            <value>.*'mySpecialParameter'.*</value>
        </property>
    </properties>
</rule>
```

#### violationSuppressXPath

Suppress violations where XPath query matches (XPath 3.1, context node is the
violation node):

**Custom ruleset XML:**

```xml
<?xml version="1.0" ?>
<ruleset
    name="Suppression Rules"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd"
>
    <description>Suppression rules for specific patterns</description>

    <!-- Suppress String parameters -->
    <rule ref="category/apex/bestpractices.xml/UnusedFormalParameter">
        <properties>
            <property name="violationSuppressXPath">
                <value>.[pmd-apex:typeIs('String')]</value>
            </property>
        </properties>
    </rule>

    <!-- Suppress in classes containing "Bean" -->
    <rule ref="rulesets/design/SomeRule.xml/SomeRule">
        <properties>
            <property name="violationSuppressXPath">
                <value>
                    ./ancestor-or-self::ClassDeclaration[contains(@SimpleName, 'Bean')]
                </value>
            </property>
        </properties>
    </rule>

    <!-- Suppress in equals/hashCode methods -->
    <rule ref="rulesets/design/AnotherRule.xml/AnotherRule">
        <properties>
            <property name="violationSuppressXPath">
                <value>
                    ./ancestor-or-self::MethodDeclaration[@Name = ('equals', 'hashCode')]
                </value>
            </property>
        </properties>
    </rule>

    <!-- Suppress in classes ending with "Bean" (regex match) -->
    <rule ref="rulesets/design/YetAnotherRule.xml/YetAnotherRule">
        <properties>
            <property name="violationSuppressXPath">
                <value>
                    ./ancestor-or-self::ClassDeclaration[matches(@SimpleName, '^.*Bean$')]
                </value>
            </property>
        </properties>
    </rule>
</ruleset>
```

Then reference in `code-analyzer.yml`:

```yaml
engines:
  pmd:
    custom_rulesets:
      - rulesets/design/SomeRule.xml
      - rulesets/design/AnotherRule.xml
      - rulesets/design/YetAnotherRule.xml
      - rulesets/suppression-rules.xml # Custom suppression ruleset
```

**XPath Notes:**

- Use `.` to reference the context node (the violation node)
- Prefer `./ancestor-or-self::` over `//` to avoid over-suppressing
- Context node varies by rule (check rule implementation)
- XPath 3.1 syntax supported (since PMD 7)

### Best Practices

1. **Fix or improve rules first** - Suppressions hide issues; better to fix root
   cause
2. **Be specific** - Suppress only what's necessary (specific rules, not all PMD
   warnings)
3. **Document why** - Add comments explaining suppression reason
4. **Review periodically** - Suppressions may become unnecessary after code/rule
   changes

## CLI Usage

```bash
pmd check -d <source> -R <ruleset> -f <format>
```

**Options:** | Option | Description | |--------|-------------| | `-d`, `--dir` |
Source directory | | `-R`, `--rulesets` | Ruleset file | | `-f`, `--format` |
Report format | | `--minimum-priority` | Filter priority (1-5 or
High/Medium/Low) | | `-l`, `--language` | Language (apex, java, etc.) | |
`--use-version` | Language version (PMD 7+) | | `--fail-on-violation` | Exit
with error on violations | | `--no-cache` | Disable cache | | `--cache` | Enable
cache with file |

**PMD 6→7 changes:** `-no-cache`→`--no-cache`,
`-failOnViolation`→`--fail-on-violation`, `-reportfile`→`--report-file`,
`-language`→`--use-version`

```bash
pmd check -d src/main/apex -R rulesets/all.xml -f html -l apex --use-version 60
```

## Report Formats

`text`, `xml`, `html`, `csv`, `json`, `sarif`, `codeclimate`, `junit`

## CPD (Copy-Paste Detector)

Finds duplicated code for refactoring.

```bash
pmd cpd --minimum-tokens 100 --language apex --files src/
```

**Options:** `--minimum-tokens` (required), `--language`, `--format`
(text/xml/csv/csv_with_linecount_per_file/vs/json), `--ignore-identifiers`,
`--ignore-literals`, `--ignore-annotations`, `--skip-duplicate-files`

**Suppression:**

```java
// CPD-OFF
public void duplicateCode() { }
// CPD-ON
```

**GUI:** `pmd cpd-gui`

## Incremental Analysis

```bash
pmd --cache <cache_file> -d <source> -R <ruleset>
```

Code Analyzer handles automatically.

## Rule Categories

1. Best Practices 2. Code Style 3. Design 4. Documentation 5. Error Prone 6.
   Multithreading 7. Performance 8. Security

## GitHub Actions

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-java@v4
    with:
      distribution: 'temurin'
      java-version: '11'
  - uses: pmd/pmd-github-action@v2
    with:
      rulesets: 'rulesets/design/InnerClassesCannotBeStatic.xml'
```

**Inputs:** `rulesets` (required), `version` (default: "latest"), `sourcePath`
(default: "."), `analyzeModifiedFilesOnly` (default: "true"),
`createGitHubAnnotations` (default: "true"), `uploadSarifReport` (default:
"true")

**Output:** `violations` (count)

```yaml
- uses: pmd/pmd-github-action@v2
  id: pmd
  with:
    rulesets: 'rulesets/all.xml'
- name: Fail on violations
  if: steps.pmd.outputs.violations != 0
  run: exit 1
```

**Limits:** No `auxclasspath`, XPath rules only, no custom env vars, max 300
files with `analyzeModifiedFilesOnly`

## Language Versions

Use `--use-version` to specify. Rules can set
`minimumLanguageVersion`/`maximumLanguageVersion`. Check `pmd check --help` for
available versions.

## Code Metrics

**ApexMetrics:** `CYCLO`, `COGNITIVE_COMPLEXITY`, `NCSS`, `WEIGHED_METHOD_COUNT`

```java
import net.sourceforge.pmd.lang.apex.metrics.ApexMetrics;
import net.sourceforge.pmd.lang.metrics.MetricsUtil;

int cyclo = MetricsUtil.computeMetric(ApexMetrics.CYCLO, node);
int cognitive = MetricsUtil.computeMetric(ApexMetrics.COGNITIVE_COMPLEXITY, node);
```

**Refs:**
[ApexMetrics API](https://docs.pmd-code.org/apidocs/pmd-apex/7.20.0-SNAPSHOT/net/sourceforge/pmd/lang/apex/metrics/ApexMetrics.html),
[MetricsUtil API](https://docs.pmd-code.org/apidocs/pmd-core/7.20.0-SNAPSHOT/net/sourceforge/pmd/lang/metrics/MetricsUtil.html)

## Apex Support

Built-in rules, Summit AST parser (PMD 7+), metrics, language-specific config.

**Refs:**
[Apex Language Docs](https://pmd.github.io/pmd/pmd_languages_apex.html)

## Apex AST Reference

**Note:** This reference is for PMD 7.0.0+, which uses Summit AST parser
(replaced Jorje parser in PMD 6).

### PMD 7 Apex AST Changes

PMD 7.0.0 switched from Jorje to Summit AST parser. Key changes:

#### Removed Attributes

- **`Method/@Synthetic`** - Removed. Summit AST doesn't generate synthetic
  methods, so this attribute would always be false.
- **`Method/@Namespace`** - Removed. This attribute was never fully implemented
  and always returned an empty string.
- **`ReferenceExpression/@Context`** - Removed. This attribute was not used and
  always returned null.

#### Removed Nodes

- **`BridgeMethodCreator`** - Removed. This was an artificially generated node
  by Jorje. Summit AST doesn't generate synthetic methods.
- **Methods named `<clinit>` and `<init>`** - No longer generated by Summit AST.

#### Impact on XPath Rules

When migrating XPath rules from PMD 6 to PMD 7:

1. **Remove references to removed attributes:**
   - Remove `@Synthetic` checks on `Method` nodes
   - Remove `@Namespace` checks on any nodes
   - Remove `@Context` checks on `ReferenceExpression` nodes

2. **Remove references to removed nodes:**
   - Remove XPath expressions matching `BridgeMethodCreator` nodes
   - Remove checks for method names `<clinit>` or `<init>`

3. **Test thoroughly:** The AST structure is mostly compatible, but some edge
   cases may differ.

**References:**

- [PMD 7 Migration Guide - Apex AST](https://pmd.github.io/pmd/pmd_userdocs_migrating_to_pmd7.html#apex-ast)
- [Apex Language Documentation](https://pmd.github.io/pmd/pmd_languages_apex.html)

### Core Structure Nodes

**UserClass** - Class declaration

- `@Name`, `@SimpleName` - Class name
- `@Abstract`, `@Interface` - Type flags
- `@Nested` - Inner class flag

**ApexFile** - File/compilation unit (root)

**Method** - Method declaration

- `@Image`, `@MethodName`, `@FullMethodName` - Method name
- `@ReturnType` - Return type
- `@Constructor` - Constructor flag
- `@InputParametersSize` - Parameter count
- Children: `ModifierNode`, `Parameter`, `BlockStatement`

**Field** / **FieldDeclaration** / **FieldDeclarationStatements** - Field
declarations

- `@Name` - Field name
- Children: `ModifierNode`, `VariableExpression`

**Property** - Property declaration (getter/setter)

**Parameter** - Method/constructor parameter

- `@Image` - Parameter name
- `@Type` - Parameter type

**ModifierNode** - Access/type modifiers

- `@Static`, `@Final`, `@Abstract`, `@Public`, `@Private`, `@Protected`
- `@Override`, `@Global`, `@WebService`

**Annotation** - Annotation

- `@Name` - Annotation name (e.g., `'SuppressWarnings'`, `'IsTest'`)
- Note: Path is `Field/ModifierNode/Annotation[@Name]` (not
  `Field/Annotation[@Name]`)

### Control Flow Nodes

**IfBlockStatement** - if statement

- Children: `StandardCondition`, `BlockStatement`

**IfElseBlockStatement** - if-else chain

- Children: multiple `IfBlockStatement`

**SwitchStatement** - switch statement

- Children: `StandardCondition`, case blocks

**WhileLoopStatement** - while loop

- Children: `StandardCondition`, `BlockStatement`

**ForLoopStatement** - for loop

- Children: `StandardCondition`, `BlockStatement`

**ForEachStatement** - for-each loop

- Children: `StandardCondition`, `BlockStatement`

**DoLoopStatement** - do-while loop

**CatchBlockStatement** - catch block

**StandardCondition** - Condition expression (if, while, etc.)

- Children: `BooleanExpression`, `PrimaryExpression`

### Expression Nodes

**PrimaryExpression** - Primary expression (method calls, field access, etc.)

- Children: `MethodCallExpression`, `ReferenceExpression`, `VariableExpression`,
  etc.

**MethodCallExpression** - Method invocation

- `@Image` - Method name
- Children: arguments

**ReferenceExpression** - Field/method reference

- `@Image` - Reference name

**VariableExpression** - Variable reference

- `@Image` - Variable name

**ThisVariableExpression** - `this` reference

**AssignmentExpression** - Assignment

- `@Op` - Operator (`=`, `+=`, `-=`, `*=`, `/=`, `%=`)

**BinaryExpression** - Binary operation

- `@Op` - Operator (`+`, `-`, `*`, `/`, `==`, `!=`, `<`, `<=`, `>`, `>=`, `and`,
  `or`, etc.)

**UnaryExpression** - Unary operation

- `@Op` - Operator (`++`, `--`, `+`, `-`, `!`, `not`)

**TernaryExpression** - Ternary operator (`? :`)

- Children: `StandardCondition`, then/else expressions

**BooleanExpression** - Boolean expression

- `@Op` - Operator (`==`, `!=`, `<`, `>`, `and`, `or`, etc.)
- Children: `VariableExpression`, `LiteralExpression`, etc.

**LiteralExpression** - Literal value

- `@Image` - Literal text
- `@Null` - Null literal flag
- `@String` - String literal flag
- `@LiteralType` - Type (e.g., `'Integer'`, `'String'`, `'Boolean'`)

**InstanceOfExpression** - `instanceof` check

**NewListLiteralExpression** - List literal `new List<Type>{...}`

- Children: elements

**NewMapLiteralExpression** - Map literal `new Map<K,V>{...}`

- Children: `MapEntryNode`

**MapEntryNode** - Map entry (key-value pair)

- `@BeginLine`, `@EndLine` - Line numbers

### Statement Nodes

**BlockStatement** - Code block `{...}`

- `@BeginLine`, `@EndLine` - Line numbers

**ReturnStatement** - return statement

- Children: expression

**ThrowStatement** - throw statement

- Children: exception expression

**BreakStatement** - break statement

**ContinueStatement** - continue statement

### Other Nodes

**FormalComment** - Javadoc/comment

**Important:** PMD's Apex parser only includes block comments (`/* */`) and
ApexDoc comments (`/** */`) in the AST as `FormalComment` nodes. Single-line
comments (`//`) are **not** included in the AST and cannot be detected using
XPath expressions. For rules that need to detect single-line comments (e.g.,
`// prettier-ignore`, `// NOPMD`), use regex-based rules instead of PMD XPath
rules. See [Regex Engine](CODEANALYZER.md#regex-engine) for creating regex-based rules.

**UserEnum** - Enum declaration

- Children: `Field` (enum values)

**VariableDeclaration** - Variable declaration

- `@Image` - Variable name
- Children: `VariableExpression`, `VariableInitializer`

**VariableDeclarationStatements** - Variable declaration statement

- Children: `VariableDeclaration`, `ModifierNode`

**VariableInitializer** - Variable initialization

- Children: `Expression`

**Expression** - Generic expression wrapper

### Common Attributes

**Identity/Name:**

- `@Image` - Text/image (name, value, operator symbol)
- `@Name`, `@SimpleName` - Node name
- `@MethodName`, `@FullMethodName` - Method names
- `@VariableName` - Variable name

**Location:**

- `@BeginLine`, `@EndLine` - Line numbers
- `@BeginColumn`, `@EndColumn` - Column numbers
- `@CurlyBrace` - Has curly braces

**Type/Flags:**

- `@Type`, `@ReturnType`, `@LiteralType` - Types
- `@Static`, `@Final`, `@Abstract`, `@Public`, `@Private`, `@Protected` -
  Modifiers
- `@Constructor`, `@Interface`, `@Nested` - Structure flags
- `@Override`, `@Null`, `@String` - Special flags

**Operators:**

- `@Op` - Operator symbol (`+`, `-`, `==`, `!=`, `++`, `--`, `+=`, etc.)

**Counts:**

- `@InputParametersSize` - Parameter count

### Common Patterns

#### Find methods

```xpath
//Method[@Image = 'methodName']
//Method[@Static = true()]
//Method[@Constructor = true()]
```

#### Find classes

```xpath
//UserClass[@Nested = true()]
//UserClass[@Abstract = true()]
```

#### Find variables

```xpath
//VariableDeclaration[ancestor::Method]  # Local vars only
//VariableExpression[@Image = 'varName']
```

#### Find method calls

```xpath
//MethodCallExpression[@Image = 'methodName']
//PrimaryExpression/MethodCallExpression
```

#### Check modifiers

```xpath
//Method[ModifierNode[@Static = true()]]
//Field[ModifierNode[@Final = true()]]
```

#### Check annotations

```xpath
//Annotation[@Name = 'SuppressWarnings']
//Method/ModifierNode/Annotation[@Name = 'IsTest']
```

#### Find control flow

```xpath
//IfBlockStatement[StandardCondition//MethodCallExpression]
//WhileLoopStatement[StandardCondition//VariableExpression]
```

#### Check operators

```xpath
//BinaryExpression[@Op = '==']
//UnaryExpression[@Op = '++']
//AssignmentExpression[@Op = '+=']
```

#### Check expressions

```xpath
//LiteralExpression[@Null = true()]
//BooleanExpression[@Op = 'and']
//TernaryExpression
```

#### Line number checks

```xpath
//Method[@BeginLine = @EndLine]  # Single line
//BlockStatement[@BeginLine != @EndLine]  # Multi-line
```

#### Count checks

```xpath
//Method[count(Parameter) > 2]
//IfElseBlockStatement[count(IfBlockStatement) >= 3]
```

### Important Notes

- **Annotations:** Use `Field/ModifierNode/Annotation[@Name]` path (ModifierNode
  is required)
- **Local vars:** Use `VariableDeclaration[ancestor::Method]` to exclude class
  fields
- **Nested expressions:** Use `//` or `.//` to find nested nodes
- **Context:** Use `ancestor::`, `descendant::`, `parent::`, `child::` axes for
  navigation
- **Predicates:** Use `[condition]` to filter nodes

## Code Analyzer Integration

Configure via `code-analyzer.yml`:

- **Rulesets:** `engines.pmd.rulesets` (array)
- **Properties:** `rules.pmd.{RuleName}.properties`
- **Severity/Tags:** `rules.pmd.{RuleName}.severity`,
  `rules.pmd.{RuleName}.tags`

See [CODEANALYZER.md](CODEANALYZER.md).

```

```
