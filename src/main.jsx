import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LocatorDataProvider } from './context/LocatorContext.jsx'
import App from './components/App/App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocatorDataProvider>
      <App />
    </LocatorDataProvider>
  </StrictMode>,
)