/**
 * This module is the entry for your App when NOT using universal.
 *
 * Make sure to use the 3 constant APP_ imports so you don't have to keep
 * track of your root app dependencies here. Only import directly in this file if
 * there is something that is specific to the environment.
 */

import { ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { Store } from '@ngrx/store';

import { AppState } from '../../client/common/app.reducer';
import { HmrAppModule } from '../hmr-app.module';

import { MainAppComponent } from '../../client/main/main-app.component';
import { APP_DECLARATIONS } from '../../client/main/main-app.config';
import { APP_ENTRY_COMPONENTS } from '../../client/main/main-app.config';
import { APP_IMPORTS } from '../../client/main/main-app.config';
import { APP_PROVIDERS } from '../../client/main/main-app.config';

@NgModule({
  bootstrap: [MainAppComponent],
  declarations: [
    MainAppComponent,
    APP_DECLARATIONS
  ],
  entryComponents: [APP_ENTRY_COMPONENTS],
  imports: [
    APP_IMPORTS,
    BrowserModule,
    HttpModule,
  ],
  providers: [APP_PROVIDERS]
})

export class AppModule extends HmrAppModule {
  constructor(appRef: ApplicationRef, store: Store<AppState>) {
    super(appRef, store);
  }
}
