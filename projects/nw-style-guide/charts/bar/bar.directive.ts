import { Directive, Input, OnInit, OnChanges, ElementRef, SimpleChanges, OnDestroy } from '@angular/core';
import { select, Selection } from 'd3-selection';
import { ScaleLinear, scaleTime, scaleLinear } from 'd3-scale';
import { ChartUtils } from '../chart.utils';
import { ChartComponent } from '../chart.component';
import { Subscription } from 'rxjs';
import { NwXAxisScale } from '../axis/models/XAxisScale';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'rect[nw-bar]'
})
export class BarDirective implements OnInit, OnChanges, OnDestroy {

    /**
     * [number, number] corresponds to a coordinate of [x, y]
     * [number, number, number] corresponds to a coordinate of [x, y2, y1] where y1 is the lower
     * y-value and y2 is the upper y-value. Where y1 is not provided the bar will span from the
     * provided y-value to 0 (the full chart height)
     */
    @Input('nw-bar') value: [number, number] | [number, number, number];
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
        const isDataChange = changes.value && !changes.value.firstChange && !ChartUtils.areDatasetsEqual([changes.value.previousValue], [changes.value.currentValue]);
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
        const x = this.value[0];
        const y2 = this.value[1];
        const y1 = this.value[2];
        const height = y1 ? y2 - y1 : y2;

        this.rect
            .transition()
            .duration(animDuration)
            .ease(this.easing)
            .attr('x', this.xScale(x) - (this.barWidth / 2))
            .attr('y', this.yScale(y2))
            .attr("width", this.barWidth)
            .attr("height", this._chart.height - this.yScale(height));
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
