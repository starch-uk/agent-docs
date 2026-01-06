# Salesforce Revenue Cloud: Transaction Management

> v1.0.0 | Editions: Enterprise, Unlimited, Developer (Lightning Experience)

## Quick Reference

### Object Flow

```
Opportunity → Quote → Order → Contract → Asset
QuoteLineItem → OrderItem → ContractItemPrice → Asset
Product2 → PricebookEntry → QuoteLineItem/OrderItem
Asset → AssetAction → AssetStatePeriod
```

### Core APIs

| API                          | Purpose                       | Endpoint                                                                                            |
| ---------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------- |
| CalculatePrice               | Pricing calculations          | `POST /actions/custom/CalculatePrice`                                                               |
| CloneSalesTransaction        | Clone transactions            | `POST /connect/rev/sales-transaction/actions/clone`                                                 |
| CreateRampDeal               | Create ramp deal              | `POST /connect/revenue-management/sales-transaction-contexts/{resourceId}/actions/ramp-deal-create` |
| CreateSubscriptionRecords    | Create subscription records   | `POST /actions/custom/CreateSubscriptionRecords`                                                    |
| DeleteRampDeal               | Delete ramp deal              | `POST /connect/revenue-management/sales-transaction-contexts/{resourceId}/actions/ramp-deal-delete` |
| GetInstantPrice              | Real-time pricing             | `POST /industries/cpq/quotes/actions/get-instant-price`                                             |
| GetRenewableAssetsSummary    | Get renewable assets summary  | `POST /actions/custom/GetRenewableAssetsSummary`                                                    |
| PlaceOrder                   | Order operations              | `POST /commerce/sales-orders/actions/place`                                                         |
| PlaceQuote                   | Quote operations              | `POST /commerce/quotes/actions/place`                                                               |
| PlaceSalesTransaction        | Create/update quotes & orders | `POST /actions/custom/PlaceSalesTransaction`                                                        |
| PlaceSupplementalTransaction | Supplemental orders           | `POST /connect/rev/sales-transaction/actions/place-supplemental-transaction`                        |
| PreviewApprovals             | Preview approval chains       | `POST /actions/custom/PreviewApprovals`                                                             |
| ReadSalesTransaction         | Read transaction data         | `POST /connect/revenue/transaction-management/sales-transactions/actions/read`                      |
| SubmitOrder                  | Submit for fulfillment        | `POST /actions/custom/SubmitOrder`                                                                  |
| UpdateRampDeal               | Update ramp deal              | `POST /connect/revenue-management/sales-transaction-contexts/{resourceId}/actions/ramp-deal-update` |
| ViewRampDeal                 | View ramp deal                | `GET /connect/revenue-management/sales-transaction-contexts/{resourceId}/actions/ramp-deal-view`    |

---

## Connect API Resources

| Resource                       | Method | Description                                                             |
| ------------------------------ | ------ | ----------------------------------------------------------------------- |
| Asset Amendment                | POST   | Initiate and execute the amendment of a quote or an order               |
| Asset Cancellation             | POST   | Initiate and execute the cancellation of an asset                       |
| Asset Renewal                  | POST   | Initiate and execute the renewal of an asset                            |
| Clone Sales Transaction        | POST   | Clone quote/order line item with related records and configurations     |
| Create Ramp Deal               | POST   | Create multi-segment pricing deal with different attributes per segment |
| Delete Ramp Deal               | POST   | Delete ramp deal, converting ramped product to single line item         |
| Instant Pricing                | POST   | Fetch instant pricing data, create or update context                    |
| Place Order                    | POST   | Place orders with integrated pricing, configuration, and validation     |
| Place Quote                    | POST   | Create quote to discover and price products/services                    |
| Place Sales Transaction        | POST   | Create sales transaction with integrated pricing and configuration      |
| Place Supplemental Transaction | POST   | Create supplemental/change orders after submission                      |
| Preview Approval               | POST   | Preview approval levels, chains, approvers, and conditions              |
| Read Sales Transaction         | POST   | Retrieve sales transaction data from initialized/hydrated context       |
| Update Ramp Deal               | POST   | Modify ramp deal segments (quantity, discount, dates)                   |
| View Ramp Deal                 | GET    | View ramp deal related to quote/order line item                         |

---

## Apex Namespaces

### Namespace Summary

| Namespace        | Purpose                                 | Key Use Cases                                           |
| ---------------- | --------------------------------------- | ------------------------------------------------------- |
| `CommerceOrders` | Order management (Deprecated API 63.0+) | Use RevSalesTrxn instead                                |
| `CommerceTax`    | Tax calculations                        | External tax engine integration                         |
| `ConnectApi`     | Asset operations                        | Transfer assets between accounts                        |
| `Functions`      | Heavy processing                        | Offload complex calculations                            |
| `Invocable`      | Flow integration                        | Call invocable actions from Apex                        |
| `Messaging`      | Notifications                           | Send email notifications                                |
| `Metadata`       | Configuration                           | Read/manage custom metadata types                       |
| `PlaceQuote`     | Quote creation (Deprecated API 63.0+)   | Use RevSalesTrxn instead                                |
| `Process`        | Flow data exchange                      | Pass data between Apex and Flow                         |
| `RevSalesTrxn`   | Core transaction ops                    | Create/update quotes & orders, pricing, asset lifecycle |

### RevSalesTrxn (Primary)

Create sales transactions (quote/order) with integrated pricing and
configuration.

