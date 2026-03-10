"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Design tokens matching AQS site ───
const COLORS = {
  navy: "#0B1A2E",
  navyMid: "#112240",
  navyLight: "#1A3055",
  slate: "#8892B0",
  slateLight: "#A8B2D1",
  white: "#E6F1FF",
  gold: "#F5A623",
  cyan: "#00C6D7",
  green: "#34D399",
  red: "#F87171",
  accent: "#3B82F6",
};

const PRODUCT_COLORS = ["#F5A623", "#00C6D7", "#34D399", "#3B82F6", "#F87171"];

// ─── Simulation constants ───
const BELT_Y = 200;
const BELT_HEIGHT = 36;
const PRODUCT_SIZE = 24;
const SENSOR_HEIGHT = 60;
const CANVAS_HEIGHT = 320;
const MIN_GAP = 6;

// Belt zone boundaries
const ZONES = {
  infeed: { start: 0, end: 180, label: "RANDOM INFEED" },
  gapping: { start: 200, end: 360, label: "INTELLIPAK GAPPING" },
  batching: { start: 380, end: 880, label: "INTELLIPAK BATCHING" },
  output: { start: 900, end: 1100, label: "GROUPED OUTPUT" },
};

const SENSORS = [195, 375, 895];

interface Product {
  id: string;
  x: number;
  color: string;
  speed: number;
  zone: string;
  batchGroup: number;
  opacity: number;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function BatchDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const productsRef = useRef<Product[]>([]);
  const spawnTimerRef = useRef(0);
  const batchBufferRef = useRef<Product[]>([]);
  const batchCountRef = useRef(0);
  const [batchSize, setBatchSize] = useState(4);
  const [ppm, setPpm] = useState(200);
  const batchSizeRef = useRef(4);
  const ppmRef = useRef(200);
  const transitionFlash = useRef(0);

  // Keep refs in sync
  useEffect(() => {
    if (batchSizeRef.current !== batchSize) {
      transitionFlash.current = 30;
      batchBufferRef.current = [];
      batchCountRef.current = 0;
    }
    batchSizeRef.current = batchSize;
  }, [batchSize]);

  useEffect(() => {
    ppmRef.current = ppm;
  }, [ppm]);

  const spawnProduct = useCallback((startX?: number): Product => {
    // Incoming speed scales with PPM — half-rate representation
    const halfSf = (ppmRef.current / 2) / 200;
    return {
      id: generateId(),
      x: startX !== undefined ? startX : -PRODUCT_SIZE - Math.random() * 20,
      color: PRODUCT_COLORS[Math.floor(Math.random() * PRODUCT_COLORS.length)],
      speed: (0.8 + Math.random() * 0.8) * halfSf,
      zone: "infeed",
      batchGroup: -1,
      opacity: 1,
    };
  }, []);

  // Pre-seed products
  useEffect(() => {
    if (productsRef.current.length === 0) {
      let seedX = 5;
      for (let i = 0; i < 12; i++) {
        productsRef.current.push(spawnProduct(seedX));
        seedX += PRODUCT_SIZE + MIN_GAP + Math.random() * 25 + 8;
      }
    }
  }, [spawnProduct]);

