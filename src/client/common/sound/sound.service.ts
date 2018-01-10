import * as _ from 'lodash';
import * as Tone from 'tone';

import { Injectable } from '@angular/core';

import { SoundName} from '../core/note.model';

import { Sound, ClickSound, KickSound, SnareSound, CowbellSound, Params, Variation } from './sound';

@Injectable()
export class SoundService {
  readonly sounds: _.Dictionary<Sound> = {
    click: new ClickSound(),
    kick: new KickSound(),
    snare: new SnareSound(),
    cowbell: new CowbellSound()
  };

  play(soundName: SoundName, time?: number, params?: Params) {
    this.loadSound(soundName).play(time, params);
  }

  playSequence(soundName: SoundName, pitches: string[], duration: string,
               variation?: Variation, time: number = 0) {
    let sound = this.loadSound(soundName);
    _.forEach(pitches, (pitch, index) => {
      let t = Tone.Time(duration);
      t.mult(index);
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
