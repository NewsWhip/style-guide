import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ISnippet } from '../code/ISnippet';
import { AppCodeComponent } from '../code/code.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-spacing',
    templateUrl: './spacing.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgFor, AppCodeComponent]
})
export class SpacingComponent implements OnInit {

  public snippets: ISnippet[] = [
    {
      lang: 'css',
      code: `
        .ml-4 {
          margin-left: 4px;
        }
      `
    },
    {
      lang: 'css',
      code: `
      .mt-16 {
        margin-top: 16px;
      }
      `
    },
    {
      lang: 'css',
      code: `
      .mx-4 {
        margin-left: 4px;
        margin-right: 4px;
      }
      `
    },
    {
      lang: 'css',
      code: `
      .mr-auto {
        margin-right: auto;
      }
      `
    },
    {
      lang: 'css',
      code: `
      .p-8 {
        padding: 8px;
      }
      `
    }
  ];

  public usageSnippets: ISnippet[] = [
    {
      lang: 'html',
      code: '<div class="mr-8">...</div>'
    },
    {
      lang: 'html',
      code: '<p class="my-16">...</p>'
    },
    {
      lang: 'html',
      code: '<ul class="pl-0">...</ul>'
    },
    
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
