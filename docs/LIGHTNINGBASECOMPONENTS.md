# Lightning Base Components

> **Version**: 1.0.0

## Guidelines
- Prefer base components over custom HTML - built-in SLDS, a11y, less maintenance
- A11y: Always provide accessible names via `label`, `aria-label`, `alternative-text`
- Events: `onclick` (buttons), `onchange`/`onselect` (inputs/menus), `onstatuschange` (flows), `onuploadfinished` (files), `onscan`/`onerror` (barcode)
- Nav: Use `lightning/navigation` not `href`
- Style: SLDS utilities + `--slds-c-*` CSS vars. Avoid internal overrides
- Files: Guest uploads via org prefs. `file-field-name`/`value` for guests, `record-id` for auth users
- Limits: combobox no multi-select/autocomplete; barcode/click-to-dial no iFrames; carousel max 6 images; flow restrictions on LWR+custom components

## ValidityState & Validation
**ValidityState props** (all boolean): `valid`, `valueMissing`, `typeMismatch`, `patternMismatch`, `tooLong`, `tooShort`, `rangeOverflow`, `rangeUnderflow`, `stepMismatch`, `badInput`, `customError`

**Methods**: `setCustomValidity(msg)`, `reportValidity()`, `checkValidity()`

**Custom messages**: `message-when-value-missing`, `message-when-type-mismatch`, `message-when-pattern-mismatch`, `message-when-too-long`, `message-when-too-short`, `message-when-range-overflow`, `message-when-range-underflow`, `message-when-step-mismatch`, `message-when-bad-input`

Start w/ LDS components for built-in validation. Client+server validation together.

## Components

**Legend**: `*` = required, `|` = options, `→` = returns

### lightning-accordion-section
Nest in `lightning-accordion`
- `class`, `heading-level` (1-6), `label`, `name`*
- Slots: default, `actions`
- ARIA: `role="listitem"`, `aria-expanded`, `aria-controls`
- Event: `onactive`

### lightning-alert (lightning/alert)
`LightningAlert.open(config)` → Promise
- `label`, `message`*, `theme` (default|shade|inverse|alt-inverse|success|info|warning|error|offline), `variant` (header|headerless)
- ARIA: `role="alertdialog"`, focus trap

### lightning-avatar
- `alternative-text`* (if informational), `class`, `fallback-icon-name` (standard/custom only), `initials`, `src`, `variant` (circle|square)
- Initials+fallback: initials show w/ icon bg color

### lightning-badge
- `class`, `icon-name`, `icon-position` (end|start), `label`
- No links/nested elements. Use `slds-theme_*` for colors

### lightning-barcode-scanner
Mobile only, no iFrames
- `disabled`, `disabled-alternative-text`, `disabled-icon-src`, `enable-continuous-scan`, `enabled-alternative-text`, `enabled-icon-src`, `icon-size`
- Events: `onerror`, `onscan` → `event.detail.scannedBarcodes`

### lightning-breadcrumb
Nest in `lightning-breadcrumbs`
- `class`, `href` (defaults "#"), `label`*, `name`
- Event: `onclick` (use w/ lightning/navigation)

### lightning-breadcrumbs
- `class`
- Slots: `lightning-breadcrumb`
- ARIA: `role="navigation"`, last item `aria-current="page"`

### lightning-button
- `accesskey`, `aria-atomic`, `aria-controls`, `aria-describedby`, `aria-expanded`, `aria-haspopup`, `aria-label`, `aria-labelledby`, `aria-live`, `class`, `disabled`, `disable-animation`, `icon-name` (utility), `icon-position` (end|start), `label`*, `stretch`, `tabindex`, `title`, `type` (button|reset|submit), `variant` (base|brand|brand-outline|destructive|destructive-text|inverse|neutral|success)
- Event: `onclick`
- Use button-icon for icon-only. Min 44x44px mobile

### lightning-button-group
- `class`
- Slots: `lightning-button*`

### lightning-button-icon-stateful
- `accesskey`, `alternative-text`, `aria-atomic`, `aria-controls`, `aria-describedby`, `aria-expanded`, `aria-haspopup`, `aria-label`*, `aria-live`, `class`, `disabled`, `icon-name`* (utility), `selected`, `size`, `variant` (border|border-filled|border-inverse)
- ARIA: `aria-pressed`
- Event: `onclick`

### lightning-button-menu
- `alternative-text`, `class`, `disabled`, `icon-name`, `icon-size`, `is-draft`, `draft-alternative-text`, `is-loading`, `loading-state-alternative-text`, `label`, `menu-alignment`, `size`, `tooltip`, `title`, `variant` (bare|bare-inverse|border|border-filled|border-inverse|container)
- Slots: `lightning-menu-item`, `lightning-menu-divider`, `lightning-menu-subheader`
- ARIA: `aria-haspopup="true"`, `aria-expanded`
- Events: `onclose`, `onopen`, `onselect`

