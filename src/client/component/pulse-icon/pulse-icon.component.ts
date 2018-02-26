import { Component, Input } from '@angular/core';

@Component({
  selector: 'pulse-icon',
  template: `
    <div class="container">
      <div class="one pulse" *ngIf="level === 0"></div>
      <div class="three pulse" *ngIf="level === 2"></div>
      <div class="double-pulse" *ngIf="level === 3"></div>
      <div class="double-pulse" *ngIf="level > 0"></div>
      <ng-content></ng-content>
    </div>`,
  styleUrls: ['pulse-icon.component.styl']
})
export class PulseIcon {
  @Input() public level: number;

  constructor() { }
}
