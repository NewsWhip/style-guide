import { Component, ChangeDetectionStrategy, Inject, TemplateRef, EventEmitter } from "@angular/core";
import { ITooltipData } from "./models/ITooltipData";
import { TOOLTIP_CONTEXT_TOKEN } from "./config/tooltip-context-token";

@Component({
    selector: 'nw-tooltip-container',
    template: `
        <div class="tooltip"
            [ngClass]="data.containerClass">
            <div class="tooltip-arrow" *ngIf="data.withArrow"></div>
            <div class="tooltip-inner">
                <button *ngIf="data.withClose"
                    (click)="close.emit()"
                    class="btn btn-ghost-alt btn-sm btn-close close-button"></button>
                <ng-container *ngIf="isTemplateRef; else stringTmpl">
                    <ng-container *ngTemplateOutlet="data.tooltip; context: data.templateRefContext"></ng-container>
                </ng-container>
                <ng-template #stringTmpl>
                    <div [outerHTML]="data.tooltip"></div>
                </ng-template>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipContainerComponent {

    public close: EventEmitter<void> = new EventEmitter();
    public isTemplateRef: boolean = false;

    constructor(@Inject(TOOLTIP_CONTEXT_TOKEN) public data: ITooltipData) {
        this.isTemplateRef = data.tooltip instanceof TemplateRef;
    }
}