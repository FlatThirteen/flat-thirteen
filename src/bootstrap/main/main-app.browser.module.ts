/* tslint:disable max-line-length */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MainAppComponent } from '../../client/main/main-app.component';
import { AppModule } from './main-app.module';
import { BrowserTransferStateModule } from '../../modules/transfer-state/browser-transfer-state.module';

@NgModule({
  bootstrap: [MainAppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'main-app' }),
    BrowserTransferStateModule,
    AppModule
  ]
})
export class BrowserAppModule { }
