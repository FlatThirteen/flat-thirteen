import * as _ from 'lodash';

import { Component, Input, OnChanges } from '@angular/core';

export type Fx = 'confetti'

class Particle {
  color: string;
  top: string;
  left: string;
  width: string;
  height: string;
  animationDelay: string;
}

/**
 * This class creates Particle Fx.
 */
@Component({
  selector: 'particle-fx',
  templateUrl: 'particle-fx.component.pug',
  styleUrls: ['particle-fx.component.styl'],
})
export class ParticleFxComponent implements OnChanges {
  @Input() public type: Fx;
  @Input() private count: number;

  public particles: Particle[];

  constructor() {}

  ngOnChanges() {
    if (this.type === 'confetti' && this.count) {
      this.particles = _.times(this.count, () => { return {
        color: 'c' + _.random(1, 2),
        top: _.random(10, 50) + '%',
        left: _.random(1, 99) + '%',
        width: _.random(10, 18) + 'px',
        height: _.random(12, 20) + 'px',
        animationDelay: _.random(0, 1500) + 'ms'
      }});
    }
  }
}
