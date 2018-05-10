import { ActionReducer, ActionReducerMap, MetaReducer, combineReducers } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { LessonState as A1LessonState } from '../a1/model/lesson/lesson.reducer';
import { PlayerState as A1PlayerState } from '../a1/model/player/player.reducer';
import { ProgressState as A1ProgressState } from '../a1/model/progress/progress.reducer';
import { StageState as A1StageState } from '../a1/model/stage/stage.reducer';
import { LessonState as A2LessonState } from '../a2/model/lesson/lesson.reducer';
import { PlayerState as A2PlayerState } from '../a2/model/player/player.reducer';
import { StageState as A2StageState } from '../a2/model/stage/stage.reducer';

export interface AppState {
  a1: {
    progress: A1ProgressState,
    lesson: A1LessonState,
    stage: A1StageState,
    player: A1PlayerState,
  };
  a2: {
    lesson: A2LessonState;
    stage: A2StageState;
    player: A2PlayerState;
  }
  router: RouterReducerState;
}

export const reducers: ActionReducerMap<AppState> = {
  a1: combineReducers({
    progress: A1ProgressState.reducer,
    lesson: A1LessonState.reducer,
    stage: A1StageState.reducer,
    player: A1PlayerState.reducer
  }),
  a2: combineReducers({
    lesson: A2LessonState.reducer,
    stage: A2StageState.reducer,
    player: A2PlayerState.reducer,
  }),
  router: routerReducer,
};

export function logger(reducer: ActionReducer<AppState>): any {
  // default, no options
  return storeLogger()(reducer);
}

export const metaReducers: MetaReducer<AppState>[] = ENV !== 'development' ? [] :
    [logger];

/*
// Generate a reducer to set the root state in dev mode for HMR
function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    if (action.type === 'SET_ROOT_STATE') {
      return action.payload;
    }
    return reducer(state, action);
  };
}
*/
