import Link from "next/link";

export default function PostMagDriveVsConventionalGearbox() {
  return (
    <article className="max-w-[720px] mx-auto text-[0.95rem] leading-[1.8] text-[rgba(255,255,255,0.55)]">
      <p className="mb-4">
        Every conveyor on your packaging line has a motor and a drive mechanism. For decades, that meant a gearbox — a sealed housing full of oil and meshing gears that converts motor speed into belt motion. It works. But in sanitary food production environments, conventional gearboxes come with a set of problems that plant managers have simply learned to accept.
      </p>

      <p className="mb-4">
        Mag-Drive technology offers a fundamentally different approach: a magnetic direct-drive hub motor with no gears, no oil, and no physical contact between the drive components. The question isn&apos;t whether the technology works — it&apos;s whether the operational advantages justify the change.
      </p>

      <h2 className="text-white font-bold text-[1.25rem] mb-4 mt-10">
        The Problems with Conventional Gearboxes in Food Production
      </h2>

      <p className="mb-4">
        If you&apos;ve worked around packaging conveyors, you already know these:
      </p>

      <p className="mb-4">
        <strong className="text-white">Oil leaks.</strong> Gearbox seals degrade over time. When they fail — and they do — lubricant drips onto your conveyor frame, your product contact surfaces, or your floor. In a food production facility, an oil leak near a packaging line isn&apos;t just a maintenance issue. It&apos;s a contamination risk, a safety hazard, and potentially a line shutdown.
      </p>

      <p className="mb-4">
        <strong className="text-white">Scheduled maintenance.</strong> Gearboxes require periodic oil changes, seal inspections, and gear wear monitoring. That&apos;s planned downtime, maintenance labor, and consumable costs baked into your operating budget every year.
      </p>

      <p className="mb-4">
        <strong className="text-white">Backlash.</strong> Meshing gears have mechanical play. At low speeds or during direction changes, this backlash shows up as imprecise belt positioning. For basic transport conveyors, it doesn&apos;t matter much. For product gapping, collation, and timing — where every millimeter counts — backlash introduces variability that downstream machines can&apos;t tolerate.
      </p>

      <p className="mb-4">
        <strong className="text-white">Encoder cables and servo amplifiers.</strong> Precision gearbox conveyors typically need external encoders for position feedback and servo drives for closed-loop control. That&apos;s additional wiring, additional points of failure, and additional cost.
      </p>

      <h2 className="text-white font-bold text-[1.25rem] mb-4 mt-10">
        How Mag-Drive Works
      </h2>

      <p className="mb-4">
        Mag-Drive uses a synchronous magnetic direct-drive motor built directly into the conveyor&apos;s drive roller. Permanent magnets in the rotor interact with the stator field to produce motion — no physical contact between the moving parts.
      </p>

      <p className="mb-4">
        The key engineering differences:
      </p>

      <p className="mb-4">
        <strong className="text-white">No gears.</strong> The motor drives the roller directly through magnetic coupling. No meshing teeth means no oil, no backlash, and no gear wear.
      </p>

      <p className="mb-4">
        <strong className="text-white">No oil.</strong> The entire drive assembly is sealed and lubrication-free. It&apos;s fully rated to IP69K, meaning it can withstand high-pressure, high-temperature washdown without any risk of lubricant contamination.
      </p>

      <p className="mb-4">
        <strong className="text-white">Open-loop synchronous motion.</strong> Because the motor is synchronous — the rotor follows the magnetic field exactly — you get servo-like positional accuracy without an external encoder or servo amplifier. The motor inherently knows where it is based on the electrical input. This eliminates an entire layer of control hardware.
      </p>

      <p className="mb-4">
        <strong className="text-white">Hub-mounted.</strong> The motor sits inside the drive roller itself, not bolted to the side of the conveyor frame. This removes the external motor housing, coupling, and mounting bracket that traditional gearboxes require.
      </p>

      <h2 className="text-white font-bold text-[1.25rem] mb-4 mt-10">
        The Operational Comparison
      </h2>

      <p className="mb-4">
        Here&apos;s where the two technologies differ in daily operation:
      </p>

      <p className="mb-4">
        <strong className="text-white">Energy consumption.</strong> Mag-Drive&apos;s direct coupling and permanent magnet design delivers approximately 55% energy savings compared to a conventional gear motor driving the same load.
      </p>

      <p className="mb-4">
        <strong className="text-white">Sanitation time.</strong> Without an external gearbox housing, motor mounting bracket, or exposed cable runs, there are fewer surfaces to clean. Plants report reducing sanitation time by up to 50%.
      </p>

      <p className="mb-4">
        <strong className="text-white">Maintenance schedule.</strong> Mag-Drive motors carry a 3-year warranty. With no oil changes, no seal replacements, and no gear wear inspections, the preventive maintenance schedule for the drive itself is effectively zero during that period.
      </p>

      <p className="mb-4">
        <strong className="text-white">Precision.</strong> The synchronous design delivers servo-like accuracy for product gapping, batching, and timing. Feed rates up to 500 packages per minute are achievable with consistent product spacing.
      </p>

      <h2 className="text-white font-bold text-[1.25rem] mb-4 mt-10">
        When Mag-Drive Makes the Most Sense
      </h2>

      <p className="mb-4">
        Mag-Drive technology is most impactful on conveyors in the critical path between production equipment and downstream packaging machines — the infeed section where products need to be gapped, collated, merged, or timed.
      </p>

      <p className="mb-4">
        This is the zone where precision matters most, where contamination risk is highest, and where unplanned downtime has the biggest cascading effect on line throughput.
      </p>

      <p className="mb-4">
        For basic transport conveyors further downstream, conventional drives remain a cost-effective choice.
      </p>

      <h2 className="text-white font-bold text-[1.25rem] mb-4 mt-10">
        The Bottom Line
      </h2>

      <p className="mb-4">
        Conventional gearboxes work. But in sanitary food production environments — where oil contamination is a disqualifying risk, where maintenance downtime directly impacts OEE, and where product handling precision determines how fast your downstream machines can run — Mag-Drive eliminates problems that gearboxes can only manage.
      </p>

      <p className="mb-4 italic text-[rgba(255,255,255,0.45)]">
        AQS builds IntelliPak, a Mag-Drive powered smart infeed system for sanitary packaging lines.{" "}
        <Link href="/solutions/intellipak" className="text-accent-primary hover:underline">
          Learn more about IntelliPak &rarr;
        </Link>
      </p>
    </article>
  );
}
