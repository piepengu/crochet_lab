import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
    console.log('ErrorBoundary: Constructor called')
  }

  static getDerivedStateFromError(error) {
    console.error('ErrorBoundary: getDerivedStateFromError called with:', error)
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary: componentDidCatch - Error:', error)
    console.error('ErrorBoundary: componentDidCatch - ErrorInfo:', errorInfo)
  }

  render() {
    console.log('ErrorBoundary: render called, hasError:', this.state.hasError)
    
    if (this.state.hasError) {
      return (
        <div role="alert" aria-live="assertive" style={{ 
          padding: '2rem', 
          backgroundColor: '#FAFAFA', 
          color: '#1A1A1A',
          minHeight: '100vh',
          fontFamily: 'monospace'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1A1A1A' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#DC2626', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
            {this.state.error?.message || 'An error occurred'}
          </p>
          {this.state.error?.stack && (
            <pre style={{ 
              backgroundColor: '#F5F5F5', 
              padding: '1rem', 
              borderRadius: '4px', 
              overflow: 'auto',
              fontSize: '0.875rem',
              marginTop: '1rem'
            }}>
              {this.state.error.stack}
            </pre>
          )}
          <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '1rem' }}>
            Please check the browser console for details.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4A90E2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
              aria-label="Try again"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#1A1A1A',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
              aria-label="Reload page"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
