import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScanLine, ChefHat, Leaf, LayoutGrid } from 'lucide-react'
import { useInventory } from '@/context/InventoryContext'

const LINKS = [
  { to: '/inventory', label: 'Inventory', icon: LayoutGrid },
  { to: '/recipes', label: 'Recipes', icon: ChefHat },
]

export default function Navbar() {
  const { totals } = useInventory()

  return (
    <header className="sticky top-0 z-40 pt-4 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between rounded-full border border-ink/8 bg-cream-soft/80 backdrop-blur-xl shadow-soft px-3 py-2 sm:px-4">
          <NavLink to="/" className="flex items-center gap-2 pl-1.5 pr-3 py-1 shrink-0">
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-olive-700">
              <Leaf size={14} className="text-cream-soft" strokeWidth={2.4} />
            </span>
            <span className="font-display text-xl tracking-tight text-ink">Pantrio</span>
          </NavLink>

          <nav className="hidden sm:flex items-center gap-1">
            {LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-cream-soft' : 'text-ink-soft hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-olive-700"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon size={15} className="relative z-10" strokeWidth={2.2} />
                    <span className="relative z-10">{label}</span>
                    {label === 'Inventory' && totals.lowStockCount > 0 && (
                      <span className="relative z-10 ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rust-600 px-1 text-[10px] font-bold text-cream-soft">
                        {totals.lowStockCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <NavLink
            to="/scan"
            className="flex items-center gap-1.5 rounded-full bg-rust-600 hover:bg-rust-700 transition-colors px-4 py-2 text-sm font-semibold text-cream-soft shrink-0"
          >
            <ScanLine size={15} strokeWidth={2.3} />
            <span className="hidden xs:inline">Scan bill</span>
            <span className="xs:hidden">Scan</span>
          </NavLink>
        </div>

        <nav className="sm:hidden mt-2 flex items-center justify-center gap-1 rounded-full border border-ink/8 bg-cream-soft/80 backdrop-blur-xl shadow-soft px-2 py-1.5">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive ? 'bg-olive-700 text-cream-soft' : 'text-ink-soft'
                }`
              }
            >
              <Icon size={13} strokeWidth={2.2} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
