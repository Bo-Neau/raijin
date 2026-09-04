import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DemoOne } from './components/ui/hero-odyssey'
import CaseStudyRaijin from './pages/CaseStudyRaijin'
import CaseStudyVestry from './pages/CaseStudyVestry'
import LegalPage, { LEGAL_SLUGS } from './pages/LegalPage'

// URL params drive lightweight routing (no react-router needed for now):
//   ?demo          — standalone hero-odyssey preview
//   ?work=raijin   — case study: Raijin studio
//   ?work=vestry   — case study: Vestry apparel storefront
//   ?page=privacy  — Privacy Policy
//   ?page=terms    — Terms of Service
//   ?page=imprint  — Imprint / site notice
const params = new URLSearchParams(window.location.search)
const isDemo = params.has('demo')
const workSlug = params.get('work')
const pageSlug = params.get('page')

function Router() {
  if (isDemo) return <DemoOne />
  if (workSlug === 'raijin') return <CaseStudyRaijin />
  if (workSlug === 'vestry') return <CaseStudyVestry />
  if (pageSlug && LEGAL_SLUGS.includes(pageSlug)) return <LegalPage slug={pageSlug} />
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
