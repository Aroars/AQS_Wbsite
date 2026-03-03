"use client";

import { useState, useEffect } from "react";

/* ─── Color Tokens ─── */
const C = {
  navy: "#1a1d2b",
  navyMid: "#112240",
  navyLight: "#1A3055",
  slate: "#8892B0",
  slateLight: "#A8B2D1",
  white: "#E6F1FF",
  gold: "#F5A623",
  goldDim: "#C4841A",
  cyan: "#00C6D7",
  green: "#34D399",
  red: "#F87171",
  accent: "#3B82F6",
};

/* ─── Helpers ─── */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49271;
  return x - Math.floor(x);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Component 1 — ConveyorAnimation
   ═══════════════════════════════════════════════════════════════════════════ */

interface InfeedProduct {
  id: number;
  baseX: number;
  width: number;
  height: number;
  color: string;
  jitterY: number;
}

interface OutfeedGroup {
  count: number;
  baseX: number;
}

function buildInfeedProducts(): InfeedProduct[] {
  const colors = [C.cyan, C.gold, C.accent, C.green, C.slateLight, C.goldDim, C.red];
  return Array.from({ length: 7 }, (_, i) => ({
    id: i,
    baseX: 20 + i * 26,
    width: 14 + seededRandom(i * 7) * 10,
    height: 16 + seededRandom(i * 13) * 12,
    color: colors[i % colors.length],
    jitterY: 0,
  }));
}

function buildOutfeedGroups(): OutfeedGroup[] {
  const pattern = [3, 2, 3, 2];
  const groups: OutfeedGroup[] = [];
  let x = 420;
  for (let g = 0; g < pattern.length; g++) {
    groups.push({ count: pattern[g], baseX: x });
    x += pattern[g] * 20 + 30;
  }
  return groups;
}

