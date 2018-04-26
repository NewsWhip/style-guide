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
            isDismissable: false
        };

        this._toaster.show(toast);
    }

}

```