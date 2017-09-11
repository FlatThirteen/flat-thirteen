import * as _ from 'lodash';

import { Action } from '@ngrx/store';

import { LessonActions } from './lesson.actions';
import { Phrase } from '../../../common/phrase/phrase.model';
import { Surface } from '../../../common/surface/surface.model';

export interface Plan {
  surfaces: Surface[];
  stages: Phrase[];
  numberOfStages: number;
}

export class LessonState {
  readonly stage: number = undefined;
  readonly completed: boolean[];
  readonly rounds: number = 0;

  constructor(readonly plan: Plan) {
    this.completed = [];
  }

  static reducer(state: LessonState, action: Action): LessonState {
    switch (action.type) {
      case LessonActions.INIT: {
        return new LessonState(action.payload);
      }
      case LessonActions.RESET: {
        return new LessonState(state.plan);
      }
      case LessonActions.STAGE: {
        let stage = action.payload;
        return {
          plan: state.plan,
          stage: stage, // Easiest way to set undefined
          completed: state.completed,
          rounds: state.rounds
        };
      }
      case LessonActions.COMPLETE: {
        let [rounds, stage] = action.payload;
        let completed = state.completed.slice();
        completed[stage] = true;
        return _.defaults({
          stage: undefined,
          completed: completed,
          rounds: state.rounds + rounds
        }, state);
      }
      default: {
        return state;
      }
    }
  }
}
