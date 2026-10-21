"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Thin gold bar at the very top of the page that fills as the visitor scrolls. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-linear-to-r from-gold via-amber to-sky rtl:origin-right"
    />
  );
}
