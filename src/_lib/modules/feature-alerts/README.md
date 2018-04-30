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

```javascript //xavtodo: change this
//import { Toaster, IToast } from "nw-style-guide/feature-alerts";
import { FeatureAlertsService, IFeatureAlertParams } from "nw-style-guide/feature-alerts";
@Component({
    ....
    <div nw-feature-alert
         [params]="getFeatureAlertParams()"
         (callToActionClick)="onDashToggleClick(dashTO)">

        <span>Any HTML elements or text will be transpiled into nw-feature-alert component template.</span>
    </div>
    ....
})
export class MyFeature {

    getFeatureAlertParams(): IFeatureAlertParams{
        return {
            id: 'reportingPercentageChangeFeatureAlert',    //unique id that will be stored in the local storage
            title: 'Introducing % Change',
            message: 'Now you can see how much engagement has changed since your last report.',
            containerClass: 'reporting-percentage-change-cta',
            triggers: '',     //(space separated) (if separated with : 1st shows popover, 2nd hides popover) mouseenter:mouseleave focus click dblclick keypress:focusout
            placement: 'bottom',
            container: ''     //'' or 'body' or any other DOM container
        };
    }

}

```
