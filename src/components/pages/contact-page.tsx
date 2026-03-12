"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { GlowOrb } from "@/components/ui/glow-orb";
import { MagneticButton } from "@/components/ui/magnetic-button";

const solutionOptions = [
  "VeriPak SCADA",
  "EvacuPak",
  "Leak Detection",
  "Sanitary Robotics",
  "Conveyors",
  "IntelliPak Feed Systems",
  "Other",
];

export function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    solutions: [] as string[],
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const toggleSolution = (s: string) => {
    setFormData((prev) => ({
      ...prev,
      solutions: prev.solutions.includes(s)
        ? prev.solutions.filter((x) => x !== s)
        : [...prev.solutions, s],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", company: "", message: "", solutions: [] });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClasses =
    "w-full bg-black/30 border border-border-default rounded-lg px-4 py-3 font-sans text-[0.9rem] text-white placeholder:text-text-dim focus:outline-none focus:border-accent-primary/50 focus:shadow-[0_0_16px_rgba(0,194,255,0.1)] transition-all";

  return (
    <section className="pt-[140px] pb-[100px] px-8 relative">
      <GlowOrb top="-100px" left="60%" size={500} />
      <div className="max-w-[700px] mx-auto relative z-10">
        <AnimatedSection>
          <SectionLabel>Get in Touch</SectionLabel>
          <SectionTitle>Start a Project Review</SectionTitle>
          <SectionDesc>
            Whether you need VeriPak, EvacuPak, IntelliPak, leak detection,
            sanitary robotics, or custom conveyors — tell us about your
            project and we&apos;ll architect a solution together.
          </SectionDesc>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          {status === "success" ? (
            <div
              className="rounded-2xl p-12 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,170,0.06), rgba(0,194,255,0.03))",
                border: "1px solid rgba(0,212,170,0.2)",
              }}
            >
              <div className="text-[2.5rem] mb-4">✓</div>
              <h3 className="font-sans text-[1.3rem] font-bold text-white mb-2">
                Message Sent
              </h3>
              <p className="font-sans text-[0.9rem] text-text-body">
                We&apos;ll be in touch within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[0.6rem] text-text-dim tracking-[0.1em] uppercase mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className={inputClasses}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[0.6rem] text-text-dim tracking-[0.1em] uppercase mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    className={inputClasses}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[0.6rem] text-text-dim tracking-[0.1em] uppercase mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    className={inputClasses}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[0.6rem] text-text-dim tracking-[0.1em] uppercase mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Company name"
                    className={inputClasses}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>

              {/* Solution Interest */}
              <div>
                <label className="block font-mono text-[0.6rem] text-text-dim tracking-[0.1em] uppercase mb-3">
                  Solution Interest
                </label>
                <div className="flex flex-wrap gap-2">
                  {solutionOptions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSolution(s)}
                      className="font-sans text-[0.78rem] px-3.5 py-2 rounded-lg border transition-all duration-200"
                      style={{
                        background: formData.solutions.includes(s)
                          ? "rgba(0,194,255,0.12)"
                          : "rgba(0,0,0,0.2)",
                        borderColor: formData.solutions.includes(s)
                          ? "rgba(0,194,255,0.4)"
                          : "rgba(0,0,0,0.25)",
                        color: formData.solutions.includes(s)
                          ? "#00c2ff"
                          : "rgba(255,255,255,0.55)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[0.6rem] text-text-dim tracking-[0.1em] uppercase mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us about your project, challenges, or questions..."
                  className={`${inputClasses} resize-none`}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {status === "error" && (
                <p className="font-sans text-[0.85rem] text-[#ff6666]">
                  Something went wrong. Please email us directly at{" "}
                  <a href="mailto:info@automatedqs.com" className="underline">
                    info@automatedqs.com
                  </a>
                </p>
              )}

              <MagneticButton
                className="w-full font-sans text-[0.92rem] font-bold text-bg-primary bg-gradient-to-br from-accent-primary to-[#0088ff] px-8 py-4 rounded-lg shadow-[0_0_28px_rgba(0,194,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {}}
              >
                {status === "sending" ? "Sending..." : "Send Message →"}
              </MagneticButton>
            </form>
          )}
        </AnimatedSection>

        {/* Contact info */}
        <AnimatedSection delay={0.2}>
          <div className="mt-12 pt-8 border-t border-border-default grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="font-mono text-[0.58rem] text-text-dim tracking-[0.12em] uppercase mb-1">
                Email
              </div>
              <a
                href="mailto:info@automatedqs.com"
                className="font-sans text-[0.88rem] text-accent-primary no-underline hover:underline"
              >
                info@automatedqs.com
              </a>
            </div>
            <div>
              <div className="font-mono text-[0.58rem] text-text-dim tracking-[0.12em] uppercase mb-1">
                Location
              </div>
              <div className="font-sans text-[0.88rem] text-text-body">
                Nampa, Idaho
              </div>
            </div>
            <div>
              <div className="font-mono text-[0.58rem] text-text-dim tracking-[0.12em] uppercase mb-1">
                LinkedIn
              </div>
              <a
                href="https://www.linkedin.com/company/automatedqs/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[0.88rem] text-accent-primary no-underline hover:underline"
              >
                @automatedqs
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
