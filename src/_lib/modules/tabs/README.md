*app.module.ts*

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

*my-feature.component.ts*

```javascript

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
