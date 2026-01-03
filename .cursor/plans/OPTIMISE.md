# Optimizing Docs for AI Agents

This plan documents the process for converting high token count documentation
files into AI Agent-friendly low token versions without losing any essential
details. This plan is used by AI-powered IDEs (like Cursor) to optimize docs,
not by the CLI tool itself.

## Core Principles

- **Terse but precise** - Every word counts, no fluff
- **Tables over prose** - Use tables for structured data
- **Bullet points for lists** - Use lists for scannability
- **Minimal code examples** - Only essential examples
- **Structured sections** - Clear, consistent organization
- **Reference-style formatting** - Quick reference format

## Optimization Techniques

### Text Reduction Strategies

1. **Remove redundancy:**
    - Eliminate repeated information
    - Remove unnecessary explanations
    - Cut verbose descriptions
    - Remove filler words and phrases

2. **Use abbreviations:**
    - Use standard abbreviations where clear
    - Abbreviate common terms (e.g., "config" for "configuration")
    - Use symbols where appropriate (e.g., `&` for "and" in tables)

3. **Condense explanations:**
    - Convert paragraphs to bullet points
    - Use concise phrasing
    - Remove examples that don't add value
    - Focus on actionable information

### Structural Optimizations

#### Prose to Tables

Convert verbose descriptions to tables:

**Before:**

```markdown
The `enabled` property controls whether the feature is active. It accepts a
boolean value. The default is `true`. When set to `false`, the feature is
disabled.
```

**After:**

```markdown
| Property | Type    | Default | Description                            |
| -------- | ------- | ------- | -------------------------------------- |
| enabled  | boolean | true    | Controls whether the feature is active |
```

#### Lists to Tables

Convert property lists to tables:

**Before:**

```markdown
- `name` (string): The name of the item
- `value` (number): The numeric value
- `active` (boolean): Whether the item is active
```

**After:**

```markdown
| Property | Type    | Description                |
| -------- | ------- | -------------------------- |
| name     | string  | The name of the item       |
| value    | number  | The numeric value          |
| active   | boolean | Whether the item is active |
```

#### API Documentation to Tables

Convert API documentation to tables:

**Before:**

```markdown
## Methods

### `getData(id: string): Promise<Data>`

Retrieves data for the given ID. Returns a Promise that resolves to a Data
object.

### `setData(id: string, data: Data): Promise<void>`

Sets data for the given ID. Returns a Promise that resolves when complete.
```

**After:**

```markdown
## API Reference

| Method    | Parameters               | Returns         | Description                     |
| --------- | ------------------------ | --------------- | ------------------------------- |
| `getData` | `id: string`             | `Promise<Data>` | Retrieves data for the given ID |
| `setData` | `id: string, data: Data` | `Promise<void>` | Sets data for the given ID      |
```

#### Property Lists to Tables

Convert configuration property lists to tables:

**Before:**

```markdown
## Configuration

- `outputDir`: The output directory for generated files
- `format`: The output format (json, yaml, or xml)
- `verbose`: Enable verbose logging
```

**After:**

```markdown
## Configuration

| Property  | Type                      | Default    | Description                          |
| --------- | ------------------------- | ---------- | ------------------------------------ |
| outputDir | string                    | `./output` | Output directory for generated files |
| format    | 'json' \| 'yaml' \| 'xml' | 'json'     | Output format                        |
| verbose   | boolean                   | false      | Enable verbose logging               |
```

### Content Organization Patterns

1. **Group related information:**
    - Organize by topic, not by source
    - Group similar APIs together
    - Cluster configuration options by category

2. **Use consistent structure:**
    - Follow standard doc format (Overview, Configuration, API Reference, etc.)
    - Maintain consistent section ordering
    - Use consistent formatting within sections

3. **Prioritize essential information:**
    - Put most important information first
    - Move detailed explanations to end
    - Highlight critical gotchas early

## Step-by-Step Conversion Process

### 1. Analysis

1. **Read the entire doc** to understand structure and content
2. **Identify optimization opportunities:**
    - Long paragraphs that can be condensed
    - Lists that can become tables
    - API documentation that can be tabularized
    - Redundant explanations
    - Verbose examples

3. **Categorize content:**
    - Essential information (must keep)
    - Important information (should keep)
    - Nice-to-have information (can condense)
    - Redundant information (can remove)

### 2. Structure Planning

1. **Plan section organization:**
    - Determine optimal section order
    - Identify sections that can be merged
    - Plan table structures for each section

2. **Design table schemas:**
    - Determine columns for each table
    - Plan property/API documentation tables
    - Design configuration option tables

