import { Directive, ElementRef, Input } from '@angular/core';
import { axisLeft, axisRight } from 'd3-axis';
import { ChartService } from '../chart.service';
import { AxisBase } from './axis-base';

@Directive({
    selector: '[nw-y-axis]',
    exportAs: 'nw-y-axis'
})
export class YAxisDirective extends AxisBase {

    @Input() align: 'left' | 'right' = 'left';

    constructor(
        private _chart: ChartService,
        elRef: ElementRef) {

        super(_chart, elRef);
    }

    setAxis() {
        this.axis = this.align === "left" ?
            axisLeft(this._chart.yScale) :
            axisRight(this._chart.yScale);
    }

    setTicks() {
        super.setTicks();

        if (this.showGuidlines) {
            this.axis.tickSizeInner(-this._chart.width);
        }
    }

    render() {
        let xTranslation = this.align === "right" ? this._chart.width : 0;

        this.axisSelection
            .attr('transform', "translate(" + xTranslation + ", 0)")
            .call(this.axis)
    }

}
