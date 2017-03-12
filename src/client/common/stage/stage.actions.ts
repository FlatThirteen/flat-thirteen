import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { PhraseBuilder } from '../phrase/phrase.model';
import { Note } from '../sound/sound';

@Injectable()
export class StageActions {

  constructor() {}

  static LISTEN = '[STAGE] Listen';
  listen(): Action {
    return {
      type: StageActions.LISTEN
    };
  }

  static NEXT = '[STAGE] Next';
  next(phraseBuilder: PhraseBuilder): Action {
    return {
      type: StageActions.NEXT,
      payload: phraseBuilder
    };
  }

  static VICTORY = '[STAGE] Victory';
  victory(): Action {
    return {
      type: StageActions.VICTORY
    };
  }

  static PLAY = '[STAGE] Play';
  play(note: Note, beat: number, tick: number): Action {
    return {
      type: StageActions.PLAY,
      payload: [note, beat, tick]
    }
  }
}
