import * as _ from 'lodash';

import { Phrase } from '../../../common/phrase/phrase.model';
import { VictoryPhraseBuilder } from '../../../common/phrase/victory.phrase';

import { Penalty } from './penalty.model';
import { Stage } from './stage.actions';

export type StageScene = 'standby' | 'count' | 'goal' | 'playback' | 'victory' | '';

export class StageState {
  readonly scene: StageScene = 'standby';
  readonly nextScene: StageScene = 'standby';
  readonly goalCount: number = 0;
  readonly playbackCount: number = 0;
  readonly goalPenalty: Penalty;
  readonly wrongPenalty: Penalty;
  readonly playedPhrase: Phrase = null;
  readonly victoryPhrase: Phrase = null;
  readonly goalPlayed: boolean = false;

  constructor(readonly goalPhrase: Phrase, readonly backingPhrase: Phrase) {
    this.goalPenalty = new Penalty(45);
    this.wrongPenalty = new Penalty(50);
  }

  static reducer(state: StageState, action: Stage.Actions): StageState {
    switch(action.type) {
      case Stage.STANDBY:
        let { goalPhrase, backingPhrase } = action.payload;
        if (goalPhrase) {
          return new StageState(goalPhrase, backingPhrase);
        } else {
          return _.defaults({
            scene: 'standby',
            nextScene: 'standby'
          }, state)
        }
      case Stage.COUNT:
        return _.defaults({
          scene: 'count',
          nextScene: action.payload.nextScene
        }, state);
      case Stage.GOAL:
        let { penalty } = action.payload;
        return _.defaults({
          scene: 'goal',
          nextScene: action.payload.nextScene,
          goalCount: state.goalCount + 1,
          goalPenalty: !penalty ? state.goalPenalty : state.goalPenalty.accrue(penalty)
        }, state);
      case Stage.PLAYBACK:
        return _.defaults({
          scene: 'playback',
          nextScene: action.payload.nextScene,
          playbackCount: state.playbackCount + 1,
          playedPhrase: new Phrase()
        }, state);
      case Stage.VICTORY:
        let { basePoints } = action.payload;
        return _.defaults({
          scene: 'victory',
          nextScene: 'standby',
          victoryPhrase: new VictoryPhraseBuilder(_.floor(basePoints / 10)).build()
        }, state);
      case Stage.NEXT:
        return _.defaults({
          nextScene: action.payload.nextScene
        }, state);
      case Stage.PLAY:
        let { note, beat, tick } = action.payload;
        let playedPhrase = !state.playedPhrase ? null :
            _.cloneDeep(state.playedPhrase).add(note, beat, tick);
        let goalPlayed = _.isEqual(state.goalPhrase, playedPhrase);
        return _.defaults({
          playedPhrase: playedPhrase,
          goalPlayed: goalPlayed
        }, state);
      case Stage.WRONG:
        return _.defaults({
          wrongPenalty: state.wrongPenalty.accrue(action.payload.penalty)
        }, state);
      default: {
        return state;
      }
    }
  }
}
