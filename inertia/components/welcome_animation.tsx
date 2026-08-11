import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WELCOME_STORAGE_KEY = 'swanirvarbharat-welcome-shown'
const SAFETY_TIMEOUT_MS = 5900

// Indian flag palette
const SAFFRON = '#FF9933'
const WHITE = '#FFFFFF'
const GREEN = '#138808'
const NAVY = '#000080'
const GOLD = '#FBBF24'
const SKIN = '#F2B98C'
const HAIR = '#3B2A1E'
const WOOD = '#8B5A2B'
const WOOD_DARK = '#6B4226'

// 24 spokes of the Ashoka Chakra (15° apart)
const CHAKRA_SPOKES = Array.from({ length: 24 }, (_, i) => i * 15)

// Staircase: 5 steps ascending to the right (step index i: x = 330 + i*84, top y = 560 - i*50)
const STEPS = Array.from({ length: 5 }, (_, i) => ({
  x: 330 + i * 84,
  y: 560 - i * 50,
  rise: 50,
}))

// Student climb path (feet position): land on each step, hop a little on the way up
const CLIMB_X = [372, 414, 456, 498, 540, 582, 624, 666, 708]
const CLIMB_Y = [560, 494, 510, 444, 460, 394, 410, 344, 360]
const CLIMB_TIMES = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]

// Sparkles left behind along the stairs
const TRAIL = [
  { x: 414, y: 486 },
  { x: 498, y: 436 },
  { x: 582, y: 386 },
  { x: 666, y: 336 },
]

// Confetti burst at the top of the stairs
const CONFETTI = [
  { dx0: -6, dy0: -4, dx: -70, dy: -95, color: SAFFRON, delay: 0 },
  { dx0: 4, dy0: -8, dx: -40, dy: -125, color: WHITE, delay: 0.06 },
  { dx0: 8, dy0: -2, dx: 65, dy: -105, color: GREEN, delay: 0.1 },
  { dx0: -10, dy0: 2, dx: -85, dy: -45, color: GOLD, delay: 0.04 },
  { dx0: 12, dy0: 4, dx: 85, dy: -50, color: SAFFRON, delay: 0.08 },
  { dx0: -2, dy0: -10, dx: -20, dy: -120, color: GREEN, delay: 0.12 },
  { dx0: 6, dy0: 6, dx: 45, dy: -75, color: WHITE, delay: 0.14 },
  { dx0: -14, dy0: -2, dx: -60, dy: -70, color: GOLD, delay: 0.1 },
]

// Twinkling stars in the background
const BG_STARS = [
  { x: 70, y: 250, r: 2 },
  { x: 160, y: 340, r: 1.5 },
  { x: 250, y: 210, r: 2.2 },
  { x: 380, y: 320, r: 1.5 },
  { x: 520, y: 230, r: 2 },
  { x: 640, y: 300, r: 1.6 },
  { x: 760, y: 240, r: 2.1 },
  { x: 830, y: 350, r: 1.5 },
  { x: 700, y: 480, r: 1.4 },
  { x: 140, y: 480, r: 1.5 },
  { x: 470, y: 420, r: 1.6 },
]

