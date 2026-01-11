# Project: agent-docs

Define and maintain the `agent-docs` repository as a reusable set of low-token
AI agent instruction documents ("docs") for AI-enabled IDEs.

## Repository Setup

- **License**: MIT
- **Security contact**: security@starch.uk
- **Package manager**: pnpm
- **Primary contents**: Markdown documentation in `docs/`
- **Code formatting**: Prettier (via `pnpm format` / `pnpm format:check`)
- **CI**: GitHub Actions workflow that runs `pnpm format:check` on push/PR
- **Postinstall script**: `postinstall.mjs` that copies the `docs/` directory to
  consuming projects if they don't already have one
- **AI Agent Guidance**: `.cursor/plans/` contains structured workflows and
  instructions for AI coding assistants
- **IDE Rules**: `.cursor/rules/` contains agent rules for Cursor IDE
  integration

**Repository Files:**

The following files should be created following the same structure and style as
other starch-uk repositories:

### `README.md`

The README.md should contain:

- **Project title and description** - Brief overview of agent-docs as the
  reusable, low-token AI agent instruction documents to be reused in other
  projects
- **License badge** - MIT License badge link
- **Overview section** - Explanation of what docs are, their purpose (low token
  count, comprehensive, reusable), and their use in AI-enabled IDEs. This
  section should reference the inspiration from The Matrix (1999) where Neo says
  "I know kung fu" after having knowledge uploaded directly into his brain. In
  that scene, Neo instantly gains complete knowledge and skills without needing
  to learn through practice - the knowledge is simply "there" when needed.
  Similarly, agent-docs creates comprehensive documentation "programs" that can
  be referenced by AI agents, giving them instant, complete knowledge about
  libraries, frameworks, and tools. Just as Neo could access kung fu knowledge
  instantly, AI agents can reference these docs to immediately understand APIs,
  patterns, best practices, and architectural decisions without needing to
  search or learn incrementally. The docs serve as the "knowledge upload" that
  makes the AI agent instantly capable with any technology.
- **Installation instructions** - Should include:
    - Steps to clone the repository and install dependencies using pnpm
    - Instructions for adding the package to a project (as a dependency or
      submodule)
    - Explanation of the automatic `postinstall` behavior:
        - When `agent-docs` is installed into another project, a `postinstall`
          script will run in the consuming project.
        - If the consuming project does **not** already have a `docs/`
          directory, the script will copy this package's `docs/` directory to
          the consuming project's root directory.
        - If the consuming project **already has** a `docs/` directory, the
          script does nothing, and your existing docs layout is left unchanged.
    - Optional manual instructions for copying files if you prefer not to rely
      on `postinstall`, or need a custom layout:
        - Copy individual files from the `docs/` folder to the root of the
          actual project, OR
        - Copy the entire `docs` folder to the root of the actual project
    - Explanation of how to update IDE agent rules (e.g., Cursor's
      `.cursor/rules/` or similar) to reference the linked docs using
      `@filename` syntax or relative paths, so the AI agent can access the
      documentation when needed
