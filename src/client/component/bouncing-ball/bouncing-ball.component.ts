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
  @Input() public showBouncingBall$: Observable<boolean>;
  @Input() public counter: number;
  private subscriptions: Subscription[];

  public lefts: string[];
  public left: string = inactiveLeft;
  public animationDuration: string;
  public animationDelay: string;
  public transitionDuration: string;
  public transitionDelay: string;

  constructor(public transport: TransportService) {
    this.animationDuration = duration + 'ms';
    this.animationDelay = '0';
    this.transitionDuration = .9 * duration + 'ms';
    this.transitionDelay = .1 * duration + 'ms';

    this.lefts = _.times(transport.numBeats, beat => {
      let index = 2 * beat + 1;
      return (50 / transport.numBeats * index) + '%'
    });
    this.subscriptions = [
      transport.paused$.subscribe(paused => {
        this.left = paused ? inactiveLeft : this.lefts[0];
      }),
      transport.pulse$.subscribe(pulse => {
        this.left = this.lefts[pulse.nextBeat];
      }),
    ];
  }

  ngOnDestroy() {
    _.invokeMap(this.subscriptions, 'unsubscribe');
  }
}
