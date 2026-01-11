# Aura Component Reference

> **Version**: 1.0.0

## Meta

- Prefer LWC; Aura for backward compat
- Use `lightning:` namespace (SLDS1, built-in a11y)
- A11y: `label`/`aria-label` (buttons), `alternative-text` (icons/images),
  associated labels (inputs)
- ARIA: `role`, `aria-expanded`, `aria-pressed`, `aria-current`, `tabindex`
- Events: `aura:if` (conditional), `aura:iteration` (lists), component/app
  events
- Styling: SLDS utility classes + CSS custom props; no internal overrides
- SLDS1 only; SLDS2 incompatible

## Notation

`→LWC:X`=Aura-only,use X in LWC | `See:X`=ref X | `SLDS:x`=implements blueprint
| `API X+`=requires≥X.0 | `⚠dep`=deprecated | `LX`=Lightning Experience |
`req`=required | `ro`=read-only

## Types

`str`=string `bool`=boolean `num`=number `obj`=object `arr`=array
`comp`=component

## aura:\*

**aura:component** - Root container `access`:str=public/global |
`controller`:str=ns.Class | `extends`:comp | `extensible`:bool(def:false) |
`implements`:str(comma-sep) | `isTemplate`:bool |
`template`:comp(def:aura:template)

**aura:expression** - Renders `{!expr}`. `value`:any(req). Providers: `v`(attr),
`c`(controller), `m`(model)

**aura:html** - HTML wrapper. `tag`:str(req) | `HTMLAttributes`:obj |
`body`:comp/arr

**aura:if** - Conditional (server-eval, lazy). `isTrue`:bool(req) |
`else`:comp/arr. Switching destroys/creates branches.

**aura:iteration** - Iterator. `items`:arr(req) | `var`:str(req) |
`indexVar`:str. Auto-rerenders.

**aura:renderIf** - ⚠dep→`aura:if`. Re-evals on change, renders both branches.

**aura:template** - Bootstrap template. Extend+`aura:set` for custom.

**aura:text** - Plain text. `value`:str(ro)

**aura:unescapedHtml** - ⚠XSS. Raw HTML. `value`:str(req). Sanitize first.

## force:\*

**force:canvasApp** →LWC:Canvas via iframe. `namespacePrefix`:str |
`developerName`:str | `applicationName`:str. One of
developerName/applicationName req.

**force:inputField** →LWC:`lightning-input-field`+`lightning-record-edit-form`.
`value`:obj. Events:`change`(blur). No SLDS.

**force:outputField**
→LWC:`lightning-output-field`+`lightning-record-view-form`. `value`:obj

**force:recordData** →LWC:`lightning/ui*Api` wire. CRUD. `recordId`:str |
`fields`:arr | `targetFields`:obj | `targetRecord`:obj | `targetError`:obj.
Events:`recordUpdated`→changeType(ERROR/LOADED/REMOVED/CHANGED),changedFields.
Prefer `lightning:recordForm`.

**force:recordEdit** →LWC:`lightning-record-edit-form`. `recordId`:str(req).
Events:`onSaveSuccess`. Fire `force:recordSave` to save. Partial SLDS. No
Lightning Out.

**force:recordView** →LWC:`lightning-record-view-form`. `recordId`:str(req)

## forceChatter:\* (all →LWC:LWC Chatter APIs, Beta)

**forceChatter:feed** - Chatter feed. Works with `:publisher`. LX+Experience
Builder(Customer Service,Account Portal,Partner Central,Build Your Own).

**forceChatter:fullFeed** - Custom feed. Lightning Out/external only. Issues in
LX(temp post duplication).

**forceChatter:publisher** - Create posts. `context`:RECORD/GLOBAL. Works with
`:feed`. No mobile in LX; available mobile in communities.

## forceCommunity:\* (all →LWC:LWC community APIs)

**forceCommunity:appLauncher** - Beta. App Launcher. Req "Show App Launcher in
Experiences" perm. No Mobile App/Tabs+VF sites.

**forceCommunity:navigationMenuBase** - Abstract nav base. `menuItems`:arr(auto)
| `navigationLinkSetId`:str. Methods:`navigate(menuItemId)`

**forceCommunity:notifications** - Beta. Notifications. Template header only.

**forceCommunity:routeLink** - SEO-friendly anchor. `routeInput`:obj={recordId}

**forceCommunity:waveDashboard** - CRM Analytics in Community.

## lightning:\*

**lightning:accordion** API41+ →LWC:`lightning-accordion` SLDS:accordion
`activeSectionName`:str/arr | `allowMultipleSectionsOpen`:bool(def:false)
Slot:`lightning:accordionSection`. Events:`onsectiontoggle`→openSections.
Keys:Tab→Enter→L/R arrows.

**lightning:accordionSection** API41+ →LWC:`lightning-accordion-section`
`label`:str | `name`:str(req) | `headingLevel`:num(1-6). Slots:default,`actions`

**lightning:alert** API54+ →LWC:`lightning/alert` `message`:str(req) |
`label`:str(def:"Alert") | `variant`:header/headerless |
`theme`:default/shade/inverse/alt-inverse/success/info/warning/error/offline
Call `.openAlert()`→Promise. Works cross-origin iframes.

**lightning:avatar** →LWC:`lightning-avatar` SLDS:avatars `src`:str |
`initials`:str | `alternativeText`:str

**lightning:badge** →LWC:`lightning-badge` SLDS:badges `label`:str(req) |
`iconName`:str | `iconPosition`:str(end=after). No nav/links; use
`lightning:pill`.

