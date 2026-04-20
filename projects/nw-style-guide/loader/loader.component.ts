import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'nw-loader',
    template: `
        @if (isLoading) {
            <div
                class="loader"
                animate.enter="delay-and-fade-in"
                [ngClass]="sizeClass"
                [class.loader-inline]="isInline"
                [class.loader-color]="isColor"
                [style.--fade-in-duration.ms]="fadeInMs"
                [style.--fade-in-delay.ms]="delayMs">
                <div class="dots-icon-wrapper">
                    <div class="dots">
                        @for (d of dots; track d) {
                            <span class="dot dot-{{ d }}"></span>
                        }
                    </div>
                </div>
            </div>
        }
    `,
    exportAs: 'nw-loader',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass]
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
