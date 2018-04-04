import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

declare var html_beautify: any;

@Component({
  selector: 'app-tooltips',
  templateUrl: './tooltips.component.html',
  styleUrls: ['./tooltips.component.scss']
})
export class TooltipsComponent implements AfterViewInit {

  @ViewChild('basicTooltip') basicTooltip: ElementRef;
  
  public basicTooltipHTML: string;
  public complexTooltipHTML: string;

  constructor() { }

  ngAfterViewInit() {
    setTimeout(() => {
        this.basicTooltipHTML = html_beautify(this.basicTooltip.nativeElement.outerHTML);
    }, 0);
}

}
