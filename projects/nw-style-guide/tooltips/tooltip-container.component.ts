import { Component, ChangeDetectionStrategy, TemplateRef, EventEmitter, inject } from '@angular/core';
import { ITooltipData } from './models/ITooltipData';
import { TOOLTIP_CONTEXT_TOKEN } from './config/tooltip-context-token';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'nw-tooltip-container',
    template: `
        <div
            class="tooltip"
            [id]="data.id"
            [ngClass]="data.containerClass">
            @if (data.withArrow) {
                <div class="tooltip-arrow"></div>
            }
            <!--
                Carries an id so that a dialog panel can point aria-describedby at it, and a class when there is a
                close button, so that the styles can reserve room for one
            -->
            <div
                class="tooltip-inner"
                [class.with-close]="data.withClose"
                [id]="data.id + '-content'">
                @if (isTemplateRef) {
                    <ng-container *ngTemplateOutlet="data.tooltip; context: data.templateRefContext"></ng-container>
                } @else {
                    <div [outerHTML]="data.tooltip"></div>
                }
                <!--
                    Inside .tooltip-inner, which the styles position it against, and last so that a dialog panel's
                    description ends with "Close" rather than starting with it
                -->
                @if (data.withClose) {
                    <button
                        (click)="close.emit()"
                        aria-label="Close"
                        class="btn btn-ghost-alt btn-sm btn-close close-button"></button>
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
    public isTemplateRef: boolean = false;

    constructor() {
        const data = this.data;

        this.isTemplateRef = data.tooltip instanceof TemplateRef;
    }
}
