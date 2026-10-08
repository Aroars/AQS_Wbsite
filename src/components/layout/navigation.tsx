"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const solutions: { label: string; href: string; children?: { label: string; href: string }[] }[] = [
  { label: "VeriPak SCADA", href: "/solutions/veripak" },
  { label: "IntelliPak Feed Systems", href: "/solutions/intellipak" },
  {
    label: "Sanitary Conveyors",
    href: "/solutions/conveyors",
    children: [
      { label: "Belt Conveyors", href: "/solutions/conveyors/belt" },
      { label: "MDR Conveyors", href: "/solutions/conveyors/mdr" },
      { label: "Pallet Conveyors", href: "/solutions/conveyors/pallet" },
      { label: "Projects", href: "/solutions/conveyors/projects" },
    ],
  },
  { label: "Sanitary Robotics", href: "/solutions/robotics" },
  { label: "EvacuPak Recovery", href: "/solutions/evacupak" },
];

const company = [
  { label: "About AQS", href: "/about" },
  { label: "For Reps", href: "/reps" },
  { label: "Blog", href: "/blog" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [companyDropdown, setCompanyDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isSolutionPage = pathname?.startsWith("/solutions");
  const isCompanyPage = pathname === "/about" || pathname === "/reps" || pathname?.startsWith("/blog");

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[1000] bg-surface-page border-b border-border"
        style={{
          padding: scrolled ? "9px 0" : "18px 0",
          transition: "padding 250ms ease",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5" data-cursor-hover>
            <Image
              src="/images/logos/aqs-favicon.png"
              alt="AQS"
              width={44}
              height={44}
              className="rounded-[7px] shadow-[0_0_16px_rgba(0,194,255,0.3)]"
              style={{
                width: scrolled ? 34 : 44,
                height: scrolled ? 34 : 44,
                transition: "width 250ms ease, height 250ms ease",
              }}
              priority
            />
            <div>
              <div
                className="font-sans font-bold text-text-strong"
                style={{
                  fontSize: scrolled ? "0.95rem" : "1.12rem",
                  transition: "font-size 250ms ease",
                }}
              >
                Automated Quality Solutions
              </div>
              <div
                className="font-mono text-accent-text tracking-[0.15em] uppercase"
                style={{
                  fontSize: scrolled ? "0.52rem" : "0.58rem",
                  transition: "font-size 250ms ease",
                }}
              >
                Nampa, Idaho
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`font-sans font-medium transition-colors ${
                pathname === "/"
                  ? "text-accent-text"
                  : "text-text-nav hover:text-text-strong"
              }`}
              style={{
                fontSize: scrolled ? "0.84rem" : "0.95rem",
                transition: "font-size 250ms ease",
              }}
            >
              Home
            </Link>

            {/* Solutions dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdown(true)}
              onMouseLeave={() => setDropdown(false)}
            >
              <Link
                href="/solutions"
                className={`font-sans font-medium transition-colors ${
                  isSolutionPage
                    ? "text-accent-text"
                    : "text-text-nav hover:text-text-strong"
                }`}
                style={{
                  fontSize: scrolled ? "0.84rem" : "0.95rem",
                  transition: "font-size 250ms ease",
                }}
              >
                Solutions ▾
              </Link>
              <AnimatePresence>
                {dropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-[-10px] mt-1 min-w-[210px] py-1.5 rounded-[10px] bg-surface-card border border-border shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
                  >
                    {solutions.map((s) => (
                      <div key={s.href}>
                        <Link
                          href={s.href}
                          className={`block w-full text-left font-sans text-[0.84rem] px-[18px] py-[9px] transition-colors ${
                            pathname === s.href || (pathname?.startsWith(s.href) && !s.children)
                              ? "text-accent-text"
                              : "text-text-nav hover:text-text-strong"
                          }`}
                        >
                          {s.label}
                        </Link>
                        {s.children?.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className={`block w-full text-left font-sans text-[0.78rem] pl-[30px] pr-[18px] py-[6px] transition-colors ${
                              pathname?.startsWith(c.href)
                                ? "text-accent-text"
                                : "text-text-nav/70 hover:text-text-strong"
                            }`}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Company dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCompanyDropdown(true)}
              onMouseLeave={() => setCompanyDropdown(false)}
            >
              <Link
                href="/about"
                className={`font-sans font-medium transition-colors ${
                  isCompanyPage
                    ? "text-accent-text"
                    : "text-text-nav hover:text-text-strong"
                }`}
                style={{
                  fontSize: scrolled ? "0.84rem" : "0.95rem",
                  transition: "font-size 250ms ease",
                }}
              >
                Company ▾
              </Link>
              <AnimatePresence>
                {companyDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-[-10px] mt-1 min-w-[160px] py-1.5 rounded-[10px] bg-surface-card border border-border shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
                  >
                    {company.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className={`block w-full text-left font-sans text-[0.84rem] px-[18px] py-[9px] transition-colors ${
                          pathname?.startsWith(c.href)
                            ? "text-accent-text"
                            : "text-text-nav hover:text-text-strong"
                        }`}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/apps"
              className={`font-sans font-medium transition-colors ${
                pathname === "/apps"
                  ? "text-accent-text"
                  : "text-text-nav hover:text-text-strong"
              }`}
              style={{
                fontSize: scrolled ? "0.84rem" : "0.95rem",
                transition: "font-size 250ms ease",
              }}
            >
              Apps
            </Link>

            <Link
              href="/toolbox"
              className={`font-sans font-medium transition-colors ${
                pathname === "/toolbox"
                  ? "text-accent-text"
                  : "text-text-nav hover:text-text-strong"
              }`}
              style={{
                fontSize: scrolled ? "0.84rem" : "0.95rem",
                transition: "font-size 250ms ease",
              }}
            >
              Toolbox
            </Link>

            <ThemeToggle />

            <MagneticButton
              as="a"
              href="/contact"
              className={`font-sans font-semibold text-brand-navy-deep bg-brand-cyan rounded-md inline-block transition-all duration-[250ms] hover:brightness-105 ${
                scrolled
                  ? "text-[0.84rem] px-5 py-2.5"
                  : "text-[0.95rem] px-6 py-3"
              }`}
            >
              Get a Quote
            </MagneticButton>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-6 h-0.5 bg-text-strong rounded-full origin-center"
              animate={{
                rotate: mobileOpen ? 45 : 0,
                y: mobileOpen ? 8 : 0,
              }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-text-strong rounded-full"
              animate={{ opacity: mobileOpen ? 0 : 1 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-text-strong rounded-full origin-center"
              animate={{
                rotate: mobileOpen ? -45 : 0,
                y: mobileOpen ? -8 : 0,
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[999] pt-20 bg-surface-page overflow-y-auto"
          >
            <div className="flex flex-col items-center gap-6 pt-12">
              <Link
                href="/"
                className="font-sans text-lg font-medium text-text-strong"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <div className="text-center">
                <Link
                  href="/solutions"
                  className="font-sans text-lg font-medium text-text-strong block mb-4"
                  onClick={() => setMobileOpen(false)}
                >
                  Solutions
                </Link>
                {solutions.map((s) => (
                  <div key={s.href}>
                    <Link
                      href={s.href}
                      className="block font-sans text-sm text-text-nav py-1.5"
                      onClick={() => setMobileOpen(false)}
                    >
                      {s.label}
                    </Link>
                    {s.children?.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block font-sans text-xs text-text-nav/70 py-1"
                        onClick={() => setMobileOpen(false)}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <span className="font-sans text-lg font-medium text-text-strong block mb-4">
                  Company
                </span>
                {company.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="block font-sans text-sm text-text-nav py-1.5"
                    onClick={() => setMobileOpen(false)}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/apps"
                className="font-sans text-lg font-medium text-text-strong"
                onClick={() => setMobileOpen(false)}
              >
                Apps
              </Link>
              <Link
                href="/toolbox"
                className="font-sans text-lg font-medium text-text-strong"
                onClick={() => setMobileOpen(false)}
              >
                Toolbox
              </Link>
              <div className="flex items-center gap-3 mt-4 pb-10">
                <ThemeToggle />
                <Link
                  href="/contact"
                  className="font-sans text-sm font-semibold text-brand-navy-deep bg-brand-cyan px-6 py-3 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
