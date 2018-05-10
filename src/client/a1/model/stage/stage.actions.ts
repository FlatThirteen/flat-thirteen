import { Action } from '@ngrx/store';

import { Phrase } from '../../../common/phrase/phrase.model';
import { Note } from '../../../common/core/note.model';

import { StageScene } from './stage.reducer';

export namespace Stage {

  export const STANDBY = '[A1 STAGE] Standby';
  export class StandbyAction implements Action {
    readonly type = Stage.STANDBY;
    constructor(public payload: { phrase?: Phrase }) {}
  }

  export const COUNT = '[A1 STAGE] Count';
  export class CountAction implements Action {
    readonly type = Stage.COUNT;
    constructor(public payload: { nextScene: StageScene }) {}
  }

  export const GOAL = '[A1 STAGE] Goal';
  export class GoalAction implements Action {
    readonly type = Stage.GOAL;
    constructor(public payload: { nextScene?: StageScene, penalty?: number }) {}
  }

  export const PLAYBACK = '[A1 STAGE] Playback';
  export class PlaybackAction implements Action {
    readonly type = Stage.PLAYBACK;
    constructor(public payload: { nextScene?: StageScene }) {}
  }

  export const VICTORY = '[A1 STAGE] Victory';
  export class VictoryAction implements Action {
    readonly type = Stage.VICTORY;
    constructor(public payload: { basePoints: number }) {}
  }

  export const NEXT = '[A1 STAGE] Next';
  export class NextAction implements Action {
    readonly type = Stage.NEXT;
    constructor(public payload: { nextScene: StageScene }) {}
  }

  export const PLAY = '[A1 STAGE] Play';
  export class PlayAction implements Action {
    readonly type = Stage.PLAY;
    constructor(public payload: { note: Note, beat: number, tick: number }) {}
  }

  export const WRONG = '[A1 STAGE] Wrong';
  export class WrongAction implements Action {
    readonly type = Stage.WRONG;
    constructor(public payload: { penalty: number }) {}
  }

  export type Actions = StandbyAction | CountAction | GoalAction |
      PlaybackAction | VictoryAction | NextAction | PlayAction | WrongAction;
}
