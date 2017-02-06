import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/operator/ignoreElements';

import { PlayerActions } from "./player.actions";
import { GoalService } from "../features/shared/goal.service";
import { BeatService } from "../features/shared/beat.service";
import { StageService } from "../features/shared/stage.service";
import { SoundService } from "../features/shared/sound/sound.service";
import { Note } from "../features/shared/sound/sound";

@Injectable()
export class PlayerEffects {

  constructor(
    private actions$: Actions,
    private beat: BeatService,
    private goal: GoalService,
    private stage: StageService,
    private sound: SoundService
  ) {}

  @Effect() play$ = this.actions$
    .ofType(PlayerActions.SET)
    .map(action => action.payload)
    .filter(([key, surface]) => surface)
    .do(([key, surface]) => {
      let info = surface.get(key);
      this.stage.setActive();

      if (this.stage.isDemo()) {
        this.sound.play(info.sound);
      } else if (this.beat.canLivePlay(info.beat)) {
        this.goal.playSound(info.beat, new Note(info.sound));
      }
    }).ignoreElements();
}
