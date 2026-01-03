# Updating Existing Docs

This plan documents the process for updating existing 'docs' (documentation files) in the `docs/` directory.

## Workflow Overview

**⚠️ CRITICAL REQUIREMENT:** You **MUST** inspect **EVERY SINGLE FILE** in the repository, including ALL documentation files (docs/_.md, .README/_.md). Reading only a few "key files" and skipping documentation files is a **CRITICAL VIOLATION** that will result in incomplete documentation. Documentation files often contain the most important details about rules, settings, options, and usage patterns.

1. **Extract references** from the doc file itself
2. **Re-research sources** - Use web search to find official pages/repositories OR use `sf-docs-helper` for Salesforce topics
3. **Clone repository** - Clone repo using full permissions to system's temporary folder (if applicable)
4. **Systematic review** - Go through every URL on the official page and **EVERY FILE in the repo** (see Systematic Review section below)
5. **Verify** all details in the doc file are still correct
6. **Remove** details that are no longer accurate or relevant
7. **Correct** any information that has changed
8. **Add** any missing details that should be included
9. **Verify all content** - All content in markdown file must be verified or removed/changed
10. **Verify ALL todos completed** - Before proceeding, verify ALL file inspection todos are completed (count must match file count exactly)
11. **Optimize** using OPTIMISE.md plan (ONLY after ALL todos are completed)
12. **Version** appropriately based on changes
13. **Commit** the updated doc

## Extracting References

The doc file itself contains references to source material. Extract these references to determine what to re-research:

### Official Web Page URLs

Look for URLs in the doc content:

- Reference links in Overview section
- Links in Related Documentation section
- URLs mentioned in configuration examples
- Official documentation URLs

### Repository URLs

Look for GitHub, GitLab, Bitbucket, or other repository URLs:

- Repository links in Overview section
- Source code references
- Installation instructions with repo URLs
- Links to official repositories

### Salesforce Help Pages

For Salesforce docs, extract:

- Article URLs from help.salesforce.com
- Search terms used to find documentation
- Article IDs from URLs

## Re-researching Sources

### For Non-Salesforce Topics

**CRITICAL:** If a repository URL is already present in the existing `docs/*.md` file, **DO NOT** perform a web search for the repository. Extract the repository URL directly from the doc file and proceed to cloning.

**Process:**

1. **First, check if repository URL exists in doc file** - Extract the repository URL from the doc file itself if it's already documented
2. **If repository URL not found in doc file**, use `web_search` tool to find the official website/documentation page
3. Identify the official repository (if open source)
4. Verify these are the authoritative sources
5. Clone repository to system temp folder (if applicable)
6. Systematically review every URL on the official page
7. Systematically review every file in the repository

### For Salesforce Topics

**CRITICAL REQUIREMENT:** For any Salesforce-related doc update, **ALWAYS use `sf-docs-helper`**. This is **MANDATORY** and **NON-NEGOTIABLE**.

**DO NOT:**

- Use general web search for Salesforce topics
- Manually search the web for Salesforce documentation

**DO:**

- Extract search terms from the doc or Salesforce article topics
- Use `sf-docs-helper dump "<topic>"` to re-extract from help.salesforce.com
- The tool automatically filters to Developer Documentation and Product Documentation

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
9. Systematically review every file listed in the TODO.md file from the temporary folder

**CRITICAL WORKFLOW for Salesforce Documentation Updates:**

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

Follow this iterative workflow when updating Salesforce documentation:

1. **Initial search (10 results):**
   - Start with `pnpm sf-docs-helper dump "<main-topic>" --limit 10`
   - Example: `pnpm sf-docs-helper dump "Apex Annotations" --limit 10`
   - The dump command outputs markdown to stdout with all content
   - The tool automatically follows links to help.salesforce.com or developer.salesforce.com only
   - All pages are fetched in parallel for faster results
   - Review the markdown output to understand current state
   - **🚨 CRITICAL - CATASTROPHIC FORGETTING PREVENTION:** After receiving the response, you **MUST IMMEDIATELY UPDATE THE DOCUMENT FILE** with the information. Use the `search_replace` or `write` tool to update the document file. **DO NOT** proceed to step 2 until the document has been updated. **DO NOT** collect multiple outputs before updating.

