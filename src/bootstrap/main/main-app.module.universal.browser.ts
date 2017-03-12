/**
 * This module is the entry for your App BROWSER when in UNIVERSAL mode.
 *
 * Make sure to use the 3 constant APP_ imports so you don't have to keep
 * track of your root app dependencies here. Only import directly in this file if
 * there is something that is specific to the environment.
 */

import { NgModule } from '@angular/core';
import { UniversalModule } from 'angular2-universal';

import { APP_DECLARATIONS } from '../../client/main/main-app.config';
import { APP_ENTRY_COMPONENTS } from '../../client/main/main-app.config';
import { APP_IMPORTS } from '../../client/main/main-app.config';
import { APP_PROVIDERS } from '../../client/main/main-app.config';

import { MainAppComponent } from '../../client/main/main-app.component';

@NgModule({
  declarations: [
    MainAppComponent,
    APP_DECLARATIONS
  ],
  entryComponents: [APP_ENTRY_COMPONENTS],
  imports: [
    APP_IMPORTS,
    UniversalModule // NodeModule, NodeHttpModule, and NodeJsonpModule are included
  ],
  bootstrap: [MainAppComponent],
  providers: [APP_PROVIDERS]
})
export class AppModule { }
