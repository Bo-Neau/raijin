import { useRef, useEffect } from 'react'

export interface LightningProps {
  hue?: number       // 0–360. With saturation=0 below, hue is effectively ignored — render is grayscale.
  xOffset?: number   // horizontal offset; -1..1 useful range
  speed?: number     // animation speed
  intensity?: number // overall brightness multiplier
  size?: number      // fbm "zoom" level
}

/**
 * Procedural WebGL lightning. Adapted from a public domain shader, modified
 * for Raijin: saturation locked to 0 (grayscale only) and a slimmer fragment
 * shader. Renders continuously into a canvas — no asset overhead.
 */
export function Lightning({
  hue = 220,
  xOffset = 0,
  speed = 0.8,
  intensity = 0.55,
  size = 1.4,
}: LightningProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    const gl = canvas.getContext('webgl')
    if (!gl) {
      console.warn('Lightning: WebGL not supported')
      return
    }

    const vertSrc = `
      attribute vec2 aPosition;
      void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
    `

    // Grayscale variant: saturation locked to 0.0 so hue is irrelevant —
    // lightning renders as white plasma on transparent background.
    const fragSrc = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;

      #define OCTAVE_COUNT 10

      float hash11(float p) {
        p = fract(p * 0.1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
      }
      float hash12(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }
      mat2 rotate2d(float t) {
        float c = cos(t); float s = sin(t);
        return mat2(c, -s, s, c);
      }
      float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 fp = fract(p);
        float a = hash12(ip);
        float b = hash12(ip + vec2(1.0, 0.0));
        float c = hash12(ip + vec2(0.0, 1.0));
        float d = hash12(ip + vec2(1.0, 1.0));
        vec2 t = smoothstep(0.0, 1.0, fp);
        return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < OCTAVE_COUNT; ++i) {
          value += amplitude * noise(p);
          p *= rotate2d(0.45);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        uv = 2.0 * uv - 1.0;
        uv.x *= iResolution.x / iResolution.y;
        uv.x += uXOffset;

        uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;

        float dist = abs(uv.x);
        // Pure white plasma — no hue.
        vec3 col = vec3(1.0) * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
        gl_FragColor = vec4(col, 1.0);
      }
    `

    const compile = (src: string, type: number) => {
      const sh = gl.createShader(type)
      if (!sh) return null
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh))
        gl.deleteShader(sh)
        return null
      }
      return sh
    }

    const vs = compile(vertSrc, gl.VERTEX_SHADER)
    const fs = compile(fragSrc, gl.FRAGMENT_SHADER)
    if (!vs || !fs) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    const verts = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1])
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, 'iResolution')
    const uTime = gl.getUniformLocation(program, 'iTime')
    const uOff = gl.getUniformLocation(program, 'uXOffset')
    const uSpeed = gl.getUniformLocation(program, 'uSpeed')
    const uInt = gl.getUniformLocation(program, 'uIntensity')
    const uSize = gl.getUniformLocation(program, 'uSize')

    const start = performance.now()
    let raf = 0
    const tick = () => {
      resize()
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.uniform1f(uOff, xOffset)
      gl.uniform1f(uSpeed, speed)
      gl.uniform1f(uInt, intensity)
      gl.uniform1f(uSize, size)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
      // Silence unused warning
      void hue
    }
  }, [hue, xOffset, speed, intensity, size])

  return <canvas ref={canvasRef} className="w-full h-full block" />
}