2. **Discover APIs/commands/annotations:**
   - As you read the initial output (which should now be in the document), identify specific APIs, commands, or annotations mentioned
   - Compare with existing documentation to find gaps or changes
   - Create a list of discovered items that need verification or deeper investigation
   - Note which items in the existing doc need updates

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
   - Compare information with existing documentation
   - Identify what has changed, what is new, and what needs correction
   - Extract updated information from each page
   - **🚨 CRITICAL:** Update the document file IMMEDIATELY after each response before proceeding to the next command

5. **Update documentation:**
   - Update existing sections with new/changed information
   - Add missing APIs/commands/annotations discovered in the pages
   - Remove or mark outdated information
   - Verify all content against the read pages

**Example workflow:**

```bash
# Step 1: Initial search to understand current state (outputs markdown to stdout)
pnpm sf-docs-helper dump "Apex Annotations" --limit 10
# 🚨 CRITICAL: IMMEDIATELY update the document file using search_replace or write tool
# DO NOT proceed to step 2 until the document has been updated
# DO NOT collect multiple outputs before updating

# Step 2: Deep dives for items needing verification (outputs markdown to stdout)
pnpm sf-docs-helper dump "@AuraEnabled" --limit 5
# 🚨 CRITICAL: IMMEDIATELY update the document file using search_replace or write tool
# DO NOT run the next dump command until this document update is complete
pnpm sf-docs-helper dump "@RestResource" --limit 5
# 🚨 CRITICAL: IMMEDIATELY update the document file using search_replace or write tool
# DO NOT run the next dump command until this document update is complete
# Tool automatically deduplicates URLs and only follows help.salesforce.com/developer.salesforce.com links

# Step 3: Finalize documentation updates with all information
```

**🚨 REMINDER: After EACH `sf-docs-helper` command, you MUST update the document file IMMEDIATELY before running the next command. This prevents catastrophic forgetting.**

## Repository Cloning

### Clone Repository (Non-Salesforce Topics)

**MANDATORY:** If a repository exists, you **MUST** clone it using full permissions to the system's temporary folder.

**CRITICAL PERMISSION REQUIREMENT:** When cloning repositories, you **MUST** use `required_permissions: ['all']` to ensure git cloning has full permissions. Git cloning requires full filesystem and network permissions to succeed.

**Process:**

1. Use `cloneRepository` function or git commands with `required_permissions: ['all']`
2. Clone to system's temporary folder (using `tmpdir()` or similar)
3. **DO NOT** create temp folders manually in the workspace
4. **DO NOT** clone repositories to workspace directories
5. Repository should be cloned to a system temp location (e.g., `/tmp/agent-docs-*` on Unix)

## Systematic Review

### Review Every URL on Official Page

**MANDATORY:** You **MUST** systematically review **every URL** on the official documentation page.

**Process:**

1. Start with the official page URL
2. Extract all links from the page
3. Follow each link and extract content
4. Continue recursively for documentation sites (same domain)
5. Document all information found
6. Do NOT skip any URLs - review everything systematically

### Review Every File in Repository

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

**ABSOLUTE REQUIREMENT:** You **MUST NOT** proceed to documentation updates until you have:

1. Listed ALL files in the repository
2. Created a todo item for EVERY SINGLE FILE
3. Inspected EVERY SINGLE FILE
4. Verified that the count of inspected files matches the count of files from the listing

**DO NOT:**

- Say "I'll focus on the most important files first" - this is a VIOLATION
- Say "I'll read key files and then proceed" - this is a VIOLATION
- Skip file inspection because "there are too many files" - this is a VIOLATION
- Update documentation before inspecting ALL files - this is a VIOLATION
- Assume some files are "not important" - this is a VIOLATION

**YOU MUST:**

- Complete the ENTIRE file inspection process BEFORE updating any documentation
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

9. **MANDATORY VERIFICATION:** Before proceeding to content updates, verify that ALL files in the checklist have been inspected:
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
   - **If you have not inspected ALL files, STOP and complete the inspection before updating documentation**

