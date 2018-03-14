import { Component } from '@angular/core';
import { SoundService } from '../../common/sound/sound.service';
import { SoundName } from '../../common/core/note.model';

@Component({
  selector: 'sound-page',
  templateUrl: 'sound.component.pug',
  styleUrls: ['sound.component.styl'],
})

export class SoundComponent {
  constructor(private sound: SoundService) {}

  onSound(sound: SoundName) {
    this.sound.play(sound);
    console.log('Play sound:', sound);
  }
}
