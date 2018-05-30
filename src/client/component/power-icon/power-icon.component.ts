import { Component, Input } from '@angular/core';

@Component({
  selector: 'power-icon',
  template: `
    <div class="container">
      <svg class="icon" height="60" width="60" viewBox="0 0 60 60">
        <svg:path *ngIf="type === 'auto'" class="auto" [attr.d]="autoPath"
                  fill="#FF00A2" stroke="white" stroke-width="10px"/>
      </svg>
      <svg class="icon" height="60" width="60" viewBox="0 0 60 60">
        <svg:path *ngIf="type === 'backing'" class="auto" [attr.d]="backingPath"
                  fill="white" stroke="white" stroke-width="5px"/>
      </svg>
      <div *ngIf="type === 'strip'" class="strip icon"></div>
      <div *ngIf="type === 'pulse'" class="pulse icon"></div>
      <ng-content></ng-content>
    </div>`,
  styleUrls: ['power-icon.component.styl']
})
export class PowerIcon {
  @Input() public type: 'strip' | 'pulse' | 'auto' | 'backing';

  autoPath = "M10,21 L22,21 L22,12 L50,30 L22,48 L22,39 L10,39 Z";
  backingPath = "M2,30 L12,20 L12,35 L27,20 L27,35 L42,20 L42,35 L57,20 L57,40 L0,40 Z";

  constructor() { }
}
