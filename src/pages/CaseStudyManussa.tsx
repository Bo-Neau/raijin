import { useEffect, useState } from 'react'
import raijinLogoPng from '../assets/raijin-logo-cutout.png'
import raijinLogoWebp from '../assets/raijin-logo-cutout.webp'
import '../index.css'

const LIVE = 'https://manussamyanmar.com'

/** Local mobile nav — mirrors the pattern used on the other case studies. */
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
    { href: './',               label: 'Home' },
    { href: './?work=manussa',  label: 'Work' },
    { href: './#contact',       label: 'Contact' },
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
 * Manussa — case study #1 by strength: a real client engagement, and the
 * only one where the client credits us publicly (footer of manussamyanmar.com).
 * Everything below is drawn from what is actually on their live site — their
 * nav structure, their tagline, their stated craft techniques.
 */
export default function CaseStudyManussa() {
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
          <li><a href="./?work=manussa">Work</a></li>
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
            <span>Fashion House</span>
            <span className="case-meta-dot" aria-hidden>·</span>
            <span>2026</span>
            <span className="case-meta-dot" aria-hidden>·</span>
            <span>Brand · Editorial · Web</span>
          </div>
          <h1 className="case-title reveal" style={{ transitionDelay: '160ms' }}>
            Manussa.
          </h1>
          <p className="case-lede reveal" style={{ transitionDelay: '240ms' }}>
            A gallery-grade editorial site for a Myanmar fashion house whose
            garments begin as paintings.
          </p>
        </div>
      </header>

      {/* ── Facts strip ──────────────────────────────────────────────── */}
      <section className="case-facts reveal">
        <div className="case-facts-inner">
          <div className="case-fact">
            <div className="case-fact-label">Client</div>
            <div className="case-fact-value">Manussa · Yangon, Myanmar</div>
          </div>
          <div className="case-fact">
            <div className="case-fact-label">Role</div>
            <div className="case-fact-value">Design + build</div>
          </div>
          <div className="case-fact">
            <div className="case-fact-label">Scope</div>
            <div className="case-fact-value">Collections · Artists · Atelier · Enquiry</div>
          </div>
          <div className="case-fact">
            <div className="case-fact-label">Status</div>
            <div className="case-fact-value">
              Shipped · <a href={LIVE} target="_blank" rel="noreferrer">manussamyanmar.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <article className="case-body">
        <section className="case-section reveal">
          <div className="case-section-label">The brief</div>
          <h2 className="case-section-heading">
            When the product is art, the site has to behave like a gallery.
          </h2>
          <div className="case-section-body">
            <p>
              Manussa makes wearable art — paintings translated onto garments
              through hand-painting, embroidery and textile printing. Every
              piece carries an artist's work, which makes the usual fashion
              site pattern wrong: a dense product grid would flatten the thing
              that makes the label worth buying.
            </p>
            <p>
              So we built it as an exhibition rather than a catalogue. The
              work is given room, the photography runs large, and the
              interface gets out of the way.
            </p>
          </div>
        </section>

        <section className="case-section reveal">
          <div className="case-section-label">The system</div>
          <h2 className="case-section-heading">Four rooms, one house.</h2>
          <div className="case-pillars">
            <div className="case-pillar">
              <div className="case-pillar-num">01</div>
              <div className="case-pillar-title">Collections</div>
              <p className="case-pillar-body">
                Each collection presented as a body of work — full-bleed
                imagery, generous pacing, and no chrome competing with the
                garments.
              </p>
            </div>
            <div className="case-pillar">
              <div className="case-pillar-num">02</div>
              <div className="case-pillar-title">Artists</div>
              <p className="case-pillar-body">
                The painters behind the prints get their own space. It
                credits the source of the work and gives buyers the story
                that justifies the price.
              </p>
            </div>
            <div className="case-pillar">
              <div className="case-pillar-num">03</div>
              <div className="case-pillar-title">The House</div>
              <p className="case-pillar-body">
                Atelier, craft and provenance — the case for why these
                garments are made the way they are.
              </p>
            </div>
          </div>
        </section>

        <section className="case-section reveal">
          <div className="case-section-label">The doctrine</div>
          <h2 className="case-section-heading">
            No cart. That was the right call.
          </h2>
          <div className="case-section-body">
            <p>
              Hand-finished, one-of-a-kind pieces don't sell through a
              checkout flow — they sell through conversation. Rather than
              bolt on an ecommerce stack that would misrepresent how the
              house actually trades, the site routes serious interest to a
              direct enquiry and an invitation to visit.
            </p>
            <p>
              Restraint everywhere else too: a tight type system, deep
              whitespace, and photography doing the persuading. Every element
              we left out is one that wasn't earning its place.
            </p>
          </div>
        </section>

        <section className="case-section reveal">
          <div className="case-section-label">The outcome</div>
          <h2 className="case-section-heading">Live, and credited.</h2>
          <div className="case-section-body">
            <p>
              Shipped at <a href={LIVE} target="_blank" rel="noreferrer">manussamyanmar.com</a> —
              a fully custom build, responsive from phone to desktop, with the
              house's own team able to present new collections as they drop.
            </p>
            <p>
              Manussa credits Raijin in their footer. We'd rather be named by a
              client than describe ourselves.
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
