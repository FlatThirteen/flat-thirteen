import * as _ from 'lodash';

import { ticks } from '../core/beat-tick.model';

import { PhraseBuilder, Phrase } from './phrase.model';

const type = 'synth';
const halfTick = ticks(1, 2);

export class BackingPhraseBuilder implements PhraseBuilder {
  private phrases: Phrase[];
  private level: number = 0;

  constructor(private notes: string) {
    this.phrases = [Phrase.from([{ type, notes }])];
  }

  setLevel(level: number): BackingPhraseBuilder {
    if (level < 0) {
      if (this.level + level > 0) {
        level = this.level + level;
      } else {
        level = 0;
      }
    }
    if (!this.phrases[level]) {
      if (!this.phrases[level - 1]) {
        this.setLevel(level - 1);
      }
      let beat = _.random(3);
      let phrase = new Phrase(this.phrases[level - 1]);
      let backNotes = phrase.getNotes(beat, halfTick);
      if (backNotes.length) {
        phrase.removeNotes(beat, halfTick);
      } else {
        let notes = phrase.removeNotes(beat);
        _.forEach(notes, note => {
          let newNote = note.alter({'4n': '8n'});
          if (note.params.duration === '4n') {
            phrase.add(newNote, beat);
          }
          phrase.add(newNote, beat, halfTick);
        })
      }
      this.phrases[level] = phrase;
    }
    this.level = level;
    return this;
  }

  build(): Phrase {
    return this.phrases[this.level];
  }
}
