import { Sound, Variation } from "./sounds/sound";

export class Note {
  constructor(public readonly sound: Sound,
              public readonly variation?: Variation) {}

  play(time?: number) {
    this.sound.play(time, this.variation);
  }
}
