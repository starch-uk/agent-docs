# CML Reference (Constraint Modeling Language)

> **Version**: 1.0.0 | **Platform**: Salesforce Revenue Cloud Product
> Configurator

DSL for defining constraint models for product configuration. Compiles to
constraint model used by constraint engine to construct compliant
configurations.

---

## Quick Reference

### Syntax Cheatsheet

```c
// Constants & Properties
define MAX_SIZE 100                    // Fixed constant
define COLORS ["Red", "Blue"]          // List constant
property maxVal = 9999;                // Configurable property
extern int threshold = 50;             // External variable with default

// Types & Inheritance
type Product { string name; }
type Laptop : Product { int RAM; }     // Inherits from Product

// Variables & Domains
int quantity = [1..10];                // Range domain
string color = COLORS;                 // List reference
decimal(2) price = [0..1000.00];       // Decimal range

// Relationships
relation items : Item[1..5];           // Min 1, max 5
relation parts : Part[0..*];           // Zero to unlimited
relation components : Component[1..*] order (TypeA, TypeB);

// Constraints
constraint(qty > 0);                                      // Basic
constraint(A && B -> C, "Error message");                 // Implication with message
constraint(rooms[Bedroom] > 0);                           // Type filter

// Rules
message(condition, "text", "Info|Warning|Error");
preference(processor == "i7");                            // Soft constraint
require(laptop > 0, warranty > 0);                        // Auto-add
exclude(productA > 0, productB > 0);                      // Prevent combo
hide(optionA > 0, optionB);                               // Hide/disable
action(qty > 10, applyDiscount());                        // Trigger action

// Functions
sum(), count(), min(), max(), avg(), parent()
```

### Key Annotations

| Annotation        | Target       | Purpose                          |
| ----------------- | ------------ | -------------------------------- |
| `@displayName`    | Type/Var/Rel | UI display name                  |
| `@description`    | Type         | Description text                 |
| `@group`          | Type         | UI grouping                      |
| `@hide`/`@hidden` | Type/Var/Rel | Hide from UI                     |
| `@sequence`       | Type/Var     | Resolution order (lower = first) |
| `@required`       | Var/Rel      | Mark as required                 |
| `@readOnly`       | Var          | Read-only field                  |
| `@defaultValue`   | Var          | Default value                    |
| `@contextPath`    | Var          | Map to transaction field         |
| `@abort`          | Constraint   | Stop on first error              |

Combined syntax: `@(key=value, key2=value2)`

### Performance Targets

| Metric         | Target | Impact                    |
| -------------- | ------ | ------------------------- |
| Execution Time | <100ms | UI responsiveness         |
| Backtracks     | <1000  | Efficient resolution      |
| Violations     | 0      | All constraints satisfied |

---

## Setup: Enabling CML (Constraint Rules Engine)

### Prerequisites

- **Edition**: Enterprise/Performance/Unlimited/Developer with Revenue Cloud
  Growth or Advanced license
- **Permission Set**: "Product Configuration Constraints Designer"
- **Restrictions**: Not available in Government Cloud or EU Operating Zone (OZ)

### Step 1: Enable in Revenue Settings

1. Setup → **Revenue Settings**
2. Enable **Set Up Configuration Rules and Constraints with Constraint Rules
   Engine**
3. `AdvancedConfigurator` becomes default rule engine

> **Note**: Beta feature—validate in sandbox first.

### Step 2: Create Transaction Processing Type

Create a Transaction Processing Type record:

- Set **Rule Engine** = `AdvancedConfigurator` (not `StandardConfigurator`)
- Optionally append "Advanced Configurator" to name for identification

| Rule Engine Value      | Uses                          |
| ---------------------- | ----------------------------- |
| `AdvancedConfigurator` | Constraint Rules Engine (CML) |
| `StandardConfigurator` | Business Rules Engine (BRE)   |

### Step 3: Create ConstraintEngineNodeStatus Field

