# Creating New Docs

This plan documents the process for creating new 'docs' (documentation files) using web search to find official pages and repositories, then systematically reviewing all URLs and files.

## Workflow Overview

**⚠️ CRITICAL REQUIREMENT:** You **MUST** inspect **EVERY SINGLE FILE** in the repository, including ALL documentation files (docs/_.md, .README/_.md). Reading only a few "key files" and skipping documentation files is a **CRITICAL VIOLATION** that will result in incomplete documentation. Documentation files often contain the most important details about rules, settings, options, and usage patterns.

1. **Web search** - Find the official page and repository (if open source)
2. **Alternative: Salesforce** - If Salesforce-related, use `sf-docs-helper` instead
3. **Clone repository** - Clone repo using full permissions to system's temporary folder
4. **Systematic review** - Go through every URL on the official page and **EVERY FILE in the repo** (see Systematic Review section below)
5. **Create/update content** - Create documentation based on comprehensive review
6. **Verify all content** - All content in markdown file must be verified or removed/changed
7. **Add missing content** - Anything missing should be added
8. **Optimize** - Convert to low-token format using OPTIMISE.md plan
9. **Version** - Follow VERSIONING.md guidelines

## Initial Research

### Step 1: Web Search

When given a name/topic, perform a web search to find:

- Official website/documentation page
- Official repository (if open source)

**CRITICAL:** If a repository URL is already present in the existing `docs/*.md` file, **DO NOT** perform a web search for the repository. Extract the repository URL directly from the doc file and proceed to cloning.

**Process:**

1. **First, check if repository URL exists in docs file** - If updating an existing doc, extract the repository URL from the doc file itself
2. **If repository URL not found in doc file**, use `web_search` tool to search for the topic/library name
3. Identify the official website/documentation page
4. Identify the official repository (GitHub, GitLab, etc.) if open source
5. Verify these are the authoritative sources

### Step 2: Salesforce Alternative

**CRITICAL REQUIREMENT:** If the topic is Salesforce-related, **ALWAYS use `sf-docs-helper`** instead of web search. This is **MANDATORY** and **NON-NEGOTIABLE**.

**Salesforce-related topics include:**

- Apex (language, annotations, classes, methods, syntax)
- Lightning (Aura, LWC, Lightning Platform)
- Salesforce APIs (REST, SOAP, Bulk, Streaming)
- Salesforce features (Flows, Process Builder, Workflows)
- Salesforce tools (Salesforce CLI, Code Analyzer, etc.)
- Any topic found on help.salesforce.com

**Using sf-docs-helper:**

The `sf-docs-helper` CLI tool is a helper script for searching and extracting details from Salesforce Help. It searches Salesforce Help documentation, downloads all results to a temporary folder, and creates a todo file for processing.

**Command syntax (use dump mode):**

```bash
# Using dump mode (recommended - outputs markdown to stdout)
# CRITICAL: Must use required_permissions: ['all'] for sf-docs-helper commands
# The dump command outputs markdown to stdout, following links to help.salesforce.com or developer.salesforce.com only
# All pages are queried in parallel for faster results
pnpm sf-docs-helper dump "Lightning Web Components"
pnpm sf-docs-helper dump "AuraEnabled annotation"

# For specific commands/annotations/APIs in final documentation, use top 5 results:
pnpm sf-docs-helper dump "@AuraEnabled" --limit 5
pnpm sf-docs-helper dump "REST API" --limit 5

# Options:
# -v, --verbose - Show progress during processing (outputs to stderr)
# --concurrency <n> - Number of concurrent downloads (default: 5)
# --limit <n> - Maximum number of results to download (default: 20)
```

**CRITICAL PERMISSION REQUIREMENT:** When running `sf-docs-helper` commands (including `pnpm sf-docs-helper dump`, `pnpm sf-docs-helper search`, `pnpm sf-docs-helper get`), you **MUST** use `required_permissions: ['all']` to ensure the command has full permissions. The `sf-docs-helper` tool requires full filesystem and network permissions to search Salesforce Help, download content, and create temporary directories. **DO NOT** attempt to run `sf-docs-helper` commands without full permissions - they will fail with permission errors.

