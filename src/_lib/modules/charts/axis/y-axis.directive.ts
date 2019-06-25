import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { axisLeft, axisRight } from 'd3-axis';
import { AxisBase } from './axis-base';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { ChartComponent } from '../chart.component';
import { ChartUtils } from "../chart.utils";

@Directive({
    selector: '[nw-y-axis]',
    exportAs: 'nw-y-axis'
})
export class YAxisDirective extends AxisBase {

    @Input() align: 'left' | 'right' = 'left';
    @Input() domain: [number, number];

    @Output() scaleUpdated: EventEmitter<ScaleLinear<number, number>> = new EventEmitter();

    public scale: ScaleLinear<number, number> = scaleLinear();

    constructor(
        elRef: ElementRef,
        chart: ChartComponent,
        chartUtils: ChartUtils) {

        super(elRef, chart, chartUtils);
    }

    createAxis() {
        this.axis = this.align === "left" ?
            axisLeft(this.scale) :
            axisRight(this.scale);
    }

    setTicks() {
        super.setTicks();

        if (this.showGuidlines) {
            this.axis.tickSizeInner(-this.chart.width);
        }
        else {
            this.axis.tickSizeInner(6);
        }

        this.scaleUpdated.emit(this.scale.copy());
    }

    setDomain() {
        this.scale.domain(this.domain).range([this.chart.height, 0]);
    }

    positionLabel() {
        if (this.label) {

            const text = this.axisLabelSelection
                .attr('class', this.align)
                .text(`${this.label}`);

            const textH = text.node().getBBox().height;
            const x = this.align === 'left' ? textH : this.fullWidth - textH;
            const rotationAngle = this.align === 'left' ? '-90' : '90';

            text.attr('transform', `translate(${x}, ${this.fullheight / 2}), rotate(${rotationAngle})`);
        }
    }

    render() {
        let xTranslation = this.align === "right" ? this.chart.width : 0;

        this.axisSelection
            .attr('transform', "translate(" + xTranslation + ", 0)")
            .call(this.axis);

        this.positionLabel();
    }

}
