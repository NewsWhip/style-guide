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
