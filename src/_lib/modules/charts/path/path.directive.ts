import { Directive, OnInit, Input, ElementRef, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter, SimpleChange } from '@angular/core';
import { select, Selection } from 'd3-selection';
import { line, Line, curveLinear, CurveFactory } from 'd3-shape';
import { ScaleTime, ScaleLinear } from 'd3-scale';
import { ChartService } from '../chart.service';
import 'd3-transition';

@Directive({
    selector: 'path[nw-path]',
    exportAs: 'nw-path'
})
export class PathDirective implements OnInit, OnChanges {

    @Input('nw-path') data: Array<[number, number]> = [];
    @Input() xDomain: [number, number];
    @Input() yDomain: [number, number];
    @Input() xScale: ScaleTime<number, number>;
    @Input() yScale: ScaleLinear<number, number>;
    @Input() animDuration: number = 1000;
    @Input() curve: CurveFactory = curveLinear;
    
    @Output() animEnd: EventEmitter<null> = new EventEmitter()

    public line: Line<[number, number]>;
    public path: Selection<SVGPathElement, Array<[number, number]>, SVGElement, any>;

    constructor(
        private _chart: ChartService,
        private _elRef: ElementRef) {}

    ngOnInit() {
        this.path = select(this._elRef.nativeElement as SVGPathElement);

        this.setDomains();
        this.setLine();
        this.drawLine();
    }

    ngOnChanges(changes: SimpleChanges) {
        let isDomainChange = (changes.xDomain || changes.yDomain) && ChartService.haveDomainsChanged(changes.xDomain, changes.yDomain);
        let isDataChange = changes.data && !changes.data.firstChange && !ChartService.areDatasetsEqual(changes.data.previousValue, changes.data.currentValue);
   
        if (isDomainChange || isDataChange) {
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
            .attr('d', this.line)
            .on('end', e => this.animEnd.next())
    }

}