**Core Classes:**

- `CalculatePriceRequest` / `CalculatePriceResponse`
- `Error` — Error details structure
- `GetRenewableAssetsSummaryRequest` / `GetRenewableAssetsSummaryResponse`
- `InitiateAmendmentRequest` / `InitiateAmendmentResponse`
- `InitiateCancellationRequest` / `InitiateCancellationResponse`
- `InitiateRenewalRequest` / `InitiateRenewalResponse`
- `PlaceSalesTransactionRequest` / `PlaceSalesTransactionResponse`
- `PricingResult` — Pricing calculation result structure
- `ReadSalesTransactionRequest` / `ReadSalesTransactionResponse`
- `SubmitOrderRequest` / `SubmitOrderResponse`
- `TransactionException` — Custom exception class

**Additional Classes:**

| Class                            | Purpose                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| `ConfigurationOptionsInput`      | Configuration options for product configurator input                                             |
| `GraphRequest`                   | Graph ID and records list for ingestion                                                          |
| `PlaceSalesTransactionException` | Exception details for place sales transaction                                                    |
| `PlaceSalesTransactionExecutor`  | Execute place sales transaction with graph request, pricing, config                              |
| `PlaceSalesTransactionResponse`  | Response with contextDetails, errorResponse, isSuccess, salesTransactionId, statusUrl, trackerId |
| `RecordResource`                 | Create record object from sales transaction field values                                         |
| `RecordWithReferenceRequest`     | Associate record object with reference identifier                                                |

**ConfigurationOptionsInput Properties:** | Property | Type | Description |
|----------|------|-------------| | `addDefaultConfiguration` | Boolean |
Auto-add default configuration (bundle/product attributes) | |
`executeConfigurationRules` | Boolean | Require adherence to configuration rules
| | `validateAmendRenewCancel` | Boolean | Run amend/renew/cancel validations |
| `validateProductCatalog` | Boolean | Validate against product catalog |

**PlaceSalesTransactionExecutor.execute() Parameters:**

- `graphRequest` (GraphRequest) — sObject graph values of order payload
- `pricingPreferenceEnum` (PricingPreferenceEnum) — Pricing preference
- `configurationExecutionEnum` (ConfigurationExecutionEnum) — Configuration
  method
- `configuratorOptions` (ConfigurationOptionsInput) — Configuration options
- `id` (String) — ID to assign to sales transaction
- `catalogRatesPreferenceEnum` (CatalogRatesPreferenceEnum) — Rate card entries
  preference (optional)

**Enums:** | Enum | Values | Description | |------|--------|-------------| |
`CatalogRatesPreferenceEnum` | `Fetch`, `Skip` | Rate card entries for
usage-based selling | | `ConfigurationExecutionEnum` | `RunAndAllowErrors`,
`RunAndBlockErrors`, `Skip` | Configuration execution mode | |
`PricingPreferenceEnum` | `Force`, `Skip`, `System` | Pricing preference during
transaction |

### CommerceTax

Manages communication between Salesforce and external tax engines.

**Classes:** | Class | Purpose | |-------|---------| | `AddressesResponse` |
Ship To, Ship From, Sold To address responses | | `AmountDetailsResponse` | Tax
amount, total with tax, exempt amount | | `CustomTaxAttributesResponse` |
Additional custom tax attributes | | `DocumentCodeRequest` | Document code for
tax calculation | | `ExemptDetailsResponse` | Exemption ID, number, reason | |
`ImpositionResponse` | Tax imposition details (id, name, type, subType) | |
`JurisdictionResponse` | Tax jurisdiction (country, region, state, level) | |
`LineItemResponse` | Line item tax calculation results | |
`LineTaxAddressesRequest` | Per-line-item addresses for tax calculation | |
`RuleDetailsResponse` | Tax rules used (nonTaxableRuleId, rateRuleId,
rateSourceId) | | `TaxAddressesRequest` | Ship From/To, Sold To, Bill To
addresses | | `TaxAddressRequest` | Address details (city, country, state,
postalCode, lat/long) | | `TaxApiException` | Tax calculation exceptions | |
`TaxCustomerDetailsRequest` | Customer details (accountId, code,
exemptionNo/Reason) | | `TaxDetailsResponse` | Tax calculation details per line
| | `TaxEngineRequest` | Tax engine request payload | | `TaxEngineResponse` |
Tax engine response |

**TaxAddressRequest Properties:** `city`, `country`, `countryCode`, `latitude`,
`locationCode`, `longitude`, `postalCode`, `state`, `stateCode`, `street`

### PlaceQuote (Deprecated API 63.0+)

**Note:** Use RevSalesTrxn instead for API 63.0+.

**Classes:**

- `GraphRequest` — Graph ID and records for quote ingestion
- `PlaceQuoteRLMApexProcessor` — Execute Place Quote Apex API
- `PlaceQuoteResponse` — Response with contextDetails, errorResponse, isSuccess,
  quoteId
- `RecordResource` — Create record from quote field values
- `RecordWithReferenceRequest` — Associate record with reference ID

**Enums:** | Enum | Values | |------|--------| | `CatalogRatesPreferenceEnum` |
`Fetch`, `Skip` | | `ConfigurationInputEnum` | `RunAndAllowErrors`,
`RunAndBlockErrors`, `Skip` | | `PricingPreferenceEnum` | `Force`, `Skip`,
`System` |

---

## Objects Reference

