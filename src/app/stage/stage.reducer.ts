import * as _ from 'lodash';
import { Action } from '@ngrx/store';

import { StageActions } from './stage.actions';

export class StageState {
  readonly _state: string;
  readonly _nextState: string;
  readonly _round: number;
  readonly _active: boolean;
  readonly _inactiveRounds: number;

  //constructor(state: string, nextState: string, round: number, active: boolean, inactiveRounds: number) {
  constructor() {
    this._state = null;
    this._nextState = null;
    this._round = 0;
    this._active = false;
    this._inactiveRounds = 0;
  }

  static reducer(state: StageState, action: Action): StageState {
    switch (action.type) {
      case StageActions.INIT: {
        return new StageState();
      }
      case StageActions.RESET: {
        let [stageState, nextState, round, active, inactiveRounds] = action.payload;
        return <StageState>_.defaultsDeep({
            _state: stageState,
            _nextState: nextState,
            _round: round,
            _active: active,
            _inactiveRounds: inactiveRounds
          }, state);
      }
      case StageActions.ACTIVATE: {
        let active = action.payload;
        return <StageState>_.defaultsDeep({
          _state: state._state,
          _nextState: state._nextState,
          _round: state._round,
          _active: active,
          _inactiveRounds: state._inactiveRounds
        }, state);
      }
    }
  }
}