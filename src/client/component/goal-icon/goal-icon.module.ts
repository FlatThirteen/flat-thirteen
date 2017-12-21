import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoalIcon } from './goal-icon.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GoalIcon
  ],
  exports: [
    GoalIcon
  ]
})
export class GoalIconModule {}

