import { useEffect, useRef, useState } from 'react'
import './index.css'
import { Lightning } from './components/ui/lightning'
import { Fog } from './components/ui/fog'
import raijinLogoPng from './assets/raijin-logo-cutout.png'
import raijinLogoWebp from './assets/raijin-logo-cutout.webp'

// ── Strike timing hook ──────────────────────────────────────────────────────
// Random rest periods punctuated by brief lightning peaks. No assets, no
// frame swapping — just a clean state machine that drives:
//   - the page-wide brightness pulse (dark→bright→dark)
//   - the fog opacity
//   - the shader intensity multiplier (optional)
//
// Rest: 2–4 sec random dark hold.
// Strike: 1.5–3 sec of "lit" state.
function useStrikeTiming() {
  const [flashing, setFlashing] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    let cancelled = false
    const queue = (ms: number, fn: () => void) => {
      const t = setTimeout(() => { if (!cancelled) fn() }, ms)
      timersRef.current.push(t)
    }

    let isFirst = true
    const scheduleNext = () => {
      const restDelay = isFirst ? 1000 : (2000 + Math.random() * 2000) // 2–4s
      isFirst = false
      queue(restDelay, () => {
        setFlashing(true)
        const holdMs = 1500 + Math.random() * 1500 // 1.5–3s lit
        queue(holdMs, () => {
          setFlashing(false)
          // Wait for fade to finish before scheduling the next strike
          queue(1300, () => scheduleNext())
        })
      })
    }

    scheduleNext()

    return () => {
      cancelled = true
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [])

  return flashing
}

