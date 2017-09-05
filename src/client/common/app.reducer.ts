import { compose } from '@ngrx/core/compose';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { storeLogger } from 'ngrx-store-logger';
import { routerReducer, RouterState } from '@ngrx/router-store';

import { LessonState as A1LessonState } from '../a1/model/lesson/lesson.reducer';
import { PlayerState as A1PlayerState } from '../a1/model/player/player.reducer';
import { StageState as A1StageState} from '../a1/model/stage/stage.reducer';
import { LessonState } from './lesson/lesson.reducer';
import { PlayerState } from './player/player.reducer';
import { StageState } from './stage/stage.reducer';

export interface AppState {
  a1: {
    lesson: A1LessonState,
    stage: A1StageState,
    player: A1PlayerState,
  };
  lesson: LessonState;
  stage: StageState;
  player: PlayerState;
  router: RouterState;
}

export const reducers = {
  a1: combineReducers({
    lesson: A1LessonState.reducer,
    stage: A1StageState.reducer,
    player: A1PlayerState.reducer
  }),
  lesson: LessonState.reducer,
  stage: StageState.reducer,
  player: PlayerState.reducer,
  router: routerReducer,
};

// Generate a reducer to set the root state in dev mode for HMR
function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    if (action.type === 'SET_ROOT_STATE') {
      return action.payload;
    }
    return reducer(state, action);
  };
}

const DEV_REDUCERS = [stateSetter, storeFreeze];
// set in constants.js file of project root
if (['logger', 'both'].indexOf(STORE_DEV_TOOLS) !== -1 ) {
    DEV_REDUCERS.push(storeLogger());
}

const developmentReducer = compose(...DEV_REDUCERS, combineReducers)(reducers);
const productionReducer = compose(combineReducers)(reducers);

export function rootReducer(state: any, action: any) {
  if (ENV !== 'development') {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}
