import * as _ from 'lodash';

import { Note, SoundName } from "../sound/sound";
import { Surface } from "../surface";

export class Grid implements Surface {
  readonly shortcutKeysBySound: _.Dictionary<string[]>;
  readonly soundNames: SoundName[];
  readonly beats: number;
  readonly pulsesPerBeat: number;
  readonly shortcutMap: _.Dictionary<GridInfo>;
  readonly initialData: _.Dictionary<GridData>;

  constructor(shortcuts: _.Dictionary<string[]>, beats: number, pulsesPerBeat: number) {
    this.shortcutKeysBySound = shortcuts;
    this.soundNames = <SoundName[]>_.keys(shortcuts);
    this.beats = beats;
    this.pulsesPerBeat = pulsesPerBeat;
    this.shortcutMap = _.transform(shortcuts, (result, keys, sound) => {
      _.forEach(keys, (key, beat) => {
        result[key] = new GridInfo(key, <SoundName>sound, beat)
      });
    }, <_.Dictionary<GridInfo>>{});
    this.initialData = _.transform(shortcuts, (result, keys, sound) => {
      _.forEach(keys, (key) => {
        result[key] = new GridData(<SoundName>sound, 0, 1);
      });
    }, <_.Dictionary<GridData>>{});
  }

  listens(key: string): boolean {
    return !!this.shortcutMap[key];
  }

  get(key): GridInfo {
    return this.shortcutMap[key];
  }

  keysAt(beat: number) {
    return <string[]>_.map(this.shortcutKeysBySound, _.property(beat));
  }

  set(key: string, data: GridData): _.Dictionary<GridData> {
    return _.fromPairs([[key, new GridData(data.sound, 1, data.pulses)]]);
  }

  unset(key: string, data: GridData): _.Dictionary<GridData> {
    return _.fromPairs([[key, new GridData(data.sound, 0, data.pulses)]]);
  }

  setPulses(key: string, pulses: number, data: GridData) {
    return _.fromPairs([[key, new GridData(data.sound, data.value, pulses)]]);
  }

  toString(): string {
    return _.toString(this.soundNames) + ':' +
      _.toString(_.values(this.shortcutKeysBySound));
  }
}

export class GridInfo implements Surface.Info {
  constructor(readonly key: string, readonly sound: SoundName, readonly beat: number) {}
}

export class GridData implements Surface.Data {
  constructor(readonly sound: SoundName,
              readonly value: number | number[], readonly pulses: number) {}

  noteAt(pulse: number): Note {
    if (this.value === 1) {
      return new Note(this.sound);
    }
  }
}
