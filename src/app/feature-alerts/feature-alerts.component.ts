import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feature-alerts',
  templateUrl: './feature-alerts.component.html',
  styleUrls: ['./feature-alerts.component.scss']
})
export class FeatureAlertsComponent implements OnInit {

  constructor() {
    console.log('sssssssssssssssssssssaaaa');
  }

  ngOnInit() {
  }

  getFeatureAlertParams1(){
    return {
        id: 'firstFeatureAlert',
        title: 'First Alert',
        message: 'Lorem ipsum dolor sit amet',
        containerClass: 'border-red',
        triggers: '',
        placement: 'top',
        container: ''
    };
  }

  getFeatureAlertParams1(){
    return {
        id: 'secondFeatureAlert',
        title: 'Second Alert',
        message: 'Too many feature alerts',
        containerClass: '',
        triggers: '',
        placement: 'right',
        container: ''
    };
  }

  getFeatureAlertParams3(){
    return {
        id: 'thirdFeatureAlert',
        title: 'Third Alert',
        message: 'Three pinky pigs',
        containerClass: '',
        triggers: '',
        placement: 'bottom',
        container: ''
    };
  }

  getFeatureAlertParams4(){
    return {
        id: 'fourthFeatureAlert',
        title: 'Fourth Alert',
        message: 'On your left.',
        containerClass: '',
        triggers: '',
        placement: 'left',
        container: ''
    };
  }

  getFeatureAlertParams5(){
    return {
        id: 'fifthFeatureAlert',
        title: 'Fifth Alert',
        message: 'Setting `mouseenter:mouseleave` as triggers',
        containerClass: '',
        triggers: 'mouseenter:mouseleave',
        placement: 'top',
        container: ''
    };
  }

  onCTAClick1(){
    console.log('You clicked on the first one');
  }

  onCTAClick2(){
    console.log('You clicked on the second one');
  }

  onCTAClick3(){
    console.log('You clicked on the third one');
  }

  onCTAClick4(){
    console.log('You clicked on the fourth one');
  }

  onCTAClick5(){
    console.log('You clicked on the fifth one');
  }

}
