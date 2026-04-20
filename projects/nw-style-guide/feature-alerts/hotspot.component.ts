import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { FeatureAlertsService } from './feature-alerts.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'nw-hotspot',
    template: `
        <div
            animate.leave="fade-out"
            *ngIf="isOpen"
            class="hotspot hotspot-{{ position }}"></div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf]
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
