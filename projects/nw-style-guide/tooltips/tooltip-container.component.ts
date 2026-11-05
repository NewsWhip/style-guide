import { Component, TemplateRef, EventEmitter, inject } from '@angular/core';
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
                @if (templateRef) {
                    <ng-container *ngTemplateOutlet="templateRef; context: data.templateRefContext"></ng-container>
                } @else {
                    <div [outerHTML]="html"></div>
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
    imports: [NgClass, NgTemplateOutlet]
})
export class TooltipContainerComponent {
    data = inject<ITooltipData>(TOOLTIP_CONTEXT_TOKEN);

    public close = new EventEmitter<void>();
    /** The content, split by type so that the template can render each with the right type */
    public templateRef: TemplateRef<any> | null = null;
    public html: string = '';

    constructor() {
        const data = this.data;

        if (data.tooltip instanceof TemplateRef) {
            this.templateRef = data.tooltip;
        } else {
            this.html = data.tooltip;
        }
    }
}