**Process for dump command:**

1. The tool searches Salesforce Help (help.salesforce.com) for the specified item
2. Filters results to Developer Documentation and Product Documentation only
3. Iterates through pagination to retrieve results
4. Deduplicates the results
5. Limits to specified number of results (default: 20, or use --limit option)
6. Fetches all pages in parallel
7. Extracts links from each page (only follows links to help.salesforce.com or developer.salesforce.com)
8. Fetches additional linked pages in parallel
9. Outputs all content as markdown to stdout

**Process for search/get commands:**

1. The tool searches Salesforce Help (help.salesforce.com) for the specified item
2. Filters results to Developer Documentation and Product Documentation only
3. Iterates through pagination to retrieve results
4. Deduplicates the results
5. Limits to specified number of results (default: 20, or use --limit option)
6. Downloads all content to a temporary folder
7. Creates a TODO.md file listing all downloaded documents
8. Outputs the temporary folder location
9. Review the TODO.md file in the folder to process each document

**CRITICAL WORKFLOW for Salesforce Documentation Creation:**

**🚨 CATASTROPHIC FORGETTING PREVENTION - ABSOLUTE REQUIREMENT 🚨**

**YOU MUST UPDATE THE DOCUMENT IMMEDIATELY AFTER EACH `sf-docs-helper` COMMAND. DO NOT COLLECT MULTIPLE OUTPUTS BEFORE UPDATING. THIS IS CRITICAL TO PREVENT INFORMATION LOSS.**

**ABSOLUTE REQUIREMENTS:**

- **DO NOT** run multiple `sf-docs-helper` commands and collect all outputs before updating
- **DO NOT** say "I'll review the results first" or "I'll process all outputs together" or "Reviewing the initial results. Performing deep dives..."
- **DO NOT** proceed to the next `sf-docs-helper` command until the document has been updated with the current output
- **YOU MUST** update the document file IMMEDIATELY after receiving EACH `sf-docs-helper` response
- **YOU MUST** write the information to the document file before running the next command
- **YOU MUST** process and integrate information into the document after each command completes
- **YOU MUST** use the `search_replace` or `write` tool to update the document file after each command

**Why this is critical:** If you collect multiple `sf-docs-helper` outputs before updating the document, you will experience catastrophic forgetting - the context will become too large to process effectively, and important details will be lost. Updating incrementally ensures all information is preserved.

Follow this iterative workflow when creating Salesforce documentation:

1. **Initial search (10 results):**
   - Start with `pnpm sf-docs-helper dump "<main-topic>" --limit 10`
   - Example: `pnpm sf-docs-helper dump "Apex Annotations" --limit 10`
   - The dump command outputs markdown to stdout with all content
   - The tool automatically follows links to help.salesforce.com or developer.salesforce.com only
   - All pages are fetched in parallel for faster results
   - Review the markdown output to understand the topic
   - **🚨 CRITICAL - CATASTROPHIC FORGETTING PREVENTION:** After receiving the response, you **MUST IMMEDIATELY UPDATE THE DOCUMENT FILE** with the information. Use the `search_replace` or `write` tool to update the document file. **DO NOT** proceed to step 2 until the document has been updated. **DO NOT** collect multiple outputs before updating.

2. **Discover APIs/commands/annotations:**
   - As you read the initial output (which should now be in the document), identify specific APIs, commands, or annotations mentioned
   - Create a list of discovered items (e.g., `@AuraEnabled`, `@RestResource`, `REST API`, etc.)
   - Note which items need deeper investigation

