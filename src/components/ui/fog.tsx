/**
 * Procedural volumetric fog/mist using layered SVG turbulence noise.
 * Two layers drift in opposite directions at different speeds + blur amounts
 * to create depth. The whole layer fades in/out based on the `active` prop —
 * intended to be wired to a "flashing"/strike state so fog only appears
 * during lightning peaks (more atmospheric realism).
 */

interface FogProps {
  active: boolean
  /** Peak opacity when active. Default 0.7 */
  intensity?: number
  /** Tint color. Default near-white grayscale. */
  color?: string
  /** Drift speed multiplier. Default 1.0 */
  speed?: number
}

export function Fog({ active, intensity = 0.7, color = '#f0f8ff', speed = 1 }: FogProps) {
  // Each layer keeps its own slightly different baseFrequency seed for variation
  return (
    <div
      className="fog-root"
      style={{
        opacity: active ? intensity : 0,
        transition: active
          ? 'opacity 220ms ease-out'   // fade in fast on strike
          : 'opacity 1600ms ease-out', // fade out slow as storm calms
      }}
      aria-hidden
    >
      <div
        className="fog-layer fog-layer-back"
        style={{
          animationDuration: `${110 / speed}s`,
          color,
        }}
      />
      <div
        className="fog-layer fog-layer-front"
        style={{
          animationDuration: `${70 / speed}s`,
          color,
        }}
      />

      {/* SVG turbulence filter — referenced via CSS filter url(#...) below */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <filter id="fog-noise-a" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.025" numOctaves="3" seed="2" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0.85 -0.15"
            />
          </filter>
          <filter id="fog-noise-b" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.014" numOctaves="4" seed="9" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0.7 -0.1"
            />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
