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
  static getScene = createSelector(StageService.getStage, stage => stage && stage.scene);
  static getNextScene = createSelector(StageService.getStage, stage => stage && stage.nextScene);
  static getRound = createSelector(StageService.getStage, stage => stage && stage.round);
  static getActive = createSelector(StageService.getStage, stage => stage && stage.active);
  static getInactiveRounds = createSelector(StageService.getStage, stage => stage && stage.inactiveRounds);

  private scene$: Observable<string>;
  private nextScene$: Observable<string>;
  private round$: Observable<number>;
  private active$: Observable<boolean>;
  private inactiveRounds$: Observable<number>;

  private scene: string;
  private nextScene: string;
  private round: number;
  private active: boolean;
  private inactiveRounds: number;

  constructor(private store: Store<AppState>, private stage: StageActions) {
    this.scene$ = this.store.select(StageService.getScene);
    this.nextScene$ = this.store.select(StageService.getNextScene);
    this.round$ = this.store.select(StageService.getRound);
    this.active$ = this.store.select(StageService.getActive);
    this.inactiveRounds$ = this.store.select(StageService.getInactiveRounds);

    this.scene$.subscribe(scene => { this.scene = scene });
    this.nextScene$.subscribe(nextScene => { this.nextScene = nextScene });
    this.round$.subscribe(round => { this.round = round });
    this.active$.subscribe(active => { this.active = active });
    this.inactiveRounds$.subscribe(inactiveRounds => { this.inactiveRounds = inactiveRounds });
  }

  init() {
    this.store.dispatch(this.stage.init());
  }

  reset() {
    this.store.dispatch(this.stage.reset());
  }

  nextRound(playedGoal: boolean = false) {   
    this.store.dispatch(this.stage.nextRound(playedGoal));
  }

  getRound() {
    return this.round;
  }

  sceneName() {
    return this.scene;
  }

  isDemo() {
    return this.scene === StageState.SceneDemo;
  }

  isGoal() {
    return this.scene === StageState.SceneGoal;
  }

  isPlay() {
    return this.scene === StageState.ScenePlay;
  }

  shouldShowCount() {
    return this.scene === StageState.SceneCount || this.scene === StageState.SceneVictory;
  }

  shouldShowPosition() {
    return this.scene === StageState.SceneGoal || this.scene === StageState.ScenePlay;
  }
}