import { useState } from 'react'
import { Circle, Grid3x3, Scan, FileText, Menu, X } from 'lucide-react'
import clsx from 'clsx'

const navigationItems = [
  {
    id: 'doily',
    label: 'Radial Topology',
    icon: Circle,
    description: 'Visualizing hyperbolic geometry in crochet',
  },
  {
    id: 'squares',
    label: 'Modular Permutations',
    icon: Grid3x3,
    description: 'Graph coloring algorithms for pattern generation',
  },
  {
    id: 'texture',
    label: 'Texture Recognition',
    icon: Scan,
    description: 'Computer vision for stitch identification',
  },
  {
    id: 'about',
    label: 'About',
    icon: FileText,
    description: 'The Human Algorithm',
  },
]

export default function Sidebar({ activeModule, onModuleChange }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleNavClick = (moduleId) => {
    onModuleChange(moduleId)
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-charcoal text-canvas-white hover:bg-charcoal/90 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full bg-canvas-white border-r border-charcoal/10 z-40 transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'w-64 flex flex-col'
        )}
      >
        {/* Logo/Title */}
        <div className="p-6 border-b border-charcoal/10">
          <h1 className="text-xl font-bold text-charcoal">The Algorithmic Loop</h1>
          <p className="text-sm text-charcoal/60 mt-1">Computational Crochet Lab</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeModule === item.id

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left',
                      'hover:bg-yarn-blue/10 hover:text-yarn-blue',
                      isActive
                        ? 'bg-yarn-blue/20 text-yarn-blue font-semibold'
                        : 'text-charcoal/70 hover:text-charcoal'
                    )}
                  >
                    <Icon
                      size={20}
                      className={clsx(
                        'flex-shrink-0',
                        isActive ? 'text-yarn-blue' : 'text-charcoal/50'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-charcoal/50 mt-0.5 truncate">
                        {item.description}
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-charcoal/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
