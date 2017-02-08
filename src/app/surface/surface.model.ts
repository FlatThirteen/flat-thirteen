import { Note } from "../sound/sound";

export interface Surface {
  readonly id: string;
  readonly initialData: Surface.Data[];

  listens(key: string): boolean;
}

export declare namespace Surface {
  export interface Data {
    noteAt(beat: number, tick: number): Note;
  }
}
