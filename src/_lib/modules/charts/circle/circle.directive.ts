import { Directive, Input, HostBinding, HostListener, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ChartService } from "../chart.service";

@Directive({
    selector: '[nw-circle]'
})
export class CircleDirective implements OnChanges, OnDestroy {

    @Input('nw-circle') point: [number, number];

    public x: number;
    public y: number;

    @HostBinding('attr.transform') transform;

    constructor(
        private _chartService: ChartService,
        private _domSanitizer: DomSanitizer) { }

    ngOnChanges(changes: SimpleChanges) {
        this.x = this._chartService.toX(this.point[0]);
        this.y = this._chartService.toY(this.point[1]);

        this.transform = `translate(${this.x}, ${this.y})`;
    }

    render(): void {
        this.x = this._chartService.toX(this.point[0]);
        this.y = this._chartService.toY(this.point[1]);

        this.transform = `translate(${this.x}, ${this.y})`;
    }

    ngOnDestroy() {
        console.log('CircleDirective destroyed')
    }

}
