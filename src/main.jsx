import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline } from '@mui/joy';

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
          <CssBaseline />

    <App />
  </StrictMode>,
)
