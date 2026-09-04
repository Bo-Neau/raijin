import { useEffect, useState } from 'react'
import raijinLogoPng from '../assets/raijin-logo-cutout.png'
import raijinLogoWebp from '../assets/raijin-logo-cutout.webp'
import '../index.css'

export const LEGAL_EMAIL = 'hello@raijinstudio.co'
export const LEGAL_ENTITY = 'Raijin Studio'
const LAST_UPDATED = 'September 2026'

/** Local mobile nav — same pattern as the case-study pages. */
function LegalMobileNav() {
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
    { href: './',            label: 'Home' },
    { href: './#work',       label: 'Work' },
    { href: './#contact',    label: 'Contact' },
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
            <li key={l.href}><a href={l.href} onClick={() => setOpen(false)}>{l.label}</a></li>
          ))}
        </ul>
      </div>
    </>
  )
}

type Block = { h?: string; p?: string[]; ul?: string[] }
type Doc = { title: string; intro: string; blocks: Block[] }

const DOCS: Record<string, Doc> = {
  // ── PRIVACY ─────────────────────────────────────────────────────────
  privacy: {
    title: 'Privacy Policy',
    intro:
      `This policy explains what information ${LEGAL_ENTITY} collects when you use this website or contact us, how we use it, and the choices you have.`,
    blocks: [
      {
        h: 'Information we collect',
        p: ['We keep data collection to the minimum needed to run the studio and respond to enquiries.'],
        ul: [
          'Contact details you send us — your name, email address, and anything else you include when you email us or submit an enquiry.',
          'Project information you choose to share while we scope or deliver work.',
          'Basic technical data your browser sends automatically, such as IP address, device type, and pages viewed.',
        ],
      },
      {
        h: 'How we use it',
        ul: [
          'To reply to your enquiry and discuss a potential engagement.',
          'To deliver, invoice for, and support work you have commissioned.',
          'To understand which parts of this site are useful, in aggregate.',
          'To meet legal, accounting, and tax obligations.',
        ],
      },
      {
        h: 'What we do not do',
        ul: [
          'We do not sell your personal information.',
          'We do not share your project details with third parties without your permission, except where required by law.',
          'We do not send marketing email to people who have not asked for it.',
        ],
      },
      {
        h: 'Service providers',
        p: [
          'We rely on a small number of third parties to operate — for example website hosting, email, and file storage. These providers process data on our behalf and are bound by their own privacy terms.',
        ],
      },
      {
        h: 'Retention',
        p: [
          'We keep enquiry correspondence for as long as needed to evaluate and respond to it, and project records for as long as required for legal and accounting purposes. You can ask us to delete correspondence at any time.',
        ],
      },
      {
        h: 'Your rights',
        p: [
          'Depending on where you live, you may have the right to access, correct, export, or delete the personal information we hold about you, and to object to certain processing. To exercise any of these, email us and we will respond.',
        ],
      },
      {
        h: 'Cookies',
        p: [
          'This site does not use advertising or cross-site tracking cookies. If we add analytics in future, we will update this policy first.',
        ],
      },
      {
        h: 'Changes',
        p: [
          'If this policy changes materially, we will update the date at the top of this page.',
        ],
      },
      {
        h: 'Contact',
        p: [`Questions about privacy: ${LEGAL_EMAIL}`],
      },
    ],
  },

  // ── TERMS ───────────────────────────────────────────────────────────
  terms: {
    title: 'Terms of Service',
    intro:
      `These terms cover use of this website and set out the default basis on which ${LEGAL_ENTITY} takes on client work. A signed proposal or statement of work always takes precedence over anything here.`,
    blocks: [
      {
        h: 'Use of this site',
        p: [
          'This website is provided for information. You may view and share its content, but you may not copy the design, code, or written material for commercial reuse without written permission.',
        ],
      },
      {
        h: 'Engagements',
        p: [
          'Work begins only once scope, timeline, and fees are agreed in writing. Anything discussed before that — including estimates given in conversation — is indicative, not binding.',
        ],
        ul: [
          'Scope, deliverables, and milestones are defined per engagement.',
          'Changes to agreed scope may affect timeline and fees, and will be confirmed before we proceed.',
          'Either party may end an engagement in writing; you pay for work completed to that point.',
        ],
      },
      {
        h: 'Fees and payment',
        p: [
          'Unless a proposal states otherwise, engagements are invoiced in stages, with the first invoice due before work starts. Invoices are payable within 14 days. We may pause work on overdue accounts.',
        ],
      },
      {
        h: 'Intellectual property',
        ul: [
          'On full payment, ownership of the final deliverables created specifically for you transfers to you.',
          'We retain ownership of our pre-existing tools, libraries, and internal methods, and grant you a licence to use them as part of the delivered work.',
          'We may show the work publicly in our portfolio unless you ask us in writing not to.',
        ],
      },
      {
        h: 'Your responsibilities',
        p: [
          'You confirm you have the rights to any content, assets, or credentials you give us, and that our use of them will not infringe anyone else\'s rights. Timely feedback and approvals are needed to hold a schedule.',
        ],
      },
      {
        h: 'Warranties and liability',
        p: [
          'We deliver work with reasonable skill and care. Beyond that, the site and our deliverables are provided without implied warranties. To the extent the law allows, our total liability for any engagement is limited to the fees paid for it, and we are not liable for indirect or consequential loss.',
        ],
      },
      {
        h: 'Confidentiality',
        p: [
          'Each party will keep the other\'s non-public information confidential and use it only for the engagement.',
        ],
      },
      {
        h: 'Contact',
        p: [`Questions about these terms: ${LEGAL_EMAIL}`],
      },
    ],
  },

  // ── IMPRINT ─────────────────────────────────────────────────────────
  imprint: {
    title: 'Imprint',
    intro:
      'Site notice and provider identification.',
    blocks: [
      {
        h: 'Provider',
        ul: [
          `${LEGAL_ENTITY}`,
          '[Registered address — street, city, postal code, country]',
          '[Legal form, e.g. sole proprietorship / private limited company]',
          '[Company registration number, if applicable]',
          '[VAT / tax identification number, if applicable]',
        ],
      },
      {
        h: 'Contact',
        ul: [
          `Email: ${LEGAL_EMAIL}`,
          'Web: raijinstudio.co',
        ],
      },
      {
        h: 'Responsible for content',
        p: ['[Full name of the person responsible for editorial content, and address if different from above.]'],
      },
      {
        h: 'Liability for content and links',
        p: [
          'We take care over the content published here but cannot guarantee it is complete or current. This site may link to external sites we do not control; responsibility for their content rests with their operators.',
        ],
      },
      {
        h: 'Copyright',
        p: [
          `Content and design on this site are the property of ${LEGAL_ENTITY} unless stated otherwise, and may not be reproduced commercially without permission.`,
        ],
      },
    ],
  },
}

