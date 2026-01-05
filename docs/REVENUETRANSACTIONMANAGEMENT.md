# Transaction Management in Revenue Cloud

**Version:** 1.0.0

## Overview

Transaction Management is a core component of Salesforce Revenue Cloud that streamlines and automates the entire sales process, from quoting to order capture. It empowers sales reps to efficiently create and manage all types of sales—including initial, renewal, and amendment—while simplifying the subscription lifecycle.

**Required Editions:**
- Available in: Lightning Experience
- Available in: Enterprise, Unlimited, and Developer Editions of Revenue Cloud where Transaction Management is enabled

## Key Benefits

### Business Benefits
- **Optimization of revenue operations**: Automates the end-to-end quote-to-cash process
- **Revenue compliance**: Helps ensure revenue compliance and maximizes the potential of every deal
- **Single source of truth**: Creates a single, reliable source of truth for all sales transactions
- **Greater insight and control**: Provides businesses with greater insight and control over their revenue streams

### Operational Benefits
- **Efficient sales cycle**: More efficient sales cycle through automation
- **Improved pricing accuracy**: Ensures accuracy and reduces manual effort
- **Enhanced customer experience**: Better customer experience through streamlined processes
- **Integration**: Integrates with tools for product configuration, pricing, and fulfillment

## Core Features

Transaction Management simplifies subscription lifecycles while ensuring the integrity of all sales transactions. You can tailor the Revenue Cloud experience by using permission sets and setup instructions to give each user precise access to the features they need.

### Main Feature Areas

1. **Quote and Order Management**
   - Create quotes
   - Add products to quotes
   - Convert quotes into orders
   - Manage orders

2. **Contract Management**
   - Create contracts to manage customers' assets, products, and services
   - Manage contract features
   - View and manage contracts and their assets
   - Create contract pricing schedules

3. **Asset Management**
   - Track products and services that customers have purchased
   - Amend assets to meet customers' changing needs
   - Renew assets to provide uninterrupted service
   - Cancel assets that are no longer needed
   - View consolidated list of all lifecycle-managed assets using Managed Asset Viewer
   - View both standalone assets and bundled assets

## Setup and Configuration

### Configure Transaction Management Features
Set up and manage Transaction Management features that are common across all sales transaction records for your business.

### Set Up Quote and Order Features
Set up features that provide your sales reps, partners, and customers with the capabilities required to efficiently manage quotes and orders.

### Set Up Contract Features
Set up features that provide your sales reps and partners with the capabilities to efficiently manage contracts.

### Set Up Asset Management Features
Set up features that provide your sales reps and partners with the capabilities to efficiently manage assets.

## Standard Objects

Transaction Management extends and uses several standard Salesforce objects to manage the quote-to-cash process. These objects form the backbone of transaction management, facilitating the seamless flow from quoting to order fulfillment and asset management.

### Quote Objects

#### Quote
Represents a proposal of products or services to a customer, including pricing and terms. Quotes are preliminary offers that can be revised multiple times before conversion to an order.

**Key Relationships:**
- Related to Opportunity
- Contains Quote Line Items
- Can be converted to Order

#### QuoteLineItem
Details individual products or services within a quote, specifying quantities, prices, and discounts. Each quote line item represents a single product or service being proposed.

**Key Fields:**
- Product reference
- Quantity
- Unit price
- Discount information
- Total price

#### QuoteLineGroup
Stores the group information for line items in a quote. It also stores the aggregated line field information (subtotal). It contains a parent-child relationship to quote. This object is available in API version 61.0 and later.

#### QuoteAction
Indicates the type of sales transaction that's being quoted; for example, a renewal sale. This object is available in API version 59.0 and later.

#### QuoteLineDetail
Represents the breakdown details of a quote line item. Revenue Cloud generates these records to capture pricing and quantity changes, such as negative quantity reductions, early renewals, derived pricing or repricing during an amendment, and bundle or product attribute reconfigurations. This object is available in API version 60.0 and later.

#### QuoteLineItemAttribute
Represents a virtual object that stores an attribute specified for a quote line item. This object is available in API version 59.0 and later.

#### QuoteLineRateAdjustment
Represents the negotiated rate adjustment for a quote line item. This object is available in API version 62.0 and later.

#### QuoteLineRateCardEntry
Represents the catalog and negotiated rates of a usage resource associated with a quote line item that's used to charge overage consumption. This object is available in API version 62.0 and later.

#### QuotLineItmUseRsrcGrant
Represents the negotiated grants for the usage resource that's associated with the usage product added in the quote line item. This object is available in API version 65.0 and later.

#### QuotLineItmUsageRsrcPlcy
Represents the policies that are used for the usage resource that's associated with the usage product added in the quote line item. This object is available in API version 65.0 and later.

#### QuoteDocument
Represents the PDF document generated from a quote. Used for sharing quotes with customers in a formatted document format.

### Order Objects

#### Order
Denotes a confirmed request for products or services, transitioning from the quote stage to fulfillment. Orders represent formal agreements between the business and customer.

**Key Relationships:**
- Related to Account and Opportunity
- Contains Order Items
- Can be linked to Contracts
- Can be submitted for fulfillment

**Transaction Management Extensions:**
- CalculationStatus
- FulfillmentPlanId
- OriginalActionType
- SalesTransactionTypeId
- TransactionType
- ValidationResult

#### OrderItem (Order Product)
Specifies individual products or services within an order, detailing quantities, prices, and fulfillment statuses. Each order item represents a single product or service being ordered.

**Key Fields:**
- Product reference
- Quantity
- Unit price
- Discount information
- Fulfillment status

#### OrderItemGroup
Groups related order items together. Used for organizing line items by shipping location, recipient, start date, or other business criteria.

#### OrderAction
Represents actions that can be performed on an order, such as submit, cancel, or activate. Used for order lifecycle management.

#### OrderItemRelationship
Defines relationships between order items, such as parent-child relationships in bundled products or component relationships.

#### OrderDeliveryMethod
Shows the customizations and options that a buyer selected for their delivery method. This object is available in API version 48.0 and later.

#### OrderItemAttribute
Represents a virtual object that stores an attribute specified for an order item. This object is available in API version 60.0 and later.

#### OrderItemDetail
Represents the breakdown details of an order product. Revenue Cloud generates these records to capture pricing and quantity changes, such as negative quantity reductions, early renewals, derived pricing or repricing during an amendment, and bundle or product attribute reconfigurations. This object is available in API version 60.0 and later.

#### OrderItemRateAdjustment
Represents the negotiated rate adjustment for an order product. This object is available in API version 62.0 and later.

#### OrderItemRateCardEntry
Represents the catalog and negotiated rates of a usage metric associated with an order item that's used to charge overage consumption. This object is available in API version 62.0 and later.

#### OrderItemUsageRsrcGrant
Represents the negotiated grants for the usage resource that's associated with the usage product added in the order item. This object is available in API version 65.0 and later.

#### OrderItemUsageRsrcPlcy
Represents the policies that are used for the usage resource that's associated with the usage product added in the order item. This object is available in API version 65.0 and later.

### Contract Objects

#### Contract
Represents a formal agreement between the business and customer for managing assets, products, and services. Contracts provide the framework for tracking contract pricing schedules and managing the relationship between contracts and assets.

**Key Relationships:**
- Related to Account
- Contains Contract Item Prices
- Linked to Assets via Asset Contract Relationship

#### ContractItemPrice
Defines pricing for items within a contract. Used for contract-based pricing and discount management.

#### ContractItemPriceAdjTier
Defines adjustment tiers for contract item prices, allowing for volume-based or tier-based pricing within contracts. This object is available in API version 63.0 and later.

#### ContractItemPriceHistory
Represents the history of changes to the values in the fields of a ContractItemPrice object. This object is available in API version 61.0 and later.

### Asset Objects

#### Asset
Represents a product or service that has been sold and delivered to a customer. Assets track ownership, lifecycle, and service agreements.

**Key Relationships:**
- Related to Account
- Linked to Contracts via Asset Contract Relationship
- Related to Products
- Can be amended, renewed, or cancelled

#### AssetContractRelationship
Links assets to contracts, establishing the relationship between delivered products/services and their associated contracts. This object is available in API version 60.0 and later.

#### AssetAction
Represents a change made to a lifecycle-managed asset. The fields can't be edited. This object is available in API version 50.0 and later.

#### AssetActionSource
Represents an optional way to record what transactions caused changes to lifecycle-managed assets. Use it to trace financial and other information about asset actions. This object supports Salesforce order products and work order line items, and transaction IDs from other systems. The fields can't be edited. This object is available in API version 50.0 and later.

#### AssetDowntimePeriod
Represents a period during which an asset is not able to perform as expected. Downtime periods include planned activities, such as maintenance, and unplanned events, such as mechanical breakdown. This object is available in API version 49.0 and later.

#### AssetOwnerSharingRule
Represents the rules for sharing an Asset with users other than the owner. This object is available in API version 33.0 and later.

#### AssetRateCardEntry
Stores the negotiated rate card entries that are associated with an asset in Revenue Cloud. This object is available in API version 62.0 and later.

#### AssetRelationship
Represents a non-hierarchical relationship between assets due to an asset modification; for example, a replacement, upgrade, or other circumstance. In Revenue Lifecycle Management, this object represents an asset or assets grouped in a bundle or set. This object is available in API version 41.0 and later.

#### AssetShare
Represents a sharing entry on an Asset. This object is available in API version 33.0 and later.

#### AssetStatePeriod
Represents a time span when an asset has the same quantity, amount, and monthly recurring revenue (MRR). An asset has as many asset state periods as there are changes to it (asset actions) during its lifecycle. The dashboard and related pages show the current asset state period. The fields can't be edited. This object is available in API version 50.0 and later.

#### AssetStatePeriodAttribute
Represents a virtual object that holds the key-value pair of the asset attribute in a specified asset state period. This object is a child object of AssetStatePeriod. This object is available in API version 60.0 and later.

#### AssetTag
Associates a word or short phrase with an Asset.

#### AssetTokenEvent
A platform event for asset token events. Documentation has moved to the Platform Events Developer Guide.

#### AssetWarranty
Defines the warranty terms applicable to an asset along with any exclusions and extensions. This object is available in API version 50.0 and later.

### Transaction Management Objects

