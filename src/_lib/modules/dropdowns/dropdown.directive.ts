import { Directive, Input, HostBinding, OnDestroy, OnInit, OnChanges, SimpleChanges, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
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

    constructor(
        private _service: DropdownService,
        private _elRef: ElementRef) {}

    ngOnInit() {
        this._service.autoClose = this.autoClose;
        this._subscribeToToggle();
    }

    ngOnChanges(changes: SimpleChanges) {
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

    @HostListener('document:click', ['$event'])
    private _onBlur(event: MouseEvent): void {
        const isEventSourceInside = this._service
            .isHTMLElementContainedIn(event.target as HTMLElement, [this._elRef.nativeElement as HTMLElement]);

        if (!isEventSourceInside && (this.autoClose === true || this.autoClose === 'outside')) {
            this._service.close();
        }
    }

    // Regardless of the value of autoClose, always close on escape
    @HostListener('document:keydown.escape', ['$event'])
    private _closeOnEscape(event: KeyboardEvent) {
        this._service.close();
    }

    ngOnDestroy() {
        this._toggleSubscription.unsubscribe();
    }

}
