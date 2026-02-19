import { useState, useEffect, useRef } from "react";

const FONT = "'DM Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const BG = "#1a1d2b";
const ACCENT = "#00c2ff";
const CARD = "rgba(0,0,0,0.28)";
const CARD_HOVER = "rgba(0,0,0,0.42)";
const BORDER = "rgba(0,0,0,0.25)";
const TEXT = "rgba(255,255,255,0.55)";
const TEXT_DIM = "rgba(255,255,255,0.35)";
const TEXT_BRIGHT = "#fff";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, isVisible];
}

function AnimatedSection({ children, delay = 0 }) {
  const [ref, isVisible] = useInView();
  return <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(40px)", transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` }}>{children}</div>;
}

function scrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }

function GlowOrb({ top, left, size = 400, color = "0,194,255" }) {
  return <div style={{ position: "absolute", top, left, width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle, rgba(${color},0.08) 0%, transparent 70%)`, pointerEvents: "none", filter: "blur(40px)" }} />;
}

function StatCounter({ value, suffix = "", label }) {
  const [ref, isVisible] = useInView();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0; const end = parseInt(value); const inc = end / 125;
    const timer = setInterval(() => { start += inc; if (start >= end) { setCount(end); clearInterval(timer); } else setCount(Math.floor(start)); }, 16);
    return () => clearInterval(timer);
  }, [isVisible, value]);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: MONO, fontSize: "3rem", fontWeight: 700, color: ACCENT, lineHeight: 1, textShadow: "0 0 30px rgba(0,194,255,0.3)" }}>{count}{suffix}</div>
      <div style={{ fontFamily: FONT, fontSize: "0.78rem", color: TEXT_DIM, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</div>
    </div>
  );
}

function SectionLabel({ children }) { return <div style={{ fontFamily: MONO, fontSize: "0.68rem", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>{children}</div>; }
function SectionTitle({ children, style = {} }) { return <h2 style={{ fontFamily: FONT, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: TEXT_BRIGHT, marginBottom: 16, lineHeight: 1.1, ...style }}>{children}</h2>; }
function SectionDesc({ children }) { return <p style={{ fontFamily: FONT, fontSize: "1.02rem", color: TEXT, maxWidth: 640, lineHeight: 1.7, marginBottom: 48 }}>{children}</p>; }

function SolutionCard({ icon, title, subtitle, features, accent, delay, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <AnimatedSection delay={delay}>
      <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ background: hovered ? CARD_HOVER : CARD, border: `1px solid ${hovered ? accent + "40" : BORDER}`, borderRadius: 14, padding: "32px 26px", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", transform: hovered ? "translateY(-4px)" : "translateY(0)", cursor: onClick ? "pointer" : "default", position: "relative", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>{icon}</div>
        <div style={{ fontFamily: FONT, fontSize: "1.2rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 3 }}>{title}</div>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>{subtitle}</div>
        <div style={{ flex: 1 }}>{features.map((f, i) => <div key={i} style={{ fontFamily: FONT, fontSize: "0.84rem", color: TEXT, lineHeight: 1.7, paddingLeft: 14, position: "relative", marginBottom: 2 }}><span style={{ position: "absolute", left: 0, color: accent, fontSize: "0.6rem", top: 5 }}>▸</span>{f}</div>)}</div>
        {onClick && <div style={{ fontFamily: FONT, fontSize: "0.78rem", color: accent, marginTop: 14, fontWeight: 600 }}>Learn more →</div>}
      </div>
    </AnimatedSection>
  );
}

function ComparisonTable() {
  const rows = [
    { f: "Product QC Checkpoint MD/Weight", sq: true, vp: true, vpi: true },
    { f: "SKU Selection / Setpoint Control", sq: false, vp: true, vpi: true },
    { f: "Operator Tracking & Permissions", sq: false, vp: true, vpi: true },
    { f: "Data Logging (Weight, Pass/Fail, SKU)", sq: false, vp: true, vpi: true },
    { f: "Automated Data Export & Reporting", sq: false, vp: true, vpi: true },
    { f: "Centralized Alarm / Status Reporting", sq: false, vp: true, vpi: true },
    { f: "Remote VPN Support", sq: false, vp: true, vpi: true },
    { f: "Audit-Ready QC Recordkeeping", sq: false, vp: true, vpi: true },
    { f: "Native Comms to OneMotion® Motors", sq: false, vp: false, vpi: true },
    { f: "Email/Text Based Notifications", sq: false, vp: false, vpi: "opt" },
    { f: "Visual Package / Product Inspection", sq: false, vp: false, vpi: true },
    { f: "Defect or Packaging Error Detection", sq: false, vp: false, vpi: true },
    { f: "Label / Code Date Verification", sq: false, vp: false, vpi: true },
    { f: "Feed Control / Batching / Merging", sq: false, vp: "opt", vpi: "opt" },
    { f: "Product Reject", sq: false, vp: false, vpi: "opt" },
    { f: "Product Lot or Line Traceability", sq: false, vp: true, vpi: true },
  ];
  const C = () => <span style={{ color: ACCENT, fontSize: "1rem" }}>✓</span>;
  const X = () => <span style={{ color: "rgba(255,255,255,0.1)" }}>✕</span>;
  const O = () => <span style={{ fontFamily: MONO, fontSize: "0.58rem", color: "#f5a623", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 4, padding: "2px 6px" }}>OPT</span>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT }}>
        <thead><tr>
          <th style={{ textAlign: "left", padding: "12px 16px", color: TEXT_DIM, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `1px solid ${BORDER}`, fontWeight: 500 }}>Capability</th>
          {["Status Quo", "VeriPak", "VeriPak + Inspection"].map((h, i) => <th key={h} style={{ textAlign: "center", padding: "12px 16px", color: i === 2 ? ACCENT : "rgba(255,255,255,0.6)", fontSize: "0.72rem", fontWeight: i === 2 ? 700 : 500, borderBottom: `1px solid ${BORDER}`, background: i === 2 ? "rgba(0,194,255,0.05)" : "transparent" }}>{h}</th>)}
        </tr></thead>
        <tbody>{rows.map((r, idx) => (
          <tr key={idx} style={{ background: idx % 2 ? "rgba(0,0,0,0.1)" : "transparent" }}>
            <td style={{ padding: "11px 16px", color: "rgba(255,255,255,0.6)", fontSize: "0.83rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>{r.f}</td>
            {[r.sq, r.vp, r.vpi].map((v, i) => <td key={i} style={{ textAlign: "center", padding: "11px 16px", borderBottom: "1px solid rgba(0,0,0,0.1)", background: i === 2 ? "rgba(0,194,255,0.05)" : "transparent" }}>{v === true ? <C /> : v === "opt" ? <O /> : <X />}</td>)}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}` }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", padding: "20px 0", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <span style={{ fontFamily: FONT, fontSize: "0.98rem", fontWeight: 600, color: open ? ACCENT : TEXT_BRIGHT, textAlign: "left", transition: "color 0.3s" }}>{question}</span>
        <span style={{ fontSize: "1.1rem", color: ACCENT, transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.3s", flexShrink: 0 }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <p style={{ fontFamily: FONT, fontSize: "0.9rem", color: TEXT, lineHeight: 1.7, paddingBottom: 20 }}>{answer}</p>
      </div>
    </div>
  );
}

// ============ NAVIGATION ============
function Navigation({ currentPage, setCurrentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const go = (p) => { setCurrentPage(p); setDropdown(null); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const solutions = [
    { label: "VeriPak SCADA", page: "inspection" },
    { label: "EvacuPak Recovery", page: "evacupak" },
    { label: "Leak Detection", page: "leakdetection" },
    { label: "Sanitary Robotics", page: "palletizing" },
    { label: "Conveyor Systems", page: "conveyors" },
  ];
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: scrolled ? "9px 0" : "14px 0", background: scrolled ? "rgba(26,29,43,0.95)" : "rgba(26,29,43,0.5)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${scrolled ? "rgba(0,194,255,0.08)" : "transparent"}`, transition: "all 0.4s" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 34, height: 34, borderRadius: 7, background: "linear-gradient(135deg, #00c2ff, #0066ff)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: "0.75rem", color: "#fff", boxShadow: "0 0 16px rgba(0,194,255,0.3)" }}>AQS</div>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>Automated Quality Solutions</div>
            <div style={{ fontFamily: MONO, fontSize: "0.52rem", color: "rgba(0,194,255,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Boise, Idaho</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }} className="nav-desktop">
          <button onClick={() => go("home")} style={{ fontFamily: FONT, fontSize: "0.84rem", color: currentPage === "home" ? ACCENT : "rgba(255,255,255,0.55)", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Home</button>
          <div style={{ position: "relative" }} onMouseEnter={() => setDropdown("sol")} onMouseLeave={() => setDropdown(null)}>
            <button onClick={() => go("solutions")} style={{ fontFamily: FONT, fontSize: "0.84rem", color: ["solutions","inspection","evacupak","leakdetection","palletizing","conveyors"].includes(currentPage) ? ACCENT : "rgba(255,255,255,0.55)", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Solutions ▾</button>
            {dropdown === "sol" && <div style={{ position: "absolute", top: "100%", left: -10, background: "rgba(18,20,32,0.97)", backdropFilter: "blur(20px)", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "6px 0", minWidth: 210, boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
              {solutions.map(s => <button key={s.page} onClick={() => go(s.page)} style={{ display: "block", width: "100%", textAlign: "left", fontFamily: FONT, fontSize: "0.84rem", color: currentPage === s.page ? ACCENT : "rgba(255,255,255,0.55)", background: "none", border: "none", cursor: "pointer", padding: "9px 18px" }}>{s.label}</button>)}
            </div>}
          </div>
          <button onClick={() => go("about")} style={{ fontFamily: FONT, fontSize: "0.84rem", color: currentPage === "about" ? ACCENT : "rgba(255,255,255,0.55)", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>About</button>
          <button onClick={() => scrollTo("contact")} style={{ fontFamily: FONT, fontSize: "0.84rem", fontWeight: 600, color: BG, background: "linear-gradient(135deg, #00c2ff, #0088ff)", padding: "9px 20px", borderRadius: 6, border: "none", cursor: "pointer", boxShadow: "0 0 16px rgba(0,194,255,0.2)" }}>Get a Quote</button>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .nav-desktop { display: none !important; } }`}</style>
    </nav>
  );
}

// ============ HOME PAGE ============
function HomePage({ setCurrentPage }) {
  return <>
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 32px 80px", overflow: "hidden" }}>
      <GlowOrb top="-200px" left="-100px" size={600} /><GlowOrb top="200px" left="60%" size={500} color="0,102,255" />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,194,255,0.006) 2px, rgba(0,194,255,0.006) 4px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <AnimatedSection>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,194,255,0.08)", border: "1px solid rgba(0,194,255,0.15)", borderRadius: 100, padding: "5px 14px", marginBottom: 22 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 8px ${ACCENT}`, animation: "pulse 2s infinite" }} />
            <span style={{ fontFamily: MONO, fontSize: "0.62rem", color: ACCENT, letterSpacing: "0.1em", textTransform: "uppercase" }}>Now Offering Sanitary Robotic Systems</span>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <h1 style={{ fontFamily: FONT, fontSize: "clamp(2.5rem, 5.5vw, 4.6rem)", fontWeight: 800, lineHeight: 1.05, color: "#fff", maxWidth: 800, marginBottom: 22 }}>
            Precision Quality<br />Control for{" "}
            <span style={{ background: "linear-gradient(135deg, #00c2ff 0%, #0066ff 50%, #00c2ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% 200%", animation: "shimmer 3s ease infinite" }}>Modern Food</span>
            <br />Production
          </h1>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <p style={{ fontFamily: FONT, fontSize: "1.12rem", color: TEXT, lineHeight: 1.7, maxWidth: 620, marginBottom: 36 }}>AQS engineers standalone SCADA platforms, liquid recovery systems, leak detection technology, sanitary conveyors, and washdown robotics that protect your brand, ensure compliance, and drive measurable ROI.</p>
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button onClick={() => { setCurrentPage("solutions"); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ fontFamily: FONT, fontSize: "0.92rem", fontWeight: 700, color: BG, background: "linear-gradient(135deg, #00c2ff, #0088ff)", padding: "14px 32px", borderRadius: 8, border: "none", cursor: "pointer", boxShadow: "0 0 28px rgba(0,194,255,0.25)" }}>Explore Solutions →</button>
            <button onClick={() => scrollTo("contact")} style={{ fontFamily: FONT, fontSize: "0.92rem", fontWeight: 600, color: ACCENT, background: "transparent", border: "1px solid rgba(0,194,255,0.3)", padding: "14px 32px", borderRadius: 8, cursor: "pointer" }}>Request a Quote</button>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.5}>
          <div style={{ marginTop: 72, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 28, padding: "36px 0", borderTop: `1px solid ${BORDER}` }}>
            <StatCounter value="100" suffix="%" label="Package Inspection" />
            <StatCounter value="97" suffix="%" label="Liquid Recovery Rate" />
            <StatCounter value="50" suffix="+" label="Years Combined Exp." />
            <StatCounter value="0" suffix="" label="Costly Recalls" />
          </div>
        </AnimatedSection>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </section>

    {/* Partners */}
    <section style={{ padding: "32px", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 36, flexWrap: "wrap" }}>
        <span style={{ fontFamily: MONO, fontSize: "0.58rem", color: TEXT_DIM, letterSpacing: "0.14em", textTransform: "uppercase" }}>Trusted Partners</span>
        {["Allen-Bradley","Rockwell Automation","Keyence","OneMotion®","Intralox","PulseRoller","KUKA"].map(p => <span key={p} style={{ fontFamily: FONT, fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.16)", whiteSpace: "nowrap" }}>{p}</span>)}
      </div>
    </section>

    {/* Solutions Overview */}
    <section style={{ padding: "110px 32px", position: "relative" }}>
      <GlowOrb top="0" left="80%" size={400} color="0,102,255" />
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <AnimatedSection><SectionLabel>Our Platform</SectionLabel><SectionTitle>Integrated Solutions for Every Packaging Line</SectionTitle><SectionDesc>From quality control and liquid recovery to robotic palletizing and sanitary conveyance — AQS provides modular building blocks to transform your production.</SectionDesc></AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          <SolutionCard icon="◈" title="VeriPak" subtitle="Standalone SCADA Platform" accent="#00c2ff" delay={0.1} onClick={() => { setCurrentPage("inspection"); window.scrollTo({top:0,behavior:"smooth"}); }} features={["Real-time dashboards & live alerts","Standalone SCADA — no middleware","Immediate operator feedback loop","Auto-reject & line stop triggers","Allen-Bradley CompactLogix + Optix"]} />
          <SolutionCard icon="◉" title="EvacuPak" subtitle="Liquid Recovery System" accent="#00d4aa" delay={0.15} onClick={() => { setCurrentPage("evacupak"); window.scrollTo({top:0,behavior:"smooth"}); }} features={["Up to 97% product recovery","3A certified, CIP capable","Patented hygienic lance design","Full HACCP traceability","Never exposed to atmosphere"]} />
          <SolutionCard icon="⊘" title="Leak Detection" subtitle="Dual-Pull Suction System" accent="#ff6666" delay={0.17} onClick={() => { setCurrentPage("leakdetection"); window.scrollTo({top:0,behavior:"smooth"}); }} features={["Detects pinholes vision can't see","Mechanical force & deflection delta","Self-referencing dual-pull method","Binary pass/fail — no ML tuning","VeriPak data integration"]} />
          <SolutionCard icon="⬡" title="Sanitary Robotics" subtitle="Washdown Robotic Systems" accent="#4d9fff" delay={0.2} onClick={() => { setCurrentPage("palletizing"); window.scrollTo({top:0,behavior:"smooth"}); }} features={["USDA / FDA washdown rated","Palletizing, case packing, pick-and-place","316L stainless steel construction","Rockwell-native programming","Full end-of-line integration"]} />
          <SolutionCard icon="═" title="Conveyors" subtitle="Sanitary Material Handling" accent="#66b3ff" delay={0.25} onClick={() => { setCurrentPage("conveyors"); window.scrollTo({top:0,behavior:"smooth"}); }} features={["Freezer, accumulation, & custom","Food-grade belt & chain options","Washdown-rated construction","Quick-disconnect modular design","50+ years engineering expertise"]} />
        </div>
      </div>
    </section>

    {/* Why AQS */}
    <section style={{ padding: "90px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <AnimatedSection><div style={{ textAlign: "center", marginBottom: 50 }}><SectionLabel>Why Choose AQS</SectionLabel><SectionTitle style={{ textAlign: "center" }}>Built on Integrity. Driven by Results.</SectionTitle></div></AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
          {[
            { icon: "🛡", title: "Avoid Costly Recalls", desc: "Ensure traceability — protect your brand with 100% package inspection and audit-ready records." },
            { icon: "📊", title: "Elevate Product Quality", desc: "Guarantee consistency — automate and record QC data across every line, shift, and SKU." },
            { icon: "💰", title: "Maximize Profitability", desc: "Decrease risk — cut costs and recover up to 97% of fluid product from packaging waste." },
            { icon: "♻️", title: "Improve Sustainability", desc: "Waste less — maximize yields while improving safety. EvacuPak turns waste into recovered product." },
          ].map((v, i) => <AnimatedSection key={v.title} delay={i * 0.07}><div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "28px 22px", height: "100%" }}><div style={{ fontSize: "1.6rem", marginBottom: 12 }}>{v.icon}</div><div style={{ fontFamily: FONT, fontSize: "1.05rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 6 }}>{v.title}</div><div style={{ fontFamily: FONT, fontSize: "0.85rem", color: TEXT, lineHeight: 1.6 }}>{v.desc}</div></div></AnimatedSection>)}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section style={{ padding: "90px 32px", borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <AnimatedSection><div style={{ textAlign: "center", marginBottom: 44 }}><SectionLabel>Client Outcomes</SectionLabel><SectionTitle style={{ textAlign: "center" }}>Trusted by Production Leaders</SectionTitle></div></AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 16 }}>
          {[
            { q: "The AQS inspection system is exactly what we needed to assure we never had another costly recall from lids not matching cartons again!", n: "Tim", t: "Ice Cream Production Manager" },
            { q: "The VeriPak system is well thought out and well executed. No longer worrying about quality issues on our lidding system will really improve peace of mind. The team was great to work with.", n: "Chad", t: "Production Manager" },
            { q: "Liquid recovery is a game-changing innovation that lowers costs and increases system efficiencies dramatically. All leading to the increase in profit margins.", n: "Greg", t: "Chief Financial Officer" },
          ].map((t, i) => <AnimatedSection key={i} delay={i * 0.08}><div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "28px 24px", height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: MONO, fontSize: "1.8rem", color: "rgba(0,194,255,0.18)", lineHeight: 1, marginBottom: 12 }}>"</div>
            <p style={{ fontFamily: FONT, fontSize: "0.92rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontStyle: "italic", flex: 1 }}>{t.q}</p>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}><div style={{ fontFamily: FONT, fontSize: "0.88rem", fontWeight: 600, color: TEXT_BRIGHT }}>{t.n}</div><div style={{ fontFamily: FONT, fontSize: "0.72rem", color: TEXT_DIM }}>{t.t}</div></div>
          </div></AnimatedSection>)}
        </div>
      </div>
    </section>

    {/* Industries */}
    <section style={{ padding: "90px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <AnimatedSection><div style={{ textAlign: "center", marginBottom: 44 }}><SectionLabel>Industries We Serve</SectionLabel><SectionTitle style={{ textAlign: "center" }}>Built for the Toughest Environments</SectionTitle></div></AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {[{ i: "🥩", n: "Protein & Meat" },{ i: "🧀", n: "Dairy & Ice Cream" },{ i: "🍞", n: "Bakery & Snacks" },{ i: "🥤", n: "Beverages" },{ i: "🫛", n: "Fresh Produce" },{ i: "💊", n: "Nutraceuticals" }].map((ind, idx) => <AnimatedSection key={ind.n} delay={idx * 0.05}><div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "24px 16px", textAlign: "center" }}><div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{ind.i}</div><div style={{ fontFamily: FONT, fontSize: "0.88rem", fontWeight: 600, color: TEXT_BRIGHT }}>{ind.n}</div></div></AnimatedSection>)}
        </div>
      </div>
    </section>
  </>;
}

// ============ SOLUTIONS HUB ============
function SolutionsPage({ setCurrentPage }) {
  return <section style={{ padding: "140px 32px 100px", position: "relative" }}><GlowOrb top="-100px" left="50%" size={500} /><div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
    <AnimatedSection><SectionLabel>What We Can Do for You</SectionLabel><SectionTitle>Our Solutions</SectionTitle><SectionDesc>We specialize in innovative production solutions that help food facilities increase production while reducing risk. Every system is engineered for washdown, sanitary, and cold environments.</SectionDesc></AnimatedSection>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 16 }}>
      <SolutionCard icon="◈" title="VeriPak SCADA" subtitle="Standalone Quality Control Platform" accent="#00c2ff" delay={0.1} onClick={() => { setCurrentPage("inspection"); window.scrollTo({top:0,behavior:"smooth"}); }} features={["Real-time SCADA — not a data logger","Live dashboards, instant alerts, auto-reject","Sub-second operator feedback loop","No middleware, no IT project — fully standalone","Allen-Bradley CompactLogix + Optix HMI"]} />
      <SolutionCard icon="◉" title="EvacuPak Recovery" subtitle="Liquid Recovery System" accent="#00d4aa" delay={0.15} onClick={() => { setCurrentPage("evacupak"); window.scrollTo({top:0,behavior:"smooth"}); }} features={["Recover fluid products safely & hygienically","Patented lances — 3A certified, CIP capable","Up to 97% product recovery from packaging","Seamless rework/blend process integration","Full HACCP traceability & data recording"]} />
      <SolutionCard icon="⊘" title="Leak Detection" subtitle="Dual-Pull Suction System" accent="#ff6666" delay={0.17} onClick={() => { setCurrentPage("leakdetection"); window.scrollTo({top:0,behavior:"smooth"}); }} features={["Vision-based detection doesn't work — we proved it","Physical mechanical suction-pull approach","Measures force & deflection delta between pulls","Catches pinholes, grease-in-seal, board cuts","Integrated with VeriPak data platform"]} />
      <SolutionCard icon="⬡" title="Sanitary Robotics" subtitle="Washdown Robotic Systems" accent="#4d9fff" delay={0.2} onClick={() => { setCurrentPage("palletizing"); window.scrollTo({top:0,behavior:"smooth"}); }} features={["Palletizing, case packing, pick-and-place","Sanitary, washdown, and cold environments","KUKA, Fanuc, Rockwell-native controls","Full end-of-line integration","IP69K / 316L stainless construction"]} />
      <SolutionCard icon="═" title="Conveyor Systems" subtitle="Sanitary Material Handling" accent="#66b3ff" delay={0.25} onClick={() => { setCurrentPage("conveyors"); window.scrollTo({top:0,behavior:"smooth"}); }} features={["Freezer, accumulation, & custom configs","Food-grade modular belt & chain","Washdown-rated sanitary construction","50+ years combined engineering experience","Online quoting tool available"]} />
    </div>
  </div></section>;
}

// ============ INSPECTION (VERIPAK) ============
function InspectionPage() {
  return <section style={{ padding: "140px 32px 100px", position: "relative" }}><GlowOrb top="-100px" left="-5%" size={500} /><div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
    <AnimatedSection>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,194,255,0.08)", border: "1px solid rgba(0,194,255,0.15)", borderRadius: 100, padding: "5px 14px", marginBottom: 18 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
        <span style={{ fontFamily: MONO, fontSize: "0.62rem", color: ACCENT, letterSpacing: "0.1em", textTransform: "uppercase" }}>Standalone SCADA Platform</span>
      </div>
      <SectionLabel>VeriPak Inspection Systems</SectionLabel>
      <SectionTitle>Your Packaging Line's<br/>Command Center</SectionTitle>
      <SectionDesc>VeriPak is a standalone SCADA system purpose-built for packaging quality control. It doesn't just log data after the fact — it delivers real-time visibility, immediate operator feedback, and automated intervention the moment something goes wrong. Every device on your line becomes a live node in a connected, auditable control network.</SectionDesc>
    </AnimatedSection>

    {/* Real-Time Data Callout */}
    <AnimatedSection delay={0.08}>
      <div style={{ background: "linear-gradient(135deg, rgba(0,194,255,0.06), rgba(0,102,255,0.03))", border: "1px solid rgba(0,194,255,0.12)", borderRadius: 16, padding: "36px 32px", marginBottom: 50 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }} className="scada-grid">
          <div>
            <div style={{ fontFamily: MONO, fontSize: "0.62rem", color: ACCENT, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Real-Time SCADA — Not a Data Logger</div>
            <h3 style={{ fontFamily: FONT, fontSize: "1.4rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 12, lineHeight: 1.2 }}>See It. Know It. Fix It. Now.</h3>
            <p style={{ fontFamily: FONT, fontSize: "0.9rem", color: TEXT, lineHeight: 1.7, marginBottom: 14 }}>
              Most "quality systems" collect data you review tomorrow morning. VeriPak operates as a true SCADA — supervisory control and data acquisition — delivering live dashboards, instant alerts, and automated responses in real time. When a reject threshold is hit, the line knows immediately. When an operator logs a SKU change, every connected device updates simultaneously.
            </p>
            <p style={{ fontFamily: FONT, fontSize: "0.9rem", color: TEXT, lineHeight: 1.7 }}>
              No middleware. No third-party software. No IT integration project. VeriPak is a self-contained control platform that drops onto your line and starts supervising from day one.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { v: "< 1s", l: "Alert latency from defect to operator notification", color: ACCENT },
              { v: "Live", l: "Dashboards — pass/fail, reject rates, device status", color: "#00d4aa" },
              { v: "Auto", l: "Line stop when reject accumulation exceeds threshold", color: "#f5a623" },
              { v: "0", l: "Third-party software required — fully standalone", color: ACCENT },
            ].map((s, i) => <div key={i} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "16px 12px", textAlign: "center" }}>
              <div style={{ fontFamily: MONO, fontSize: "1.3rem", fontWeight: 700, color: s.color }}>{s.v}</div>
              <div style={{ fontFamily: FONT, fontSize: "0.62rem", color: TEXT_DIM, marginTop: 4, lineHeight: 1.4 }}>{s.l}</div>
            </div>)}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.scada-grid{grid-template-columns:1fr!important}}`}</style>
    </AnimatedSection>

    {/* Immediate Feedback Loop */}
    <AnimatedSection delay={0.12}>
      <div style={{ marginBottom: 50 }}>
        <div style={{ fontFamily: MONO, fontSize: "0.62rem", color: ACCENT, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Immediate Feedback Loop</div>
        <h3 style={{ fontFamily: FONT, fontSize: "1.3rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 24 }}>From Detection to Decision in Real Time</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }} className="feedback-grid">
          {[
            { step: "01", title: "Detect", desc: "Connected devices (checkweighers, vision, metal detectors) feed live inspection data to VeriPak continuously.", color: ACCENT },
            { step: "02", title: "Decide", desc: "CompactLogix PLC evaluates pass/fail criteria in real time against SKU-specific setpoints. No batch processing.", color: ACCENT },
            { step: "03", title: "Act", desc: "Automatic reject, line stop, or operator alert fires instantly. Configurable escalation — from HMI popup to email/text.", color: "#f5a623" },
            { step: "04", title: "Record", desc: "Every event logged with timestamp, operator, SKU, device ID, and result. Audit-ready before the shift ends.", color: "#00d4aa" },
          ].map((s, i) => <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px 18px", position: "relative" }}>
            <div style={{ fontFamily: MONO, fontSize: "1.8rem", fontWeight: 800, color: s.color, opacity: 0.2, marginBottom: 4 }}>{s.step}</div>
            <div style={{ fontFamily: FONT, fontSize: "0.95rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 6 }}>{s.title}</div>
            <div style={{ fontFamily: FONT, fontSize: "0.82rem", color: TEXT, lineHeight: 1.55 }}>{s.desc}</div>
            {i < 3 && <div style={{ position: "absolute", right: -10, top: "50%", fontFamily: MONO, fontSize: "0.9rem", color: "rgba(0,194,255,0.2)", zIndex: 2 }} className="arrow-hide">→</div>}
          </div>)}
        </div>
        <style>{`@media(max-width:900px){.feedback-grid{grid-template-columns:1fr 1fr!important}.arrow-hide{display:none!important}}@media(max-width:600px){.feedback-grid{grid-template-columns:1fr!important}}`}</style>
      </div>
    </AnimatedSection>

    {/* Core Platform Specs */}
    <AnimatedSection delay={0.15}>
      <div style={{ marginBottom: 50 }}>
        <div style={{ fontFamily: MONO, fontSize: "0.62rem", color: ACCENT, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Platform Specifications</div>
        <h3 style={{ fontFamily: FONT, fontSize: "1.3rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 20 }}>What's Inside the VeriPak SCADA</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 2, borderRadius: 14, overflow: "hidden", border: `1px solid ${BORDER}` }}>
      {[
        { l: "Controls Enclosure", d: "NEMA 4X stainless-steel, sloped top, fully washdown-rated with sanitary NGI feet and Meltric switch-rated power receptacle." },
        { l: "PLC / SCADA Controller", d: "Allen-Bradley CompactLogix processor — real-time scan cycle, expandable I/O for additional devices or reject systems. This is your line's brain." },
        { l: "HMI / Live Dashboard", d: "Allen-Bradley Optix touchscreen with live production dashboards. Connects to user networks without bridging the machine network firewall." },
        { l: "Real-Time Data Engine", d: "Every product recorded live: timestamp, SKU, operator ID, inspection result, weight, pass/fail, code date, lot number. No post-shift processing required." },
        { l: "OneMotion® Integration", d: "Native AOP for permanent magnet motors — live amperage monitoring, operating hours, energy cost tracking, and spike detection alarms in real time." },
        { l: "Instant Notifications", d: "Sub-second email and text alerts for errors, reject accumulation, amperage spikes, and configurable thresholds — sent to the right person immediately." },
        { l: "Operator Control", d: "Multi-level permissions for Operators, Maintenance, QC. Optional RFID/HID badge scanner. Every login, SKU change, and override is timestamped." },
        { l: "Device Connectivity", d: "Ethernet/IP, Modbus-TCP, digital I/O, optional I/O Link. Connects checkweighers, metal detectors, X-ray, printers — all feeding one live SCADA view." },
      ].map((item, i) => <div key={i} style={{ background: CARD, padding: "24px 20px" }}><div style={{ fontFamily: MONO, fontSize: "0.62rem", color: ACCENT, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>{item.l}</div><div style={{ fontFamily: FONT, fontSize: "0.84rem", color: TEXT, lineHeight: 1.6 }}>{item.d}</div></div>)}
    </div></div></AnimatedSection>

    {/* Comparison Table */}
    <AnimatedSection delay={0.2}><div style={{ marginTop: 20 }}><h3 style={{ fontFamily: FONT, fontSize: "1.4rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 24, textAlign: "center" }}>Feature Comparison</h3><div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}><ComparisonTable /></div></div></AnimatedSection>
    <AnimatedSection delay={0.25}><div style={{ marginTop: 44, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
      <span style={{ fontFamily: MONO, fontSize: "0.58rem", color: TEXT_DIM, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", marginRight: 6 }}>Compatible:</span>
      {["OneMotion® PM Motors","Checkweighers","Code Date Printers","Metal Detectors","X-Ray Systems","Ethernet/IP Devices","I/O Link Devices"].map(d => <span key={d} style={{ fontFamily: FONT, fontSize: "0.72rem", color: TEXT, border: `1px solid ${BORDER}`, padding: "4px 10px", borderRadius: 100 }}>{d}</span>)}
    </div></AnimatedSection>
  </div></section>;
}

// ============ EVACUPAK ============
function EvacuPakPage() {
  return <section style={{ padding: "140px 32px 100px", position: "relative" }}><GlowOrb top="-100px" left="70%" size={500} color="0,212,170" /><div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
    <AnimatedSection><SectionLabel>EvacuPak Liquid Recovery</SectionLabel><SectionTitle>Redefining Efficiency in Fluid Recovery</SectionTitle><SectionDesc>Our patented design achieves up to 97% product recovery from packaging. Hygienic lances pierce cartons and extract product directly into 3A process piping — never exposed to atmosphere, never compromised. Re-process, don't re-work.</SectionDesc></AnimatedSection>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 16 }}>
      {[
        { icon: "🔬", title: "3A Certified & CIP Capable", desc: "Hygienic lances integrate into rework or blend processes. Clean-in-place capability ensures rapid sanitation between runs." },
        { icon: "📋", title: "Full HACCP Traceability", desc: "Product lot, case type, operator login tracked continuously. Optional vision sensors for barcode or lot number scanning." },
        { icon: "🔒", title: "Never Exposed to Atmosphere", desc: "Lances pierce the carton and extract directly into 3A process piping. Product never contacts atmosphere — always in spec." },
        { icon: "💰", title: "97% Product Recovery", desc: "Transform waste into profit. Keep products in process with complete data recording for quality standards compliance." },
        { icon: "🏭", title: "Durable Hygienic Design", desc: "Full stainless steel for dairy, beverage, and liquid food processing environments. Built for years of reliable operation." },
        { icon: "📊", title: "Integrated Data Recording", desc: "Every recovery operation logged with traceability data. Export reports for compliance, auditing, and operational analysis." },
      ].map((item, i) => <AnimatedSection key={i} delay={i * 0.07}><div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "28px 22px", height: "100%" }}><div style={{ fontSize: "1.5rem", marginBottom: 10 }}>{item.icon}</div><div style={{ fontFamily: FONT, fontSize: "1.02rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 6 }}>{item.title}</div><div style={{ fontFamily: FONT, fontSize: "0.85rem", color: TEXT, lineHeight: 1.6 }}>{item.desc}</div></div></AnimatedSection>)}
    </div>
  </div></section>;
}

// ============ LEAK DETECTION ============
function LeakDetectionPage() {
  const leakTypes = [
    { name: "Film Pinholes", desc: "Micro-punctures from burrs on rollers, exit chutes, or lazy susans. Often invisible to camera systems — too small to resolve at line speed." },
    { name: "Board Cuts", desc: "L-board edges puncturing forming film from inside the package. Occurs along board edges or flaps when boards aren't lying flat." },
    { name: "Board in Seal", desc: "L-board material encroaching into seal area, creating incomplete seals. Caused by misalignment, timing issues, or infeed plate angles." },
    { name: "Fat / Meat / Scrap in Seal", desc: "Product contamination in the seal zone — from bacon length variance, cold meat creating scrap, or wafer slices from the slicer." },
    { name: "Grease in Seal", desc: "Bacon grease trapped in seal from earlier contamination events. Foreign material on the die seal area creates cascading failures across multiple packages." },
    { name: "Initial & Final Seal Leaks", desc: "Compromised seals from foreign material on seal bars, incorrect heat settings, or worn bushings creating insufficient overlap between initial and final seals." },
    { name: "Film Wrinkle / Misalignment", desc: "Insufficient film tension or misalignment creating wrinkles that prevent proper seal formation. Partial rolls without brake pressure are common culprits." },
    { name: "Low Vacuum", desc: "Trapped atmosphere from insufficient vacuum pressure, leaking hoses, or incorrect seal timing. Package lacks vacuum-tight appearance." },
  ];

  return <section style={{ padding: "140px 32px 100px", position: "relative" }}>
    <GlowOrb top="-100px" left="60%" size={500} color="255,60,60" />
    <GlowOrb top="400px" left="-10%" size={400} color="0,194,255" />
    <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>

      {/* Hero */}
      <AnimatedSection>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.18)", borderRadius: 100, padding: "5px 14px", marginBottom: 18 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5050", boxShadow: "0 0 8px #ff5050", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: MONO, fontSize: "0.62rem", color: "#ff8080", letterSpacing: "0.1em", textTransform: "uppercase" }}>R&D — Patent Pending Technology</span>
        </div>
        <SectionLabel>Leak Detection Systems</SectionLabel>
        <SectionTitle>Vision Can't Detect What<br/>Physics Can Measure</SectionTitle>
        <SectionDesc>After years of implementing and evaluating every major vision-based leak detection approach on the market, we've concluded none of them reliably detect the defects that cause real recalls. So we're building something that actually works — a physical, mechanical detection system grounded in measurable force and deflection.</SectionDesc>
      </AnimatedSection>

      {/* The Problem with Vision */}
      <AnimatedSection delay={0.1}>
        <div style={{ background: "linear-gradient(135deg, rgba(255,60,60,0.06), rgba(255,60,60,0.02))", border: "1px solid rgba(255,80,80,0.12)", borderRadius: 16, padding: "40px 36px", marginBottom: 60 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="vision-grid">
            <div>
              <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: "#ff8080", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>The Industry Problem</div>
              <h3 style={{ fontFamily: FONT, fontSize: "1.5rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 14, lineHeight: 1.2 }}>Why Vision-Based Leak Detection Fails</h3>
              <p style={{ fontFamily: FONT, fontSize: "0.9rem", color: TEXT, lineHeight: 1.7, marginBottom: 16 }}>
                Camera systems inspect what a package <em style={{ color: "rgba(255,255,255,0.7)" }}>looks like</em> — not whether it's actually sealed. A pinhole smaller than a pixel, grease trapped inside a seal zone, or a micro-puncture from an L-board edge are physically invisible to optical inspection at production line speeds.
              </p>
              <p style={{ fontFamily: FONT, fontSize: "0.9rem", color: TEXT, lineHeight: 1.7 }}>
                Vision can verify labels, code dates, and surface cosmetics. But when a package leaves the sealer looking perfect and arrives at distribution leaking — that's a physics problem, not an optics problem.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { v: "< 1px", l: "Typical pinhole size vs camera resolution", bad: true },
                { v: "0%", l: "Vision detection rate for grease-in-seal", bad: true },
                { v: "300+", l: "Packages/min at production speed", bad: false },
                { v: "8+", l: "Distinct leak failure modes", bad: false },
              ].map((s, i) => <div key={i} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "16px 12px", textAlign: "center" }}>
                <div style={{ fontFamily: MONO, fontSize: "1.2rem", fontWeight: 700, color: s.bad ? "#ff6666" : ACCENT }}>{s.v}</div>
                <div style={{ fontFamily: FONT, fontSize: "0.62rem", color: TEXT_DIM, marginTop: 4, lineHeight: 1.4 }}>{s.l}</div>
              </div>)}
            </div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.vision-grid{grid-template-columns:1fr!important}}`}</style>
      </AnimatedSection>

      {/* Our Approach */}
      <AnimatedSection delay={0.15}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontFamily: MONO, fontSize: "0.65rem", color: ACCENT, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Our Approach</div>
          <h3 style={{ fontFamily: FONT, fontSize: "1.5rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 14 }}>Dual-Pull Differential Suction Detection</h3>
          <p style={{ fontFamily: FONT, fontSize: "0.92rem", color: TEXT, lineHeight: 1.7, maxWidth: 700, marginBottom: 32 }}>
            Instead of looking at a package, we test it. Our system applies calibrated suction to the package surface in two consecutive pulls and measures the force response and surface deflection on each pull. A sealed package produces consistent, repeatable readings. A leaking package shows measurable delta between pulls as atmosphere enters the compromised seal.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="pull-grid">
            {[
              { step: "01", title: "First Pull", desc: "Calibrated suction cup engages the package surface. System measures the force required to achieve target deflection and records the package's resistance profile.", color: ACCENT },
              { step: "02", title: "Second Pull", desc: "Identical suction applied immediately after. A sealed package reproduces the same force/deflection curve. A leaking package — even with a pinhole — shows measurable atmosphere ingress.", color: ACCENT },
              { step: "03", title: "Delta Analysis", desc: "The force differential and deflection delta between pulls are compared against known-good baselines. Any deviation beyond threshold triggers reject. Binary pass/fail — no interpretation needed.", color: "#00d4aa" },
            ].map((s, i) => <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "28px 22px" }}>
              <div style={{ fontFamily: MONO, fontSize: "2rem", fontWeight: 800, color: s.color, opacity: 0.25, marginBottom: 6 }}>{s.step}</div>
              <div style={{ fontFamily: FONT, fontSize: "1.05rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontFamily: FONT, fontSize: "0.85rem", color: TEXT, lineHeight: 1.6 }}>{s.desc}</div>
            </div>)}
          </div>
          <style>{`@media(max-width:800px){.pull-grid{grid-template-columns:1fr!important}}`}</style>
        </div>
      </AnimatedSection>

      {/* Why This Works */}
      <AnimatedSection delay={0.2}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 70 }} className="why-grid">
          <div style={{ background: "linear-gradient(135deg, rgba(0,194,255,0.05), rgba(0,102,255,0.03))", border: "1px solid rgba(0,194,255,0.1)", borderRadius: 16, padding: 36 }}>
            <div style={{ fontFamily: MONO, fontSize: "0.62rem", color: ACCENT, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Why Differential Measurement Works</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { t: "Physics, Not Pixels", d: "Detects actual atmosphere ingress through any breach — pinholes, grease in seal, board cuts, micro-tears — regardless of visual appearance." },
                { t: "Self-Referencing", d: "Each package is its own baseline. The first pull establishes the reference. No calibration drift, no ambient light issues, no camera focus problems." },
                { t: "Binary Output", d: "Force delta exceeds threshold → reject. No ML model interpretation, no confidence scores, no false-positive tuning nightmares." },
                { t: "Line-Speed Compatible", d: "Mechanical actuation at production speed. No image processing latency or frame-rate limitations." },
              ].map((item, i) => <div key={i} style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT, marginTop: 7, flexShrink: 0, boxShadow: "0 0 8px rgba(0,194,255,0.4)" }} />
                <div><div style={{ fontFamily: FONT, fontSize: "0.9rem", fontWeight: 600, color: TEXT_BRIGHT }}>{item.t}</div><div style={{ fontFamily: FONT, fontSize: "0.82rem", color: TEXT, lineHeight: 1.5 }}>{item.d}</div></div>
              </div>)}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: "0.62rem", color: "#ff8080", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>What Vision Systems Miss</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Sub-pixel pinholes in forming film",
                "Grease trapped inside seal zones",
                "L-board edge micro-punctures from inside",
                "Incomplete initial/final seal overlap",
                "Fat or scrap contamination in seal area",
                "Film wrinkle defects under the seal surface",
                "Low vacuum without visible seal defect",
                "Cascading die contamination from prior packages",
              ].map((item, i) => <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontFamily: MONO, fontSize: "0.8rem", color: "#ff6666", flexShrink: 0 }}>✕</span>
                <span style={{ fontFamily: FONT, fontSize: "0.84rem", color: TEXT }}>{item}</span>
              </div>)}
            </div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.why-grid{grid-template-columns:1fr!important}}`}</style>
      </AnimatedSection>

      {/* Deep Domain Knowledge */}
      <AnimatedSection delay={0.25}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <SectionLabel>Deep Domain Expertise</SectionLabel>
            <h3 style={{ fontFamily: FONT, fontSize: "1.4rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 8 }}>We Know Every Way a Package Fails</h3>
            <p style={{ fontFamily: FONT, fontSize: "0.9rem", color: TEXT, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>Our system is designed around exhaustive knowledge of real-world packaging failure modes — not theoretical defect models. We've catalogued, root-caused, and engineered detection for every leak type in the field.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 12 }}>
            {leakTypes.map((lt, i) => <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "22px 18px" }}>
              <div style={{ fontFamily: FONT, fontSize: "0.95rem", fontWeight: 600, color: TEXT_BRIGHT, marginBottom: 5 }}>{lt.name}</div>
              <div style={{ fontFamily: FONT, fontSize: "0.8rem", color: TEXT, lineHeight: 1.55 }}>{lt.desc}</div>
            </div>)}
          </div>
        </div>
      </AnimatedSection>

      {/* Integration with VeriPak */}
      <AnimatedSection delay={0.3}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "36px 32px", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }} className="integration-grid">
          <div>
            <div style={{ fontFamily: MONO, fontSize: "0.62rem", color: ACCENT, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Platform Integration</div>
            <h3 style={{ fontFamily: FONT, fontSize: "1.3rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 10 }}>Connected to VeriPak SCADA</h3>
            <p style={{ fontFamily: FONT, fontSize: "0.88rem", color: TEXT, lineHeight: 1.65 }}>Every leak detection event feeds directly into the VeriPak SCADA platform in real time — logged by timestamp, SKU, operator, and defect classification. Force curves and deflection data stream into live dashboards for immediate operator feedback, shift-level trending, and audit-ready compliance. No standalone system, no data silos — one unified command center.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[{ v: "◈", l: "VeriPak Logged" },{ v: "⚡", l: "Real-Time Reject" },{ v: "📊", l: "Trend Analysis" },{ v: "🔔", l: "Alert System" }].map(s => <div key={s.l} style={{ background: "rgba(0,194,255,0.06)", border: "1px solid rgba(0,194,255,0.1)", borderRadius: 10, padding: "16px 14px", textAlign: "center" }}>
              <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontFamily: FONT, fontSize: "0.65rem", color: ACCENT, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
            </div>)}
          </div>
        </div>
        <style>{`@media(max-width:800px){.integration-grid{grid-template-columns:1fr!important}}`}</style>
      </AnimatedSection>

      {/* R&D CTA */}
      <AnimatedSection delay={0.35}>
        <div style={{ marginTop: 60, textAlign: "center", padding: "48px 32px", background: "linear-gradient(135deg, rgba(0,194,255,0.04), rgba(255,60,60,0.03))", border: "1px solid rgba(0,194,255,0.08)", borderRadius: 16 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,194,255,0.08)", border: "1px solid rgba(0,194,255,0.15)", borderRadius: 100, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ fontFamily: MONO, fontSize: "0.62rem", color: ACCENT, letterSpacing: "0.1em", textTransform: "uppercase" }}>Early Access Program</span>
          </div>
          <h3 style={{ fontFamily: FONT, fontSize: "1.5rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 10 }}>Interested in Real Leak Detection?</h3>
          <p style={{ fontFamily: FONT, fontSize: "0.92rem", color: TEXT, maxWidth: 520, margin: "0 auto 24px", lineHeight: 1.6 }}>We're partnering with select facilities to validate and refine our dual-pull system in production environments. If you're tired of vision systems missing leakers, let's talk.</p>
          <a href="mailto:info@automatedqs.com" style={{ fontFamily: FONT, fontSize: "0.9rem", fontWeight: 700, color: BG, background: "linear-gradient(135deg, #00c2ff, #0088ff)", padding: "13px 32px", borderRadius: 8, textDecoration: "none", boxShadow: "0 0 30px rgba(0,194,255,0.25)", display: "inline-block" }}>Join the Early Access Program →</a>
        </div>
      </AnimatedSection>

    </div>
  </section>;
}

// ============ SANITARY ROBOTICS ============
function PalletizingPage() {
  return <section style={{ padding: "140px 32px 100px", position: "relative" }}><GlowOrb top="0" left="-5%" size={500} color="77,159,255" /><div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
    <AnimatedSection><SectionLabel>Sanitary Robotics</SectionLabel><SectionTitle>Washdown Robotic Systems<br/>Built for Food Production</SectionTitle><SectionDesc>AQS designs, integrates, and supports fully sanitary robotic systems for palletizing, case packing, pick-and-place, and end-of-line automation — engineered from the ground up for USDA and FDA washdown environments with single-point accountability from concept through commissioning.</SectionDesc></AnimatedSection>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44 }} className="pal-grid">
      <AnimatedSection delay={0.1}><div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {[
          { t: "Robotic Palletizing", d: "High-speed, full-layer palletizing in USDA/FDA washdown zones with KUKA and Fanuc platforms." },
          { t: "Case Packing & Pick-and-Place", d: "Precision robotic handling for RSC, display-ready, and specialty packaging formats at production speed." },
          { t: "End-of-Line Integration", d: "Complete line ownership from infeed conveyance through robotic cell to stretch wrapper and outfeed." },
          { t: "Sanitary Cell Design", d: "Full 316L stainless steel frames, IP69K-rated enclosures, sanitary guarding, and washdown-ready cable management." },
          { t: "Rockwell-Native Controls", d: "Allen-Bradley programming standards common to food and protein facilities — no proprietary black boxes." },
        ].map((item, i) => <div key={i} style={{ display: "flex", gap: 12 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4d9fff", marginTop: 8, flexShrink: 0, boxShadow: "0 0 8px rgba(77,159,255,0.4)" }} /><div><div style={{ fontFamily: FONT, fontSize: "0.92rem", fontWeight: 600, color: TEXT_BRIGHT }}>{item.t}</div><div style={{ fontFamily: FONT, fontSize: "0.84rem", color: TEXT, lineHeight: 1.5 }}>{item.d}</div></div></div>)}
      </div></AnimatedSection>
      <AnimatedSection delay={0.2}><div style={{ background: "linear-gradient(135deg, rgba(0,194,255,0.05), rgba(0,102,255,0.03))", border: "1px solid rgba(0,194,255,0.1)", borderRadius: 16, padding: 36, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ fontSize: "3rem", marginBottom: 14, filter: "drop-shadow(0 0 16px rgba(0,194,255,0.3))" }}>⚙</div>
        <div style={{ fontFamily: FONT, fontSize: "1.1rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 8 }}>Full Washdown. Full Ownership.</div>
        <div style={{ fontFamily: FONT, fontSize: "0.85rem", color: TEXT, lineHeight: 1.7, maxWidth: 320, margin: "0 auto 18px" }}>We architect, integrate, test, install, and support complete sanitary robotic systems.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[{ v: "316L", l: "Stainless Steel" },{ v: "IP69K", l: "Protection" },{ v: "USDA", l: "Compliant" },{ v: "24/7", l: "Remote Support" }].map(s => <div key={s.l} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "12px 8px" }}><div style={{ fontFamily: MONO, fontSize: "1.1rem", fontWeight: 700, color: ACCENT }}>{s.v}</div><div style={{ fontFamily: FONT, fontSize: "0.6rem", color: TEXT_DIM, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.l}</div></div>)}
        </div>
      </div></AnimatedSection>
    </div>

    {/* Applications Grid */}
    <AnimatedSection delay={0.25}>
      <div style={{ marginTop: 60 }}>
        <div style={{ fontFamily: MONO, fontSize: "0.62rem", color: "#4d9fff", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Applications</div>
        <h3 style={{ fontFamily: FONT, fontSize: "1.3rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 20 }}>Where Sanitary Robotics Replaces Manual Labor</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          {[
            { t: "Palletizing", d: "Full-layer and column palletizing in cold, wet, or caustic washdown zones" },
            { t: "Case Packing", d: "Top-load, side-load, and wraparound case packing with vision-guided placement" },
            { t: "Pick-and-Place", d: "High-speed product handling, sorting, and orientation at production rates" },
            { t: "Depalletizing", d: "Automated inbound material handling for raw goods and packaging materials" },
            { t: "Stacking & Staging", d: "Layer building, slip-sheet insertion, and pallet staging for outbound shipping" },
            { t: "Custom Automation", d: "Purpose-built robotic cells for processes unique to your facility and product" },
          ].map((app, i) => <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "22px 18px" }}>
            <div style={{ fontFamily: FONT, fontSize: "0.95rem", fontWeight: 600, color: TEXT_BRIGHT, marginBottom: 4 }}>{app.t}</div>
            <div style={{ fontFamily: FONT, fontSize: "0.8rem", color: TEXT, lineHeight: 1.5 }}>{app.d}</div>
          </div>)}
        </div>
      </div>
    </AnimatedSection>

    <style>{`@media(max-width:900px){.pal-grid{grid-template-columns:1fr!important}}`}</style>
  </div></section>;
}

// ============ CONVEYORS ============
function ConveyorsPage() {
  return <section style={{ padding: "140px 32px 100px", position: "relative" }}><GlowOrb top="0" left="80%" size={400} color="102,179,255" /><div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
    <AnimatedSection><SectionLabel>Sanitary Conveyor Systems</SectionLabel><SectionTitle>Custom-Engineered for Your Production Line</SectionTitle><SectionDesc>Over 50 years of combined experience engineering unique sanitary solutions. Our team works closely with customers on challenging conveyor projects that elevate safety, profitability, and efficiency at scale.</SectionDesc></AnimatedSection>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
      {[
        { title: "Freezer Conveyors", sub: "Marshmallow Production — Utah", desc: "State-of-the-art sanitary conveyor systems for transporting hot extruded marshmallow through a freezer tunnel. Full washdown construction rated for extreme temperature cycling.", tags: ["Freezer Rated","Sanitary","Temp Cycling"] },
        { title: "EQ70 Accumulation Conveyor", sub: "Major Dairy Facility — Philadelphia", desc: "Advanced EQ70 accumulation conveyor installed at a major dairy production facility. Designed for active product accumulation with enhanced operational efficiency and stringent sanitation standards.", tags: ["Active Accumulation","Dairy Grade","High Sanitation"] },
      ].map((cs, i) => <AnimatedSection key={i} delay={i * 0.1}><div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "32px 24px", height: "100%" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.58rem", color: "#66b3ff", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>Case Study</div>
        <div style={{ fontFamily: FONT, fontSize: "1.15rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 3 }}>{cs.title}</div>
        <div style={{ fontFamily: FONT, fontSize: "0.78rem", color: ACCENT, marginBottom: 12 }}>{cs.sub}</div>
        <p style={{ fontFamily: FONT, fontSize: "0.85rem", color: TEXT, lineHeight: 1.6, marginBottom: 14 }}>{cs.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{cs.tags.map(t => <span key={t} style={{ fontFamily: MONO, fontSize: "0.56rem", color: "rgba(102,179,255,0.75)", border: "1px solid rgba(102,179,255,0.18)", borderRadius: 100, padding: "3px 9px" }}>{t}</span>)}</div>
      </div></AnimatedSection>)}
    </div>
    <AnimatedSection delay={0.2}><div style={{ marginTop: 50, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
      {[{ t: "Modular Belt", d: "Quick-disconnect for fast sanitation" },{ t: "Flat-Top Chain", d: "Heavy products & high-speed lines" },{ t: "Roller Conveyor", d: "Gravity & powered accumulation" },{ t: "Custom Configs", d: "Inclines, curves, merges, specialty" }].map((c, i) => <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "22px 18px" }}><div style={{ fontFamily: FONT, fontSize: "0.95rem", fontWeight: 600, color: TEXT_BRIGHT, marginBottom: 4 }}>{c.t}</div><div style={{ fontFamily: FONT, fontSize: "0.8rem", color: TEXT, lineHeight: 1.5 }}>{c.d}</div></div>)}
    </div></AnimatedSection>
  </div></section>;
}

// ============ ABOUT ============
function AboutPage() {
  return <section style={{ padding: "140px 32px 100px", position: "relative" }}><GlowOrb top="-100px" left="-5%" size={500} /><div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
    <AnimatedSection><SectionLabel>About AQS</SectionLabel><SectionTitle>Exceptional People. Innovative Solutions.</SectionTitle><SectionDesc>At AQS we believe in exceptional people and innovative solutions. We are dedicated to providing sustainable solutions that contribute to environmental conservation while helping our clients maximize profitability.</SectionDesc></AnimatedSection>

    <AnimatedSection delay={0.1}><h3 style={{ fontFamily: FONT, fontSize: "1.3rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 20 }}>Our Core Values</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 70 }}>
      {[
        { n: "01", t: "Solutions Seekers", d: "We approach every challenge with curiosity, creativity, and a commitment to finding the best path forward. We embrace challenges, think creatively, act proactively, and deliver actionable results." },
        { n: "02", t: "Motivated to Achieve", d: "Driven by a deep-seated passion for winning well. We pursue excellence, stay resilient, empower growth through continuous improvement, and celebrate successes as milestones." },
        { n: "03", t: "Integrity in Everything", d: "The foundation of our actions. We communicate openly, make decisions guided by fairness, own our actions with humility, and deliver on our promises without exception." },
      ].map((v, i) => <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "28px 22px" }}><div style={{ fontFamily: MONO, fontSize: "0.65rem", color: ACCENT, letterSpacing: "0.1em", marginBottom: 8 }}>{v.n}</div><div style={{ fontFamily: FONT, fontSize: "1.1rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 8 }}>{v.t}</div><div style={{ fontFamily: FONT, fontSize: "0.85rem", color: TEXT, lineHeight: 1.6 }}>{v.d}</div></div>)}
    </div></AnimatedSection>

    <AnimatedSection delay={0.2}><h3 style={{ fontFamily: FONT, fontSize: "1.3rem", fontWeight: 700, color: TEXT_BRIGHT, marginBottom: 20 }}>Leadership Team</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 16 }}>
      {[
        { name: "Travis Nebeker", role: "CEO & Co-Founder", desc: "Accomplished leader with a strong background in process engineering, facility design, and project management. Known for delivering innovative solutions to quality assurance, processing, and packaging challenges.", li: "https://www.linkedin.com/in/travis-nebeker-126aaa69" },
        { name: "Robert Byars", role: "COO & Co-Founder", desc: "Entrepreneurial leader with a strong foundation in business building and industrial automation. Career spans Systems Engineer, Head of Operations, and General Manager roles.", li: "https://www.linkedin.com/in/robert-byars-3a16835b" },
        { name: "David Mitchell", role: "CRO", desc: "Seasoned revenue leader with a proven track record of accelerating growth. Combines visionary thinking with data-driven execution across diverse industries.", li: "https://www.linkedin.com/in/david-mitchell-5a0a9874" },
      ].map((p, i) => <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "28px 22px" }}>
        <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg, rgba(0,194,255,0.12), rgba(0,102,255,0.08))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: "0.9rem", fontWeight: 700, color: ACCENT, marginBottom: 14 }}>{p.name.split(" ").map(n => n[0]).join("")}</div>
        <div style={{ fontFamily: FONT, fontSize: "1.05rem", fontWeight: 700, color: TEXT_BRIGHT }}>{p.name}</div>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: ACCENT, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{p.role}</div>
        <div style={{ fontFamily: FONT, fontSize: "0.84rem", color: TEXT, lineHeight: 1.6, marginBottom: 10 }}>{p.desc}</div>
        <a href={p.li} target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT, fontSize: "0.78rem", color: ACCENT, textDecoration: "none" }}>LinkedIn →</a>
      </div>)}
    </div></AnimatedSection>
  </div></section>;
}

// ============ FAQ (shared) ============
function FAQSection() {
  return <section style={{ padding: "70px 32px", background: "rgba(0,0,0,0.06)" }}><div style={{ maxWidth: 780, margin: "0 auto" }}>
    <AnimatedSection><div style={{ textAlign: "center", marginBottom: 36 }}><SectionLabel>Frequently Asked</SectionLabel><SectionTitle style={{ textAlign: "center", fontSize: "clamp(1.8rem, 3vw, 2.3rem)" }}>Common Questions</SectionTitle></div></AnimatedSection>
    {[
      { q: "What is VeriPak?", a: "VeriPak is AQS's standalone SCADA platform purpose-built for packaging quality control. It delivers real-time dashboards, instant operator alerts, and automated line intervention — not just after-the-fact data logging. Every connected device feeds a live control view with sub-second feedback, auto-reject triggers, and audit-ready records. No middleware or third-party software required." },
      { q: "What is the EvacuPak Liquid Recovery System?", a: "EvacuPak is AQS's patented fluid recovery system. Hygienic lances pierce packaging and extract product directly into 3A process piping — never exposed to atmosphere. Achieves up to 97% recovery with full HACCP traceability and CIP capability." },
      { q: "Are AQS systems rated for washdown?", a: "Yes. All systems use NEMA 4X stainless-steel enclosures, IP69K-rated components, 304L/316L stainless steel, and sanitary hardware for USDA and FDA regulated facilities." },
      { q: "Can VeriPak integrate with existing equipment?", a: "Yes. VeriPak's SCADA platform supports Ethernet/IP, Modbus-TCP, and digital I/O. It connects checkweighers, metal detectors, X-ray systems, code date printers, OneMotion motors, and other devices into one real-time control view — with live dashboards and instant alerts, not batch reports." },
      { q: "Does AQS offer sanitary robotic systems?", a: "Yes. AQS designs fully washdown-rated robotic systems for palletizing, case packing, pick-and-place, depalletizing, and custom automation. All systems use 316L stainless steel, IP69K-rated enclosures, and Rockwell/Allen-Bradley programming for USDA/FDA environments with KUKA and Fanuc platforms." },
      { q: "What conveyor types does AQS build?", a: "Custom sanitary conveyors including freezer-rated systems, accumulation conveyors, modular belt, flat-top chain, and roller configurations — all designed for washdown with quick-disconnect features." },
      { q: "Why doesn't vision-based leak detection work?", a: "Camera systems inspect what a package looks like, not whether it's sealed. Pinholes, grease in seal zones, and internal board cuts are physically invisible to optical inspection at line speed. AQS is developing a mechanical dual-pull suction system that measures force and deflection delta — detecting actual atmosphere ingress through any breach regardless of visual appearance." },
    ].map((item, i) => <AnimatedSection key={i} delay={i * 0.03}><FAQItem question={item.q} answer={item.a} /></AnimatedSection>)}
  </div></section>;
}

// ============ CTA + FOOTER ============
function CTAAndFooter({ setCurrentPage }) {
  const go = (p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return <>
    <section id="contact" style={{ padding: "90px 32px", position: "relative", overflow: "hidden" }}><GlowOrb top="-100px" left="30%" size={600} /><div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
      <AnimatedSection><SectionTitle style={{ textAlign: "center" }}>Ready to Eliminate Quality Blind Spots?</SectionTitle><p style={{ fontFamily: FONT, fontSize: "1.02rem", color: TEXT, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 32px" }}>Whether you need VeriPak, EvacuPak, leak detection, sanitary robotics, or custom conveyors — let's architect your next system together.</p>
      <a href="mailto:info@automatedqs.com" style={{ fontFamily: FONT, fontSize: "0.92rem", fontWeight: 700, color: BG, background: "linear-gradient(135deg, #00c2ff, #0088ff)", padding: "14px 36px", borderRadius: 8, textDecoration: "none", boxShadow: "0 0 36px rgba(0,194,255,0.3)", display: "inline-block" }}>Start a Project Review →</a></AnimatedSection>
    </div></section>
    <footer style={{ padding: "44px 32px 32px", borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 28 }} className="footer-grid">
        <div><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><div style={{ width: 28, height: 28, borderRadius: 5, background: "linear-gradient(135deg, #00c2ff, #0066ff)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: "0.6rem", color: "#fff" }}>AQS</div><span style={{ fontFamily: FONT, fontWeight: 700, color: "#fff", fontSize: "0.88rem" }}>Automated Quality Solutions</span></div><p style={{ fontFamily: FONT, fontSize: "0.78rem", color: TEXT_DIM, lineHeight: 1.7, maxWidth: 320 }}>Standalone SCADA, liquid recovery, leak detection, sanitary conveyors, and washdown robotics — engineered in Boise, Idaho.</p></div>
        <div><div style={{ fontFamily: MONO, fontSize: "0.58rem", color: TEXT_DIM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Solutions</div>{[["VeriPak SCADA","inspection"],["EvacuPak","evacupak"],["Leak Detection","leakdetection"],["Sanitary Robotics","palletizing"],["Conveyors","conveyors"]].map(([l,p]) => <div key={l} onClick={() => go(p)} style={{ fontFamily: FONT, fontSize: "0.78rem", color: TEXT_DIM, marginBottom: 6, cursor: "pointer" }}>{l}</div>)}</div>
        <div><div style={{ fontFamily: MONO, fontSize: "0.58rem", color: TEXT_DIM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Company</div>{[["About","about"],["Home","home"]].map(([l,p]) => <div key={l} onClick={() => go(p)} style={{ fontFamily: FONT, fontSize: "0.78rem", color: TEXT_DIM, marginBottom: 6, cursor: "pointer" }}>{l}</div>)}<a href="https://www.linkedin.com/company/automatedqs/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT, fontSize: "0.78rem", color: TEXT_DIM, textDecoration: "none", display: "block", marginBottom: 6 }}>LinkedIn</a><a href="https://www.youtube.com/@AutomatedQS" target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT, fontSize: "0.78rem", color: TEXT_DIM, textDecoration: "none", display: "block" }}>YouTube</a></div>
        <div><div style={{ fontFamily: MONO, fontSize: "0.58rem", color: TEXT_DIM, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Contact</div><div style={{ fontFamily: FONT, fontSize: "0.78rem", color: TEXT_DIM, lineHeight: 1.8 }}>Boise, Idaho<br/>info@automatedqs.com<br/>automatedqs.com</div></div>
      </div>
      <div style={{ maxWidth: 1280, margin: "26px auto 0", paddingTop: 18, borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontFamily: FONT, fontSize: "0.72rem", color: "rgba(255,255,255,0.18)" }}>© 2026 Automated Quality Solutions. All rights reserved.</div>
        <div style={{ fontFamily: FONT, fontSize: "0.72rem", color: "rgba(255,255,255,0.18)" }}>Privacy Policy · Terms of Service</div>
      </div>
      <style>{`@media(max-width:768px){.footer-grid{grid-template-columns:1fr!important}}`}</style>
    </footer>
  </>;
}

// ============ MAIN APP ============
export default function AQSWebsite() {
  const [currentPage, setCurrentPage] = useState("home");
  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage setCurrentPage={setCurrentPage} />;
      case "solutions": return <SolutionsPage setCurrentPage={setCurrentPage} />;
      case "inspection": return <InspectionPage />;
      case "evacupak": return <EvacuPakPage />;
      case "leakdetection": return <LeakDetectionPage />;
      case "palletizing": return <PalletizingPage />;
      case "conveyors": return <ConveyorsPage />;
      case "about": return <AboutPage />;
      default: return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };
  return (
    <div style={{ background: BG, color: "#fff", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.05, backgroundImage: "linear-gradient(rgba(0,194,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,255,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
      <FAQSection />
      <CTAAndFooter setCurrentPage={setCurrentPage} />
    </div>
  );
}
