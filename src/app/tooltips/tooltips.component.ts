import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ISnippet } from '../code/ISnippet';

@Component({
  selector: 'app-tooltips',
  templateUrl: './tooltips.component.html',
  styleUrls: ['./tooltips.component.scss']
})
export class TooltipsComponent implements OnInit, OnDestroy {

  public selectedTab: 'design' | 'api' = 'design';
  public form: FormGroup;
  public propertiesTable: [string, string, string, string][] = [
    [
      "@Input('nwTooltip') tooltip: string | TemplateRef<any>; or @Input('nwPopover') popover: string | TemplateRef<any>;",
      "A string or TemplateRef representing the content of the tooltip",
      "-",
      "-"
    ],
    [
      "@Input() context: any;",
      'An object that can be passed when the `nwTooltip` or `nwPopover` input is a `TemplateRef`<br><br><a class="nw-link nw-link-tertiary" target="_blank" href="https://angular.io/api/core/ng-template#context">Docs</a>',
      "-",
      "-"
    ],
    [
      "@Input() placement: Placement | Placement[];",
      "One or more preferred placement options",
      "-",
      "-"
    ],
    [
      "@Input() isOpen: boolean",
      "Manually control the opening and closing of the tooltip",
      "-",
      "-"
    ],
    [
      "@Input() isDisabled: boolean;",
      "When true, the tooltip will not not respond to any open or close events. Nor will it respond to changes to the `isOpen` input",
      "false",
      "false"
    ],
    [
      "@Input() delay: number;",
      "Number of ms to wait before opening",
      "500",
      "0"
    ],
    [
      "@Input() autoFlip: boolean;",
      "Change the placement of the tooltip to its opposite position when it moves outside the viewport",
      "true",
      "true"
    ],
    [
      "@Input() openEvents: string[];",
      "A list of events that open the tooltip",
      `["mouseenter"]`,
      `["click"]`
    ],
    [
      "@Input() closeEvents: string[];",
      "A list of events that close the tooltip",
      `["click", "mouseleave"]`,
      `["click"]`
    ],
    [
      "@Input() containerClass: string;",
      "A class to apply to the tooltip container",
      ``,
      ``
    ],
    [
      "@Input() withArrow: boolean;",
      "Display an arrow or not. The location of the arrow is dependant on the current `placement`",
      `true`,
      `true`
    ],
    [
      "@Input() closeOnScroll: boolean;",
      "Whether or not to close the tooltip on scroll",
      `true`,
      `false`
    ],
    [
      "@Input() closeOnOutsideClick: boolean = false;",
      "Whether or not to close the tooltip on outside click",
      `false`,
      `false`
    ],
    [
      "@Input() updatePositionOnAnimationFrame: boolean;",
      `WARNING: Use with caution - there are potential performance issues with this.<br><br>
        Update the position of the tooltip before the next browser repaint. An example of where this may be required is if the tooltip is attached (and open) to an element that transitions or animates to a new position`,
      `false`,
      `false`
    ],
    [
      "@Input() connectedTo: ElementRef<HTMLElement>;",
      `In the case where the tooltip should not be attached to the host element, a reference to another element can be used`,
      `-`,
      `-`
    ],
    [
      "@Input() pointerEvents: 'auto' | 'none';",
      `Determines whether pointer events are enabled on the cdk-overlay-pane element`,
      `none`,
      `auto`
    ],
    [
      "@Output() nwShown: EventEmitter<null>",
      "Emits an event when the tooltip is shown",
      "-",
      "- "
    ],
    [
      "@Output() nwHidden: EventEmitter<null>",
      "Emits an event when the tooltip is hidden",
      "-",
      "- "
    ]
  ];
  public tooltipText: string = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam repellat odio modi facilis expedita laudantium neque numquam enim tenetur totam, sint quia aspernatur maiores reiciendis corporis quae perspiciatis laboriosam perferendis?';

  private _routeSub: Subscription;

  constructor(
    private _fb: FormBuilder,
    private _cdRef: ChangeDetectorRef,
    private _route: ActivatedRoute) {}

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
    })

    this._routeSub = this._route.queryParams.subscribe(params => {
      this.selectedTab = params.section || 'design';
      this._cdRef.detectChanges();
    });
  }

  public snippets: { [key: string]: ISnippet } = {
    import: {
      lang: 'typescript',
      code: `
        import { TooltipModule } from 'nw-style-guide/tooltips';
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
    }
  }

  ngOnDestroy() {
    this._routeSub.unsubscribe();
  }

}
