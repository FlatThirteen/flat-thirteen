import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StagePanelComponent } from './stage-panel.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StagePanelComponent
  ],
  exports: [
    StagePanelComponent
  ]
})

export class StagePanelModule {}

