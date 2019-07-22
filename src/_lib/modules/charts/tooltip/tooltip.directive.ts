import {Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
    selector: '[nwChartTooltip]'
})
export class TooltipDirective implements OnChanges, OnInit {
    @Input() position: [number, number];
    @Input() chartWidth: number;
    @Input() chartHeight: number;
    @Input() chartMargins: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
    private _width: number;
    private _height: number;

    constructor(
        private _elRef: ElementRef,
        private _renderer: Renderer2) {
    }

    ngOnInit() {
        this._width = this._elRef.nativeElement.getBoundingClientRect().width;
        this._height = this._elRef.nativeElement.getBoundingClientRect().height;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.position && changes.position.previousValue !== changes.position.currentValue) {
            const offsetLeft = changes.position.currentValue[0] + this.chartMargins.left;
            const offsetTop = changes.position.currentValue[1] + this.chartMargins.top;

            const x: string = offsetLeft > this.chartWidth - this._width ? `calc(${offsetLeft - 8}px - 100%)` : `${offsetLeft + 8}px`;
            const y: string = offsetTop > this.chartHeight - this._height ? `calc(${offsetTop}px - 100%)` : `${offsetTop}px`;

            this._renderer.setStyle(this._elRef.nativeElement, 'transform', `translate(${x}, ${y})`);
        }
    }
}
