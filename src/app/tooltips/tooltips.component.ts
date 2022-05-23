import { CdkScrollable } from '@angular/cdk/scrolling';
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

  private _routeSub: Subscription;

  @ViewChild(CdkScrollable, { static: true }) scrollContainer: CdkScrollable;

  constructor(
    private _fb: FormBuilder,
    private _cdRef: ChangeDetectorRef,
    private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      tooltip: ['Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam repellat odio modi facilis expedita laudantium neque numquam enim tenetur totam, sint quia aspernatur maiores reiciendis corporis quae perspiciatis laboriosam perferendis?', Validators.required],
      placement: ['top'],
      forceOpen: [true],
      autoFlip: [true],
      isDisabled: [false],
      delay: [500, Validators.required],
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
    }
  }

  ngOnDestroy() {
    this._routeSub.unsubscribe();
  }

}
