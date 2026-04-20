import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'nw-loader',
    template: `
        <div
            *ngIf="isLoading"
            class="loader"
            animate.enter="delay-and-fade-in"
            [ngClass]="sizeClass"
            [class.loader-inline]="isInline"
            [class.loader-color]="isColor"
            [style.--fade-in-duration.ms]="fadeInMs"
            [style.--fade-in-delay.ms]="delayMs">
            <div class="dots-icon-wrapper">
                <div class="dots">
                    <span
                        *ngFor="let d of dots"
                        class="dot dot-{{ d }}"></span>
                </div>
            </div>
        </div>
    `,
    exportAs: 'nw-loader',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, NgClass, NgFor]
})
export class LoaderComponent {
    @Input() isLoading: boolean = false;
    @Input() numOfDots: number = 6;
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() isColor: boolean = true;
    @Input() isInline: boolean = false;
    @Input() delayMs: number = 700;
    @Input() fadeInMs: number = 700;

    get dots(): number[] {
        return Array(this.numOfDots)
            .fill(0)
            .map((x, i) => i + 1);
    }

    get sizeClass(): string {
        return `loader-${this.size}`;
    }
}
