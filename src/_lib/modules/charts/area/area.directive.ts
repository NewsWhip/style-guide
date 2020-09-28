import { Directive, Input, ElementRef, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { area, Area, CurveFactory, curveLinear } from 'd3-shape';
import { ChartComponent } from '../chart.component';
import { ScaleTime, ScaleLinear, scaleTime, scaleLinear } from 'd3-scale';
import { select, Selection } from 'd3-selection';
import { ChartUtils } from '../chart.utils';
import { Subscription } from 'rxjs';

type AreaDatum = [number, number] | [number, number, number]

@Directive({
    selector: 'path[nw-area]',
    exportAs: 'nw-area'
})
export class AreaDirective implements OnInit, OnChanges, OnDestroy {

    /**
     * Each data entry may have 2 or 3 values. If there are 3 the area is drawn within the bounds.
     *
     * If there are 2 the area is drawn to the chart height
     */
    @Input('nw-area') data: Array<AreaDatum> = [];
    @Input() xDomain: [number, number];
    @Input() yDomain: [number, number];
    @Input() animDuration: number = ChartUtils.ANIMATION_DURATION;
    @Input() curve: CurveFactory = curveLinear;
    @Input() easing: (normalizedTime: number) => number = ChartUtils.ANIMATION_EASING;

    public areaSelection: Selection<SVGPathElement, Array<AreaDatum>, SVGElement, any>;
    public area: Area<AreaDatum>;
    public xScale: ScaleTime<number, number>;
    public yScale: ScaleLinear<number, number>;

    private _chartResizeSub: Subscription;

    constructor(
        private _elRef: ElementRef,
        private _chart: ChartComponent,
        private _chartUtils: ChartUtils) {}

    ngOnInit() {
        this.areaSelection = select(this._elRef.nativeElement as SVGPathElement);
        this.xScale = scaleTime()
        this.yScale = scaleLinear();

        this.setDomains();
        this.setArea();
        this.drawArea();

        this._subscribeToChartResize();
    }

    ngOnChanges(changes: SimpleChanges) {
        let isDomainChange = (changes.xDomain || changes.yDomain) && ChartUtils.haveDomainsChanged(changes.xDomain, changes.yDomain);
        let isDataChange = changes.data && !changes.data.firstChange && !ChartUtils.areDatasetsEqual(changes.data.previousValue, changes.data.currentValue);
        let isCurveChange = changes.curve && !changes.curve.firstChange && (changes.curve.currentValue !== changes.curve.previousValue);

        if (isDomainChange || isDataChange || isCurveChange) {
            this.setDomains();
            this.setArea();
            this.updateArea();
        }
    }

    setDomains(): void {
        this.xScale.domain(this.xDomain).range([0, this._chart.width]);
        this.yScale.domain(this.yDomain).range([this._chart.height, 0]);
    }

    setArea(): void {
        this.area = area<AreaDatum>()
            .x(d => this.xScale(d[0]))
            .y0(d => d[2] ? this.yScale(d[2]) : this._chart.height)
            .y1(d => this.yScale(d[1]));
    }

    drawArea(): void {
        this.areaSelection
            .datum(this.data)
            .attr('d', this.area)
    }

    updateArea(): void {
        this.areaSelection
            .datum(this.data)
            .transition()
            .duration(this.animDuration)
            .ease(this.easing)
            .attr('d', this.area)
    }

    private _subscribeToChartResize() {
        this._chartResizeSub = this._chartUtils.chartResize$
            .subscribe(_ => {
                this.setDomains();
                this.setArea();
                this.drawArea();
            });
    }

    ngOnDestroy() {
        this._chartResizeSub.unsubscribe();
    }

}
