import { FormsModule } from '@angular/forms';
import {
  async,
  TestBed
 } from '@angular/core/testing';

import { A1Component } from './a1.component';

export function main() {
  describe('A1 component', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [A1Component],
      });

    });

    it('should work',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(A1Component);
            let a1Instance = fixture.debugElement.componentInstance;
            let a1DOMEl = fixture.debugElement.nativeElement;

            fixture.detectChanges();

          });

      }));
  });
}
