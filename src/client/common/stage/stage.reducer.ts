import * as _ from 'lodash';

import { Lesson } from '../lesson/lesson.actions';
import { Phrase } from '../phrase/phrase.model';
import { VictoryPhraseBuilder } from '../phrase/victory.phrase';
import { Player } from '../player/player.actions';

import { Stage } from './stage.actions';

export type StageScene = 'demo' | 'loop' | 'count' | 'goal' | 'play' | 'victory' | '';

export class StageState {
  readonly round: number = 0;
  readonly wrong: number = 0;
  readonly active: boolean = true;
  readonly goalPlayed: boolean = false;
  readonly goalPhrase: Phrase = null;
  readonly playedPhrase: Phrase = null;
  readonly victoryPhrase: Phrase = null;

  constructor(readonly scene: StageScene, readonly nextScene: StageScene) {}

  static reducer(state: StageState, action: Stage.Actions | Lesson.Actions | Player.Actions): StageState {
    switch (action.type) {
      case Lesson.INIT:
      case Lesson.RESET: {
        return new StageState('demo', 'count');
      }
      case Lesson.ADVANCE: {
        return new StageState('count', 'goal');
      }
      case Stage.LISTEN: {
        if (state.scene === 'demo') {
          return new StageState('loop', 'loop');
        } else {
          return _.defaults({
            active: true,
            nextScene: 'play'
          }, state);
        }
      }
      case Stage.NEXT: {
        let { phraseBuilder } = action.payload;
        return {
          scene: state.nextScene,
          nextScene: 'goal',
          round: state.round + (state.nextScene === 'play' ? 1 : 0),
          wrong: state.wrong + (state.scene === 'play' && state.nextScene === 'goal' ? 1 : 0),
          active: false,
          goalPlayed: false,
          goalPhrase: phraseBuilder ? phraseBuilder.build() : state.goalPhrase,
          playedPhrase: state.nextScene === 'play' ? new Phrase() : state.playedPhrase,
          victoryPhrase: null
        };
      }
      case Stage.VICTORY: {
        let { basePoints } = action.payload;
        return _.defaults({
          scene: 'victory',
          nextScene: 'count',
          victoryPhrase: new VictoryPhraseBuilder(basePoints / 10).build()
        }, state);
      }
      case Stage.PLAY: {
        if (state.scene === 'loop') {
          return state;
        }
        let { note, beat, tick } = action.payload;
        let playedPhrase = _.cloneDeep(state.playedPhrase).add(note, beat, tick);
        let goalPlayed = _.isEqual(state.goalPhrase, playedPhrase);
        return _.defaults({
          playedPhrase: playedPhrase,
          goalPlayed: goalPlayed,
          nextScene: goalPlayed ? 'victory' : state.active ? 'play' : 'goal'
        }, state);
      }
      case Player.SET:
      case Player.UNSET: {
        return _.defaults({
          active: true,
          goalPlayed: false,
          nextScene: state.scene === 'loop' ? 'loop' : 'play'
        }, state);
      }
      default: {
        return state;
      }
    }
  }
}