### Standard Objects (Referenced)

- **Account** — Customer account (Lookup from Quote, Order, Contract, Asset)
- **Opportunity** — Sales opportunity (Lookup from Quote, Order)
- **Pricebook2** — Price book (Lookup from Quote, Order)
- **PricebookEntry** — Product price in price book (Lookup from QuoteLineItem,
  OrderItem)
- **Product2** — Product catalog (Lookup from QuoteLineItem, OrderItem)

### Asset Objects

| Object                     | Description                    | API Ver |
| -------------------------- | ------------------------------ | ------- |
| `Asset`                    | Delivered product/service      | -       |
| `AssetAction`              | Changes (amend, renew, cancel) | -       |
| `AssetActionSource`        | Source of asset action         | -       |
| `AssetRateCardEntry`       | Rate card for assets           | v62+    |
| `AssetRelationship`        | Asset hierarchies/bundles      | -       |
| `AssetStatePeriod`         | Asset state over time          | -       |
| `AssetUsageResourceGrant`  | Usage grants                   | v65+    |
| `AssetUsageResourcePolicy` | Usage policies                 | v65+    |

**Key Fields:** `CurrentAmount`, `CurrentMrr`, `CurrentQuantity`,
`LifecycleEndDate`, `LifecycleStartDate`, `PurchaseDate`, `Status`,
`TotalLifecycleAmount`, `UsageEndDate`

**Lifecycle States:** `Draft` → `Purchased` → `Installed` → `Active` →
`Cancelled`/`Expired`

**Action Types:** `Amend`, `Cancel`, `Renew`, `Rollback`, `Transfer`

### Contract Objects

| Object                    | Description                | API Ver |
| ------------------------- | -------------------------- | ------- |
| `Contract`                | Customer agreement         | -       |
| `ContractAction`          | Actions on contracts       | -       |
| `ContractItemPrice`       | Pricing for contract items | -       |
| `ContractPricingSchedule` | Pricing schedules          | -       |

**Key Fields:** `BillingAccount`, `ContractTerm`, `EndDate`, `StartDate`,
`Status`

### Order Objects

| Object                    | Description                        | API Ver |
| ------------------------- | ---------------------------------- | ------- |
| `Order`                   | Confirmed product/service request  | -       |
| `OrderAction`             | Actions on order (submit, cancel)  | -       |
| `OrderItem`               | Individual products in order       | -       |
| `OrderItemAttribute`      | Virtual object for item attributes | v59+    |
| `OrderItemDetail`         | Item breakdown details             | v60+    |
| `OrderItemGroup`          | Groups items for fulfillment       | v61+    |
| `OrderItemRateAdjustment` | Negotiated rate adjustments        | v62+    |
| `OrderItemRateCardEntry`  | Usage rates for order items        | v62+    |
| `OrdItmUsageRsrcPlcy`     | Usage resource policies            | v65+    |
| `OrdItmUseRsrcGrant`      | Usage resource grants              | v65+    |

**Key Fields:** `CalculationStatus`, `EffectiveDate`, `EndDate`,
`FulfillmentStatus`, `IsReductionOrder`, `OrderReferenceNumber`,
`OriginalActionType`, `SalesTransactionTypeId`, `Status`, `TotalAmount`,
`TransactionType`

**Status Values:** `Activated`, `Cancelled`, `Completed`, `Draft`, `In Progress`

**CalculationStatus Values:** `CompletedWithPricing`, `CompletedWithTax`,
`InProgress`, `NotStarted`, `PriceCalculationFailed`, `TaxCalculationFailed`

### Quote Objects

| Object                     | Description                             | API Ver |
| -------------------------- | --------------------------------------- | ------- |
| `Quote`                    | Proposal with products/pricing          | -       |
| `QuoteAction`              | Sales transaction type (renewal, etc.)  | v59+    |
| `QuoteDocument`            | PDF generated from quote                | -       |
| `QuoteLineDetail`          | Pricing/quantity breakdown              | v60+    |
| `QuoteLineGroup`           | Groups line items, stores subtotals     | v61+    |
| `QuoteLineItem`            | Individual products in quote            | -       |
| `QuoteLineItemAttribute`   | Virtual object for line item attributes | v59+    |
| `QuoteLineRateAdjustment`  | Negotiated rate adjustments             | v62+    |
| `QuoteLineRateCardEntry`   | Catalog/negotiated rates for usage      | v62+    |
| `QuotLineItmUsageRsrcPlcy` | Usage resource policies                 | v65+    |
| `QuotLineItmUseRsrcGrant`  | Usage resource grants                   | v65+    |

**Key Fields:** `Discount`, `ListPrice`, `Product2Id`, `Quantity`, `Subtotal`,
`TotalPrice`, `UnitPrice`

**Relationships:**

- `Account` (Lookup) → customer
- `Opportunity` (Lookup) → sales opportunity
- `Order` (Lookup) → converted order
- `QuoteDocument` (Master-Detail) → PDF docs
- `QuoteLineGroup` (Master-Detail) → grouped items
- `QuoteLineItem` (Master-Detail) → products

---

## Input/Output Structures

### Input Structures Summary

