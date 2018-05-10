import * as _ from 'lodash';
import { createSelector } from 'reselect';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../common/app.reducer';
import { Note } from '../../../common/core/note.model';
import { Phrase } from '../../../common/phrase/phrase.model';
import { SoundService } from '../../../common/sound/sound.service';

import { PlayerService } from '../player/player.service';

import { Penalty } from './penalty.model';
import { StageScene } from './stage.reducer';
import { Stage } from './stage.actions';

@Injectable()
export class StageService {
  static getStage = (state: AppState) => state.a1.stage;
  static getScene = createSelector(StageService.getStage, stage => stage && stage.scene);
  static getNextScene = createSelector(StageService.getStage, stage => stage && stage.nextScene);
  static getGoalCount = createSelector(StageService.getStage, stage => stage && stage.goalCount);
  static getPlaybackCount = createSelector(StageService.getStage, stage => stage && stage.playbackCount);
  static getGoalPenalty = createSelector(StageService.getStage, stage => stage && stage.goalPenalty);
  static getWrongPenalty = createSelector(StageService.getStage, stage => stage && stage.wrongPenalty);
  static getGoalPhrase = createSelector(StageService.getStage, stage => stage && stage.goalPhrase);
  static getPlayedPhrase = createSelector(StageService.getStage, stage => stage && stage.playedPhrase);
  static getVictoryPhrase = createSelector(StageService.getStage, stage => stage && stage.victoryPhrase);
  static getGoalPlayed = createSelector(StageService.getStage, stage => stage && stage.goalPlayed);

  readonly scene$: Observable<StageScene>;
  readonly nextScene$: Observable<StageScene>;
  readonly goalCount$: Observable<number>;
  readonly playbackCount$: Observable<number>;
  readonly goalPenalty$: Observable<Penalty>;
  readonly wrongPenalty$: Observable<Penalty>;
  readonly goalPhrase$: Observable<Phrase>;
  readonly playedPhrase$: Observable<Phrase>;
  readonly victoryPhrase$: Observable<Phrase>;
  readonly goalPlayed$: Observable<boolean>;

  private _scene: StageScene;
  private _nextScene: StageScene;
  private _goalCount: number;
  private _playbackCount: number;
  private goalPenalty: number;
  private wrongPenalty: number;
  private goalPhrase: Phrase;
  private playedPhrase: Phrase;
  private victoryPhrase: Phrase;
  private _goalPlayed: boolean;

  private _beatWrong: number;
  private _goalNotes: number;

  public goalMinusFx$: Subject<number> = new Subject();
  public playMinusFx$: Subject<number> = new Subject();

  constructor(private store: Store<AppState>, private player: PlayerService,
              private sound: SoundService) {
    this.scene$ = this.store.select(StageService.getScene);
    this.nextScene$ = this.store.select(StageService.getNextScene);
    this.goalCount$ = this.store.select(StageService.getGoalCount);
    this.playbackCount$ = this.store.select(StageService.getPlaybackCount);
    this.goalPenalty$ = this.store.select(StageService.getGoalPenalty);
    this.wrongPenalty$ = this.store.select(StageService.getWrongPenalty);
    this.goalPhrase$ = this.store.select(StageService.getGoalPhrase);
    this.playedPhrase$ = this.store.select(StageService.getPlayedPhrase);
    this.victoryPhrase$ = this.store.select(StageService.getVictoryPhrase);
    this.goalPlayed$ = this.store.select(StageService.getGoalPlayed);

    this.scene$.subscribe(scene => { this._scene = scene; });
    this.nextScene$.subscribe(nextScene => { this._nextScene = nextScene; });
    this.goalPenalty$.subscribe(goalPenalty => {
      if (goalPenalty) {
        if (goalPenalty.difference) {
          this.goalMinusFx$.next(-goalPenalty.difference);
        }
        this.goalPenalty = goalPenalty.current;
      }
    });
    this.wrongPenalty$.subscribe(wrongPenalty => {
      if (wrongPenalty) {
        if (wrongPenalty.difference) {
          this.playMinusFx$.next(-wrongPenalty.difference);
        }
        this.wrongPenalty = wrongPenalty.current;
      }
    });
    this.goalCount$.subscribe(goalCount => { this._goalCount = goalCount; });
    this.playbackCount$.subscribe(playbackCount => { this._playbackCount = playbackCount; });
    this.goalPhrase$.subscribe(goalPhrase => {
      this.goalPhrase = goalPhrase;
      this._goalNotes = goalPhrase && goalPhrase.numNotes();
    });
    this.playedPhrase$.subscribe(playedPhrase => { this.playedPhrase = playedPhrase; });
    this.victoryPhrase$.subscribe(victoryPhrase => { this.victoryPhrase = victoryPhrase; });
    this.goalPlayed$.subscribe(goalPlayed => { this._goalPlayed = goalPlayed; });
  }

