```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NwPickerModule } from 'nw-style-guide/picker';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NwPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```javascript
import { IPickerItem } from 'nw-style-guide/picker';

public colors: IPickerItem[] = [
    {
        displayName: "red",
        id: "#f00",
        value: "#f00",
        added: false,
        excluded: false,
        parentId: null,
        searchValues: ["#f00"]
    },
    {
        displayName: "green",
        id: "#0f0",
        value: "#0f0",
        added: false,
        excluded: false,
        parentId: null,
        searchValues: ["#0f0"]
    },
    {
        displayName: "blue",
        id: "#00f",
        value: "#00f",
        added: false,
        excluded: false,
        parentId: null,
        searchValues: ["#00f"]
    },
    {
        displayName: "cyan",
        id: "#0ff",
        value: "#0ff",
        added: false,
        excluded: false,
        parentId: null,
        searchValues: ["#0ff"]
    },
    {
        displayName: "magenta",
        id: "#f0f",
        value: "#f0f",
        added: false,
        excluded: false,
        parentId: null,
        searchValues: ["#f0f"]
    },
    {
        displayName: "yellow",
        id: "#ff0",
        value: "#ff0",
        added: false,
        excluded: false,
        parentId: null,
        searchValues: ["#ff0"]
    },
    {
        displayName: "black",
        id: "#000",
        value: "#000",
        added: false,
        excluded: false,
        parentId: null,
        searchValues: ["#000"]
    }
]
```

```html
<nw-angular-picker [items]="colors" [canExclude]="false"></nw-angular-picker>
```

## Picker Inputs

`items:IPickerItem[];`

A flat list of picker items

----


`inputClasses:string = '';`

Classes to add the form input

----

`placeholderText:string = 'Search...';`

Default placeholder text

----

`noSelectionsPlaceholderText:string = 'Search...';`

Placeholder text to display when no items are selected

----

`initialParentId:any = null;`

For nested lists, allow the picker to open at any level in the hierarchy

----

`shouldShowSelections:boolean = true;`

Allow the option to view the selected items shortcut

----

`canExclude:boolean = true;`

Allow items to be excluded

----

`isHeightDynamic:boolean;`

Dynamically calculate the height of the dropdown (only applicable if `isMobileDisplay` is false)

----

`isMultiSelect:boolean = true;`

Can multiple items be selected. If `false`, dropdown closes on selection

----

`isMobileDisplay: boolean = false;`

Animates the opening of the dropdown

----

`isDisabled: boolean = false;`

Disables input field and functionality

----

`isChevronHidden: boolean = false;`

show or hide the expand chevron

----

## Picker Outputs

`selections: EventEmitter<IPickerItem[]> = new EventEmitter<IPickerItem[]>();`

When an item is toggled, all selected items are emitted

----
`toggleInclude: EventEmitter<{ item: IPickerItem, searchTerm:string }> = new EventEmitter<{ item: IPickerItem, searchTerm:string }>();`

Emits the included item plus any search term

----
`toggleExclude: EventEmitter<{ item: IPickerItem, searchTerm:string }> = new EventEmitter<{ item: IPickerItem, searchTerm:string }>();`

Emits the excluded item plus any search term

----
`edit: EventEmitter<any> = new EventEmitter<any>();`

Triggered when the user clicks to edit selections

----
`closed: EventEmitter<any> = new EventEmitter<any>();`

Emitted when the dropdown closes

----
`focus: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();`

Emitted on input focus

----
`clearAll: EventEmitter<any> = new EventEmitter<any>();`

Emitted when all selections are cleared

----
`clearSingle: EventEmitter<IPickerItem> = new EventEmitter<IPickerItem>();`

Emits a single cleared item

----
`clearSearch: EventEmitter<any> = new EventEmitter<any>();`

Emitted when the search term is cleared

----
`desc: EventEmitter<IPickerItem> = new EventEmitter<IPickerItem>();`

Emitted when descending the hierarchy

----
`asc: EventEmitter<IPickerItem> = new EventEmitter<IPickerItem>();`

Emitted when ascending the hierarchy

----

## Projected content

`<ng-content select=".results-footer"></ng-content>`

Optional dropdown footer
