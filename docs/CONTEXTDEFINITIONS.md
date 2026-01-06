# Salesforce Context Definitions Reference

> v1.0.0 | Part of Dynamic Revenue Orchestrator (DRO) | Industries Common
> Resources

<!-- NAVIGATION: Basics→DataTypes→Mapping→Filters→Runtime→Limits→Predefined→API→Apex→Flow→Deployment→URLs -->

---

## Quick Reference

### Terminology

| Term               | Definition                                                           |
| ------------------ | -------------------------------------------------------------------- |
| Attribute          | Property of a node holding data values (Input/Output/InputOutput)    |
| Context            | Runtime instance of data structured per context definition           |
| Context Definition | Metadata blueprint defining nodes, attributes, mappings              |
| Context Tag        | Auto-generated metadata identifier matching attribute name           |
| Hydration          | Process of populating context instance with data from mapped sources |
| Mapping            | Connection between context attributes and Salesforce object fields   |
| Node               | Hierarchical element representing a data entity                      |

### Node Types

| Type        | Description                             |
| ----------- | --------------------------------------- |
| Child       | Nested under root or other nodes        |
| Integration | Special node for BRE writeback          |
| Root        | Primary entry point node                |
| Sibling     | Same hierarchical level as another node |

### Attribute Types

| Type        | Data Flow                                             |
| ----------- | ----------------------------------------------------- |
| Input       | Into context from mapped source                       |
| InputOutput | Bidirectional                                         |
| Output      | Out of context (populated by procedures/calculations) |

---

## Prerequisites & Permissions

### Enabling Context Definitions

1. Enable Salesforce DRO admin user licenses
2. Enable Context Service platform license (Context Service Access)
3. Setup → Context Service → Context Service Settings → Toggle on Context
   Definitions

### Required Permissions

| Permission              | Purpose                            |
| ----------------------- | ---------------------------------- |
| Context Service Access  | Basic view/use access              |
| Context Service Admin   | Create, modify, delete definitions |
| Context Service Runtime | Execute context operations         |
| DRO Admin User          | Revenue Cloud admin access         |

---

## Supported Data Types

### Data Type Reference (Alphabetical)

| Type      | Use Case           | Notes                                   |
| --------- | ------------------ | --------------------------------------- |
| BOOLEAN   | Flags, checkboxes  | true/false                              |
| CURRENCY  | Prices, amounts    | Uses org currency settings              |
| DATE      | Dates without time | Format: YYYY-MM-DD                      |
| DATETIME  | Timestamps         | Format: YYYY-MM-DDTHH:MM:SSZ (ISO 8601) |
| EMAIL     | Email addresses    | Direct mapping                          |
| NUMBER    | Quantities, counts | Configurable precision/scale            |
| PERCENT   | Percentages, rates | Numeric percent value                   |
| PHONE     | Phone numbers      | Direct mapping                          |
| PICKLIST  | Enumerated values  | Multi-select: semicolon-separated       |
| REFERENCE | Record IDs         | 18-char Salesforce ID                   |
| STRING    | Text, names, codes | Up to 255 chars standard                |
| TEXTAREA  | Long text          | Descriptions, notes                     |
| TIME      | Time-only values   | Format: HH:MM:SS                        |
| URL       | Web addresses      | Direct mapping                          |

### Salesforce Field → Context Attribute Mapping

| Salesforce Field Type      | Context Data Type                              |
| -------------------------- | ---------------------------------------------- |
| Address                    | STRING (individual components or concatenated) |
| Checkbox                   | BOOLEAN                                        |
| Currency                   | CURRENCY                                       |
| Date                       | DATE                                           |
| Date/Time                  | DATETIME                                       |
| Email                      | EMAIL                                          |
| Formula                    | Corresponding type based on return type        |
| Geolocation                | STRING ("Latitude,Longitude")                  |
| Hierarchy Relationship     | REFERENCE                                      |
| Long Text Area             | TEXTAREA                                       |
| Lookup Relationship        | REFERENCE                                      |
| Master-Detail Relationship | REFERENCE                                      |
| Multi-Select Picklist      | PICKLIST (comma-separated)                     |
| Number                     | NUMBER                                         |
| Percent                    | PERCENT                                        |
| Phone                      | PHONE                                          |
| Picklist                   | PICKLIST                                       |
| Text                       | STRING                                         |
| Text Area                  | TEXTAREA                                       |
| Time                       | TIME                                           |
| URL                        | URL                                            |

---

## Context Definition Structure

### Creation Steps

