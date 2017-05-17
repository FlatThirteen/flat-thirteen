import { NgModule, APP_BOOTSTRAP_LISTENER, ApplicationRef } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { BrowserModule } from '@angular/platform-browser';

import { A2AppComponent } from '../../client/a2/a2-app.component';
import { AppModule } from './a2-app.module';
import { ServerTransferStateModule } from '../../modules/transfer-state/server-transfer-state.module';
import { TransferState } from '../../modules/transfer-state/transfer-state';

export function onBootstrap(appRef: ApplicationRef, transferState: TransferState) {
  return () => {
    appRef.isStable
      .filter(stable => stable)
      .first()
      .subscribe(() => {
        transferState.inject();
      });
  };
}

@NgModule({
  bootstrap: [A2AppComponent],
  providers: [
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: onBootstrap,
      multi: true,
      deps: [
        ApplicationRef,
        TransferState
      ]
    }
  ],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'a2-app'
    }),
    ServerModule,
    ServerTransferStateModule,
    AppModule
  ]
})
export class ServerAppModule {

}
