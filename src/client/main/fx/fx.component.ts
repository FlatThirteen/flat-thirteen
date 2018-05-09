import { Component, HostListener } from '@angular/core';
import { SoundService } from '../../common/sound/sound.service';
import { SoundName } from '../../common/core/note.model';

@Component({
  selector: 'fx-page',
  templateUrl: 'fx.component.pug',
  styleUrls: ['fx.component.styl'],
})

export class FxComponent {
  active: SoundName = null;
  background: 'blue' | 'green' = 'blue';
  duration: string = '250ms';

  constructor(private sound: SoundService) {}

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onBackground();
    } else if (event.key === 'a') {
      this.onNoteDown('kick');
    } else if (event.key === 'q') {
      this.onNoteDown('snare');
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'a' || event.key === 'q') {
      this.onNoteUp();
    }
  }

  onBackground() {
    this.sound.resume();
    this.sound.playSequence('cowbell', ['E7'], '16n');
    this.background = this.background === 'blue' ? 'green' : 'blue';
  }

  onNoteDown(soundName: SoundName) {
    this.sound.resume();
    if (!this.active) {
      this.sound.play(soundName);
    }
    this.active = soundName;
  }

  onNoteUp() {
    this.active = null;
  }
}
