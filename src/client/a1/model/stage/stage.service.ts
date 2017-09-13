import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { createSelector } from 'reselect';

import { AppState } from '../../../common/app.reducer';

import { Note } from '../../../common/core/note.model';
import { Phrase } from '../../../common/phrase/phrase.model';
import { PlayerService } from '../player/player.service';
import { SoundService } from '../../../common/sound/sound.service';
import { StageScene } from './stage.reducer';
import { StageActions } from './stage.actions';

@Injectable()
export class StageService {
  static getStage = (state: AppState) => state.a1.stage;
  static getScene = createSelector(StageService.getStage, stage => stage && stage.scene);
  static getGoalCount = createSelector(StageService.getStage, stage => stage && stage.goalCount);
  static getPlaybackCount = createSelector(StageService.getStage, stage => stage && stage.playbackCount);
  static getGoalPhrase = createSelector(StageService.getStage, stage => stage && stage.goalPhrase);
  static getPlayedPhrase = createSelector(StageService.getStage, stage => stage && stage.playedPhrase);
  static getVictoryPhrase = createSelector(StageService.getStage, stage => stage && stage.victoryPhrase);
  static getGoalPlayed = createSelector(StageService.getStage, stage => stage && stage.goalPlayed);

  readonly scene$: Observable<StageScene>;
  readonly goalCount$: Observable<number>;
  readonly playbackCount$: Observable<number>;
  readonly goalPhrase$: Observable<Phrase>;
  readonly playedPhrase$: Observable<Phrase>;
  readonly victoryPhrase$: Observable<Phrase>;
  readonly goalPlayed$: Observable<boolean>;

  private _scene: StageScene;
  private _goalCount: number;
  private _playbackCount: number;
  private goalPhrase: Phrase;
  private playedPhrase: Phrase;
  private victoryPhrase: Phrase;
  private _goalPlayed: boolean;

  private _beatWrong: number;
  private _goalNotes: number;

  constructor(private store: Store<AppState>, private stage: StageActions,
              private player: PlayerService, private sound: SoundService) {
    this.scene$ = this.store.select(StageService.getScene);
    this.goalCount$ = this.store.select(StageService.getGoalCount);
    this.playbackCount$ = this.store.select(StageService.getPlaybackCount);
    this.goalPhrase$ = this.store.select(StageService.getGoalPhrase);
    this.playedPhrase$ = this.store.select(StageService.getPlayedPhrase);
    this.victoryPhrase$ = this.store.select(StageService.getVictoryPhrase);
    this.goalPlayed$ = this.store.select(StageService.getGoalPlayed);

    this.scene$.subscribe(scene => { this._scene = scene; });
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
    this.store.dispatch(this.stage.standby(phrase));
  }

  goal() {
    this.store.dispatch(this.stage.goal());
  }

  playback() {
    this.store.dispatch(this.stage.playback());
  }

  victory() {
    this.store.dispatch(this.stage.victory(this.basePoints));
  }

  play(note: Note, beat: number, tick: number, time?: number) {
    this.sound.play(note.soundName, time);
    this.store.dispatch(this.stage.play(note, beat, tick));
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

  get scene() {
    return this._scene;
  }

  get isGoal() {
    return this._scene === 'goal';
  }

  get isPlayback() {
    return this._scene === 'playback';
  }
  get isVictory() {
    return this._scene === 'victory';
  }

  get showPosition() {
    return this._scene === 'goal' || this._scene === 'playback';
  }

  get beatWrong() {
    return this._beatWrong;
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
    return Math.max(120 - (10 * this._goalCount), 50) - Math.min(10 * this._playbackCount, 40);
  }
}
