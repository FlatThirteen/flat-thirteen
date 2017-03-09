/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NotFound404Component } from './not-found404.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'A1', loadChildren: '../../app/features/a1/a1.module#A1Module' },
  { path: 'A2', loadChildren: '../../app/features/a2/a2.module#A2Module' },
  { path: 'about', loadChildren: './about/index#AboutModule?sync=true' },
  { path: '**', component: NotFound404Component }
];
