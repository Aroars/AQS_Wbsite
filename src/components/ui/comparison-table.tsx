"use client";

import { comparisonTable, type ComparisonValue } from "@/data/veripak-specs";

function Check() {
  return <span className="text-accent-text text-base">&#x2713;</span>;
}

function Cross() {
  return <span className="text-text-dim">&#x2715;</span>;
}

function Opt() {
  return (
    <span className="font-mono text-[0.58rem] text-text-dim border border-[rgba(245,166,35,0.3)] rounded px-1.5 py-0.5">
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
          <tr className="bg-surface-page">
            <th className="text-left px-4 py-3 font-mono text-accent-text text-[0.68rem] uppercase tracking-[0.1em] border-b border-border font-medium">
              Capability
            </th>
            {["Status Quo", "VeriPak", "VeriPak + Inspection"].map((h, i) => (
              <th
                key={h}
                className="text-center px-4 py-3 font-mono text-accent-text text-[0.68rem] uppercase tracking-[0.1em] border-b border-border"
                style={{
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
                background: idx % 2 ? "var(--surface-page)" : "transparent",
              }}
            >
              <td className="px-4 py-[11px] text-text-body text-[0.83rem] border-b border-border-soft">
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
                  className="text-center px-4 py-[11px] border-b border-border-soft"
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
