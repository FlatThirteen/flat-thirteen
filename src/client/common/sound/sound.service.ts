import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { SoundName} from '../core/note.model';
import { Sound, ClickSound, KickSound, SnareSound, CowbellSound, Params } from './sound';

@Injectable()
export class SoundService {
  readonly sounds: _.Dictionary<Sound> = {
    click: new ClickSound(),
    kick: new KickSound(),
    snare: new SnareSound(),
    cowbell: new CowbellSound()
  };

  play(soundName: SoundName, time?: number, params?: Params) {
    let sound = this.sounds[soundName];
    if (sound) {
      sound.play(time, params);
    } else {
      throw new Error('Invalid sound: ' + soundName);
    }

  }
}
