"use client";

import { comparisonTable, type ComparisonValue } from "@/data/veripak-specs";

function Check() {
  return <span className="text-accent-primary text-base">&#x2713;</span>;
}

function Cross() {
  return <span className="text-white/10">&#x2715;</span>;
}

function Opt() {
  return (
    <span className="font-mono text-[0.58rem] text-[#f5a623] border border-[rgba(245,166,35,0.3)] rounded px-1.5 py-0.5">
      OPT
    </span>
  );
}

function CellValue({ value }: { value: ComparisonValue }) {
  if (value === true) return <Check />;
  if (value === "opt") return <Opt />;
  return <Cross />;
}

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-sans">
        <thead>
          <tr>
            <th className="text-left px-4 py-3 text-text-dim text-[0.68rem] uppercase tracking-[0.1em] border-b border-border-default font-medium">
              Capability
            </th>
            {["Status Quo", "VeriPak", "VeriPak + Inspection"].map((h, i) => (
              <th
                key={h}
                className="text-center px-4 py-3 text-[0.72rem] border-b border-border-default"
                style={{
                  color: i === 2 ? "#00c2ff" : "rgba(255,255,255,0.6)",
                  fontWeight: i === 2 ? 700 : 500,
                  background:
                    i === 2 ? "rgba(0,194,255,0.05)" : "transparent",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonTable.map((row, idx) => (
            <tr
              key={idx}
              style={{
                background: idx % 2 ? "rgba(0,0,0,0.1)" : "transparent",
              }}
            >
              <td className="px-4 py-[11px] text-white/60 text-[0.83rem] border-b border-black/10">
                {row.feature}
              </td>
              {(
                [
                  row.statusQuo,
                  row.veripak,
                  row.veripakInspection,
                ] as ComparisonValue[]
              ).map((val, i) => (
                <td
                  key={i}
                  className="text-center px-4 py-[11px] border-b border-black/10"
                  style={{
                    background:
                      i === 2 ? "rgba(0,194,255,0.05)" : "transparent",
                  }}
                >
                  <CellValue value={val} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
