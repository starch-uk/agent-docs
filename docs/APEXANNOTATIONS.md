# Apex Annotations Reference

> **Version**: 1.0.0

> **Syntax**: `@AnnotationName` or `@AnnotationName(param='value')` — uses
> single quotes (not double)

---

## Lightning/UI

### @AuraEnabled

Exposes method/property to Lightning Components (Aura/LWC).

```apex
@AuraEnabled                                    // Basic
@AuraEnabled(cacheable=true)                    // Cached, no DML
@AuraEnabled(cacheable=true scope='global')     // Global cache (API 55.0+)
@AuraEnabled(continuation=true)                 // Long-running callouts
@AuraEnabled(continuation=true cacheable=true)  // Space separator, not comma
```

| Parameter      | Type    | Default | Description                                 |
| -------------- | ------- | ------- | ------------------------------------------- |
| `cacheable`    | Boolean | `false` | Cached; no DML/future/callouts allowed      |
| `scope`        | String  | —       | `'global'` enables global cache (API 55.0+) |
| `continuation` | Boolean | `false` | Returns Continuation object                 |

**Requirements**: `public static` | **Restrictions**: `cacheable=true` prohibits
DML, `@future`, callouts; API 55.0+ no overloads

```apex
public class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account LIMIT 10];
    }
}
```

### @RemoteAction

Exposes method to JavaScript in Visualforce pages.

```apex
@RemoteAction
public static String processData(String input) { return 'Processed: ' + input; }
```

**Requirements**: `public static` or `global static` | **Restrictions**:
Incompatible with `@AuraEnabled`; class must be VF controller/extension

---

## REST API

### @RestResource

Exposes class as REST endpoint.

```apex
@RestResource(urlMapping='/account/*')
global class AccountRestService {
    @HttpGet
    global static Account getAccount() {
        RestRequest req = RestContext.request;
        String accountId = req.requestURI.substring(req.requestURI.lastIndexOf('/') + 1);
        return [SELECT Id, Name FROM Account WHERE Id = :accountId];
    }

    @HttpPost
    global static Account createAccount(String name) {
        Account acc = new Account(Name = name);
        insert acc;
        return acc;
    }

    @HttpDelete
    global static void deleteAccount() {
        RestRequest req = RestContext.request;
        String accountId = req.requestURI.substring(req.requestURI.lastIndexOf('/') + 1);
        delete [SELECT Id FROM Account WHERE Id = :accountId];
    }
}
```

| Parameter    | Type   | Required | Description                                   |
| ------------ | ------ | -------- | --------------------------------------------- |
| `urlMapping` | String | Yes      | URL path (must start with `/`, max 255 chars) |

**Requirements**: Class must be `global` | **URL rules**: Wildcards `*` allowed;
case-sensitive matching

### HTTP Method Annotations

| Annotation    | HTTP Method | Signature                               |
| ------------- | ----------- | --------------------------------------- |
| `@HttpGet`    | GET         | `global static ReturnType methodName()` |
| `@HttpPost`   | POST        | `global static ReturnType methodName()` |
| `@HttpPut`    | PUT         | `global static ReturnType methodName()` |
| `@HttpPatch`  | PATCH       | `global static ReturnType methodName()` |
| `@HttpDelete` | DELETE      | `global static ReturnType methodName()` |

**Requirements**: `global static`; must be in `@RestResource` class

**Access request body**:

```apex
RestRequest req = RestContext.request;
Map<String, Object> data = (Map<String, Object>) JSON.deserializeUntyped(req.requestBody.toString());
```

---

## Asynchronous Processing

### @Future

Executes method asynchronously in separate thread.

```apex
@Future
@Future(callout=true)
```

| Parameter | Type    | Default | Description               |
| --------- | ------- | ------- | ------------------------- |
| `callout` | Boolean | `false` | Enables external callouts |

**Requirements**: `public static void` | **Param types**: Primitives,
arrays/collections of primitives/IDs only (no sObjects) **Restrictions**:
`callout=true` prohibits DML

```apex
public class AsyncProcessor {
    @Future
    public static void processRecords(Set<Id> recordIds) {
        List<Account> accounts = [SELECT Id FROM Account WHERE Id IN :recordIds];
        // Processing...
    }

    @Future(callout=true)
    public static void makeCallout(String data) {
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.example.com');
        req.setMethod('POST');
        req.setBody(data);
        http.send(req);
    }
}
```

---

## Flow/Process Builder

### @InvocableMethod

Exposes method to Flow, Process Builder, Agentforce, Einstein bots.

