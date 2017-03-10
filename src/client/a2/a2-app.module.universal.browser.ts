/**
 * This module is the entry for your App BROWSER when in UNIVERSAL mode.
 *
 * Make sure to use the 3 constant APP_ imports so you don't have to keep
 * track of your root app dependencies here. Only import directly in this file if
 * there is something that is specific to the environment.
 */

import { NgModule } from '@angular/core';
import { UniversalModule } from 'angular2-universal';

import { APP_DECLARATIONS } from './a2-app.config';
import { APP_ENTRY_COMPONENTS } from './a2-app.config';
import { APP_IMPORTS } from './a2-app.config';
import { APP_PROVIDERS } from './a2-app.config';

import { A2AppComponent } from './a2-app.component';

@NgModule({
  declarations: [
    A2AppComponent,
    APP_DECLARATIONS
  ],
  entryComponents: [APP_ENTRY_COMPONENTS],
  imports: [
    APP_IMPORTS,
    UniversalModule // NodeModule, NodeHttpModule, and NodeJsonpModule are included
  ],
  bootstrap: [A2AppComponent],
  providers: [APP_PROVIDERS]
})
export class AppModule { }
