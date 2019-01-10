import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, HostBinding, HostListener, OnDestroy, Output, EventEmitter } from '@angular/core';
import { select, Selection, mouse } from 'd3-selection';
import { ChartUtils } from './chart.utils';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'svg[nw-chart]',
    template: `
        <svg:g #chartContainer>
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

            <svg:rect #hoverOverlay></svg:rect>
            <ng-content></ng-content>
        </svg:g>
    `,
    providers: [ChartUtils],
    exportAs: 'nw-chart',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() width: number = (this._elRef.nativeElement as SVGSVGElement).clientWidth;
    @Input() height: number = (this._elRef.nativeElement as SVGSVGElement).clientHeight;
    @Input() margins: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } = { top: 0, bottom: 0, left: 0, right: 0 };

    @ViewChild('chartContainer') chartContainer: ElementRef;
    @ViewChild('hoverOverlay') hoverOverlay: ElementRef;

    @Output() nwMousemove: EventEmitter<[number, number]> = new EventEmitter();
    @Output() nwMouseout: EventEmitter<null> = new EventEmitter();

    public svg: Selection<SVGSVGElement, any, HTMLElement, any>;

    private _windowResize$ = new Subject();
    private _windowResizeSub: Subscription;

    constructor(
        private _elRef: ElementRef,
        public chart: ChartUtils) {}

    ngOnInit() {
        this.setDimensions();
        this.setSvg();
        this.setHoverOverlay();

        this.subscribeToWindowResize();
    }

    ngAfterViewInit() {
        this.appendContainer();
    }

    setDimensions(): void {
        // TODO: check if this is correct. Right now the SVG elements that is drawn is larger than what is defined by the inputs
        this.width = this.width || (this._elRef.nativeElement as SVGSVGElement).clientWidth - this.margins.left - this.margins.right;
        this.height = this.height || (this._elRef.nativeElement as SVGSVGElement).clientHeight - this.margins.top - this.margins.bottom;
        this.setViewBox();
    }

    setViewBox() {
        this.viewBox = `
            0
            0
            ${this.width + this.margins.left + this.margins.right}
            ${this.height + this.margins.top + this.margins.bottom}
        `;
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

        select(this.hoverOverlay.nativeElement as SVGRectElement)
            .attr("width", this.width)
            .attr("height", this.height)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .on('mouseout', () => this.nwMouseout.emit())
            .on('mousemove', function() {
                // emits the current mouse position
                self.nwMousemove.emit(mouse(this))
            });
    }

    @HostBinding('attr.viewBox') viewBox: string;

    @HostListener('window:resize', ['$event.target'])
    public onResize(window: Window) {
        this._windowResize$.next(window.innerWidth);
    }

    subscribeToWindowResize() {
        this._windowResizeSub = this._windowResize$.asObservable()
            .pipe(debounceTime(500))
            .subscribe(_ => {
                this.setViewBox();
            });
    }

    ngOnDestroy() {
        this._windowResizeSub.unsubscribe();
    }

}
