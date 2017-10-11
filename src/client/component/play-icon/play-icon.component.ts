import { Component, Input } from '@angular/core';

@Component({
  selector: 'play-icon',
  template: `<svg height="60" width="60" viewBox="0 0 60 60">
    <svg:defs>
      <svg:linearGradient id="play" x1="0" y1="0" x2="0" y2="100%">
        <svg:stop [attr.offset]="stopTop()" stop-color="#ffffff" />
        <svg:stop [attr.offset]="stopBottom()" stop-color="#50ffa0" />
      </svg:linearGradient>
    </svg:defs>
    <svg:path class="play-icon" [attr.d]="path1" fill="url(#play)" 
              [attr.stroke]="stroke" stroke-width="6px"/>
  </svg>`
})
export class PlayIcon {
  @Input() public playNotes: number;
  @Input() public goalNotes: number;
  stroke = "#50ffa0";
  path1 = "M5,5L50,30,L5,55Z";

  constructor() { }

  stopCalculation() {
    let highest = this.goalNotes > 4 ? 15 : 45 - this.goalNotes * 6;
    let notch = (75 - highest) / (this.goalNotes - 1);
    return 75 - notch * this.playNotes;
  }

  stopTop() {
    return (this.playNotes === this.goalNotes ? 0 : this.stopCalculation()) + '%';
  }

  stopBottom() {
    return (this.playNotes === this.goalNotes ? 0 : this.stopCalculation() + 15) + '%';
  }
}