| Structure                      | Description                                          |
| ------------------------------ | ---------------------------------------------------- |
| Amendment Input                | Request to create amendment record                   |
| Cancellation Input             | Request to cancel quote/order                        |
| Clone Options Input            | Options for cloning sales transaction                |
| Clone Sales Transaction Input  | Request to clone transaction records                 |
| Configuration Options Input    | Configuration options for request                    |
| Configurator Preference Input  | Configuration preference for place sales transaction |
| Context Input                  | Context associated with sales transaction            |
| Context Node Input             | Context nodes for ramp segments                      |
| Create Ramp Deal Input         | Request to create ramp deal                          |
| Delete Ramp Deal Input         | Request to delete ramp deal                          |
| Execution Settings Input       | Execution settings for ramp deal                     |
| Instant Pricing Input          | Request for instant pricing details                  |
| Object Graph Input             | sObject with graph ID                                |
| Object Input Map               | sObject record in key-value map format               |
| Object with Reference Input    | Records list for insert/update                       |
| Place Order Input              | Request to create/update order                       |
| Place Quote Input              | Request to create/update quote                       |
| Preview Approval Input         | Request to preview approval                          |
| Read Sales Transaction Input   | Filter criteria to read sales transaction            |
| Renewal Input                  | Request to initiate asset renewal                    |
| Sales Transaction Input        | Request to place sales transaction                   |
| Supplemental Transaction Input | Request to create supplemental order                 |
| Update Ramp Deal Input         | Request to update ramp deal                          |

### Detailed Input Structures

#### SalesTransactionInput

```apex
String transactionType;           // Required: NewQuote, NewOrder, UpdateQuote, UpdateOrder, Amendment, Renewal, Cancellation
Map<String, List<Map<String, Object>>> records;  // Required: Object data keyed by API name
String contextId;                 // Optional: Reuse existing context
String pricingProcedureId;        // Optional: Specific pricing procedure
Boolean skipPricingCalculation;   // Optional
Boolean skipTaxCalculation;       // Optional
Map<String, Object> options;      // Optional: Configuration options
```

#### AmendmentInput / CancellationInput / RenewalInput

```apex
// AmendmentInput
List<Id> assetIds;        // Required
Date amendmentDate;       // Required
String amendmentType;     // Optional
Map<String, Object> options;

// CancellationInput
List<Id> assetIds;        // Required
Date cancellationDate;    // Required
String cancellationReason; // Optional
Map<String, Object> options;

// RenewalInput
List<Id> assetIds;        // Required
Date renewalDate;         // Required
Integer renewalTerm;      // Optional: months
Map<String, Object> options;
```

#### CloneSalesTransactionInput

```apex
Id salesTransactionId;              // Required
CloneOptionsInput cloneOptions;     // Optional
Map<String, Object> overrideFields; // Optional
Boolean cloneLineItems;             // Optional
```

#### CreateRampDealInput

```apex
Id resourceId;                    // Required: QuoteLineItem or OrderItem ID
List<RampDealSegment> segments;   // Required

// RampDealSegment
Date startDate;    // Required
Date endDate;      // Required
Decimal discount;  // Optional
Decimal quantity;  // Optional
Decimal unitPrice; // Optional
Map<String, Object> attributes;
```

#### CreateSubscriptionRecordsInput

```apex
Id orderId;                            // Required: Source order
List<Map<String, Object>> subscriptions; // Required: Subscription data
Map<String, Object> options;           // Optional: Configuration options
```

#### GetRenewableAssetsSummaryInput

```apex
Id accountId;                          // Optional: Filter by account
Id contractId;                         // Optional: Filter by contract
Date startDate;                        // Optional: Start date filter
Date endDate;                          // Optional: End date filter
List<String> assetStatuses;            // Optional: Filter by asset status
```

#### PlaceOrderInput

```apex
Id quoteId;                                   // Required
Id accountId;                                 // Optional: Override account
Boolean activateOrder;                        // Optional
Date effectiveDate;                           // Optional
OrderValidationOptions validationOptions;     // Optional
Map<String, Object> orderFields;              // Optional
```

#### PlaceQuoteInput

```apex
Id opportunityId;                // Required
Id pricebookId;                  // Required
PlaceQuoteOptions options;       // Optional
Map<String, Object> quoteFields; // Optional
List<Map<String, Object>> lineItems; // Optional
```

#### PreviewApprovalInput

```apex
Id recordId;                           // Required: Quote or Order ID
String recordType;                     // Required: 'Quote' or 'Order'
Map<String, Object> options;           // Optional: Preview options
```

#### ReadSalesTransactionInput

```apex
Id salesTransactionId;                 // Required
Boolean includeLineItems;              // Optional
Boolean includeRelatedRecords;         // Optional
List<String> fieldsToRetrieve;         // Optional
Map<String, Object> fieldFilters;      // Optional
```

### Response Structures

#### Success Response Structures

| Structure                      | Description                                   |
| ------------------------------ | --------------------------------------------- |
| Amendment                      | Details of amendment record                   |
| Cancellation                   | Details of cancellation record                |
| Clone Sales Transaction        | Result of cloning records                     |
| Instant Pricing                | Instant pricing results                       |
| Object Reference               | sObject with reference ID and potential error |
| Place Order Response           | Create/update order result                    |
| Place Quote                    | Create/update quote result                    |
| Preview Approval               | Preview approval details                      |
| Preview Approval Chain Item    | Approval chain item for specific group        |
| Preview Approval Item          | Specific approval item within chain           |
| Ramp Deal Service              | Created/updated/deleted ramp deal details     |
| Read Sales Transaction         | Sales transaction data                        |
| Read Sales Transaction Records | Map of record types to record lists           |
| Renewal                        | Details of renewal record                     |
| Sales Transaction              | Create sales transaction result               |
| Sales Transaction Context      | Context details for sales transaction         |
| Sales Transaction Record       | Generic sales transaction record              |
| Supplemental Transaction       | Created supplemental order details            |

