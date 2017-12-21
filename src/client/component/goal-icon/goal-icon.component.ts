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
  styles: [
    '.container { position: relative; background-color: #008FFF; border-radius: 50%; height: 60px; }',
    '.hollow.container { border: solid 6px #008FFF; background-color: #FFF; height: 54px; width: 54px; }',
    'img, .stop { position: absolute; top: 0; left: 0; }',
    'img { height: 40px; width: 40px; margin: 10px; }',
    '.stop { height: 30px; width: 30px; margin: 15px; background-color: white; }'
  ]
})
export class GoalIcon {
  @Input() public mode: 'listen' | 'auto' | 'stop' | 'hollow';

  autoPath = "M15,27L32,27L32,23L47,30L32,37L32,33L15,33Z";

  constructor() { }
}
