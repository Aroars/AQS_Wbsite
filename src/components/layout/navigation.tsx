"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";

const solutions = [
  { label: "VeriPak SCADA", href: "/solutions/veripak" },
  { label: "IntelliPak Feed Systems", href: "/solutions/intellipak" },
  { label: "Custom Conveyors", href: "/solutions/conveyors" },
  { label: "Sanitary Robotics", href: "/solutions/robotics" },
  { label: "EvacuPak Recovery", href: "/solutions/evacupak" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);
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

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[1000]"
        style={{
          padding: scrolled ? "9px 0" : "18px 0",
          background: scrolled
            ? "rgba(26,29,43,0.95)"
            : "rgba(26,29,43,0.5)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${scrolled ? "rgba(0,194,255,0.08)" : "transparent"}`,
          transition: "padding 250ms ease, background 250ms ease, border-bottom 250ms ease",
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
                className="font-sans font-bold text-white"
                style={{
                  fontSize: scrolled ? "0.95rem" : "1.12rem",
                  transition: "font-size 250ms ease",
                }}
              >
                Automated Quality Solutions
              </div>
              <div
                className="font-mono text-accent-primary/50 tracking-[0.15em] uppercase"
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
                  ? "text-accent-primary"
                  : "text-text-body hover:text-white"
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
                    ? "text-accent-primary"
                    : "text-text-body hover:text-white"
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
                    className="absolute top-full left-[-10px] mt-1 min-w-[210px] py-1.5 rounded-[10px] shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
                    style={{
                      background: "rgba(18,20,32,0.97)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(0,0,0,0.25)",
                    }}
                  >
                    {solutions.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className={`block w-full text-left font-sans text-[0.84rem] px-[18px] py-[9px] transition-colors ${
                          pathname?.startsWith(s.href)
                            ? "text-accent-primary"
                            : "text-text-body hover:text-white"
                        }`}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/about"
              className={`font-sans font-medium transition-colors ${
                pathname === "/about"
                  ? "text-accent-primary"
                  : "text-text-body hover:text-white"
              }`}
              style={{
                fontSize: scrolled ? "0.84rem" : "0.95rem",
                transition: "font-size 250ms ease",
              }}
            >
              About
            </Link>

            <MagneticButton
              as="a"
              href="/contact"
              className={`font-sans font-semibold text-bg-primary bg-gradient-to-br from-accent-primary to-[#0088ff] rounded-md shadow-[0_0_16px_rgba(0,194,255,0.2)] inline-block transition-all duration-[250ms] ${
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
              className="block w-6 h-0.5 bg-white rounded-full origin-center"
              animate={{
                rotate: mobileOpen ? 45 : 0,
                y: mobileOpen ? 8 : 0,
              }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-white rounded-full"
              animate={{ opacity: mobileOpen ? 0 : 1 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-white rounded-full origin-center"
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
            className="fixed inset-0 z-[999] pt-20"
            style={{
              background: "rgba(26,29,43,0.98)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="flex flex-col items-center gap-6 pt-12">
              <Link
                href="/"
                className="font-sans text-lg font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <div className="text-center">
                <Link
                  href="/solutions"
                  className="font-sans text-lg font-medium text-white block mb-4"
                  onClick={() => setMobileOpen(false)}
                >
                  Solutions
                </Link>
                {solutions.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block font-sans text-sm text-text-body py-1.5"
                    onClick={() => setMobileOpen(false)}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/about"
                className="font-sans text-lg font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="font-sans text-sm font-semibold text-bg-primary bg-gradient-to-br from-accent-primary to-[#0088ff] px-6 py-3 rounded-md mt-4"
                onClick={() => setMobileOpen(false)}
              >
                Get a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