#### Error Response Structures

| Structure                               | Description                          |
| --------------------------------------- | ------------------------------------ |
| ARC Base Error                          | Amendment/renewal/cancellation error |
| Clone Sales Transaction Error Response  | Clone operation errors               |
| Place Order Error Response              | Place order errors                   |
| Place Quote Error Response              | Place quote errors                   |
| Preview Approval Error                  | Preview approval errors              |
| Ramp Deal Service Error Response        | Ramp deal processing errors          |
| Sales Transaction Error Response        | Place sales transaction errors       |
| Supplemental Transaction Error Response | Supplemental transaction errors      |

#### Response Field Reference

| Structure                           | Key Fields                                               |
| ----------------------------------- | -------------------------------------------------------- |
| `AmendmentResponse`                 | `success`, `assetActionId`, `quoteId`, `errors[]`        |
| `CalculatePriceResponse`            | `success`, `pricingResults[]`, `contextId`, `errors[]`   |
| `CancellationResponse`              | `success`, `assetActionId`, `errors[]`                   |
| `CloneSalesTransactionResponse`     | `success`, `clonedRecords`, `errors[]`                   |
| `CreateSubscriptionRecordsResponse` | `success`, `subscriptionIds[]`, `errors[]`               |
| `GetRenewableAssetsSummaryResponse` | `assets[]`, `summary`, `errors[]`                        |
| `InstantPricingResponse`            | `pricingData`, `contextId`, `errors[]`                   |
| `PlaceOrderResponse`                | `orderId`, `status`, `errors[]`                          |
| `PlaceQuoteResponse`                | `quoteId`, `status`, `errors[]`                          |
| `PreviewApprovalResponse`           | `approvalChains[]`, `approvers[]`, `errors[]`            |
| `RampDealServiceResponse`           | `rampDealId`, `segments[]`, `errors[]`                   |
| `ReadSalesTransactionResponse`      | `records`, `recordTypeMap`, `errors[]`                   |
| `RenewalResponse`                   | `success`, `renewalQuoteId`, `errors[]`                  |
| `SalesTransactionResponse`          | `success`, `salesTransactionId`, `contextId`, `errors[]` |
| `SubmitOrderResponse`               | `orderId`, `status`, `errors[]`                          |
| `SupplementalTransactionResponse`   | `orderId`, `status`, `errors[]`                          |

**Error Structure:**

```apex
String errorCode;
String message;
List<String> fields;
String severity;  // ERROR, WARNING
Map<String, Object> errorDetails;
```

### Error Codes

| Code                  | Description                        | Resolution                                        |
| --------------------- | ---------------------------------- | ------------------------------------------------- |
| `CONFIGURATION_ERROR` | Product/transaction config invalid | Review product rules, transaction processing type |
| `CONTEXT_EXPIRED`     | Context ID expired                 | Create new context                                |
| `DUPLICATE_VALUE`     | Duplicate value in unique field    | Check for existing records                        |
| `INVALID_STATE`       | Object in invalid state            | Check object status, verify workflow state        |
| `LIMIT_ERROR`         | Governor limits exceeded           | Reduce batch size, optimize queries               |
| `LOCK_ERROR`          | Record locked by another process   | Retry with backoff                                |
| `NOT_FOUND`           | Record not found                   | Verify record ID exists                           |
| `PERMISSION_ERROR`    | Insufficient permissions           | Assign required permission sets                   |
| `PRICING_ERROR`       | Pricing calculation failed         | Verify pricing procedure, check product config    |
| `VALIDATION_ERROR`    | Required field missing/invalid     | Check request payload, verify field values        |

---

## Invocable Actions

| Action                                   | Purpose                               | Details                                                              |
| ---------------------------------------- | ------------------------------------- | -------------------------------------------------------------------- |
| `CalculatePriceAction`                   | Invoke pricing procedures             | Calculate prices for quotes/orders                                   |
| `CancelApprovalSubmissionAction`         | Cancel approval submission            | Cancels submission and uncompleted child work items                  |
| `CreateContractAction`                   | Create contract from quote            | Create contract from specific quote record                           |
| `CreateOrderFromQuoteAction`             | Convert quote → order                 | Create order from quote record                                       |
| `CreateOrderFromQuoteWithOptionsAction`  | Quote → order with config             | Create order with additional configuration options                   |
| `CreateOrdersFromQuoteAction`            | Quote → multiple orders               | Create multiple orders from single quote                             |
| `CreateOrUpdateAssetFromOrderAction`     | Create/update assets from order       | Create asset per order item; modify for change orders                |
| `CreateOrUpdateAssetFromOrderItemAction` | Create/update assets from order items | Track assets at line item lifecycle stage                            |
| `CreateServiceDocumentActions`           | Create service documents              | Create from work orders, work order line items, service appointments |
| `GetRenewableAssetsSummaryAction`        | Get renewable asset details           | Retrieve details for renewal opportunities                           |
| `InitiateAmendmentAction`                | Start asset amendment                 | Initiate and execute asset amendment                                 |
| `InitiateCancellationAction`             | Start asset cancellation              | Initiate and execute asset cancellation                              |
| `InitiateRenewalAction`                  | Start asset renewal                   | Initiate and execute asset renewal                                   |
| `InitiateRollbackOnLastActionAction`     | Rollback last asset action            | Reverse last action to rectify errors                                |
| `InitiateTransferAction`                 | Transfer assets between accounts      | Transfer assets from one account to another                          |
| `OverrideApprovalWorkItemAction`         | Override approval work item           | Update status with admin decision and comments                       |
| `ReassignApprovalWorkItemAction`         | Reassign approval work item           | Reassign uncompleted work item with comments                         |
| `RecallApprovalSubmissionAction`         | Recall approval submission            | Recall uncompleted submission with comments                          |
| `ReviewApprovalWorkItemAction`           | Review approval work item             | Update status with reviewer decision and comments                    |
| `ValidateOrderAction`                    | Validate order before activation      | Validate order before activation                                     |
| `ValidateQuoteAction`                    | Validate quote before conversion      | Validate quote before conversion                                     |

