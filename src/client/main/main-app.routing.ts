/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NotFound404Component } from './not-found404.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'about', loadChildren: './about/index#AboutModule?sync=true' },
  { path: 'backing', loadChildren: './backing/index#BackingModule?sync=true' },
  { path: 'fx', loadChildren: './fx/index#FxModule?sync=true' },
  { path: 'sound', loadChildren: './sound/index#SoundModule?sync=true' },
  { path: '**', component: NotFound404Component }
];