  const canSpawn = useCallback(() => {
    const products = productsRef.current;
    for (let i = 0; i < products.length; i++) {
      if (products[i].x < PRODUCT_SIZE + MIN_GAP + 5) return false;
    }
    return true;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const sf = ppmRef.current / 200;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = COLORS.navyMid;
    ctx.fillRect(0, 0, W, H);

    // ─── Belt zones ───
    Object.entries(ZONES).forEach(([key, zone]) => {
      const isIP = key === "gapping" || key === "batching";

      ctx.fillStyle = isIP ? "rgba(245,166,35,0.06)" : "rgba(255,255,255,0.02)";
      ctx.fillRect(zone.start, BELT_Y - 50, zone.end - zone.start, BELT_HEIGHT + 80);

      if (isIP) {
        ctx.strokeStyle = "rgba(245,166,35,0.25)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(zone.start, BELT_Y - 50, zone.end - zone.start, BELT_HEIGHT + 80);
        ctx.setLineDash([]);
      }

      ctx.fillStyle = isIP ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.08)";
      ctx.fillRect(zone.start, BELT_Y, zone.end - zone.start, BELT_HEIGHT);

      // Belt ticks
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      const tickOffset = (Date.now() * 0.05 * sf) % 20;
      for (let tx = zone.start + tickOffset; tx < zone.end; tx += 20) {
        ctx.fillRect(tx, BELT_Y + BELT_HEIGHT - 3, 8, 2);
      }

      ctx.fillStyle = isIP ? COLORS.gold : COLORS.slate;
      ctx.font = "600 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(zone.label, zone.start + (zone.end - zone.start) / 2, BELT_Y + BELT_HEIGHT + 50);
    });

    // ─── Belt zone dividers ───
    const numBeltZones = Math.min(batchSizeRef.current + 1, 7);
    const batchZoneWidth = ZONES.batching.end - ZONES.batching.start;
    const beltZoneWidth = batchZoneWidth / numBeltZones;

    // Gapping: 2 belts
    const gapMid = (ZONES.gapping.start + ZONES.gapping.end) / 2;
    ctx.strokeStyle = "rgba(245,166,35,0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(gapMid, BELT_Y - 2);
    ctx.lineTo(gapMid, BELT_Y + BELT_HEIGHT + 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Batching: variable zones
    ctx.strokeStyle = "rgba(245,166,35,0.3)";
    ctx.setLineDash([2, 3]);
    for (let i = 1; i < numBeltZones; i++) {
      const bx = ZONES.batching.start + i * beltZoneWidth;
      ctx.beginPath();
      ctx.moveTo(bx, BELT_Y - 2);
      ctx.lineTo(bx, BELT_Y + BELT_HEIGHT + 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Zone count labels
    ctx.fillStyle = "rgba(245,166,35,0.5)";
    ctx.font = "600 8px monospace";
    ctx.textAlign = "center";
    ctx.fillText("2 BELT ZONES", (ZONES.gapping.start + ZONES.gapping.end) / 2, BELT_Y + BELT_HEIGHT + 35);
    ctx.fillText(`${numBeltZones} BELT ZONES`, ZONES.batching.start + batchZoneWidth / 2, BELT_Y + BELT_HEIGHT + 35);

    // ─── Sensors ───
    SENSORS.forEach((sx) => {
      const grad = ctx.createLinearGradient(sx, BELT_Y - SENSOR_HEIGHT, sx, BELT_Y + BELT_HEIGHT + SENSOR_HEIGHT);
      grad.addColorStop(0, "rgba(0,198,215,0)");
      grad.addColorStop(0.3, "rgba(0,198,215,0.6)");
      grad.addColorStop(0.5, "rgba(0,198,215,0.9)");
      grad.addColorStop(0.7, "rgba(0,198,215,0.6)");
      grad.addColorStop(1, "rgba(0,198,215,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, BELT_Y - SENSOR_HEIGHT);
      ctx.lineTo(sx, BELT_Y + BELT_HEIGHT + SENSOR_HEIGHT);
      ctx.stroke();

      ctx.fillStyle = COLORS.cyan;
      ctx.beginPath();
      ctx.arc(sx, BELT_Y - SENSOR_HEIGHT - 4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(0,198,215,0.15)";
      ctx.beginPath();
      ctx.arc(sx, BELT_Y - SENSOR_HEIGHT - 4, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // ─── Products ───
    const prodY = BELT_Y + (BELT_HEIGHT - PRODUCT_SIZE) / 2;
    productsRef.current.forEach((p) => {
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      roundRect(ctx, p.x + 2, prodY + 2, PRODUCT_SIZE, PRODUCT_SIZE, 4);
      ctx.fill();
      ctx.fillStyle = p.color;
      roundRect(ctx, p.x, prodY, PRODUCT_SIZE, PRODUCT_SIZE, 4);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      roundRect(ctx, p.x + 2, prodY + 2, PRODUCT_SIZE - 4, PRODUCT_SIZE / 2 - 2, 3);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // ─── Batch brackets ───
    const groups: Record<number, Product[]> = {};
    productsRef.current.forEach((p) => {
      if (p.batchGroup >= 0) {
        if (!groups[p.batchGroup]) groups[p.batchGroup] = [];
        groups[p.batchGroup].push(p);
      }
    });
    Object.values(groups).forEach((items) => {
      if (items.length < 2) return;
      const minX = Math.min(...items.map((p) => p.x));
      const maxX = Math.max(...items.map((p) => p.x + PRODUCT_SIZE));
      const bracketY = BELT_Y - 28;

      ctx.strokeStyle = COLORS.gold;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(minX, bracketY + 10);
      ctx.lineTo(minX, bracketY);
      ctx.lineTo(maxX, bracketY);
      ctx.lineTo(maxX, bracketY + 10);
      ctx.stroke();

      ctx.fillStyle = COLORS.gold;
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`×${items.length}`, (minX + maxX) / 2, bracketY - 5);
    });

    // ─── Transition flash ───
    if (transitionFlash.current > 0) {
      const alpha = (transitionFlash.current / 30) * 0.15;
      ctx.fillStyle = `rgba(245,166,35,${alpha})`;
      ctx.fillRect(ZONES.batching.start, BELT_Y - 50, batchZoneWidth, BELT_HEIGHT + 80);
      transitionFlash.current--;
    }
  }, []);

  const update = useCallback(() => {
    const currentBatchSize = batchSizeRef.current;
    const products = productsRef.current;
    const sf = ppmRef.current / 200;

    // ─── Spawn — rate is half the PPM ───
    spawnTimerRef.current++;
    const halfSf = (ppmRef.current / 2) / 200;
    const interval = Math.max(12, Math.round(60 / halfSf)) + Math.floor(Math.random() * 8);
    if (spawnTimerRef.current >= interval) {
      if (canSpawn()) {
        spawnTimerRef.current = 0;
        products.push(spawnProduct());
      }
    }

    // ─── Update each product ───
    const halfSfMove = (ppmRef.current / 2) / 200;
    products.forEach((p) => {
      const cx = p.x + PRODUCT_SIZE / 2;

      if (cx < ZONES.gapping.start) {
        // ── INFEED: random speed scaled to half-PPM, collision avoidance ──
        p.zone = "infeed";
        // Re-scale base speed to current half-PPM each frame for responsiveness
        p.speed = (0.8 + Math.random() * 0.15) * halfSfMove;
        let nextSpeed = p.speed;
        let nearestDist = Infinity;
        for (let j = 0; j < products.length; j++) {
          const o = products[j];
          if (o.id !== p.id && o.x > p.x) {
            const dist = o.x - (p.x + PRODUCT_SIZE);
            if (dist < nearestDist) nearestDist = dist;
          }
        }
        if (nearestDist < MIN_GAP) {
          nextSpeed = 0;
        } else if (nearestDist < PRODUCT_SIZE + MIN_GAP) {
          nextSpeed = Math.min(nextSpeed, (nearestDist - MIN_GAP) * 0.15);
        }
        p.x += Math.max(0, nextSpeed);
      } else if (cx < ZONES.gapping.end) {
        // ── GAPPING: create consistent gaps ──
        p.zone = "gapping";
        const ahead = products.filter(
          (o) =>
            o.id !== p.id &&
            o.x > p.x &&
            o.x - p.x < 90 &&
            (o.zone === "gapping" || o.zone === "batching"),
        );
        if (ahead.length > 0) {
          const nearest = ahead.reduce((a, b) => (a.x < b.x ? a : b));
          const gap = nearest.x - (p.x + PRODUCT_SIZE);
          p.x += (gap < 38 ? 0.5 : 2.0) * sf;
        } else {
          p.x += 2.0 * sf;
        }
      } else if (cx < ZONES.batching.end) {
        // ── BATCHING: leader crawls/stops waiting for trailers to group up ──
        p.zone = "batching";

        if (p.batchGroup < 0) {
          if (!batchBufferRef.current.includes(p)) {
            batchBufferRef.current.push(p);
          }
          if (batchBufferRef.current.length >= currentBatchSize) {
            const groupId = batchCountRef.current++;
            batchBufferRef.current.forEach((bp) => (bp.batchGroup = groupId));
            batchBufferRef.current = [];
          }
        }

        if (p.batchGroup >= 0) {
          const myGroup = products
            .filter((o) => o.batchGroup === p.batchGroup)
            .sort((a, b) => a.x - b.x);
          const leader = myGroup[myGroup.length - 1];

          if (p.id === leader.id) {
            // Leader: check how far behind the trailer (last in group) is
            const trailer = myGroup[0];
            const groupSpan = leader.x - trailer.x;
            const idealSpan = (myGroup.length - 1) * (PRODUCT_SIZE + 4);

            // How "grouped" are we? 1.0 = perfectly tight, 0.0 = very spread out
            const groupedness = idealSpan > 0
              ? Math.max(0, 1 - (groupSpan - idealSpan) / (idealSpan * 2 + 40))
              : 1;

            if (groupedness > 0.9) {
              // Group is formed — move at normal output speed, check for groups ahead
              const groupsAhead = products.filter(
                (o) =>
                  o.batchGroup >= 0 &&
                  o.batchGroup !== p.batchGroup &&
                  o.x > p.x &&
                  o.x - p.x < 120,
              );
              if (groupsAhead.length > 0) {
                const nearestAhead = groupsAhead.reduce((a, b) => (a.x < b.x ? a : b));
                const groupGap = nearestAhead.x - (p.x + PRODUCT_SIZE);
                p.x += (groupGap < 60 ? 0.4 : 1.4) * sf;
              } else {
                p.x += 1.4 * sf;
              }
            } else {
              // Group not formed — leader crawls or stops, waiting for trailers
              // The more spread out, the slower the leader goes (down to 0)
              const crawlSpeed = groupedness * 0.4 * sf;
              p.x += crawlSpeed;
            }
          } else {
            // Trailer/middle: speed up to close gap with leader
            const idx = myGroup.indexOf(p);
            const targetX = leader.x - (myGroup.length - 1 - idx) * (PRODUCT_SIZE + 4);
            const distToTarget = targetX - p.x;

            if (distToTarget > 2) {
              // Accelerate toward target — faster when further away
              const catchUpSpeed = Math.min(distToTarget * 0.15, 3.5 * sf);
              p.x += Math.max(catchUpSpeed, 1.2 * sf);
            } else if (distToTarget > 0) {
              // Close — ease into position
              p.x += distToTarget * 0.3;
            } else {
              // Already at or past target — match leader
              p.x += (targetX - p.x) * 0.25;
            }
          }
        } else {
          // Unbatched product entering batching zone — move at moderate speed
          const batchedAhead = products.filter(
            (o) => o.batchGroup >= 0 && o.x > p.x && o.x - p.x < 60 && o.zone === "batching",
          );
          p.x += (batchedAhead.length > 0 ? 0.5 : 1.4) * sf;
        }
      } else {
        // ── OUTPUT: tight groups exit at steady speed ──
        p.zone = "output";
        if (p.batchGroup >= 0) {
          const myGroup = products
            .filter((o) => o.batchGroup === p.batchGroup)
            .sort((a, b) => a.x - b.x);
          const leader = myGroup[myGroup.length - 1];
          if (p.id === leader.id) {
            p.x += 1.6 * sf;
          } else {
            const idx = myGroup.indexOf(p);
            const targetX = leader.x - (myGroup.length - 1 - idx) * (PRODUCT_SIZE + 4);
            p.x += (targetX - p.x) * 0.2;
            if (p.x < targetX) p.x += 0.3 * sf;
          }
        } else {
          p.x += 1.6 * sf;
        }
      }
    });

    // Remove off-screen
    productsRef.current = products.filter((p) => p.x < 1150);
    batchBufferRef.current = batchBufferRef.current.filter((p) =>
      productsRef.current.includes(p),
    );
  }, [spawnProduct, canSpawn]);

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      update();
      draw();
    }, 16);
    return () => clearInterval(interval);
  }, [draw, update]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const container = canvas.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scale = Math.min(rect.width / 1100, 1);
      canvas.style.transform = `scale(${scale})`;
      canvas.style.transformOrigin = "top left";
      canvas.style.width = `${1100 * scale}px`;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const batchOptions = [3, 4, 6, 12];

  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{ background: COLORS.navyMid, border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <p
          className="font-mono text-[0.58rem] font-semibold tracking-[0.12em] uppercase mb-2"
          style={{ color: COLORS.gold }}
        >
          In Action
        </p>
        <h3 className="font-sans text-xl font-bold mb-1" style={{ color: COLORS.white }}>
          One System. Any Format. Change It on the Fly.
        </h3>
        <p className="font-sans text-sm mb-4" style={{ color: COLORS.slateLight }}>
          Select a batch configuration and adjust line speed to see the system respond in real time.
        </p>

        {/* Controls row */}
        <div className="flex gap-6 flex-wrap items-end">
          {/* Batch size toggles */}
          <div className="flex gap-2 flex-wrap">
            {batchOptions.map((size) => (
              <button
                key={size}
                onClick={() => setBatchSize(size)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  background: batchSize === size ? COLORS.gold : "rgba(255,255,255,0.06)",
                  color: batchSize === size ? COLORS.navy : COLORS.slateLight,
                  border: `1px solid ${batchSize === size ? COLORS.gold : "rgba(255,255,255,0.12)"}`,
                }}
              >
                Groups of {size}
              </button>
            ))}
          </div>

          {/* PPM slider */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs font-semibold whitespace-nowrap" style={{ color: COLORS.slateLight }}>
              Line Speed
            </span>
            <input
              type="range"
              min="50"
              max="300"
              step="25"
              value={ppm}
              onChange={(e) => setPpm(parseInt(e.target.value))}
              className="w-40 h-1.5 rounded-full outline-none cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.1)",
                accentColor: COLORS.gold,
              }}
            />
            <span
              className="font-mono text-sm font-bold"
              style={{ color: COLORS.gold, minWidth: 70, textAlign: "right" }}
            >
              {ppm} PPM
            </span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full overflow-hidden" style={{ height: CANVAS_HEIGHT }}>
        <canvas
          ref={canvasRef}
          width={1100}
          height={CANVAS_HEIGHT}
          style={{ display: "block" }}
        />
      </div>

      {/* Footer */}
      <div className="px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="font-sans text-xs" style={{ color: COLORS.slate }}>
          Batch sizes and line speeds are configured from the Allen-Bradley Optix HMI —
          switch formats between runs or mid-shift without stopping the line.
        </p>
      </div>
    </div>
  );
}
