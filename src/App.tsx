// ============================================================================
// RAIJIN — App.tsx (enhanced storm)
// Drop this in over src/App.tsx in the Vite repo. It layers on top of the
// existing frame-swap mechanism without changing the strike scheduler logic;
// the new effects subscribe to three CustomEvents dispatched on window:
//   • 'raijin:strike-start'  { peak, frame, ts }
//   • 'raijin:strike-peak'   { peak }                 — ~80ms after start
//   • 'raijin:strike-end'    { peak }                 — when bloom drops away
//
// Companion: append the CSS at the bottom of src/index.css.
// ============================================================================

import { useEffect, useRef, useState, useCallback } from 'react'
import './index.css'
import { Fog } from './components/ui/fog'
import { RainBackground } from './components/ui/rain'
import { StormClouds } from './components/ui/storm-clouds'
import raijinLogoPng from './assets/raijin-logo-cutout.png'
import raijinLogoWebp from './assets/raijin-logo-cutout.webp'

import f00j from './assets/frames/f00.jpg'; import f00w from './assets/frames/f00.webp'
import f01j from './assets/frames/f01.jpg'; import f01w from './assets/frames/f01.webp'
import f02j from './assets/frames/f02.jpg'; import f02w from './assets/frames/f02.webp'
import f03j from './assets/frames/f03.jpg'; import f03w from './assets/frames/f03.webp'
import f04j from './assets/frames/f04.jpg'; import f04w from './assets/frames/f04.webp'
import f05j from './assets/frames/f05.jpg'; import f05w from './assets/frames/f05.webp'
import f06j from './assets/frames/f06.jpg'; import f06w from './assets/frames/f06.webp'
import f07j from './assets/frames/f07.jpg'; import f07w from './assets/frames/f07.webp'
import f08j from './assets/frames/f08.jpg'; import f08w from './assets/frames/f08.webp'
import f09j from './assets/frames/f09.jpg'; import f09w from './assets/frames/f09.webp'
import f10j from './assets/frames/f10.jpg'; import f10w from './assets/frames/f10.webp'
import f11j from './assets/frames/f11.jpg'; import f11w from './assets/frames/f11.webp'
import f12j from './assets/frames/f12.jpg'; import f12w from './assets/frames/f12.webp'
import f13j from './assets/frames/f13.jpg'; import f13w from './assets/frames/f13.webp'
import f14j from './assets/frames/f14.jpg'; import f14w from './assets/frames/f14.webp'
import f15j from './assets/frames/f15.jpg'; import f15w from './assets/frames/f15.webp'
import f16j from './assets/frames/f16.jpg'; import f16w from './assets/frames/f16.webp'
import f17j from './assets/frames/f17.jpg'; import f17w from './assets/frames/f17.webp'
import f18j from './assets/frames/f18.jpg'; import f18w from './assets/frames/f18.webp'
import f19j from './assets/frames/f19.jpg'; import f19w from './assets/frames/f19.webp'
import f20j from './assets/frames/f20.jpg'; import f20w from './assets/frames/f20.webp'

const FRAMES: Array<{ jpg: string; webp: string }> = [
  { jpg: f00j, webp: f00w }, { jpg: f01j, webp: f01w }, { jpg: f02j, webp: f02w },
  { jpg: f03j, webp: f03w }, { jpg: f04j, webp: f04w }, { jpg: f05j, webp: f05w },
  { jpg: f06j, webp: f06w }, { jpg: f07j, webp: f07w }, { jpg: f08j, webp: f08w },
  { jpg: f09j, webp: f09w }, { jpg: f10j, webp: f10w }, { jpg: f11j, webp: f11w },
  { jpg: f12j, webp: f12w }, { jpg: f13j, webp: f13w }, { jpg: f14j, webp: f14w },
  { jpg: f15j, webp: f15w }, { jpg: f16j, webp: f16w }, { jpg: f17j, webp: f17w },
  { jpg: f18j, webp: f18w }, { jpg: f19j, webp: f19w }, { jpg: f20j, webp: f20w },
]

const REST_FRAME = 3
const STRIKE_FRAMES = [4, 7, 16, 17, 19, 20]

type Phase = 'rest' | 'flash' | 'peak' | 'hold' | 'fade' | 'after'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const isMobile = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(max-width: 768px), (pointer: coarse)').matches

