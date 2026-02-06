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
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-charcoal text-canvas-white hover:bg-charcoal/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileOpen}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - horizontal nav on desktop, slide-out on mobile */}
      <aside
        aria-label="Main navigation"
        className={clsx(
          'fixed top-0 left-0 h-full bg-white/95 backdrop-blur-sm border-r border-charcoal/10 z-40 transition-transform duration-300 ease-in-out shadow-sm',
          'lg:translate-x-0 lg:static lg:z-auto lg:w-full lg:h-auto lg:border-r-0 lg:border-b',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'w-72 flex flex-col lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-4'
        )}
      >
        {/* Logo/Title */}
        <div className="p-6 border-b border-charcoal/10 bg-charcoal/[0.02] lg:border-b-0 lg:border-r lg:border-charcoal/10 lg:pr-6 lg:py-0">
          <h1 className="font-display text-2xl font-normal text-charcoal tracking-tight">The Algorithmic Loop</h1>
          <p className="text-xs text-charcoal/50 mt-1 tracking-wide uppercase">Computational Crochet Lab</p>
        </div>

        {/* Navigation - horizontal row on desktop */}
        <nav className="flex-1 overflow-y-auto p-4 lg:flex-1 lg:overflow-visible lg:p-0 lg:pl-6" aria-label="Module navigation">
          <ul className="flex flex-col gap-2 list-none lg:flex-row lg:gap-3 lg:flex-1 lg:justify-end">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeModule === item.id

              return (
                <li key={item.id} className="lg:flex-1 lg:max-w-[180px]">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={clsx(
                      'w-full flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 text-center lg:flex-row lg:justify-center lg:gap-2 lg:py-3 lg:px-4',
                      'hover:bg-charcoal/5',
                      isActive
                        ? 'bg-yarn-blue/20 text-yarn-blue font-semibold ring-2 ring-yarn-blue/50 shadow-sm'
                        : 'bg-charcoal/[0.04] text-charcoal/70 hover:text-charcoal hover:bg-charcoal/[0.08] border border-charcoal/10'
                    )}
                  >
                    <Icon
                      size={24}
                      className={clsx(
                        'flex-shrink-0 lg:w-5 lg:h-5',
                        isActive ? 'text-yarn-blue' : 'text-charcoal/50'
                      )}
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-sm leading-tight">{item.label}</div>
                      <div className={clsx(
                        'text-xs mt-0.5 line-clamp-2 lg:sr-only',
                        isActive ? 'text-yarn-blue/80' : 'text-charcoal/50'
                      )}>
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
