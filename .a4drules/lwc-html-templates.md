# Rule: LWC HTML Templates

**Description:** Validate and enforce correct structure, syntax, and best practices for Lightning Web Component HTML templates.

**Applies to:** `lwc/**/*.html`

## Guidelines

- File suffix & location
  - Files must reside in `lwc/` folder structure and use `.html` suffix
  - Each LWC component folder should contain at least one `.html` file matching the component name
  - Additional HTML files may be included for advanced multiple template rendering scenarios

- Template structure
  - Must use `<template>` as the root element
  - Use standard HTML with LWC-specific directives
  - Template tag is replaced with component name (`<namespace-component-name>`) when rendered
  - Use nested `<template>` tags for working with directives
  - Template content should follow Lightning Design System patterns and accessibility guidelines
  - Avoid inline styles and scripts; use CSS files and JavaScript for styling and logic
  - Leverage virtual DOM for smart and efficient rendering instead of manual DOM manipulation with JavaScript
  - Use simple syntax to declaratively bind template to data in JavaScript class

- Template capabilities
  - Bind data in templates using expression syntax
  - Render HTML conditionally using conditional directives
  - Render lists using iteration directives
  - Render multiple templates conditionally (advanced pattern)

- Multiple template rendering (advanced)
  - Import multiple HTML templates: `import templateOne from "./templateOne.html"`
  - Override `render()` method to return template reference based on component state
  - `render()` must return imported template reference (default export from HTML file)
  - Prefer `lwc:if|elseif|else` directives over multiple templates for simple conditional rendering
  - CSS files must match template filename: `templateTwo.html` uses `templateTwo.css` only
  - Default template (`componentName.html`) used when no `render()` override
  - Use for significantly different component layouts/behaviors, not simple variations

- Data binding and expressions
  - Use `{property}` syntax for data binding - surround property with curly braces without spaces
  - Properties can be JavaScript identifiers (`{data}`) or dot notation (`{data.name}`)
  - Cannot use computed expressions like `{person[2].name['John']}` - use getters instead
  - Properties should contain primitive values except when used in `for:each` or `iterator` directives
  - Use `{!property}` for two-way binding where appropriate (typically with form inputs)
  - Expressions in templates are reevaluated when component rerenders
  - Avoid complex logic in template expressions - use getters for computations

- Getter usage for computed values
  - Define getters in JavaScript class: `get propertyName() { ... }`
  - Access getters from template: `{propertyName}`
  - Getters are more powerful than template expressions and enable unit testing
  - Use getters to compute derived values from reactive properties
  - All fields are reactive - component rerenders when field values change
  - If a field is used in a template or indirectly in a getter used in a template, changes trigger rerender

- Event handling in templates
  - Bind event handlers using same syntax: `{handleChange}`
  - Event handlers receive event objects containing change information
  - Use `event.target.value` to get input field values
  - Event handling enables two-way data binding with form controls

- Directives and iteration
  - Use `lwc:if`, `lwc:elseif`, `lwc:else` for conditional rendering
  - Use `for:each` and `iterator:*` for list iteration with proper key attributes
  - Apply `lwc:dom="manual"` only when necessary for third-party libraries
  - Nested `<template>` tags must include one of: `for:each`, `iterator:iteratorname`, `lwc:if`, `lwc:else`, `lwc:elseif`, `if:true|false`
  - Nested `<template>` tags cannot use other directives or HTML attributes (e.g., no `class` attribute on `<template>`)

- List rendering with for:each
  - Use `for:each={array}` directive on nested `<template>` tag
  - Access current item with `for:item="itemName"`: `{itemName.property}`
  - Must include unique `key={uniqueId}` for each item (string or number, not object or index)
  - Key enables performance optimization and change tracking
  - Use private property to generate unique keys for new items

- List rendering with iterator
  - Use `iterator:name={array}` directive on nested `<template>` tag
  - Iterator name must be lowercase
  - Access properties: `{name}.value.{property}`, `{name}.index`, `{name}.first`, `{name}.last`
  - `first` and `last` booleans enable special behaviors for first/last items
  - Combine with `lwc:if` for conditional styling: `lwc:if={it.first}`
  - Must include unique `key={name.value.uniqueId}` for each item

- Event handling
  - Event handlers should follow naming convention (e.g., `onclick={handleClick}`)
  - Custom events should extend `LightningElement` and use proper event naming
  - Avoid inline event handlers in favor of method references

- Accessibility
  - Include proper ARIA attributes where needed
  - Use semantic HTML elements when possible
  - Ensure keyboard navigation support for interactive elements

- HTML template considerations
  - Components may throw errors or warnings for invalid HTML syntax
  - Use Salesforce Extensions Pack for VS Code to flag malformed template code
  - Follow HTML Template Directives documentation for supported directives

