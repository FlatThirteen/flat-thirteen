import * as _ from 'lodash';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

import { RadarEffect, RadarEffectFactory } from './effects/radar-effect-factory';

@Component({
  selector: 'pixi-effects',
  templateUrl: 'pixi-effects.component.pug',
  styleUrls: ['pixi-effects.component.styl'],
})

export class PixiEffectsComponent implements OnInit, AfterViewInit {
  private renderer: PIXI.SystemRenderer;
  private container: PIXI.Container;
  private width: number;
  private height: number;

  private radarEffectFactory: RadarEffectFactory;
  private radarEffects: RadarEffect[];

  constructor() {
    this.radarEffects = [];
    this.radarEffectFactory = new RadarEffectFactory();
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {   
    let element = document.getElementById('canvas');
    this.width = element.clientWidth;
    this.height = element.clientHeight;

    this.renderer = PIXI.autoDetectRenderer(this.width, this.height, { transparent: true });
    this.renderer.autoResize = true;
    this.container = new PIXI.Container();

    element.appendChild(this.renderer.view);

    this.render();
  }

  createRadarEffect(x: number, y: number, size: number, speed: number) {
    let effect = this.radarEffectFactory.create(0.05, [1.0, 0.33, 0.13, 1.0], size, speed);
    this.radarEffects.push(effect);
    effect.setPosition(x, y);

    this.container.addChild(effect.getDisplayObject());
  }

  render() {
    let radarEffects = [];
    _.forEach(this.radarEffects, function(effect) {
      effect.update();
      if (!effect.isActive()) {
        effect.getDisplayObject().destroy();
      } else {
        radarEffects.push(effect);
      }
    });
    this.radarEffects = radarEffects;
    
    this.renderer.render(this.container);

    //Test code:
    /*
    if (0 === this.radarEffects.length) {
      for (let i = 0; i < 3; ++i) {
        this.createRadarEffect(i * 128, 0, 128, 0.02);
      }
    }
    */

    requestAnimationFrame(this.render.bind(this));
  }

  adjustTopEffectCanvasSize(event) {
    let element = document.getElementById('canvas');
    let width = element.clientWidth;
    let height = element.clientHeight;
    //TODO: resize and scale properly
    //  Having a fixed aspect ratio makes things easier and clean (graphically)
    
  }
}