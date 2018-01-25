import { Component, Input } from '@angular/core';

@Component({
  selector: 'strip-icon',
  template: `<div class="container">{{ level + 1 }}</div>`,
  styles: [
    '.container { background-color: #008FFF; border: solid 6px #007FFF; ' +
        'height: 48px; width: 48px; font-size: 40px; line-height: 48px; }'
  ]
})
export class StripIcon {
  @Input() public level: number;

  constructor() { }
}
