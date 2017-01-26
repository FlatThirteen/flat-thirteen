import * as PIXI from 'pixi.js'

export class RenderableStrip {
    container: PIXI.Container;
    sprites: PIXI.Sprite[];
    beats: PIXI.Graphics[]

    constructor(private id, stripHeight: number, beatWidth: number, beatCount: number, onclickCallback: any) {
        this.container = new PIXI.Container();

        this.sprites = [];
        this.beats = [];
        let borderSize = 12;
        
        for (let col = 0; col < beatCount; ++col) {
            let rectangle = new PIXI.Graphics();
            rectangle.beginFill(0x007FFF);
            //Currently it doesn't draw right. The right and bottom outline is twice the size and the counterparts
            //rectangle.lineStyle(borderSize, 0x007FFF, 1);
            rectangle.drawRect(0, 0, beatWidth, stripHeight);
            rectangle.endFill();
            //this.container.addChild(rectangle);

            var texture = rectangle.generateCanvasTexture();
            this.sprites[col] = new PIXI.Sprite(texture);
            
            this.sprites[col].interactive = true;
            this.sprites[col].anchor.set(0.5, 0.5);
            this.sprites[col]
                .on('mousedown', function(e) {
                    this.onMousedown(this.sprites[col], this.id, col);
                    onclickCallback(this.id, col);
                }.bind(this));

            this.sprites[col].x = (col * beatWidth) + (beatWidth / 2);
            this.sprites[col].y = (beatWidth / 2);
            this.container.addChild(this.sprites[col]);

            //--Draw a smaller rectangle to create the impression of border
            rectangle = new PIXI.Graphics();
            rectangle.beginFill(0x008FFF);
            rectangle.drawRect(0, 0, beatWidth - borderSize, stripHeight - borderSize);
            rectangle.endFill();
            rectangle.x = (col * beatWidth) + (borderSize / 2);
            rectangle.y = (borderSize / 2);
            this.container.addChild(rectangle);
            //--

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

        //--Currently there's no easy way to change the z order so need another loop here
        for (let col = 0; col < beatCount; ++col) {
            this.beats[col] = new PIXI.Graphics();
            this.beats[col].beginFill(0x000000);
            //this.beats[col].lineStyle(12, 0x000000, 1);
            this.beats[col].drawCircle(0, 0, ((beatWidth - 64) / 2));
            this.beats[col].endFill();

            this.beats[col].x = (col * beatWidth) + (beatWidth / 2);
            this.beats[col].y = beatWidth / 2;
            this.beats[col].visible = false;
            this.container.addChild(this.beats[col]);
        }
        //--
    }

    getRenderableObject() {
        return this.container;
    }

    onMousedown(sprite: PIXI.Sprite, id: number, col: number) {

        this.beats[col].visible = (true === this.beats[col].visible) ? false : true;
    }
}