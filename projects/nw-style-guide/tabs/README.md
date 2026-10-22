## Tab labels and accessibility

Mark the label of each tab with the `nwTabLabel` attribute and use a non-focusable element (e.g. `<span>`). The
label is then the tab: the directive gives it `role="tab"`, `aria-selected` and the roving `tabindex`, so it is the
single keyboard target. Enter/Space activate it by clicking it, and the arrow keys, Home and End move between tabs.
The `[nwTab]` host `<li>` is only presentational.

A secondary action button (e.g. a dropdown trigger) must have the `.btn` class and sits beside the label, not inside
it:

```html
<nw-tabs size="md">
    @for (tab of tabs; track tab.id) {
    <li
        nwTab
        [isActive]="tab.isActive">
        <span
            nwTabLabel
            (click)="setSelectedTab(tab)"
            >{{ tab.name }}</span
        >
        <button
            class="btn btn-md btn-ghost-alt"
            [attr.aria-label]="'Options for ' + tab.name">
            <i class="far fa-ellipsis-v"></i>
        </button>
    </li>
    }
</nw-tabs>
```

- The action button is a tab stop for the active tab only: Tab from the active tab reaches it, and Enter or Space on
  it opens the menu as on any button. Enter on the tab itself still selects the tab.
- A tablist may only own tabs, and axe fails a button anywhere inside one. So with `nwTabLabel` tabs, `nw-tabs`
  renders an empty `role="tablist"` element that owns the tabs by id (`aria-owns`), and the `<ul>` is
  `role="presentation"`. Without `nwTabLabel` the `<ul>` is the tablist, as before.
- Do not use a `<button>` as the label: a focusable element inside a `role="tab"` fails axe's `nested-interactive`
  rule even with `tabindex="-1"`. Legacy `<button>` labels are still supported, with the `<li>` as the tab.

_app.module.ts_

```javascript
import { TabsModule } from 'nw-style-guide/tabs';

...........
...........

@NgModule({
    declarations: [...],
    imports: [
    .....
    .....
    TabsModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

_my-feature.component.ts_

```javascript

@Component({
    template: `
        <!-- Three sizes: sm, md, lg -->
        <nw-tabs size="md">
            <li *ngFor="let tab of yourTabCollection" nwTab [isActive]="tab.isActive" (click)="setSelectedTab(tab)" role="presentation">
                <a href="javascript:;" [attr.aria-controls]="tab.name" role="tab">{{tab.name}}</a>
            </li>
        </nw-tabs>
    `
    ....
    ....
})
export class MyFeature {

    constructor() {}

    public yourTabCollection = [
        {
            name: 'Home',
            isActive: true
        },
        {
            name: 'About',
            isActive: false
        },
        {
            name: 'Careers',
            isActive: false
        },
        {
            name: 'Contact',
            isActive: false
        },
        {
            name: 'Travel',
            isActive: false
        }
    ];

    setSelectedTab(selectedTab) {
        this.tabCollection.forEach(tab => {
            tab.isActive = tab.name === selectedTab.name;
        });
    }
}

```
