import { Component, Input } from '@angular/core';

@Component({
  selector: 'goal-icon',
  template: `
    <div class="container" [class.hollow]="mode === 'hollow'">
      <img src="/assets/listen-music-128.png" *ngIf="mode === 'listen'">
      <svg height="60" width="60" viewBox="0 0 60 60">
        <svg:path *ngIf="mode === 'auto'" class="auto" [attr.d]="autoPath"
                  fill="white" stroke="white" stroke-width="1px"/>
      </svg>
      <div *ngIf="mode === 'stop'" class="stop"></div>
      <ng-content></ng-content>
    </div>`,
  styleUrls: ['goal-icon.component.styl']
})
export class GoalIcon {
  @Input() public mode: 'listen' | 'auto' | 'stop' | 'hollow';

  autoPath = "M15,27 H32 V23 L47,30 L32,37 V33 H15 Z";

  constructor() { }
}
