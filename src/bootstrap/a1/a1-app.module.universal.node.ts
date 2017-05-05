/**
 * This module is the entry for your App SERVER when in UNIVERSAL mode.
 *
 * Make sure to use the 3 constant APP_ imports so you don't have to keep
 * track of your root app dependencies here. Only import directly in this file if
 * there is something that is specific to the environment.
 */

import { NgModule } from '@angular/core';
import { UniversalModule } from 'angular2-universal';

import { APP_DECLARATIONS } from '../../client/a1/a1-app.config';
import { APP_ENTRY_COMPONENTS } from '../../client/a1/a1-app.config';
import { APP_IMPORTS } from '../../client/a1/a1-app.config';
import { APP_PROVIDERS } from '../../client/a1/a1-app.config';

import { A1AppComponent } from '../../client/a1/a1-app.component';

@NgModule({
  declarations: [
    A1AppComponent,
    APP_DECLARATIONS
  ],
  entryComponents: [APP_ENTRY_COMPONENTS],
  imports: [
    APP_IMPORTS,
    UniversalModule // NodeModule, NodeHttpModule, and NodeJsonpModule are included
  ],
  bootstrap: [A1AppComponent],
  providers: [APP_PROVIDERS]
})
export class AppModule { }
