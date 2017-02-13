import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";

import { Observable } from "rxjs";
import { createSelector } from 'reselect';

import { AppState } from "../reducers/index";

import { StageActions } from "./stage.actions";

@Injectable()
export class StageService {
  static getStage = (state: AppState) => state.stage;
  static getState = createSelector(StageService.getStage, stage => stage && stage._state);
  static getNextState = createSelector(StageService.getStage, stage => stage && stage._nextState);
  static getRound = createSelector(StageService.getStage, stage => stage && stage._round);
  static getActive = createSelector(StageService.getStage, stage => stage && stage._active);
  static getInactiveRounds = createSelector(StageService.getStage, stage => stage && stage._inactiveRounds);

  static StateDemo = "Demo";
  static StateCount = "Count";
  static StateGoal = "Goal";
  static StatePlay = "Play";
  static StateVictory = "Victory";

  private state$: Observable<string>;
  private nextState$: Observable<string>;
  private round$: Observable<number>;
  private active$: Observable<boolean>;
  private inactiveRounds$: Observable<number>;

  private _state: string;
  private _nextState: string;
  private _round: number;
  private _active: boolean;
  private _inactiveRounds: number;

  constructor(private store: Store<AppState>, private stage: StageActions) {
    this.state$ = this.store.select(StageService.getState);
    this.nextState$ = this.store.select(StageService.getNextState);
    this.round$ = this.store.select(StageService.getRound);
    this.active$ = this.store.select(StageService.getActive);
    this.inactiveRounds$ = this.store.select(StageService.getInactiveRounds);

    this.state$.subscribe(state => { this._state = state });
    this.nextState$.subscribe(nextState => { this._nextState = nextState });
    this.round$.subscribe(round => { this._round = round });
    this.active$.subscribe(active => { this._active = active });
    this.inactiveRounds$.subscribe(inactiveRounds => { this._inactiveRounds = inactiveRounds });
  }

  init() {
    this.store.dispatch(this.stage.init());
  }

  reset() {
    this.store.dispatch(this.stage.reset(StageService.StateDemo, StageService.StateCount, 0, false, 0));
  }

  activate() {
    this.store.dispatch(this.stage.activate());
  }

  nextRound(playedGoal: boolean = false) {
    let state = this._state;
    let nextState = this._nextState;
    let round = this._round;
    let active = this._active;
    let inactiveRounds = this._inactiveRounds;

    if (playedGoal) {
      nextState = StageService.StateVictory;
    } else {
      if (active) {
        inactiveRounds = 0;
      } else if (inactiveRounds >= 3) {
        nextState = StageService.StateGoal;
      }
    }

    state = nextState;
    active = false;
    switch(state) {
      case StageService.StateCount:
      case StageService.StateVictory:
        nextState = StageService.StateGoal;
        round = 0;

        break;
      case StageService.StateGoal:
        nextState = StageService.StatePlay;
        inactiveRounds = 0;
        break;
      case StageService.StatePlay:
        round++;
        if (!active) {
          inactiveRounds++;
        } else {
          inactiveRounds = 0;
        }
    }

    this.store.dispatch(this.stage.nextRound(state, nextState, round, active, inactiveRounds));
  }

  getRound() {
    return this._round;
  }

  stateName() {
    return this._state;
  }

  isDemo() {
    return this._state === StageService.StateDemo;
  }

  isGoal() {
    return this._state === StageService.StateGoal;
  }

  isPlay() {
    return this._state === StageService.StatePlay;
  }

  shouldShowCount() {
    return this._state === StageService.StateCount || this._state === StageService.StateVictory;
  }

  shouldShowPosition() {
    return this._state === StageService.StateGoal || this._state === StageService.StatePlay;
  }
}