export function ConveyorAnimation() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 28);
    return () => clearInterval(id);
  }, []);

  const beltOffset = (tick * 1.8) % 40;
  const infeedProducts = buildInfeedProducts();
  const outfeedGroups = buildOutfeedGroups();

  /* belt texture lines */
  const beltLines: number[] = [];
  for (let x = -40; x < 740; x += 40) {
    beltLines.push(x + beltOffset);
  }

  /* sensor beam pulse */
  const sensorPulse = 0.3 + 0.7 * Math.abs(Math.sin(tick * 0.08));

  /* processing arrow bob */
  const arrowBob = Math.sin(tick * 0.1) * 3;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-[#112240]/60 p-2">
      <svg
        viewBox="0 0 720 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        style={{ display: "block" }}
      >
        {/* Belt base */}
        <rect x="0" y="55" width="720" height="18" rx="3" fill="#333845" />

        {/* Belt texture lines */}
        {beltLines.map((lx, i) => (
          <line
            key={i}
            x1={lx}
            y1="56"
            x2={lx}
            y2="72"
            stroke={C.slate}
            strokeWidth="0.5"
            opacity="0.35"
          />
        ))}

        {/* Zone dividers */}
        <line
          x1="210"
          y1="8"
          x2="210"
          y2="90"
          stroke={C.gold}
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.6"
        />
        <line
          x1="400"
          y1="8"
          x2="400"
          y2="90"
          stroke={C.gold}
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.6"
        />

        {/* Zone labels */}
        <text x="105" y="14" textAnchor="middle" fill={C.slateLight} fontSize="8" fontFamily="monospace">
          RANDOM INFEED
        </text>
        <text x="305" y="14" textAnchor="middle" fill={C.gold} fontSize="8" fontWeight="bold" fontFamily="monospace">
          INTELLIPAK ZONE
        </text>
        <text x="560" y="14" textAnchor="middle" fill={C.green} fontSize="8" fontFamily="monospace">
          BATCHED OUTPUT
        </text>

        {/* ── INFEED Products ── */}
        {infeedProducts.map((p) => {
          const drift = ((tick * 0.6 + p.baseX * 2) % 200);
          const px = 10 + drift;
          if (px > 205) return null;
          const jy = Math.sin(tick * 0.15 + p.id * 1.7) * 3;
          return (
            <rect
              key={`inf-${p.id}`}
              x={px}
              y={42 - p.height + jy}
              width={p.width}
              height={p.height}
              rx="2"
              fill={p.color}
              opacity="0.85"
            />
          );
        })}

        {/* ── INTELLIPAK Sensor beams ── */}
        {[0, 1, 2, 3, 4].map((i) => {
          const sx = 240 + i * 30;
          const beamOp = 0.2 + 0.6 * Math.abs(Math.sin(tick * 0.12 + i * 0.9));
          return (
            <line
              key={`beam-${i}`}
              x1={sx}
              y1="20"
              x2={sx}
              y2="54"
              stroke={C.cyan}
              strokeWidth="1.5"
              opacity={beamOp * sensorPulse}
            />
          );
        })}

        {/* Processing arrow */}
        <polygon
          points={`310,${34 + arrowBob} 330,${28 + arrowBob} 330,${24 + arrowBob} 350,${32 + arrowBob} 330,${40 + arrowBob} 330,${36 + arrowBob} 310,${36 + arrowBob}`}
          fill={C.gold}
          opacity="0.7"
        />

        {/* ── OUTFEED Batched products ── */}
        {outfeedGroups.map((group, gi) => {
          const groupDrift = ((tick * 0.8) % 300);
          const gx = group.baseX + groupDrift;
          if (gx > 740) return null;

          const productEls: React.ReactElement[] = [];
          const bracketX1 = gx;
          const bracketX2 = gx + group.count * 18;

          for (let pi = 0; pi < group.count; pi++) {
            const px = gx + pi * 18;
            if (px < 405 || px > 730) continue;
            productEls.push(
              <rect
                key={`out-${gi}-${pi}`}
                x={px}
                y="37"
                width="14"
                height="18"
                rx="2"
                fill={C.green}
                opacity="0.8"
              />
            );
          }

          /* bracket + count label */
          const midX = (bracketX1 + bracketX2) / 2;
          const showBracket = bracketX1 > 405 && bracketX2 < 730;

          return (
            <g key={`grp-${gi}`}>
              {productEls}
              {showBracket && (
                <>
                  {/* bracket top */}
                  <line x1={bracketX1} y1="30" x2={bracketX1} y2="34" stroke={C.slateLight} strokeWidth="0.8" />
                  <line x1={bracketX2} y1="30" x2={bracketX2} y2="34" stroke={C.slateLight} strokeWidth="0.8" />
                  <line x1={bracketX1} y1="30" x2={bracketX2} y2="30" stroke={C.slateLight} strokeWidth="0.8" />
                  {/* group count */}
                  <text x={midX} y="27" textAnchor="middle" fill={C.white} fontSize="7" fontFamily="monospace">
                    x{group.count}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Belt edge highlights */}
        <line x1="0" y1="55" x2="720" y2="55" stroke={C.slate} strokeWidth="0.5" opacity="0.3" />
        <line x1="0" y1="73" x2="720" y2="73" stroke={C.slate} strokeWidth="0.5" opacity="0.3" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Component 2 — MagDriveAnimation
   ═══════════════════════════════════════════════════════════════════════════ */

export function MagDriveAnimation() {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAngle((a) => (a + 2) % 360), 40);
    return () => clearInterval(id);
  }, []);

  const cx = 120;
  const cy = 120;
  const magnetR = 72;
  const statorR = 55;
  const magnetCount = 12;
  const coilCount = 8;

  /* force line pulse */
  const forceOpacity = 0.25 + 0.45 * Math.abs(Math.sin((angle * Math.PI) / 90));

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
          {/* Outer shell */}
          <circle
            cx={cx}
            cy={cy}
            r={90}
            fill="none"
            stroke={C.slate}
            strokeWidth="2.5"
            opacity="0.4"
          />

          {/* Force lines (dashed) between stator and magnets */}
          {Array.from({ length: 6 }, (_, i) => {
            const fa = (i * 60 + angle * 0.5) * (Math.PI / 180);
            const x1 = cx + Math.cos(fa) * (statorR + 2);
            const y1 = cy + Math.sin(fa) * (statorR + 2);
            const x2 = cx + Math.cos(fa) * (magnetR - 2);
            const y2 = cy + Math.sin(fa) * (magnetR - 2);
            return (
              <line
                key={`fl-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={C.cyan}
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity={forceOpacity}
              />
            );
          })}

          {/* Rotating magnets */}
          {Array.from({ length: magnetCount }, (_, i) => {
            const a = ((i * 360) / magnetCount + angle) * (Math.PI / 180);
            const mx = cx + Math.cos(a) * magnetR;
            const my = cy + Math.sin(a) * magnetR;
            const isN = i % 2 === 0;
            return (
              <g key={`mag-${i}`}>
                <rect
                  x={mx - 8}
                  y={my - 5}
                  width="16"
                  height="10"
                  rx="2"
                  fill={isN ? C.red : C.accent}
                  opacity="0.85"
                  transform={`rotate(${(i * 360) / magnetCount + angle}, ${mx}, ${my})`}
                />
                <text
                  x={mx}
                  y={my + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={C.white}
                  fontSize="6"
                  fontWeight="bold"
                  fontFamily="monospace"
                  transform={`rotate(${(i * 360) / magnetCount + angle}, ${mx}, ${my})`}
                >
                  {isN ? "N" : "S"}
                </text>
              </g>
            );
          })}

          {/* Inner stator circle */}
          <circle
            cx={cx}
            cy={cy}
            r={statorR}
            fill={C.navyMid}
            stroke={C.slateLight}
            strokeWidth="1.5"
            opacity="0.7"
          />

          {/* Stator coils (pulsing) */}
          {Array.from({ length: coilCount }, (_, i) => {
            const ca = (i * 360) / coilCount * (Math.PI / 180);
            const coilX = cx + Math.cos(ca) * (statorR - 14);
            const coilY = cy + Math.sin(ca) * (statorR - 14);
            const pulse = 0.4 + 0.6 * Math.abs(Math.sin((angle * Math.PI) / 180 + i * 0.8));
            return (
              <circle
                key={`coil-${i}`}
                cx={coilX}
                cy={coilY}
                r={6}
                fill={C.gold}
                opacity={pulse}
              />
            );
          })}

          {/* Center label */}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={C.white}
            fontSize="11"
            fontWeight="bold"
            fontFamily="monospace"
          >
            MAG
          </text>
          <text
            x={cx}
            y={cy + 9}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={C.white}
            fontSize="11"
            fontWeight="bold"
            fontFamily="monospace"
          >
            DRIVE
          </text>
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Component 3 — BeforeAfterAnimation
   ═══════════════════════════════════════════════════════════════════════════ */

interface BeltProduct {
  x: number;
  tilt: number;
}

function WithoutIntelliPak({ tick }: { tick: number }) {
  const cycleLen = 180;
  const cycleTick = tick % cycleLen;
  const isJammed = cycleTick >= 100 && cycleTick <= 150;
  const jamProgress = isJammed ? (cycleTick - 100) / 50 : 0;

  /* Products */
  const products: BeltProduct[] = [];
  for (let i = 0; i < 6; i++) {
    const spacing = 22 + seededRandom(i * 5) * 18;
    let px: number;
    if (isJammed) {
      /* pile-up: products compress toward jam point */
      const baseX = 20 + i * spacing;
      const jamX = 130;
      const compression = jamProgress * 0.6;
      px = baseX + (jamX - baseX) * compression;
    } else {
      px = ((20 + i * spacing + tick * 0.5) % 220);
    }
    const tilt = isJammed ? (seededRandom(i * 3 + 17) - 0.5) * jamProgress * 15 : 0;
    products.push({ x: px, tilt });
  }

  const beltColor = isJammed ? C.red : "#444B5C";
  const oee = isJammed ? Math.max(38, 62 - jamProgress * 24) : 62 + Math.sin(tick * 0.03) * 4;
  const productCount = Math.floor(tick * 0.12);
  const status = isJammed ? "DOWN" : "RUN";

  /* belt offset */
  const beltOffset = isJammed ? 0 : (tick * 1.2) % 30;

  return (
    <div>
      {/* Header badge */}
      <div className="mb-2 flex items-center justify-between">
        <span
          className="rounded px-2 py-0.5 text-xs font-bold tracking-wider"
          style={{ backgroundColor: C.navyLight, color: C.slateLight, fontFamily: "monospace" }}
        >
          WITHOUT INTELLIPAK
        </span>
        {isJammed && (
          <span
            className="flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold"
            style={{ backgroundColor: C.red, color: C.navy }}
          >
            <span role="img" aria-label="warning">&#9888;</span> LINE STOP <span role="img" aria-label="hand">&#9995;</span>
          </span>
        )}
      </div>

      {/* Belt SVG */}
      <div className="overflow-hidden rounded border border-white/10" style={{ backgroundColor: C.navyMid }}>
        <svg viewBox="0 0 220 70" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ display: "block" }}>
          {/* Belt */}
          <rect x="0" y="42" width="220" height="14" rx="2" fill={beltColor} opacity="0.7" />
          {/* Belt texture */}
          {Array.from({ length: 12 }, (_, i) => {
            const lx = (i * 20 + beltOffset) % 240 - 10;
            return (
              <line
                key={i}
                x1={lx}
                y1="43"
                x2={lx}
                y2="55"
                stroke={C.slate}
                strokeWidth="0.4"
                opacity="0.3"
              />
            );
          })}

          {/* Products */}
          {products.map((p, i) => (
            <rect
              key={i}
              x={p.x}
              y="26"
              width="14"
              height="16"
              rx="2"
              fill={C.slateLight}
              opacity="0.75"
              transform={`rotate(${p.tilt}, ${p.x + 7}, ${26 + 8})`}
            />
          ))}

          {/* Jam flash overlay */}
          {isJammed && (
            <rect
              x="0"
              y="0"
              width="220"
              height="70"
              fill={C.red}
              opacity={0.06 + 0.06 * Math.sin(tick * 0.4)}
            />
          )}
        </svg>
      </div>

      {/* Metrics */}
      <div
        className="mt-2 grid grid-cols-3 gap-2 rounded px-2 py-1.5 text-center"
        style={{ backgroundColor: C.navy, fontFamily: "monospace" }}
      >
        <div>
          <div style={{ color: C.slate, fontSize: 9 }}>OEE</div>
          <div style={{ color: isJammed ? C.red : C.slateLight, fontSize: 13, fontWeight: "bold" }}>
            {oee.toFixed(0)}%
          </div>
        </div>
        <div>
          <div style={{ color: C.slate, fontSize: 9 }}>PRODUCTS</div>
          <div style={{ color: C.slateLight, fontSize: 13, fontWeight: "bold" }}>
            {productCount}
          </div>
        </div>
        <div>
          <div style={{ color: C.slate, fontSize: 9 }}>STATUS</div>
          <div
            style={{
              color: status === "DOWN" ? C.red : C.green,
              fontSize: 13,
              fontWeight: "bold",
            }}
          >
            {status}
          </div>
        </div>
      </div>
    </div>
  );
}

function WithIntelliPak({ tick }: { tick: number }) {
  const beltOffset = (tick * 1.4) % 30;
  const oee = 91 + Math.sin(tick * 0.02) * 1.5;
  const productCount = Math.floor(tick * 0.18);

  /* Evenly spaced products */
  const products: number[] = [];
  for (let i = 0; i < 7; i++) {
    const px = ((i * 28 + tick * 0.7) % 230) - 5;
    if (px >= 0 && px <= 210) products.push(px);
  }

  /* Sensor beam pulse */
  const sensorPulse = 0.3 + 0.5 * Math.abs(Math.sin(tick * 0.1));

  return (
    <div>
      {/* Header badge */}
      <div className="mb-2 flex items-center justify-between">
        <span
          className="rounded px-2 py-0.5 text-xs font-bold tracking-wider"
          style={{ backgroundColor: C.navyLight, color: C.gold, fontFamily: "monospace" }}
        >
          WITH INTELLIPAK
        </span>
        <span
          className="flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold"
          style={{ backgroundColor: `${C.green}22`, color: C.green }}
        >
          <span style={{ fontSize: 8 }}>{"\u25CF"}</span> RUNNING
        </span>
      </div>

      {/* Belt SVG */}
      <div className="overflow-hidden rounded border border-white/10" style={{ backgroundColor: C.navyMid }}>
        <svg viewBox="0 0 220 70" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ display: "block" }}>
          {/* Belt */}
          <rect x="0" y="42" width="220" height="14" rx="2" fill="#444B5C" opacity="0.7" />
          {/* Belt texture */}
          {Array.from({ length: 12 }, (_, i) => {
            const lx = (i * 20 + beltOffset) % 240 - 10;
            return (
              <line
                key={i}
                x1={lx}
                y1="43"
                x2={lx}
                y2="55"
                stroke={C.slate}
                strokeWidth="0.4"
                opacity="0.3"
              />
            );
          })}

          {/* Sensor beams */}
          {[55, 110, 165].map((sx, i) => (
            <line
              key={`sb-${i}`}
              x1={sx}
              y1="12"
              x2={sx}
              y2="41"
              stroke={C.cyan}
              strokeWidth="1"
              opacity={sensorPulse}
            />
          ))}

          {/* Products (evenly spaced) */}
          {products.map((px, i) => (
            <rect
              key={i}
              x={px}
              y="26"
              width="14"
              height="16"
              rx="2"
              fill={C.green}
              opacity="0.8"
            />
          ))}
        </svg>
      </div>

      {/* Metrics */}
      <div
        className="mt-2 grid grid-cols-3 gap-2 rounded px-2 py-1.5 text-center"
        style={{ backgroundColor: C.navy, fontFamily: "monospace" }}
      >
        <div>
          <div style={{ color: C.slate, fontSize: 9 }}>OEE</div>
          <div style={{ color: C.green, fontSize: 13, fontWeight: "bold" }}>
            {oee.toFixed(0)}%
          </div>
        </div>
        <div>
          <div style={{ color: C.slate, fontSize: 9 }}>PRODUCTS</div>
          <div style={{ color: C.slateLight, fontSize: 13, fontWeight: "bold" }}>
            {productCount}
          </div>
        </div>
        <div>
          <div style={{ color: C.slate, fontSize: 9 }}>STATUS</div>
          <div style={{ color: C.green, fontSize: 13, fontWeight: "bold" }}>RUN</div>
        </div>
      </div>
    </div>
  );
}

const comparisonItems = [
  { label: "Line Stops", without: "Frequent", with: "Near Zero", color: C.red, goodColor: C.green },
  { label: "Operator Intervention", without: "Constant", with: "Minimal", color: C.red, goodColor: C.green },
  { label: "Throughput", without: "Inconsistent", with: "+26% Avg", color: C.slateLight, goodColor: C.gold },
  { label: "Data Visibility", without: "None", with: "Real-time", color: C.slateLight, goodColor: C.cyan },
];

export function BeforeAfterAnimation() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 28);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Side by side belts */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* LEFT — Without */}
        <div
          className="rounded-xl border border-white/10 p-3"
          style={{ backgroundColor: `${C.navyMid}99` }}
        >
          <WithoutIntelliPak tick={tick} />
        </div>

        {/* RIGHT — With */}
        <div
          className="rounded-xl border border-white/10 p-3"
          style={{ backgroundColor: `${C.navyMid}99` }}
        >
          <WithIntelliPak tick={tick} />
        </div>
      </div>

      {/* Bottom comparison row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {comparisonItems.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-white/5 p-3 text-center"
            style={{ backgroundColor: C.navyMid, fontFamily: "monospace" }}
          >
            <div style={{ color: C.slate, fontSize: 10, marginBottom: 6 }}>{item.label}</div>
            <div className="flex items-center justify-center gap-2 text-xs">
              <span style={{ color: item.color, fontWeight: "bold" }}>{item.without}</span>
              <span style={{ color: C.slate }}>{"\u2192"}</span>
              <span style={{ color: item.goodColor, fontWeight: "bold" }}>{item.with}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
