# Agentforce Workflows — Agent Guide

> **Version**: 1.0.0

## Overview

Workflows are reusable `.md` files defining multi-step Salesforce dev tasks.
Invoke with `/[workflow-name.md]` in chat.

**Benefits:** Automation, consistency, error reduction, time savings, team
sharing.

---

## Creating & Managing

| Action  | Method                                             |
| ------- | -------------------------------------------------- |
| Access  | Click **Rules & Workflows** (justice icon) in chat |
| Scope   | Choose **Global** or **Workspace** workflows       |
| Create  | Click **+**                                        |
| Storage | Workspace: `.a4drules/workflows/` folder           |

Interface allows: view active workflows, toggle on/off, add/delete.

---

## Workflow Capabilities

- **Built-in tools:** `ask_followup_question`, `read_file`, `search_files`,
  `new_task`
- **CLI tools:** `sf` (Salesforce CLI), `git`
- **External:** MCP tool calls
- **Chaining:** Sequential action execution

---

## Common Workflow Types

| Type        | Purpose                                 |
| ----------- | --------------------------------------- |
| Deployment  | Deploy/validate components across orgs  |
| Testing     | Run test suites, analyze results        |
| Release     | Package, validate, deploy releases      |
| Component   | Create/test/deploy Lightning components |
| Integration | Set up/validate external integrations   |

---

## Example: `salesforce-deploy.md`

```text
You have access to the `sf` terminal command. Deploy components following this process:

1. **Gather Info**
   <ask_followup_question>
     <question>Which components to deploy and to which org?</question>
     <options>["Specific files/folders", "All local changes", "Specific metadata types"]</options>
   </ask_followup_question>

   sf org display --target-org <target-org>

2. **Pre-Deployment Validation**
   sf project retrieve start --dry-run --target-org <target-org>
   sf apex test run --code-coverage --result-format human
   sf project deploy start --dry-run --target-org <target-org>

3. **Confirm**
   <ask_followup_question>
     <question>Validation complete. Proceed with deployment?</question>
     <options>["Yes, deploy now", "No, make changes first", "Show details"]</options>
   </ask_followup_question>

4. **Execute**
   sf project deploy start --target-org <target-org>
   sf project deploy report --target-org <target-org>

5. **Post-Validation**
   sf apex test run --target-org <target-org> --code-coverage --result-format human
```

---

## SF CLI Quick Reference

### Org Commands

```bash
sf org list                              # List authorized orgs
sf org display --target-org <alias>      # Display org info
sf config set target-org <alias>         # Set default org
```

### Deployment

```bash
sf project deploy start --target-org <alias>            # Deploy
sf project deploy start --dry-run --target-org <alias>  # Validate only
sf project deploy report --target-org <alias>           # Check status
sf project retrieve start --target-org <alias>          # Retrieve metadata
```

### Testing

```bash
sf apex test run --target-org <alias> --code-coverage --result-format human
sf apex test run --class-names "Test1,Test2" --target-org <alias>
sf apex test report --target-org <alias>
```

### Data

```bash
sf data query --query "SELECT Id FROM Account LIMIT 10" --target-org <alias>
sf data import tree --plan data/plan.json --target-org <alias>
sf data export tree --query "SELECT Id FROM Account" --target-org <alias>
```

---

## Custom Workflow Ideas

| Workflow             | Key Steps                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Release**          | Gather merged changes → Build changelog → Bump version → Create/validate package         |
| **New Component**    | Create folder structure → Generate boilerplate files → Set up Jest tests → Deploy to dev |
| **Integration Test** | Validate credentials → Test endpoints → Check error handling → Generate reports          |
| **Code Quality**     | Run PMD analysis → Check accessibility → Validate naming → Generate reports              |
