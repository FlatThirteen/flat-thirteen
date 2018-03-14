import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from './home/home.component';

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

  constructor(public route: ActivatedRoute, public router: Router) {}

  activateEvent(event) {
    if (ENV === 'development') {
      console.log('Activate Event:', event);
    }
    if (!(event instanceof HomeComponent)) {
      this.views = [
        {
          name: 'Home',
          link: ['']
        }, {
          name: 'About',
          link: ['about']
        }, {
          name: 'Sound',
          link: ['sound']
        }, {
          name: 'FX',
          link: ['fx']
        }
      ];
    }
  }

  deactivateEvent(event) {
    if (ENV === 'development') {
      console.log('Deactivate Event', event);
    }
  }
}
