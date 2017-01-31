import * as PIXI from 'pixi.js'

export class RenderableBar {
    container: PIXI.Container;

    constructor(width: number, height: number) {
        this.container = new PIXI.Container();

        let rectangle = new PIXI.Graphics();
        rectangle.beginFill(0xFFFFFF);
        rectangle.lineStyle(12, 0xFFFFFF, 0.5);
        rectangle.drawRect(0, 0, width, height);
        rectangle.endFill();
        this.container.addChild(rectangle)
    }

    getRenderableObject() {
        return this.container;
    }
}