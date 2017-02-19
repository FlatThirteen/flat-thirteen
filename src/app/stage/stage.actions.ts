import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';

@Injectable()
export class StageActions {

  constructor() {}

  static INIT = '[STAGE] Init';
  init(): Action {
    return {
      type: StageActions.INIT
    };
  }

  static RESET = '[STAGE] Reset';
  reset(): Action {
    return {
      type: StageActions.RESET
    };
  }

  static NEXTROUND = '[STAGE] NextRound';
  nextRound(playedGoal: boolean): Action {
    return {
      type: StageActions.NEXTROUND,
      payload: playedGoal
    };
  }
}