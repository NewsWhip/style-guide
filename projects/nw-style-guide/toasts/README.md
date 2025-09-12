*app.module.ts*

```javascript
import { ToastsModule } from 'nw-style-guide/toasts';

...........
...........

@NgModule({
    declarations: [...],
    imports: [
    .....
    .....
    ToastsModule.forRoot()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

*my-feature.component.ts*

```javascript
import { Toaster, IToast } from "nw-style-guide/toasts";

@Component({
    ....
    ....
    ....
})
export class MyFeature {

    constructor(private _toaster: Toaster) {}
    _dismissibleOnDemandToast: IToast;
    
    showSuccess() {
        this._toaster.success('Some successful message');
    }

    showError() {
        this._toaster.error('Some error message');
    }

    showCustom() {
        let toast: IToast = {
            message: "This is the message to display",
            typeId: 'error',
            isDismissable: false, // optional, default: undefined
            autoDismiss: false,   // optional, default: true
            dismissTimeout: 4000  // optional, default: 3000
        };

        this._toaster.show(toast);
    }

    dismissOnDemand() {
        this._toaster.dismiss(this._dismissibleOnDemandToast);
    }
    
    addDismissibleOnDemand() {
        this._dismissibleOnDemandToast = this._toaster.show({
          typeId: 'error',
          message: 'This message is dismissible on demand.',
          autoDismiss: false
        });
    }
}

```
