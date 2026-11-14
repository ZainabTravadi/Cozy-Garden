import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import AnalyticsConsent from './components/AnalyticsConsent.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './styles/consent.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <><ErrorBoundary><App /></ErrorBoundary><AnalyticsConsent /></>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
