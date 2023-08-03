import { DebugElement, Component, ViewChild, ElementRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DropdownDirective } from "./dropdown.directive";
import { DropdownService } from "./dropdown.service";
import { DropdownsModule } from "./dropdowns.module";

let testComp: TestComponent;
let fixture: ComponentFixture<TestComponent>;
let de: DebugElement;

describe('DropdownDirective', () => {
    beforeEach(async() => {
        await TestBed.configureTestingModule({
            imports: [
                DropdownsModule
            ],
            declarations: [TestComponent],
            providers: [DropdownService]
        });

        TestBed.overrideProvider(DropdownService, { useValue: new DropdownService() });

        fixture = TestBed.createComponent(TestComponent);
        testComp = fixture.componentInstance;
        de = fixture.debugElement;
    });

    it('calling open should result in the opened event emitter triggering', () => {
        fixture.detectChanges();
        const spy = spyOn(testComp, 'onOpen');
        testComp.directive.open();
        expect(spy).toHaveBeenCalled();
    });

    it('calling close should result in the closed event emitter triggering', () => {
        fixture.detectChanges();
        const spy = spyOn(testComp, 'onClosed');
        testComp.directive.close();
        expect(spy).toHaveBeenCalled();
    });

    describe('when disabled', () => {
        beforeEach(() => {
            testComp.disabled = true;
        });

        it('calling open should not result in the opened event emitter triggering', () => {
            fixture.detectChanges();
            const spy = spyOn(testComp, 'onOpen');
            testComp.directive.open();
            expect(spy).not.toHaveBeenCalled();
        });

        it('calling close should result in the closed event emitter triggering', () => {
            fixture.detectChanges();
            const spy = spyOn(testComp, 'onClosed');
            testComp.directive.close();
            expect(spy).toHaveBeenCalled();
        });
    });

    it('onEscape should call the close method in the service when the dropdown is open', () => {
        fixture.detectChanges();
        const service = de.injector.get(DropdownService);
        const spy = spyOn(service, 'close');
        testComp.directive.isOpen = true;

        const event = new KeyboardEvent("keydown", {
            'key': 'Escape'
        });
        document.dispatchEvent(event);

        expect(spy).toHaveBeenCalled();
    });

    describe('onDocumentClick', () => {
        it('should not try close the dropdown if its already closed', () => {
            fixture.detectChanges();
            testComp.directive.isOpen = false;

            const service = de.injector.get(DropdownService);
            const spy = spyOn(service, 'close');

            const event = new KeyboardEvent("click");
            document.dispatchEvent(event);
            expect(spy).not.toHaveBeenCalled();
        });

        it('should not try close the dropdown if autoClose is false', () => {
            fixture.detectChanges();
            testComp.directive.isOpen = true;
            testComp.directive.autoClose = false;

            const service = de.injector.get(DropdownService);
            const spy = spyOn(service, 'close');

            const event = new KeyboardEvent("click");
            document.dispatchEvent(event);
            expect(spy).not.toHaveBeenCalled();
        });

        it('should not try close the dropdown if autoClose is inside', () => {
            fixture.detectChanges();
            testComp.directive.isOpen = true;
            testComp.directive.autoClose = 'inside';

            const service = de.injector.get(DropdownService);
            const spy = spyOn(service, 'close');

            const event = new KeyboardEvent("click");
            document.dispatchEvent(event);
            expect(spy).not.toHaveBeenCalled();
        });
    });
});

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    template: `
        <div nwDropdown
            [disabled]="disabled"
            (opened)="onOpen()"
            (closed)="onClosed()">
        
            <ul>
                <li #dropdownItem>Item</li>
            </ul>
        </div>
    `
})
class TestComponent {

    @ViewChild(DropdownDirective) directive: DropdownDirective;
    @ViewChild('dropdownItem') dropdownItem: ElementRef<HTMLLIElement>;

    disabled: boolean = false;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpen() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClosed() {}
}