1. Create root node with attributes (Name, Type, Data Type)
2. Add child/sibling nodes as needed
3. Create Integration node (if BRE needed) with fixed attributes: `Id`,
   `IntegrationProviderDefId`, `RelatedObject`, `RunAsUserId`, `Status`
4. Generate All Tags (tag names must match attribute names exactly)
5. Save and configure mappings
6. Activate

### Context Tags

- Auto-generated from attribute names
- Must match attribute names exactly (case-sensitive)
- Used for mapping and programmatic access
- Integration node tag: `IntegrationProviderDcsnRqmt`

---

## Mapping

### Mapping Types

| Type            | Relationship                      | Supported Intents                     |
| --------------- | --------------------------------- | ------------------------------------- |
| Cross-Attribute | Attributes across different nodes | Association                           |
| Many-to-One     | Multiple source → single target   | Association, Hydration                |
| One-to-Many     | Single source → multiple targets  | Association, Persistence, Translation |
| One-to-One      | Direct 1:1 relationship           | All intents                           |

### Mapping Intent Types

| Intent      | Purpose                                      | Supported Mapping Types | Data Flow           |
| ----------- | -------------------------------------------- | ----------------------- | ------------------- |
| Association | Custom business logic using mapping metadata | All types               | N/A (metadata only) |
| Hydration   | Read from Salesforce into context            | Many-to-One, One-to-One | SF → Context        |
| Persistence | Write from context to Salesforce             | One-to-Many, One-to-One | Context → SF        |
| Translation | Transform between context structures         | One-to-Many, One-to-One | Context → Context   |

### Multiple Intent Compatibility

When selecting multiple intents, only common mapping types are available:

- Hydration + Translation → One-to-One only
- Persistence + Translation → One-to-Many, One-to-One
- Association + Any → All types from Association

### Default Mapping

- One mapping per definition marked as default
- Used when no mapping explicitly specified
- Cannot change default status during deployment (manual post-deploy action)

---

## Context Filters

### Filter Configuration

| Setting               | Limit           | Notes                 |
| --------------------- | --------------- | --------------------- |
| Conditions per filter | 5 max           | Combine with AND/OR   |
| Logic operators       | AND, OR         | All or Any conditions |
| Sort order            | Multiple fields | Ascending/Descending  |

### Supported Operators (Alphabetical)

Contains • Equals • Greater Than • Greater Than or Equal • In • Is Empty • Is
Not Empty • Less Than • Less Than or Equal • Not Contains • Not Equals • Not In

### Condition Types

| Type    | Description                      | Example                              |
| ------- | -------------------------------- | ------------------------------------ |
| Dynamic | Runtime values/context variables | `AccountId equals {ContextVariable}` |
| Static  | Fixed values                     | `Status equals 'Active'`             |

---

## Context Service Limits

### Structure Limits

| Limit                             | Default | Maximum    | Notes                  |
| --------------------------------- | ------- | ---------- | ---------------------- |
| Attributes per context definition | 800     | 1,000      | Total across all nodes |
| Attributes per node               | 200     | 500        | Per individual node    |
| Filter conditions per filter      | -       | 5          |                        |
| Hierarchy depth                   | -       | 5          | Levels                 |
| Nodes per context definition      | 50      | Contact SF | All node types count   |

### Runtime Limits

| Limit                        | Default | Maximum | Notes                                   |
| ---------------------------- | ------- | ------- | --------------------------------------- |
| Active context instances     | -       | 20,000  | Within TTL duration                     |
| Records per context instance | 10,000  | 20,000  | Total across all nodes                  |
| Time To Live (TTL)           | 10 min  | 45 min  | Set at design time, cannot change after |

### API Limits

- Standard Salesforce API rate limits apply
- Per-user and per-org limits enforced
- Request/response size limits apply

---

## Extending Context Definitions

### Extension Rules

- Can only extend **standard** definitions (not custom)
- Cannot modify inherited nodes, attributes, mappings
- Can add custom nodes, attributes, mappings
- Auto-syncs when accessed in Setup or hydrated by application
- **Not** auto-synced when hydration triggered by Apex or Flow

### Extension Steps

1. Standard Definitions tab → Select definition → Extend
2. Name your extended definition
3. Add custom nodes/attributes (optional)
4. Map Data tab → Edit SObject Mapping → Mark as Default
5. Map custom attributes to entity fields
6. Activate

### Sync Considerations

- Click **Sync Now** after Salesforce upgrades if issues occur
- Sync fails if: user lacks permissions, limits exceeded, corrupted definitions
- Perform Sync in sandbox first, then package and deploy to production

---