#### SalesTransactionType
Defines the type of sales transaction being processed. Used to categorize transactions and apply appropriate business rules.

**Common Types:**
- Initial sale
- Renewal
- Amendment
- Cancellation
- Transfer

#### ObjectStateDefinition
Defines the lifecycle states for orders and other transaction objects. Used for order lifecycle management and state transitions.

#### ObjectStateValue
Represents a specific state within an object state definition. Each state represents a stage in the object's lifecycle.

#### ObjectStateTransition
Defines the valid transitions between states in an object state definition. Controls how objects can move through their lifecycle.

#### ApprovalSubmission
Represents the instance of an approval request that's submitted for a record of the related object. This object is available in API version 62.0 and later.

#### BindingObjUsageRsrcPlcy
Represents the policies that are used for the usage resource that's associated with an asset or a binding object. This object is available in API version 65.0 and later.

### Supporting Objects

#### Account
The customer or company record. All transactions are related to an account.

#### Opportunity
Represents a sales opportunity. Quotes and orders are typically related to opportunities.

#### Product2
The product catalog object. Defines the products and services available for sale.

#### Pricebook
Contains a list of products and their associated prices, allowing for multiple pricing strategies.

#### PricebookEntry
Links products to a price book, specifying the price of a product within that price book.

#### ProductCategory
Organizes products into categories for easier management and discovery.

#### ProductSellingModel
Defines how products are sold (one-time, subscription, usage-based, etc.).

### Data Model References

For detailed information about the relationships and structure of these objects, refer to:

