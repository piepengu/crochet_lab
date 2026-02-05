import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/layout/Sidebar'
import DoilyGraph from './components/modules/DoilyGraph'
import SquarePermutator from './components/modules/SquarePermutator'
import ErrorBoundary from './components/shared/ErrorBoundary'

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
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-charcoal mb-4">About</h2>
            <p className="text-charcoal/70">About section coming soon...</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-canvas-white">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      
      {/* Main content area */}
      <main className="lg:ml-64 min-h-screen">
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
