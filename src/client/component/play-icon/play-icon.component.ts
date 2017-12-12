import { Component, Input } from '@angular/core';

@Component({
  selector: 'play-icon',
  template: `
    <svg height="60" width="60" viewBox="0 0 60 60">
      <svg:defs *ngIf="goalNotes">
        <svg:linearGradient id="play" x1="0" y1="0" x2="0" y2="100%">
          <svg:stop [attr.offset]="stopTop()" stop-color="white"/>
          <svg:stop [attr.offset]="stopBottom()" stop-color="#50ffa0"/>
        </svg:linearGradient>
      </svg:defs>
      <svg:path class="play-icon" [attr.d]="playPath"
                [attr.fill]="goalNotes ? 'url(#play)' : color"
                [attr.stroke]="color" stroke-width="6px"/>
      <svg:path *ngIf="autoPlay" class="autoplay" [attr.d]="autoplayPath"
                fill="white" stroke="white" stroke-width="1px"/>
    </svg>`,
  styles: [
    ':host { position: relative; }'
  ]
})
export class PlayIcon {
  @Input() public playNotes: number;
  @Input() public goalNotes: number;
  @Input() public autoPlay: boolean;
  color = "#50ffa0";
  playPath = "M5,5L50,30L5,55Z";
  autoplayPath = "M10,27L27,27L27,23L42,30L27,37L27,33L10,33Z";

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
