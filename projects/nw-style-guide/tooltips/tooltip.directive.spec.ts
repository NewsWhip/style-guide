import { Component, DebugElement, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TooltipContainerComponent } from './tooltip-container.component';
import { NwTooltipDirective } from './tooltip.directive';
import { NwPopoverDirective } from './popover.directive';
import { Placement } from './models/Placement.type';
import { CdkScrollable, CdkScrollableModule } from '@angular/cdk/scrolling';
import { FocusMonitor } from '@angular/cdk/a11y';

let comp: WrapperComponent;
let fixture: ComponentFixture<WrapperComponent>;
let de: DebugElement;
let documentDebugElement: DebugElement;

const tickWaitMs: number = 500;

describe('callouts', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CdkScrollableModule, WrapperComponent]
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
        comp.openEvents = ['mouseenter'];
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        // Account for the delay of 500ms
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        expect(tooltip.classList).toContain('test-tooltip-container-class');
    }));

    it('should display an arrow', fakeAsync(() => {
        comp.openEvents = ['mouseenter'];
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        expect(tooltip.querySelector('.tooltip-arrow')).toBeTruthy();
    }));

    it('should not display an arrow', fakeAsync(() => {
        comp.openEvents = ['mouseenter'];
        comp.withArrow = false;
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        expect(tooltip.querySelector('.tooltip-arrow')).toBeFalsy();
    }));

    it('should open when an open event is fired', fakeAsync(() => {
        comp.openEvents = ['focus'];
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'focus');
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
    }));

    it('should close when an close event is fired', fakeAsync(() => {
        comp.openEvents = ['mouseenter'];
        comp.closeEvents = ['dblclick'];
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        let tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
        fireEvent(trigger, 'dblclick');
        tooltip = getTooltipEl();
        expect(tooltip).toBeFalsy();
    }));

    it('should not open when an open event is fired if the tooltip is disabled', fakeAsync(() => {
        comp.openEvents = ['mouseenter'];
        comp.isDisabled = true;
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        expect(tooltip).toBeFalsy();
    }));

    it('should be attached to the specified connectedTo element', fakeAsync(() => {
        comp.openEvents = ['mouseenter'];
        comp.useConnectionEl = true;
        comp.autoFlip = false;
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);

        const tooltip = getTooltipEl();
        const connectionElRect = comp.connectionEl.nativeElement.getBoundingClientRect();
        const tooltipElRect = tooltip.getBoundingClientRect();
        // plus 8 for 5px arrow size and 3px manual offset
        expect(tooltipElRect.top).toEqual(connectionElRect.bottom + 8);
        const leftPos = connectionElRect.left + connectionElRect.width / 2 - tooltipElRect.width / 2;
        expect(Math.round(tooltipElRect.left)).toEqual(Math.round(leftPos));
    }));

    it('should close on outside click', fakeAsync(() => {
        comp.openEvents = ['mouseenter'];
        comp.closeOnOutsideClick = true;
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwPopoverDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        let tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
        document.body.click();
        tooltip = getTooltipEl();
        expect(tooltip).toBeFalsy();
    }));

    it('should not close on outside click', fakeAsync(() => {
        window.innerWidth = 1000;
        comp.openEvents = ['mouseenter'];
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwPopoverDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        let tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
        fireEvent(document.body, 'click');
        tick(5);
        tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
    }));

    it('should open with a delay', fakeAsync(() => {
        comp.delay = 500;
        comp.openEvents = ['mouseenter'];
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(400);
        let tooltip = getTooltipEl();
        expect(tooltip).toBeFalsy();
        tick(150);
        tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
    }));

    it('should open without a delay', fakeAsync(() => {
        comp.openEvents = ['mouseenter'];
        comp.delay = 0;
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        const tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
    }));

    it('should not open with a delay if a close event fires within the delay time', fakeAsync(() => {
        comp.openEvents = ['mouseenter'];
        comp.closeEvents = ['click'];
        comp.delay = 1000;
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
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
        const trigger = de.query(By.directive(NwPopoverDirective)).nativeElement;
        fireEvent(trigger, 'click');
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
    }));

    it('should apply a placement class to the overlay pane', fakeAsync(() => {
        comp.openEvents = ['mouseenter'];
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        fixture.detectChanges();
        const overlayPane = document.querySelector('.cdk-overlay-pane.tooltip-overlay');
        expect(overlayPane.classList).toContain('tooltip-bottom');
    }));

    it('should reposition when the placement changes while open', fakeAsync(() => {
        comp.openEvents = ['mouseenter'];
        comp.delay = 0;
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(5);
        fixture.detectChanges();
        expect(document.querySelector('.cdk-overlay-pane.tooltip-overlay').classList).toContain('tooltip-bottom');

        comp.tooltipPlacement = ['top-start'];
        fixture.detectChanges();
        tick(5);
        expect(document.querySelector('.cdk-overlay-pane.tooltip-overlay').classList).toContain('tooltip-top-start');
    }));

    it('should flip position if it does not fit in the viewport', fakeAsync(() => {
        comp.openEvents = ['mouseenter'];
        comp.tooltipPlacement = ['left'];
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        const overlayPane = document.querySelector('.cdk-overlay-pane.tooltip-overlay');
        expect(overlayPane.classList).toContain('tooltip-right');
    }));

    it('should not flip position if it does not fit in the viewport', fakeAsync(() => {
        comp.openEvents = ['mouseenter'];
        comp.tooltipPlacement = ['left'];
        comp.autoFlip = false;
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        const overlayPane = document.querySelector('.cdk-overlay-pane.tooltip-overlay');
        expect(overlayPane.classList).toContain('tooltip-left');
    }));

    it('should try to use the second placement position if the first does not fit', fakeAsync(() => {
        comp.openEvents = ['mouseenter'];
        comp.tooltipPlacement = ['left', 'top-start'];
        comp.autoFlip = false;
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(tickWaitMs);
        const overlayPane = document.querySelector('.cdk-overlay-pane.tooltip-overlay');
        expect(overlayPane.classList).toContain('tooltip-top-start');
    }));

    it('should manually open', fakeAsync(() => {
        comp.manualOpen = true;
        comp.delay = 0;
        fixture.detectChanges();
        tick(5);
        const tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
    }));

    it('should manually close', fakeAsync(() => {
        comp.manualOpen = true;
        comp.delay = 0;
        fixture.detectChanges();
        tick(5);
        let tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
        comp.manualOpen = false;
        fixture.detectChanges();
        tick(5);
        tooltip = getTooltipEl();
        expect(tooltip).toBeFalsy();
    }));

    it('tooltips should close on scroll by default', fakeAsync(() => {
        window.innerWidth = 1000;
        comp.openEvents = ['mouseenter'];
        comp.delay = 0;
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(5);
        let tooltip = getTooltipEl();
        expect(tooltip).toBeTruthy();
        comp.scrollEl.nativeElement.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        tick(5);
        tooltip = getTooltipEl();
        expect(tooltip).toBeFalsy();
    }));

    it('should apply the new scroll strategy when closeOnScroll changes while open', fakeAsync(() => {
        window.innerWidth = 1000;
        comp.openEvents = ['mouseenter'];
        comp.delay = 0;
        comp.closeOnScroll = false;
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwTooltipDirective)).nativeElement;
        fireEvent(trigger, 'mouseenter');
        tick(5);
        comp.scrollEl.nativeElement.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        tick(5);
        expect(getTooltipEl()).toBeTruthy();

        comp.closeOnScroll = true;
        fixture.detectChanges();
        tick(5);
        comp.scrollEl.nativeElement.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        tick(5);
        expect(getTooltipEl()).toBeFalsy();
    }));

    it('popovers should not close on scroll by default', fakeAsync(() => {
        comp.delay = 0;
        comp.openEvents = ['click'];
        comp.closeEvents = ['click'];
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwPopoverDirective)).nativeElement;
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
        const trigger = de.query(By.directive(NwPopoverDirective)).nativeElement;
        fireEvent(trigger, 'click');
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        const closeBtn = tooltip.querySelector('.btn-close');
        expect(closeBtn).toBeTruthy();
    }));

    it('should emit an event when the close button is clicked', fakeAsync(() => {
        comp.withClose = true;
        fixture.detectChanges();
        const trigger = de.query(By.directive(NwPopoverDirective)).nativeElement;
        fireEvent(trigger, 'click');
        tick(tickWaitMs);
        const tooltip = getTooltipEl();
        const closeBtn = tooltip.querySelector('.btn-close') as HTMLElement;
        const spy = spyOn(comp, 'onCloseBtnClicked');
        closeBtn.click();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalledTimes(1);
    }));

    /**
     * A tooltip is a description of its host: it is exposed through the host's `aria-describedby`, it never holds
     * anything focusable, and it never moves focus
     */
    describe('nwTooltip', () => {
        const getStringTrigger = (): HTMLElement => de.query(By.directive(NwTooltipDirective)).nativeElement;
        const getTemplateTrigger = (): HTMLElement => de.queryAll(By.directive(NwTooltipDirective))[1].nativeElement;

        it('should render the panel with a role of tooltip and an id', fakeAsync(() => {
            comp.openEvents = ['mouseenter'];
            fixture.detectChanges();
            fireEvent(getStringTrigger(), 'mouseenter');
            tick(tickWaitMs);
            const panel = getTooltipEl();
            expect(panel.getAttribute('role')).toBe('tooltip');
            expect(panel.id).toMatch(/^nw-callout-\d+$/);
        }));

        it('should describe the host with string content, without being opened', () => {
            fixture.detectChanges();
            const descriptionId = getStringTrigger().getAttribute('aria-describedby');
            expect(descriptionId).toBeTruthy();
            expect(document.getElementById(descriptionId).textContent).toBe('Some tooltip text');
        });

        it('should not describe the host when withAriaDescription is false', () => {
            comp.withAriaDescription = false;
            fixture.detectChanges();
            expect(getStringTrigger().hasAttribute('aria-describedby')).toBe(false);
        });

        it('should not describe the host when its aria-label is the same text', () => {
            comp.hostAriaLabel = 'Some tooltip text';
            fixture.detectChanges();
            expect(getStringTrigger().hasAttribute('aria-describedby')).toBe(false);
        });

        it('should describe the host when its aria-label is different text', () => {
            comp.hostAriaLabel = 'A different label';
            fixture.detectChanges();
            const descriptionId = getStringTrigger().getAttribute('aria-describedby');
            expect(document.getElementById(descriptionId).textContent).toBe('Some tooltip text');
        });

        it('should not describe the host when its visible text is the same text', () => {
            comp.tooltipContent = 'Hover on me';
            fixture.detectChanges();
            expect(getStringTrigger().hasAttribute('aria-describedby')).toBe(false);
        });

        it('should describe the host when withAriaDescription is true, even where its text is the same', () => {
            comp.withAriaDescription = true;
            comp.tooltipContent = 'Hover on me';
            fixture.detectChanges();
            expect(getStringTrigger().getAttribute('aria-describedby')).toBeTruthy();
        });

        it('should update the description when the content changes', () => {
            fixture.detectChanges();
            comp.tooltipContent = 'Some other tooltip text';
            fixture.detectChanges();
            const descriptionId = getStringTrigger().getAttribute('aria-describedby');
            expect(document.getElementById(descriptionId).textContent).toBe('Some other tooltip text');
        });

        it('should describe the host with the open panel when the content is a template', fakeAsync(() => {
            comp.openEvents = ['mouseenter'];
            comp.closeEvents = ['mouseleave'];
            comp.delay = 0;
            fixture.detectChanges();
            const trigger = getTemplateTrigger();
            expect(trigger.hasAttribute('aria-describedby')).toBe(false);

            fireEvent(trigger, 'mouseenter');
            tick(5);
            expect(trigger.getAttribute('aria-describedby')).toBe(getTooltipEl().id);

            fireEvent(trigger, 'mouseleave');
            tick(5);
            expect(trigger.hasAttribute('aria-describedby')).toBe(false);
        }));

        it('should not announce itself as a dialog, or take focus', fakeAsync(() => {
            comp.openEvents = ['mouseenter'];
            comp.delay = 0;
            fixture.detectChanges();
            const trigger = getTemplateTrigger();
            trigger.focus();

            fireEvent(trigger, 'mouseenter');
            tick(5);
            const panel = getTooltipEl();
            expect(panel.getAttribute('role')).toBe('tooltip');
            expect(trigger.hasAttribute('aria-haspopup')).toBe(false);
            expect(trigger.hasAttribute('aria-expanded')).toBe(false);
            expect(document.activeElement).toBe(trigger);
        }));

        it('should close when the Escape key is pressed', fakeAsync(() => {
            comp.openEvents = ['mouseenter'];
            comp.closeEvents = ['mouseleave'];
            comp.delay = 0;
            fixture.detectChanges();
            fireEvent(getStringTrigger(), 'mouseenter');
            tick(5);
            expect(getTooltipEl()).toBeTruthy();

            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            fixture.detectChanges();
            tick(5);
            expect(getTooltipEl()).toBeFalsy();
        }));

        describe('opening on focus', () => {
            let focusMonitor: FocusMonitor;

            beforeEach(() => {
                /**
                 * The karma window is narrower than the default `breakpoint`, which would give the tooltip the
                 * tap-to-open events used on touch devices - including not opening on focus
                 */
                window.innerWidth = 1000;
                focusMonitor = TestBed.inject(FocusMonitor);
                comp.delay = 0;
            });

            it('should open when the host is focused from the keyboard', fakeAsync(() => {
                fixture.detectChanges();
                focusMonitor.focusVia(getStringTrigger(), 'keyboard');
                fixture.detectChanges();
                tick(5);
                expect(getTooltipEl()).toBeTruthy();
            }));

            it('should close when focus leaves the host', fakeAsync(() => {
                fixture.detectChanges();
                const trigger = getStringTrigger();
                focusMonitor.focusVia(trigger, 'keyboard');
                fixture.detectChanges();
                tick(5);
                expect(getTooltipEl()).toBeTruthy();

                trigger.blur();
                fixture.detectChanges();
                tick(5);
                expect(getTooltipEl()).toBeFalsy();
            }));

            it('should not open when the host is focused by a pointer', fakeAsync(() => {
                fixture.detectChanges();
                focusMonitor.focusVia(getStringTrigger(), 'mouse');
                fixture.detectChanges();
                tick(5);
                expect(getTooltipEl()).toBeFalsy();
            }));

            it('should not open when focus is moved programmatically', fakeAsync(() => {
                fixture.detectChanges();
                focusMonitor.focusVia(getStringTrigger(), 'program');
                fixture.detectChanges();
                tick(5);
                expect(getTooltipEl()).toBeFalsy();
            }));

            it('should not open on focus when showOnFocus is false', fakeAsync(() => {
                comp.showOnFocus = false;
                fixture.detectChanges();
                focusMonitor.focusVia(getStringTrigger(), 'keyboard');
                fixture.detectChanges();
                tick(5);
                expect(getTooltipEl()).toBeFalsy();
            }));

            it('should not open on focus when it is manually controlled', fakeAsync(() => {
                comp.openEvents = [];
                fixture.detectChanges();
                focusMonitor.focusVia(getStringTrigger(), 'keyboard');
                fixture.detectChanges();
                tick(5);
                expect(getTooltipEl()).toBeFalsy();
            }));

            it('should not close on blur a tooltip that focus did not open', fakeAsync(() => {
                comp.manualOpen = true;
                fixture.detectChanges();
                const trigger = getStringTrigger();
                tick(5);
                expect(getTooltipEl()).toBeTruthy();

                focusMonitor.focusVia(trigger, 'mouse');
                trigger.blur();
                fixture.detectChanges();
                tick(5);
                expect(getTooltipEl()).toBeTruthy();
            }));

            it('popovers should not open on focus, as the keyboard opens them on click', fakeAsync(() => {
                fixture.detectChanges();
                const trigger = de.query(By.directive(NwPopoverDirective)).nativeElement as HTMLElement;
                focusMonitor.focusVia(trigger, 'keyboard');
                fixture.detectChanges();
                tick(10);
                expect(getTooltipEl()).toBeFalsy();
            }));
        });
    });

    /**
     * A popover is a disclosure the user opens: it is a named, described dialog, and it announces itself by
     * taking focus
     */
    describe('nwPopover', () => {
        const getStringTrigger = (): HTMLElement => de.query(By.directive(NwPopoverDirective)).nativeElement;
        const getTemplateTrigger = (): HTMLElement => de.queryAll(By.directive(NwPopoverDirective))[1].nativeElement;

        beforeEach(() => {
            comp.delay = 0;
            comp.openEvents = ['click'];
            comp.closeEvents = ['click'];
        });

        it('should render the panel as a dialog named by its trigger', fakeAsync(() => {
            fixture.detectChanges();
            const trigger = getTemplateTrigger();

            fireEvent(trigger, 'click');
            tick(10);
            const panel = getTooltipEl();
            expect(panel.getAttribute('role')).toBe('dialog');
            expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id);
            expect(trigger.id).toBeTruthy();
        }));

        it('should describe the dialog with its own content, so that it is read out', fakeAsync(() => {
            fixture.detectChanges();

            fireEvent(getTemplateTrigger(), 'click');
            tick(10);
            const panel = getTooltipEl();
            const contentId = panel.getAttribute('aria-describedby');
            expect(contentId).toBe(`${panel.id}-content`);
            expect(document.getElementById(contentId).textContent).toContain('A link in the panel');
        }));

        it('should announce the dialog on the trigger', fakeAsync(() => {
            fixture.detectChanges();
            const trigger = getTemplateTrigger();

            fireEvent(trigger, 'click');
            tick(10);
            expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
            expect(trigger.getAttribute('aria-expanded')).toBe('true');

            fireEvent(trigger, 'click');
            tick(10);
            expect(trigger.getAttribute('aria-expanded')).toBe('false');
        }));

        it('should not describe its host, as the panel is not a description', fakeAsync(() => {
            fixture.detectChanges();
            const trigger = getTemplateTrigger();

            fireEvent(trigger, 'click');
            tick(10);
            expect(trigger.hasAttribute('aria-describedby')).toBe(false);
        }));

        it('should move focus into the panel, and back to the trigger when it closes', fakeAsync(() => {
            fixture.detectChanges();
            const trigger = getTemplateTrigger();
            trigger.focus();

            fireEvent(trigger, 'click');
            tick(10);
            const panel = getTooltipEl();
            expect(document.activeElement).toBe(panel);

            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            fixture.detectChanges();
            tick(10);
            expect(getTooltipEl()).toBeFalsy();
            expect(document.activeElement).toBe(trigger);
        }));

        it('should not take focus when it was not opened from the host', fakeAsync(() => {
            fixture.detectChanges();
            const elsewhere = de.query(By.directive(NwTooltipDirective)).nativeElement as HTMLElement;
            elsewhere.focus();

            fireEvent(getTemplateTrigger(), 'click');
            tick(10);
            expect(getTooltipEl()).toBeTruthy();
            expect(document.activeElement).toBe(elsewhere);
        }));

        it('should give the close button an accessible name, inside the described content', fakeAsync(() => {
            comp.withClose = true;
            fixture.detectChanges();

            fireEvent(getTemplateTrigger(), 'click');
            tick(10);
            const panel = getTooltipEl();
            const closeBtn = panel.querySelector('.btn-close');
            expect(closeBtn.getAttribute('aria-label')).toBe('Close');
            /**
             * The `.tooltip-inner .close-button` style selector depends on this, and it is last so that the
             * description ends with "Close" rather than starting with it
             */
            const content = panel.querySelector('.tooltip-inner');
            expect(content.lastElementChild.classList).toContain('btn-close');
        }));

        it('should close on Tab, handing focus back, when it holds nothing to trap', fakeAsync(() => {
            fixture.detectChanges();
            /**
             * String content: there is nothing tabbable inside, so a focus trap would hold focus on its own
             * invisible anchor and the user would lose it altogether
             */
            const trigger = getStringTrigger();
            trigger.focus();

            fireEvent(trigger, 'click');
            tick(10);
            expect(document.activeElement).toBe(getTooltipEl());

            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
            fixture.detectChanges();
            tick(10);
            expect(getTooltipEl()).toBeFalsy();
            expect(document.activeElement).toBe(trigger);
        }));

        it('should keep focus inside on Tab when it does hold something to trap', fakeAsync(() => {
            fixture.detectChanges();
            const trigger = getTemplateTrigger();
            trigger.focus();

            fireEvent(trigger, 'click');
            tick(10);
            const panel = getTooltipEl();
            expect(panel.querySelector('a')).toBeTruthy();

            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
            fixture.detectChanges();
            tick(10);
            expect(getTooltipEl()).toBeTruthy();
            expect(panel.contains(document.activeElement)).toBe(true);
        }));

        it('should emit a close event when the Escape key is pressed', fakeAsync(() => {
            fixture.detectChanges();

            fireEvent(getStringTrigger(), 'click');
            tick(10);
            const spy = spyOn(comp, 'onCloseBtnClicked');

            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            fixture.detectChanges();
            tick(10);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(getTooltipEl()).toBeFalsy();
        }));
    });
});

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    template: `
        <div
            class="wrapper-el"
            cdkScrollable>
            <button
                class="btn btn-md btn-primary"
                #tooltip="nw-tooltip"
                [nwTooltip]="tooltipContent"
                [withAriaDescription]="withAriaDescription"
                [attr.aria-label]="hostAriaLabel"
                [showOnFocus]="showOnFocus"
                [closeOnScroll]="closeOnScroll"
                [placement]="tooltipPlacement"
                [isDisabled]="isDisabled"
                [withArrow]="withArrow"
                [delay]="delay"
                [isOpen]="manualOpen"
                [autoFlip]="autoFlip"
                [updatePositionOnAnimationFrame]="updatePositionOnAnimationFrame"
                [openEvents]="openEvents"
                [closeEvents]="closeEvents"
                [connectedTo]="connectedTo"
                containerClass="test-tooltip-container-class">
                Hover on me
            </button>

            <button
                class="btn btn-md btn-primary"
                #popover="nw-popover"
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
                (nwClose)="onCloseBtnClicked()">
                Button text
            </button>

            <button
                class="btn btn-md btn-primary"
                [nwTooltip]="panelTemplate"
                [delay]="delay"
                [openEvents]="openEvents"
                [closeEvents]="closeEvents">
                Tooltip with template content
            </button>

            <button
                class="btn btn-md btn-primary"
                [nwPopover]="panelTemplate"
                [delay]="delay"
                [withClose]="withClose"
                [openEvents]="openEvents"
                [closeEvents]="closeEvents">
                Popover with template content
            </button>
        </div>

        <ng-template #panelTemplate>
            <p>Some template content</p>
            <a href="https://example.com">A link in the panel</a>
        </ng-template>

        <div
            class="connected-to-el"
            #connectionEl></div>
    `,
    styles: [
        `
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
        `
    ],
    imports: [NwTooltipDirective, NwPopoverDirective, CdkScrollableModule]
})
class WrapperComponent implements OnInit {
    @ViewChild('tooltip') tooltip: NwTooltipDirective;
    @ViewChild('popover') popover: NwPopoverDirective;
    @ViewChild('connectionEl', { static: true }) connectionEl: ElementRef<HTMLElement>;
    @ViewChild(CdkScrollable, { read: ElementRef }) scrollEl: ElementRef<HTMLElement>;

    public withArrow: boolean = true;
    public withClose: boolean = false;
    public withAriaDescription: boolean;
    public hostAriaLabel: string;
    public closeOnScroll: boolean;
    public showOnFocus: boolean;
    public tooltipContent: string = 'Some tooltip text';
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
