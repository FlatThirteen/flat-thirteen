import { Component, Input, HostListener } from '@angular/core';
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { createSelector } from 'reselect';

import { AppState } from "../../../../reducers/index";
import { BeatService } from "../../beat.service";
import { PlayerService } from "../../../../player/player.service";

/**
 * This class represents the Beat Component used by html-grid.
 */
@Component({
  selector: '.beat',
  templateUrl: 'beat.component.html',
  styleUrls: ['beat.component.css'],

})
export class BeatComponent {
  @Input() private pulsesRange: number[] = [1];
  @Input() private key: string;

  private value$: Observable<number | number[]>;

  /**
   * Creates an instance of the A1Component.
   */
  constructor(private beat: BeatService,
              private store: Store<AppState>,
              private player: PlayerService) {
    let getBeatData = createSelector(PlayerService.getData, data => data[this.key]);
    let getBeatValue = createSelector(getBeatData, beatData => beatData.value);
    this.value$ = this.store.select(getBeatValue);
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.player.select(this.key);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.player.unselect(this.key);
  }

  onQuarter() {
    this.player.toggle(this.key);
  }

  setPulses(pulses: number) {
    console.log('Set pulses ' + pulses);
    if (pulses in this.pulsesRange) {
      this.player.pulses(this.key, pulses);
    } else {
      console.log('Invalid pulses');
    }
  }
}