1. **Transaction Management: Quote** - [Quote Data Model](https://developer.salesforce.com/docs/platform/data-models/guide/transaction-management-quote.html)
2. **Transaction Management: Order** - [Order Data Model](https://developer.salesforce.com/docs/platform/data-models/guide/transaction-mgmt-order.html)
3. **Transaction Management: Contract** - [Contract Data Model](https://developer.salesforce.com/docs/platform/data-models/guide/transaction-management-contract.html)
4. **Transaction Management: Asset** - [Asset Data Model](https://developer.salesforce.com/docs/platform/data-models/guide/transaction-management-asset.html)

**Reference**: [Transaction Management Standard Objects](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_standard_objects.htm)

## Quote Management

Quotes are preliminary offers used to propose products or services and their pricing to customers. Typically, sales reps and partners create and revise multiple quotes before a final order is placed.

### Key Quote Features

- **Create Quotes**: Discover and price products for your customers with quotes in Revenue Cloud
- **View and Edit Quotes**: Use the Transaction Line Editor or Sales Transaction Line Editor to add, configure, and price quotes
- **Discover and Configure Products**: Browse catalogs, view product lists, configure products, and add products
- **Import Quote Line Items**: Create quotes faster by importing quote line items from CSV files
- **Create Documents**: Create and share PDF documents directly from the quote page
- **Generate Quote Documents**: Preview, generate, and email quote PDFs effortlessly
- **Sync with Opportunities**: Sync quote line items to products in the related opportunity
- **Convert to Orders**: Create an order from the quote with one click after customer acceptance
- **Split Quotes**: Create multiple, independent orders from a single quote for flexible order management

### Quote Data Model

The Quote data model includes entities and relationships for managing quotes and quote line items, including:
- Account, Account Team, Address, Address Type
- Agreement, Agreement Item, Agreement Term
- Amendment, Amendment Line Item
- Application, Application Component, Application Component Relationship
- Asset, Asset Contract Relationship
- And many more related objects

## Order Management

Orders signify a formal agreement between your business and the customer, detailing the products, services, and pricing.

### Key Order Features

- **Create Orders**: Create orders directly if a sale doesn't require a quote or approval
- **View and Edit Orders**: The order page lists product and pricing details. Edit orders to add and remove products
- **Update After Activation**: Order managers can use in-flight amendments or supplemental change orders to flexibly modify existing orders after activation, but before fulfillment
- **Unified Order View**: Capture changes in a linked order to establish a unified order view
- **Streamline Modifications**: Improve accuracy through streamlined order modification

### Order Fields

Transaction Management extends the standard Order object with additional fields:

#### Adjustment and Discount Fields
- **AdjustmentDistributionLogic** (picklist): Specifies how the overall discount amount is distributed among all order line items. Valid values: `Equal`, `Proportionate`
- **AppliedDiscount** (percent): The discount amount distributed among all order items
- **AppliedDiscountAmount** (currency): The percent discount applied to each order item
- **TotalAmountOverride** (currency): The value that the TotalAmount field must be set to by applying overall discounts

#### Status and Calculation Fields
- **CalculationStatus** (picklist): The status of price and tax calculations for the order. Valid values include:
  - `CompletedWithPricing` - Pricing is complete and tax will now be calculated
  - `CompletedWithTax` - Pricing and tax calculation are complete
  - `CompletedWithoutPricing` - Pricing and tax calculation were skipped
  - `ConfigurationFailed` - Configuration failed
  - `ConfigurationInProgress` - Configuration is in progress
  - `PriceCalculationFailed` - Pricing failed
  - `TaxCalculationFailed` - Pricing is complete but tax calculation failed
  - And more status values

#### Transaction Type Fields
- **OriginalActionType** (picklist): Specifies the action that created the order. Valid values: `Amend`, `Cancel`, `Renew`, `Transfer`
- **TransactionType** (picklist): Specifies the type of order being processed. Valid value: `AdvancedConfigurator`
- **SalesTransactionTypeId** (reference): Foreign key to the Sales Transaction Type object

#### Fulfillment Fields
- **FulfillmentPlanId** (reference): The unique ID of the fulfillment plan associated with the order (available only in orgs where Dynamic Revenue Orchestrator is enabled)
- **OrchestrationSbmsStatus** (picklist): The status of order submission for orchestration. Valid values: `Completed`, `Rejected`, `Submitted`

#### Other Fields
- **DiscountPercent** (percent): The percentage of discount applied to the order
- **LastPricedDate** (dateTime): The date when the order price was last calculated
- **TotalRoundedLineAmount** (currency): The total amount of all line items in an order without pricing adjustments
- **ValidationResult** (picklist): Specifies whether the order was configured and priced. Valid values: `MissingContributor`, `TransactionIncomplete`

## Contract Management

Contracts in Revenue Cloud are used to manage customers' assets, products, and services. They provide a framework for tracking contract pricing schedules and managing the relationship between contracts and assets.

### Creating Contracts

To create a contract for use in Revenue Cloud:

1. From the App Launcher, find and select Contracts
2. Enter contract details such as account name, start date, status, and any other necessary information
3. Save your changes
4. Select the Related tab
5. In the Application Usage Assignments section, click New
6. For Application Usage Type, enter `RevenueLifecycleManagement`
7. Save your changes
8. Select the Details tab
9. Edit the status and select Activated

### User Permissions

To create contracts, users need the `CreateContract` API permission set.

To amend, renew, or cancel assets:
- Amend Assets permission
- Renew Assets permission
- Cancel Assets permission
- Sales Rep permission group

### Contract Features

- **View and Manage Contracts**: Manage contracts and their assets and contract pricing schedules
- **Contract Pricing**: Create contract prices or discounts
- **Asset Management**: Use the Managed Assets Viewer to select an asset for amendment, renewal, or cancellation
- **Contract Pricing Schedules**: Create and manage contract pricing schedules

### Contract Data Model

The Contract data model includes entities and relationships for tracking and managing contracts, including:
- Account, Asset, Asset Contract Relationship
- Contract, Contract Item Price, Contract Item Price Adj Tier
- Opportunity, Order, Pricebook
- Product 2, Product Category, Product Selling Model

## Asset Management

Asset Management in Revenue Cloud allows you to track the products and services that your customers have purchased, so you can provide great customer support and grow your business relationship with them.

### Key Asset Features

- **Track Assets**: Track products and services that customers have purchased
- **Amend Assets**: Amend assets to meet customers' changing needs
- **Renew Assets**: Renew assets to provide uninterrupted service
- **Cancel Assets**: Cancel assets that are no longer needed
- **Managed Asset Viewer**: View a consolidated list of all lifecycle-managed assets
- **Bundled Assets**: View both standalone assets and bundled assets, with the ability to expand bundled assets to see the assets contained in the bundle and the bundle hierarchy

### Managed Asset Viewer

The Managed Asset Viewer component shows:
- Both standalone assets and bundled assets
- Ability to expand bundled assets to see the assets contained in the bundle and the bundle hierarchy
- Ability to edit data within the Asset Viewer or via a Side Panel
- Additional details including attributes when selecting an asset name

**Note**: The Managed Asset Viewer component shows the assets for Revenue Cloud contracts only when an application usage assignment with the name Revenue Lifecycle Management is listed.

### Setting Up Managed Asset Viewer

To add the Managed Asset Viewer to Account and Contract page layouts:

1. From the object management settings for accounts or contracts, go to Page Layouts and either create a page layout or select a page layout to modify
2. In the Related Lists section, make sure that the Assets related list is present on the page
3. Optionally, edit the columns shown in the Assets related list by clicking the gear icon and selecting which fields to show as columns
4. Save your changes
5. Go to Lightning Record Pages, and select the page layout you just worked on and click Edit
6. The Lightning App Builder opens
7. Drag the Related Lists component and the Managed Asset Viewer component onto the layout
8. Select the checkbox to show the side panel when a user clicks a record link
9. Optionally, configure the columns shown in the Managed Assets related list
10. Save your changes

**User Permissions**: To add the Managed Asset Viewer component to page layouts, users need the Customize Application permission.

### Asset Data Model

The Asset data model includes entities and relationships for tracking and managing assets, including relationships to contracts, products, and orders.

## Place Sales Transaction API

The Place Sales Transaction API is a powerful tool for programmatically creating and managing sales transactions (quotes and orders) in Revenue Cloud.

### Overview

The Place Sales Transaction API allows you to:
- Create quotes and orders programmatically
- Add line items to quotes and orders
- Transfer data between systems
- Automate sales transaction processes

### Input Parameters

#### Transaction Name
Specify a string that identifies the transaction name.

#### Options
Boolean options that control API behavior:
- **bypassValidationRules**: When `true`, validation rules are bypassed and a warning is issued
- **addDefaultConfiguration**: When `true`, automatically add the default configurations to the quote or order

The default value for all options is `false`.

#### Context Detail
Specify a string that contains the context ID so you can reuse the session context in a subsequent Place Sales Transaction API operation.

#### Graph
This input is an Apex-defined variable of class `RevSalesTrxn_RecordReference` with two fields:
- **graphId**: A string that identifies the graph
- **records**: An Apex-defined variable of class `RevSalesTrxn_RecordReference`

The value of the records field depends on the object you're acting on and the action you're taking. For example, to add line items to a Quote:
- **RecordReference.referenceId**: A string that identifies the variable
- **RecordReference.record.method**: A string that defines the API method to call (e.g., `POST`)
- **RecordReference.record.type**: A string that defines the object to change (e.g., `QuoteLineItem`)
- **RecordReference.record.fieldValues**: A collection of Apex-defined variables of class `RevSalesTrxn_RecordMapWrapper`, including:
  - `TransactionNameRecordMapWrapper`
  - `OppNameRecordMapWrapper`
  - `PricebookNameRecordMapWrapper`

### Output Parameters

- **Context Detail**: An alphanumeric string that identifies the context
- **Sales Transaction ID**: The ID of the quote or order in this transaction
- **Status URL**: A link to the AsyncOperationTracker table that shows the status of your request
- **Tracker ID**: An alphanumeric string that identifies the specific action

### Usage

To set up the Place Sales Transaction API input:
1. Use an Assignment element to set the field values of the `TransactionNameRecordMapWrapper`, `OppNameRecordMapWrapper`, and `PricebookNameRecordMapWrapper` of `RevSalesTrxn_RecordMapWrapper` class variables
2. If you want to include configuration options, create the options as new Boolean variables

### Known Limitations

- **Single Persist Limitation**: There is a known limitation with single persist operations when using the Place Sales Transaction API
- **Field Permission Requirements**: After upgrading to Spring '25, users may see error messages when trying to amend assets. To resolve:
  - Give users Read-Only permission to the Related Asset Pricing field on the Asset Relationship object
  - In the extended SalesTransactionContext context definition, update AssetEntitiesMapping to also map the Related Asset Pricing field on the Asset Relationship object

## REST API Endpoints

Transaction Management provides REST API endpoints for programmatic access to transaction management functionality. The following POST endpoints are available:

### API Request Input Structures

Transaction Management Business APIs use structured input objects to define request parameters. These input structures end with "Input" and define the data required for each API operation.

#### Transaction Management Input Structures

The following input structures are available for Transaction Management Business APIs:

##### Core Transaction Input Structures

- **Sales Transaction Input**: Input representation of the details of the request to place a sales transaction, such as a quote or an order. Used with the Place Sales Transaction API.

- **Place Quote Input**: Input representation of the request to create or update a quote. Used with the Place Quote API.

- **Place Order Input**: Input representation of the request to create or update an order. Used with the Place Order API.

- **Supplemental Transaction Input**: Input representation of the details of the request to create a supplemental order. Used with the Place Supplemental Transaction API.

- **Clone Sales Transaction Input**: Input representation of the request to clone records within a sales transaction. Used with the Clone Sales Transaction API.

- **Read Sales Transaction Input**: Input representation of the filter criteria details to read a sales transaction. Used with the Read Sales Transaction API.

##### Asset Management Input Structures

- **Amendment Input**: Input representation of the details of the request to create an amendment record. Used with the Asset Amendment API.

- **Cancellation Input**: Input representation of the details of the request to cancel a quote or an order. Used with the Asset Cancellation API.

- **Renewal Input**: Input representation of the details of the request to initiate the renewal of an asset. Used with the Asset Renewal API.

##### Ramp Deal Input Structures

- **Create Ramp Deal Input**: Input representation of the request to create a ramp deal. Used with the Create Ramp Deal API.

- **Update Ramp Deal Input**: Input representation of the request to update a ramp deal. Used with the Update Ramp Deal API.

- **Delete Ramp Deal Input**: Input representation of the request to delete a ramp deal. Used with the Delete Ramp Deal API.

- **Context Node Input**: Input representation of the details of the context nodes for ramp segments. Used within ramp deal operations.

- **Execution Settings Input**: Input representation of the execution settings for a ramp deal. Used to configure ramp deal execution behavior.

##### Pricing Input Structures

- **Instant Pricing Input**: Input representation to fetch the instant pricing details. Used with the Get Instant Price API.

##### Configuration Input Structures

- **Configuration Options Input**: Input representation for the configuration options. Used to specify configuration settings for transactions.

- **Configurator Preference Input**: Input representation of the configuration preference for the place sales transaction request. Used to control configurator behavior.

- **Context Input**: Input representation of the context that's associated with a sales transaction for a quote or an order. Used for session management and context reuse.

##### Object Representation Input Structures

- **Object Graph Input**: Input representation of an sObject with a graph ID. Used to represent objects in graph structures.

- **Object Input Map**: Input representation of an sObject record in a key-value map format. Used for flexible object representation.

- **Object with Reference Input**: Input representation of a list of records to be inserted or updated. To update a record, specify the record ID. Used for batch operations.

##### Clone Operation Input Structures

- **Clone Options Input**: Input representation of the options to clone a sales transaction. Used to configure cloning behavior.

##### Approval Input Structures

- **Preview Approval Input**: Input representation of the details of the request to preview an approval. Used with the Preview Approval API.

#### Standard REST API Input Structures

The following input structures are used with standard REST API actions:

- **PlaceSalesTransactionInput**: Input structure for the Place Sales Transaction API (REST API version)
- **CalculatePriceInput**: Input structure for the Calculate Price API
- **SubmitOrderInput**: Input structure for the Submit Order API
- **GetRenewableAssetsSummaryInput**: Input structure for the Get Renewable Assets Summary API
- **CreateSubscriptionRecordsInput**: Input structure for the Create Subscription Records API

#### Input Structure Components

Each input structure typically includes:

- **Required Parameters**: Fields that must be provided for the API to execute
- **Optional Parameters**: Fields that can be omitted or set to default values
- **Nested Objects**: Complex structures for related data (e.g., graph structures, context information)
- **Configuration Options**: Boolean flags and settings that control API behavior
- **Reference IDs**: Identifiers for referencing existing records or context
- **Field Values**: Key-value pairs representing object field values

#### Input Structure Usage Patterns

1. **Transaction Creation**: Use Sales Transaction Input, Place Quote Input, or Place Order Input to create new transactions
2. **Transaction Updates**: Use the same input structures with record IDs to update existing transactions
3. **Asset Operations**: Use Amendment Input, Cancellation Input, or Renewal Input for asset lifecycle management
4. **Ramp Deal Management**: Use Create/Update/Delete Ramp Deal Input structures for ramp deal operations
5. **Context Management**: Use Context Input to maintain session state across multiple API calls
6. **Object Representation**: Use Object Graph Input, Object Input Map, or Object with Reference Input based on your data structure needs

**Reference**: [Transaction Management API Requests](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_api_requests.htm) - Complete reference for API request input structures with detailed field specifications

### API Response Structures

Transaction Management Business APIs return structured response objects that provide detailed information about the outcome of API requests. These response structures contain status information, result data, and error details when applicable.

#### Transaction Management Response Structures

The following response structures are available for Transaction Management Business APIs:

##### Core Transaction Response Structures

- **Sales Transaction**: Output representation of the request to create a sales transaction. Used with the Place Sales Transaction API.

- **Place Quote**: Output representation of the request to create or update a quote. Used with the Place Quote API.

- **Place Order Response**: Output representation of the request to create or update an order. Used with the Place Order API.

- **Supplemental Transaction**: Output representation of the details of the created supplemental order. Used with the Place Supplemental Transaction API.

- **Clone Sales Transaction**: Output representation for the result of cloning records within a sales transaction. Used with the Clone Sales Transaction API.

- **Read Sales Transaction**: Output representation of the request to read a sales transaction. Used with the Read Sales Transaction API.

- **Read Sales Transaction Records**: Output representation of the details of a map of keys and associated values. The keys are record type names, such as a Quote or QuoteLineItem, and values are lists of records of that type. Used within Read Sales Transaction responses.

- **Sales Transaction Context**: Output representation of the context details that are associated with a sales transaction. Used for session management and context reuse.

- **Sales Transaction Record**: Generic output representation for any sales transaction record type. Used as a base structure for transaction records.

##### Asset Management Response Structures

- **Amendment**: Output representation of the details of an amendment record. Used with the Asset Amendment API.

- **Cancellation**: Output representation of the details of a cancellation record. Used with the Asset Cancellation API.

- **Renewal**: Output representation of the details of a renewal record. Used with the Asset Renewal API.

- **ARC Base Error**: Output representation of the error response related to the amendment, renewal, or cancellation of assets. Used for error handling in asset lifecycle operations.

##### Ramp Deal Response Structures

- **Ramp Deal Service**: Output representation of the details of a created, updated, or deleted ramp deal. Used with Create, Update, and Delete Ramp Deal APIs.

- **Ramp Deal Service Error Response**: Output representation of the details of errors encountered during the processing of the API request. Used for error handling in ramp deal operations.

##### Pricing Response Structures

- **Instant Pricing**: Output representation containing the results of the instant pricing request. Used with the Get Instant Price API.

##### Approval Response Structures

- **Preview Approval**: Output representation of the details of a preview approval request. Used with the Preview Approval API.

- **Preview Approval Chain Item**: Output representation of the details of an approval chain item for a specific group. Used within Preview Approval responses.

- **Preview Approval Item**: Output representation of the details of a specific approval item with an approval chain. Used within Preview Approval responses.

- **Preview Approval Error**: Output representation of the error details associated with the Preview Approval API. Used for error handling in approval preview operations.

##### Object Representation Response Structures

- **Object Reference**: Output representation of an sObject with a reference ID along with any potential error. Used for object reference tracking and error reporting.

##### Error Response Structures

Transaction Management APIs provide specialized error response structures for handling failures:

- **Sales Transaction Error Response**: Output representation of the error details associated with the Place Sales Transaction API. Used for error handling in sales transaction operations.

- **Place Order Error Response**: Output representation of the error response for the place order request. Used for error handling in order placement operations.

- **Place Quote Error Response**: Output representation of the error responses of a place quote request. Used for error handling in quote placement operations.

- **Clone Sales Transaction Error Response**: Output representation of the errors that occur during the clone sales transaction operation. Used for error handling in clone operations.

- **Supplemental Transaction Error Response**: Output representation of the error details associated with the Place Supplemental Transaction API. Used for error handling in supplemental transaction operations.

#### Standard REST API Response Structures

The following response structures are used with standard REST API actions:

- **PlaceSalesTransactionResponse**: Response structure for the Place Sales Transaction API (REST API version)
- **CalculatePriceResponse**: Response structure for the Calculate Price API
- **SubmitOrderResponse**: Response structure for the Submit Order API
- **GetRenewableAssetsSummaryResponse**: Response structure for the Get Renewable Assets Summary API
- **CreateSubscriptionRecordsResponse**: Response structure for the Create Subscription Records API

#### Response Structure Components

Each response structure typically includes:

- **Status Code**: Indicates the outcome of the API request (e.g., `SUCCESS`, `FAILURE`, `ERROR`)
- **Status Message**: Provides a human-readable description of the request status
- **Error Code**: If applicable, specifies the type of error encountered during processing
- **Result Data**: Contains the requested data or details about the operation performed
- **Context Information**: Context details for session management and subsequent operations
- **Tracker Information**: Tracking IDs and status URLs for asynchronous operations
- **Record References**: IDs and references to created or updated records
- **Error Details**: Additional information about errors, including field-level errors when applicable

#### Error Response Components

Error response structures typically include:

- **Error Code**: Specific error code identifying the type of error
- **Error Message**: Detailed description of what went wrong
- **Error Details**: Additional information about the error, including field-level errors when applicable
- **Status Code**: HTTP status code or API-specific status code
- **Request Information**: Details about the request that caused the error
- **Error Context**: Contextual information about where the error occurred

#### Response Handling Best Practices

1. **Check Status Codes**: Always check the status code in the response to determine if the operation was successful
2. **Handle Errors Gracefully**: Implement proper error handling for different error codes and messages
3. **Parse Result Data**: Extract and process the result data based on the specific response structure
4. **Track Asynchronous Operations**: Use tracker IDs and status URLs to monitor the progress of asynchronous operations
5. **Validate Response Structure**: Ensure the response matches the expected structure before processing
6. **Handle Nested Structures**: Be prepared to parse nested response structures (e.g., Read Sales Transaction Records, Preview Approval Chain Items)
7. **Check for Error Responses**: Always check for error response structures even when the main response indicates success
8. **Preserve Context Information**: Store context information from responses for use in subsequent API calls

**Reference**: [Transaction Management API Responses](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_api_responses.htm) - Complete reference for API response structures with detailed field specifications

### PlaceSalesTransaction (POST)

Creates or updates sales transactions (quotes and orders) programmatically.

**Endpoint**: `/services/data/vXX.X/actions/custom/PlaceSalesTransaction`

**Description**: This is the REST API equivalent of the Place Sales Transaction API. It allows you to create quotes and orders, add line items, and manage sales transactions programmatically.

**Input Structure**: `PlaceSalesTransactionInput`

**Request Body**: JSON object containing:
- **Transaction Name**: String that identifies the transaction name
- **Graph**: Apex-defined variable of class `RevSalesTrxn_RecordReference` with:
  - `graphId`: String that identifies the graph
  - `records`: Apex-defined variable of class `RevSalesTrxn_RecordReference` containing:
    - `referenceId`: String that identifies the variable
    - `record.method`: String defining the API method to call (e.g., `POST`)
    - `record.type`: String defining the object to change (e.g., `QuoteLineItem`)
    - `record.fieldValues`: Collection of Apex-defined variables of class `RevSalesTrxn_RecordMapWrapper`
- **Options**: Boolean options that control API behavior:
  - `bypassValidationRules`: When `true`, validation rules are bypassed and a warning is issued
  - `addDefaultConfiguration`: When `true`, automatically add the default configurations to the quote or order
- **Context Detail**: String containing the context ID for session reuse in subsequent operations

**Response Structure**: `PlaceSalesTransactionResponse`

**Response Body**: JSON object containing:
- **Status Code**: Indicates the outcome of the request (e.g., `SUCCESS`, `FAILURE`)
- **Status Message**: Human-readable description of the request status
- **Sales Transaction ID**: The ID of the quote or order created or updated in this transaction
- **Context Detail**: Alphanumeric string that identifies the context for session reuse
- **Status URL**: Link to the AsyncOperationTracker table that shows the status of the request
- **Tracker ID**: Alphanumeric string that identifies the specific action for tracking asynchronous operations
- **Error Information**: If the request failed, includes error code and error message details

**Reference**: [Transaction Management Business APIs REST References](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_business_apis_rest_references.htm) | [Transaction Management API Requests](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_api_requests.htm)

### CalculatePrice (POST)

Calculates pricing for quotes, orders, or line items.

**Endpoint**: `/services/data/vXX.X/actions/custom/CalculatePrice`

**Description**: Invokes the pricing procedure to calculate prices for products in a quote or order.

**Input Structure**: `CalculatePriceInput`

**Request Body**: JSON object containing:
- **Transaction ID**: ID of the quote or order for which to calculate prices
- **Context Information**: Context data for pricing calculation
- **Pricing Procedure Reference**: Reference to the pricing procedure to use

**Response Structure**: `CalculatePriceResponse`

**Response Body**: JSON object containing:
- **Status Code**: Indicates the outcome of the pricing calculation (e.g., `SUCCESS`, `FAILURE`)
- **Status Message**: Human-readable description of the calculation status
- **Calculated Prices**: Detailed pricing information for all line items
- **Pricing Details**: Breakdown of pricing components, including base prices, discounts, and adjustments
- **Tax Information**: Tax calculation results (if tax calculation was performed)
- **Error Information**: If the calculation failed, includes error code and error message details

**Reference**: [Transaction Management Business APIs REST References](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_business_apis_rest_references.htm) | [Transaction Management API Requests](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_api_requests.htm)

### SubmitOrder (POST)

Submits an order for fulfillment processing.

**Endpoint**: `/services/data/vXX.X/actions/custom/SubmitOrder`

**Description**: Submits an activated order to the fulfillment system for processing. This is used with Dynamic Revenue Orchestrator to initiate order fulfillment workflows.

**Input Structure**: `SubmitOrderInput`

**Request Body**: JSON object containing:
- **Order ID**: ID of the order to submit for fulfillment
- **Fulfillment Plan Reference**: Reference to the fulfillment plan (if applicable)
- **Additional Submission Parameters**: Additional parameters for order submission

**Response Structure**: `SubmitOrderResponse`

**Response Body**: JSON object containing:
- **Status Code**: Indicates the outcome of the order submission (e.g., `SUCCESS`, `FAILURE`)
- **Status Message**: Human-readable description of the submission status
- **Submission Status**: Status of the order submission to the fulfillment system
- **Fulfillment Plan Information**: Details about the fulfillment plan associated with the order
- **Orchestration Status**: Status of order submission for orchestration (if Dynamic Revenue Orchestrator is enabled)
- **Error Information**: If the submission failed, includes error code and error message details

**Reference**: [Transaction Management Business APIs REST References](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_business_apis_rest_references.htm) | [Transaction Management API Requests](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_api_requests.htm)

### GetRenewableAssetsSummary (POST)

Retrieves a summary of assets that are eligible for renewal.

**Endpoint**: `/services/data/vXX.X/actions/custom/GetRenewableAssetsSummary`

**Description**: Returns a summary of assets that can be renewed, including asset details, contract information, and renewal eligibility.

**Input Structure**: `GetRenewableAssetsSummaryInput`

**Request Body**: JSON object containing:
- **Account ID or Contract ID**: ID of the account or contract to query renewable assets for
- **Filter Criteria**: Criteria for filtering asset selection
- **Date Range**: Date range for renewal eligibility

**Response Structure**: `GetRenewableAssetsSummaryResponse`

**Response Body**: JSON object containing:
- **Status Code**: Indicates the outcome of the request (e.g., `SUCCESS`, `FAILURE`)
- **Status Message**: Human-readable description of the request status
- **Renewable Assets**: List of assets eligible for renewal, including:
  - Asset details (ID, name, product information)
  - Contract information
  - Renewal eligibility status
  - Expiration dates
  - Pricing information
- **Summary Statistics**: Aggregate information about renewable assets (count, total value, etc.)
- **Error Information**: If the request failed, includes error code and error message details

**Reference**: [Transaction Management Business APIs REST References](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_business_apis_rest_references.htm) | [Transaction Management API Requests](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_api_requests.htm)

### CreateSubscriptionRecords (POST)

Creates subscription records for orders containing subscription products.

**Endpoint**: `/services/data/vXX.X/actions/standard/createSubscriptionRecords`

**Description**: Accepts either the order summary ID or the order item summary IDs as input, filters the subscription products, and creates records to manage them effectively.

**Input Structure**: `CreateSubscriptionRecordsInput`

**Request Body**: JSON object containing:
- **Order Summary ID**: ID of the order summary, or
- **Order Item Summary IDs**: Array of order item summary IDs
- **Additional Parameters**: Additional parameters for subscription record creation

**Response Structure**: `CreateSubscriptionRecordsResponse`

**Response Body**: JSON object containing:
- **Status Code**: Indicates the outcome of the subscription record creation (e.g., `SUCCESS`, `FAILURE`)
- **Status Message**: Human-readable description of the creation status
- **Created Subscription Records**: List of created subscription records, including:
  - Subscription record IDs
  - Associated order item information
  - Subscription details
- **Creation Summary**: Summary of the creation process (number of records created, skipped, etc.)
- **Error Information**: If the creation failed, includes error code and error message details

**Special Access Rules**: 
- Available in API version 63.0 and later
- Requires system administrator access or the Assetize Order permission set assigned
- Requires specific licenses enabled

**Reference**: [Transaction Management Business APIs REST References](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_business_apis_rest_references.htm) | [Transaction Management API Requests](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_api_requests.htm)

### Connect API Endpoints

Transaction Management provides Connect API endpoints (using the `/connect/` path) for programmatic access to transaction management functionality. These endpoints offer additional capabilities beyond the standard REST API actions.

#### Asset Management Endpoints

##### Amend Asset (POST)

**Endpoint**: `/connect/revenue-management/assets/actions/amend`

**Description**: Initiate and execute the amendment of a quote or an order.

**Use Cases:**
- Amend quotes or orders to reflect changes in customer requirements
- Modify transaction configurations or quantities
- Process amendments through the Transaction Management workflow

##### Cancel Asset (POST)

**Endpoint**: `/connect/revenue-management/assets/actions/cancel`

**Description**: Initiate and execute the cancellation of an asset.

**Use Cases:**
- Cancel assets that are no longer needed
- Process asset cancellations through the Transaction Management workflow
- Automate asset cancellation processes

##### Renew Asset (POST)

**Endpoint**: `/connect/revenue-management/assets/actions/renew`

**Description**: Initiate and execute the renewal of an asset.

**Use Cases:**
- Renew assets to provide uninterrupted service
- Process asset renewals through the Transaction Management workflow
- Automate asset renewal processes

#### Quote and Order Management Endpoints

##### Place Quote (POST)

**Endpoint**: `/commerce/quotes/actions/place`

**Description**: Create a quote to discover and price products and services. Additionally, insert, update, or delete a quote line item.

**Use Cases:**
- Create quotes programmatically
- Manage quote line items (insert, update, delete)
- Discover and price products and services

##### Place Order (POST)

**Endpoint**: `/commerce/sales-orders/actions/place`

**Description**: Place orders with integrated pricing, configuration, and validation, and manage them throughout their entire lifecycle. Additionally, update an order or insert order items.

**Use Cases:**
- Place orders with integrated pricing and configuration
- Update existing orders
- Insert order items
- Manage orders throughout their lifecycle

##### Place Sales Transaction (POST)

**Endpoint**: `/connect/rev/sales-transaction/actions/place`

**Description**: Create a sales transaction, such as an order or a quote, with integrated pricing and configuration. Additionally, update an order or a quote, and insert and delete order or quote line items to calculate the estimated tax.

**Use Cases:**
- Create quotes or orders with integrated pricing and configuration
- Update existing quotes or orders
- Insert and delete line items
- Calculate estimated tax

**Note**: This is the Connect API version of the Place Sales Transaction API. The standard REST API version is available at `/services/data/vXX.X/actions/custom/PlaceSalesTransaction`.

##### Clone Sales Transaction (POST)

**Endpoint**: `/connect/rev/sales-transaction/actions/clone`

**Description**: Create a clone of a quote line item or an order item record with its related records and configurations. You can also clone all items in a quote line group or order item group when the record to clone is a quote line group or an order item group record.

**Use Cases:**
- Clone quote line items with related records and configurations
- Clone order items with related records and configurations
- Clone entire quote line groups or order item groups
- Duplicate complex transaction configurations

##### Place Supplemental Transaction (POST)

**Endpoint**: `/connect/rev/sales-transaction/actions/place-supplemental-transaction`

**Description**: Create a supplemental order or change orders after they are submitted for processing, such as during the fulfillment process.

**Use Cases:**
- Create supplemental orders after submission
- Create change orders during fulfillment
- Modify orders that are already in processing
- Handle in-flight order changes

##### Read Sales Transaction (POST)

**Endpoint**: `/connect/revenue/transaction-management/sales-transactions/actions/read`

**Description**: Retrieve sales transaction data efficiently from an initialized or a hydrated context.

**Use Cases:**
- Retrieve quote or order data efficiently
- Access transaction data from initialized contexts
- Retrieve data from hydrated contexts
- Optimize data retrieval operations

#### Pricing Endpoints

##### Get Instant Price (POST)

**Endpoint**: `/industries/cpq/quotes/actions/get-instant-price`

**Description**: Fetch instant pricing data on the quote or order line data grid and associated summary component. It offers capabilities to either create a context or update the existing one based on the provided context ID.

**Use Cases:**
- Get instant pricing for quotes or orders
- Update pricing contexts
- Calculate prices in real-time
- Display pricing in data grids and summary components

#### Ramp Deal Endpoints

Ramp deals allow sales reps to provide yearly deals to customers, resulting in long-term revenue and customer relationships. Customers can create, update, or view multiple segments of periods for their subscription term with different attributes for each segment.

##### Create Ramp Deal (POST)

**Endpoint**: `/connect/revenue-management/sales-transaction-contexts/{resourceId}/actions/ramp-deal-create`

**Description**: Create a ramp deal for a customer on a product. Sales reps can use ramp deals to provide yearly deals to a customer, resulting in long-term revenue and customer relationship. A customer can create, update, or view multiple segments of periods for their subscription term with different attributes for each segment.

**Use Cases:**
- Create ramp deals for customers
- Set up multi-segment subscription terms
- Configure different attributes for each segment
- Establish long-term customer relationships

##### Update Ramp Deal (POST)

**Endpoint**: `/connect/revenue-management/sales-transaction-contexts/{resourceId}/actions/ramp-deal-update`

**Description**: Modify a ramp deal in scenarios where a segment has updates such as quantity, discount, or date change.

**Use Cases:**
- Update ramp deal segments
- Modify quantity, discount, or dates
- Adjust segment attributes
- Maintain ramp deal configurations

##### View Ramp Deal (GET)

**Endpoint**: `/connect/revenue-management/sales-transaction-contexts/{resourceId}/actions/ramp-deal-view`

**Description**: View a ramp deal related to a quote line item or an order item.

**Use Cases:**
- View ramp deal details
- Review segment configurations
- Inspect ramp deal attributes
- Audit ramp deal settings

##### Delete Ramp Deal (POST)

**Endpoint**: `/connect/revenue-management/sales-transaction-contexts/{resourceId}/actions/ramp-deal-delete`

**Description**: Delete a ramp deal to convert a ramped product to include a single quote line item or order item.

**Use Cases:**
- Delete ramp deals
- Convert ramped products to single line items
- Simplify transaction structures
- Remove complex ramp configurations

#### Approval Endpoints

##### Preview Approvals (POST)

**Endpoint**: `/connect/advanced-approvals/approval-submission/preview`

**Description**: Preview the approval levels of a record and associated level details, approval chains, approvers, and conditions before you submit the record for an approval.

**Use Cases:**
- Preview approval levels before submission
- Review approval chains and approvers
- Check approval conditions
- Validate approval workflows before submission

### Additional REST API Endpoints

For a complete list of all available REST API endpoints (including GET, PUT, PATCH, and DELETE methods), refer to the [Transaction Management Business APIs REST References](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_business_apis_rest_references.htm) documentation.

**Note**: Replace `vXX.X` in the endpoint URLs with the appropriate API version number for your Salesforce org. Connect API endpoints use the `/connect/` path and do not require API version numbers in the URL.

## Developer Resources

### Business APIs

Transaction Management provides Business APIs for programmatic access to transaction management functionality. Business APIs are RESTful services that enable developers to integrate and automate processes such as quote and order management, pricing calculations, order submission, and asset management.

**Key Features of Transaction Management Business APIs:**

- **Quote and Order Management**: APIs to create, update, and manage quotes and orders, streamlining the sales process
- **Pricing Calculations**: Services to calculate prices for products in quotes and orders using pricing procedures
- **Order Fulfillment**: APIs to submit orders for fulfillment processing and orchestration
- **Asset Management**: Tools to retrieve and manage asset information, including renewable assets
- **Product Configuration**: APIs to configure products and manage product relationships

**Business APIs Overview:**

Business APIs provide a programmatic interface to Transaction Management functionality, allowing external systems and custom applications to interact with Revenue Cloud. These APIs support:

- **Automation**: Automate repetitive tasks and integrate with external systems
- **Customization**: Extend Transaction Management functionality with custom business logic
- **Integration**: Connect Transaction Management with other Salesforce clouds and third-party systems
- **Bulk Operations**: Process multiple transactions efficiently

**Available Business APIs:**

The main Business APIs for Transaction Management include:

1. **Place Sales Transaction API** - Creates or updates sales transactions (quotes and orders) programmatically
2. **Calculate Price API** - Calculates pricing for quotes, orders, or line items using pricing procedures
3. **Submit Order API** - Submits an order for fulfillment processing
4. **Get Renewable Assets Summary API** - Retrieves a summary of assets eligible for renewal

**Reference**: [Transaction Management Business APIs](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_business_apis.htm)

For detailed information on each API, including endpoints, request and response formats, and authentication requirements, refer to the [Transaction Management Business APIs REST References](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_business_apis_rest_references.htm) documentation.

### Apex Namespaces

The Transaction Management Apex reference points to several Apex namespaces (terms ending with `Namespace`) that you can use alongside Revenue Cloud Transaction Management for automation, orchestration, and integration.

**Transaction Management-Specific Namespaces:**

- **RevSalesTrxn Namespace**: Create a sales transaction, such as a quote or an order, with integrated pricing and configuration. Additionally, update an order or a quote, and insert and delete order or quote line items to calculate the estimated tax. This namespace provides the core classes for the Place Sales Transaction API, including `RevSalesTrxn_RecordReference` and `RevSalesTrxn_RecordMapWrapper`.

- **PlaceQuote Namespace**: Provides classes and methods to create or update quotes with pricing preferences and configuration options. This can complement Transaction Management quote flows and Business APIs, offering programmatic quote creation and management capabilities.

- **CommerceOrders Namespace**: Provides classes and methods to place orders with integrated pricing, configuration, and validation. This namespace enables programmatic order creation with full Transaction Management features including pricing calculations and validation.

- **CommerceTax Namespace**: Manages the communication between Salesforce and an external tax engine. This namespace provides classes and methods for tax calculation integration, allowing Transaction Management to work with external tax calculation services.

- **ConnectApi Namespace (Transaction Management)**: Provides an Apex class to specify details for asset transfer requests from one account to another. This namespace enables programmatic asset transfers between accounts within Transaction Management workflows.

**General Salesforce Namespaces Used with Transaction Management:**

- **Functions Namespace**: Invoke Salesforce Functions from Apex to offload complex or long-running processing related to quotes, orders, pricing, or renewal logic.

- **Invocable Namespace**: Work with invocable actions from Apex, making it easier to integrate Transaction Management flows and processes with Apex-driven logic.

- **Process Namespace**: Exchange data with Flow and orchestrate Flow-based processes that implement Transaction Management logic for quote and order capture.

- **Metadata Namespace**: Read and manage custom metadata that can drive Transaction Management configuration such as pricing rules, processing behaviors, or feature flags.

- **Messaging Namespace**: Send and manage email messages from Apex, for example notifications triggered by quote or order events (such as quote approval or order submission).

When building Apex integrations for Transaction Management:

- **Use RevSalesTrxn** for creating and managing sales transactions (quotes and orders) with integrated pricing and configuration. This is the primary namespace for programmatic transaction management operations.
- **Use PlaceQuote** for creating or updating quotes with pricing preferences and configuration options when you need fine-grained control over quote creation.
- **Use CommerceOrders** for placing orders with integrated pricing, configuration, and validation when you need programmatic order creation capabilities.
- **Use CommerceTax** for integrating with external tax engines when you need to calculate taxes using external tax calculation services.
- **Use ConnectApi (Transaction Management)** for asset transfer operations when you need to programmatically transfer assets between accounts.
- **Use Flow and invocable actions** (`Process` and `Invocable` namespaces) for orchestrating business processes that call Transaction Management APIs.
- **Use Functions** for heavy computation or external integrations that should not run directly in a synchronous transaction.
- **Use Metadata** to externalize configuration that controls how your Transaction Management logic behaves per product, region, or business unit.
- **Use Messaging** to implement robust notification and alerting patterns around key Transaction Management lifecycle events.

**Reference**: [Transaction Management Apex Reference](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_apex_reference.htm) - Complete reference for all Transaction Management Apex namespaces and classes

### Invocable Actions

Transaction Management provides standard invocable actions (terms ending with `Action`) that enable you to automate quote and order capture processes within Salesforce Flow, Process Builder, and other automation tools. These actions encapsulate common Transaction Management operations, making them accessible to declarative automation without requiring custom Apex code.

**Overview:**

Invocable actions are reusable building blocks that can be invoked from Flow, Process Builder, Apex, and other automation tools. They provide a declarative way to perform complex Transaction Management operations such as creating orders from quotes, calculating prices, validating transactions, and managing the quote-to-order lifecycle.

**Key Transaction Management Invocable Actions:**

#### CreateOrderFromQuoteAction

Creates an order directly from a quote record, automating the transition from quoting to order processing.

**Use Cases:**
- Automate order creation when a quote is approved
- Convert quotes to orders in bulk processes
- Streamline the quote-to-order workflow

**Key Features:**
- Converts quote line items to order items
- Preserves pricing and configuration information
- Maintains relationships between quotes and orders

#### CreateOrderFromQuoteWithOptionsAction

An extended version of the Create Order from Quote action that allows for additional configuration options during order creation.

**Use Cases:**
- Create orders with specific processing options
- Apply custom configurations during order creation
- Set fulfillment preferences when converting quotes to orders

**Key Features:**
- Supports additional configuration parameters
- Allows customization of order creation behavior
- Provides flexibility in the quote-to-order conversion process

#### CalculatePriceAction

Calculates pricing for quotes, orders, or line items using pricing procedures and rules.

**Use Cases:**
- Recalculate prices when products or quantities change
- Apply pricing rules and discounts
- Update pricing after configuration changes

**Key Features:**
- Invokes pricing procedures
- Applies pricing rules and adjustments
- Updates calculated prices on records

#### ValidateQuoteAction

Performs validation checks on a quote to ensure all necessary criteria are met before proceeding to the next stage.

**Use Cases:**
- Validate quotes before approval
- Check quote completeness before conversion
- Ensure data quality in quote records

**Key Features:**
- Validates quote configuration
- Checks required fields and relationships
- Provides validation feedback

#### ValidateOrderAction

Performs validation checks on an order to ensure it meets all requirements before activation or submission.

**Use Cases:**
- Validate orders before activation
- Check order completeness before fulfillment
- Ensure compliance with business rules

**Key Features:**
- Validates order configuration
- Checks pricing and calculation status
- Verifies fulfillment requirements

#### CreateOrdersFromQuoteAction

Creates multiple orders from a single quote instead of a single order, ensuring easier order management and fulfillment operations.

**Use Cases:**
- Split a quote into multiple orders for different fulfillment locations
- Create separate orders for different product categories
- Manage complex fulfillment scenarios requiring multiple orders

**Key Features:**
- Creates multiple orders from a single quote
- Supports flexible order splitting criteria
- Maintains relationships between quote and all created orders

#### CreateContractAction

Creates a contract from a specific quote record, automating the contract creation process.

**Use Cases:**
- Automate contract creation when a quote is approved
- Create contracts as part of the quote-to-order-to-contract workflow
- Streamline contract management processes

**Key Features:**
- Creates contracts from quote records
- Preserves quote and order relationships
- Supports contract configuration options

#### CreateOrUpdateAssetFromOrderAction

Creates an asset for each order item in the specified order. New assets are created for a new order. Modify existing assets for change order requests, such as a renewal or a cancellation.

**Use Cases:**
- Create assets automatically when orders are activated
- Update existing assets for renewals, amendments, or cancellations
- Automate asset lifecycle management

**Key Features:**
- Creates assets from order items
- Updates existing assets for change orders
- Supports renewal, amendment, and cancellation scenarios

#### CreateOrUpdateAssetFromOrderItemAction

Creates assets from individual order items within an order. Track assets after the individual line items of an order reach a certain stage in their lifecycle, such as submitted, fulfilled, or provisioned. If the order item is part of a renewal, an amendment, or a cancellation, existing assets are changed.

**Use Cases:**
- Create assets when specific order items are fulfilled
- Track assets at the line item level
- Manage asset creation based on order item lifecycle stages

**Key Features:**
- Creates assets from individual order items
- Supports lifecycle stage-based asset creation
- Updates existing assets for renewals, amendments, or cancellations

#### GetRenewableAssetsSummaryAction

Retrieves details about renewable assets in a given order. You can use this information to create renewal opportunities.

**Use Cases:**
- Identify assets eligible for renewal
- Create renewal opportunities based on asset information
- Analyze renewable asset data for business planning

**Key Features:**
- Retrieves renewable asset details
- Provides asset information for renewal processing
- Supports renewal opportunity creation

#### InitiateAmendmentAction

Initiate and execute the amendment of an asset.

**Use Cases:**
- Amend assets to reflect changes in customer requirements
- Modify asset configurations or quantities
- Process asset amendments through the Transaction Management workflow

**Key Features:**
- Initiates asset amendment process
- Executes asset amendments
- Supports amendment workflow automation

#### InitiateCancellationAction

Initiate and execute the cancellation of an asset.

**Use Cases:**
- Cancel assets that are no longer needed
- Process asset cancellations through the Transaction Management workflow
- Automate asset cancellation processes

**Key Features:**
- Initiates asset cancellation process
- Executes asset cancellations
- Supports cancellation workflow automation

#### InitiateRenewalAction

Initiate and execute the renewal of an asset.

**Use Cases:**
- Renew assets to provide uninterrupted service
- Process asset renewals through the Transaction Management workflow
- Automate asset renewal processes

**Key Features:**
- Initiates asset renewal process
- Executes asset renewals
- Supports renewal workflow automation

#### InitiateTransferAction

Transfer an asset or multiple assets from one account to another.

**Use Cases:**
- Transfer assets between accounts
- Handle account changes or mergers
- Manage asset ownership transfers

**Key Features:**
- Transfers single or multiple assets
- Supports account-to-account transfers
- Maintains asset history during transfers

#### InitiateRollbackOnLastActionAction

Initiate the reversal of the last action on an asset to rectify any transactional errors or to meet changing business requirements.

**Use Cases:**
- Reverse the last action on an asset due to errors
- Undo asset changes when business requirements change
- Correct transactional mistakes

**Key Features:**
- Reverses the last action on an asset
- Supports error correction workflows
- Enables asset state rollback

#### CreateServiceDocumentActions

Create service documents from work orders, work order line items, or service appointments.

**Use Cases:**
- Generate service documents for work orders
- Create documents from service appointments
- Automate service document creation

**Key Features:**
- Creates service documents from work orders
- Supports work order line items and service appointments
- Automates document generation

#### Approval Management Actions

Transaction Management provides several invocable actions for managing approval processes:

##### CancelApprovalSubmissionAction

Cancels an approval submission and all child approval work items that haven't been completed. You can also add comments about why the approval admin made the cancellation.

**Use Cases:**
- Cancel approval submissions that are no longer needed
- Stop approval processes when requirements change
- Manage approval workflow cancellations

##### OverrideApprovalWorkItemAction

Update an approval work item status with the approval admin decision and any comments that the approval admin added.

**Use Cases:**
- Override approval decisions when necessary
- Update approval work item statuses
- Manage approval workflow overrides

##### ReassignApprovalWorkItemAction

Reassign an approval work item that hasn't been completed. You can also add comments about why the approval admin reassigned the approval work item.

**Use Cases:**
- Reassign approval work items to different approvers
- Manage approval workload distribution
- Handle approver availability issues

##### RecallApprovalSubmissionAction

Recall an approval submission that isn't completed. You can also add comments that the submitter or approval admin made the recall.

**Use Cases:**
- Recall approval submissions for corrections
- Stop approval processes when changes are needed
- Manage approval workflow recalls

##### ReviewApprovalWorkItemAction

Update an approval work item status with the assignee or reviewer's decision and any comments that the assignee or reviewer added.

**Use Cases:**
- Process approval work item reviews
- Update approval decisions and comments
- Complete approval workflow steps

**Using Invocable Actions:**

1. **In Salesforce Flow**: Add an Action element and select the desired Transaction Management invocable action
2. **In Process Builder**: Use the Action element to invoke Transaction Management actions
3. **In Apex**: Use the `Invocable` namespace to programmatically invoke actions
4. **In Other Automation Tools**: Invocable actions are available wherever Flow actions can be used

**Best Practices:**

- **Error Handling**: Always include error handling when invoking actions to manage failures gracefully
- **Bulk Processing**: Consider bulk processing capabilities when designing automation that uses invocable actions
- **Performance**: Be mindful of governor limits when invoking actions in loops or bulk operations
- **Testing**: Test invocable actions thoroughly in sandbox environments before deploying to production

**Reference**: [Transaction Management Invocable Actions](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_invocable_actions_parent.htm) - Complete reference for all Transaction Management invocable actions

### Tooling API Objects

Transaction Management provides Tooling API objects for configuring and managing transaction processing. These objects allow you to programmatically configure how quotes and orders are processed.

**Overview:**

Tooling API exposes metadata used in developer tooling that you can access through REST or SOAP. Tooling API's SOQL capabilities for many metadata types allow you to retrieve smaller pieces of metadata. Transaction Management extends the Tooling API with specific objects for configuring transaction processing behavior.

**Key Features:**

- **REST and SOAP Access**: Access Tooling API objects through both REST and SOAP interfaces
- **SOQL Queries**: Use SOQL to query and retrieve metadata about Transaction Management configuration
- **Programmatic Configuration**: Configure Transaction Management settings programmatically without using the UI
- **Metadata Retrieval**: Retrieve smaller pieces of metadata efficiently using SOQL queries

#### TransactionProcessingType

Represents the settings to configure the processing constraints for a request. The `TransactionProcessingType` object is a Tooling API object that defines the processing types available for transaction management. This object is crucial for configuring and managing how transactions are processed within the Revenue Cloud environment.

**API Version**: Available in API version 63.0 and later.

**Purpose**: Use the Transaction Processing Type setting to define how quotes and orders are processed in your business. You can set a default transaction processing type, configure exceptions through the Tooling API, and allow sales reps to override the default selection.

**Key Fields:**
- **Name**: The unique name of the processing type
- **Description**: A brief explanation of what the processing type entails
- **IsActive**: Indicates whether the processing type is currently active and available for use
- **CreatedDate**: The date and time when the processing type was created
- **LastModifiedDate**: The date and time when the processing type was last modified

**Configuration Options:**
- **AdvancedConfigurator**: Configure transactions to use the Advanced Configurator for processing
- **SkipTaxCalculation**: Configure transactions to skip tax calculations when processing

**Usage:**
1. Create a transaction processing type record using the TransactionProcessingType Tooling API and specify your processing preferences
2. In Setup, find and select Revenue Settings
3. Turn on Transaction processing for quotes and orders
4. Set the default transaction processing type
5. When users create quotes and orders, the Transaction Type field is automatically populated with the default transaction processing type record
6. To give sales reps access to override the default transaction type, add the Transaction Type field to your quote and order pages

**Example Use Case**: Configure the Tooling API to create a transaction processing type record that uses the Advanced Configurator and skips tax calculations when processing transactions.

**Reference**: [TransactionProcessingType Tooling API Object](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/tooling_api_objects_transactionprocessingtype.htm)

**User Permissions**: To create transaction processing type records and to select a default transaction processing type, users need:
- Customize Application permission
- View Setup and Configuration permission

### Flow Metadata API

The Flow Metadata API provides a comprehensive interface for managing and retrieving metadata about flows within Transaction Management. This API is particularly useful for developers and administrators who need to programmatically access flow definitions, configurations, and related metadata to automate processes, perform audits, or integrate with external systems.

**Key Features:**

- **Retrieve Flow Definitions**: Access detailed information about existing flows, including their structure, elements, and configurations
- **Manage Flow Versions**: Programmatically handle different versions of flows, enabling version control and rollback capabilities
- **Deploy and Update Flows**: Automate the deployment of new flows or updates to existing ones across different environments
- **Access Flow Metadata**: Retrieve metadata such as flow labels, descriptions, and API names to facilitate documentation and analysis

**Common Use Cases:**

- **Automated Deployment**: Streamline the deployment of Transaction Management flows from a development environment to production using continuous integration and deployment pipelines
- **Audit and Compliance**: Extract flow metadata to ensure compliance with organizational standards and to maintain an audit trail of changes
- **Integration with External Systems**: Retrieve flow definitions to integrate with external applications, ensuring consistent process automation across platforms
- **Custom Flow Development**: Programmatically create and manage custom flows for Transaction Management processes

**Accessing the Flow Metadata API:**

To interact with the Flow Metadata API, you can use:
- **Salesforce CLI**: Use the Salesforce CLI to retrieve and deploy flow metadata
- **Direct API Calls**: Make direct API calls to the Metadata API endpoints
- **Metadata API**: Use the standard Salesforce Metadata API with Transaction Management flow types

**Requirements:**
- Necessary permissions to access flow metadata
- Connected app configured with appropriate OAuth scopes (if using API access)
- Access to the Metadata API in your Salesforce org

**Reference**: [Flow for Transaction Management](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_flow_metadata_api.htm)

### Metadata API

Transaction Management provides Metadata API types that enable you to programmatically manage Transaction Management configuration, flows, and related metadata. The Metadata API allows you to deploy, retrieve, and manage Transaction Management components as metadata, enabling version control, automated deployments, and consistent configuration across environments.

**Overview:**

The Metadata API provides a programmatic interface to Transaction Management metadata, allowing developers and administrators to:
- Deploy Transaction Management configurations across environments
- Retrieve metadata for backup, version control, or migration purposes
- Manage Transaction Management flows, invocable actions, and related components
- Automate deployment processes using CI/CD pipelines

**Transaction Management Metadata Types:**

Transaction Management extends the standard Salesforce Metadata API with specific metadata types for Transaction Management components:

1. **Flow for Transaction Management**: The flow for Transaction Management represents the metadata associated with a flow. With Flow, you can create an application that takes users through a series of pages to query and update the records in the database. You can also run logic and provide branching capability based on user input to build dynamic applications. Transaction Management flows can be managed through the Metadata API using Flow metadata types, enabling version control, deployment automation, and programmatic management of flow definitions.
2. **Invocable Action Metadata**: Invocable actions used in Transaction Management can be deployed and managed via the Metadata API
3. **Custom Metadata Types**: Custom metadata types can be used to store Transaction Management configuration that drives business logic
4. **Custom Settings**: Custom settings for Transaction Management can be managed through the Metadata API
5. **Permission Sets**: Permission sets that grant access to Transaction Management features can be deployed via the Metadata API
6. **Object Metadata**: Custom objects and fields used by Transaction Management can be managed through the Metadata API
7. **Validation Rules**: Validation rules on Transaction Management objects can be deployed and managed via the Metadata API
8. **Workflow Rules**: Workflow rules related to Transaction Management can be managed through the Metadata API
9. **Process Builder Processes**: Process Builder processes that automate Transaction Management workflows can be managed via the Metadata API

**Using the Metadata API with Transaction Management:**

1. **Deploy Transaction Management Components**: Use the Metadata API to deploy flows, invocable actions, and configurations from development to production
2. **Retrieve Metadata**: Retrieve Transaction Management metadata for backup, version control, or documentation purposes
3. **Manage Custom Metadata**: Deploy and update custom metadata types that configure Transaction Management behavior
4. **Automate Deployments**: Integrate Metadata API calls into CI/CD pipelines to automate Transaction Management deployments

**Metadata API Access Methods:**

- **Salesforce CLI**: Use `sf project deploy` and `sf project retrieve` commands to manage Transaction Management metadata
- **Metadata API SOAP/REST**: Make direct API calls to the Metadata API endpoints
- **Ant Migration Tool**: Use the Ant Migration Tool to deploy and retrieve Transaction Management metadata
- **VS Code Salesforce Extensions**: Use the Salesforce Extensions for VS Code to manage metadata

**Best Practices:**

- **Version Control**: Store Transaction Management metadata in version control systems (Git, SVN) for change tracking
- **Incremental Deployments**: Deploy only changed metadata components to reduce deployment time
- **Testing**: Test metadata deployments in sandbox environments before deploying to production
- **Documentation**: Document custom metadata types and their usage in Transaction Management processes

**Reference**: [Transaction Management Metadata API Types](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_metadata_api_parent.htm) - Complete reference for Transaction Management metadata types

### Platform Events

Transaction Management provides platform events that enable real-time communication between systems and processes. Platform events facilitate the propagation of changes and actions across various components, ensuring synchronization and responsiveness in the revenue lifecycle.

**Overview:**

Platform events are secure and scalable messaging mechanisms that allow publishers to send custom event data and subscribers to receive and process event messages. In Transaction Management, platform events enable event-driven architectures that react promptly to changes in quotes, orders, and related transactions.

**Key Platform Events in Transaction Management:**

#### QuoteSaveEvent

Notifies subscribers that the process started by the Place Quote or Place Sales Transaction API request is complete. If the process is successful, use this event to learn about the updated quote. If the request isn't successful, use this event to learn about the errors and how to fix them.

**API Version**: Available in API version 60.0 and later.

**Triggered By**: Place Quote API or Place Sales Transaction API requests.

**Use Cases:**
- Learn about updated quotes after successful API requests
- Handle errors and understand how to fix failed requests
- Trigger quote validation processes
- Initiate approval workflows
- Synchronize quote data with external systems
- Update related opportunity records
- Log quote changes for audit purposes

#### CreateAssetOrderEvent

Notifies subscribers that the process started by the `/actions/standard/createOrUpdateAssetFromOrder` or `/actions/standard/createOrUpdateAssetFromOrderItem` request is complete. If the process is successful, use this event to learn about the new assets. If the request isn't successful, use this event to learn about the errors and how to fix them.

**API Version**: Available in API version 55.0 and later.

**Triggered By**: Create or Update Asset From Order or Create or Update Asset From Order Item API requests.

**Use Cases:**
- Learn about new assets created from orders
- Handle errors from asset creation requests
- Initiate asset provisioning workflows
- Update inventory systems
- Trigger asset creation processes
- Notify downstream systems about new asset orders

#### PlaceOrderCompletedEvent

Notifies subscribers of an order being created or updated by invoking the Place Order API or the Place Sales Transaction API.

**API Version**: Available in API version 63.0 and later.

**Triggered By**: Place Order API or Place Sales Transaction API requests.

**Use Cases:**
- Learn about orders created or updated through API requests
- Initiate order fulfillment workflows
- Update external systems with order information
- Send customer notifications
- Trigger billing processes
- Update inventory systems

#### QuoteToOrderCompletedEvent

Notifies subscribers when the `/actions/standard/createOrderFromQuote` REST request is complete. If the request is successful, use this event to learn about the Order record. If the request isn't successful, use this event to learn about the errors associated with the request.

**API Version**: Available in API version 56.0 and later.

**Triggered By**: Create Order From Quote REST API request (`/actions/standard/createOrderFromQuote`).

**Use Cases:**
- Learn about Order records created from quotes
- Handle errors from quote-to-order conversion requests
- Initiate order processing workflows
- Trigger billing processes
- Update external systems
- Send customer notifications
- Commence fulfillment processes

**Platform Event Characteristics:**

- **Real-time Processing**: Events are processed in real-time, enabling immediate response to changes
- **Decoupled Architecture**: Publishers and subscribers are decoupled, allowing multiple subscribers to listen to the same event
- **Scalable**: Platform events are designed to handle high volumes of event messages
- **Secure**: Events are secured and can be accessed only by authorized subscribers

**Subscribing to Platform Events:**

You can subscribe to Transaction Management platform events using:

- **Apex Triggers**: Create Apex triggers that subscribe to platform events and execute custom business logic
- **Process Builder**: Use Process Builder to subscribe to platform events and trigger automated processes
- **Flows**: Create platform event-triggered flows to automate business processes
- **Pub/Sub API**: Use the Pub/Sub API to subscribe to events from external systems
- **CometD Clients**: Use CometD clients or the empApi Lightning component to subscribe to events

**Platform Event Fields:**

Platform events include standard fields and can have custom fields. Standard fields include:
- **ReplayId**: An opaque ID that refers to the position of the event in the event stream, used for replaying missed events
- **EventUuid**: A universally unique identifier (UUID) that identifies a platform event message
- **CreatedDate**: The date and time when the event was created

**Custom Fields:**

Platform event custom fields support these field types:
- Checkbox
- Date
- Date/Time
- Number
- Text
- Text Area (Long)

**Publish Behavior:**

Platform events support two publish behaviors:
- **Publish After Commit**: Event message is published only after a transaction commits successfully. Use this when subscribers rely on data committed by the publishing transaction.
- **Publish Immediately**: Event message is published when the publish call executes, regardless of whether the transaction succeeds. Use this for logging purposes or when publishers and subscribers are independent.

**Reference**: [Transaction Management Platform Event](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_platform_event.htm)

### Standard Objects
Transaction Management includes standard objects for quotes, orders, contracts, and assets, with extended fields for Transaction Management functionality.

### Field References

Transaction Management extends standard Salesforce objects with additional fields to support quote and order capture functionality. These fields enable enhanced tracking, calculation, and management of sales transactions.

#### Transaction Management Fields on Standard Objects

Transaction Management adds fields to the following standard objects:

**Account**
- Fields related to transaction management and revenue tracking
- Integration with quote and order processes
- Asset and contract relationship tracking

**Opportunity**
- Fields for linking opportunities to quotes and orders
- Revenue recognition and forecasting fields
- Transaction status and lifecycle tracking

**Product2**
- Product configuration and pricing fields
- Selling model and product category fields
- Integration with quote and order line items

**Pricebook**
- Price book configuration for Transaction Management
- Integration with pricing procedures

**PricebookEntry**
- Price book entry fields for Transaction Management
- Pricing calculation and adjustment fields

#### Transaction Management Fields on Quote

Standard and custom fields that extend the Quote object for Transaction Management functionality:

**Key Fields:**
- **Name**: Unique identifier for the quote
- **OpportunityId**: Links the quote to a related opportunity
- **Status**: Indicates the current state of the quote (e.g., Draft, Approved, Sent)
- **TotalPrice**: Sum of all line item prices on the quote
- Transaction Management calculation and configuration fields
- Pricing and tax calculation status fields

**Reference**: [Transaction Management Fields on Quote](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_quote.htm)

#### Transaction Management Fields on Quote Line Item

Fields that extend the QuoteLineItem object:

**Key Fields:**
- **QuoteId**: Associates the line item with its parent quote
- **Product2Id**: References the product being quoted
- **UnitPrice**: Price per unit of the product
- **Quantity**: Number of units for the product
- **TotalPrice**: Calculated total price for the line item (UnitPrice * Quantity)
- Transaction Management pricing and configuration fields
- Discount and adjustment fields

**Reference**: [Transaction Management Fields on Quote Line Item](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_quote_line_item.htm)

#### Transaction Management Fields on Order

Standard and custom fields that extend the Order object for Transaction Management functionality:

**Key Fields:**
- **AccountId**: Links the order to the customer account
- **Status**: Indicates the current state of the order (e.g., Draft, Activated, Completed)
- **TotalAmount**: Total monetary value of the order
- **EffectiveDate**: Date when the order becomes effective
- **CalculationStatus**: Status of price and tax calculations
- **FulfillmentPlanId**: Reference to fulfillment plan (if Dynamic Revenue Orchestrator is enabled)
- **OriginalActionType**: Action that created the order (Amend, Cancel, Renew, Transfer)
- **SalesTransactionTypeId**: Reference to Sales Transaction Type
- **TransactionType**: Type of order being processed
- **ValidationResult**: Whether the order was configured and priced

**Reference**: [Transaction Management Fields on Order](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_order.htm)

#### Transaction Management Fields on Order Item

Fields that extend the OrderItem (Order Product) object:

**Key Fields:**
- **OrderId**: Associates the line item with its parent order
- **Product2Id**: References the product being ordered
- **UnitPrice**: Price per unit of the product
- **Quantity**: Number of units for the product
- **TotalPrice**: Calculated total price for the line item (UnitPrice * Quantity)
- Transaction Management pricing and configuration fields
- Fulfillment and asset creation fields

**Reference**: [Transaction Management Fields on Order Item](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_order_item.htm)

#### Transaction Management Fields on Order Item Group

Fields for order item groups that organize related order items:

**Key Fields:**
- Grouping criteria fields
- Shipping and fulfillment fields
- Date and recipient fields

**Reference**: [Transaction Management Fields on Order Item Group](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_order_item_group.htm)

#### Transaction Management Fields on Order Item Relationship

Standard and custom fields extend the standard Order Item Relationship object for use in Transaction Management. This object is available in API version 58.0 and later.

**Key Fields:**
- Relationship type fields
- Parent and child order item references
- Relationship metadata fields

**Reference**: [Transaction Management Fields on Order Item Relationship](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_order_item_relationship.htm)

#### Transaction Management Fields on Order Action

Fields for order actions that represent actions that can be performed on orders:

**Key Fields:**
- Action type fields
- Action status fields
- Execution and result fields

**Reference**: [Transaction Management Fields on Order Action](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_order_action.htm)

#### Transaction Management Fields on Quote Document

Fields for quote documents that represent PDF documents generated from quotes:

**Key Fields:**
- Document generation fields
- Template and formatting fields
- Delivery and sharing fields

**Reference**: [Transaction Management Fields on Quote Document](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_quote_document.htm)

#### Transaction Management Fields on Quote Line Group

Fields for quote line groups that organize related quote line items:

**Key Fields:**
- Grouping criteria fields
- Pricing and discount fields
- Configuration fields

**Reference**: [Transaction Management Fields on Quote Line Group](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_quote_line_group.htm)

#### Transaction Management Fields on Object State Definition

Standard and custom fields extend the standard Object State Definition object for use in Transaction Management to represent the object state model for a particular status field for an entity. This object is available in API version 60.0 and later.

**Key Fields:**
- State definition configuration fields
- Status field references
- Entity type fields
- State model metadata fields

**Reference**: [Transaction Management Fields on Object State Definition](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_object_state_definition.htm)

#### Transaction Management Fields on Object State Value

Standard and custom fields extend the standard Object State Value object for use in Transaction Management. This object is available in API version 60.0 and later.

**Key Fields:**
- State value configuration fields
- State definition references
- State metadata fields
- Lifecycle stage fields

**Reference**: [Transaction Management Fields on Object State Value](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_object_state_value.htm)

#### Transaction Management Fields on Object State Transition

Standard and custom fields extend the standard Object State Transition object for use in Transaction Management to define the valid transition between two statuses. This object is available in API version 60.0 and later.

**Key Fields:**
- Transition configuration fields
- Source and target state references
- Transition rules and conditions
- Transition metadata fields

**Reference**: [Transaction Management Fields on Object State Transition](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_object_state_transition.htm)

**Reference**: [Transaction Management Fields on Standard Objects](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_standard_objects.htm) - Complete reference for all fields on standard objects

## Related Documentation

- **[Revenue Cloud Developer Guide - Transaction Management](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_overview.htm)** - Transaction Management overview
- **[Transaction Management Business APIs](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_business_apis.htm)** - Business APIs reference
- **[Transaction Management Business APIs REST References](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_business_apis_rest_references.htm)** - REST API endpoints reference
- **[Transaction Management Standard Objects](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_standard_objects.htm)** - Standard objects reference
- **[TransactionProcessingType Tooling API Object](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/tooling_api_objects_transactionprocessingtype.htm)** - Tooling API object for transaction processing types
- **[Configure Transaction Processing Type](https://help.salesforce.com/s/articleView?language=en_US&id=ind.qocal_configure_transaction_processing.htm&type=5)** - Configuration guide for transaction processing types
- **[Flow Metadata API for Transaction Management](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_flow_metadata_api.htm)** - Flow Metadata API reference
- **[Transaction Management Metadata API Types](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_metadata_api_parent.htm)** - Metadata API types reference
- **[Transaction Management Platform Event](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_platform_event.htm)** - Platform events reference
- **[Transaction Management API Requests](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_api_requests.htm)** - API request input structures reference
- **[Transaction Management API Responses](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_api_responses.htm)** - API response structures reference
- **[Transaction Management Invocable Actions](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/qoc_invocable_actions_parent.htm)** - Invocable actions reference
- **[Transaction Management: Quote Data Model](https://developer.salesforce.com/docs/platform/data-models/guide/transaction-management-quote.html)** - Quote data model
- **[Transaction Management: Order Data Model](https://developer.salesforce.com/docs/platform/data-models/guide/transaction-mgmt-order.html)** - Order data model
- **[Transaction Management: Contract Data Model](https://developer.salesforce.com/docs/platform/data-models/guide/transaction-management-contract.html)** - Contract data model
- **[Transaction Management: Asset Data Model](https://developer.salesforce.com/docs/platform/data-models/guide/transaction-management-asset.html)** - Asset data model
- **[Transaction Management Fields on Standard Objects](https://developer.salesforce.com/docs/atlas.en-us.revenue_lifecycle_management_dev_guide.meta/revenue_lifecycle_management_dev_guide/quote_and_order_capture_fields_on_standard_objects.htm)** - Complete reference for all fields on standard objects

