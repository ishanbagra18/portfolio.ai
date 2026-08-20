import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import axios from 'axios'
import { API_BASE } from './lib/api'

axios.defaults.baseURL = API_BASE;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
      <App />
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
