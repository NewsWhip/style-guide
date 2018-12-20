import { Input, OnInit, OnDestroy, ElementRef, OnChanges, SimpleChanges } from "@angular/core";
import { Axis, AxisTimeInterval } from 'd3-axis';
import { Subscription } from "rxjs/Subscription";
import { ChartService } from "../chart.service";
import { select, Selection } from "d3-selection";

export abstract class AxisBase implements OnInit, OnChanges {

    @Input() xRange: [number, number] = [0, 0];
    @Input() yRange: [number, number] = [0, 0];
    @Input() tickFormat: (value: number | Date | { valueOf(): number; }) => string
    @Input() tickCount: number | AxisTimeInterval;
    @Input() tickSizeOuter: number = 6;
    @Input() showGuidlines: boolean = false;
    @Input() animDuration: number = 1000;

    // TODO: take optional xScale and yScale as inputs
    // for graphs with multiple domains

    public axis: Axis<number | Date | { valueOf(): number; }>;
    public axisSelection: Selection<SVGGElement, Array<[number, number]>, SVGElement, any>;

    constructor(
        private __chart: ChartService,
        private __elRef: ElementRef) {}

    ngOnInit() {
        this.axisSelection = select(this.__elRef.nativeElement as SVGGElement);

        this.setAxis();
        this.setTicks();
        this.render();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (ChartService._hasRangeChanged(changes.xRange, changes.yRange)) {
            this.update();
        }
    }

    setAxis(): any {
        throw new Error("Method not implemented.");
    }

    setTicks() {
        this.axis
            .ticks(this.tickCount)
            .tickFormat(this.tickFormat)
            .tickSizeOuter(this.tickSizeOuter);
    }

    render(): any {
        throw new Error("Method not implemented.");
    }

    update() {
        this.axisSelection
            .transition()
            .duration(this.animDuration)
            .call(this.axis);
    }

}