## Verification Process

After re-researching, verify all details in the current doc file:

### Verify Correctness

- Check all APIs, methods, and components are still accurate
- Verify configuration options haven't changed
- Confirm code examples still work
- Check version numbers and compatibility information
- Verify information matches current source documentation

### Verify All Content

**CRITICAL REQUIREMENT:** All content in the markdown file **MUST** be verified or removed/changed.

**Process:**

1. Go through every section of the markdown file
2. For each piece of content, verify it against the source material
3. If content cannot be verified, remove it
4. If content is outdated, update or remove it
5. If content is incorrect, correct or remove it
6. Do NOT leave unverified content in the file

### Remove Outdated Information

- Remove deprecated APIs or methods
- Remove outdated configuration options
- Remove references to unsupported features
- Remove incorrect or obsolete information
- Remove content that cannot be verified

### Correct Changed Information

- Update changed APIs or method signatures
- Update modified configuration options
- Correct version numbers and compatibility
- Update changed best practices or patterns

### Add Missing Details

**MANDATORY:** Anything missing should be added.

- Add new APIs, methods, or components
- Add new configuration options
- Add new best practices or patterns
- Add missing architectural information
- Compare doc with source material and add anything missing

## Comparison Process

Compare current doc content with newly researched content:

1. **Identify differences:**
   - New sections in researched content
   - Removed sections in current doc
   - Changed information
   - Missing information in current doc

2. **Categorize changes:**
   - **Outdated** - Information no longer accurate
   - **Changed** - Information modified or updated
   - **New** - Information not in current doc
   - **Missing** - Information should be in doc but isn't

3. **Update accordingly:**
   - Remove outdated information
   - Correct changed information
   - Add new information
   - Fill in missing information

## Cleanup After Repository Inspection

**MANDATORY:** After completing repository inspection and before finalizing documentation updates:

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

**CRITICAL:** This cleanup step is **MANDATORY** and must be completed before finalizing the documentation updates.

## Running OPTIMISE.md

After updating the doc file (verifying, removing, correcting, and adding details), **MUST actually execute the OPTIMISE.md plan**:

**🚨 CRITICAL REQUIREMENT: ALL TODOs MUST BE COMPLETED BEFORE OPTIMIZATION 🚨**

**ABSOLUTE REQUIREMENT:** You **MUST NOT** proceed to optimization until you have:

1. Completed inspection of ALL files in the repository
2. Verified that ALL todos are marked as completed
3. Verified that the count of completed todos matches the count of files exactly
4. Completed all documentation updates based on the file inspection

**DO NOT:**

- Proceed to optimization with incomplete file inspection - this is a CRITICAL VIOLATION
- Say "I'll optimize now and complete remaining files later" - this is a CRITICAL VIOLATION
- Cancel or skip remaining todos because "essential review is complete" - this is a CRITICAL VIOLATION
- Begin optimization before ALL files are inspected - this is a CRITICAL VIOLATION

**YOU MUST:**

- Complete ALL file inspection todos before beginning optimization
- Verify completion count matches file count exactly
- Only proceed to optimization after ALL files have been inspected

**MANDATORY:** After ALL todos are completed, you **MUST** actually execute the optimization process described in `.cursor/plans/OPTIMISE.md`:

1. Read the OPTIMISE.md file completely
2. Apply the optimization techniques described (convert prose to tables, condense text, etc.)
3. Convert prose to tables where appropriate
4. Condense text while maintaining all essential information
5. Verify optimization quality
6. **DO NOT** just mark optimization as "done" without actually performing it

The optimization step ensures the updated doc maintains low token count and optimal structure. Simply marking it as complete without actually performing the optimization is NOT acceptable.

## Versioning

**CRITICAL:** After updates, **MUST follow [VERSIONING.md](VERSIONING.md) guidelines** to determine appropriate version bump.

### Version Bump Rules (from VERSIONING.md)

Compare changes against the version in the latest commit in the `main` branch:

