import * as PIXI from 'pixi.js'

export class RadarFilter extends PIXI.Filter {
  constructor() {
    super(
      null, 
      `
      varying vec2 vTextureCoord;

      uniform sampler2D uSampler;
      uniform vec4 filterArea;

      uniform vec2 dimensions;

      uniform float time;
      uniform vec2 center;
      uniform vec4 color;
      uniform float size;     

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
          float value = smoothstep(time-0.05,time,r) - smoothstep(time+0.05, time, r);

          finalColor += value * color;
          finalColor.w = 1.0;

          if (value < 1.0 && value > 0.0)
          {
            gl_FragColor = finalColor;
          }
          else
          {
            gl_FragColor = texture2D(uSampler, uv);
          }
          
      }
      `, 
      {
        time: { type: '1f', value: 0.0 },
        center: { type: 'vec2', value: [0.5, 0.5] },
        color: { type: 'vec4', value: [1.0, 1.0, 1.0, 1.0] },
        size: { type: '1f', value: 0.05}
        dimensions: { type: 'vec2' }
      }
    );
  }
}