3. **Iterative deep dives (5 results each):**
   - For each discovered API/command/annotation, perform: `pnpm sf-docs-helper dump "<specific-item>" --limit 5`
   - Example: `pnpm sf-docs-helper dump "@AuraEnabled" --limit 5`
   - **CRITICAL:** The tool automatically deduplicates URLs - **DO NOT dump the same page twice**
   - The tool only follows links to help.salesforce.com or developer.salesforce.com
   - All pages are fetched in parallel
   - **🚨 CRITICAL - CATASTROPHIC FORGETTING PREVENTION:** After receiving EACH response, you **MUST IMMEDIATELY UPDATE THE DOCUMENT FILE** with the information before running the next `sf-docs-helper` command. Use the `search_replace` or `write` tool to update the document file. **DO NOT** run multiple dump commands in sequence without updating the document between each one. **DO NOT** collect outputs from multiple commands before updating.

4. **Process the output:**
   - The dump command outputs all content as markdown to stdout
   - Review the markdown output systematically
   - Extract relevant information from each page
   - Build the final documentation as you read
   - Cross-reference information across pages for accuracy and completeness
   - **🚨 CRITICAL:** Update the document file IMMEDIATELY after each response before proceeding to the next command

5. **Build comprehensive documentation:**
   - Use information from all pages to create the final document
   - Ensure all discovered APIs/commands/annotations are documented
   - Verify information against multiple sources when possible

**Example workflow:**

```bash
# Step 1: Initial search (outputs markdown to stdout)
pnpm sf-docs-helper dump "Apex Annotations" --limit 10
# 🚨 CRITICAL: IMMEDIATELY update the document file using search_replace or write tool
# DO NOT proceed to step 2 until the document has been updated
# DO NOT collect multiple outputs before updating
# Review markdown output, discover: @AuraEnabled, @RestResource, @Future

# Step 2: Deep dives for discovered items (outputs markdown to stdout)
pnpm sf-docs-helper dump "@AuraEnabled" --limit 5
# 🚨 CRITICAL: IMMEDIATELY update the document file using search_replace or write tool
# DO NOT run the next dump command until this document update is complete
pnpm sf-docs-helper dump "@RestResource" --limit 5
# 🚨 CRITICAL: IMMEDIATELY update the document file using search_replace or write tool
# DO NOT run the next dump command until this document update is complete
pnpm sf-docs-helper dump "@Future" --limit 5
# 🚨 CRITICAL: IMMEDIATELY update the document file using search_replace or write tool
# DO NOT run the next dump command until this document update is complete
# Tool automatically deduplicates URLs and only follows help.salesforce.com/developer.salesforce.com links

# Step 3: Finalize documentation with all information
```

**🚨 REMINDER: After EACH `sf-docs-helper` command, you MUST update the document file IMMEDIATELY before running the next command. This prevents catastrophic forgetting.**

**DO NOT:**

- Use general web search (`web_search` tool) for Salesforce topics
- Use manual web search for Salesforce topics

**DO:**

- Use `sf-docs-helper dump "<topic>"` for ALL Salesforce topics
- Salesforce Help (help.salesforce.com) is the authoritative source
- The tool automatically filters to Developer Documentation and Product Documentation only
- The tool only follows links to help.salesforce.com or developer.salesforce.com
- All pages are fetched in parallel for faster results
- The dump command outputs markdown to stdout with all content
- This ensures comprehensive, accurate, and official coverage

**For Salesforce topics, use the dump mode to output all content as markdown to stdout. The tool automatically follows links to help.salesforce.com or developer.salesforce.com only, and fetches all pages in parallel.**

## Repository Cloning

### Step 3: Clone Repository

**MANDATORY:** If a repository exists, you **MUST** clone it using full permissions to the system's temporary folder.

**CRITICAL PERMISSION REQUIREMENT:** When cloning repositories, you **MUST** use `required_permissions: ['all']` to ensure git cloning has full permissions. Git cloning requires full filesystem and network permissions to succeed.

**Process:**

