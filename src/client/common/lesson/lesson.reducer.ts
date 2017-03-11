import * as _ from 'lodash';

import { Action } from '@ngrx/store';

import { LessonActions } from './lesson.actions';
import { Surface } from '../surface/surface.model';

export interface EndCondition {
  time?: string;
  stages?: number;
}

export class LessonState {
  readonly stages: number = 0;
  readonly rounds: number = 0;

  constructor(readonly surfaces: Surface[], readonly end: EndCondition) {}

  static reducer(state: LessonState, action: Action): LessonState {
    switch (action.type) {
      case LessonActions.INIT: {
        let [surfaces, end] = action.payload;
        return new LessonState(surfaces, end);
      }
      case LessonActions.RESET: {
        return new LessonState(state.surfaces, state.end);
      }
      case LessonActions.ADVANCE: {
        let rounds = action.payload;
        return _.defaults({
          stages: state.stages + 1,
          rounds: state.rounds + rounds
        }, state);
      }
      default: {
        return state;
      }
    }
  }
}
