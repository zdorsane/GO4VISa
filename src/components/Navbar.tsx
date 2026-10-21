"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoLockup } from "./brand/Logo";
import { Icon } from "./ui/Icon";
import { buttonClasses } from "./ui/Button";
import { LanguageSwitch } from "./LanguageSwitch";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export function Navbar({ lang, ui, nav }: { lang: Locale; ui: Dict["ui"]; nav: Dict["nav"] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;
  const home = `/${lang}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-white/90 shadow-[0_8px_30px_-12px_rgba(11,45,91,0.25)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-midnight"
      >
        {ui.skipToContent}
      </a>
      <nav aria-label={ui.mainNav} className="container-brand flex h-[var(--g4v-header-h)] items-center justify-between gap-3">
        <Link href={home} aria-label={ui.homeLabel} className="shrink-0 rounded-lg">
          <LogoLockup variant={solid ? "color" : "white"} />
        </Link>

        <ul className="hidden items-center gap-1 xl:flex">
          {nav.map((item) => (
            <li key={item.hash}>
              <Link
                href={`${home}#${item.hash}`}
                className={`relative whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors after:absolute after:inset-x-3.5 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:after:scale-x-100 ${
                  solid ? "text-midnight" : "text-white/90 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitch lang={lang} label={ui.language} switchTo={ui.switchTo} tone={solid ? "dark" : "light"} />
          <Link href={`${home}#contact`} className={buttonClasses("gold", "!px-5 !py-2.5 max-sm:hidden")}>
            {ui.getStarted}
          </Link>
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full xl:hidden ${
              solid ? "text-midnight hover:bg-midnight/5" : "text-white hover:bg-white/10"
            }`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? ui.closeMenu : ui.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-line bg-white xl:hidden"
          >
            <ul className="container-brand flex flex-col py-4">
              {nav.map((item) => (
                <li key={item.hash}>
                  <Link
                    href={`${home}#${item.hash}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 font-medium text-midnight hover:bg-cloud"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Link href={`${home}#contact`} onClick={() => setOpen(false)} className={buttonClasses("gold", "w-full")}>
                  {ui.getStarted}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
