import { motion } from 'framer-motion'

const VARIANTS = {
  primary: 'bg-olive-700 text-cream-soft hover:bg-olive-800 shadow-soft',
  rust: 'bg-rust-600 text-cream-soft hover:bg-rust-700 shadow-soft',
  ghost: 'bg-transparent text-ink hover:bg-olive-100 border border-ink/10',
  paper: 'bg-paper text-ink hover:bg-cream-dark border border-ink/10 shadow-soft',
}

const SIZES = {
  sm: 'text-sm px-4 py-2 rounded-full',
  md: 'text-[0.95rem] px-5 py-2.5 rounded-full',
  lg: 'text-base px-7 py-3.5 rounded-full',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  as = 'button',
  ...props
}) {
  const Comp = typeof as === 'string' ? (motion[as] || motion.button) : motion(as)

  return (
    <Comp
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="shrink-0" size={size === 'lg' ? 20 : 17} strokeWidth={2.1} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="shrink-0" size={size === 'lg' ? 20 : 17} strokeWidth={2.1} />}
    </Comp>
  )
}