- Class object binding (LWC API v62.0+)
  - Use class object binding instead of string concatenation for complex class names
  - Bind classes using arrays or objects: `class={computedClassNames}`
  - Arrays evaluate individual items: `["highlight", "yellow"]` → `class="highlight yellow"`
  - Objects evaluate truthy keys only: `{highlight: true, hidden: false}` → `class="highlight"`
  - Booleans, numbers, and functions render as empty string (not converted to strings)
  - Convert values to strings using `String(value)` if string representation is needed
  - Use getters to compute complex class combinations from reactive properties
  - Requires LWC API v62.0 or later (different behavior in earlier versions)

- Inline style binding
  - Bind inline styles using `style={computedStyles}` syntax
  - Use getters to compute dynamic inline styles: `get computedStyles() { return `property: value`; }`
  - Separate multiple styles with semi-colons: `width: 50%; font-size: 20px`
  - Use kebab-cased CSS property names (font-size, not fontSize)
  - Prefer CSS classes over inline styles for reusability and maintainability
  - Use inline styles for computed/dynamic values based on conditions or reactive properties
  - Follow standard CSS property guidelines when binding inline styles

- Performance considerations
  - Minimize DOM manipulation in templates
  - Use lazy loading for large lists with `lwc:if` or pagination
  - Avoid unnecessary re-renders by optimizing data binding

## Validation checklist

- File path: `lwc/<ComponentName>/<ComponentName>.html`
- Root element is `<template>` (renders as `<namespace-component-name>`)
- Nested `<template>` tags used appropriately for directives
- Nested `<template>` tags include only allowed directives: `for:each`, `iterator:iteratorname`, `lwc:if`, `lwc:else`, `lwc:elseif`, `if:true|false`
- Nested `<template>` tags do not have other directives or HTML attributes (e.g., no `class` attribute)
- No inline `<style>` or `<script>` tags
- No manual DOM manipulation in JavaScript (leverage virtual DOM)
- Data binding expressions use proper syntax: `{property}` with no spaces around property
- Data binding supports JavaScript identifiers and dot notation only (no computed expressions)
- Properties contain primitive values except in `for:each` or `iterator` directives
- Two-way binding uses `{!property}` where appropriate
- Event handlers bound using `{handlerMethod}` syntax (no inline functions)
- Complex computations handled by JavaScript getters, not template expressions
- Getters properly defined in JavaScript class for computed template values
- Template expressions are reactive and reevaluated on component rerender
- Conditional directives use correct syntax (`lwc:if`, `lwc:elseif`, `lwc:else`)
- Iterator directives have required `key` attributes
- for:each directives include `for:item` and unique `key` (string/number, not index or object)
- iterator directives use lowercase names and include unique `key={it.value.uniqueId}`
- Iterator properties accessed correctly: `{it.value.property}`, `{it.index}`, `{it.first}`, `{it.last}`
- Multiple template rendering uses proper imports and render() method override
- CSS files match corresponding template filenames for multiple templates
- Template follows accessibility best practices
- Valid HTML syntax (no malformed markup that would cause errors/warnings)
- Class object binding follows LWC API v62.0+ semantics (arrays/objects, no boolean/number/function conversion)
- Inline styles use proper syntax: `style={getterName}` with semi-colon separated properties
- Inline styles use kebab-case CSS properties (font-size, not fontSize)
- Prefer CSS classes over inline styles for static styling

## Compact rule form

```text
# Rule: LWC HTML Templates
Description: Validate structure and best practices for LWC HTML templates
Applies to: `lwc/**/*.html`
Guidelines:
- File in lwc/ folder, .html suffix matching component name
- Root element must be <template>, nested templates for directives
- Leverage virtual DOM, avoid manual DOM manipulation
- No inline styles or scripts
- Data binding, conditional rendering, list iteration, multiple templates supported
- Data binding: {property} syntax (no spaces), JavaScript identifiers and dot notation only
- No computed expressions in templates - use getters for complex logic
- Two-way binding: {!property} for form controls with event handlers
- Reactive fields: component rerenders when property values change
- Conditional rendering: lwc:if/elseif/else
- List rendering: for:each={array} for:item="item" with unique key={uniqueId}
- Iterator: iterator:name={array} with {name.value}, {name.index}, {name.first}, {name.last}
- Multiple templates: import templates, override render() method (advanced, prefer lwc:if)
- Nested templates: only allowed directives (for:each, iterator:*, lwc:if/else/elseif, if:true|false)
- Nested templates: no other directives or HTML attributes
- Event handlers: method references only, no inline functions
- Class object binding: use arrays/objects for complex classes (LWC API v62.0+)
- Inline styles: style={getter} with kebab-case properties, prefer CSS classes
- Valid HTML syntax, use Salesforce Extensions Pack for VS Code validation
- Follow accessibility and performance best practices
```