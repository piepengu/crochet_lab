import { useState } from 'react'
import { Circle, Grid3x3, Scan, FileText, Menu, X } from 'lucide-react'
import clsx from 'clsx'
import BrandMark from '../shared/BrandMark'

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
      {/* Mobile top bar — brand always visible */}
      <div className="lg:hidden sticky top-0 z-[90] flex items-center gap-3 px-3 py-3 bg-gradient-to-r from-[#eef3f8] to-white border-b border-charcoal/10">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="shrink-0 p-2.5 rounded-lg bg-charcoal text-canvas-white shadow-md hover:bg-charcoal/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="min-w-0 flex-1">
          <BrandMark compact titleAs="h1" />
        </div>
      </div>

      <aside
        aria-label="Main navigation"
        className={clsx(
          'fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out',
          'bg-gradient-to-b from-white via-white to-[#f3f6fa]',
          'border-r border-charcoal/10 shadow-sm',
          'lg:translate-x-0 lg:sticky lg:top-0 lg:z-50 lg:w-full lg:h-auto lg:max-h-none',
          'lg:border-r-0 lg:border-b lg:shadow-[0_1px_0_rgba(26,26,26,0.06)]',
          'lg:bg-gradient-to-r lg:from-[#eef3f8] lg:via-white lg:to-white',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'w-[19rem] flex flex-col lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-4 shrink-0'
        )}
      >
        {/* Desktop brand */}
        <div className="hidden lg:block lg:border-r lg:border-charcoal/10 lg:pr-7 lg:py-1 lg:min-w-[300px]">
          <BrandMark compact titleAs="h1" />
        </div>

        {/* Mobile drawer header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-charcoal/10">
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-charcoal/45">
            Modules
          </p>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg text-charcoal/60 hover:bg-charcoal/5"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className="flex-1 overflow-y-auto p-4 lg:flex-1 lg:overflow-visible lg:p-0 lg:pl-6"
          aria-label="Module navigation"
        >
          <ul className="flex flex-col gap-2 list-none lg:flex-row lg:gap-2.5 lg:flex-1 lg:justify-end">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeModule === item.id

              return (
                <li key={item.id} className="lg:flex-1 lg:max-w-[168px]">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={clsx(
                      'w-full flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 text-center',
                      'lg:flex-row lg:justify-center lg:gap-2 lg:py-2.5 lg:px-3',
                      isActive
                        ? 'bg-yarn-blue text-white'
                        : 'bg-white/70 text-charcoal/70 border border-charcoal/10 hover:border-charcoal/20 hover:text-charcoal hover:bg-white'
                    )}
                  >
                    <Icon
                      size={22}
                      className={clsx(
                        'flex-shrink-0 lg:w-[18px] lg:h-[18px]',
                        isActive ? 'text-white' : 'text-yarn-blue/80'
                      )}
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-sm leading-tight">{item.label}</div>
                      <div
                        className={clsx(
                          'text-xs mt-0.5 line-clamp-2 lg:sr-only',
                          isActive ? 'text-white/85' : 'text-charcoal/50'
                        )}
                      >
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

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-charcoal/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
