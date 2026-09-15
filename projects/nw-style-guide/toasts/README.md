_app.module.ts_

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

_my-feature.component.ts_

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

## Accessibility

Toasts announce themselves. **Do not pair a toast with a `LiveAnnouncer.announce` call for the same
event** — screen reader users will hear the message twice.

Every toast is announced from a live region owned by the package: `role="status"` for a `success`
toast, `role="alert"` for an `error`. The announcement is composed from the toast's rendered text,
so `TemplateRef` messages and messages containing markup announce correctly, and it is prefixed
with `Success:`/`Error:` so that the type is conveyed in text rather than by icon colour alone.
That prefix is also rendered into the toast itself, visually hidden.

The live regions are held at the body level and kept out of the toast element deliberately. The
toast outlet is created lazily on the first toast shown, so a `role` on the toast itself would
enter the DOM together with its content and would not reliably be announced.

### Toasts shown from a modal

An element with `aria-modal="true"` — which is what the CDK's `Dialog` sets by default — hides
everything outside itself from screen readers, including a body-level live region. The announcement
therefore waits for an open dialog to close before it is made, which covers the common case of a
toast shown immediately before its dialog closes:

```javascript
this._toaster.success('Your group has been deleted');
this.onDismiss();
```

If the dialog is still open after a short wait, the announcement is made inside the dialog instead,
which covers a toast shown by a modal that keeps the user in place:

```javascript
onSaveError() {
    // The modal stays open so the user can correct something
    this._toaster.error('Sorry, something went wrong saving the alert');
}
```

Neither case needs anything from the caller.
