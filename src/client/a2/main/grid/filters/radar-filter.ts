import * as PIXI from 'pixi.js'

export class RadarFilter extends PIXI.Filter {
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
          finalColor.w = 1.0;
          if (value > 0.5 || value < 0.3)
          {
            gl_FragColor = texture2D(uSampler, uv);
          }
          else
          {
            gl_FragColor = finalColor;//mix(texture2D(uSampler, uv), finalColor, 1.0);
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