import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/operator/ignoreElements';

import { BeatService } from "../features/shared/beat.service";
import { GoalService } from "../features/shared/goal.service";
import { Note } from "../sound/sound";
import { PlayerActions } from "./player.actions";
import { StageService } from "../features/shared/stage.service";
import { SoundService } from "../sound/sound.service";

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
    .filter(([surface, key]) => surface)
    .do(([surface, key]) => {
      let info = surface.infoFor(key);
      if (this.stage.isDemo()) {
        this.sound.play(info.sound);
      } else if (this.beat.canLivePlay(info.beat)) {
        this.goal.playSound(info.beat, new Note(info.sound));
      }
    }).ignoreElements();
}
