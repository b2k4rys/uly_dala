// Qoshqar-müyiz (ram's horn) — the steppe ornament, our national signature.
export function OrnamentTile() {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M60 20 C46 20 44 9 33 12 C24 14 27 27 37 23" />
      <path d="M60 20 C74 20 76 9 87 12 C96 14 93 27 83 23" />
      <path d="M60 4 l7 9 -7 9 -7 -9 z" />
      <path d="M0 20 h14 M106 20 h14" />
    </g>
  )
}

export function Mark({ className = 'brand__mark' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 40"
      role="presentation"
      aria-hidden="true"
    >
      <OrnamentTile />
    </svg>
  )
}

export function SteppeBand() {
  return (
    <div className="band" aria-hidden="true">
      <div className="wrap">
        <svg width="100%" height="24" role="presentation">
          <defs>
            <pattern
              id="steppe"
              width="120"
              height="24"
              patternUnits="userSpaceOnUse"
              patternTransform="translate(0 -8)"
            >
              <OrnamentTile />
            </pattern>
          </defs>
          <rect width="100%" height="24" fill="url(#steppe)" />
        </svg>
      </div>
    </div>
  )
}
