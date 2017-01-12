import { FormsModule } from '@angular/forms';
import {
  TestBed
 } from '@angular/core/testing';

import { HomeComponent } from './home.component';

export function main() {
  describe('Home component', () => {
    beforeEach(() => {

      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [HomeComponent],
      });

      it('does nothing', () => true);
    });
  });
}
