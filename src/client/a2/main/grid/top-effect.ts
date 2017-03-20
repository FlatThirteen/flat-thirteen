import * as PIXI from 'pixi.js'

import { RadarFilter } from './layers/filters/radar-filter';

export class TopEffect {
  renderer: PIXI.SystemRenderer;
  container: PIXI.Container;
  width: number;
  height: number;

  //TOOD: encapsulate these:
  radarSprite: PIXI.Sprite;
  radarFilter: RadarFilter;
  radarActive: boolean;

  init(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.renderer = PIXI.autoDetectRenderer(width, height, { transparent: true });
    this.renderer.autoResize = true;
    this.container = new PIXI.Container();

    let beatWidth = width/4;
    let beatHeight = height/2;
    let g = new PIXI.Graphics();
    g.beginFill(0x000000, 1.0);
    g.drawRect(0, 0, beatWidth, beatHeight);
    g.endFill();
    
    let texture = g.generateCanvasTexture();
    this.radarSprite = new PIXI.Sprite(texture);
    //this.radarSprite = new PIXI.Sprite();
    //this.radarSprite.width = width/4;
    //this.radarSprite.height = height/2;
    this.radarSprite.x = width/4;
    this.radarSprite.y = height/2;

    this.radarFilter = new RadarFilter(1.0);
    this.radarFilter.uniforms.center = [0.5, 0.5];
    this.radarFilter.uniforms.color = [1.0, 0.33, 0.13, 1.0];
    this.radarFilter.uniforms.time = 0.1;
    this.radarFilter.uniforms.size = 0.05;

    this.radarSprite.filters = [this.radarFilter];
    this.radarActive = true;

    this.container.addChild(this.radarSprite);
  }

  getView() {
    return this.renderer.view;
  }

  render() {
    if (true === this.radarActive) {
      /*
      this.radarActive = this.radarFilter.update(0.01);
      if (false == this.radarActive) {
        this.radarSprite.filters = [];
      }
      */
      //this.radarFilter.update(0.01);
    }

    this.renderer.render(this.container);
  }

  resize(width: number, height: number, scale: boolean) {
    this.renderer.resize(width, height);
    if (true === scale) {
      //TODO: scale
      let point = new PIXI.Point(width/this.width, height/this.height);
      this.container.scale = point;
    }
  }
}