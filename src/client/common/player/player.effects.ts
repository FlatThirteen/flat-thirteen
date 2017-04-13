import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { Grid } from '../../a2/main/grid/grid.model';
import { Note } from '../sound/sound';
import { PlayerActions } from './player.actions';
import { SoundService } from '../sound/sound.service';
import { StageService } from '../stage/stage.service';
import { TransportService } from '../core/transport.service';
import { ticks } from '../core/beat-tick.model';

@Injectable()
export class PlayerEffects {

  constructor(
    private actions$: Actions,
    private transport: TransportService,
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
        let pulse;
        [beat, pulse] = surface.beatPulseFor(cursor);
        sound = surface.soundByKey[key];
        pulses = pulses[beat];
        tick = ticks(pulse, pulses);
      }
      if (this.stage.isDemo) {
        this.sound.play(sound);
      } else if (this.transport.canLivePlay(beat, cursor, pulses)) {
        this.stage.play(new Note(sound), beat, tick);
      }
    }).ignoreElements();
}
