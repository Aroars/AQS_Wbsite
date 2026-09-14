import { CONVEYOR_ACCENT, isFilled, type SpecRow } from "@/data/conveyors";

/**
 * Two-column specification table. Rows whose value is empty or the TODO
 * sentinel are dropped, and the table renders nothing when no row survives,
 * so an unfinished spec never shows a blank cell.
 */
export function SpecTable({ rows, caption, accent = CONVEYOR_ACCENT }: { rows: SpecRow[]; caption?: string; accent?: string }) {
  const filled = rows.filter((r) => isFilled(r.value));
  if (filled.length === 0) return null;
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[rgba(17,34,64,0.5)]">
      <table className="w-full border-collapse text-left">
        {caption && (
          <caption className="text-left font-mono text-[0.58rem] tracking-[0.12em] uppercase px-5 pt-4 pb-2" style={{ color: accent }}>
            {caption}
          </caption>
        )}
        <tbody>
          {filled.map((r) => (
            <tr key={r.label} className="border-t border-white/[0.06] align-top">
              <th scope="row" className="font-mono text-[0.62rem] tracking-[0.08em] uppercase text-text-dim font-normal px-5 py-3 w-[38%] md:w-[30%]">
                {r.label}
              </th>
              <td className="font-sans text-[0.88rem] text-white px-5 py-3 leading-[1.55]">
                {r.value}
                {r.note && <div className="font-sans text-[0.74rem] text-text-dim mt-0.5">{r.note}</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
