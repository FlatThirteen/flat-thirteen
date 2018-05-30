import * as _ from 'lodash';
import * as Tone from 'tone';

import { Params, KickSound, SnareSound, ClickSound } from '../sound/sound';
import { CowbellSound } from '../sound/cowbell.sound';
import { SynthSound } from '../sound/synth.sound';

const soundMap = {
  click: ClickSound,
  kick: KickSound,
  snare: SnareSound,
  cowbell: CowbellSound,
  synth: SynthSound
};

export type SoundName = keyof typeof soundMap;

export class Note {
  constructor(public readonly soundName: SoundName,
              public readonly params: Params = {duration: '8n'}) {
  }

  get frequency(): Tone.Frequency {
    return this.params && this.params.pitch && new Tone.Frequency(this.params.pitch);
  }

  get duration(): number {
    let time = new Tone.Time(this.params && this.params.duration || '16n');
    return time.toSeconds();
  }

  alter(durationMap: any = {'4n': '8n', '8n': '16n'}): Note {
    let params = _.clone(this.params);
    params.duration = durationMap[params.duration] || params.duration;
    return new Note(this.soundName, params)
  }

  toString(): string {
    let pitch = this.params.pitch ? '(' + this.params.pitch + ')' : '';
    let accent = this.params.variation === 'heavy' ? '>' :
      this.params.variation === 'light' ? '*' : '';
    return accent + this.soundName + pitch;
  }

  static from(soundString: String, duration: string = '8n'): Note {
    let matches = soundString.match(/([>\*]?)(\w+)(?:\((.+)\))?/);
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
    params.duration = duration;
    return new Note(<SoundName>soundName, params);
  }

  static pitch(input: string): Tone.Frequency {
    try {
      let frequency = new Tone.Frequency(input);
      return frequency.toMidi() >= 12 ? frequency : null;
    } catch(error) {
      return null;
    }
  }
}
