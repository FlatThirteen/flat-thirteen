import * as PIXI from 'pixi.js'

import { TextOverlay } from './text-Overlay';

export class RenderableStrip {
  container: PIXI.Container;
  activeRects: PIXI.Sprite[];
  inactiveRects: PIXI.Sprite[];
  shortcutKeyOverlays: TextOverlay[];
  beats: PIXI.Graphics[];

  interactionRects: PIXI.Sprite[];
  active: boolean;

  constructor(private id, stripHeight: number, private beatWidth: number, private beatCount: number, onclickCallback: any, shortcutKeys: string[]) {
    this.container = new PIXI.Container();

    this.activeRects = [];
    this.inactiveRects = [];
    this.interactionRects = [];
    this.beats = [];
    let borderSize = 12;

    let rectangle = new PIXI.Graphics();
    rectangle.beginFill(0x007FFF);
    //Currently it doesn't draw right. The right and bottom outline is twice the size and the counterparts
    //rectangle.lineStyle(borderSize, 0x007FFF, 1);
    rectangle.drawRect(0, 0, beatWidth, stripHeight);
    rectangle.endFill();
    //Fill another smaller rectangle
    rectangle.beginFill(0x008FFF);
    rectangle.drawRect(borderSize/2, borderSize/2, beatWidth - borderSize, stripHeight - borderSize);
    rectangle.endFill();
    let activeRectTexture = rectangle.generateCanvasTexture();

    rectangle = new PIXI.Graphics();
    rectangle.beginFill(0x7777777);
    //Currently it doesn't draw right. The right and bottom outline is twice the size and the counterparts
    //rectangle.lineStyle(borderSize, 0x007FFF, 1);
    rectangle.drawRect(0, 0, beatWidth, stripHeight);
    rectangle.endFill();
    //Fill another smaller rectangle
    rectangle.beginFill(0x88888888);
    rectangle.drawRect(borderSize/2, borderSize/2, beatWidth - borderSize, stripHeight - borderSize);
    rectangle.endFill();
    let inactiveRectTexture = rectangle.generateCanvasTexture();

    for (let col = 0; col < beatCount; ++col) {
      this.createInactiveRects(col, inactiveRectTexture);
      this.container.addChild(this.inactiveRects[col]);

      this.createActiveRects(col, activeRectTexture);
      this.container.addChild(this.activeRects[col]);

      if (col > 0 && col < beatCount) {
        const dividerWidth = 2;
        const dividerXOffset = dividerWidth / 2;
        const dividerHeightDifference = stripHeight - (stripHeight / 4);
        const dividerHeight = stripHeight - dividerHeightDifference;
        const dividerYOffset = dividerHeightDifference / 2;
        let rectangle = new PIXI.Graphics();
        rectangle.beginFill(0xFFFFFF);
        rectangle.drawRect(col * beatWidth - dividerXOffset, dividerYOffset, 2, dividerHeight);
        rectangle.endFill();
        this.container.addChild(rectangle);
      }
    }

    for (let col = 0; col < beatCount; ++col) {
      this.createBeatCircles(col);
      this.container.addChild(this.beats[col]);
    }

    rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xFFFFFFFF, 0);
    //Currently it doesn't draw right. The right and bottom outline is twice the size and the counterparts
    //rectangle.lineStyle(borderSize, 0x007FFF, 1);
    rectangle.drawRect(0, 0, beatWidth, stripHeight);
    rectangle.endFill();
    let interactionRectTexture = rectangle.generateCanvasTexture();

    this.createShortcutKeyOverlays(shortcutKeys);

    for (let col = 0; col < beatCount; ++col) {
      this.createInteractionRects(col, interactionRectTexture, onclickCallback, shortcutKeys);
      this.container.addChild(this.interactionRects[col]);
    }

    this.active = false;
  }

  createInactiveRects(index: number, texture: PIXI.Texture) {
    this.inactiveRects[index] = new PIXI.Sprite(texture);
    this.inactiveRects[index].anchor.set(0.5, 0.5);
    this.inactiveRects[index].x = (index * this.beatWidth) + (this.beatWidth / 2);
    this.inactiveRects[index].y = (this.beatWidth / 2);
  }

  createActiveRects(index: number, texture: PIXI.Texture) {
    this.activeRects[index] = new PIXI.Sprite(texture);
    this.activeRects[index].anchor.set(0.5, 0.5);
    this.activeRects[index].x = (index * this.beatWidth) + (this.beatWidth / 2);
    this.activeRects[index].y = (this.beatWidth / 2);

    this.activeRects[index].visible = false;
  }

  createBeatCircles(index: number) {
    this.beats[index] = new PIXI.Graphics();
    this.beats[index].beginFill(0x000000);
    this.beats[index].drawCircle(0, 0, ((this.beatWidth - 64) / 2));
    this.beats[index].endFill();

    this.beats[index].x = (index * this.beatWidth) + (this.beatWidth / 2);
    this.beats[index].y = this.beatWidth / 2;
    this.beats[index].visible = false;
  }

  createInteractionRects(index:number, texture: PIXI.Texture, onclickCallback: any, keys: string[]) {
    this.interactionRects[index] = new PIXI.Sprite(texture);

    this.interactionRects[index].interactive = true;
    this.interactionRects[index].anchor.set(0.5, 0.5);
    this.interactionRects[index]
      .on('mousedown', function(e) {
        onclickCallback(keys[index]);
      }.bind(this))
      .on('pointerover', function(e) {
        this.onPointerOver(index);
      }.bind(this))
        .on('pointerout', function(e) {
          this.onPointerOut(index);
      }.bind(this));

    this.interactionRects[index].x = (index * this.beatWidth) + (this.beatWidth / 2);
    this.interactionRects[index].y = (this.beatWidth / 2);

    this.interactionRects[index].visible = true;
  }

  createShortcutKeyOverlays(shortcutKeys: string[]) {
    this.shortcutKeyOverlays = [];

    let style = new PIXI.TextStyle({
      fontFamily: 'Courier',
      fontSize: 72,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440
    });

    for (let i = 0; i < this.beatCount; ++i) {
      this.shortcutKeyOverlays[i] = new TextOverlay(this.beatWidth / 2, this.beatWidth / 2, 0xaaaaaaaa, 0.5, style);
      this.shortcutKeyOverlays[i].setText(shortcutKeys[i]);
      let renderable = this.shortcutKeyOverlays[i].getRenderableObject();
      renderable.x = (i * this.beatWidth) + (this.beatWidth / 2);
      renderable.y = this.beatWidth / 2;
      renderable.visible = false;
      this.container.addChild(this.shortcutKeyOverlays[i].getRenderableObject());
    }
  }

  getRenderableObject() {
    return this.container;
  }

  setRenderActive(active: boolean) {
    for (let i = 0; i < this.beatCount; ++i) {
      this.activeRects[i].visible = active;
      this.inactiveRects[i].visible = !active;
    }

    this.active = active;
  }

  updateBeatStatus(beat: number, value: boolean) {
    this.beats[beat].visible = value;
  }

  clearBeats() {
    this.beats.forEach(element => {
      element.visible = false;
    });
  }

  onPointerOver(index: number) {
    this.shortcutKeyOverlays[index].getRenderableObject().visible = true;
  }

  onPointerOut(index: number) {
    this.shortcutKeyOverlays[index].getRenderableObject().visible = false;
  }
}
