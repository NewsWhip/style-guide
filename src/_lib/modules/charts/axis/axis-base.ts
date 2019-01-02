import { Input, OnInit, OnDestroy, ElementRef, OnChanges, SimpleChanges } from "@angular/core";
import { Axis, AxisTimeInterval } from 'd3-axis';
import { ChartService } from "../chart.service";
import { select, Selection } from "d3-selection";

export abstract class AxisBase implements OnInit, OnChanges {

    
    @Input() tickFormat: (value: number | Date | { valueOf(): number; }) => string
    @Input() tickCount: number | AxisTimeInterval;
    @Input() tickSizeOuter: number = 6;
    @Input() showGuidlines: boolean = false;
    @Input() animDuration: number = 1000;

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
        let isDomainChange = ChartService.hasInputChanged(c.domain);
        let isTickSettingsChange = ChartService.hasInputChanged(c.tickCount) ||
            ChartService.hasInputChanged(c.tickSizeOuter) ||
            ChartService.hasInputChanged(c.showGuidlines);

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
            .call(this.axis);
    }

}
