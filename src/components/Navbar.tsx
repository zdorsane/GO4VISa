"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoLockup } from "./brand/Logo";
import { Icon } from "./ui/Icon";
import { buttonClasses } from "./ui/Button";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeToggle, useIsDark } from "./ThemeToggle";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

/**
 * Pages first (Home ▾ · How it works · Destinations · FAQ); the home page's
 * sections live in the Home dropdown on desktop and in a second group on phones.
 */
export function Navbar({ lang, ui, nav }: { lang: Locale; ui: Dict["ui"]; nav: Dict["nav"] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [homeMenu, setHomeMenu] = useState(false);
  const homeRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const dark = useIsDark();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open && !homeMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setHomeMenu(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (homeRef.current && !homeRef.current.contains(e.target as Node)) setHomeMenu(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open, homeMenu]);

  const solid = scrolled || open;
  const home = `/${lang}`;
  // A page link is "current" on its own page; anchors into a page (#destinations) never are.
  const isCurrent = (path: string) => (path === "" ? pathname === home : !path.includes("#") && pathname === `${home}${path}`);

  const linkClass = (current: boolean) =>
    `relative inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition-colors after:absolute after:inset-x-3.5 after:bottom-1 after:h-0.5 after:origin-left after:bg-gold after:transition-transform hover:after:scale-x-100 rtl:after:origin-right ${
      current ? "font-semibold after:scale-x-100" : "font-medium after:scale-x-0"
    } ${solid ? "text-midnight" : "text-white/90 hover:text-white"}`;

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
          <LogoLockup variant={solid && !dark ? "color" : "white"} />
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {/* Home + its sections */}
          <li
            ref={homeRef}
            className="relative"
            onMouseEnter={() => setHomeMenu(true)}
            onMouseLeave={() => setHomeMenu(false)}
          >
            <div className="flex items-center">
              <Link href={home} className={linkClass(isCurrent(""))} aria-current={isCurrent("") ? "page" : undefined}>
                {nav.home}
              </Link>
              <button
                type="button"
                aria-expanded={homeMenu}
                aria-controls="home-sections"
                aria-label={nav.sectionsLabel}
                onClick={() => setHomeMenu((v) => !v)}
                className={`-ms-2.5 flex h-8 w-6 items-center justify-center rounded-full ${solid ? "text-midnight" : "text-white/90"}`}
              >
                <Icon name="chevron" className={`h-3.5 w-3.5 transition-transform duration-200 ${homeMenu ? "rotate-180" : ""}`} />
              </button>
            </div>
            <AnimatePresence>
              {homeMenu && (
                <motion.div
                  id="home-sections"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute start-0 top-full pt-2"
                >
                  <div className="w-60 rounded-2xl bg-white p-2 shadow-[0_25px_50px_-20px_rgba(11,45,91,0.45)] ring-1 ring-line">
                    <p className="label-caps px-3 pb-1 pt-2 !text-[0.6rem] text-slate">{nav.sectionsLabel}</p>
                    <ul>
                      {nav.sections.map((s) => (
                        <li key={s.path}>
                          <Link
                            href={`${home}${s.path}`}
                            onClick={() => setHomeMenu(false)}
                            className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-midnight transition-colors hover:bg-cloud hover:text-ocean"
                          >
                            {s.label}
                            <Icon name="arrow" className="h-3.5 w-3.5 opacity-40" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {nav.pages.map((item) => {
            const current = isCurrent(item.path);
            return (
              <li key={item.path}>
                <Link href={`${home}${item.path}`} className={linkClass(current)} aria-current={current ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitch lang={lang} label={ui.language} tone={solid ? "dark" : "light"} />
          <ThemeToggle toDark={ui.themeDark} toLight={ui.themeLight} tone={solid ? "dark" : "light"} className="max-sm:hidden" />
          <Link href={`${home}/apply`} className={buttonClasses("gold", "!px-5 !py-2.5 max-sm:hidden")}>
            {ui.getStarted}
          </Link>
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden ${
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
            className="max-h-[calc(100svh-var(--g4v-header-h))] overflow-y-auto border-t border-line bg-white lg:hidden"
          >
            <div className="container-brand py-4">
              <ul className="space-y-1">
                {[{ label: nav.home, path: "" }, ...nav.pages].map((item) => {
                  const current = isCurrent(item.path);
                  return (
                    <li key={item.path || "home"}>
                      <Link
                        href={`${home}${item.path}`}
                        onClick={() => setOpen(false)}
                        aria-current={current ? "page" : undefined}
                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 font-semibold transition-colors ${
                          current ? "bg-midnight text-white" : "text-midnight hover:bg-cloud"
                        }`}
                      >
                        {item.label}
                        <Icon name="arrow" className={`h-4 w-4 ${current ? "text-gold" : "opacity-40"}`} />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <p className="label-caps mt-4 px-3 !text-[0.6rem] text-slate">{nav.sectionsLabel}</p>
              <ul className="mt-2 grid grid-cols-2 gap-1.5">
                {nav.sections.map((s) => (
                  <li key={s.path}>
                    <Link
                      href={`${home}${s.path}`}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl bg-cloud px-3 py-2 text-sm font-medium text-midnight ring-1 ring-line hover:text-ocean"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center gap-3 sm:hidden">
                <ThemeToggle toDark={ui.themeDark} toLight={ui.themeLight} tone="dark" />
                <span className="text-sm font-medium text-midnight">{dark ? ui.themeLight : ui.themeDark}</span>
              </div>
              <Link href={`${home}/apply`} onClick={() => setOpen(false)} className={buttonClasses("gold", "mt-4 w-full")}>
                {ui.getStarted}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
