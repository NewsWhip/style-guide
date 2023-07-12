import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CopyCodeComponent } from '../code/copy-code.component';
import { AutoFocusDirective } from '../../_lib/modules/autofocus/autofocus.directive';
import { NgIf } from '@angular/common';
import { TabDirective } from '../../_lib/modules/tabs/tab.directive';
import { TabsComponent } from '../../_lib/modules/tabs/tabs.component';

@Component({
    selector: 'app-autofocus',
    templateUrl: './autofocus.component.html',
    styleUrls: ['./autofocus.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [TabsComponent, TabDirective, RouterLink, NgIf, AutoFocusDirective, CopyCodeComponent]
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
