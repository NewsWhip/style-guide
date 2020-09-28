import { Directive, Output, EventEmitter, ElementRef, OnInit, OnDestroy, Input } from "@angular/core";
import { Subject } from "rxjs";
import { skip, debounceTime, takeUntil } from "rxjs/operators";

@Directive({
    selector: '[nwResizeObserver]',
    exportAs: 'nwResizeObserver'
})
export class ResizeObserverDirective implements OnInit, OnDestroy {

    /**
     * Optional element to listen to the resize event for. If not
     * provided defaults to the element the directive is attached to
     */
    @Input() element?: HTMLElement;

    @Output() nwResize: EventEmitter<null> = new EventEmitter();

    private _observer: ResizeObserver;
    private _window: Window = window;
    private _nwResize: Subject<null> = new Subject();
    private _destroyed$: Subject<null> = new Subject();

    constructor(_elRef: ElementRef<HTMLElement>) {
        this.element = this.element || _elRef.nativeElement;
    }

    ngOnInit() {
        this.subscribeToResize();

        if (this._window.ResizeObserver) {
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
             * use skip(1) because an event is emitting immediately
             * after call .observe on the observer
             */
            skip(1),
            debounceTime(50),
            takeUntil(this._destroyed$)
        )
        .subscribe(res => this.nwResize.emit());
    }

    createObserver() {
        this._observer = new ResizeObserver(_entries => this._nwResize.next());
        this._observer.observe(this.element);
    }

    ngOnDestroy() {
        if (this._window.ResizeObserver && this._observer) {
            this._observer.unobserve(this.element);
        }
        this._destroyed$.next();
        this._destroyed$.complete();
    }

}
