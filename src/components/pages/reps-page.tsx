"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated-section";
import {
  reasons,
  products,
  partnerSteps,
  repTools,
  downloads,
  productPills,
  REP_CYAN,
  REP_GOLD,
} from "@/data/reps";

/* ================================================
   Reason Card (hover lift)
   ================================================ */
function ReasonCard({
  icon,
  title,
  body,
  accent,
}: {
  icon: string;
  title: string;
  body: string;
  accent: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="rounded-xl p-7 h-full transition-all duration-300 hover:-translate-y-1"
      style={{
        background: hov ? "var(--surface-card-hover)" : "var(--surface-page)",
        border: `1px solid ${hov ? accent + "4D" : "var(--border)"}`,
        boxShadow: hov
          ? "0 20px 40px rgba(10,22,40,0.14)"
          : "0 4px 12px rgba(10,22,40,0.06)",
      }}
    >
      <div className="text-[1.5rem] mb-3.5">{icon}</div>
      <h3 className="font-sans text-[1rem] font-bold text-text-strong mb-2.5 leading-[1.4]">
        {title}
      </h3>
      <p className="font-sans text-[0.875rem] text-text-body leading-[1.75] m-0">
        {body}
      </p>
    </div>
  );
}

/* ================================================
   Tool Card
   ================================================ */
function ToolCard({
  icon,
  title,
  accent,
  tag,
  url,
  urlPath,
  body,
  features,
}: {
  icon: string;
  title: string;
  accent: string;
  tag: string;
  url: string;
  urlPath: string;
  body: string;
  features: string[];
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="rounded-xl p-9 relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: hov ? "var(--surface-card-hover)" : "var(--surface-card)",
        border: `1px solid ${hov ? accent + "4D" : "var(--border)"}`,
        boxShadow: hov
          ? "0 20px 40px rgba(10,22,40,0.14)"
          : "0 4px 12px rgba(10,22,40,0.06)",
      }}
    >
      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 w-[100px] h-[100px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${accent}10 0%, transparent 70%)`,
        }}
      />
      <div className="flex justify-between items-start mb-5">
        <div
          className="w-12 h-12 rounded-[10px] flex items-center justify-center text-[1.4rem]"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}30`,
          }}
        >
          {icon}
        </div>
        <span
          className="font-mono text-[0.62rem] uppercase tracking-[0.14em] px-2.5 py-0.5 rounded-full text-accent-text"
          style={{
            background: `${accent}14`,
            border: `1px solid ${accent}28`,
          }}
        >
          {tag}
        </span>
      </div>
      <h3 className="font-sans text-[1.35rem] font-extrabold text-text-strong mb-1.5">
        {title}
      </h3>
      <p className="font-mono text-[0.74rem] tracking-[0.06em] mb-5 text-accent-text">
        {url}
        <span className="opacity-60">{urlPath}</span>
      </p>
      <p className="font-sans text-[0.88rem] text-text-body leading-[1.75] mb-6">
        {body}
      </p>
      <div className="flex flex-col gap-2.5 mb-7">
        {features.map((f, i) => (
          <div key={i} className="flex gap-2.5">
            <span className="shrink-0 leading-[1.55] text-accent-text">
              &#x2713;
            </span>
            <span className="font-sans text-[0.84rem] text-text-body leading-[1.6]">
              {f}
            </span>
          </div>
        ))}
      </div>
      <div
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-[0.84rem] font-bold tracking-[0.03em]"
        style={{
          background: accent,
          color: "var(--brand-navy-deep)",
          boxShadow: hov
            ? `0 4px 20px ${accent}45`
            : `0 0 14px ${accent}25`,
          transition: "box-shadow 0.3s",
        }}
      >
        Access in Rep Portal &rarr;
      </div>
    </div>
  );
}

/* ================================================
   Download Card
   ================================================ */
function DownloadCard({
  title,
  desc,
  file,
  accent,
  tag,
  ext,
}: {
  title: string;
  desc: string;
  file: string;
  accent: string;
  tag: string;
  ext: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="rounded-xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{
        background: hov ? "var(--surface-card-hover)" : "var(--surface-page)",
        border: `1px solid ${hov ? accent + "4D" : "var(--border)"}`,
        boxShadow: hov
          ? "0 20px 40px rgba(10,22,40,0.14)"
          : "0 4px 12px rgba(10,22,40,0.06)",
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <span
          className="font-mono text-[0.62rem] uppercase tracking-[0.12em] px-2.5 py-0.5 rounded-full text-accent-text"
          style={{
            background: `${accent}15`,
            border: `1px solid ${accent}30`,
          }}
        >
          {tag}
        </span>
        <span className="font-mono text-[0.65rem] text-text-dim bg-surface-card border border-border-soft px-2 py-0.5 rounded">
          {ext}
        </span>
      </div>
      <h3 className="font-sans text-[0.92rem] font-bold text-text-strong mb-2 leading-[1.4]">
        {title}
      </h3>
      <p className="font-sans text-[0.82rem] text-text-dim leading-[1.7] mb-5 flex-1">
        {desc}
      </p>
      <a
        href={`/downloads/${file}`}
        download
        className="font-mono text-[0.82rem] font-semibold tracking-[0.04em] no-underline inline-flex items-center gap-1.5 transition-all duration-200 hover:gap-2.5 text-accent-text"
      >
        &darr; Download {ext}
      </a>
    </div>
  );
}

