import { Input, OnInit, ElementRef, OnChanges, SimpleChanges } from "@angular/core";
import { Axis, AxisTimeInterval } from 'd3-axis';
import { ChartUtils } from "../chart.utils";
import { select, Selection } from "d3-selection";
import { ChartComponent } from "../chart.component";

export abstract class AxisBase implements OnInit, OnChanges {

    @Input() tickFormat: (value: number | Date | { valueOf(): number; }) => string
    @Input() tickCount: number | AxisTimeInterval;
    @Input() tickSizeOuter: number = 6;
    @Input() tickValues: any[];
    @Input() showGuidlines: boolean = false;
    @Input() animDuration: number = ChartUtils.ANIMATION_DURATION;
    @Input() easing: (normalizedTime: number) => number = ChartUtils.ANIMATION_EASING;

    public axis: Axis<number | Date | { valueOf(): number; }>;
    public axisSelection: Selection<SVGGElement, Array<[number, number]>, SVGElement, any>;
    public width: number;
    public height: number;

    constructor(
        private _elRef: ElementRef,
        public chart: ChartComponent) {}

    ngOnInit() {
        this.axisSelection = select(this._elRef.nativeElement as SVGGElement);
        this.width = this.chart.width;
        this.height = this.chart.height;

        this.createAxis();
        this.setDomain();
        this.setTicks();
        this.render();
    }

    ngOnChanges(c: SimpleChanges) {
        let isDomainChange = ChartUtils.hasInputChanged(c.domain);
        let isTickSettingsChange = ChartUtils.hasInputChanged(c.tickCount) ||
            ChartUtils.hasInputChanged(c.tickSizeOuter) ||
            ChartUtils.hasInputChanged(c.showGuidlines) ||
            ChartUtils.hasInputChanged(c.tickValues);

        if (isDomainChange || isTickSettingsChange) {
            this.setDomain();
            this.setTicks();
            this.update();
        }
    }

    createAxis(): any {
        throw new Error("Method not implemented.");
    }

    setTicks() {
        this.axis
            .ticks(this.tickCount)
            .tickFormat(this.tickFormat)
            .tickSizeOuter(this.tickSizeOuter);

        if (this.tickValues) {
            this.axis.tickValues(this.tickValues);
        }
    }

    setDomain() {
        throw new Error("Method not implemented.");
    }

    render(): any {
        throw new Error("Method not implemented.");
    }

    update() {
        this.axisSelection
            .transition()
            .duration(this.animDuration)
            .ease(this.easing)
            .call(this.axis);
    }

}