// ── FrameSequence (enhanced) ──────────────────────────────────────────────
function FrameSequence({ onFlashChange }: { onFlashChange?: (f: boolean) => void }) {
  const [frameIdx, setFrameIdx] = useState(REST_FRAME)
  const [phase, setPhase] = useState<Phase>('rest')
  const [peak, setPeak] = useState(1.0)
  const [inView, setInView] = useState(true)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Strike state → parent (so Fog still wires to the original "flashing" prop)
  const flashing = phase === 'flash' || phase === 'peak' || phase === 'hold'
  useEffect(() => { onFlashChange?.(flashing) }, [flashing, onFlashChange])

  // Pause scheduler when hero leaves viewport
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const el = document.querySelector('.section-hero')
    if (!el) return
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    let cancelled = false
    const queue = (ms: number, fn: () => void) => {
      const t = setTimeout(() => { if (!cancelled) fn() }, ms)
      timersRef.current.push(t)
    }
    const pickStrike = () => STRIKE_FRAMES[Math.floor(Math.random() * STRIKE_FRAMES.length)]

    let isFirst = true
    const scheduleNext = () => {
      const restDelay = isFirst ? 900 : (2000 + Math.random() * 2000)
      isFirst = false
      queue(restDelay, () => {
        const peakValue = 1.125 + Math.random() * 0.315 // 10% dimmer
        const strikeFrame = pickStrike()
        setFrameIdx(strikeFrame)
        setPeak(peakValue)
        setPhase('flash')

        window.dispatchEvent(new CustomEvent('raijin:strike-start', {
          detail: { peak: peakValue, frame: strikeFrame, ts: performance.now() },
        }))

        queue(80, () => {
          setPhase('peak')
          window.dispatchEvent(new CustomEvent('raijin:strike-peak', { detail: { peak: peakValue } }))
        })

        // Mid-strike flicker
        const flickerCount = 2 + Math.floor(Math.random() * 2)
        let elapsed = 0
        for (let i = 1; i < flickerCount; i++) {
          const swapAt = elapsed + 90 + Math.random() * 50
          elapsed = swapAt
          queue(swapAt, () => setFrameIdx(pickStrike()))
        }

        queue(280, () => setPhase('hold'))
        const holdMs = elapsed + 1500 + Math.random() * 800
        queue(holdMs, () => {
          setPhase('fade')
          window.dispatchEvent(new CustomEvent('raijin:strike-end', { detail: { peak: peakValue } }))
          queue(400, () => setPhase('after'))
          queue(1700, () => {
            setFrameIdx(REST_FRAME)
            setPhase('rest')
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
  }, [inView])

  const brightness = flashing ? peak : 0
  const filterMain = phase === 'peak'
    ? `brightness(${brightness}) contrast(1.4) saturate(0.15)`
    : `brightness(${brightness}) contrast(1.1) saturate(0)`

  const current = FRAMES[frameIdx]

  return (
    <>
      <div className={`frame-seq frame-seq-back ${flashing ? 'flashing' : ''} phase-${phase}`}>
        <div className="parallax">
          <div className={`camera-zoom ${phase === 'peak' ? 'flinch' : ''}`}>
            <picture>
              <source srcSet={current.webp} type="image/webp" />
              <img
                src={current.jpg}
                alt=""
                className="frame-seq-img camera-pan"
                style={{ filter: filterMain }}
                decoding="async"
              />
            </picture>
          </div>
        </div>

        {/* Afterimage — duplicate frame, screen blend, holds 400ms then fades */}
        <div className="afterimage parallax">
          <picture>
            <source srcSet={current.webp} type="image/webp" />
            <img
              src={current.jpg}
              alt=""
              className="frame-seq-img camera-pan"
              style={{ filter: `brightness(${peak}) contrast(1.1) saturate(0)` }}
              decoding="async"
            />
          </picture>
        </div>

        <div className="frame-seq-overlay" />

        <div className="frame-preload" aria-hidden>
          {FRAMES.map((f, i) => (
            <picture key={i}>
              <source srcSet={f.webp} type="image/webp" />
              <img src={f.jpg} alt="" loading="eager" decoding="async" />
            </picture>
          ))}
        </div>
      </div>

      {/* Foreground "near clouds" — 1.08×, blurred, desat, sits BEHIND logo */}
      <div className="frame-seq frame-seq-fg">
        <picture>
          <source srcSet={current.webp} type="image/webp" />
          <img
            src={current.jpg}
            alt=""
            className="frame-seq-fg-img camera-pan"
            style={{ filter: `brightness(${flashing ? peak * 0.9 : 0}) blur(8px) saturate(0.5)` }}
            decoding="async"
          />
        </picture>
      </div>
    </>
  )
}

// ── Full-page lightning flash overlay ─────────────────────────────────────
function FlashOverlay() {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onStrike = (e: Event) => {
      const peak = (e as CustomEvent<{ peak: number }>).detail.peak
      el.classList.remove('flash-fire')
      void el.offsetWidth
      el.style.setProperty('--flash-peak', String(0.05 * Math.min(1.2, peak / 1.4)))
      el.classList.add('flash-fire')
    }
    window.addEventListener('raijin:strike-start', onStrike)
    return () => window.removeEventListener('raijin:strike-start', onStrike)
  }, [])
  return <div className="flash-overlay" ref={ref} aria-hidden />
}

// ── Cinematic logo reveal ─────────────────────────────────────────────────
function StormLogo({ className }: { className?: string }) {
  const [state, setState] = useState<'rest' | 'peak' | 'after'>('rest')
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined
    const onStart = () => setState('peak')
    const onEnd = () => {
      setState('after')
      if (t) clearTimeout(t)
      t = setTimeout(() => setState('rest'), 1500)
    }
    window.addEventListener('raijin:strike-start', onStart)
    window.addEventListener('raijin:strike-end', onEnd)
    return () => {
      window.removeEventListener('raijin:strike-start', onStart)
      window.removeEventListener('raijin:strike-end', onEnd)
      if (t) clearTimeout(t)
    }
  }, [])
  return (
    <picture>
      <source srcSet={raijinLogoWebp} type="image/webp" />
      <img
        src={raijinLogoPng}
        alt="RAIJIN — 雷神"
        className={`${className ?? 'hero-logo-img'} logo-${state}`}
        decoding="async"
      />
    </picture>
  )
}

// ── Ambient atmosphere ────────────────────────────────────────────────────
function BreathingVignette() { return <div className="breathing-vignette" aria-hidden /> }

// ── Thunder engine (real sample) ──────────────────────────────────────────
import thunderUrl from './assets/thunder.mp3'
const LS_AUDIO = 'raijin:audio-on'

function ThunderEngine() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem(LS_AUDIO) === '1' } catch { return false }
  })
  const [available, setAvailable] = useState(true)
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)
  const loadingRef = useRef(false)

  useEffect(() => {
    if (prefersReducedMotion() || isMobile()) {
      setAvailable(false); setEnabled(false)
    }
  }, [])

  useEffect(() => {
    try { localStorage.setItem(LS_AUDIO, enabled ? '1' : '0') } catch {}
  }, [enabled])

  useEffect(() => {
    if (!enabled || !available) return
    let cancelled = false
    let ctx: AudioContext
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new AC()
    } catch {
      setAvailable(false); return
    }
    ctxRef.current = ctx
    const master = ctx.createGain()
    master.gain.value = 0.85
    master.connect(ctx.destination)
    masterRef.current = master

    if (!bufferRef.current && !loadingRef.current) {
      loadingRef.current = true
      fetch(thunderUrl)
        .then((r) => r.arrayBuffer())
        .then((ab) => ctx.decodeAudioData(ab))
        .then((buf) => { if (!cancelled) bufferRef.current = buf })
        .catch((err) => { console.warn('Thunder sample failed to load:', err) })
        .finally(() => { loadingRef.current = false })
    }

    return () => {
      cancelled = true
      try { ctx.close() } catch {}
      ctxRef.current = null; masterRef.current = null
    }
  }, [enabled, available])

  const ensureRunning = useCallback(() => {
    const ctx = ctxRef.current
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {})
  }, [])

  const fireRumble = useCallback((peak: number) => {
    const ctx = ctxRef.current, master = masterRef.current, buf = bufferRef.current
    if (!ctx || !master || !buf) return
    const now = ctx.currentTime
    const rate = 0.78 + Math.random() * 0.42
    const vol  = (0.55 + Math.random() * 0.45) * Math.min(1, peak / 1.4)
    const maxStart = Math.max(0, buf.duration - 1.6)
    const startOffset = Math.random() * maxStart * 0.4
    const playableDur = Math.max(0.5, (buf.duration - startOffset) / rate)

    const src = ctx.createBufferSource()
    src.buffer = buf
    src.playbackRate.value = rate

    const env = ctx.createGain()
    const fadeIn = 0.04, fadeOut = 0.35
    env.gain.setValueAtTime(0.0001, now)
    env.gain.exponentialRampToValueAtTime(vol, now + fadeIn)
    env.gain.setValueAtTime(vol, now + playableDur - fadeOut)
    env.gain.exponentialRampToValueAtTime(0.001, now + playableDur)

    src.connect(env).connect(master)
    src.start(now, startOffset)
    src.stop(now + playableDur + 0.05)
  }, [])

  useEffect(() => {
    if (!enabled || !available) return
    const onStrike = (e: Event) => {
      const peak = (e as CustomEvent<{ peak: number }>).detail?.peak ?? 1.3
      ensureRunning()
      fireRumble(peak)
    }
    window.addEventListener('raijin:strike-start', onStrike)
    return () => window.removeEventListener('raijin:strike-start', onStrike)
  }, [enabled, available, fireRumble, ensureRunning])

  if (!available) {
    return (
      <button className="thunder-toggle disabled" disabled aria-label="Thunder unavailable">
        <SpeakerIcon muted />
        <span className="thunder-label">SILENT</span>
      </button>
    )
  }

  return (
    <button
      className={`thunder-toggle ${enabled ? 'on' : 'off'}`}
      aria-pressed={enabled}
      aria-label={enabled ? 'Mute thunder' : 'Enable thunder'}
      onClick={() => {
        setEnabled((v) => !v)
        setTimeout(ensureRunning, 30)
      }}
    >
      <SpeakerIcon muted={!enabled} />
      <span className="thunder-label">{enabled ? 'THUNDER' : 'SILENT'}</span>
    </button>
  )
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" className={`speaker-icon ${muted ? 'muted' : ''}`} aria-hidden>
      <path d="M3 8.5 V13.5 H6 L11 17.5 V4.5 L6 8.5 Z" fill="currentColor"/>
      {!muted && <>
        <path d="M14 7.5 Q16 11 14 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
        <path d="M16.5 5.5 Q19.5 11 16.5 16.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      </>}
      {muted && <path d="M14 7 L20 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>}
    </svg>
  )
}

