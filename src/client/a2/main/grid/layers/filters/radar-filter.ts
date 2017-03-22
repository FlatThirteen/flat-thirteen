import * as PIXI from 'pixi.js'

export class RadarFilter extends PIXI.Filter {
  constructor(private maxTime: number) {
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

      vec4 RadarPing(vec2 uv, vec2 center, float innerTail, float frontierBorder, float timeResetSeconds, float radarPingSpeed, float fadeDistance)
      {
        vec2 diff = center-uv;
        float r = length(diff);
        float time = mod(time, timeResetSeconds) * radarPingSpeed;

        float circle;
        circle += smoothstep(time - innerTail, time, r) * smoothstep(time + frontierBorder,time, r);
        circle *= smoothstep(fadeDistance, 0.0, r);

        return vec4(circle, circle, circle, 1.0);
      }

      void main()
      {
        float fadeDistance = 1.0;
        float resetTimeSec = 5.0;
        float radarPingSpeed = 0.3;
        vec2 uv = vTextureCoord;
        vec2 mappedCoord = mapCoord(uv) / dimensions;
        vec2 mappedCenter = mapCoord(center) / dimensions;
        vec4 c = RadarPing(mappedCoord, mappedCenter, 0.15, 0.025, resetTimeSec, radarPingSpeed, fadeDistance);
        if (c.x < 0.5)
        {
          gl_FragColor = texture2D(uSampler, uv);
        }
        else
        {
          gl_FragColor = c * color;
        }
      }
      `, 
      {
        time: { type: '1f', value: 0.0 },
        center: { type: 'vec2', value: [0.5, 0.5] },
        color: { type: 'vec4', value: [1.0, 1.0, 1.0, 1.0] },
        size: { type: '1f', value: 0.05},
        dimensions: { type: 'vec2' }
      }
    );

    this.maxTime = maxTime;

    this.apply = (filterManager, input, output) => {
      this.uniforms.dimensions = [input.sourceFrame.width, input.sourceFrame.height];

      filterManager.applyFilter(this, input, output);
    };
  }

  update(delta: number): boolean {
    this.uniforms.time += delta;
    if (this.uniforms.time > this.maxTime) {
      this.uniforms.time = 0.0;
      return false;
    }

    return true;
  }
}