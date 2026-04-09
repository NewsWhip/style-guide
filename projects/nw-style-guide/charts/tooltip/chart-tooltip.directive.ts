import { AfterViewInit, Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, inject } from '@angular/core';

@Directive({ selector: '[nwChartTooltip]' })
export class ChartTooltipDirective implements OnChanges, AfterViewInit {
    private _elRef = inject(ElementRef);
    private _renderer = inject(Renderer2);

    @Input() position: [number, number];
    @Input() chartWidth: number;
    @Input() chartHeight: number;
    @Input() chartMargins: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
    @Input() offsetX: number = 16;
    private _width: number;
    private _height: number;

    ngAfterViewInit() {
        this._setTooltipSize();

        this._renderer.setStyle(this._elRef.nativeElement, 'pointer-events', 'none');
        this._renderer.setStyle(this._elRef.nativeElement, 'position', 'absolute');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.position && changes.position.previousValue !== changes.position.currentValue) {

            const offsetLeft = changes.position.currentValue[0] + this.chartMargins.left;
            const offsetTop = changes.position.currentValue[1] + this.chartMargins.top;

            const isFlippedX = offsetLeft > this.chartWidth + this.chartMargins.left + this.chartMargins.right - this.offsetX - this._width;
            const isFlippedY = offsetTop > this.chartHeight + this.chartMargins.top + this.chartMargins.bottom - this._height;

            const x: string = isFlippedX ? `calc(${offsetLeft - this.offsetX}px - 100%)` : `${offsetLeft + this.offsetX}px`;
            const y: string = isFlippedY ? `calc(${offsetTop}px - 100%)` : `${offsetTop}px`;

            this._renderer.setStyle(this._elRef.nativeElement, 'transform', `translate(${x}, ${y})`);
        }
    }

    private _setTooltipSize(): void {
        if (this._width === undefined || this._height === undefined) {
            const rect = this._elRef.nativeElement.getBoundingClientRect();
            this._width = rect.width;
            this._height = rect.height;
        }
    }
}
