import * as _ from 'lodash';

import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { TransportService } from '../../common/core/transport.service';
import { StageService } from '../../common/stage/stage.service';

const inactiveLeft = '-30px';
const duration = 500;

@Component({
  selector: 'counter-ball',
  templateUrl: 'counter-ball.component.pug',
  styleUrls: ['counter-ball.component.styl'],
})
export class CounterBallComponent implements OnDestroy  {
  private subscriptions: Subscription[];

  public active: boolean = false;
  public left: string = inactiveLeft;
  public animationDuration: string;
  public animationDelay: string;
  public transitionDuration: string;
  public transitionDelay: string;

  constructor(public transport: TransportService, private stage: StageService) {
    this.animationDelay = '0';
    this.animationDuration = duration + 'ms';
    this.transitionDelay = .5 * duration + 'ms';
    this.transitionDuration = .45 * duration + 'ms';
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
