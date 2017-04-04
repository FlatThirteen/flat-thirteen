import { Component, Input, OnChanges } from '@angular/core';
import { TransportService } from '../../common/core/transport.service';

const duration = 500;

export class Ball {
  active: boolean;
  beat?: number;
}

/**
 * This class creates Particle Fx.
 */
@Component({
  selector: 'bouncing-ball',
  templateUrl: 'bouncing-ball.component.pug',
  styleUrls: ['bouncing-ball.component.styl'],
})
export class BouncingBallComponent implements OnChanges {
  @Input() public ball: Ball;

  public left: string;
  public animationDuration: string;
  public animationDelay: string;
  public transitionDuration: string;
  public transitionDelay: string;

  constructor(public transport: TransportService) {}

  ngOnChanges() {
    if (this.ball) {
      if (this.ball.beat !== undefined) {
        let index = 2 * this.ball.beat + 1;
        this.left = (12.5 * index) + '%';
      } else {
        setTimeout(() => { this.left = '25%' }, 200);
      }
      this.animationDuration = duration + 'ms';
      this.animationDelay = '0';
      this.transitionDuration = .9 * duration + 'ms';
      this.transitionDelay = .1 * duration + 'ms';
    }
  }
}