1. Use `cloneRepository` function or git commands with `required_permissions: ['all']`
2. Clone to system's temporary folder (using `tmpdir()` or similar)
3. **DO NOT** create temp folders manually in the workspace
4. **DO NOT** clone repositories to workspace directories
5. Repository should be cloned to a system temp location (e.g., `/tmp/agent-docs-*` on Unix)

**Example:**

```bash
# Repository will be cloned to system temp folder automatically
# When using git commands, ensure required_permissions: ['all']
```

## Systematic Review

### Step 4: Review Every URL on Official Page

**MANDATORY:** You **MUST** systematically review **every URL** on the official documentation page.

**Process:**

1. Start with the official page URL
2. Extract all links from the page
3. Follow each link and extract content
4. Continue recursively for documentation sites (same domain)
5. Document all information found
6. Do NOT skip any URLs - review everything systematically

### Step 5: Review Every File in Repository

**MANDATORY:** You **MUST** systematically review **every file** in the cloned repository.

**What to inspect (SYSTEMATICALLY - check EVERY file):**

**CRITICAL REQUIREMENT:** When looking through a Git repo, you **MUST** look at:
- **Every `**/*.md` file** - All markdown files in the repository, regardless of location
- **EVERY file covering the public API** - All files that define or document the public API
- **All exported plugins and libraries** - All files that export plugins, libraries, or modules that are part of the public API

1. **List all files first:**
   - Use `list_dir` recursively or `glob_file_search` to get COMPLETE file listing
   - Create a checklist of ALL files to review
   - Check off each file as you inspect it
   - Do NOT proceed until ALL files are reviewed

2. **Source code files (check ALL):**
   - Main entry points (index.js, main.js, src/index.ts, etc.)
   - All rule/plugin files (src/rules/, src/plugins/, etc.)
   - All utility files (src/utils/, src/helpers/, etc.)
   - All type definition files (\*.d.ts, types.ts, etc.)
   - All configuration builders (src/config/, src/builders/, etc.)
   - Implementation details, APIs, methods, classes in EVERY file

3. **Documentation files (check ALL):**
   - README.md (main documentation)
   - CHANGELOG.md, CHANGES.md, HISTORY.md (version history)
   - All docs/ subdirectory files (docs/rules/, docs/api/, etc.)
   - Migration guides, upgrade guides
   - Contributing guidelines, code of conduct
   - License files

4. **Configuration files (check ALL):**
   - Package files (package.json, package-lock.json, pnpm-lock.yaml, Cargo.toml, etc.)
   - Build configs (tsconfig.json, webpack.config.js, rollup.config.js, etc.)
   - Lint configs (.eslintrc.\*, eslint.config.js, .prettierrc, etc.)
   - Test configs (vitest.config.ts, jest.config.js, mocha.opts, etc.)
   - CI/CD configs (.github/workflows/, .gitlab-ci.yml, etc.)
   - Config schemas, default values, options in ALL config files

5. **Test files (check ALL):**
   - All test files (test/, tests/, **tests**/, _.test._, _.spec._)
   - Test utilities and helpers
   - Test fixtures and data
   - Usage examples, API patterns, edge cases in tests

6. **Example files (check ALL):**
   - Example directories (examples/, example/, samples/, etc.)
   - Example code files
   - Best practices and patterns in examples

7. **Other important files:**
   - TypeScript config files (tsconfig.\*.json)
   - Build scripts (scripts/, bin/)
   - Template files, generators
   - Any other source files that contain implementation details

**Systematic inspection process:**

**🚨 STOP AND READ THIS ENTIRE SECTION BEFORE PROCEEDING 🚨**

**🚨 CRITICAL: ALL FILES ARE EQUALLY IMPORTANT 🚨**

- **There is NO such thing as a "key file" or "important file"** - ALL files are equally important
- **Do NOT prioritize certain files** - All files must be inspected systematically
- **Do NOT re-order files for inspection** - Inspect files in the order they appear in the file listing
- **Do NOT start with "most important files"** - This is a CRITICAL VIOLATION
- **All files are equal** - Every file must be inspected without exception

