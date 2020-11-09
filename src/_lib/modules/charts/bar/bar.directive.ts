import { Directive, Input, OnInit, OnChanges, ElementRef, SimpleChanges, OnDestroy } from '@angular/core';
import { select, Selection } from 'd3-selection';
import { ScaleLinear, scaleTime, scaleLinear } from 'd3-scale';
import { ChartUtils } from '../chart.utils';
import { ChartComponent } from '../chart.component';
import { Subscription } from 'rxjs';
import { NwXAxisScale } from '../axis/models/XAxisScale';

@Directive({
    selector: 'rect[nw-bar]'
})
export class BarDirective implements OnInit, OnChanges, OnDestroy {

    @Input('nw-bar') value: [number, number];
    @Input() xDomain: [number, number];
    @Input() yDomain: [number, number];
    @Input() animDuration: number = ChartUtils.ANIMATION_DURATION;
    @Input() easing: (normalizedTime: number) => number = ChartUtils.ANIMATION_EASING;
    @Input() barWidth: number = 20;
    @Input() xScale: NwXAxisScale = scaleTime();

    public rect: Selection<SVGRectElement, [number, number], SVGElement, any>;
    public yScale: ScaleLinear<number, number> = scaleLinear();

    private _chartResizeSub: Subscription;

    constructor(
        private _elRef: ElementRef,
        private _chart: ChartComponent,
        private _chartUtils: ChartUtils) { }

    ngOnInit() {
        this.rect = select(this._elRef.nativeElement as SVGRectElement);

        this.setDomains();
        this.draw();

        this._subscribeToChartResize();
    }

    ngOnChanges(changes: SimpleChanges) {
        const isDomainChange = (changes.xDomain || changes.yDomain) && ChartUtils.haveDomainsChanged(changes.xDomain, changes.yDomain);
        const isDataChange = changes.point && !changes.point.firstChange && !ChartUtils.areDatasetsEqual([changes.point.previousValue], [changes.point.currentValue]);
        const barWidthChange = changes.barWidth && !changes.barWidth.firstChange && (changes.barWidth.previousValue !== changes.barWidth.currentValue);

        if (isDomainChange || isDataChange || barWidthChange) {
            this.setDomains();
            this.draw(this.animDuration);
        }
    }

    setDomains() {
        (this.xScale.domain(this.xDomain) as NwXAxisScale).range([0, this._chart.width]);
        this.yScale.domain(this.yDomain).range([this._chart.height, 0]);
    }

    draw(animDuration: number = 0) {
        this.rect
            .transition()
            .duration(animDuration)
            .ease(this.easing)
            .attr('x', this.xScale(this.value[0]) - (this.barWidth / 2))
            .attr('y', this.yScale(this.value[1]))
            .attr("width", this.barWidth)
            .attr("height", this._chart.height - this.yScale(this.value[1]));
    }

    private _subscribeToChartResize() {
        this._chartResizeSub = this._chartUtils.chartResize$
            .subscribe(_ => {
                this.setDomains();
                this.draw();
            });
    }

    ngOnDestroy() {
        this._chartResizeSub.unsubscribe();
    }

}
