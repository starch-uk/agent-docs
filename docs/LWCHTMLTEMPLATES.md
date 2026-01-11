# LWC HTML Templates

> **Version**: 1.0.0

## File Structure

- Location: `lwc/<ComponentName>/<ComponentName>.html`
- Additional HTML files allowed for multiple template rendering (advanced)
- Leverage virtual DOM; avoid manual DOM manipulation in JavaScript

## Template Structure

- **Root element:** `<template>` (renders as `<namespace-component-name>`)
- **Nested `<template>` tags:** required for directives; only allowed
  attributes:
    - `for:each`, `iterator:iteratorname`, `lwc:if`, `lwc:else`, `lwc:elseif`,
      `if:true|false`
    - No other directives or HTML attributes (e.g., no `class` on nested
      `<template>`)
- **No inline `<style>` or `<script>` tags** — use separate CSS/JS files
- Follow Lightning Design System patterns and accessibility guidelines

## Data Binding & Expressions

| Syntax            | Usage                                 |
| ----------------- | ------------------------------------- |
| `{property}`      | Bind data (no spaces around property) |
| `{data.name}`     | Dot notation supported                |
| `{!property}`     | Two-way binding (form inputs)         |
| `{handlerMethod}` | Event handler binding                 |

### Allowed Expression Syntax

The `{expression}` binding syntax **only** supports:

- **Simple property references:** `{myProperty}`
- **Dot notation paths:** `{contact.name}`, `{account.owner.email}`
- **Method references for events:** `onclick={handleClick}`

**That's it.** No operators, no function calls, no array indexing, no ternaries.

### ❌ What's NOT Allowed (Common AI Agent Mistakes)

```html
<!-- ❌ Logical operators -->
{isReadOnly || isLoading} {isActive && isVisible}

<!-- ❌ Negation operator -->
{!isDisabled}

<!-- ❌ Ternary expressions -->
{isActive ? 'active' : 'inactive'}

<!-- ❌ Arithmetic -->
{count + 1} {price * quantity}

<!-- ❌ Array indexing -->
{items[0].name} {person[2].name['John']}

<!-- ❌ Function calls in templates -->
{formatDate(startDate)} {calculateTotal()}

<!-- ❌ String concatenation -->
{'Hello ' + name} {`Item: ${itemName}`}

<!-- ❌ Comparisons -->
{count > 0} {status === 'active'}

<!-- ❌ Nullish coalescing / optional chaining in binding -->
{user?.name} {value ?? 'default'}
```

### ✅ The Solution: Use JavaScript Getters

All computed logic **must** be moved to getters in the JavaScript class:

**JavaScript (myComponent.js):**

```javascript
import { LightningElement, api, track } from 'lwc';

export default class MyComponent extends LightningElement {
	@api isReadOnly = false;
	@api isLoading = false;
	@track items = [];

	// ✅ Logical operators → getter
	get isDisabled() {
		return this.isReadOnly || this.isLoading;
	}

	// ✅ Negation → getter
	get isEnabled() {
		return !this.isDisabled;
	}

	// ✅ Ternary → getter
	get buttonLabel() {
		return this.isLoading ? 'Loading...' : 'Submit';
	}

	// ✅ Arithmetic → getter
	get itemCountPlusOne() {
		return this.count + 1;
	}

	// ✅ Array indexing → getter
	get firstItemName() {
		return this.items[0]?.name || '';
	}

	// ✅ String formatting → getter
	get formattedCount() {
		return `${this.count} items`;
	}

	// ✅ Comparisons for conditional rendering → getter
	get hasItems() {
		return this.items.length > 0;
	}

	// ✅ Complex class computation → getter
	get containerClass() {
		return {
			'slds-box': true,
			'slds-theme_shade': this.isActive,
			'slds-hide': !this.isVisible,
		};
	}
}
```

**HTML (myComponent.html):**

```html
<template>
	<template lwc:if="{hasItems}">
		<div class="{containerClass}">
			<p>{formattedCount}</p>
			<p>First item: {firstItemName}</p>
		</div>
	</template>

	<lightning-button
		label="{buttonLabel}"
		disabled="{isDisabled}"
		onclick="{handleClick}"
	>
	</lightning-button>
</template>
```

### Why This Design?

Salesforce made this intentional choice for:

| Reason             | Explanation                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| **Performance**    | Simple property lookups are fast; no runtime expression parsing/evaluation |
| **Security**       | No risk of template injection or expression-based exploits                 |
| **Predictability** | Reactivity is straightforward—change a property, component re-renders      |
| **Testability**    | All logic lives in unit-testable JavaScript, not scattered in templates    |
| **Debugging**      | Stack traces point to JS files, not opaque template expressions            |

### AI Agent Rule Summary

> **LWC Template Expression Rule:** The `{...}` binding syntax accepts ONLY
> property names and dot-notation paths. Any logic requiring operators (`||`,
> `&&`, `?:`, `+`, `>`, `===`, etc.), function calls, array indexing, or string
> interpolation MUST be implemented as a getter in the JavaScript class.

