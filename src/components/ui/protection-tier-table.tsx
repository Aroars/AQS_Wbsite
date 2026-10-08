import { CONVEYOR_ACCENT, protectionRatings } from "@/data/conveyors";

/**
 * The IP ladder AQS builds to, with the tier a page is about highlighted.
 * `surface` picks the wrapper ground: "card" on the page ground (default),
 * "page" when the table sits inside a card-surface band. The conveyor accent
 * only tints the highlighted row; all text is on the semantic tokens.
 */
export function ProtectionTierTable({ highlight, surface = "card" }: { highlight?: string; surface?: "card" | "page" }) {
  const accent = CONVEYOR_ACCENT;
  const wrap = surface === "page" ? "bg-surface-page" : "bg-surface-card";
  const head = surface === "page" ? "bg-surface-card" : "bg-surface-page";
  return (
    <div className={`rounded-xl overflow-hidden border border-border ${wrap}`}>
      <table className="w-full border-collapse text-left">
        <caption className={`text-left font-mono text-[0.58rem] tracking-[0.12em] uppercase text-accent-text px-5 pt-4 pb-2 ${head}`}>
          Ingress protection tiers
        </caption>
        <thead>
          <tr className={`font-mono text-[0.58rem] tracking-[0.08em] uppercase text-accent-text ${head}`}>
            <th scope="col" className="font-normal px-5 py-2">Rating</th>
            <th scope="col" className="font-normal px-5 py-2">Protects against</th>
            <th scope="col" className="font-normal px-5 py-2 hidden md:table-cell">Typical use</th>
          </tr>
        </thead>
        <tbody>
          {protectionRatings.map((r) => {
            const on = r.rating === highlight;
            return (
              <tr
                key={r.rating}
                className="border-t border-border-soft align-top"
                style={on ? { background: `${accent}14` } : undefined}
              >
                <th scope="row" className="font-mono text-[0.8rem] font-bold text-text-strong px-5 py-2.5">
                  {r.rating}
                </th>
                <td className="font-sans text-[0.82rem] text-text-body px-5 py-2.5">{r.description}</td>
                <td className="font-sans text-[0.82rem] text-text-body px-5 py-2.5 hidden md:table-cell">{r.application}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
