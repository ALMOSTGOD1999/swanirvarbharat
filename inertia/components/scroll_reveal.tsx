import { motion } from 'motion/react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right'
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const offsets = {
    up: { x: 0, y: 40 },
    left: { x: -60, y: 0 },
    right: { x: 60, y: 0 },
  }

  const variants = {
    hidden: { opacity: 0, ...offsets[direction] },
    visible: { opacity: 1, x: 0, y: 0 },
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
