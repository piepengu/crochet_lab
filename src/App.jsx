import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/layout/Sidebar'
import DoilyGraph from './components/modules/DoilyGraph'
import SquarePermutator from './components/modules/SquarePermutator'
import ErrorBoundary from './components/shared/ErrorBoundary'
import Manifesto from './components/shared/Manifesto'

// Lazy load TextureScanner to prevent blocking on initial load
const TextureScanner = lazy(() => import('./components/modules/TextureScanner'))

function App() {
  console.log('App.jsx: Component rendering')
  const [activeModule, setActiveModule] = useState('doily')

  const renderModule = () => {
    switch (activeModule) {
      case 'doily':
        return <DoilyGraph />
      case 'squares':
        return <SquarePermutator />
      case 'texture':
        return (
          <ErrorBoundary>
            <Suspense fallback={
              <div className="p-8">
                <div className="flex items-center gap-2 text-charcoal/60">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yarn-blue"></div>
                  <span>Loading Texture Recognition module...</span>
                </div>
              </div>
            }>
              <TextureScanner />
            </Suspense>
          </ErrorBoundary>
        )
      case 'about':
        return <Manifesto />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-canvas-white flex flex-col lg:flex-col">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      
      {/* Main content area */}
      <main id="main-content" className="flex-1 pt-16 lg:pt-0 min-h-screen" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderModule()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
