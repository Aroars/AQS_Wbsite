import Link from "next/link";
import { Article, Lead, H2, P, Bullets, Steps, Callout, SpecTable, Figure, PdfDownload, Closing } from "./whitepaper-parts";

/* White paper: densification pallet tote filling. Customer anonymized —
   "a frozen vegetable processor in the Upper Midwest" — do not name it. */

export default function PostAutomatedToteFilling() {
  return (
    <Article>
      <Lead>
        Inside a densification pallet filling system built for frozen vegetable processing, where the product is heavy,
        the room is cold, and the labor is hard to keep.
      </Lead>

      <Figure
        src="/images/blog/tote-filling-system-24v-mdr-pallet-loop.jpg"
        alt="Stainless 24 VDC MDR pallet conveyor circuit with swept-radius corners and a scale deck, on the AQS shop floor"
        caption="The densification pallet filling system on the AQS shop floor before shipment: stainless 24 VDC MDR circuit with swept-radius corners and the scale deck at center."
        width={1800}
        height={1200}
        priority
      />

      <H2>Executive Summary</H2>
      <P>
        {`Bulk tote filling is one of the last stubbornly manual jobs in frozen food processing. Somebody has to stage the pallet, watch the fill, guess when it's settled, guess when it's full, and muscle it out of the way. In a cold room, that somebody is standing at 20 °F doing all of it.`}
      </P>
      <P>
        {`This paper walks through a densification pallet filling system AQS engineered, built, and commissioned for a frozen vegetable processor in the Upper Midwest. The system stages pallets of lined gaylord totes, positions each one under the plant's existing auger filler, fills to a recipe target weight on live load cells, vibrates the product to full density between fill passes, and accumulates finished totes for pickup. Up to seven pallets ride the line at once with zero-pressure accumulation. The operator touches the process twice: placing an empty pallet with a forklift, and removing a full one.`}
      </P>
      <Bullets
        items={[
          "Weighs live to 1% accuracy at up to 2,500 lb, with fills targeting 1,400 to 1,800 lb per tote",
          "Runs up to 10 pallets per hour in a 0 to 20 °F room, fully rated for the cold",
          "Densifies product with recipe-controlled settle cycles, so totes leave full by weight and by volume",
          "Controls the plant's existing auger filler through a simple dry-contact interlock; no filler replacement required",
          "Type 304 stainless construction, wipe-down sanitary design, 24 VDC motorized-roller conveyance",
        ]}
      />
      <Callout label="The short version">
        Empty pallet in, 1,400-pound tote out, accurate to 1%, at 20 degrees, without a person standing in the cold to
        make it happen.
      </Callout>

      <H2>The Job Nobody Wants at 20 Degrees</H2>
      <P>
        Frozen vegetable processors move enormous volumes of product into corrugated gaylord totes for storage,
        blending, and repack. The totes are cheap. Filling them well is not.
      </P>
      <P>
        {`Filled by hand and eye, totes come out inconsistent. Underfill a tote and you pay for it in freight and storage, because you're shipping air in a box that costs the same to move full. Overfill it and you're giving product away or straining the packaging. Fill it fast without settling and the tote is full by volume but light by weight, because IQF product bridges and stacks loose until vibration packs it down.`}
      </P>
      <P>
        {`Then there's the labor. Cold-room positions are among the hardest jobs to staff and keep staffed in any plant. Every task moved out of the freezer and onto a forklift seat is a retention problem you no longer have.`}
      </P>
      <P>
        The processor in this case ran exactly that playbook and wanted out of it: automated filling under their
        existing auger filler, accurate final weights, denser totes, and staffing reduced to pallet exchange.
      </P>

      <H2>The System at a Glance</H2>
      <P>
        {`The system is a U-shaped circuit of seven pallet positions built from 24 VDC motorized-drive-roller (MDR) conveyor: three infeed staging zones, one fill zone, and three discharge accumulation zones. Swept-radius corner conveyors carry pallets around each 90-degree bend on tapered rollers, a deliberate choice that eliminates pneumatic transfer devices from the cold room entirely. Fewer actuators, fewer failure points, nothing to freeze.`}
      </P>
      <P>
        {`At the center of the line, the fill zone rides on four precision load cells above a densification deck. When a pallet arrives, the conveyor locks still, the scale tares to the empty tote, and the system closes a dry contact that tells the plant's existing auger filler to run. From that moment the line owns the fill.`}
      </P>
      <SpecTable
        head={["Parameter", "Specification"]}
        rows={[
          ["Throughput", "Up to 10 pallets per hour, dependent on fill rate"],
          ["Weighing accuracy", "1% of span at up to 2,500 lb live load"],
          ["Tote fill weight", "1,400 lb nominal, up to 1,800 lb"],
          ["Accumulation", "Zero-pressure; up to 7 pallets on the system"],
          ["Environment", "0 to 20 °F room; freezer-rated components throughout"],
          ["Construction", "Type 304 stainless frames; zinc-coated rollers; wipe-down sanitary design"],
          ["Conveyance", "24 VDC MDR with decentralized zone control; IP67 zone electronics"],
          ["Controls", "Allen-Bradley CompactLogix PLC, color touchscreen HMI, 100-slot recipe library"],
          ["Filler interface", "Single 24 VDC dry-contact interlock to the existing auger filler"],
          ["Pallets", "Standard 40 × 48 in GMA-style pallets, either orientation leading"],
        ]}
      />

      <H2>How a Fill Cycle Works</H2>
      <Steps
        items={[
          { name: "Stage", body: "A forklift sets an empty pallet with a lined gaylord on the infeed. Zero-pressure accumulation walks it forward zone by zone; pallets queue without ever touching." },
          { name: "Tare", body: "The pallet settles onto the scale deck and the conveyor holds still. The system tares to the empty tote so it weighs only product from here on." },
          { name: "Fill", body: "The dry contact closes and the existing auger filler runs. Live weight climbs on the HMI in real time." },
          { name: "Settle", body: "At recipe-set weight intervals, filling pauses. The densification deck lifts the pallet off the rollers on pneumatic bags and electric rotary vibrators shake the tote, packing the product down. Filling resumes into the space the shake just created." },
          { name: "Finish", body: "Approaching target, the auger call opens, the weight stabilizes, and the final reading locks in within 1% of setpoint. The operator confirms at the HMI." },
          { name: "Discharge", body: "The finished tote releases to the accumulation leg and the next pallet indexes in behind it. Three finished totes stage without contact, waiting on a forklift." },
        ]}
      />
      <P>
        Each product carries its own recipe: target weight, settle frequency, shake duration, settle dwell, and
        tolerance. The controller holds 100 recipe slots, so changeover between SKUs is a slot number, not a setup.
      </P>

      <H2>Densification: Full by Weight and by Volume</H2>
      <P>
        {`Frozen vegetables don't pour like liquid. IQF cuts bridge, stack, and trap air, and a tote filled straight through can hit its volume limit thousands of counts short of its weight target. The industry's manual answer has always been some version of a person shaking, rapping, or rocking the tote.`}
      </P>
      <P>
        The densification deck automates that answer with control the manual version never had. Because settling runs
        on recipe parameters, every product gets the shake profile that suits it, and every tote of the same SKU gets
        the same one. Delicate blends get short, frequent settles. Dense cuts get fewer, longer ones. The scale
        confirms the result on every cycle, because the same load cells that stop the fill also watch the weight pack
        in.
      </P>
      <Callout label="Why it pays">
        {`A denser tote is cheaper everywhere downstream: fewer totes per run, fewer pallet positions in the freezer, fewer trailers for the same tonnage. Densification isn't a finishing touch. It's a freight line item.`}
      </Callout>

      <H2>Engineered for the Cold</H2>
      <P>
        A 20 °F room is quietly hostile to machinery. Grease thickens and drag climbs on every bearing, chain, and
        gearbox in the building. Air lines collect condensation that freezes in valves. Plastics turn brittle. Margins
        that look generous on a warm test floor shrink in the cold, and they shrink most in the highest-load zones.
      </P>
      <P>This system was engineered for that room rather than adapted to it:</P>
      <Bullets
        items={[
          "Swept-radius corners move pallets through both 90-degree bends with driven tapered rollers instead of pneumatic transfers, removing the cold room's most common freeze-and-fail actuators",
          "Motor drive modes are selected for cold-start torque with verified current margin at site ambient, then locked into the PLC so the setting survives component swaps and program updates",
          "Zone electronics are IP67-rated and photo eyes are covered, because frost is an optical problem before it is ever a mechanical one",
          "The one pneumatic function on the line, the densification lift, runs on dry regulated air behind a factory-locked pressure setting calculated for the job",
          "Stainless frames and zinc-coated rollers shrug off the wet, cold, wipe-down sanitation cycle",
        ]}
      />
      <P>
        {`Cold-environment automation is not a ratings checkbox. It's a margin discipline: know what the room takes away, and design past it.`}
      </P>

      <H2>Built Around the Filler You Already Own</H2>
      <P>
        {`The most expensive line item in many automation proposals is the equipment you're told to replace. This system takes the opposite approach. The plant's existing auger filler stays exactly where it is and does what it always did. The AQS system simply tells it when to run, through a single 24 VDC dry-contact interlock, and takes responsibility for everything the filler was never good at: positioning, weighing, settling, stopping at target, and moving finished totes away.`}
      </P>
      <P>
        {`That interface choice kept the project's footprint to the conveyor circuit itself, kept commissioning to a one-day controls startup, and kept the plant's process knowledge intact. The filler didn't change. The work around it did.`}
      </P>

      <H2>What the Plant Got</H2>
      <Bullets
        items={[
          "Operator interaction reduced to forklift exchange at the two ends of the line",
          "Every tote filled to a recipe target and confirmed on live load cells to 1% of span",
          "Consistent, densified totes across every SKU in the recipe library",
          "Up to seven pallets in process at once, queued with zero-pressure accumulation and released one confirmed fill at a time",
          "A production log of totes and weights by shift or day, in place of clipboard counts",
        ]}
      />
      <P>
        {`The system was commissioned in September 2026 and released to production on the plant's standard pallet fleet, running multiple SKUs from the recipe library.`}
      </P>

      <H2>Thinking About Your Line?</H2>
      <P>
        If your plant fills gaylords, drums, or bulk totes by hand, in the cold or otherwise, the pattern in this paper
        transfers: stage automatically, weigh live, settle by recipe, interlock with the equipment you already own, and
        give your people a forklift seat instead of a scoop and a scale.
      </P>

      <PdfDownload
        href="/whitepapers/aqs-white-paper-densification-tote-filling.pdf"
        title="Filling 1,800-Pound Totes at 20 °F. Hands-Free."
        pages="AQS white paper · September 2026"
      />

      <Closing>
        AQS engineers and builds sanitary automation for food and beverage processors, designed in Nampa, Idaho. A
        companion paper covers the photo eye lesson from this line:{" "}
        <Link href="/blog/photo-eyes-retroreflective-vs-diffuse" className="text-accent-text hover:underline">
          The Pallet Was Blue. The Sensor Couldn&apos;t See It.
        </Link>{" "}
        See the{" "}
        <Link href="/solutions/conveyors/projects/stainless-24v-pallet-tote-filling-system" className="text-accent-text hover:underline">
          project spotlight
        </Link>
        , or read about{" "}
        <Link href="/solutions/conveyors/pallet/washdown" className="text-accent-text hover:underline">
          pallet conveyors
        </Link>{" "}
        and{" "}
        <Link href="/solutions/conveyors/mdr/zones" className="text-accent-text hover:underline">
          24V MDR zones &rarr;
        </Link>
      </Closing>
    </Article>
  );
}
