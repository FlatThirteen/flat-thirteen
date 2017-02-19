import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EffectsModule } from "@ngrx/effects";

import { routes } from './a2.routing';
import { GridModule } from './grid/grid.module';
import { StagePanelModule } from "../shared/stage-panel/stage-panel.module";

import { A2Component } from './a2.component';
import { BeatService } from '../shared/beat.service';
import { GoalService } from "../shared/goal.service";
import { PlayerActions } from "../../player/player.actions";
import { PlayerEffects } from "../../player/player.effects";
import { PlayerService } from "../../player/player.service";
import { SoundService } from "../../sound/sound.service";
import { StageActions } from "../../stage/stage.actions";
import { StageService } from "../../stage/stage.service";
import { SurfaceService } from "../../surface/surface.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GridModule,
    StagePanelModule,
    EffectsModule.run(PlayerEffects),
  ],
  declarations: [
    A2Component
  ],
  providers: [
    PlayerActions,
    PlayerEffects,
    PlayerService,
    BeatService,
    GoalService,
    SoundService,
    StageActions,
    StageService,
    SurfaceService
  ]
})

export class A2Module {}

