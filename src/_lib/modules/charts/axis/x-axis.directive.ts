import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { axisBottom, axisTop } from 'd3-axis';
import { AxisBase } from './axis-base';
import { ScaleTime, scaleTime } from 'd3-scale';
import { ChartComponent } from '../chart.component';

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
        chart: ChartComponent) {

        super(elRef, chart);
    }

    createAxis() {
        this.axis = this.align === "bottom" ?
            axisBottom(this.scale) :
            axisTop(this.scale);
    }

    setTicks() {
        super.setTicks();

        if (this.showGuidlines) {
            this.axis.tickSizeInner(-this.height);
        }
        else {
            this.axis.tickSizeInner(6);
        }

        this.scaleUpdated.emit(this.scale.copy());
    }

    setDomain() {
        this.scale.domain(this.domain).range([0, this.width]);
    }

    render() {
        let yTranslation = this.align === "bottom" ? this.height : 0;

        this.axisSelection
            .attr('transform', "translate(0," + yTranslation + ")")
            .call(this.axis)
    }

}