---

## Platform Events

| Event                          | Trigger                   | Key Fields                                                         | API Ver |
| ------------------------------ | ------------------------- | ------------------------------------------------------------------ | ------- |
| `AssetActionCompletedEvent`    | Asset action complete     | `AssetId`, `ActionType`, `Status`                                  | -       |
| `CalculatePriceCompletedEvent` | Pricing complete          | `TransactionId`, `Status`, `ErrorDetails`                          | -       |
| `CreateAssetOrderDtlEvent`     | Asset creation detail     | `AssetId`, `OrderItemId`, `IsSuccess`, `ErrorCode`, `ErrorMessage` | v55.0+  |
| `CreateAssetOrderEvent`        | Asset creation from order | `OrderId`, `AssetIds[]`, `Status`                                  | -       |
| `PlaceOrderCompletedEvent`     | Order created/updated     | `OrderId`, `Status`, `ErrorCode`, `ErrorMessage`                   | -       |
| `PlaceQuoteCompletedEvent`     | Quote created/updated     | `QuoteId`, `Status`, `ErrorCode`, `ErrorMessage`                   | -       |
| `QuoteSaveEvent`               | Quote save complete       | `QuoteId`, `Status`, `ErrorCode`                                   | -       |
| `QuoteToOrderCompletedEvent`   | Quote→Order conversion    | `OrderId`, `QuoteId`, `Status`                                     | -       |
| `SubmitOrderCompletedEvent`    | Order submitted           | `OrderId`, `SubmissionStatus`, `ErrorDetails`                      | -       |

### CreateAssetOrderDtlEvent Details

Contains information about asset create/update from
`/actions/standard/createOrUpdateAssetFromOrder`.

**Important:** Included in `CreateAssetOrderEvent` message; cannot subscribe
directly.

**Fields:** | Field | Type | Description | |-------|------|-------------| |
`AssetId` | Reference | Created/updated asset ID (nillable) | | `ErrorCode` |
String | Error type reference code (nillable) | | `ErrorMessage` | String |
Error information (nillable) | | `EventUuid` | String | Platform event message
UUID (nillable) | | `IsSuccess` | Boolean | Request success status (default:
false, v61.0+) | | `OrderItemId` | Reference | Order item ID used in request
(v61.0+) | | `ReplayId` | String | Event stream position (nillable) |

**Supported Subscribers:** Apex Triggers, Flows, Processes, Pub/Sub API,
Streaming API (CometD)

**Channel:** `/event/CreateAssetOrderDtlEvent`

**Trigger Example:**

```apex
trigger OrderCompletedHandler on PlaceOrderCompletedEvent__e (after insert) {
    for (PlaceOrderCompletedEvent__e evt : Trigger.New) {
        if (evt.Status__c == 'SUCCESS') { /* Handle success */ }
        else if (evt.ErrorCode__c != null) { /* Log error */ }
    }
}
```

---

## Flow Metadata API

### Flow Types

| FlowType                   | Purpose                          |
| -------------------------- | -------------------------------- |
| `Pricing`                  | Custom pricing logic             |
| `ProductConfiguration`     | Product configuration rules      |
| `TransactionOrchestration` | Multi-step transaction workflows |

### Flow Trigger Types

| Trigger                    | Description              |
| -------------------------- | ------------------------ |
| `PricingAfterCalculation`  | After price calculation  |
| `PricingBeforeCalculation` | Before price calculation |
| `TransactionAfterSave`     | After quote/order save   |
| `TransactionBeforeSave`    | Before quote/order save  |

---

## Setup & Configuration

### Prerequisites

- Enterprise/Unlimited/Developer Edition
- Lightning Experience enabled
- Revenue Cloud or Subscription Management license
- System Administrator or Customize Application permission

### Enable Transaction Management

1. Setup → Quick Find → "Revenue Settings"
2. Enable Transaction Management
3. Configure Transaction Processing Type via Tooling API
4. Set default processing type in Revenue Settings

### Permission Sets

| Permission Set             | Access                        |
| -------------------------- | ----------------------------- |
| Amend Assets               | Asset amendments              |
| Cancel Assets              | Asset cancellations           |
| CreateContract API         | Contract creation             |
| Customize Application      | Feature configuration         |
| Renew Assets               | Asset renewals                |
| Sales Rep Permission Group | Create/manage quotes & orders |

### Transaction Processing Type (Tooling API)

