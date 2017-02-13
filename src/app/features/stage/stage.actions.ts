import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';

@Injectable()
export class StageActions {

  constructor() {}

  static INIT = '[STAGE] Init';
  init(): Action {
    return {
      type: StageActions.INIT,
      payload: []
    };
  }

  static RESET = '[STAGE] Reset';
  reset(): Action {
    let state = 'Demo';
    let nextState = null;
    let round = 0;
    let active = false;
    let inactiveRounds = 0;
    return {
      type: StageActions.RESET,
      payload: [state, nextState, round, active, inactiveRounds]
    };
  }
}