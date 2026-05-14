import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DemoOne } from './components/ui/hero-odyssey'

// Visit ?demo=1 or ?demo to see the standalone hero-odyssey component.
const isDemo = new URLSearchParams(window.location.search).has('demo')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isDemo ? <DemoOne /> : <App />}
  </StrictMode>,
)
