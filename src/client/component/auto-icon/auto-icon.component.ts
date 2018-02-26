import { Component, Input } from '@angular/core';

@Component({
  selector: 'auto-icon',
  template: `
    <div class="container">
      <svg height="60" width="60" viewBox="0 0 60 60">
        <circle *ngIf="level === 1" class="goal" cx="29" cy="30" r="28"/>
        <svg:path *ngIf="level === 2" class="next" [attr.d]="nextPath" /> 
        <svg:path class="auto" [attr.d]="autoPath" *ngIf="level !== 4"
            [class.dim]="level === 0 || level === 2" />
        <svg:path *ngIf="level === 0" class="cross" [attr.d]="crossPath" />
        <circle *ngIf="level === 3" class="loop" cx="29" cy="16" r="10"/>
        <circle *ngIf="level === 3" class="loop" cx="29" cy="46" r="10"/>
      </svg>
      <ng-content></ng-content>
    </div>`,
  styleUrls: ['auto-icon.component.styl']
})
export class AutoIcon {
  @Input() public level: number;

  autoPath = "M15,27 H32 V23 L47,30 L32,37 V33 H15 Z";
  playPath = "M5,5 L50,30 L5,55 Z";
  nextPath = "M0,20 H25 V40 H0 Z M35,20 H60, V40, H35 Z";
  crossPath = "M20,20 L40,40 M20,40 L40,20";

  constructor() { }
}
