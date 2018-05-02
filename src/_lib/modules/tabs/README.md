*app.module.ts*

```javascript
import { TabModule } from 'nw-style-guide/tabs';

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

*my-feature.component.ts*

```javascript
import { TabsComponent, ITab } from "nw-style-guide/tabs";

@Component({
    template: `
        <nw-tabs>
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
    
    public yourTabCollection: ITab[] = [
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
    
    setSelectedTab(selectedTab: ITab) {
        this.tabCollection.forEach(tab => {
            tab.isActive = tab.name === selectedTab.name;
        });
    }
}

```