**ABSOLUTE REQUIREMENT:** You **MUST NOT** proceed to documentation creation or updates until you have:

1. Listed ALL files in the repository
2. Created a todo item for EVERY SINGLE FILE
3. Inspected EVERY SINGLE FILE
4. Verified that the count of inspected files matches the count of files from the listing

**DO NOT:**

- Say "I'll focus on the most important files first" - this is a VIOLATION
- Say "I'll read key files and then proceed" - this is a VIOLATION
- Skip file inspection because "there are too many files" - this is a VIOLATION
- Create documentation before inspecting ALL files - this is a VIOLATION
- Assume some files are "not important" - this is a VIOLATION

**YOU MUST:**

- Complete the ENTIRE file inspection process BEFORE creating or updating any documentation
- Inspect EVERY file, no exceptions
- Verify completion before proceeding

1. **List ALL files in repository** - Use a command to get the complete file listing:

   ```bash
   find . -type f ! -path './.git/*' ! -path './node_modules/*' ! -path './dist/*' ! -path './coverage/*' | sort
   ```

   This ensures you have the complete, accurate list of ALL files to inspect.

2. **CRITICAL: Create a todo for EVERY SINGLE FILE IMMEDIATELY** - Use the `repo-todos` script to automatically generate todos for all files, then use `todo_write` to create them. This is **MANDATORY** and **NON-NEGOTIABLE**.

   **🚨 ABSOLUTE REQUIREMENT: ALL TODOs MUST BE CREATED IMMEDIATELY 🚨**
   - **DO NOT** say "I'll start with the most important files first" - this is a CRITICAL VIOLATION
   - **DO NOT** create initial todos for "most important ones" - create todos for ALL files immediately
   - **YOU MUST** create todos for ALL files before inspecting any files
   - **YOU MUST** use `todo_write` to create todos from the generated JSON file in batches of 20
   - **YOU MUST** create ALL batches (all todos) before beginning any file inspection
   - **NO EXCEPTIONS** - Every single file must have a todo created before any file inspection begins
   - When using `todo_write`, create todos in batches of 20 items per call, but create ALL batches before proceeding

   **Automated approach (RECOMMENDED):**

   ```bash
   # Generate todos for the cloned repository and write to a file
   # From the workspace directory
   # CRITICAL: Must use required_permissions: ['all'] for pnpm repo-todos
   pnpm repo-todos /path/to/cloned/repo --output .todos-repo-inspection.json
   # Then read the file and use with todo_write tool to create ALL todos immediately
   ```

   **Alternative (output to stdout):**

   ```bash
   # Generate todos and output to stdout
   cd /path/to/cloned/repo
   # CRITICAL: Must use required_permissions: ['all'] for pnpm repo-todos
   pnpm repo-todos . > todos.json
   # Then use the output with todo_write tool to create ALL todos immediately
   ```

   **CRITICAL PERMISSION REQUIREMENT:** When running `pnpm repo-todos`, you **MUST** use `required_permissions: ['all']` to ensure the command has full permissions. The `repo-todos` script requires full filesystem permissions to read repository files and directories. **DO NOT** attempt to run `pnpm repo-todos` without full permissions - it will fail with permission errors.

   The `repo-todos` script:
   - Automatically lists all files (excluding .git, node_modules, dist, coverage, etc.)
   - Generates unique todo IDs for each file
   - Validates that all files have corresponding todos
   - Detects duplicate IDs
   - Outputs JSON format ready for `todo_write` tool
   - Supports `--output <file>` or `-o <file>` to write todos to a file (recommended)
   - Without `--output`, writes JSON to stdout for piping/redirection

   **After generating todos, you MUST:**
   - Read the JSON file containing all todos
   - Use `todo_write` to create todos in batches of 20 items per call
   - Create ALL batches (all todos) before beginning any file inspection
   - **CRITICAL:** Do NOT start inspecting files until ALL todos have been created across all batches
   - Verify that the count of todos created matches the count of files exactly
   - Only AFTER all todos are created (all batches completed) should you begin inspecting files

   **Manual approach (if automated script unavailable):**
   - Use `todo_write` to create a separate todo item for EACH and EVERY file in the repository
   - Create todos in batches of 20 items per `todo_write` call
   - Create ALL batches (all todos) before beginning any file inspection
   - **DO NOT** group files into categories or "file groups"
   - **DO NOT** create high-level todos like "Review source code files" or "Review config files"
   - **DO NOT** create todos for "most critical files" or "important files" - ALL files are required
   - **DO NOT** skip any files, even if they seem unimportant
   - **DO NOT** create initial todos for "most important ones" - create todos for ALL files immediately
   - **DO NOT** read only a few "key files" (package.json, README.md) and skip the rest - this is a CRITICAL VIOLATION
   - **DO NOT** assume documentation files (docs/_.md, .README/_.md) are less important - they often contain critical details about rules, settings, options, and usage
   - **EVERY file must have its own individual todo item** with a unique identifier
   - Example: `file-package.json`, `file-README.md`, `file-src-index.js`, `file-src-rules-checkAccess.js`, `file-docs-rules-checkAccess.md`, `file-.README-rules-checkAccess.md`, etc.
   - The total number of todos must equal the total number of files exactly
   - **NO EXCEPTIONS** - Every single file in the repository listing must have a corresponding todo item
   - **VERIFICATION REQUIRED:** After creating todos, verify: `count of files from find command === count of todos created`. If they don't match, STOP and fix this before proceeding.

