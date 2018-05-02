import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[nwTab]'
})
export class TabDirective {
    @HostBinding('class.active') @Input() isActive: boolean = false;

    constructor(public elRef: ElementRef) {}
}
