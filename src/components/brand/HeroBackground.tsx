"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";

// Deterministic star field so server and client render the same markup.
function makeStars(count: number, seed: number) {
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, () => ({
    left: rnd() * 100,
    top: rnd() * 75,
    size: 1 + rnd() * 2,
    delay: rnd() * 6,
    duration: 3 + rnd() * 4,
  }));
}
const STARS = makeStars(55, 11);

/** Curved flight routes across the hero (viewBox 1440 × 900). */
const ROUTES = [
  { d: "M-60 720 C 320 460, 760 380, 1500 150", dur: "11s", begin: "0s" },
  { d: "M-60 260 C 380 120, 900 330, 1500 560", dur: "14s", begin: "3s" },
  { d: "M180 980 C 480 640, 1020 620, 1320 -60", dur: "12s", begin: "6s" },
];

/**
 * Animated hero backdrop: drifting aurora glows, twinkling stars and flight
 * routes with travelling comets. Layers follow the pointer slightly and move
 * at different speeds while scrolling. Fully static with reduced motion.
 */
export function HeroBackground({ scroll }: { scroll: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 50, damping: 20 });
  const sy = useSpring(py, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, px, py]);

  // pointer parallax (px) per layer
  const auroraX = useTransform(sx, (v) => v * -40);
  const auroraY = useTransform(sy, (v) => v * -30);
  const routesX = useTransform(sx, (v) => v * 25);
  const routesY = useTransform(sy, (v) => v * 18);
  const starsX = useTransform(sx, (v) => v * 12);
  const starsY = useTransform(sy, (v) => v * 10);
  // scroll parallax: deeper layers move less
  const auroraScroll = useTransform(scroll, [0, 1], [0, reduce ? 0 : 180]);
  const routesScroll = useTransform(scroll, [0, 1], [0, reduce ? 0 : 90]);
  const starsScroll = useTransform(scroll, [0, 1], [0, reduce ? 0 : 40]);
  const fade = useTransform(scroll, [0, 0.9], [1, reduce ? 1 : 0.35]);
  const add = ([a, b]: number[]) => a + b;
  const aY = useTransform([auroraY, auroraScroll], add);
  const rY = useTransform([routesY, routesScroll], add);
  const stY = useTransform([starsY, starsScroll], add);

  return (
    <motion.div aria-hidden style={{ opacity: fade }} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* aurora glows */}
      <motion.div style={{ x: auroraX, y: aY }} className="absolute inset-0 mix-blend-screen">
        <span className="absolute -start-[15%] -top-[20%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(0,168,203,0.35),transparent_60%)] motion-safe:animate-[g4v-drift-a_22s_ease-in-out_infinite]" />
        <span className="absolute -end-[20%] top-[5%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(3,179,226,0.28),transparent_60%)] motion-safe:animate-[g4v-drift-b_26s_ease-in-out_infinite]" />
        <span className="absolute bottom-[-25%] start-[25%] h-[50vmax] w-[50vmax] rounded-full bg-[radial-gradient(circle,rgba(245,179,1,0.16),transparent_60%)] motion-safe:animate-[g4v-drift-c_30s_ease-in-out_infinite]" />
      </motion.div>

      {/* stars */}
      <motion.div style={{ x: starsX, y: stY }} className="absolute inset-0">
        {STARS.map((st, i) => (
          <span
            key={i}
            className="keep-light absolute rounded-full bg-white opacity-40 motion-safe:animate-[g4v-twinkle_var(--d)_ease-in-out_infinite]"
            style={
              {
                left: `${st.left}%`,
                top: `${st.top}%`,
                width: st.size,
                height: st.size,
                animationDelay: `${st.delay}s`,
                "--d": `${st.duration}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </motion.div>

      {/* flight routes with travelling comets */}
      <motion.svg
        style={{ x: routesX, y: rY }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id="g4v-comet">
            <stop offset="0%" stopColor="#FFE08A" />
            <stop offset="40%" stopColor="#F5B301" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F5B301" stopOpacity="0" />
          </radialGradient>
        </defs>
        {ROUTES.map((r, i) => (
          <g key={i}>
            <path
              d={r.d}
              fill="none"
              stroke="#F5B301"
              strokeOpacity="0.22"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="2 12"
              className="motion-safe:animate-[g4v-dash_6s_linear_infinite]"
            />
            {!reduce && (
              <circle r="9" fill="url(#g4v-comet)">
                <animateMotion dur={r.dur} begin={r.begin} repeatCount="indefinite" path={r.d} />
              </circle>
            )}
          </g>
        ))}
      </motion.svg>
    </motion.div>
  );
}
