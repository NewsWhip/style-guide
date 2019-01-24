import { Component, Input } from '@angular/core';

@Component({
    selector: 'nw-loader',
    template: `
        <div *ngIf="isLoading" class="loader"
            [ngClass]="sizeClass"
            [class.loader-inline]="isInline"
            [class.loader-color]="isColor">
            <div class="dots-icon-wrapper">
                <div class="dots">
                    <span *ngFor="let d of dots" class="dot dot-{{d}}"></span>
                </div>
            </div>
        </div>
    `,
    exportAs: 'nw-loader'
})

export class LoaderComponent {
    @Input() isLoading: boolean = false;
    @Input() numOfDots: number = 6;
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() isColor: boolean = true;
    @Input() isInline: boolean = false;

    get dots(): number[] {
        return Array(this.numOfDots).fill(0).map((x, i) => i + 1);
    }

    get sizeClass(): string {
        return `loader-${this.size}`;
    }
}
