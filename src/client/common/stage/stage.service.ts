import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { createSelector } from 'reselect';

import { AppState } from '../app.reducer';

import { Note } from '../sound/sound';
import { Phrase, PhraseBuilder } from '../phrase/phrase.model';
import { PlayerService } from '../player/player.service';
import { SoundService } from '../sound/sound.service';
import { StageScene } from './stage.reducer';
import { StageActions } from './stage.actions';

@Injectable()
export class StageService {
  static getStage = (state: AppState) => state.stage;
  static getScene = createSelector(StageService.getStage, stage => stage && stage.scene);
  static getNextScene = createSelector(StageService.getStage, stage => stage && stage.nextScene);
  static getRound = createSelector(StageService.getStage, stage => stage && stage.round);
  static getActive = createSelector(StageService.getStage, stage => stage && stage.active);
  static getGoalPhrase = createSelector(StageService.getStage, stage => stage && stage.goalPhrase);
  static getPlayedPhrase = createSelector(StageService.getStage, stage => stage && stage.playedPhrase);

  readonly scene$: Observable<StageScene>;
  readonly nextScene$: Observable<StageScene>;
  readonly round$: Observable<number>;
  readonly active$: Observable<boolean>;
  readonly goalPhrase$: Observable<Phrase>;
  readonly playedPhrase$: Observable<Phrase>;

  private _scene: StageScene;
  private nextScene: StageScene;
  private _round: number;
  private _active: boolean;
  private goalPhrase: Phrase;
  private playedPhrase: Phrase;
  private _goalPlayed: boolean;
  private _goalNotes: number;

  constructor(private store: Store<AppState>, private stage: StageActions,
              private player: PlayerService, private sound: SoundService) {
    this.scene$ = this.store.select(StageService.getScene);
    this.nextScene$ = this.store.select(StageService.getNextScene);
    this.round$ = this.store.select(StageService.getRound);
    this.active$ = this.store.select(StageService.getActive);
    this.goalPhrase$ = this.store.select(StageService.getGoalPhrase);
    this.playedPhrase$ = this.store.select(StageService.getPlayedPhrase);

    this.scene$.subscribe(scene => { this._scene = scene; });
    this.nextScene$.subscribe(nextScene => { this.nextScene = nextScene; });
    this.round$.subscribe(round => { this._round = round; });
    this.active$.subscribe(active => { this._active = active; });
    this.goalPhrase$.subscribe(goalPhrase => {
      this.goalPhrase = goalPhrase;
      this._goalPlayed = false;
      this._goalNotes = goalPhrase && goalPhrase.numNotes();
    });
    this.playedPhrase$.subscribe(playedPhrase => {
      this.playedPhrase = playedPhrase;
      this._goalPlayed = playedPhrase && _.isEqual(this.goalPhrase, this.playedPhrase);
    });
  }

  listen() {
    this.store.dispatch(this.stage.listen());
  }

  next(phraseBuilder?: PhraseBuilder) {
    this.store.dispatch(this.stage.next(phraseBuilder));
  }

  victory() {
    this.store.dispatch(this.stage.victory());
  }

  play(note: Note, beat: number, tick: number, time?: number) {
    this.sound.play(note.soundName, time);
    this.store.dispatch(this.stage.play(note, beat, tick));
  }

  pulse(time: number, beat: number, tick: number) {
    if (this._scene === 'goal' || this._scene === 'victory') {
      for (let note of this.goalPhrase.getNotes(beat, tick)) {
        this.sound.play(note.soundName, time);
      }
    } else if (this._scene === 'play') {
      _.forEach(this.player.notesAt(beat, tick), note => {
        if (note) {
          this.play(note, beat, tick, time);
        }
      });
    } else if (this._scene === 'loop') {
      _.forEach(this.player.notesAt(beat, tick), note => {
        if (note) {
          this.sound.play(note.soundName, time);
        }
      });
    }
  }

  get active() {
    return this._active;
  }

  get round() {
    return this._round;
  }

  get scene() {
    return this._scene;
  }

  get isDemo() {
    return this._scene === 'demo';
  }

  get isLoop() {
    return this._scene === 'loop';
  }

  get isCount() {
    return this._scene === 'count';
  }

  get isGoal() {
    return this._scene === 'goal';
  }

  get isVictory() {
    return this._scene === 'victory';
  }

  showBall(lastBeat: boolean) {
    return this.isLoop || (lastBeat ? this.nextScene === 'play' : this._scene === 'play');
  }

  get showPosition() {
    return this._scene === 'loop' || this._scene === 'goal' || this._scene === 'play';
  }

  get goalPlayed() {
    return this._goalPlayed;
  }

  get goalNotes() {
    return this._goalNotes;
  }
}