// ── Marquee ticker ─────────────────────────────────────────────────────────
function Marquee() {
  const items = [
    '⚡ ANCIENT POWER',
    'MODERN VELOCITY',
    '雷神',
    'STRIKE FAST',
    'FORGE SYSTEMS',
    'COMMAND THE STORM',
    'EST. MMXXVI',
  ]
  const list = [...items, ...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {list.map((t, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-text">{t}</span>
            <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Stats strip ────────────────────────────────────────────────────────────
function Stats() {
  return (
    <section className="stats-strip">
      <div className="stats-grid">
        <div className="stat">
          <div className="stat-num">12<span>+</span></div>
          <div className="stat-label">Years of velocity</div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <div className="stat-num">120<span>+</span></div>
          <div className="stat-label">Storms weathered</div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <div className="stat-num">24<span>/7</span></div>
          <div className="stat-label">Lightning ready</div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <div className="stat-num">∞</div>
          <div className="stat-label">Thunder ahead</div>
        </div>
      </div>
    </section>
  )
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false)
  const isFlashing = useStrikeTiming()

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 40)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`site ${loaded ? 'loaded' : ''} ${isFlashing ? 'is-flashing' : ''}`}>
      <div className="grain" aria-hidden />

      {/* Full-page brightness pulse — flashes white during strikes,
          fades slowly back to dark. Sits above everything except cursor. */}
      <div className="page-flash" aria-hidden />

      {/* Navigation — fully transparent now (no banner background) */}
      <nav className="site-nav">
        <a
          href="#"
          className="nav-logo"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >
          <picture>
            <source srcSet={raijinLogoWebp} type="image/webp" />
            <img src={raijinLogoPng} alt="RAIJIN" className="nav-logo-img" />
          </picture>
        </a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="section-hero">
        {/* Continuous WebGL lightning shader — locked to monochrome via CSS. */}
        <div className="shader-layer">
          <Lightning hue={0} xOffset={0} speed={1.6} intensity={0.6} size={2} />
        </div>

        {/* Volumetric fog — visible only during strikes. */}
        <Fog active={isFlashing} intensity={0.6} speed={1.2} />

        <div className="hero-content">
          <picture>
            <source srcSet={raijinLogoWebp} type="image/webp" />
            <img src={raijinLogoPng} alt="RAIJIN — 雷神" className="hero-logo-img" />
          </picture>
          <p className="hero-subtitle">Ancient power. Modern velocity.</p>
          <button
            className="hero-cta"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>Enter the Storm</span>
            <span className="cta-arrow" aria-hidden>→</span>
          </button>
        </div>
      </section>

      <Stats />

      <div className="storm-divider" />

      {/* ── ABOUT ──────────────────────────────────────────────────────── */}
      <section className="section-about" id="about">
        <div className="about-grid">
          <div>
            <div className="section-label">Our Origin</div>
            <h2 className="section-heading">
              Born from the storm.<br />Built for impact.
            </h2>
            <div className="section-body">
              <p>
                Raijin takes its name from the Japanese god of lightning, thunder, and storms —
                a deity of raw, primal force who shapes the world through electrical fury.
                We embody that same energy: swift, powerful, and transformative.
              </p>
              <p>
                Where others see turbulence, we see opportunity. Every storm brings clarity.
                Every lightning strike illuminates what was hidden in darkness.
                We harness that energy to drive the future forward.
              </p>
              <p>Rooted in ancient wisdom, operating at the speed of light.</p>
            </div>
          </div>
          <div className="about-side">
            <picture>
              <source srcSet={raijinLogoWebp} type="image/webp" />
              <img src={raijinLogoPng} alt="" className="about-logo-img" />
            </picture>
          </div>
        </div>
      </section>

      <div className="storm-divider" />

      {/* ── SERVICES ───────────────────────────────────────────────────── */}
      <section className="section-services" id="services">
        <div className="services-header">
          <div className="section-label" style={{ justifyContent: 'center' }}>What We Do</div>
          <h2 className="section-heading">The force behind your vision</h2>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-number">01 / 03</div>
            <div className="service-title">Strike Fast</div>
            <p className="service-desc">
              Rapid deployment and execution at the speed of lightning. We cut through complexity and
              deliver results before the thunder follows the flash.
            </p>
            <span className="service-link">Learn more <span aria-hidden>→</span></span>
          </div>
          <div className="service-card">
            <div className="service-number">02 / 03</div>
            <div className="service-title">Forge Systems</div>
            <p className="service-desc">
              Architecting robust, scalable systems forged under pressure. Like steel tempered by
              lightning, our solutions are built to withstand any storm.
            </p>
            <span className="service-link">Learn more <span aria-hidden>→</span></span>
          </div>
          <div className="service-card">
            <div className="service-number">03 / 03</div>
            <div className="service-title">Command the Storm</div>
            <p className="service-desc">
              Strategic leadership and transformation that channels the energy of change into
              controlled, purposeful momentum. We don't weather storms — we direct them.
            </p>
            <span className="service-link">Learn more <span aria-hidden>→</span></span>
          </div>
        </div>
      </section>

      <div className="storm-divider" />

      {/* ── CONTACT ────────────────────────────────────────────────────── */}
      <section className="section-contact" id="contact">
        <div className="contact-content">
          <div className="section-label" style={{ justifyContent: 'center' }}>Summon Us</div>
          <h2 className="contact-heading">
            Ready to harness<br />the storm?
          </h2>
          <p className="contact-sub">
            The thunder answers those bold enough to call upon it.
          </p>
          <button className="cta-button">
            <span>Initiate Contact</span>
            <span className="cta-arrow" aria-hidden>→</span>
          </button>
        </div>
      </section>

      <Marquee />

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <picture>
              <source srcSet={raijinLogoWebp} type="image/webp" />
              <img src={raijinLogoPng} alt="RAIJIN" className="footer-logo-img" />
            </picture>
            <p className="footer-tag">雷神 · The God of Thunder.<br />Ancient power, modern velocity.</p>
          </div>
          <div className="footer-col">
            <div className="footer-label">Navigate</div>
            <ul className="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <div className="footer-label">Connect</div>
            <ul className="footer-links">
              <li><a href="#">hello@raijin.co</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <div className="footer-label">Legal</div>
            <ul className="footer-links">
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Imprint</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© MMXXVI · RAIJIN</span>
          <span>Built under the storm.</span>
        </div>
      </footer>
    </div>
  )
}
