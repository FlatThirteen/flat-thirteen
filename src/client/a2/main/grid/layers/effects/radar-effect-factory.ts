import * as PIXI from 'pixi.js'

import { RadarFilter } from '../filters/radar-filter';

export class RadarEffect {
  private sprite: PIXI.Sprite;
  private filter: RadarFilter;
  private active: boolean;

  constructor(span: number, color: number[], size: number, private readonly speed: number) {
    /*
    let g = new PIXI.Graphics();
    g.beginFill(0x000000, 1.0);
    g.drawRect(0, 0, size, size);
    g.endFill();
    let texture = g.generateCanvasTexture();
    this.sprite = new PIXI.Sprite(texture);
    */
    this.sprite = new PIXI.Sprite();
    this.sprite.width = size;
    this.sprite.height = size;
    //this.sprite.anchor.x = 0.5;
    //this.sprite.anchor.y = 0.5;

    this.filter = new RadarFilter(10.0);
    this.filter.uniforms.center = [0.27, 0.27];
    this.filter.uniforms.color = color;
    this.filter.uniforms.time = 0.0;
    this.filter.uniforms.size = span;

    this.sprite.filters = [this.filter];
    
    this.active = true;
  }

  setPosition(x: number, y: number) {
    this.sprite.x = x;
    this.sprite.y = y;
  }

  isActive() {
    return this.active;
  }

  update() {
    if (true === this.active) {
      this.active = this.filter.update(this.speed);
    }
  }

  getDisplayObject() {
    return this.sprite;
  }
}

export class RadarEffectFactory {
  renderer: PIXI.SystemRenderer;
  container: PIXI.Container;
  width: number;
  height: number;

  create(span: number, color: number[], size: number, speed: number) {
    let effect = new RadarEffect(span, color, size, speed);
    return effect;
  }
}