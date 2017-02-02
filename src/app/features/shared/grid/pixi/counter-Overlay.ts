import * as PIXI from 'pixi.js'

export class CounterOverlay {
    container: PIXI.Container;
    text: PIXI.Text;

    constructor(width: number, height: number) {
        this.container = new PIXI.Container();

        let graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFFFF);
        graphics.drawCircle(0, 0, width/2);
        graphics.endFill();
        this.container.addChild(graphics)

        var style = new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 36,
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

        this.text = new PIXI.Text("", style);
        this.container.addChild(this.text);
    }

    getRenderableObject() {
        return this.container;
    }

    setCounterValue(value: number) {
        this.text.text = value.toString();
    }
}