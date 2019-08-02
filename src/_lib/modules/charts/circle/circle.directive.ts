import { Directive, Input, OnInit, ElementRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ChartUtils } from '../chart.utils';
import { select, Selection } from 'd3-selection';
import { ScaleTime, ScaleLinear, scaleTime, scaleLinear } from 'd3-scale';
import { ChartComponent } from '../chart.component';
import { Subscription } from 'rxjs';

@Directive({
    selector: 'circle[nw-circle]',
    exportAs: 'nw-circle'
})
export class CircleDirective implements OnInit, OnChanges, OnDestroy {

    @Input('nw-circle') point: [number, number];
    @Input() xDomain: [number, number];
    @Input() yDomain: [number, number];
    @Input() animDuration: number = ChartUtils.ANIMATION_DURATION;
    @Input() easing: (normalizedTime: number) => number = ChartUtils.ANIMATION_EASING;

    public circle: Selection<SVGCircleElement, [number, number], SVGElement, any>;
    public xScale: ScaleTime<number, number> = scaleTime();
    public yScale: ScaleLinear<number, number> = scaleLinear();

    private _windowResizeSub: Subscription;

    constructor(
        private _elRef: ElementRef,
        private _chart: ChartComponent,
        private _chartUtils: ChartUtils) {}

    ngOnInit() {
        this.circle = select(this._elRef.nativeElement as SVGCircleElement);

        this.setDomains();
        this.draw();

        this._subscribeToWindowResize();
    }

    ngOnChanges(changes: SimpleChanges) {
        let isDomainChange = (changes.xDomain || changes.yDomain) && ChartUtils.haveDomainsChanged(changes.xDomain, changes.yDomain);
        let isDataChange = changes.point && !changes.point.firstChange && !ChartUtils.areDatasetsEqual([changes.point.previousValue], [changes.point.currentValue]);

        if (isDomainChange || isDataChange) {
            this.setDomains();
            this.update();
        }
    }

    setDomains() {
        this.xScale.domain(this.xDomain).range([0, this._chart.width]);
        this.yScale.domain(this.yDomain).range([this._chart.height, 0]);
    }

    draw(): void {
        this.circle
            .attr("transform", this.transform);
    }

    update() {
        this.circle
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

    private _subscribeToWindowResize() {
        this._windowResizeSub = this._chartUtils.windowResize$
            .subscribe(_ => {
                this.setDomains();
                this.draw();
            });
    }

    ngOnDestroy() {
        this._windowResizeSub.unsubscribe();
    }

}
