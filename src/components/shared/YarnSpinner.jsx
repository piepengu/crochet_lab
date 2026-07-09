import { motion } from 'framer-motion'

/**
 * Looping yarn loading indicator (replaces generic spinners)
 */
export default function YarnSpinner({ size = 24, className = '' }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden
      animate={{ rotate: 360 }}
      transition={{ duration: 1.25, repeat: Infinity, ease: 'linear' }}
    >
      <circle
        cx="16"
        cy="16"
        r="11"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="18 51"
        opacity="0.85"
      />
      <motion.circle
        cx="16"
        cy="7"
        r="3"
        fill="currentColor"
        animate={{ scale: [1, 1.2, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut' }}
      />
      <path
        d="M16 10v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </motion.svg>
  )
}
