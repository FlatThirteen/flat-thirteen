import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './a1.routing';

import { A1Component } from './a1.component';
import { GridModule } from '../shared/grid/index';
import { GridService } from '../shared/grid/grid.service'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GridModule
  ],
  declarations: [
    A1Component
  ],
  providers: [
    GridService
  ]
})

export class A1Module {}

