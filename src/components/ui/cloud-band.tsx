/**
 * CloudBand — a horizontal strip of layered turbulence clouds drifting
 * sideways. Sits between sections as a visual bridge. Three layers at
 * different depths/speeds/blurs for parallax cloud feeling. Pure CSS/SVG —
 * no JS, no canvas, gracefully degrades.
 */
interface CloudBandProps {
  /** Strip height in px. Default 240. */
  height?: number
  /** Drift speed multiplier. 1 = baseline ~120s loop. */
  speed?: number
  className?: string
}

export function CloudBand({ height = 240, speed = 1, className = "" }: CloudBandProps) {
  const base = 120 / speed // base drift duration in seconds
  return (
    <section
      className={`cloud-band ${className}`}
      style={{ height: `${height}px` }}
      aria-hidden
    >
      {/* Far layer — slow, soft, low opacity */}
      <div
        className="cloud-layer cloud-back"
        style={{ animationDuration: `${base * 1.6}s` }}
      />
      {/* Mid layer — moderate */}
      <div
        className="cloud-layer cloud-mid"
        style={{ animationDuration: `${base}s` }}
      />
      {/* Near layer — faster, denser, more contrast */}
      <div
        className="cloud-layer cloud-front"
        style={{ animationDuration: `${base * 0.65}s` }}
      />

      {/* SVG turbulence filters (referenced via CSS filter url(#...)) */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="cloud-noise-back" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.015" numOctaves="4" seed="3" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.78
                      0 0 0 0 0.82
                      0 0 0 0 0.88
                      0 0 0 0.45 -0.05"
            />
          </filter>
          <filter id="cloud-noise-mid" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.022" numOctaves="5" seed="11" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.6
                      0 0 0 0 0.65
                      0 0 0 0 0.72
                      0 0 0 0.7 -0.18"
            />
          </filter>
          <filter id="cloud-noise-front" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.032" numOctaves="5" seed="29" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.42
                      0 0 0 0 0.45
                      0 0 0 0 0.5
                      0 0 0 0.85 -0.3"
            />
          </filter>
        </defs>
      </svg>
    </section>
  )
}
