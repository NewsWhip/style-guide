import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
    selector: '[appTabDirective]'
})
export class TabsDirective {
    public active: boolean;
    @HostBinding('class') elmClass: string;

    constructor() {}
    @HostListener('click') click() {
        this.elmClass = 'active';
    }
}
