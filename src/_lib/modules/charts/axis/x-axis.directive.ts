import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { axisBottom, axisTop } from 'd3-axis';
import { AxisBase } from './axis-base';
import { ScaleTime, scaleTime } from 'd3-scale';
import { ChartComponent } from '../chart.component';
import { ChartUtils } from "../chart.utils";

@Directive({
    selector: '[nw-x-axis]',
    exportAs: 'nw-x-axis'
})
export class XAxisDirective extends AxisBase {

    @Input() align: 'top' | 'bottom' = 'bottom';
    @Input() domain: [number, number];

    @Output() scaleUpdated: EventEmitter<ScaleTime<number, number>> = new EventEmitter();

    public scale: ScaleTime<number, number> = scaleTime();

    constructor(
        elRef: ElementRef,
        chart: ChartComponent,
        chartUtils: ChartUtils) {

        super(elRef, chart, chartUtils);
    }

    createAxis() {
        this.axis = this.align === "bottom" ?
            axisBottom(this.scale) :
            axisTop(this.scale);
    }

    setTicks() {
        super.setTicks();

        if (this.showGuidlines) {
            this.axis.tickSizeInner(-this.chart.height);
        }
        else {
            this.axis.tickSizeInner(6);
        }

        this.scaleUpdated.emit(this.scale.copy());
    }

    setDomain() {
        this.scale.domain(this.domain).range([0, this.chart.width]);
    }

    positionLabel() {
        if (this.label) {
            const y = this.align === 'top' ? 0 : this.fullHeight;
            const dy = this.align === 'top' ? "1em" : "-0.5em";

            this.axisLabelSelection
                .attr('class', this.align)
                .attr('dy', dy)
                .attr('transform', `translate(${this.fullWidth / 2}, ${y})`)
                .text(this.label);
        }
    }

    render() {
        let yTranslation = this.align === "bottom" ? this.chart.height : 0;

        this.axisSelection
            .attr('transform', "translate(0," + yTranslation + ")")
            .call(this.axis);

        this.positionLabel();
    }

}
