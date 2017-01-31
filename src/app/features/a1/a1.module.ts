import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './a1.routing';

import { GridModule } from '../shared/grid/grid.module';
import { StagePanelModule } from "../shared/stage-panel/stage-panel.module";

import { A1Component } from './a1.component';
import { BeatService } from '../shared/beat.service';
import { GridService } from '../shared/grid/grid.service';
import { GoalService } from "../shared/goal.service";
import { StageService } from "../shared/stage.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GridModule,
    StagePanelModule
  ],
  declarations: [
    A1Component
  ],
  providers: [
    BeatService,
    GoalService,
    GridService,
    StageService
  ]
})

export class A1Module {}

