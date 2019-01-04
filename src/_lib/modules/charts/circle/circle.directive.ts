import { Directive, Input, OnInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { ChartUtils } from '../chart.utils';
import { select, Selection } from 'd3-selection';
import { ScaleTime, ScaleLinear } from 'd3-scale';

@Directive({
    selector: 'circle[nw-circle]'
})
export class CircleDirective implements OnInit, OnChanges {

    @Input('nw-circle') point: [number, number];
    @Input() width: number;
    @Input() height: number;
    @Input() xDomain: [number, number];
    @Input() yDomain: [number, number];
    @Input() xScale: ScaleTime<number, number>;
    @Input() yScale: ScaleLinear<number, number>;
    @Input() animDuration: number = 1000;

    public circle: Selection<SVGCircleElement, [number, number], SVGElement, any>;

    constructor(private _elRef: ElementRef) {}

    ngOnInit() {
        this.circle = select(this._elRef.nativeElement as SVGCircleElement);

        this.setDomains();
        this.draw();
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
        this.xScale.domain(this.xDomain).range([0, this.width]);
        this.yScale.domain(this.yDomain).range([this.height, 0]);
    }

    draw(): void {
        this.circle
            .attr("transform", this.transform);
    }

    update() {
        this.circle
            .transition()
            .duration(this.animDuration)
            .attr("transform", this.transform);
    }

    get transform(): string {
        return `translate(${this.xScale(this.point[0])}, ${this.yScale(this.point[1])})`;
    }

}
