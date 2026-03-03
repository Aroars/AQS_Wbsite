"use client";

import { useState, useEffect } from "react";

/* ─── Color Tokens (matched to original reference) ─── */
const C = {
  navy: "#0B1A2E",
  navyMid: "#112240",
  navyLight: "#1A3055",
  slate: "#8892B0",
  slateLight: "#A8B2D1",
  white: "#E6F1FF",
  gold: "#F5A623",
  goldDim: "#C4841A",
  cyan: "#00C6D7",
  cyanDim: "#009DAA",
  green: "#34D399",
  red: "#F87171",
  accent: "#3B82F6",
};

/* ═══════════════════════════════════════════════════════════════════════════
   Component 1 — ConveyorAnimation
   Faithful port of the original with inner detail rects, multi-color outfeed,
   sensor sweep dots, zone glow, and batch brackets.
   ═══════════════════════════════════════════════════════════════════════════ */

export function ConveyorAnimation() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 28);
    return () => clearInterval(id);
  }, []);

  const beltSpeed = tick * 1.8;

  /* ── INFEED: random products moving LEFT → RIGHT ── */
  const infeedProducts = [
    { id: 1, spacing: 0, yOff: 0, size: 22, color: "#F5A623" },
    { id: 2, spacing: 34, yOff: 5, size: 20, color: "#00C6D7" },
    { id: 3, spacing: 56, yOff: -3, size: 24, color: "#34D399" },
    { id: 4, spacing: 98, yOff: 2, size: 21, color: "#F5A623" },
    { id: 5, spacing: 122, yOff: 6, size: 19, color: "#00C6D7" },
    { id: 6, spacing: 158, yOff: -2, size: 23, color: "#34D399" },
    { id: 7, spacing: 180, yOff: 4, size: 20, color: "#F5A623" },
  ];

  /* ── OUTFEED: batched groups [3, 2, 3, 2, 3, 2] ── */
  const prodSize = 22;
  const tightGap = 4;
  const batchGap = 42;
  const colors = ["#F5A623", "#00C6D7", "#34D399"];
  const groupSizes = [3, 2, 3, 2, 3, 2];

  const batchPattern: { offset: number; color: string }[] = [];
  let cursor = 0;
  let colorIdx = 0;
  for (let g = 0; g < groupSizes.length; g++) {
    const count = groupSizes[g];
    for (let p = 0; p < count; p++) {
      batchPattern.push({ offset: cursor, color: colors[colorIdx % 3] });
      colorIdx++;
      cursor += prodSize + tightGap;
    }
    cursor += batchGap;
  }
  const totalPatternWidth = cursor;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-[#112240]/60 p-2">
      <svg
        viewBox="0 0 720 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        style={{ display: "block" }}
      >
        {/* Belt base */}
        <rect x="0" y="55" width="720" height="8" rx="4" fill={C.navyLight} />

        {/* Belt texture — moving */}
        {Array.from({ length: 40 }, (_, i) => {
          const x = (i * 18 + beltSpeed * 0.6) % 720;
          return (
            <line
              key={i}
              x1={x}
              y1="56"
              x2={x}
              y2="62"
              stroke={C.slate}
              strokeWidth="0.5"
              opacity="0.35"
            />
          );
        })}

        {/* Zone dividers */}
        <line x1="210" y1="46" x2="210" y2="72" stroke={C.gold} strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
        <line x1="400" y1="46" x2="400" y2="72" stroke={C.cyan} strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />

        {/* Zone labels */}
        <text x="105" y="90" fill={C.slate} fontSize="8" textAnchor="middle" fontFamily="monospace">
          RANDOM INFEED
        </text>
        <text x="305" y="90" fill={C.gold} fontSize="8" textAnchor="middle" fontFamily="monospace">
          INTELLIPAK ZONE
        </text>
        <text x="560" y="90" fill={C.cyan} fontSize="8" textAnchor="middle" fontFamily="monospace">
          BATCHED OUTPUT
        </text>

        {/* ── INFEED Products — with inner detail rects ── */}
        {infeedProducts.map((p) => {
          const cycleLen = 210;
          const rawX = (p.spacing + beltSpeed * 0.7) % cycleLen - 20;
          const x = rawX;
          const jX = Math.sin(tick * 0.12 + p.id * 2.7) * 4;
          const jY = Math.cos(tick * 0.15 + p.id * 1.3) * 2.5;
          const baseY = 31 + p.yOff;
          if (x + p.size < -5 || x > 210) return null;
          return (
            <g key={`in-${p.id}`}>
              <rect
                x={x + jX}
                y={baseY + jY}
                width={p.size}
                height={p.size}
                rx="3"
                fill={p.color}
                opacity="0.85"
              />
              <rect
                x={x + jX + 3}
                y={baseY + jY + 3}
                width={p.size - 6}
                height={p.size - 6}
                rx="1"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.5"
              />
            </g>
          );
        })}

        {/* ── INTELLIPAK ZONE — sensor beams, glow, sweep dots ── */}
        <rect
          x="210"
          y="18"
          width="190"
          height="52"
          rx="4"
          fill={C.gold}
          opacity={0.035 + Math.sin(tick * 0.06) * 0.025}
        />
        {[235, 265, 300, 335, 370].map((sx, i) => {
          const intensity = 0.3 + Math.sin(tick * 0.18 + i * 1.4) * 0.35;
          return (
            <g key={sx}>
              <line x1={sx} y1="22" x2={sx} y2="52" stroke={C.cyan} strokeWidth="1.2" opacity={intensity} />
              <circle cx={sx} cy="22" r="2.5" fill={C.cyan} opacity={intensity + 0.2} />
              {/* Sensor sweep dot */}
              <circle
                cx={sx}
                cy={22 + ((tick * 0.6 + i * 7) % 30)}
                r="1.2"
                fill={C.gold}
                opacity={intensity}
              />
            </g>
          );
        })}

        {/* Processing arrow */}
        <polygon points="392,38 406,48 392,58" fill={C.gold} opacity="0.7" />

        {/* ── OUTFEED Products — multi-color with inner detail rects ── */}
        {batchPattern.map((bp, i) => {
          const speed = beltSpeed * 0.8;
          const rawX = 410 + ((bp.offset + speed) % totalPatternWidth);
          if (rawX > 720 || rawX + prodSize < 400) return null;
          return (
            <g key={`out-${i}`}>
              <rect
                x={rawX}
                y={31}
                width={prodSize}
                height={prodSize}
                rx="3"
                fill={bp.color}
                opacity="0.92"
              />
              <rect
                x={rawX + 3}
                y={34}
                width={prodSize - 6}
                height={prodSize - 6}
                rx="1"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.5"
              />
            </g>
          );
        })}

        {/* Batch group brackets */}
        {(() => {
          const speed = beltSpeed * 0.8;
          const brackets: React.ReactElement[] = [];
          let cur = 0;
          for (let g = 0; g < groupSizes.length; g++) {
            const count = groupSizes[g];
            const startOff = cur;
            const groupWidth = count * prodSize + (count - 1) * tightGap;
            const bx = 410 + ((startOff + speed) % totalPatternWidth);
            if (bx > 395 && bx + groupWidth < 725) {
              brackets.push(
                <g key={`br-${g}`}>
                  <line x1={bx} y1="26" x2={bx + groupWidth} y2="26" stroke={C.cyan} strokeWidth="1" opacity="0.4" />
                  <text
                    x={bx + groupWidth / 2}
                    y="22"
                    fill={C.cyan}
                    fontSize="8"
                    textAnchor="middle"
                    fontWeight="bold"
                    opacity="0.6"
                  >
                    ×{count}
                  </text>
                </g>,
              );
            }
            cur += count * (prodSize + tightGap) + batchGap;
          }
          return brackets;
        })()}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Component 2 — MagDriveAnimation
   Faithful port: outer shell with inner ring detail, unfilled stator coils,
   correct proportions and rendering order.
   ═══════════════════════════════════════════════════════════════════════════ */

export function MagDriveAnimation() {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAngle((a) => (a + 2) % 360), 40);
    return () => clearInterval(id);
  }, []);

  const cx = 120;
  const cy = 120;
  const outerR = 90;
  const innerR = 55;
  const magnetR = 72;
  const numMagnets = 12;

  return (
    <div className="flex justify-center">
      <div
        className="rounded-xl border border-white/10 bg-[#112240]/60 p-3"
        style={{ maxWidth: 280 }}
      >
        <svg
          viewBox="0 0 240 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          style={{ display: "block" }}
        >
          {/* Outer shell — two rings for depth */}
          <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={C.slateLight} strokeWidth="3" opacity="0.3" />
          <circle cx={cx} cy={cy} r={outerR - 8} fill="none" stroke={C.navyLight} strokeWidth="14" opacity="0.5" />

          {/* Rotating magnets on outer shell */}
          {Array.from({ length: numMagnets }, (_, i) => {
            const a = ((i * 360) / numMagnets + angle) * (Math.PI / 180);
            const x = cx + Math.cos(a) * magnetR;
            const y = cy + Math.sin(a) * magnetR;
            const isN = i % 2 === 0;
            return (
              <g key={`outer-${i}`}>
                <rect
                  x={x - 8}
                  y={y - 5}
                  width="16"
                  height="10"
                  rx="2"
                  fill={isN ? C.red : C.accent}
                  opacity="0.8"
                  transform={`rotate(${(i * 360) / numMagnets + angle}, ${x}, ${y})`}
                />
                <text
                  x={x}
                  y={y + 3}
                  fill="white"
                  fontSize="6"
                  textAnchor="middle"
                  fontWeight="bold"
                  transform={`rotate(${(i * 360) / numMagnets + angle}, ${x}, ${y})`}
                >
                  {isN ? "N" : "S"}
                </text>
              </g>
            );
          })}

          {/* Stator (stationary center) */}
          <circle cx={cx} cy={cy} r={innerR} fill={C.navyMid} stroke={C.slate} strokeWidth="2" />

          {/* Stator coils — unfilled rings with pulsing opacity */}
          {Array.from({ length: 8 }, (_, i) => {
            const a = ((i * 360) / 8) * (Math.PI / 180);
            const x = cx + Math.cos(a) * 38;
            const y = cy + Math.sin(a) * 38;
            return (
              <circle
                key={`coil-${i}`}
                cx={x}
                cy={y}
                r="8"
                fill="none"
                stroke={C.gold}
                strokeWidth="1.5"
                opacity={0.4 + Math.sin(angle * 0.05 + i) * 0.4}
              />
            );
          })}

          {/* Center label */}
          <text x={cx} y={cy - 4} fill={C.white} fontSize="8" textAnchor="middle" fontWeight="bold">
            MAG
          </text>
          <text x={cx} y={cy + 6} fill={C.white} fontSize="8" textAnchor="middle" fontWeight="bold">
            DRIVE
          </text>

          {/* Force lines — between stator and magnets */}
          {Array.from({ length: 6 }, (_, i) => {
            const a = (((i * 60 + angle * 0.5) % 360) * Math.PI) / 180;
            const x1 = cx + Math.cos(a) * (innerR + 4);
            const y1 = cy + Math.sin(a) * (innerR + 4);
            const x2 = cx + Math.cos(a) * (magnetR - 12);
            const y2 = cy + Math.sin(a) * (magnetR - 12);
            return (
              <line
                key={`force-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={C.cyan}
                strokeWidth="1"
                strokeDasharray="2,3"
                opacity={0.3 + Math.sin(angle * 0.08 + i * 1.2) * 0.3}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Component 3 — BeforeAfterAnimation
   Faithful port: colored products, large metrics (22px), operator 🖐 icon,
   per-product tilt during jams, sensor dots with circles, recovering phase.
   ═══════════════════════════════════════════════════════════════════════════ */

function WithoutIntelliPak({ tick }: { tick: number }) {
  const beltY = 62;
  const prodY = 38;

  /* Products with varied sizes and colors */
  const manualProducts = [
    { id: 1, baseX: 10, size: 20, color: "#F87171" },
    { id: 2, baseX: 35, size: 22, color: "#FBBF24" },
    { id: 3, baseX: 52, size: 18, color: "#F87171" },
    { id: 4, baseX: 80, size: 21, color: "#FBBF24" },
    { id: 5, baseX: 100, size: 19, color: "#F87171" },
    { id: 6, baseX: 128, size: 22, color: "#FBBF24" },
    { id: 7, baseX: 148, size: 20, color: "#F87171" },
    { id: 8, baseX: 170, size: 18, color: "#FBBF24" },
  ];

  /* Jam cycle with recovery phase */
  const jamCycle = 180;
  const jamPhase = tick % jamCycle;
  const isJammed = jamPhase > 100 && jamPhase < 150;
  const isRecovering = jamPhase >= 150;
  const manualSpeed = isJammed ? 0 : isRecovering ? tick * 0.4 : tick * 0.9;
  const jamSqueeze = isJammed ? Math.min((jamPhase - 100) * 0.15, 4) : 0;

  /* OEE metrics */
  const baseManualOEE = 62;
  const manualOEEDelta = isJammed ? -12 : isRecovering ? -4 : Math.sin(tick * 0.02) * 3;
  const manualOEE = Math.round(baseManualOEE + manualOEEDelta);
  const manualCount = Math.floor(tick * 0.25 * (isJammed ? 0 : 1));

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: C.red, letterSpacing: "0.15em", fontWeight: 700, fontFamily: "monospace" }}>
            WITHOUT INTELLIPAK
          </div>
          <div style={{ fontSize: 11, color: C.slate, marginTop: 2 }}>Manual Infeed / Legacy System</div>
        </div>
        {isJammed && (
          <div
            style={{
              background: `${C.red}22`,
              border: `1px solid ${C.red}66`,
              borderRadius: 6,
              padding: "3px 10px",
              fontSize: 9,
              color: C.red,
              fontWeight: 800,
              letterSpacing: "0.1em",
              fontFamily: "monospace",
            }}
          >
            ⚠ LINE STOP
          </div>
        )}
      </div>

      {/* Belt SVG */}
      <div className="overflow-hidden rounded border border-white/10" style={{ backgroundColor: C.navyMid }}>
        <svg viewBox="0 0 220 90" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ display: "block" }}>
          {/* Belt */}
          <rect x="0" y={beltY} width="220" height="6" rx="3" fill={isJammed ? `${C.red}44` : C.navyLight} />
          {/* Belt texture lines */}
          {Array.from({ length: 14 }, (_, i) => (
            <line
              key={i}
              x1={(i * 16 + manualSpeed * 0.5) % 220}
              y1={beltY + 1}
              x2={(i * 16 + manualSpeed * 0.5) % 220}
              y2={beltY + 5}
              stroke={C.slate}
              strokeWidth="0.4"
              opacity="0.3"
            />
          ))}

          {/* Products — jittery, piling during jam, with per-product tilt */}
          {manualProducts.map((p, idx) => {
            const spacing = isJammed ? p.baseX - jamSqueeze * idx * 1.5 : p.baseX;
            const x = (spacing + manualSpeed * 0.5) % 210;
            const jX = isJammed
              ? Math.sin(tick * 0.3 + p.id) * 2
              : Math.sin(tick * 0.1 + p.id * 2.5) * 3;
            const jY = Math.cos(tick * 0.12 + p.id) * 2;
            const tilt = isJammed
              ? Math.sin(tick * 0.2 + idx) * 8
              : Math.sin(tick * 0.05 + idx) * 2;
            return (
              <g
                key={p.id}
                transform={`rotate(${tilt}, ${x + jX + p.size / 2}, ${prodY + jY + p.size / 2})`}
              >
                <rect
                  x={x + jX}
                  y={prodY + jY}
                  width={p.size}
                  height={p.size}
                  rx="2"
                  fill={p.color}
                  opacity={isJammed ? 0.95 : 0.75}
                />
              </g>
            );
          })}

          {/* Jam flash overlay */}
          {isJammed && (
            <rect
              x="0"
              y="0"
              width="220"
              height="90"
              fill={C.red}
              opacity={0.02 + Math.sin(tick * 0.3) * 0.03}
            />
          )}

          {/* Operator intervention icon during jam */}
          {isJammed && (
            <g opacity={0.5 + Math.sin(tick * 0.25) * 0.4}>
              <circle cx="190" cy="25" r="12" fill={C.red} opacity="0.15" />
              <text x="190" y="29" fill={C.red} fontSize="14" textAnchor="middle">
                🖐
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Metrics — large (22px) */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: "monospace" }}>
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: isJammed ? C.red : "#FBBF24",
              transition: "color 0.3s",
            }}
          >
            {manualOEE}%
          </div>
          <div style={{ fontSize: 9, color: C.slate, letterSpacing: "0.1em" }}>OEE</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.slate }}>
            {manualCount}
          </div>
          <div style={{ fontSize: 9, color: C.slate, letterSpacing: "0.1em" }}>PRODUCTS</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.red }}>
            {isJammed ? "DOWN" : "RUN"}
          </div>
          <div style={{ fontSize: 9, color: C.slate, letterSpacing: "0.1em" }}>STATUS</div>
        </div>
      </div>
    </div>
  );
}

function WithIntelliPak({ tick }: { tick: number }) {
  const beltY = 62;
  const prodY = 38;

  const ipSpeed = tick * 1.3;
  const ipProducts = [
    { id: 10, offset: 0 },
    { id: 11, offset: 30 },
    { id: 12, offset: 60 },
    { id: 13, offset: 90 },
    { id: 14, offset: 120 },
    { id: 15, offset: 150 },
    { id: 16, offset: 180 },
    { id: 17, offset: 210 },
    { id: 18, offset: 240 },
  ];
  const ipCycleLen = 270;
  const ipColors = [C.gold, C.cyan, C.green];

  /* OEE stays high */
  const ipOEE = Math.round(91 + Math.sin(tick * 0.015) * 1.5);
  const ipCount = Math.floor(tick * 0.48);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: C.gold, letterSpacing: "0.15em", fontWeight: 700, fontFamily: "monospace" }}>
            WITH INTELLIPAK
          </div>
          <div style={{ fontSize: 11, color: C.slate, marginTop: 2 }}>Automated Precision Infeed</div>
        </div>
        <div
          style={{
            background: `${C.green}22`,
            border: `1px solid ${C.green}44`,
            borderRadius: 6,
            padding: "3px 10px",
            fontSize: 9,
            color: C.green,
            fontWeight: 700,
            letterSpacing: "0.1em",
            fontFamily: "monospace",
          }}
        >
          ● RUNNING
        </div>
      </div>

      {/* Belt SVG */}
      <div className="overflow-hidden rounded border border-white/10" style={{ backgroundColor: C.navyMid }}>
        <svg viewBox="0 0 220 90" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ display: "block" }}>
          {/* Belt */}
          <rect x="0" y={beltY} width="220" height="6" rx="3" fill={C.navyLight} />
          {/* Belt texture lines */}
          {Array.from({ length: 14 }, (_, i) => (
            <line
              key={i}
              x1={(i * 16 + ipSpeed * 0.6) % 220}
              y1={beltY + 1}
              x2={(i * 16 + ipSpeed * 0.6) % 220}
              y2={beltY + 5}
              stroke={C.slate}
              strokeWidth="0.4"
              opacity="0.3"
            />
          ))}

          {/* Sensor beams with circle indicators */}
          {[55, 110, 165].map((sx, i) => (
            <g key={sx}>
              <line
                x1={sx}
                y1="28"
                x2={sx}
                y2={beltY - 2}
                stroke={C.cyan}
                strokeWidth="0.8"
                opacity={0.25 + Math.sin(tick * 0.15 + i * 1.5) * 0.25}
              />
              <circle
                cx={sx}
                cy="28"
                r="1.5"
                fill={C.cyan}
                opacity={0.4 + Math.sin(tick * 0.15 + i * 1.5) * 0.4}
              />
            </g>
          ))}

          {/* Products — smooth, evenly spaced, multi-color */}
          {ipProducts.map((p, idx) => {
            const x = (p.offset + ipSpeed * 0.6) % ipCycleLen;
            if (x > 220) return null;
            return (
              <rect
                key={p.id}
                x={x}
                y={prodY + 2}
                width={20}
                height={20}
                rx="3"
                fill={ipColors[idx % 3]}
                opacity="0.9"
              />
            );
          })}
        </svg>
      </div>

      {/* Metrics — large (22px) */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: "monospace" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>
            {ipOEE}%
          </div>
          <div style={{ fontSize: 9, color: C.slate, letterSpacing: "0.1em" }}>OEE</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.gold }}>
            {ipCount}
          </div>
          <div style={{ fontSize: 9, color: C.slate, letterSpacing: "0.1em" }}>PRODUCTS</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>
            RUN
          </div>
          <div style={{ fontSize: 9, color: C.slate, letterSpacing: "0.1em" }}>STATUS</div>
        </div>
      </div>
    </div>
  );
}

export function BeforeAfterAnimation() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 35);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Side by side belts */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* LEFT — Without */}
        <div
          className="rounded-xl overflow-hidden relative p-4"
          style={{
            background: `${C.navyLight}44`,
            border: `1px solid rgba(255,255,255,0.06)`,
          }}
        >
          <WithoutIntelliPak tick={tick} />
        </div>

        {/* RIGHT — With */}
        <div
          className="rounded-xl overflow-hidden relative p-4"
          style={{
            background: `${C.navyLight}44`,
            border: `1px solid rgba(255,255,255,0.06)`,
          }}
        >
          <WithIntelliPak tick={tick} />
        </div>
      </div>

      {/* Bottom comparison row */}
      <div
        className="flex flex-wrap justify-center gap-8 py-2.5"
        style={{ fontFamily: "monospace" }}
      >
        {[
          { label: "Line Stops", without: "Frequent", wit: "Near Zero" },
          { label: "Operator Intervention", without: "Constant", wit: "Hands-Off" },
          { label: "Throughput", without: "Inconsistent", wit: "Sustained" },
          { label: "Data Visibility", without: "None", wit: "Real-Time" },
        ].map((cmp) => (
          <div key={cmp.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.slate, letterSpacing: "0.1em", marginBottom: 4 }}>
              {cmp.label}
            </div>
            <div style={{ fontSize: 10, color: C.red, fontWeight: 600 }}>{cmp.without}</div>
            <div style={{ fontSize: 8, color: C.slate, margin: "2px 0" }}>↓</div>
            <div style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>{cmp.wit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
