import { Input, OnInit, ElementRef, OnChanges, SimpleChanges, OnDestroy, Directive } from "@angular/core";
import { Axis, AxisTimeInterval } from 'd3-axis';
import { ChartUtils } from "../chart.utils";
import { select, Selection } from "d3-selection";
import { ChartComponent } from "../chart.component";
import { Subscription } from "rxjs";

@Directive()
export abstract class AxisBase implements OnInit, OnChanges, OnDestroy {

    @Input() tickFormat: (value: number | Date | { valueOf(): number }) => string;
    @Input() tickCount: number | AxisTimeInterval;
    @Input() tickSizeOuter: number = 6;
    @Input() tickValues: any[];
    @Input() showGuidlines: boolean = false;
    @Input() animDuration: number = ChartUtils.ANIMATION_DURATION;
    @Input() easing: (normalizedTime: number) => number = ChartUtils.ANIMATION_EASING;
    @Input() label: string = '';

    public axis: Axis<number | Date | { valueOf(): number }>;
    public axisSelection: Selection<SVGGElement, Array<[number, number]>, SVGElement, any>;
    public axisLabelSelection: Selection<SVGTextElement, any, HTMLElement, any>;

    private _chartResizeSub: Subscription;

    constructor(
        private _elRef: ElementRef,
        public chart: ChartComponent,
        private _chartUtils: ChartUtils) {}

    ngOnInit() {
        this.axisSelection = select(this._elRef.nativeElement as SVGGElement);

        this.createAxis();
        this.setDomain();
        this.setTicks();
        this.createLabel();
        this.render();

        this._subscribeToChartResize();
    }

    ngOnChanges(c: SimpleChanges) {
        const isDomainChange = ChartUtils.hasInputChanged(c.domain);
        const isTickSettingsChange = ChartUtils.hasInputChanged(c.tickCount) ||
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
            .tickSizeOuter(this.tickSizeOuter)
            .tickValues(this.tickValues);
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
        this.axisSelection
            .transition()
            .duration(this.animDuration)
            .ease(this.easing)
            .call(this.axis);
    }

    get fullWidth() {
        return this.chart.width + this.chart.margins.left + this.chart.margins.right;
    }

    get fullHeight() {
        return this.chart.height + this.chart.margins.top + this.chart.margins.bottom;
    }

    private _subscribeToChartResize() {
        this._chartResizeSub = this._chartUtils.chartResize$
            .subscribe(_ => {
                this.setDomain();
                this.setTicks();
                this.render();
            });
    }

    ngOnDestroy() {
        this._chartResizeSub.unsubscribe();
    }

}