export const LEGAL_SLUGS = Object.keys(DOCS)

export default function LegalPage({ slug }: { slug: string }) {
  const doc = DOCS[slug]

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -4% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [slug])

  if (!doc) {
    return (
      <div className="site loaded case-study">
        <section className="legal-hero">
          <div className="legal-inner">
            <h1 className="legal-title">Not found</h1>
            <p className="legal-intro">
              That page doesn’t exist. <a href="./">Back to the studio</a>.
            </p>
          </div>
        </section>
      </div>
    )
  }

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
          <li><a href="./#work">Work</a></li>
          <li><a href="./#contact">Contact</a></li>
        </ul>
        <LegalMobileNav />
      </nav>

      <header className="legal-hero">
        <div className="legal-inner">
          <a href="./" className="case-back-link reveal">
            <span aria-hidden>←</span> Back to studio
          </a>
          <div className="legal-meta reveal" style={{ transitionDelay: '60ms' }}>
            Last updated {LAST_UPDATED}
          </div>
          <h1 className="legal-title reveal" style={{ transitionDelay: '120ms' }}>{doc.title}</h1>
          <p className="legal-intro reveal" style={{ transitionDelay: '180ms' }}>{doc.intro}</p>
        </div>
      </header>

      <article className="legal-body">
        <div className="legal-inner">
          {doc.blocks.map((b, i) => (
            <section key={i} className="legal-block reveal">
              {b.h && <h2 className="legal-h">{b.h}</h2>}
              {b.p?.map((t, j) => <p key={j} className="legal-p">{t}</p>)}
              {b.ul && (
                <ul className="legal-ul">
                  {b.ul.map((t, j) => <li key={j}>{t}</li>)}
                </ul>
              )}
            </section>
          ))}

          <div className="legal-crosslinks reveal">
            {LEGAL_SLUGS.filter((s) => s !== slug).map((s) => (
              <a key={s} href={`?page=${s}`} className="legal-crosslink">
                {DOCS[s].title} <span className="cta-arrow" aria-hidden>→</span>
              </a>
            ))}
          </div>
        </div>
      </article>

      <footer className="site-footer case-footer">
        <div className="footer-bottom">
          <span>© MMXXVI · RAIJIN</span>
          <span>Built under the storm.</span>
        </div>
      </footer>
    </div>
  )
}
