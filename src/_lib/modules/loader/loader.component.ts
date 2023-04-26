import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
    selector: 'nw-loader',
    template: `
        <div *ngIf="isLoading" class="loader" [@delayAndFadeIn]="animParams"
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
    exportAs: 'nw-loader',
    animations: [
        trigger('delayAndFadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(`{{duration}}ms {{delay}}ms linear`, style({ opacity: 1 }))
            ])
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoaderComponent implements OnInit {

    @Input() isLoading: boolean = false;
    @Input() numOfDots: number = 6;
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() isColor: boolean = true;
    @Input() isInline: boolean = false;
    @Input() delayMs: number = 700;
    @Input() fadeInMs: number = 700;

    public animParams: any;

    ngOnInit() {
        this.animParams = {
            value: '',
            params: {
                duration: this.fadeInMs,
                delay: this.delayMs
            }
        };
    }

    get dots(): number[] {
        return Array(this.numOfDots).fill(0).map((x, i) => i + 1);
    }

    get sizeClass(): string {
        return `loader-${this.size}`;
    }
}
