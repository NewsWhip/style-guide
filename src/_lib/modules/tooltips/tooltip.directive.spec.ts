import { ChangeDetectionStrategy, Component, DebugElement, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { TooltipContainerComponent } from "./tooltip-container.component";
import { TooltipModule } from ".";
import { TooltipDirective } from "./tooltip.directive";
import { Placement } from "./models/Placement.type";
import { CdkScrollable, CdkScrollableModule } from "@angular/cdk/scrolling";

let comp: WrapperComponent;
let fixture: ComponentFixture<WrapperComponent>;
let de: DebugElement;
let documentDebugElement: DebugElement;

const tickWaitMs: number = 500;

describe('TooltipDirective', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TooltipModule,
                CdkScrollableModule
            ],
            declarations: [
                WrapperComponent
            ]
        });
        fixture = TestBed.createComponent(WrapperComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        documentDebugElement = new DebugElement(document.body);
    });

    const fireEvent = (element: HTMLElement, event: string) => {
        element.dispatchEvent(new Event(event));
    };

    const getTooltipEl = (): HTMLElement =>
        documentDebugElement.query(By.directive(TooltipContainerComponent))?.query(By.css('.tooltip')).nativeElement;

    it('should apply the containerClass to the .tooltip element', fakeAsync(() => {
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        // Account for the delay of 500ms
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        expect(tooltip.classList).toContain('test-tooltip-container-class');
    }));

    it('should display an arrow', fakeAsync(() => {
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        expect(tooltip.querySelector('.tooltip-arrow')).toBeTruthy();
    }));

    it('should not display an arrow', fakeAsync(() => {
        comp.withArrow = false;
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        expect(tooltip.querySelector('.tooltip-arrow')).toBeFalsy();
    }));

    it('should open when an open event is fired', fakeAsync(() => {
        comp.openEvents = ['focus'];
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'focus');
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
    }));

    it('should close when an close event is fired', fakeAsync(() => {
        comp.closeEvents = ['dblclick'];
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        let tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
        fireEvent(trigger, 'dblclick');
        tooltip = getTooltipEl();
        expect(tooltip).toBeFalsy();
    }));

    it('should not open when an open event is fired if the tooltip is disabled', fakeAsync(() => {
        comp.isDisabled = true;
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        expect(tooltip).toBeFalsy();
    }));

    it('should be attached to the specified connectedTo element', fakeAsync(() => {
        comp.useConnectionEl = true;
        comp.autoFlip = false;
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);

        const tooltip = getTooltipEl();
        const connectionElRect = comp.connectionEl.nativeElement.getBoundingClientRect();
        const tooltipElRect = tooltip.getBoundingClientRect();
        // plus 8 for 5px arrow size and 3px manual offset
        expect(tooltipElRect.top).toEqual(connectionElRect.bottom + 8);
        const leftPos = connectionElRect.left + (connectionElRect.width / 2) - (tooltipElRect.width / 2);
        expect(Math.round(tooltipElRect.left)).toEqual(Math.round(leftPos));
    }));

    it('should close on outside click', fakeAsync(() => {
        comp.closeOnOutsideClick = true;
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        let tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
        document.body.click();
        tooltip = getTooltipEl();
        expect(tooltip).toBeFalsy();
    }));

    it('should not close on outside click', fakeAsync(() => {
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        let tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
        document.body.click();
        tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
    }));

    it('should open with a delay', fakeAsync(() => {
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(400);
        let tooltip = getTooltipEl();
        expect(tooltip).toBeFalsy();
        tick(150);
        tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
    }));

    it('should open without a delay', fakeAsync(() => {
        comp.delay = 0;
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        const tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
    }));

    it('should not open with a delay if a close event fires within the delay time', fakeAsync(() => {
        comp.delay = 1000;
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(900);
        let tooltip = getTooltipEl();
        expect(tooltip).toBeFalsy();
        fireEvent(trigger, 'click');
        tick(150);
        tooltip = getTooltipEl();
        expect(tooltip).toBeFalsy();
    }));

    it('should open even if the open events contains the same close events', fakeAsync(() => {
        fixture.detectChanges();
        const trigger = de.queryAll(By.directive(TooltipDirective))[1].nativeElement;
        fireEvent(trigger, 'click');
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
    }));

    it('should apply a placement class to the overlay pane', fakeAsync(() => {
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        fixture.detectChanges();
        const overlayPane = document.querySelector('.cdk-overlay-pane.tooltip-overlay');
        expect(overlayPane.classList).toContain('tooltip-bottom');
    }));

    it('should flip position if it does not fit in the viewport', fakeAsync(() => {
        comp.tooltipPlacement = ['left'];
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        const overlayPane = document.querySelector('.cdk-overlay-pane.tooltip-overlay');
        expect(overlayPane.classList).toContain('tooltip-right');
    }));

    it('should not flip position if it does not fit in the viewport', fakeAsync(() => {
        comp.tooltipPlacement = ['left'];
        comp.autoFlip = false;
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        const overlayPane = document.querySelector('.cdk-overlay-pane.tooltip-overlay');
        expect(overlayPane.classList).toContain('tooltip-left');
    }));

    it('should try to use the second placement position if the first does not fit', fakeAsync(() => {
        comp.tooltipPlacement = ['left', 'top-start'];
        comp.autoFlip = false;
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        const overlayPane = document.querySelector('.cdk-overlay-pane.tooltip-overlay');
        expect(overlayPane.classList).toContain('tooltip-top-start');
    }));

    it('should manually open', () => {
        comp.manualOpen = true;
        comp.delay = 0;
        fixture.detectChanges();
        const tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
    });

    it('should manually close', () => {
        comp.manualOpen = true;
        comp.delay = 0;
        fixture.detectChanges();
        let tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
        comp.manualOpen = false;
        fixture.detectChanges();
        tooltip = getTooltipEl();
        expect(tooltip).toBeFalsy();
    });

    it('tooltips should close on scroll by default', () => {
        comp.delay = 0;
        fixture.detectChanges();
        const trigger = de.query(By.directive(TooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        let tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
        comp.scrollEl.nativeElement.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        tooltip = getTooltipEl();
        expect(tooltip).toBeFalsy();
    });

    it('popovers should not close on scroll by default', fakeAsync(() => {
        comp.delay = 0;
        comp.openEvents = ['click'];
        comp.closeEvents = ['click'];
        fixture.detectChanges();
        const trigger = de.queryAll(By.directive(TooltipDirective))[1].nativeElement;
        fireEvent(trigger, 'click');
        tick(10);
        let tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
        comp.scrollEl.nativeElement.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
    }));

    it('should render a close button', fakeAsync(() => {
        comp.withClose = true;
        fixture.detectChanges();
        const trigger = de.queryAll(By.directive(TooltipDirective))[1].nativeElement;
        fireEvent(trigger, 'click');
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        const closeBtn = tooltip.querySelector('.btn-close');
        expect(closeBtn).toBeTruthy();
    }));

    it('should emit an event when the close button is clicked', fakeAsync(() => {
        comp.withClose = true;
        fixture.detectChanges();
        const trigger = de.queryAll(By.directive(TooltipDirective))[1].nativeElement;
        fireEvent(trigger, 'click');
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        const closeBtn = tooltip.querySelector('.btn-close') as HTMLElement;
        const spy = spyOn(comp, 'onCloseBtnClicked');
        closeBtn.click();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalledTimes(1);
    }));
});

