# Agentforce Rules Reference

> **Version**: 1.0.0

Purpose

- Provide persistent system‑level guidance Agentforce follows during Salesforce
  development.
- Enforce coding, metadata, org and team conventions across sessions.

Key concepts

- Rules are persistent instructions that influence Agentforce behavior.
- Two scopes:
    - Global — companywide standards applied to all projects.
    - Workspace — project/org specific; stored in the project’s .a4drules
      folder.
- Out‑of‑the‑box global rules exist and can be toggled; shipped rules may be
  overwritten by extension updates.

Where to manage

- Open Rules & Workflows (justice icon) in Agentforce chat.
- Create: click + in Rules tab or use `/newrule` in chat.
- Popover UI: view active rules, enable/disable, add, delete.
- Workspace rules: project/.a4drules. Global rules: OS‑dependent location.

Minimal file template (low‑token)

```text
# Rule: [Name]

Description: [one-line purpose]

Applies to: `[file pattern]`

Guidelines:
- [short guideline 1]
- [short guideline 2]
```

Rule design patterns

- Scope: choose Global for org‑wide policies (naming, security) or Workspace for
  repo/org specifics.
- One file type per rule when possible to reduce ambiguity.
- Keep guidelines short, precise, and actionable (3–6 lines is ideal).
- Version‑gate rules for fields/features that require a minimum API version.

Validation checklist pattern (use inside rules)

- File suffix & location (e.g., `folder/*.ext`, include generated meta filenames
  like `*.ext-meta.xml`).
- Required fields present and follow naming/format rules.
- Mutually exclusive fields: only one of a defined set is present.
- Enumerations: value belongs to allowed list.
- Numeric fields: in allowed range and type (int/float).
- Cross‑field constraints (e.g., boolean toggle requires another field match).
- API version: ensure package API supports any fields used.
- Manifest behavior: wildcard support and retrieval side effects.

Common guideline examples (generic)

- File naming & location
    - Suffix must match the metadata type (e.g., `.ext` and optionally
      `.ext-meta.xml`) and files stored in the corresponding folder.

- Identity / fullName rules
    - fullName must use only letters, numbers and underscores; start with a
      letter; no spaces; not end with `_`; not contain `__`; unique within
      package.

- Exclusive content fields
    - Exactly one of [fieldA, fieldB, fieldC, fieldD] may be set. Enforce count
      == 1.

- Required / conditional fields
    - FieldX is required.
    - If FieldY = true then FieldZ must equal the related resource name.
    - If FieldType ∈ {type1, type2} then NumericHeight must be present and > 0.

- Enumerations & presets
    - Validate enumerated fields against the allowed list (store the list
      centrally in the rule).

- API gating
    - Only allow fields introduced in API ≥ N when package.xml version >= N.

- Manifest & retrieval
    - Support for wildcard (\*) in package.xml — note older API versions may
      behave differently.
    - Retrieving a component can cause related Profile/PermissionSet entries to
      include references; warn about side effects.

Example minimal templates

- Generic metadata file template

```xml
<MetadataType xmlns="http://soap.sforce.com/2006/04/metadata">
  <fullName>MyResource</fullName>
  <requiredField>value</requiredField>
  <optionalField>value</optionalField>
</MetadataType>
```

- Example rule pseudocode checks

```text
# Rule: SingleContentField

Description: Ensure exactly one content source is defined.

Applies to: `**/*.ext`

Guidelines:
- Count([fieldA, fieldB, fieldC, fieldD]) == 1
- If fieldC set -> ensure frameHeight is present and integer > 0
- Package API version must be >= 14 when using iconField
```

Best practices

- Make rules atomic and single‑purpose to simplify enforcement and debugging.
- Prefer short lines and plain tokens to keep rules compact for AI processing.
- Store enumerations centrally to avoid duplication and speed validation.
- Version‑gate rules for fields that depend on API releases.
- Test rule behavior by toggling and running typical retrieve/deploy scenarios.
- Review and update rules whenever package/API versions or team conventions
  change.

Rule lifecycle checklist

- Create: Name + one-line Description + Applies pattern.
- Add 3–6 precise Guidelines (format/validators/version gates).
- Save to workspace .a4drules or global rules UI.
- Enable and test with representative metadata files and package.xml.

Usage notes for agents

- Apply rules as filters during generation and validation steps.
- Prefer minimal, deterministic responses based on active rules.
- When multiple rules conflict, enforce Global rules last modified earlier than
  Workspace (or use a defined precedence ordering).
- Emit succinct validation errors with line/field hints to aid quick fixes.