const svgOrigin = { transformBox: 'fill-box', transformOrigin: 'center' } as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WelcomeAnimation() {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle')

  useEffect(() => {
    // Skip for users who prefer reduced motion, and play at most once per session
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (sessionStorage.getItem(WELCOME_STORAGE_KEY) === '1') return
    sessionStorage.setItem(WELCOME_STORAGE_KEY, '1')
    setPhase('playing')
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return
    document.body.style.overflow = 'hidden'
    const timer = setTimeout(() => setPhase('done'), SAFETY_TIMEOUT_MS)
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [phase])

  if (phase !== 'playing') return null

  return (
    <motion.div
      role="img"
      aria-label="Welcome to Swanirvarbharat. A student studies under the Indian flag, then climbs a staircase to success."
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(120% 120% at 50% 0%, #0d1b3e 0%, #060b26 70%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 5.5, times: [0, 0.07, 0.94, 1], ease: 'easeInOut' }}
      onAnimationComplete={() => setPhase('done')}
    >
      <svg
        viewBox="0 0 900 640"
        className="h-full w-full max-w-5xl"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="tricolorText" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={SAFFRON} />
            <stop offset="50%" stopColor={WHITE} />
            <stop offset="100%" stopColor={GREEN} />
          </linearGradient>
        </defs>

        <BackgroundStars />
        <FlagScene />
        <TitleGroup />
        <StudyScene />
        <ClimbScene />
      </svg>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Scenes
// ---------------------------------------------------------------------------

function BackgroundStars() {
  return (
    <g>
      {BG_STARS.map((star, i) => (
        <motion.circle
          key={i}
          cx={star.x}
          cy={star.y}
          r={star.r}
          fill={WHITE}
          animate={{ opacity: [0.12, 0.6, 0.12] }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </g>
  )
}

function FlagScene() {
  return (
    <motion.g
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0, rotate: [0, -0.7, 0.7, 0] }}
      transition={{
        opacity: { duration: 0.6, delay: 0.25 },
        y: { duration: 0.6, delay: 0.25, ease: 'easeOut' },
        rotate: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
      }}
      style={{ transformBox: 'fill-box', transformOrigin: '50% 40%' }}
    >
      {/* Pole */}
      <rect x="118" y="22" width="9" height="158" rx="4" fill="#C9D4E6" />
      <circle cx="122.5" cy="20" r="7" fill={GOLD} />

      {/* Tricolor bands */}
      {[
        { y: 38, fill: SAFFRON, delay: 0.32 },
        { y: 84, fill: WHITE, delay: 0.44 },
        { y: 130, fill: GREEN, delay: 0.56 },
      ].map((band, i) => (
        <motion.rect
          key={i}
          x="130"
          y={band.y}
          width="640"
          height="46"
          rx={band.y === 84 ? 0 : 5}
          fill={band.fill}
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: band.delay, duration: 0.4, ease: 'easeOut' }}
        />
      ))}

      {/* Ashoka Chakra */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.45, ease: 'backOut' }}
        style={svgOrigin}
      >
        <circle cx="450" cy="105" r="17" fill="none" stroke={NAVY} strokeWidth="2.5" />
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={svgOrigin}
        >
          {CHAKRA_SPOKES.map((deg) => (
            <line
              key={deg}
              x1="450"
              y1="101"
              x2="450"
              y2="92"
              stroke={NAVY}
              strokeWidth="2"
              transform={`rotate(${deg} 450 105)`}
            />
          ))}
        </motion.g>
        <circle cx="450" cy="105" r="3.5" fill={NAVY} />
      </motion.g>
    </motion.g>
  )
}

function TitleGroup() {
  return (
    <motion.g
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 4.35, duration: 0.5, ease: 'easeOut' }}
    >
      <text
        x="450"
        y="272"
        textAnchor="middle"
        fontFamily="Hahmlet, serif"
        fontSize="56"
        fontWeight="700"
        letterSpacing="3"
        fill="url(#tricolorText)"
      >
        Swanirvarbharat
      </text>
      <text
        x="450"
        y="304"
        textAnchor="middle"
        fontFamily="Poppins, sans-serif"
        fontSize="19"
        letterSpacing="6"
        fill="#A9C0E8"
      >
        LEARN • RISE • SHINE
      </text>
      {/* Tricolor underline */}
      {[
        { x: 378, fill: SAFFRON, delay: 4.5 },
        { x: 429, fill: WHITE, delay: 4.6 },
        { x: 480, fill: GREEN, delay: 4.7 },
      ].map((bar, i) => (
        <motion.rect
          key={i}
          x={bar.x}
          y="320"
          width="42"
          height="5"
          rx="2.5"
          fill={bar.fill}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: bar.delay, duration: 0.35, ease: 'easeOut' }}
          style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
        />
      ))}
    </motion.g>
  )
}

