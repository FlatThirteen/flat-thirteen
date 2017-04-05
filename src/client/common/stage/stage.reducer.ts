import * as _ from 'lodash';
import { Action } from '@ngrx/store';

import { LessonActions } from '../lesson/lesson.actions';
import { Phrase } from '../phrase/phrase.model';
import { PlayerActions } from '../player/player.actions';
import { StageActions } from './stage.actions';

export type StageScene = 'demo' | 'loop' | 'count' | 'goal' | 'play' | 'victory';

export class StageState {
  readonly round: number = 0;
  readonly active: boolean = true;
  readonly goalPhrase: Phrase = null;
  readonly playedPhrase: Phrase = null;

  constructor(readonly scene: StageScene, readonly nextScene: StageScene) {}

  static reducer(state: StageState, action: Action): StageState {
    switch (action.type) {
      case LessonActions.INIT:
      case LessonActions.RESET: {
        return new StageState('demo', 'count');
      }
      case LessonActions.ADVANCE: {
        return new StageState('count', 'goal');
      }
      case StageActions.LISTEN: {
        if (state.scene === 'demo') {
          return new StageState('loop', 'loop');
        } else {
          return _.defaults({
            active: true,
            nextScene: 'play'
          }, state);
        }
      }
      case StageActions.NEXT: {
        let phraseBuilder = action.payload;
        return {
          scene: state.nextScene,
          nextScene: 'goal',
          round: phraseBuilder ? 0 : state.round + 1,
          active: false,
          goalPhrase: phraseBuilder ? phraseBuilder.build() : state.goalPhrase,
          playedPhrase: new Phrase()
        };
      }
      case StageActions.VICTORY: {
        return _.defaults({
          scene: 'victory',
          nextScene: 'count'
        }, state);
      }
      case StageActions.PLAY: {
        let [note, beat, tick] = action.payload;
        let playedPhrase = _.cloneDeep(state.playedPhrase).add(note, beat, tick);
        return _.defaults({
          playedPhrase: playedPhrase,
          nextScene: _.isEqual(state.goalPhrase, playedPhrase) ? 'victory' : state.nextScene
        }, state);
      }
      case PlayerActions.SET:
      case PlayerActions.UNSET:
      case PlayerActions.PULSES: {
        return _.defaults({
          active: true,
          nextScene: state.scene === 'loop' ? 'loop' : 'play'
        }, state);
      }
      default: {
        return state;
      }
    }
  }
}
