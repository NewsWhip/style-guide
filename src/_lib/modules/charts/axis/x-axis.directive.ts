import { Directive, ElementRef, Input } from '@angular/core';
import { axisBottom, axisTop, Axis } from 'd3-axis';
import { ChartService } from '../chart.service';
import { AxisBase } from './axis-base';
import { ScaleTime } from 'd3-scale';

@Directive({
    selector: '[nw-x-axis]',
    exportAs: 'nw-x-axis'
})
export class XAxisDirective extends AxisBase {

    @Input() align: 'top' | 'bottom' = 'bottom';
    @Input() domain: [number, number];
    @Input() scale: ScaleTime<number, number>;

    constructor(
        private _chart: ChartService,
        elRef: ElementRef) {

        super(elRef);
    }

    createAxis() {
        this.axis = this.align === "bottom" ?
            axisBottom(this.scale) :
            axisTop(this.scale);
    }

    setTicks() {
        super.setTicks();

        if (this.showGuidlines) {
            this.axis.tickSizeInner(-this._chart.height);
        } 
        else {
            this.axis.tickSizeInner(6);
        }
    }

    setDomain() {
        this.scale.domain(this.domain).range([0, this._chart.width]);
    }

    render() {
        let yTranslation = this.align === "bottom" ? this._chart.height : 0;

        this.axisSelection
            .attr('transform', "translate(0," + yTranslation + ")")
            .call(this.axis)
    }

}
