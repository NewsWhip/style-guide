import { Directive, ElementRef, Input } from '@angular/core';
import { axisLeft, axisRight } from 'd3-axis';
import { ChartService } from '../chart.service';
import { AxisBase } from './axis-base';
import { ScaleLinear } from 'd3-scale';

@Directive({
    selector: '[nw-y-axis]',
    exportAs: 'nw-y-axis'
})
export class YAxisDirective extends AxisBase {

    @Input() align: 'left' | 'right' = 'left';
    @Input() domain: [number, number] = [0, 0];
    @Input() scale: ScaleLinear<number, number>;

    constructor(
        private _chart: ChartService,
        elRef: ElementRef) {

        super(elRef);
    }

    createAxis() {
        this.axis = this.align === "left" ?
            axisLeft(this.scale) :
            axisRight(this.scale);
    }

    setTicks() {
        super.setTicks();

        if (this.showGuidlines) {
            this.axis.tickSizeInner(-this._chart.width);
        }
        else {
            this.axis.tickSizeInner(6);
        }
    }

    setDomain() {
        this.scale.domain(this.domain).range([this._chart.height, 0]);
    }

    render() {
        let xTranslation = this.align === "right" ? this._chart.width : 0;

        this.axisSelection
            .attr('transform', "translate(" + xTranslation + ", 0)")
            .call(this.axis)
    }

}
