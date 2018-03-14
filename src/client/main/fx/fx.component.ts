import { Component } from '@angular/core';
import { SoundService } from '../../common/sound/sound.service';

@Component({
  selector: 'fx-page',
  templateUrl: 'fx.component.pug',
  styleUrls: ['fx.component.styl'],
})

export class FxComponent {
  active: boolean = false;
  duration: string = '250ms';

  constructor(private sound: SoundService) {}

  onNoteDown() {
    this.active = true;
    this.sound.play('kick');
  }

  onNoteUp() {
    this.active = false;
  }
}
