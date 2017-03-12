import { Component } from '@angular/core';

/**
 * This class represents the lazy loaded A2Component.
 */
@Component({
  moduleId: module.id,
  selector: 'a2-app',
  templateUrl: 'a2-app.component.pug',
  styleUrls: ['a2-app.component.css']
})
export class A2AppComponent {
  constructor() {}

  activateEvent(event) {
    if (ENV === 'development') {
      console.log('Activate Event:', event);
    }
  }

  deactivateEvent(event) {
    if (ENV === 'development') {
      console.log('Deactivate Event', event);
    }
  }

}