3. **Plan content reduction:**
    - Identify text to condense
    - Plan bullet point conversions
    - Design code example reductions

### 3. Content Transformation

1. **Convert prose to tables:**
    - Transform property descriptions
    - Convert API documentation
    - Tabularize configuration options

2. **Condense text:**
    - Reduce verbose explanations
    - Convert paragraphs to bullet points
    - Remove redundant information

3. **Optimize code examples:**
    - Keep only essential examples
    - Remove verbose comments
    - Use minimal, clear examples

4. **Restructure sections:**
    - Reorganize for better flow
    - Merge related sections
    - Remove unnecessary sections

### 4. Validation

1. **Verify completeness:**
    - Ensure all essential information retained
    - Check no critical details lost
    - Verify all APIs/configs documented

2. **Check accuracy:**
    - Verify table data is correct
    - Check code examples work
    - Confirm no information corrupted

3. **Validate format:**
    - Check table formatting
    - Verify markdown syntax
    - Ensure consistent style

## Formatting Standards

### Tables

- Use consistent column headers
- Align columns appropriately
- Use minimal but clear descriptions
- Include type information where relevant

### Code Examples

- Keep examples minimal and focused
- Remove unnecessary boilerplate
- Use clear, descriptive variable names
- Include only essential comments

### Lists

- Use bullet points for unordered lists
- Use numbered lists for sequential steps
- Keep items concise
- Group related items

### Sections

- Use consistent heading levels
- Maintain logical hierarchy
- Use descriptive section names
- Keep sections focused

## Quality Checklist

After optimization, verify:

- [ ] All essential information retained
- [ ] No critical details lost
- [ ] Tables properly formatted
- [ ] Code examples accurate and minimal
- [ ] Consistent formatting throughout
- [ ] Token count significantly reduced
- [ ] Still readable and understandable
- [ ] Cross-references maintained
- [ ] Related documentation links intact

## Common Pitfalls to Avoid

1. **Over-condensation:**
    - Don't remove essential context
    - Don't make information unclear
    - Don't sacrifice clarity for brevity

2. **Inconsistent formatting:**
    - Maintain consistent table structures
    - Use consistent terminology
    - Keep formatting uniform

3. **Lost information:**
    - Verify all details preserved
    - Check no APIs/configs missing
    - Ensure examples still accurate

4. **Poor organization:**
    - Maintain logical flow
    - Keep related information together
    - Don't fragment related content

## Success Metrics

A successfully optimized doc should:

1. **Reduce token count** by 50% or more while retaining all essential
   information
2. **Maintain readability** - Still clear and understandable
3. **Preserve completeness** - All essential details retained
4. **Improve scannability** - Easier to find specific information
5. **Maintain accuracy** - No information corrupted or lost

## Examples

### Example 1: API Documentation

**Before (high token count):**

````markdown
## API Methods

### getData(id: string): Promise<Data>

This method retrieves data for the given ID. It takes a string parameter called
`id` that represents the unique identifier of the data you want to retrieve. The
method returns a Promise that resolves to a Data object containing the requested
data. If the data is not found, the Promise will reject with an error.

Example usage:

```typescript
const data = await getData('123');
console.log(data);
```
````

````

**After (low token count):**
```markdown
## API Reference

| Method | Parameters | Returns | Description |
| ------ | ---------- | ------- | ----------- |
| `getData` | `id: string` | `Promise<Data>` | Retrieves data for the given ID |

```typescript
const data = await getData('123');
````

````

### Example 2: Configuration Options

**Before (high token count):**
```markdown
## Configuration Options

The `outputDir` option specifies the directory where generated files will be written. This should be a valid directory path. The default value is `./output` if not specified.

The `format` option determines the output format of the generated files. It can be set to `json`, `yaml`, or `xml`. The default is `json`.

The `verbose` option enables verbose logging. When set to `true`, the tool will output detailed information about its operations. The default is `false`.
````

**After (low token count):**

```markdown
## Configuration

| Property  | Type                      | Default    | Description                          |
| --------- | ------------------------- | ---------- | ------------------------------------ |
| outputDir | string                    | `./output` | Output directory for generated files |
| format    | 'json' \| 'yaml' \| 'xml' | 'json'     | Output format                        |
| verbose   | boolean                   | false      | Enable verbose logging               |
```

## Best Practices

1. **Optimize after comprehensive** - Only optimize when doc is complete and
   comprehensive
2. **Preserve essential details** - Never remove critical information
3. **Maintain accuracy** - Verify all information remains correct
4. **Test examples** - Ensure code examples still work
5. **Review thoroughly** - Check optimization quality before finalizing
6. **Iterate if needed** - Re-optimize if token count still too high
