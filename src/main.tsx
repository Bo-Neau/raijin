import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DemoOne } from './components/ui/hero-odyssey'
import CaseStudyRaijin from './pages/CaseStudyRaijin'

// URL params drive lightweight routing (no react-router needed for now):
//   ?demo         — standalone hero-odyssey preview
//   ?work=raijin  — first case study
const params = new URLSearchParams(window.location.search)
const isDemo = params.has('demo')
const workSlug = params.get('work')

function Router() {
  if (isDemo) return <DemoOne />
  if (workSlug === 'raijin') return <CaseStudyRaijin />
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
