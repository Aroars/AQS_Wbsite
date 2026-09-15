import Link from "next/link";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { CONVEYOR_ACCENT, categories, familyCompare } from "@/data/conveyors";

const accent = CONVEYOR_ACCENT;

const rows: { key: keyof Omit<(typeof familyCompare)[number], "family">; label: string }[] = [
  { key: "moves", label: "What it moves" },
  { key: "drive", label: "How it's driven" },
  { key: "load", label: "Load" },
  { key: "environments", label: "Environments" },
  { key: "controls", label: "Where the controls live" },
];

/** One row per question, one column per family — the fastest answer to "which family am I?" */
export function FamilyCompare() {
  return (
    <section className="py-[64px] px-8">
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection>
          <SectionLabel>Compare the Families</SectionLabel>
          <SectionTitle>Which family is your line?</SectionTitle>
          <SectionDesc>
            Belt carries product on a surface, MDR drives rollers one zone at a time, pallet takes the
            weight at the end of the line. The differences that matter, side by side.
          </SectionDesc>
        </AnimatedSection>
        <AnimatedSection delay={0.05}>
          <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[rgba(17,34,64,0.5)]">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th scope="col" className="w-[18%] px-5 py-4" />
                  {familyCompare.map((f) => {
                    const cat = categories.find((c) => c.slug === f.family)!;
                    return (
                      <th key={f.family} scope="col" className="px-5 py-4 align-bottom">
                        <Link href={`/solutions/conveyors/${cat.slug}`} className="no-underline group">
                          <div className="font-mono text-[0.56rem] tracking-[0.12em] uppercase mb-1" style={{ color: accent }}>
                            {cat.shortTitle}
                          </div>
                          <div className="font-sans text-[1rem] font-bold text-white group-hover:text-[#cbd5e1] transition-colors">
                            {cat.title}
                          </div>
                        </Link>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key} className="border-t border-white/[0.06] align-top">
                    <th scope="row" className="font-mono text-[0.62rem] tracking-[0.08em] uppercase text-text-dim font-normal px-5 py-3.5">
                      {r.label}
                    </th>
                    {familyCompare.map((f) => (
                      <td key={f.family} className="font-sans text-[0.84rem] text-text-body leading-[1.55] px-5 py-3.5">
                        {f[r.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
