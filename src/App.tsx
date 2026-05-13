import { useEffect, useRef, useState } from 'react'
import './index.css'
import raijinLogo from './assets/raijin-logo-cutout.png'

import f00 from './assets/frames/f00.jpg'
import f01 from './assets/frames/f01.jpg'
import f02 from './assets/frames/f02.jpg'
import f03 from './assets/frames/f03.jpg'
import f04 from './assets/frames/f04.jpg'
import f05 from './assets/frames/f05.jpg'
import f06 from './assets/frames/f06.jpg'
import f07 from './assets/frames/f07.jpg'
import f08 from './assets/frames/f08.jpg'
import f09 from './assets/frames/f09.jpg'
import f10 from './assets/frames/f10.jpg'
import f11 from './assets/frames/f11.jpg'
import f12 from './assets/frames/f12.jpg'
import f13 from './assets/frames/f13.jpg'
import f14 from './assets/frames/f14.jpg'
import f15 from './assets/frames/f15.jpg'
import f16 from './assets/frames/f16.jpg'
import f17 from './assets/frames/f17.jpg'
import f18 from './assets/frames/f18.jpg'
import f19 from './assets/frames/f19.jpg'
import f20 from './assets/frames/f20.jpg'

const FRAMES = [f00,f01,f02,f03,f04,f05,f06,f07,f08,f09,f10,f11,f12,f13,f14,f15,f16,f17,f18,f19,f20]

// Resting (dark) state uses one calm-ish frame at very low brightness.
const REST_FRAME = 3
const REST_BRIGHTNESS = 0.06

// Bright/dramatic frames used for the strike flashes.
const STRIKE_FRAMES = [4, 7, 16, 17, 19, 20]

// ── FrameSequence ──────────────────────────────────────────────────────────
// Real-lightning behavior: long dark rest at random intervals, then a flash
// that rises QUICKLY (~120ms) to full brightness, HOLDS for 1.5–3s so the
// logo silhouette is clearly readable, then SLOWLY fades (~1.5s afterglow)
// back to dark. Each strike uses 1 frame (50%) or 2 frames swapped mid-hold.
function FrameSequence() {
  const [frameIdx, setFrameIdx] = useState(REST_FRAME)
  const [flashing, setFlashing] = useState(false)
  const [peak, setPeak] = useState(1.0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    let cancelled = false

    const queue = (ms: number, fn: () => void) => {
      const t = setTimeout(() => { if (!cancelled) fn() }, ms)
      timersRef.current.push(t)
    }

    const pickStrike = () =>
      STRIKE_FRAMES[Math.floor(Math.random() * STRIKE_FRAMES.length)]

    let isFirst = true
    const scheduleNext = () => {
      // First strike fires 1s after mount; subsequent strikes 2–4s random rest.
      const restDelay = isFirst ? 1000 : (2000 + Math.random() * 2000)
      isFirst = false
      queue(restDelay, () => {
        // STRIKE: rapid 2–3 frame flicker, then sustained peak hold, then fade.
        const flickerCount = 2 + Math.floor(Math.random() * 2) // 2 or 3 frames
        setFrameIdx(pickStrike())
        setPeak(0.95 + Math.random() * 0.25)
        setFlashing(true)

        // Rapid frame swaps (each ~90–140ms) during the strike itself
        let elapsed = 0
        for (let i = 1; i < flickerCount; i++) {
          const swapAt = elapsed + 90 + Math.random() * 50
          elapsed = swapAt
          queue(swapAt, () => setFrameIdx(pickStrike()))
        }

        // After flicker, HOLD on the last frame so logo stays readable
        const holdMs = elapsed + 1500 + Math.random() * 800 // ~1.5–2.3s total peak time
        queue(holdMs, () => {
          setFlashing(false)
          // Wait for fade to complete before resetting to rest frame
          queue(1300, () => {
            setFrameIdx(REST_FRAME)
            scheduleNext()
          })
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

  const brightness = flashing ? peak : REST_BRIGHTNESS

  return (
    <div className={`frame-seq ${flashing ? 'flashing' : ''}`}>
      <img
        src={FRAMES[frameIdx]}
        alt=""
        className="frame-seq-img"
        style={{ filter: `brightness(${brightness}) contrast(1.1) saturate(0)` }}
      />
      <div className="frame-seq-overlay" />
    </div>
  )
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
  // Duplicate so the loop appears seamless
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
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 40)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={`site ${loaded ? 'loaded' : ''}`}>
      <div className="grain" aria-hidden />
      {/* Navigation */}
      <nav className="site-nav">
        <a
          href="#"
          className="nav-logo"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >
          <img src={raijinLogo} alt="RAIJIN" className="nav-logo-img" />
        </a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="section-hero">
        <FrameSequence />

        <div className="hero-content">
          <img src={raijinLogo} alt="RAIJIN — 雷神" className="hero-logo-img" />
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
            <img src={raijinLogo} alt="" className="about-logo-img" />
          </div>
        </div>
      </section>

      <Stats />

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
            <img src={raijinLogo} alt="RAIJIN" className="footer-logo-img" />
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
