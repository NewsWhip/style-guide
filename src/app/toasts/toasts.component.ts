import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Toaster } from 'nw-style-guide/toasts';
import { TABS_DIRECTIVES } from 'nw-style-guide/tabs';
import { ISnippet } from '../code/ISnippet';
import { AppCodeComponent } from '../code/code.component';

@Component({
    selector: 'app-toasts',
    templateUrl: './toasts.component.html',
    styleUrls: ['./toasts.component.scss'],
    imports: [TABS_DIRECTIVES, RouterLink, FormsModule, ReactiveFormsModule, AppCodeComponent]
})
export class ToastsComponent implements OnInit, OnDestroy {
    private _cdRef = inject(ChangeDetectorRef);
    private _toaster = inject(Toaster);
    private _route = inject(ActivatedRoute);
    private _fb = inject(FormBuilder);

    public selectedTab: 'design' | 'api' = 'design';
    public form: FormGroup;
    public toasterMethods: any[];
    public toastInterfaceDetails: any[];
    private _routeSub: Subscription;

    ngOnInit() {
        this.form = this._fb.group({
            toastType: ['success'],
            text: ['Example toast message', Validators.required],
            autoDismiss: [true],
            size: ['md']
        });

        this.toasterMethods = this.getToasterMethods();
        this.toastInterfaceDetails = this.getToastInterfaceDetails();
        this._routeSub = this._route.queryParams.subscribe(params => {
            this.selectedTab = params.section || 'design';
            this._cdRef.detectChanges();
        });
    }

    showToast() {
        this._toaster.show({
            typeId: this.form.get('toastType').value,
            message: this.form.get('text').value,
            autoDismiss: this.form.get('autoDismiss').value,
            isDismissable: !this.form.get('autoDismiss').value,
            size: this.form.get('size').value
        });
    }

    readonly importSnippet: ISnippet = {
        lang: 'typescript',
        code: `import { ToastsModule } from 'nw-style-guide/toasts';`
    };

    readonly exampleSnippet: ISnippet = {
        lang: 'typescript',
        code: `export class TestComponent {

  constructor(private _toaster: Toaster) {}

  showSuccessToast() {
    this._toaster.success('All is well!');
  }

  showErrorToast() {
    this._toaster.error('All is not well');
  }

  showCustomToast() {
    const customToast: IToast = {
      message: 'A custom toast message',
      typeId: 'success',
      isDismissable: true,
      dismissTimeout: 5000,
      autoDismiss: true
    };
    this._toaster.show(customToast);
  }
}`
    };

    getToasterMethods() {
        return [
            {
                name: `show(toast: IToast): Toast`,
                description: 'Display a custom toast message'
            },
            {
                name: `success(message: string | TemplateRef<any>): Toast`,
                description:
                    'Display a success toast message in the form of a <code>string</code> or <code>TemplateRef</code>. Success toasts are not dismissable by default. Returns an instance of <code>Toast</code> that can be later passed to the <code>dismiss</code> method'
            },
            {
                name: `error(message: string | TemplateRef<any>): Toast`,
                description:
                    'Display an error toast message in the form of a <code>string</code> or <code>TemplateRef</code>. Error toasts are dismissable by default/ Returns an instance of <code>Toast</code> that can be later passed to the <code>dismiss</code> method'
            },
            {
                name: `dismiss(toast: IToast): void`,
                description: 'Manually dismiss a toast'
            },
            {
                name: `isToastActive(toast: Toast): boolean`,
                description: 'Check to see if a toast is still being displayed'
            },
            {
                name: `setConfig(config: IToastConfig): void`,
                description:
                    'Set the configuration values for a <code>Toaster</code> instance. This can only be called once per <code>Toaster</code> instance and must be called before the outlet is created'
            }
        ];
    }

    getToastInterfaceDetails() {
        return [
            {
                name: 'message: string | TemplateRef<any>',
                default: 'null',
                description: 'The text to display within the toast'
            },
            {
                name: 'typeId: string',
                default: 'null',
                description: 'Should be <code>success</code> or <code>error</code>'
            },
            {
                name: 'isDismissable?: boolean',
                default: 'null',
                description: 'Dictates if the toast should display a close button'
            },
            {
                name: 'autoDismiss?: boolean',
                default: 'true',
                description: 'Dictates if the toast should dismiss itself after <code>dismissTimeout</code> has elapsed'
            },
            {
                name: 'dismissTimeout?: number',
                default: '3000',
                description: 'The number of ms for which the toast should be displayed'
            }
        ];
    }

    ngOnDestroy() {
        this._routeSub.unsubscribe();
    }
}
