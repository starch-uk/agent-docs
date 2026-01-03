# Salesforce Code Analyzer Reference

**Version:** 1.0.0

> **Purpose**: Static code analysis for Salesforce (PMD, ESLint, CPD, Regex,
> Flow Scanner, RetireJS, SFGE) **Install**:
> `sf plugins install @salesforce/sfdx-scanner`

---

## CLI Commands

### Basic Usage

```bash
sf scanner:run --target "path/to/source"              # Analyze directory
sf scanner:run --target "file.cls"                    # Analyze file
sf scanner:run --target "path" --engine pmd           # Specific engine
sf scanner:run dfa --target "path" --rule-selector sfge  # Data-flow analysis
```

### Rule Management

```bash
sf scanner:rule:list                                  # All rules
sf scanner:rule:list --engine pmd                     # Engine-specific
sf scanner:rule:list --rule-selector RuleName --view detail  # Rule details
```

### Output Formats

| Format | Command                                                                 |
| ------ | ----------------------------------------------------------------------- |
| JSON   | `sf scanner:run --target "path" --format json --outfile results.json`   |
| HTML   | `sf scanner:run --target "path" --format html --outfile results.html`   |
| CSV    | `sf scanner:run --target "path" --format csv --outfile results.csv`     |
| XML    | `sf scanner:run --target "path" --format xml --outfile results.xml`     |
| SARIF  | `sf scanner:run --target "path" --format sarif --outfile results.sarif` |

### Filtering

| Option                 | Description         | Example                                |
| ---------------------- | ------------------- | -------------------------------------- |
| `--engine`             | Filter by engine    | `--engine pmd,eslint`                  |
| `--category`           | Filter by category  | `--category "Security,Best Practices"` |
| `--rule-selector`      | Filter by rule name | `--rule-selector "Rule1,Rule2"`        |
| `--severity-threshold` | Min severity level  | `--severity-threshold 2`               |
| `--tag`                | Filter by tag       | `--tag "Recommended"`                  |

**Severity Levels**: `1`/Critical, `2`/High, `3`/Moderate, `4`/Low, `5`/Info

### Options

| Option                     | Description                     |
| -------------------------- | ------------------------------- |
| `--config-file`            | Custom config path              |
| `--project-dir`            | Project root for relative paths |
| `--verbose`                | Verbose output                  |
| `--violations-cause-error` | Exit 1 on violations            |
| `--normalize-severity`     | Include test classes            |

**Exit Codes**: `0` = Success | `1` = Violations or error

---

## Configuration File

Auto-discovered: `code-analyzer.yml` or `code-analyzer.yaml` in project root

### Top-Level Properties

| Property      | Type   | Default | Description                                               |
| ------------- | ------ | ------- | --------------------------------------------------------- |
| `config_root` | string | null    | Base path for relative paths (auto: config parent or CWD) |
| `log_folder`  | string | null    | Log directory (auto: system temp)                         |
| `log_level`   | number | 4       | `1`/Error, `2`/Warn, `3`/Info, `4`/Debug, `5`/Fine        |
| `rules`       | object | {}      | Rule overrides: `rules.{engine}.{rule}.{property}`        |
| `engines`     | object | {}      | Engine config: `engines.{engine}.{property}`              |

### Rule Overrides

```yaml
rules:
    pmd:
        RuleName:
            severity: 'High' # or 1-5
            tags: ['Recommended', 'Custom']
    eslint:
        sort-vars:
            severity: 'Info'
            tags: ['Suggestion']
```

**Note**: Only `severity` and `tags` supported for PMD. Property overrides
require custom ruleset XML with `ref=` syntax.

---

## Engine Configuration

### PMD Engine

| Property          | Type    | Default | Description               |
| ----------------- | ------- | ------- | ------------------------- |
| `disable_engine`  | boolean | false   | Disable PMD               |
| `custom_rulesets` | array   | []      | Ruleset XML paths         |
| `java_command`    | string  | null    | Java path (auto-discover) |

```yaml
engines:
    pmd:
        custom_rulesets:
            - rulesets/design/MyRule.xml
```

### Regex Engine

| Property         | Type    | Default | Description        |
| ---------------- | ------- | ------- | ------------------ |
| `disable_engine` | boolean | false   | Disable Regex      |
| `custom_rules`   | object  | {}      | Custom regex rules |

```yaml
engines:
    regex:
        custom_rules:
            NoTodoComments:
                regex: /\/\/[ \t]*TODO/gi # Must include 'g' flag
                file_extensions: ['.cls', '.trigger']
                description: 'Prevents TODO comments'
                violation_message: 'TODO found'
                severity: 'Info' # or 1-5
                tags: ['TechDebt']
```

