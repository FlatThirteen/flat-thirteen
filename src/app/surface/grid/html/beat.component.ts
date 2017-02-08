import * as _ from 'lodash';
import { Component, Input, HostListener } from '@angular/core';

import { BeatService } from "../../../features/shared/beat.service";
import { PlayerService } from "../../../player/player.service";

/**
 * The BeatComponent is used by html-grid to represent a single note box
 * in the grid.  Each BeatComponent is only identified by its key, which
 * should be unique across all surfaces active in the UI.
 */
@Component({
  selector: '.beat',
  templateUrl: 'beat.component.html',
  styleUrls: ['beat.component.css'],

})
export class BeatComponent {
  @Input() private supportedPulses: number[] = [1];
  @Input() private key: string;

  constructor(private beat: BeatService, private player: PlayerService) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.player.select(this.key);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.player.unselect();
  }

  onQuarter() {
    this.player.toggle(this.key);
  }

  setPulses(pulses: number) {
    if (_.includes(this.supportedPulses, pulses)) {
      this.player.pulses(this.key, pulses);
    }
  }
}