3. **Inspect files one by one** - Read and inspect EACH file systematically, one at a time:
   - Inspect ALL files systematically without prioritization or re-ordering
   - All files are equally important and must be inspected
   - Read the entire contents of each file
   - Extract all relevant information from each file
   - Do NOT skip files or assume they're not important

4. **Update doc as you go** - As you inspect each file, add its details to the documentation before moving on to the next file. Do NOT wait until the end to add information.

5. **Check off each file** - Mark each file's todo as completed as you finish inspecting it (update todo list immediately after each file).

6. **Verify nothing is missed** - Every file must be reviewed before proceeding. No file should remain uninspected.

7. **Cross-reference information** - Compare information across files to ensure consistency.

8. **Document findings from ALL files** - Not just a few key files - EVERY file must contribute to the documentation.

9. **MANDATORY VERIFICATION:** Before proceeding to content creation, verify that ALL files in the checklist have been inspected:
   - Count the total number of files from step 1
   - Count the total number of completed todos
   - These numbers MUST match exactly
   - Do NOT proceed if any files remain unchecked
   - Do NOT proceed if the numbers don't match
   - **CRITICAL WARNING:** If you proceed without verifying ALL files are inspected, you have violated this requirement and your work is INCOMPLETE
   - **CRITICAL WARNING:** Reading only "key files" (package.json, README.md, a few source files) and skipping documentation files (docs/_.md, .README/_.md) is a CRITICAL VIOLATION
   - **CRITICAL WARNING:** Documentation files in docs/ and .README/ directories often contain the MOST IMPORTANT details about:
     - Individual rule documentation with all options and examples
     - Settings documentation with detailed explanations
     - Advanced usage patterns and edge cases
     - Configuration examples and best practices
     - Migration guides and breaking changes
   - **You MUST inspect ALL files, including ALL documentation files, before proceeding**
   - **If you have not inspected ALL files, STOP and complete the inspection before creating documentation**

## Content Creation and Verification

### Step 6: Create/Update Content

Based on the comprehensive review:

1. Create the documentation file structure
2. Extract and organize all relevant information
3. Include APIs, methods, configuration options, examples
4. Document patterns, best practices, architectural decisions
5. Include version information, licensing, compatibility

### Step 7: Verify All Content

**CRITICAL REQUIREMENT:** All content in the markdown file **MUST** be verified or removed/changed.

