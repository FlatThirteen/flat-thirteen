import '../polyfills.browser';
import '../rxjs.imports';
declare let ENV: string;

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader } from '@angularclass/hmr';

import { decorateModuleRef } from '../environment';

export function load(module) {
  if ('production' === ENV) {
    enableProdMode();
  }

  function main(): Promise<any> {
    return platformBrowserDynamic()
      .bootstrapModule(module)
      .then(decorateModuleRef)
      .catch(err => console.error(err));
  }

  // needed for hmr
  // in prod this is replace for document ready
  bootloader(main);
}
