import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FeatureAlertsService } from "./feature-alerts.service";
import { NgIf } from "@angular/common";

@Component({
    selector: 'nw-hotspot',
    template: `
        <div animate.leave="fade-out" *ngIf="isOpen" class="hotspot hotspot-{{position}}"></div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf]
})
export class HotspotComponent {

    @Input() position: string = "left";
    @Input() id: any;

    constructor(
        private _featureAlertsService: FeatureAlertsService,
        private _cdRef: ChangeDetectorRef) {}

    get isOpen(): boolean {
        return !this._featureAlertsService.wasAlertDismissed(this.id);
    }

    dismiss() {
        this._featureAlertsService.dismiss(this.id);
        this._cdRef.detectChanges();
    }
}