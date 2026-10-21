/**
 * The curved Earth horizon with gold city lights and flight arcs — the
 * signature backdrop from the brand book cover.
 */

// Deterministic pseudo-random lights so server and client render the same.
function lights(count: number, seed: number) {
  const out: { x: number; y: number; r: number; o: number }[] = [];
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < count; i++) {
    const x = rnd() * 1440;
    // keep lights below the curve: curve top ≈ 120 at centre, ≈ 200 at edges
    const edge = 120 + Math.pow((x - 720) / 720, 2) * 90;
    const y = edge + 18 + rnd() * (300 - edge - 18);
    out.push({ x, y, r: 0.6 + rnd() * 1.6, o: 0.35 + rnd() * 0.6 });
  }
  return out;
}

const DOTS = lights(140, 7);

export function GlobeHorizon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 300"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="g4v-earth" gradientUnits="userSpaceOnUse" x1="0" y1="120" x2="0" y2="300">
          <stop offset="0" stopColor="#0176B1" />
          <stop offset="0.35" stopColor="#0B2D5B" />
          <stop offset="1" stopColor="#012149" />
        </linearGradient>
        <filter id="g4v-glow" filterUnits="userSpaceOnUse" x="-100" y="60" width="1640" height="260">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {/* atmosphere glow */}
      <ellipse cx="720" cy="2600" rx="2600" ry="2480" fill="none" stroke="#03B3E2" strokeOpacity=".55" strokeWidth="10" filter="url(#g4v-glow)" />
      <ellipse cx="720" cy="2600" rx="2600" ry="2480" fill="url(#g4v-earth)" />
      {/* flight arcs */}
      <g fill="none" stroke="#F5B301" strokeOpacity=".28" strokeWidth="1.2">
        <path d="M-40 250C300 150 700 150 1100 230" />
        <path d="M200 300C420 190 820 170 1480 210" />
        <path d="M60 210C500 180 900 200 1300 290" />
        <path d="M980 300C1040 220 1120 170 1200 160" />
        <path d="M480 300C560 230 660 200 820 190" />
      </g>
      <g fill="#F5B301">
        {DOTS.map((d, i) => (
          <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={d.r.toFixed(2)} opacity={d.o.toFixed(2)} />
        ))}
      </g>
    </svg>
  );
}