**Process:**

1. **Verify correctness:**
   - Check all APIs, methods, and components are accurate
   - Verify configuration options match source
   - Confirm code examples work
   - Check version numbers and compatibility

2. **Remove unverified content:**
   - If content cannot be verified, remove it
   - If content is outdated, update or remove it
   - If content is incorrect, correct or remove it

3. **Change incorrect content:**
   - Update incorrect information
   - Fix outdated details
   - Correct errors

### Step 8: Add Missing Content

**MANDATORY:** Anything missing should be added.

**Process:**

1. Compare created doc with source material
2. Identify missing APIs, methods, or features
3. Identify missing configuration options
4. Identify missing patterns or best practices
5. Identify missing examples or use cases
6. Add all missing essential information

## Naming Conventions

Output filenames follow these rules:

- **Uppercase** - All letters converted to uppercase
- **No spaces** - Spaces removed or replaced
- **No dots** - Dots removed (except file extension)
- **Version numbers** - "XPath 3.1" → `XPATH31.md`

All output files go in the `docs/` folder.

## Cleanup After Repository Inspection

**MANDATORY:** After completing repository inspection and before finalizing documentation:

1. **Delete temporary repository directory:**
   - Remove the cloned repository from the system's temporary folder
   - Use terminal commands to delete the temp directory (e.g., `rm -rf /tmp/agent-docs-*` or similar)
   - Verify the directory has been deleted
   - **DO NOT leave temporary directories on the system**

**Example cleanup:**

```bash
# After inspection is complete, delete the temp directory
rm -rf /var/folders/.../tmp.*/eslint-plugin-jsdoc
# Or use the temp directory path that was captured during cloning
```

**CRITICAL:** This cleanup step is **MANDATORY** and must be completed before finalizing the documentation.

## When to Optimize

**🚨 CRITICAL REQUIREMENT: ALL TODOs MUST BE COMPLETED BEFORE OPTIMIZATION 🚨**

**ABSOLUTE REQUIREMENT:** You **MUST NOT** proceed to optimization until you have:

1. Completed inspection of ALL files in the repository
2. Verified that ALL todos are marked as completed
3. Verified that the count of completed todos matches the count of files exactly
4. Completed all documentation creation/updates based on the file inspection

**DO NOT:**

- Proceed to optimization with incomplete file inspection - this is a CRITICAL VIOLATION
- Say "I'll optimize now and complete remaining files later" - this is a CRITICAL VIOLATION
- Cancel or skip remaining todos because "essential review is complete" - this is a CRITICAL VIOLATION
- Begin optimization before ALL files are inspected - this is a CRITICAL VIOLATION

**YOU MUST:**

- Complete ALL file inspection todos before beginning optimization
- Verify completion count matches file count exactly
- Only proceed to optimization after ALL files have been inspected

Run optimization (using `.cursor/plans/OPTIMISE.md`) after:

- **ALL file inspection todos are completed** (MANDATORY - no exceptions)
- Initial generation is comprehensive and complete
- All essential details have been captured
- All content has been verified
- All missing content has been added
- Ready to convert to low-token format

**MANDATORY:** After ALL todos are completed, you **MUST** actually execute the optimization process described in `.cursor/plans/OPTIMISE.md`:

1. Read the OPTIMISE.md file completely
2. Apply the optimization techniques described
3. Convert prose to tables where appropriate
4. Condense text while maintaining all essential information
5. Verify optimization quality
6. **DO NOT** just mark optimization as "done" without actually performing it

**Do not optimize** until ALL file inspection is complete and the doc is comprehensive - optimization focuses on reducing token count while maintaining all essential information.

**After optimization, follow [VERSIONING.md](VERSIONING.md) to:**

- Initialize the doc with appropriate version (typically `1.0.0`)
- Update project version in `package.json` if needed
- Track version according to semver rules

## Iterative Process

Documentation creation is iterative:

