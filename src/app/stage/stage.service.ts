import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";

import { Observable } from "rxjs";
import { createSelector } from 'reselect';

import { AppState } from "../reducers/index";

import { StageState } from "./stage.reducer";
import { StageActions } from "./stage.actions";

@Injectable()
export class StageService {
  static getStage = (state: AppState) => state.stage;
  static getState = createSelector(StageService.getStage, stage => stage && stage._state);
  static getNextState = createSelector(StageService.getStage, stage => stage && stage._nextState);
  static getRound = createSelector(StageService.getStage, stage => stage && stage._round);
  static getActive = createSelector(StageService.getStage, stage => stage && stage._active);
  static getInactiveRounds = createSelector(StageService.getStage, stage => stage && stage._inactiveRounds);

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
    this.store.dispatch(this.stage.reset());
  }

  setActive() {
    this.store.dispatch(this.stage.setActive());
  }

  nextRound(playedGoal: boolean = false) {   
    this.store.dispatch(this.stage.nextRound(playedGoal));
  }

  getRound() {
    return this._round;
  }

  stateName() {
    return this._state;
  }

  isDemo() {
    return this._state === StageState.StateDemo;
  }

  isGoal() {
    return this._state === StageState.StateGoal;
  }

  isPlay() {
    return this._state === StageState.StatePlay;
  }

  shouldShowCount() {
    return this._state === StageState.StateCount || this._state === StageState.StateVictory;
  }

  shouldShowPosition() {
    return this._state === StageState.StateGoal || this._state === StageState.StatePlay;
  }
}