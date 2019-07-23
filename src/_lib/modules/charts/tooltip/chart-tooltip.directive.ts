import {Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
    selector: '[nwChartTooltip]'
})
export class ChartTooltipDirective implements OnChanges, OnInit {
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

    constructor(
        private _elRef: ElementRef,
        private _renderer: Renderer2) {
    }

    ngOnInit() {
        this._setTooltipSize();

        this._renderer.setStyle(this._elRef.nativeElement, 'pointer-events', 'none');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.position && changes.position.previousValue !== changes.position.currentValue) {
            // Setting the tooltip size here, as well as in ngOnInit, prevents this._width & this._height from being undefined
            // as a result of the first ngOnChanges being called before ngOnInit.
            // The contents of this method are only executed if this._width or this._height are undefined, which prevents
            // doing the same work twice, and (hopefully) makes this operation a bit less expensive.
            this._setTooltipSize();

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
