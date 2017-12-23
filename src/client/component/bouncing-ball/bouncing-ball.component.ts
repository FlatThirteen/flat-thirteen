import * as _ from 'lodash';

import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { TransportService } from '../../common/core/transport.service';

const inactiveLeft = '25%';
const duration = 500;

/**
 * This class defines the BouncingBall component.
 */
@Component({
  selector: 'bouncing-ball',
  templateUrl: 'bouncing-ball.component.pug',
  styleUrls: ['bouncing-ball.component.styl'],
})
export class BouncingBallComponent implements OnDestroy  {
  @Input() public showBall$: Observable<boolean>;
  @Input() public counter: number;
  private subscriptions: Subscription[];
  private duration: number = 500;

  public lefts: string[];
  public left: string = inactiveLeft;

  constructor(public transport: TransportService) {
    this.subscriptions = [
      transport.paused$.subscribe(paused => {
        if (!paused) {
          this.lefts = _.times(transport.numBeats, beat => {
            let index = 2 * beat + 1;
            return (50 / transport.numBeats * index) + '%'
          });
        }
        this.left = paused ? inactiveLeft : this.lefts[0];
      }),
      transport.pulse$.subscribe(pulse => {
        this.left = this.lefts[pulse.nextBeat];
      }),
    ];
  }

  @Input() set bpm(bpm: number) {
    this.duration = 60000 / bpm;
  }

  get animationDuration() {
    return this.duration + 'ms';
  }

  get animationDelay() {
    return '0';
  }

  get transitionDuration() {
    return .9 * duration + 'ms';
  }

  get transitionDelay() {
    return .1 * duration + 'ms';
  }

  ngOnDestroy() {
    _.invokeMap(this.subscriptions, 'unsubscribe');
  }
}
