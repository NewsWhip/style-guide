import { Overlay } from "@angular/cdk/overlay";
import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TooltipModule } from ".";
import { TooltipDirective } from "./tooltip.directive";

let comp: WrapperComponent;
let fixture: ComponentFixture<WrapperComponent>;

describe('TooltipDirective', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TooltipModule
            ],
            declarations: [
                WrapperComponent
            ],
            providers: [
                Overlay
            ]
        });
        fixture = TestBed.createComponent(WrapperComponent);
        comp = fixture.componentInstance;
    });

    it('should apply the containerClass to the .tooltip element', () => {
        fixture.detectChanges();
    });
    
    it('should display an arrow', () => {
        fixture.detectChanges();
    });
    
    it('should not display an arrow', () => {
        fixture.detectChanges();
    });

    it('should open when an open event is fired', () => {
        fixture.detectChanges();
    });

    it('should close when an close event is fired', () => {
        fixture.detectChanges();
    });

    it('should not open when an open event is fired if the tooltip is disabled', () => {
        fixture.detectChanges();
    });

    it('should be attached to the specified connectedTo element', () => {
        fixture.detectChanges();
    });

    it('should close on outside click', () => {
        fixture.detectChanges();
    });

    it('should not close on outside click', () => {
        fixture.detectChanges();
    });

    it('should open with a delay', () => {
        fixture.detectChanges();
    });

    it('should open without a delay', () => {
        fixture.detectChanges();
    });

    describe('tooltips', () => {

    });

    describe('popovers', () => {
        
    });
});

@Component({
    template: `
        <div class="wrapper-el">
            <button class="btn btn-md btn-primary" #tooltip="nw-tooltip"
                [nwTooltip]="'Some tooltip text'"
                [placement]="'bottom'">Hover on me</button>
    
            <button class="btn btn-md btn-primary" #popover="nw-popover"
                [nwPopover]="'Some popover text'"
                [placement]="'right'">Button text</button>
        </div>
    `
})
class WrapperComponent {

    @ViewChild('tooltip') tooltip: TooltipDirective;
    @ViewChild('popover') popover: TooltipDirective;

}