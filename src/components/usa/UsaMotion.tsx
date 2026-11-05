"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { useReducedMotion } from "@/lib/motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Heading whose words rise one after the other when it scrolls into view. */
export function SplitWords({ text, className = "", as = "h2" }: { text: string; className?: string; as?: "h2" | "p" }) {
  const reduce = useReducedMotion();
  const Tag = as === "p" ? motion.p : motion.h2;
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} transition={{ staggerChildren: 0.06 }}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: reduce ? { y: 0 } : { y: "110%", rotate: 4 },
              show: { y: 0, rotate: 0, transition: { duration: 0.75, ease: EASE } },
            }}
          >
            {word}
          </motion.span>
          {" "}
        </span>
      ))}
    </Tag>
  );
}

/** Card that tilts towards the pointer in 3D, with a glare following it. */
export function Tilt({ children, className = "", max = 9 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 18 });
  const glare = useTransform([px, py], ([x, y]) => `radial-gradient(circle at ${Number(x) * 100}% ${Number(y) * 100}%, rgba(255,255,255,0.28), transparent 55%)`);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const leave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`group/tilt relative h-full [transform-style:preserve-3d] ${className}`}
    >
      {children}
      {!reduce && <motion.span aria-hidden style={{ background: glare }} className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100" />}
    </motion.div>
  );
}

/** Soft gold light that follows the pointer across a card. */
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onPointerMove={move} className={`group/spot relative ${className}`}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background: "radial-gradient(380px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(245,179,1,0.16), transparent 60%)" }}
      />
      {children}
    </div>
  );
}

/** Dotted flight path drawn across the hero sky, with a plane flying along it. */
export function FlightPath() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[12%] -z-10 hidden h-[45%] md:block rtl:-scale-x-100">
      <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="h-full w-full">
        <motion.path
          d="M -20 260 C 220 60, 520 300, 760 110 S 1000 40, 1040 20"
          fill="none"
          stroke="rgba(245,179,1,0.55)"
          strokeWidth="2"
          strokeDasharray="2 10"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.2, delay: 0.6, ease: "easeInOut" }}
        />
      </svg>
      <motion.span
        className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-midnight shadow-[0_0_24px_rgba(245,179,1,0.7)]"
        initial={{ left: "-2%", top: "86%", opacity: 0 }}
        animate={{
          left: ["-2%", "22%", "50%", "76%", "102%"],
          top: ["86%", "38%", "62%", "34%", "6%"],
          rotate: [-40, -8, 10, -22, -30],
          opacity: [0, 1, 1, 1, 0],
        }}
        transition={{ duration: 9, delay: 1.2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
      >
        <Icon name="plane" className="h-4.5 w-4.5" />
      </motion.span>
    </div>
  );
}
