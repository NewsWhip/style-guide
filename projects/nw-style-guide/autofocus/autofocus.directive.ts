import { Directive, OnInit, ElementRef, inject } from "@angular/core";

@Directive({
    selector: '[nwAutofocus]',
    exportAs: 'nw-autofocus'
})
export class AutoFocusDirective implements OnInit {
    private _elRef = inject<ElementRef<HTMLElement>>(ElementRef);


    ngOnInit() {
        this._elRef.nativeElement.focus();
    }

}
