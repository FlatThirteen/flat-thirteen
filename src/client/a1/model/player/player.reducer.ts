import * as _ from 'lodash';

import { Surface } from '../../../common/surface/surface.model';

import { Grid } from '../../main/grid/grid.model';

import { Stage } from '../stage/stage.actions';

import { Player } from './player.actions';

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

  static reducer(state: PlayerState, action: Player.Actions | Stage.VictoryAction): PlayerState {
    switch (action.type) {
      case Player.INIT: {
        return new PlayerState(action.payload.initialData);
      }
      case Player.SELECT: {
        let { key, surface, cursor } = action.payload;
        if (surface instanceof Grid) {
          cursor = surface.wrapCursor(cursor);
          let beat = surface.beatPulseFor(cursor)[0];
          return <PlayerState>_.defaults({
            selected: key,
            beat: beat,
            cursor: cursor
          }, state);
        } else {
          return state;
        }
      }
      case Stage.VICTORY:
      case Player.UNSELECT: {
        if (!state.selected) {
          return state;
        } else {
          return _.defaults({ selected: null, beat: null, cursor: 0 }, state);
        }
      }
      case Player.SET: {
        let { key, surface, cursor } = action.payload;
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
      case Player.UNSET: {
        let { surface, cursor } = action.payload;
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
