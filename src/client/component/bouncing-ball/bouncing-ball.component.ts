import * as _ from 'lodash';

import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { TransportService } from '../../common/core/transport.service';

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
  @Input() public showBall$: Observable<boolean>;
  private subscriptions: Subscription[];

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
    this.subscriptions = [
      transport.paused$.subscribe(paused => {
        this.left = paused ? inactiveLeft : (50 / transport.numBeats) + '%';
      }),
      transport.pulse$.subscribe(pulse => {
        let index = 2 * pulse.nextBeat + 1;
        this.left = (50 / transport.numBeats * index) + '%';
      }),
    ];
  }

  ngOnDestroy() {
    _.invokeMap(this.subscriptions, 'unsubscribe');
  }
}
