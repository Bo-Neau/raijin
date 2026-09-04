import { useEffect, useState } from 'react'
import raijinLogoPng from '../assets/raijin-logo-cutout.png'
import raijinLogoWebp from '../assets/raijin-logo-cutout.webp'
import '../index.css'

/** Local mobile nav — mirrors the pattern used elsewhere. */
function CaseMobileNav() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  const links = [
    { href: './',              label: 'Home' },
    { href: './?work=vestry',  label: 'Work' },
    { href: './#contact',      label: 'Contact' },
  ]
  return (
    <>
      <button
        className="mobile-menu-toggle"
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`hamburger ${open ? 'open' : ''}`} aria-hidden>
          <span /><span /><span />
        </span>
      </button>
      <div className={`mobile-nav-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <ul className="mobile-nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

/**
 * Vestry — case study #2.
 * Independent apparel label. End-to-end brand + storefront + editorial build.
 * Currently scaffolded with placeholders — refine once assets/copy are final.
 */
export default function CaseStudyVestry() {
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
          <li><a href="./?work=vestry">Work</a></li>
          <li><a href="./#contact">Contact</a></li>
        </ul>
        <CaseMobileNav />
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header className="case-hero">
        <div className="case-hero-inner">
          <a href="./" className="case-back-link reveal">
            <span aria-hidden>←</span> Back to studio
          </a>
          <div className="case-meta reveal" style={{ transitionDelay: '80ms' }}>
            <span>Clothing Brand</span>
            <span className="case-meta-dot" aria-hidden>·</span>
            <span>2026</span>
            <span className="case-meta-dot" aria-hidden>·</span>
            <span>Brand · Storefront · Editorial</span>
          </div>
          <h1 className="case-title reveal" style={{ transitionDelay: '160ms' }}>
            Vestry.
          </h1>
          <p className="case-lede reveal" style={{ transitionDelay: '240ms' }}>
            Full brand system and storefront for an independent apparel label —
            from wordmark to checkout, shipped as a single connected system.
          </p>
        </div>
      </header>

      {/* ── Facts strip ──────────────────────────────────────────────── */}
      <section className="case-facts reveal">
        <div className="case-facts-inner">
          <div className="case-fact">
            <div className="case-fact-label">Role</div>
            <div className="case-fact-value">Brand + storefront + editorial site</div>
          </div>
          <div className="case-fact">
            <div className="case-fact-label">Duration</div>
            <div className="case-fact-value">4 weeks · 2026</div>
          </div>
          <div className="case-fact">
            <div className="case-fact-label">Stack</div>
            <div className="case-fact-value">Next.js · TypeScript · Tailwind · Ecommerce</div>
          </div>
          <div className="case-fact">
            <div className="case-fact-label">Status</div>
            <div className="case-fact-value">Shipped · <a href="https://vestry-storefront-m3chbcacg-raijin3.vercel.app/" target="_blank" rel="noreferrer">Live site</a></div>
          </div>
        </div>
      </section>

      {/* ── Body sections ────────────────────────────────────────────── */}
      <article className="case-body">
        <section className="case-section reveal">
          <div className="case-section-label">The brief</div>
          <h2 className="case-section-heading">
            An apparel label that reads like an editorial, not a catalog.
          </h2>
          <div className="case-section-body">
            <p>
              Vestry is an independent clothing label building its first
              direct-to-consumer channel. The mandate: a storefront that feels
              like an editorial spread — considered typography, unhurried
              product photography, and a checkout that gets out of the way.
            </p>
            <p>
              We took the project end-to-end. Brand voice, wordmark, layout
              system, product templates, cart, and checkout all shipped as
              one connected experience.
            </p>
          </div>
        </section>

        <section className="case-section reveal">
          <div className="case-section-label">The system</div>
          <h2 className="case-section-heading">Three surfaces, one voice.</h2>
          <div className="case-pillars">
            <div className="case-pillar">
              <div className="case-pillar-num">01</div>
              <div className="case-pillar-title">Brand</div>
              <p className="case-pillar-body">
                Wordmark, type system, and photographic direction. Editorial
                register — quiet, confident, unafraid of whitespace.
              </p>
            </div>
            <div className="case-pillar">
              <div className="case-pillar-num">02</div>
              <div className="case-pillar-title">Storefront</div>
              <p className="case-pillar-body">
                Product templates, cart, and checkout in Next.js. Fast, mobile-first,
                and built to expand as the catalog grows.
              </p>
            </div>
            <div className="case-pillar">
              <div className="case-pillar-num">03</div>
              <div className="case-pillar-title">Editorial</div>
              <p className="case-pillar-body">
                Long-form pages for lookbooks and drops — same design tokens,
                different pace. Turns the site into a place worth returning to.
              </p>
            </div>
          </div>
        </section>

        <section className="case-section reveal">
          <div className="case-section-label">The doctrine</div>
          <h2 className="case-section-heading">
            A storefront should never feel like a form.
          </h2>
          <div className="case-section-body">
            <p>
              We started from the product page instead of the homepage. Nailing
              how a single item is presented — the type scale, the image
              treatment, the flow into checkout — set the register for everything
              else. The homepage came last, and shipped with less than we expected.
            </p>
            <p>
              Every filter, badge, and modal was interrogated. Anything that
              didn't help someone buy the piece they came for got cut.
            </p>
          </div>
        </section>

        <section className="case-section reveal">
          <div className="case-section-label">The outcome</div>
          <h2 className="case-section-heading">Shipped, shoppable, honest.</h2>
          <div className="case-section-body">
            <p>
              Live at <a href="https://vestry-storefront-m3chbcacg-raijin3.vercel.app/" target="_blank" rel="noreferrer">vestry-storefront.vercel.app</a>.
              Full brand system, storefront, and checkout delivered in four weeks.
              The team ships their next drop from the same codebase without us in the room.
            </p>
            <p>
              This is the same discipline we bring to every project — a system that
              outlasts the launch.
            </p>
          </div>
        </section>
      </article>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="case-cta">
        <div className="case-cta-inner reveal">
          <h2 className="case-cta-heading">Have a project in mind?</h2>
          <p className="case-cta-sub">
            We take a small number of engagements each quarter. Reach out if yours might be a fit.
          </p>
          <a className="cta-button-v2" href="mailto:hello@raijinstudio.co">
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