- **Patch version (x.x.X)** - Minor changes or corrections:
  - Typo fixes
  - Clarifications
  - Formatting fixes
  - Minor corrections to existing content
  - Small additions that don't add new sections

- **Minor version (x.X.x)** - New sections added to the file:
  - Adding new API sections
  - Adding new configuration options
  - Adding new patterns or best practices
  - Adding new architectural information
  - Adding new examples or use cases

- **Major version (X.x.x)** - Sections replaced or removed from the file:
  - Removing entire sections
  - Replacing sections with different content
  - Breaking changes in APIs or configuration
  - Significant restructuring of content
  - Removing deprecated information that changes the doc's scope

### Project Version Update

After updating doc version, **MUST update project version** in `package.json`:

- If any doc has a **major** version bump → project gets **major** version bump
- Else if any doc has a **minor** version bump → project gets **minor** version bump
- Else if any doc has a **patch** version bump → project gets **patch** version bump

See [VERSIONING.md](VERSIONING.md) for complete versioning rules, examples, and workflow.

## Running sf-docs-helper CLI Tool (Salesforce Only)

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

## Complete Workflow

1. **Extract references** from doc file:
   - Official web page URLs
   - Repository URLs
   - Salesforce help pages (if applicable)

2. **Re-research sources:**
   - **For non-Salesforce:** Use web search to find official pages/repositories, then clone and review
   - **For Salesforce:** Use `sf-docs-helper dump "<topic>"` (**NEVER use web search for Salesforce topics**)
   - The dump command outputs markdown to stdout, following links to help.salesforce.com or developer.salesforce.com only
   - All pages are fetched in parallel for faster results

3. **Clone repository** (if applicable):
   - Clone to system temp folder with full permissions
   - Capture the temp directory path for later cleanup

4. **Systematic review:**
   - Review every URL on the official page
   - Review every file in the repository (if applicable)
   - **Verify ALL files have been inspected before proceeding**

5. **Compare** current doc with researched content:
   - Identify outdated information
   - Identify changed information
   - Identify new information
   - Identify missing information

6. **Verify** all details:
   - Verify all content or remove/change it
   - Check correctness
   - Remove outdated information
   - Correct changed information
   - Add missing details

7. **Cleanup** temporary repository:
   - Delete the cloned repository from system temp folder
   - Verify deletion completed

8. **Verify ALL todos completed** - Before proceeding, verify ALL file inspection todos are completed:
   - Count completed todos must match total file count exactly
   - **DO NOT proceed to optimization if any todos remain incomplete**

9. **Optimize** using OPTIMISE.md (ONLY after ALL todos are completed):
   - **MUST actually execute** the optimization process (read OPTIMISE.md and apply techniques)
   - Convert to low-token format
   - Maintain all essential information
   - Verify optimization quality

10. **Version** appropriately - **MUST follow [VERSIONING.md](VERSIONING.md)**:

- Compare changes against latest commit in `main` branch
- Determine version bump (patch/minor/major) based on change type
- Update doc file version information
- Update project version in `package.json` based on greatest change
- See VERSIONING.md for complete rules and examples

11. **Commit** the updated doc:
    - Commit with descriptive message
    - Include version information in commit message if applicable

## Best Practices

1. **Always verify** - Don't assume information is still correct
2. **Verify all content** - All content must be verified or removed/changed
3. **Compare thoroughly** - Check all sections, not just changed ones
4. **Review systematically** - Review every URL and every file (verify ALL files inspected)
5. **Add missing content** - Anything missing should be added
6. **Preserve structure** - Maintain doc format and organization
7. **Update cross-references** - Check Related Documentation section
8. **Test examples** - Verify code examples still work
9. **Document changes** - Note significant changes in commit message
10. **Cleanup temp directories** - Always delete temporary repository directories after inspection
11. **Optimize after updates** - Always actually execute OPTIMISE.md after making changes (not just mark as done)
12. **Version after updates** - **MUST follow [VERSIONING.md](VERSIONING.md)** after making changes:
    - Determine appropriate version bump (patch/minor/major)
    - Update doc file version
    - Update project version in `package.json`
    - Compare against latest commit in `main` branch
