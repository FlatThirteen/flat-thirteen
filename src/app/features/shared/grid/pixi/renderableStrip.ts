import * as PIXI from 'pixi.js'

export class RenderableStrip {
    container: PIXI.Container;
    activeRects: PIXI.Sprite[];
    inactiveRects: PIXI.Sprite[];
    beats: PIXI.Graphics[]

    interactionRects: PIXI.Sprite[];

    constructor(private id, stripHeight: number, private beatWidth: number, private beatCount: number, onclickCallback: any) {
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

        //--Currently there's no easy way to change the z order so need another loop here
        for (let col = 0; col < beatCount; ++col) {
            this.createBeatCircles(col);
            this.container.addChild(this.beats[col]);
        }
        //--

        rectangle = new PIXI.Graphics();
        rectangle.beginFill(0xFFFFFFFF, 0);
        //Currently it doesn't draw right. The right and bottom outline is twice the size and the counterparts
        //rectangle.lineStyle(borderSize, 0x007FFF, 1);
        rectangle.drawRect(0, 0, beatWidth, stripHeight);
        rectangle.endFill();
        var interactionRectTexture = rectangle.generateCanvasTexture();

        for (let col = 0; col < beatCount; ++col) {
            this.createInteractionRects(col, interactionRectTexture, onclickCallback);
            this.container.addChild(this.interactionRects[col]);
        }
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

    createInteractionRects(index:number, texture: PIXI.Texture, onclickCallback: any) {
        this.interactionRects[index] = new PIXI.Sprite(texture);
            
        this.interactionRects[index].interactive = true;
        this.interactionRects[index].anchor.set(0.5, 0.5);
        this.interactionRects[index]
            .on('mousedown', function(e) {
                this.onMousedown(index);
                onclickCallback(this.id, index);
            }.bind(this));

        this.interactionRects[index].x = (index * this.beatWidth) + (this.beatWidth / 2);
        this.interactionRects[index].y = (this.beatWidth / 2);

        this.interactionRects[index].visible = false;
    }

    getRenderableObject() {
        return this.container;
    }

    setRenderActive(active: boolean) {
        for (let i = 0; i < this.beatCount; ++i) {
            this.activeRects[i].visible = active;
            this.interactionRects[i].visible = active;
            this.inactiveRects[i].visible = !active;
        }
    }

    onMousedown(index: number) {
        this.beats[index].visible = (true === this.beats[index].visible) ? false : true;
    }

    clearBeats() {
        this.beats.forEach(element => {
            element.visible = false;
        });
    }
}