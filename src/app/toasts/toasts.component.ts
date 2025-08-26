import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Toaster } from '../../_lib/modules/toasts';

@Component({
    selector: 'app-toasts',
    templateUrl: './toasts.component.html',
    styleUrls: ['./toasts.component.scss'],
    standalone: false
})
export class ToastsComponent implements OnInit, OnDestroy {

  public selectedTab: 'design' | 'api' = 'design';
  public form: FormGroup;
  public toasterMethods: any[];
  public toastInterfaceDetails: any[];
  public configExample: any;

  private _routeSub: Subscription;

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _toaster: Toaster,
    private _route: ActivatedRoute,
    private _fb: FormBuilder) { }

  ngOnInit() {
    this.form = this._fb.group({
      toastType: ['success'],
      text: ['Example toast message', Validators.required],
      autoDismiss: [true],
      size: ['md']
    });

    this.toasterMethods = this.getToasterMethods();
    this.toastInterfaceDetails = this.getToastInterfaceDetails();
    this.configExample = this._getConfigExample();

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

  get importModule() {
    return `import { ToastsModule } from 'nw-style-guide/toasts';

@NgModule({
  declarations: [...],
  imports: [
      ToastsModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }`;
  }

  get example() {
    return `export class TestComponent {

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
}
`;
}

  getToasterMethods() {
    return [
      {
        name: `show(toast: IToast): Toast`,
        description: 'Display a custom toast message'
      },
      {
        name: `success(message: string | TemplateRef<any>): Toast`,
        description: 'Display a success toast message in the form of a <code>string</code> or <code>TemplateRef</code>. Success toasts are not dismissable by default. Returns an instance of <code>Toast</code> that can be later passed to the <code>dismiss</code> method'
      },
      {
        name: `error(message: string | TemplateRef<any>): Toast`,
        description: 'Display an error toast message in the form of a <code>string</code> or <code>TemplateRef</code>. Error toasts are dismissable by default/ Returns an instance of <code>Toast</code> that can be later passed to the <code>dismiss</code> method'
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
        description: 'Set the configuration values for a <code>Toaster</code> instance. This can only be called once per <code>Toaster</code> instance and must be called before the outlet is created'
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

  private _getConfigExample() {
    return `@Component({
  selector: 'toaster-config-demo',
  templateUrl: './toaster-config-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Toaster]
})
export class CustomToasterConfigComponent implements OnInit {

  constructor(
    private _elRef: ElementRef<HTMLElement>,
    @SkipSelf() private _globalToaster: Toaster,
    @Host() private _localToaster: Toaster) {}

  ngOnInit() {
    this._localToaster.setConfig({ outletElement: this._elRef.nativeElement });

    this._globalToaster.success('Global toaster');
    this._localToaster.success('Local toaster');
  }
}`;
  }

  ngOnDestroy() {
    this._routeSub.unsubscribe();
  }
}
