import { Leaf } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-faint">
        <div className="flex items-center gap-2">
          <Leaf size={14} className="text-olive-600" />
          <span className="font-display text-base text-ink-soft">Pantrio</span>
        </div>
        <p>Your pantry, but smarter — scan, discover, manage, cook.</p>
      </div>
    </footer>
  )
}
