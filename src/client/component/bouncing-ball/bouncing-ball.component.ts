import * as _ from 'lodash';

import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { TransportService } from '../../common/core/transport.service';
import { StageService } from '../../common/stage/stage.service';

const inactiveLeft = '25%';
const duration = 500;

/**
 * This class creates Particle Fx.
 */
@Component({
  selector: 'bouncing-ball',
  templateUrl: 'bouncing-ball.component.pug',
  styleUrls: ['bouncing-ball.component.styl'],
})
export class BouncingBallComponent implements OnDestroy  {
  private subscriptions: Subscription[];

  public active: boolean = false;
  public left: string = inactiveLeft;
  public animationDuration: string;
  public animationDelay: string;
  public transitionDuration: string;
  public transitionDelay: string;

  constructor(public transport: TransportService, private stage: StageService) {
    this.animationDuration = duration + 'ms';
    this.animationDelay = '0';
    this.transitionDuration = .9 * duration + 'ms';
    this.transitionDelay = .1 * duration + 'ms';
    this.subscriptions = [
      transport.paused$.subscribe(paused => {
        if (paused) {
          this.left = inactiveLeft;
          this.active = false;
        } else {
          this.left = (50 / transport.numBeats) + '%';
          setTimeout(() => { // Check for stage update after reducer has run
            if (stage.isLoop) {
              this.active = true;
            }
          }, 0);
        }
      }),
      transport.pulse$.subscribe(pulse => {
        let index = 2 * pulse.nextBeat + 1;
        this.left = (50 / transport.numBeats * index) + '%';
      }),
      combineLatest(transport.lastBeat$, stage.active$).subscribe(([lastBeat]) => {
        this.active = stage.showBall(lastBeat);
      })
    ];
  }

  ngOnDestroy() {
    _.invokeMap(this.subscriptions, 'unsubscribe');
  }
}
