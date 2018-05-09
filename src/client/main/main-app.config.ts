import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IdlePreload, IdlePreloadModule } from '@angularclass/idle-preload';

import { RouterStoreModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';

import { routes } from './main-app.routing';
import { rootReducer } from '../common/app.reducer';

import { HomeComponent } from './home/home.component';
import { NotFound404Component } from './not-found404.component';

export const APP_IMPORTS = [
  ReactiveFormsModule,
  IdlePreloadModule.forRoot(), // forRoot ensures the providers are only created once
  RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: IdlePreload }),
  RouterStoreModule.connectRouter(),
  StoreModule.provideStore(rootReducer),
];

export const APP_DECLARATIONS = [
  HomeComponent,
  NotFound404Component
];

export const APP_ENTRY_COMPONENTS = [

];

export const APP_PROVIDERS = [];
