import { isFilled, type SpecRow } from "@/data/conveyors";

/**
 * Two-column specification table. Rows whose value is empty or the TODO
 * sentinel are dropped, and the table renders nothing when no row survives,
 * so an unfinished spec never shows a blank cell.
 *
 * `surface` picks the wrapper ground: "card" on the page ground (default),
 * "page" when the table sits inside a card-surface band, so the two always
 * alternate. The accent colour is no longer used as text (plan section 3).
 */
export function SpecTable({
  rows,
  caption,
  surface = "card",
}: {
  rows: SpecRow[];
  caption?: string;
  /** Kept for callers that still pass it; text uses the semantic accent */
  accent?: string;
  surface?: "card" | "page";
}) {
  const filled = rows.filter((r) => isFilled(r.value));
  if (filled.length === 0) return null;
  const wrap = surface === "page" ? "bg-surface-page" : "bg-surface-card";
  const head = surface === "page" ? "bg-surface-card" : "bg-surface-page";
  return (
    <div className={`rounded-xl overflow-hidden border border-border ${wrap}`}>
      <table className="w-full border-collapse text-left">
        {caption && (
          <caption className={`text-left font-mono text-[0.58rem] tracking-[0.12em] uppercase text-accent-text px-5 py-3 ${head}`}>
            {caption}
          </caption>
        )}
        <tbody>
          {filled.map((r) => (
            <tr key={r.label} className="border-t border-border-soft align-top">
              <th scope="row" className="font-mono text-[0.62rem] tracking-[0.08em] uppercase text-text-strong font-normal px-5 py-3 w-[38%] md:w-[30%]">
                {r.label}
              </th>
              <td className="font-sans text-[0.88rem] text-text-body px-5 py-3 leading-[1.55]">
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