**lightning:breadcrumb** →LWC:`lightning-breadcrumb`. In
`lightning:breadcrumbs`. `label`:str(req) | `href`:str(def:#) | `name`:str.
Events:`onclick`(use preventDefault for custom nav)

**lightning:breadcrumbs** →LWC:`lightning-breadcrumbs` SLDS:breadcrumbs
`class`:str. Slot:`lightning:breadcrumb`. ARIA:role=navigation,
last=aria-current=page.

**lightning:button** →LWC:`lightning-button` SLDS:buttons `label`:str(req) |
`type`:button/submit/reset |
`variant`:base/neutral/brand/brand-outline/destructive/destructive-text/inverse/success
| `iconName`:str | `iconPosition`:str(end) | `stretch`:bool | `title`:str |
`disabled`:bool | `ariaLabel`:str | `ariaDescribedBy`:str
Events:`onclick`→event.getSource(). Icon-only:use `lightning:buttonIcon`.
Menu:use `lightning:buttonMenu`.

**lightning:buttonGroup** →LWC:`lightning-button-group` SLDS:button groups.
Slot:`lightning:button`/`lightning:buttonMenu`

**lightning:buttonIcon** →LWC:`lightning-button-icon` SLDS:button icons
`iconName`:str(req) | `alternativeText`:str(req) |
`variant`:bare/border-filled/border/container/brand/inverse/success/destructive
| `size`:xx-small/x-small/small/medium/large | `title`:str | `tooltip`:str |
`disabled`:bool | `iconClass`:str Events:`onclick`

**lightning:buttonIconStateful** API41+ →LWC:`lightning-button-icon-stateful`
`iconName`:str(req) | `alternativeText`:str(req) | `selected`:bool |
variant/size/disabled same as buttonIcon Events:`onclick`

**lightning:buttonMenu** →LWC:`lightning-button-menu` SLDS:menus `label`:str |
`alternativeText`:str |
`variant`:border/border-inverse/border-filled/container/bare/bare-inverse |
`iconName`:str | `iconSize`:str | `disabled`:bool | `isLoading`:bool |
`loadingStateAlternativeText`:str | `isDraft`:bool |
`draftAlternativeText`:str(req if isDraft) | `visible`:bool |
`menuAlignment`:str(auto for overflow) | `title`:str | `tooltip`:str
Slot:`lightning:menuItem`/`lightning:menuDivider`/`lightning:menuSubheader`.
Events:`onselect`→value. Items created on trigger.

**lightning:buttonStateful** →LWC:`lightning-button-stateful` `label`:str |
`labelWhenSelected`:str | `labelWhenHover`:str | `iconName`:str |
`iconNameWhenSelected`:str | `buttonstate`:bool | variant/disabled
Events:`onclick`(toggle buttonstate in handler)

**lightning:card** →LWC:`lightning-card` SLDS:cards `title`:str |
`iconName`:str. Slots:default,`title`,`actions`,`footer`

**lightning:checkboxGroup** API41+ →LWC:`lightning-checkbox-group` SLDS:checkbox
`label`:str(req) | `name`:str(req) | `options`:arr(req)[{label,value}] |
`value`:arr | `required`:bool | `messageWhenValueMissing`:str | `disabled`:bool
| `validity`:obj(ro) Events:`onchange`→value[].
Methods:`checkValidity()`,`reportValidity()`,`setCustomValidity()`

**lightning:clickToDial** API41+ →LWC:`lightning-click-to-dial` `value`:str(req)
| `recordId`:str | `params`:obj. Works with
enableClickToDial/disableClickToDial/onClickToDial. No iframe.

**lightningcommunity:backButton** Beta →LWC:navigation APIs. Back nav
myCommunity iOS. Visible non-homepage with nav history.

**lightning:confirm** API54+ →LWC:`lightning/confirm` `message`:str(req) |
`label`:str(def:"Confirm") | `variant`:header/headerless | `theme`:(same as
alert) Call `.openConfirm()`→Promise

**lightning:container** No LWC. Hosts third-party JS in iframe. `src`:str(req) |
`alternativeText`:str. Events:`onmessage`. Use `message()` for comms. SPA only.
No hostname in src.

**lightning:datatable** API41+ →LWC:`lightning-datatable` SLDS:data tables.
Desktop only.
`columns`:arr(req)[{label,fieldName,type,sortable,editable,wrapText,fixedWidth,initialWidth,cellAttributes,typeAttributes,actions}]
| `data`:arr(req) | `keyField`:str(req) | `selectedRows`:arr |
`disabledRows`:arr | `maxRowSelection`:num(1=radio) |
`singleRowSelectionMode`:str(checkbox) | `hideCheckboxColumn`:bool |
`showRowNumberColumn`:bool | `rowNumberOffset`:num(def:0) |
`enableInfiniteLoading`:bool | `loadMoreOffset`:num(def:20) | `isLoading`:bool |
`totalNumberOfRows`:num | `resizeColumnDisabled`:bool |
`minColumnWidth`:num(def:50) | `maxColumnWidth`:num(def:1000) |
`columnWidthsMode`:fixed/auto | `hideTableHeader`:bool | `hideTableBorder`:bool
| `errors`:arr | `ariaLabel`:str
Events:`onrowselection`,`onloadmore`,`onsort`→fieldName/sortDirection,`oncellchange`→draftValues,`oncancel`,`onsave`,`onrowaction`,`onheaderaction`,`resize`
Methods:`getSelectedRows()`,`scrollToTop()`,`openInlineEdit()`,`focus()`
Types:text(def),action,boolean,button,button-icon,currency,date,date-local,email,location,number,percent,phone,url

**lightning:dualListbox** API41+ →LWC:`lightning-dual-listbox` SLDS:Dueling
Picklist `label`:str(req) | `sourceLabel`:str(def:Source) |
`selectedLabel`:str(def:Selected) | `options`:arr(req)[{label,value,disabled?}]
| `value`:arr | `min`:num | `max`:num | `required`:bool |
`messageWhenRange*/ValueMissing`:str | `disabled`:bool | `validity`:obj(ro)
Events:`onchange`→value[]. Limit≤50 options/list.
Methods:`checkValidity()`,`reportValidity()`,`setCustomValidity()`

**lightning:dynamicIcon** API41+ →LWC:`lightning-dynamic-icon` SLDS:dynamic
icons `type`:str(req)=ellie/eq/score/strength/trend/waffle |
`alternativeText`:str

**lightning:fileUpload** →LWC:`lightning-file-upload` SLDS:file selector
`recordId`:str | `accept`:str | `multiple`:bool |
`fileFieldName`:str(\***c+fileupload**c) | `fileFieldValue`:str
Events:`onuploadfinished`→files[{name,documentId}]. Max 10 files(admin:1-25),
2GB each. Guest:enable in Setup+sharing rules. No Lightning Out.

**lightning:flexipageRegionInfo** →LWC:Flexipage context APIs.
`regionWidth`:num(ro). Methods:`get()`→{width}. Events:`onload`

**lightning:flow** API41+ →LWC:`lightning-flow` `name`:str(req)=active flow API
name | `inputVariables`:arr[{name,value}]
Events:`onstatuschange`→status(STARTED/PAUSED/FINISHED/FINISHED_SCREEN/ERROR),flowTitle,outputVariables,activeStages,currentStage,helpText,guid

**lightning:formattedAddress** API42+ →LWC:`lightning-formatted-address`
`street`/`city`/`province`/`postalCode`/`country`:str |
`latitude`/`longitude`:num(faster) | `showStaticMap`:bool |
`disabled`:bool(plain text)

**lightning:formattedDateTime** →LWC:`lightning-formatted-date-time`. Uses
Intl.DateTimeFormat. `value`:str/Date/ts(req)=ISO8601/timestamp |
`timeZone`:str=IANA(def:user SF tz) | `timeZoneName`:short/long Date-only:use
timeZone="UTC". ISO:YYYY-MM-DDThh:mm:ssTZD

**lightning:formattedLocation** API41+ →LWC:`lightning-formatted-location`
`latitude`:num(req,-90-90) | `longitude`:num(req,-180-180)

**lightning:formattedName** API42+ →LWC:`lightning-formatted-name`
`salutation`/`firstName`/`middleName`/`lastName`/`suffix`/`informalName`:str |
`format`:short/medium/long | `locale`:str

**lightning:formattedNumber** →LWC:`lightning-formatted-number`. Uses
Intl.NumberFormat. `value`:num/str(req,str for precision) |
`style`:decimal/currency/percent/percent-fixed | `currency`:str(ISO4217) |
`currencyDisplayAs`:symbol/code/name | `minimum/maximumSignificantDigits`:num |
`minimum/maximumFractionDigits`:num

**lightning:formattedPhone** API41+ →LWC:`lightning-formatted-phone`
`value`:str(req) | `disabled`:bool(plain text). en-US/en-CA 10-11 digit starting
1→(999)999-9999

**lightning:formattedRichText** API41+ →LWC:`lightning-formatted-rich-text`.
Sanitized HTML. `value`:str(req) | `disableLinkify`:bool
Tags:a,abbr,acronym,address,br,big,blockquote,caption,cite,code,col,colgroup,del,div,dl,dd,dt,em,font,h1-h6,hr,img,ins,kbd,li,ol,mark,p,param,pre,q,s,samp,small,span,strong,sub,sup,table,tbody,td,tfoot,th,thead,tr,tt,u,ul,var,strike.
b→strong,i→em

**lightning:formattedText** API41+ →LWC:`lightning-formatted-text`
`value`:str(req,\n→<br/>) | `linkify`:bool(auto-link URLs/emails)

**lightning:formattedTime** API42+ →LWC:`lightning-formatted-time`. UTC.
`value`:str(req)=ISO8601 time(HH:mm:ss.SSS)

**lightning:helptext** →LWC:`lightning-helptext` SLDS:tooltips
`content`:str(req,no HTML) | `iconName`:str(def:utility:info) |
`alternativeText`:str(def:Help) | `iconVariant`:bare/error/inverse/warning

**lightning:icon** →LWC:`lightning-icon` `iconName`:str | `src`:str(custom
SVG:{!$Resource.x}#id) | `variant`:str |
`size`:xx-small/x-small/small/medium/large | `alternativeText`:str Custom SVG
needs `<g id="x">`. Fill via SVG fill attr.

**lightning:input** →LWC:`lightning-input` SLDS:input
`type`:checkbox/checkbox-button/date/datetime/time/email/file/password/search/tel/url/number/text
| `label`:str(req,variant=label-hidden to hide) | `value`:str/num/bool/Date |
`name`:str | `placeholder`:str | `required`:bool | `disabled`:bool |
`readonly`:bool | `variant`:standard/label-stacked/label-inline/label-hidden |
`min`/`max`:num/str | `step`:num/str(def:1) | `maxlength`/`minlength`:num |
`pattern`:str(regex) | `formatter`:percent/percent-fixed/currency(number only) |
`dateStyle`:short/medium/long | `timeStyle`:short/medium/long |
`timezone`:str(IANA) | `checked`:bool | `multiple`:bool(multi-email) |
`autocomplete`:str | `fieldLevelHelp`:str | `messageWhen*`:str |
`validity`:obj(ro) | `isLoading`:bool(search spinner) |
`messageToggleActive/Inactive`:str
Events:`onchange`(typing+finish),`oncommit`(finish
only),`onblur`,`onfocus`,`onkeydown`
Methods:`checkValidity()`,`reportValidity()`,`setCustomValidity()`. File:max
3.5MB, event.getSource().get("v.files")

**lightning:inputAddress** →LWC:`lightning-input-address`
`street`/`city`/`province`/`country`/`postalCode`/`subpremise`:str |
`countryOptions`/`provinceOptions`:arr[{label,value}] | `locale`:str |
`hideProvince`:bool | `showAddressLookup`:bool(Google Places,LX only) |
`countryLookupFilter`:arr(ISO,max 5) | `showCompactAddress`:bool |
`*Label`/`*Placeholder`:str | `required`:bool | `variant`:label-hidden
Events:`onchange`.
Methods:`checkValidity()`,`reportValidity()`,`setCustomValidityForField(field,msg)`

**lightning:inputField** →LWC:`lightning-input-field`. Direct child of
`lightning:recordEditForm` only. `fieldName`:str(req) | `value`:obj |
`required`:bool(client-side) | `variant`:str | `readonly`:bool(not:rich
text,picklists,lookup) Events:`onchange`→value. Methods:`reset()`
Supports:Address,Checkbox,Currency,Date,DateTime,Email,Geolocation,Lookup(not
OwnerId/CreatedBy/LastModifiedBy),Name,Number,Percent,Phone,Picklist(dependent
ok),Text,Text Encrypted,TextArea,TextArea Long,TextArea Rich,Time,URL

**lightning:inputLocation** →LWC:`lightning-input-location`
`latitude`:num(-90-90) | `longitude`:num(-180-180) | `*Label`/`*Placeholder`:str
| `required`:bool | `validity`:obj(ro) | `messageWhenValueMissing`:str |
`variant`:label-hidden Events:`onchange`→{latitude,longitude}.
Methods:`checkValidity()`,`reportValidity()`,`setCustomValidityForField(field,msg)`

**lightning:inputName** API42+ →LWC:`lightning-input-name`
`fieldsToDisplay`:str/arr=firstName/lastName/middleName/informalName/suffix/salutation
| field values:str | `options`:arr(salutation) | `required`:bool |
`validity`:obj(ro) | `messageWhenValueMissing`:str | `variant`:label-hidden
Events:`onchange`→{fieldNames:values}.
Methods:`checkValidity()`,`reportValidity()`,`setCustomValidityForField(field,msg)`

**lightning:inputRichText** →LWC:`lightning-input-rich-text` SLDS:rich text
editor. Quill WYSIWYG. `value`:str | `label`:str | `labelVisible`:bool |
`placeholder`:str | `required`:bool(needs labelVisible) | `valid`:bool |
`disabled`:bool | `formats`:arr(replaces default) |
`disabledCategories`:arr=FORMAT_FONT/FORMAT_TEXT/FORMAT_BODY/ALIGN_TEXT/INSERT_CONTENT/REMOVE_FORMATTING
| `shareWithEntityId`:str(image scope) Slot:`lightning:insertImageButton`.
Events:`onchange`→value. Methods:`getFormat()`,`setFormat({...})` Default
formats:font,size,bold,italic,underline,strike,list,indent,align,link,clean,table,header.
Additional:image,color,background,code,code-block,script,blockquote,direction.
Images:png/jpg/gif,max 1MB.

**lightning:insertImageButton** No LWC(built-in). Image button for
`lightning:inputRichText`. Child slot only. png/jpg/gif,max 1MB.

**lightning:layout** →LWC:`lightning-layout` SLDS:grid
`horizontalAlign`:center/space/spread/end |
`verticalAlign`:start/center/end/stretch | `pullToBoundary`:small/medium/large |
`multipleRows`:bool Slot:`lightning:layoutItem`

**lightning:layoutItem** →LWC:`lightning-layout-item` `size`:num(1-12) |
`smallDeviceSize`:num | `mediumDeviceSize`:num | `largeDeviceSize`:num |
`flexibility`:auto/grow/shrink/no-grow/no-shrink/no-flex |
`padding`:around-_/horizontal-_/vertical-\* small/medium/large

**lightning:listView** →LWC:`lightning/uiListsApi` `objectApiName`:str(req) |
`listName`:str(req) | `rowsToLoad`:num Supports inline/mass editing,column
resize/sort,search,Load More. Get
listName:`SELECT DeveloperName FROM ListView WHERE SObjectType='Account'`

**lightning:map** API44+ →LWC:`lightning-map` SLDS:map. Google Maps.
`mapMarkers`:arr(req)[{location,title,description,icon,value,type,mapIcon,...}]
| `center`:obj | `zoomLevel`:num(1-22 desktop,1-20 mobile) |
`selectedMarkerValue`:str | `listView`:hidden/visible | `markersTitle`:str |
`showFooter`:bool |
`options`:obj{draggable,zoomControl,scrollwheel,disableDefaultUI,disableDoubleClickZoom}
Events:`onmarkerselect`→selectedMarkerValue. Max 10 geocoded;use lat/long for
more. Recommend≤100. Shapes:Circle(radius),Rectangle(bounds),Polygon(paths).
Custom icons via mapIcon SVG.

**lightning:menuDivider** →LWC:`lightning-menu-divider`. In
`lightning:buttonMenu`. `variant`:compact

**lightning:menuItem** →LWC:`lightning-menu-item` SLDS:menus. In
`lightning:buttonMenu`. `label`:str(req) | `value`:str | `checked`:bool |
`iconName`:str(after) | `prefixIconName`:str(before) | `href`:str |
`target`:\_blank/\_self | `isDraft`:bool | `draftAlternativeText`:str(req if
isDraft) | `disabled`:bool

**lightning:menuSubheader** →LWC:`lightning-menu-subheader`. In
`lightning:buttonMenu`. `label`:str(req)

**lightning:messageChannel** →LWC:`lightning/messageService`. Pub/sub.
`type`:str(req,custom:\_\_c suffix). Methods:`publish(payload)`(req
aura:id),`subscribe(onMessage,scope)`→subscription.
Events:`onMessage`→event.getParam("message") Immediate child of aura:component.
Cross-DOM:Aura↔VF↔LWC. Wrap $A.enqueueAction in $A.getCallback if callback
triggers re-render.

**lightning:navigation** API43+ →LWC:`lightning/navigation`
`pageReference`:obj(req){type,attributes,state}.
Methods:`generateUrl()`→Promise(URL),`navigate()`(direct from onclick)
PageReference:type=PageDefinition API name,attributes per
PageDefinition,state=query params.
Ex:`/lightning/o/Account/list?filterName=MyAccounts`→{type:"standard\_\_objectPage",attributes:{objectApiName:"Account",actionName:"list"},state:{filterName:"MyAccounts"}}

**lightning:outputField** API41+ →LWC:`lightning-output-field`. In
`lightning:recordViewForm`. `fieldName`:str(req) | `variant`:compact |
`class`:str Auto FLS/locale/translations. No Apex. No spanning relationships.
Types:Address,Auto
Number,Checkbox,Currency,Date,DateTime,Email(mailto:),Encrypted,Formula,Geolocation,Lookup(not
OwnerId/CreatedBy/LastModifiedBy),Name,Number,Percent,Phone(tel:),Picklist/Multi-select,Text/TextArea/Long/Rich,Time,URL.
Invalid field=no output.

**lightning:path** →LWC:`lightning-path`. Path from picklist+Path Settings.
`recordId`:str | `variant`:str. Slot:key fields/guidance. Includes Mark
Complete. Configure:Setup>Path Settings. Implement
`flexipage:availableForAllPageTypes`.

**lightning:picklistPath** →LWC:`lightning-picklist-path` `recordId`:str |
`picklistFieldApiName`:str(req) | `variant`:str. No key fields/guidance/Mark
Complete. Mobile:truncated labels.

**lightning:pill** →LWC:`lightning-pill` SLDS:pills `label`:str(req) |
`href`:str(same tab) | `hasError`:bool(red+error icon) | `class`:str
Slot:`media`. Events:`onclick`,`onremove`(must hide/remove in handler).
preventDefault stops nav. Multiple:use `lightning:pillContainer`.

**lightning:pillContainer** API42+ →LWC:`lightning-pill-container` SLDS:pills
with container
`items`:arr(req)[{label,name?,href?,type?,src?,fallbackIconName?,variant?,alternativeText?,iconName?}]
| `variant`:bare/standard(better a11y) | `isCollapsible`:bool |
`isExpanded`:bool | `singleLine`:bool
Events:`onitemremove`→event.getParam("item").name,`onfocus`.
Types:text-only,link(href),avatar(type:"avatar",src
req),icon(type:"icon",iconName req utility only)

**lightning:progressBar** API41+ →LWC:`lightning-progress-bar` SLDS:progress
bars `value`:num(req,0-100) | `size`:x-small/small/medium/large

**lightning:progressIndicator** API41+ Beta →LWC:`lightning-progress-indicator`
SLDS:progress indicators `currentStep`:str | `type`:base/path |
`hasError`:bool(base only). Slot:`lightning:progressStep`.
ARIA:base→aria-valuenow/min/max,path→aria-selected.
Keys:Tab/Shift+Tab(base),arrows(path).

**lightning:progressRing** API48+ →LWC:`lightning-progress-ring` SLDS:progress
ring `value`:num(req,0-100) |
`variant`:base(green)/active-step(blue)/warning(yellow+icon)/expired(red+icon)/base-autocomplete(green+icon@100)

**lightning:progressStep** API41+ Beta →LWC:via `lightning-progress-indicator`
`label`:str(req) | `value`:str(req). Events:`onstepblur`,`onstepfocus`(base
only,returns index). No click event;add clickable element to update parent
currentStep.

**lightning:prompt** API54+ →LWC:`lightning-prompt` `message`:str(req) |
`defaultValue`:str | `label`:str(def:"Prompt") | `variant`:header/headerless |
`theme`:(same as alert) Call `.openPrompt()`→Promise→string(OK)/null(Cancel).
Works cross-origin iframes.

**lightning:quipCard** →LWC:Quip APIs. `parentRecordId`:str(req,15-char).
Actions:search,create doc/spreadsheet. Requires Quip enabled.

**lightning:radioGroup** API41+ →LWC:`lightning-radio-group` SLDS:radio button
`options`:arr(req)[{label,value}] | `value`:str | `name`:str(auto if omitted) |
`label`:str(req,legend) | `required`:bool | `disabled`:bool(always valid) |
`messageWhenValueMissing`:str | `type`:str(button=button group style) |
`validity`:obj(ro) Events:`onchange`→event.getParam("value").
Methods:`checkValidity()`,`reportValidity()`,`setCustomValidity()`. Reuse:omit
name or wrap in form.

**lightning:recordEditForm** API41+ →LWC:`lightning-record-edit-form`
`recordId`:str(req for edit,omit for create) | `objectApiName`:str(req) |
`recordTypeId`:str(req if multiple w/o default) | `density`:auto/comfy/compact
Slot:`lightning:inputField`(edit),`lightning:outputField`(read).
Events:`onload`→recordUi,`onsubmit`→fields(preventDefault for
custom),`onsuccess`→response,`onerror`→error Include
`lightning:button type="submit"` and `lightning:messages`. Auto FLS/sharing. UI
API objects only. No spanning relationships. Person
accounts:objectApiName="Account",contact fields use Person<FieldName>,custom
contact **pc,custom account **c. No multiple currencies. No nesting in other
record forms. Custom actions:implement force:lightningQuickAction,fire
force:refreshView after.

**lightning:recordForm** →LWC:`lightning-record-form` `recordId`:str(omit for
create) | `objectApiName`:str(req) | `mode`:edit/view/readonly |
`fields`:arr(alt to layoutType) | `layoutType`:Full/Compact(no Compact for
create) | `recordTypeId`:str | `density`:auto/comfy/compact
Events:`onload`,`onsubmit`,`onsuccess`(includes ID for
new),`onerror`,`oncancel`. Auto Cancel/Save in edit. Auto inline edit in view.
No prepopulating(use recordEditForm). Same limitations.

**lightning:recordViewForm** →LWC:`lightning-record-view-form`
`recordId`:str(req) | `objectApiName`:str(req) | `density`:auto/comfy/compact.
Slot:`lightning:outputField`. No Apex. Auto FLS/sharing. Use SLDS Grid for
columns.

**lightning:relativeDateTime** →LWC:`lightning-relative-date-time`
`value`:str/Date/ts(req). Output:"a few seconds ago","in 5 minutes","2 months
ago",etc. Unicode CLDR. Units:seconds→years. Language from org setting.

**lightning:select** →LWC:`lightning-combobox` `label`:str(req) | `value`:str |
`name`:str | `required`:bool | `disabled`:bool(always valid) |
`messageWhenValueMissing`:str(def:"Complete this field") | `validity`:obj(ro) |
`variant`:standard/label-stacked/label-inline/label-hidden
Events:`onchange`(user click only).
Methods:`checkValidity()`,`showHelpMessageIfInvalid()`. Use HTML `<option>`. No
multiple(use dualListbox). Use aura:iteration for dynamic.

**lightning:slider** API41+ →LWC:`lightning-slider` SLDS:slider `label`:str(req)
| `value`:num(clamped) | `min`:num(def:0) | `max`:num(def:100) | `step`:num |
`type`:horizontal/vertical | `disabled`:bool(always valid) |
`messageWhenRange*`:str | `messageWhenStepMismatch`:str | `validity`:obj(ro) |
`variant`:standard/label-stacked/label-inline/label-hidden Events:`onchange`(use
instead of onblur-Safari issues).
Methods:`checkValidity()`,`reportValidity()`,`setCustomValidity()`

**lightning:spinner** →LWC:`lightning-spinner` SLDS:spinners
`variant`:brand/inverse/default(dark blue) | `size`:str | `alternativeText`:str.
Use aura:if or slds-hide to toggle.

**lightning:tab** →LWC:`lightning-tab`. In `lightning:tabset`. `label`:str(req)
| `id`:str | `iconName`:str | `iconAssistiveText`:str(req if iconName) |
`endIconName`:str | `endIconAlternativeText`:str(req if endIconName) |
`showErrorIndicator`:bool Events:`onactive`. Can nest in aura:if/iteration.
Lazy:can only query active/previously-active.

**lightning:tabset** →LWC:`lightning-tabset` SLDS:tabs `selectedTabId`:str |
`variant`:default(global)/scoped(bordered)/vertical(side)
Slots:default(`lightning:tab`),`moretabs`(dynamic via $A.createComponent).
Events:`onactive`→event.getParam("id"). First tab default. Can nest scoped in
global. Overflow:nav buttons.

**lightning:textarea** →LWC:`lightning-textarea` SLDS:textarea `label`:str(req)
| `value`:str(clear:""not null) | `name`:str | `required`:bool |
`disabled`:bool(grayed,valid,not submitted) |
`readonly`:bool(focusable,submitted,no resize) | `maxlength`/`minlength`:num |
`variant`:standard/label-stacked/label-inline/label-hidden | `messageWhen*`:str
| `validity`:obj(ro) | `autocomplete`:str Events:`onchange`,`onblur`,`onfocus`.
Methods:`checkValidity()`,`reportValidity()`,`setCustomValidity()`,`setRangeText(replacement,start,end,selectMode)`.
No rows/cols. Don't use both disabled+readonly. Width from container.

**lightning:tile** →LWC:`lightning-tile` SLDS:tiles `label`:str(req) |
`media`:comp | `href`:str. For constrained space. Short lists(<10). Icons not in
Lightning Out.

**lightning:tree** API41+ →LWC:`lightning-tree` SLDS:trees
`items`:arr(req)[{label,name?,href?,metatext?,items?,expanded?,disabled?}] |
`selectedItem`:str Events:`onselect`→event.getParam("name")(also fires with href
before nav). Unlimited nesting(recommend flat). Keys:arrows,Enter/Space. Use
with breadcrumbs.

**lightning:treeGrid** API42+ →LWC:`lightning-tree-grid` SLDS:trees
`columns`:arr(req)[{fieldName,label,type,sortable?,cellAttributes?,typeAttributes?,actions?,iconName?,initialWidth?,wrapText?}]
| `data`:arr(req,\_children for nested) | `keyField`:str(req) |
`expandedRows`:arr | `selectedRows`:arr | `disabledRows`:arr |
`hideCheckboxColumn`:bool | `hideHeader`/`hideBorders`:bool |
`minColumnWidth`:num(def:50) | `maxColumnWidth`:num(def:1000) |
`columnWidthsMode`:fixed/auto | `resizeColumnDisabled`:bool |
`rowNumberOffset`:num(def:1) | `rowToggleIcon`:str/obj | `ariaLabel`:str
Events:`onsort`→fieldName/sortDirection,`ontoggle`→name/isExpanded/hasChildrenContent/row,`onrowselection`→selectedRows
Methods:`getCurrentExpandedRows()`,`expandAll()`,`collapseAll()`. Max 20 nested.
Types:first
col-button/button-icon/currency/date/number/percent/text/url;other-action/boolean/button/button-icon/currency/date/date-local/email/location/number/percent/phone/text/url.
No infinite scroll/inline edit.

**lightning:unsavedChanges** →LWC:notification mechanisms. `unsavedChanges`:obj.
Methods:`setUnsavedChanges(bool)`,`clearUnsavedChanges()`. Prompts save/discard
on close.

**lightning:verticalNavigation** →LWC:`lightning-vertical-navigation`
SLDS:vertical navigation `selectedItem`:str.
Slot:`lightning:verticalNavigationSection`,`lightning:verticalNavigationOverflow`.
One level. Width:full(specify CSS). More levels:use tree.

**lightning:verticalNavigationItem** →LWC:`lightning-vertical-navigation-item`.
`name`:str | `label`:str | `href`:str

**lightning:verticalNavigationItemBadge**
→LWC:`lightning-vertical-navigation-item-badge`. `name`:str | `label`:str |
`href`:str | `badgeCount`:num

**lightning:verticalNavigationItemIcon**
→LWC:`lightning-vertical-navigation-item-icon`. `name`:str | `label`:str |
`href`:str | `iconName`:str

**lightning:verticalNavigationOverflow**
→LWC:`lightning-vertical-navigation-overflow`. Slot:verticalNavigationItem\*.
Toggle shows/hides. No auto viewport adjust.

**lightning:verticalNavigationSection**
→LWC:`lightning-vertical-navigation-section`. `label`:str.
Slot:verticalNavigationItem\*

**ltng:require** →LWC:`lightning/platformResourceLoader`
`scripts`:str(comma-sep,use join) | `styles`:str | `afterScriptsLoaded`:action.
Events:`ltng:afterScriptsLoaded`,`ltng:beforeLoadingResources` Add to every
.cmp/.app using library. Resources load once(deduped same URL).
Multiple:`scripts="{!join(',', $Resource.lib1 + '/lib1.js', $Resource.lib2 + '/lib2.js')}"`.
Order preserved. No dedup between Aura ltng:require and LWC loadScript(script
must self-protect).

## ui:\* (⚠dep API47)

All deprecated. See "Aura Components in the ui Namespace Are Deprecated".

**ui:actionMenuItem** →`lightning-button-menu` | **ui:button**
→`lightning-button`. Events:press | **ui:checkboxMenuItem**
→`lightning-button-menu` | **ui:inputCheckbox** →`lightning-input`.
Events:change,click | **ui:inputCurrency** →`lightning-input` | **ui:inputDate**
→`lightning-input type="date"`. Mobile:native,format unsupported,iOS change
fires but value on blur | **ui:inputDateTime** →`lightning-input` |
**ui:inputDefaultError** →`lightning-input`(built-in) | **ui:inputEmail**
→`lightning-input` | **ui:inputNumber** →`lightning-input type="number"` |
**ui:inputPhone** →`lightning-input` | **ui:inputRadio**
→`lightning-radio-group` | **ui:inputRichText** →`lightning-input-rich-text` |
**ui:inputSecret** →`lightning-input` | **ui:inputSelect**
→`lightning-select`/`lightning-combobox`. Slot:ui:inputSelectOption |
**ui:inputSelectOption** →`lightning-select`/`lightning-combobox` |
**ui:inputText** →`lightning-input` | **ui:inputTextArea** →`lightning-textarea`
| **ui:inputURL** →`lightning-input` | **ui:menu** →`lightning-button-menu`.
Slot:ui:menuTriggerLink+ui:menuList | **ui:menuItem** →`lightning-button-menu` |
**ui:menuItemSeparator** →`lightning-button-menu` | **ui:menuList**
→`lightning-button-menu`. Events:ui:collapse,expand,menuFocusChange,menuSelect |
**ui:menuTrigger** →`lightning-button-menu` | **ui:menuTriggerLink**
→`lightning-button-menu` | **ui:message**
→`lightning/platformShowToastEvent`/`lightning/toast` | **ui:outputCheckbox**
→`lightning-formatted-text`/`lightning-checkbox` | **ui:outputCurrency**
→`lightning-formatted-number` | **ui:outputDate**
→`lightning-formatted-date-time` | **ui:outputDateTime**
→`lightning-formatted-date-time` | **ui:outputEmail**
→`lightning-formatted-email` | **ui:outputNumber** →`lightning-formatted-number`
| **ui:outputPhone** →`lightning-formatted-phone` | **ui:outputRichText**
→`lightning-formatted-rich-text` | **ui:outputText** →`lightning-formatted-text`
| **ui:outputTextArea** →`lightning-formatted-text` | **ui:outputURL**
→`lightning-formatted-url` | **ui:radioMenuItem** →`lightning-button-menu` |
**ui:scrollerWrapper** →CSS scrolling | **ui:spinner** →`lightning-spinner`.
Toggle:$A.get("e.toggle"),set isVisible,fire

## wave:\*

**wave:sdk** Aura-only. Tableau CRM SDK. Ref:`<wave:sdk aura:id="sdk"/>`.
Access:`component.find("sdk")`.
Methods:`invokeMethod(context,methodName,methodParameters,callback)`

**wave:waveDashboard** Aura-only. Embeds Tableau CRM dashboard. Available in App
Builder.

## Events

### aura:\*

**aura:applicationEvent** - Root type="APPLICATION". Loose coupling.
Handle:aura:handler w/event+action. Propagation:bubble then broadcast. Control
via phase(BUBBLE/CAPTURE).

**aura:componentEvent** - Root type="COMPONENT". Parent-child. Faster than app
events. Prefer when possible.

**aura:doneRendering** ⚠dep. Use render event. Fires initial render complete.
One handler/component.

**aura:doneWaiting** ⚠dep. Use action callback response status.

**aura:locationChange** - URL hash changes. Not useful in LX/mobile(use
navigation service). Params:`querystring`:str,`token`:str

**aura:methodCall** - Public method called. Params:`arguments`:list,`name`:str

**aura:noAccess** - Resource inaccessible. Params:`redirectURL`:str

**aura:systemError** - Server action error. Params:`error`:str,`message`:str

**aura:valueChange** - Attr value changes. Multiple handlers.
Params:`expression`:str,`index`:str,`oldvalue`:obj,`value`:obj

**aura:valueDestroy** - Component destroyed. Cleanup.
Register:`value="{!this}"`. Params:`value`:obj(req)

**aura:valueEvent** - Root type="VALUE". Sub:valueChange,valueInit,valueDestroy.

**aura:valueInit** - App/component init(before render).
Register:`value="{!this}"`. Params:`value`:obj(req)

**aura:waiting** ⚠dep. Execute after queueing action. One handler/component.

### force:\*

**force:closeQuickAction** →LWC:Navigation/Quick Action Panel API. Closes quick
action. Fire last. LX/mobile only.

**force:createRecord** →LWC:Navigation. Full Record Create panel.
Params:`entityApiName`:str(req),`recordTypeId`:str,`defaultFieldValues`:obj,`navigationLocation`:LOOKUP/RELATED_LIST/RECENT.
Unsupported:ContractLineItem,EventRelation,OpportunityLineItem,OrderItem,QuoteLineItem,TaskRelation.
No action overrides. **Prefer:**`lightning:navigation` w/standard\_\_object.

**force:navigateHome** ⚠dep→standard\_\_objectPage

**force:navigateToComponent** ⚠dep API43→lightning:isUrlAddressable.
Params:`componentDef`:str(req),`componentAttributes`:obj(base64),`isredirect`:bool.
Target:access="global" or same namespace.

**force:navigateToList** ⚠dep→standard\_\_objectPage.
Params:`listViewId`:str(req),`listViewName`:str,`scope`:str(req)

**force:navigateToObjectHome** ⚠dep→standard\_\_objectPage.
Params:`scope`:str(req),`resetHistory`:bool

**force:navigateToRelatedList** →LWC:standard**recordRelationshipPage.
Params:`parentRecordId`:str(req),`relatedListId`:str(req,std:plural like
Contacts,custom:{Label}**r),`entityApiName`:str. Get relatedListId from URL
/rlName/<relatedListId>/view.

**force:navigateToSObject** Beta→LWC:Navigation.
Params:`recordId`:str(req),`slideDevName`:str(LX only)

**force:navigateToURL** →LWC:Navigation.
Params:`url`:str(req),`isredirect`:bool. Absolute+isredirect:false→new window.
Relative+isredirect:true→redirect.

**force:recordSave** →LWC:LDS/recordEditForm. Request save. Use
w/force:recordEdit. **Prefer:**inputField+recordEditForm.

**force:recordSaveSuccess** →LWC:LDS/recordEditForm events. On success. Handle
via onSaveSuccess on force:recordEdit.

**force:refreshView** →LWC:`getRecordNotifyChange()`. Reloads view.
**Performance impact.** Only refreshes std components. Doesn't impact storable
Actions. **Best:**Use LDS first. Supported:LX,mobile,Experience Builder.

**force:showToast** →LWC:`lightning/platformShowToastEvent`.
Params:`message`:str(req),`messageTemplate`:str({0},{1}),`messageTemplateData`:arr,`mode`:dismissible/pester/sticky,`type`:success/warning/error/info/other,`duration`:int(def:5000),`key`:str.
Not on login pages.

### forceChatter:\*

**forceChatter:customOpenFile** - File open behavior in Communities
mobile/tablet. Set recordId,call fire().

**forceChatter:postCreated** - Chatter post created. LX,mobile,Experience
Builder. Use w/publisher/feed.

### forceCommunity:\*

**forceCommunity:analyticsInteraction** - GA data. Experience Builder only.
Enable:add GA tracking ID in Settings>Advanced.
hitTypes:event(eventAction,eventCategory),social(socialAction,socialNetwork,socialTarget),exception(exDescription),timing(timingCategory,timingVar,timingValue)

**forceCommunity:analyticsInteractionGtag** - GA via gtag. Experience Builder
only.

**forceCommunity:routeChange** - System event page URL changes(auto-fired,cannot
fire manually). Experience Builder only.

### lightning:\*

**lightning:conversationAgentSend** - Agent sends message console/Enhanced
Messaging. Params:`content`,`name`,`recordId`,`timestamp`,`type`

**lightning:conversationChatEnded** - Chat ends. Param:`recordId`

**lightning:conversationCustomEvent** - Custom chat event.
Params:`data`,`recordId`,`type`

**lightning:conversationNewMessage** - New message.
Params:`content`,`name`,`recordId`,`timestamp`,`type`

**lightning:omniChannelStatusChanged** - Agent changes status.
Params:`channels`:JSON,`statusApiName`,`statusId`,`statusName`

**lightning:omniChannelWorkAccepted/Assigned/Closed** - Work item
accepted/assigned/closed. Param:`workId`

**lightning:openFiles** ⚠dep→Navigation. Opens
preview(desktop)/download(mobile).
Params:`recordIds`:str/arr(req)=ContentDocument/ContentHubItem
IDs,`selectedRecordId`:str

**lightning:sendChatterExtensionPayload** - Component event Chatter publisher.
Experience Builder.
Params:`extensionDescription`,`extensionThumbnailUrl`,`extensionTitle`,`payload`:obj

**lightning:tabClosed/Created/Focused/Refreshed/Replaced/Updated** - Console tab
events. Param:`tabId`

### ltng:\*

**ltng:afterScriptsLoaded** - ltng:require loads all scripts. Handle via
afterScriptsLoaded attr.

**ltng:beforeLoadingResources** - Before ltng:require loads.

**ltng:selectSObject** - Object selected. Params:`recordId`,`channel`(optional)

**ltng:sendMessage** - Data between components.
Params:`message`:str/JSON,`channel`(optional)

### ui:\* (⚠dep API47)

**ui:clearErrors** - Validation errors cleared. Handler:onClearErrors |
**ui:collapse** - menuList collapsed. Handler:menuCollapse | **ui:expand** -
Component expanded. Handler:menuExpand | **ui:menuFocusChange** - Menu focus
changed. Handler:menuFocusChange | **ui:menuSelect** - Item selected.
Handler:menuSelect. Click fires before.

### wave:\*

**wave:assetLoaded** - Analytics asset loaded | **wave:discover** - Request
dashboard discovery. Set UID. Dashboards respond w/discoverResponse |
**wave:discoverResponse** - Response to discover | **wave:pageChange** - Nav to
dashboard page. Params:`devName`,`pageid` | **wave:selectionChanged** -
Dashboard selection. payload=row data | **wave:update** - Apply
filter/selection. Params:`devName`,`id`,`type`,`value`:JSON

### lightningcommunity:\*

**lightningcommunity:deflectionSignal** - User interacts w/deflection item.
Experience Builder. sourceType:caseCreateDeflectionModal. payload varies by
signal type.

## Interfaces

**aura:hasPageReference** - Adds `pageReference`:obj(ro). Current
page:type,attributes,state. →LWC:CurrentPageReference wire/NavigationMixin

**clients:availableForMailAppAppPage** - Lightning for Gmail/Outlook Flexipages