**Rule Properties**:

| Property            | Required | Default         | Description                           |
| ------------------- | -------- | --------------- | ------------------------------------- |
| `regex`             | Yes      | —               | Pattern with flags (must include `g`) |
| `file_extensions`   | Yes      | —               | File extensions to match              |
| `description`       | Yes      | —               | Rule description                      |
| `violation_message` | No       | Auto            | Custom message                        |
| `severity`          | No       | 3/Moderate      | Severity level                        |
| `tags`              | No       | ["Recommended"] | Tags (auto-adds "Custom")             |

**Common Patterns**:

```yaml
/\/\/[ \t]*(TODO|FIXME|HACK)/gi           # TODO/FIXME comments
/(console\.(log|debug)|System\.debug)/gi  # Debug statements
/['"](00[0-9A-Za-z]{15,18})['"]/g         # Hardcoded Salesforce IDs
/catch\s*\([^)]+\)\s*\{\s*\}/g            # Empty catch blocks
```

### ESLint Engine

| Property                         | Type    | Default   | Description             |
| -------------------------------- | ------- | --------- | ----------------------- |
| `disable_engine`                 | boolean | false     | Disable ESLint          |
| `eslint_config_file`             | string  | null      | ESLint config path      |
| `auto_discover_eslint_config`    | boolean | false     | Auto-find config        |
| `disable_javascript_base_config` | boolean | false     | Disable JS rules        |
| `disable_lwc_base_config`        | boolean | false     | Disable LWC rules       |
| `disable_typescript_base_config` | boolean | false     | Disable TS rules        |
| `file_extensions`                | object  | See below | Extensions per language |

**Default file_extensions**: `javascript: ['.js', '.cjs', '.mjs']`,
`typescript: ['.ts']`, `html: ['.html', '.htm', '.cmp']`,
`css: ['.css', '.scss']`

### CPD Engine (Copy/Paste Detector)

| Property               | Type    | Default   | Description                  |
| ---------------------- | ------- | --------- | ---------------------------- |
| `disable_engine`       | boolean | false     | Disable CPD                  |
| `java_command`         | string  | null      | Java path (auto-discover)    |
| `file_extensions`      | object  | See below | Extensions per language      |
| `minimum_tokens`       | object  | 100       | Token threshold per language |
| `skip_duplicate_files` | boolean | false     | Skip same-name/length files  |

**Supported Languages**: Apex (`.cls`, `.trigger`), HTML, JavaScript,
TypeScript, Visualforce (`.page`, `.component`), XML

```yaml
engines:
    cpd:
        minimum_tokens:
            apex: 100
            javascript: 75
```

### Flow Scanner Engine

| Property         | Type    | Default | Description                 |
| ---------------- | ------- | ------- | --------------------------- |
| `disable_engine` | boolean | false   | Disable Flow Scanner        |
| `python_command` | string  | null    | Python path (auto-discover) |

**Rules**: `SystemContextWithoutSharing` (High) — CRUD bypassing sharing |
`SystemContextWithSharing` (Low) — CRUD with sharing

| Context                | Permissions                    | Risk                      |
| ---------------------- | ------------------------------ | ------------------------- |
| User Context           | User's perms/sharing/FLS       | Default—use this          |
| System Without Sharing | Bypasses all                   | High—privilege escalation |
| System With Sharing    | System perms, respects sharing | Moderate                  |

**Fix**: Flow Builder → Flow Properties → Advanced → "Run the flow in" → "User
Context"

### RetireJS Engine

Security vulnerability detection in JavaScript dependencies using
community-maintained database.

| Property         | Type    | Default | Description      |
| ---------------- | ------- | ------- | ---------------- |
| `disable_engine` | boolean | false   | Disable RetireJS |

```yaml
engines:
    retire-js:
        disable_engine: false

rules:
    retire-js:
        RuleName:
            severity: 'High'
            tags: ['Security']
```

**Usage**: `sf scanner:rule:list --engine retire-js`

---

## Complete Example

```yaml
config_root: null
log_folder: null
log_level: 4

rules:
    pmd:
        NoSingleLetterVariableNames:
            severity: 'High'
            tags: ['Recommended']

engines:
    pmd:
        custom_rulesets:
            - rulesets/design/MyRules.xml

    regex:
        custom_rules:
            NoConsecutiveBlankLines:
                regex: /\n\s*\n\s*\n/g
                file_extensions: ['.cls', '.trigger']
                description: 'Prevents consecutive blank lines'
                severity: 'Moderate'
                tags: ['CodeStyle']

    eslint:
        auto_discover_eslint_config: true

    cpd:
        minimum_tokens:
            apex: 100
```