1. **Research** - Web search to find official page and repository (or use sf-docs-helper for Salesforce)
2. **Clone** - Clone repository to system temp folder (if applicable)
3. **Review** - Systematically review every URL and every file (verify ALL files inspected)
4. **Verify ALL todos completed** - Before proceeding, verify ALL file inspection todos are completed
5. **Create** - Create documentation based on comprehensive review
6. **Verify** - Verify all content or remove/change it
7. **Add** - Add any missing content
8. **Cleanup** - Delete temporary repository directory
9. **Optimize** - Convert to low-token format using `.cursor/plans/OPTIMISE.md` (ONLY after ALL todos completed, MUST actually execute optimization)
10. **Version** - Follow [VERSIONING.md](VERSIONING.md) to initialize version and update project version

Repeat steps 3-7 until the doc is comprehensive, verified, and optimized. **Always complete steps 4 (Verify ALL todos), 8 (Cleanup), 9 (Optimize), and 10 (Version) before finalizing.**

## Running sf-docs-helper (Salesforce Only)

**CRITICAL REQUIREMENTS when running `sf-docs-helper`:**

1. **Do NOT build unnecessarily:**
   - **DO NOT** run `pnpm build` or create `dist/` folder unless explicitly needed
   - The `sf-docs-helper` CLI tool should be run directly from source using `node` or via `pnpm` scripts
   - Only build if the tool specifically requires compiled output
   - Building creates unnecessary `dist/` folders that should be avoided

2. **Use proper command format:**

   ```bash
   # Using pnpm script (recommended)
   # CRITICAL: Must use required_permissions: ['all'] for sf-docs-helper commands
   # Dump command outputs markdown to stdout
   pnpm sf-docs-helper dump "<topic>"
   pnpm sf-docs-helper dump "<specific-item>" --limit 5  # For specific commands/annotations/APIs
   # Search command downloads to temporary folder
   pnpm sf-docs-helper search "<topic>"

   # Or run directly with node
   node src/cli/index.ts dump "<topic>"
   node src/cli/index.ts dump "<specific-item>" --limit 5
   node src/cli/index.ts search "<topic>"
   ```

3. **CRITICAL PERMISSION REQUIREMENT:** When running `sf-docs-helper` commands (including `pnpm sf-docs-helper dump`, `pnpm sf-docs-helper search`, `pnpm sf-docs-helper get`), you **MUST** use `required_permissions: ['all']` to ensure the command has full permissions. The `sf-docs-helper` tool requires full filesystem and network permissions to search Salesforce Help, download content, and create temporary directories. **DO NOT** attempt to run `sf-docs-helper` commands without full permissions - they will fail with permission errors.

## Updating README.md

After creating a new doc file, **update README.md**:

1. Navigate to the Documentation section
2. Add a one-line description of the new doc
3. List the filename and what it covers
4. Maintain alphabetical or logical organization
5. Follow the existing format: `**FILENAME.md** - Brief description`

Example:

```markdown
## Documentation

- **APEXDOC.md** - ApexDoc documentation tool reference
- **NEWDOC.md** - New documentation reference
- **PMD.md** - PMD static analysis tool reference
```

## Best Practices

1. **Be comprehensive** - Review every URL and every file
2. **Verify everything** - All content must be verified or removed/changed
3. **Add missing content** - Don't leave gaps in documentation
4. **Use authoritative sources** - Official pages and repositories only
5. **Test examples** - Verify code examples work correctly
6. **Cross-reference** - Link to related docs using `[Name](FILENAME.md)` format
7. **Version appropriately** - **MUST follow [VERSIONING.md](VERSIONING.md) guidelines** after creation:
   - Initialize new doc with version `1.0.0` (or appropriate version)
   - Determine version based on content scope (patch/minor/major)
   - Update project version in `package.json` if needed
   - See VERSIONING.md for complete versioning rules and workflow
8. **Document decisions** - Note any architectural or design decisions made during creation
