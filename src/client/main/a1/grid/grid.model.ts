import * as _ from 'lodash';

import { Surface } from '../../../common/surface/surface.model';
import { SoundName, Note } from '../../../common/sound/sound';

import { ticksPerBeat } from '../../../common/core/transport.service';

let nextId = 0;

export class Grid implements Surface {
  readonly id: string;
  readonly keysBySound: _.Dictionary<string[]>;
  readonly soundNames: SoundName[];
  readonly beats: number;
  readonly supportedPulses: number[];
  readonly infoByKey: _.Dictionary<GridInfo>;
  readonly initialData: GridData[];

  constructor(shortcutKeysBySound: _.Dictionary<string[]>, beats: number,
              supportedPulses: number[]) {
    this.id = 'a1/grid' + nextId++;
    this.keysBySound = shortcutKeysBySound;
    this.soundNames = <SoundName[]>_.keys(shortcutKeysBySound);
    this.beats = beats;
    this.supportedPulses = supportedPulses;
    this.infoByKey = _.transform(shortcutKeysBySound, (result, keys, sound) => {
      _.forEach(keys, (key, beat) => {
        result[key] = new GridInfo(<SoundName>sound, beat);
      });
    }, <_.Dictionary<GridInfo>>{});
    this.initialData = _.times(this.beats, _.constant(new GridData([], 1)));
  }

  listens(key: string): boolean {
    return !!this.infoByKey[key];
  }

  infoFor(key): GridInfo {
    return this.infoByKey[key];
  }

  infoDataFor(key, stateData): [GridInfo, GridData] {
    let info = this.infoFor(key);
    return [info, stateData[this.id][info.beat]];
  }

  keysForStrip(index: number) {
    return this.keysBySound[this.soundNames[index]];
  }

  advanceCursor(data: GridData, cursor: number) {
    return cursor === data.pulses - 1 ? 0 : cursor + 1;
  }

  set(info: GridInfo, data: GridData, cursor: number = 0) {
    let notes = data.notes.slice(0);
    notes[cursor] = info.sound;
    return this.stateData(info.beat, new GridData(notes, data.pulses));
  }

  unset(info: GridInfo, data: GridData, cursor: number = 0) {
    let notes = data.notes.slice(0);
    notes[cursor] = null;
    return this.stateData(info.beat, new GridData(notes, data.pulses));
  }

  setPulses(info: GridInfo, pulses: number, data: GridData) {
    let notes = _.times(pulses, _.constant(data.notes[0]));
    return this.stateData(info.beat, new GridData(notes, pulses));
  }

  private stateData(key, value) {
    return _.fromPairs([[this.id, _.fromPairs([[key, value]])]]);
  }

  toString(): string {
    return _.toString(this.soundNames) + ':' +
      _.toString(_.values(this.keysBySound));
  }
}

export class GridInfo {
  constructor(readonly sound: SoundName, readonly beat: number) {}
}

export class GridData implements Surface.Data {
  constructor(readonly notes: SoundName[], readonly pulses: number) {}

  noteAt(tick: number): Note {
    let pulse = tick ? tick * this.pulses / ticksPerBeat : 0;
    let sound = this.notes[pulse];
    if (sound) {
      return new Note(sound);
    }
  }

  noteCount(): number {
    return _.reduce(this.notes, (sum, note, pulse) =>
        sum + (note && pulse < this.pulses ? 1 : 0), 0);
  }
}
