import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { Note } from "./sound/sound";
import { Phrase, PhraseBuilder } from "./phrase";
import { SoundService } from "./sound/sound.service";

@Injectable()
export class GoalService {
  private goalPhrase: Phrase;
  private playedPhrase: Phrase;

  constructor(private sound: SoundService) {}

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
      this.sound.play(note.soundName, time);
    }
  }

  playSound(pulseIndex: number, note: Note, time?: number) {
    if (note) {
      this.playedPhrase.add(pulseIndex, note);
      this.sound.play(note.soundName, time);
    }
  }

  playedGoal() {
    return _.isEqual(this.goalPhrase, this.playedPhrase);
  }

  numNotes() {
    return this.goalPhrase ? this.goalPhrase.numNotes() : 0;
  }

  goalNotes() {
    return this.goalPhrase && this.goalPhrase.toString();
  }
}
