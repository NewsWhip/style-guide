import {Component, ContentChild, ContentChildren, ElementRef, HostBinding, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {TabsDirective} from './tabs.directive';

@Component({
  selector: 'nw-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})

export class TabsComponent implements OnInit {
  @Input() tabs: string[];

  @ViewChild('border') border: ElementRef;
  activeTab: string;

  @ContentChild(TabsDirective)
  active: TabsDirective;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
      this.activeTab = this.tabs[0];
  }

  @HostBinding('class.active')
  get click() {
      let elms: any[] = [];
      elms = this.el.nativeElement.getElementsByClassName('active');

      elms.map(el => {
          console.log(el.classList);
          el.classList.remove('active');
      });

      return true;
  }

  animateLeftPos(): number {
      // Use renderer right here
      const elm: any = this.el.nativeElement.getElementsByClassName('active')[0].getBoundingClientRect();
      // this.renderer.setStyle(this.border, 'left', elm.left);
      return elm.left;
  }

  setWidth(): number {
      // Use renderer right here
      const elm: any = this.el.nativeElement.getElementsByClassName('active')[0].getBoundingClientRect();
      // this.renderer.setStyle(this.border, 'width', elm.width);
      return elm.width;
  }
}
