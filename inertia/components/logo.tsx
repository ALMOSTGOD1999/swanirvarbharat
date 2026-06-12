import { Link } from '@adonisjs/inertia/react'

export function Logo({ width = 220, height = 36 }: { width?: number; height?: number }) {
  return (
    <Link route="home" className="flex items-center gap-2">
      <svg
        width={width}
        height={height}
        viewBox="0 0 260 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="emblem-clip">
            <circle cx="20" cy="20" r="18" />
          </clipPath>
          <linearGradient id="sgo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>

        {/* Sky-Green-Orange circle emblem */}
        <g clipPath="url(#emblem-clip)">
          <circle cx="20" cy="20" r="18" fill="url(#sgo-grad)" />
        </g>

        {/* White outer ring */}
        <circle cx="20" cy="20" r="18" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Radial spokes */}
        <g stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6">
          <line x1="20" y1="5" x2="20" y2="35" />
          <line x1="5" y1="20" x2="35" y2="20" />
          <line x1="9.4" y1="9.4" x2="30.6" y2="30.6" />
          <line x1="9.4" y1="30.6" x2="30.6" y2="9.4" />
          <line x1="7.2" y1="14.7" x2="32.8" y2="25.3" />
          <line x1="7.2" y1="25.3" x2="32.8" y2="14.7" />
          <line x1="14.7" y1="7.2" x2="25.3" y2="32.8" />
          <line x1="14.7" y1="32.8" x2="25.3" y2="7.2" />
        </g>

        {/* Inner ring */}
        <circle
          cx="20"
          cy="20"
          r="5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          opacity="0.6"
        />
        <circle cx="20" cy="20" r="1.8" fill="#FFFFFF" opacity="0.6" />

        {/* Brand name */}
        <text
          x="50"
          y="27"
          fontFamily="'Hahmlet', serif"
          fontSize="19"
          fontWeight="600"
          fill="currentColor"
        >
          Swanirvarbharat
        </text>
      </svg>
    </Link>
  )
}
