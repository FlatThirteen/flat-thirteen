import * as _ from 'lodash';

import { Component, HostListener } from '@angular/core';
import { SoundService } from '../../common/sound/sound.service';
import { SoundName } from '../../common/core/note.model';
import { Sound } from '../../common/sound/sound';

@Component({
  selector: 'sound-page',
  templateUrl: 'sound.component.pug',
  styleUrls: ['sound.component.styl'],
})

export class SoundComponent {
  lastSound: Sound;
  lastSoundName: SoundName;
  activeSounds = {};
  active: string[] = [];
  octaveShift: number = 0;

  constructor(private sound: SoundService) {}

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    let pitch = this.getPitch(event.key);
    if (this.lastSound && this.lastSound.attack && pitch &&
        !this.activeSounds[pitch]) {
      this.activeSounds[pitch] = true;
      this.active = _.keys(this.activeSounds);
      this.lastSound.attack({ pitch: pitch });
    } else if (event.key === 'Shift') {
      if (event.location === 1 && this.octaveShift > -3) {
        this.octaveShift--;
      } else if (event.location === 2 && this.octaveShift < 3) {
        this.octaveShift++;
      }
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    let pitch = this.getPitch(event.key);
    if (this.lastSound && this.lastSound.release && pitch) {
      delete this.activeSounds[pitch];
      this.active = _.keys(this.activeSounds);
      this.lastSound.release({ pitch: pitch });
    } else if (event.key === 'Shift') {
      this.releaseAll();
    }
  }

  onSound(sound: SoundName) {
    this.lastSoundName = sound;
    if (this.lastSound) {
      this.releaseAll();
    }
    this.lastSound = this.sound.play(sound);
    console.log('Play sound:', sound);
  }

  private getPitch(key: string) {
    let pitch = keymap[key];
    if (pitch && this.octaveShift) {
      pitch = pitch.replace(/[3-6]/, (match) => {
        return _.toNumber(match) + this.octaveShift;
      });
    }
    return pitch;
  }

  showKey(soundName: SoundName) {
    return this.lastSoundName === soundName && this.lastSound.attack ?
        this.octaveShift : '';
  }

  releaseAll() {
    if (this.lastSound.releaseAll) {
      this.lastSound.releaseAll();
    }
    this.activeSounds = {};
    this.active = [];
  }
}

const keymap = {
  'q': 'C3',
  '2': 'C#3',
  'w': 'D3',
  '3': 'D#3',
  'e': 'E3',
  'r': 'F3',
  '5': 'F#3',
  't': 'G3',
  '6': 'G#3',
  'y': 'A3',
  '7': 'A#3',
  'u': 'B3',
  'i': 'C4',
  '9': 'C#4',
  'o': 'D4',
  '0': 'D#4',
  'p': 'E4',
  '[': 'F4',
  '=': 'F#4',
  ']': 'G4',
  'a': 'G#4',
  'z': 'A4',
  's': 'A#4',
  'x': 'B4',
  'c': 'C5',
  'f': 'C#5',
  'v': 'D5',
  'g': 'D#5',
  'b': 'E5',
  'n': 'F5',
  'j': 'F#5',
  'm': 'G5',
  'k': 'G#5',
  ',': 'A5',
  'l': 'A#5',
  '.': 'B5',
  '/': 'C6'
};
