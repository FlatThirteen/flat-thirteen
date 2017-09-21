import { Params, KickSound, SnareSound, ClickSound, CowbellSound } from '../sound/sound';

const soundMap = {
  click: ClickSound,
  kick: KickSound,
  snare: SnareSound,
  cowbell: CowbellSound
};

export type SoundName = keyof typeof soundMap;

export class Note {
  constructor(public readonly soundName: SoundName,
              public readonly params: Params = {}) {
  }

  toString(): string {
    let pitch = this.params.pitch ? '(' + this.params.pitch + ')' : '';
    let accent = this.params.variation === 'heavy' ? '>' :
      this.params.variation === 'light' ? '*' : '';
    return accent + this.soundName + pitch;
  }

  static from(soundString: String): Note {
    let matches = soundString.match(/([>\*]?)(\w+)(?:\((\d+)\))?/);
    if (!matches || !soundMap.hasOwnProperty(matches[2])) {
      return null;
    }
    let [whole, accent, soundName, pitch] = matches;
    let params: Params = {};
    if (accent) {
      params.variation = accent === '>' ? 'heavy' : accent === '*' ? 'light' : 'normal';
    }
    if (pitch) {
      params.pitch = pitch;
    }
    return new Note(<SoundName>soundName, params);
  }
}
