import * as PIXI from 'pixi.js'

class ExampleFilter extends PIXI.Filter {
  constructor() {
    super(
      null, 
      `
      uniform float time;

      void main()
      {
          //gl_FragColor = vec4(gl_FragCoord.x/1000.0, 0.0, 0.0, 1.0);
          gl_FragColor = vec4(time, 0.0, 0.0, 1.0);
      }
      `, 
      {
        time: { type: '1f' }
      }
    );
  }
}

class RadialGradient extends PIXI.Filter {
  constructor() {
    super(
      null,
      `
      varying vec2 vTextureCoord;

      uniform vec4 color;
      uniform float expand;
      uniform vec2 center;
      uniform float radius;

      void main(void)
      {
        vec2 uv = vTextureCoord;
        vec2 texCoord = uv;

        float dist = distance(uv, center);

        vec4 c = color - vec4(dist, dist, dist, 1.0);
        //vec4 c = smoothstep(0.0,1.0,dist) * vec4(1.0, 0.0, 0.0, 1.0);
        gl_FragColor = vec4(c.x,c.y,c.z,color.w);
      }
      `,
      {
        color: { type: 'vec4' },
        expand: { type: '1f' },
        center: { type: 'vec2' },
        radius: { type: '1f' },
      }
    )
  }
}

class ShockwaveFilter extends PIXI.Filter {
  constructor() {
    super(
      null, 
      `
      varying vec2 vTextureCoord;

      uniform sampler2D uSampler;

      uniform vec2 center;
      uniform vec3 params; // 10.0, 0.8, 0.1
      uniform float time;

      void main()
      {
          vec2 uv = vTextureCoord;
          vec2 texCoord = uv;

          float dist = distance(uv, center);

          if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )
          {
              float diff = (dist - time);
              float powDiff = 1.0 - pow(abs(diff*params.x), params.y);

              float diffTime = diff  * powDiff;
              vec2 diffUV = normalize(uv - center);
              texCoord = uv + (diffUV * diffTime);
          }

          gl_FragColor = texture2D(uSampler, texCoord);
      }
      `, 
      {
        uSampler: { type: 'sampler2D', value: 0 },
        center: { type: 'vec2' },
        params: { type: 'vec3' },
        time: { type: '1f', value: 0 }
      }
    );
  }
}

class RadarFilter extends PIXI.Filter {
  constructor() {
    super(
      null, 
      `
      varying vec2 vTextureCoord;

      uniform sampler2D uSampler;

      uniform float time;
      uniform vec2 center;
      uniform vec4 color;
      uniform vec2 dimensions;
      uniform vec4 filterArea;

      vec2 mapCoord( vec2 coord )
      {
          coord *= filterArea.xy;
          coord += filterArea.zw;

          return coord;
      }

      void main()
      {
          vec2 uv = vTextureCoord;
          vec4 finalColor;
          vec2 mappedCoord = mapCoord(uv) / dimensions;
          
          float r = distance(mappedCoord, center);
          float value = smoothstep(0.0,time,r);

          finalColor += value * color;
          if (value > 0.5 || value < 0.25)
          {
            gl_FragColor = texture2D(uSampler, uv);
          }
          else
          {
            gl_FragColor = mix(texture2D(uSampler, uv), finalColor, 1.0);
          }
      }
      `, 
      {
        time: { type: '1f' },
        center: { type: 'vec2' },
        color: { type: 'vec4' },
        dimensions: { type: 'vec2'}
      }
    );
  }
}

class ExpFilter extends PIXI.Filter {
  constructor() {
    super(
      null, 
      `
      varying vec2 vTextureCoord;

      uniform sampler2D uSampler;
      uniform vec2 dimensions;
      uniform vec4 filterArea;

      vec2 mapCoord( vec2 coord )
      {
          coord *= filterArea.xy;
          coord += filterArea.zw;

          return coord;
      }

      void main()
      {
          vec2 uv = mapCoord(vTextureCoord) / dimensions;
          float x = step(0.5, uv.x);
          float y = step(0.5, uv.y);

          gl_FragColor = vec4(x, y, 0.0, 1.0);
      }
      `, 
      {
        dimensions: { type: 'vec2'}
      }
    );
  }
}

