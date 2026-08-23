import { motion } from 'framer-motion'

function Tomato({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <path d="M50 24c6-6 14-8 20-4-3 5-8 8-13 9 10 2 19 12 19 27 0 18-14 32-31 32S14 74 14 56c0-15 9-25 19-27-5-1-10-4-13-9 6-4 14-2 20 4Z" fill="#C1642F" />
      <path d="M42 22c-2-6 0-12 4-15 2 4 2 9 0 13Z" fill="#3E4A34" />
      <path d="M58 22c2-6 0-12-4-15-2 4-2 9 0 13Z" fill="#3E4A34" />
      <ellipse cx="38" cy="46" rx="6" ry="4" fill="#E8A672" opacity="0.55" />
    </svg>
  )
}

function Bread({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <path d="M14 55c0-22 16-38 36-38s36 16 36 38v14a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6Z" fill="#D4A24C" />
      <path d="M14 55c0-22 16-38 36-38s36 16 36 38" fill="none" stroke="#a87b32" strokeWidth="2.5" opacity="0.4" />
      <path d="M30 46c4-6 10-9 20-9s16 3 20 9" fill="none" stroke="#a87b32" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

function Jar({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <rect x="26" y="18" width="48" height="14" rx="5" fill="#647753" />
      <path d="M30 32h40l4 46a8 8 0 0 1-8 8H34a8 8 0 0 1-8-8Z" fill="#F7F2E8" stroke="#3E4A34" strokeWidth="2.5" />
      <rect x="30" y="52" width="40" height="22" fill="#C1642F" opacity="0.85" />
    </svg>
  )
}

function Leaf({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <path d="M20 78C16 46 40 18 78 18c2 30-22 60-58 60Z" fill="#4d5d40" />
      <path d="M22 76C40 58 54 42 74 24" fill="none" stroke="#c7d0b8" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

const FLOATERS = [
  { Comp: Tomato, className: 'w-16 h-16 top-2 left-4', delay: 0 },
  { Comp: Bread, className: 'w-20 h-20 top-24 -right-2', delay: 0.6 },
  { Comp: Jar, className: 'w-14 h-14 bottom-16 left-0', delay: 1.1 },
  { Comp: Leaf, className: 'w-24 h-24 bottom-0 right-8', delay: 0.3 },
]

export default function HeroIllustration() {
  return (
    <div className="relative mx-auto h-[340px] w-[340px] sm:h-[420px] sm:w-[420px]">
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-olive-100 via-cream-soft to-gold-200 blur-2xl opacity-70" />
      <div className="absolute inset-16 rounded-full border border-olive-300/40" />
      <div className="absolute inset-0 rounded-full border border-dashed border-olive-300/30 animate-[spin_60s_linear_infinite]" />

      {FLOATERS.map(({ Comp, className, delay }, i) => (
        <motion.div
          key={i}
          className={`absolute drop-shadow-lg ${className}`}
          animate={{ y: [0, -12, 0], rotate: [0, i % 2 === 0 ? 4 : -4, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay }}
        >
          <Comp className="w-full h-full" />
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 18 }}
        className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-olive-700 shadow-lift"
      >
        <Leaf className="w-10 h-10" />
      </motion.div>
    </div>
  )
}
