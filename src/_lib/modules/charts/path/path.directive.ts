import { Directive, OnInit, Input, ElementRef, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { select, Selection } from 'd3-selection';
import { line, Line, curveLinear, CurveFactory } from 'd3-shape';
import 'd3-transition';
import { ChartService } from '../chart.service';
import { Subscription } from 'rxjs/Subscription';

@Directive({
    selector: 'path[nw-path]',
    exportAs: 'nw-path'
})
export class PathDirective implements OnInit, OnChanges, OnDestroy {

    @Input('nw-path') data: Array<[number, number]> = [];
    @Input() curve: CurveFactory = curveLinear;
    @Input() animDuration: number = 1000;

    // TODO: take optional xScale and yScale as inputs
    // for graphs with multiple domains

    @Output() animEnd: EventEmitter<null> = new EventEmitter()

    public line: Line<[number, number]>;
    public path: Selection<SVGPathElement, Array<[number, number]>, SVGElement, any>;

    private _scaleSub: Subscription;

    constructor(
        private _chart: ChartService,
        private _elRef: ElementRef) {}

    ngOnInit() {
        this.path = select(this._elRef.nativeElement as SVGPathElement);

        this.setLine();
        this.drawLine();

        this.subscribeToScaleChange();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.shouldUpdateLine(changes)) {
            this.updateLine();
        }
    }

    shouldUpdateLine(changes: SimpleChanges): boolean {
        return changes.data &&
            !changes.data.firstChange &&
            !ChartService.areDatasetsEqual(changes.data.previousValue, changes.data.currentValue)
    }

    setLine(): void {
        this.line = line().curve(this.curve)
            .x(d => this._chart.xScale(d[0]))
            .y(d => this._chart.yScale(d[1]));
    }

    drawLine(): void {
        this.path
            .datum(this.data)
            .attr('d', this.line)
    }

    updateLine(): void {
        this.path
            // TODO: can this be done without datum?
            .datum(this.data)
            .transition()
            .duration(this.animDuration)
            .attr('d', this.line)
            .on('end', e => this.animEnd.next())
    }

    subscribeToScaleChange() {
        this._scaleSub = this._chart.scales$.subscribe(scales => {
            this.setLine();
            this.updateLine();
        })
    }

    ngOnDestroy() {
        this._scaleSub.unsubscribe();
    }

}