## Cloning Context Definitions

### Clone vs Extend

| Aspect       | Clone                     | Extend                         |
| ------------ | ------------------------- | ------------------------------ |
| Independence | Fully independent copy    | Linked to standard definition  |
| Updates      | No automatic updates      | Auto-syncs with standard       |
| Modification | Full modification allowed | Only add custom components     |
| Use case     | Complete customization    | Preserve standard + add custom |

### Clone Steps

1. Context Definitions → Select definition → Clone
2. Name cloned definition
3. Modify as needed
4. Activate before use

---

## Activation

### Activation Status

| Status   | Description                |
| -------- | -------------------------- |
| Active   | Available for use          |
| Draft    | Being created/modified     |
| Inactive | Deactivated, not available |

### Activation Rules

- Complete structure before activation
- Configure at least one mapping (mark as default)
- Cannot activate/deactivate via deployment package (manual only)
- Activate after deployment to target org

### Common Activation Errors

| Error                                   | Cause                             | Resolution                      |
| --------------------------------------- | --------------------------------- | ------------------------------- |
| Context definition already active       | Already activated                 | No action needed                |
| Context definition structure is invalid | Missing required nodes/attributes | Complete structure              |
| No default mapping found                | No mapping or no default set      | Create and mark default mapping |
| Permission denied                       | Insufficient permissions          | Grant Context Service Admin     |

---

## Runtime Operations

### Flow Invocable Actions

| Action                    | Purpose                             | Key Parameters                                   |
| ------------------------- | ----------------------------------- | ------------------------------------------------ |
| Build Context             | Create and hydrate context instance | contextDefinitionId, recordIds, contextMappingId |
| Delete Context Cache      | Remove context from cache           | contextId                                        |
| Persist Context Data      | Save context data to Salesforce     | contextId, recordIds, contextMappingId           |
| Query Context Tags        | Retrieve tag values                 | contextId, tags                                  |
| Update Context Attributes | Modify context data                 | contextId, nodePath, updatedValues               |

### Runtime Patterns

```
Pattern 1: Simple Hydration
Build Context → Query Context Tags → Use data → Delete Context Cache

Pattern 2: Hydration + Persistence
Build Context → Query → Update Context Attributes → Persist Context Data → Delete Cache

Pattern 3: Translation (Quote→Order)
Build Context (QuoteMapping) → Query → Build Context (OrderMapping) → Update → Persist → Delete Both
```

### Persistence Limitations

- Cannot persist compound fields (e.g., Contact Name) - must persist individual
  fields (Salutation, FirstName, LastName)
- If values overridden during Build Context, Persist doesn't store new values

---

## REST API Endpoints

### Context Definition Management

| Endpoint                                     | Methods            | Purpose                     |
| -------------------------------------------- | ------------------ | --------------------------- |
| `/connect/context-definitions`               | GET, POST          | List/create definitions     |
| `/connect/context-definitions/{id}`          | DELETE, GET, PATCH | Manage specific definition  |
| `/connect/context-definitions/{id}/filters`  | GET, POST          | Manage filters              |
| `/connect/context-definitions/{id}/upgrades` | PATCH              | Upgrade extended definition |

### Context Service Runtime

| Endpoint                                | Methods     | Purpose                         |
| --------------------------------------- | ----------- | ------------------------------- |
| `/connect/context-service-runtime`      | POST        | Create/hydrate context instance |
| `/connect/context-service-runtime/{id}` | DELETE, GET | Retrieve/delete instance        |

### API Version

Base: `/services/data/vXX.X/connect/...`

### HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |

---

## Apex Development

### Namespace & Classes

**Namespace:** `Context`

| Class                     | Purpose                    |
| ------------------------- | -------------------------- |
| Context.ContextDefinition | Definition metadata access |
| Context.ContextException  | Error handling             |
| Context.ContextInstance   | Instance management        |
| Context.ContextService    | Main operations class      |

### Context.ContextService Methods

```apex
// Build and cache context
String buildContext(String contextDefinitionId, List<String> recordIds, String contextMappingId)

// Delete context from cache
void deleteContextCache(String contextId)

// Persist context data to Salesforce
void persistContextData(String contextId, List<String> recordIds, String contextMappingId)

// Query tag values
Map<String, Object> queryContextTags(String contextId, List<String> tags)

// Update attributes
void updateContextAttributes(String contextId, String nodePath, Map<String, Object> updatedValues)
```

### Example: Basic Operations