/* ================================================
   Rep Contact Form
   ================================================ */
function RepContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          message: `[Rep Inquiry]\nTerritory: ${form.company}\n\n${form.message}`,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-surface-card border border-border rounded-md px-3.5 py-2.5 text-text-strong placeholder:text-text-dim text-[0.9rem] font-sans outline-none transition-all duration-200 focus:border-accent-text focus:shadow-[0_0_16px_rgba(0,194,255,0.1)]";

  return (
    <section id="contact" className="py-[88px] px-8">
      <div className="max-w-[720px] mx-auto">
        <AnimatedSection>
          <div className="font-mono text-[0.65rem] tracking-[0.18em] uppercase mb-2.5 text-accent-text">
            Get in Touch
          </div>
          <h2 className="font-sans font-extrabold text-[clamp(1.7rem,3.5vw,2.6rem)] text-text-strong mb-3.5">
            Ready to Add AQS to Your Line Card?
          </h2>
          <p className="font-sans text-text-dim leading-[1.7] mb-10">
            Tell us about your territory and the markets you call on. We&apos;ll
            set up a conversation and get you onboarded fast.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          {status === "sent" ? (
            <div
              className="rounded-xl p-11 text-center"
              style={{
                background: `${REP_GOLD}12`,
                border: `1px solid ${REP_GOLD}35`,
              }}
            >
              <div className="text-[2.2rem] mb-3.5">&#x2713;</div>
              <h3 className="font-sans font-bold text-[1.1rem] mb-2 text-text-strong">
                Message Received
              </h3>
              <p className="font-sans text-text-body m-0">
                The AQS team will follow up within one business day. Download
                your materials above in the meantime.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl p-10 bg-surface-card border border-border"
            >
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block font-mono text-[0.7rem] uppercase tracking-[0.12em] text-text-dim mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    className={inputClass}
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[0.7rem] uppercase tracking-[0.12em] text-text-dim mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="jane@company.com"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[0.7rem] uppercase tracking-[0.12em] text-text-dim mb-1.5">
                    Territory / Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pacific Northwest, Texas, Midwest"
                    className={inputClass}
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-mono text-[0.7rem] uppercase tracking-[0.12em] text-text-dim mb-1.5">
                    Tell Us About Your Business
                  </label>
                  <textarea
                    placeholder="Current line card, industries served, number of active accounts..."
                    rows={4}
                    className={`${inputClass} resize-y`}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-4 items-center flex-wrap">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="font-sans font-bold text-[0.9rem] px-7 py-3 rounded-md bg-brand-cyan text-brand-navy-deep transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ boxShadow: `0 0 22px ${REP_CYAN}38` }}
                >
                  {status === "sending" ? "Sending..." : "Send Message \u2192"}
                </button>
                <span className="font-sans text-[0.82rem] text-text-dim">
                  Or email us:{" "}
                  <a
                    href="mailto:sales@automatedqs.com"
                    className="no-underline text-accent-text"
                  >
                    sales@automatedqs.com
                  </a>
                </span>
              </div>
              {status === "error" && (
                <p className="font-sans text-text-strong text-[0.84rem] mt-3 rounded-md border border-accent-red/30 bg-accent-red/10 px-4 py-3">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}
            </form>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ================================================
   Page Export
   ================================================ */
export function RepsPageContent() {
  const [activeProduct, setActiveProduct] = useState(0);
  const p = products[activeProduct];

  return (
    <>
      {/* ══════════════════════════════════════════
          HERO
          ══════════════════════════════════════════ */}
      {/* Text-only hero: light surfaces (plan section 3); the grid texture is drawn with the soft border */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-surface-page">
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--border-soft) 1px, transparent 1px), linear-gradient(90deg, var(--border-soft) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 max-w-[1100px] mx-auto px-8 py-[120px] w-full">
          <AnimatedSection>
            {/* Badge pill */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
              style={{
                background: `${REP_CYAN}15`,
                border: `1px solid ${REP_CYAN}35`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: REP_CYAN }}
              />
              <span className="font-mono text-[0.62rem] tracking-[0.18em] uppercase text-accent-text">
                Authorized Rep Program &middot; AQS
              </span>
            </div>

            <div className="max-w-[720px]">
              <h1 className="font-sans font-extrabold text-[clamp(2.4rem,5.5vw,4rem)] leading-[1.08] text-text-strong mb-5">
                The Line Card That{" "}
                <span className="text-accent-text">Closes Itself.</span>
              </h1>
              <p className="font-sans text-[clamp(1rem,1.8vw,1.15rem)] text-text-body leading-[1.75] mb-9 max-w-[620px]">
                AQS builds automation that food and beverage plants actually
                need &mdash; SCADA platforms, intelligent feed systems, sanitary
                conveyors, and washdown robotics. When you bring us in,
                you&apos;re bringing a complete solution and a team that makes
                you look good.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="#contact"
                  className="font-sans font-bold text-[0.92rem] px-7 py-3.5 rounded-md no-underline tracking-[0.03em] bg-brand-cyan text-brand-navy-deep transition-all duration-200 hover:-translate-y-0.5"
                  style={{ boxShadow: `0 0 28px ${REP_CYAN}45` }}
                >
                  Become a Rep Partner &rarr;
                </a>
                <a
                  href="#downloads"
                  className="font-sans font-semibold text-[0.92rem] px-7 py-3.5 rounded-md no-underline border border-border text-accent-text hover:border-accent-text transition-all duration-200"
                >
                  Download Materials
                </a>
              </div>
            </div>

            {/* Product pill strip */}
            <div className="flex gap-2.5 mt-14 flex-wrap">
              {productPills.map((pill, i) => (
                <span
                  key={i}
                  className="font-mono text-[0.78rem] tracking-[0.08em] px-3.5 py-1.5 rounded-full text-accent-text"
                  style={{
                    background: `${pill.accent}12`,
                    border: `1px solid ${pill.accent}30`,
                  }}
                >
                  {pill.label}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY AQS — 6 reasons
          ══════════════════════════════════════════ */}
      <section
        id="why"
        className="py-[88px] px-8 bg-surface-card border-y border-border"
      >
        <div className="max-w-[1100px] mx-auto">
          <AnimatedSection>
            <div
              className="font-mono text-[0.65rem] tracking-[0.18em] uppercase mb-2.5 text-accent-text"
            >
              Why Carry AQS
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(1.7rem,3.5vw,2.6rem)] text-text-strong mb-3.5">
              Six Reasons to Put Us on Your Line Card
            </h2>
            <p className="font-sans text-text-dim leading-[1.7] max-w-[540px] mb-14">
              The food and beverage automation market is consolidating around
              smarter QC and faster sanitation. AQS is positioned at the center
              of both.
            </p>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reasons.map((r, i) => (
              <StaggerItem key={i}>
                <ReasonCard {...r} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRODUCT LINEUP
          ══════════════════════════════════════════ */}
      <section id="products" className="py-[88px] px-8">
        <div className="max-w-[1100px] mx-auto">
          <AnimatedSection>
            <div
              className="font-mono text-[0.65rem] tracking-[0.18em] uppercase mb-2.5 text-accent-text"
            >
              What You&apos;re Selling
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(1.7rem,3.5vw,2.6rem)] text-text-strong mb-12">
              A Complete Automation Portfolio
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            {/* Product tabs */}
            <div className="flex gap-2 mb-7 flex-wrap">
              {products.map((prod, i) => (
                <button
                  key={i}
                  onClick={() => setActiveProduct(i)}
                  className="font-sans font-semibold text-[0.85rem] px-5 py-2.5 rounded-full border cursor-pointer transition-all duration-200"
                  style={{
                    background:
                      activeProduct === i ? prod.accent : "var(--surface-card)",
                    borderColor:
                      activeProduct === i ? prod.accent : "var(--border)",
                    color:
                      activeProduct === i ? "var(--brand-navy-deep)" : "var(--text-body)",
                    boxShadow:
                      activeProduct === i
                        ? `0 0 18px ${prod.accent}45`
                        : "none",
                  }}
                >
                  {prod.name}
                </button>
              ))}
            </div>

            {/* Active product card */}
            <div
              className="rounded-xl p-10 transition-colors duration-300"
              style={{
                background: "var(--surface-card)",
                border: `1px solid ${p.accent}28`,
                boxShadow: `0 4px 12px rgba(10,22,40,0.06), 0 0 48px ${p.accent}0c`,
              }}
            >
              <div className="flex items-center gap-3.5 mb-2 flex-wrap">
                <h3 className="font-sans text-[1.8rem] font-extrabold m-0 text-text-strong">
                  {p.name}
                </h3>
                <span
                  className="font-mono text-[0.65rem] uppercase tracking-[0.12em] px-2.5 py-0.5 rounded-full text-accent-text"
                  style={{
                    background: `${p.accent}18`,
                    border: `1px solid ${p.accent}40`,
                  }}
                >
                  {p.tag}
                </span>
              </div>
              <p className="font-sans text-[0.88rem] text-text-dim mb-7">
                {p.subtitle}
              </p>
              <ul className="m-0 p-0 list-none grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-3">
                {p.points.map((pt, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span className="shrink-0 leading-[1.55] text-[0.95rem] text-accent-text">
                      &rarr;
                    </span>
                    <span className="font-sans text-[0.875rem] text-text-body leading-[1.65]">
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 pt-6 border-t border-border-soft">
                <Link
                  href={p.href}
                  className="font-sans text-[0.85rem] font-semibold no-underline tracking-[0.04em] text-accent-text"
                >
                  View full product page &rarr;
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════ */}
      <section
        className="py-[88px] px-8 bg-surface-card border-y border-border"
      >
        <div className="max-w-[900px] mx-auto">
          <AnimatedSection>
            <div
              className="font-mono text-[0.65rem] tracking-[0.18em] uppercase mb-2.5 text-accent-text"
            >
              Getting Started
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(1.7rem,3.5vw,2.6rem)] text-text-strong mb-14">
              How the Partnership Works
            </h2>
          </AnimatedSection>
          {partnerSteps.map((s, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div
                className="flex gap-7 py-7"
                style={{
                  borderBottom:
                    i < partnerSteps.length - 1
                      ? "1px solid var(--border-soft)"
                      : "none",
                }}
              >
                <div className="font-mono text-[2rem] font-bold leading-none shrink-0 min-w-[48px] text-accent-text">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-sans text-[1rem] font-bold text-text-strong mb-2 mt-1">
                    {s.title}
                  </h3>
                  <p className="font-sans text-[0.875rem] text-text-body leading-[1.75] m-0">
                    {s.body}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          REP TOOLS
          ══════════════════════════════════════════ */}
      <section
        id="tools"
        className="py-[88px] px-8 relative overflow-hidden"
      >
        <div className="max-w-[1100px] mx-auto relative z-10">
          <AnimatedSection>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 mb-3"
              style={{
                background: `${REP_GOLD}12`,
                border: `1px solid ${REP_GOLD}30`,
              }}
            >
              <span className="font-mono text-[0.62rem] tracking-[0.18em] uppercase text-accent-text">
                Rep-Exclusive Access
              </span>
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(1.7rem,3.5vw,2.6rem)] text-text-strong mb-3.5">
              Tools Built to Help You Close
            </h2>
            <p className="font-sans text-text-dim leading-[1.7] max-w-[560px] mb-13">
              Authorized AQS reps get access to two web tools that turn customer
              conversations into proposals &mdash; without waiting on
              engineering or a quote desk.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {repTools.map((t, i) => (
              <StaggerItem key={i}>
                <ToolCard {...t} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimatedSection delay={0.15}>
            <div
              className="mt-6 px-6 py-4 rounded-lg flex items-center gap-3 flex-wrap"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="text-[1.1rem]">&#x1F512;</span>
              <p className="font-sans text-[0.84rem] text-text-dim leading-[1.65] m-0 flex-1">
                <strong className="text-text-body">
                  Rep credentials required.
                </strong>{" "}
                Both tools live in the AQS Rep Portal. You&apos;ll receive login
                credentials and a full tool walkthrough as part of your
                onboarding. Questions?{" "}
                <a
                  href="mailto:sales@automatedqs.com"
                  className="no-underline text-accent-text"
                >
                  sales@automatedqs.com
                </a>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DOWNLOADS
          ══════════════════════════════════════════ */}
      <section
        id="downloads"
        className="py-[88px] px-8 bg-surface-card border-y border-border"
      >
        <div className="max-w-[1100px] mx-auto">
          <AnimatedSection>
            <div
              className="font-mono text-[0.65rem] tracking-[0.18em] uppercase mb-2.5 text-accent-text"
            >
              Rep Resource Center
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(1.7rem,3.5vw,2.6rem)] text-text-strong mb-3.5">
              Everything You Need to Sell
            </h2>
            <p className="font-sans text-text-dim leading-[1.7] max-w-[500px] mb-12">
              Download sell sheets, technical brochures, and pricing references.
              Check back after product launches &mdash; materials update
              regularly.
            </p>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {downloads.map((d, i) => (
              <StaggerItem key={i}>
                <DownloadCard {...d} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTACT FORM
          ══════════════════════════════════════════ */}
      <RepContactForm />
    </>
  );
}