---

## MCP Tools

> **Status**: Developer Preview

Natural language interaction with Code Analyzer via Model Context Protocol.

| Tool                          | Equivalent CLI                       | Description                                         |
| ----------------------------- | ------------------------------------ | --------------------------------------------------- |
| `run_code_analyzer`           | `sf scanner:run`                     | Analyze code (max 10 files, Recommended rules only) |
| `describe_code_analyzer_rule` | `sf scanner:rule:list --view detail` | Get rule metadata and examples                      |

**Setup — Agentforce Vibes Extension**: Pre-configured, no setup needed

**Setup — Other MCP Clients**:

```bash
npm install -g @salesforce/mcp-server-dx
```

```json
{
	"mcpServers": {
		"salesforce-dx": {
			"command": "sf",
			"args": ["mcp", "start", "--allow-non-ga-tools"]
		}
	}
}
```

**Limitations**: Max 10 files | Recommended rules only | LLM costs may apply |
Requires network

**Use CLI/VS Code for**: Batch analysis, CI/CD, custom rules, offline work

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Code Analysis
on: { pull_request: { branches: [main] } }

jobs:
    analyze:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with: { node-version: '18' }
            - run: npm install -g @salesforce/cli
            - run: sf plugins install @salesforce/sfdx-scanner
            - run:
                  sf scanner:run --target "force-app/main/default" --format json
                  --outfile results.json --violations-cause-error
                  --severity-threshold 2
            - uses: actions/upload-artifact@v4
              if: always()
              with: { name: scanner-results, path: results.json }
```

### GitLab CI

```yaml
code-analyzer:
    stage: analyze
    image: node:18
    before_script:
        - npm install -g @salesforce/cli
        - sf plugins install @salesforce/sfdx-scanner
    script:
        - sf scanner:run --target "force-app/main/default" --format json
          --outfile results.json --violations-cause-error
    artifacts:
        when: always
        paths: [results.json]
        reports: { codequality: results.json }
```

### Jenkins

```groovy
pipeline {
    agent any
    stages {
        stage('Code Analysis') {
            steps {
                sh 'npm install -g @salesforce/cli && sf plugins install @salesforce/sfdx-scanner'
                sh 'sf scanner:run --target "force-app/main/default" --format json --outfile results.json --violations-cause-error'
            }
        }
    }
    post { always { archiveArtifacts artifacts: 'results.json' } }
}
```

### Azure DevOps

```yaml
pool: { vmImage: 'ubuntu-latest' }
steps:
    - task: NodeTool@0
      inputs: { versionSpec: '18.x' }
    - script:
          npm install -g @salesforce/cli && sf plugins install
          @salesforce/sfdx-scanner
    - script:
          sf scanner:run --target "force-app/main/default" --format json
          --outfile results.json --violations-cause-error
```

### Advanced Patterns

**Changed Files Only** (GitHub):

```yaml
- uses: tj-actions/changed-files@v40
  id: changed-files
  with: { files: "**/*.cls\n**/*.trigger" }
- if: steps.changed-files.outputs.any_changed == 'true'
  run:
      sf scanner:run --target "${{ steps.changed-files.outputs.all_changed_files
      }}" --violations-cause-error
```

**Baseline**: `sf scanner:run --format json --outfile current.json` → compare
with baseline.json

**SARIF**:
`sf scanner:run --format sarif --outfile security.sarif --category Security`

### Best Practices

1. `--violations-cause-error` to fail fast
2. `--severity-threshold 2` for High/Critical only
3. Cache SF CLI and plugins
4. Store results as artifacts

---

## Common Workflows

```bash
sf scanner:run --target force-app/main/default/classes --tag "Recommended"      # Quick
sf scanner:run --target force-app/main/default --category Security --severity-threshold 2  # Security
sf scanner:run --target force-app/main/default --format json --outfile results.json --violations-cause-error  # CI/CD
sf scanner:run --target $(git diff --cached --name-only | grep -E '\.(cls|trigger|js)$' | tr '\n' ',')  # Pre-commit
```

---

## Related Documentation

| Category         | Reference                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| PMD              | [PMD.md](PMD.md) — Rulesets, CLI, CPD, configuration                                                                  |
| ESLint           | [ESLINT.md](ESLINT.md) — JS/TS/LWC configuration                                                                      |
| Graph Engine     | [GRAPHENGINE.md](GRAPHENGINE.md) — SFGE data-flow analysis                                                            |
| Rule Development | [XPATH31.md](XPATH31.md), [PMD.md#apex-ast-reference](PMD.md#apex-ast-reference)                                      |
| Official Docs    | [Code Analyzer Guide](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/code-analyzer.md) |