export class TopEffect {
  renderer: PIXI.SystemRenderer;
  container: PIXI.Container;
  width: number;
  height: number;
  shockwaveFilter: ShockwaveFilter;
  radarFilter: RadarFilter;

  init(width: number, height: number) {
   this.width = width;
    this.height = height;
    this.renderer = PIXI.autoDetectRenderer(width, height, { transparent: true });
    //this.renderer = PIXI.autoDetectRenderer(width, height, { transparent: false });
    this.renderer.autoResize = true;
    this.container = new PIXI.Container();

    let beatWidth = width/4;
    let beatHeight = height/2;
    let g = new PIXI.Graphics();
    g.beginFill(0x000000, 0.0);
    g.drawRect(0, 0, beatWidth, beatHeight);
    g.endFill();
    
    let texture = g.generateCanvasTexture();
    let sprite = new PIXI.Sprite(texture);
    //sprite.anchor.set(0.5, 0.5);
    //sprite.x = width/2;
    //sprite.y = height/2;

    let sprite2 = new PIXI.Sprite(texture);
    sprite2.anchor.set(0.5, 0.5);
    sprite2.x = width/2;
    sprite2.y = height;

    let rgFilter = new RadialGradient();
    rgFilter.uniforms.color = [0.0, 127.0/255.0, 1.0, 0.0];
    rgFilter.uniforms.center = [0.375, 0.375];
    rgFilter.uniforms.radius = height/2;
    rgFilter.uniforms.expand = 0.0;
    rgFilter.uniforms.windowHeight = height;

    this.shockwaveFilter = new ShockwaveFilter();
    this.shockwaveFilter.uniforms.center = [0.375, 0.375];
    this.shockwaveFilter.uniforms.params = [10, 0.8, 0.1];
    this.shockwaveFilter.uniforms.time = 0;
    /*
    this.shockwaveFilter = new ExampleFilter();
    this.shockwaveFilter.uniforms.time = 0.0;
    */

    this.radarFilter = new RadarFilter();
    this.radarFilter.uniforms.center = [0.5, 0.5];
    this.radarFilter.uniforms.color = [1.0, 0.13, 0.0, 1.0];
    this.radarFilter.uniforms.time = 0.0;
    this.radarFilter.apply = function(filterManager, input, output)
    {
      this.uniforms.dimensions = [input.sourceFrame.width, input.sourceFrame.height];

      filterManager.applyFilter(this, input, output);
    }.bind(this.radarFilter);

    let expFilter = new ExpFilter();
    expFilter.apply = function(filterManager, input, output) {
      this.uniforms.dimensions = [input.sourceFrame.width, input.sourceFrame.height];

      filterManager.applyFilter(this, input, output);
    }.bind(expFilter);
    
    //expFilter.uniforms.dimensions = [beatWidth, beatHeight];

    //g.filters = [this.shockwaveFilter];
    //sprite.filters = [this.shockwaveFilter, rgFilter];
    //sprite.filters = [rgFilter, this.shockwaveFilter];
    sprite.filters = [this.radarFilter];

    //sprite2.filters = [this.radarFilter];

    this.container.addChild(sprite);
    //this.container.addChild(sprite2);
  }

  getView() {
    return this.renderer.view;
  }

  render() {
    this.shockwaveFilter.uniforms.time += 0.01;
    if (this.shockwaveFilter.uniforms.time >= 1.0) {
        this.shockwaveFilter.uniforms.time = 0.0;
    }

    this.radarFilter.uniforms.time += 0.02;
    if (this.radarFilter.uniforms.time >= 1.0) {
        this.radarFilter.uniforms.time = 0.0;
    }

    this.renderer.render(this.container);

    
  }

  resize(width: number, height: number, scale: boolean) {
    this.renderer.resize(width, height);
    if (true === scale) {
      //TODO: scale
      let point = new PIXI.Point(width/this.width, height/this.height);
      this.container.scale = point;
    }
  }
}