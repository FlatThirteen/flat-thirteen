import '../polyfills.browser.aot';
import '../rxjs.imports';
declare let ENV: string;

import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

export function load(AppModuleNgFactory) {
  if ('production' === ENV) {
    enableProdMode();
  }

  function main() {
    return platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)
      .catch(err => console.log(err));
  }

  function bootstrapDomReady() {
    document.addEventListener('DOMContentLoaded', main);
  }

  bootstrapDomReady();
}
