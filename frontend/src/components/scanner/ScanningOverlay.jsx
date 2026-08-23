import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const MESSAGES = {
  uploading: 'Uploading your bill…',
  reading: 'Reading your groceries…',
}

export default function ScanningOverlay({ preview, status }) {
  const message = MESSAGES[status] || 'Working…'

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-ink/10 bg-paper shadow-lift">
      <img src={preview} alt="Scanning bill" className="w-full h-80 object-cover" />

      <div className="absolute inset-0 bg-olive-950/35" />

      {/* scanning sweep line */}
      <motion.div
        className="absolute inset-x-0 h-24 top-0"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(212,162,76,0.35), transparent)',
        }}
        animate={{ y: ['-10%', '340%'] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* corner brackets, like a document scanner viewfinder */}
      {[
        'top-4 left-4 border-t-2 border-l-2 rounded-tl-xl',
        'top-4 right-4 border-t-2 border-r-2 rounded-tr-xl',
        'bottom-4 left-4 border-b-2 border-l-2 rounded-bl-xl',
        'bottom-4 right-4 border-b-2 border-r-2 rounded-br-xl',
      ].map((cls, i) => (
        <div key={i} className={`absolute h-8 w-8 border-gold-500/80 ${cls}`} />
      ))}

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 pb-6 pt-10 bg-gradient-to-t from-olive-950/70 to-transparent">
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 text-cream-soft"
          >
            <motion.span
              animate={{ rotate: [0, 15, -10, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              <Sparkles size={16} className="text-gold-500" />
            </motion.span>
            <span className="font-medium text-sm tracking-wide">{message}</span>
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-cream-soft/80"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
