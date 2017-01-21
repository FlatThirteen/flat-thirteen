import { Component, Input, OnInit } from '@angular/core';

import * as PIXI from 'pixi.js'
 
@Component({
    selector: 'pixi-grid-component',
    templateUrl: 'pixiGrid.component.html'
})
 
export class PixiGridComponent implements OnInit {
    renderer: PIXI.SystemRenderer;
    @Input() stripCount: number;
    @Input() beatCount: number;
    stripHeight: number = 256;
    beatWidth: number = 256;

    constructor() {
    }

    ngOnInit() {

        //Create the renderer
        this.renderer = PIXI.autoDetectRenderer(this.beatWidth * this.beatCount, this.stripHeight * this.stripCount);

        document.getElementById('canvas-container').appendChild(this.renderer.view);

        //Create a container object called the `stage`
        var stage = new PIXI.Container();

        const rows = this.stripCount;
        const cols = this.beatCount;
        for (let row = 0; row < rows; ++row) {
            for (let col = 0; col < cols; ++col) {
                
                let rectangle = new PIXI.Graphics();
                rectangle.beginFill(0x008FFF);
                rectangle.lineStyle(12, 0x007FFF, 1);
                rectangle.drawRect(col * this.beatWidth, row * this.stripHeight, this.beatWidth, this.stripHeight);
                rectangle.endFill();
                stage.addChild(rectangle)

                if (col > 0 && col < this.beatCount) {
                    const dividerWidth = 2;
                    const dividerXOffset = dividerWidth / 2;
                    const dividerHeightDifference = this.stripHeight - (this.stripHeight / 4);
                    const dividerHeight = this.stripHeight - dividerHeightDifference;
                    const dividerYOffset = dividerHeightDifference / 2;
                    let rectangle = new PIXI.Graphics();
                    rectangle.beginFill(0xFFFFFF);
                    rectangle.drawRect(col * this.beatWidth - dividerXOffset, row * this.stripHeight + dividerYOffset, 2, dividerHeight);
                    rectangle.endFill();
                    stage.addChild(rectangle);
                }
            }
        }

        //Tell the `renderer` to `render` the `stage`
        this.renderer.render(stage);
    }
}