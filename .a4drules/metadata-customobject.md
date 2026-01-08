# Rule: PermissionSet Metadata

**Description:** Validate and enforce correct structure, placement, and API/version rules for PermissionSet components.

**Applies to:** `**/*.permissionset`, `**/*.permissionset-meta.xml`

## Guidelines

- File suffix & location
  - Files must reside in the `permissionsets/` folder and use the `.permissionset` suffix. Accept generator meta filenames when present (e.g., `Name.permissionset-meta.xml`).

- Required identity fields
  - `fullName` (inherited) required and must follow base metadata naming rules (start with a letter, letters/numbers/underscores only, no spaces, no consecutive `__`, not end with `_`, unique in package).
  - `label` is required (string, max 80 characters).

- API/version behavior
  - PermissionSet type available API ≥ 22.0.
  - Retrieval behavior changes by API:
    - API ≥ 40.0: retrieving a permission set returns all exposed content (Apex, CRUD, etc.). When deploying, include all permission-set metadata to avoid overwrites.
    - API ≤ 39.0: retrieval/deploy returns only app/system permissions by default; junction metadata included only if related component(s) are in package.
  - Field-level availability: validate fields against minimum API versions (e.g., customMetadataTypeAccesses ≥ 47.0, agentAccesses ≥ 63.0, emailRoutingAddressAccesses ≥ 62.0, externalCredentialPrincipalAccesses ≥ 59.0, servicePresenceStatusAccesses ≥ 64.0).

- Access & permission rules
  - Special access required: only users with admin permissions (View Setup and Configuration, Manage Session Permission Set Activations, Assign Permission Sets, or Manage Profiles and Permission Sets) can view some permission-set details; warn when exporting changes for users without those rights.
  - When deploying a permission set, include related components (CustomObject, CustomField, Apex classes/pages, Flows, etc.) if the permission set references them (objectPermissions, fieldPermissions, classAccesses, pageAccesses, flowAccesses). Otherwise deployment may inadvertently remove junction entries.

- Collections & elements
  - Validate arrays of access elements (applicationVisibilities, classAccesses, fieldPermissions, objectPermissions, recordTypeVisibilities, tabSettings, userPermissions, customPermissions, etc.) for required subfields and value constraints:
    - Example: objectPermissions entries require object (API name) and boolean flags (allowCreate/Read/Edit/Delete, modifyAllRecords, viewAllRecords).
    - fieldPermissions require `field` (API name) and `readable`/`editable` booleans; note retrieval/deploy differences by API version.
    - applicationVisibilities entries require `application` and `visible` boolean.
    - userPermissions/customPermissions entries require `name` and `enabled` boolean.

- Field permissions & required fields
  - **Required fields must have `editable` set to `true`.** If a field is marked as required on the object (either via field definition or page layout), setting `editable` to `false` in fieldPermissions will cause a deployment error. Salesforce enforces that users must be able to edit required fields.
  - When `editable` is `true`, `readable` must also be `true` (a field cannot be editable but not readable).
  - If `viewAllFields` is enabled on objectPermissions, individual fieldPermissions entries may be omitted on retrieve.

- Naming and packaged references
  - When referencing packaged components include namespace prefix: `namespace__ComponentName` or `namespace__Parent__c.Child__c` for parented items.
  - When referencing record types use `SObject.RecordTypeName` format (e.g., `Account.MyRecordType`).

- Wildcard & manifest
  - PermissionSet supports wildcard (`*`) in package.xml. Be aware of API/version behavior when retrieving all permission sets.
  - When retrieving permission sets, also retrieve related components referenced by the permission set to get complete junction metadata.

## Validation checklist

- File path: `permissionsets/<Name>.permissionset` (or `<Name>.permissionset-meta.xml`).
- `fullName` present and matches naming pattern.
- `label` present and ≤ 80 chars.
- Package API version appropriate for any advanced fields used (validate per-field minima).
- If API ≥ 40.0, expect full permission content on retrieve; ensure deploy packages include full content to avoid loss.
- For each array element:
  - objectPermissions: `object` present; booleans present and valid.
  - fieldPermissions: 
    - `field`, `readable`, `editable` present where required.
    - **If field is required on the object, `editable` must be `true`.**
    - If `editable` is `true`, `readable` must also be `true`.
  - class/page/flow accesses: `apexClass`/`apexPage`/`flow` present and `enabled` boolean present.
  - applicationVisibilities: `application` and `visible`.
  - custom/customMetadata/customSetting access entries: `name` and `enabled`.
  - external credential principal entries: `externalCredentialPrincipal` format and namespace rules when packaged.
- If permission set references other components (objects, fields, classes, pages, flows, record types, external credentials), include those components in the same retrieve/deploy or validate they exist in target org.
- If `viewAllFields` or `viewAllRecords` are used, account for how this affects returned fieldPermissions on retrieve (some fields omitted when viewAllFields is enabled).
- Confirm uniqueness of permission set fullName across package.

## Compact rule form

```text
# Rule: PermissionSet Metadata
Description: Validate placement, fields, and version rules for permission sets
Applies to: `**/*.permissionset`, `**/*.permissionset-meta.xml`
Guidelines:
- File in permissionsets/, suffix .permissionset (accept -meta.xml)
- Require fullName and label (label ≤ 80 chars)
- Validate field availability by API version (e.g., customMetadataTypeAccesses ≥47)
- When deploying, include referenced components to avoid losing junction data (API ≥40 behavior)
- Validate array elements: objectPermissions, fieldPermissions, class/page/flow accesses, applicationVisibilities, user/custom permissions
- fieldPermissions: required fields must have editable=true; editable=true requires readable=true
- Namespaced references must use `ns__` prefix where appropriate
- Supports `*` in package.xml; retrieving permission sets should include related components
```
