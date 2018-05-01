*app.module.ts*

```javascript
import { FeatureAlertsModule } from 'nw-style-guide/feature-alerts';

...........
...........

@NgModule({
    declarations: [...],
    imports: [
    .....
    .....
    FeatureAlertsModule.forRoot()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

*my-feature.component.ts*

```javascript
import { IFeatureAlertParams } from "nw-style-guide/feature-alerts";
@Component({
    ....
    <div nw-feature-alert
         [params]="getFeatureAlertParams()"
         (callToActionClick)="onCTAClick()">

        <span>Any HTML elements or text will be transpiled into nw-feature-alert component template.</span>
    </div>
    ....
})
export class MyFeature {

    getFeatureAlertParams(): IFeatureAlertParams{
        return {
            id: 'reportingPercentageChangeFeatureAlert',         // unique id that will be stored in the local storage
            title: 'Introducing % Change',
            message: 'Some short custom message.',
            containerClass: 'reporting-percentage-change-cta',   // all feature alerts share .feature-alert class but you can add more
            triggers: '',                                        // (space separated) mouseenter focus click dblclick keypress 
            placement: 'bottom',
            container: ''                                        // '' or 'body' or any other DOM container
        };
    }
    
    onCTAClick() {
        // the parent component can react to 'Try it Now' button clicked in the feature alert
        // e.g. navigate to feature, highlight some UI components,    
    }

}

```
