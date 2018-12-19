import { Component, OnChanges, Input, HostBinding, OnDestroy } from '@angular/core';
import { ChartService } from "../chart.service";

@Component({
    selector: '[nw-x-axis]',
    exportAs: 'nw-x-axis',
    template: `
        <svg:path [attr.d]="d"></svg:path>

        <svg:g class="tick" *ngFor="let tick of ticks"
            [attr.transform]="'translate(' + tick[0] + ', ' + tick[1] + ')'">
            <line stroke="#000" y2="6" x1="0.5" x2="0.5"></line>
            <text fill="#000" y="9" x="0.5" dy="0.71em">
                <!-- {{formatTickValue(tick[0])}} -->
            </text>
        </svg:g>
    `
})
export class XAxisComponent implements OnChanges, OnDestroy {

    @Input() align: 'bottom' | 'top' = 'bottom';
    @Input() tickCount: number;
    @Input() tickFormatFn: Function = (val) => val;
    @Input() clampTicks: boolean = false;

    public ticks: Array<[number, number]>;

    constructor(private _chartService: ChartService) { }

    public d: string;

    ngOnChanges() {
        this.render();
    }

    render(): void {
        this.renderAxis();
        this.renderTicks();
    }

    renderAxis() {
        let xRange = this._chartService.xRange;
        let yRange = this._chartService.yRange;

        let start: [number, number] = this.align === "bottom" ?
            [this._chartService.toX(xRange[0]), this._chartService.toY(yRange[0])] :
            [this._chartService.toX(xRange[0]), this._chartService.toY(yRange[1])];

        let end: [number, number] = this.align === "bottom" ?
            [this._chartService.toX(xRange[1]), this._chartService.toY(yRange[0])] :
            [this._chartService.toX(xRange[1]), this._chartService.toY(yRange[1])];

        this.d = `
            M${start[0]},${start[1]}
            L${end[0]},${end[1]}
        `
    }

    renderTicks() {
        let range = this._chartService.xRange;
        let tickIncrement: number = (range[1] - range[0]) / (this.clampTicks ? (this.tickCount - 1) : (this.tickCount + 1));
        let ticks: Array<[number, number]> = [];

        for (let index = (this.clampTicks ? 0 : 1); index < (this.clampTicks ? this.tickCount + 1 : this.tickCount + 1); index++) {
            ticks.push([
                this._chartService.toX(range[0] + (index * tickIncrement)),
                this.align === "bottom" ?
                    this._chartService.toY(this._chartService.yRange[0]) :
                    this._chartService.toY(this._chartService.yRange[1])
            ]);
        }

        this.ticks = ticks;
    }

    formatTickValue(value) {
        return this.tickFormatFn(value);
    }

    ngOnDestroy() {
        console.log('XAxisComponent destroyed');
    }
}