function StudyScene() {
  return (
    <motion.g
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.95, duration: 0.5, ease: 'easeOut' }}
    >
      {/* Lamp glow */}
      <motion.ellipse
        cx="308"
        cy="432"
        rx="60"
        ry="36"
        fill={SAFFRON}
        animate={{ opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      />

      {/* Floor shadow */}
      <ellipse cx="205" cy="524" rx="160" ry="14" fill="#000000" opacity="0.25" />

      {/* Chair */}
      <g>
        <rect x="122" y="448" width="8" height="40" rx="3" fill={WOOD} />
        <rect x="118" y="486" width="44" height="8" rx="3" fill={WOOD} />
        <rect x="120" y="492" width="7" height="28" rx="2" fill={WOOD_DARK} />
        <rect x="153" y="492" width="7" height="28" rx="2" fill={WOOD_DARK} />
      </g>

      {/* Student studying */}
      <motion.g
        animate={{ y: [-1, 1, -1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
      >
        <circle cx="152" cy="436" r="15" fill={SKIN} />
        <path d="M 137,438 A 15,15 0 0 1 167,438 Z" fill={HAIR} />
        <rect x="138" y="450" width="28" height="34" rx="9" fill={WHITE} />
        <rect x="138" y="476" width="26" height="14" rx="6" fill="#334155" />
        <rect x="160" y="454" width="26" height="7" rx="3.5" fill={SKIN} />
      </motion.g>

      {/* Desk */}
      <g>
        <rect x="184" y="470" width="132" height="10" rx="4" fill={WOOD} />
        <rect x="190" y="480" width="9" height="42" rx="2" fill={WOOD_DARK} />
        <rect x="301" y="480" width="9" height="42" rx="2" fill={WOOD_DARK} />
      </g>

      {/* Open book on desk */}
      <g>
        <rect
          x="214"
          y="462"
          width="46"
          height="8"
          rx="2"
          fill={SAFFRON}
          transform="rotate(-8 237 466)"
        />
        <rect
          x="260"
          y="462"
          width="46"
          height="8"
          rx="2"
          fill={SAFFRON}
          transform="rotate(8 283 466)"
        />
        <rect x="230" y="458" width="20" height="6" rx="2" fill={WHITE} />
      </g>

      {/* Book stack */}
      <rect x="330" y="482" width="34" height="9" rx="2" fill={GREEN} />
      <rect x="330" y="473" width="34" height="9" rx="2" fill={NAVY} />
      <rect x="330" y="464" width="34" height="9" rx="2" fill={SAFFRON} />

      {/* Lamp */}
      <rect x="304" y="470" width="18" height="7" rx="3" fill="#9CA3AF" />
      <rect x="307" y="426" width="5" height="44" fill="#9CA3AF" />
      <path d="M 293 430 L 326 430 L 319 410 L 300 410 Z" fill={SAFFRON} />

      {/* Floating knowledge sparkles */}
      {[
        { x: 180, y: 390, fill: GOLD, delay: 0 },
        { x: 225, y: 375, fill: WHITE, delay: 0.5 },
        { x: 270, y: 392, fill: SAFFRON, delay: 1.0 },
      ].map((spark, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0 }}
          animate={{ y: [-6, -30], opacity: [0, 0.9, 0] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 1.4 + spark.delay,
          }}
        >
          <polygon
            points="0,-5 4,0 0,5 -4,0"
            fill={spark.fill}
            transform={`translate(${spark.x} ${spark.y})`}
          />
        </motion.g>
      ))}
    </motion.g>
  )
}

function ClimbScene() {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.3, duration: 0.4 }}
    >
      {/* Staircase steps appear one by one */}
      {STEPS.map((step, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.45 + i * 0.2, duration: 0.35, ease: 'easeOut' }}
        >
          <rect x={step.x} y={step.y} width="84" height="10" rx="3" fill="#E8ECF4" />
          <rect x={step.x} y={step.y + 10} width="84" height={step.rise} fill="#C3CFE2" />
        </motion.g>
      ))}

      {/* Sparkle trail behind the climbing student */}
      {TRAIL.map((spark, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: 1 }}
          transition={{ delay: 2.75 + i * 0.25, duration: 0.8, ease: 'easeOut' }}
          style={svgOrigin}
        >
          <polygon
            points="0,-6 3.5,0 0,6 -3.5,0"
            fill={i % 2 === 0 ? GOLD : SAFFRON}
            transform={`translate(${spark.x} ${spark.y})`}
          />
        </motion.g>
      ))}

      {/* Student climbing the stairs */}
      <motion.g
        initial={{ opacity: 0, x: CLIMB_X[0], y: CLIMB_Y[0] }}
        animate={{
          opacity: 1,
          x: CLIMB_X,
          y: CLIMB_Y,
          rotate: [0, 5, 0, 5, 0],
        }}
        transition={{
          opacity: { delay: 2.5, duration: 0.2 },
          x: { delay: 2.5, duration: 1.5, times: CLIMB_TIMES, ease: 'easeInOut' },
          y: { delay: 2.5, duration: 1.5, times: CLIMB_TIMES, ease: 'easeInOut' },
          rotate: { delay: 2.5, duration: 1.5, times: [0, 0.25, 0.5, 0.75, 1], ease: 'easeInOut' },
        }}
      >
        {/* Standing student, feet at local origin, facing right */}
        <g>
          {/* Legs */}
          <rect x="-6" y="-18" width="6" height="18" rx="3" fill="#334155" />
          <rect x="1" y="-18" width="6" height="18" rx="3" fill="#334155" />
          <rect x="-7" y="-3" width="8" height="4" rx="2" fill="#1F2937" />
          <rect x="0" y="-3" width="8" height="4" rx="2" fill="#1F2937" />
          {/* Backpack */}
          <rect x="-14" y="-40" width="7" height="17" rx="3" fill={SAFFRON} />
          {/* Body */}
          <rect x="-10" y="-40" width="20" height="26" rx="8" fill={WHITE} />
          {/* Arm + book */}
          <rect x="8" y="-37" width="9" height="6" rx="3" fill={SKIN} />
          <rect x="12" y="-35" width="14" height="9" rx="1.5" fill={GREEN} />
          <rect x="12" y="-33" width="14" height="2" fill={WHITE} opacity="0.8" />
          {/* Head */}
          <circle cx="0" cy="-55" r="13" fill={SKIN} />
          <path d="M -13,-55 A 13,13 0 0 1 13,-55 Z" fill={HAIR} />
        </g>
      </motion.g>

      {/* Glow + gold star at the top */}
      <motion.circle
        cx="750"
        cy="300"
        r="34"
        fill={GOLD}
        animate={{ opacity: [0.08, 0.2, 0.08] }}
        transition={{ delay: 4.05, duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 4.05, duration: 0.4, ease: 'backOut' }}
        style={svgOrigin}
      >
        <polygon
          points="0,-22 5.3,-7.3 20.9,-6.8 8.6,2.8 12.9,17.8 0,9 -12.9,17.8 -8.6,2.8 -20.9,-6.8 -5.3,-7.3"
          fill={GOLD}
          stroke="#B45309"
          strokeWidth="1.5"
          transform="translate(750 300)"
        />
      </motion.g>

      {/* Graduation cap drops onto the student's head */}
      <motion.g
        initial={{ opacity: 0, y: -70 }}
        animate={{ opacity: 1, y: -54 }}
        transition={{ delay: 4.1, duration: 0.45, ease: 'easeOut' }}
      >
        <polygon points="-20,-2 0,-10 20,-2 0,6" fill={NAVY} transform="translate(708 296)" />
        <rect x="702" y="300" width="12" height="7" rx="2" fill="#1F3A7A" />
        <path d="M 728,294 q 8,6 4,16" stroke={GOLD} strokeWidth="2.5" fill="none" />
        <circle cx="732" cy="310" r="3" fill={GOLD} />
      </motion.g>

      {/* Confetti burst */}
      {CONFETTI.map((c, i) => (
        <motion.circle
          key={i}
          cx={750 + c.dx0}
          cy={300 + c.dy0}
          r="4"
          fill={c.color}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], x: [0, c.dx], y: [0, c.dy], scale: 1 }}
          transition={{ delay: 4.3 + c.delay, duration: 0.9, ease: 'easeOut' }}
          style={svgOrigin}
        />
      ))}
    </motion.g>
  )
}