  standby(phrase?: Phrase) {
    this.store.dispatch(new Stage.StandbyAction({ phrase }));
  }

  count(nextScene: StageScene) {
    this.store.dispatch(new Stage.CountAction({ nextScene }));
  }

  goal(nextScene: StageScene, penalty: number) {
    this.store.dispatch(new Stage.GoalAction({ nextScene, penalty }));
  }

  playback(nextScene: StageScene) {
    this.store.dispatch(new Stage.PlaybackAction({ nextScene }));
  }

  victory() {
    this.store.dispatch(new Stage.VictoryAction({ basePoints: this.basePoints }));
  }

  next(nextScene: StageScene) {
    this.store.dispatch(new Stage.NextAction({ nextScene }));
  }

  play(note: Note, beat: number, tick: number, time?: number) {
    this.sound.play(note.soundName, time);
    this.store.dispatch(new Stage.PlayAction({ note, beat, tick }));
  }

  wrong(penalty: number) {
    this.store.dispatch(new Stage.WrongAction({ penalty }));
  }

  pulse(time: number, beat: number, tick: number) {
    let playNote = note => {
      this.sound.play(note.soundName, time, note.params);
    };
    let playedNotes = this.player.notesAt(beat, tick);
    let goalNotes = this.goalPhrase && this.goalPhrase.getNotes(beat, tick);
    if (goalNotes) {
      if (_.xor(_.invokeMap(goalNotes, 'toString'), _.invokeMap(playedNotes, 'toString')).length) {
        this._beatWrong = beat;
      } else if (beat !== this._beatWrong) {
        this._beatWrong = null;
      }
    }
    switch (this._scene) {
      case 'victory':
        _.forEach(this.victoryPhrase.getNotes(beat, tick), playNote);
      // falls through
      case 'goal':
        _.forEach(goalNotes, playNote);
        break;
      case 'playback':
        _.forEach(playedNotes, note => {
          this.play(note, beat, tick, time);
        });
        break;
      default:
    }
  }

  get goalCount() {
    return this._goalCount;
  }

  get playbackCount() {
    return this._playbackCount;
  }

  get sceneState() {
    return this._scene + (this._nextScene === 'standby' ? '' : '-' + this._nextScene);
  }

  get isStandby() {
    return this._scene === 'standby';
  }

  get isCount() {
    return this._scene === 'count';
  }

  get isCountGoal() {
    return this._scene === 'count' && this._nextScene === 'goal';
  }

  get isCountPlay() {
    return this._scene === 'count' && this._nextScene === 'playback';
  }

  get isGoal() {
    return this._scene === 'goal';
  }

  get isPlayback() {
    return this._scene === 'playback';
  }

  get nextScene() {
    return this._nextScene;
  }

  get isVictory() {
    return this._scene === 'victory';
  }

  get beatWrong() {
    return this._playbackCount > 0 && this._beatWrong;
  }

  get goalPlayed() {
    return this._goalPlayed;
  }

  get goalNotes() {
    return this._goalNotes;
  }

  get round() {
    return this._goalCount + this._playbackCount - 1;
  }

  get basePoints() {
    return 100 - this.goalPenalty - this.wrongPenalty;
  }
}
