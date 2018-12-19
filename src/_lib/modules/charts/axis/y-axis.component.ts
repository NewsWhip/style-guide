import { Component, OnChanges, Input, HostBinding, OnDestroy } from '@angular/core';
import { ChartService } from "../chart.service";

@Component({
    selector: '[nw-y-axis]',
    exportAs: 'nw-y-axis',
    template: `
        <svg:path [attr.d]="d"></svg:path>

        <svg:g class="tick" *ngFor="let tick of ticks"
            [attr.transform]="'translate(' + tick[0] + ', ' + tick[1] + ')'">
            <line stroke="#000" x2="-6" y1="0.5" y2="0.5"></line>
            <text fill="#000" x="-9" y="0.5" dy="0.32em">
                <!-- {{formatTickValue(tick[1])}} -->
            </text>
        </svg:g>
    `
})
export class YAxisComponent implements OnChanges, OnDestroy {

    @Input() alignment: 'left' | 'right' = 'left';
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
        this.renderAxis()
        this.renderTicks();
    }

    renderAxis() {
        let xRange = this._chartService.xRange;
        let yRange = this._chartService.yRange;

        let start: [number, number] = this.alignment === "left" ?
            [this._chartService.toX(xRange[0]), this._chartService.toY(yRange[0])] :
            [this._chartService.toX(xRange[1]), this._chartService.toY(yRange[0])];

        let end: [number, number] = this.alignment === "left" ?
            [this._chartService.toX(xRange[0]), this._chartService.toY(yRange[1])] :
            [this._chartService.toX(xRange[1]), this._chartService.toY(yRange[1])];

        this.d = `
            M${start[0]},${start[1]}
            L${end[0]},${end[1]}
        `
    }

    renderTicks() {
        let range = this._chartService.yRange;
        let tickIncrement: number = (range[1] - range[0]) / (this.clampTicks ? (this.tickCount - 1) : (this.tickCount + 1));
        let ticks: Array<[number, number]> = [];

        for (let index = (this.clampTicks ? 0 : 1); index < (this.clampTicks ? this.tickCount + 1 : this.tickCount + 1); index++) {
            ticks.push([
                this.alignment === "left" ?
                    this._chartService.toX(this._chartService.xRange[0]) :
                    this._chartService.toX(this._chartService.xRange[1]),
                this._chartService.toY(range[0] +  + (index * tickIncrement))
            ]);
        }

        this.ticks = ticks;
    }

    formatTickValue(value) {
        return this.tickFormatFn(value);
    }

    ngOnDestroy() {
        console.log('YAxisComponent destroyed');
    }
}
