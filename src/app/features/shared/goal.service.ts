import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { Note } from "./note";
import { Phrase, PhraseBuilder } from "./phrase";

@Injectable()
export class GoalService {
  private goalPhrase: Phrase;
  private playedPhrase: Phrase;

  newGoal(phraseBuilder: PhraseBuilder) {
    this.goalPhrase = phraseBuilder.build();
    this.playedPhrase = new Phrase();
  }

  clearPlayed() {
    this.playedPhrase = new Phrase();
  }

  playGoal(time: number, pulseIndex: number) {
    let notes = this.goalPhrase.getNotes(pulseIndex);
    for (let note of notes) {
      note.play(time);
    }
  }

  playSound(pulseIndex: number, note: Note, time?: number) {
    this.playedPhrase.add(pulseIndex, note);
    note.play(time);
  }

  playedGoal() {
    return _.isEqual(this.goalPhrase, this.playedPhrase);
  }

  numNotes() {
    return this.goalPhrase.numNotes();
  }
}
