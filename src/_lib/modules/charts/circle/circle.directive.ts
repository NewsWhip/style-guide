import { Directive, Input, OnInit, ElementRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ChartService } from '../chart.service';
import { select, Selection } from 'd3-selection';
import { ScaleTime, ScaleLinear } from 'd3-scale';

@Directive({
    selector: 'circle[nw-circle]'
})
export class CircleDirective implements OnInit, OnChanges {

    @Input('nw-circle') point: [number, number];
    @Input() xDomain: [number, number];
    @Input() yDomain: [number, number];
    @Input() xScale: ScaleTime<number, number>;
    @Input() yScale: ScaleLinear<number, number>;
    @Input() animDuration: number = 1000;

    public circle: Selection<SVGCircleElement, [number, number], SVGElement, any>;

    constructor(
        private _chart: ChartService,
        private _elRef: ElementRef) {}

    ngOnInit() {
        this.circle = select(this._elRef.nativeElement as SVGCircleElement);

        this.setDomains();
        this.draw();
    }

    ngOnChanges(changes: SimpleChanges) {
        let isDomainChange = (changes.xDomain || changes.yDomain) && ChartService.haveDomainsChanged(changes.xDomain, changes.yDomain);
        let isDataChange = changes.point && !changes.point.firstChange && !ChartService.areDatasetsEqual([changes.point.previousValue], [changes.point.currentValue]);
   
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
            .attr("transform", this.transform);
    }

    get transform(): string {
        return `translate(${this.xScale(this.point[0])}, ${this.yScale(this.point[1])})`;
    }

}
