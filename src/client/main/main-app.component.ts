import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'main-app',
  styleUrls: ['main-app.component.styl'],
  templateUrl: 'main-app.component.pug'
})
export class MainAppComponent {
  showMonitor = (ENV === 'development' && !AOT &&
    ['monitor', 'both'].includes(STORE_DEV_TOOLS) // set in constants.js file in project root
  );
  views = [];
  /*
    {
      name: 'Home',
      link: ['']
    }, {
      name: 'About',
      link: ['about']
    }
  ];*/

  constructor(public route: ActivatedRoute, public router: Router) {}

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
