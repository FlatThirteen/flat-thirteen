import * as _ from 'lodash';

import { Phrase } from '../phrase/phrase.model';
import { Surface } from '../surface/surface.model';

import { Lesson } from './lesson.actions';

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

  static reducer(state: LessonState, action: Lesson.Actions): LessonState {
    switch (action.type) {
      case Lesson.INIT: {
        let { plan } = action.payload;
        return new LessonState(plan);
      }
      case Lesson.RESET: {
        return new LessonState(state.plan);
      }
      case Lesson.ADVANCE: {
        let { rounds } = action.payload;
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
