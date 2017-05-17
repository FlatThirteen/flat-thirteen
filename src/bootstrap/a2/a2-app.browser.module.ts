/* tslint:disable max-line-length */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { A2AppComponent } from '../../client/a2/a2-app.component';
import { AppModule } from './a2-app.module';
import { BrowserTransferStateModule } from '../../modules/transfer-state/browser-transfer-state.module';

@NgModule({
  bootstrap: [A2AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'a2-app' }),
    BrowserTransferStateModule,
    AppModule
  ]
})
export class BrowserAppModule { }
