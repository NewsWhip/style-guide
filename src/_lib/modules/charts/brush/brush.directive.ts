import { Directive, ElementRef, OnInit, Input, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { select, Selection } from 'd3-selection';
import { brush, BrushBehavior, brushX, brushY, brushSelection, BrushSelection } from 'd3-brush';
import { ChartComponent } from '../chart.component';
import { isEqual } from 'lodash-es';

@Directive({
    selector: 'svg:g[nw-brush]',
    exportAs: 'nw-brush'
})
export class BrushDirective implements OnInit, OnDestroy, OnChanges {

    /**
     * `extent` can be thought of as the area of the chart we want the brush to be moveable in.
     *
     * Array of points [[x0, y0], [x1, y1]], where [x0, y0] is the top-left corner and [x1, y1] is the bottom-right corner.
     */
    @Input() extent: [[number, number], [number, number]];
    /**
     * The dimension / orientation of the brush
     */
    @Input() dimension: 'x' | 'y' | '' = '';
    /**
     * For a two-dimensional brush, it must be defined as [[x0, y0], [x1, y1]],
     * where x0 is the minimum x-value, y0 is the minimum y-value, x1 is the maximum x-value, and y1 is the maximum y-value.
     * For an x-brush, it must be defined as [x0, x1]; for a y-brush, it must be defined as [y0, y1].
     */
    @Input() selection: BrushSelection;

    /**
     * Outputs the brush selection in pixel values
     */
    @Output() brushEnd: EventEmitter<BrushSelection> = new EventEmitter();

    public brushSelection: Selection<SVGGElement, any, HTMLElement, any>;
    public brush: BrushBehavior<any>;

    constructor(
        private _elRef: ElementRef,
        private _chart: ChartComponent) {}

    ngOnInit() {
        this._initialize();

        if (this.selection) {
            this._setBrushArea(this.selection);
        }
        this._subscribeToBrushEndEvent();
    }

    ngOnChanges(c: SimpleChanges) {
        const dimensionChange: boolean = c.dimension && !c.dimension.firstChange && c.dimension.previousValue !== c.dimension.currentValue;
        const selectionChange: boolean = c.selection && !c.selection.firstChange && c.selection.previousValue !== c.selection.currentValue;

        if (dimensionChange) {
            this.selection ?
                this._clearBrush({ emitEvent: false }) :
                this._clearBrush();
        }
        if (selectionChange) {
            this._setBrushArea(this.selection);
        }
    }

    private _initialize() {
        this.brushSelection = select(this._elRef.nativeElement as SVGSVGElement);
        this.brushSelection.attr('class', 'nw-brush');
        this._createBrush();
    }

    private _createBrush() {
        switch (this.dimension) {
            case 'x':
                this.brush = brushX();
                break;

            case 'y':
                this.brush = brushY();
                break;

            default:
                this.brush = brush();
                break;
        }

        this.brush.extent(this._getExtent())
        this.brushSelection.call(this.brush);
    }

    private _getExtent(): [[number, number], [number, number]] {
        return this.extent || [
            [0, 0],
            [this._chart.width, this._chart.height]
        ];
    }

    private _clearBrush(options: { emitEvent: boolean } = { emitEvent: true }) {
        this.brush.move(this.brushSelection, null);

        if (options.emitEvent) {
            this.brushEnd.emit(null);
        }
    }

    private _subscribeToBrushEndEvent() {
        this.brush.on('end', _event => {
            const selection = brushSelection(this._elRef.nativeElement);

            this.brushEnd.emit(selection);
        });
    }

    private _unbindEvents() {
        this.brush.on('end', null);
    }

    /**
     * @param areaSelection A 2d or 1d area. For a two-dimensional brush, it must be defined as [[x0, y0], [x1, y1]],
     * where x0 is the minimum x-value, y0 is the minimum y-value, x1 is the maximum x-value, and y1 is
     * the maximum y-value. For an x-brush, it must be defined as [x0, x1]; for a y-brush, it must be defined
     * as [y0, y1].
     *
     * ref: https://github.com/d3/d3-brush#brush_move
     */
    private _setBrushArea(areaSelection: BrushSelection) {
        /**
         * We don't want to emit an event when the brush area is programatically updated. In order to that
         * we unbind the "end" event and re-bind after the brush update
         */
        this._unbindEvents();

        if (areaSelection) {
            this.brush.move(this.brushSelection, areaSelection);
        } else {
            this._clearBrush();
        }
        this._subscribeToBrushEndEvent();
    }

    ngOnDestroy() {
        this._unbindEvents();
    }

}
