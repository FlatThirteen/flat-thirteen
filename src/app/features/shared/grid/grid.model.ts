import * as _ from 'lodash';

import { Note, SoundName } from "../../../sound/sound";
import { Surface } from "../surface.model";

const off: number[] = [0];
const on: number[] = [1];

export class Grid implements Surface {
  readonly keysBySound: _.Dictionary<string[]>;
  readonly soundNames: SoundName[];
  readonly beats: number;
  readonly supportPulses: number[];
  readonly infoByKey: _.Dictionary<GridInfo>;
  readonly initialData: _.Dictionary<GridData>;

  constructor(shortcutKeysBySound: _.Dictionary<string[]>, beats: number,
              supportPulses: number[]) {
    this.keysBySound = shortcutKeysBySound;
    this.soundNames = <SoundName[]>_.keys(shortcutKeysBySound);
    this.beats = beats;
    this.supportPulses = supportPulses;
    this.infoByKey = _.transform(shortcutKeysBySound, (result, keys, sound) => {
      _.forEach(keys, (key, beat) => {
        result[key] = new GridInfo(key, <SoundName>sound, beat)
      });
    }, <_.Dictionary<GridInfo>>{});
    this.initialData = _.transform(shortcutKeysBySound, (result, keys, sound) => {
      _.forEach(keys, (key) => {
        result[key] = new GridData(<SoundName>sound, off, 1);
      });
    }, <_.Dictionary<GridData>>{});
  }

  listens(key: string): boolean {
    return !!this.infoByKey[key];
  }

  get(key): GridInfo {
    return this.infoByKey[key];
  }

  keysAt(beat: number) {
    return <string[]>_.map(this.keysBySound, _.property(beat));
  }

  keysForStrip(index: number) {
    return this.keysBySound[this.soundNames[index]];
  }

  set(key: string, data: GridData): _.Dictionary<GridData> {
    return _.fromPairs([[key, new GridData(data.sound, on, data.pulses)]]);
  }

  unset(key: string, data: GridData): _.Dictionary<GridData> {
    return _.fromPairs([[key, new GridData(data.sound, off, data.pulses)]]);
  }

  setPulses(key: string, pulses: number, data: GridData) {
    return _.fromPairs([[key, new GridData(data.sound, data.value, pulses)]]);
  }

  toString(): string {
    return _.toString(this.soundNames) + ':' +
      _.toString(_.values(this.keysBySound));
  }
}

export class GridInfo implements Surface.Info {
  constructor(readonly key: string, readonly sound: SoundName, readonly beat: number) {}
}

export class GridData implements Surface.Data {
  constructor(readonly sound: SoundName,
              readonly value: number[], readonly pulses: number) {}

  noteAt(beat: number, tick: number): Note {
    if (tick) {
      return null;
    } else if (this.value === on) {
      return new Note(this.sound);
    }
  }
}
