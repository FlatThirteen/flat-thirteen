import '../polyfills.browser';
import '../rxjs.imports';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader } from '@angularclass/hmr';

import { decorateModuleRef } from '../environment';

import { BrowserAppModule } from './a1-app.browser.module';

if ('production' === ENV) {
  enableProdMode();
}

function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(BrowserAppModule)
    .then(decorateModuleRef)
    .catch(err => console.error(err));
}

// needed for hmr
// in prod this is replace for document ready
bootloader(main);
