import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';

@Injectable()
export class StageActions {

  constructor() {}

  static INIT = '[STAGE] Init';
  init(state: string, nextState: string, round: number, active: boolean, inactiveRounds: number): Action {
    return {
      type: StageActions.INIT,
      payload: [state, nextState, round, active, inactiveRounds]
    };
  }

  static RESET = '[STAGE] Reset';
  reset(state: string, nextState: string, round: number, active: boolean, inactiveRounds: number): Action {
    return {
      type: StageActions.RESET,
      payload: [state, nextState, round, active, inactiveRounds]
    };
  }

  static ACTIVATE = '[STAGE] Activate';
  activate(): Action {
    return {
      type: StageActions.ACTIVATE,
      payload: [true]
    };
  }

  static NEXTROUND = '[STAGE] NextRound';
  nextRound(state: string, nextState: string, round: number, active: boolean, inactiveRounds: number): Action {
    return {
      type: StageActions.NEXTROUND,
      payload: [state, nextState, round, active, inactiveRounds]
    };
  }
}