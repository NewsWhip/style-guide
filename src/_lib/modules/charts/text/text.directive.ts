import { Directive, Input, OnInit, ElementRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ChartUtils } from '../chart.utils';
import { select, Selection } from 'd3-selection';
import { ScaleLinear, scaleTime, scaleLinear } from 'd3-scale';
import { ChartComponent } from '../chart.component';
import { Subscription } from 'rxjs';
import { NwXAxisScale } from '../axis/models/XAxisScale';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'text[nw-text]',
    exportAs: 'nw-text'
})
export class TextDirective implements OnInit, OnChanges, OnDestroy {

    @Input('nw-text') point: [number, number];
    @Input() xDomain: [number, number];
    @Input() yDomain: [number, number];
    @Input() animDuration: number = ChartUtils.ANIMATION_DURATION;
    @Input() easing: (normalizedTime: number) => number = ChartUtils.ANIMATION_EASING;
    @Input() xScale: NwXAxisScale = scaleTime();

    public text: Selection<SVGTextElement, [number, number], SVGElement, any>;
    public yScale: ScaleLinear<number, number> = scaleLinear();

    private _chartResizeSub: Subscription;

    constructor(
        private _elRef: ElementRef<SVGTextElement>,
        private _chart: ChartComponent,
        private _chartUtils: ChartUtils) {}

    ngOnInit() {
        this.text = select(this._elRef.nativeElement);

        this.setDomains();
        this.draw();

        this._subscribeToChartResize();
    }

    ngOnChanges(changes: SimpleChanges) {
        const isDomainChange = (changes.xDomain || changes.yDomain) && ChartUtils.haveDomainsChanged(changes.xDomain, changes.yDomain);
        const isDataChange = changes.point && !changes.point.firstChange && !ChartUtils.areDatasetsEqual([changes.point.previousValue], [changes.point.currentValue]);

        if (isDomainChange || isDataChange) {
            this.setDomains();
            this.update();
        }
    }

    setDomains() {
        (this.xScale.domain(this.xDomain) as NwXAxisScale).range([0, this._chart.width]);
        this.yScale.domain(this.yDomain).range([this._chart.height, 0]);
    }

    draw(): void {
        this.text
            .attr("x", this.x)
            .attr("y", this.y);
    }

    update() {
        this.text
            .transition()
            .duration(this.animDuration)
            .ease(this.easing)
            .attr("x", this.x)
            .attr("y", this.y);
    }

    get transform(): string {
        return `translate(${this.x}, ${this.y})`;
    }

    get x(): number {
        return this.xScale(this.point[0]);
    }

    get y(): number {
        return this.yScale(this.point[1]);
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
