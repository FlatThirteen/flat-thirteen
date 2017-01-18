import { Component, OnInit } from '@angular/core';

import * as PIXI from 'pixi.js'
 
@Component({
    selector: 'pixi-grid-component',
    templateUrl: 'pixiGrid.component.html'
})
 
export class PixiGridComponent implements OnInit {
    renderer: PIXI.SystemRenderer;

    constructor() {
        
    }

    ngOnInit() {
        //Create the renderer
        this.renderer = PIXI.autoDetectRenderer(1024, 512);

        document.getElementById('canvas-container').appendChild(this.renderer.view);

        //Create a container object called the `stage`
        var stage = new PIXI.Container();

        //Tell the `renderer` to `render` the `stage`
        this.renderer.render(stage);
    }
}