```apex
try {
    // Build context
    String contextId = Context.ContextService.buildContext(
        'SalesTransactionContext',
        new List<String>{'001xx000003DGbQ'},
        null
    );

    // Query tags
    Map<String, Object> values = Context.ContextService.queryContextTags(
        contextId,
        new List<String>{'AccountNode.Name', 'AccountNode.Id'}
    );

    // Cleanup
    Context.ContextService.deleteContextCache(contextId);

} catch (Context.ContextException e) {
    System.debug('Error: ' + e.getMessage());
}
```

---

## Deployment

### Package Manager Steps

1. Setup → Package Manager → New
2. Add components: Component Type = Context Definition
3. Upload version (name, number, optional password)
4. Deploy via installation URL to target org
5. **Post-install:** Activate definitions, verify mappings

### Auto-Included in Package

- Context mappings
- Context filters
- Custom fields mapped in definitions
- Custom objects referenced in mappings
- Dependencies

### Deployment Scenarios

**✅ Supported:**

- Between orgs of same release version
- Summer '25 → Winter '26 (forward compatible)
- Add new custom nodes/attributes/mappings
- Update/delete custom mappings

**❌ Unsupported:**

- Winter '26 → Summer '25 (backward incompatible)
- Update/delete custom nodes or attributes during deployment
- Activate/deactivate in deployment package
- Change default mapping status in deployment package

### Deployment Order

1. **Layer 1:** Custom objects/fields → Context definitions → Activate
2. **Layer 2:** Pricing/Rating procedures → BRE rules → Flows → Apex
3. **Layer 3:** Lightning components → Page layouts → Permission sets → Apps

### Workarounds for Unsupported Scenarios

| Scenario                | Workaround                                 |
| ----------------------- | ------------------------------------------ |
| Modify nodes/attributes | Deactivate in target → modify → reactivate |
| Delete nodes/attributes | Delete definition in target → redeploy     |
| Activate/deactivate     | Manual action in target org post-deploy    |
| Change default mapping  | Manual action in target org post-deploy    |

---

## Predefined Context Definitions (Revenue Cloud)

### Transaction Management

| Definition                        | Purpose                                                   |
| --------------------------------- | --------------------------------------------------------- |
| DynamicRevenueOrchestratorContext | DRO order decomposition/fulfillment                       |
| SalesTransactionContext           | Sales transactions, Quote/Order management, decomposition |

### Product Discovery

| Definition              | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| ProductDiscoveryContext | Product discovery, qualification rules, browsing |

### Rate & Usage Management

| Definition             | Purpose                       |
| ---------------------- | ----------------------------- |
| RateManagementContext  | Usage rating, rate management |
| RatingDiscoveryContext | Usage rating discovery        |

### Billing

| Definition               | Purpose                               |
| ------------------------ | ------------------------------------- |
| BillingContext           | Invoice generation, billing schedules |
| StandaloneBillingContext | Standalone billing schedule creation  |

### Asset Management

| Definition              | Purpose                                           |
| ----------------------- | ------------------------------------------------- |
| AssetContext\_\_stdctx  | Asset-based config rules, Constraint Rules Engine |
| FulfillmentAssetContext | Fulfillment asset info for decomposition          |

### Media & Sales

| Definition                     | Purpose                                   |
| ------------------------------ | ----------------------------------------- |
| MediaPlanTransactionContext    | Ad sales lifecycle, media plan management |
| SalesAgreementQuotesConversion | Sales agreement ↔ quote conversion        |

### Other Clouds

| Cloud              | Example Definitions            |
| ------------------ | ------------------------------ |
| Field Service      | WorkEstimationCoveragesContext |
| Financial Services | (Cloud-specific)               |
| Health Cloud       | (Cloud-specific)               |
| Manufacturing      | (Cloud-specific)               |

---

## Troubleshooting

### Common Errors

| Error                             | Cause                           | Resolution                        |
| --------------------------------- | ------------------------------- | --------------------------------- |
| Context definition is deactivated | Using deactivated definition    | Activate before use               |
| Context definition not found      | Invalid ID or doesn't exist     | Verify ID exists                  |
| Context instance not found        | Invalid ID or expired/deleted   | Verify instance exists            |
| Data type conversion failed       | Type mismatch                   | Check data type compatibility     |
| Field not accessible              | Permission/sharing issue        | Grant field-level access          |
| Filter condition invalid          | Syntax/logic error              | Review filter syntax              |
| Governor limit exceeded           | Exceeded SF limits              | Optimize, batch, reduce data      |
| Invalid context tag               | Tag doesn't exist               | Verify tag name matches attribute |
| Invalid data type                 | Type mismatch                   | Verify mappings                   |
| Invalid mapping type              | Incompatible with intent        | Check type/intent compatibility   |
| Limit exceeded                    | Max nodes/attributes reached    | Remove unused, contact SF         |
| Mapping not found                 | Invalid mapping ID              | Verify mapping exists             |
| Maximum attributes exceeded       | >1000 total                     | Remove unused attributes          |
| Maximum nodes exceeded            | >50 nodes                       | Remove unused nodes               |
| No default mapping found          | No default set                  | Mark a mapping as default         |
| Permission denied                 | Insufficient permissions        | Grant Context Service Admin       |
| Sync conflict detected            | Extended vs standard conflict   | Use Override or resolve           |
| Sync failed                       | Permissions, limits, corruption | Check permissions, contact SF     |
| Timeout error                     | Operation too long              | Reduce data, optimize             |

