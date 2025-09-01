import { Directive, OnInit, ElementRef } from "@angular/core";

@Directive({
    selector: '[nwAutofocus]',
    exportAs: 'nw-autofocus',
    standalone: false
})
export class AutoFocusDirective implements OnInit {

    constructor(private _elRef: ElementRef<HTMLElement>) {}

    ngOnInit() {
        this._elRef.nativeElement.focus();
    }

}
