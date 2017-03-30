import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { Sound, ClickSound, KickSound, SnareSound, Variation, SoundName } from './sound';


@Injectable()
export class SoundService {
  readonly sounds: _.Dictionary<Sound> = {
    click: new ClickSound(),
    kick: new KickSound(),
    snare: new SnareSound()
  };

  play(soundName: SoundName, time?: number, variation?: Variation) {
    let sound = this.sounds[soundName];
    if (sound) {
      sound.play(time, variation);
    } else {
      throw new Error('Invalid sound: ' + soundName);
    }

  }
}
