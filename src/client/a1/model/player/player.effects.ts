import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { Grid } from '../../main/grid/grid.model';
import { Note } from '../../../common/core/note.model';
import { Player } from './player.actions';
import { SoundService } from "../../../common/sound/sound.service";
import { StageService } from '../stage/stage.service';
import { TransportService } from '../../../common/core/transport.service';
import { ticks } from '../../../common/core/beat-tick.model';

@Injectable()
export class PlayerEffects {

  constructor(
    private actions$: Actions,
    private transport: TransportService,
    private stage: StageService,
    private sound: SoundService
  ) {}

  @Effect() play$ = this.actions$
    .ofType<Player.SetAction>(Player.SET)
    .map(action => action.payload)
    .do((payload) => {
      let { key, surface, cursor } = payload;
      let sound, beat, tick, pulses;
      if (surface instanceof Grid) {
        let pulse;
        [beat, pulse] = surface.beatPulseFor(cursor);
        sound = surface.soundByKey[key];
        pulses = surface.pulsesByBeat[beat];
        tick = ticks(pulse, pulses);
      }
      if (this.stage.isPlayback && this.transport.canLivePlay(beat, cursor, pulses)) {
        this.stage.play(new Note(sound), beat, tick);
      } else if (this.stage.isStandby) {
        this.sound.play(sound);
      }
    }).ignoreElements();
}
