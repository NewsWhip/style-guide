import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FeatureAlertsService } from "./feature-alerts.service";
import { trigger, transition, animate, style } from "@angular/animations";

@Component({
    selector: 'nw-hotspot',
    template: `
        <div [@fadeOut] *ngIf="isOpen" class="hotspot hotspot-{{position}}"></div>
    `,
    animations: [
        trigger('fadeOut', [
            transition(':leave', [
                style({ opacity: 0.5 }),
                animate(300, style({ opacity: 0 }))
            ])
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotspotComponent {

    @Input() position: string = "left";
    @Input() id: any;

    constructor(
        private featureAlertsService: FeatureAlertsService,
        private cdRef: ChangeDetectorRef) {}

    get isOpen(): boolean {
        return !this.featureAlertsService.wasAlertDismissed(this.id);
    }

    dismiss() {
        this.featureAlertsService.persist(this.id);
        this.cdRef.detectChanges();
    }
}