import { Directive, Input, HostBinding, OnDestroy, OnInit, OnChanges, SimpleChanges, ElementRef, Output, EventEmitter, NgZone, Renderer2, ChangeDetectorRef } from '@angular/core';
import { DropdownService } from "./dropdown.service";
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
    selector: '[nwDropdown]',
    exportAs: 'nw-dropdown',
    providers: [DropdownService],
    standalone: false
})
export class DropdownDirective implements OnInit, OnChanges, OnDestroy {

    @Input() autoClose: boolean | "inside" | "outside" = true;
    @Input() elementsToIgnore: HTMLElement[] = [];
    @Input() selectorsToIgnore: string[] = [];
    @HostBinding('class.disabled')
    @Input() disabled: boolean = false;

    @Output() opened: EventEmitter<null> = new EventEmitter();
    @Output() closed: EventEmitter<null> = new EventEmitter();

    @HostBinding('class.open') isOpen: boolean;

    private _toggleSubscription: Subscription;
    private _documentUnlistener: () => void;
    private _escapeUnlistener: () => void;

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
        this._toggleSubscription = this._service.toggle$
            /**
             * If the dropdown is disabled, only allow close events through
             */
            .pipe(
                filter(isOpen => {
                    if (this.disabled) {
                        return !isOpen;
                    }
                    return true;
                })
            )
            .subscribe(isOpen => {
                this.isOpen = isOpen;

                if (this.isOpen) {
                    this.opened.emit();
                } else {
                    this.closed.emit();
                }
            });
    }

    onDocumentClick(event: MouseEvent) {
        const shouldClose = (this.autoClose === true || this.autoClose === 'outside') && this.isOpen;

        // Don't bother evaluating the source of the event if `shouldClose` is false
        if (shouldClose) {
            const target: HTMLElement = event.target as HTMLElement;
            const containers: HTMLElement[] = [this._elRef.nativeElement as HTMLElement].concat(this.elementsToIgnore);
            const isEventSourceFromWithinDropdown = this._service.isHTMLElementContainedIn(target, containers) && !target.classList.contains('dropdown-backdrop');
            const isEventSourceFromWithinSelectors = this.selectorsToIgnore.length ?
                this._service.isHTMLElementInPath(event, this.selectorsToIgnore) :
                false;

            if (!isEventSourceFromWithinDropdown && !isEventSourceFromWithinSelectors) {
                this._zone.run(() => {
                    this._service.close();
                    this._cdRef.detectChanges();
                });
            }
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
