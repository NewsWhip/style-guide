import { Input, Directive, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { FeatureAlertsService } from './feature-alerts.service';
import { filter } from 'rxjs/operators';

@Directive({
    selector: '[nwFeatureAlert]'
})
export class FeatureAlertsDirective implements OnInit {
    /**
     * This directive shows/hides content depending on whether or not a given feature ID is enabled/disabled in local storage
     * It listens for changes on the FeatureAlertsService _dismissSubject and shows/hides accordingly
     *
     * Implementation :
     *
     * HTML
     * <a (click)=dismiss('feature-id')> New Feature </a>
     * <span *nwFeatureAlert="'feature-id'" class="label label-round label-new ml-4">New</span>
     *
     * Typescript
     * _featureAlertsService = inject(FeatureAlertsService);
     * dismiss(id) {
     *    this._featureAlertsService.dismiss(id);
     * }
     */


    /**
     * ID of the new feature to be stored in local storage
     */
    @Input() nwFeatureAlert: string;

    private _isInView = false;
    constructor(
        private _templateRef: TemplateRef<any>,
        private _viewContainer: ViewContainerRef,
        private _featureAlertsService: FeatureAlertsService) { }

    ngOnInit(): void {
        this._toggleFeatureAlert(this.nwFeatureAlert);
        this._featureAlertsService.dismiss$.pipe(
            filter((id: string) => id === this.nwFeatureAlert)
        ).subscribe(id => this._toggleFeatureAlert(id));
    }

    private _toggleFeatureAlert(id: string) {
        const wasAlertDismissed = this._featureAlertsService.wasAlertDismissed(id);
        if (!wasAlertDismissed && !this._isInView) {
            this._viewContainer.createEmbeddedView(this._templateRef);
            this._isInView = true;
        } else if (wasAlertDismissed && this._isInView) {
            this._viewContainer.clear();
            this._isInView = false;
        }
    }
}