- **Usage section** - Should explain how to create and maintain docs:
    - How to add new markdown files under `docs/` following the core concept
    - How to apply versioning and optimization plans from `.cursor/plans/*`
    - **AI Agent Guidance** - Explanation that `.cursor/plans/*` contains
      guidance files for AI Agents. These plan files provide structured
      instructions and workflows that AI coding assistants (like Cursor's Agent)
      can reference when helping developers. The plans document processes, best
      practices, and step-by-step workflows for various tasks, making them
      accessible to AI agents through the `.cursor/plans/` directory structure.
      When AI agents need guidance on how to perform specific tasks or follow
      certain workflows, they can reference these plan files to understand the
      expected process and provide accurate assistance.
- **Documentation section** - Reference to generated docs in the `docs/`
  directory. This section should include a brief overview of each file in the
  `docs/` directory, listing the filename and a one-line description of its
  contents. This helps users quickly understand what documentation is available
  and what each doc covers.
- **Contributing link** - Link to CONTRIBUTING.md
- **License section** - Reference to LICENSE.md
- **Security section** - Reference to SECURITY.md
- **Support section** - Links to GitHub Issues and repository URL

### `CODE_OF_CONDUCT.md`

```markdown
# Contributor Covenant Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our
community a harassment-free experience for everyone, regardless of age, body
size, visible or invisible disability, ethnicity, sex characteristics, gender
identity and expression, level of experience, education, socio-economic status,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

We pledge to act and interact in ways that contribute to an open, welcoming,
diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment for our
community include:

- Demonstrating empathy and kindness toward other people
- Being respectful of differing opinions, viewpoints, and experiences
- Giving and gracefully accepting constructive feedback
- Accepting responsibility and apologizing to those affected by our mistakes,
  and learning from the experience
- Focusing on what is best not just for us as individuals, but for the overall
  community

Examples of unacceptable behavior include:

- The use of sexualized language or imagery, and sexual attention or advances of
  any kind
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or email address,
  without their explicit permission
- Other conduct which could reasonably be considered inappropriate in a
  professional setting

## Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of
acceptable behavior and will take appropriate and fair corrective action in
response to any behavior that they deem inappropriate, threatening, offensive,
or harmful.

## Scope

This Code of Conduct applies within all community spaces and also applies when
an individual is officially representing the community in public spaces.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported to the community leaders responsible for enforcement at
security@starch.uk. All complaints will be reviewed and investigated promptly
and fairly.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage],
version 2.0, available at
https://www.contributor-covenant.org/version/2/0/code_of_conduct.html

[homepage]: https://www.contributor-covenant.org
```

### `CONTRIBUTING.md`

````markdown
# Contributing to agent-docs

Thank you for considering contributing to agent-docs! We welcome contributions
from the community.

## How to Contribute

1. **Fork the repository** and clone it to your local machine
2. **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
````

3. **Make your changes** following the project's documentation style and
   conventions
4. **Format files**:
    ```bash
    pnpm format
    ```
5. **Commit your changes** with a descriptive commit message:
    ```bash
    git commit -m "Add feature: your feature description"
    ```
6. **Push your changes** to your forked repository:
    ```bash
    git push origin feature/your-feature-name
    ```
7. **Open a pull request** to the main repository's `main` branch

## Style

- Follow the docs structure and content guidelines in this plan
- Use Prettier for formatting (run `pnpm format` before committing)

## Reporting Issues

If you encounter any issues or have suggestions for improvements, please open an
issue in the repository with:

- A clear description of the issue
- Steps to reproduce (if applicable)
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)

## License

By contributing to agent-docs, you agree that your contributions will be
licensed under the MIT License.

````

### `LICENSE.md`

```markdown
MIT License

Copyright (c) 2024 starch-uk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

### `SECURITY.md`

```markdown
# Security Policy

## Supported Versions

We release patches for security vulnerabilities as they are identified. Please
ensure you are using the latest version of the software.

| Version  | Supported          |
| -------- | ------------------ |
| >= 1.0.0 | :white_check_mark: |
| < 1.0.0  | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by emailing
**security@starch.uk**.

**Please do not** open a public GitHub issue for security vulnerabilities.

We will respond as promptly as possible to address the issue. We appreciate your
help in keeping the project secure.
```

### `.github/pull_request_template.md`

```markdown
## Description

<!-- Provide a brief description of your changes -->

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to
      not work as expected)
- [ ] Documentation update
- [ ] Other (please describe)

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] Code formatted with Prettier
```

### `.github/ISSUE_TEMPLATE/bug_report.md`

```markdown
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

## Description

A clear and concise description of what the bug is.

## Steps to Reproduce

1.
2.
3.

## Expected Behavior

A clear and concise description of what you expected to happen.

## Actual Behavior

A clear and concise description of what actually happened.

## Environment

- OS: [e.g., macOS 14.0, Windows 11, Ubuntu 22.04]
- Node version: [e.g., 20.10.0]
- pnpm version: [e.g., 8.10.0]
- agent-docs version: [e.g., 1.0.0]

## Additional Context

Add any other context about the problem here.
```

### `.github/ISSUE_TEMPLATE/feature_request.md`

```markdown
---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Description

A clear and concise description of what you want to happen.

## Motivation

Why is this feature needed? What problem does it solve?

## Proposed Solution

A clear and concise description of how you envision this feature working.

## Alternatives Considered

A clear and concise description of any alternative solutions or features you've
considered.

## Additional Context

Add any other context, examples, or screenshots about the feature request here.
```

### `postinstall.mjs`

The postinstall script that runs when this package is installed in another
project. It copies this package's `docs/` directory to the consuming project's
root directory, but only if the consuming project doesn't already have a `docs/`
directory. The script uses file copying instead of symlinks/junctions for better
cross-platform reliability.

```js
// postinstall.mjs
// Implementation details for copying docs directory cross-platform
```

### `prettier.config.js`

Prettier configuration file defining code formatting rules for the project.

```js
/** @type {import('prettier').Config} */
export default {
	// Configuration options for consistent code formatting
};
```

### `.github/workflows/format.yml`

GitHub Actions CI workflow that runs `pnpm format:check` on push and pull
requests to ensure code formatting compliance.

```yaml
name: Format Check
on:
    push:
    pull_request:
jobs:
    format:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: pnpm/action-setup@v4
            - name: Install dependencies
              run: pnpm install
            - name: Check formatting
              run: pnpm format:check
