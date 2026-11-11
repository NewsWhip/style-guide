import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'nw-loader',
    template: `
        @if (isLoading) {
            <div
                class="loader"
                animate.enter="delay-and-fade-in"
                aria-hidden="true"
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

        @if (isAnnounced && loadingMessage) {
            <span class="sr-only">{{ loadingMessage }}</span>
        }
    `,
    exportAs: 'nw-loader',
    host: { role: 'status' },
    imports: [NgClass]
})
export class LoaderComponent implements OnChanges, OnDestroy {
    @Input() isLoading: boolean = false;
    @Input() numOfDots: number = 6;
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() isColor: boolean = true;
    @Input() isInline: boolean = false;
    @Input() delayMs: number = 700;
    @Input() fadeInMs: number = 700;
    @Input() loadingMessage: string = 'Loading';

    private _cdRef = inject(ChangeDetectorRef);

    /** Whether the visually hidden text is in the live region, and so has been announced */
    protected isAnnounced: boolean = false;

    private _announceTimer?: ReturnType<typeof setTimeout>;

    get dots(): number[] {
        return Array(this.numOfDots)
            .fill(0)
            .map((x, i) => i + 1);
    }

    get sizeClass(): string {
        return `loader-${this.size}`;
    }

    /**
     * The announcement waits out the same delay the dots fade in on, so a load that finishes before
     * the loader is ever seen is not heard either. Changes arrive here rather than in a setter on
     * `isLoading` because `delayMs` may be bound after it
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.isLoading) {
            return;
        }
        clearTimeout(this._announceTimer);

        if (!this.isLoading) {
            this.isAnnounced = false;
            return;
        }

        this._announceTimer = setTimeout(() => {
            this.isAnnounced = true;
            this._cdRef.markForCheck();
        }, this.delayMs);
    }

    ngOnDestroy(): void {
        clearTimeout(this._announceTimer);
    }
}
