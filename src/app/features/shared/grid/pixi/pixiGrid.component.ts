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
    stage: PIXI.Container;

    stripHeight: number = 256;
    beatWidth: number = 256;
    stripGapSize: number = 16;
    beatCount: number = 4;

    renderableBar: RenderableBar;

    constructor(private grid: GridService) {
        
    }

    ngOnInit() {
        let instrumentCount = 2;

        this.grid.resetStage([new SnareInstrument(), new KickInstrument], this.beatCount);

        let canvasHeight = (this.stripHeight * instrumentCount) + (this.stripGapSize * (instrumentCount - 1));
        this.renderer = PIXI.autoDetectRenderer(this.beatWidth * this.beatCount, canvasHeight);
        document.getElementById('canvas-container').appendChild(this.renderer.view);
        
        this.stage = new PIXI.Container();
        
        for (let i = 0; i < instrumentCount; ++i)
        {
            let renderableStrip = new RenderableStrip(i, this.stripHeight, this.beatWidth, this.beatCount, this.grid.onToggle.bind(this.grid));
            let renderableObject = renderableStrip.getRenderableObject();
            renderableObject.y = i * (this.stripHeight + this.stripGapSize);
            this.stage.addChild(renderableObject);
        }

        this.renderableBar = new RenderableBar(8, canvasHeight);
        this.renderableBar.getRenderableObject().visible = false;
        this.stage.addChild(this.renderableBar.getRenderableObject());

        this.stage.interactive = true;
        this.stage
            .on('mouseup', this.onCanvasMouseUp.bind(this));

        this.render();
    }

    render() {
        if (true === this.grid.showPosition()) {
            this.renderableBar.getRenderableObject().visible = true;
        }
        this.renderer.render(this.stage);
        this.renderableBar.getRenderableObject().x = this.grid.gridLoop.progress * (this.beatWidth * this.beatCount);

        requestAnimationFrame(this.render.bind(this));
    }

    onCanvasMouseUp() {
        if (true === this.grid.paused) {
            this.grid.start();
            this.stage.interactive = false;
        }
    }
}