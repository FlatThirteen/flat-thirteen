import { Action } from '@ngrx/store';

import { Surface } from '../../../common/surface/surface.model';

export namespace Player {

  export const INIT = '[A1 PLAYER] Init';
  export class InitAction implements Action {
    readonly type = Player.INIT;
    constructor(public payload: { initialData: _.Dictionary<Surface.Data[]> }) {}
  }

  export const SELECT = '[A1 PLAYER] Select';
  export class SelectAction implements Action {
    readonly type = Player.SELECT;
    constructor(public payload: { key: string, surface: Surface, cursor?: number }) {}
  }

  export const UNSELECT = '[A1 PLAYER] Unselect';
  export class UnselectAction implements Action {
    readonly type = Player.UNSELECT;
  }

  export const SET = '[A1 PLAYER] Set';
  export class SetAction implements Action {
    readonly type = Player.SET;
    constructor(public payload: {
      key: string,
      surface: Surface,
      cursor: number
    }) {}
  }

  export const UNSET = '[A1 PLAYER] Unset';
  export class UnsetAction implements Action {
    readonly type = Player.UNSET;
    constructor(public payload: {
      surface: Surface,
      cursor: number
    }) {}
  }

  export type Actions = InitAction | SelectAction | UnselectAction | SetAction |
      UnsetAction;
}

