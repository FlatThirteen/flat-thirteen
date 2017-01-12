import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A1Component } from './a1.component';
import { A1RoutingModule } from './a1-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, A1RoutingModule, SharedModule],
  declarations: [A1Component],
  exports: [A1Component],
  providers: []
})
export class A1Module { }
