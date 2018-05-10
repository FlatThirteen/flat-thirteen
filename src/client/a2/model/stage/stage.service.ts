import * as _ from 'lodash';
import { createSelector } from 'reselect';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../common/app.reducer';
import { Note } from '../../../common/core/note.model';
import { Phrase, PhraseBuilder } from '../../../common/phrase/phrase.model';
import { SoundService } from '../../../common/sound/sound.service';

import { PlayerService } from '../player/player.service';

import { StageScene } from './stage.reducer';
import { Stage } from './stage.actions';

@Injectable()
export class StageService {
  static getStage = (state: AppState) => state.a2.stage;
  static getScene = createSelector(StageService.getStage, stage => stage && stage.scene);
  static getNextScene = createSelector(StageService.getStage, stage => stage && stage.nextScene);
  static getRound = createSelector(StageService.getStage, stage => stage && stage.round);
  static getWrong = createSelector(StageService.getStage, stage => stage && stage.wrong);
  static getActive = createSelector(StageService.getStage, stage => stage && stage.active);
  static getGoalPlayed = createSelector(StageService.getStage, stage => stage && stage.goalPlayed);
  static getGoalPhrase = createSelector(StageService.getStage, stage => stage && stage.goalPhrase);
  static getPlayedPhrase = createSelector(StageService.getStage, stage => stage && stage.playedPhrase);
  static getVictoryPhrase = createSelector(StageService.getStage, stage => stage && stage.victoryPhrase);

  readonly scene$: Observable<StageScene>;
  readonly nextScene$: Observable<StageScene>;
  readonly round$: Observable<number>;
  readonly wrong$: Observable<number>;
  readonly active$: Observable<boolean>;
  readonly goalPlayed$: Observable<boolean>;
  readonly goalPhrase$: Observable<Phrase>;
  readonly playedPhrase$: Observable<Phrase>;
  readonly victoryPhrase$: Observable<Phrase>;

  private _scene: StageScene;
  private nextScene: StageScene;
  private _round: number;
  private _wrong: number;
  private _active: boolean;
  private _goalPlayed: boolean;
  private goalPhrase: Phrase;
  private playedPhrase: Phrase;
  private victoryPhrase: Phrase;
  private _beatWrong: number;
  private _goalNotes: number;

  constructor(private store: Store<AppState>, private player: PlayerService,
              private sound: SoundService) {
    this.scene$ = this.store.select(StageService.getScene);
    this.nextScene$ = this.store.select(StageService.getNextScene);
    this.round$ = this.store.select(StageService.getRound);
    this.wrong$ = this.store.select(StageService.getWrong);
    this.active$ = this.store.select(StageService.getActive);
    this.goalPlayed$ = this.store.select(StageService.getGoalPlayed);
    this.goalPhrase$ = this.store.select(StageService.getGoalPhrase);
    this.playedPhrase$ = this.store.select(StageService.getPlayedPhrase);
    this.victoryPhrase$ = this.store.select(StageService.getVictoryPhrase);

    this.scene$.subscribe(scene => { this._scene = scene; });
    this.nextScene$.subscribe(nextScene => { this.nextScene = nextScene; });
    this.round$.subscribe(round => { this._round = round; });
    this.wrong$.subscribe(wrong => { this._wrong = wrong; });
    this.active$.subscribe(active => { this._active = active; });
    this.goalPlayed$.subscribe(goalPlayed => { this._goalPlayed = goalPlayed; });
    this.goalPhrase$.subscribe(goalPhrase => {
      this.goalPhrase = goalPhrase;
      this._goalNotes = goalPhrase && goalPhrase.numNotes();
    });
    this.playedPhrase$.subscribe(playedPhrase => { this.playedPhrase = playedPhrase; });
    this.victoryPhrase$.subscribe(victoryPhrase => { this.victoryPhrase = victoryPhrase; });
  }

  listen() {
    this.store.dispatch(new Stage.ListenAction());
  }

  next(phraseBuilder?: PhraseBuilder) {
    this.store.dispatch(new Stage.NextAction({ phraseBuilder }));
  }

  victory() {
    this.store.dispatch(new Stage.VictoryAction({ basePoints: this.basePoints }));
  }

  play(note: Note, beat: number, tick: number, time?: number) {
    this.sound.play(note.soundName, time);
    this.store.dispatch(new Stage.PlayAction({ note, beat, tick }));
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
      case 'play':
        _.forEach(playedNotes, note => {
          this.play(note, beat, tick, time);
        });
        break;
      case 'loop':
        _.forEach(playedNotes, playNote);
        break;
      default:
    }
  }

  get active() {
    return this._active;
  }

  get round() {
    return this._round;
  }

  get wrong() {
    return this._wrong;
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

  get isPlay() {
    return this._scene === 'play';
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

  get beatWrong() {
    return this._beatWrong;
  }

  get goalPlayed() {
    return this._goalPlayed;
  }

  get goalNotes() {
    return this._goalNotes;
  }

  get basePoints() {
    return Math.max(110 - (10 * this._round), 50) - Math.min(10 * this._wrong, 40);
  }
}
