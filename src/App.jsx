import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/layout/Sidebar'
import DoilyGraph from './components/modules/DoilyGraph'
import SquarePermutator from './components/modules/SquarePermutator'
import ErrorBoundary from './components/shared/ErrorBoundary'
import Manifesto from './components/shared/Manifesto'
import ImpactHome from './components/shared/ImpactHome'
import DemoModeBanner from './components/shared/DemoModeBanner'
import YarnSpinner from './components/shared/YarnSpinner'

const TextureScanner = lazy(() => import('./components/modules/TextureScanner'))

function App() {
  const [activeModule, setActiveModule] = useState('home')
  const [demoMode, setDemoMode] = useState(true)

  const renderModule = () => {
    switch (activeModule) {
      case 'home':
        return (
          <ImpactHome
            onNavigate={setActiveModule}
            demoMode={demoMode}
            onToggleDemo={setDemoMode}
          />
        )
      case 'doily':
        return <DoilyGraph />
      case 'squares':
        return <SquarePermutator />
      case 'texture':
        return (
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="p-8">
                  <div className="flex items-center gap-2 text-yarn-blue">
                    <YarnSpinner size={28} />
                    <span className="text-charcoal/60">
                      Loading Texture Recognition module...
                    </span>
                  </div>
                </div>
              }
            >
              <TextureScanner demoMode={demoMode} />
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
    <div className="min-h-screen bg-canvas-white flex flex-col">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <DemoModeBanner
        enabled={demoMode && activeModule === 'texture'}
        onDisable={() => setDemoMode(false)}
      />

      <main
        id="main-content"
        className="relative z-0 flex-1 min-h-0 overflow-x-hidden pt-14 sm:pt-16 lg:pt-0"
        tabIndex={-1}
      >
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
