import * as _ from 'lodash';

import { Action } from '@ngrx/store';

import { Phrase } from '../../../common/phrase/phrase.model';
import { Surface } from '../../../common/surface/surface.model';

import { LessonActions } from './lesson.actions';

export interface Plan {
  surfaces: Surface[];
  stages: Phrase[];
  numberOfStages: number;
}

export interface Result {
  points: number[]
}

export class LessonState {
  readonly stage: number = undefined;
  readonly result: Result;
  readonly rounds: number = 0;

  constructor(readonly plan: Plan) {
    this.result = { points: [] };
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
          result: state.result,
          rounds: state.rounds
        };
      }
      case LessonActions.COMPLETE: {
        let [rounds, stage, points] = action.payload;
        let newPoints = state.result.points.slice();
        newPoints[stage] = points;
        return _.defaults({
          stage: undefined,
          result: { points: newPoints },
          rounds: state.rounds + rounds
        }, state);
      }
      default: {
        return state;
      }
    }
  }
}
