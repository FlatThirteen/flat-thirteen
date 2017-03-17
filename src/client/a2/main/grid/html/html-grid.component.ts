import * as _ from 'lodash';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { Grid } from '../grid.model';
import { PlayerService } from '../../../../common/player/player.service';
import { StageService } from '../../../../common/stage/stage.service';
import { TransportService } from '../../../../common/core/transport.service';

import { TopEffect } from '../top-effect';

/**
 * This class represents the HTML version of the Grid Component.
 */
@Component({
  selector: 'html-grid',
  templateUrl: 'html-grid.component.pug',
  styleUrls: ['html-grid.component.styl'],
})
export class HtmlGridComponent implements OnInit, AfterViewInit {
  @Input() private grid: Grid;
  public gridClass$: Observable<string>;

  private topEffect: TopEffect;

  constructor(public transport: TransportService, public player: PlayerService,
              public stage: StageService) {
    this.gridClass$ = combineLatest(stage.scene$, player.selected$).map(
        ([scene, selected]) => scene.toLowerCase() + (this.grid.listens(selected) ? ' selected' : ''));

    this.topEffect = new TopEffect();
  }

  ngOnInit() {
    if (!this.grid) {
      throw new Error('Missing grid');
    }
  }

  ngAfterViewInit() {   
    //let element = document.getElementById('top-fx');
    let element = document.getElementsByClassName('top-fx overlay')[0];
    let width = element.clientWidth;
    let height = element.clientHeight;

    this.topEffect.init(width, height);
    element.appendChild(this.topEffect.getView());

    this.render();
  }

  pulsesFor(beat: number) {
    let offset = _.sum(this.grid.pulsesByBeat.slice(0, beat));
    return _.times(this.grid.pulsesByBeat[beat], (i) => offset + i);
  }

  pulseClass(beat, pulse, pulses, pulseIndex) {
    return {
      active: this.transport.active(beat, pulse, pulses),
      cursor: this.player.cursor === pulseIndex
    };
  }

  noteClass(pulses: number) {
    return noteTypes[pulses];
  }

  controlNoteClass(key: string, pulseIndex: number, pulses: number) {
    return this.noteClass(pulses) + (this.player.value(key, pulseIndex) ? ' on' : '');
  }

  render() {
    this.topEffect.render();

    requestAnimationFrame(this.render.bind(this));
  }

  adjustTopEffectCanvasSize(event) {
    let element = document.getElementsByClassName('top-fx overlay')[0];
    let width = element.clientWidth;
    let height = element.clientHeight;
    this.topEffect.resize(width, height, true);
  }
}

const noteTypes = {
  1: 'quarter',
  2: 'eighth',
  3: 'triplet',
  4: 'sixteenth'
};