// ── Logo (nav / footer use original) ─────────────────────────────────────
function Logo({ className, alt = 'RAIJIN — 雷神' }: { className?: string; alt?: string }) {
  return (
    <picture>
      <source srcSet={raijinLogoWebp} type="image/webp" />
      <img src={raijinLogoPng} alt={alt} className={className} decoding="async" />
    </picture>
  )
}

function Marquee() {
  const items = ['⚡ ANCIENT POWER','MODERN VELOCITY','雷神','STRIKE FAST','FORGE SYSTEMS','COMMAND THE STORM','EST. MMXXVI']
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

// ── Reveal-on-scroll (Functional Fluidity + Kinetic Precision) ────────────
// Single IntersectionObserver shared across all .reveal nodes; once a node
// is past 12% visibility we flip .visible. Reveal-once (no thrash).
function useRevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    if (!('IntersectionObserver' in window)) {
      // Graceful degradation: just reveal everything
      els.forEach((el) => el.classList.add('visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// ── Services (editorial row layout) ───────────────────────────────────────
const SERVICES = [
  {
    n: '01',
    label: 'Velocity',
    title: 'Strike Fast',
    body:
      'Rapid deployment and execution at the speed of lightning. We cut through complexity and deliver before the thunder follows the flash.',
    deliverables: ['Strategy sprint', '4-week shipping', 'Daily standups'],
  },
  {
    n: '02',
    label: 'Architecture',
    title: 'Forge Systems',
    body:
      'Architecting robust, scalable systems forged under pressure. Like steel tempered by lightning, our solutions are built to withstand any storm.',
    deliverables: ['System design', 'Scalable infra', 'Hardening audit'],
  },
  {
    n: '03',
    label: 'Leadership',
    title: 'Command the Storm',
    body:
      "Strategic leadership and transformation that channels the energy of change into controlled, purposeful momentum. We don't weather storms — we direct them.",
    deliverables: ['Fractional CTO', 'Roadmap clarity', 'Team enablement'],
  },
]

function Services() {
  return (
    <section className="section-services-v2" id="services">
      <header className="services-v2-header reveal">
        <div className="section-label" style={{ justifyContent: 'center' }}>What we do</div>
        <h2 className="section-heading-display">
          The force behind<br />your next strike.
        </h2>
      </header>

      <div className="service-rows">
        {SERVICES.map((s, i) => (
          <article
            key={s.n}
            className="service-row reveal"
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <div className="service-row-num" aria-hidden>{s.n}</div>
            <div className="service-row-body">
              <div className="service-row-label">{s.label}</div>
              <h3 className="service-row-title">{s.title}</h3>
              <p className="service-row-desc">{s.body}</p>
              <ul className="service-row-list">
                {s.deliverables.map((d) => (
                  <li key={d}><span aria-hidden>—</span> {d}</li>
                ))}
              </ul>
            </div>
            <a className="service-row-link" href="#contact" aria-label={`Engage ${s.title}`}>
              <span>Engage</span>
              <span className="cta-arrow" aria-hidden>→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

// ── Reviews — editorial pull-quotes + client strip ────────────────────────
const REVIEWS = [
  {
    quote:
      'Raijin shipped in five weeks what our previous vendor failed to deliver in nine months. The storm metaphor isn’t marketing — it’s their operating cadence.',
    name: 'Akiko Sato',
    role: 'Head of Platform, Yamato Logistics',
  },
  {
    quote:
      'Their restraint is what separates them. Every choice is a deletion. The result feels inevitable, which is the highest compliment I can pay design work.',
    name: 'David Chen',
    role: 'Founder, Atlas Capital',
  },
  {
    quote:
      'We hired Raijin to forge a system. They handed us a doctrine. The team now ships with the same conviction our customers feel.',
    name: 'Priya Iyer',
    role: 'CTO, Northwind AI',
  },
]

const CLIENTS = ['Yamato', 'Atlas', 'Northwind', 'Helios', 'Kintsugi', 'Sequoia']

function Reviews() {
  return (
    <section className="section-reviews" id="reviews">
      <header className="reviews-header reveal">
        <div className="section-label" style={{ justifyContent: 'center' }}>Signal from the field</div>
        <h2 className="section-heading-display">
          The thunder is heard<br />long after the strike.
        </h2>
      </header>

      <div className="reviews-grid">
        {REVIEWS.map((r, i) => (
          <figure key={r.name} className="review-card reveal" style={{ transitionDelay: `${i * 110}ms` }}>
            <div className="review-mark" aria-hidden>“</div>
            <blockquote className="review-quote">{r.quote}</blockquote>
            <figcaption className="review-attribution">
              <span className="review-name">{r.name}</span>
              <span className="review-role">{r.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="client-strip reveal" aria-label="Trusted by">
        <span className="client-strip-label">Trusted by</span>
        <div className="client-strip-list">
          {CLIENTS.map((c) => <span key={c} className="client-logo">{c}</span>)}
        </div>
      </div>
    </section>
  )
}

// CountUp — animates a number from 0 → target over `duration` ms with ease-out
// when the host element enters the viewport. Single IntersectionObserver per
// instance; fires once and disconnects.
function CountUp({
  to,
  duration = 1400,
  suffix = '',
  className = '',
}: { to: number; duration?: number; suffix?: string; className?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setVal(to)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        let raf = 0
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration)
          // ease-out cubic
          const eased = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(to * eased))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])

  return (
    <span ref={ref} className={className}>
      {val.toLocaleString()}{suffix}
    </span>
  )
}

function Stats() {
  return (
    <section className="stats-strip">
      <div className="stats-grid stats-grid-3">
        <div className="stat reveal">
          <div className="stat-num"><CountUp to={12} suffix="+" /></div>
          <div className="stat-label">Years of velocity</div>
        </div>
        <div className="stat-divider" />
        <div className="stat reveal" style={{ transitionDelay: '90ms' }}>
          <div className="stat-num"><CountUp to={120} suffix="+" /></div>
          <div className="stat-label">Storms weathered</div>
        </div>
        <div className="stat-divider" />
        <div className="stat reveal" style={{ transitionDelay: '180ms' }}>
          <div className="stat-num">24<span>/7</span></div>
          <div className="stat-label">Lightning ready</div>
        </div>
      </div>
    </section>
  )
}

// ── App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false)
  useRevealObserver()
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 40)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={`site ${loaded ? 'loaded' : ''}`}>
      <div className="grain" aria-hidden />

      {/* Full-page lightning flash overlay (5% peak, 80ms ramp, 600ms decay) */}
      <FlashOverlay />

      <nav className="site-nav">
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <Logo className="nav-logo-img" alt="RAIJIN home" />
        </a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <section className="section-hero">
        <FrameSequence onFlashChange={setIsFlashing} />

        <Fog active={isFlashing} intensity={0.55} speed={1.2} />

        {/* Volumetric storm clouds — two parallax layers of displaced ellipses */}
        <StormClouds />

        {/* Rain — canvas-based, smooth at 60fps. */}
        <RainBackground
          intensity={260}
          speed={0.9}
          angle={10}
          color="rgba(174, 194, 224, 0.55)"
          dropSize={{ min: 0.8, max: 1.6 }}
          dropLength={{ min: 12, max: 24 }}
          className="rain-overlay"
        />

        <BreathingVignette />

        <div className="hero-content">
          <div className="hero-logo-wrap">
            <StormLogo />
          </div>
          <p className="hero-eyebrow-v2">雷神 · The God of Thunder</p>
          <p className="hero-value">Premium engineering. Forged fast.</p>
          <p className="hero-subtitle">We architect systems that ship in weeks — not quarters.</p>
          <button className="hero-cta" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            <span>Start an engagement</span>
            <span className="cta-arrow" aria-hidden>→</span>
          </button>
        </div>
      </section>

      <div className="storm-divider" />

      <section className="section-about" id="about">
        <div className="about-grid">
          <div>
            <div className="section-label">Our Origin</div>
            <h2 className="section-heading">Born from the storm.<br />Built for impact.</h2>
            <div className="section-body">
              <p>Raijin takes its name from the Japanese god of lightning, thunder, and storms — a deity of raw, primal force who shapes the world through electrical fury. We embody that same energy: swift, powerful, and transformative.</p>
              <p>Where others see turbulence, we see opportunity. Every storm brings clarity. Every lightning strike illuminates what was hidden in darkness. We harness that energy to drive the future forward.</p>
              <p>Rooted in ancient wisdom, operating at the speed of light.</p>
            </div>
          </div>
          <div className="about-side"><Logo className="about-logo-img" alt="" /></div>
        </div>
      </section>

      <Stats />
      <div className="storm-divider" />

      <Services />

      <div className="storm-divider" />

      <Reviews />

      <div className="storm-divider" />

      <section className="section-contact-v2" id="contact">
        <div className="contact-v2-inner">
          <div className="section-label reveal" style={{ justifyContent: 'center' }}>Summon the storm</div>
          <h2 className="contact-v2-heading reveal" style={{ transitionDelay: '90ms' }}>
            When you’re ready to<br />
            <em>call the thunder</em>,<br />
            we’re already moving.
          </h2>
          <p className="contact-v2-sub reveal" style={{ transitionDelay: '180ms' }}>
            Strategy intakes open this quarter · Engagements begin within 14 days
          </p>
          <div className="contact-v2-actions reveal" style={{ transitionDelay: '260ms' }}>
            <a className="cta-button-v2" href="mailto:hello@raijin.co">
              <span>Begin the engagement</span>
              <span className="cta-arrow" aria-hidden>→</span>
            </a>
            <a className="cta-link" href="mailto:hello@raijin.co">hello@raijin.co</a>
          </div>
        </div>
      </section>

      {/* Final horizon — the Peak-End beat. Quiet, declarative, ends with a single
          action. The last impression a visitor leaves with. */}
      <section className="section-horizon" aria-label="Final beat">
        <div className="horizon-line" aria-hidden />
        <div className="horizon-content reveal">
          <div className="horizon-mark" aria-hidden>雷神</div>
          <p className="horizon-line-text">When the storm is needed, you already know who to call.</p>
          <a className="horizon-link" href="mailto:hello@raijin.co">
            <span>hello@raijin.co</span>
            <span className="cta-arrow" aria-hidden>→</span>
          </a>
        </div>
        <div className="horizon-line" aria-hidden />
      </section>

      <Marquee />

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <Logo className="footer-logo-img" alt="RAIJIN" />
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

      {/* Thunder toggle (Apple-style speaker, bottom-right) */}
      <ThunderEngine />
    </div>
  )
}
