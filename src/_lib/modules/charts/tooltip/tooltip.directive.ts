import {Directive, ElementRef, Input, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
    selector: '[nwChartTooltip]'
})
export class TooltipDirective {
    @Input() position: [number, number];

    constructor(private _elRef: ElementRef,
                private _renderer: Renderer2) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.position && changes.position.previousValue !== changes.position.currentValue) {
            this._renderer.setStyle(
                this._elRef.nativeElement, 'transform',
                `translate(calc(50% + ${changes.position.currentValue[0]}px), calc(50% + ${changes.position.currentValue[1]}px))`);
            // this._elRef.nativeElement.style.transform = `translate(${changes.position[0]}px, ${changes.position[1]}px)`;
            // console.log(changes.position)
        }
    }
}
