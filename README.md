# agent-docs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A reusable set of low-token AI agent instruction documents ("docs") for
AI-enabled IDEs.

## Overview

**Docs** are markdown files containing distilled technical, style,
architectural, and philosophical knowledge. They are designed to be:

- **Low token count** - Optimized for efficient AI agent consumption
- **Comprehensive** - Complete coverage of essential information
- **Reusable** - Shareable across projects and teams

Inspired by _The Matrix_ (1999), where Neo says "I know kung fu" after having
knowledge uploaded directly into his brain. In that scene, Neo instantly gains
complete knowledge and skills without needing to learn through practice - the
knowledge is simply "there" when needed. Similarly, agent-docs creates
comprehensive documentation "programs" that can be referenced by AI agents,
giving them instant, complete knowledge about libraries, frameworks, and tools.
Just as Neo could access kung fu knowledge instantly, AI agents can reference
these docs to immediately understand APIs, patterns, best practices, and
architectural decisions without needing to search or learn incrementally. The
docs serve as the "knowledge upload" that makes the AI agent instantly capable
with any technology.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/starch-uk/agent-docs.git
    cd agent-docs
    pnpm install
    ```

2. **Add to your project:**

    You can add agent-docs to your project in several ways:
    - **As a dependency:** Add `@starch-uk/agent-docs` to your `package.json`
    - **As a submodule:**
      `git submodule add https://github.com/starch-uk/agent-docs.git`
    - **As a symlink/junction:**
        - **Unix/macOS:** `ln -s /path/to/agent-docs/docs ./docs`
        - **Windows:** `mklink /J docs C:\path\to\agent-docs\docs`

3. **Configure your IDE agent:**

    Update your IDE agent rules (e.g., Cursor's `.cursor/rules/` or similar) to
    reference the linked docs using `@filename` syntax or relative paths:

    ```
    Reference documentation from ./docs/ when needed:
    - @PMD.md for PMD rules and configuration
    - @XPATH31.md for XPath 3.1 syntax
    - @ESLINT.md for ESLint configuration
    ```

## Documentation

The `docs/` directory contains generated documentation files. Each doc follows a
structured format optimized for AI agent consumption:

- **APEXANNOTATIONS.md** - Apex annotations reference
- **APEXDOC.md** - ApexDoc documentation tool reference
- **CML.md** - Constraint Modeling Language (CML) reference for Salesforce Revenue Cloud Product Configurator
- **CODEANALYZER.md** - Salesforce Code Analyzer configuration (includes CLI
  Commands, CPD Engine, Flow Scanner Engine, Regex Engine, RetireJS Engine, and
  MCP tools)
- **CONTEXTDEFINITIONS.md** - Salesforce Context Definitions reference for Dynamic Revenue Orchestrator (DRO)
- **ESLINT.md** - ESLint configuration and rules reference
- **ESLINTJSDOC.md** - ESLint JSDoc plugin reference
- **FIELDSERVICE.md** - Salesforce Field Service reference
- **GRAPHBINARY.md** - Graph Binary format reference
- **GRAPHENGINE.md** - Graph Engine reference
- **GRAPHML.md** - GraphML format reference
- **GRAPHSON.md** - GraphSON format reference
- **GREMLIN.md** - Gremlin query language reference
- **GRYO.md** - Gryo binary format reference
- **HUSKY.md** - Husky git hooks tool reference
- **JEST.md** - Jest testing framework reference
- **JORJE.md** - Jorje Apex parser reference
- **JSDOC.md** - JSDoc documentation generator reference
- **PMD.md** - PMD static analysis tool reference (includes Apex AST reference
  and suppressing warnings)
- **PNPM.md** - pnpm package manager reference
- **PRETTIER.md** - Prettier code formatter reference
- **PRETTIERAPEX.md** - Prettier Apex plugin reference
- **REVENUETRANSACTIONMANAGEMENT.md** - Salesforce Revenue Cloud Transaction Management reference
- **TINKERPOP.md** - Apache TinkerPop graph computing framework reference
- **VITEST.md** - Vitest testing framework reference
- **VSCODE.md** - VS Code editor reference
- **XPATH31.md** - XPath 3.1 query language reference

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this
project.

## License

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md)
for details.

## Security

For security concerns, please see [SECURITY.md](SECURITY.md).

## Support

- **Issues:** [GitHub Issues](https://github.com/starch-uk/agent-docs/issues)
- **Repository:**
  [https://github.com/starch-uk/agent-docs](https://github.com/starch-uk/agent-docs)
