import { useEffect } from 'react'
import raijinLogoPng from '../assets/raijin-logo-cutout.png'
import raijinLogoWebp from '../assets/raijin-logo-cutout.webp'
import '../index.css'

/**
 * First case study: Raijin itself.
 * Honest framing — this is a studio self-brand and site build. Not a fake
 * client engagement. The value of the case study is showing our process
 * applied to our own work.
 */
export default function CaseStudyRaijin() {
  // Reveal-on-scroll: same primitive as the main site
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    if (!('IntersectionObserver' in window)) {
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

  return (
    <div className="site loaded case-study">
      <nav className="site-nav">
        <a href="./" className="nav-logo" aria-label="Back to home">
          <picture>
            <source srcSet={raijinLogoWebp} type="image/webp" />
            <img src={raijinLogoPng} alt="RAIJIN" className="nav-logo-img" />
          </picture>
        </a>
        <ul className="nav-links">
          <li><a href="./">Home</a></li>
          <li><a href="./?work=raijin">Work</a></li>
          <li><a href="./#contact">Contact</a></li>
        </ul>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header className="case-hero">
        <div className="case-hero-inner">
          <a href="./" className="case-back-link reveal">
            <span aria-hidden>←</span> Back to studio
          </a>
          <div className="case-meta reveal" style={{ transitionDelay: '80ms' }}>
            <span>Studio Brand</span>
            <span className="case-meta-dot" aria-hidden>·</span>
            <span>2026</span>
            <span className="case-meta-dot" aria-hidden>·</span>
            <span>Brand · Web · Motion</span>
          </div>
          <h1 className="case-title reveal" style={{ transitionDelay: '160ms' }}>
            Building Raijin.
          </h1>
          <p className="case-lede reveal" style={{ transitionDelay: '240ms' }}>
            The studio brand, kanji wordmark, and interactive storm landing
            page — designed and shipped as our first public work.
          </p>
        </div>
      </header>

      {/* ── Facts strip ──────────────────────────────────────────────── */}
      <section className="case-facts reveal">
        <div className="case-facts-inner">
          <div className="case-fact">
            <div className="case-fact-label">Role</div>
            <div className="case-fact-value">Brand + design + engineering</div>
          </div>
          <div className="case-fact">
            <div className="case-fact-label">Duration</div>
            <div className="case-fact-value">3 weeks · Q2 2026</div>
          </div>
          <div className="case-fact">
            <div className="case-fact-label">Stack</div>
            <div className="case-fact-value">React 19 · Vite · TypeScript · Canvas · Web Audio</div>
          </div>
          <div className="case-fact">
            <div className="case-fact-label">Status</div>
            <div className="case-fact-value">Shipped · <a href="https://bo-neau.github.io/raijin/" target="_blank" rel="noreferrer">Live site</a></div>
          </div>
        </div>
      </section>

      {/* ── Body sections ────────────────────────────────────────────── */}
      <article className="case-body">
        <section className="case-section reveal">
          <div className="case-section-label">The brief</div>
          <h2 className="case-section-heading">
            A studio identity built the way we'd build for a client.
          </h2>
          <div className="case-section-body">
            <p>
              We gave ourselves a single constraint: treat Raijin like a paid engagement. Real brief, real timeline, real ship date. Nothing that a client wouldn't see us do.
            </p>
            <p>
              The output is a full brand system — kanji wordmark, typographic hierarchy, motion doctrine — and a landing page that renders the brand's meaning in real time. Every layer of storm on the site is a proof of what we can build.
            </p>
          </div>
        </section>

        <section className="case-section reveal">
          <div className="case-section-label">The system</div>
          <h2 className="case-section-heading">Three pillars, six weeks apart.</h2>
          <div className="case-pillars">
            <div className="case-pillar">
              <div className="case-pillar-num">01</div>
              <div className="case-pillar-title">Brand</div>
              <p className="case-pillar-body">
                Kanji brush 雷神 as the primary mark. Cinzel for display, Cormorant Garamond for editorial, Inter for body, Geist Mono for labels. Grayscale-only palette — the only bright value is lightning-white.
              </p>
            </div>
            <div className="case-pillar">
              <div className="case-pillar-num">02</div>
              <div className="case-pillar-title">Site</div>
              <p className="case-pillar-body">
                Single-page landing with hero, About, Selected Work, Services, Practices, Contact, and a final horizon beat. Every section obeys the same rhythm: mono caps label → display heading → concrete body.
              </p>
            </div>
            <div className="case-pillar">
              <div className="case-pillar-num">03</div>
              <div className="case-pillar-title">Motion</div>
              <p className="case-pillar-body">
                Nine layered atmospheric effects — photo-frame lightning strikes, volumetric fog, drifting storm clouds, canvas-based rain, breathing vignette, full-page flash, Web Audio thunder. All synced to a single strike scheduler.
              </p>
            </div>
          </div>
        </section>

        <section className="case-section reveal">
          <div className="case-section-label">The doctrine</div>
          <h2 className="case-section-heading">
            Every choice we made was a deletion.
          </h2>
          <div className="case-section-body">
            <p>
              First cut had a purple-gradient hero, a rainbow lightning shader, and four testimonials from clients we didn't have. All of that got deleted. Every round of iteration reduced surface — the site got shorter, quieter, more confident.
            </p>
            <p>
              The version you're reading is the fifth pass. The four before it are why it feels like the first.
            </p>
          </div>
        </section>

        <section className="case-section reveal">
          <div className="case-section-label">The outcome</div>
          <h2 className="case-section-heading">Ship it as a client would see it.</h2>
          <div className="case-section-body">
            <p>
              Full brand system, live site at <a href="https://bo-neau.github.io/raijin/" target="_blank" rel="noreferrer">bo-neau.github.io/raijin</a>, source on <a href="https://github.com/Bo-Neau/raijin" target="_blank" rel="noreferrer">GitHub</a>. Deployed via GitHub Pages with a CI build. Total time from blank Vite project to live: three weeks, part-time.
            </p>
            <p>
              This is the process we'll apply to your project — same discipline, same cadence, same commitment to shipping.
            </p>
          </div>
        </section>
      </article>

      {/* ── Next / CTA ───────────────────────────────────────────────── */}
      <section className="case-cta">
        <div className="case-cta-inner reveal">
          <h2 className="case-cta-heading">Have a project in mind?</h2>
          <p className="case-cta-sub">
            We take a small number of engagements each quarter. Reach out if yours might be a fit.
          </p>
          <a className="cta-button-v2" href="mailto:hello@raijin.co">
            <span>Start a project</span>
            <span className="cta-arrow" aria-hidden>→</span>
          </a>
        </div>
      </section>

      <footer className="site-footer case-footer">
        <div className="footer-bottom">
          <span>© MMXXVI · RAIJIN</span>
          <span>Built under the storm.</span>
        </div>
      </footer>
    </div>
  )
}
