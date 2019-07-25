import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { select, Selection, mouse } from 'd3-selection';
import { ChartUtils } from './chart.utils';

@Component({
    selector: 'svg[nw-chart]',
    template: `
        <svg:g #chartContainer>
            <!-- Keep axes outside the main rendering container so
            that we only get mouse events from graphical elements -->
            <ng-content select="[nw-x-axis],[nw-y-axis]"></ng-content>
            <svg:g #mouseEventCaptureContainer class="mouse-event-capture-container">
                <ng-content select=".nw-slot-1"></ng-content>
                <ng-content select=".nw-slot-2"></ng-content>
                <ng-content select=".nw-slot-3"></ng-content>
                <ng-content select=".nw-slot-4"></ng-content>
                <ng-content select=".nw-slot-5"></ng-content>
                <ng-content select=".nw-slot-6"></ng-content>
                <ng-content select=".nw-slot-7"></ng-content>
                <ng-content select=".nw-slot-8"></ng-content>
                <ng-content select=".nw-slot-9"></ng-content>
                <ng-content select=".nw-slot-10"></ng-content>

                <svg:rect #hoverOverlay (click)="onBackgroundClick()"></svg:rect>
                <ng-content></ng-content>
            </svg:g>
        </svg:g>
    `,
    providers: [ChartUtils],
    exportAs: 'nw-chart',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, AfterViewInit {

    @Input('width') w: number;
    @Input('height') h: number;
    @Input() margins: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } = { top: 0, bottom: 0, left: 0, right: 0 };

    @ViewChild('chartContainer') chartContainer: ElementRef;
    @ViewChild('mouseEventCaptureContainer') mouseEventCaptureContainer: ElementRef;
    @ViewChild('hoverOverlay') hoverOverlay: ElementRef;

    @Output() nwMousemove: EventEmitter<[number, number]> = new EventEmitter();
    @Output() nwMouseleave: EventEmitter<null> = new EventEmitter();
    @Output() bgClick: EventEmitter<null> = new EventEmitter();

    public svg: Selection<SVGSVGElement, any, HTMLElement, any>;

    constructor(
        private _elRef: ElementRef,
        public chartUtils: ChartUtils) {}

    ngOnInit() {
        this.setSvg();
        this.setHoverOverlay();
    }

    ngAfterViewInit() {
        this.appendContainer();
    }

    get width(): number {
        return (this.w || (this._elRef.nativeElement as SVGSVGElement).getBoundingClientRect().width) - this.margins.left - this.margins.right;
    }

    get height(): number {
        return (this.h || (this._elRef.nativeElement as SVGSVGElement).getBoundingClientRect().height) - this.margins.top - this.margins.bottom;
    }

    setSvg(): void {
        this.svg = select(this._elRef.nativeElement as SVGSVGElement)
            .attr("width", this.width + this.margins.left + this.margins.right)
            .attr("height", this.height + this.margins.top + this.margins.bottom);
    }

    appendContainer(): void {
        select(this.chartContainer.nativeElement as SVGGElement)
            .attr("transform", "translate(" + this.margins.left + "," + this.margins.top + ")");
    }

    setHoverOverlay() {
        const self = this;

        // This full height / width rect ensures that all mouse events will
        // be captured and delegated to the parent mouseEventCaptureContainer
        select(this.hoverOverlay.nativeElement as SVGRectElement)
            .attr("width", this.width)
            .attr("height", this.height)
            .style('fill', 'none')
            .style('pointer-events', 'all');

        select(this.mouseEventCaptureContainer.nativeElement as SVGGElement)
            .style('pointer-events', 'all')
            .on('mouseleave', () => this.nwMouseleave.emit())
            .on('mousemove', function() {
                // emits the current mouse position
                self.nwMousemove.emit(mouse(this))
            });
    }

    onBackgroundClick() {
        this.bgClick.emit();
    }
}
