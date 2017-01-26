import { Component, Input, OnInit } from '@angular/core';
import { KickInstrument, SnareInstrument } from "../../instruments/instrument";
import { GridService } from '../grid.service';
import * as PIXI from 'pixi.js'
import { RenderableStrip } from './renderableStrip';
import { RenderableBar } from './renderableBar';
 
@Component({
    selector: 'pixi-grid-component',
    templateUrl: 'pixiGrid.component.html'
})
 
export class PixiGridComponent implements OnInit {
    renderer: PIXI.SystemRenderer;

    stripHeight: number = 256;
    beatWidth: number = 256;
    stripGapSize: number = 16;

    renderableBar: RenderableBar;

    constructor(private grid: GridService) {
    }

    ngOnInit() {
        let beatCount = 4;
        let instrumentCount = 2;
        this.grid.resetStage([new SnareInstrument(), new KickInstrument], beatCount);

        let canvasHeight = (this.stripHeight * instrumentCount) + (this.stripGapSize * (instrumentCount - 1));
        this.renderer = PIXI.autoDetectRenderer(this.beatWidth * beatCount, canvasHeight);
        document.getElementById('canvas-container').appendChild(this.renderer.view);
        var stage = new PIXI.Container();
        
        for (let i = 0; i < instrumentCount; ++i)
        {
            let renderableStrip = new RenderableStrip(this.stripHeight, this.beatWidth, beatCount);
            let renderableObject = renderableStrip.getRenderableObject();
            renderableObject.y = i * (this.stripHeight + this.stripGapSize);
            stage.addChild(renderableObject);
        }

        this.renderableBar = new RenderableBar(8, canvasHeight);
        stage.addChild(this.renderableBar.getRenderableObject());

        this.renderer.render(stage);
    }
}