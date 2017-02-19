import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/operator/ignoreElements';

import { BeatService, ticks } from "../features/shared/beat.service";
import { GoalService } from "../features/shared/goal.service";
import { Note } from "../sound/sound";
import { PlayerActions } from "./player.actions";
import { StageService } from "../stage/stage.service";
import { SoundService } from "../sound/sound.service";
import { Grid as A1Grid } from "../features/a1/grid/grid.model";
import { Grid } from "../features/a2/grid/grid.model";

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
    .filter(([surface]) => surface)
    .do(([surface, key, cursor, pulses]) => {
      let sound, beat, tick;
      if (surface instanceof Grid) {
        let beatPulse = surface.beatPulseFor(cursor);
        sound = surface.soundByKey[key];
        beat = beatPulse[0];
        pulses = pulses[beat];
        tick = ticks(beatPulse[1], pulses);
      } else if (surface instanceof A1Grid) {
        let info = surface.infoFor(key);
        sound = info.sound;
        beat = info.beat;
        tick = ticks(cursor, pulses);
      }
      if (this.stage.isDemo()) {
        this.sound.play(sound);
      } else if (this.beat.canLivePlay(beat, cursor, pulses)) {
        this.goal.playSound(new Note(sound), beat, tick);
      }
    }).ignoreElements();
}
