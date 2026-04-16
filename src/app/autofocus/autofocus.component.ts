import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TABS_DIRECTIVES } from 'nw-style-guide/tabs';
import { AutoFocusDirective } from 'nw-style-guide/autofocus';
import { CopyCodeComponent } from '../code/copy-code.component';

@Component({
    selector: 'app-autofocus',
    templateUrl: './autofocus.component.html',
    styleUrls: ['./autofocus.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TABS_DIRECTIVES, RouterLink, AutoFocusDirective, CopyCodeComponent]
})
export class AutofocusComponent implements OnInit, OnDestroy {
    private _route = inject(ActivatedRoute);
    private _cdRef = inject(ChangeDetectorRef);

    public selectedTab: 'design' | 'api' = 'design';

    private _routeSub: Subscription;

    ngOnInit(): void {
        this._routeSub = this._route.queryParams.subscribe(params => {
            this.selectedTab = params.section || 'design';
            this._cdRef.detectChanges();
        });
    }

    readonly importModule = `import { AutoFocusModule } from 'nw-style-guide/autofocus';

    ...........
    ...........

    @NgModule({
        declarations: [...],
        imports: [
            .....
            .....
            AutoFocusModule
        ],
        bootstrap: [AppComponent]
    })
    export class AppModule { }`;

    readonly example = `<input type="text" nwAutofocus placeholder="This input box is autofocused on load" class="form-control">`;

    ngOnDestroy() {
        this._routeSub.unsubscribe();
    }
}
