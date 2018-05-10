import { Action } from '@ngrx/store';

import { Note } from '../../../common/core/note.model';
import { PhraseBuilder } from '../../../common/phrase/phrase.model';

export namespace Stage {

  export const LISTEN = '[STAGE] Listen';
  export class ListenAction implements Action {
    readonly type = Stage.LISTEN;
  }

  export const NEXT = '[STAGE] Next';
  export class NextAction implements Action {
    readonly type = Stage.NEXT;
    constructor(public payload: { phraseBuilder: PhraseBuilder }) {}
  }

  export const VICTORY = '[STAGE] Victory';
  export class VictoryAction implements Action {
    readonly type = Stage.VICTORY;
    constructor(public payload: { basePoints: number }) {}
  }

  export const PLAY = '[STAGE] Play';
  export class PlayAction implements Action {
    readonly type = Stage.PLAY;
    constructor(public payload: { note: Note, beat: number, tick: number }) {}
  }

  export type Actions = ListenAction | NextAction | VictoryAction | PlayAction;
}
