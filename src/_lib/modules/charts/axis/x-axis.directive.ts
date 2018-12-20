import { Directive, ElementRef, Input } from '@angular/core';
import { axisBottom, axisTop, Axis } from 'd3-axis';
import { ChartService } from '../chart.service';
import { AxisBase } from './axis-base';

@Directive({
    selector: '[nw-x-axis]',
    exportAs: 'nw-x-axis'
})
export class XAxisDirective extends AxisBase {

    @Input() align: 'top' | 'bottom' = 'bottom';

    constructor(
        private _chart: ChartService,
        elRef: ElementRef) {

        super(_chart, elRef);
    }

    setAxis() {
        this.axis = this.align === "bottom" ?
            // TODO: all axis directives need their own scale properties
            // remove from service
            // needed for dual/multi-axis graphs
            axisBottom(this._chart.xScale) :
            axisTop(this._chart.xScale);
    }

    setTicks() {
        super.setTicks();

        if (this.showGuidlines) {
            this.axis.tickSizeInner(-this._chart.height);
        }
    }

    render() {
        let yTranslation = this.align === "bottom" ? this._chart.height : 0;

        this.axisSelection
            .attr('transform', "translate(0," + yTranslation + ")")
            .call(this.axis)
    }

}
