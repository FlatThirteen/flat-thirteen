/* tslint:disable max-line-length */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { A1AppComponent } from '../../client/a1/a1-app.component';
import { AppModule } from './a1-app.module';
import { BrowserTransferStateModule } from '../../modules/transfer-state/browser-transfer-state.module';

@NgModule({
  bootstrap: [A1AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'a1-app' }),
    BrowserTransferStateModule,
    AppModule
  ]
})
export class BrowserAppModule { }