```apex
@InvocableMethod(label='Method Label' description='Description' category='Category')
public static List<ReturnType> methodName(List<InputType> inputs) { }
```

| Parameter             | Type    | Description                                    |
| --------------------- | ------- | ---------------------------------------------- |
| `label`               | String  | Display label in UI                            |
| `description`         | String  | Description in UI                              |
| `callout`             | Boolean | Enables external callouts                      |
| `category`            | String  | Category in Flow Builder                       |
| `configurationEditor` | String  | Custom property editor                         |
| `capabilityType`      | String  | Capability integration (`Name://Name`)         |
| `iconName`            | String  | Custom icon (SVG from static resource or SLDS) |

**Requirements**: `public static` or `global static`; outer class only; one per
class **Params**: Single `List` (primitives, sObjects, or `@InvocableVariable`
classes) **Returns**: `void` or `List` **Restrictions**: Incompatible with
`@AuraEnabled`

```apex
public class FlowUtilities {
    @InvocableMethod(label='Update Account Status')
    public static List<String> updateAccountStatus(List<Id> accountIds) {
        List<Account> accounts = [SELECT Id FROM Account WHERE Id IN :accountIds];
        for (Account acc : accounts) { acc.Status__c = 'Active'; }
        update accounts;
        return new List<String>{'Success'};
    }
}
```

### @InvocableVariable

Exposes property as Flow input/output variable.

```apex
@InvocableVariable(label='Label' description='Desc' required=true)
public Type variableName;
```

| Parameter         | Type    | Default | Description                                                |
| ----------------- | ------- | ------- | ---------------------------------------------------------- |
| `label`           | String  | —       | Display label                                              |
| `description`     | String  | —       | Description                                                |
| `required`        | Boolean | `false` | Required input (ignored for outputs)                       |
| `defaultValue`    | String  | —       | Default value (Boolean/Decimal/Double/Integer/Long/String) |
| `placeholderText` | String  | —       | Placeholder text (Double/Integer/String)                   |

**Requirements**: Member variable (not static/local/final); `public` or `global`
**Types**: Primitives (except Object), sObjects, Lists

```apex
public class AccountUpdateRequest {
    @InvocableVariable(label='Account ID' required=true)
    public Id accountId;

    @InvocableVariable(label='New Status')
    public String status;
}

public class FlowUtilities {
    @InvocableMethod
    public static List<Account> updateAccounts(List<AccountUpdateRequest> requests) {
        List<Account> accounts = new List<Account>();
        for (AccountUpdateRequest req : requests) {
            accounts.add(new Account(Id = req.accountId, Status__c = req.status));
        }
        update accounts;
        return accounts;
    }
}
```

---

## Testing

### @IsTest

Marks test class/method. Test code doesn't count against org limits.

```apex
@IsTest
@IsTest(SeeAllData=true)      // Access org data (not recommended)
@IsTest(OnInstall=true)       // Run during package install
@IsTest(IsParallel=true)      // Enable parallel execution
```

| Parameter    | Type    | Default | Description                               |
| ------------ | ------- | ------- | ----------------------------------------- |
| `SeeAllData` | Boolean | `false` | Access org data (avoid; use `@TestSetup`) |
| `OnInstall`  | Boolean | `false` | Run during package installation           |
| `IsParallel` | Boolean | `false` | Allow parallel execution                  |

**Requirements**: Class should be `private`; methods must be `static void`
**Restrictions**: `SeeAllData=true` + `IsParallel=true` incompatible;
`IsParallel=true` prohibits `Test.getStandardPricebookId()`,
`System.schedule()`, `System.enqueueJob()`, `ContentNote` insert,
`User`/`GroupMember` creation

### @TestSetup

Creates shared test data for all test methods.

```apex
@TestSetup
static void setup() {
    insert new Account(Name = 'Test Account');
}
```

**Requirements**: `static void`; one per class **Restrictions**: Incompatible
with `@IsTest(SeeAllData=true)`; API 24.0+

### @TestVisible

Makes private/protected members accessible to tests.

```apex
public class MyService {
    @TestVisible
    private static String helperMethod(String input) {
        return input.toUpperCase();
    }
}

@IsTest
private class MyServiceTest {
    @IsTest
    static void testHelper() {
        System.assertEquals('TEST', MyService.helperMethod('test'));
    }
}
```

---

## Utility

### @Deprecated

Marks code as deprecated (managed packages only).

```apex
@Deprecated
public static void oldMethod() { }
```

**Restrictions**: Managed packages only; cannot deprecate `webservice`,
individual enum values, interface methods, abstract methods; cannot undeprecate
after release

