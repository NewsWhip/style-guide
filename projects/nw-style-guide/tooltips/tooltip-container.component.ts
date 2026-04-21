import { Component, ChangeDetectionStrategy, TemplateRef, EventEmitter, inject } from '@angular/core';
import { ITooltipData } from './models/ITooltipData';
import { TOOLTIP_CONTEXT_TOKEN } from './config/tooltip-context-token';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'nw-tooltip-container',
    template: `
        <div
            class="tooltip"
            [ngClass]="data.containerClass">
            @if (data.withArrow) {
                <div class="tooltip-arrow"></div>
            }
            <div class="tooltip-inner">
                @if (data.withClose) {
                    <button
                        (click)="close.emit()"
                        class="btn btn-ghost-alt btn-sm btn-close close-button"></button>
                }
                @if (isTemplateRef(data.tooltip)) {
                    <ng-container *ngTemplateOutlet="data.tooltip; context: data.templateRefContext"></ng-container>
                } @else {
                    <div [outerHTML]="data.tooltip"></div>
                }
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, NgTemplateOutlet]
})
export class TooltipContainerComponent {
    data = inject<ITooltipData>(TOOLTIP_CONTEXT_TOKEN);

    public close: EventEmitter<void> = new EventEmitter();

    isTemplateRef(value: unknown): value is TemplateRef<unknown> {                                              
        return value instanceof TemplateRef;                                                                    
    } 
}
