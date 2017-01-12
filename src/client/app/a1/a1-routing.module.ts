import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { A1Component } from './a1.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'a1', component: A1Component }
    ])
  ],
  exports: [RouterModule]
})
export class A1RoutingModule { }