### lightning-button-stateful
- `accesskey`, `aria-*` (same as button), `class`, `disabled`, `icon-name` (utility), `label-when-hover`, `label-when-off`, `label-when-on`, `selected`, `tabindex`, `variant` (brand|destructive|inverse|neutral|success|text)
- ARIA: `aria-pressed`, `aria-live="polite"`
- Event: `onclick` (toggle selected)

### lightning-card
- `class`, `icon-name`, `title`
- Slots: `actions`, `footer`, `title`, default

### lightning-carousel
Max 6 images
- `class`, `disable-auto-refresh`, `disable-auto-scroll`, `scroll-duration`
- Slots: `lightning-carousel-image`
- ARIA: indicators `role="tablist"`

### lightning-carousel-image
- `alternative-text`, `description`, `header`, `href`, `src`*

### lightning-click-to-dial
Lightning Experience only, no iFrames. Requires Open CTI `enableClickToDial`
- `record-id`, `value` (phone)
- Event: `onclicktodial`

### lightning-combobox
No multi-select/autocomplete. Mobile issues - consider HTML `<select>`
- `autocomplete`, `class`, `label`*, `message-when-value-missing`, `options`* [{value,label,description?}], `required`, `validity`, `value`, `variant` (label-hidden)
- Events: `onchange` → `event.detail.selectedValue`, `onopen`

### lightning-dynamic-icon
- `alternative-text` (provide on small screens), `type`* (ellie|eq|score|strength|trend|waffle)

### lightning-file-upload
Max 25 files, 2GB each. Guest: create `*fileupload__c` field
- `accept`, `class`, `file-field-name`, `file-field-value`, `label`, `record-id`
- Event: `onuploadfinished` → `event.detail.files` [{name,documentId}]

### lightning-flow
Custom components unsupported on LWR
- `flow-api-name`*, `flow-input-variables`, `flow-finish-behavior` (NONE|RESTART)
- Event: `onstatuschange` → status, outputVariables

### lightning-formatted-address
Format by user locale. Links Google Maps
- `city`, `country`, `disabled`, `latitude`, `longitude`, `postal-code`, `province`, `show-static-map`, `street`, `variant` (plain)

### lightning-formatted-email
- `bcc`, `body`, `cc`, `disable-linkify`, `hide-icon`, `label`, `subject`, `value`

### lightning-formatted-location
- `latitude`*, `longitude`*

### lightning-formatted-number
User locale
- `currency-code`, `currency-display-as` (code|name|symbol), `format-style` (currency|decimal|percent|percent-fixed), `maximum-fraction-digits`, `maximum-significant-digits`, `minimum-fraction-digits`, `minimum-significant-digits`, `value`*

### lightning-formatted-rich-text
- `disable-linkify`, `value`
- Supported: a, div, p, h1-h6, strong, em, ul, ol, li, table, img, etc.

### lightning-formatted-time
- `value`* (ISO8601)

### lightning-input
- `accept`, `aria-describedby`, `aria-labelledby`, `autocomplete`, `checked`, `class`, `date-aria-describedby`, `date-aria-labelledby`, `disabled`, `field-level-help`, `files`, `label`*, `max`, `maxlength`, `message-when-*` (all validation msgs), `min`, `minlength`, `multiple`, `name`, `pattern`, `placeholder`, `readonly`, `required`, `step`, `time-aria-describedby`, `time-aria-labelledby`, `type` (checkbox|checkbox-button|color|date|datetime|datetime-local|email|file|number|password|search|tel|text|time|toggle|url), `validity`, `value`, `variant` (label-hidden|label-inline|label-stacked|standard)
- Events: `onblur`, `onchange`, `onfocus`, `oninput`

### lightning-input-field
- `field-name`*, `required`, `value`, `variant`
- Event: `onchange`

### lightning-input-location
Validates lat -90/90, lon -180/180
- `city`, `country`, `latitude`, `longitude`, `postal-code`, `province`, `street`
- Event: `onchange` → lat, lon

### lightning-layout-item
- `flexibility`, `large-device-size` (1-12), `medium-device-size`, `padding`, `size`, `small-device-size`

### lightning-map
- `center`, `list-view`, `map-markers`*, `markers-title`, `show-footer-address`, `zoom-level`

### lightning-menu-divider
- `variant` (compact|default)

### lightning-menu-item
- `accesskey`, `checked`, `class`, `draft-alternative-text`, `href`, `icon-name`, `icon-type` (color|standard), `is-draft`, `label`, `prefix-icon-name`, `tabindex`, `target`, `value`
- Selection via parent `onselect`

### lightning-menu-subheader
- `label`*

### lightning-modal (lightning/modal)
Extend `LightningModal`
- `description`, `disableClose`, `label`*, `size` (full|large|medium|small)
- ARIA: focus trap
- Events bubble to opener

### lightning-modal-body/footer
Slots: default

### lightning-modal-header
- `icon-assistive-text`, `icon-name`, `label`*

### lightning-omnistudio-flexcard
- `flexcard-name`*, `input`, `record-id`

### lightning-omnistudio-omniscript
- `input`, `record-id`, `script-name`*

### lightning-output-field
- `field-name`*, `record-id`, `variant` (label-hidden|standard)

