import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-autofocus',
    templateUrl: './autofocus.component.html',
    styleUrls: ['./autofocus.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutofocusComponent implements OnInit, OnDestroy {

    public selectedTab: 'design' | 'api' = 'design';

    private _routeSub: Subscription;

    constructor(private _route: ActivatedRoute,
                private _cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this._routeSub = this._route.queryParams.subscribe(params => {
            this.selectedTab = params.section || 'design';
            this._cdRef.detectChanges();
        });
    }

    get importModule() {
        return `import { AutoFocusModule } from 'nw-style-guide/autofocus';

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
    }

    get example() {
        return `<input type="text" nwAutofocus placeholder="This input box is autofocused on load" class="form-control">`;
    }

    ngOnDestroy() {
        this._routeSub.unsubscribe();
    }
}
