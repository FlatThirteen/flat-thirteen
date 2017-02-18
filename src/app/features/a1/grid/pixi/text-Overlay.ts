import * as PIXI from 'pixi.js'

export class TextOverlay {
  container: PIXI.Container;
  text: PIXI.Text;

  constructor(width: number, height: number, backgroundColor: number, alpha: number, style: PIXI.TextStyle) {
    this.container = new PIXI.Container();

    let graphics = new PIXI.Graphics();
    graphics.beginFill(backgroundColor, alpha);
    graphics.drawCircle(0, 0, width/2);
    graphics.endFill();
    this.container.addChild(graphics)

    this.text = new PIXI.Text("", style);
    this.text.x = this.text.x - (width / 6);
    this.text.y = this.text.y - (width / 6);
    this.container.addChild(this.text);
  }

  getRenderableObject() {
    return this.container;
  }

  setText(value: string) {
    this.text.text = value;
  }
}