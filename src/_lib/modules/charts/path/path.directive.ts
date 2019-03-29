import { Directive, OnInit, Input, ElementRef, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { select, Selection } from 'd3-selection';
import { line, Line, curveLinear, CurveFactory } from 'd3-shape';
import { ScaleTime, ScaleLinear, scaleTime, scaleLinear } from 'd3-scale';
import { ChartUtils } from '../chart.utils';
import 'd3-transition';
import { ChartComponent } from '../chart.component';
import { Subscription } from "rxjs/Subscription";

@Directive({
    selector: 'path[nw-path]',
    exportAs: 'nw-path'
})
export class PathDirective implements OnInit, OnChanges, OnDestroy {

    @Input('nw-path') data: Array<[number, number]> = [];
    @Input() xDomain: [number, number];
    @Input() yDomain: [number, number];
    @Input() animDuration: number = ChartUtils.ANIMATION_DURATION;
    @Input() curve: CurveFactory = curveLinear;
    @Input() easing: (normalizedTime: number) => number = ChartUtils.ANIMATION_EASING;

    @Output() animEnd: EventEmitter<null> = new EventEmitter();

    public line: Line<[number, number]>;
    public path: Selection<SVGPathElement, Array<[number, number]>, SVGElement, any>;
    public xScale: ScaleTime<number, number>;
    public yScale: ScaleLinear<number, number>;

    private _windowResizeSub: Subscription;

    constructor(
        private _elRef: ElementRef,
        private _chart: ChartComponent,
        private _chartUtils: ChartUtils) {}

    ngOnInit() {
        this.path = select(this._elRef.nativeElement as SVGPathElement);
        this.xScale = scaleTime()
        this.yScale = scaleLinear();

        this.setDomains();
        this.setLine();
        this.drawLine();

        this._subscribeToWindowResize();
    }

    ngOnChanges(changes: SimpleChanges) {
        let isDomainChange = (changes.xDomain || changes.yDomain) && ChartUtils.haveDomainsChanged(changes.xDomain, changes.yDomain);
        let isDataChange = changes.data && !changes.data.firstChange && !ChartUtils.areDatasetsEqual(changes.data.previousValue, changes.data.currentValue);
        let isCurveChange = changes.curve && !changes.curve.firstChange && (changes.curve.currentValue !== changes.curve.previousValue);

        if (isDomainChange || isDataChange || isCurveChange) {
            this.setDomains();
            this.setLine();
            this.updateLine();
        }
    }

    setDomains() {
        this.xScale.domain(this.xDomain).range([0, this._chart.width]);
        this.yScale.domain(this.yDomain).range([this._chart.height, 0]);
    }

    setLine(): void {
        this.line = line().curve(this.curve)
            .x(d => this.xScale(d[0]))
            .y(d => this.yScale(d[1]));
    }

    drawLine(): void {
        this.path
            .datum(this.data)
            .attr('d', this.line)
    }

    updateLine(): void {
        this.path
            .datum(this.data)
            .transition()
            .duration(this.animDuration)
            .ease(this.easing)
            .attr('d', this.line)
            .on('end', e => this.animEnd.next())
    }

    private _subscribeToWindowResize() {
        this._windowResizeSub = this._chartUtils.windowResize$
            .subscribe(_ => {
                this.setDomains();
                this.drawLine();
            });
    }

    ngOnDestroy() {
        this._windowResizeSub.unsubscribe();
    }

}
