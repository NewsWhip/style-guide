import { Directive, ElementRef, OnInit, Input, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { select, Selection } from 'd3-selection';
import { brush, BrushBehavior, brushX, brushY } from 'd3-brush';

@Directive({
    selector: 'svg:g[nw-brush]',
    exportAs: 'nw-brush'
})
export class BrushDirective implements OnInit, OnDestroy, OnChanges {

    @Input() extent: [[number, number], [number, number]];
    @Input() width: number = (this._elRef.nativeElement as SVGSVGElement).clientWidth;
    @Input() height: number = (this._elRef.nativeElement as SVGSVGElement).clientHeight;
    @Input() dimension: 'x' | 'y' | '' = '';

    @Output() brushEnd: EventEmitter<[[number, number], [number, number]]> = new EventEmitter();

    public brushSelection: Selection<SVGGElement, any, HTMLElement, any>;
    public brush: BrushBehavior<any>;

    constructor(private _elRef: ElementRef) {}

    ngOnInit() {
        this.initialize();
        this._subscribeToBrushEndEvent();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.dimension && !changes.dimension.firstChange && changes.dimension.previousValue !== changes.dimension.currentValue) {
            this.reset();
        }
    }

    initialize() {
        this.brushSelection = select(this._elRef.nativeElement as SVGSVGElement);
        this.brushSelection.attr('class', 'nw-brush')
        this._createBrush();
    }

    reset() {
        this._unbindEvents();
        this._clearBrush();
        this._createBrush();
        this._subscribeToBrushEndEvent();
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

        this.brush.extent(this.getExtent());

        this.brushSelection.call(this.brush);
    }

    getExtent(): [[number, number], [number, number]] {
        return this.extent || [
            [0, 0],
            [this.width, this.height]
        ]
    }

    private _subscribeToBrushEndEvent() {
        this.brush.on('end', () => {
            let selection = this.brushSelection.select('rect.selection');
            let nw: [number, number] = [+selection.attr('x'), +selection.attr('y')];
            let se: [number, number] = [
                +selection.attr('x') + +selection.attr('width'),
                +selection.attr('y') + +selection.attr('height')
            ];
            let emission: [[number, number], [number, number]] = nw[0] === se[0] && nw[1] === se[1] ?
                null :
                [nw, se];

            this.brushEnd.emit(emission);
        });
    }

    private _clearBrush() {
        this.brush.move(this.brushSelection, null);
        this.brushEnd.emit(null);
    }

    private _unbindEvents() {
        this.brush.on('end', null);
    }

    ngOnDestroy() {
        this._unbindEvents();
    }

}
