import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy } from '@angular/core';
import { select, Selection, pointer } from 'd3-selection';
import { ChartUtils } from './chart.utils';
import { fromEvent, Subject, merge } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'svg[nw-chart]',
    template: `
        <svg:g #chartContainer
            nwResizeObserver
            [element]="parentElement"
            (nwResize)="onChartDimensionsChange()">
            <!-- Keep axes outside the main rendering container so
            that we only get mouse events from graphical elements -->
            <ng-content select="[nw-x-axis],[nw-y-axis]"></ng-content>
            <svg:g #mouseEventCaptureContainer class="mouse-event-capture-container">
                <ng-content select=".nw-slot-1"></ng-content>
                <svg:rect #hoverOverlay (click)="onBackgroundClick()"></svg:rect>
                <ng-content select=".nw-slot-2"></ng-content>
                <ng-content></ng-content>
            </svg:g>
        </svg:g>
    `,
    providers: [ChartUtils],
    exportAs: 'nw-chart',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input('width') w: number;
    @Input('height') h: number;
    @Input() margins: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } = { top: 0, bottom: 0, left: 0, right: 0 };
    @Input() scaleOnResize: boolean = true;

    @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef<SVGGElement>;
    @ViewChild('mouseEventCaptureContainer', { static: true }) mouseEventCaptureContainer: ElementRef<SVGGElement>;
    @ViewChild('hoverOverlay', { static: true }) hoverOverlay: ElementRef<SVGRectElement>;

    @Output() nwMousemove: EventEmitter<[number, number]> = new EventEmitter();
    @Output() nwMouseleave: EventEmitter<null> = new EventEmitter();
    @Output() bgClick: EventEmitter<null> = new EventEmitter();

    public svg: Selection<SVGSVGElement, any, HTMLElement, any>;
    public parentElement: HTMLElement;

    private _destroyed$: Subject<void> = new Subject();
    private _chartDimensionsChange$: Subject<void> = new Subject();

    constructor(
        private _elRef: ElementRef<SVGSVGElement>,
        public chartUtils: ChartUtils) {}

    ngOnInit() {
        this.parentElement = this._elRef.nativeElement.parentElement;

        this.setSvg();
        this.setHoverOverlay();
        if (this.scaleOnResize) {
            this.subscribeToChartResize();
        }
    }

    ngAfterViewInit() {
        this.appendContainer();
    }

    get width(): number {
        return (this.w || this._elRef.nativeElement.getBoundingClientRect().width) - this.margins.left - this.margins.right;
    }

    get height(): number {
        return (this.h || this._elRef.nativeElement.getBoundingClientRect().height) - this.margins.top - this.margins.bottom;
    }

    setSvg(): void {
        this.svg = select(this._elRef.nativeElement)
            .attr("width", this.width + this.margins.left + this.margins.right)
            .attr("height", this.height + this.margins.top + this.margins.bottom);
    }

    appendContainer(): void {
        select(this.chartContainer.nativeElement)
            .attr("transform", "translate(" + this.margins.left + "," + this.margins.top + ")");
    }

    setHoverOverlay() {
        const self = this;

        // This full height / width rect ensures that all mouse events will
        // be captured and delegated to the parent mouseEventCaptureContainer
        select(this.hoverOverlay.nativeElement)
            .attr("width", this.width)
            .attr("height", this.height)
            .style('fill', 'none')
            .style('pointer-events', 'all');

        select(this.mouseEventCaptureContainer.nativeElement)
            .style('pointer-events', 'all')
            .on('mouseleave', () => this.nwMouseleave.emit())
            .on('mousemove', e => {
                // emits the current mouse position
                self.nwMousemove.emit(pointer(e));
            });
    }

    onBackgroundClick() {
        this.bgClick.emit();
    }

    /**
     * As well charts being resized due to the window being resized, another scenario is that
     * the parent element is squeezed or stretched in a reponsive design due to the appearance
     * or disappearance of other elements. For this we use our nwResizeObserver which utilizes
     * ResizeObserver under the hood.
     */
    subscribeToChartResize() {
        const windowResize$ = fromEvent(window, 'resize');

        merge(windowResize$, this._chartDimensionsChange$)
            .pipe(
                debounceTime(100),
                takeUntil(this._destroyed$)
            )
            .subscribe(_ => this.chartUtils.notifyChartResize());
    }

    onChartDimensionsChange() {
        this._chartDimensionsChange$.next();
    }

    ngOnDestroy() {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
