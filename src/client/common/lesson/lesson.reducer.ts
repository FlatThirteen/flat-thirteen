import * as _ from 'lodash';

import { Action } from '@ngrx/store';

import { LessonActions } from './lesson.actions';
import { Phrase } from '../phrase/phrase.model';
import { Surface } from '../surface/surface.model';

export interface Plan {
  surfaces: Surface[];
  stages: Phrase[] | number;
}

export class LessonState {
  readonly stage: number = 0;
  readonly complete: boolean[];
  readonly rounds: number = 0;

  constructor(readonly plan: Plan) {
    if (plan && _.isArray(plan.stages)) {
      this.complete = [];
    }
  }

  static reducer(state: LessonState, action: Action): LessonState {
    switch (action.type) {
      case LessonActions.INIT: {
        return new LessonState(action.payload);
      }
      case LessonActions.RESET: {
        return new LessonState(state.plan);
      }
      case LessonActions.ADVANCE: {
        let rounds = action.payload;
        return _.defaults({
          stage: state.stage + 1,
          rounds: state.rounds + rounds
        }, state);
      }
      default: {
        return state;
      }
    }
  }
}
