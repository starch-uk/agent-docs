# Versioning System

This plan documents the versioning system for docs files and the project as a
whole.

## Overview

Every file in the `docs/` directory should be versioned using semantic
versioning (semver). The project as a whole also maintains a version in
`package.json`.

## Versioning Rules

Versions are compared against the latest commit in the `main` branch. Changes
are categorized as:

### Patch Version Bump (x.x.X)

Minor changes or corrections:

- Typo fixes
- Clarifications
- Formatting fixes
- Minor corrections to existing content
- Small additions that don't add new sections

**Example:** Fixing a typo in an API description, correcting a code example,
clarifying a configuration option.

### Minor Version Bump (x.X.x)

New sections added to a file:

- Adding new API sections
- Adding new configuration options
- Adding new patterns or best practices
- Adding new architectural information
- Adding new examples or use cases

**Example:** Adding a new "Advanced Patterns" section, documenting a new API
method, adding new configuration properties.

### Major Version Bump (X.x.x)

Sections replaced or removed from a file:

- Removing entire sections
- Replacing sections with different content
- Breaking changes in APIs or configuration
- Significant restructuring of content
- Removing deprecated information that changes the doc's scope

**Example:** Removing a deprecated API section, restructuring the entire
Architecture section, removing support for a major feature.

## Project Versioning

The project as a whole maintains a version in `package.json` (starting at
`0.0.0`).

### Version Bump Rules

Changes to docs files should increment the project version based on the
**greatest change** in any docs file:

- If any doc has a **major** version bump → project gets **major** version bump
- Else if any doc has a **minor** version bump → project gets **minor** version
  bump
- Else if any doc has a **patch** version bump → project gets **patch** version
  bump

**Example:**

- PMD.md: patch bump (1.0.0 → 1.0.1)
- ESLINT.md: minor bump (1.0.0 → 1.1.0)
- XPATH31.md: no change

Project version: minor bump (because ESLINT.md had a minor bump, which is
greater than PMD.md's patch bump)

## Initializing Existing Docs

The existing documentation files in the `docs/` directory need to be initialized
with version information when the versioning system is first implemented:

- **APEXDOC.md**
- **CICD.md**
- **CODEANALYZERCONFIG.md**
- **CPD.md**
- **ESLINT.md**
- **ESLINTJSDOC.md**
- **FLOWSCANNER.md**
- **GRAPHBINARY.md**
- **GRAPHENGINE.md**
- **GRAPHML.md**
- **GRAPHSON.md**
- **GREMLIN.md**
- **GRYO.md**
- **HUSKY.md**
- **JEST30.md**
- **JORJE.md**
- **MCP.md**
- **PMD.md**
- **PMDAPEXAST.md**
- **PMDSUPPRESSWARNINGS.md**
- **PNPM.md**
- **PRETTIER.md**
- **PRETTIERAPEX.md**
- **REGEX.md**
- **RETIREJS.md**
- **SFCLI.md**
- **TINKERPOP.md**
- **VITEST.md**
- **VSCODE.md**
- **XPATH31.md**

All existing docs should be initialized with version `1.0.0` (or appropriate
version based on their current state) when the versioning system is first
implemented. These existing docs will be tracked going forward using the same
semver system.

## Version Tracking

Versions can be tracked in several ways:

### Option 1: File Metadata

Add version information to each doc file:

```markdown
# PMD Quick Reference

**Version:** 1.0.0 **Last Updated:** 2024-01-15

...
```

### Option 2: Separate Version File

Maintain a `docs/VERSIONS.json` file:

```json
{
	"PMD.md": "1.0.0",
	"ESLINT.md": "1.1.0",
	"XPATH31.md": "1.0.0"
}
```

### Option 3: Git Tags

Use git tags to track versions:

- Tag format: `docs/PMD/v1.0.0`
- Compare against tagged versions

## Scripts for Versioning

Scripts can help with versioning by:

1. **Reading markdown files:**
    - Detect headers/sections
    - Parse version metadata (if using file metadata approach)
    - Identify content structure

2. **Comparing with git:**
    - Compare current state with latest commit in `main` branch
    - Detect added sections (minor bump)
    - Detect removed sections (major bump)
    - Detect changed content (patch bump)

3. **Determining version bumps:**
    - Analyze change types across all docs
    - Determine appropriate version bumps
    - Calculate project version based on greatest change

4. **Updating versions:**
    - Update version information in docs files
    - Update `package.json` version
    - Generate version metadata

5. **Initializing versions:**
    - Add version information to existing docs
    - Initialize version tracking for new docs
    - Set initial versions to `1.0.0`

## Workflow

1. **Make changes** to doc file(s)
2. **Analyze changes:**
    - Compare with latest commit in `main` branch
    - Categorize changes (patch/minor/major)
    - Determine version bumps needed

3. **Update versions:**
    - Update doc file version(s)
    - Update project version in `package.json`
    - Update version metadata

4. **Commit:**
    - Commit changes with version information
    - Include version bumps in commit message
    - Tag release if appropriate

## Best Practices

1. **Always compare against main** - Use latest commit in `main` branch as
   baseline
2. **Categorize accurately** - Be precise about patch vs minor vs major changes
3. **Document changes** - Note significant changes in commit messages
4. **Initialize properly** - Set initial versions for all existing docs
5. **Track consistently** - Use the same versioning approach for all docs
6. **Update project version** - Always update `package.json` when docs change
7. **Version on merge** - Determine versions when merging to `main`, not on
   feature branches

## Examples

### Example 1: Patch Bump

**Change:** Fixed typo in API description

- Before: `getData()` - Retreives data
- After: `getData()` - Retrieves data

**Version:** 1.0.0 → 1.0.1 (patch)

### Example 2: Minor Bump

**Change:** Added new "Advanced Patterns" section with 5 new patterns

**Version:** 1.0.0 → 1.1.0 (minor)

### Example 3: Major Bump

**Change:** Removed entire "Legacy API" section (deprecated)

**Version:** 1.0.0 → 2.0.0 (major)

### Example 4: Project Version

**Changes:**

- PMD.md: 1.0.0 → 1.0.1 (patch)
- ESLINT.md: 1.0.0 → 1.1.0 (minor)
- XPATH31.md: 1.0.0 → 2.0.0 (major)

**Project Version:** 0.0.0 → 1.0.0 (major, because XPATH31.md had a major bump)
