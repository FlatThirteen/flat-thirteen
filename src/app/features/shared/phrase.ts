import * as _ from 'lodash';

import { SoundName, Note } from "./sound/sound";


export class Phrase {
  private notes: _.NumericDictionary<Note[]>;
  private noteCount: number;

  constructor() {
    this.notes = {};
    this.noteCount = 0;
  }

  add(pulseIndex: number, note: Note) {
    if (this.notes[pulseIndex]) {
      this.notes[pulseIndex].push(note);
    } else {
      this.notes[pulseIndex] = [note];
    }
    this.noteCount++;
  }

  getNotes(pulseIndex): Note[] {
    return this.notes[pulseIndex] || [];
  }

  numNotes(pulseIndex?: number): number {
    if (pulseIndex === undefined) {
      return this.noteCount;
    } else {
      return this.notes[pulseIndex] ? this.notes[pulseIndex].length : 0;
    }
  }

  toString(): string {
    return _.toString(_.toPairs(this.notes));
  }
}

export interface PhraseBuilder {
  build(): Phrase;
}

/**
 * Builds a phrase that never allows more than one note per pulse.
 * For now, the timing parameter only guarantees a note if the value is 1.
 * Other values are ignored.
 */
export class MonophonicMonotonePhraseBuilder implements PhraseBuilder {
  constructor(private soundNames: SoundName[],
              private timing: _.List<number>,
              private minNotes: number = 2,
              private maxNotes: number = 4) {
    if (minNotes > maxNotes) {
      throw new Error('minNotes should not be bigger than maxNotes');
    } else if (minNotes > timing.length) {
      throw new Error('minNotes should not be bigger than length of timing');
    }
  }

  build(): Phrase {
    let phrase = new Phrase();
    let generate = (generationStrategy: (pulseIndex: number) => number) => {
      for (let pulseIndex in this.timing) {
        if (generationStrategy(Number(pulseIndex))) {
          let soundIndex = _.random(this.soundNames.length - 1);
          phrase.add(Number(pulseIndex), new Note(this.soundNames[soundIndex]));
        }
        if (phrase.numNotes() === this.maxNotes) {
          break;
        }
      }
    };
    // Always place a note if the timing parameter is 1 for the current pulse.
    generate((pulseIndex: number) => this.timing[pulseIndex] === 1 ? 1 : _.random(1));
    // If we didn't place enough notes, do it again until we do, this time ignoring
    // the timing parameter and only avoiding pulses that already have notes.
    while (phrase.numNotes() < this.minNotes) {
      generate((pulseIndex: number) => phrase.numNotes(pulseIndex) ? 0 : _.random(1));
    }
    return phrase;
  }
}
