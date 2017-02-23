import * as _ from 'lodash';

import { Surface } from "../../../surface/surface.model";
import { SoundName, Note } from "../../../sound/sound";

import { ticksPerBeat } from "../../../core/transport.service";

let nextId = 0;

export class Grid implements Surface {
  readonly id: string;
  readonly soundByKey: _.Dictionary<SoundName>;
  readonly pulsesByBeat: number[];
  readonly pulses: number;
  readonly initialData: GridData[];

  constructor(soundByKey: _.Dictionary<SoundName>, pulsesByBeat: number[]) {
    this.id = 'a2/grid' + nextId++;
    this.soundByKey = soundByKey;
    this.pulsesByBeat = pulsesByBeat;
    this.pulses = _.sum(pulsesByBeat);
    this.initialData = _.map(pulsesByBeat, (pulses) => new GridData([], pulses));
  }

  get keys() {
    return _.keys(this.soundByKey);
  }

  get soundNames() {
    return <SoundName[]>_.values(this.soundByKey);
  }

  listens(key: string): boolean {
    return !!this.soundByKey[key];
  }

  dataFor(beat: number, stateData): GridData {
    return stateData[this.id][beat];
  }

  beatPulseFor(cursor: number): [number, number] {
    return <[number, number]>_.reduce(this.pulsesByBeat, ([beat, cursor, working], pulses) => {
      return working && cursor >= pulses ? [beat + 1, cursor - pulses, 1] : [beat, cursor];
    }, [0, cursor, 1]);
  }

  wrapCursor(cursor: number) {
    return cursor < 0 ? cursor + this.pulses : cursor % this.pulses;
  }

  set(data: GridData, key: string, cursor: number = 0) {
    let notes = data.notes.slice(0);
    let [beat, pulse] = this.beatPulseFor(cursor);
    notes[pulse] = this.soundByKey[key];
    return this.stateData(beat, new GridData(notes, data.pulses));
  }

  unset(data: GridData, cursor: number = 0) {
    let notes = data.notes.slice(0);
    let [beat, pulse] = this.beatPulseFor(cursor);
    notes[pulse] = null;
    return this.stateData(beat, new GridData(notes, data.pulses));
  }

  private stateData(key, value) {
    return _.fromPairs([[this.id, _.fromPairs([[key, value]])]]);
  }

  toString(): string {
    return _.toString(this.soundByKey);
  }
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
}
