"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Design color tokens (mapped to site theme) ───
const C = {
  navy: "#0B1A2E",
  navyMid: "#112240",
  navyLight: "#1A3055",
  slate: "#8892B0",
  slateLight: "#A8B2D1",
  white: "#E6F1FF",
  cyan: "#00c2ff",
  cyanDim: "rgba(0,194,255,0.15)",
  cyanGlow: "rgba(0,194,255,0.4)",
  gold: "#f5a623",
  green: "#00d4aa",
  red: "#ff6666",
};

// ─── Device Icons (SVG) ───
function DeviceIcon({
  type,
  size = 40,
  color = C.slate,
}: {
  type: string;
  size?: number;
  color?: string;
}) {
  const s = { width: size, height: size, display: "block" as const };
  switch (type) {
    case "md":
      return (
        <svg style={s} viewBox="0 0 40 40" fill="none">
          <rect x="4" y="6" width="32" height="28" rx="3" stroke={color} strokeWidth="2" />
          <path d="M4 20h32" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="20" cy="20" r="5" stroke={color} strokeWidth="1.5" />
          <path d="M16 16l8 8M24 16l-8 8" stroke={color} strokeWidth="1" />
        </svg>
      );
    case "cw":
      return (
        <svg style={s} viewBox="0 0 40 40" fill="none">
          <rect x="6" y="12" width="28" height="4" rx="1" stroke={color} strokeWidth="2" />
          <rect x="10" y="18" width="20" height="14" rx="2" stroke={color} strokeWidth="2" />
          <path d="M16 22h8M16 26h5" stroke={color} strokeWidth="1.5" />
          <path d="M18 8v4M22 8v4" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case "xray":
      return (
        <svg style={s} viewBox="0 0 40 40" fill="none">
          <rect x="4" y="4" width="32" height="32" rx="4" stroke={color} strokeWidth="2" />
          <circle cx="20" cy="20" r="8" stroke={color} strokeWidth="1.5" />
          <circle cx="20" cy="20" r="3" fill={color} fillOpacity="0.3" />
          <path d="M12 12l5 5M28 12l-5 5M12 28l5-5M28 28l-5-5" stroke={color} strokeWidth="1" />
        </svg>
      );
    case "printer":
      return (
        <svg style={s} viewBox="0 0 40 40" fill="none">
          <rect x="8" y="4" width="24" height="10" rx="2" stroke={color} strokeWidth="2" />
          <rect x="4" y="14" width="32" height="16" rx="2" stroke={color} strokeWidth="2" />
          <rect x="10" y="30" width="20" height="6" rx="1" stroke={color} strokeWidth="1.5" />
          <circle cx="30" cy="18" r="2" fill={color} fillOpacity="0.5" />
        </svg>
      );
    case "label":
      return (
        <svg style={s} viewBox="0 0 40 40" fill="none">
          <rect x="6" y="8" width="28" height="24" rx="3" stroke={color} strokeWidth="2" />
          <path d="M12 14h16M12 19h12M12 24h8" stroke={color} strokeWidth="1.5" />
          <circle cx="30" cy="24" r="3" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case "veripak":
      return (
        <svg style={s} viewBox="0 0 40 40" fill="none">
          <rect x="4" y="4" width="32" height="32" rx="4" stroke={color} strokeWidth="2.5" />
          <path d="M12 20l5 6 11-12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export { DeviceIcon };

// ═══════════════════════════════════════════════════════
// Device Connection Diagram (Hero animation)
// ═══════════════════════════════════════════════════════
export function DeviceConnectionDiagram() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1400),
      setTimeout(() => setStep(3), 2200),
      setTimeout(() => setStep(4), 3000),
      setTimeout(() => setStep(5), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const devices = [
    { type: "md", label: "Metal Detector", x: 8, y: 20 },
    { type: "cw", label: "Checkweigher", x: 8, y: 45 },
    { type: "xray", label: "X-Ray", x: 8, y: 70 },
    { type: "printer", label: "Code Printer", x: 85, y: 20 },
    { type: "label", label: "Label Verifier", x: 85, y: 70 },
  ];

  const allConnected = step >= 5;

  return (
    <div
      className="w-full max-w-[700px] mx-auto mb-12"
      style={{
        aspectRatio: "7/4",
        position: "relative",
        opacity: step >= 3 ? 1 : 0,
        transition: "opacity 1s ease",
      }}
    >
      {/* Center VeriPak Node */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: 100,
          height: 100,
          borderRadius: 16,
          background: step >= 4 ? `linear-gradient(135deg, ${C.cyan}22, ${C.cyan}11)` : C.navyLight,
          border: `2px solid ${step >= 4 ? C.cyan : C.slate}44`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.8s ease",
          boxShadow: allConnected ? `0 0 40px ${C.cyanGlow}, 0 0 80px ${C.cyanDim}` : "none",
          zIndex: 2,
        }}
      >
        <DeviceIcon type="veripak" size={36} color={step >= 4 ? C.cyan : C.slate} />
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            color: step >= 4 ? C.cyan : C.slate,
            marginTop: 4,
            letterSpacing: "0.08em",
          }}
        >
          VeriPak
        </span>
      </div>

      {/* Device nodes and connection lines */}
      {devices.map((d, i) => (
        <div key={d.type}>
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <line
              x1={`${d.x + 3}%`}
              y1={`${d.y}%`}
              x2="50%"
              y2="50%"
              stroke={allConnected ? C.cyan : C.slate}
              strokeWidth={allConnected ? 1.5 : 0.5}
              strokeDasharray={allConnected ? "none" : "4 4"}
              style={{
                opacity: step >= 3 ? (allConnected ? 0.7 : 0.2) : 0,
                transition: `all 0.8s ease ${i * 0.12}s`,
              }}
            />
            {allConnected && (
              <circle r="3" fill={C.cyan} opacity="0.8">
                <animateMotion
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                  path={`M${d.x + 3},${d.y} L50,50`}
                />
              </circle>
            )}
          </svg>

          <div
            style={{
              position: "absolute",
              left: `${d.x}%`,
              top: `${d.y}%`,
              transform: "translate(-50%,-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              opacity: step >= 3 ? 1 : 0,
              transition: `all 0.6s ease ${i * 0.1}s`,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 10,
                background: allConnected ? `${C.cyan}11` : C.navyLight,
                border: `1.5px solid ${allConnected ? C.cyan : C.slate}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.6s ease",
                boxShadow: allConnected ? `0 0 16px ${C.cyan}22` : "none",
              }}
            >
              <DeviceIcon type={d.type} size={28} color={allConnected ? C.white : C.slate} />
            </div>
            <span
              className="font-mono whitespace-nowrap"
              style={{
                fontSize: 8,
                color: allConnected ? C.slateLight : C.slate,
                letterSpacing: "0.06em",
                transition: "color 0.4s ease",
              }}
            >
              {d.label}
            </span>
          </div>
        </div>
      ))}

      {/* Products Logged counter */}
      {allConnected && (
        <div
          className="font-mono"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "2%",
            transform: "translateX(-50%)",
            fontSize: 13,
            color: C.cyan,
            opacity: 0.8,
            animation: "float 4s ease-in-out infinite",
          }}
        >
          Products Logged: <AnimatedCounter end={14847} duration={2500} />
        </div>
      )}
    </div>
  );
}

// ─── Animated counter helper ───
function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= end) {
        setVal(end);
        clearInterval(id);
      } else {
        setVal(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(id);
  }, [end, duration]);
  return <span>{val.toLocaleString()}</span>;
}

// ═══════════════════════════════════════════════════════
// Product Journey (Conveyor Animation + Data Log)
// ═══════════════════════════════════════════════════════

const PRODUCT_TEMPLATES = [
  {
    id: "PKG-20260303-00417",
    results: [
      { station: "MD", value: "PASS", ok: true as boolean | string | null },
      { station: "WT", value: "453g", ok: true as boolean | string | null },
      { station: "CD", value: "03-03-2026", ok: true as boolean | string | null },
      { station: "VI", value: "Label Match", ok: true as boolean | string | null },
    ],
  },
  {
    id: "PKG-20260303-00418",
    results: [
      { station: "MD", value: "PASS", ok: true as boolean | string | null },
      { station: "WT", value: "448g", ok: true as boolean | string | null },
      { station: "CD", value: "03-03-2026", ok: true as boolean | string | null },
      { station: "VI", value: "Seal Intact", ok: true as boolean | string | null },
    ],
  },
  {
    id: "PKG-20260303-00419",
    results: [
      { station: "MD", value: "PASS", ok: true as boolean | string | null },
      { station: "WT", value: "411g \u2193", ok: false as boolean | string | null },
      { station: "CD", value: "\u2014", ok: null as boolean | string | null },
      { station: "VI", value: "\u2014", ok: null as boolean | string | null },
    ],
  },
  {
    id: "PKG-20260303-00420",
    results: [
      { station: "MD", value: "PASS", ok: true as boolean | string | null },
      { station: "WT", value: "469g \u2191", ok: "warn" as boolean | string | null },
      { station: "CD", value: "03-03-2026", ok: true as boolean | string | null },
      { station: "VI", value: "Label Match", ok: true as boolean | string | null },
    ],
  },
  {
    id: "PKG-20260303-00421",
    results: [
      { station: "MD", value: "PASS", ok: true as boolean | string | null },
      { station: "WT", value: "451g", ok: true as boolean | string | null },
      { station: "CD", value: "03-03-2026", ok: true as boolean | string | null },
      { station: "VI", value: "Seal Intact", ok: true as boolean | string | null },
    ],
  },
];

const STATIONS = [
  { pos: 18, label: "Metal Detector" },
  { pos: 38, label: "Checkweigher" },
  { pos: 58, label: "Code Date" },
  { pos: 78, label: "Vision Inspection" },
];

function rColor(ok: boolean | string | null) {
  if (ok === true) return C.green;
  if (ok === false) return C.red;
  if (ok === "warn") return C.gold;
  return C.slate;
}

interface BeltProduct {
  uid: number;
  tplIdx: number;
  id: string;
  results: { station: string; value: string; ok: boolean | string | null }[];
  pos: number;
  stationHits: number[];
  rejected: boolean;
}

interface LogRow {
  uid: number;
  id: string;
  results: { station: string; value: string; ok: boolean | string | null }[];
  hits: number[];
  verdict: string;
  vc: string;
}

const MAX_VISIBLE_ROWS = 4;
const GRID = "minmax(150px,1fr) 68px 76px 106px 96px 68px";

export function ProductJourneyAnimation() {
  const [vis, setVis] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [beltProduct, setBeltProduct] = useState<BeltProduct | null>(null);
  const [rows, setRows] = useState<LogRow[]>([]);
  const frameRef = useRef<number>(0);
  const seqRef = useRef(0);
  const uidRef = useRef(0);
  const pauseUntilRef = useRef(0);

  // Intersection observer
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const finalize = useCallback((p: BeltProduct) => {
    const isReject = p.rejected;
    const hasWarn = p.results.some((r) => r.ok === "warn");
    const verdict = isReject ? "REJECT" : hasWarn ? "WARN" : "PASS";
    const vc = isReject ? C.red : hasWarn ? C.gold : C.green;

    setRows((prev) =>
      [
        {
          uid: p.uid,
          id: p.id,
          results: p.results,
          hits: isReject ? [...p.stationHits] : [0, 1, 2, 3],
          verdict,
          vc,
        },
        ...prev,
      ].slice(0, MAX_VISIBLE_ROWS)
    );

    setBeltProduct(null);
    pauseUntilRef.current = performance.now() + 1400;
  }, []);

  useEffect(() => {
    if (!vis) return;
    pauseUntilRef.current = performance.now() + 800;

    const tick = (now: number) => {
      setBeltProduct((prev) => {
        if (prev === null) {
          if (now < pauseUntilRef.current) return null;
          const tplIdx = seqRef.current % PRODUCT_TEMPLATES.length;
          const tpl = PRODUCT_TEMPLATES[tplIdx];
          const uid = uidRef.current++;
          seqRef.current++;
          const idNum = 417 + (uid % 10000);
          return {
            uid,
            tplIdx,
            id: `PKG-20260303-${String(idNum).padStart(5, "0")}`,
            results: tpl.results,
            pos: -6,
            stationHits: [],
            rejected: false,
          };
        }

        const newPos = prev.pos + 0.22;
        const newHits = [...prev.stationHits];
        let rejected = prev.rejected;

        STATIONS.forEach((s, i) => {
          if (newPos >= s.pos && newPos < s.pos + 2 && !newHits.includes(i)) {
            newHits.push(i);
            if (prev.tplIdx === 2 && i === 1) rejected = true;
          }
        });

        const exitPos = rejected ? 58 : 96;
        if (newPos > exitPos) {
          const done = { ...prev, pos: newPos, stationHits: newHits, rejected };
          setTimeout(() => finalize(done), 0);
          return null;
        }
        return { ...prev, pos: newPos, stationHits: newHits, rejected };
      });

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [vis, finalize]);

  const bp = beltProduct;
  const bpHasWarn = bp ? bp.stationHits.some((i) => bp.results[i]?.ok === "warn") : false;
  const bpColor = bp ? (bp.rejected ? C.red : bpHasWarn ? C.gold : C.cyan) : C.cyan;
  const bpDone = bp ? bp.stationHits.length >= 4 : false;
  const bpFading = bp ? bp.rejected && bp.pos > 44 : false;
  const lastIdx = bp && bp.stationHits.length > 0 ? bp.stationHits[bp.stationHits.length - 1] : -1;
  const lastR = bp && lastIdx >= 0 ? bp.results[lastIdx] : null;
  const showReject = bp && bp.rejected && bp.pos > 38 && bp.pos < 54;
  const showWarn = bp && !bp.rejected && bpHasWarn && bp.pos > 38 && bp.pos < 56;

  return (
    <div ref={sectionRef}>
      {/* Conveyor */}
      <div
        className="relative overflow-hidden"
        style={{
          background: C.navy,
          borderRadius: "16px 16px 0 0",
          padding: "44px 20px 28px",
          border: `1px solid ${C.navyLight}`,
          borderBottom: "none",
          height: 210,
        }}
      >
        {/* Belt surface */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "58%",
            height: 6,
            background: C.navyLight,
            borderRadius: 3,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "59%",
            height: 3,
            opacity: 0.25,
            backgroundImage: `repeating-linear-gradient(90deg, ${C.slate} 0px, ${C.slate} 8px, transparent 8px, transparent 20px)`,
            animation: vis ? "conveyorMove 0.8s linear infinite" : "none",
          }}
        />

        {/* Station columns */}
        {STATIONS.map((s, i) => {
          const lit = bp && Math.abs(bp.pos - s.pos) < 5;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${s.pos}%`,
                top: "12%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <div
                className="font-mono whitespace-nowrap"
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: C.slate,
                  letterSpacing: "0.08em",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  width: 1.5,
                  height: 50,
                  background: `linear-gradient(to bottom, ${C.cyan}55, ${C.cyan}11)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "130%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 40,
                  height: 2,
                  background: lit ? `${C.cyan}55` : `${C.cyan}18`,
                  boxShadow: lit ? `0 0 10px ${C.cyan}55` : "none",
                  transition: "all 0.25s ease",
                }}
              />
            </div>
          );
        })}

        {/* Product on belt */}
        {bp && (
          <div
            style={{
              position: "absolute",
              left: `${bp.pos}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 3,
              opacity: bpFading ? Math.max(0, 1 - (bp.pos - 44) / 14) : 1,
            }}
          >
            <div
              style={{
                width: 36,
                height: 22,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${bpColor}44, ${bpColor}22)`,
                border: `1.5px solid ${bpColor}88`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <span className="font-mono" style={{ fontSize: 7, fontWeight: 700, color: bpColor }}>
                {bp.stationHits.length || ""}
              </span>
            </div>

            {/* Floating data tag */}
            {lastR && !bpFading && !showReject && !showWarn && (
              <div
                className="font-mono whitespace-nowrap"
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginBottom: 6,
                  fontSize: 9,
                  color: rColor(lastR.ok),
                  background: `${C.navy}ee`,
                  padding: "2px 8px",
                  borderRadius: 4,
                  border: `1px solid ${rColor(lastR.ok)}44`,
                }}
              >
                {lastR.station}: {lastR.value}
                {lastR.ok === "warn" && " \u26A1"}
              </div>
            )}
            {showReject && (
              <div
                className="font-mono whitespace-nowrap"
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginBottom: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.red,
                  background: `${C.red}15`,
                  padding: "2px 10px",
                  borderRadius: 4,
                  border: `1px solid ${C.red}55`,
                }}
              >
                \u26A0 UNDERWEIGHT \u2014 REJECT
              </div>
            )}
            {showWarn && (
              <div
                className="font-mono whitespace-nowrap"
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginBottom: 6,
                  fontSize: 9,
                  fontWeight: 700,
                  color: C.gold,
                  background: `${C.gold}12`,
                  padding: "2px 10px",
                  borderRadius: 4,
                  border: `1px solid ${C.gold}44`,
                }}
              >
                HEAVY \u2014 USER RULE: ALLOW
              </div>
            )}
          </div>
        )}

        {/* Decision engine bar */}
        <div
          className="absolute flex items-center justify-center gap-6"
          style={{
            left: "8%",
            right: "8%",
            bottom: 10,
            height: 24,
            borderRadius: 5,
            background: `linear-gradient(90deg, ${C.cyan}11, ${C.cyan}06)`,
            border: `1px solid ${C.cyan}18`,
          }}
        >
          {["VeriPak QC Decision Engine", "\u00B7", "Data Tagged Per Product", "\u00B7", "Audit Ready"].map(
            (t, i) => (
              <span
                key={i}
                className="font-mono"
                style={{ fontSize: 8, color: C.cyan, letterSpacing: "0.06em", opacity: 0.6 }}
              >
                {t}
              </span>
            )
          )}
        </div>
      </div>

      {/* Unified Log */}
      <div
        style={{
          background: C.navy,
          borderRadius: "0 0 16px 16px",
          border: `1px solid ${C.navyLight}`,
          borderTop: `1px solid ${C.cyan}22`,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: GRID,
            padding: "10px 16px",
            background: `${C.cyan}08`,
            borderBottom: `1px solid ${C.navyLight}`,
          }}
        >
          {["Product ID", "MD", "Weight", "Code Date", "Vision", "Verdict"].map((h) => (
            <span
              key={h}
              className="font-mono uppercase"
              style={{ fontSize: 9, fontWeight: 700, color: C.cyan, letterSpacing: "0.1em" }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {(() => {
          const TOTAL_SLOTS = 4;
          const visibleCompleted = rows.slice(0, bp ? TOTAL_SLOTS - 1 : TOTAL_SLOTS);
          const filledSlots = (bp ? 1 : 0) + visibleCompleted.length;
          const blankCount = TOTAL_SLOTS - filledSlots;

          return (
            <>
              {bp && (
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: GRID,
                    padding: "9px 16px",
                    borderBottom: `1px solid ${C.navyLight}33`,
                    background: bp.rejected
                      ? `${C.red}08`
                      : bpHasWarn
                        ? `${C.gold}06`
                        : `${C.cyan}04`,
                    transition: "background 0.8s ease",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 11,
                      color: bpColor,
                      fontWeight: 700,
                      transition: "color 0.5s ease",
                    }}
                  >
                    {bp.id}
                  </span>
                  {bp.results.map((r, i) => {
                    const hit = bp.stationHits.includes(i);
                    return (
                      <span
                        key={i}
                        className="font-mono"
                        style={{
                          fontSize: 11,
                          fontWeight: hit ? 600 : 400,
                          color: hit ? rColor(r.ok) : `${C.slate}22`,
                          transition: "color 0.6s ease",
                        }}
                      >
                        {hit ? r.value : "\u00B7\u00B7\u00B7"}
                      </span>
                    );
                  })}
                  <span
                    className="font-mono flex items-center gap-1"
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      transition: "color 0.6s ease",
                      color: bp.rejected
                        ? C.red
                        : bpDone && bpHasWarn
                          ? C.gold
                          : bpDone
                            ? C.green
                            : `${C.slate}22`,
                    }}
                  >
                    {(bp.rejected || bpDone) && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: bp.rejected ? C.red : bpHasWarn ? C.gold : C.green,
                          transition: "background 0.5s ease",
                        }}
                      />
                    )}
                    {bp.rejected
                      ? "REJECT"
                      : bpDone && bpHasWarn
                        ? "WARN"
                        : bpDone
                          ? "PASS"
                          : "\u00B7\u00B7\u00B7"}
                  </span>
                </div>
              )}

              {visibleCompleted.map((row, idx) => {
                const fade = Math.max(0.15, 1 - (idx / TOTAL_SLOTS) * 0.9);
                return (
                  <div
                    key={row.uid}
                    className="grid"
                    style={{
                      gridTemplateColumns: GRID,
                      padding: "9px 16px",
                      borderBottom: `1px solid ${C.navyLight}15`,
                      background:
                        row.verdict === "REJECT"
                          ? `${C.red}04`
                          : row.verdict === "WARN"
                            ? `${C.gold}03`
                            : "transparent",
                      opacity: fade,
                      transition: "opacity 2s ease",
                    }}
                  >
                    <span className="font-mono" style={{ fontSize: 11, color: row.vc, fontWeight: 700 }}>
                      {row.id}
                    </span>
                    {row.results.map((r, i) => {
                      const hit = row.hits.includes(i);
                      return (
                        <span
                          key={i}
                          className="font-mono"
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: hit ? rColor(r.ok) : `${C.slate}15`,
                          }}
                        >
                          {hit ? r.value : "\u2014"}
                        </span>
                      );
                    })}
                    <span
                      className="font-mono flex items-center gap-1"
                      style={{ fontSize: 11, fontWeight: 700, color: row.vc }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: row.vc,
                          opacity: 0.7,
                        }}
                      />
                      {row.verdict}
                    </span>
                  </div>
                );
              })}

              {Array.from({ length: blankCount }).map((_, i) => (
                <div
                  key={`blank-${i}`}
                  className="grid"
                  style={{
                    gridTemplateColumns: GRID,
                    padding: "9px 16px",
                    borderBottom: `1px solid ${C.navyLight}08`,
                  }}
                >
                  {Array.from({ length: 6 }).map((_, j) => (
                    <span
                      key={j}
                      className="font-mono"
                      style={{ fontSize: 11, color: j === 0 ? `${C.slate}15` : `${C.slate}10` }}
                    >
                      {"\u00B7\u00B7\u00B7"}
                    </span>
                  ))}
                </div>
              ))}
            </>
          );
        })()}

        {/* Bottom bar */}
        <div
          className="flex items-center gap-2.5"
          style={{
            padding: "12px 16px",
            background: `${C.cyan}06`,
            borderTop: `1px solid ${C.cyan}11`,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              flexShrink: 0,
              background: C.cyan,
              animation: "radarPulse 2s ease-out infinite",
              boxShadow: `0 0 6px ${C.cyan}88`,
            }}
          />
          <span
            className="font-mono"
            style={{ fontSize: 10, color: C.cyan, letterSpacing: "0.06em", opacity: 0.7 }}
          >
            Data is tagged to the physical product \u2014 not dependent on the reject system working
            correctly
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Leak Detection Animation
// ═══════════════════════════════════════════════════════
export function LeakDetectionAnimation() {
  const [vis, setVis] = useState(false);
  const [stage, setStage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!vis) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const loop = () => {
      setStage(0);
      timers = [
        setTimeout(() => setStage(1), 1200),
        setTimeout(() => setStage(2), 3000),
        setTimeout(() => setStage(3), 4800),
        setTimeout(() => loop(), 7000),
      ];
    };
    loop();
    return () => timers.forEach(clearTimeout);
  }, [vis]);

  const steps = [
    { label: "Controlled Aspiration", desc: "Measured vacuum applied \u2014 initial structural response captured", active: stage >= 1 },
    { label: "Differential Aspiration", desc: "Second cycle measures deflection delta for comparison", active: stage >= 2 },
    { label: "Delta-Z Analysis", desc: "Deviation from baseline = leak detected. Binary pass/fail.", active: stage >= 2 },
    { label: "VeriPak Decision Engine", desc: "Fuses integrity + vision data into unified reject decision", active: stage >= 3 },
  ];

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
      style={{
        background: C.navyMid,
        borderRadius: 16,
        padding: 32,
        border: `1px solid ${C.navyLight}`,
      }}
    >
      {/* Visual */}
      <div className="relative" style={{ height: 240 }}>
        {/* Package base */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: "50%",
            top: "40%",
            transform: "translate(-50%, -50%)",
            width: 140,
            height: 50,
            borderRadius: 6,
            background: C.navyLight,
            border: `2px solid ${C.slate}55`,
          }}
        >
          <span className="font-mono" style={{ fontSize: 9, color: C.slate, letterSpacing: "0.06em" }}>
            SEALED TRAY
          </span>
        </div>

        {/* Film deflection */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "58%",
            transform: "translateX(-50%)",
            width: 100,
            height: stage >= 1 ? (stage >= 2 ? 14 : 8) : 0,
            borderRadius: "0 0 50% 50%",
            background: stage >= 3 ? `${C.red}33` : `${C.cyan}22`,
            border: stage >= 1 ? `1px solid ${stage >= 3 ? C.red : C.cyan}44` : "none",
            transition: "all 0.8s ease",
          }}
        />

        {/* Vacuum arrows */}
        {stage >= 1 &&
          [-30, -10, 10, 30].map((x, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `calc(50% + ${x}px)`,
                top: "72%",
                width: 2,
                height: 20,
                background: `linear-gradient(to top, transparent, ${C.cyan}88)`,
                animation: "pulseUp 1.2s ease infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}

        {/* Stage label */}
        <div
          className="absolute font-mono whitespace-nowrap"
          style={{
            left: "50%",
            bottom: 10,
            transform: "translateX(-50%)",
            fontSize: 11,
            color: stage >= 3 ? C.red : stage >= 2 ? C.green : C.cyan,
            letterSpacing: "0.08em",
            transition: "color 0.4s ease",
          }}
        >
          {stage === 0 && "Package entering test zone..."}
          {stage === 1 && "Stage 1: Controlled Aspiration"}
          {stage === 2 && "Stage 2: Delta-Z Analysis \u2192 PASS"}
          {stage === 3 && "\u26A0 Delta-Z Deviation \u2192 FAIL: Micro-Leak"}
        </div>

        {/* Pass/Fail badge */}
        {stage >= 2 && (
          <div
            className="absolute font-mono"
            style={{
              right: 10,
              top: 10,
              fontSize: 12,
              fontWeight: 700,
              color: stage >= 3 ? C.red : C.green,
              padding: "4px 12px",
              borderRadius: 6,
              background: stage >= 3 ? `${C.red}15` : `${C.green}15`,
              border: `1px solid ${stage >= 3 ? C.red : C.green}44`,
            }}
          >
            {stage >= 3 ? "FAIL" : "PASS"}
          </div>
        )}
      </div>

      {/* Explanation steps */}
      <div>
        {steps.map((s, i) => (
          <div
            key={i}
            className="flex gap-3 mb-4"
            style={{ opacity: s.active ? 1 : 0.3, transition: "opacity 0.5s ease" }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                marginTop: 6,
                flexShrink: 0,
                background: s.active ? C.cyan : C.slate,
                boxShadow: s.active ? `0 0 8px ${C.cyan}88` : "none",
                transition: "all 0.4s ease",
              }}
            />
            <div>
              <div className="font-sans text-[13px] font-bold text-white mb-0.5">{s.label}</div>
              <div className="font-sans text-[12px] leading-[1.5]" style={{ color: C.slate }}>
                {s.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
