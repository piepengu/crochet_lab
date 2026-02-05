import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/shared/ErrorBoundary'

console.log('main.jsx: Starting application initialization')

const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('main.jsx: Root element not found!')
  throw new Error('Root element not found')
}

console.log('main.jsx: Root element found, creating React root')

try {
  const root = createRoot(rootElement)
  console.log('main.jsx: React root created, rendering App')
  
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
  
  console.log('main.jsx: Render call completed')
} catch (error) {
  console.error('main.jsx: Error during render:', error)
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: monospace;">
      <h2>Fatal Error</h2>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>
  `
}
