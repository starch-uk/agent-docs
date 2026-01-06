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

1. **Clone the repository (optional, for local development of agent-docs
   itself):**

    ```bash
    git clone https://github.com/starch-uk/agent-docs.git
    cd agent-docs
    pnpm install
    ```

2. **Add to your project:**

    You can add agent-docs to your project in several ways:
    - **As an npm dependency (recommended):** Add `agent-docs` to your
      `package.json` and install with your package manager (e.g. `pnpm install`,
      `npm install`, or `yarn add`).

        When installed this way, a `postinstall` script runs in the consuming
        project:
        - If your project does **not** already have a `docs/` directory, the
          script will create a single link from your project's `docs/` directory
          to this package's `docs/` directory:
            - On Unix/macOS, a directory symlink is created
            - On Windows, a junction is created
        - If your project **already has** a `docs/` directory, the script does
          nothing, and your existing docs layout is left unchanged.

    - **As a git submodule:**  
      `git submodule add https://github.com/starch-uk/agent-docs.git`

    - **As a manual symlink/junction (if you want explicit control):**
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

- **[APEXANNOTATIONS.md](docs/APEXANNOTATIONS.md)** - Apex annotations reference
- **[APEXDOC.md](docs/APEXDOC.md)** - ApexDoc documentation tool reference
- **[CML.md](docs/CML.md)** - Constraint Modeling Language (CML) reference for
  Salesforce Revenue Cloud Product Configurator
- **[CODEANALYZER.md](docs/CODEANALYZER.md)** - Salesforce Code Analyzer
  configuration (includes CLI Commands, CPD Engine, Flow Scanner Engine, Regex
  Engine, RetireJS Engine, and MCP tools)
- **[CONTEXTDEFINITIONS.md](docs/CONTEXTDEFINITIONS.md)** - Salesforce Context
  Definitions reference for Dynamic Revenue Orchestrator (DRO)
- **[ESLINT.md](docs/ESLINT.md)** - ESLint configuration and rules reference
- **[ESLINTJSDOC.md](docs/ESLINTJSDOC.md)** - ESLint JSDoc plugin reference
- **[FIELDSERVICE.md](docs/FIELDSERVICE.md)** - Salesforce Field Service
  reference
- **[GRAPHBINARY.md](docs/GRAPHBINARY.md)** - Graph Binary format reference
- **[GRAPHENGINE.md](docs/GRAPHENGINE.md)** - Graph Engine reference
- **[GRAPHML.md](docs/GRAPHML.md)** - GraphML format reference
- **[GRAPHSON.md](docs/GRAPHSON.md)** - GraphSON format reference
- **[GREMLIN.md](docs/GREMLIN.md)** - Gremlin query language reference
- **[GRYO.md](docs/GRYO.md)** - Gryo binary format reference
- **[HUSKY.md](docs/HUSKY.md)** - Husky git hooks tool reference
- **[JEST.md](docs/JEST.md)** - Jest testing framework reference
- **[JORJE.md](docs/JORJE.md)** - Jorje Apex parser reference
- **[JSDOC.md](docs/JSDOC.md)** - JSDoc documentation generator reference
- **[PMD.md](docs/PMD.md)** - PMD static analysis tool reference (includes Apex
  AST reference and suppressing warnings)
- **[PNPM.md](docs/PNPM.md)** - pnpm package manager reference
- **[PRETTIER.md](docs/PRETTIER.md)** - Prettier code formatter reference
- **[PRETTIERAPEX.md](docs/PRETTIERAPEX.md)** - Prettier Apex plugin reference
- **[REVENUETRANSACTIONMANAGEMENT.md](docs/REVENUETRANSACTIONMANAGEMENT.md)** -
  Salesforce Revenue Cloud Transaction Management reference
- **[TINKERPOP.md](docs/TINKERPOP.md)** - Apache TinkerPop graph computing
  framework reference
- **[VITEST.md](docs/VITEST.md)** - Vitest testing framework reference
- **[VSCODE.md](docs/VSCODE.md)** - VS Code editor reference
- **[XPATH31.md](docs/XPATH31.md)** - XPath 3.1 query language reference

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
