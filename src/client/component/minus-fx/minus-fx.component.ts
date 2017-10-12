import * as _ from 'lodash';

import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { trigger, style, animate, state, transition, keyframes } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'minus-fx',
  templateUrl: 'minus-fx.component.pug',
  styleUrls: ['minus-fx.component.styl'],
  animations: [
    trigger('show', [
      transition(':enter', [
        state('*', style({opacity: 0})),
        animate(750, keyframes([
          style({ transform: 'translateY(2vh) rotate(45deg) scale(1.2, 0.6)', opacity: 0, offset: 0 }),
          style({ transform: 'translateY(-2vh) scale(0.8, 1.2)', opacity: 1, offset: 0.2 }),
          style({ transform: 'translateY(0) scale(1, 1)', opacity: 1, offset: 0.4 }),
          style({ transform: 'translateY(0) scale(1, 1)', opacity: 1, offset: 0.8 }),
          style({ transform: 'translateY(3vh) rotate(-60deg) scale(0.5)', opacity: 0, offset: 1 })
        ]))
      ])
    ])
  ]
})
export class MinusFx implements OnChanges, OnDestroy {
  @Input() public show$: Observable<number>;
  private subscriptions: Subscription[];

  public show: number[] = [];

  constructor() { }

  ngOnChanges() {
    if (!this.subscriptions) {
      this.subscriptions = [
        this.show$.subscribe((value) => {
          this.show.push(value);
        })
      ];
    }
  }

  ngOnDestroy() {
    _.invokeMap(this.subscriptions, 'unsubscribe');
  }
}
