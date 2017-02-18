import * as _ from 'lodash';
import { Action } from '@ngrx/store';

import { StageActions } from './stage.actions';

export class StageState {
  static SceneDemo = "Demo";
  static SceneCount = "Count";
  static SceneGoal = "Goal";
  static ScenePlay = "Play";
  static SceneVictory = "Victory";

  readonly scene: string;
  readonly nextScene: string;
  readonly round: number;
  readonly active: boolean;
  readonly inactiveRounds: number;

  constructor(scene: string, nextScene: string, round: number, active: boolean, inactiveRounds: number) {
    this.scene = scene;
    this.nextScene = nextScene;
    this.round = 0;
    this.active = false;
    this.inactiveRounds = 0;
  }

  static reducer(state: StageState, action: Action): StageState {
    switch (action.type) {
      case StageActions.INIT: {
        return new StageState(StageState.SceneDemo, StageState.SceneCount, 0, false, 0);
      }
      case StageActions.RESET: {
        return <StageState>_.defaultsDeep({
            scene: StageState.SceneDemo,
            nextScene: StageState.SceneCount,
            round: 0,
            active: false,
            inactiveRounds: 0
          }, state);
      }
      case StageActions.SETACTIVE: {
        return <StageState>_.defaultsDeep({
          scene: state.scene,
          nextScene: state.nextScene,
          round: state.round,
          active: true,
          inactiveRounds: state.inactiveRounds
        }, state);
      }
      case StageActions.NEXTROUND: {
        let [playedGoal] = action.payload;
        return StageState.nextRound(state, playedGoal);
      }
      default: {
        return state;
      }
    }
  }

  static nextRound(state: StageState, playedGoal: boolean) {
    let nextScene = state.nextScene;
    let active = state.active;
    let inactiveRounds = state.inactiveRounds;

    if (playedGoal) {
      nextScene = StageState.SceneVictory;
    } else {
      if (active) {
        inactiveRounds = 0;
      } else if (inactiveRounds >= 3) {
        nextScene = StageState.SceneGoal;
      }
    }

    let round = state.round;
    let scene = nextScene;
    active = false;
    switch(scene) {
      case StageState.SceneCount:
      case StageState.SceneVictory:
        nextScene = StageState.SceneGoal;
        round = 0;
        break;
      case StageState.SceneGoal:
        nextScene = StageState.ScenePlay;
        inactiveRounds = 0;
        break;
      case StageState.ScenePlay:
        round++;
        if (!active) {
          inactiveRounds++;
        } else {
          inactiveRounds = 0;
        }
    }

    return <StageState>_.defaultsDeep({
      scene: scene,
      nextScene: nextScene,
      round: round,
      active: active,
      inactiveRounds: inactiveRounds
    }, state);
  }
}