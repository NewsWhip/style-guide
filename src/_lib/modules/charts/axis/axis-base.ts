import { Input, OnInit, ElementRef, OnChanges, SimpleChanges, OnDestroy, NgZone } from "@angular/core";
import { Axis, AxisTimeInterval } from 'd3-axis';
import { ChartUtils } from "../chart.utils";
import { select, Selection } from "d3-selection";
import { ChartComponent } from "../chart.component";
import { Subscription } from "rxjs";

export abstract class AxisBase implements OnInit, OnChanges, OnDestroy {

    @Input() tickFormat: (value: number | Date | { valueOf(): number; }) => string
    @Input() tickCount: number | AxisTimeInterval;
    @Input() tickSizeOuter: number = 6;
    @Input() tickValues: any[];
    @Input() showGuidlines: boolean = false;
    @Input() animDuration: number = ChartUtils.ANIMATION_DURATION;
    @Input() easing: (normalizedTime: number) => number = ChartUtils.ANIMATION_EASING;
    @Input() label: string = '';

    public axis: Axis<number | Date | { valueOf(): number; }>;
    public axisSelection: Selection<SVGGElement, Array<[number, number]>, SVGElement, any>;
    public axisLabelSelection: Selection<SVGTextElement, any, HTMLElement, any>;

    private _windowResizeSub: Subscription;

    constructor(
        private _elRef: ElementRef,
        private _zone: NgZone,
        public chart: ChartComponent,
        private _chartUtils: ChartUtils) {}

    ngOnInit() {
        this.axisSelection = select(this._elRef.nativeElement as SVGGElement);

        this.createAxis();
        this.setDomain();
        this.setTicks();
        this.createLabel();
        this.render();

        this._subscribeToWindowResize();
    }

    ngOnChanges(c: SimpleChanges) {
        let isDomainChange = ChartUtils.hasInputChanged(c.domain);
        let isTickSettingsChange = ChartUtils.hasInputChanged(c.tickCount) ||
            ChartUtils.hasInputChanged(c.tickSizeOuter) ||
            ChartUtils.hasInputChanged(c.showGuidlines) ||
            ChartUtils.hasInputChanged(c.tickValues);

        if (isDomainChange || isTickSettingsChange) {
            this.setDomain();
            this.setTicks();
            this.update();
        }
    }

    createAxis(): any {
        throw new Error("Method not implemented.");
    }

    setTicks() {
        this.axis
            .ticks(this.tickCount)
            .tickFormat(this.tickFormat)
            .tickSizeOuter(this.tickSizeOuter);

        if (this.tickValues) {
            this.axis.tickValues(this.tickValues);
        }
    }

    setDomain() {
        throw new Error("Method not implemented.");
    }

    createLabel() {
        this.axisLabelSelection = this.chart.svg.append('text')
            .style('text-anchor', 'middle');
    }

    render(): any {
        throw new Error("Method not implemented.");
    }

    update() {
        /**
         * Run this outside Angular because of the transition which, in this case, uses
         * requestAnimationFrame and consequently results in up to 60 calls
         * to the change detector per second
         */
        this._zone.runOutsideAngular(() => {
            this.axisSelection
                .transition()
                .duration(this.animDuration)
                .ease(this.easing)
                .call(this.axis);
        });
    }

    get fullWidth() {
        return this.chart.width + this.chart.margins.left + this.chart.margins.right;
    }

    get fullHeight() {
        return this.chart.height + this.chart.margins.top + this.chart.margins.bottom;
    }

    private _subscribeToWindowResize() {
        this._windowResizeSub = this._chartUtils.windowResize$
            .subscribe(_ => {
                this.setDomain();
                this.setTicks();
                this.render();
            });
    }

    ngOnDestroy() {
        this._windowResizeSub.unsubscribe();
    }

}