**Required field** for CRE to function. Create on each object:

| Object              | Field Name                    | API Name                             | Type           | Length |
| ------------------- | ----------------------------- | ------------------------------------ | -------------- | ------ |
| Quote Line Item     | Constraint Engine Node Status | `ConstraintEngineNodeStatus__c`      | Long Text Area | 5000   |
| Order Item          | Constraint Engine Node Status | `ConstraintEngineNodeStatus__c`      | Long Text Area | 5000   |
| Asset Action Source | Constraint Engine Node Status | `AssetConstraintEngineNodeStatus__c` | Long Text Area | 5000   |

**Field setup**:

1. Object Manager → Select object → Fields & Relationships → New
2. Type: Text Area (Long), Length: 5000
3. Set field-level security for CRE profiles
4. Field auto-populated by constraint engine at runtime

### Step 4: Configure Context Definitions

Context definitions map transaction data to constraint models.

**Standard Contexts**:

- `SalesTransactionContext` — Quotes/orders
- `InsuranceContext` — Insurance products
- `AssetContext` — Asset-based config (Summer '25+)

#### Update SalesTransactionContext

1. Setup → Context Service → **Context Definitions** → Find
   `SalesTransactionContext`
2. **Attributes tab**: Add `ConstraintEngineNodeStatus` attribute
    - Type: `INPUTOUTPUT`
    - Data Type: `STRING`
    - Node: `SalesTransactionItem`
3. **Map Data tab**: Map attribute to field
    - `QuoteEntitiesMapping`: Map to
      `QuoteLineItem.ConstraintEngineNodeStatus__c`
    - `OrderEntitiesMapping`: Map to `OrderItem.ConstraintEngineNodeStatus__c`
4. **Activate** the context definition

**Optional TransactionType mapping** (to switch engines per transaction):

- Map `TransactionType` attribute on `SalesTransaction` node to
  `Quote.TransactionType` / `Order.TransactionType`

#### For Insurance (extend InsuranceContext)

1. Extend `InsuranceContext`
2. Add `ConstraintEngineNodeStatus` to `InsuranceItem` node (INPUTOUTPUT,
   STRING)
3. Map to `QuoteLineItem.ConstraintEngineNodeStatus__c`
4. Activate

#### For Assets (Summer '25+)

1. Extend `AssetContext__stdctx`
2. Setup → Revenue Settings → **Set Up Asset Context for Product Configurator**
   → Select your context
3. Map `AssetConstraintEngineNodeStatus` attribute
4. Edit `AssetToSalesTransactionMapping` → Map to
   `SalesTransactionItem.ConstraintEngineNodeStatus__c`

### Step 5: Assign Permission Sets

| Permission Set                             | Purpose                                              |
| ------------------------------------------ | ---------------------------------------------------- |
| Product Configuration Constraints Designer | Create/manage constraint models                      |
| Product Configurator                       | Configure products at runtime                        |
| Constraint Rules Engine Licenseless        | CRE access to standard objects for table constraints |

### Rule Engine Selection Logic

| CRE Enabled | BRE Enabled | TPT Value            | Engine Used |
| ----------- | ----------- | -------------------- | ----------- |
| Yes         | No          | —                    | CRE         |
| No          | Yes         | StandardConfigurator | BRE         |
| Yes         | Yes         | StandardConfigurator | BRE         |
| Yes         | Yes         | Other/None           | CRE         |

### Impact on Existing Quotes

- Pre-CRE quotes don't run CRE rules unless migrated to CML
- New quotes with Advanced Configurator TPT use CRE automatically
- Quotes with Standard Configurator TPT continue using BRE
- **Best practice**: Migrate existing rules to CML before enabling CRE in
  production

---

## Creating Constraint Models

### Workflow

1. **Create Model**: App Launcher → Constraint Models → New
    - Enter name, API name
    - Specify context definition (e.g., `InsuranceContext`,
      `SalesTransactionContext`)
2. **Select Version**: Constraint models support versioning (one active at a
   time)
3. **Add Products**: Click Add Item → Product → Select items
    - Bundles auto-import product component groups and cardinality from PCM
4. **Define Constraints/Rules**: Select item → Add constraint/rule → Configure
   expressions
5. **Create Associations**: Connect CML types to product records (see
   [Associations](#associations))
6. **Activate**: Save → Activate for production use

### Visual Builder vs CML Editor

- **Bidirectional**: Switch between interfaces; changes sync automatically
- **Visual Builder**: Point-and-click rule definition; constraint names appear
  as comments in CML
- **CML Editor**: Full code access; some features only available here (labeled
  "not editable" in Visual Builder)

---

## Core Syntax

### Global Properties

```c
define MAX_ROOM_SIZE 1000              // Fixed constant
define COLORS ["Red", "Blue", "Green"] // List constant
property maxDouble = 99999999;         // Configurable property

// External variables (from transaction context)
extern int MAX_VALUE = 9999;           // With default
extern decimal(2) threshold = 1.5;

// Mapped external variable
@(contextPath="Order.AccountId")
extern string accountId;

@(contextPath="OrderLineItem.Quantity")
extern int lineItemQuantity;
```

### Types

Represent products, bundles, components, product classes.

```c
type House {
    string address;
    int numberOfRooms = [1..MAX_ROOM];
}

// Inheritance
type Room { decimal(2) area; }
type LivingRoom : Room;
type Bedroom : Room;
type MasterBedroom : Bedroom;

// With annotations
@(displayName="Premium Laptop", group="Electronics", sequence=1)
type Laptop { ... }
```

### Variables

| Type         | Description              | Example                  |
| ------------ | ------------------------ | ------------------------ |
| `int`        | Integer                  | `int qty = [1..10];`     |
| `decimal(n)` | Decimal with n precision | `decimal(2) price;`      |
| `string`     | String                   | `string color = COLORS;` |
| `bool`       | Boolean                  | `bool active;`           |
| `date`       | Date                     | `date orderDate;`        |
| `datetime`   | Date and time            | `datetime timestamp;`    |

**Domains**:

```c
int quantity = [1..10];                // Range
string color = COLORS;                 // List reference
string status = ["Active", "Inactive"];// Inline list
decimal(2) price = [0..1000.00];       // Decimal range
```

**Functions**:

```c
totalArea = rooms.sum(area);           // Sum across relationship
roomCount = rooms.count();             // Count items
minPrice = products.min(price);        // Minimum value
maxSize = components.max(size);        // Maximum value
avgPrice = items.avg(unitPrice);       // Average value
houseArea = parent(totalArea);         // Access parent variable
```

**Calculated & Proxy Variables**:

```c
type Bundle {
    relation products : Product[1..*];
    decimal(2) totalPrice = products.sum(price);     // Calculated
    decimal(2) discount = totalPrice * 0.1;          // Derived
}

type Room {
    decimal(2) houseArea = parent(totalArea);        // Proxy to parent
}
```

### Relationships

```c
relation rooms : Room[1..MAX_ROOM];                  // Basic
relation items : Item[1..*] order (TypeA, TypeB);    // With creation order
```

**Cardinality**: | Syntax | Meaning | |--------|---------| | `[1..5]` | Min 1,
max 5 | | `[0..*]` | Zero to unlimited | | `[1..*]` | At least one, unlimited |

**Importing from PCM**:

- **With Product Component Groups**: Imports full PCM structure, enables
  group-level constraints
- **Without**: Imports relationships only, simpler model

### Constraints

```c
// Basic
constraint(rooms[Bedroom] > 0);
constraint(numberOfRooms == rooms[Room]);
constraint(totalArea > 1000 && totalArea < 5000);

// Implication (if left true, right must be true)
constraint(Display == "1080p" && Size == "15 Inch" -> Processor == "i7-CPU");

// With error message
constraint(rooms[Bedroom] > 0, "At least one bedroom required");

// Abort on first error (prevents backtracking)
@(abort=true)
constraint(price > maxBudget, "Price exceeds maximum budget");
```

**Table Constraints** (valid combinations):

```c
table constraint validConfigurations {
    (Display, Size, Processor)
    ("1080p", "15 Inch", "i7-CPU")
    ("4k", "24 Inch", "i9-CPU")
}
constraint(validConfigurations(Display, Size, Processor));

// With SOQL filter
table constraint activeConfigs {
    SOQL: "SELECT Display__c, Size__c, Processor__c FROM ValidConfig__c WHERE Active__c = true"
    (Display, Size, Processor)
}
```

### Rules

| Rule       | Syntax                                          | Description                    |
| ---------- | ----------------------------------------------- | ------------------------------ |
| Message    | `message(cond, "text", "Info\|Warning\|Error")` | Display message                |
| Preference | `preference(expr)`                              | Suggest preferred value (soft) |
| Require    | `require(condA, condB)`                         | Auto-add when condition met    |
| Exclude    | `exclude(condA, condB)`                         | Prevent combination            |
| Hide       | `hide(cond, target)`                            | Hide element                   |
| Disable    | `disable(cond, target)`                         | Disable element                |
| Action     | `action(cond, action())`                        | Execute action                 |

```c
// Dynamic message with severity
message(totalPrice > 10000, "High-value order - manager approval may be required", "Warning");

// Preference (engine can override)
preference(processor == "i7");

// Auto-add warranty when laptop selected
require(laptop[Laptop] > 0, warranty[Warranty] > 0);

// Prevent incompatible products
exclude(productA[ProductA] > 0, productB[ProductB] > 0);

// Conditional hide/disable (same behavior for attribute values)
hide(optionA[OptionA] > 0, optionB);
disable(totalPrice > 10000, discount);

// Trigger action
action(quantity > 10, applyDiscount(15));
```

### Comments

```c
// Single-line comment
/* Block comment */
```

---

## Complete Example

```c
define COLORS ["Red", "Blue", "White"]
define MAX_ROOM 10
define MAX_ROOM_SIZE 100

type House {
    string address;
    int numberOfRooms = [1..MAX_ROOM];
    decimal(2) totalArea = rooms.sum(area);

    relation rooms : Room[1..MAX_ROOM] order (LivingRoom, Bedroom);

    constraint(rooms[Bedroom] > 0);
    constraint(numberOfRooms == rooms[Room]);
    message(totalArea > 5000, "This is a spacious house!");
}

type Room {
    decimal(2) width = [1..MAX_ROOM_SIZE];
    decimal(2) length = [1..MAX_ROOM_SIZE];
    decimal(2) area = width * length;
    string color = COLORS;
    decimal(2) houseArea = parent(totalArea);
}

type LivingRoom : Room;
type Bedroom : Room;
type MasterBedroom : Bedroom;
```

---

## Associations

Connect CML types to product catalog records.

### Type Associations

Connect type to product, classification, or component group:

1. Select Object Category (Product/Product Classification/Product Component
   Group)
2. Select specific record to connect
3. Association table displays type ID and product record ID

### Relationship Associations

Connect relationship to bundle components:

1. Select Type Relationship (relationship defined in CML)
2. Select Bundle from catalog
3. Select Product or Classification from bundle

---

## Performance & Optimization

### Understanding Backtracking

Backtracking occurs when the constraint engine makes a choice leading to
conflict, then backs up to try another. High backtracking (>1000) indicates:

- Conflicting constraints
- Poor sequence ordering
- Overly restrictive domains
- Complex interdependencies

### Optimization Techniques

#### 1. Narrow Domains

```c
// Bad: Large domain with constraining constraint
int RAM = [0..1000];
constraint(RAM >= 8 && RAM <= 64);

// Good: Domain already narrowed
int RAM = [8..64];
```

#### 2. Use Sequence Annotations

```c
type Desktop {
    @(defaultValue="1080p", sequence=1)
    string Display = ["1080p", "4k"];         // Resolve first (independent)

    @(defaultValue="i5-CPU", sequence=2)
    string Processor = ["i5-CPU", "i7-CPU"];  // Resolve second (depends on Display)

    @(defaultValue="15 Inch", sequence=3)
    string Size = ["15 Inch", "24 Inch"];     // Resolve last (most constrained)
}
```

**Strategy**: Independent variables first (low sequence) → Dependent variables
next → Most constrained last.

#### 3. Separate Complex Constraints

```c
// Bad: Complex nested
constraint(A && (B || C) && D && (E || F));

// Good: Separated
constraint(A);
constraint(B || C);
constraint(D);
constraint(E || F);
```

#### 4. Optimize Relationships

```c
// Bad: Many separate relationships
relation mouse : Mouse[0..1];
relation keyboard : Keyboard[0..1];

// Good: Combined relationship
relation accessories : Accessory[0..*];
```

#### 5. Optimize Table Constraints

| Size      | Performance           | Action                                      |
| --------- | --------------------- | ------------------------------------------- |
| <100 rows | Fast                  | OK                                          |
| 100-1000  | Acceptable            | Monitor                                     |
| >1000     | Consider alternatives | Split, filter with SOQL, or use constraints |

```c
// Use SOQL filter to reduce rows
table constraint validConfigs {
    SOQL: "SELECT ... FROM ValidConfig__c WHERE Active__c = true"
    ...
}
```

#### 6. Minimize External Variable Lookups

```c
// Use defaults to avoid unnecessary lookups
extern string customerTier = "Standard";

// Batch related fields in context definition rather than multiple extern calls
```

### Best Practices Summary

| Practice      | Avoid                                 | Prefer                        |
| ------------- | ------------------------------------- | ----------------------------- |
| Domains       | `[0..500]` with `constraint(v > 110)` | `[110..500]`                  |
| Constraints   | `constraint(A, B && B.attr == "X")`   | Separate constraints          |
| Relationships | Multiple separate relations           | Combined relation             |
| Sequence      | No annotations                        | `@(sequence=N)` by dependency |
| Logic         | Complex nested                        | Simple, separated             |
| Tables        | >1000 rows                            | Filtered or split             |
| Externals     | Many lookups                          | Batched, with defaults        |

---

## Debugging & Troubleshooting

### Enable Debug Logging

1. Setup → **Debug Logs** → New
2. Select user/Apex class
3. Set **Apex Code**: FINE
4. Set expiration (1-7 days for testing)

### Log Sections

#### RLM_CONFIGURATOR_BEGIN

Request payload to `ExecuteConstraintsRESTService`:

- `contextProperties`: Context mappings
- `rootLineItems`: Root items with attributes, properties, domains, child items
- `orgId`: Organization ID

**Check**: Required attributes present, domains correct, line item structure
matches model.

#### RLM_CONFIGURATOR_STATS

Execution statistics:

| Metric                           | Target | Meaning                       |
| -------------------------------- | ------ | ----------------------------- |
| `Total Execution Time`           | <100ms | Higher = performance issue    |
| `Number of Backtracks`           | <1000  | Higher = constraint conflicts |
| `Constraints Violation Stats`    | 0      | Most violated constraints     |
| `ChoicePoint Backtracking Stats` | —      | Problematic decision points   |
| `Constraints Execution Stats`    | —      | "Distinct: X Total: Y"        |

#### RLM_CONFIGURATOR_END

Response payload:

- `cfgStatus`: SUCCESS/FAILURE
- `attributes`: Final values after resolution
- `attributeDomains`: Final domains (may be narrowed)
- `ruleActions`: Rules executed
- `lineItems`: Child configurations

### Common Scenarios

| Scenario              | Symptoms                             | Debug Steps                                                                         |
| --------------------- | ------------------------------------ | ----------------------------------------------------------------------------------- |
| Constraint Violations | FAILURE status, high violation count | Check Violation Stats → Review constraint logic → Verify domains allow valid combos |
| Performance Issues    | >100ms time, >1000 backtracks        | Check ChoicePoint Stats → Narrow domains → Simplify constraints → Fix sequences     |
| Unexpected Behavior   | Wrong values, rules not triggering   | Verify model activated → Check associations → Review BEGIN/END payloads             |
| Missing Attributes    | NullPointerException                 | Verify attributes in BEGIN → Check associations → Remove/use unused attributes      |

### Debugging Checklist

- [ ] Debug logging at FINE level
- [ ] Constraint model activated
- [ ] Associations created and correct
- [ ] Context definition activated and mapped
- [ ] Transaction Type uses Advanced Configurator
- [ ] All attributes defined with appropriate domains
- [ ] No conflicting constraints
- [ ] Sequence annotations optimal
- [ ] Performance targets met

---

## Extending CML

### Custom Variables

**Standalone** (intermediate calculations):

```c
type Laptop {
    string Processor;
    int RAM;
    int totalMemory = RAM * 1024;                    // Calculated
    bool isHighEnd = Processor == "i9" || RAM >= 32; // Derived
}
```

**Reference Library Variables**: Apply pre-configured variables from reference
libraries in Constraint Builder.

### External Variables with ContextPath

Map to transaction fields:

```c
// Header fields
@(contextPath="Order.AccountId")
extern string accountId;

@(contextPath="Quote.TotalPrice")
extern decimal(2) quoteTotal;

// Line item fields
@(contextPath="OrderLineItem.Quantity")
extern int lineItemQty;

// Custom fields
@(contextPath="Order.CustomField__c")
extern string customValue = "Default";  // Default if not mapped
```

**Common Mappings**:

| Context Path               | Context Node         | Salesforce Field       |
| -------------------------- | -------------------- | ---------------------- |
| `Order.AccountId`          | SalesTransaction     | Order.AccountId        |
| `OrderLineItem.Quantity`   | SalesTransactionItem | QuoteLineItem.Quantity |
| `Quote.TotalPrice`         | SalesTransaction     | Quote.TotalPrice       |
| `InsuranceItem.PolicyType` | InsuranceItem        | PolicyType\_\_c        |

### Import from Salesforce Objects

Table constraints can reference Salesforce objects for data-driven rules:

1. Create custom object with fields matching table constraint variables
2. Populate with valid combinations
3. Reference in table constraint (SOQL query)

**Benefits**: Separate data from code, business users can update, no deployment
for data changes.

### Import from PCM

When adding bundles to constraint models:

- **Imported**: Product component groups, child products, classifications,
  relationships, cardinality
- **Not imported**: Class attributes (add manually in CML Editor)

**Group-level constraints** (CML Editor only):

```c
constraint(bundle.components[DisplayGroup].count() >= 1);
constraint(bundle.components[DisplayGroup].sum(price) < 500);
```

### Extending Context Definitions

1. Setup → Context Service → Context Definitions
2. Edit/Extend context definition
3. Add attributes to appropriate node (SalesTransaction, SalesTransactionItem)
4. Map Data tab → Map to Salesforce fields
5. Activate

**Example Extension**:

```c
// After adding PolicyType, CoverageLimit to InsuranceContext
type InsuranceProduct {
    @(contextPath="InsuranceItem.PolicyType")
    extern string policyType;

    @(contextPath="InsuranceItem.CoverageLimit")
    extern decimal(2) coverageLimit;

    constraint(policyType == "Comprehensive" -> coverageLimit >= 50000);
}
```

### Advanced Patterns

**Multi-level Context Access**:

```c
@(contextPath="Order.Account.Industry")
extern string accountIndustry;
```

**Conditional External Variables**:

```c
extern bool enableAdvancedRules;
extern string userProfile;

constraint(enableAdvancedRules && userProfile == "Admin" -> complexConstraint());
```

**Cross-Product Context**:

```c
type Bundle {
    extern string customerTier;  // Shared across products
    relation products : Product[1..*];
    constraint(customerTier == "Premium" -> products[PremiumFeature] > 0);
}
```

### Insurance Clause Integration

```c
// Rule key maps to Insurance Clause records
boolean Ex__autoSilver__auto__vehicleUsage = Year > 2020 && Auto_Value > 10000 && Auto_Value < 30000;
```

Clauses support dynamic content with variables replaced at runtime.

---

## Visual Builder Reference

### Rule Types

| Rule Type                    | Purpose                                   |
| ---------------------------- | ----------------------------------------- |
| Basic Logic Constraint       | Enforce conditions on products/attributes |
| Conditional Logic Constraint | If-then constraints                       |
| Dynamic Message Rule         | Show info/warning/error messages          |
| Require Rule                 | Auto-add products/components              |
| Exclude Rule                 | Prevent combinations                      |
| Hide/Disable Rule            | Hide/disable based on conditions          |
| Preference Rule              | Suggest preferred values                  |

### Expression Building

1. **Left-hand element**: Product, bundle, attribute, variable, or transaction
   header
2. **Operator**: `==`, `!=`, `>`, `<`, `>=`, `<=`
3. **Right-hand element**: Another element or static value

### Grouping Logic

Reference expressions by number with `and`, `or`, `xor`:

```
// Valid
(1 and 2) or 3
(1 and ((2 or 3) or (4 and 5)))

// Invalid (ambiguous)
1 and 2 or 3 and 4
```

**Rules**:

- Use only expression numbers, `()`, `and`, `or`, `xor`
- Each expression number used exactly once
- All expressions must be included
- Use `()` for clear precedence

---

## Limitations & Considerations

### Execution Limits

| Limit                  | Value                                  |
| ---------------------- | -------------------------------------- |
| Maximum Execution Time | 10 seconds                             |
| Performance Target     | <100ms, <1000 backtracks, 0 violations |
| Timeout Behavior       | Constraint evaluation fails            |

### Data Type Limitations

- **Datetime**: Not supported as constraint model attributes
- **Numeric**: Must have defined domain (range or values) to avoid errors
- **Unused Attributes**: Cause `NullPointerException`—remove or use in
  constraint

### Naming Restrictions

- **Supported Characters**: Unicode letters, numbers, underscores only
- **No Spaces**: CML variable names cannot include spaces
- **Special Characters**: Will cause errors

### Bundle & Relationship Limitations

- Constraints on child products require entire bundle in model
- Product classes imported but class attributes are not—add manually
- Cannot define group-level constraints in Visual Builder (use CML Editor)
- Duplicate relationship names overwrite association records

### Constraint Evaluation

- Constraints referencing multiple optional child instances fail if any instance
  missing
- Complex constraints with nested filtering and unused variables cause
  performance issues
- Cross-classification references can cause engine to auto-add instances
- User input order affects constraint resolution behavior

### Visual Builder Limitations

- Some CML Editor constraints not editable in Visual Builder (labeled "not
  editable")
- Limitations exist for manually created bundles in CML Editor

---

## Key Notes Summary

| Topic                 | Note                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| Bundle Requirements   | Constraints on child products require entire bundle in model                                                 |
| Compilation Flow      | CML → constraint model → constraint engine → compliant configurations                                        |
| Visual Builder ↔ CML  | Bidirectional; constraint names appear as comments in CML                                                    |
| Availability          | Not available in Government Cloud or EU Operating Zone                                                       |
| Revenue Cloud Mapping | Types = products/bundles/components/classes; Variables = fields/attributes; Relationships = bundle structure |
| Associations Required | Type + relationship associations connect CML to catalog records                                              |
| Permission Sets       | "Product Configuration Constraints Designer" for creating/managing models                                    |
| Context Definitions   | Specify context (e.g., `InsuranceContext`) when creating models for external variable mapping                |
