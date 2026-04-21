import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { FeatureAlertsService } from './feature-alerts.service';

@Component({
    selector: 'nw-hotspot',
    template: `
        @if (isOpen) {
            <div
                animate.leave="fade-out"
                class="hotspot hotspot-{{ position }}"></div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotspotComponent {
    private _featureAlertsService = inject(FeatureAlertsService);
    private _cdRef = inject(ChangeDetectorRef);

    @Input() position: string = 'left';
    @Input() id: any;

    get isOpen(): boolean {
        return !this._featureAlertsService.wasAlertDismissed(this.id);
    }

    dismiss() {
        this._featureAlertsService.dismiss(this.id);
        this._cdRef.detectChanges();
    }
}
