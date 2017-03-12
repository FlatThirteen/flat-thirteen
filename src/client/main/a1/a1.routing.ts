/* tslint:disable: variable-name */
import { Routes } from '@angular/router';
import { A1Component } from './a1.component';

export const routes: Routes = [
  {
    path: '',
    component: A1Component
  }, {
    path: 'pixi',
    component: A1Component,
    data: {renderer: 'pixi'}
  }
];
