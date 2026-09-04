import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ISnippet } from '../code/ISnippet';
import { TABS_DIRECTIVES } from 'nw-style-guide/tabs';
import { NgTemplateOutlet } from '@angular/common';
import { TooltipDirective, PopoverDirective } from 'nw-style-guide/tooltips';
import { AppCodeComponent } from '../code/code.component';
import { FaqComponent } from '../faq/faq-component';

@Component({
    selector: 'app-tooltips',
    templateUrl: './tooltips.component.html',
    styleUrls: ['./tooltips.component.scss'],
    imports: [
        TABS_DIRECTIVES,
        RouterLink,
        TooltipDirective,
        PopoverDirective,
        NgTemplateOutlet,
        AppCodeComponent,
        FormsModule,
        ReactiveFormsModule,
        FaqComponent
    ]
})
export class TooltipsComponent implements OnInit, OnDestroy {
    private _fb = inject(FormBuilder);
    private _cdRef = inject(ChangeDetectorRef);
    private _route = inject(ActivatedRoute);

    public selectedTab: 'design' | 'api' = 'design';
    public form: FormGroup;
    /**
     * Inputs both directives inherit from `CalloutBaseDirective`. The two default columns are where the choice of
     * selector shows up: the same input, a different starting point
     */
    public sharedPropertiesTable: [string, string, string, string][] = [
        [
            'context: any',
            'An object that can be passed when the content input is a `TemplateRef`<br><br><a class="nw-link nw-link-tertiary" target="_blank" href="https://angular.io/api/core/ng-template#context">Docs</a>',
            '-',
            '-'
        ],
        ['placement: Placement | Placement[]', 'One or more preferred placement options', '-', '-'],
        ['isOpen: boolean', 'Manually control the opening and closing of the callout', '-', '-'],
        [
            'isDisabled: boolean',
            'When true, the callout will not respond to any open or close events. Nor will it respond to changes to the `isOpen` input',
            'false',
            'false'
        ],
        ['delay: number', 'Number of ms to wait before opening', '500', '0'],
        [
            'autoFlip: boolean',
            'Change the placement of the callout to its opposite position when it moves outside the viewport',
            'true',
            'true'
        ],
        ['openEvents: string[]', 'A list of events that open the callout', `["mouseenter"]`, `["click"]`],
        ['closeEvents: string[]', 'A list of events that close the callout', `["click", "mouseleave"]`, `["click"]`],
        ['containerClass: string', 'A class to apply to the callout container', ``, ``],
        [
            'withArrow: boolean',
            'Display an arrow or not. The location of the arrow is dependant on the current `placement`',
            `true`,
            `true`
        ],
        ['closeOnScroll: boolean', 'Whether or not to close the callout on scroll', `true`, `false`],
        [
            'updatePositionOnAnimationFrame: boolean',
            `WARNING: Use with caution - there are potential performance issues with this.<br><br>
        Update the position of the callout before the next browser repaint. An example of where this may be required is if the callout is attached (and open) to an element that transitions or animates to a new position`,
            `false`,
            `false`
        ],
        [
            'connectedTo: ElementRef<HTMLElement> | Element',
            `In the case where the callout should not be attached to the host element, a reference to another element can be used`,
            `-`,
            `-`
        ],
        [
            "pointerEvents: 'auto' | 'none'",
            `Determines whether pointer events are enabled on the cdk-overlay-pane element`,
            `none`,
            `auto`
        ],
        [
            'hostElementZIndex: number',
            `Sets the \`z-index\` of the overlay host element, for the rare case where the callout has to be lifted above something else in the same stacking context`,
            `-`,
            `-`
        ],
        ['(nwShown)', 'Emits an event when the callout is shown', '-', '-'],
        ['(nwHidden)', 'Emits an event when the callout is hidden', '-', '-'],
        ['(nwClose)', 'Emits an event when the close button is clicked or the Escape key is pressed', '-', '-']
    ];
    /** Inputs that exist on `TooltipDirective` alone */
    public tooltipPropertiesTable: [string, string, string][] = [
        [
            'nwTooltip: string | TemplateRef<any>',
            'A string or TemplateRef representing the content of the tooltip',
            '-'
        ],
        [
            'withAriaDescription: boolean',
            `Describe the host element with the content, so that screen reader users get it without opening the tooltip - which they cannot do when it opens on hover.<br><br>
        Left unset, the description is skipped where the host's accessible name is already the same text, so that it is not announced twice. Set it explicitly to force the description on or off.<br><br>
        Note that a description identical to the host's \`aria-label\` is dropped by the CDK \`AriaDescriber\` itself, so \`true\` cannot force that case`,
            `undefined - described unless the text duplicates the host's accessible name`
        ],
        [
            'showOnFocus: boolean',
            `Open when the host receives focus from the keyboard, the keyboard equivalent of \`mouseenter\`. Focus from a pointer is ignored, as clicking an element focuses it and the tooltip would fight the \`click\` close event, as is programmatic focus, so that restoring focus after closing a modal does not open a tooltip.<br><br>
        Note that only an element that can hold focus can be focused. A tooltip on a \`span\`, \`div\` or \`svg\` element is still unreachable by keyboard - make the host a \`button\` if it is a control`,
            `undefined - follows openEvents, so on for a hover-opened tooltip`
        ],
        [
            'breakpoint: number',
            `The screen width below which the tooltip opens on tap rather than on hover, as touch devices have no hover. It stays a tooltip either way - only its events change.<br><br>
        Set to 0 to always use the hover events`,
            `767`
        ]
    ];
    /** Inputs that exist on `PopoverDirective` alone */
    public popoverPropertiesTable: [string, string, string][] = [
        [
            'nwPopover: string | TemplateRef<any>',
            'A string or TemplateRef representing the content of the popover',
            '-'
        ],
        ['withClose: boolean', 'Display a close button or not', `false`],
        ['closeOnOutsideClick: boolean', 'Whether or not to close the popover on outside click', `false`]
    ];
    public tooltipText: string =
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam repellat odio modi facilis expedita laudantium neque numquam enim tenetur totam, sint quia aspernatur maiores reiciendis corporis quae perspiciatis laboriosam perferendis?';