```
Template binding:  {propertyName} or {object.nested.property}
Computed logic:    get computedProperty() { return /* any JS expression */; }
```

## Conditional Rendering

Use `lwc:if`, `lwc:elseif`, `lwc:else` directives (prefer over multiple
templates for simple conditions):

```html
<template lwc:if="{condition}">...</template>
<template lwc:elseif="{otherCondition}">...</template>
<template lwc:else>...</template>
```

**Note:** The condition must be a simple property reference or getter—not an
expression:

```html
<!-- ❌ Invalid -->
<template lwc:if="{items.length">
	0}>

	<!-- ✅ Valid — use a getter -->
	<template lwc:if="{hasItems}"></template
></template>
```

## List Rendering

### for:each

```html
<template for:each="{array}" for:item="item">
	<div key="{item.uniqueId}">{item.property}</div>
</template>
```

- `key` required: string/number, **not** index or object
- Access current item via `for:item="itemName"` → `{itemName.property}`

### iterator

```html
<template iterator:it="{array}">
	<div key="{it.value.uniqueId}">{it.value.property}</div>
</template>
```

- Iterator name must be lowercase
- Properties: `{it.value.property}`, `{it.index}`, `{it.first}`, `{it.last}`
- Combine with `lwc:if` for first/last styling: `lwc:if={it.first}`

## Multiple Template Rendering (Advanced)

- Import templates: `import templateOne from "./templateOne.html"`
- Override `render()` to return template based on state
- CSS must match template filename: `templateTwo.html` → `templateTwo.css`
- Default: `componentName.html` when no `render()` override
- **Prefer `lwc:if` for simple variations; use multiple templates for
  significantly different layouts**

## Class Object Binding (LWC API v62.0+)

Bind dynamic classes using arrays or objects instead of string concatenation:

| Input                              | Output                     |
| ---------------------------------- | -------------------------- |
| `["highlight", "yellow"]`          | `class="highlight yellow"` |
| `{highlight: true, hidden: false}` | `class="highlight"`        |

- Booleans, numbers, functions render as empty string (use `String(value)` if
  needed)
- Use getters to compute complex class combinations

**Example with getter:**

```javascript
get cardClasses() {
    return {
        'slds-card': true,
        'slds-card_boundary': this.hasBorder,
        'custom-highlight': this.isHighlighted
    };
}
```

```html
<div class="{cardClasses}">...</div>
```

## Inline Style Binding

- Syntax: `style={computedStyles}`
- Getter returns semi-colon separated properties: `width: 50%; font-size: 20px`
- Use kebab-case CSS properties (`font-size`, not `fontSize`)
- **Prefer CSS classes over inline styles**; use inline for dynamic/computed
  values only

**Example:**

```javascript
get progressBarStyle() {
    return `width: ${this.progressPercent}%; background-color: ${this.barColor}`;
}
```

```html
<div class="progress-bar" style="{progressBarStyle}"></div>
```

## Event Handling

- Bind handlers via method reference: `onclick={handleClick}`
- No inline functions in templates
- Access values via `event.target.value`
- Custom events: extend `LightningElement`, use proper event naming

```html
<!-- ❌ Invalid — no inline functions -->
<button onclick="{()" ="">
	this.handleClick()}>

	<!-- ✅ Valid — method reference -->
	<button onclick="{handleClick}"></button>
</button>
```

## Accessibility

- Include proper ARIA attributes
- Use semantic HTML elements
- Ensure keyboard navigation for interactive elements

## Performance

- Minimize DOM manipulation
- Use lazy loading / pagination for large lists
- Avoid unnecessary rerenders by optimizing data binding
- Getters are re-evaluated on every render—keep them lightweight or cache
  expensive computations

## Validation Checklist

- [ ] File path: `lwc/<ComponentName>/<ComponentName>.html`
- [ ] Root element is `<template>`
- [ ] Nested `<template>` tags include only allowed directives
- [ ] Nested `<template>` tags have no other attributes (e.g., no `class`)
- [ ] No inline `<style>` or `<script>` tags
- [ ] No manual DOM manipulation in JS
- [ ] Data binding: `{property}` syntax, no spaces
- [ ] **No computed expressions in templates** (no operators, function calls,
      array indexing)
- [ ] **All computed logic implemented as getters in JS class**
- [ ] `for:each`: has `for:item` and unique `key` (string/number)
- [ ] `iterator`: lowercase name, unique `key={it.value.uniqueId}`
- [ ] Multiple templates: proper imports, `render()` override, matching CSS
      filenames
- [ ] Class binding follows v62.0+ semantics (arrays/objects via getters)
- [ ] Inline styles: `style={getter}`, kebab-case properties
- [ ] Valid HTML syntax (use Salesforce Extensions Pack for validation)
- [ ] Follows accessibility and performance best practices
