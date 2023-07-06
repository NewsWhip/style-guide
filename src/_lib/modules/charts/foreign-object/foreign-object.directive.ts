import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { scaleTime, ScaleLinear, scaleLinear } from "d3-scale";
import { select, Selection } from 'd3-selection';
import { Subscription } from "rxjs";
import { NwXAxisScale } from "../axis/models/XAxisScale";
import { ChartComponent } from "../chart.component";
import { ChartUtils } from "../chart.utils";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[nw-foreign-object]',
    exportAs: 'nw-foreign-object',
    standalone: true
})
export class ForeignObjectDirective implements OnInit, OnChanges, OnDestroy {

    @Input() point: [number, number];
    @Input() xDomain: [number, number];
    @Input() yDomain: [number, number];
    @Input() animDuration: number = ChartUtils.ANIMATION_DURATION;
    @Input() easing: (normalizedTime: number) => number = ChartUtils.ANIMATION_EASING;
    @Input() xScale: NwXAxisScale = scaleTime();

    public foreignObject: Selection<SVGForeignObjectElement, [number, number], SVGElement, any>;
    public yScale: ScaleLinear<number, number> = scaleLinear();

    private _chartResizeSub: Subscription;

    constructor(
        private _elRef: ElementRef,
        private _chart: ChartComponent,
        private _chartUtils: ChartUtils) {}

    ngOnInit() {
        this.foreignObject = select(this._elRef.nativeElement as SVGForeignObjectElement);

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
        this.foreignObject.attr("transform", this.transform);
    }

    update() {
        this.foreignObject
            .transition()
            .duration(this.animDuration)
            .ease(this.easing)
            .attr("transform", this.transform);
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
