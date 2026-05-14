/**
 * StormClouds — two layers of volumetric clouds at the bottom of the hero.
 * Each layer is a row of overlapping radial-gradient ellipse "puffs" pushed
 * through a turbulence-based feDisplacementMap so the smooth ellipse edges
 * break into organic, billowy cloud silhouettes. Far bank is cooler/softer
 * and drifts slowly; near bank is darker/denser and drifts faster.
 * (Scroll parallax intentionally removed.)
 */
export function StormClouds() {
  // Hand-tuned puff layouts (viewBox = 1600×600). Overlapping, varied
  // heights, asymmetric — reads as a real cloud bank.
  const farClouds = [
    { cx: 120,  cy: 470, rx: 280, ry: 85,  o: 0.55 },
    { cx: 360,  cy: 430, rx: 320, ry: 110, o: 0.70 },
    { cx: 640,  cy: 460, rx: 260, ry: 80,  o: 0.55 },
    { cx: 880,  cy: 420, rx: 340, ry: 120, o: 0.75 },
    { cx: 1200, cy: 450, rx: 300, ry: 95,  o: 0.65 },
    { cx: 1500, cy: 470, rx: 260, ry: 80,  o: 0.55 },
  ]
  const nearClouds = [
    { cx: -40,  cy: 540, rx: 340, ry: 110, o: 0.85 },
    { cx: 260,  cy: 520, rx: 290, ry: 95,  o: 0.75 },
    { cx: 520,  cy: 555, rx: 380, ry: 130, o: 0.95 },
    { cx: 880,  cy: 535, rx: 320, ry: 105, o: 0.85 },
    { cx: 1180, cy: 560, rx: 360, ry: 120, o: 0.95 },
    { cx: 1500, cy: 540, rx: 320, ry: 110, o: 0.85 },
    { cx: 1750, cy: 555, rx: 280, ry: 95,  o: 0.75 },
  ]

  return (
    <>
      {/* Shared filter + gradient defs */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <filter id="cloud-displace-far" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="55" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id="cloud-displace-near" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves={4} seed="11" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="70" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="3" />
          </filter>

          <radialGradient id="cloud-puff-far" cx="50%" cy="50%" r="55%">
            <stop offset="0%"  stopColor="#4a5060" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#262a32" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cloud-puff-near" cx="50%" cy="50%" r="55%">
            <stop offset="0%"  stopColor="#1f242c" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#0e1015" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Far bank — cooler, softer, slow drift */}
      <div className="storm-clouds clouds-far" aria-hidden>
        <div className="cloud-drift cloud-drift-slow">
          <svg viewBox="0 0 1600 600" preserveAspectRatio="xMidYMax slice">
            <g filter="url(#cloud-displace-far)">
              {farClouds.map((c, i) => (
                <ellipse
                  key={i}
                  cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry}
                  fill="url(#cloud-puff-far)" opacity={c.o}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Near bank — denser, darker, sits lower, faster drift */}
      <div className="storm-clouds clouds-near" aria-hidden>
        <div className="cloud-drift cloud-drift-fast">
          <svg viewBox="0 0 1600 600" preserveAspectRatio="xMidYMax slice">
            <g filter="url(#cloud-displace-near)">
              {nearClouds.map((c, i) => (
                <ellipse
                  key={i}
                  cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry}
                  fill="url(#cloud-puff-near)" opacity={c.o}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </>
  )
}
