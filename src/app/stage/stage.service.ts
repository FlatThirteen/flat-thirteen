import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";

import { Observable } from "rxjs";
import { createSelector } from 'reselect';

import { AppState } from "../app.reducer";

import { Note } from "../sound/sound";
import { Phrase, PhraseBuilder } from "../phrase/phrase.model";
import { PlayerService } from "../player/player.service";
import { SoundService } from "../sound/sound.service";
import { StageScene } from "./stage.reducer";
import { StageActions } from "./stage.actions";

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

  private scene_: StageScene;
  private nextScene: StageScene;
  private round_: number;
  private active: boolean;
  private goalPhrase: Phrase;
  private playedPhrase: Phrase;
  private goalPlayed_: boolean;
  private goalNotes_: number;

  constructor(private store: Store<AppState>, private stage: StageActions,
      private player: PlayerService, private sound: SoundService) {
    this.scene$ = this.store.select(StageService.getScene);
    this.nextScene$ = this.store.select(StageService.getNextScene);
    this.round$ = this.store.select(StageService.getRound);
    this.active$ = this.store.select(StageService.getActive);
    this.goalPhrase$ = this.store.select(StageService.getGoalPhrase);
    this.playedPhrase$ = this.store.select(StageService.getPlayedPhrase);

    this.scene$.subscribe(scene => { this.scene_ = scene });
    this.nextScene$.subscribe(nextScene => { this.nextScene = nextScene });
    this.round$.subscribe(round => { this.round_ = round });
    this.active$.subscribe(active => { this.active = active });
    this.goalPhrase$.subscribe(goalPhrase => {
      this.goalPhrase = goalPhrase;
      this.goalPlayed_ = false;
      this.goalNotes_ = goalPhrase && goalPhrase.numNotes();
    });
    this.playedPhrase$.subscribe(playedPhrase => {
      this.playedPhrase = playedPhrase;
      this.goalPlayed_ = playedPhrase && _.isEqual(this.goalPhrase, this.playedPhrase);
    });
  }

  init() {
    this.store.dispatch(this.stage.init());
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
    if (this.scene_ === 'Goal') {
      let notes = this.goalPhrase.getNotes(beat, tick);
      for (let note of notes) {
        this.sound.play(note.soundName, time);
      }
    } else if (this.scene_ === 'Play') {
      _.forEach(this.player.notesAt(beat, tick), note => {
        if (note) {
          this.play(note, beat, tick, time);
        }
      });
    }
  }

  get round() {
    return this.round_;
  }

  get scene() {
    return this.scene_;
  }

  get isDemo() {
    return this.scene_ === 'Demo';
  }

  get showCount() {
    return this.scene_ === 'Count' || this.scene_ === 'Victory';
  }

  get showPosition() {
    return this.scene_ === 'Goal' || this.scene_ === 'Play';
  }

  get goalPlayed() {
    return this.goalPlayed_;
  }

  get goalNotes() {
    return this.goalNotes_;
  }
}
