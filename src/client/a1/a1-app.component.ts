import { Component } from '@angular/core';

/**
 * This class represents the lazy loaded A1Component.
 */
@Component({
  moduleId: module.id,
  selector: 'a1-app',
  templateUrl: 'a1-app.component.pug',
  styleUrls: ['a1-app.component.styl']
})
export class A1AppComponent {
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
