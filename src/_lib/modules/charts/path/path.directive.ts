import { Directive, OnChanges, Input, HostBinding, OnDestroy } from '@angular/core';
import { ChartService } from "../chart.service";

@Directive({
    selector: '[nw-path]',
    exportAs: 'nw-path'
})
export class PathDirective implements OnChanges, OnDestroy {

    @Input('nw-path') data: Array<[number, number]>;

    @HostBinding('attr.d') d: string;

    constructor(private _chartService: ChartService) { }

    ngOnChanges() {
        this.render();
    }

    render(): void {
        this.d = this.data
            .map(d => [this._chartService.toX(d[0]), this._chartService.toY(d[1])])
            .map((d, i) => {
                return i === 0
                    ? `M${d[0]},${d[1]}`
                    : `L${d[0]},${d[1]}`
            })
            .join('')
    }

    ngOnDestroy() {
        console.log('PathDirective destroyed');
    }
}