### Debug Steps

1. Setup → Debug Logs → Create trace flag (FINEST for Context Service)
2. Reproduce issue
3. Review: Context operations, SOQL queries, errors, execution times
4. Check definition status (Active/Inactive)
5. Validate mappings (types, intents, field paths)

---

## URL Reference

| ID                 | URL                                                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API_BUSINESS       | https://developer.salesforce.com/docs/atlas.en-us.industries_reference.meta/industries_reference/context_service_apis.htm                                         |
| API_CONTEXT_DEF    | https://developer.salesforce.com/docs/atlas.en-us.industries_reference.meta/industries_reference/connect_resources_context_definition.htm                         |
| API_CONTEXT_DEF_ID | https://developer.salesforce.com/docs/atlas.en-us.industries_reference.meta/industries_reference/connect_resources_context_definition_id.htm                      |
| API_CREATE_CONTEXT | https://developer.salesforce.com/docs/atlas.en-us.industries_reference.meta/industries_reference/connect_resources_create_context.htm                             |
| API_RUNTIME        | https://developer.salesforce.com/docs/atlas.en-us.industries_reference.meta/industries_reference/connect_resources_context_service_runtime.htm                    |
| APEX_REF           | https://developer.salesforce.com/docs/atlas.en-us.industries_reference.meta/industries_reference/context_service_apex_reference.htm                               |
| CLONE              | https://help.salesforce.com/s/articleView?language=en_US&id=ind.context_service_clone_context_definitions.htm&type=5                                              |
| DEV_GUIDE          | https://developer.salesforce.com/docs/atlas.en-us.industries_reference.meta/industries_reference/                                                                 |
| ENABLE             | https://help.salesforce.com/s/articleView?language=en_US&id=ind.context_service_turn_on_context_definitions.htm&type=5                                            |
| INTERFACE          | https://developer.salesforce.com/docs/atlas.en-us.industries_reference.meta/industries_reference/connect_responses_context_definition_interface.htm               |
| INTERFACE_LIST     | https://developer.salesforce.com/docs/atlas.en-us.industries_reference.meta/industries_reference/connect_responses_context_definition_interface_metadata_list.htm |
| META_API           | https://developer.salesforce.com/docs/atlas.en-us.industries_reference.meta/industries_reference/context_service_metadata_api_parent.htm                          |
| MIGRATE            | https://help.salesforce.com/s/articleView?language=en_US&id=ind.context_service_context_definitions_packages.htm&type=5                                           |
| PKG_DEPLOY         | https://help.salesforce.com/s/articleView?language=en_US&id=ind.context_service_install_use_package.htm&type=5                                                    |
| PKG_PREPARE        | https://help.salesforce.com/s/articleView?language=en_US&id=ind.context_service_prepare_package.htm&type=5                                                        |
| TOOLING_API        | https://developer.salesforce.com/docs/atlas.en-us.industries_reference.meta/industries_reference/context_service_tooling_api_parent.htm                           |
| UPGRADE            | https://help.salesforce.com/s/articleView?language=en_US&id=ind.context_service_upgrade_context_definitions.htm&type=5                                            |

---

## Best Practices Summary

### Design

- Include only necessary nodes/attributes
- Minimize hierarchy depth (max 5)
- Plan for limits during design
- Use filters to reduce data volume

### Performance

- Reuse context instances when possible
- Delete instances when done
- Use appropriate TTL (shorter = fresher data, longer = fewer hydrations)
- Batch operations to avoid governor limits

### Deployment

- Test in sandbox first
- Deploy context definitions before dependent components
- Activate manually after deployment
- Document changes and versions

### Maintenance

- Remove unused nodes/attributes/filters
- Monitor usage against limits
- Sync extended definitions after upgrades
- Archive old definitions