```json
// POST /tooling/sobjects/TransactionProcessingType/
{
	"DeveloperName": "StandardProcessing",
	"MasterLabel": "Standard Processing",
	"IsActive": true,
	"SkipPricingCalculation": false,
	"SkipTaxCalculation": false,
	"UseAdvancedConfigurator": true
}
```

---

## Integration Patterns

### Flow Diagrams

```
E-commerce:  Storefront → REST API → PlaceSalesTransaction → Order → Platform Events → Fulfillment
ERP Sync:    ERP ↔ REST API ↔ PlaceSalesTransaction/ReadSalesTransaction (Scheduled Apex | Platform Events)
CPQ:         CPQ → PlaceQuote → CalculatePrice → PlaceSalesTransaction (Order)
Tax Engine:  Transaction Management → CommerceTax namespace → External Tax Engine
Ramp Deal:   Quote/Order → CreateRampDeal → UpdateRampDeal → ViewRampDeal → DeleteRampDeal
```

### Idempotency Pattern

```apex
public static RevSalesTrxn.PlaceSalesTransactionResponse placeTransactionWithIdempotency(
    RevSalesTrxn.PlaceSalesTransactionRequest req, String externalId) {
    List<Quote> existing = [SELECT Id FROM Quote WHERE ExternalId__c = :externalId LIMIT 1];
    if (!existing.isEmpty()) {
        RevSalesTrxn.PlaceSalesTransactionResponse resp = new RevSalesTrxn.PlaceSalesTransactionResponse();
        resp.success = true;
        resp.salesTransactionId = existing[0].Id;
        return resp;
    }
    return RevSalesTrxn.placeSalesTransaction(req);
}
```

### Circuit Breaker Pattern

```apex
public class CircuitBreaker {
    private static Map<String, CircuitState> states = new Map<String, CircuitState>();
    private static final Integer FAILURE_THRESHOLD = 5;
    private static final Integer TIMEOUT_SECONDS = 60;

    public static Boolean isOpen(String serviceName) {
        CircuitState state = states.get(serviceName);
        if (state == null) { state = new CircuitState(); states.put(serviceName, state); }
        if (state.status == 'OPEN' && DateTime.now().getTime() - state.lastFailureTime > TIMEOUT_SECONDS * 1000) {
            state.status = 'HALF_OPEN'; state.failureCount = 0;
        }
        return state.status == 'OPEN';
    }

    public static void recordSuccess(String serviceName) {
        CircuitState state = states.get(serviceName);
        if (state != null) { state.status = 'CLOSED'; state.failureCount = 0; }
    }

    public static void recordFailure(String serviceName) {
        CircuitState state = states.get(serviceName);
        if (state == null) { state = new CircuitState(); states.put(serviceName, state); }
        state.failureCount++;
        state.lastFailureTime = DateTime.now().getTime();
        if (state.failureCount >= FAILURE_THRESHOLD) state.status = 'OPEN';
    }

    private class CircuitState { String status = 'CLOSED'; Integer failureCount = 0; Long lastFailureTime = 0; }
}
```

### Best Practices

1. Handle partial failures in bulk operations
2. Implement idempotency for duplicate request handling
3. Implement proper error logging and alerting
4. Implement retry logic with exponential backoff
5. Monitor API usage and governor limits
6. Test in sandbox before production
7. Use bulk operations where possible
8. Use context IDs to maintain transaction state
9. Use OAuth for secure API authentication
10. Use Platform Events for decoupled real-time communication
11. Use standard APIs over custom integrations
12. Validate input data before API calls

---

## Common Patterns

### Create Quote with Line Items

```apex
RevSalesTrxn.PlaceSalesTransactionRequest req = new RevSalesTrxn.PlaceSalesTransactionRequest();
req.transactionType = 'NewQuote';
req.records = new Map<String, List<Map<String, Object>>>{
    'Quote' => new List<Map<String, Object>>{
        new Map<String, Object>{'OpportunityId' => oppId, 'Pricebook2Id' => pricebookId, 'Name' => 'Quote-001'}
    },
    'QuoteLineItem' => new List<Map<String, Object>>{
        new Map<String, Object>{'Product2Id' => productId, 'Quantity' => 10, 'UnitPrice' => 100.00}
    }
};
RevSalesTrxn.PlaceSalesTransactionResponse resp = RevSalesTrxn.placeSalesTransaction(req);
```

### Convert Quote to Order

```apex
Invocable.Action.CreateOrderFromQuoteAction action = new Invocable.Action.CreateOrderFromQuoteAction();
action.quoteId = quoteId;
action.activateOrder = false;
List<Invocable.Action.Result> results = action.invoke();
```

### Asset Amendment Flow

```apex
// 1. Initiate amendment
RevSalesTrxn.InitiateAmendmentRequest req = new RevSalesTrxn.InitiateAmendmentRequest();
req.assetIds = new List<Id>{assetId};
req.amendmentDate = Date.today();
RevSalesTrxn.InitiateAmendmentResponse resp = RevSalesTrxn.initiateAmendment(req);

// 2. Modify generated quote (resp.quoteId)
// 3. Convert to order via CreateOrderFromQuoteAction
// 4. Asset updated automatically on order activation
```

### Context Reuse

```apex
String contextId = null;
RevSalesTrxn.PlaceSalesTransactionResponse resp1 = RevSalesTrxn.placeSalesTransaction(req1);
contextId = resp1.contextId;

RevSalesTrxn.PlaceSalesTransactionRequest req2 = new RevSalesTrxn.PlaceSalesTransactionRequest();
req2.contextId = contextId;  // Reuse context
RevSalesTrxn.PlaceSalesTransactionResponse resp2 = RevSalesTrxn.placeSalesTransaction(req2);
```

