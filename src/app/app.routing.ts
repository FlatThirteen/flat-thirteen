/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';

import { HomeComponent } from './features/home.component';
import { NotFound404Component } from './not-found404.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'A1', loadChildren: './features/a1/a1.module#A1Module' },
  { path: 'A2', loadChildren: './features/a2/a2.module#A2Module' },
  { path: 'about', loadChildren: './features/about/index#AboutModule?sync=true' },
  { path: '**', component: NotFound404Component }
];
