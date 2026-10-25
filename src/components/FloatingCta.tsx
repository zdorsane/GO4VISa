"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { Icon } from "./ui/Icon";

/**
 * Floating call to action pointing to the destinations. It appears once the
 * hero is scrolled past and hides while the destinations, the contact form or
 * the footer are on screen, so it never covers the content it promotes.
 */
export function FloatingCta({ lang, t }: { lang: Locale; t: Dict["floatingCta"] }) {
  const reduce = useReducedMotion();
  const [pastHero, setPastHero] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const targets = [
      document.getElementById("destinations"),
      document.getElementById("contact"),
      document.querySelector("footer"),
    ].filter((el): el is HTMLElement => !!el);
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setBlocked(visible.size > 0);
      },
      { rootMargin: "-20% 0px -25% 0px" },
    );
    targets.forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const show = pastHero && !blocked;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6 sm:justify-end sm:px-6">
      <AnimatePresence>
        {show && (
          <motion.div
            key="cta"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="pointer-events-auto"
          >
            {/* gentle float */}
            <motion.div
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* halo pulse */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-gold/60 motion-safe:animate-[g4v-halo_2.6s_ease-out_infinite]"
              />
              <Link
                href={`/${lang}/how-it-works#destinations`}
                className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-gold py-2 pe-5 ps-2 font-semibold text-midnight shadow-[0_18px_40px_-12px_rgba(245,179,1,0.75),0_8px_20px_-10px_rgba(11,45,91,0.6)] ring-1 ring-white/40 transition-colors hover:bg-amber"
              >
                {/* light sweep */}
                <span
                  aria-hidden
                  className="absolute inset-y-0 -start-1/2 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/60 to-transparent motion-safe:animate-[g4v-shine_3.6s_ease-in-out_infinite]"
                />
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-midnight text-gold">
                  <Icon
                    name="plane"
                    className="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5 motion-safe:animate-[g4v-fly_3.2s_ease-in-out_infinite]"
                  />
                </span>
                <span className="relative whitespace-nowrap text-sm sm:hidden">{t.short}</span>
                <span className="relative hidden whitespace-nowrap text-sm sm:inline">{t.label}</span>
                <Icon
                  name="arrow"
                  className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