```

### `.cursor/rules/IMPORTANT.mdc`

Cursor IDE agent rules that provide instructions for AI agents working with this
project. These rules help AI coding assistants understand the project's
structure, conventions, and workflows.

```
# Important Rules for agent-docs

Rules and guidelines for AI agents working with this codebase...
```

### `.cursor/plans/OPTIMISE.md`

AI agent guidance file containing optimization strategies and best practices for
maintaining low token counts and efficient documentation formats.

### `.cursor/plans/VERSIONING.md`

AI agent guidance file containing versioning rules and workflows for managing
semantic versioning of documentation files according to semver principles.

## Core Concept

"Docs" are markdown files (e.g., `REACT.md`, `XPATH31.md`, `PMD.md`) containing
distilled technical, style, architectural, and philosophical knowledge. They are
designed to be:

- Low token count
- Comprehensive for AI agent consumption
- Reusable across projects

**Filename format:** Uppercase, no spaces, no dots. Version numbers like "XPath
3.1" become `XPATH31.md`. Remove redundant words like "plugin" when they appear
between other words (e.g., "prettier-plugin-apex" → `PRETTIERAPEX.md`,
"eslint-plugin-jsdoc" → `ESLINTJSDOC.md`). All files go in the `docs/` folder.

**Versioning:** Every file in `docs/` should be versioned using semantic
versioning (semver). Version information should be tracked and managed according
to the rules in `.cursor/plans/VERSIONING.md`. The versioning system tracks
changes to each doc file:

- **Patch version bump** - Minor changes or corrections (typos, clarifications,
  formatting)
- **Minor version bump** - New sections added to a file
- **Major version bump** - Sections replaced or removed from a file

Versions are compared against the latest commit in the `main` branch. A script
can be created to help with versioning by reading markdown headers and detecting
changes.

**Existing Docs:** The existing documentation files in the `docs/` directory
remain and help seed the project. These existing docs need to be versioned using
the same semver system. When the versioning system is implemented, all existing
docs should be initialized with version `1.0.0` and tracked going forward.

## Output Format

Each doc should follow this structure (sections should be omitted if not
applicable):

```markdown
# <NAME> [Quick Reference | Reference]

> Optional: One-line philosophy/description quote

## Overview

Brief context (2-3 sentences max). May include reference links to official docs.

## Core Concepts / Key Features

Bulleted list of fundamental concepts, features, or capabilities

## Configuration / Setup

Tables for configuration options, properties, or setup instructions

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |

## Usage / Examples

Code examples (minimal, essential only)

## API Reference

Essential APIs, methods, components (condensed, often in tables)

## Patterns & Best Practices

Recommended patterns, anti-patterns to avoid

## Architecture

Key architectural patterns and decisions (if relevant)

## Common Patterns

Common usage patterns with examples

## Important Notes

Critical gotchas, limitations, or warnings

**Note:** If an `IMPORTANT.md` file exists in the repository, it should
reference `.cursor/plans/VERSIONING.md` for versioning guidelines.

## Related Documentation

Cross-references to other docs using `[Name](FILENAME.md)` format
```

**Content Style Guidelines:**

- **Terse but precise** - Every word counts, no fluff
- **Bullet points over prose** - Use lists for scannability
- **Tables for structured data** - Configuration options, APIs, properties
- **Code snippets only when essential** - Minimal examples that demonstrate key
  concepts
- **Prioritise actionable information** - Focus on what AI agents need to know,
  not theory
- **Cross-reference related docs** - Use `[Name](FILENAME.md)` format for
  related docs
- **Title format** - Usually "X Quick Reference" or "X Reference", sometimes "X
  Guide"
- **Optional philosophy quote** - Some docs include a `>` blockquote at the top
  with core philosophy

## Project Structure

```
agent-docs/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── pull_request_template.md
│   └── workflows/
│       └── format.yml
├── .cursor/
│   ├── plans/
│   │   ├── OPTIMISE.md
│   │   └── VERSIONING.md
│   └── rules/
│       └── IMPORTANT.mdc
├── docs/                     # Documentation docs (versioned using semver, includes existing seed docs)
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE.md
├── README.md
├── SECURITY.md
├── package.json
├── pnpm-lock.yaml
├── postinstall.mjs
└── prettier.config.js
```

## Files to Create

### README.md

Include:

- Project name and Matrix-inspired tagline
- What docs are and why they exist
- Installation instructions (clone + `pnpm install`)
- How to add/link the `docs/` directory into another project
- How to configure an IDE agent to reference the docs (e.g. `@PMD.md`)
- Documentation section listing the docs in `docs/` with one-line descriptions
- Contributing guidelines
- Links to SECURITY, LICENSE, and repository/Issues

### SECURITY.md

```markdown
# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities to: security@starch.uk

