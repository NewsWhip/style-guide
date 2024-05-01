import { Directive, Input, HostListener, OnInit, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DropdownService } from "./dropdown.service";
import { debounceTime, filter, tap } from "rxjs/operators";
import { Subscription, fromEvent } from 'rxjs';

@Directive({
    selector: '[nwDropdownToggle]',
    exportAs: 'nw-dropdown-toggle',
    host: {
        'aria-haspopup': 'true',
        '[attr.aria-expanded]': 'isOpen'
    }
})
export class DropdownToggleDirective implements OnInit, OnDestroy {

    @Input() nwTrigger: "click" | "hover" = "click";
    @Input() breakpoint: number = 767;

    public isOpen: boolean = false;

    private _isMousingOver: boolean = false;
    private _mouseEventSubscriptions: Subscription[] = [];
    private _toggleSub$: Subscription;

    constructor(
        private _service: DropdownService,
        private _elRef: ElementRef,
        private _cdRef: ChangeDetectorRef) {}

    ngOnInit() {
        this._subscribeToToggle();
        if (this.nwTrigger === 'hover') {
            const mouseEnterSub: Subscription = fromEvent(this._elRef.nativeElement as HTMLElement, 'mouseenter')
                .pipe(
                    filter(_ => !this._isMobileScreenSize()),
                    tap(_ => this._isMousingOver = true),
                    debounceTime(300),
                    filter(_ => this._isMousingOver)
                )
                .subscribe(event => this._open());

            const mouseLeaveSub: Subscription = fromEvent(this._elRef.nativeElement as HTMLElement, 'mouseleave')
                .pipe(
                    filter(_ => !this._isMobileScreenSize()),
                    tap(_ => this._isMousingOver = false),
                    debounceTime(300),
                    filter(_ => !this._isMousingOver)
                )
                .subscribe(event => this._close());

            this._mouseEventSubscriptions = [mouseEnterSub, mouseLeaveSub];
        }
    }

    private _isMobileScreenSize() {
        return window.innerWidth < this.breakpoint;
    }

    private _subscribeToToggle() {
        this._toggleSub$ = this._service.toggle$.subscribe(isOpen => {
            this.isOpen = isOpen;
        });
    }

    private _open() {
        this._isMousingOver = true;
        this._service.open();
        this._cdRef.detectChanges();
    }

    private _close() {
        this._isMousingOver = false;
        this._service.close();
        this._cdRef.detectChanges();
    }

    @HostListener('click', ['$event'])
    toggle(event: MouseEvent) {
        this._service.toggle();
        if (this.nwTrigger === 'hover') {
            event.stopImmediatePropagation();
        }
    }

    ngOnDestroy() {
        this._mouseEventSubscriptions.forEach(mes => mes.unsubscribe());
        this._toggleSub$.unsubscribe();
    }

}
