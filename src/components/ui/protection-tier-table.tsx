import { CONVEYOR_ACCENT, protectionRatings } from "@/data/conveyors";

/** The IP ladder AQS builds to, with the tier a page is about highlighted */
export function ProtectionTierTable({ highlight }: { highlight?: string }) {
  const accent = CONVEYOR_ACCENT;
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[rgba(17,34,64,0.5)]">
      <table className="w-full border-collapse text-left">
        <caption className="text-left font-mono text-[0.58rem] tracking-[0.12em] uppercase px-5 pt-4 pb-2" style={{ color: accent }}>
          Ingress protection tiers
        </caption>
        <thead>
          <tr className="font-mono text-[0.58rem] tracking-[0.08em] uppercase text-text-dim">
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
                className="border-t border-white/[0.06] align-top"
                style={on ? { background: `${accent}14` } : undefined}
              >
                <th scope="row" className="font-mono text-[0.8rem] font-bold px-5 py-2.5" style={{ color: on ? accent : "#fff" }}>
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
