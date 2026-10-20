import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.jsx'

Sentry.init({
  dsn: 'https://0b3d26458be66c6d31771146456807aa@o4512290536292352.ingest.us.sentry.io/4512290751381504',
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  sendDefaultPii: false,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
