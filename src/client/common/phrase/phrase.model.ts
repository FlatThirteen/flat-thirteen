import * as _ from 'lodash';

import { BeatTick, beatTickFrom } from '../core/beat-tick.model';
import { SoundName, Note } from '../core/note.model';
import { Rhythm } from '../core/rhythm.model';

export class Phrase {
  private notes: _.Dictionary<Note[]>;
  private noteCount: number;

  constructor(noteString?: String) {
    this.notes = {};
    this.noteCount = 0;
    if (noteString) {
      _.forEach(noteString.split(';'), (trackString: String) => {
        let [soundString, beatTickString] = trackString.split('@', 2);
        let note = Note.from(soundString);
        if (note) {
          _.forEach(beatTickString.split(','), (beatTick: BeatTick) => {
            this.add(note, beatTick);
          });
        } else {
          console.error('Invalid sound: ' + soundString);
        }
      });
    }
  }

  add(note: Note, beatTick: BeatTick | number, tick?: number) {
    if (_.isNumber(beatTick)) {
      beatTick = beatTickFrom(beatTick, tick);
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
    return this.notes[beatTickFrom(beat, tick)] || [];
  }

  numNotes(beatTick?: BeatTick): number {
    if (beatTick === undefined) {
      return this.noteCount;
    } else {
      return this.notes[beatTick] ? this.notes[beatTick].length : 0;
    }
  }

  builder(): PhraseBuilder {
    return new ConstantPhraseBuilder(this);
  }

  toString(): string {
    return _.toString(_.toPairs(this.notes));
  }
}

export interface PhraseBuilder {
  build(): Phrase;
}

export class ConstantPhraseBuilder implements PhraseBuilder {
  constructor(private phrase: Phrase) {}

  build(): Phrase {
    return this.phrase;
  }
}

/**
 * Builds a phrase that never allows more than one note per pulse.
 * For now, the timing parameter only guarantees a note if the value is 1.
 * Other values are ignored.
 * Always makes sure all possible sounds are chosen before any duplicates.
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
    let neededSounds = _.clone(this.soundNames);
    let randomNeededSound = () => {
      return neededSounds.splice(_.random(neededSounds.length - 1), 1)[0];
    };
    let randomSound = () => this.soundNames[_.random(this.soundNames.length - 1)];
    let generate = (generationStrategy: (beatTick: BeatTick, priority: number) => number) => {
      for (let [beatTick, probability] of this.rhythm.pulseProbabilities) {
        if (generationStrategy(beatTick, probability)) {
          let sound = neededSounds.length ? randomNeededSound() : randomSound();
          phrase.add(new Note(sound), beatTick);
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
