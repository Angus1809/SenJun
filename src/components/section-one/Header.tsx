"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { label: "Home", href: "#top" },
  { label: "Our Story", href: "#our-story" },
  { label: "Community", href: "#community" },
  { label: "Rooms", href: "#rooms" },
  { label: "Contact", href: "#contact" },
];

export default function Header({
  scrolled,
  onNav,
}: {
  scrolled: boolean;
  onNav: (hash: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    onNav(href);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-deep/5 bg-cream/75 shadow-[0_8px_30px_-18px_rgba(51,68,78,0.35)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-6 sm:px-10 lg:h-20">
          {/* Logo — the real SenJun mark from the assets, replacing the old
              handwritten wordmark. The file is the emblem printed on its own
              opaque black field, and its artwork only fills 508 of the 735px
              height (69%); the rest is empty black. Square + object-contain
              therefore shrank the whole mark into a speck. The badge is sized
              from the measured artwork box (x 36-734, y 118-625) so that
              object-cover crops only that dead margin while keeping the gold
              ring, wordmark and laurel clear of every edge — including the
              corner radius, which is kept tight for that reason. Same file,
              same proportions, never recoloured. */}
          <a
            href="#top"
            onClick={go("#top")}
            aria-label="SenJun — back to top"
            className="group relative flex items-center"
          >
            <span className="flex h-[50px] w-16 items-center justify-center overflow-hidden rounded-xl bg-black shadow-[0_6px_16px_-8px_rgba(51,68,78,0.55)] ring-1 ring-[#C9A24A]/55 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:ring-[#C9A24A] lg:h-[60px] lg:w-[76px]">
              <img
                src="/images/senjun logo.png"
                alt="SenJun"
                width={735}
                height={735}
                className="h-full w-full object-cover"
              />
            </span>
          </a>

          {/* Center nav */}
          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={go(link.href)}
                className="relative text-[12.5px] font-semibold uppercase tracking-[0.14em] text-deep/65 transition-colors duration-300 hover:text-deep after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-leaf after:transition-all after:duration-500 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={go("#contact")}
              className="hidden rounded-full bg-deep px-6 py-2.5 text-sm font-semibold tracking-wide text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-deep/90 hover:shadow-[0_14px_28px_-12px_rgba(51,68,78,0.55)] sm:inline-flex"
            >
              Book a Visit
            </a>

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-deep/15 text-deep transition-colors duration-300 hover:border-deep/40 lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-[1.5px] w-full bg-current transition-all duration-300 ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-3 h-[1.5px] w-full bg-current transition-all duration-300 ${
                    open ? "top-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-cream/95 backdrop-blur-xl lg:hidden"
          >
            {LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={go(link.href)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.08 * i + 0.1, duration: 0.5 }}
                className="font-display text-3xl font-medium text-deep transition-colors duration-300 hover:text-sky"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={go("#contact")}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-4 rounded-full bg-deep px-8 py-3 text-sm font-semibold text-cream"
            >
              Book a Visit
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
