import { ApplicationRef } from '@angular/core';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

import { Store } from '@ngrx/store';

import { AppState } from '../client/common/app.reducer';


export abstract class HmrAppModule {
  constructor(public appRef: ApplicationRef, private store: Store<AppState>) {}

  hmrOnInit(store) {
    if (!store || !store.state) return;
    // inject AppStore here and update it
    // this.AppStore.update(store.state)
    if ('restoreInputValues' in store) {
      store.restoreInputValues();
    }
    // change detection
    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    //this.store.take(1).subscribe(s => store.rootState = s);
    store.disposeOldHosts = createNewHosts(cmpLocation);
    store.restoreInputValues = createInputTransfer();
    removeNgStyles();
  }

  hmrAfterDestroy(store) {
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
