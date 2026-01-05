# Constraint Modeling Language (CML)

> **Version**: 2.1 (Winter '26) | **Platform**: Salesforce Revenue Cloud Product
> Configurator

DSL for defining constraint models for complex product configuration. Compiles
to constraint model used by constraint engine to construct compliant
configurations.

---

## Core Workflow

1. Define global properties/constants (`define`, `property`, `extern`)
2. Define types (entities/objects)
3. Create variables (properties/characteristics)
4. Define relationships (associations between types)
5. Apply constraints (logical restrictions and rules)

---

## Global Properties

### Constants and Properties

```c
define MAX_ROOM_SIZE 1000                    // Fixed constant
define COLORS ["Red", "Blue", "Green"]       // List constant
property maxDouble = 99999999;               // Configurable property
```

### External Variables

Values from environment (sales transaction fields). Uses default if not mapped.

```c
extern int MAX_VALUE = 9999;
extern decimal(2) threshold = 1.5;
```

Use `@contextPath` annotation to map to sales transaction fields.

---

## Types

Represent entities (products, bundles, components, classes). Similar to OOP
classes.

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
```

### Type Annotations

| Annotation     | Description                     |
| -------------- | ------------------------------- |
| `@displayName` | UI display name                 |
| `@description` | Description text                |
| `@group`       | Organize types into UI groups   |
| `@hide`        | Hide from configurator UI       |
| `@sequence`    | Execution order (lower = first) |

Syntax: `@AnnotationName` or `@(key=value, key2=value2)`

---

## Variables

Define properties/characteristics of types.

### Data Types

| Type         | Description              |
| ------------ | ------------------------ |
| `int`        | Integer                  |
| `decimal(n)` | Decimal with n precision |
| `string`     | String                   |
| `bool`       | Boolean                  |
| `date`       | Date                     |
| `datetime`   | Date and time            |

### Domains

```c
int quantity = [1..10];                    // Range
string color = COLORS;                     // List reference
string status = ["Active", "Inactive"];    // List literal
decimal(2) price = [0..1000.00];          // Decimal range
```

### Functions

| Function   | Description                 |
| ---------- | --------------------------- |
| `sum()`    | Sum of values               |
| `count()`  | Count of items              |
| `min()`    | Minimum value               |
| `max()`    | Maximum value               |
| `avg()`    | Average value               |
| `parent()` | Access parent type variable |

### Variable Annotations

| Annotation      | Description                     |
| --------------- | ------------------------------- |
| `@defaultValue` | Default value                   |
| `@required`     | Required field                  |
| `@hidden`       | Hide from UI                    |
| `@readOnly`     | Read-only field                 |
| `@sequence`     | Execution order (lower = first) |
| `@contextPath`  | Map to sales transaction field  |

Combined: `@(defaultValue="value", sequence=1)`

### Proxy Variables

```c
decimal(2) houseArea = parent(totalArea);  // Reference parent variable
```

---

## Relationships

Define associations between types (product structure in bundles):

```c
relation rooms : Room[1..MAX_ROOM] order (LivingRoom, Bedroom);
```

### Cardinality

| Syntax   | Meaning                 |
| -------- | ----------------------- |
| `[1..5]` | Min 1, max 5            |
| `[0..*]` | Zero to unlimited       |
| `[1..*]` | At least one, unlimited |

**Order**: `order (Type1, Type2)` — creates Type1 instances before Type2.

### Relationship Annotations

`@displayName`, `@required`, `@hidden`, `@sequence`

---

## Constraints

Enforce logical restrictions and business rules. Processed to ensure all
conditions satisfied.

**Note**: User input order affects constraint engine behavior and resolution.

### Operators

| Type        | Operators                                      |
| ----------- | ---------------------------------------------- | --- | ------ |
| Logical     | `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `      |     | `, `!` |
| Implication | `→` or `->` (if left true, right must be true) |

### Basic Constraints

```c
constraint(rooms[Bedroom] > 0);                    // At least one bedroom
constraint(numberOfRooms == rooms[Room]);          // Equality (forces variable creation)
constraint(totalArea > 1000 && totalArea < 5000);  // Logical AND
```

### Implication

```c
constraint(Display == "1080p" && Size == "15 Inch" -> Processor == "i7-CPU");
```

### Table Constraint

```c
table constraint validConfigurations {
    (Display, Size, Processor)
    ("1080p", "15 Inch", "i7-CPU")
    ("4k", "24 Inch", "i9-CPU")
}
constraint(validConfigurations(Display, Size, Processor));
```

Can import from Salesforce objects for dynamic combinations.

### Rule Types

| Rule       | Syntax                            | Description                                                            |
| ---------- | --------------------------------- | ---------------------------------------------------------------------- |
| Message    | `message(condition, "text")`      | Display message when condition met                                     |
| Preference | `preference(expr)`                | Suggest preferred value (engine can override if violated)              |
| Require    | `require(condition, requirement)` | Auto-add product/component                                             |
| Exclude    | `exclude(condA, condB)`           | Prevent combination                                                    |
| Hide       | `hide(condition, target)`         | Hide based on condition (for attribute values, same as disable in CML) |
| Disable    | `disable(condition, target)`      | Disable based on condition (for attribute values, same as hide in CML) |
| Action     | `action(condition, action())`     | Execute action when condition met                                      |

```c
message(totalArea > 5000, "This is a spacious house!");
preference(processor == "i7-CPU");  // Allows override if user input violates
require(laptop[Laptop] > 0, warranty[Warranty] > 0);
exclude(productA[ProductA] > 0, productB[ProductB] > 0);
hide(optionA[OptionA] > 0, optionB);  // For attribute values, hide/disable have same behavior
disable(totalPrice > 10000, discount);
action(quantity > 10, applyDiscount(15));
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

## Comments

```c
// Single-line comment
/* Block comment */
```

---

## Best Practices

### Performance Targets

- Execution time: **<100ms**
- Backtracks: **<1000**
- Violations: **0**

### Optimization Rules

| Practice              | Bad                                      | Good                                             |
| --------------------- | ---------------------------------------- | ------------------------------------------------ |
| Narrow domains        | `[0..500]` with constraint `volts > 110` | `[110..500]`                                     |
| Separate constraints  | `constraint(A, B && B.attr == "X")`      | `constraint(A, B); constraint(B, B.attr == "X")` |
| Combine relationships | `relation mouse; relation keyboard;`     | `relation accessories;`                          |

### Sequence Annotation

```c
type Desktop {
    @(defaultValue = "1080p Built-in Display", sequence=1)
    string Display = ["1080p Built-in Display", "4k Built-in Display"];

    @(defaultValue = "i5-CPU 4.4GHz", sequence=2)
    string Windows_Processor = ["i5-CPU 4.4GHz", "i7-CPU 4.7GHz"];

    @(defaultValue = "15 Inch", sequence=3)
    string Display_Size = ["15 Inch", "24 Inch", "27 Inch"];
}
```

Engine processes in sequence order. Resolves violations by adjusting
higher-sequence values first.

---

## Debugging

Enable Apex debug logging at FINE level. Log sections:

### RLM_CONFIGURATOR_BEGIN

Request payload to `ExecuteConstraintsRESTService`:

- `contextProperties`, `rootLineItems` (attributes, properties, ruleActions,
  attributeDomains, portDomainsToHide, lineItems), `orgId`

### RLM_CONFIGURATOR_STATS

| Metric                           | Target | Description                      |
| -------------------------------- | ------ | -------------------------------- |
| `Total Execution Time`           | <100ms | Total solver time                |
| `Number of Backtracks`           | <1000  | Backtracks for last choice point |
| `Constraints Violation Stats`    | 0      | Top 10 violations                |
| `Constraints Execution Stats`    | —      | "Distinct: X Total: Y"           |
| `ChoicePoint Backtracking Stats` | —      | Top 10 backtracked choice points |

Also includes: `rootId`, `Product`, `Solving goal`,
`Number of Component/Variables/Constraints`

### RLM_CONFIGURATOR_END

Response payload: `id`, `rootId`, `parentId`, `cfgStatus`, `name`, `relation`,
`source`, `qty`, `actionCode`, `modelName`, `productId`, `attributes`,
`properties`, `ruleActions`, `attributeDomains`, `portDomainsToHide`,
`lineItems`

---

## Extending CML

| Capability                     | Description                                              |
| ------------------------------ | -------------------------------------------------------- |
| Import from Salesforce Objects | Table constraints can import data dynamically            |
| Import from PCM                | Import bundle components from Product Catalog Management |
| Product Recommendations        | Display recommendations based on constraint rules        |
| Map External Variables         | Use `@contextPath` to import transaction context         |

---

## Key Notes

- **Bundle Requirements**: Constraints on child products require entire bundle
  in constraint model
- **Compilation**: CML → constraint model → constraint engine → compliant
  configurations
- **Visual Builder Integration**: Constraints defined in Visual Builder generate
  CML code. You can switch between Visual Builder and CML Editor. Constraint
  names from Visual Builder appear as code comments in CML Editor.
- **Availability**: Constraint Rules Engine services aren't available in
  Government Cloud or orgs within the EU Operating Zone (OZ)
- **Revenue Cloud Mapping**:
    - Types = standalone products, bundles, components, product classes
    - Variables = product fields, attributes, context tags
    - Relationships = product structure in bundles
