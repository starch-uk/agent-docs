# Salesforce Field Service Reference

> v1.0.0 | Enterprise/Unlimited/Developer (Lightning) | Mobile-friendly field
> service hub

<!-- NAVIGATION: Core→Objects→Triggers→APIs→Apex→Mobile→Admin→URLs -->

---

## Quick Reference

### Terminology

| Term               | Definition                                         |
| ------------------ | -------------------------------------------------- |
| Field Service      | Mobile-friendly field service hub in Salesforce    |
| Field Service Edge | SaaS for demanding mobile field service challenges |
| FSL                | Managed package Apex namespace                     |
| Service Reps       | Humans using Service Cloud (formerly "agents")     |

### Data Model Categories

[Core](https://developer.salesforce.com/docs/platform/data-models/guide/field-service-category.html)
•
[Expense Management](https://developer.salesforce.com/docs/platform/data-models/guide/field-service-expense-management.html)
• Inventory • Operating Hours • Preventive Maintenance • Pricing • Product
Service Campaign • Resource Time Management • Service Territory & Availability •
Shift Management • Skill Management • Warranty Management

### Object Categories

| Category         | Objects                                                          |
| ---------------- | ---------------------------------------------------------------- |
| Core Scheduling  | ServiceAppointment, ServiceResource, ServiceTerritory, WorkOrder |
| Work Definition  | Skill, WorkPlan, WorkType                                        |
| Scheduling       | OperatingHours, SchedulingPolicy, Shift                          |
| Inventory        | ProductItem, ProductRequest, ProductTransfer                     |
| Service Delivery | Expense, ServiceReport, TimeSheet                                |

---

## Field Service Core Data Model

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_core.htm

Use Field Service's core objects to complete essential field service tasks such
as managing work orders, defining your service territories, and tracking your
workforce.

**Note:** Asterisks in data model diagrams signify required fields.

### Work Orders

**Work orders** represent work to be completed for your customers, and are
central to field service operations in Salesforce. To divide the work further
for billing purposes or to track subtasks, add work order line items, which are
child records of work orders.

**Work Order Associations:** Work orders offer a great deal of flexibility. They
can be associated with many types of records, including:

- **Assets**: Track work performed on a specific asset
- **Cases**: Indicate that the work is being performed as part of a customer
  case
- **Accounts** and **Contacts**: Represent the customer
- **Entitlements** and **Service Contracts**: Indicate that the work is being
  done to fulfill a service-level agreement

### Service Appointments

While work orders describe the work to be performed, **service appointments**
represent the visits your team makes to the field to perform the work. They
include scheduling settings such as an arrival window, scheduled start and end
times, and appointment duration.

**Service Appointment Parent Records:**

- Every service appointment has a parent record
- The parent record is typically a work order or work order line item
- You can also add child service appointments to accounts, assets, leads, or
  opportunities to track related visits
- A record can have multiple child service appointments; for example, a work
  order may have two service appointments if two visits were needed to complete
  the work

### Work Types

If your team often performs the same tasks for multiple customers, create **work
types** to standardize your field service work. Work types are templates that
can be applied to work orders and work order line items.

**Work Type Features:**

- Define the duration of the work
- Add **skill requirements** to indicate the level of expertise needed to
  complete the work
- Opt to auto-create a child service appointment on any record that uses the
  work type

**Supporting Objects:** Work orders and service appointments are supported by a
variety of objects that control when and where the work occurs, the nature of
the work, and who performs it.

### Who Performs the Work

Members of your mobile workforce are represented in Salesforce as **service
resources**. A service resource represents an individual technician who can be
assigned to a service appointment.

**Service Crews:** You can also create **service crews**, which are groups of
service resources with complementary skills and experience that can be assigned
to appointments as a unit.

**Assigned Resources:** To assign a service resource to a service appointment,
create an **assigned resource** record. Assigned resources contain lookups to a
service resource and a service appointment. To assign a service crew to an
appointment, first create a representative service resource record with a
resource type of Crew. Then, create an assigned resource record that looks up to
the Crew service resource.

**Service Resource Supporting Objects:** Service resources come with several
objects that let you define their skills and availability:

- **Service resource skills**: Represent a service resource's certifications or
  levels of expertise
- **Resource capacity**: Records track the hourly or job-based capacity of
  contractors
- **Resource absences**: Represent time when a service resource needs to miss
  work
- **Resource preferences**: Designate specific service resources as preferred,
  required, or excluded on a work order or account

### Where the Work Occurs

**Service territories** are the places where your team can perform field service
work and are a way to organize your service resources. They typically represent
geographic territories such as cities or counties but may also represent
functional divisions like sales versus service.

**Territory Associations:**

- A **work order** can be associated with one service territory
- **Service resources** are assigned to one or more service territories as
  **service territory members** to indicate that they are available to work in
  the territory

### When the Work Occurs

**Operating hours** indicate when your team can perform field service work. They
can be assigned to accounts, service territories, and service territory members.

**Time Slots:** To add detail to operating hours, create **time slots**, which
represent the hours of operation in a particular day.

**Entitlements and Operating Hours:** If a customer **entitlement** includes
terms regarding when the customer has access to field service, you can track
these hours on the entitlement using the **Operating Hours** field (API name:
`SvcApptBookingWindowsId`). For example, if Customer A is entitled to service
Monday through Friday from 8 AM to noon, but Customer B is entitled to 24/7
service, you can create operating hours for each customer and assign them to the
related entitlement.

**See Also:**

- [Guidelines for Creating Operating Hours for Field Service](https://help.salesforce.com/articleView?id=fs_oh_considerations.htm&language=en_US)

---

## Field Service Object References

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_object_references.htm

Object reference for standard and custom Salesforce objects used in Field
Service.

### Related Documentation

- **[Field Service Standard and Custom Objects](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_objects.htm)**
    - A list of standard Salesforce objects and Salesforce-managed custom
      objects used in Field Service.

- **[Field Service Custom Fields on Standard Objects](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_standard_objects_custom_fields.htm)**
    - A list of custom fields on standard Salesforce objects installed with the
      Field Service managed package.

- **[Supplementary Field Service Objects](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_soap_dev_supplementary.htm)**
    - A list of Field Service objects that support history tracking or sharing.

## Field Service Standard and Custom Objects

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_objects.htm

A list of standard Salesforce objects and Salesforce-managed custom objects used
in Field Service.

**Note:** Most objects are available only if Field Service is enabled. Objects
not tied to Field Service enablement are shown with an asterisk (\*).

### Object Reference List

| Object                                                                                                                                                                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | API Version | Notes |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----- |
| [Address](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_address.htm)                                                   | Represents a mailing, billing, or home address.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | -           | -     |
| [ApptBundleAggrDurDnscale](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_apptbundleaggrdurdnscale.htm)                 | Sums the duration of the bundle members, reduced by a predefined percentage.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 54.0+       | -     |
| [ApptBundleAggrPolicy](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_apptbundleaggrpolicy.htm)                         | Policy that defines how the property values of the bundle members are aggregated and assigned to the bundle.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 54.0+       | -     |
| [ApptBundleConfig](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_apptbundleconfig.htm)                                 | Represents the general parameters that define the behavior of the bundle.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 54.0+       | -     |
| [ApptBundlePolicy](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_apptbundlepolicy.htm)                                 | Policy that defines how the bundling of service appointments should be handled.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 54.0+       | -     |
| [ApptBundlePolicySvcTerr](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_apptbundlepolicysvcterr.htm)                   | Represents a link between the BundlePolicy and the ServiceTerritory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 54.0+       | -     |
| [ApptBundlePropagatePolicy](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_apptbundlepropagatepolicy.htm)               | Policy that defines which property values are inherited from the bundle to the bundle members or are assigned as constant values in the bundle members.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 55.0+       | -     |
| [ApptBundleRestrictPolicy](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_apptbundlerestrictpolicy.htm)                 | Policy that defines the restrictions that are considered while forming a bundle.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 54.0+       | -     |
| [ApptBundleSortPolicy](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_apptbundlesortpolicy.htm)                         | Policy that defines the properties by which the bundle members are sorted within the bundle. Can also be used in the automatic mode for determining the order of the automatic selection of bundle members.                                                                                                                                                                                                                                                                                                                                                                                                                                         | 54.0+       | -     |
| [AppExtension](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_appextension.htm)                                         | Represents a connection between the Field Service mobile app and another app, typically for passing record data to the Salesforce mobile app or other apps.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 41.0+       | -     |
| [Asset](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_asset.htm)                                                       | Represents an item of commercial value, such as a product sold by your company or a competitor, that a customer has purchased.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | -           | \*    |
| [AssetAccountParticipant](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_assetaccountparticipant.htm)                   | Represents a junction between the Asset and Account objects describing the association between a participating account and an asset.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 56.0+       | -     |
| [AssetAttribute](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_assetattribute.htm)                                     | Stores asset attributes to track and analyze asset conditions to improve their uptime.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 57.0+       | -     |
| [AssetContactParticipant](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_assetcontactparticipant.htm)                   | Represents a junction between the Asset and Contact objects describing the association between a participating contact and an asset.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 56.0+       | -     |
| [AssetDowntimePeriod](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_assetdowntimeperiod.htm)                           | Represents a period during which an asset is not able to perform as expected. Downtime periods include planned activities, such as maintenance, and unplanned events, such as mechanical breakdown.                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 49.0+       | \*    |
| [AssetRelationship](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_assetrelationship.htm)                               | Represents a non-hierarchical relationship between assets due to an asset modification; for example, a replacement, upgrade, or other circumstance. In Revenue Lifecycle Management, this object represents an asset or assets grouped in a bundle or set.                                                                                                                                                                                                                                                                                                                                                                                          | 41.0+       | \*    |
| [AssetWarranty](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_assetwarranty.htm)                                       | Defines the warranty terms applicable to an asset along with any exclusions and extensions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 50.0+       | -     |
| [AssignedResource](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_assignedresource.htm)                                 | Represents a service resource who is assigned to a service appointment in Field Service and Lightning Scheduler. Assigned resources appear in the Assigned Resources related list on service appointments.                                                                                                                                                                                                                                                                                                                                                                                                                                          | 38.0+       | -     |
| [AssociatedLocation](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_associatedlocation.htm)                             | Represents a link between an account and a location in Field Service. You can associate multiple accounts with one location. For example, a shopping center location may have multiple customer accounts.                                                                                                                                                                                                                                                                                                                                                                                                                                           | -           | -     |
| [AttributeDefinition](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_attributedefinition.htm)                           | Represents a product, asset, or object attribute, for example, a hardware specification or software detail.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 57.0+       | -     |
| [AttributePicklist](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_attributepicklist.htm)                               | Represents a custom picklist for an asset attribute.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 57.0+       | -     |
| [AttributePicklistValue](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_attributepicklistvalue.htm)                     | Represents the values of an asset attribute picklist.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 57.0+       | -     |
| [ContractLineItem](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_contractlineitem.htm)                                 | Represents a product covered by a service contract (customer support agreement).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 18.0+       | \*    |
| [ContractLineOutcome](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_contractlineoutcome.htm)                           | Represents information on a contract line outcome's captured data and other related parameters that are used when capturing data.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 58.0+       | -     |
| [ContractLineOutcomeData](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_contractlineoutcomedata.htm)                   | Represents the contract line outcome's captured data. It stores the data that was captured between the contract line outcome's start date and end date.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 58.0+       | -     |
| [DigitalSignature](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_digitalsignature.htm)                                 | Represents a signature captured on a service report in field service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | -           | -     |
| [Entitlement](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_entitlement.htm)                                           | Represents the customer support an account or contact is eligible to receive. Entitlements may be based on an asset, product, or service contract.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 18.0+       | \*    |
| [EntityMilestone](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_entitymilestone.htm)                                   | Represents a required step in a customer support process on a work order. The Salesforce user interface uses the term "object milestone".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 37.0+       | \*    |
| [Expense](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_expense.htm)                                                   | Represents an expense linked to a work order. Service resource technicians can log expenses, such as tools or travel costs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 49.0+       | -     |
| [ExpenseReport](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_expensereport.htm)                                       | Represents a report that summarizes expenses.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 50.0+       | -     |
| [ExpenseReportEntry](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_expensereportentry.htm)                             | Represents an entry in an expense report.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 50.0+       | -     |
| [FieldServiceMobileSettings](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_fieldservicemobilesettings.htm)             | Represents a configuration of settings that control the Field Service iOS and Android mobile app experience.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 38.0+       | -     |
| [FldSvcObjChg](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_fldsvcobjchg.htm)                                         | Represents a change made to one of a service appointment's tracked fields.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 63.0+       | -     |
| [FldSvcObjChgDtl](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_fldsvcobjchgdtl.htm)                                   | Represents the details of a change made to one of a service appointment's tracked fields.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 63.0+       | -     |
| [FSL**Time_Dependency**c](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_fsl__time_dependency__c.htm)                   | Represents a dependency between two service appointments. This object is used to define scheduling relationships between two appointments. It allows you to determine the order and timing in which dependent appointments should be scheduled.                                                                                                                                                                                                                                                                                                                                                                                                     | -           | -     |
| [GeolocationBasedAction](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_geolocationbasedaction.htm)                     | Represents a geolocation-based action, which is an action that's triggered when a user enters, exits, or is within the area of the associated object.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 61.0+       | -     |
| [LinkedArticle](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_linkedarticle.htm)                                       | Represents a knowledge article that is attached to a work order, work order line item, or work type.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 37.0+       | -     |
| [Location](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_location.htm)                                                 | Represents a warehouse, service vehicle, work site, or other element of the region where your team performs field service work. In API version 49.0 and later, you can associate activities with specific locations. Activities, such as the tasks and events related to a location, appear in the activities timeline when you view the location detail page. Also in API version 49.0 and later, Work.com users can view Employees as a related list on Location records. In API version 51.0 and later, this object is available for Omnichannel Inventory and represents physical locations where inventory is available for fulfilling orders. | -           | -     |
| [MaintenanceAsset](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_maintenanceasset.htm)                                 | Represents an asset covered by a maintenance plan in field service. Assets can be associated with multiple maintenance plans.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | -           | -     |
| [MaintenancePlan](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_maintenanceplan.htm)                                   | Represents a preventive maintenance schedule for one or more assets in field service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | -           | -     |
| [MaintenanceWorkRule](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_maintenanceworkrule.htm)                           | Represents the recurrence pattern for a maintenance record.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 49.0+       | -     |
| [MobileSettingsAssignment](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_mobilesettingsassignment.htm)                 | Represents the assignment of a particular field service mobile settings configuration to a user profile.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 41.0+       | -     |
| [OperatingHours](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_operatinghours.htm)                                     | Represents the hours in which a service territory, service resource, or account is available for work. OperatingHours is used by Field Service, Salesforce Scheduler, Salesforce Meetings, Sales Engagement, and Workforce Engagement.                                                                                                                                                                                                                                                                                                                                                                                                              | 38.0+       | -     |
| [OperatingHoursHoliday](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_fs_operatinghoursholiday.htm)                    | Represents the day or hours for which a service territory or service resource is unavailable in Field Service, Salesforce Scheduler, Salesforce Meetings, Sales Engagement, or Workforce Engagement.                                                                                                                                                                                                                                                                                                                                                                                                                                                | 54.0+       | -     |
| [Pricebook2](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_pricebook2.htm)                                             | Represents a price book that contains the list of products that your org sells.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | -           | \*    |
| [Product2](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_product2.htm)                                                 | Represents a product that your company sells.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | -           | \*    |
| [ProductConsumed](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_productconsumed.htm)                                   | Represents an item from your inventory that was used to complete a work order or work order line item in field service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | -           | -     |
| [ProductConsumedState](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_productconsumedstate.htm)                         | Represents the status of an item from your inventory that was used to complete a work order or work order line item in Field Service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 57.0+       | -     |
| [ProductItem](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_productitem.htm)                                           | Represents the stock of a particular product at a particular location in field service, such as all bolts stored in your main warehouse.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | -           | -     |
| [ProductItemTransaction](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_productitemtransaction.htm)                     | Represents an action taken on a product item in field service. Product item transactions are auto-generated records that help you track when a product item is replenished, consumed, or adjusted.                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -           | -     |
| [ProductRequest](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_productrequest.htm)                                     | Represents an order for a part or parts in field service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | -           | -     |
| [ProductRequestLineItem](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_productrequestlineitem.htm)                     | Represents a request for a part in field service. Product request line items are components of product requests.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | -           | -     |
| [ProductRequired](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_productrequired.htm)                                   | Represents a product that is needed to complete a work order or work order line item in field service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | -           | -     |
| [ProductServiceCampaign](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_productservicecampaign.htm)                     | Represents a set of activities to be performed on a product service campaign asset, such as a product recall for safety issues or product defects.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 51.0+       | -     |
| [ProductServiceCampaignItem](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_productservicecampaignitem.htm)             | Represents a product service campaign's asset.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 51.0+       | -     |
| [ProductServiceCampaignItemStatus](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_productservicecampaignitemstatus.htm) | Represents a status for a product service campaign item in field service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 51.0+       | -     |
| [ProductServiceCampaignStatus](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_productservicecampaignstatus.htm)         | Represents a status for a product service campaign in field service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 51.0+       | -     |
| [ProductTransfer](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_producttransfer.htm)                                   | Represents the transfer of inventory between locations in field service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | -           | -     |
| [ProductWarrantyTerm](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_productwarrantyterm.htm)                           | Defines the relationship between a product or product family and warranty term.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 50.0+       | -     |
| [RecordsetFilterCriteria](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_recordsetfiltercriteria.htm)                   | Represents a set of filters that can be used to match service appointments or assets based on your criteria fields. For example, you can create recordset filter criteria so that only service appointments that satisfy the filter criteria are matched to the filtered shifts, and likewise only maintenance work rules that satisfy your criteria are matched to assets. Assets and maintenance work rules are available in API version 52.0 and later.                                                                                                                                                                                          | 50.0+       | -     |
| [RecordsetFilterCriteriaRule](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_recordsetfiltercriteriarule.htm)           | Represents a rule using fields from the designated source object to create filters on the filtered, or target, object. RecordsetFilterCriteriaRule is associated with the RecordsetFilterCriteria object.                                                                                                                                                                                                                                                                                                                                                                                                                                           | 50.0+       | -     |
| [RecordsetFltrCritMonitor](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_recordsetfltrcritmonitor.htm)                 | Monitors whether the value of an asset attribute is within the threshold of a recordset filter criteria (RFC). You can monitor one or more RFCs for an Asset.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 57.0+       | -     |
| [ResourceAbsence](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_resourceabsence.htm)                                   | Represents a time period in which a service resource is unavailable to work in Field Service, Salesforce Scheduler, or Workforce Engagement.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 38.0+       | -     |
| [ResourcePreference](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_resourcepreference.htm)                             | Represents an account's preference for a specified service resource on field service work.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | -           | -     |
| [ReturnOrder](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_returnorder.htm)                                           | Represents the return or repair of inventory or products in Field Service, or the return of order products in Order Management.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 42.0+       | -     |
| [ReturnOrderLineItem](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_returnorderlineitem.htm)                           | Represents a specific product that is returned or repaired as part of a return order in Field service, or a specific order item that is returned as part of a return order in Order Management.                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 42.0+       | -     |
| [SerializedProduct](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/hc_sforce_api_objects_serializedproduct.htm)                            | Records serial numbers for each individual product in an inventory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 50.0+       | -     |
| [SerializedProductTransaction](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_serializedproducttransaction.htm)         | Represents transactions performed on a serialized product.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 57.0+       | -     |
| [ServiceAppointment](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_serviceappointment.htm)                             | Represents an appointment to complete work for a customer in Field Service, Lightning Scheduler, Intelligent Appointment Management, and Virtual Care.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 38.0+       | -     |
| [ServiceAppointmentStatus](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_serviceappointmentstatus.htm)                 | Represents a possible status of a service appointment in field service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | -           | -     |
| [ServiceContract](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_servicecontract.htm)                                   | Represents a customer support contract (business agreement).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 18.0+       | \*    |
| [ServiceCrew](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_servicecrew.htm)                                           | Represents a group of service resources who can be assigned to service appointments as a unit.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | -           | -     |
| [ServiceCrewMember](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_servicecrewmember.htm)                               | Represents a technician service resource that belongs to a service crew.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | -           | -     |
| [ServiceReport](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_servicereport.htm)                                       | Represents a report that summarizes a work order, work order line item, or service appointment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | -           | -     |
| [ServiceReportLayout](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_servicereportlayout.htm)                           | Represents a service report template in field service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | -           | -     |
| [ServiceResource](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_serviceresource.htm)                                   | Represents a service technician or service crew in Field Service and Salesforce Scheduler, or an agent in Workforce Engagement.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 38.0+       | -     |
| [ServiceResourceCapacity](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_serviceresourcecapacity.htm)                   | Represents the maximum number of scheduled hours or number of service appointments that a capacity-based service resource can complete within a specific time period.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 38.0+       | -     |
| [ServiceResourceSkill](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_serviceresourceskill.htm)                         | Represents a skill that a service resource possesses in Field Service and Lightning Scheduler.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 38.0+       | -     |
| [ServiceTerritory](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_serviceterritory.htm)                                 | Represents a geographic or functional region in which work can be performed in Field Service, Salesforce Scheduler, or Workforce Engagement.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 38.0+       | -     |
| [ServiceTerritoryLocation](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_serviceterritorylocation.htm)                 | Represents a location associated with a particular service territory in field service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | -           | -     |
| [ServiceTerritoryMember](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_serviceterritorymember.htm)                     | Represents a service resource who can be assigned in a service territory in Field Service, Salesforce Scheduler, or Workforce Engagement.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 38.0+       | -     |
| [Shift](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_shift.htm)                                                       | Represents a shift for service resource scheduling.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 46.0+       | -     |
| [ShiftPattern](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_shiftpattern.htm)                                         | Represents a pattern of templates for creating shifts.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 51.0+       | -     |
| [ShiftPatternEntry](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_shiftpatternentry.htm)                               | ShiftPatternEntry links a shift template to a shift pattern.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 51.0+       | -     |
| [ShiftTemplate](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_shifttemplate.htm)                                       | Represents a template for creating shifts.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 51.0+       | -     |
| [Shipment](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_shipment.htm)                                                 | Represents the transport of inventory in field service or a shipment of order items in Order Management.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | -           | -     |
| [Skill](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_skill.htm)                                                       | Represents a category or group of Chat users or service resources in Field Service or Workforce Engagement.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 24.0+       | \*    |
| [SkillRequirement](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_skillrequirement.htm)                                 | Represents a skill that is required to complete a particular task in Field Service, Omni-Channel, Salesforce Scheduler, or Workforce Engagement. Skill requirements can be added to pending service routing objects in Omni-Channel. They can be added to work types, work orders, and work order line items in Field Service and Lightning Scheduler. And they can be added to job profiles in Workforce Engagement. You also can add skill requirements to work items in Omni-Channel skills-based routing using API version 42.0 and later.                                                                                                      | 38.0+       | -     |
| [TimeSheet](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_timesheet.htm)                                               | Represents a schedule of a service resource's time in Field Service or Workforce Engagement.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 47.0+       | -     |
| [TimeSheetEntry](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_timesheetentry.htm)                                     | Represents a span of time that a service resource spends on a field service task.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 47.0+       | -     |
| [TimeSlot](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_timeslot.htm)                                                 | Represents a period of time on a specified day of the week during which work can be performed in Field Service, Salesforce Scheduler, or Workforce Engagement. Operating hours consist of one or more time slots.                                                                                                                                                                                                                                                                                                                                                                                                                                   | 38.0+       | -     |
| [TravelMode](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_travelmode.htm)                                             | Represents a travel mode used for travel time calculations. The records include information about the type of transportation (such as Car or Walking), whether a vehicle can take toll roads, and whether a vehicle is transporting hazardous materials.                                                                                                                                                                                                                                                                                                                                                                                            | 54.0+       | -     |
| [WarrantyTerm](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_warrantyterm.htm)                                         | Represents warranty terms defining the labor, parts, and expenses covered, along with any exchange options, provided to rectify issues with products.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 50.0+       | -     |
| [WorkCapacityAvailability](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_workcapacityavailability.htm)                 | Represents the available work capacity for a specific time and service territory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 59.0+       | -     |
| [WorkCapacityLimit](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_workcapacitylimit.htm)                               | Represents the capacity limit in a specific service territory for a workstream or for the whole service territory in a given period.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 59.0+       | -     |
| [WorkCapacityUsage](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_workcapacityusage.htm)                               | Represents the capacity usage in a specific service territory for a workstream or for the whole service territory in a given period.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 59.0+       | -     |
| [WorkOrder](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_workorder.htm)                                               | Represents field service work to be performed for a customer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 36.0+       | \*    |
| [WorkOrderLineItem](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_workorderlineitem.htm)                               | Represents a subtask on a work order in field service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 36.0+       | \*    |
| [WorkOrderLineItemStatus](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_workorderlineitemstatus.htm)                   | Represents a possible status of a work order line item in field service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | -           | -     |
| [WorkPlan](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_workplan.htm)                                                 | Represents a work plan for a work order or work order line item.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 52.0+       | -     |
| [WorkPlanSelectionRule](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_workplanselectionrule.htm)                       | Represents a rule that selects a work plan for a work order or work order line item.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 52.0+       | -     |
| [WorkPlanTemplate](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_workplantemplate.htm)                                 | Represents a template for a work plan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 52.0+       | -     |
| [WorkPlanTemplateEntry](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_workplantemplateentry.htm)                       | Represents an object that associates a work step template with a work plan template.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 52.0+       | -     |
| [WorkOrderStatus](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_workorderstatus.htm)                                   | Represents a possible status of a work order in field service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | -           | -     |
| [WorkStep](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_workstep.htm)                                                 | Represents a work step in a work plan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 52.0+       | -     |
| [WorkStepStatus](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_workstepstatus.htm)                                     | Represents a picklist for a status category on a work step.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 52.0+       | -     |
| [WorkStepTemplate](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_worksteptemplate.htm)                                 | Represents a template for a work step.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 52.0+       | -     |
| [WorkType](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_worktype.htm)                                                 | Represents a type of work to be performed in Field Service and Lightning Scheduler. Work types are templates that can be applied to work order or work order line items.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 38.0+       | -     |
| [WorkTypeGroup](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_worktypegroup.htm)                                       | Represents a grouping of work types used to categorize types of appointments available in Lightning Scheduler, or to define scheduling limits in Field Service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 45.0+       | -     |
| [WorkTypeGroupMember](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sforce_api_objects_worktypegroupmember.htm)                           | Represents the relationship between a work type and the work type group it belongs to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 45.0+       | -     |

---

## Field Service Custom Fields on Standard Objects

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_standard_objects_custom_fields.htm

A list of custom fields on standard Salesforce objects installed with the Field
Service managed package.

See the
[Field Service Apex Namespace](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_mp_intro.htm)
section for more API references related to the managed package.

### Custom Fields Documentation

| Object                                                                                                                                                                                   | Description                                                                                                                                                                                           | API Version |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [AssignedResource Custom Fields](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_assignedresource.htm)               | Custom fields associated with a service resource who is assigned to a service appointment in Field Service. Assigned resources appear in the Assigned Resources related list on service appointments. | 38.0+       |
| [ResourceAbsence Custom Fields](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_resourceabsence.htm)                 | Custom fields associated with a time period in which a service resource is unavailable to work in Field Service.                                                                                      | -           |
| [ServiceAppointment Custom Fields](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_serviceappointment.htm)           | Custom fields associated with an appointment to complete work for a customer in Field Service.                                                                                                        | -           |
| [ServiceResource Custom Fields](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_serviceresource.htm)                 | Custom fields associated with a field service technician or crew in Field Service.                                                                                                                    | -           |
| [ServiceResourceCapacity Custom Fields](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_serviceresourcecapacity.htm) | Custom fields associated with the maximum number of scheduled hours or number of service appointments that a capacity-based service resource can complete within a specific time period.              | -           |
| [ServiceTerritory Custom Fields](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_serviceterritory.htm)               | Custom fields associated with a geographic or functional region in which field service work can be performed in Field Service.                                                                        | -           |
| [TimeSlot Custom Fields](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_timeslot.htm)                               | Custom fields associated with a period of time on a specified day of the week during which field service work can be performed in Field Service. Operating hours consist of one or more time slots.   | -           |
| [WorkOrder Custom Fields](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_workorder.htm)                             | Custom fields associated with field service work to be performed for a customer.                                                                                                                      | -           |
| [WorkOrderLineItem Custom Fields](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_workorderlineitem.htm)             | Custom fields associated with a subtask on a work order in field service.                                                                                                                             | -           |

### AssignedResource Custom Fields

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_assignedresource.htm

Custom fields associated with a service resource who is assigned to a service
appointment in Field Service. Assigned resources appear in the Assigned
Resources related list on service appointments. This object is available in API
version 38.0 and later.

**Standard Fields:** The standard fields are documented in the
[AssignedResource](https://developer.salesforce.com/docs/atlas.en-us.244.0.object_reference.meta/object_reference/sforce_api_objects_assignedresource.htm)
object reference.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), undelete(), update(), upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Custom Fields

| Field                                     | Type     | Properties                                                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------- | -------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FSL**EstimatedTravelDistanceFrom**c       | double   | Create, Filter, Nillable, Sort, Update                             | The estimated travel distance from the service resource's assigned appointment location to their home base. For this field, the assigned appointment location must have latitude and longitude coordinates and be the last location of the day. If it doesn't have coordinates, isn't the last location of the day, or the travel calculations are disabled, this field is 0.                                                                             |
| FSL**EstimatedTravelDistanceTo**c         | double   | Create, Filter, Nillable, Sort, Update                             | The estimated travel distance to the service resource's assigned appointment location from a service appointment, another resource absence location, or their home base. For this field, the assigned appointment location must have latitude and longitude coordinate. If it doesn't have latitude and longitude coordinates or the travel calculations are disabled, this field is 0.                                                                   |
| FSL**EstimatedTravelTimeFrom**c           | double   | Create, Filter, Nillable, Sort, Update                             | The estimated travel time from the service resource's assigned appointment location to their home base. For this field, the assigned appointment location must have latitude and longitude coordinates and be the last location of the day. If it doesn't have coordinates, isn't the last location of the day, or the travel calculations are disabled, this field is 0.                                                                                 |
| FSL**Estimated_Travel_Time_From_Source**c | picklist | Create, Filter, Group, Nillable, Restricted picklist, Sort, Update | The method used to calculate the travel time from the service resource's assigned appointment location to their home base. For this field, the assigned appointment location must have latitude and longitude coordinates and be the last location of the day. If it doesn't have coordinates, isn't the last location of the day, or the travel calculations are disabled, this field is None. Possible values: Aerial, None, Predictive, SLR            |
| FSL**Estimated_Travel_Time_To_Source**c   | picklist | Create, Filter, Group, Nillable, Restricted picklist, Sort, Update | The method used to calculate the travel time to the service resource's assigned appointment location from a service appointment, another resource absence location, or their home base. For this field, the assigned appointment location must have latitude and longitude coordinates. If it doesn't have latitude and longitude coordinates or the travel calculations are disabled, this field is None. Possible values: Aerial, None, Predictive, SLR |

#### Internal Fields

These internal fields are used by the Field Service managed package. Although
they're publicly accessible, they must only be updated by the managed package.

- **FSL**Last_Updated_Epoch**c**: Used to prevent the overlapping of multiple
  concurrent scheduling requests.
- **FSL**UpdatedByOptimization**c**: Equals `true` if the record was updated by
  the optimization engine.
- **FSL**calculated_duration**c**: Indicates the duration (start to end time) of
  the service appointment assigned to the resource in minutes.

**See Also:**

- [AssignedResource](https://developer.salesforce.com/docs/atlas.en-us.244.0.object_reference.meta/object_reference/sforce_api_objects_assignedresource.htm)

### ResourceAbsence Custom Fields

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_resourceabsence.htm

Custom fields associated with a time period in which a service resource is
unavailable to work in Field Service.

**Standard Fields:** The standard fields are documented in the
[ResourceAbsence](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_resourceabsence.htm)
object reference.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), update(), upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Custom Fields

| Field                                     | Type      | Properties                                                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------- | --------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FSL**Approved**c                          | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update           | When this field is `true` and the **Activate approval confirmation on resource absences** setting is enabled, the resource absence appears in the dispatcher console's Gantt chart and is considered by the scheduler. When this field is `false` and the setting is enabled, the resource absence doesn't appear in the Gantt chart and is ignored by the scheduler. The default value is `false`.                                                             |
| FSL**Duration_In_Minutes**c               | double    | Filter, Nillable, Sort                                             | The duration of the resource absence in minutes. This field is automatically populated after the resource absence is created. This is a calculated field.                                                                                                                                                                                                                                                                                                       |
| FSL**EstTravelTimeFrom**c                 | double    | Create, Filter, Nillable, Sort, Update                             | The estimated travel time from the service resource's absence location to their home base. For this field, the absence location must have latitude and longitude coordinates and be the last location of the day. If it doesn't have coordinates, isn't the last location of the day, or the travel calculations are disabled, this field is 0.                                                                                                                 |
| FSL**EstTravelTime**c                     | double    | Create, Filter, Nillable, Sort, Update                             | The estimated time to the service resource's absence location from a service appointment or another resource absence location. For this field, the absence location must have latitude and longitude coordinates. If it doesn't have latitude and longitude coordinates or the travel calculations are disabled, this field is 0.                                                                                                                               |
| FSL**EstimatedTravelDistanceFrom**c       | double    | Create, Filter, Nillable, Sort, Update                             | The estimated travel distance from the service resource's absence location to their home base. For this field, the absence location must have latitude and longitude coordinates and be the last location of the day. If it doesn't have coordinates, isn't the last location of the day, or the travel calculations are disabled, this field is 0.                                                                                                             |
| FSL**EstimatedTravelDistanceTo**c         | double    | Create, Filter, Nillable, Sort, Update                             | The estimated travel distance to service resource's absence location from a service appointment or another resource absence location. For this field, the absence location must have latitude and longitude coordinate. If it doesn't have latitude and longitude coordinates or the travel calculations are disabled, this field is 0.                                                                                                                         |
| FSL**Estimated_Travel_Time_From_Source**c | picklist  | Create, Filter, Group, Nillable, Restricted picklist, Sort, Update | The method used to calculate the travel time from the service resource's absence location to a service appointment or another resource absence location. For this field, the absence location must have latitude and longitude coordinates and be the last location of the day. If it doesn't have coordinates, isn't the last location of the day, or the travel calculations are disabled, this field is None. Possible values: Aerial, None, Predictive, SLR |
| FSL**Estimated_Travel_Time_To_Source**c   | picklist  | Create, Filter, Group, Nillable, Restricted picklist, Sort, Update | The method used to calculate the travel time to this service resource's absence location from a service appointment or another resource absence location. For this field, the absence location must have latitude and longitude coordinates. If it doesn't have latitude and longitude coordinates or the travel calculations are disabled, this field is None. Possible values: Aerial, None, Predictive, SLR                                                  |
| FSL**GanttLabel**c                        | string    | Create, Filter, Group, Nillable, Sort, Update                      | The label of the resource absence in the Field Service dispatcher console's Gantt chart and resource calendar. This replaces the resource absence's number in the chart.                                                                                                                                                                                                                                                                                        |
| FSL**Gantt_Color**c                       | string    | Create, Filter, Group, Nillable, Sort, Update                      | The Hex color of the resource absence in Field Service dispatcher console's Gantt chart and resource calendar.                                                                                                                                                                                                                                                                                                                                                  |
| FSL**Scheduling_Policy_Used**c            | reference | Create, Filter, Group, Nillable, Sort, Update                      | A scheduling policy used by the scheduler for the service appointment. This policy overrides the default one in the Field Service Settings page or the one that the scheduler would otherwise select. This is used for travel calculations. This is a relationship field. Relationship Name: FSL**Scheduling_Policy_Used**r, Relationship Type: Lookup, Refers To: FSL**Scheduling_Policy**c                                                                    |

#### Internal Fields

These internal fields are used by the Field Service managed package for Street
Level Routing calculations. Although they're publicly accessible, they must only
be updated by the managed package.

- **FSL**InternalSLRGeolocation**Latitude\_\_s**
- **FSL**InternalSLRGeolocation**Longitude\_\_s**
- **FSL**InternalSLRGeolocation**c**

**See Also:**

- [Salesforce Object Reference: ResourceAbsence](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_resourceabsence.htm)
- [Salesforce Help: View Resource Absences on the Gantt and Map](https://help.salesforce.com/articleView?id=sf.pfs_approved_absences.htm&language=en_US)

### ServiceAppointment Custom Fields

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_serviceappointment.htm

Custom fields associated with an appointment to complete work for a customer in
Field Service.

**Standard Fields:** The standard fields are documented in the
[ServiceAppointment](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceappointment.htm)
object reference.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Custom Fields

| Field                                            | Type      | Properties                                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------ | --------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FSL**Appointment_Grade**c                        | double    | Create, Filter, Nillable, Sort, Update                                                    | The appointment grade of the scheduled appointment using the Appointment Booking feature.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| FSL**Auto_Schedule**c                            | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update                                  | Indicates if the appointment is created and scheduled in the same action. The default value is `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| FSL**Duration_In_Minutes**c                      | double    | Filter, Nillable, Sort                                                                    | The duration in minutes of the scheduled appointment. It calculates the time between the scheduled start and end times in minutes. This is a calculated field.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| FSL**Emergency**c                                | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update                                  | Indicates if the Emergency Wizard global action schedules the appointment. If true, the service appointment has an emergency icon in the Field Service dispatcher console's Gantt chart. The default value is `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| FSL**GanttColor**c                               | string    | Create, Filter, Group, Nillable, Sort, Update                                             | The Hex color of the service appointment in the Field Service dispatcher console's Gantt chart and the resource calendar.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| FSL**GanttIcon**c                                | textarea  | Create, Nillable, Update                                                                  | A custom icon for the service appointment that appears in the Gantt chart, map, and appointment list. This helps dispatchers quickly identify appointment characteristics. For example, use a custom icon to indicate that an appointment is for a VIP or first-time customer. The format is a URL ending in an image suffix, such as .png or .gif. The image is scaled to 16 x 16 pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| FSL**GanttLabel**c                               | string    | Create, Filter, Group, Nillable, Sort, Update                                             | The label of the scheduled service appointment in the Field Service dispatcher console's Gantt chart. This replaces the service appointment number in the chart.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| FSL**Gantt_Display_Date**c                       | dateTime  | Create, Filter, Nillable, Sort, Update                                                    | The Gantt Display Date filter in the date field dropdown menu in the Field Service dispatcher console to control which appointments are visible in the appointment list. When a service appointment's Gantt Display Date falls within the Gantt time frame, the appointment is visible on the Gantt. For example, if a maintenance appointment must be completed within the next six months, you can set the date so that you see it on the Gantt every day. You can set up this field to update an important appointment's Gantt Display Date to today's date on a daily basis.                                                                                                                                                                                                                                                                                  |
| FSL**InJeopardyReason**c                         | picklist  | Create, Filter, Group, Nillable, Restricted picklist, Sort, Update                        | The reason for when the service appointment is in jeopardy. Use this field only when the FSL**InJeopardy**c status is `true`. You can add custom picklist values. Possible values: Delayed Finish, Delayed Start, Due Date Approaching, No Response, Rejected by Contractor                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| FSL**InJeopardy**c                               | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update                                  | Determines if a service appointment is in jeopardy. This helps dispatchers gain visibility to service appointments at risk. A user can manually set the service appointment status to **In Jeopardy** or this can be done automatically using, for example, process builders or triggers. The default value is `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| FSL**IsFillInCandidate**c                        | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update                                  | Determines if this service appointment is considered as a candidate when filling in a schedule with the Fill-In Schedule feature. If a service appointment's parent record is a work order or work order line item, the parent record's FSL**IsFillInCandidate**c field must also be set to `true` for the appointment to be a candidate. Alternatively, instead of using this field, you can create a custom checkbox field, including formula fields, to evaluate whether this appointment is considered as a candidate. This can be done through the Field Service Settings page. The default value is `true`.                                                                                                                                                                                                                                                 |
| FSL**IsMultiDay**c                               | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update                                  | Determines if this service appointment spans over multiple days. Alternatively, instead of using this field, you can create a checkbox formula field through the Field Service Settings page to evaluate whether it spans over multiple days or not. The default value is `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| FSL**Pinned**c                                   | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update                                  | Determines if this service appointment is pinned to the Field Service dispatcher console's Gantt chart. Pinned service appointments can't be manually dragged or automatically scheduled by any scheduling operation. Pinned service appointments have a lock icon in the Field Service dispatcher console's Gantt chart. The default value is `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| FSL**Prevent_Geocoding_For_Chatter_Actions**c    | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update                                  | Determines if the service appointment's BeforeUpdate Platform Apex trigger disables the Chatter Actions's geolocation cleanup on address change. When this field is set to `true`, it prevents Chatter Actions to geocode the address and waits until Field Service does it after the address changes. This field is set to `false` after the cleanup completes. The default value is `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| FSL**Schedule_Mode**c                            | picklist  | Create, Defaulted on create, Filter, Group, Nillable, Unrestricted picklist, Sort, Update | The type of the scheduling operation. For example, when not using Enhanced Scheduling and Optimization, if the service appointment is scheduled using drag and drop, the value is `Manual`. If the service appointment is scheduled using the Appointment Booking feature, the value is `Automatic`. When using Enhanced Scheduling and Optimization, if the service appointment is scheduled using drag and drop, the value is `Drag and Drop`. If the service appointment is scheduled using the Appointment Booking feature, the value is `Schedule`. This field is populated by the system. Don't edit this field. Possible values: Automatic, Manual, None, Optimization. Additional values for Enhanced Scheduling and Optimization: Drag and Drop, Schedule, Global Optimization, In-Day Optimization, Resource Optimization. The default value is 'None'. |
| FSL**Schedule_over_lower_priority_appointment**c | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update                                  | Determines whether you can schedule critical service appointments over lower priority appointments. The default value is `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| FSL**Scheduling_Policy_Used**c                   | reference | Create, Filter, Group, Nillable, Sort, Update                                             | A scheduling policy used by the scheduler for the service appointment. If you edit this field, the policy overrides the default one on the Field Service Settings page. If this field is empty, the field populates with the policy used by the scheduler after the service appointment gets scheduled. This is a relationship field. Relationship Name: FSL**Scheduling_Policy_Used**r, Relationship Type: Lookup, Refers To: FSL**Scheduling_Policy**c                                                                                                                                                                                                                                                                                                                                                                                                          |
| FSL**UpdatedByOptimization**c                    | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update                                  | Determines if the service appointment is updated by the optimizer. This field is populated by the system. Don't edit this field. The default value is `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| FSL**Use_Async_Logic**c                          | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update                                  | Determines if the scheduling features related to the service appointment run asynchronously. If you use UI features, such as the Appointment Booking global action, the managed package takes care of this async response for you. The default value is `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| FSL**Virtual_Service_For_Chatter_Action**c       | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update                                  | Determines if the service appointment is a candidate or dummy appointment. If the value is `true`, the appointment is ignored by your custom triggers. This field is populated by the system. Don't edit this field. The default value is `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

#### Internal Fields

These internal fields are used by the Field Service managed package for Street
Level Routing calculations. Although they're publicly accessible, they must only
be updated by the managed package.

- **FSL**InternalSLRGeolocation**Latitude\_\_s**
- **FSL**InternalSLRGeolocation**Longitude\_\_s**
- **FSL**InternalSLRGeolocation**c**

**See Also:**

- [Salesforce Object Reference: ServiceAppointment](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceappointment.htm)
- [Salesforce Help: Schedule an Appointment Automatically](https://help.salesforce.com/articleView?id=sf.pfs_scheduling_auto.htm&language=en_US)
- [Salesforce Help: Create Custom Appointment Icons](https://help.salesforce.com/articleView?id=sf.pfs_gantt_icons.htm&language=en_US)
- [Salesforce Help: Control Which Appointments Appear in the Dispatcher Console](https://help.salesforce.com/articleView?id=sf.pfs_horizon.htm&language=en_US)
- [Salesforce Help: Fill Schedule Gaps](https://help.salesforce.com/articleView?id=sf.pfs_fill_schedule.htm&language=en_US)
- [Salesforce Help: Enable Multiday Service Appointments](https://help.salesforce.com/articleView?id=sf.pfs_multiday.htm&language=en_US)
- [Salesforce Help: Schedule Appointments Using Priorities](https://help.salesforce.com/articleView?id=sf.pfs_scheduling_priority.htm&language=en_US)

### ServiceResource Custom Fields

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_serviceresource.htm

Custom fields associated with a field service technician or crew in Field
Service.

**Standard Fields:** The standard fields are documented in the
[ServiceResource](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceresource.htm)
object reference.

**Supported Calls:** create(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), update(), upsert()

**Note:** This object does not support delete() or undelete() calls.

**Special Access Rules:** Field Service managed package must be installed.

#### Custom Fields

| Field                 | Type   | Properties                                    | Description                                                                                                                                                                                                                                                                                                                                                      |
| --------------------- | ------ | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FSL**Efficiency**c    | double | Create, Filter, Nillable, Sort, Update        | The efficiency score or the work pace of the service resource. Enter a value from 0.1 to 10. An efficiency of 1 (default) means that the mobile worker works at a typical or average speed. An efficiency greater than 1 means that the mobile worker works faster than average. Less than 1 means that the mobile worker works slower than average.             |
| FSL**GanttLabel**c    | string | Create, Filter, Group, Nillable, Sort, Update | The description of the service resource in the Field Service dispatcher console's Gantt chart. This is shown under the service resource's name in the chart.                                                                                                                                                                                                     |
| FSL**Online_Offset**c | double | Create, Filter, Nillable, Sort, Update        | The offset of how long the service resource is considered online since they last used or logged into the mobile app. This overrides the default value in the Field Service Settings page.                                                                                                                                                                        |
| FSL**Picture_Link**c  | url    | Create, Filter, Group, Nillable, Sort, Update | The URL link to the customer's picture used as the avatar in the Field Service dispatcher console's Gantt chart. If no URL is provided here, the Gantt chart uses the user avatar.                                                                                                                                                                               |
| FSL**Priority**c      | double | Create, Filter, Nillable, Sort, Update        | The priority of the service resource used to rank their appointments. The lower the number the higher the priority.                                                                                                                                                                                                                                              |
| FSL**Travel_Speed**c  | double | Create, Filter, Nillable, Sort, Update        | The average aerial travel speed of the service resource used to calculate the aerial travel time. This field overrides the default value in the Field Service Settings page. The units, selected in the Field Service Settings page, are KPH or MPH. Street level routing and predictive travel calculations don't use this field. They have their own settings. |

**See Also:**

- [Salesforce Object Reference: ServiceResource](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceresource.htm)
- [Salesforce Help: Estimate a Service Resource's Efficiency](https://help.salesforce.com/s/articleView?id=sf.pfs_efficiency.htm&language=en_US)

### ServiceResourceCapacity Custom Fields

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_serviceresourcecapacity.htm

Custom fields associated with the maximum number of scheduled hours or number of
service appointments that a capacity-based service resource can complete within
a specific time period.

**Standard Fields:** The standard fields are documented in the
[ServiceResourceCapacity](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceresourcecapacity.htm)
object reference.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), update(), upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Custom Fields

| Field                        | Type   | Properties                             | Description                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------------- | ------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FSL**HoursInUse**c           | double | Filter, Nillable, Sort                 | The total number of hours of scheduled services occupied by the service resource. This is used by the Field Service dispatcher console to show how much resource capacity is used up and by the scheduler to prevent offering resources whose capacity is full. This field is updated when the scheduler runs and updates the FSL**MinutesUsed**c field. This is a calculated field. |
| FSL**Last_Updated_Epoch**c   | double | Create, Filter, Nillable, Sort, Update | The date and time, in Epoch format, that the Capacity object was last updated. The Capacity object is updated when a service is scheduled on a capacity-based resource. This field is used by the Field Service dispatcher console.                                                                                                                                                  |
| FSL**MinutesUsed**c          | double | Create, Filter, Nillable, Sort, Update | The total number of minutes of scheduled services occupies by the service resource. This is used by the Field Service dispatcher console to show how much resource capacity is used up and by the scheduler to prevent offering resources whose capacity is full.                                                                                                                    |
| FSL**Work_Items_Allocated**c | double | Create, Filter, Nillable, Sort, Update | The number of scheduled service appointments that fill the capacity. This is used by the Field Service dispatcher console to show how much resource capacity is used up.                                                                                                                                                                                                             |

**See Also:**

- [Salesforce Object Reference: ServiceResourceCapacity](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceresourcecapacity.htm)

### ServiceTerritory Custom Fields

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_serviceterritory.htm

Custom fields associated with a geographic or functional region in which field
service work can be performed in Field Service.

**Standard Fields:** The standard fields are documented in the
[ServiceTerritory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceterritory.htm)
object reference.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Custom Fields

| Field                              | Type          | Properties                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------- | ------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FSL**Hide_Emergency_Map**c         | boolean       | Create, Defaulted on create, Filter, Group, Sort, Update | Controls if the Emergency Wizard map used by the Emergency Wizard global action is hidden for a service territory. This is for privacy purposes. If this is `true`, it shows a list of appointments with estimated time of arrivals instead. The default value is `false`.                                                                                                                                                    |
| FSL**NumberOfServicesToDripFeed**c | double        | Create, Filter, Nillable, Sort, Update                   | The drip feed rate to dispatch appointments. This is part of the drip feed dispatching feature. This value overrides the default value in the Field Service Settings page.                                                                                                                                                                                                                                                    |
| FSL**System_Jobs**c                | multipicklist | Create, Filter, Nillable, Update                         | The list of automators for scheduling jobs associated with a single territory. Possible values are the default or custom automator names configured in the Field Service Settings page. For example, if you create an optimization automator for Los Angeles called "LA_Optimize_1", this field is populated with `LA_Optimize_1` for the LA service territory. This field is populated by the system. Don't edit this field. |
| FSL**TerritoryLevel**c             | double        | Create, Filter, Nillable, Sort, Update                   | The territory hierarchy level of the polygon defining the service territory. A polygon is a custom shape drawn on the map to define the area of the territory. It can be nested inside another polygon creating a hierarchy. This field is populated by the system. Don't edit this field.                                                                                                                                    |

#### Internal Fields

These internal fields are used by the Field Service managed package for Street
Level Routing calculations. Although they're publicly accessible, they must only
be updated by the managed package.

- **FSL**Internal_SLRGeolocation**Latitude\_\_s**
- **FSL**Internal_SLRGeolocation**Longitude\_\_s**
- **FSL**Internal_SLRGeolocation**c**

**See Also:**

- [Salesforce Object Reference: ServiceTerritory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceterritory.htm)
- [Salesforce Help: Drip Feed Service Appointments](https://help.salesforce.com/articleView?id=sf.pfs_dispatch_drip_feed.htm&language=en_US)

### TimeSlot Custom Fields

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_timeslot.htm

Custom fields associated with a period of time on a specified day of the week
during which field service work can be performed in Field Service. Operating
hours consist of one or more time slots.

**Standard Fields:** The standard fields are documented in the
[TimeSlot](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_timeslot.htm)
object reference.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), update(), upsert()

**Note:** This object does not support search() or undelete() calls.

**Special Access Rules:** Field Service managed package must be installed.

#### Custom Fields

| Field                                  | Type          | Properties                                                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------------------------- | ------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FSL**Designated_Work_Boolean_Fields**c | multipicklist | Create, Filter, Nillable, Update                                   | The type of designated work time slot. To convert a regular time slot to a designated one, use the calendar editor in the Visualforce page instead of editing this field manually in the record page. Possible values: None (default). Additional values are added by the managed package when a time slot is converted to a designated work type. The values are the API names of the designated work boolean fields on the service appointment. |
| FSL**Slot_Color**c                     | picklist      | Create, Filter, Group, Nillable, Restricted picklist, Sort, Update | The time slot color as it appears on the calendar editor in the Visualforce page. This field is populated by the system. Possible values: Amber, Asphalt, Black, Blue, Brown, Cyan, Green, Grey, Indigo, Lime, Orange, Pink, Purple, Red, Teal, Yellow                                                                                                                                                                                            |

**See Also:**

- [Salesforce Object Reference: TimeSlot](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_timeslot.htm)

### WorkOrder Custom Fields

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_workorder.htm

Custom fields associated with field service work to be performed for a customer.

**Standard Fields:** The standard fields are documented in the
[WorkOrder](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workorder.htm)
object reference.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Custom Fields

| Field                                         | Type      | Properties                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------- | --------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FSL**IsFillInCandidate**c                     | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update | Determines if this work order is considered as a candidate when filling in a schedule with the Fill-In Schedule feature. If a service appointment's parent record is a work order, this field must also be set to true for the appointment to be a candidate. Alternatively, you can create a custom checkbox field through the Field Service Settings page, instead of using this field, to evaluate whether this appointment is considered as a candidate. The custom checkbox field includes formula fields. The default value is `true`. |
| FSL**Prevent_Geocoding_For_Chatter_Actions**c | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update | Determines if the work order's BeforeUpdate trigger disables the Chatter Action's geolocation cleanup on address change. This field is set to `false` after the cleanup completes. The default value is `false`.                                                                                                                                                                                                                                                                                                                             |
| FSL**Scheduling_Priority**c                   | double    | Filter, Nillable, Sort                                   | The work order priority. The lower the value, the higher the priority. This is a calculated field.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| FSL**VisitingHours**c                         | reference | Create, Filter, Group, Nillable, Sort, Update            | The visiting hours that define when service appointments associated with the work order can be scheduled. The visiting hours are enforced as long as the Visiting Hours work rule complies with the scheduling policy. Visiting hours are enforced only if the Visiting Hours work rule is part of the scheduling policy. This is a relationship field. Relationship Name: FSL**VisitingHours**r, Relationship Type: Lookup, Refers To: OperatingHours                                                                                       |

**See Also:**

- [Salesforce Object Reference: WorkOrder](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workorder.htm)
- [Salesforce Help: Fill Schedule Gaps](https://help.salesforce.com/articleView?id=sf.pfs_fill_schedule.htm&language=en_US)
- [Salesforce Help: Schedule Appointments Using Priorities](https://help.salesforce.com/articleView?id=sf.pfs_scheduling_priority.htm&language=en_US)
- [Salesforce Help: Work Rule Type: Service Appointment Visiting Hours](https://help.salesforce.com/s/articleView?id=sf.pfs_optimization_theory_work_rules_visiting_hours.htm&language=en_US)

### WorkOrderLineItem Custom Fields

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_custom_fields_object_workorderlineitem.htm

Custom fields associated with a subtask on a work order in field service.

**Standard Fields:** The standard fields are documented in the
[WorkOrderLineItem](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workorderlineitem.htm)
object reference.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Custom Fields

| Field                     | Type      | Properties                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------- | --------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FSL**IsFillInCandidate**c | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update | Determines if this work order line item is considered as a candidate when filling in a schedule with the Fill-In Schedule feature. If a service appointment's parent record is a work order line item, this field must also be set to true for the appointment to be a candidate. Alternatively, you can create a custom checkbox field through the Field Service Settings page, instead of using this field, to evaluate whether this appointment is considered as a candidate. The custom checkbox field includes formula fields. The default value is `true`. |
| FSL**VisitingHours**c     | reference | Create, Filter, Group, Nillable, Sort, Update            | The visiting hours that define when service appointments associated with the work order line item can be scheduled. Visiting hours are enforced only if the Visiting Hours work rule is part of the scheduling policy. This is a relationship field. Relationship Name: FSL**VisitingHours**r, Relationship Type: Lookup, Refers To: OperatingHours                                                                                                                                                                                                              |

**See Also:**

- [Salesforce Object Reference: WorkOrderLineItem](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workorderlineitem.htm)
- [Salesforce Help: Fill Schedule Gaps](https://help.salesforce.com/articleView?id=sf.pfs_fill_schedule.htm&language=en_US)
- [Salesforce Help: Work Rule Type: Service Appointment Visiting Hours](https://help.salesforce.com/s/articleView?id=sf.pfs_optimization_theory_work_rules_visiting_hours.htm&language=en_US)

### Address Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_address.htm

Represents a mailing, billing, or home address.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** The following access checks must be enabled:

- Industries Insurance
- Retail Execution
- Industries Visit
- **Field Service**
- Order Management (Perms: FulfillmentOrder, OrderSummary,
  AdvancedOrderManagement, OrderCCS; Prefs: OrdersEnabled,
  EnhancedCommerceOrders)
- Public Sector
- Employee Experience
- Contact Tracing For Employees

**Note:** You can create an address only when creating a location.

#### Fields

| Field              | Type      | Properties                                                         | Description                                                                                                                                                                                                     |
| ------------------ | --------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Address            | address   | Filter, Nillable                                                   | The full address.                                                                                                                                                                                               |
| AddressType        | picklist  | Create, Defaulted on create, Filter, Group, Nillable, Sort, Update | Picklist of address types. Values: Mailing, Shipping, Billing, Home                                                                                                                                             |
| City               | string    | Create, Filter, Group, Nillable, Sort, Update                      | The address city.                                                                                                                                                                                               |
| Country            | string    | Create, Filter, Group, Nillable, Sort, Update                      | The address country.                                                                                                                                                                                            |
| Description        | string    | Create, Filter, Group, Nillable, Sort, Update                      | A brief description of the address.                                                                                                                                                                             |
| DrivingDirections  | string    | Create, Filter, Nillable, Sort, Update                             | Directions to the address.                                                                                                                                                                                      |
| GeocodeAccuracy    | picklist  | Create, Filter, Group, Nillable, Restricted picklist, Sort, Update | The level of accuracy of a location's geographical coordinates compared with its physical address. A geocoding service typically provides this value based on the address's latitude and longitude coordinates. |
| LastReferencedDate | dateTime  | Filter, Nillable, Sort                                             | The most recent date on which a user referenced this record.                                                                                                                                                    |
| LastViewedDate     | dateTime  | Filter, Nillable, Sort                                             | The most recent date on which a user viewed this record.                                                                                                                                                        |
| Latitude           | double    | Create, Filter, Nillable, Sort, Update                             | Used with Longitude to specify the precise geolocation of the address. Acceptable values are numbers between –90 and 90 with up to 15 decimal places.                                                           |
| LocationType       | picklist  | Create, Defaulted on create, Filter, Group, Sort, Update           | Picklist of location types. Values: Warehouse (default), Site, Van, Plant                                                                                                                                       |
| Longitude          | double    | Create, Filter, Nillable, Sort, Update                             | Used with Latitude to specify the precise geolocation of the address. Acceptable values are numbers between –180 and 180 with up to 15 decimal places.                                                          |
| Name               | string    | Autonumber, Defaulted on create, Filter, idLookup, Sort            | Name of the address.                                                                                                                                                                                            |
| ParentId           | reference | Create, Filter, Group, Sort                                        | A lookup field to the parent location. This is a relationship field. Relationship Name: Parent, Relationship Type: Lookup, Refers To: Location                                                                  |
| PostalCode         | string    | Create, Filter, Group, Nillable, Sort, Update                      | The address postal code.                                                                                                                                                                                        |
| State              | string    | Create, Filter, Group, Nillable, Sort, Update                      | The address state.                                                                                                                                                                                              |
| Street             | textarea  | Create, Filter, Group, Nillable, Sort, Update                      | The address street.                                                                                                                                                                                             |
| TimeZone           | picklist  | Create, Filter, Group, Nillable, Restricted picklist, Sort, Update | Picklist of available time zones.                                                                                                                                                                               |

#### Usage

**Important:** "Address" in Salesforce can also refer to the Address compound
field found on many standard objects. When referencing the Address object in
your Apex code, always use `Schema.Address` instead of `Address` to prevent
confusion with the standard Address compound field. If referencing both the
address object and the Address field in the same snippet, you can differentiate
between the two by using `System.Address` for the field and `Schema.Address` for
the object.

#### Associated Object

**AddressHistory** (API version 62.0+): History is available for tracked fields
of the object.

---

## Field Service Object API References

Detailed API reference information for Field Service objects. For custom fields
on these objects, see the
[Field Service Custom Fields on Standard Objects](#field-service-custom-fields-on-standard-objects)
section.

### ServiceAppointment Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceappointment.htm

Represents an appointment to complete work for a customer in Field Service,
Lightning Scheduler, Intelligent Appointment Management, and Virtual Care. This
object is available in API version 38.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service must be enabled.

#### Fields

| Field                   | Type      | Properties                                    | Description                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | --------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AccountId               | reference | Filter, Group, Nillable, Sort                 | (Read only) The account associated with the appointment. If the parent record is a work order or work order line item, this field’s value is inherited from the parent. Otherwise, it remains blank. This is a relationship field.                                                                                                                               |
| ActualDuration          | double    | Create, Filter, Nillable, Sort, Update        | The number of minutes that it took the resource to complete the appointment after arriving at the address. When values are first added to the Actual Start and Actual End fields, the Actual Duration is automatically populated to list the difference between the Actual Start and Actual End. If the Actual Start and Actual End fields are subsequently up   |
| ActualEndTime           | dateTime  | Create, Filter, Nillable, Sort, Update        | The actual date and time the appointment ended.                                                                                                                                                                                                                                                                                                                  |
| ActualStartTime         | dateTime  | Create, Filter, Nillable, Sort, Update        | The actual date and time the appointment started.                                                                                                                                                                                                                                                                                                                |
| Address                 | address   | Filter                                        | The address where the appointment is taking place. The address is inherited from the parent record if the parent record is a work order or work order line item.                                                                                                                                                                                                 |
| ArrivalWindowEndTime    | dateTime  | Create, Filter, Nillable, Sort, Update        | The end of the window of time in which the technician is scheduled to arrive at the site. This window is typically larger than the Scheduled Start and End window to allow time for delays and scheduling changes. You may choose to share the Arrival Window Start and End with the customer, but keep the Scheduled Start and End internal-only.               |
| ArrivalWindowStartTime  | dateTime  | Create, Filter, Nillable, Sort, Update        | The beginning of the window of time in which the technician is scheduled to arrive at the site. This window is typically larger than the Scheduled Start and End window to allow time for delays and scheduling changes. You may choose to share the Arrival Window Start and End with the customer, but keep the Scheduled Start and End internal-only.         |
| BundlePolicyId          | reference | Create, Filter, Group, Nillable, Sort, Update | Reference to the bundle policy associated with this service appointment. This is a relationship field.                                                                                                                                                                                                                                                           |
| City                    | string    | Create, Filter, Group, Nillable, Sort, Update | The city where the appointment is completed. Maximum length is 40 characters.                                                                                                                                                                                                                                                                                    |
| ContactId               | reference | Create, Filter, Group, Nillable, Sort, Update | The contact associated with the parent record. If needed, you can manually update the service appointment contact. This is a relationship field.                                                                                                                                                                                                                 |
| Country                 | string    | Create, Filter, Group, Nillable, Sort, Update | The country where the work order is completed. Maximum length is 80 characters.                                                                                                                                                                                                                                                                                  |
| Description             | textarea  | Create, Nillable, Update                      | The description of the appointment.                                                                                                                                                                                                                                                                                                                              |
| DueDate                 | dateTime  | Create, Filter, Sort, Update                  | The date by which the appointment must be completed. Earliest Start Permitted and Due Date typically reflect terms in the customer’s service-level agreement.                                                                                                                                                                                                    |
| Duration                | double    | Create, Nillable, Filter, Sort, Update        | The estimated length of the appointment. If the parent record is work order or work order line item, the appointment inherits its parent’s duration, but it can be manually updated. The duration is in minutes or hours based on the value selected in the Duration Type field.                                                                                 |
| EarliestStartTime       | dateTime  | Create, Filter, Sort, Update                  | The date after which the appointment must be completed. Earliest Start Permitted and Due Date typically reflect terms in the customer’s service-level agreement.                                                                                                                                                                                                 |
| LastReferencedDate      | dateTime  | Filter, Nillable, Sort                        | The date when the service appointment was last modified. Its label in the user interface is Last Modified Date.                                                                                                                                                                                                                                                  |
| LastViewedDate          | dateTime  | Filter, Nillable, Sort                        | The date when the service appointment was last viewed.                                                                                                                                                                                                                                                                                                           |
| Latitude                | double    | Create, Filter, Nillable, Sort, Update        | Used with Longitude to specify the precise geolocation of the address where the service appointments is completed. Acceptable values are numbers between –90 and 90 with up to 15 decimal places. To integrate data from an external data source for latitude, map your data to the ServiceAppointment.Latitude and not the ServiceAppointment.FSL\_\_InternalSL |
| Longitude               | double    | Create, Filter, Nillable, Sort, Update        | Used with Latitude to specify the precise geolocation of the address where the service appointment is completed. Acceptable values are numbers between –180 and 180 with up to 15 decimal places. To integrate data from an external data source for longitude, map your data to the ServiceAppointment.Longitude and not the ServiceAppointment.FSL\_\_Internal |
| ParentRecordId          | reference | Create, Filter, Group, Nillable, Sort         | The parent record associated with the appointment. The parent record can’t be updated after the service appointment is created. This is a polymorphic relationship field.                                                                                                                                                                                        |
| ParentRecordType        | string    | Filter, Group, Nillable, Sort                 | (Read only) The type of parent record: Account, Asset, Lead, Opportunity, Work Order, or Work Order Line Item.                                                                                                                                                                                                                                                   |
| PostalCode              | string    | Create, Filter, Group, Nillable, Sort, Update | The postal code where the work order is completed. Maximum length is 20 characters.                                                                                                                                                                                                                                                                              |
| RelatedBundleId         | reference | Create, Filter, Group, Nillable, Sort, Update | The bundle that this service appointment is a member of. This is a relationship field.                                                                                                                                                                                                                                                                           |
| SchedEndTime            | dateTime  | Create, Filter, Nillable, Sort, Update        | The time at which the appointment is scheduled to end. If you are using the Field Service managed package with the scheduling optimizer, this field is populated once the appointment is assigned to a resource. Scheduled End – Scheduled Start = Estimated Duration.                                                                                           |
| SchedStartTime          | dateTime  | Create, Filter, Nillable, Sort, Update        | The time at which the appointment is scheduled to start. If you are using the Field Service managed package with the scheduling optimizer, this field is populated once the appointment is assigned to a resource.                                                                                                                                               |
| ServiceDocumentTemplate | string    | Create, Filter, Group, Nillable, Sort, Update | The template ID which sets the template for each service document for the Document Builder feature.                                                                                                                                                                                                                                                              |
| ServiceTerritoryId      | reference | Create, Filter, Group, Nillable, Sort, Update | The service territory associated with the appointment. If the parent record is a work order or work order line item, the appointment inherits its parent’s service territory. This is a relationship field.                                                                                                                                                      |
| State                   | string    | Create, Filter, Group, Nillable, Sort, Update | The state where the service appointment is completed. Maximum length is 80 characters.                                                                                                                                                                                                                                                                           |
| Street                  | textarea  | Create, Filter, Group, Nillable, Sort, Update | The street number and name where the service appointment is completed.                                                                                                                                                                                                                                                                                           |
| Subject                 | string    | Create, Filter, Group, Nillable, Sort, Update | A short phrase describing the appointment.                                                                                                                                                                                                                                                                                                                       |
| Transaction             | string    | Create, Filter, Group, Nillable, Sort, Update | The last transaction ID of the scheduling and optimization request that updated this object. The transaction ID is automatically generated and populated by the Enhanced Scheduling and Optimization engine. Available in API version 63.0 and later.                                                                                                            |
| WorkTypeId              | reference | Create, Filter, Group, Nillable, Sort, Update | The work type associated with the service appointment. The work type is inherited from the appointment’s parent record if the parent is a work order or work order line item.If Lightning Scheduler is also in use, this field is editable. However, users see an error if they update it to list a different work type than the parent record’s work type. Th   |

**Note:** For custom fields, see
[ServiceAppointment Custom Fields](#serviceappointment-custom-fields).

#### Fields

| Field                   | Type      | Properties                                    | Description                                                                                                                                                                                                                                                                                                                                       |
| ----------------------- | --------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AccountId               | reference | Filter, Group, Nillable, Sort                 | (Read only) The account associated with the appointment. If the parent record is a work order or work order line item, this field's value is inherited from the parent. Otherwise, it remains blank. This is a relationship field. Relationship Name: Account, Relationship Type: Lookup, Refers To: Account                                      |
| ActualDuration          | double    | Create, Filter, Nillable, Sort, Update        | The number of minutes that it took the resource to complete the appointment after arriving at the address. When values are first added to the Actual Start and Actual End fields, the Actual Duration is automatically populated to list the difference between the Actual Start and Actual End.                                                  |
| ActualEndTime           | dateTime  | Create, Filter, Nillable, Sort, Update        | The actual date and time the appointment ended.                                                                                                                                                                                                                                                                                                   |
| ActualStartTime         | dateTime  | Create, Filter, Nillable, Sort, Update        | The actual date and time the appointment started.                                                                                                                                                                                                                                                                                                 |
| Address                 | address   | Filter                                        | The address where the appointment is taking place. The address is inherited from the parent record if the parent record is a work order or work order line item.                                                                                                                                                                                  |
| ArrivalWindowEndTime    | dateTime  | Create, Filter, Nillable, Sort, Update        | The end of the window of time in which the technician is scheduled to arrive at the site. This window is typically larger than the Scheduled Start and End window to allow time for delays and scheduling flexibility.                                                                                                                            |
| ArrivalWindowStartTime  | dateTime  | Create, Filter, Nillable, Sort, Update        | The beginning of the window of time in which the technician is scheduled to arrive at the site. This window is typically larger than the Scheduled Start and End window to allow time for delays and scheduling flexibility.                                                                                                                      |
| BundlePolicyId          | reference | Create, Filter, Group, Nillable, Sort, Update | Reference to the bundle policy associated with this service appointment. This is a relationship field.                                                                                                                                                                                                                                            |
| City                    | string    | Create, Filter, Group, Nillable, Sort, Update | The city where the appointment is completed. Maximum length is 40 characters.                                                                                                                                                                                                                                                                     |
| ContactId               | reference | Create, Filter, Group, Nillable, Sort, Update | The contact associated with the parent record. If needed, you can manually update the service appointment contact. This is a relationship field. Relationship Name: Contact, Relationship Type: Lookup, Refers To: Contact                                                                                                                        |
| Country                 | string    | Create, Filter, Group, Nillable, Sort, Update | The country where the work order is completed. Maximum length is 80 characters.                                                                                                                                                                                                                                                                   |
| Description             | textarea  | Create, Nillable, Update                      | The description of the appointment.                                                                                                                                                                                                                                                                                                               |
| DueDate                 | dateTime  | Create, Filter, Sort, Update                  | The date by which the appointment must be completed. Earliest Start Permitted and Due Date typically reflect terms in the customer's service-level agreement.                                                                                                                                                                                     |
| Duration                | double    | Create, Nillable, Filter, Sort, Update        | The estimated length of the appointment. If the parent record is work order or work order line item, the appointment inherits its parent's duration, but it can be manually updated. The duration is in minutes.                                                                                                                                  |
| EarliestStartTime       | dateTime  | Create, Filter, Sort, Update                  | The date after which the appointment must be completed. Earliest Start Permitted and Due Date typically reflect terms in the customer's service-level agreement.                                                                                                                                                                                  |
| LastReferencedDate      | dateTime  | Filter, Nillable, Sort                        | The date when the service appointment was last modified. Its label in the user interface is Last Modified Date.                                                                                                                                                                                                                                   |
| LastViewedDate          | dateTime  | Filter, Nillable, Sort                        | The date when the service appointment was last viewed.                                                                                                                                                                                                                                                                                            |
| Latitude                | double    | Create, Filter, Nillable, Sort, Update        | Used with Longitude to specify the precise geolocation of the address where the service appointments is completed. Acceptable values are numbers between –90 and 90 with up to 15 decimal places.                                                                                                                                                 |
| Longitude               | double    | Create, Filter, Nillable, Sort, Update        | Used with Latitude to specify the precise geolocation of the address where the service appointment is completed. Acceptable values are numbers between –180 and 180 with up to 15 decimal places.                                                                                                                                                 |
| ParentRecordId          | reference | Create, Filter, Group, Nillable, Sort         | The parent record associated with the appointment. The parent record can't be updated after the service appointment is created. This is a polymorphic relationship field.                                                                                                                                                                         |
| ParentRecordType        | string    | Filter, Group, Nillable, Sort                 | (Read only) The type of parent record: Account, Asset, Lead, Opportunity, Work Order, or Work Order Line Item.                                                                                                                                                                                                                                    |
| PostalCode              | string    | Create, Filter, Group, Nillable, Sort, Update | The postal code where the work order is completed. Maximum length is 20 characters.                                                                                                                                                                                                                                                               |
| RelatedBundleId         | reference | Create, Filter, Group, Nillable, Sort, Update | The bundle that this service appointment is a member of. This is a relationship field.                                                                                                                                                                                                                                                            |
| SchedEndTime            | dateTime  | Create, Filter, Nillable, Sort, Update        | The time at which the appointment is scheduled to end. If you are using the Field Service managed package with the scheduling optimizer, this field is populated once the appointment is assigned to a resource.                                                                                                                                  |
| SchedStartTime          | dateTime  | Create, Filter, Nillable, Sort, Update        | The time at which the appointment is scheduled to start. If you are using the Field Service managed package with the scheduling optimizer, this field is populated once the appointment is assigned to a resource.                                                                                                                                |
| ServiceDocumentTemplate | string    | Create, Filter, Group, Nillable, Sort, Update | The template ID which sets the template for each service document for the Document Builder feature.                                                                                                                                                                                                                                               |
| ServiceTerritoryId      | reference | Create, Filter, Group, Nillable, Sort, Update | The service territory associated with the appointment. If the parent record is a work order or work order line item, the appointment inherits its parent's service territory. This is a relationship field. Relationship Name: ServiceTerritory, Relationship Type: Lookup, Refers To: ServiceTerritory                                           |
| State                   | string    | Create, Filter, Group, Nillable, Sort, Update | The state where the service appointment is completed. Maximum length is 80 characters.                                                                                                                                                                                                                                                            |
| Street                  | textarea  | Create, Filter, Group, Nillable, Sort, Update | The street number and name where the service appointment is completed.                                                                                                                                                                                                                                                                            |
| Subject                 | string    | Create, Filter, Group, Nillable, Sort, Update | A short phrase describing the appointment.                                                                                                                                                                                                                                                                                                        |
| Transaction             | string    | Create, Filter, Group, Nillable, Sort, Update | The last transaction ID of the scheduling and optimization request that updated this object. The transaction ID is automatically generated and populated by the Enhanced Scheduling and Optimization engine.                                                                                                                                      |
| WorkTypeId              | reference | Create, Filter, Group, Nillable, Sort, Update | The work type associated with the service appointment. The work type is inherited from the appointment's parent record if the parent is a work order or work order line item. If Lightning Scheduler is active, this field is required. This is a relationship field. Relationship Name: WorkType, Relationship Type: Lookup, Refers To: WorkType |

### ServiceResource Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceresource.htm

Represents a service technician or service crew in Field Service and Salesforce
Scheduler, or an agent in Workforce Engagement. This object is available in API
version 38.0 and later.

**Supported Calls:** create(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), update(), upsert()

**Note:** This object does not support delete() or undelete() calls.

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field                 | Type      | Properties                                    | Description                                                                                                                                                                                                                                                                                                                                                    |
| --------------------- | --------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Description           | textarea  | Create, Nillable, Update                      | The description of the resource.                                                                                                                                                                                                                                                                                                                               |
| LastKnownLatitude     | double    | Create, Filter, Nillable, Sort, Update        | The latitude of the last known location.                                                                                                                                                                                                                                                                                                                       |
| LastKnownLongitude    | double    | Create, Filter, Nillable, Sort, Update        | The longitude of the last known location.                                                                                                                                                                                                                                                                                                                      |
| LastKnownLocation     | location  | Nillable                                      | The service resource’s last known location. You can configure this field to display data collected from a custom mobile app. This field isn’t visible in the user interface, but you can expose it on service resource page layouts or set up field tracking to be able to view a resource’s location history.                                                 |
| LastKnownLocationDate | dateTime  | Filter, Nillable, Sort, Update                | The date and time of the last known location.                                                                                                                                                                                                                                                                                                                  |
| LastReferencedDate    | dateTime  | Filter, Nillable, Sort                        | The date when the service resource was last modified. Its label in the user interface is Last Modified Date.                                                                                                                                                                                                                                                   |
| LastViewedDate        | dateTime  | Filter, Nillable, Sort                        | The date when the service resource was last viewed.                                                                                                                                                                                                                                                                                                            |
| LocationId            | reference | Create, Filter, Group, Sort, Nillable, Update | The location associated with the service resource. For example, a service vehicle driven by the service resource. LocationId is a relationship field.                                                                                                                                                                                                          |
| Name                  | string    | Create, Filter, Group, idLookup, Sort, Update | The resource’s name, for example the name or title of the associated user or service crew.                                                                                                                                                                                                                                                                     |
| RelatedRecordId       | reference | Create, Filter, Group, Sort, Nillable, Update | The associated user. Its label in the UI is User. If the service resource represents a service crew rather than a user, leave the User field blank and select the related crew in the ServiceCrewId field. RelatedRecordId is a relationship field.                                                                                                            |
| ServiceCrewId         | reference | Create, Filter, Group, Sort, Nillable, Update | The associated service crew. If the service resource represents a crew, select the crew.This field is hidden for all users by default. To use it, update its field-level security settings in Setup and add it to your service resource page layouts. Associated Objects This object has the following associated objects. If the API version isn’t specified, |

**Note:** For custom fields, see
[ServiceResource Custom Fields](#serviceresource-custom-fields).

### ServiceTerritory Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceterritory.htm

Represents a geographic or functional region in which work can be performed in
Field Service, Salesforce Scheduler, or Workforce Engagement. This object is
available in API version 38.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field                        | Type      | Properties                                    | Description                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------- | --------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Address                      | address   | Filter                                        | An address to associate with the territory. For example, you can list the address of the territory’s headquarters.                                                                                                                                                                                                                                             |
| AvgTravelTime                | int       | Create, Filter, Group, Nillable, Sort, Update | The average travel time for this service territory. The value is added to the Work Capacity Usage for each scheduled service appointment in the service territory. Available in API version 59.0 and later.                                                                                                                                                    |
| City                         | string    | Create, Filter, Group, Nillable, Sort, Update | The city of the associated address. Maximum length is 40 characters.                                                                                                                                                                                                                                                                                           |
| Country                      | string    | Create, Filter, Group, Nillable, Sort, Update | The country to associate with the territory. Maximum length is 80 characters.                                                                                                                                                                                                                                                                                  |
| Description                  | textarea  | Create, Nillable, Update                      | The description of the territory.                                                                                                                                                                                                                                                                                                                              |
| LastReferencedDate           | dateTime  | Filter, Nillable, Sort                        | The date when the territory was last modified. Its label in the user interface is Last Modified Date.                                                                                                                                                                                                                                                          |
| LastViewedDate               | dateTime  | Filter, Nillable, Sort                        | The date when the territory was last viewed.                                                                                                                                                                                                                                                                                                                   |
| Latitude                     | double    | Create, Filter, Nillable, Sort, Update        | Used with Longitude to specify the precise geolocation of the address associated with the territory. Acceptable values are numbers between –90 and 90 with up to 15 decimal places.This field is available in the API only.                                                                                                                                    |
| Longitude                    | double    | Create, Filter, Nillable, Sort, Update        | Used with Latitude to specify the precise geolocation of the address associated with the territory. Acceptable values are numbers between –180 and 180 with up to 15 decimal places.This field is available in the API only.                                                                                                                                   |
| Name                         | string    | Create, Filter, Group, idLookup, Sort, Update | The name of the territory.                                                                                                                                                                                                                                                                                                                                     |
| OperatingHoursId             | reference | Create, Filter, Group, Sort, Update           | The territory’s operating hours, which indicate when service appointments within the territory can occur. Service resources who are members of a territory automatically inherit the territory’s operating hours unless different hours are specified on the resource record. This field is a relationship field.                                              |
| ParentTerritoryId            | reference | Create, Filter, Group, Nillable, Sort, Update | The territory’s parent service territory, if it has one. For example, a Northern California territory can have a State of California territory as its parent. A service territory hierarchy can contain up to 10,000 territories. This field is a relationship field.                                                                                          |
| PostalCode                   | string    | Create, Filter, Group, Nillable, Sort, Update | The postal code of the address associated with the territory. Maximum length is 20 characters.                                                                                                                                                                                                                                                                 |
| State                        | string    | Create, Filter, Group, Nillable, Sort, Update | The state of the address associated with the territory. Maximum length is 80 characters.                                                                                                                                                                                                                                                                       |
| Street                       | textarea  | Create, Filter, Group, Nillable, Sort, Update | The street number and name of the address associated with the territory.                                                                                                                                                                                                                                                                                       |
| TopLevelTerritoryId          | reference | Filter, Group, Nillable, Sort                 | (Read only) The top-level territory in a hierarchy of service territories. Depending on where a territory lies in the hierarchy, its top-level territory can be the same as its parent. This field is a relationship field.                                                                                                                                    |
| TravelModeId                 | reference | Create, Filter, Group, Nillable, Sort, Update | ID of the TravelMode used for travel time calculations. The travel mode includes information about the type of transportation, such as a car or walking, whether a vehicle can take toll roads, and whether a vehicle is transporting hazardous materials. This field is a relationship field.                                                                 |
| TravelTimeBuffer             | int       | Create, Filter, Group, Nillable, Sort, Update | Add additional time to driving time, such as time to find parking or to walk to the site. This value overrides the Travel Time Buffer value defined in Field Service Settings \| Scheduling \| Routing.                                                                                                                                                        |
| TypicalInTerritoryTravelTime | double    | Create, Filter, Nillable, Sort, Update        | Estimated number of minutes needed to travel from one location to another within the service territory. You can use this field in Apex customization. Usage If you want to use service territories, determine which territories to create. Depending on how your business works, you can create territories based on cities or counties, or on functional cate |

**Note:** For custom fields, see
[ServiceTerritory Custom Fields](#serviceterritory-custom-fields).

### WorkOrder Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workorder.htm

Represents field service work to be performed for a customer. This object is
available in API version 36.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field                          | Type      | Properties                                               | Description                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------ | --------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AccountId                      | reference | Create, Filter, Group, Nillable, Sort, Update            | The account associated with the work order. This is a relationship field.                                                                                                                                                                                                                                                                                      |
| Address                        | address   | Filter, Nillable                                         | The compound form of the address where the work order is completed.                                                                                                                                                                                                                                                                                            |
| AssetId                        | reference | Create, Filter, Group, Nillable, Sort, Update            | The asset associated with the work order. This is a relationship field.                                                                                                                                                                                                                                                                                        |
| AssetWarrantyId                | reference | Create, Filter, Group, Nillable, Sort, Update            | The asset warranty term associated with the work order. This field is available in API version 50.0 and above.                                                                                                                                                                                                                                                 |
| BusinessHoursId                | reference | Create, Filter, Group, Nillable, Sort, Update            | The business hours associated with the work order. This is a relationship field.                                                                                                                                                                                                                                                                               |
| CaseId                         | reference | Create, Filter, Group, Nillable, Sort, Update            | The case associated with the work order. This is a relationship field.                                                                                                                                                                                                                                                                                         |
| City                           | string    | Create, Filter, Group, Nillable, Sort, Update            | The city where the work order is completed. Maximum length is 40 characters.                                                                                                                                                                                                                                                                                   |
| ContactId                      | reference | Create, Filter, Group, Nillable, Sort, Update            | The contact associated with the work order. This is a relationship field.                                                                                                                                                                                                                                                                                      |
| Country                        | string    | Create, Filter, Group, Nillable, Sort, Update            | The country where the work order is completed. Maximum length is 80 characters.                                                                                                                                                                                                                                                                                |
| Description                    | textarea  | Create, Nillable, Update                                 | The description of the work order. Try to include the steps needed to change the work order’s status to Completed.                                                                                                                                                                                                                                             |
| Discount                       | percent   | Filter, Nillable, Sort                                   | Read only. The weighted average of the discounts on all line items in the work order. It can be any positive number up to 100.                                                                                                                                                                                                                                 |
| Duration                       | double    | Create, Filter, Nillable, Sort, Update                   | The estimated time required to complete the work order. Specify the duration unit in the Duration Type field. If the Duration field on a Work Order is null, it adopts the duration value from the Work Type object when the work type is updated or inserted.Work order duration and work order line item duration are independent of each other. If you want |
| DurationInMinutes              | double    | Filter, Nillable, Sort                                   | The estimated duration in minutes. For internal use only.                                                                                                                                                                                                                                                                                                      |
| EndDate                        | dateTime  | Create, Filter, Nillable, Sort, Update                   | The date when the work order is completed. This field is blank unless you set up an Apex trigger or quick action to populate it. For example, you can create a quick action that sets the EndDate to 365 days after the StartDate.                                                                                                                             |
| EntitlementId                  | reference | Create, Filter, Group, Nillable, Sort, Update            | The entitlement associated with the work order.                                                                                                                                                                                                                                                                                                                |
| GrandTotal                     | currency  | Filter, Nillable, Sort                                   | Read only. The total price of the work order with tax added.                                                                                                                                                                                                                                                                                                   |
| IsClosed                       | boolean   | Defaulted on create, Filter, Group, Sort                 | Indicates whether the work order is closed (true) or open (false). Use this field to report on closed versus open work orders.                                                                                                                                                                                                                                 |
| IsGeneratedFromMaintenancePlan | boolean   | Defaulted on create, Filter, Group, Sort                 | (Read Only) Indicates that the work order was generated from a maintenance plan (true), rather than manually created (false). This option is deselected for work orders that were generated from maintenance plans before Summer ’18.                                                                                                                          |
| IsStopped                      | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update | Indicates whether a milestone is paused (true) or counting down (false). This field is available only if Enable stopped time and actual elapsed time is selected on the Entitlement Settings page.                                                                                                                                                             |
| LastReferencedDate             | dateTime  | Filter, Nillable, Sort                                   | The date when the work order was last modified. Its label in the user interface is Last Modified Date.                                                                                                                                                                                                                                                         |
| LastViewedDate                 | dateTime  | Filter, Nillable, Sort                                   | The date when the work order was last viewed.                                                                                                                                                                                                                                                                                                                  |
| Latitude                       | double    | Create, Filter, Nillable, Sort, Update                   | Used with Longitude to specify the precise geolocation of the address where the work order is completed. Acceptable values are numbers between –90 and 90 with up to 15 decimal places. See Compound Field Considerations and Limitations for details on geolocation compound fields.This field is available in the API only.                                  |
| LineItemCount                  | int       | Filter, Group, Nillable, Sort                            | The number of work order line items in the work order. Its label in the user interface is Line Items.                                                                                                                                                                                                                                                          |
| LocationId                     | reference | Create, Filter, Group, Nillable, Sort, Update            | The location associated with the work order. For example, a work site. This is a relationship field.                                                                                                                                                                                                                                                           |
| Longitude                      | double    | Create, Filter, Nillable, Sort, Update                   | Used with Latitude to specify the precise geolocation of the address where the work order is completed. Acceptable values are numbers between –180 and 180 with up to 15 decimal places. See Compound Field Considerations and Limitations for details on geolocation compound fields.This field is available in the API only.                                 |
| MaintenancePlanId              | reference | Create, Filter, Group, Nillable, Sort, Update            | The maintenance plan associated with the work order. When the work order is auto-generated from a maintenance plan, this field automatically lists the related plan.                                                                                                                                                                                           |
| MaintenanceWorkRuleId          | reference | Filter, Group, Nillable, Sort                            | ID of the maintenance work rule that generated this work order. This field is available in API version 50.0 and above.                                                                                                                                                                                                                                         |
| MilestoneStatus                | string    | Group, Nillable, Sort                                    | Indicates the status of a milestone. This field is visible if an entitlement process is applied to a work order.                                                                                                                                                                                                                                               |
| MinimumCrewSize                | int       | Create, Filter, Group, Nillable, Sort, Update            | The minimum crew size allowed for a crew assigned to the work order. If you’re not using the Field Service managed package, this field serves as a suggestion rather than a rule. If you are using the managed package, the scheduling optimizer counts the number of service crew members on a service crew to determine whether it fits a work order’s minim |
| ParentWorkOrderId              | reference | Create, Filter, Group, Nillable, Sort, Update            | The work order’s parent work order, if it has one.Create a custom report to view a work order’s child work orders. This is a relationship field.                                                                                                                                                                                                               |
| PostWorkSummary                | textarea  | Create, Nillable, Update                                 | The summary of a completed work order that’s either entered manually or created by an AI agent.                                                                                                                                                                                                                                                                |
| PostalCode                     | string    | Create, Filter, Group, Nillable, Sort, Update            | The postal code where the work order is completed. Maximum length is 20 characters.                                                                                                                                                                                                                                                                            |
| PreWorkBriefPromptTemplate     | string    | Create, Filter, Group, Nillable, Sort, Update            | The ID of the activated Pre-Work Brief prompt template.                                                                                                                                                                                                                                                                                                        |
| Pricebook2Id                   | reference | Create, Filter, Group, Nillable, Sort, Update            | The price book associated with the work order. Adding a price book to the work order lets you assign different price book entries to the work order’s line items. This is only available if Product2 is enabled. This is a relationship field.                                                                                                                 |
| ProductServiceCampaignId       | reference | Create, Filter, Group, Nillable, Sort, Update            | The product service campaign associated with the work order.                                                                                                                                                                                                                                                                                                   |
| ProductServiceCampaignItemId   | reference | Create, Filter, Group, Nillable, Sort, Update            | The product service campaign item associated with the work order.                                                                                                                                                                                                                                                                                              |
| RecommendedCrewSize            | int       | Create, Filter, Group, Nillable, Sort, Update            | The recommended number of people on the service crew assigned to the work order. For example, you might have a Minimum Crew Size of 2 and a Recommended Crew Size of 3.                                                                                                                                                                                        |
| ReturnOrderId                  | reference | Filter, Group, Nillable, Sort                            | The return order associated with the work order.                                                                                                                                                                                                                                                                                                               |
| ReturnOrderLineItemId          | reference | Create, Filter, Group, Nillable, Sort, Update            | The return order line item associated with the work order.                                                                                                                                                                                                                                                                                                     |
| RootWorkOrderId                | reference | Filter, Group, Nillable, Sort                            | (Read only) The top-level work order in a work order hierarchy. Depending on where a work order lies in the hierarchy, its root could be the same as its parent.View a work order’s child work order in the Child Work Orders related list. This is a relationship field.                                                                                      |
| ServiceAppointmentCount        | int       | Filter, Group, Nillable, Sort                            | The number of service appointments on the work order.                                                                                                                                                                                                                                                                                                          |
| ServiceContractId              | reference | Create, Filter, Group, Nillable, Sort, Update            | The service contract associated with the work order.                                                                                                                                                                                                                                                                                                           |
| ServiceDocumentTemplate        | string    | Create, Filter, Group, Nillable, Sort, Update            | The template ID which sets the template for each service document for the Document Builder feature.                                                                                                                                                                                                                                                            |
| ServiceReportTemplateId        | reference | Create, Filter, Group, Nillable, Sort, Update            | The service report template that the work order uses. If you don’t specify a service report template on a work order, it uses the service report template listed on its work type. If the work type doesn’t list a template or no work type is specified, the work order uses the default service report template.                                             |
| ServiceTerritoryId             | reference | Create, Filter, Group, Nillable, Sort, Update            | The service territory where the work order is taking place. This is a relationship field.                                                                                                                                                                                                                                                                      |
| SlaExitDate                    | dateTime  | Filter, Nillable, Sort                                   | The time that the work order exits the entitlement process.                                                                                                                                                                                                                                                                                                    |
| SlaStartDate                   | dateTime  | Create, Filter, Nillable, Sort, Update                   | The time that the work order enters the entitlement process. You can update or reset the time if you have “Edit” permission on work orders.                                                                                                                                                                                                                    |
| StartDate                      | dateTime  | Create, Filter, Nillable, Sort, Update                   | The date when the work order goes into effect. This field is blank unless you set up an Apex trigger or quick action to populate it. For example, you can create a quick action that sets the StartDate to the date when the Status changes to In Progress.                                                                                                    |
| State                          | string    | Create, Filter, Group, Nillable, Sort, Update            | The state where the work order is completed. Maximum length is 80 characters.                                                                                                                                                                                                                                                                                  |
| StopStartDate                  | dateTime  | Filter, Nillable, Sort                                   | Indicates when the milestone was paused. The label in the user interface is Stopped Since.                                                                                                                                                                                                                                                                     |
| Street                         | textarea  | Create, Filter, Group, Nillable, Sort, Update            | The street number and name where the work order is completed.                                                                                                                                                                                                                                                                                                  |
| Subject                        | string    | Create, Filter, Group, Nillable, Sort, Update            | The subject of the work order. Try to describe the nature and purpose of the job to be completed. For example, “Annual On-Site Well Maintenance.” Maximum length is 255 characters.                                                                                                                                                                            |
| Subtotal                       | currency  | Filter, Nillable, Sort                                   | Read only. The total of the work order line items’ subtotals before discounts and taxes are applied.                                                                                                                                                                                                                                                           |
| SuggestedMaintenanceDate       | date      | Create, Filter, Group, Nillable, Sort, Update            | The suggested date that the work order is completed. When the work order is auto-generated from a maintenance plan, this field is automatically populated based on the maintenance plan’s settings.                                                                                                                                                            |
| Tax                            | currency  | Create, Filter, Nillable, Sort, Update                   | The total tax on the work order. You can enter a number with or without the currency symbol and use up to two decimal places. For example, in a work order whose total price is $100, enter $10 to apply a 10% tax.                                                                                                                                            |
| TotalPrice                     | currency  | Filter, Nillable, Sort                                   | Read only. The total of the work order line items’ prices. This value has discounts applied but not tax.                                                                                                                                                                                                                                                       |
| WorkTypeId                     | reference | Create, Filter, Group, Nillable, Sort, Update            | The work type associated with the work order. When a work type is selected, the work order automatically inherits the work type’s Duration, Duration Type, and required skills. If the Duration field for the work type is null, enter the duration value. This is a relationship field.                                                                       |

**Note:** This object is not tied to Field Service enablement (marked with \*).

**Note:** For custom fields, see
[WorkOrder Custom Fields](#workorder-custom-fields).

### WorkOrderLineItem Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workorderlineitem.htm

Represents a subtask on a work order in field service. This object is available
in API version 36.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field                          | Type      | Properties                                    | Description                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------ | --------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Address                        | address   | Filter, Nillable                              | The compound form of the address where the line item is completed.                                                                                                                                                                                                                                                                                             |
| AssetId                        | reference | Create, Filter, Group, Nillable, Sort, Update | The asset associated with the work order line item. The asset is not automatically inherited from the parent work order. This is a relationship field.                                                                                                                                                                                                         |
| AssetWarrantyId                | reference | Create, Filter, Group, Nillable, Sort, Update | The asset warranty term associated with the work order line item. This field is available in API version 50.0 and above.                                                                                                                                                                                                                                       |
| City                           | string    | Create, Filter, Group, Nillable, Sort, Update | The city where the line item is completed. Maximum length is 40 characters.                                                                                                                                                                                                                                                                                    |
| Country                        | string    | Create, Filter, Group, Nillable, Sort, Update | The country where the line item is completed. Maximum length is 80 characters.                                                                                                                                                                                                                                                                                 |
| Description                    | textarea  | Create, Nillable, Update                      | The description of the work order line item. Try to describe the steps needed to mark the line item Completed.                                                                                                                                                                                                                                                 |
| Discount                       | percent   | Create, Filter, Nillable, Sort, Update        | The percent discount to apply to the line item. You can enter a number with or without the percent symbol, and you can use up to two decimal places.                                                                                                                                                                                                           |
| Duration                       | double    | Create, Filter, Nillable, Sort, Update        | The estimated time required to complete the line item. Specify the duration unit in the Duration Type field. If the Duration field on a Work Order is null, it adopts the duration value from the Work Type object when the work type is updated or inserted.Work order duration and work order line item duration are independent of each other. If you want  |
| DurationInMinutes              | double    | Filter, Nillable, Sort                        | The estimated duration in minutes. For internal use only.                                                                                                                                                                                                                                                                                                      |
| EndDate                        | dateTime  | Create, Filter, Nillable, Sort, Update        | The date on which the line item is completed. This field is blank unless you set up an Apex trigger or quick action to populate it. For example, you can create a quick action that sets the EndDate to 365 days after the StartDate.                                                                                                                          |
| IsClosed                       | boolean   | Defaulted on create, Filter, Group, Sort      | Indicates whether the line item has been closed. Changing the line item’s status to Closed causes this checkbox to be selected in the user interface (sets IsClosed to true).Use this field to report on closed versus open work order line items.                                                                                                             |
| IsGeneratedFromMaintenancePlan | boolean   | Defaulted on create, Filter, Group, Sort      | Identifies whether the work order line item is generated from a maintenance plan.                                                                                                                                                                                                                                                                              |
| LastReferencedDate             | dateTime  | Filter, Nillable, Sort                        | The date when the line item was last modified. Its label in the user interface is Last Modified Date.                                                                                                                                                                                                                                                          |
| LastViewedDate                 | dateTime  | Filter, Nillable, Sort                        | The date when the line item was last viewed.                                                                                                                                                                                                                                                                                                                   |
| Latitude                       | double    | Create, Filter, Nillable, Sort, Update        | Used with Longitude to specify the precise geolocation of the address where the line item is completed. Acceptable values are numbers between –90 and 90 with up to 15 decimal places.This field is available in the API only.                                                                                                                                 |
| ListPrice                      | currency  | Filter, Nillable, Sort                        | The price of the line item (product) as listed in its corresponding price book entry. If a price book entry isn’t specified, the list price defaults to zero.                                                                                                                                                                                                  |
| LocationId                     | reference | Create, Filter, Group, Nillable, Sort, Update | A location associated with the work order line item. For example, a work site. This is a relationship field.                                                                                                                                                                                                                                                   |
| Longitude                      | double    | Create, Filter, Nillable, Sort, Update        | Used with Latitude to specify the precise geolocation of the address where the line item is completed. Acceptable values are numbers between –180 and 180 with up to 15 decimal places.This field is available in the API only.                                                                                                                                |
| MaintenancePlanId              | reference | Create, Filter, Group, Nillable, Sort, Update | The maintenance plan associated with the work order line item.                                                                                                                                                                                                                                                                                                 |
| MaintenanceWorkRuleId          | reference | Filter, Group, Nillable, Sort                 | ID of the maintenance work rule that generated this line item. This field is available in API version 50.0 and above.                                                                                                                                                                                                                                          |
| MinimumCrewSize                | int       | Create, Filter, Group, Nillable, Sort, Update | The minimum crew size allowed for a crew assigned to the line item. If you’re not using the Field Service managed package, this field serves as a suggestion rather than a rule. If you are using the managed package, the scheduling optimizer counts the number of service crew members on a service crew to determine whether it fits a work order line ite |
| OrderId                        | reference | Create, Filter, Group, Nillable, Sort, Update | The order associated with the line item. For example, you may need to order replacement parts before you can complete the line item. This is a relationship field.                                                                                                                                                                                             |
| ParentWorkOrderLineItemId      | reference | Create, Filter, Group, Nillable, Sort, Update | The line item’s parent work order line item, if it has one.Create a custom report to view a line item’s child line items. This is a relationship field.                                                                                                                                                                                                        |
| PostalCode                     | string    | Create, Filter, Group, Nillable, Sort, Update | The postal code where the line item is completed. Maximum length is 20 characters.                                                                                                                                                                                                                                                                             |
| PricebookEntryId               | reference | Create, Filter, Group, Nillable, Sort, Update | The price book entry (product) associated with the line item. The label in the user interface is Product. This field’s lookup search only returns products that are included in the work order’s price book. This is a relationship field.                                                                                                                     |
| Product2Id                     | reference | Create, Filter, Group, Nillable, Sort, Update | (Read only) The product associated with the price book entry. This field is not available in the user interface. For best results, use the PricebookEntryId field in any custom code or layouts. This is a relationship field.                                                                                                                                 |
| ProductServiceCampaignId       | reference | Filter, Group, Nillable, Sort                 | The product service campaign associated with the work order line item.                                                                                                                                                                                                                                                                                         |
| ProductServiceCampaignItemId   | reference | Create, Filter, Group, Nillable, Sort, Update | The product service campaign item associated with the work order line item.                                                                                                                                                                                                                                                                                    |
| Quantity                       | double    | Create, Filter, Nillable, Sort, Update        | Number of units of the line item included in the associated work order.                                                                                                                                                                                                                                                                                        |
| RecommendedCrewSize            | int       | Create, Filter, Group, Nillable, Sort, Update | The recommended number of people on the service crew assigned to the line item. For example, you might have a Minimum Crew Size of 2 and a Recommended Crew Size of 3.                                                                                                                                                                                         |
| ReturnOrderId                  | reference | Filter, Group, Nillable, Sort                 | The return order associated with the work order line item.                                                                                                                                                                                                                                                                                                     |
| ReturnOrderLineItemId          | reference | Create, Filter, Group, Nillable, Sort, Update | The return order line item associated with the work order line item.                                                                                                                                                                                                                                                                                           |
| RootWorkOrderLineItemId        | reference | Filter, Group, Nillable, Sort                 | (Read only) The top-level line item in a work order line item hierarchy. Depending on where a line item lies in the hierarchy, its root could be the same as its parent.View a line item’s child line items in the Child Work Order Line Items related list. This is a relationship field.                                                                     |
| ServiceAppointmentCount        | int       | Filter, Group, Nillable, Sort                 | The number of service appointments on the work order line item.                                                                                                                                                                                                                                                                                                |
| ServiceDocumentTemplate        | string    | Create, Filter, Group, Nillable, Sort, Update | The template ID which sets the template for each service document for the Document Builder feature.                                                                                                                                                                                                                                                            |
| ServiceReportTemplateId        | reference | Create, Filter, Group, Nillable, Sort, Update | The service report template that the line item uses. If you don’t specify a service report template on a work order line item, it uses the service report template listed on its work type. If the work type doesn’t list a template or no work type is specified, the line item uses the default service report template.                                     |
| ServiceTerritoryId             | reference | Create, Filter, Group, Nillable, Sort, Update | The service territory where the line item is completed. This is a relationship field.                                                                                                                                                                                                                                                                          |
| StartDate                      | dateTime  | Create, Filter, Nillable, Sort, Update        | The date on which the line item goes into effect. This field is blank unless you set up an Apex trigger or quick action to populate it. For example, you can create a quick action that sets the StartDate to the date when the Status changes to In Progress.                                                                                                 |
| State                          | string    | Create, Filter, Group, Nillable, Sort, Update | The state where the line item is completed. Maximum length is 80 characters.                                                                                                                                                                                                                                                                                   |
| Street                         | textarea  | Create, Filter, Group, Nillable, Sort, Update | The street number and name where the line item is completed.                                                                                                                                                                                                                                                                                                   |
| Subject                        | string    | Create, Filter, Group, Nillable, Sort, Update | A word or phrase describing the line item.                                                                                                                                                                                                                                                                                                                     |
| Subtotal                       | currency  | Filter, Nillable, Sort                        | (Read only) The line item’s unit price multiplied by the quantity.                                                                                                                                                                                                                                                                                             |
| SuggestedMaintenanceDate       | date      | Create, Filter, Group, Nillable, Sort, Update | Date when maintenance work is planned.                                                                                                                                                                                                                                                                                                                         |
| TotalPrice                     | currency  | Filter, Nillable, Sort                        | Read only. The line item’s subtotal with discounts applied.                                                                                                                                                                                                                                                                                                    |
| UnitPrice                      | currency  | Create, Filter, Nillable, Sort, Update        | Initially, the unit price for a work order line item is the line item’s list price from the price book, but you can change it.                                                                                                                                                                                                                                 |
| WorkOrderId                    | reference | Create, Filter, Group, Sort                   | The line item’s parent work order. Because work order line items must be associated with a work order, this is a required field. This is a relationship field.                                                                                                                                                                                                 |
| WorkTypeId                     | reference | Create, Filter, Group, Nillable, Sort, Update | The work type associated with the line item. When a work type is selected, the line item automatically inherits the work type’s Duration, Duration Type, and required skills. If the Duration field for the work type is null, enter the duration value. This is a relationship field.                                                                         |

**Note:** This object is not tied to Field Service enablement (marked with \*).

**Note:** For custom fields, see
[WorkOrderLineItem Custom Fields](#workorderlineitem-custom-fields).

### Location Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_location.htm

Represents a warehouse, service vehicle, work site, or other element of the
region where your team performs field service work. In API version 49.0 and
later, you can associate activities with specific locations. Activities, such as
the tasks and events related to a location, appear in the activities timeline
when you view the location detail page. Also in API version 49.0 and later,
Work.com users can view Employees as a related list on Location records. In API
version 51.0 and later, this object is available for Omnichannel Inventory and
represents physical locations where inventory is available for fulfilling
orders.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field                     | Type      | Properties                                    | Description                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------- | --------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AssignedFoCount           | int       | Create, Filter, Group, Nillable, Sort, Update | The number of fulfillment orders assigned to the location. Confirming held fulfillment order capacity increments this value. To reset the location’s capacity, set this value to 0. This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 55.0 an |
| CloseDate                 | date      | Create, Filter, Group, Nillable, Sort, Update | Date the location closed or went out of service.                                                                                                                                                                                                                                                                                                               |
| ConstructionEndDate       | date      | Create, Filter, Group, Nillable, Sort, Update | Date construction ended at the location.                                                                                                                                                                                                                                                                                                                       |
| ConstructionStartDate     | date      | Create, Filter, Group, Nillable, Sort, Update | Date construction began at the location.                                                                                                                                                                                                                                                                                                                       |
| DefaultPickupTime         | time      | Create, Filter, Group, Nillable, Sort, Update | Default pickup time at the location. This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 61.0 and later.                                                                                                                                        |
| DefaultProcessingTime     | int       | Create, Filter, Group, Nillable, Sort, Update | Default processing time at the location. This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 61.0 and later.                                                                                                                                    |
| DefaultProcessingTimeUnit | picklist  | Create, Filter, Group, Nillable, Sort, Update | Default processing time unit at the location. Possible values are: Hours Days Weeks This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 61.0 and later.                                                                                         |
| Description               | string    | Create, Filter, Group, Nillable, Sort, Update | A brief description of the location.                                                                                                                                                                                                                                                                                                                           |
| DrivingDirections         | string    | Create, Filter, Nillable, Sort, Update        | Directions to the location.                                                                                                                                                                                                                                                                                                                                    |
| EarliestPickupTimeOffset  | integer   | Create, Filter, Nillable, Sort, Update        | The earliest pickup time for BOPIS. This value is measured in minutes after the start of business hours.                                                                                                                                                                                                                                                       |
| ExternalReference         | string    | Create, Filter, Group, Nillable, Sort, Update | Identifier of a location.                                                                                                                                                                                                                                                                                                                                      |
| FoCapacity                | int       | Create, Filter, Group, Nillable, Sort, Update | The maximum number of fulfillment orders that can be assigned to the location per time period. If this value is null, then this location’s capacity isn’t limited. This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 55.0 and later.          |
| FulfillingBusinessHours   | reference | Create, Filter, Group, Nillable, Sort, Update | Fulfilling business hours at the location. This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 61.0 and later.                                                                                                                                  |
| FoCapacity                | int       | Create, Filter, Group, Nillable, Sort, Update | The maximum number of fulfillment orders that can be assigned to the location per time period. If this value is null, then this location’s capacity isn’t limited. This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 55.0 and later.          |
| IsEligibleForPickup       | boolean   | Create, Filter, Nillable, Sort, Update        | Indicates whether the location supports BOPIS                                                                                                                                                                                                                                                                                                                  |
| LastReferencedDate        | datetime  | Filter, Nillable, Sort                        | The date when the location was last modified. Its label in the user interface is Last Modified Date.                                                                                                                                                                                                                                                           |
| LastViewedDate            | datetime  | Filter, Nillable, Sort                        | The date the location was last viewed.                                                                                                                                                                                                                                                                                                                         |
| LatestPickupTimeOffset    | integer   | Create, Filter, Nillable, Sort, Update        | The latest pickup time for BOPIS. This value is measured in minutes before the end of business hours.                                                                                                                                                                                                                                                          |
| Latitude                  | double    | Create, Filter, Nillable, Sort, Update        | The latitude of the location.                                                                                                                                                                                                                                                                                                                                  |
| Location                  | location  | Nillable                                      | The geographic location.                                                                                                                                                                                                                                                                                                                                       |
| LocationLevel             | int       | Filter, Group, Nillable, Sort                 | The location’s position in a location hierarchy. If the location has no parent or child locations, its level is 1. Locations that belong to a hierarchy have a level of 1 for the root location, 2 for the child locations of the root location, 3 for their children, and so forth.                                                                           |
| LocationType              | picklist  | Create, Filter, Group, Sort, Update           | Picklist of location types. It has no default values, so you must populate it before creating any location records.                                                                                                                                                                                                                                            |
| LogoId                    | reference | Create, Filter, Group, Nillable, Sort, Update | A ContentAsset representing a logo for the location. This field is available in API version 50.0 and later. This is a relationship field.                                                                                                                                                                                                                      |
| Longitude                 | double    | Create, Filter, Nillable, Sort, Update        | The longitude of the location.                                                                                                                                                                                                                                                                                                                                 |
| Name                      | string    | Create, Filter, Group, idLookup, Sort, Update | The name of the location. For example, Service Van #4.                                                                                                                                                                                                                                                                                                         |
| OpenDate                  | date      | Create, Filter, Group, Nillable, Sort, Update | Date the location opened or came into service.                                                                                                                                                                                                                                                                                                                 |
| ParentLocationId          | reference | Create, Filter, Group, Nillable, Sort, Update | The location’s parent location. For example, if vans are stored at a warehouse when not in service, the warehouse is the parent location. This is a relationship field.                                                                                                                                                                                        |
| PickupProcessingTime      | integer   | Create, Filter, Nillable, Sort, Update        | The processing time required for BOPIS orders at this location.                                                                                                                                                                                                                                                                                                |
| PossessionDate            | date      | Create, Filter, Group, Nillable, Sort, Update | The date the location was purchased.                                                                                                                                                                                                                                                                                                                           |
| Priority                  | picklist  | Create, Filter, Group, Nillable, Sort, Update | The priority of the location when routing orders. No default values are included. Add values to the picklist and reference them in your custom routing logic. This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 55.0 and later.               |
| RemodelEndDate            | date      | Create, Filter, Group, Nillable, Sort, Update | Date when remodel construction ended at the location.                                                                                                                                                                                                                                                                                                          |
| RemodelStartDate          | date      | Create, Filter, Group, Nillable, Sort, Update | Date when remodel construction started at the location.                                                                                                                                                                                                                                                                                                        |
| RootLocationId            | reference | Filter, Group, Nillable, Sort                 | (Read Only) The top-level location in the location’s hierarchy. This is a relationship field.                                                                                                                                                                                                                                                                  |
| VisitorAddressId          | reference | Create, Filter, Group, Nillable, Sort, Update | Lookup to an account’s or client’s address. This is a relationship field.                                                                                                                                                                                                                                                                                      |

#### Fields

| Field                     | Type      | Properties                                    | Description                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------- | --------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AssignedFoCount           | int       | Create, Filter, Group, Nillable, Sort, Update | The number of fulfillment orders assigned to the location. Confirming held fulfillment order capacity increments this value. To reset the location’s capacity, set this value to 0. This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 55.0 an |
| CloseDate                 | date      | Create, Filter, Group, Nillable, Sort, Update | Date the location closed or went out of service.                                                                                                                                                                                                                                                                                                               |
| ConstructionEndDate       | date      | Create, Filter, Group, Nillable, Sort, Update | Date construction ended at the location.                                                                                                                                                                                                                                                                                                                       |
| ConstructionStartDate     | date      | Create, Filter, Group, Nillable, Sort, Update | Date construction began at the location.                                                                                                                                                                                                                                                                                                                       |
| DefaultPickupTime         | time      | Create, Filter, Group, Nillable, Sort, Update | Default pickup time at the location. This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 61.0 and later.                                                                                                                                        |
| DefaultProcessingTime     | int       | Create, Filter, Group, Nillable, Sort, Update | Default processing time at the location. This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 61.0 and later.                                                                                                                                    |
| DefaultProcessingTimeUnit | picklist  | Create, Filter, Group, Nillable, Sort, Update | Default processing time unit at the location. Possible values are: Hours Days Weeks This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 61.0 and later.                                                                                         |
| Description               | string    | Create, Filter, Group, Nillable, Sort, Update | A brief description of the location.                                                                                                                                                                                                                                                                                                                           |
| DrivingDirections         | string    | Create, Filter, Nillable, Sort, Update        | Directions to the location.                                                                                                                                                                                                                                                                                                                                    |
| EarliestPickupTimeOffset  | integer   | Create, Filter, Nillable, Sort, Update        | The earliest pickup time for BOPIS. This value is measured in minutes after the start of business hours.                                                                                                                                                                                                                                                       |
| ExternalReference         | string    | Create, Filter, Group, Nillable, Sort, Update | Identifier of a location.                                                                                                                                                                                                                                                                                                                                      |
| FoCapacity                | int       | Create, Filter, Group, Nillable, Sort, Update | The maximum number of fulfillment orders that can be assigned to the location per time period. If this value is null, then this location’s capacity isn’t limited. This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 55.0 and later.          |
| FulfillingBusinessHours   | reference | Create, Filter, Group, Nillable, Sort, Update | Fulfilling business hours at the location. This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 61.0 and later.                                                                                                                                  |
| FoCapacity                | int       | Create, Filter, Group, Nillable, Sort, Update | The maximum number of fulfillment orders that can be assigned to the location per time period. If this value is null, then this location’s capacity isn’t limited. This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 55.0 and later.          |
| IsEligibleForPickup       | boolean   | Create, Filter, Nillable, Sort, Update        | Indicates whether the location supports BOPIS                                                                                                                                                                                                                                                                                                                  |
| LastReferencedDate        | datetime  | Filter, Nillable, Sort                        | The date when the location was last modified. Its label in the user interface is Last Modified Date.                                                                                                                                                                                                                                                           |
| LastViewedDate            | datetime  | Filter, Nillable, Sort                        | The date the location was last viewed.                                                                                                                                                                                                                                                                                                                         |
| LatestPickupTimeOffset    | integer   | Create, Filter, Nillable, Sort, Update        | The latest pickup time for BOPIS. This value is measured in minutes before the end of business hours.                                                                                                                                                                                                                                                          |
| Latitude                  | double    | Create, Filter, Nillable, Sort, Update        | The latitude of the location.                                                                                                                                                                                                                                                                                                                                  |
| Location                  | location  | Nillable                                      | The geographic location.                                                                                                                                                                                                                                                                                                                                       |
| LocationLevel             | int       | Filter, Group, Nillable, Sort                 | The location’s position in a location hierarchy. If the location has no parent or child locations, its level is 1. Locations that belong to a hierarchy have a level of 1 for the root location, 2 for the child locations of the root location, 3 for their children, and so forth.                                                                           |
| LocationType              | picklist  | Create, Filter, Group, Sort, Update           | Picklist of location types. It has no default values, so you must populate it before creating any location records.                                                                                                                                                                                                                                            |
| LogoId                    | reference | Create, Filter, Group, Nillable, Sort, Update | A ContentAsset representing a logo for the location. This field is available in API version 50.0 and later. This is a relationship field.                                                                                                                                                                                                                      |
| Longitude                 | double    | Create, Filter, Nillable, Sort, Update        | The longitude of the location.                                                                                                                                                                                                                                                                                                                                 |
| Name                      | string    | Create, Filter, Group, idLookup, Sort, Update | The name of the location. For example, Service Van #4.                                                                                                                                                                                                                                                                                                         |
| OpenDate                  | date      | Create, Filter, Group, Nillable, Sort, Update | Date the location opened or came into service.                                                                                                                                                                                                                                                                                                                 |
| ParentLocationId          | reference | Create, Filter, Group, Nillable, Sort, Update | The location’s parent location. For example, if vans are stored at a warehouse when not in service, the warehouse is the parent location. This is a relationship field.                                                                                                                                                                                        |
| PickupProcessingTime      | integer   | Create, Filter, Nillable, Sort, Update        | The processing time required for BOPIS orders at this location.                                                                                                                                                                                                                                                                                                |
| PossessionDate            | date      | Create, Filter, Group, Nillable, Sort, Update | The date the location was purchased.                                                                                                                                                                                                                                                                                                                           |
| Priority                  | picklist  | Create, Filter, Group, Nillable, Sort, Update | The priority of the location when routing orders. No default values are included. Add values to the picklist and reference them in your custom routing logic. This field is available when Order Management is installed and configured. By default, it’s hidden by field-level security. This field is available in API version 55.0 and later.               |
| RemodelEndDate            | date      | Create, Filter, Group, Nillable, Sort, Update | Date when remodel construction ended at the location.                                                                                                                                                                                                                                                                                                          |
| RemodelStartDate          | date      | Create, Filter, Group, Nillable, Sort, Update | Date when remodel construction started at the location.                                                                                                                                                                                                                                                                                                        |
| RootLocationId            | reference | Filter, Group, Nillable, Sort                 | (Read Only) The top-level location in the location’s hierarchy. This is a relationship field.                                                                                                                                                                                                                                                                  |
| VisitorAddressId          | reference | Create, Filter, Group, Nillable, Sort, Update | Lookup to an account’s or client’s address. This is a relationship field.                                                                                                                                                                                                                                                                                      |

### OperatingHours Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_operatinghours.htm

Represents the hours in which a service territory, service resource, or account
is available for work. OperatingHours is used by Field Service, Salesforce
Scheduler, Salesforce Meetings, Sales Engagement, and Workforce Engagement. This
object is available in API version 38.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field              | Type     | Properties                                    | Description                                                                                                        |
| ------------------ | -------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Description        | textarea | Create, Nillable, Update                      | The description of the operating hours. Add any details that aren’t included in the name.                          |
| LastReferencedDate | dateTime | Filter, Nillable, Sort                        | The date when the operating hours record was last modified. Its label in the user interface is Last Modified Date. |
| LastViewedDate     | dateTime | Filter, Nillable, Sort                        | The date when the operating hours record was last viewed.                                                          |
| Name               | string   | Create, Filter, Group, idLookup, Sort, Update | The name of the operating hours. For example, Summer Hours, Winter Hours, or Peak Season Hours.                    |

### TimeSlot Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_timeslot.htm

Represents a period of time on a specified day of the week during which work can
be performed in Field Service, Salesforce Scheduler, or Workforce Engagement.
Operating hours consist of one or more time slots. This object is available in
API version 38.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), update(), upsert()

**Note:** This object does not support search() or undelete() calls.

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field                     | Type      | Properties                                                                    | Description                                                                                                                                                              |
| ------------------------- | --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| DayOfWeek                 | picklist  | Create, Defaulted on create, Filter, Group, Restricted picklist, Sort, Update | The day of the week when the time slot takes place.                                                                                                                      |
| EndTime                   | time      | Create, Filter, Sort, Update                                                  | The time when the time slot ends.                                                                                                                                        |
| LastReferencedDate        | dateTime  | Filter, Nillable, Sort                                                        | The timestamp for when the current user last viewed a record related to this record.                                                                                     |
| LastViewedDate            | dateTime  | Filter, Nillable, Sort                                                        | The timestamp for when the current user last viewed this record. If this value is null, this record might only have been referenced (LastReferencedDate) and not viewed. |
| MaxAppointments           | int       | Create, Defaulted on create, Filter, Group, Nillable, Sort, Update            | Maximum number of appointments for a single time slot. Available in API version 47.0 and later.                                                                          |
| OperatingHoursId          | reference | Create, Filter, Group, Sort                                                   | The operating hours that the time slot belongs to. An operating hours’ time slots appear in the Operating Hours related list. This is a relationship field.              |
| StartTime                 | time      | Create, Filter, Sort, Update                                                  | The time when the time slot starts.                                                                                                                                      |
| RecordSetFilterCriteriaId | reference | Create, Filter, Group, Nillable, Sort, Update                                 | The ID of the recordset filter criteria selected for the time slot. This is a relationship field.                                                                        |
| TimeSlotNumber            | string    | Autonumber, Defaulted on create, Filter, idLookup, Sort                       | The name of the time slot. The name is auto-populated to a day and time format—for example, Monday 9:00 AM - 10:00 PM—but you can manually update it if you wish.        |
| Type                      | picklist  | Create, Defaulted on create, Filter, Group, Restricted picklist, Sort, Update | The type of time slot. Possible values are Normal and Extended. You may choose to use Extended to represent overtime shifts.                                             |
| WorkTypeGroupId           | reference | Create, Filter, Group, Nillable, Sort, Update                                 | Work type group assigned to the time slot. Available in API version 47.0 and later. This is a relationship field.                                                        |

**Note:** For custom fields, see
[TimeSlot Custom Fields](#timeslot-custom-fields).

### AssignedResource Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_assignedresource.htm

Represents a service resource who is assigned to a service appointment in Field
Service and Lightning Scheduler. Assigned resources appear in the Assigned
Resources related list on service appointments. This object is available in API
version 38.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), undelete(), update(), upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field                | Type      | Properties                                    | Description                                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | --------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ActualTravelTime     | double    | Create, Filter, Nillable, Sort, Update        | The number of minutes that the service resource needs to travel to the assigned service appointment. You can enter a value with up to two decimal places.                                                                                                                                                                                                      |
| ApptAssistantInfoUrl | textarea  | Create, Nillable, Update                      | The URL that contains the status of the mobile worker approaching the service appointment, the Community URL, and the expiry of the URL. Available in version 51.0 and later.                                                                                                                                                                                  |
| EstimatedTravelTime  | double    | Create, Filter, Nillable, Sort, Update        | The estimated number of minutes needed for the service resource to travel to the service appointment they’re assigned to. You can enter a value with up to two decimal places.                                                                                                                                                                                 |
| ServiceAppointmentId | reference | Create, Filter, Group, Sort                   | The service appointment that the resource is assigned to. This is a relationship field.                                                                                                                                                                                                                                                                        |
| ServiceCrewId        | reference | Create, Update, Filter, Group, Sort, Nillable | The service crew that the resource is assigned to.Since service resources can represent crews or individuals, appointments are typically assigned to crews in the following way: Create a service resource of the Crew type that represent the crew. Create an assigned resource on the service appointment and select the crew resource in the ServiceResourc |
| ServiceResourceId    | reference | Create, Update, Filter, Group, Sort           | The resource who is assigned to the service appointment. This is a relationship field.                                                                                                                                                                                                                                                                         |
| Transaction          | string    | Create, Filter, Group, Nillable, Sort, Update | The last transaction ID of the scheduling and optimization request that updated this object. The transaction ID is automatically generated and populated by the Enhanced Scheduling and Optimization engine. Available in API version 63.0 and later. Usage You can assign multiple service resources to a service appointment. Service resources who are assi |

**Note:** For custom fields, see
[AssignedResource Custom Fields](#assignedresource-custom-fields).

### ResourceAbsence Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_resourceabsence.htm

Represents a time period in which a service resource is unavailable to work in
Field Service, Salesforce Scheduler, or Workforce Engagement. This object is
available in API version 38.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), update(), upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field              | Type      | Properties                                    | Description                                                                                                                                                                                                                                                                                                                                                    |
| ------------------ | --------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Address            | address   | Filter                                        | The compound form of the address associated with the absence.                                                                                                                                                                                                                                                                                                  |
| City               | string    | Create, Filter, Group, Nillable, Sort, Update | The city of the address associated with the absence. Maximum length is 40 characters.                                                                                                                                                                                                                                                                          |
| Country            | string    | Create, Filter, Group, Nillable, Sort, Update | The country of the address associated with the absence. Maximum length is 80 characters.                                                                                                                                                                                                                                                                       |
| Description        | textarea  | Create, Nillable, Update                      | The description of the absence.                                                                                                                                                                                                                                                                                                                                |
| End                | dateTime  | Create, Filter, Sort, Update                  | The date and time when the absence ends.                                                                                                                                                                                                                                                                                                                       |
| LastReferencedDate | dateTime  | Filter, Nillable, Sort                        | The date when the resource absence was last modified. Its label in the user interface is Last Modified Date.                                                                                                                                                                                                                                                   |
| LastViewedDate     | dateTime  | Filter, Nillable, Sort                        | The date when the resource absence was last viewed.                                                                                                                                                                                                                                                                                                            |
| Latitude           | double    | Create, Filter, Nillable, Sort, Update        | Used with Longitude to specify the precise geolocation of the address associated with the absence. Acceptable values are numbers between –90 and 90 with up to 15 decimal places.This field is available in the API only.                                                                                                                                      |
| Longitude          | double    | Create, Filter, Nillable, Sort, Update        | Used with Latitude to specify the precise geolocation of the address associated with the absence. Acceptable values are numbers between –180 and 180 with up to 15 decimal places.This field is available in the API only. Postal Code Type string Properties Create, Filter, Group, Nillable, Sort, Update Description The postal code of the address associa |
| ResourceId         | reference | Create, Filter, Group, Sort, Update           | The absent service resource. This is a relationship field.                                                                                                                                                                                                                                                                                                     |
| Start              | dateTime  | Create, Filter, Sort, Update                  | The date and time when the absence begins.                                                                                                                                                                                                                                                                                                                     |
| State              | string    | Create, Filter, Group, Nillable, Sort, Update | The state of the address associated with the absence. Maximum length is 80 characters.                                                                                                                                                                                                                                                                         |
| Street             | textarea  | Create, Filter, Group, Nillable, Sort, Update | The street number and name of the address associated with the absence.                                                                                                                                                                                                                                                                                         |

**Note:** For custom fields, see
[ResourceAbsence Custom Fields](#resourceabsence-custom-fields).

### ServiceResourceCapacity Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceresourcecapacity.htm

Represents the maximum number of scheduled hours or number of service
appointments that a capacity-based service resource can complete within a
specific time period. This object is available in API version 38.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), update(), upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field               | Type      | Properties                                                                              | Description                                                                                                                                                                                                                                                                                                                                                   |
| ------------------- | --------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CapacityInHours     | double    | Create, Filter, Nillable, Sort, Update                                                  | The number of hours that the resource can work per time period. You must fill out this field, the CapacityInWorkItems field, or both.                                                                                                                                                                                                                         |
| CapacityInWorkItems | int       | Create, Filter, Group, Nillable, Sort, Update                                           | The total number of service appointments that the resource can complete per time period. You must fill out this field, the CapacityInHours field, or both.                                                                                                                                                                                                    |
| CapacityNumber      | string    | Autonumber, Defaulted on create, Filter, idLookup, Sort                                 | (Read only) An auto-generated number identifying the capacity record.                                                                                                                                                                                                                                                                                         |
| EndDate             | date      | Create, Filter, Group, Nillable, Sort, Update                                           | The date the capacity ends; for example, the end date of a contract.                                                                                                                                                                                                                                                                                          |
| LastReferencedDate  | dateTime  | Filter, Nillable, Sort                                                                  | The timestamp for when the current user last viewed a record related to this record.                                                                                                                                                                                                                                                                          |
| LastViewedDate      | dateTime  | Filter, Nillable, Sort                                                                  | The timestamp for when the current user last viewed this record. If this value is null, this record might only have been referenced (LastReferencedDate) and not viewed.                                                                                                                                                                                      |
| ServiceResourceId   | reference | Create, Filter, Group, Sort                                                             | The associated service resource. You can set multiple capacities for a resource as long as their start and end dates do not overlap.                                                                                                                                                                                                                          |
| StartDate           | date      | Create, Filter, Group, Sort                                                             | The date the capacity goes into effect.                                                                                                                                                                                                                                                                                                                       |
| TimePeriod          | picklist  | Create, Defaulted on create, Filter, Group, Nillable, Restricted picklist, Sort, Update | Days, Hours, or Months. For example, if a resource can work 80 hours per month, the capacity’s Time Period would be Month and Hours per Time Period would be 80. Usage Service resources who are capacity-based can only work a certain number of hours or complete a certain number of service appointments within a specified time period. Contractors tend |

**Note:** For custom fields, see
[ServiceResourceCapacity Custom Fields](#serviceresourcecapacity-custom-fields).

### ServiceTerritoryMember Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceterritorymember.htm

Represents a service resource who can be assigned in a service territory in
Field Service, Salesforce Scheduler, or Workforce Engagement. This object is
available in API version 38.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ServiceTerritoryLocation Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceterritorylocation.htm

Represents a location associated with a particular service territory in field
service.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ServiceCrew Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_servicecrew.htm

Represents a group of service resources who can be assigned to service
appointments as a unit.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field              | Type      | Properties                                               | Description                                                                                                                                                                                                                                                                                                                                                    |
| ------------------ | --------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CrewSize           | int       | Create, Filter, Group, Sort, Update                      | The number of members on the crew. This field is manual, so it doesn’t auto-update when you add or remove members.                                                                                                                                                                                                                                             |
| LastReferencedDate | dateTime  | Filter, Nillable, Sort                                   | The date when the service crew was last modified. Its label in the user interface is Last Modified Date.                                                                                                                                                                                                                                                       |
| LastViewedDate     | dateTime  | Filter, Nillable, Sort                                   | The date when the service crew was last viewed.                                                                                                                                                                                                                                                                                                                |
| Name               | string    | Create, Filter, Group, Sort, Update                      | The name of the service crew. For example, Repair Crew.                                                                                                                                                                                                                                                                                                        |
| OwnerId            | reference | Create, Defaulted on create, Filter, Group, Sort, Update | The crew owner. By default, the owner is the person who created the service crew. Associated Objects This object has the following associated objects. If the API version isn’t specified, they’re available in the same API versions as this object. Otherwise, they’re available in the specified API version and later. ServiceCrewChangeEvent (API version |

### ServiceCrewMember Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_servicecrewmember.htm

Represents a technician service resource that belongs to a service crew.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkType Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_worktype.htm

Represents a type of work to be performed in Field Service and Lightning
Scheduler. Work types are templates that can be applied to work order or work
order line items. This object is available in API version 38.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field                   | Type      | Properties                                    | Description                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------- | --------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Description             | textarea  | Create, Nillable, Update                      | The description of the work type. Try to add details about the task or tasks that this work type represents.                                                                                                                                                                                                                                                   |
| EstimatedDuration       | double    | Create, Filter, Sort, Update                  | The estimated length of the work. The estimated duration is in minutes or hours based on the value selected in the Duration Type field.                                                                                                                                                                                                                        |
| LastReferencedDate      | dateTime  | Filter, Nillable, Sort                        | The date when the work type was last modified. Its label in the user interface is Last Modified Date.                                                                                                                                                                                                                                                          |
| LastViewedDate          | dateTime  | Filter, Nillable, Sort                        | The date when the work type was last viewed by the current user.                                                                                                                                                                                                                                                                                               |
| MinimumCrewSize         | int       | Create, Filter, Group, Nillable, Sort, Update | The minimum crew size allowed for a crew assigned to the work. Work orders and work order line items inherit their work type’s minimum crew size.If you’re not using the Field Service managed package, this field serves as a suggestion rather than a rule. If you are using the managed package, the scheduling optimizer counts the number of service crew |
| Name                    | string    | Create, Filter, Group, idLookup, Sort, Update | The name of the work type. Try to use a name that helps users quickly understand the type of work orders that can be created from the work type. For example, “Annual Refrigerator Maintenance” or “Valve Replacement.”                                                                                                                                        |
| RecommendedCrewSize     | int       | Create, Filter, Group, Nillable, Sort, Update | The recommended number of people on the service crew assigned to the work. For example, you might have a Minimum Crew Size of 2 and a Recommended Crew Size of 3. Work orders and work order line items inherit their work type’s recommended crew size.                                                                                                       |
| SaDocumentTemplate      | string    | Create, Filter, Group, Nillable, Sort, Update | The document template ID. If ServiceDocumentTemplateId isn’t specified, this document template ID determines which service document template is used for service documents generated from a service appointment. The ID is 15 to 18 characters long.                                                                                                           |
| ServiceReportTemplateId | reference | Create, Filter, Group, Nillable, Sort, Update | The service report template associated with the work type. When users create service reports from a work order or work order line item that uses this work type, the reports use this template.                                                                                                                                                                |
| WoDocumentTemplate      | string    | Create, Filter, Group, Nillable, Sort, Update | The document template ID. If ServiceDocumentTemplateId isn’t specified, this document template ID determines which service document template is used for service documents generated from a work order. The ID is 15 to 18 characters long.                                                                                                                    |
| WoliDocumentTemplate    | string    | Create, Filter, Group, Nillable, Sort, Update | The document template ID. If ServiceDocumentTemplateId isn’t specified, this document template ID determines which service document template is used for service documents generated from a work order line item. The ID is 15 to 18 characters long. Usage Adding a work type to a work order or work order line item causes the record to inherit the work t |

### SkillRequirement Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_skillrequirement.htm

Represents a skill that is required to complete a particular task in Field
Service, Omni-Channel, Salesforce Scheduler, or Workforce Engagement. Skill
requirements can be added to pending service routing objects in Omni-Channel.
They can be added to work types, work orders, and work order line items in Field
Service and Lightning Scheduler. And they can be added to job profiles in
Workforce Engagement. You also can add skill requirements to work items in
Omni-Channel skills-based routing using API version 42.0 and later. This object
is available in API version 38.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ServiceResourceSkill Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceresourceskill.htm

Represents a skill that a service resource possesses in Field Service and
Lightning Scheduler. This object is available in API version 38.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ResourcePreference Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_resourcepreference.htm

Represents an account's preference for a specified service resource on field
service work.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ProductItem Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productitem.htm

Represents the stock of a particular product at a particular location in field
service, such as all bolts stored in your main warehouse.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field                 | Type      | Properties                                              | Description                                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | --------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LastReferencedDate    | dateTime  | Filter, Nillable, Sort                                  | The date when the product item was last modified. Its label in the user interface is Last Modified Date.                                                                                                                                                                                                                                                      |
| LastViewedDate        | dateTime  | Filter, Nillable, Sort                                  | The date when the product item was last viewed.                                                                                                                                                                                                                                                                                                               |
| LocationId            | reference | Create, Filter, Group, Sort                             | Location associated with the product item. This usually indicates where the product item is stored. This is a relationship field.                                                                                                                                                                                                                             |
| Product2Id            | reference | Create, Filter, Group, Sort                             | Product associated with the product item, which represents the type of product in your inventory. This is a relationship field.                                                                                                                                                                                                                               |
| ProductItemNumber     | string    | Autonumber, Defaulted on create, Filter, idLookup, Sort | (Read Only) Auto-generated number identifying the product item.                                                                                                                                                                                                                                                                                               |
| ProductName           | string    | Filter, Group, Nillable, Sort                           | A name for the product item. Try to select a name that indicates what is being stored where; for example, Batteries in Warehouse A.                                                                                                                                                                                                                           |
| QuantityOnHand        | double    | Create, Filter, Sort, Update                            | The quantity at the location. If you want to add a serial number, this value must be 1.                                                                                                                                                                                                                                                                       |
| QuantityUnitOfMeasure | picklist  | Create, Filter, Group, Nillable, Sort, Update           | Units of the product item; for example, kilograms or liters. Quantity Unit of Measure picklist values are inherited from the Quantity Unit of Measure field on products.                                                                                                                                                                                      |
| SerialNumber          | string    | Create, Filter, Group, Nillable, Sort, Update           | A unique number for identification purposes. If you want to enter a serial number, the Quantity on Hand must be 1. Usage Each product item is associated with a product and a location in Salesforce. If a product is stored at multiple locations, the product will be tracked in a different product item for each location. Associated Objects This object |

### ProductRequest Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productrequest.htm

Represents an order for a part or parts in field service.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field                 | Type      | Properties                                    | Description                                                                                                 |
| --------------------- | --------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| AccountId             | reference | Create, Filter, Group, Nillable, Sort, Update | The account associated with the product request. This is a relationship field.                              |
| CaseId                | reference | Create, Filter, Group, Nillable, Sort, Update | The case associated with the product request. This is a relationship field.                                 |
| Description           | textarea  | Create, Nillable, Update                      | A text field for details not recorded in the provided fields.                                               |
| DestinationLocationId | reference | Create, Filter, Group, Nillable, Sort, Update | Where the product is delivered. This is a relationship field.                                               |
| LastReferencedDate    | dateTime  | Filter, Nillable, Sort                        | The date when the product request was last modified. Its label in the user interface is Last Modified Date. |
| LastViewedDate        | dateTime  | Filter, Nillable, Sort                        | The date when the product request was last viewed.                                                          |
| NeedByDate            | dateTime  | Create, Filter, Nillable, Sort, Update        | Date the product must be delivered by.                                                                      |
| ShipToAddress         | address   | Filter, Nillable                              | The address that the product is to be delivered to.                                                         |
| ShipToCity            | string    | Create, Filter, Group, Nillable, Sort, Update | The city that the product is to be delivered to.                                                            |
| ShipToCountry         | string    | Create, Filter, Group, Nillable, Sort, Update | The country that the product is to be delivered to.                                                         |
| ShipToCountryCode     | picklist  | Create, Filter, Group, Nillable, Sort, Update | A two letter uppercase country code conforming to the ISO 3166-1 alpha-2 standard.                          |
| ShipToLatitude        | double    | Create, Filter, Nillable, Sort, Update        | The latitude of the location where the product is to be delivered to.                                       |
| ShipToLongitude       | double    | Create, Filter, Nillable, Sort, Update        | The longitude of the location where the product is to be delivered to.                                      |
| ShipToPostalCode      | string    | Create, Filter, Group, Nillable, Sort, Update | The postal code of the address where the product is to be delivered to.                                     |
| ShipToState           | string    | Create, Filter, Group, Nillable, Sort, Update | The name of the state where the product is to be delivered to.                                              |
| ShipToStateCode       | picklist  | Create, Filter, Group, Nillable, Sort, Update | A two letter uppercase state code conforming to the ISO 3166-1 alpha-2 standard.                            |
| ShipToStreet          | textarea  | Create, Filter, Group, Nillable, Sort, Update | The street address where the product is to be delivered to.                                                 |
| SourceLocationId      | reference | Create, Filter, Group, Nillable, Sort, Update | The location the product is shipped from. This is a relationship field.                                     |
| WorkOrderId           | reference | Create, Filter, Group, Nillable, Sort, Update | The work order that the product request is related to. This is a relationship field.                        |
| WorkOrderLineItemId   | reference | Create, Filter, Group, Nillable, Sort, Update | The work order line item that the product request is related to. This is a relationship field.              |

### ProductTransfer Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_producttransfer.htm

Represents the transfer of inventory between locations in field service.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ProductConsumed Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productconsumed.htm

Represents an item from your inventory that was used to complete a work order or
work order line item in field service.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ProductRequired Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productrequired.htm

Represents a product that is needed to complete a work order or work order line
item in field service.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### MaintenancePlan Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_maintenanceplan.htm

Represents a preventive maintenance schedule for one or more assets in field
service.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field                        | Type      | Properties                                    | Description                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------- | --------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AccountId                    | reference | Create, Filter, Group, Nillable, Sort, Update | The associated account, which typically represents the customer receiving the maintenance service.                                                                                                                                                                                                                                                             |
| ContactId                    | reference | Create, Filter, Group, Nillable, Sort, Update | The associated contact.                                                                                                                                                                                                                                                                                                                                        |
| Description                  | textarea  | Create, Nillable, Update                      | A brief description of the plan.                                                                                                                                                                                                                                                                                                                               |
| EndDate                      | date      | Create, Filter, Group, Nillable, Sort, Update | The last day the maintenance plan is valid.                                                                                                                                                                                                                                                                                                                    |
| Frequency                    | int       | Create, Filter, Group, Sort, Update           | (Optional) Amount of time between work orders. The unit is specified in the FrequencyType field.                                                                                                                                                                                                                                                               |
| GenerationHorizon            | int       | Create, Filter, Group, Nillable, Sort, Update | Moves up the timing of batch generation if DoesAutoGenerateWorkOrders is set to true. A generation horizon of 5 means the new batch of work orders is generated 5 days before the maintenance asset’s (or maintenance plan’s, if there are no assets) NextSuggestedMaintenanceDate. The generation horizon must be a whole number.                             |
| GenerationTimeframe          | int       | Create, Filter, Group, Sort, Update           | (Required) How far in advance work orders are generated in each batch. The unit is specified in the GenerationTimeframeType field.                                                                                                                                                                                                                             |
| LastReferencedDate           | dateTime  | Filter, Nillable, Sort                        | The timestamp when the current user last interacted with this record, directly or indirectly. Some sample scenarios are:                                                                                                                                                                                                                                       |
| LastViewedDate               | dateTime  | Filter, Nillable, Sort                        | The timestamp when the current user last viewed this record or list view. If this value is null, it’s possible that the user only accessed this record or list view (LastReferencedDate), but not viewed it.                                                                                                                                                   |
| LocationId                   | reference | Create, Filter, Group, Nillable, Sort, Update | Where the service takes place.                                                                                                                                                                                                                                                                                                                                 |
| MaintenancePlanNumber        | string    | Autonumber, Defaulted on create, Filter, Sort | (Read Only) An auto-assigned number that identifies the maintenance plan.                                                                                                                                                                                                                                                                                      |
| MaintenancePlanTitle         | string    | Create, Filter, Group, Nillable, Sort, Update | A name for the maintenance plan.                                                                                                                                                                                                                                                                                                                               |
| MaintenanceWindowEndDays     | int       | Create, Filter, Group, Nillable, Sort, Update | Days after the suggested service date on the work order that its service appointment can be scheduled.                                                                                                                                                                                                                                                         |
| MaintenanceWindowStartDays   | int       | Create, Filter, Group, Nillable, Sort, Update | Days before the suggested service date on the work order that its service appointment can be scheduled.The maintenance window start and end fields affect the Earliest Start Permitted and Due Date fields on the maintenance plan’s work orders’ service appointments. For example, if you enter 3 for both the maintenance window start and end, the Earlies |
| NextSuggestedMaintenanceDate | date      | Create, Filter, Group, Sort, Update           | The suggested date of service for the first work order (not the date the work order is created). This corresponds to the work order’s SuggestedMaintenanceDate. You can use this field to enforce a delay before the first maintenance visit (for example, if monthly maintenance should begin one year after the purchase date). Its label in the user interf |
| ServiceContractId            | reference | Create, Filter, Group, Nillable, Sort, Update | The service contract associated with the maintenance plan. The service contract can’t be updated if any child maintenance asset is associated with a contract line item from the service contract.                                                                                                                                                             |
| StartDate                    | date      | Create, Filter, Group, Sort, Update           | The first day the maintenance plan is valid.                                                                                                                                                                                                                                                                                                                   |
| WorkTypeId                   | reference | Create, Filter, Group, Nillable, Sort, Update | The associated work type. Work orders generated from the maintenance plan inherit its work type’s duration, required skills and products, and linked articles. Maintenance assets covered by the plan use the same work type, though you can update them to use a different one. Associated Objects This object has the following associated objects. If the A |

### MaintenanceAsset Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_maintenanceasset.htm

Represents an asset covered by a maintenance plan in field service. Assets can
be associated with multiple maintenance plans.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### MaintenanceWorkRule Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_maintenanceworkrule.htm

Represents the recurrence pattern for a maintenance record. This object is
available in API version 49.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ServiceReport Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_servicereport.htm

Represents a report that summarizes a work order, work order line item, or
service appointment.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field                    | Type      | Properties                                       | Description                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------ | --------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ContentVersionDocumentId | reference | Filter, Group, Nillable, Sort                    | ID of the service report version, used for storage.                                                                                                                                                                                                                                                                                                            |
| DocumentBody             | base64    | Create, Nillable                                 | The report output. DocumentBody can’t be retrieved via REST API.                                                                                                                                                                                                                                                                                               |
| DocumentLength           | int       | Filter, Group, Nillable, Sort                    | The length of the report output.                                                                                                                                                                                                                                                                                                                               |
| DocumentName             | string    | Create, Filter, Group, Nillable, Sort            | The name of the report output, always set to Service Report.                                                                                                                                                                                                                                                                                                   |
| DocumentTemplate         | string    | Create, Filter, Group, Nillable, Sort            | The template used to generate service documents for the Document Builder feature. DocumentTemplate is different from Template. The document template needs to reference a flexipage that is of type serviceDocument and must target the object used to generate the service document. For example, you can't use an Account flexipage for a service report tie |
| IsSigned                 | boolean   | Create, Defaulted on create, Filter, Group, Sort | Indicates whether the service report contains one or more signatures. This field isn’t supported for Document Builder.Add this field to the Service Reports related list on work orders, work order line items, and service appointments.                                                                                                                      |
| ParentId                 | reference | Create, Filter, Group, Sort                      | The ID of the service appointment, work order, or work order line item that the service report summarizes. For example, if you click Create Service Report on a service appointment, this field lists the service appointment’s record ID.                                                                                                                     |
| ServiceReportNumber      | string    | Autonumber, Defaulted on create, Filter, Sort    | An auto-generated number identifying the service report.                                                                                                                                                                                                                                                                                                       |
| Template                 | string    | Create, Filter, Group, Nillable, Sort            | The service report template used to generate the service report.If the person creating the service report doesn’t have access to certain objects or fields that are included in the service report template, those fields aren’t visible in the report they create. Associated Objects This object has the following associated objects. Unless noted, they ar |

### Expense Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_expense.htm

Represents an expense linked to a work order. Service resource technicians can
log expenses, such as tools or travel costs. This object is available in API
version 49.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field              | Type      | Properties                                                         | Description                                                                                                                                                                                                                                                                                                                                                    |
| ------------------ | --------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AccountId          | reference | Create, Filter, Group, Nillable, Sort, Update                      | The ID of the account associated with the linked work order.                                                                                                                                                                                                                                                                                                   |
| Amount             | currency  | Create, Filter, Sort, Update                                       | The amount of the expense.                                                                                                                                                                                                                                                                                                                                     |
| Description        | textarea  | Create, Nillable, Update                                           | A description for the expense.                                                                                                                                                                                                                                                                                                                                 |
| Discount           | percent   | Create, Filter, Nillable, Sort, Update                             | The percentage deducted from the Subtotal price. Available in version 51.0 and later.                                                                                                                                                                                                                                                                          |
| ExpenseEndDate     | date      | Create, Filter, Group, Nillable, Sort, Update                      | If the expense was incurred over multiple days, the Expense End Date is the last day that the expense covers.                                                                                                                                                                                                                                                  |
| ExpenseNumber      | string    | Autonumber, Defaulted on create, Filter, idLookup, Sort            | The number that uniquely identifies the expense.                                                                                                                                                                                                                                                                                                               |
| ExpenseStartDate   | date      | Create, Filter, Group, Nillable, Sort, Update                      | If the expense was incurred over multiple days, the Expense Start Date is the first day that the expense covers.                                                                                                                                                                                                                                               |
| ExpenseType        | picklist  | Create, Defaulted on create, Filter, Group, Nillable, Sort, Update | The type of expense. Possible values are: Billable Non-Billable The default value is Billable.                                                                                                                                                                                                                                                                 |
| LastReferencedDate | dateTime  | Filter, Nillable, Sort                                             | The timestamp for when the current user last viewed a record related to this record.                                                                                                                                                                                                                                                                           |
| LastViewedDate     | dateTime  | Filter, Nillable, Sort                                             | The timestamp for when the current user last viewed this record. If this value is null, this record might only have been referenced (LastReferencedDate) and not viewed.                                                                                                                                                                                       |
| OwnerId            | reference | Create, Defaulted on create, Filter, Group, Sort, Update           | The ID of the user who owns the expense record.                                                                                                                                                                                                                                                                                                                |
| Quantity           | double    | Create, Filter, Nillable, Sort, Update                             | The number of items purchased in this record. Available in version 51.0 and later.                                                                                                                                                                                                                                                                             |
| Subtotal           | currency  | Filter, Nillable, Sort                                             | The subtotal price calculated as the product of Quantity and UnitPrice. Available in version 51.0 and later. This is a calculated field.                                                                                                                                                                                                                       |
| Title              | string    | Create, Filter, Group, Nillable, Sort, Update                      | A title that identifies the expense. This field is available in API version 50.0 and later.                                                                                                                                                                                                                                                                    |
| TotalPrice         | currency  | Filter, Nillable, Sort                                             | The total price of the transaction which is equal to the discounted subtotal: Subtotal - (Discount \* Subtotal). Available in version 51.0 and later. This is a calculated field.                                                                                                                                                                              |
| TransactionDate    | date      | Create, Filter, Group, Sort, Update                                | The day that the expense was incurred, or the payment date for the expense.                                                                                                                                                                                                                                                                                    |
| UnitPrice          | currency  | Create, Filter, Nillable, Sort, Update                             | The price of one item on the record. Available in version 51.0 and later.                                                                                                                                                                                                                                                                                      |
| WorkOrderId        | reference | Create, Filter, Group, Nillable, Sort, Update                      | The ID of the work order associated with the expense. Associated Objects This object has the following associated objects. Unless noted, they are available in the same API version as this object. ExpenseChangeEvent (API version 55.0) Change events are available for the object. ExpenseFeed Feed tracking is available for the object. ExpenseHistory Hi |

#### Fields

| Field              | Type      | Properties                                                         | Description                                                                                                                                                                                                                                                                                                                                                    |
| ------------------ | --------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AccountId          | reference | Create, Filter, Group, Nillable, Sort, Update                      | The ID of the account associated with the linked work order.                                                                                                                                                                                                                                                                                                   |
| Amount             | currency  | Create, Filter, Sort, Update                                       | The amount of the expense.                                                                                                                                                                                                                                                                                                                                     |
| Description        | textarea  | Create, Nillable, Update                                           | A description for the expense.                                                                                                                                                                                                                                                                                                                                 |
| Discount           | percent   | Create, Filter, Nillable, Sort, Update                             | The percentage deducted from the Subtotal price. Available in version 51.0 and later.                                                                                                                                                                                                                                                                          |
| ExpenseEndDate     | date      | Create, Filter, Group, Nillable, Sort, Update                      | If the expense was incurred over multiple days, the Expense End Date is the last day that the expense covers.                                                                                                                                                                                                                                                  |
| ExpenseNumber      | string    | Autonumber, Defaulted on create, Filter, idLookup, Sort            | The number that uniquely identifies the expense.                                                                                                                                                                                                                                                                                                               |
| ExpenseStartDate   | date      | Create, Filter, Group, Nillable, Sort, Update                      | If the expense was incurred over multiple days, the Expense Start Date is the first day that the expense covers.                                                                                                                                                                                                                                               |
| ExpenseType        | picklist  | Create, Defaulted on create, Filter, Group, Nillable, Sort, Update | The type of expense. Possible values are: Billable Non-Billable The default value is Billable.                                                                                                                                                                                                                                                                 |
| LastReferencedDate | dateTime  | Filter, Nillable, Sort                                             | The timestamp for when the current user last viewed a record related to this record.                                                                                                                                                                                                                                                                           |
| LastViewedDate     | dateTime  | Filter, Nillable, Sort                                             | The timestamp for when the current user last viewed this record. If this value is null, this record might only have been referenced (LastReferencedDate) and not viewed.                                                                                                                                                                                       |
| OwnerId            | reference | Create, Defaulted on create, Filter, Group, Sort, Update           | The ID of the user who owns the expense record.                                                                                                                                                                                                                                                                                                                |
| Quantity           | double    | Create, Filter, Nillable, Sort, Update                             | The number of items purchased in this record. Available in version 51.0 and later.                                                                                                                                                                                                                                                                             |
| Subtotal           | currency  | Filter, Nillable, Sort                                             | The subtotal price calculated as the product of Quantity and UnitPrice. Available in version 51.0 and later. This is a calculated field.                                                                                                                                                                                                                       |
| Title              | string    | Create, Filter, Group, Nillable, Sort, Update                      | A title that identifies the expense. This field is available in API version 50.0 and later.                                                                                                                                                                                                                                                                    |
| TotalPrice         | currency  | Filter, Nillable, Sort                                             | The total price of the transaction which is equal to the discounted subtotal: Subtotal - (Discount \* Subtotal). Available in version 51.0 and later. This is a calculated field.                                                                                                                                                                              |
| TransactionDate    | date      | Create, Filter, Group, Sort, Update                                | The day that the expense was incurred, or the payment date for the expense.                                                                                                                                                                                                                                                                                    |
| UnitPrice          | currency  | Create, Filter, Nillable, Sort, Update                             | The price of one item on the record. Available in version 51.0 and later.                                                                                                                                                                                                                                                                                      |
| WorkOrderId        | reference | Create, Filter, Group, Nillable, Sort, Update                      | The ID of the work order associated with the expense. Associated Objects This object has the following associated objects. Unless noted, they are available in the same API version as this object. ExpenseChangeEvent (API version 55.0) Change events are available for the object. ExpenseFeed Feed tracking is available for the object. ExpenseHistory Hi |

### TimeSheet Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_timesheet.htm

Represents a schedule of a service resource's time in Field Service or Workforce
Engagement. This object is available in API version 47.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### TimeSheetEntry Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_timesheetentry.htm

Represents a span of time that a service resource spends on a field service
task. This object is available in API version 47.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### Shift Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_shift.htm

Represents a shift for service resource scheduling. Available in API versions
46.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field                     | Type      | Properties                                         | Description                                                                                                                                                                     |
| ------------------------- | --------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BackgroundColor           | string    | Create, Filter, Group, Nillable, Sort, Update      | Sets a background color when shifts are displayed in the UI. Use a 3- or 6-digit hexadecimal format, for example #FF00FF. Available in API version 54.0 and later.              |
| EndTime                   | dateTime  | Create, Filter, Sort, Update                       | The date and time that the shift ends.                                                                                                                                          |
| JobProfileId              | reference | Create, Filter, Group, Nillable, Sort, Update      | The job profile associated with the shift. Available in API versions 47.0 and later.                                                                                            |
| Label                     | string    | Create, Filter, Group, Nillable, Sort, Update      | The label that a shift is given.                                                                                                                                                |
| LastReferencedDate        | dateTime  | Filter, Nillable, Sort                             | The date and time when the current user last viewed a related record.                                                                                                           |
| LastViewedDate            | dateTime  | Filter, Nillable, Sort                             | The date and time when the current user last viewed this record.                                                                                                                |
| RecordsetFilterCriteriaId | reference | Create, Filter, Group, Nillable, Sort, Update      | The ID of the recordset filter criteria selected for the shift. Available in API version 49.0 and later. This is a relationship field.                                          |
| ServiceResourceId         | reference | Create, Filter, Group, Nillable, Sort, Update      | The ID of the service resource the shift belongs to. Available in API versions 47.0 and later. This is a relationship field.                                                    |
| ServiceTerritoryId        | reference | Create, Filter, Group, Nillable, Sort, Update      | The ID of the service territory the shift belongs to. Available in API versions 47.0 and later. This is a relationship field.                                                   |
| ShiftTemplateId           | reference | Create, Filter, Group, Nillable, Sort              | The shift template ID, if the shift was created from a shift template. Available in API version 53.0 and later. This is a relationship field.                                   |
| StartTime                 | dateTime  | Create, Filter, Sort, Update                       | The date and time that the shift starts.                                                                                                                                        |
| Status                    | picklist  | Create, Filter, Group, Sort, Update                | Describes the status of the shift. Users can create custom values. Default values are: Tentative Published Confirmed                                                            |
| StatusCategory            | picklist  | Filter, Group, Nillable, Restricted picklist, Sort | Describes the status of the shift using static values. This field is derived from Status using the mapping defined in setup. Possible values are: Tentative Published Confirmed |

#### Fields

| Field                     | Type      | Properties                                         | Description                                                                                                                                                                     |
| ------------------------- | --------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BackgroundColor           | string    | Create, Filter, Group, Nillable, Sort, Update      | Sets a background color when shifts are displayed in the UI. Use a 3- or 6-digit hexadecimal format, for example #FF00FF. Available in API version 54.0 and later.              |
| EndTime                   | dateTime  | Create, Filter, Sort, Update                       | The date and time that the shift ends.                                                                                                                                          |
| JobProfileId              | reference | Create, Filter, Group, Nillable, Sort, Update      | The job profile associated with the shift. Available in API versions 47.0 and later.                                                                                            |
| Label                     | string    | Create, Filter, Group, Nillable, Sort, Update      | The label that a shift is given.                                                                                                                                                |
| LastReferencedDate        | dateTime  | Filter, Nillable, Sort                             | The date and time when the current user last viewed a related record.                                                                                                           |
| LastViewedDate            | dateTime  | Filter, Nillable, Sort                             | The date and time when the current user last viewed this record.                                                                                                                |
| RecordsetFilterCriteriaId | reference | Create, Filter, Group, Nillable, Sort, Update      | The ID of the recordset filter criteria selected for the shift. Available in API version 49.0 and later. This is a relationship field.                                          |
| ServiceResourceId         | reference | Create, Filter, Group, Nillable, Sort, Update      | The ID of the service resource the shift belongs to. Available in API versions 47.0 and later. This is a relationship field.                                                    |
| ServiceTerritoryId        | reference | Create, Filter, Group, Nillable, Sort, Update      | The ID of the service territory the shift belongs to. Available in API versions 47.0 and later. This is a relationship field.                                                   |
| ShiftTemplateId           | reference | Create, Filter, Group, Nillable, Sort              | The shift template ID, if the shift was created from a shift template. Available in API version 53.0 and later. This is a relationship field.                                   |
| StartTime                 | dateTime  | Create, Filter, Sort, Update                       | The date and time that the shift starts.                                                                                                                                        |
| Status                    | picklist  | Create, Filter, Group, Sort, Update                | Describes the status of the shift. Users can create custom values. Default values are: Tentative Published Confirmed                                                            |
| StatusCategory            | picklist  | Filter, Group, Nillable, Restricted picklist, Sort | Describes the status of the shift using static values. This field is derived from Status using the mapping defined in setup. Possible values are: Tentative Published Confirmed |

### TravelMode Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_travelmode.htm

Represents a travel mode used for travel time calculations. The records include
information about the type of transportation (such as Car or Walking), whether a
vehicle can take toll roads, and whether a vehicle is transporting hazardous
materials. This object is available in API version 54.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### Fields

| Field                | Type      | Properties                                                         | Description                                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | --------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CanUseTollRoads      | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update           | Indicates if the vehicle is allowed to drive on toll roads. The default value is false.                                                                                                                                                                                                                                                                        |
| IsLocked             | boolean   | Defaulted on create, Filter, Group, Sort                           | Indicates whether the travel model record is locked or not. The default value is false.                                                                                                                                                                                                                                                                        |
| IsTransportingHazmat | boolean   | Create, Defaulted on create, Filter, Group, Sort, Update           | Indicates if the vehicle is transporting hazardous materials. The default value is false.                                                                                                                                                                                                                                                                      |
| LastReferencedDate   | dateTime  | Filter, Nillable, Sort                                             | The timestamp when the current user last accessed this record, a record related to this record, or a list view.                                                                                                                                                                                                                                                |
| LastViewedDate       | dateTime  | Filter, Nillable, Sort                                             | The timestamp when the current user last viewed this record or list view. If this value is null, the user might have only accessed this record or list view (LastReferencedDate=) but not viewed it.                                                                                                                                                           |
| MayEdit              | boolean   | Defaulted on create, Filter, Group, Sort                           | Indicates whether the travel model record can be edited or not. The default value is false.                                                                                                                                                                                                                                                                    |
| Name                 | string    | Create, Filter, Group, idLookup, Sort, Update                      | Name of the travel mode.                                                                                                                                                                                                                                                                                                                                       |
| OwnerId              | reference | Create, Defaulted on create, Filter, Group, Sort, Update           | ID of the owner of this object. This field is a polymorphic relationship field.                                                                                                                                                                                                                                                                                |
| TransportType        | picklist  | Create, Filter, Group, Nillable, Restricted picklist, Sort, Update | Type of transportation. Possible values are: Bicycle Car-Default. Heavy Truck Light Truck Walking Associated Objects This object has the following associated objects. If the API version isn’t specified, they’re available in the same API versions as this object. Otherwise, they’re available in the specified API version and later. TravelModeFeed Feed |

### AssociatedLocation Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_associatedlocation.htm

Represents a link between an account and a location in Field Service. You can
associate multiple accounts with one location. For example, a shopping center
location may have multiple customer accounts.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### LinkedArticle Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_linkedarticle.htm

Represents a knowledge article that is attached to a work order, work order line
item, or work type. This object is available in API version 37.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### DigitalSignature Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_digitalsignature.htm

Represents a signature captured on a service report in field service.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### FieldServiceMobileSettings Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_fieldservicemobilesettings.htm

Represents a configuration of settings that control the Field Service iOS and
Android mobile app experience. This object is available in API version 38.0 and
later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### MobileSettingsAssignment Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_mobilesettingsassignment.htm

Represents the assignment of a particular field service mobile settings
configuration to a user profile. This object is available in API version 41.0
and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### AppExtension Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_appextension.htm

Represents a connection between the Field Service mobile app and another app,
typically for passing record data to the Salesforce mobile app or other apps.
This object is available in API version 41.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### OperatingHoursHoliday Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_fs_operatinghoursholiday.htm

Represents the day or hours for which a service territory or service resource is
unavailable in Field Service, Salesforce Scheduler, Salesforce Meetings, Sales
Engagement, or Workforce Engagement. This object is available in API version
54.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ReturnOrder Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_returnorder.htm

Represents the return or repair of inventory or products in Field Service, or
the return of order products in Order Management. This object is available in
API version 42.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ReturnOrderLineItem Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_returnorderlineitem.htm

Represents a specific product that is returned or repaired as part of a return
order in Field service, or a specific order item that is returned as part of a
return order in Order Management. This object is available in API version 42.0
and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### Shipment Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_shipment.htm

Represents the transport of inventory in field service or a shipment of order
items in Order Management.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### SerializedProduct Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/hc_sforce_api_objects_serializedproduct.htm

Records serial numbers for each individual product in an inventory. This object
is available in API version 50.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ProductItemTransaction Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productitemtransaction.htm

Represents an action taken on a product item in field service. Product item
transactions are auto-generated records that help you track when a product item
is replenished, consumed, or adjusted.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ProductRequestLineItem Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productrequestlineitem.htm

Represents a request for a part in field service. Product request line items are
components of product requests.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ProductServiceCampaign Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productservicecampaign.htm

Represents a set of activities to be performed on a product service campaign
asset, such as a product recall for safety issues or product defects. This
object is available in API version 51.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ProductServiceCampaignItem Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productservicecampaignitem.htm

Represents a product service campaign's asset. This object is available in API
version 51.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### AssetWarranty Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_assetwarranty.htm

Defines the warranty terms applicable to an asset along with any exclusions and
extensions. This object is available in API version 50.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ProductWarrantyTerm Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productwarrantyterm.htm

Defines the relationship between a product or product family and warranty term.
This object is available in API version 50.0 and later.

**Supported Calls:** create(), create(), delete(), describeLayout(),
describeSObjects(), getDeleted(), getUpdated(), query(), retrieve(), search(),
undelete(), update(), upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WarrantyTerm Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_warrantyterm.htm

Represents warranty terms defining the labor, parts, and expenses covered, along
with any exchange options, provided to rectify issues with products. This object
is available in API version 50.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ExpenseReport Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_expensereport.htm

Represents a report that summarizes expenses. This object is available in API
version 50.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ExpenseReportEntry Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_expensereportentry.htm

Represents an entry in an expense report. This object is available in API
version 50.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkTypeGroup Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_worktypegroup.htm

Represents a grouping of work types used to categorize types of appointments
available in Lightning Scheduler, or to define scheduling limits in Field
Service. This object is available in API version 45.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkTypeGroupMember Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_worktypegroupmember.htm

Represents the relationship between a work type and the work type group it
belongs to. This object is available in API version 45.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkPlan Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workplan.htm

Represents a work plan for a work order or work order line item. This object is
available in API version 52.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkPlanTemplate Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workplantemplate.htm

Represents a template for a work plan. This object is available in API version
52.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkStep Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workstep.htm

Represents a work step in a work plan. This object is available in API version
52.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkStepTemplate Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_worksteptemplate.htm

Represents a template for a work step. This object is available in API version
52.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkPlanTemplateEntry Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workplantemplateentry.htm

Represents an object that associates a work step template with a work plan
template. This object is available in API version 52.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkPlanSelectionRule Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workplanselectionrule.htm

Represents a rule that selects a work plan for a work order or work order line
item. This object is available in API version 52.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ShiftPattern Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_shiftpattern.htm

Represents a pattern of templates for creating shifts. This object is available
in API version 51.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ShiftTemplate Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_shifttemplate.htm

Represents a template for creating shifts. This object is available in API
version 51.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ShiftPatternEntry Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_shiftpatternentry.htm

ShiftPatternEntry links a shift template to a shift pattern. This object is
available in API version 51.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### RecordsetFilterCriteria Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_recordsetfiltercriteria.htm

Represents a set of filters that can be used to match service appointments or
assets based on your criteria fields. For example, you can create recordset
filter criteria so that only service appointments that satisfy the filter
criteria are matched to the filtered shifts, and likewise only maintenance work
rules that satisfy your criteria are matched to assets. Assets and maintenance
work rules are available in API version 52.0 and later. This object is available
in API version 50.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### RecordsetFilterCriteriaRule Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_recordsetfiltercriteriarule.htm

Represents a rule using fields from the designated source object to create
filters on the filtered, or target, object. RecordsetFilterCriteriaRule is
associated with the RecordsetFilterCriteria object. This object is available in
API version 50.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### RecordsetFltrCritMonitor Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_recordsetfltrcritmonitor.htm

Monitors whether the value of an asset attribute is within the threshold of a
recordset filter criteria (RFC). You can monitor one or more RFCs for an Asset.
This object is available in API version 57.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkCapacityAvailability Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workcapacityavailability.htm

Represents the available work capacity for a specific time and service
territory. This object is available in API version 59.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkCapacityLimit Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workcapacitylimit.htm

Represents the capacity limit in a specific service territory for a workstream
or for the whole service territory in a given period. This object is available
in API version 59.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkCapacityUsage Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workcapacityusage.htm

Represents the capacity usage in a specific service territory for a workstream
or for the whole service territory in a given period. This object is available
in API version 59.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### AssetAttribute Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_assetattribute.htm

Stores asset attributes to track and analyze asset conditions to improve their
uptime. This object is available in API version 57.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### AttributeDefinition Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_attributedefinition.htm

Represents a product, asset, or object attribute, for example, a hardware
specification or software detail. This object is available in API version 57.0
and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### AttributePicklist Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_attributepicklist.htm

Represents a custom picklist for an asset attribute. This object is available in
API version 57.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### AttributePicklistValue Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_attributepicklistvalue.htm

Represents the values of an asset attribute picklist. This object is available
in API version 57.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### AssetAccountParticipant Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_assetaccountparticipant.htm

Represents a junction between the Asset and Account objects describing the
association between a participating account and an asset. This object is
available in API version 56.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### AssetContactParticipant Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_assetcontactparticipant.htm

Represents a junction between the Asset and Contact objects describing the
association between a participating contact and an asset. This object is
available in API version 56.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ProductConsumedState Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productconsumedstate.htm

Represents the status of an item from your inventory that was used to complete a
work order or work order line item in Field Service. This object is available in
API version 57.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### SerializedProductTransaction Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serializedproducttransaction.htm

Represents transactions performed on a serialized product. This object is
available in API version 57.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ProductServiceCampaignItemStatus Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productservicecampaignitemstatus.htm

Represents a status for a product service campaign item in field service. This
object is available in API version 51.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ProductServiceCampaignStatus Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productservicecampaignstatus.htm

Represents a status for a product service campaign in field service. This object
is available in API version 51.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ServiceAppointmentStatus Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceappointmentstatus.htm

Represents a possible status of a service appointment in field service.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkOrderStatus Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workorderstatus.htm

Represents a possible status of a work order in field service.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkOrderLineItemStatus Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workorderlineitemstatus.htm

Represents a possible status of a work order line item in field service.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### WorkStepStatus Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workstepstatus.htm

Represents a picklist for a status category on a work step. This object is
available in API version 52.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ServiceReportLayout Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_servicereportlayout.htm

Represents a service report template in field service.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### GeolocationBasedAction Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_geolocationbasedaction.htm

Represents a geolocation-based action, which is an action that's triggered when
a user enters, exits, or is within the area of the associated object. Available
in API version 61.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### FldSvcObjChg Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_fldsvcobjchg.htm

Represents a change made to one of a service appointment's tracked fields. This
object is available in API version 63.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### FldSvcObjChgDtl Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_fldsvcobjchgdtl.htm

Represents the details of a change made to one of a service appointment's
tracked fields. This object is available in API version 63.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### FSL**Time_Dependency**c Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_fsl__time_dependency__c.htm

Represents a dependency between two service appointments. This object is used to
define scheduling relationships between two appointments. It allows you to
determine the order and timing in which dependent appointments should be
scheduled.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### Appointment Bundle Objects

The following objects are related to appointment bundling functionality:

#### ApptBundleAggrDurDnscale Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_apptbundleaggrdurdnscale.htm

Sums the duration of the bundle members, reduced by a predefined percentage.
This object is available in API version 54.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:**

- Field Service must be enabled.
- Bundling must be enabled in the Field Service Settings.
- The Field Service Admin, Field Service Bundle for Dispatcher, and Field
  Service Integration permission sets must be enabled.

#### Fields

| Field                     | Type      | Properties                                    | Description                                                                                                                                                                                         |
| ------------------------- | --------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BundleAggregationPolicyId | reference | Create, Filter, Group, Sort                   | The ID of the parent appointment bundle aggregation policy. This is a relationship field.                                                                                                           |
| LastReferencedDate        | dateTime  | Filter, Nillable, Sort                        | The timestamp when the current user last accessed this record, a record related to this record, or a list view.                                                                                     |
| LastViewedDate            | dateTime  | Filter, Nillable, Sort                        | The timestamp when the current user last viewed this record or list view. If this value is null, the user might have only accessed this record or list view (LastReferencedDate) but not viewed it. |
| MaxReduction              | int       | Create, Filter, Group, Nillable, Sort, Update | The maximum reduction that can be applied to a bundle member.                                                                                                                                       |
| Name                      | string    | Create, Filter, Group, idLookup, Sort, Update | The name of the appointment bundle aggregation downscale policy.                                                                                                                                    |
| ToBundleMemberNumber      | int       | Create, Filter, Group, Nillable, Sort, Update | The number of the last bundle member to which the downscale is applied.                                                                                                                             |

##### Fields

| Field                     | Type      | Properties                                                         | Description                                                                                                                                                                                         |
| ------------------------- | --------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BundleAggregationPolicyId | reference | Create, Filter, Group, Sort                                        | The ID of the parent appointment bundle aggregation policy. This is a relationship field. Relationship Name: BundleAggregationPolicy, Relationship Type: Lookup, Refers To: ApptBundleAggrPolicy    |
| FromBundleMemberNumber    | int       | Create, Defaulted on create, Filter, Group, Nillable, Sort, Update | The number of the first bundle member to which the downscale is applied.                                                                                                                            |
| LastReferencedDate        | dateTime  | Filter, Nillable, Sort                                             | The timestamp when the current user last accessed this record, a record related to this record, or a list view.                                                                                     |
| LastViewedDate            | dateTime  | Filter, Nillable, Sort                                             | The timestamp when the current user last viewed this record or list view. If this value is null, the user might have only accessed this record or list view (LastReferencedDate) but not viewed it. |
| MaxReduction              | int       | Create, Filter, Group, Nillable, Sort, Update                      | The maximum reduction that can be applied to a bundle member.                                                                                                                                       |
| Name                      | string    | Create, Filter, Group, idLookup, Sort, Update                      | The name of the appointment bundle aggregation downscale policy.                                                                                                                                    |
| PercentageOfReduction     | int       | Create, Defaulted on create, Filter, Group, Nillable, Sort, Update | The percentage of duration reduction.                                                                                                                                                               |
| ToBundleMemberNumber      | int       | Create, Filter, Group, Nillable, Sort, Update                      | The number of the last bundle member to which the downscale is applied.                                                                                                                             |

#### ApptBundleAggrPolicy Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_apptbundleaggrpolicy.htm

Policy that defines how the property values of the bundle members are aggregated
and assigned to the bundle. This object is available in API version 54.0 and
later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### ApptBundleConfig Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_apptbundleconfig.htm

Represents the general parameters that define the behavior of the bundle. This
object is available in API version 54.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### ApptBundlePolicy Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_apptbundlepolicy.htm

Policy that defines how the bundling of service appointments should be handled.
This object is available in API version 54.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### ApptBundlePolicySvcTerr Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_apptbundlepolicysvcterr.htm

Represents a link between the BundlePolicy and the ServiceTerritory. This object
is available in API version 54.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### ApptBundlePropagatePolicy Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_apptbundlepropagatepolicy.htm

Policy that defines which property values are inherited from the bundle to the
bundle members or are assigned as constant values in the bundle members. This
object is available in API version 55.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### ApptBundleRestrictPolicy Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_apptbundlerestrictpolicy.htm

Policy that defines the restrictions that are considered while forming a bundle.
This object is available in API version 54.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

#### ApptBundleSortPolicy Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_apptbundlesortpolicy.htm

Policy that defines the properties by which the bundle members are sorted within
the bundle. Can also be used in the automatic mode for determining the order of
the automatic selection of bundle members. This object is available in API
version 54.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ContractLineOutcome Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_contractlineoutcome.htm

Represents information on a contract line outcome's captured data and other
related parameters that are used when capturing data. This object is available
in API version 58.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### ContractLineOutcomeData Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_contractlineoutcomedata.htm

Represents the contract line outcome's captured data. It stores the data that
was captured between the contract line outcome's start date and end date. This
object is available in API version 58.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Special Access Rules:** Field Service managed package must be installed.

### Standard Salesforce Objects Used in Field Service

The following standard Salesforce objects are commonly used with Field Service
but are not tied to Field Service enablement (marked with \* in the object
reference table):

#### Asset Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_asset.htm

Represents an item of commercial value, such as a product sold by your company
or a competitor, that a customer has purchased.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Note:** This is a standard Salesforce object, not tied to Field Service
enablement.

#### ServiceContract Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_servicecontract.htm

Represents a customer support contract (business agreement). This object is
available in API version 18.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Note:** This is a standard Salesforce object, not tied to Field Service
enablement.

#### Entitlement Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_entitlement.htm

Represents the customer support an account or contact is eligible to receive.
Entitlements may be based on an asset, product, or service contract. This object
is available in API version 18.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Note:** This is a standard Salesforce object, not tied to Field Service
enablement.

#### ContractLineItem Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_contractlineitem.htm

Represents a product covered by a service contract (customer support agreement).
This object is available in API version 18.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Note:** This is a standard Salesforce object, not tied to Field Service
enablement.

#### EntityMilestone Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_entitymilestone.htm

Represents a required step in a customer support process on a work order. The
Salesforce user interface uses the term "object milestone". This object is
available in API version 37.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Note:** This is a standard Salesforce object, not tied to Field Service
enablement.

#### Pricebook2 Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_pricebook2.htm

Represents a price book that contains the list of products that your org sells.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Note:** This is a standard Salesforce object, not tied to Field Service
enablement.

#### Product2 Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_product2.htm

Represents a product that your company sells.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Note:** This is a standard Salesforce object, not tied to Field Service
enablement.

#### Skill Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_skill.htm

Represents a category or group of Chat users or service resources in Field
Service or Workforce Engagement. This object is available in API version 24.0
and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Note:** This is a standard Salesforce object, not tied to Field Service
enablement.

#### AssetDowntimePeriod Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_assetdowntimeperiod.htm

Represents a period during which an asset is not able to perform as expected.
Downtime periods include planned activities, such as maintenance, and unplanned
events, such as mechanical breakdown. This object is available in API version
49.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Note:** This is a standard Salesforce object, not tied to Field Service
enablement.

#### AssetRelationship Object

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_assetrelationship.htm

Represents a non-hierarchical relationship between assets due to an asset
modification; for example, a replacement, upgrade, or other circumstance. In
Revenue Lifecycle Management, this object represents an asset or assets grouped
in a bundle or set. This object is available in API version 41.0 and later.

**Supported Calls:** create(), delete(), describeLayout(), describeSObjects(),
getDeleted(), getUpdated(), query(), retrieve(), search(), undelete(), update(),
upsert()

**Note:** This is a standard Salesforce object, not tied to Field Service
enablement.

---

## Supplementary Field Service Objects

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_soap_dev_supplementary.htm

A list of Field Service objects that support history tracking or sharing.

**Note:** Most objects are available only if Field Service is enabled. Objects
not tied to Field Service enablement are shown with an asterisk (\*).

### Supplementary Objects Reference List

| Object                                                                                                                                                                                          | Type    | Notes |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----- |
| [AssetOwnerSharingRule](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_assetownersharingrule.htm)                            | Sharing | \*    |
| [AssetShare](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_assetshare.htm)                                                  | Sharing | \*    |
| [LinkedArticleHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_linkedarticlehistory.htm)                              | History | -     |
| [MaintenanceWorkRuleFeed](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_associated_objects_feed.htm)                                | Feed    | -     |
| [MaintenanceWorkRuleHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_associated_objects_history.htm)                          | History | -     |
| [MaintenanceWorkRuleOwnerSharingRule](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_associated_objects_ownersharingrule.htm)        | Sharing | -     |
| [MaintenanceWorkRuleShare](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_associated_objects_share.htm)                              | Sharing | -     |
| [OperatingHoursHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_operatinghourshistory.htm)                            | History | -     |
| [ProductRequestHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productrequesthistory.htm)                            | History | -     |
| [ProductRequestOwnerSharingRule](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productrequestownersharingrule.htm)          | Sharing | -     |
| [ProductRequestShare](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_productrequestshare.htm)                                | Sharing | -     |
| [ProductServiceCampaignFeed](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_associated_objects_feed.htm)                             | Feed    | -     |
| [ProductServiceCampaignHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_associated_objects_history.htm)                       | History | -     |
| [ProductServiceCampaignOwnerSharingRule](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_associated_objects_ownersharingrule.htm)     | Sharing | -     |
| [ProductServiceCampaignShare](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_associated_objects_share.htm)                           | Sharing | -     |
| [ProductServiceCampaignItemFeed](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_associated_objects_feed.htm)                         | Feed    | -     |
| [ProductServiceCampaignItemHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_associated_objects_history.htm)                   | History | -     |
| [ProductServiceCampaignItemOwnerSharingRule](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_associated_objects_ownersharingrule.htm) | Sharing | -     |
| [ProductServiceCampaignItemShare](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_associated_objects_share.htm)                       | Sharing | -     |
| [ProductTransferHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_producttransferhistory.htm)                          | History | -     |
| [ProductTransferOwnerSharingRule](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_producttransferownersharingrule.htm)        | Sharing | -     |
| [ProductTransferShare](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_producttransfershare.htm)                              | Sharing | -     |
| [ResourceAbsenceHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_resourceabsencehistory.htm)                          | History | -     |
| [ResourcePreferenceHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_resourcepreferencehistory.htm)                    | History | -     |
| [ReturnOrderHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_returnorderhistory.htm)                                  | History | -     |
| [ReturnOrderLineItemHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_returnorderlineitemhistory.htm)                  | History | -     |
| [ReturnOrderOwnerSharingRule](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_returnorderownersharingrule.htm)                | Sharing | -     |
| [ReturnOrderShare](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_returnordershare.htm)                                      | Sharing | -     |
| [ServiceAppointmentHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceappointmenthistory.htm)                    | History | -     |
| [ServiceAppointmentOwnerSharingRule](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceappointmentownersharingrule.htm)  | Sharing | -     |
| [ServiceAppointmentShare](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceappointmentshare.htm)                        | Sharing | -     |
| [ServiceCrewHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_servicecrewhistory.htm)                                  | History | -     |
| [ServiceCrewMemberHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_servicecrewmemberhistory.htm)                      | History | -     |
| [ServiceCrewOwnerSharingRule](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_servicecrewownersharingrule.htm)                | Sharing | -     |
| [ServiceCrewShare](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_servicecrewshare.htm)                                      | Sharing | -     |
| [ServiceResourceCapacityHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceresourcecapacityhistory.htm)          | History | -     |
| [ServiceResourceHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceresourcehistory.htm)                          | History | -     |
| [ServiceResourceOwnerSharingRule](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceresourceownersharingrule.htm)        | Sharing | -     |
| [ServiceResourceShare](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceresourceshare.htm)                              | Sharing | -     |
| [ServiceResourceSkillHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceresourceskillhistory.htm)                | History | -     |
| [ServiceTerritoryHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceterritoryhistory.htm)                        | History | -     |
| [ServiceTerritoryMemberHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_serviceterritorymemberhistory.htm)            | History | -     |
| [SkillRequirementHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_skillrequirementhistory.htm)                        | History | -     |
| [TimeSheetEntryHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_timesheetentryhistory.htm)                            | History | -     |
| [TimeSheetHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_timesheethistory.htm)                                      | History | -     |
| [TimeSheetOwnerSharingRule](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_timesheetownersharingrule.htm)                    | Sharing | -     |
| [TimeSheetShare](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_timesheetshare.htm)                                          | Sharing | -     |
| [TimeSlotHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_timeslothistory.htm)                                        | History | -     |
| [WorkOrderHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workorderhistory.htm)                                      | History | \*    |
| [WorkOrderLineItemHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workorderlineitemhistory.htm)                      | History | \*    |
| [WorkOrderShare](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_workordershare.htm)                                          | Sharing | \*    |
| [WorkTypeGroupHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_worktypegrouphistory.htm)                              | History | -     |
| [WorkTypeGroupMemberHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_worktypegroupmemberhistory.htm)                  | History | -     |
| [WorkTypeGroupShare](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_worktypegroupshare.htm)                                  | Sharing | -     |
| [WorkTypeHistory](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_worktypehistory.htm)                                        | History | -     |
| [WorkTypeOwnerSharingRule](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_worktypeownersharingrule.htm)                      | Sharing | -     |
| [WorkTypeShare](https://developer.salesforce.com/docs/atlas.en-us.258.0.object_reference.meta/object_reference/sforce_api_objects_worktypeshare.htm)                                            | Sharing | -     |

---

## Core Objects

### Work Order

**Pricing Fields:** | Field | Type | Description |
|-------|------|-------------| | Discount | Read-only | Weighted avg of line
item discounts (0-100) | | Grand Total | Read-only | Total with tax | | Price
Book | Lookup | Links line items to products | | Subtotal | Read-only | Total
before discounts/taxes | | Tax | Currency | Tax amount (not percentage) | |
Total Price | Read-only | After discounts, before tax |

**Line Item Price Fields:** | Field | Type | Description |
|-------|------|-------------| | Discount | Editable | Percent discount on
subtotal | | List Price | Read-only | From price book entry | | Product | Lookup
| Must be in parent WO's price book | | Subtotal | Read-only | Unit price ×
quantity | | Total Price | Read-only | Subtotal minus discount | | Unit Price |
Editable | Defaults to list price |

**Price Book Rules:**

- Users need "Use" sharing access for: creating/editing WOs with Price Book,
  creating WOLIs with Product, creating products consumed with Price Book Entry
- Cannot delete: price books linked to WOs, products linked to WOLIs, price book
  entries linked to WOLIs
- Price book entries only appear if currency matches WO currency

**Work Order Generation Troubleshooting:**

1. Check Apex triggers on: WorkOrder, WorkOrderLineItem, Asset,
   ServiceAppointment, AssignedResource
2. Check Process Builder/Flows on same objects
3. Disable custom validation rules on these objects to test
4. Deactivate custom lookup filters to test
5. For picklists: ensure defaults set when dependent picklist has "Restrict to
   value set" enabled

### Service Appointment

**Core Fields:** | Category | Fields | |----------|--------| | Basic | Account,
Asset, Contact, Description, ServiceAppointmentNumber (auto), ServiceTerritory,
Subject, WorkOrder, WorkType | | Scheduling | ArrivalWindowStart/End, DueDate,
Duration, DurationType, EarliestStartTime, SchedStartTime, SchedEndTime,
ActualStartTime, ActualEndTime, ActualDuration | | Status | Status,
StatusCategory, StatusIcon | | Assignment | AssignedResource, ServiceCrew,
ParentRecord | | Location | Street, City, State, PostalCode, Country, Latitude,
Longitude, GeocodeAccuracy | | Additional | GanttLabel, Priority,
ParentRecordType, ServiceReport, TravelTime, TravelTimeFromHome,
TravelTimeFromLast |

**Status Categories:** | Category | Description | Standard Values |
|----------|-------------|-----------------| | None | Not scheduled | None | |
Scheduled | Scheduled, not dispatched | Scheduled | | Dispatched | Sent to
resource | Dispatched | | In Progress | Work started | In Progress | | Completed
| Work done | Completed | | Cannot Complete | Unable to finish | Cannot Complete
| | Canceled | Canceled | Canceled |

**Status Category Usage:**

- Dispatch drip feed
- Dispatch scheduled jobs
- Dispatcher console filters
- Status-based paths
- Status-based sharing rules

### Service Resource

**Fields:** | Category | Fields | |----------|--------| | Basic | Name,
Description, Active, ResourceType, RelatedRecord (User) | | Scheduling |
Efficiency (0.1-10), IsActive, IsCapacityBased, SchedulingConstraints | | Skills
| ServiceResourceSkill junction objects | | Territories | ServiceTerritoryMember
junction objects | | Capacity | ServiceResourceCapacity records | | Availability
| TimeSlot, ResourceAbsence records | | Crews | ServiceCrewMember, ServiceCrew |

**Resource Types:** Agent, Crew, Dispatcher, Technician

**Capacity-Based Resources:**

- Only one primary/relocation territory member allowed
- Cannot have ServiceCrewMember records
- Capacity tracked via ServiceResourceCapacity

### Service Territory

**Fields:** | Category | Fields | |----------|--------| | Basic | Name,
Description, Active, ParentTerritory, TopLevelTerritory | | Location | Address,
Street, City, State, PostalCode, Country, Latitude, Longitude | | Operating
Hours | OperatingHours | | Configuration | FSL**TerritoryLevel**c (hierarchy
level) |

**Territory Hierarchy:**

- FSL**TerritoryLevel**c: calculated hierarchy depth
- ParentTerritory: immediate parent
- TopLevelTerritory: root territory reference

### Entitlement

**Core Fields:** | Field | Description | |-------|-------------| | Account Name
| Required account link | | Asset Name | Associated asset (purchased products) |
| Business Hours | When service can be provided | | Contract Line Item | Product
from contract | | Entitlement Name | Descriptive name (e.g., "Phone Support") |
| Entitlement Process | Milestones and SLA enforcement | | Operating Hours |
Appointment booking windows (Field Service) | | Service Contract | Parent
contract | | Start/End Date | Validity period | | Status |
Active/Expired/Inactive (auto-calculated) | | Type | Customizable category |

**Per-Incident Fields:** | Field | Description | |-------|-------------| | Cases
Per Entitlement | Total cases allowed | | Per Incident | Enables case-limited
entitlements | | Remaining Cases | Cases still available | | Remaining Work
Orders | WOs still available | | Work Orders Per Entitlement | Total WOs allowed
|

**Status Logic:**

- Active: system date ≥ Start Date AND ≤ End Date
- Expired: system date > End Date
- Inactive: system date < Start Date

---

## Scheduling Objects

### Operating Hours

Defines business hours for territories, resources, and entitlements.

**Fields:** Description, Name, OperatingHoursHoliday (junction), TimeZone

### Shift

Work schedule definition for resources.

**Fields:** EndTime, JobProfile, Name, OperatingHours, ServiceResource,
ServiceTerritory, ShiftTemplate, StartTime

### Scheduling Policy

Rules for automatic scheduling and optimization.

**Fields:** Active, CommitMode, Description, Name, OptimizationMode,
ServiceObjective[], WorkRule[]

### Work Rule

Constraints for scheduling decisions.

**Types:** Match Fields, Service Resource Availability, Service Resource Skills,
Service Territory, Time Restrictions, Travel Limits

### Service Objective

Optimization goals with weights.

**Types:** Custom Logic, Maximize Resource Utilization, Minimize Overtime,
Minimize Travel

### Optimization Request

Background optimization job tracking.

**Fields:** EndTime, Name, NumberOfAppointmentsOptimized, OptimizationScore,
RequestType, SchedulingPolicy, ServiceTerritory, StartTime, Status

---

## Field Service Inventory Management Data Model

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_inventory.htm

Use Field Service's inventory objects to track the storage, request,
consumption, return, and retirement of items in your inventory.

**Note:** Asterisks in data model diagrams signify required fields.

### Product Items

Inventory management starts with **product items**, which represent the stock of
a particular product at a particular location. Each product item is associated
with a **product** and a **location** in Salesforce.

**Example:** If you have 50 hammers stored in your Warehouse A location and 200
stored in Warehouse B, create one product item for each location. Product items
list a quantity at the location that is updated automatically when inventory is
transferred or consumed.

**Inventory Locations:** If the Inventory Location option is selected on a
location, it means that inventory can be stored there. Product items can be
associated only with inventory locations.

### Locations

**Location Associations:** You can link a location to multiple **accounts** and
**service territories**. For example, if a location is a shopping mall, you can
choose to associate it with every account that operates a store in the mall.

**Location Features:**

- You can also create **addresses** for a location, such as a mailing and home
  address
- To keep track of customer sites, create **associated locations**, which
  contain lookups to an **account** and a **location**

### Products Required

If a particular product is needed to complete a field service job, add
**products required** to ensure that the assigned service resources arrive
prepared.

**Products Required Parent Records:** Products required can be child records of:

- **Work orders**
- **Work order line items**
- **Work types**

**Inheritance:** Work order and work order line items inherit their work type's
products required.

### Product Consumed

When a product is consumed during the completion of a work order, track its
consumption by creating a **product consumed** record. You can add products
consumed to work orders or work order line items.

**Tracking Level:** Track product consumption at the line item level if you want
to know which products were used for each line item's tasks.

**Product Consumed Approaches:**

**Full Lifecycle Tracking:** If you want to track the entire life cycle of items
in your inventory, including their storage, transfer, and consumption, link your
product consumed records to product items. This approach ensures that your
inventory numbers update automatically to reflect the consumption of products
from your inventory.

**Consumption-Only Tracking:** If you want to track product consumption only,
specify a **Price Book Entry** on each product consumed record and leave the
**Product Item** field blank.

### Inventory Movement Objects

The movement of items into and out of your inventory and between locations is
tracked using these objects:

- **Product requests**: Orders for products, which you might create when stock
  is running low
- **Product request line items**: Subdivisions of a product request
- **Product transfers**: Track the movement of product items between inventory
  locations
- **Shipments**: Represent the shipment of product items between locations
- **Product item transactions**: Describe actions performed on a product item.
  They're auto-generated records that help you track when inventory is
  replenished, consumed, or adjusted
- **Return orders**: Track the return of a product item due to damage, order
  errors, or other reasons
- **Return order line items**: Subdivisions of a return order

**See Also:**

- [Set Up Your Field Service Inventory](https://help.salesforce.com/articleView?id=fs_set_up_parts.htm&language=en_US)
- [Guidelines for Transferring Inventory](https://help.salesforce.com/articleView?id=fs_product_transfers.htm&language=en_US)
- [Guidelines for Consuming Inventory](https://help.salesforce.com/articleView?id=fs_products_consumed.htm&language=en_US)
- [Common Inventory Management Tasks](https://help.salesforce.com/articleView?id=fs_parts_guidelines.htm&language=en_US)

---

## Inventory Objects

### Product Item

Trackable inventory at a location.

**Fields:** InventoryLocation, LastCountDate, Location, Name, Product,
QuantityAvailable, QuantityConsumed, QuantityOnHand, QuantityReserved,
SerialNumber, Status

### Product Request

Request for inventory items.

**Fields:** FulfillmentDate, InventoryLocation, RequestDate, RequestNumber,
Status, WorkOrder, WorkOrderLineItem

### Product Transfer

Movement of inventory between locations.

**Fields:** FromLocation, ProductItem, Quantity, Shipment, ToLocation,
TransferDate, TransferNumber, TransferType

### Return Order

Customer returns tracking.

**Fields:** Account, ReceivedDate, ReturnDate, ReturnOrderNumber, Status,
WorkOrder

---

## Field Service Preventive Maintenance Data Model

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_maintenance.htm

Manage periodic maintenance with the help of maintenance plans, which define the
maintenance schedule for specific assets. Maintenance plans typically reflect
the terms in a customer's service contract or entitlements.

**Note:** Asterisks in data model diagrams signify required fields.

### Maintenance Plans

**Associations:** A **maintenance plan** can be linked to:

- An **account** and **contact**—representing the customer
- A **service contract** (if the customer has one)

**Multiple Assets Coverage:** A maintenance plan can cover multiple **assets**.
For example, you can create a maintenance plan to track the monthly maintenance
of 20 laser printers installed in a customer's office building.

**Maintenance Assets:** The assets covered by a maintenance plan are represented
as child records of the maintenance plan called **maintenance assets**.

**Location Linking:** You can also link a maintenance plan to a **location** to
indicate where the assets are installed. For example, link a plan to a location
of the Site type that represents the office building where the printers are
installed.

### Maintenance Work Rules

For more complex recurring maintenance, you can define **maintenance work
rules** for most assets and maintenance plans. With this feature you can, for
example, set up a schedule for minor monthly maintenance and a major yearly
service.

### Work Order Generation

After you create a maintenance plan or maintenance work rules, it's time to
generate **work orders** for the planned maintenance visits.

**Generate Work Orders Quick Action:** Maintenance plans come with a Generate
Work Orders quick action, which can also be called with Apex code.

**Work Order Generation Settings:** Your maintenance plan settings determine how
many work orders and work order line items are generated at once and what their
settings are.

**Generation Options:**

- **One work order per maintenance asset**: Generate one work order per
  maintenance asset for each visit
- **Parent work order with line items**: Generate a parent work order for each
  visit with one work order line item per maintenance asset

### Work Type Associations

Maintenance plans, maintenance assets, and maintenance work rules can be
associated with a **work type**:

- **Maintenance Plan Work Type**: If you specify a work type on a maintenance
  plan, the plan's work orders use that work type
- **Maintenance Asset Work Type**: If you specify a work type on a maintenance
  asset, generated work orders that are associated with the maintenance asset
  use the maintenance asset's work type
- **Maintenance Work Rule Work Type**: If you specify a work type on a
  maintenance work rule, generated work orders that are associated with the
  maintenance work rule use the maintenance work rule's work type

**See Also:**

- [Generate Work Orders on Maintenance Plans with Apex](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_code_samples_wo.htm)

---

## Preventive Maintenance Objects

### Maintenance Plan

Scheduled maintenance definition.

**Fields:** Account, Active, Asset, Description, Frequency, FrequencyUnit,
MaintenancePlanType, Name, NextServiceDate, Status

### Maintenance Asset

Assets linked to maintenance plans.

**Fields:** Asset, LastServiceDate, MaintenancePlan, NextServiceDate

### Maintenance Work Rule

Work type configuration for maintenance.

**Fields:** Frequency, FrequencyUnit, MaintenancePlan, WorkType

---

## Service Delivery Objects

### Service Report

Field service documentation.

**Fields:** Asset, CustomerSignature, ReportContent, ReportDate, ReportNumber,
ServiceAppointment, ServiceReportTemplate, Status, TechnicianSignature,
WorkOrder

### Expense

Work-related expenses.

**Fields:** Amount, ExpenseDate, ExpenseNumber, ExpenseType,
ReimbursementStatus, ServiceResource, Status, WorkOrder

### Time Sheet

Resource time tracking.

**Fields:** EndDate, Name, ServiceResource, StartDate, Status, TotalHours

### Time Sheet Entry

Individual time records.

**Fields:** Duration, EndTime, ServiceAppointment, StartTime, Status, TimeSheet,
WorkOrder

---

## Dispatcher Console

### Core Features

| Feature           | Description                                |
| ----------------- | ------------------------------------------ |
| Appointments List | Filterable list of all appointments        |
| Gantt View        | Visual schedule timeline for resources     |
| Map View          | Geographic visualization with polygons     |
| Optimization      | Manual and automated schedule optimization |
| Resource List     | Service resources and availability         |

### Scheduling Actions

- Schedule from: Appointment record, Dispatcher Console, Record Feed
- Optimization: From action menu → Select territories → Set horizon → Choose
  policy → Run
- In-day optimization: Max 5 minutes, recommended for same/next day

### Optimization Notes

- Best for: cancellations, dropped appointments, high-priority last-minute
- Run for current day, max 2 days to avoid conflicts
- Dynamic Scaling (beta): >50k appointments or >1k resources
- Session timeout: min 2 hours for long-running optimizations

### Console Customization

- Agentforce integration (daily summaries, gap filling, natural language)
- Custom actions, filters, appointment icons
- Field sets for custom displayed fields
- Keyboard shortcuts

---

## Scheduling Engine

### Optimization Factors

Priority • Service Objectives • Service Resource Availability • Skill
Requirements • Territory Coverage • Travel Time • Work Rules

### Scheduling Policy Components

| Component                   | Purpose                                              |
| --------------------------- | ---------------------------------------------------- |
| Commit Mode                 | How results are applied                              |
| Keep Scheduled Criteria     | Appointments that must stay scheduled                |
| Resource/Territory Matching | How resources are assigned                           |
| Scheduling Horizon          | Time period for scheduling                           |
| Service Objectives          | Optimization goals (minimize travel, gaps, overtime) |
| Work Rules                  | Constraints that must be met                         |

### Policy Types

- **Global**: All territories/resources
- **Resource-Specific**: Per resource
- **Territory-Specific**: Custom per territory

### Engine Architecture

```
Request Creation → Data Collection → Optimization Calculation →
Result Validation → Schedule Update → Status Update
```

### Salesforce Scheduler vs Field Service

| Use Field Service                                | Use Salesforce Scheduler            |
| ------------------------------------------------ | ----------------------------------- |
| Field appointments with travel time              | Simple booking without optimization |
| Complex constraints (skills, territories, rules) | In-person/phone/video appointments  |
| Multi-appointment optimization                   | Customer self-service booking       |
| Capacity/work capacity management                | Experience Cloud booking flows      |

---

## Mobile App

### App Components

**Schedule & Work:**

- Daily schedule view
- Service appointment tracking
- Time entry
- Work order management

**Data Capture:** | Component | Type | |-----------|------| | Checkbox, Date,
DateTime | Input | | Email, Number, Phone | Input | | Picklist, Radio, Toggle |
Selection | | Short/Long Text | Text | | Image Preview, Upload File/Image |
Media | | Matrix, Signature | Special |

### Offline Capabilities

| Feature            | Description                           |
| ------------------ | ------------------------------------- |
| Offline Priming    | Pre-download data for offline work    |
| Briefcase Builder  | Configure offline data packages       |
| Cache First Policy | Enhance productivity with cached data |
| Auto-sync          | Data synced when connection restored  |

### Geolocation Features

- Location tracking (including background)
- Geolocation-based actions & geofencing
- Augmented Reality (measure lengths, visualizations)

### Mobile App Builder

- Create configurations per user group
- Customize tabs, screens, layouts
- Add LWC components, custom actions, flows
- Configure push notifications

### Mobile Security

- Authentication methods
- Data encryption
- Field/Object/Record permissions
- Session management

---

## Service Territories

### Territory Configuration

| Field            | Description                 |
| ---------------- | --------------------------- |
| Is Active        | Current active status       |
| Name             | Descriptive territory name  |
| Operating Hours  | Default working hours       |
| Parent Territory | For hierarchical structures |
| Time Zone        | Territory time zone         |

### Service Territory Members

| Field                    | Description              |
| ------------------------ | ------------------------ |
| Effective Start/End Date | Assignment validity      |
| Operating Hours          | Override territory hours |
| Service Resource         | Assigned resource        |
| Service Territory        | Parent territory         |

### Member Types

- **Primary**: Main territory assignment
- **Relocation**: Temporary territory assignment
- **Secondary**: Additional territory coverage

---

## Locations & Geocoding

### Location Fields

| Field                                    | Description            |
| ---------------------------------------- | ---------------------- |
| Street, City, State, PostalCode, Country | Address components     |
| Latitude, Longitude                      | Coordinates (API only) |
| GeocodeAccuracy                          | Accuracy level         |

### GeocodeAccuracy Values (most→least accurate)

Address → NearAddress → Block → Street → ExtendedZip → Zip → Neighborhood → City
→ County → State → Unknown

### Geocoded Objects

ResourceAbsence, ServiceAppointment, ServiceTerritory, ServiceTerritoryMember,
WorkOrder, WorkOrderLineItem

---

## Appointment Bundling

### Bundle Configuration

| Object                  | Purpose                        |
| ----------------------- | ------------------------------ |
| AppointmentBundleConfig | Bundling parameters            |
| AppointmentBundlePolicy | Territory-level bundling rules |
| RecordsetFilterCriteria | Appointment selection filters  |

### Bundling Modes

- **Automatic**: System-triggered bundling (Use Bundle Apex Mode=2)
- **Manual**: User-initiated bundling

### Bundle REST APIs

Create bundles, remove members, auto-bundle, unbundle, update bundles

---

## Triggers Reference

### Trigger Quick Reference

| Trigger                             | Object                      | Type     |
| ----------------------------------- | --------------------------- | -------- |
| FSL\_\_TR021_AssignedResource       | Assigned Resource           | Standard |
| FSL\_\_TR004_Event                  | Event                       | Standard |
| FSL\_\_TR029_GanttFilter            | Gantt Filter                | Custom   |
| FSL\_\_TR030_GanttPalette           | Gantt Palette               | Custom   |
| FSL\_\_TR028_Polygon                | Map Polygon                 | Custom   |
| FSL\_\_TR034_OperatingHours         | Operating Hours             | Standard |
| FSL\_\_TR013_OptimizationRequest    | Optimization Request        | Custom   |
| FSL\_\_TR007_ResourceAbsence        | Resource Absence            | Standard |
| FSL\_\_TR010_SchedulingPolicy       | Scheduling Policy           | Custom   |
| FSL\_\_SchedulingPolicyWorkRule     | Scheduling Policy Work Rule | Custom   |
| FSL\_\_TR001_Service                | Service Appointment         | Standard |
| FSL\_\_TR066_ServiceObjective       | Service Objective           | Custom   |
| FSL\_\_TR012_Capacity               | Service Resource Capacity   | Standard |
| FSL\_\_TR008_ServiceResource        | Service Resource            | Standard |
| FSL\_\_TR016_ServiceTerritory       | Service Territory           | Standard |
| FSL\_\_TR018_ServiceTerritoryMember | Service Territory Member    | Standard |
| FSL\_\_TR003_TimeSlot               | Time Slot                   | Custom   |
| FSL\_\_TR006_WorkOrder              | Work Order                  | Standard |

### Assigned Resource Trigger (TR021)

**Before Insert:**

- Sets EstimatedTravelTime from ServiceAppointment
- Validates resource/appointment exist with SchedStartTime/SchedEndTime

**After Insert:**

- Creates calendar events if
  [calendar sync](https://help.salesforce.com/articleView?id=000316720&type=1&language=en_US)
  enabled
- Creates sharing records for: Asset, Service Appointment, Work Order, Work
  Order Line Item
- Skips sharing for inactive resources or appointments with null scheduled times
- Recalculates travel for same-day appointments (if travel trigger enabled)
- Updates Service Appointment Gantt fields if >1 resource assigned

**Before Update:**

- Validates resource/appointment exist with SchedStartTime/SchedEndTime

**After Update:**

- Creates/updates/deletes calendar events based on changes
- Updates sharing records for changed resources
- Recalculates travel for same-day appointments
- Updates Service Appointment Gantt fields

**After Delete:**

- Deletes corresponding calendar events
- Removes sharing records
- Recalculates travel
- Updates Service Appointment Gantt fields

### Service Appointment Trigger (TR001)

**Before Insert:**

- Validates required fields
- Removes seconds/milliseconds from DateTime fields
- Sets default values

**After Insert:**

- Creates sharing records if location-based sharing enabled
- Triggers bundling API if: Bundling enabled, ApexMode=2, auto-bundling
  conditions met

**Before Update:**

- Validates required fields
- Removes seconds/milliseconds from DateTime fields

**After Update:**

- Creates/deletes calendar events based on changes
- Recalculates travel for same-day appointments
- Clears assigned resources if SchedStart/End null but resources exist
- Updates schedule mode (Optimization/Automatic/Manual)
- Evaluates
  [scheduling recipes](https://help.salesforce.com/articleView?id=pfs_create_scheduling_recipe.htm&type=5&language=en_US)
  (Canceled/Shortened/Late-end/Emergency)
- Bundle logic if: Bundling enabled, ApexMode=2
- Auto-bundle API if: Bundling enabled, auto-bundling enabled, conditions met

**Before Delete:**

- Deletes calendar events
- Deletes assigned resource records
- Removes territory public group sharing on parent WO

### Service Resource Trigger (TR008)

**Before Insert:**

- Validates Efficiency in range 0.1-10
- Validates unique ServiceCrewId reference

**After Insert:**

- Creates ServiceResourceShare if location-based sharing enabled

**Before Update:**

- If IsCapacityBased changed false→true: validates only 1 non-secondary STM
- Validates Efficiency in range 0.1-10
- If IsCapacityBased=true: validates no ServiceCrewMember records
- Validates unique ServiceCrewId reference on change

**After Update:**

- Recreates sharing records if RelatedRecordId changed

### Service Resource Capacity Trigger (TR012)

_Note: Named "AfterUpdate" but fires Before Insert/Update only_

**Before Insert/Update:**

- Validates monthly capacities start on 1st of month
- Validates no overlapping capacities (same resource + duration type + date)
- Validates TimePeriod and EndDate
- Updates MinutesUsed\_\_c from scheduled services
- Updates Work_Items_Allocated\_\_c if CapacityInWorkItems set
- Updates Last Updated Epoch (ms since 1970-01-01 00:00:00 GMT)

### Service Territory Trigger (TR016)

**Before Insert:**

- Validates unique territory name (if Enable Territory Name Duplicates=off)
- Fills street-level routing geolocation if coordinates exist

**After Insert:**

- Creates public group if Enable User Territories enabled
- Adds territory group to parent territory group
- Sets FSL**TerritoryLevel**c if Enable Service Auto Classification=on
- Triggers serviceTerritoryRefresh API if: Bundling enabled, ApexMode=2

**Before Update:**

- Validates unique territory name on change
- Fills street-level routing geolocation

**After Update:**

- Updates public group if name/owner changed
- Recalculates FSL**TerritoryLevel**c if parent changed
- Triggers serviceTerritoryRefresh API on OperatingHours change

**Before Delete:**

- Deletes public group
- Updates children FSL**TerritoryLevel**c
- Triggers serviceTerritoryRefresh API

### Service Territory Member Trigger (TR018)

**Before Insert:**

- Removes seconds from DateTime fields
- Validates no date collision with primary/relocation STM
- Validates no same-territory secondary STM in same date

**After Insert:**

- Creates sharing records for: Service Resource, Operating Hours
- Adds resource to territory public group

**Before Update:**

- Date collision validation on date/territory changes
- Validates EffectiveEndDate after EffectiveStartDate

**After Update:**

- Updates sharing records on territory/date changes
- Updates public group membership

**After Delete:**

- Removes sharing records
- Removes from territory public group

### Work Order Trigger (TR006)

**Before Insert:**

- Validates required fields
- Sets default values

**After Insert:**

- Creates sharing records for territory public groups

**Before Update:**

- Validates required fields

**After Update:**

- Updates sharing on territory changes
- Triggers related service appointment updates

**Before Delete:**

- Removes territory sharing records

---

## APIs

### REST API Endpoints

| Endpoint                      | Version | Purpose                              |
| ----------------------------- | ------- | ------------------------------------ |
| Appointment Bundling          | -       | Create/remove/unbundle bundles       |
| Field Service Flow            | 42.0+   | Flow information retrieval           |
| Field Service Mobile Settings | 42.0+   | Mobile app settings for context user |
| Service Report Template       | 40.0+   | Service report template info         |

**Standard Operations:** CRUD on all FS objects via standard REST patterns

**Authentication:** OAuth 2.0, session-based

### Metadata API Types

| Type                 | Purpose                           |
| -------------------- | --------------------------------- |
| FieldServiceSettings | Org-level FS settings             |
| Skill                | Skill definitions and assignments |
| TimeSheetTemplate    | Time sheet creation templates     |

**Operations:** Delete, Deploy, Retrieve, Update

### Tooling API Objects

| Object            | Version | Purpose                          |
| ----------------- | ------- | -------------------------------- |
| CleanRule         | -       | Data integration rule management |
| TimeSheetTemplate | 46.0+   | Time sheet template metadata     |

---

## Apex Reference

### FSL Namespace

All Field Service managed package classes use the `FSL` namespace prefix.

**Permission Sets Required:** FSL Agent, FSL Admin, FSL Dispatcher, etc.

### RecurringAppointmentsManager

**Namespace:** `FSL` **Purpose:** Create/manage recurring service appointments

```apex
FSL.RecurringAppointmentsManager ram = new FSL.RecurringAppointmentsManager();
```

**Use Cases:** Appointment series, maintenance plans, recurring service visits

### OAAS (Optimization as a Service)

**Namespace:** `FSL` **Purpose:** Programmatic optimization access

```apex
FSL.OAAS oaas = new FSL.OAAS();
```

**Use Cases:** Custom optimization workflows, external system integration,
triggered optimization

---

## Code Examples

### Create Service Report (Apex)

```apex
// Makes callout to createServiceReport action REST API
// Creates report with signatures from WO/WOLI/SA
```

See:
[Create Service Report with Apex](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_code_samples_sr.htm)

### Generate Work Orders from Maintenance Plan (Apex)

```apex
// Makes callout to generateWorkOrder action REST API
// Creates WO records from maintenance plan
```

See:
[Generate Work Orders on Maintenance Plans with Apex](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_code_samples_wo.htm)

### Dispatcher Console Custom Actions

Configure Apex classes or VF pages for custom dispatcher actions. See:
[Code Examples: Dispatcher Console Custom Actions](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_code_samples_dispatcher.htm)

### Create Service Appointment Lists

```apex
// Requires "Create Temporary Service Appointment List" custom permission
// Subscribes to CreateFilterEvent__e platform event
```

See:
[Create Service Appointment Lists in the Dispatcher Console](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_code_samples_sal.htm)

---

## Mobile Development

### LWC in Field Service Mobile

Build Lightning Web Components for mobile app enhancement. See:
[Get Started with Lightning Web Components in the Field Service Mobile App](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sfs_gs.htm)

### Deep Linking

Direct navigation to specific app locations.

**Format:** `com.salesforce.fieldservice://[path]`

See:
[Configure Deep Linking for the Field Service Mobile App](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_mobile_deep_linking.htm)

### Custom Service Document Components

Custom LWC templates for service documents/branding. See:
[Build Custom Lightning Web Components for Service Documents](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_mobile_document_builder.htm)

### Mobile Plug-ins

Extend mobile functionality with LWC plug-ins. See:
[Add Lighting Web Components for Plug-Ins to the Field Service Mobile App](https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_mobile_lwc.htm)

---

## Admin Guide

### Prerequisites

1. Field Service enabled in org
2. [Field Service managed package](https://help.salesforce.com/articleView?id=pfs_install.htm&language=en_US)
   installed
3. Field Service settings configured
4. Permissions and access configured

### Permission Set Licenses

| License                       | Purpose                      |
| ----------------------------- | ---------------------------- |
| Field Service Scheduling      | Scheduling features          |
| Field Service Dispatcher      | Dispatcher Console           |
| Field Service Mobile          | Mobile app access            |
| Field Service Contractor      | External contractor access   |
| Field Service Contractor Plus | Extended contractor features |

### Permission Sets (Managed Package)

| Permission Set             | Purpose                     |
| -------------------------- | --------------------------- |
| FSL Admin                  | Full admin access           |
| FSL Agent                  | Call center/booking access  |
| FSL Community Dispatcher   | Experience Cloud dispatcher |
| FSL Community Self Service | Customer self-service       |
| FSL Dispatcher             | Dispatcher Console access   |
| FSL Integration            | Integration user access     |
| FSL Mobile                 | Mobile app access           |
| FSL Resource               | Field technician access     |
| FSL Self Service           | Limited self-service        |

### Assignment Steps

**Permission Set License:**

1. Setup → Users → [User Name]
2. Permission Set License Assignments → Edit Assignments
3. Enable appropriate licenses → Save

**Permission Set:**

1. Setup → Permission Sets → [Select Set]
2. Manage Assignments → Add Assignments
3. Select users → Assign → Done

### License Considerations

| User Type                             | Requirements                                 |
| ------------------------------------- | -------------------------------------------- |
| Contractors                           | Login-based PSL (Contractor/Contractor Plus) |
| Experience Cloud                      | Additional PSL may be required               |
| Guest Users                           | Field Service Guest User permission set      |
| Inventory Managers/Admins/Call Center | Standard Salesforce, no FSL PSL needed       |
| Standard Users                        | FSL-enabled org access                       |

### Configuration Checklist

**Territories & Hours:**

- [ ] Create service territories
- [ ] Define territory hierarchy
- [ ] Create operating hours
- [ ] Add holidays to operating hours
- [ ] Set up shifts (if used)

**Work Orders:**

- [ ] Create work types
- [ ] Define skills
- [ ] Configure work order settings
- [ ] Set up status categories
- [ ] Enable knowledge (if used)
- [ ] Configure paths (if used)
- [ ] Set up maintenance work rules (if used)

**Workforce:**

- [ ] Create service resources
- [ ] Link resources to users
- [ ] Assign skills to resources
- [ ] Assign resources to territories
- [ ] Configure capacity (if capacity-based)
- [ ] Set up service crews (if used)

**Inventory (if used):**

- [ ] Create inventory locations
- [ ] Create product items
- [ ] Configure serialized inventory
- [ ] Set up product requests/transfers

**Scheduling:**

- [ ] Create scheduling policies
- [ ] Configure work rules
- [ ] Define service objectives
- [ ] Activate optimization
- [ ] Test scheduling scenarios

**Integration:**

- [ ] Create integration permission set
- [ ] Configure
      [calendar sync](https://help.salesforce.com/articleView?id=000316720&type=1&language=en_US)
      (if used)

**Appointments:**

- [ ] Customize appointment lifecycle
- [ ] Configure derivation settings
- [ ] Set up booking settings
- [ ] Handle time zones

### Custom Settings

| Setting                            | Default | Purpose                              |
| ---------------------------------- | ------- | ------------------------------------ |
| Enable Service Auto Classification | On      | Auto-calculate TerritoryLevel\_\_c   |
| Enable Territory Name Duplicates   | Off     | Allow duplicate territory names      |
| Enable User Territories            | -       | Create public groups for territories |
| Use Bundle Apex Mode               | -       | 0/1/2 for bundling behavior          |

---

## Data Model Details

See:
[Field Service Data Model Gallery](https://developer.salesforce.com/docs/platform/data-models/guide/field-service-category.html)

### Expense Management

| Object             | Relationships                       |
| ------------------ | ----------------------------------- |
| Account            | Parent for expense tracking         |
| Expense            | Links to WorkOrder, ServiceResource |
| ExpenseReport      | Contains ExpenseReportEntry records |
| ExpenseReportEntry | Individual expense line items       |
| WorkOrder          | Associated work                     |

### Inventory Management

| Object                 | Key Relationships              |
| ---------------------- | ------------------------------ |
| ProductItem            | Product + Location             |
| ProductItemTransaction | ProductItem + WO/SA            |
| ProductRequest         | WO/WOLI + InventoryLocation    |
| ProductRequestLineItem | ProductRequest + Product       |
| ProductTransfer        | ProductItem + From/To Location |
| ReturnOrder            | WO + Account                   |
| SerializedProduct      | Product + ProductItem          |
| Shipment               | ProductTransfer                |

## Field Service Warranty Management Data Model

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_warranty.htm

Use warranty items to record details of the labor, parts, and expenses, along
with any exchange options, that are provided to rectify issues with products
sold or installed. Create standard warranties for products and product families
and, for products you install, record details of additional or extended
warranties along with exclusions and void terms.

**Note:** Asterisks in data model diagrams signify required fields.

### Warranty Terms

**Product Warranty Terms:** A **warranty term** is linked to a **product
warranty term** to define the standard warranty offered for a product or product
family.

**Asset Warranty Terms:** When a product is installed, **asset warranty term**
details are created from the standard warranty.

**Warranty Term Associations:** An asset warranty term can be associated with:

- **Work orders**
- **Work order line items**
- **Cases**
- **Entitlements**

These associations track actions related to the fulfillment of the warranty term
provisions.

### Warranty Management

| Object              | Key Relationships     |
| ------------------- | --------------------- |
| Warranty            | Product/Asset/Account |
| ProductWarrantyTerm | Product + Warranty    |
| AssetWarranty       | Asset + Warranty      |

## Field Service Product Service Campaign Data Model

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_product_service_campaign.htm

Use product service campaign to record the actions to address situations such as
product recalls, manual firmware upgrades, safety or compliance audits, or
end-of-life communications.

**Note:** Asterisks in data model diagrams mean these fields are required.

### Product Service Campaign Overview

**Purpose:** Product service campaigns are used to track and manage actions for:

- Product recalls
- Manual firmware upgrades
- Safety or compliance audits
- End-of-life communications

**Asset Association:** Assets affected are associated with a campaign using
**product service campaign items**.

**Work Association:** Campaign and campaign items can then be associated with
**work orders** and **return orders** as needed to complete the work.

### Product Service Campaign

| Object                         | Key Relationships     |
| ------------------------------ | --------------------- |
| ProductServiceCampaign         | Product/Asset/Account |
| ProductServiceCampaignLineItem | Campaign + Asset      |

## Field Service Pricing Data Model

**URL:**
https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_pricing.htm

Link work orders to products or assets in your org to track product pricing and
work being performed on your customers' installed products.

**Note:** Asterisks in data model diagrams signify required fields.

### Price Books and Work Orders

**Product Catalog Integration:** If you've set up a product catalog in
Salesforce to track the goods and services your business offers, you can
associate items in your price books with work orders and their line items,
similar to the way you can associate products with opportunities or orders.

**Price Book on Work Order:** If you specify a **price book** on a **work
order**, this allows you to link each **work order line item** to a **price book
entry** (product) from the price book. List price, discount, and quantity are
defined at the line-item level.

**Example:** If you create a work order for a solar panel installation, select a
price book in the Price Book lookup field on the work order. Then, use the Price
Book Entry lookup field on its work order line items to select goods or services
listed in your price book, such as Site Assessment, Solar Panel, and Inverter. A
quick glance at a completed work order's line items shows you which products
from your product catalog were sold as part of the work order.

### Assets and Work Tracking

**Asset Tracking:** After a product is purchased and installed for a customer,
it is typically tracked as an **asset** in Salesforce. The Asset lookup field on
work orders and work order line items allows you to track work being performed
on a specific asset. It also makes it possible to view a history of all work
completed on the asset.

### Asset Relationships

**Asset Replacement and Upgrades:** If an asset is replaced or upgraded, the
relationship between the old and new asset is tracked in an **asset
relationship** record. An asset relationship lists:

- A start and end time—for instance, if the replacement asset is being leased
- A relationship type, which must be defined by the admin

**See Also:**

- [Work Order Pricing Guidelines for Field Service](https://help.salesforce.com/articleView?id=wo_pricing.htm&language=en_US)
- [Equal Asset Relationships](https://help.salesforce.com/articleView?id=assets_wo_equal.htm&language=en_US)

---

## Custom Settings Quick Reference

| Setting                            | Default | Purpose                                    |
| ---------------------------------- | ------- | ------------------------------------------ |
| Enable Territory Name Duplicates   | Off     | Allow duplicate names                      |
| Enable User Territories            | Off     | Create territory public groups             |
| Enable Service Auto Classification | On      | Auto-calculate TerritoryLevel\_\_c         |
| Use Bundle Apex Mode               | 0       | 0=off, 1=partial, 2=full apex bundle logic |

---

## Field References (External Links)

| Object               | Link                                                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Service Appointment  | [Service Appointment Fields](https://help.salesforce.com/s/articleView?language=en_US&id=service.fs_service_appointment_fields.htm&type=5)   |
| Service Crew         | [Service Crew Fields](https://help.salesforce.com/s/articleView?language=en_US&id=service.fs_crew_fields.htm&type=5)                         |
| Service Report       | [Service Report Fields](https://help.salesforce.com/s/articleView?language=en_US&id=service.fs_customer_reports_fields.htm&type=5)           |
| Service Resource     | [Service Resource Fields](https://help.salesforce.com/s/articleView?language=en_US&id=service.fs_resource_fields.htm&type=5)                 |
| Service Territory    | [Service Territory Fields](https://help.salesforce.com/s/articleView?language=en_US&id=service.fs_territory_fields.htm&type=5)               |
| Work Order           | [Work Order Fields](https://help.salesforce.com/s/articleView?language=en_US&id=service.fs_work_order_fields.htm&type=5)                     |
| Work Order Line Item | [Work Order Line Item Fields](https://help.salesforce.com/s/articleView?language=en_US&id=service.fs_work_order_line_item_fields.htm&type=5) |

---

## URL Reference

| ID               | URL                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| ANALYTICS        | https://help.salesforce.com/s/articleView?language=en_US&id=analytics.bi_app_field_service_wave.htm&type=5                                 |
| DATA_MODEL       | https://developer.salesforce.com/docs/platform/data-models/guide/field-service-category.html                                               |
| DATA_EXPENSE     | https://developer.salesforce.com/docs/platform/data-models/guide/field-service-expense-management.html                                     |
| DEV_GUIDE        | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/                                                |
| DEV_SETUP        | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_set_up.htm                              |
| API_EOL          | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_api_eol.htm                                 |
| OBJECTS          | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap.htm                                |
| OBJ_CORE         | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_core.htm                           |
| OBJ_INVENTORY    | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_inventory.htm                      |
| OBJ_MAINTENANCE  | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_maintenance.htm                    |
| OBJ_CAMPAIGN     | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_product_service_campaign.htm       |
| OBJ_WARRANTY     | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_warranty.htm                       |
| OBJ_PRICING      | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_soap_pricing.htm                        |
| OBJ_REF          | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_object_references.htm                   |
| REST             | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_rest.htm                                |
| REST_FLOW        | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_fieldserviceflow.htm                    |
| REST_MOBILE      | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_fieldservicemobilesettings.htm          |
| REST_REPORT      | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_servicereporttemplate.htm               |
| REST_BUNDLE      | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_rest_sabundling.htm                         |
| METADATA         | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_metadata.htm                            |
| META_SETTINGS    | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/meta_fieldservicesettings.htm                   |
| META_SKILL       | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/meta_skills.htm                                 |
| META_TIMESHEET   | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/meta_timesheettemplate.htm                      |
| TOOLING          | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_tooling.htm                             |
| TOOL_CLEAN       | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/tooling_api_objects_cleanrule.htm               |
| TOOL_TIMESHEET   | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/tooling_api_objects_timesheettemplate.htm       |
| APEX             | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_mp_intro.htm                            |
| APEX_NS          | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/apex_namespace_FSL.htm                          |
| APEX_RECURRING   | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/apex_class_FSL_RecurringAppointmentsManager.htm |
| APEX_OAAS        | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/apex_class_FSL_OAAS.htm                         |
| TRIGGERS         | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_custom_triggers.htm                     |
| CODE             | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_code_samples.htm                        |
| CODE_SR          | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_code_samples_sr.htm                     |
| CODE_WO          | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_code_samples_wo.htm                     |
| CODE_DISPATCHER  | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_code_samples_dispatcher.htm             |
| CODE_SAL         | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_code_samples_sal.htm                    |
| MOBILE           | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_mobile_intro.htm                        |
| MOBILE_LWC       | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/sfs_gs.htm                                      |
| MOBILE_DOC       | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_mobile_document_builder.htm             |
| MOBILE_DEEP      | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_mobile_deep_linking.htm                 |
| MOBILE_PLUGIN    | https://developer.salesforce.com/docs/atlas.en-us.field_service_dev.meta/field_service_dev/fsl_dev_mobile_lwc.htm                          |
| FIELDS_SR        | https://help.salesforce.com/s/articleView?language=en_US&id=service.fs_customer_reports_fields.htm&type=5                                  |
| FIELDS_CREW      | https://help.salesforce.com/s/articleView?language=en_US&id=service.fs_crew_fields.htm&type=5                                              |
| FIELDS_TERRITORY | https://help.salesforce.com/s/articleView?language=en_US&id=service.fs_territory_fields.htm&type=5                                         |
| FIELDS_RESOURCE  | https://help.salesforce.com/s/articleView?language=en_US&id=service.fs_resource_fields.htm&type=5                                          |
| FIELDS_WO        | https://help.salesforce.com/s/articleView?language=en_US&id=service.fs_work_order_fields.htm&type=5                                        |
| FIELDS_WOLI      | https://help.salesforce.com/s/articleView?language=en_US&id=service.fs_work_order_line_item_fields.htm&type=5                              |
| FIELDS_SA        | https://help.salesforce.com/s/articleView?language=en_US&id=service.fs_service_appointment_fields.htm&type=5                               |
| TRAILHEAD        | https://trailhead.salesforce.com/en/trails/field_service                                                                                   |
| LEARNING_MAP     | https://help.salesforce.com/s/articleView?id=sf.fs_landing.htm&type=5&language=en_US                                                       |
| INSTALL_PKG      | https://help.salesforce.com/articleView?id=pfs_install.htm&language=en_US                                                                  |
| RECIPE           | https://help.salesforce.com/articleView?id=pfs_create_scheduling_recipe.htm&type=5&language=en_US                                          |
| CAL_SYNC         | https://help.salesforce.com/articleView?id=000316720&type=1&language=en_US                                                                 |
| API_RETIRE_20    | https://help.salesforce.com/articleView?id=000351312&type=1&mode=1&language=en_US                                                          |
| API_RETIRE_30    | https://help.salesforce.com/articleView?id=000354473&type=1&mode=1&language=en_US                                                          |
| SOAP_API         | https://developer.salesforce.com/docs/atlas.en-us.258.0.api.meta/api/sforce_api_quickstart_intro.htm                                       |
| REST_API         | https://developer.salesforce.com/docs/atlas.en-us.258.0.api_rest.meta/api_rest/intro_what_is_rest_api.htm                                  |
| SOQL             | https://developer.salesforce.com/docs/atlas.en-us.258.0.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_sosl_intro.htm                      |

---

## API Deprecation

| Version   | Status     | Retirement |
| --------- | ---------- | ---------- |
| ≤20.0     | Deprecated | Summer '22 |
| 21.0-30.0 | Deprecated | Summer '22 |

**Best Practices:**

- Monitor release notes
- Plan migration paths
- Review deprecation timelines quarterly
- Test in sandbox before production
- Update integrations/custom code
