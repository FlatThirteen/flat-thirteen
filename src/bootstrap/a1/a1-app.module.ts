/**
 * This module is the entry for your App when NOT using universal.
 *
 * Make sure to use the 3 constant APP_ imports so you don't have to keep
 * track of your root app dependencies here. Only import directly in this file if
 * there is something that is specific to the environment.
 */

import { ApplicationRef, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { Store } from '@ngrx/store';

import { AppState } from '../../client/common/app.reducer';
import { HmrAppModule } from '../hmr-app.module';

import { A1AppComponent } from '../../client/a1/a1-app.component';
import { APP_DECLARATIONS } from '../../client/a1/a1-app.config';
import { APP_ENTRY_COMPONENTS } from '../../client/a1/a1-app.config';
import { APP_IMPORTS } from '../../client/a1/a1-app.config';
import { APP_PROVIDERS } from '../../client/a1/a1-app.config';

@NgModule({
  bootstrap: [A1AppComponent],
  declarations: [
    A1AppComponent,
    APP_DECLARATIONS
  ],
  entryComponents: [APP_ENTRY_COMPONENTS],
  imports: [
    APP_IMPORTS,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [APP_PROVIDERS]
})

export class AppModule extends HmrAppModule {
  constructor(appRef: ApplicationRef, store: Store<AppState>) {
    super(appRef, store);
  }
}
