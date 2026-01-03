# Project: agent-docs

Build out the starch-uk/agent-docs repository - a tool for generating reusable, low-token AI agent instruction documents ("docs") for AI-enabled IDEs.

## Repository Setup

- **License**: MIT
- **Security contact**: security@starch.uk
- **Package manager**: pnpm (not npm)
- **Language**: TypeScript (strict mode)
- **Code formatting**: Prettier for Markdown and TypeScript
- **Linting**: ESLint for TypeScript validation with eslint-plugin-jsdoc for JSDoc validation
- **Test framework**: Vitest with comprehensive unit tests
- **CI**: GitHub Actions for running all tests on push/PR
- **Git hooks**: Husky for pre-commit formatting of markdown files, script files, and unit test files

**Repository Documentation Files:**

The following files should be created following the same structure and style as other starch-uk repositories:

### `README.md`

The README.md should contain:

- **Project title and description** - Brief overview of agent-docs as a tool for generating reusable, low-token AI agent instruction documents
- **License badge** - MIT License badge link
- **Overview section** - Explanation of what docs are, their purpose (low token count, comprehensive, reusable), and their use in AI-enabled IDEs. This section should reference the inspiration from The Matrix (1999) where Neo says "I know kung fu" after having knowledge uploaded directly into his brain. In that scene, Neo instantly gains complete knowledge and skills without needing to learn through practice - the knowledge is simply "there" when needed. Similarly, agent-docs creates comprehensive documentation "programs" that can be referenced by AI agents, giving them instant, complete knowledge about libraries, frameworks, and tools. Just as Neo could access kung fu knowledge instantly, AI agents can reference these docs to immediately understand APIs, patterns, best practices, and architectural decisions without needing to search or learn incrementally. The docs serve as the "knowledge upload" that makes the AI agent instantly capable with any technology.
- **Installation instructions** - Should include:
  - Steps to clone the repository and install dependencies using pnpm
  - Instructions for adding the package to a project (as a dependency or submodule)
  - Instructions for symlinking (Unix/macOS) or junction linking (Windows) either:
    - Individual files from the `docs/` folder to the root of the actual project, OR
    - The entire `docs/` folder to the root of the actual project
  - Explanation of how to update IDE agent rules (e.g., Cursor's `.cursor/rules/` or similar) to reference the linked docs using `@filename` syntax or relative paths, so the AI agent can access the documentation when needed
- **Usage section** - Should explain in detail how to create new docs:
  - Documentation of the `sf-docs-helper` CLI tool. The tool supports:
    - `search <item>` - Search Salesforce Help, retrieve all results via pagination, deduplicate, download content to temporary folder, create todo file, output folder location
    - `get <url>` - Get content from a Salesforce Help URL, download to temporary folder, create todo file, output folder location
    - `dump <item>` - Combine search and get: search for item, retrieve all results, download all content to temporary folder, create todo file for inspection, return folder location
  - **Common options** - List of CLI flags (`--verbose`, `--concurrency`)
  - Explanation that the tool creates temporary folders with downloaded content and todo files, outputting the folder location for use
  - **AI Agent Guidance** - Explanation that `.cursor/plans/*` contains guidance files for AI Agents. These plan files provide structured instructions and workflows that AI coding assistants (like Cursor's Agent) can reference when helping developers. The plans document processes, best practices, and step-by-step workflows for various tasks, making them accessible to AI agents through the `.cursor/plans/` directory structure. When AI agents need guidance on how to perform specific tasks or follow certain workflows, they can reference these plan files to understand the expected process and provide accurate assistance.
- **Documentation section** - Reference to generated docs in the `docs/` directory. This section should include a brief overview of each file in the `docs/` directory, listing the filename and a one-line description of its contents. This helps users quickly understand what documentation is available and what each doc covers.
- **Contributing link** - Link to CONTRIBUTING.md
- **License section** - Reference to LICENSE.md
- **Security section** - Reference to SECURITY.md
- **Support section** - Links to GitHub Issues and repository URL

### `CODE_OF_CONDUCT.md`

```markdown
# Contributor Covenant Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment for our community include:

- Demonstrating empathy and kindness toward other people
- Being respectful of differing opinions, viewpoints, and experiences
- Giving and gracefully accepting constructive feedback
- Accepting responsibility and apologizing to those affected by our mistakes, and learning from the experience
- Focusing on what is best not just for us as individuals, but for the overall community

Examples of unacceptable behavior include:

- The use of sexualized language or imagery, and sexual attention or advances of any kind
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or email address, without their explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

## Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of acceptable behavior and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful.

## Scope

This Code of Conduct applies within all community spaces and also applies when an individual is officially representing the community in public spaces.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the community leaders responsible for enforcement at security@starch.uk. All complaints will be reviewed and investigated promptly and fairly.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 2.0, available at https://www.contributor-covenant.org/version/2/0/code_of_conduct.html

[homepage]: https://www.contributor-covenant.org
```

### `CONTRIBUTING.md`

````markdown
# Contributing to agent-docs

Thank you for considering contributing to agent-docs! We welcome contributions from the community.

## How to Contribute

1. **Fork the repository** and clone it to your local machine
2. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
````

3. **Make your changes** following the project's code style and conventions
4. **Run tests** to ensure everything passes:
   ```bash
   pnpm test
   ```
5. **Format your code**:
   ```bash
   pnpm format
   ```
6. **Commit your changes** with a descriptive commit message:
   ```bash
   git commit -m "Add feature: your feature description"
   ```
7. **Push your changes** to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a pull request** to the main repository's `main` branch

## Code Style

- Follow TypeScript strict mode conventions
- Use Prettier for formatting (run `pnpm format` before committing)
- Write comprehensive tests for new features
- Ensure all tests pass before submitting a PR

## Reporting Issues

If you encounter any issues or have suggestions for improvements, please open an issue in the repository with:

- A clear description of the issue
- Steps to reproduce (if applicable)
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)

## License

By contributing to agent-docs, you agree that your contributions will be licensed under the MIT License.

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

We release patches for security vulnerabilities as they are identified. Please ensure you are using the latest version of the software.

| Version  | Supported          |
| -------- | ------------------ |
| >= 1.0.0 | :white_check_mark: |
| < 1.0.0  | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by emailing **security@starch.uk**.

**Please do not** open a public GitHub issue for security vulnerabilities.

We will respond as promptly as possible to address the issue. We appreciate your help in keeping the project secure.
```

### `.github/pull_request_template.md`

```markdown
## Description

<!-- Provide a brief description of your changes -->

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Other (please describe)

## Testing

<!-- Describe the tests you ran and how to reproduce them -->

- [ ] Tests pass locally
- [ ] Added/updated tests for new functionality
- [ ] Code formatted with Prettier

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
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

A clear and concise description of any alternative solutions or features you've considered.

## Additional Context

Add any other context, examples, or screenshots about the feature request here.
```

## Core Concept

"Docs" are markdown files (e.g., `REACT.md`, `XPATH31.md`, `PMD.md`) containing distilled technical, style, architectural, and philosophical knowledge. They are designed to be:

- Low token count
- Comprehensive for AI agent consumption
- Reusable across projects

**Filename format:** Uppercase, no spaces, no dots. Version numbers like "XPath 3.1" become `XPATH31.md`. Remove redundant words like "plugin" when they appear between other words (e.g., "prettier-plugin-apex" → `PRETTIERAPEX.md`, "eslint-plugin-jsdoc" → `ESLINTJSDOC.md`). All files go in the `docs/` folder.

**Versioning:** Every file in `docs/` should be versioned using semantic versioning (semver). Version information should be tracked and managed according to the rules in `.cursor/plans/VERSIONING.md`. The versioning system tracks changes to each doc file:

- **Patch version bump** - Minor changes or corrections (typos, clarifications, formatting)
- **Minor version bump** - New sections added to a file
- **Major version bump** - Sections replaced or removed from a file

Versions are compared against the latest commit in the `main` branch. A script can be created to help with versioning by reading markdown headers and detecting changes.

**Existing Docs:** The existing documentation files in the `docs/` directory (APEXANNOTATIONS.md, APEXDOC.md, CODEANALYZER.md, CPD.md, ESLINT.md, ESLINTJSDOC.md, FLOWSCANNER.md, GRAPHBINARY.md, GRAPHENGINE.md, GRAPHML.md, GRAPHSON.md, GREMLIN.md, GRYO.md, HUSKY.md, JEST30.md, JORJE.md, JSDOC.md, PMD.md, PMDAPEXAST.md, PMDSUPPRESSWARNINGS.md, PNPM.md, PRETTIER.md, PRETTIERAPEX.md, REGEX.md, RETIREJS.md, SFCLI.md, TINKERPOP.md, VITEST.md, VSCODE.md, XPATH31.md) remain and help seed the project. These existing docs need to be versioned using the same semver system. When the versioning system is implemented, all existing docs should be initialized with version `1.0.0` and tracked going forward.

## CLI Tool: `sf-docs-helper`

Create a CLI tool called `sf-docs-helper` that generates docs from Salesforce Help documentation. The tool should support three commands:

### 1. Search (`search <item>`)

The CLI tool should support searching Salesforce Help documentation using the `search` command. The tool:

1. Searches Salesforce Help (help.salesforce.com) for the item
2. **Filters search results** to Content Type: 'Developer Documentation' and 'Product Documentation' only
3. **Iterates through pagination** to retrieve all search results across all pages
4. **Deduplicates** the search results list to remove duplicate URLs
5. **Creates a temporary folder** to store downloaded content (using system temp directory with unique subdirectory name)
6. **Downloads content concurrently** (using separate threads/event-driven approach) for each unique URL:
   - Downloads each page's content to the temporary folder
   - Uses organized file names based on URL structure or article ID
   - Handles errors gracefully (404s, timeouts, etc.)
7. **Creates a todo file** in the temporary folder listing all downloaded documents (one per line or in a structured format)
8. **Outputs the temporary folder location** so users know where the downloaded content is stored

The tool provides downloaded content files that serve as a starting point for creating documentation files. The actual doc generation should be done manually by AI agents following the `.cursor/plans/CREATE.md` workflow, using the todo file to process each document.

### 2. Get URL (`get <url>`)

The CLI tool should support getting content from a Salesforce Help URL using the `get` command. The tool:

1. Fetches the page at the specified URL
2. Identifies and follows related links within the same domain
3. Processes each page to extract content
4. Extracts all technical, style, architectural, and philosophical details
5. Provides extracted content for documentation generation

The tool provides downloaded content files that serve as a starting point for creating documentation files. The actual doc generation should be done manually by AI agents following the `.cursor/plans/CREATE.md` workflow, using the todo file to process each document.

### 3. Dump (`dump <item>`)

The CLI tool should support a dump mode that combines search and get functionality. The tool:

1. Searches Salesforce Help (help.salesforce.com) for the item
2. **Filters search results** to Content Type: 'Developer Documentation' and 'Product Documentation' only
3. **Iterates through pagination** to retrieve all search results across all pages
4. **Deduplicates** the search results list to remove duplicate URLs
5. **Creates a temporary folder** to store downloaded content (using system temp directory with unique subdirectory name)
6. **Downloads content concurrently** (using separate threads/event-driven approach) for each unique URL:
   - Downloads each page's content to the temporary folder
   - Uses organized file names based on URL structure or article ID
   - Handles errors gracefully (404s, timeouts, etc.)
7. **Creates a todo file** in the temporary folder listing all downloaded documents (one per line or in a structured format) for inspection
8. **Returns/outputs the temporary folder location** so users know where the dumped content is stored

The dump command combines the search functionality (finding all relevant results) with the get functionality (downloading all content), providing a complete dump of all search results in an organized temporary directory with a todo file for processing each file.

**Search Implementation:**

help.salesforce.com uses Coveo search (confirmed by `org62salesforce.org.coveo.com` domain). The search is client-side rendered, so the API endpoint must be discovered via browser network inspection. Content types to filter: "Developer Documentation" and "Product Documentation". Expected: Search for "AuraEnabled annotation" returns ~180 results when filtered correctly.

**Search Implementation:**

The implementation uses two approaches:

1. **Coveo API Approach** (`searchSalesforceHelp` function):
   - Uses POST request to Coveo search endpoint (tested: `https://org62salesforce.org.coveo.com/rest/search/v2`)
   - Request body format:
     ```json
     {
       "q": "<search query>",
       "numberOfResults": 200,
       "filter": "@contenttype==(\"Developer Documentation\" OR \"Product Documentation\")"
     }
     ```
   - Headers: `Content-Type: application/json`, `Accept: application/json`, standard User-Agent
   - Response: JSON with `results` array and `totalCount` field
   - **Status:** Returns 401 (authentication required) - endpoint discovery needed via browser network inspection
   - Alternative endpoints to test: `https://help.salesforce.com/s/rest/search/v2` (proxied, may not require auth), `https://help.salesforce.com/s/api/search`

2. **HTML Parsing Fallback** (`searchViaHTML` function):
   - GET request to `https://help.salesforce.com/s/search?q=<query>`
   - Parses HTML response to extract:
     - Result count via regex: `/(\d+)\s+results?/i`
     - Result links via regex: `/<a[^>]+href="([^"]+)"[^>]*class="[^"]*result[^"]*"/gi`
   - Returns: `{ resultCount, links[], html }`
   - **Status:** Content type filters are applied client-side, so HTML parsing cannot filter by content type without additional logic

**To implement in production:**

1. Inspect browser network requests when filtering by Content Type on help.salesforce.com
2. Discover exact API endpoint URL (may be proxied through help.salesforce.com)
3. Extract required authentication headers/tokens (Authorization, cookies, etc.)
4. Verify request body format and filter syntax
5. **Implement pagination handling** - Iterate through all pages of results until all results are retrieved (handle `totalCount` and page offsets/continuation tokens)
6. **Deduplicate results** - Remove duplicate URLs from the complete result set before downloading
7. If API is not accessible, use Playwright to:
   - Navigate to search page and wait for JavaScript to render
   - Click filter buttons/checkboxes for "Developer Documentation" and "Product Documentation"
   - Extract links from rendered search results using `page.evaluate()`
   - Handle pagination by detecting and clicking "Next" buttons or scrolling to load more results
   - Filter links by URL patterns and text content to find relevant articles

**Page Content Extraction:**

Salesforce help pages are JavaScript-rendered. Static HTML extraction will not capture the full content. A script needs to be created that uses a headless browser to render JavaScript and extract content.

**Implementation Requirements:**

1. **Use Playwright to render JavaScript:**
   - Launch headless browser instance using `chromium.launch({ headless: true })`
   - Navigate to the article URL with `waitUntil: 'domcontentloaded'` (not `networkidle` - can timeout)
   - Wait for content to load: Use `page.waitForTimeout(8000)` after navigation to allow JavaScript to render
   - Wait for content selectors: Try `page.waitForSelector('article')` or similar with timeout fallback
   - Extract rendered HTML and text content

2. **Content extraction from rendered page:**
   - Extract main article content using multiple selector strategies:
     - Try selectors in order: `article`, `.slds-text-longform`, `[role="main"]`, `.content`, `.article-content`, `#main-content`
     - Score elements by annotation-related keyword density to find best match
     - Fallback to `body` if no specific content area found
   - Extract both HTML and text content for comprehensive analysis
   - Handle dynamic content that loads after initial render (wait 8+ seconds after page load)
   - Extract title from multiple sources: `page.title()`, `h1`, `[role="heading"]` (Salesforce often uses generic "Salesforce Help | Article" title)

3. **Search result extraction:**
   - Search page may not immediately show results - wait for selectors like `a[href*="articleView"]`, `.search-result`, `[data-result]`
   - Extract links using `page.evaluate()` to query DOM after JavaScript renders
   - Filter links to annotation-related content by checking URL patterns and link text
   - Handle cases where search doesn't find specific pages (may need to use known URLs as fallback)

4. **Content type filtering:**
   - Try to click filter buttons for "Developer Documentation" and "Product Documentation"
   - Use multiple selector strategies: `text=Developer Documentation`, `[aria-label*="Developer"]`, checkbox inputs
   - Wait 2-3 seconds after clicking filters for results to update
   - If filters not available, proceed with all results

5. **Implementation details:**
   - Use `playwright` npm package (install with `npm install playwright`, then `npx playwright install chromium`)
   - Set appropriate timeouts: 90 seconds for navigation, 15 seconds for content selectors
   - Handle redirects (Salesforce pages often redirect to add language parameters)
   - Set realistic user agent (Playwright sets this automatically)
   - Clean up browser instances after extraction: `await browser.close()`
   - **Pagination handling:** Iterate through all search result pages to retrieve complete result set
   - **Deduplication:** Remove duplicate URLs from search results before downloading
   - **Concurrent downloads:** Process multiple pages concurrently using `Promise.all()` with concurrency limit (5 pages at a time recommended) or event-driven approach
   - **Temporary folder management:** Create unique temporary folder using system temp directory (e.g., `os.tmpdir()` on Node.js, `/tmp` on Unix) with unique subdirectory names
   - **File naming:** Use organized file names based on URL structure, article ID, or article title (sanitized for filesystem)
   - **Todo file generation:** Create a text file (e.g., `TODO.md` or `FILES.txt`) listing all downloaded documents with their file paths
   - Handle 404s gracefully - some article URLs may not exist
   - Extract annotations from text using multiple regex patterns: `/@(\w+)\s*\(/g`, `/@(\w+)\s+/g`, `/annotation\s+@?(\w+)/gi`
   - Filter out common words from annotation matches (the, and, or, for, with, etc.)
   - Output temporary folder location to stdout/stderr at completion

**Note:** Playwright is used to extract content from JavaScript-rendered Salesforce pages. Search result extraction may need refinement to better target Developer/Product Documentation.

## CLI Options

```bash
sf-docs-helper search "Lightning Web Components"
sf-docs-helper search "AuraEnabled annotation"
sf-docs-helper get "https://help.salesforce.com/s/articleView?id=sf.apexcode_annotation_auraenabled.htm"
sf-docs-helper dump "Lightning Web Components"
```

The `search` command:

- Outputs a deduplicated list of all search results
- Downloads all results to a temporary folder
- Creates a todo file listing all downloaded documents
- Outputs the temporary folder location

The `get` command:

- Downloads content from the specified URL to a temporary folder
- Creates a todo file listing the downloaded document
- Outputs the temporary folder location

The `dump` command:

- Combines search and get functionality
- Searches for the item, retrieves all results via pagination, deduplicates
- Downloads all results to a temporary folder
- Creates a todo file listing all downloaded documents for inspection
- Returns/outputs the temporary folder location

Common flags:

- `--verbose` - Show progress during searching/processing/downloading
- `--concurrency <n>` - Number of concurrent downloads (default: 5)

## Output Format

Each doc should follow this structure (sections should be omitted if not applicable):

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

**Note:** If an `IMPORTANT.md` file exists in the repository, it should reference `.cursor/plans/VERSIONING.md` for versioning guidelines.

## Related Documentation

Cross-references to other docs using `[Name](FILENAME.md)` format
```

**Content Style Guidelines:**

- **Terse but precise** - Every word counts, no fluff
- **Bullet points over prose** - Use lists for scannability
- **Tables for structured data** - Configuration options, APIs, properties
- **Code snippets only when essential** - Minimal examples that demonstrate key concepts
- **Prioritise actionable information** - Focus on what AI agents need to know, not theory
- **Cross-reference related docs** - Use `[Name](FILENAME.md)` format for related docs
- **Title format** - Usually "X Quick Reference" or "X Reference", sometimes "X Guide"
- **Optional philosophy quote** - Some docs include a `>` blockquote at the top with core philosophy

## Project Structure

```
agent-docs/
├── .github/
│   └── workflows/
│       └── test.yml
├── src/
│   ├── cli/
│   │   └── index.ts          # CLI entry point
│   ├── sources/
│   │   ├── library.ts        # Library name handler
│   │   ├── url.ts            # URL crawler
│   │   ├── salesforce.ts     # Salesforce help crawler
│   │   └── path.ts           # Local path reader
│   ├── extraction/
│   │   ├── extractor.ts      # Content extraction logic
│   └── utils/
│       ├── crawler.ts        # Generic web crawler
│       ├── search.ts         # Web search utility
│       └── git.ts            # Repo cloning utility
├── tests/
│   ├── sources/
│   │   ├── library.test.ts
│   │   ├── url.test.ts
│   │   ├── salesforce.test.ts
│   │   └── path.test.ts
│   ├── extraction/
│   │   ├── extractor.test.ts
│   │   └── summariser.test.ts
│   └── output/
│       └── doc-writer.test.ts
├── .husky/               # Git hooks (pre-commit formatting)
│   └── pre-commit        # Formats markdown files, script files, and unit test files before commit
├── .cursor/
│   └── plans/
│       ├── CREATE.md
│       ├── UPDATE.md
│       ├── OPTIMISE.md
│       └── VERSIONING.md
├── docs/                     # Documentation docs (versioned using semver, includes existing seed docs)
│   └── .gitkeep
├── SECURITY.md
├── LICENSE
├── README.md
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── prettier.config.js
├── eslint.config.js
└── vitest.config.ts
```

## Files to Create

### README.md

Include:

- Project name and Matrix-inspired tagline
- What docs are and why they exist
- Installation instructions (pnpm)
- Usage examples for all four source types
- Output format explanation
- Contributing guidelines
- Link to SECURITY.md

### SECURITY.md

```markdown
# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities to: security@starch.uk

Do not open public issues for security concerns.
```

### LICENSE

Standard MIT license with copyright holder: starch-uk

### GitHub Action (.github/workflows/test.yml)

- Trigger on push and pull_request
- Use pnpm for package management
- Run `pnpm test` (Vitest)
- Test on Node 20.x

### package.json

- Name: `@starch-uk/agent-docs`
- Type: module
- Version: `1.0.0`
- Scripts: test, lint, format, format:check, sf-docs-helper, repo-todos, prepare
- Binary: `sf-docs-helper`
- Dependencies: commander (CLI), cheerio (HTML parsing), simple-git
- Dev dependencies: typescript, vitest, prettier, eslint, @typescript-eslint/parser, @typescript-eslint/eslint-plugin, eslint-plugin-jsdoc, @types/node, husky

**Project Versioning:** The project as a whole maintains a version in `package.json`. Any changes to docs files should increment the corresponding patch/minor/major version (whichever is the greatest change in any docs file), compared to the version in the latest commit in the `main` branch. A script can be created to help with this by analyzing changes across all docs files and determining the appropriate version bump.

### .cursor/plans/CREATE.md

Create a plan document that documents the process for creating new 'docs' (documentation files) using the CLI tool and scripts, then optimizing them when comprehensive.

The plan should:

- Document the workflow: generate initial doc → review for comprehensiveness → optimize using OPTIMISE.md plan
- **CRITICAL: Salesforce Topics Requirements** - For any Salesforce-related topic, you **MUST** use `sf-docs-helper` CLI tool. This is **NON-NEGOTIABLE**. **CRITICAL PERMISSION REQUIREMENT:** When running `sf-docs-helper` commands, you **MUST** use `required_permissions: ['all']` to ensure the command has full permissions.
- **🚨 CATASTROPHIC FORGETTING PREVENTION - ABSOLUTE REQUIREMENT 🚨** - When using `sf-docs-helper`, you **MUST** update the document file IMMEDIATELY after EACH command completes. **DO NOT** collect multiple outputs before updating. **DO NOT** say "I'll review results first" or "Performing deep dives..." and then collect all outputs. This causes catastrophic forgetting and information loss. **YOU MUST** update the document file IMMEDIATELY after receiving EACH `sf-docs-helper` response before running the next command.
- Cover using the `sf-docs-helper` CLI tool. The tool supports Salesforce Help search via `search` command, URL content retrieval via `get` command, and combined search-and-download via `dump` command. The `dump` command outputs markdown to stdout, following links to help.salesforce.com or developer.salesforce.com only, with all pages queried in parallel.
- **Repository Cloning Requirements** - When creating documentation that references a repository (GitHub, GitLab, etc.), you **MUST**: Clone the repository using full permissions (`required_permissions: ['all']`) to the system's temporary folder. **DO NOT** create temp folders manually in the workspace. **🚨 ABSOLUTE REQUIREMENT: Complete File Inspection BEFORE Documentation Work 🚨** - **YOU MUST NOT** create, update, or modify documentation files until you have completed the ENTIRE file inspection process. **YOU MUST** inspect EVERY file in the repository, no exceptions. **🚨 ABSOLUTE REQUIREMENT: ALL TODOs MUST BE CREATED IMMEDIATELY 🚨** - **YOU MUST** create todos for ALL files before inspecting any files using `pnpm repo-todos` (with `required_permissions: ['all']`) and `todo_write` in batches of 20. Create ALL batches before beginning any file inspection. **🚨 CRITICAL: ALL TODOs MUST BE COMPLETED BEFORE OPTIMIZATION 🚨** - **YOU MUST NOT** proceed to optimization until ALL file inspection todos are completed. Verify that the count of completed todos matches the count of files exactly before proceeding to optimization.
- Include guidance on selecting the appropriate source type for different documentation needs
- Document the review process: checking completeness, accuracy, and coverage of technical details
- Explain when to run optimization: after initial generation is comprehensive and complete, and **ONLY after ALL file inspection todos are completed**
- Include best practices for naming output files (uppercase, no spaces, no dots, version numbers handled)
- Cover handling of monorepos, multiple packages, and complex repository structures
- Document the iterative process: generate → review → refine → optimize (with optimization only after all file inspection todos complete)
- Focus on creating comprehensive initial documentation that captures all essential details before optimization
- **Include instructions to update README.md** - After creating a new doc file, the README.md should be updated to include a brief overview of the new doc in the Documentation section. Add a one-line description listing the filename and what it covers, maintaining the alphabetical or logical organization of the doc list.
- **Document updating existing docs** - When updating existing docs in the `docs/` directory, the doc file itself should be used to find references to:
  - Official web page URLs
  - Repository URLs (GitHub, GitLab, etc.)
  - For Salesforce docs: pages on help.salesforce.com (article URLs)
    These references can then be used with the appropriate `sf-docs-helper` command (`search` for search terms, or `get` for specific URLs) to re-crawl and update the documentation with the latest information.

### .cursor/plans/UPDATE.md

Create a plan document that documents the process for updating existing 'docs' (documentation files) in the `docs/` directory.

The plan should:

- **MANDATORY:** When updating any file in the `docs/` directory, you **MUST** follow the process documented in UPDATE.md. This is **NON-NEGOTIABLE**. **STOP** and read UPDATE.md first before making any changes.
- Document that updating existing docs requires verification and correction of all details
- Explain the workflow: extract references from doc file → re-crawl sources → verify/remove/correct/add details → run OPTIMISE.md plan (ONLY after ALL file inspection todos are completed)
- **CRITICAL: Salesforce Topics Requirements** - For any Salesforce-related topic, you **MUST** use `sf-docs-helper` CLI tool. This is **NON-NEGOTIABLE**. **CRITICAL PERMISSION REQUIREMENT:** When running `sf-docs-helper` commands, you **MUST** use `required_permissions: ['all']` to ensure the command has full permissions.
- **🚨 CATASTROPHIC FORGETTING PREVENTION - ABSOLUTE REQUIREMENT 🚨** - When using `sf-docs-helper`, you **MUST** update the document file IMMEDIATELY after EACH command completes. **DO NOT** collect multiple outputs before updating. **DO NOT** say "I'll review results first" or "Performing deep dives..." and then collect all outputs. This causes catastrophic forgetting and information loss. **YOU MUST** update the document file IMMEDIATELY after receiving EACH `sf-docs-helper` response before running the next command.
- Cover extracting references from the doc file itself:
  - Official web page URLs (extract from doc content)
  - Repository URLs (GitHub, GitLab, etc. - extract from doc content)
  - **CRITICAL:** If a repository URL is already present in the existing `docs/*.md` file, **DO NOT** perform a web search for the repository. Extract the repository URL directly from the doc file and proceed to cloning.
  - For Salesforce docs: pages on help.salesforce.com (extract article URLs from doc content)
- **Repository Cloning Requirements** - When updating documentation that references a repository, you **MUST**: Clone the repository using full permissions (`required_permissions: ['all']`) to the system's temporary folder. **DO NOT** create temp folders manually in the workspace. **🚨 ABSOLUTE REQUIREMENT: Complete File Inspection BEFORE Documentation Work 🚨** - **YOU MUST NOT** create, update, or modify documentation files until you have completed the ENTIRE file inspection process. **YOU MUST** inspect EVERY file in the repository, no exceptions. **🚨 ABSOLUTE REQUIREMENT: ALL TODOs MUST BE CREATED IMMEDIATELY 🚨** - **YOU MUST** create todos for ALL files before inspecting any files using `pnpm repo-todos` (with `required_permissions: ['all']`) and `todo_write` in batches of 20. Create ALL batches before beginning any file inspection. **🚨 CRITICAL: ALL TODOs MUST BE COMPLETED BEFORE OPTIMIZATION 🚨** - **YOU MUST NOT** proceed to optimization until ALL file inspection todos are completed. Verify that the count of completed todos matches the count of files exactly before proceeding to optimization.
- Document the verification process:
  - Verify all details in the doc file are still correct
  - Remove details that are no longer accurate or relevant
  - Correct any information that has changed
  - Add any missing details that should be included
- Explain how to use the extracted references with `sf-docs-helper`:
  - Use `search` command for Salesforce docs (extract search terms from URLs or doc content)
  - Use `get` command for specific Salesforce Help URLs (extract article URLs from doc content)
  - Use `dump` command for comprehensive dumps (outputs markdown to stdout, follows links automatically)
- Document the comparison process: compare current doc content with newly crawled content to identify:
  - Outdated information to remove
  - Changed information to correct
  - New information to add
- **Include instructions to run OPTIMISE.md** - After updating the doc file (verifying, removing, correcting, and adding details), and **ONLY after ALL file inspection todos are completed**, the `.cursor/plans/OPTIMISE.md` plan should be run to ensure the updated doc maintains low token count and optimal structure. **YOU MUST** actually execute the optimization process (read the file, apply techniques, convert prose to tables, etc.). Do NOT just mark it as "done" without executing it.
- Include guidance on versioning: after updates, determine appropriate version bump (patch/minor/major) based on the types of changes made, following VERSIONING.md
- Document the complete workflow: extract references → re-crawl → verify → remove → correct → add → (complete ALL file inspection todos) → optimize → version → commit
- **Cleanup requirement:** After inspection is complete, you MUST delete the cloned repository from the system's temporary folder. Do NOT leave temporary directories on the system.

### .cursor/plans/VERSIONING.md

Create a plan document that documents the versioning system for docs files and the project as a whole.

The plan should:

- Document that every file in `docs/` should be versioned using semantic versioning (semver)
- Explain versioning rules:
  - **Patch version bump** - Minor changes or corrections (typos, clarifications, formatting fixes) compared to the version in the latest commit in the `main` branch
  - **Minor version bump** - New sections added to a file compared to the version in the latest commit in the `main` branch
  - **Major version bump** - Sections replaced or removed from a file compared to the version in the latest commit in the `main` branch
- Document that the project as a whole maintains a version in `package.json` (currently `1.0.0`)
- Explain that changes to docs files should increment the project version (patch/minor/major based on the greatest change in any docs file) compared to the version in the latest commit in the `main` branch
- **Document initialization of existing docs:** The existing documentation files in the `docs/` directory (APEXANNOTATIONS.md, APEXDOC.md, CODEANALYZER.md, CPD.md, ESLINT.md, ESLINTJSDOC.md, FLOWSCANNER.md, GRAPHBINARY.md, GRAPHENGINE.md, GRAPHML.md, GRAPHSON.md, GREMLIN.md, GRYO.md, HUSKY.md, JEST30.md, JORJE.md, JSDOC.md, PMD.md, PMDAPEXAST.md, PMDSUPPRESSWARNINGS.md, PNPM.md, PRETTIER.md, PRETTIERAPEX.md, REGEX.md, RETIREJS.md, SFCLI.md, TINKERPOP.md, VITEST.md, VSCODE.md, XPATH31.md) need to be initialized with version `1.0.0` (or appropriate version based on their current state) when the versioning system is first implemented. These existing docs will be tracked going forward using the same semver system.
- Describe how scripts can help with versioning by:
  - Reading markdown files and detecting headers/sections
  - Comparing current state with the latest commit in `main` branch
  - Determining appropriate version bumps based on change types
  - Updating version information in docs files and `package.json`
  - Initializing version information for existing docs that don't have version metadata yet
- Include guidance on how to track versions for each doc file (e.g., in file metadata, separate version file, or git tags)
- Document the workflow: make changes → analyze changes → determine version bumps → update versions → commit

### .cursor/plans/OPTIMISE.md

Create a plan document that documents the process for converting high token count documentation files into AI Agent-friendly low token versions without losing any essential details. This plan will be used by AI-powered IDEs (like Cursor) to optimize docs, not by the CLI tool itself.

The plan should:

- Include core principles: terse but precise, tables over prose, bullet points for lists, minimal code examples, structured sections, reference-style formatting
- Document optimization techniques: text reduction strategies, structural optimizations (prose to tables, lists to tables, API documentation to tables, property lists to tables), content organization patterns
- Cover converting verbose documentation patterns: API Parameters/Returns sections to tables, property documentation lists to tables, interface explanations to inline comments in code blocks
- Provide a step-by-step conversion process: analysis, structure planning, content transformation, validation
- Include formatting standards, quality checklist, common pitfalls to avoid, and success metrics
- Focus on generic, reusable advice applicable to any high-token documentation file

## Testing Requirements

Every module must have corresponding tests:

- Unit tests for all functions
- Mock external services (web requests, file system where appropriate)
- Test edge cases: empty results, malformed HTML, missing files
- Test CLI argument parsing
- Aim for >80% coverage

## Implementation Notes

1. Use streaming/chunking for large sites to manage memory
2. Implement rate limiting for web crawling (respect robots.txt)
3. Cache crawled pages during a session to avoid re-fetching
4. The summarisation/optimization step is handled by AI agents following the `.cursor/plans/OPTIMISE.md` plan, not by the CLI tool itself. **CRITICAL:** Optimization can only happen after ALL file inspection todos are completed.
5. Handle authentication gracefully (some Salesforce content may require login - skip or warn)
6. Filename generation: Convert to uppercase, remove spaces and dots. Version numbers like "XPath 3.1" become "XPATH31.md". Remove redundant words like "plugin" when they appear between other words (e.g., "prettier-plugin-apex" → "PRETTIERAPEX.md", "eslint-plugin-jsdoc" → "ESLINTJSDOC.md"). All output files go in the `docs/` folder.
7. **CRITICAL PERMISSION REQUIREMENTS:**
   - When running `sf-docs-helper` commands, you **MUST** use `required_permissions: ['all']`
   - When cloning repositories, you **MUST** use `required_permissions: ['all']`
   - When running `pnpm repo-todos`, you **MUST** use `required_permissions: ['all']`
   - When running `pnpm` commands (install, build, test, etc.), you **MUST** use `required_permissions: ['network']` or `required_permissions: ['all']`
8. **CRITICAL: File Inspection Requirements:**
   - **ALL files are equally important** - There is NO such thing as a "key file" or "important file"
   - **DO NOT prioritize certain files** - All files must be inspected systematically
   - **DO NOT start with "most important files"** - This is a CRITICAL VIOLATION
   - **ALL files must be inspected** - Every file must be inspected without exception, including ALL `**/*.md` files and ALL files covering the public API
   - **Documentation files are critical** - Documentation files in docs/ directories often contain the MOST IMPORTANT details about configuration, options, edge cases, and usage patterns

## Deliverables

1. Repository scaffolding with all config files
2. CLI skeleton with argument parsing
3. Doc writer producing valid markdown
4. GitHub Action running tests
5. `search` command with help.salesforce.com crawling
6. `get` command for URL content retrieval
7. Incremental updates (re-crawl and diff) - When updating existing docs, extract references (Salesforce help pages and URLs) from the doc file itself to determine what to re-crawl
8. Versioning system for all docs (including existing docs in `docs/` directory)
