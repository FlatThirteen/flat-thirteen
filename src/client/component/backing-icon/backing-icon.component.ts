import { Component, Input } from '@angular/core';

@Component({
  selector: 'backing-icon',
  template: `
    <svg height="60" width="60" viewBox="0 0 60 60">
      <svg:path class="play-icon" [attr.d]="backingPath"
                [attr.fill]="color" [attr.stroke]="color" stroke-width="5px"/>
      <svg:path *ngIf="level === 0" [attr.d]="crossPath" 
                stroke="#FF6e56" stroke-width="6px" />
    </svg>`
})
export class BackingIcon {
  @Input() public level: number;
  color = "#50ffa0";
  crossPath = "M20,20 L40,40 M20,40 L40,20";
  backingPath = "M2,30 L12,20 L12,35 L27,20 L27,35 L42,20 L42,35 L57,20 L57,40 L0,40 Z";

  constructor() { }
}
