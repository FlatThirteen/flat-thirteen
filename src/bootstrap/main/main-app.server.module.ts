import { NgModule, APP_BOOTSTRAP_LISTENER, ApplicationRef } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { BrowserModule } from '@angular/platform-browser';

import { MainAppComponent } from '../../client/main/main-app.component';
import { AppModule } from './main-app.module';
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
  bootstrap: [MainAppComponent],
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
      appId: 'main-app'
    }),
    ServerModule,
    ServerTransferStateModule,
    AppModule
  ]
})
export class ServerAppModule {

}