### @SuppressWarnings

Suppresses compiler/PMD warnings.

```apex
@SuppressWarnings('PMD.UnusedLocalVariable')
@SuppressWarnings('PMD.UnusedLocalVariable, PMD.UnusedPrivateMethod')  // Multiple
@SuppressWarnings('PMD')  // All PMD warnings
```

### @ReadOnly

Enables read-only mode; increases query limit to 1M rows.

```apex
@ReadOnly
public static List<Account> generateReport() {
    return [SELECT Id, Name FROM Account];  // Up to 1M rows
}
```

**Restrictions**: No DML, no `System.schedule()`, no async jobs; top-level must
be web service or scheduled execution

### @JsonAccess

Controls JSON serialization/deserialization access.

```apex
@JsonAccess(serializable='always' deserializable='always')
public class MyClass { }
```

| Parameter        | Values                                                    | Description             |
| ---------------- | --------------------------------------------------------- | ----------------------- |
| `serializable`   | `'always'`, `'never'`, `'sameNamespace'`, `'samePackage'` | Serialization control   |
| `deserializable` | `'always'`, `'never'`, `'sameNamespace'`, `'samePackage'` | Deserialization control |

**Defaults**: API 48.0-: `deserializable='always'`,
`serializable='sameNamespace'` | API 49.0+: Both `'sameNamespace'`

### @NamespaceAccessible

Grants cross-namespace access in 2GP packages.

```apex
@NamespaceAccessible
public class CrossNamespaceClass { }
```

**Usage**: 2GP managed packages only; `global` is always accessible (no
annotation needed) **Restrictions**: API 47.0+ incompatible with `@AuraEnabled`;
API 50.0+ requires outer class also annotated

---

## Compatibility Matrix

| Status         | Combinations                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| ✓ Compatible   | `@AuraEnabled` + `@Deprecated`, `@IsTest` + `@TestSetup`, `@TestVisible` + access modifiers                                                      |
| ✗ Incompatible | `@AuraEnabled` + `@InvocableMethod`, `@AuraEnabled` + `@RemoteAction`, `@Future` + `@AuraEnabled(cacheable=true)`, `@Future(callout=true)` + DML |

---

## PMD AST

```xpath
//Method[Annotation[@Name='Future']]
//Class[Annotation[@Name='IsTest']]
//Annotation[@Name='AuraEnabled']
```

```
Annotation {
    @Name: Identifier (e.g., "Future", "AuraEnabled")
    parameters: List<AnnotationParameter>
}
```

---

## Common Patterns

### Lightning Component

```apex
@AuraEnabled(cacheable=true)
public static List<Account> getAccounts() {
    return [SELECT Id, Name FROM Account LIMIT 10];
}
```

### REST API

```apex
@RestResource(urlMapping='/account/*')
global class AccountRestService {
    @HttpGet
    global static Account getAccount() {
        RestRequest req = RestContext.request;
        String id = req.requestURI.substring(req.requestURI.lastIndexOf('/') + 1);
        return [SELECT Id, Name FROM Account WHERE Id = :id];
    }
}
```

### Flow Invocable

```apex
@InvocableMethod(label='Update Account')
public static List<String> updateAccount(List<Id> accountIds) {
    List<Account> accs = [SELECT Id FROM Account WHERE Id IN :accountIds];
    for (Account a : accs) { a.Status__c = 'Active'; }
    update accs;
    return new List<String>{'Success'};
}
```

### Test Class

```apex
@IsTest
private class MyServiceTest {
    @TestSetup
    static void setup() {
        insert new Account(Name = 'Test Account');
    }

    @IsTest
    static void testMethod() {
        Account acc = [SELECT Id FROM Account LIMIT 1];
        System.assertNotEquals(null, acc);
    }
}
```

---

## Best Practices

| Practice                     | Description                          |
| ---------------------------- | ------------------------------------ |
| Specify `cacheable`          | Always explicit for `@AuraEnabled`   |
| Avoid `SeeAllData`           | Use `@TestSetup` instead             |
| Prefer Queueable             | Over `@Future` for complex async     |
| Use `@TestVisible` sparingly | Prefer testing public interfaces     |
| Document suppressions        | Comment why `@SuppressWarnings` used |
| Validate REST inputs         | Always sanitize in `@RestResource`   |

---

## Related

- [ApexDoc Reference](APEXDOC.md)
- [PMD Apex AST](PMD.md#apex-ast-reference)
- [Salesforce Apex Annotations](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_classes_annotation.htm)
