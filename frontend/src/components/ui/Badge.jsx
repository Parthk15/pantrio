const TONES = {
  olive: 'bg-olive-100 text-olive-800',
  rust: 'bg-rust-100 text-rust-700',
  gold: 'bg-gold-200 text-gold-600',
  tomato: 'bg-tomato-100 text-tomato-600',
  ink: 'bg-ink/8 text-ink-soft',
  cream: 'bg-cream-dark text-ink-soft',
}

export default function Badge({ children, tone = 'olive', className = '', icon: Icon }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${TONES[tone]} ${className}`}
    >
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  )
}
