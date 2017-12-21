import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Phrase } from '../../../common/phrase/phrase.model';
import { Note } from '../../../common/core/note.model';

import { StageScene } from './stage.reducer';

@Injectable()
export class StageActions {

  constructor() {}

  static STANDBY = '[A1 STAGE] Standby';
  standby(phrase?: Phrase): Action {
    return {
      type: StageActions.STANDBY,
      payload: phrase
    };
  }

  static COUNT = '[A1 STAGE] Count';
  count(nextScene: StageScene): Action {
    return {
      type: StageActions.COUNT,
      payload: nextScene
    };
  }

  static GOAL = '[A1 STAGE] Goal';
  goal(nextScene: StageScene = null): Action {
    return {
      type: StageActions.GOAL,
      payload: nextScene
    };
  }

  static PLAYBACK = '[A1 STAGE] Playback';
  playback(nextScene: StageScene = null): Action {
    return {
      type: StageActions.PLAYBACK,
      payload: nextScene
    };
  }

  static VICTORY = '[A1 STAGE] Victory';
  victory(basePoints: number): Action {
    return {
      type: StageActions.VICTORY,
      payload: basePoints
    };
  }

  static PLAY = '[A1 STAGE] Play';
  play(note: Note, beat: number, tick: number): Action {
    return {
      type: StageActions.PLAY,
      payload: [note, beat, tick]
    };
  }
}
