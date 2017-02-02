import * as PIXI from 'pixi.js'

export class RenderableStrip {
    container: PIXI.Container;
    activeRects: PIXI.Sprite[];
    inactiveRects: PIXI.Sprite[];
    beats: PIXI.Graphics[]

    constructor(private id, stripHeight: number, private beatWidth: number, private beatCount: number, onclickCallback: any) {
        this.container = new PIXI.Container();

        this.activeRects = [];
        this.inactiveRects = [];
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
        var activeRectTexture = rectangle.generateCanvasTexture();

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
        var inactiveRectTexture = rectangle.generateCanvasTexture();
        
        for (let col = 0; col < beatCount; ++col) {
            this.createInactiveRects(col, inactiveRectTexture);
            this.container.addChild(this.inactiveRects[col]);

            this.createActiveRects(col, activeRectTexture, onclickCallback);
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

        //--Currently there's no easy way to change the z order so need another loop here
        for (let col = 0; col < beatCount; ++col) {
            this.beats[col] = new PIXI.Graphics();
            this.beats[col].beginFill(0x000000);
            this.beats[col].drawCircle(0, 0, ((beatWidth - 64) / 2));
            this.beats[col].endFill();

            this.beats[col].x = (col * beatWidth) + (beatWidth / 2);
            this.beats[col].y = beatWidth / 2;
            this.beats[col].visible = false;
            this.container.addChild(this.beats[col]);
        }
        //--
    }

    createInactiveRects(index: number, texture: PIXI.Texture) {
        this.inactiveRects[index] = new PIXI.Sprite(texture);
        this.inactiveRects[index].anchor.set(0.5, 0.5);
        this.inactiveRects[index].x = (index * this.beatWidth) + (this.beatWidth / 2);
        this.inactiveRects[index].y = (this.beatWidth / 2);
    }

    createActiveRects(index: number, texture: PIXI.Texture, onclickCallback: any) {
        this.activeRects[index] = new PIXI.Sprite(texture);
            
        this.activeRects[index].interactive = true;
        this.activeRects[index].anchor.set(0.5, 0.5);
        this.activeRects[index]
            .on('mousedown', function(e) {
                this.onMousedown(this.activeRects[index], this.id, index);
                onclickCallback(this.id, index);
            }.bind(this));

        this.activeRects[index].x = (index * this.beatWidth) + (this.beatWidth / 2);
        this.activeRects[index].y = (this.beatWidth / 2);

        this.activeRects[index].visible = false;
    }

    getRenderableObject() {
        return this.container;
    }

    setRenderActive(active: boolean) {
        for (let i = 0; i < this.beatCount; ++i) {
            this.activeRects[i].visible = active;
            this.inactiveRects[i].visible = !active;
        }
    }

    onMousedown(sprite: PIXI.Sprite, id: number, col: number) {
        this.beats[col].visible = (true === this.beats[col].visible) ? false : true;
    }

    clearBeats() {
        this.beats.forEach(element => {
            element.visible = false;
        });
    }
}