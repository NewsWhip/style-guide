import { Directive, Input, HostBinding, OnDestroy, OnInit, OnChanges, SimpleChanges, ElementRef, Output, EventEmitter, NgZone, Renderer2, ChangeDetectorRef } from '@angular/core';
import { DropdownService } from "./dropdown.service";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Directive({
    selector: '[nwDropdown]',
    exportAs: 'nw-dropdown',
    providers: [DropdownService]
})
export class DropdownDirective implements OnInit, OnChanges, OnDestroy {
    @Input() autoClose: boolean | "inside" | "outside" = true;

    @Output() opened: EventEmitter<null> = new EventEmitter();
    @Output() closed: EventEmitter<null> = new EventEmitter();

    @HostBinding('class.open') isOpen: boolean;

    private _toggleSubscription: Subscription;
    private _documentUnlistener: Function;
    private _escapeUnlistener: Function;

    constructor(
        private _service: DropdownService,
        private _elRef: ElementRef,
        private _zone: NgZone,
        private _renderer: Renderer2,
        private _cdRef: ChangeDetectorRef) { }

    ngOnInit() {
        this._service.autoClose = this.autoClose;
        this._subscribeToToggle();

        // For performance reasons, bind to document click outside the zone
        this._zone.runOutsideAngular(() => {
            // Store a reference to the "unlisten" functions returned from these methods
            // https://angular.io/api/core/Renderer2#listen
            this._documentUnlistener = this._renderer.listen('document', 'click', this.onDocumentClick.bind(this));
            this._escapeUnlistener = this._renderer.listen('document', 'keydown.escape', this.onEscape.bind(this));
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        // autoClose is essentially an optional input. What this means is that if you don't pass a
        // value to the `autoClose` input the "if" check below will never evaluate to true. This
        // is why we don't just rely on ngOnChanges to set the value in the service, we also use
        // ngOnInit to set the initial value, with subsequent input changes handled below
        if (changes.autoClose && !changes.autoClose.firstChange) {
            this._service.autoClose = this.autoClose;
        }
    }

    open(): void {
        this._service.open();
    }

    close(): void {
        this._service.close();
    }

    private _subscribeToToggle(): void {
        this._toggleSubscription = this._service.toggle$.subscribe(isOpen => {
            this.isOpen = isOpen;

            this.isOpen ? this.opened.emit() : this.closed.emit();
        });
    }

    onDocumentClick(event: MouseEvent): void {
        const isEventSourceInside = this._service
            .isHTMLElementContainedIn(event.target as HTMLElement, [this._elRef.nativeElement as HTMLElement]);

        if (!isEventSourceInside && (this.autoClose === true || this.autoClose === 'outside') && this.isOpen) {
            this._zone.run(() => {
                this._service.close();
                this._cdRef.detectChanges();
            });
        }
    }

    onEscape(event: KeyboardEvent) {
        if (this.isOpen) {
            this._zone.run(() => {
                this._service.close();
                this._cdRef.detectChanges();
            });
        }
    }

    ngOnDestroy() {
        this._toggleSubscription.unsubscribe();

        if (this._documentUnlistener) {
            this._zone.runOutsideAngular(() => this._documentUnlistener());
        }

        if (this._escapeUnlistener) {
            this._zone.runOutsideAngular(() => this._escapeUnlistener());
        }
    }

}