Do not open public issues for security concerns.
```

### LICENSE.md

Standard MIT license with copyright holder: starch-uk

### GitHub Action (.github/workflows/format.yml)

- Trigger on push and pull_request
- Use pnpm for package management
- Run `pnpm format:check`

### package.json

- Name: `agent-docs`
- Type: module
- Version: `1.0.0`
- Scripts: `format`, `format:fix`, `format:check`, `postinstall`
- Dev dependencies: `prettier`
- Engines: Node.js >= 20.0.0

**Project Versioning:** The project as a whole maintains a version in
`package.json`. Any changes to docs files should increment the corresponding
patch/minor/major version (whichever is the greatest change in any docs file),
compared to the version in the latest commit in the `main` branch. A script can
be created to help with this by analyzing changes across all docs files and
determining the appropriate version bump.

### .cursor/plans/VERSIONING.md

Create a plan document that documents the versioning system for docs files and
the project as a whole.

The plan should:

- Document that every file in `docs/` should be versioned using semantic
  versioning (semver)
- Explain versioning rules:
    - **Patch version bump** - Minor changes or corrections (typos,
      clarifications, formatting fixes) compared to the version in the latest
      commit in the `main` branch
    - **Minor version bump** - New sections added to a file compared to the
      version in the latest commit in the `main` branch
    - **Major version bump** - Sections replaced or removed from a file compared
      to the version in the latest commit in the `main` branch
- Document that the project as a whole maintains a version in `package.json`
  (currently `1.1.0`)
- Explain that changes to docs files should increment the project version
  (patch/minor/major based on the greatest change in any docs file) compared to
  the version in the latest commit in the `main` branch
- **Document initialization of existing docs:** The existing documentation files
  in the `docs/` directory (A4DRULES.md, A4DWORKFLOWS.md, APEXANNOTATIONS.md,
  APEXDOC.md, CML.md, CODEANALYZER.md, CONTEXTDEFINITIONS.md, ESLINT.md,
  ESLINTJSDOC.md, FIELDSERVICE.md, GRAPHBINARY.md, GRAPHENGINE.md, GRAPHML.md,
  GRAPHSON.md, GREMLIN.md, GRYO.md, HUSKY.md, JEST.md, JORJE.md, JSDOC.md,
  LIGHTNINGBASECOMPONENTS.md, LWCHTMLTEMPLATES.md, PMD.md, PNPM.md, PRETTIER.md,
  PRETTIERAPEX.md, REVENUETRANSACTIONMANAGEMENT.md, TINKERPOP.md, VITEST.md,
  XPATH31.md) need to be initialized with version `1.0.0` (or appropriate version
  based on their current state) when the versioning system is first implemented.
  These existing docs will be tracked going forward using the same semver system.
- Describe how scripts can help with versioning by:
    - Reading markdown files and detecting headers/sections
    - Comparing current state with the latest commit in `main` branch
    - Determining appropriate version bumps based on change types
    - Updating version information in docs files and `package.json`
    - Initializing version information for existing docs that don't have version
      metadata yet
- Include guidance on how to track versions for each doc file (e.g., in file
  metadata, separate version file, or git tags)
- Document the workflow: make changes → analyze changes → determine version
  bumps → update versions → commit

### .cursor/plans/OPTIMISE.md

Create a plan document that documents the process for converting high token
count documentation files into AI Agent-friendly low token versions without
losing any essential details. This plan will be used by AI-powered IDEs (like
Cursor) to optimize docs, not by the CLI tool itself.

The plan should:

- Include core principles: terse but precise, tables over prose, bullet points
  for lists, minimal code examples, structured sections, reference-style
  formatting
- Document optimization techniques: text reduction strategies, structural
  optimizations (prose to tables, lists to tables, API documentation to tables,
  property lists to tables), content organization patterns
- Cover converting verbose documentation patterns: API Parameters/Returns
  sections to tables, property documentation lists to tables, interface
  explanations to inline comments in code blocks
- Provide a step-by-step conversion process: analysis, structure planning,
  content transformation, validation
- Include formatting standards, quality checklist, common pitfalls to avoid, and
  success metrics
- Focus on generic, reusable advice applicable to any high-token documentation
  file

## Implementation Notes

1. Filename generation: Convert to uppercase, remove spaces and dots. Version
   numbers like "XPath 3.1" become "XPATH31.md". Remove redundant words like
   "plugin" when they appear between other words (e.g., "prettier-plugin-apex" →
   "PRETTIERAPEX.md", "eslint-plugin-jsdoc" → "ESLINTJSDOC.md"). All docs live
   in the `docs/` folder.

## Deliverables

1. Repository scaffolding with documentation, licensing, security, and GitHub
   workflow files
2. A stable set of docs in `docs/` following this plan
3. Versioning system for all docs (including existing docs in `docs/` directory)
