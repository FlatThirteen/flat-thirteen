import { Note } from '../core/note.model';

export interface Surface {
  readonly id: string;
  readonly initialData: Surface.Data[];

  listens(key: string): boolean;
}

export declare namespace Surface {
  export interface Data {
    noteAt(tick: number): Note;
    noteCount(): number;
  }
}
