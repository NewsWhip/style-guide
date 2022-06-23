import { Component } from '@angular/core';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss']
})
export class ModalsComponent {

  public modalSize: string = 'md';
  public isImage: boolean = false;
  public showTitle: boolean = true;

}
