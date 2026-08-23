import { motion } from 'framer-motion'
import { ScanLine, Sparkles, LayoutGrid, ChefHat } from 'lucide-react'

const STEPS = [
  {
    icon: ScanLine,
    title: 'Scan',
    copy: 'Photograph any grocery bill. Real OCR reads every line item in seconds.',
    tone: 'bg-rust-600',
  },
  {
    icon: Sparkles,
    title: 'Discover',
    copy: 'Pantrio parses names, quantities, units, and prices automatically.',
    tone: 'bg-gold-500',
  },
  {
    icon: LayoutGrid,
    title: 'Manage',
    copy: 'Your pantry stays current — stock levels, totals, and low-stock alerts.',
    tone: 'bg-olive-700',
  },
  {
    icon: ChefHat,
    title: 'Cook',
    copy: 'See what you can make right now, and what\u2019s missing for the rest.',
    tone: 'bg-tomato-500',
  },
]

export default function FlowSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[1.75rem] border border-ink/8 bg-paper p-6 shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300"
          >
            <span className="absolute top-5 right-5 font-display text-3xl text-ink/8">0{i + 1}</span>
            <div className={`flex h-11 w-11 items-center justify-center rounded-full ${step.tone} text-cream-soft mb-5`}>
              <step.icon size={19} strokeWidth={2} />
            </div>
            <h3 className="font-display text-xl text-ink mb-1.5">{step.title}</h3>
            <p className="text-sm text-ink-faint leading-relaxed">{step.copy}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