@Component({
    template: `
        <div class="wrapper-el" cdkScrollable>
            <button class="btn btn-md btn-primary" #tooltip="nw-tooltip"
                [nwTooltip]="'Some tooltip text'"
                [placement]="tooltipPlacement"
                [isDisabled]="isDisabled"
                [withArrow]="withArrow"
                [withClose]="withClose"
                [delay]="delay"
                [isOpen]="manualOpen"
                [autoFlip]="autoFlip"
                [closeOnOutsideClick]="closeOnOutsideClick"
                [updatePositionOnAnimationFrame]="updatePositionOnAnimationFrame"
                [openEvents]="openEvents"
                [closeEvents]="closeEvents"
                [connectedTo]="connectedTo"
                containerClass="test-tooltip-container-class">Hover on me</button>
    
            <button class="btn btn-md btn-primary" #popover="nw-popover"
                [nwPopover]="'Some popover text'"
                [placement]="'right'"
                [isDisabled]="isDisabled"
                [withArrow]="withArrow"
                [withClose]="withClose"
                [delay]="delay"
                [isOpen]="manualOpen"
                [autoFlip]="autoFlip"
                [closeOnOutsideClick]="closeOnOutsideClick"
                [updatePositionOnAnimationFrame]="updatePositionOnAnimationFrame"
                [openEvents]="openEvents"
                [closeEvents]="closeEvents"
                [connectedTo]="connectedTo"
                (nwClose)="onCloseBtnClicked()">Button text</button>
        </div>

        <div class="connected-to-el" #connectionEl></div>
    `,
    styles: [`
        .wrapper-el {
            overflow-y: auto;
            height: 200px;
            position: relative;
        }
        .wrapper-el:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 400px;
        }
        .connected-to-el {
            position: absolute;
            width: 300px;
            height: 300px;
            top: 400px;
            left: 150px;
            display: block;
            border: 1px solid white;
            transition: width 100ms linear;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
class WrapperComponent implements OnInit {

    @ViewChild('tooltip') tooltip: TooltipDirective;
    @ViewChild('popover') popover: TooltipDirective;
    @ViewChild('connectionEl', { static: true }) connectionEl: ElementRef<HTMLElement>;
    @ViewChild(CdkScrollable, { read: ElementRef }) scrollEl: ElementRef<HTMLElement>;

    public withArrow: boolean = true;
    public withClose: boolean = false;
    public isDisabled: boolean = false;
    public openEvents: string[];
    public closeEvents: string[];
    public delay: number;
    public tooltipPlacement: Placement | Placement[] = ['bottom'];
    public autoFlip: boolean = true;
    public closeOnOutsideClick: boolean = false;
    public updatePositionOnAnimationFrame: boolean = false;
    public connectedTo: ElementRef<HTMLElement>;
    public useConnectionEl: boolean = false;
    public manualOpen: boolean;

    ngOnInit() {
        if (this.useConnectionEl) {
            this.connectedTo = this.connectionEl;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCloseBtnClicked() {}

}