import * as _ from 'lodash';

import { SoundName, Note } from "../sound/sound";
import { Rhythm, BeatTick, mapKey } from "../core/rhythm.model";

export class Phrase {
  private notes: _.Dictionary<Note[]>;
  private noteCount: number;

  constructor() {
    this.notes = {};
    this.noteCount = 0;
  }

  add(note: Note, beatTick: BeatTick | number, tick?: number) {
    if (_.isNumber(beatTick)) {
      beatTick = mapKey(beatTick, tick);
    }
    if (this.notes[beatTick]) {
      this.notes[beatTick].push(note);
    } else {
      this.notes[beatTick] = [note];
    }
    this.noteCount++;
    return this;
  }

  getNotes(beat: number, tick: number = 0): Note[] {
    return this.notes[mapKey(beat, tick)] || [];
  }

  numNotes(beatTick?: BeatTick): number {
    if (beatTick === undefined) {
      return this.noteCount;
    } else {
      return this.notes[beatTick] ? this.notes[beatTick].length : 0;
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
              private rhythm: Rhythm,
              private minNotes: number = 2,
              private maxNotes: number = 4) {
    if (minNotes > maxNotes) {
      throw new Error('minNotes should not be bigger than maxNotes');
    } else if (minNotes > rhythm.length) {
      throw new Error('minNotes should not be bigger than length of rhythm');
    }
  }

  build(): Phrase {
    let phrase = new Phrase();
    let generate = (generationStrategy: (beatTick: BeatTick, priority: number) => number) => {
      for (let [beatTick, probability] of this.rhythm.pulseProbabilities) {
        if (generationStrategy(beatTick, probability)) {
          let soundIndex = _.random(this.soundNames.length - 1);
          phrase.add(new Note(this.soundNames[soundIndex]), beatTick);
        }
        if (phrase.numNotes() === this.maxNotes) {
          break;
        }
      }
    };
    // Always place a note if the timing parameter is 1 for the current pulse.
    generate((beatTick: BeatTick, priority: number) => priority === 1 ? 1 : _.random(1));
    // If we didn't place enough notes, do it again until we do, this time ignoring
    // the timing parameter and only avoiding pulses that already have notes.
    while (phrase.numNotes() < this.minNotes) {
      generate((beatTick: BeatTick) => phrase.numNotes(beatTick) ? 0 : _.random(1));
    }
    return phrase;
  }
}
