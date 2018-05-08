import * as _ from 'lodash';
import * as Tone from 'tone';

import { Injectable } from '@angular/core';

import { SoundName} from '../core/note.model';

import { Sound, ClickSound, KickSound, SnareSound, Params, Variation } from './sound';
import { CowbellSound } from './cowbell.sound';
import { SynthSound } from './synth.sound';

@Injectable()
export class SoundService {
  readonly sounds: _.Dictionary<Sound> = {
    click: new ClickSound(),
    kick: new KickSound(),
    snare: new SnareSound(),
    cowbell: new CowbellSound(),
    synth: new SynthSound()
  };

  play(soundName: SoundName, time?: any, params?: Params): Sound {
    let sound = this.loadSound(soundName);
    sound.play(time, params);
    return sound;
  }

  playSequence(soundName: SoundName, pitches: string[], duration: string,
               variation?: Variation) {
    let sound = this.loadSound(soundName);
    _.forEach(pitches, (pitch, index) => {
      let t = new Tone.Time(duration);
      t.mult(index + 1);
      sound.play('+' + t.toNotation(), {pitch: pitch, variation: variation});
    });
  }

  private loadSound(soundName) {
    let sound = this.sounds[soundName];
    if (sound) {
      return sound;
    } else {
      throw new Error('Invalid sound: ' + soundName);
    }
  }
}