### lightning-pill
3 clickable areas: icon/avatar, label, remove btn
- `class`, `has-error`, `href`, `label`, `name`, `variant` (link|plain)
- Slots: default (icon/avatar)
- Events: `onclick`, `onremove`

### lightning-pill-container
- `class`, `is-collapsible`, `is-expanded`, `items`*, `single-line`, `variant` (bare|standard)
- Event: `onitemremove` → item, index

### lightning-progress-bar
- `size` (large|medium|small|x-large), `value`* (0-100), `variant` (circular|circular-with-label|light)

### lightning-progress-indicator
- `class`, `current-step`, `type` (horizontal|vertical), `variant` (base|path)
- Slots: `lightning-progress-step`

### lightning-progress-ring
- `direction` (clockwise|counterclockwise), `value`* (0-100), `variant` (active-step|base|base-autocomplete|expired|warning)

### lightning-prompt (lightning/prompt)
`LightningPrompt.open()` → Promise
- `defaultValue`, `label`*, `message`, `options`, `variant` (header|headerless)

### lightning-quick-action-panel
- `object-api-name`*, `quick-action-api-name`, `record-id`*
- Event: `onquickactionmenu`

### lightning-record-edit-form
Uses LDS. Shows first validation error
- `class`, `layout-type` (Compact|Full), `mode` (edit|readonly), `object-api-name`, `record-id`
- Events: `onerror`, `onload`, `onsubmit`, `onsuccess`

### lightning-relative-date-time
- `class`, `options`, `value`*

### lightning-rich-text-toolbar-button
- `class`, `disabled`, `icon-name`, `pressed`, `value`

### lightning-rich-text-toolbar-button-group
Slots: `lightning-rich-text-toolbar-button`

### lightning-select
- `class`, `disabled`, `field-level-help`, `label`*, `message-when-value-missing`, `multiple`, `options` [{value,label,disabled?}], `required`, `size`, `validity`, `value`, `variant`
- Event: `onchange` → `event.detail.value`

### lightning-slider
Use onchange not onblur (Safari). Values clamped to min/max
- `class`, `disabled`, `label`, `max` (100), `min` (0), `step`, `type` (horizontal|vertical), `value`
- Event: `onchange`

### lightning-spinner
- `variant` (brand|inverse|default)
- Use w/ `if:true`

### lightning-tab
Lazy loaded. Only query active/prev-active content
- `class`, `end-icon-alternative-text`, `end-icon-name`, `icon-assistive-text`, `icon-name`, `label`*, `show-error-indicator`
- Event: `onactive`

### lightning-textarea
- `aria-describedby`, `aria-labelledby`, `autocomplete`, `class`, `disabled`, `label`*, `maxlength`, `message-when-*`, `minlength`, `placeholder`, `read-only`, `required`, `validity`, `value`, `variant`
- Events: `onblur`, `onchange`, `onfocus`

### lightning-tile
- `class`, `label`*
- Slots: `media`, default
- Event: `onactiontriggered`

### lightning-toast (lightning/toast)
`Toast.show()` → Promise
- `label`*, `labelLinks`, `message`, `messageLinks`, `mode` (dismissible|sticky), `variant` (error|info|success|warning)

### lightning-toast-container (lightning/toastContainer)
One per page. Ctrl+F6/Cmd+F6 nav
- `containerPosition` (absolute|fixed), `maxToasts` (3), `toastPosition` (bottom-center|bottom-left|bottom-right|top-center|top-left|top-right)

### lightning-tree
- `class`, `header`, `items`*
- Event: `onselect` → name

### lightning-tree-grid
Set `sortable:true` on columns for sorting
- `class`, `columns`*, `data`, `expanded-rows`, `hide-checkbox-column`, `key-field`*, `max-column-width`, `min-column-width`, `resize-column-disabled`, `selected-rows`, `show-row-number-column`, `variant`
- Events: `onrowaction`, `onrowselection`, `onsort`

### lightning-vertical-navigation
- `class`, `selected-item`
- Slots: `lightning-vertical-navigation-item*`
- Events: `onbeforeselect`, `onselect`

### lightning-vertical-navigation-item
- `badge`, `class`, `href`, `icon-name`, `label`*, `name`
- Event: `onselect`

### lightning-vertical-navigation-item-badge
- `class`, `label`, `variant` (default|inverse|lightest)

### lightning-vertical-navigation-item-icon
- `alternative-text`, `class`, `icon-name`, `position` (end|start)

## Patterns

### Validation
```js
// Check validity
if (!this.template.querySelector('lightning-input').checkValidity()) {
  this.template.querySelector('lightning-input').reportValidity();
}
```

### Styling
```html
<lightning-button class="slds-m-left_small">
```
```css
--slds-c-button-color-background
--slds-c-button-text-color
```

### Navigation
```js
import { NavigationMixin } from 'lightning/navigation';
this[NavigationMixin.Navigate]({
  type: 'standard__recordPage',
  attributes: { recordId, actionName: 'view' }
});
```

### Events
```js
handleChange(event) {
  const value = event.detail.value; // or .selectedValue
}
```
