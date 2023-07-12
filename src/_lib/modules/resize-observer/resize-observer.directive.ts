import { Directive, Output, EventEmitter, ElementRef, OnInit, OnDestroy, Input } from "@angular/core";
import { Subject } from "rxjs";
import { skip, debounceTime, takeUntil, tap } from "rxjs/operators";

@Directive({
    selector: '[nwResizeObserver]',
    exportAs: 'nwResizeObserver',
    standalone: true
})
export class ResizeObserverDirective implements OnInit, OnDestroy {

    /**
     * Optional element to listen to the resize event for. If not
     * provided defaults to the element the directive is attached to
     */
    @Input() element?: HTMLElement;
    /**
     * A pixel value specifying the minimum change in height or width that triggers the resize event
     */
    @Input() tolerance: number = 0;

    @Output() nwResize: EventEmitter<null> = new EventEmitter();

    private _observer: ResizeObserver;
    private _nwResize: Subject<ResizeObserverEntry> = new Subject();
    private _destroyed$: Subject<null> = new Subject();
    private _currentElementRect: DOMRectReadOnly;

    constructor(_elRef: ElementRef<HTMLElement>) {
        this.element = this.element || _elRef.nativeElement;
    }

    ngOnInit() {
        this.subscribeToResize();

        if (ResizeObserver) {
            this.createObserver();
        }
    }

    subscribeToResize() {
        /**
         * Rather than call this.nwResize.emit() immediately after being notified
         * of the resize event, we use this._nwResize as a proxy to filter events we
         * don't want and to debounce as we don't want to emit hundreds of events
         * if, for example, the width or height of the element is being animated
         */
        this._nwResize.asObservable().pipe(
            /**
             * Store the contentRect of the element so that we can compare changes
             */
            tap(entry => this._currentElementRect = entry.contentRect),
            /**
             * use skip(1) because an event is emitting immediately
             * after calling .observe on the observer
             */
            skip(1),
            debounceTime(50),
            takeUntil(this._destroyed$)
        ).subscribe(res => this.nwResize.emit());
    }

    createObserver() {
        this._observer = new ResizeObserver(([element]) => {
            const widthChange = Math.abs(element.contentRect.width - (this._currentElementRect?.width ?? 0));
            const heightChange = Math.abs(element.contentRect.height - (this._currentElementRect?.height ?? 0));

            if ((widthChange >= this.tolerance) || (heightChange >= this.tolerance)) {
                this._nwResize.next(element);
            }
        });
        this._observer.observe(this.element);
    }

    ngOnDestroy() {
        if (ResizeObserver && this._observer) {
            this._observer.unobserve(this.element);
        }
        this._destroyed$.next();
        this._destroyed$.complete();
    }

}
