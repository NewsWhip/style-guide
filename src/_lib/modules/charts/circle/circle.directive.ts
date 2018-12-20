import { Directive, Input, OnInit, ElementRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ChartService } from '../chart.service';
import { select, Selection } from 'd3';
import { Subscription } from 'rxjs/Subscription';

@Directive({
    selector: 'circle[nw-circle]'
})
export class CircleDirective implements OnInit, OnChanges, OnDestroy {

    @Input('nw-circle') point: [number, number];

    public circle: Selection<SVGCircleElement, [number, number], SVGElement, any>;

    private _scaleSub: Subscription;

    constructor(
        private _chart: ChartService,
        private _elRef: ElementRef) {}

    ngOnInit() {
        this.circle = select(this._elRef.nativeElement as SVGCircleElement);

        this.draw();

        this.subscribeToScaleChange();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.shouldUpdate(changes)) {
            this.update();
        }
    }

    shouldUpdate(changes: SimpleChanges): boolean {
        return changes &&
            changes.point &&
            !changes.point.firstChange &&
            !ChartService.areDatasetsEqual([changes.point.previousValue], [changes.point.currentValue])
    }

    draw(): void {
        this.circle
            .attr("transform", this.transform);
    }

    update() {
        this.circle
            .transition()
            .duration(1000)
            .attr("transform", this.transform);
    }

    get transform(): string {
        return `translate(${this._chart.xScale(this.point[0])}, ${this._chart.yScale(this.point[1])})`;
    }

    subscribeToScaleChange() {
        this._scaleSub = this._chart.scales$.subscribe(scales => {
            this.update();
        })
    }

    ngOnDestroy() {
        this._scaleSub.unsubscribe();
    }

}
