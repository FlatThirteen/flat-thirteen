import * as _ from 'lodash';

import { Action } from '@ngrx/store';

import { Grid } from '../../a2/main/grid/grid.model';
import { PlayerActions } from './player.actions';
import { StageActions } from '../stage/stage.actions';
import { Surface } from '../surface/surface.model';

export class PlayerState {
  readonly selected?: string;
  readonly beat?: number;
  readonly cursor: number;
  readonly touched: boolean;

  constructor(readonly data: _.Dictionary<Surface.Data[]>) {
    this.selected = null;
    this.beat = null;
    this.cursor = 0;
    this.touched = false;
  }

  static reducer(state: PlayerState, action: Action): PlayerState {
    switch (action.type) {
      case PlayerActions.INIT: {
        return new PlayerState(action.payload);
      }
      case PlayerActions.SELECT: {
        let [surface, key, cursor] = action.payload;
        if (surface instanceof Grid) {
          let beat = surface.beatPulseFor(cursor)[0];
          cursor = surface.wrapCursor(cursor);
          return <PlayerState>_.defaults({
            selected: key,
            beat: beat,
            cursor: cursor
          }, state);
        } else {
          return state;
        }
      }
      case StageActions.VICTORY:
      case PlayerActions.UNSELECT: {
        if (!state.selected) {
          return state;
        } else {
          return _.defaults({ selected: null, beat: null, cursor: 0 }, state);
        }
      }
      case PlayerActions.SET: {
        let [surface, key, cursor] = action.payload;
        if (surface instanceof Grid) {
          let beat = surface.beatPulseFor(cursor)[0];
          let data = surface.dataFor(beat, state.data);
          return <PlayerState>_.defaultsDeep({
            selected: key,
            beat: beat,
            cursor: cursor,
            data: surface.set(data, key, cursor),
            touched: true
          }, state);
        } else {
          return state;
        }
      }
      case PlayerActions.UNSET: {
        let [surface, key, cursor] = action.payload;
        if (surface instanceof Grid) {
          cursor = surface.wrapCursor(cursor);
          let beat = surface.beatPulseFor(cursor)[0];
          let data = surface.dataFor(beat, state.data);
          return <PlayerState>_.defaultsDeep({
            cursor: cursor,
            data: surface.unset(data, cursor)
          }, state);
        } else {
          return state;
        }
      }
      default: {
        return state;
      }
    }
  }
}
