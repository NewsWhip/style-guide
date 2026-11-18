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

        @if (canDisplayLoadingMessage && loadingMessage) {
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
    @Input() loadingMessage?: string = 'Loading';

    private _cdRef = inject(ChangeDetectorRef);
    private _announceTimer?: ReturnType<typeof setTimeout>;

    /**
     * Whether the loading message is rendered. Adding it inside the host's `role="status"` element
     * is what makes a screen reader read it out
     */
    protected canDisplayLoadingMessage: boolean = false;

    get dots(): number[] {
        return Array(this.numOfDots)
            .fill(0)
            .map((x, i) => i + 1);
    }

    get sizeClass(): string {
        return `loader-${this.size}`;
    }

    /**
     * Only announce what the user can see. The message waits the same `delayMs` as the dots, so a
     * quick load that never shows the loader is never announced.
     *
     *   isLoading: true  -> wait delayMs -> add message
     *   isLoading: false -> cancel wait  -> remove message
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.isLoading) {
            return;
        }
        clearTimeout(this._announceTimer);

        if (!this.isLoading) {
            this.canDisplayLoadingMessage = false;
            return;
        }

        this._announceTimer = setTimeout(() => {
            this.canDisplayLoadingMessage = true;
            this._cdRef.markForCheck();
        }, this.delayMs);
    }

    ngOnDestroy(): void {
        clearTimeout(this._announceTimer);
    }
}
