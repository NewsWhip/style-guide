import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { axisLeft, axisRight } from 'd3-axis';
import { AxisBase } from './axis-base';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { ChartComponent } from '../chart.component';

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
        chart: ChartComponent) {

        super(elRef, chart);
    }

    createAxis() {
        this.axis = this.align === "left" ?
            axisLeft(this.scale) :
            axisRight(this.scale);
    }

    setTicks() {
        super.setTicks();

        if (this.showGuidlines) {
            this.axis.tickSizeInner(-this.width);
        }
        else {
            this.axis.tickSizeInner(6);
        }

        this.scaleUpdated.emit(this.scale.copy());
    }

    setDomain() {
        this.scale.domain(this.domain).range([this.height, 0]);
    }

    render() {
        let xTranslation = this.align === "right" ? this.width : 0;

        this.axisSelection
            .attr('transform', "translate(" + xTranslation + ", 0)")
            .call(this.axis)
    }

}
