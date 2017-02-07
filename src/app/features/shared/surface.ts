import { Note, SoundName } from "./sound/sound";

export interface Surface {
  readonly infoByKey: _.Dictionary<Surface.Info>;
  readonly initialData: _.Dictionary<Surface.Data>;
  readonly beats: number;

  listens(key: string): boolean;
  get(key: string): Surface.Info;
  keysAt(beat: number): string[];

  set(key: string, data: Surface.Data): _.Dictionary<Surface.Data>
  unset(key: string, data: Surface.Data): _.Dictionary<Surface.Data>
  setPulses(key: string, pulses: number, data: Surface.Data): _.Dictionary<Surface.Data>;
}

export declare namespace Surface {
  export interface Info {
    readonly key: string;
    readonly sound: SoundName;
    readonly beat: number;
  }

  export interface Data {
    readonly value: number[];
    readonly pulses: number;

    noteAt(beat: number, tick: number): Note;
  }
}
