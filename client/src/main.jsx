import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import Providers from './components/Providers.jsx'

console.log("🚀 main.jsx: Starting app initialization...");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)

console.log("✅ main.jsx: App rendered");
