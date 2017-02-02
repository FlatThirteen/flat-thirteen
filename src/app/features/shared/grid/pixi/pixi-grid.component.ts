import { Component, OnInit } from '@angular/core';
import { KickSound, SnareSound } from "../../sounds/sound";
import { GridService } from '../grid.service';
import { BeatService } from "../../beat.service";
import { StageService } from "../../stage.service";
import * as PIXI from 'pixi.js'
import { RenderableStrip } from './renderableStrip';
import { RenderableBar } from './renderableBar';
import { CounterOverlay } from './counter-Overlay';

@Component({
    selector: 'pixi-grid',
    templateUrl: 'pixi-grid.component.html',
    styleUrls: ['pixi-grid.component.css'],
})

export class PixiGridComponent implements OnInit {
    renderer: PIXI.SystemRenderer;
    stage: PIXI.Container;

    stripHeight: number = 256;
    beatWidth: number = 256;
    stripGapSize: number = 16;
    beatCount: number = 4;
    instrumentCount = 2;

    renderableStrips: RenderableStrip[];
    renderableBar: RenderableBar;
    counterOverlay: CounterOverlay;

    constructor(private beat: BeatService, private grid: GridService, private stageService: StageService) {

    }

    ngOnInit() {
        this.grid.resetStage([new SnareSound(), new KickSound]);

        let canvasHeight = (this.stripHeight * this.instrumentCount) + (this.stripGapSize * (this.instrumentCount - 1));
        this.renderer = PIXI.autoDetectRenderer(this.beatWidth * this.beatCount, canvasHeight);
        document.getElementById('canvas-container').appendChild(this.renderer.view);

        this.stage = new PIXI.Container();

        this.renderableStrips = [];
        for (let i = 0; i < this.instrumentCount; ++i)
        {
            this.renderableStrips[i] = new RenderableStrip(i, this.stripHeight, this.beatWidth, this.beatCount, this.grid.onToggle.bind(this.grid));
            let renderableObject = this.renderableStrips[i].getRenderableObject();
            renderableObject.y = i * (this.stripHeight + this.stripGapSize);
            this.stage.addChild(renderableObject);
        }

        this.renderableBar = new RenderableBar(8, canvasHeight);
        this.renderableBar.getRenderableObject().visible = false;
        this.stage.addChild(this.renderableBar.getRenderableObject());

        this.counterOverlay = new CounterOverlay((this.beatWidth * this.beatCount) / 3, (this.stripHeight * this.instrumentCount) / 3);
        let counterOverlay = this.counterOverlay.getRenderableObject();
        counterOverlay.visible = false;
        counterOverlay.x = (this.beatWidth * this.beatCount) / 2;
        counterOverlay.y = (this.stripHeight * this.instrumentCount) / 2;
        this.stage.addChild(counterOverlay);

        this.render();
    }

    render() {
        if (true === this.stageService.shouldShowPosition()) {
            this.renderableBar.getRenderableObject().visible = true;
        }
        this.renderer.render(this.stage);

        if (false === this.beat.paused) {
            this.renderableBar.getRenderableObject().x = this.beat.progress() * (this.beatWidth * this.beatCount);
        }

        let name = this.stageService.stateName();
        let active = false;
        switch(name) {
            case "Demo":
                active = false;
                break;
            case "Play":
                active = true;
                break;
            case "Victory":
                this.processVictoryState();
                break;
        }
        for (let i = 0; i < this.instrumentCount; ++i) {
            this.renderableStrips[i].setRenderActive(active);
            for (let beat = 0; beat < this.beatCount; ++beat) {
                this.renderableStrips[i].updateBeatStatus(beat, this.grid.getGridValue(i, beat));
            }
        }

        if (!this.beat.paused && (undefined != this.beat.count()))
        {
            this.counterOverlay.setCounterValue(this.beat.count());
            this.counterOverlay.getRenderableObject().visible = this.stageService.shouldShowCount();
        }

        requestAnimationFrame(this.render.bind(this));
    }

    processVictoryState() {
        this.renderableStrips.forEach(element => {
            element.clearBeats();
        });
    }
}
