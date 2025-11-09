import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#18100a',
          color: '#f5f1e8',
          border: '1px solid #2a1b12',
        },
        success: {
          iconTheme: {
            primary: '#4a7c2c',
            secondary: '#18100a',
          },
        },
        error: {
          iconTheme: {
            primary: '#b85846',
            secondary: '#18100a',
          },
        },
      }}
    />
  </StrictMode>,
)