---

## Troubleshooting

| Issue                                  | Cause                          | Solution                               |
| -------------------------------------- | ------------------------------ | -------------------------------------- |
| Asset amendment fails                  | Missing permissions            | Assign "Amend Assets" permission set   |
| `CalculationStatus` stuck `InProgress` | Long-running pricing procedure | Check pricing logs, retry calculation  |
| Context expired                        | Context lifetime exceeded      | Create new context                     |
| Platform event not firing              | Not subscribed                 | Verify trigger/subscription exists     |
| Pricing returns zero                   | Missing price book entry       | Verify PricebookEntry exists           |
| Quote conversion fails                 | Validation rules               | Review validation rules on Quote/Order |

### Debug Checklist

1. Check user permissions (permission sets assigned)
2. Verify object/field accessibility (FLS)
3. Review validation rules
4. Check governor limits (debug logs)
5. Verify API version compatibility
6. Check for record locks
7. Review error details in response

---

## Testing Patterns

### Test Setup

```apex
@IsTest
private class TransactionManagementTest {
    @TestSetup
    static void setup() {
        Account acc = new Account(Name = 'Test Account');
        insert acc;
        Opportunity opp = new Opportunity(Name = 'Test Opp', AccountId = acc.Id, StageName = 'Prospecting', CloseDate = Date.today().addDays(30));
        insert opp;
        Product2 prod = new Product2(Name = 'Test Product', IsActive = true);
        insert prod;
        Pricebook2 pb = [SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1];
        PricebookEntry pbe = new PricebookEntry(Pricebook2Id = pb.Id, Product2Id = prod.Id, UnitPrice = 100.00, IsActive = true);
        insert pbe;
    }
}
```

### Test Best Practices

- Mock external callouts when needed
- Test async operations with proper wait mechanisms
- Test both success and error scenarios
- Test bulk operations (200+ records)
- Test governor limit scenarios
- Use `@TestSetup` for common test data
- Use `Test.startTest()` / `Test.stopTest()` to reset limits
- Verify response structure and field values

---

## Glossary

| Term                        | Definition                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------- |
| Asset                       | Product/service delivered to customer, tracks ownership and lifecycle                   |
| Asset Action                | Change made to lifecycle-managed asset (amend, cancel, renew, transfer)                 |
| Asset State Period          | Time span when asset has same quantity, amount, and MRR                                 |
| Calculation Status          | Status of price and tax calculations for quotes/orders                                  |
| Context                     | Session identifier for reusing transaction state across API calls                       |
| Contract                    | Formal agreement for managing assets, products, and services with pricing schedules     |
| Order                       | Confirmed request for products/services, represents formal agreement                    |
| Order Item Group            | Groups related order items for fulfillment organization                                 |
| Platform Event              | Real-time messaging mechanism for event-driven architectures                            |
| Pricing Procedure           | Set of rules and steps used to calculate prices for products                            |
| Quote                       | Preliminary offer of products/services with pricing, can be revised before conversion   |
| Quote Line Group            | Groups related quote line items with subtotal calculations                              |
| Ramp Deal                   | Multi-segment pricing deal with different attributes per segment over subscription term |
| Supplemental Transaction    | Additional order or change order created after original order submission                |
| Transaction Processing Type | Configuration that defines how quotes/orders are processed                              |

---

## Reference Links

| Resource                        | URL                                                                                                                                                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Apex Reference                  | [Apex Namespaces](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_apex_reference.htm)                                        |
| API Requests                    | [Input Structures](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_api_requests.htm)                                         |
| API Responses                   | [Output Structures](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_api_responses.htm)                                       |
| Asset Data Model                | [ERD](https://developer.salesforce.com/docs/platform/data-models/guide/transaction-management-asset.html)                                                                                                             |
| Business APIs                   | [API Reference](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_business_apis.htm)                                           |
| Contract Data Model             | [ERD](https://developer.salesforce.com/docs/platform/data-models/guide/transaction-management-contract.html)                                                                                                          |
| Fields Reference                | [Standard Object Fields](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_standard_objects.htm) |
| Flow Metadata API               | [Flow Reference](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_flow_metadata_api.htm)                                      |
| Invocable Actions               | [Actions Reference](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_invocable_actions_parent.htm)                            |
| Metadata API Guide              | [Understanding Metadata API](https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_intro.htm)                                                                                                 |
| Metadata API Types              | [Metadata Reference](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_metadata_api_parent.htm)                                |
| Order Data Model                | [ERD](https://developer.salesforce.com/docs/platform/data-models/guide/transaction-mgmt-order.html)                                                                                                                   |
| Platform Events                 | [Events Reference](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_platform_event.htm)                   |
| Quote Data Model                | [ERD](https://developer.salesforce.com/docs/platform/data-models/guide/transaction-management-quote.html)                                                                                                             |
| REST API Reference              | [REST Endpoints](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_business_apis_rest_references.htm)                          |
| Standard Objects                | [Object Reference](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_standard_objects.htm)                 |
| Transaction Management Overview | [Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_overview.htm)                                              |
| TransactionProcessingType       | [Tooling API](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/tooling_api_objects_transactionprocessingtype.htm)                 |
