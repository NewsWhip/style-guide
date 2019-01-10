import { Input, OnInit, OnDestroy, ElementRef, OnChanges, SimpleChanges } from "@angular/core";
import { Axis, AxisTimeInterval } from 'd3-axis';
import { ChartUtils } from "../chart.utils";
import { select, Selection } from "d3-selection";

export abstract class AxisBase implements OnInit, OnChanges {

    @Input() width: number;
    @Input() height: number;
    @Input() tickFormat: (value: number | Date | { valueOf(): number; }) => string
    @Input() tickCount: number | AxisTimeInterval;
    @Input() tickSizeOuter: number = 6;
    @Input() showGuidlines: boolean = false;
    @Input() animDuration: number = ChartUtils.ANIMATION_DURATION;
    @Input() easing: (normalizedTime: number) => number = ChartUtils.ANIMATION_EASING;

    public axis: Axis<number | Date | { valueOf(): number; }>;
    public axisSelection: Selection<SVGGElement, Array<[number, number]>, SVGElement, any>;

    constructor(private _elRef: ElementRef) {}

    ngOnInit() {
        this.axisSelection = select(this._elRef.nativeElement as SVGGElement);

        this.createAxis();
        this.setDomain();
        this.setTicks();
        this.render();
    }

    ngOnChanges(c: SimpleChanges) {
        let isDomainChange = ChartUtils.hasInputChanged(c.domain);
        let isTickSettingsChange = ChartUtils.hasInputChanged(c.tickCount) ||
            ChartUtils.hasInputChanged(c.tickSizeOuter) ||
            ChartUtils.hasInputChanged(c.showGuidlines);

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