    private _routeSub: Subscription;

    ngOnInit(): void {
        this.form = this._fb.group({
            tooltip: [this.tooltipText, Validators.required],
            placement: ['top'],
            forceOpen: [false],
            autoFlip: [true],
            isDisabled: [false],
            withDelay: [true, Validators.required],
            withArrow: [{ value: true, disabled: true }],
            scrollableContainer: [false],
            closeOnScroll: [false]
        });

        this.form.get('forceOpen').valueChanges.subscribe(val => {
            if (val) {
                this.form.get('withArrow').disable();
            } else {
                this.form.get('withArrow').enable();
            }
        });

        this._routeSub = this._route.queryParams.subscribe(params => {
            this.selectedTab = params.section || 'design';
            this._cdRef.detectChanges();
        });
    }

    public snippets: Record<string, ISnippet> = {
        import: {
            lang: 'typescript',
            code: `
        // Import whichever of the two you use
        import { TooltipDirective, PopoverDirective } from 'nw-style-guide/tooltips';
      `
        },
        basicTooltip: {
            lang: 'html',
            code: `
        <button class="btn btn-md btn-primary"
            [nwTooltip]="'Some tooltip text'"
            [placement]="'bottom'">Button text</button>
      `
        },
        basicPopover: {
            lang: 'html',
            code: `
        <button class="btn btn-md btn-primary"
            [nwPopover]="'Some popover text'"
            [placement]="'right'">Button text</button>
      `
        },
        placementType: {
            lang: 'typescript',
            code: `
        export type Placement =
          | 'top'
          | 'top-start'
          | 'top-end'
          | 'bottom'
          | 'bottom-start'
          | 'bottom-end'
          | 'right'
          | 'right-start'
          | 'right-end'
          | 'left'
          | 'left-start'
          | 'left-end';
      `
        },
        disabledExample: {
            lang: 'html',
            code: `
        <button class="btn btn-md btn-primary disabled"
          nwTooltip="This feature is disabled and this tooltip will not be dismissed on click"
          placement="right"
          [delay]="0"
          [closeEvents]="['mouseleave']">Disabled element</button>
      `
        },
        withCloseButton: {
            lang: 'html',
            code: `
        <button class="btn btn-md btn-primary"
          [nwPopover]="closeBtnTmpl"
          [closeOnOutsideClick]="true"
          placement="bottom-start"
          [withClose]="true">Default popover with close button</button>

        <ng-template #closeBtnTmpl>
          <p>
            <strong>Popover with close button</strong>
          </p>
          <small>The close button is always absolutely positioned in the top right of the popover</small>
        </ng-template>
      `
        },
        keyboardPopover: {
            lang: 'html',
            code: `
        <button class="btn btn-md btn-primary"
          [nwPopover]="keyboardTmpl"
          [withClose]="true"
          [closeOnOutsideClick]="true"
          placement="bottom-start">Popover with focusable content</button>

        <ng-template #keyboardTmpl>
          <p><strong>Focus is trapped here</strong></p>
          <a class="nw-link nw-link-tertiary" href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
            target="_blank">The dialog pattern</a>
          <button class="btn btn-sm btn-ghost">A button</button>
        </ng-template>
      `
        },
        variations: {
            lang: 'html',
            code: `
        <!-- Held open purely to show the two colour variants. withAriaDescription is off because
             the text is filler: there is nothing here worth describing the host with -->
        <span [nwTooltip]="tooltipText"
          [containerClass]="'tooltip-light'"
          [isOpen]="true"
          [openEvents]="[]"
          [closeEvents]="[]"
          [withAriaDescription]="false">Light</span>
      `
        }
    };

    ngOnDestroy() {
        this._routeSub.unsubscribe();
    }
}
