import * as PIXI from 'pixi.js'

export class RenderableStrip {
    container: PIXI.Container;

    constructor(stripHeight: number, beatWidth: number, beatCount: number) {
        this.container = new PIXI.Container();

        for (let col = 0; col < beatCount; ++col) {
            let rectangle = new PIXI.Graphics();
            rectangle.beginFill(0x008FFF);
            rectangle.lineStyle(12, 0x007FFF, 1);
            rectangle.drawRect(col * beatWidth, 0, beatWidth, stripHeight);
            rectangle.endFill();
            this.container.addChild(rectangle)

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
    }

    getRenderableObject() {
        return this.container;
    }
}