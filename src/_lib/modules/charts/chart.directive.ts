import { Directive, OnInit, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { ChartService } from "./chart.service";

@Directive({
    selector: '[nw-chart]',
    providers: [ChartService]
})
export class ChartDirective implements OnChanges {

    @Input() xRange: [number, number];
    @Input() yRange: [number, number];

    constructor(
        private _chartService: ChartService,
        private _elRef: ElementRef) { }

    ngOnChanges(changes: SimpleChanges) {
        this._chartService.setRange(this.xRange, this.yRange);
        this._chartService.width = (this._elRef.nativeElement as SVGElement).clientWidth;
        this._chartService.height = (this._elRef.nativeElement as SVGElement).clientHeight;
    }

}
