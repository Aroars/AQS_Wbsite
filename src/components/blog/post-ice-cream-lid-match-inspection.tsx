import Link from "next/link";
import { Article, Lead, H2, P, Bullets, Steps, Callout, SpecTable, Figure, PdfDownload, Closing } from "./whitepaper-parts";

/* White paper: VeriPak lid-match inspection. Customer and brand anonymized —
   "an ice cream plant in the Southeast … for a national brand" — do not name either. */

export default function PostIceCreamLidMatch() {
  return (
    <Article>
      <Lead>
        Inside a VeriPak inspection system that reads the lid and the sidewall of every ice cream tub at 65 per minute,
        rejects the mismatches, and logs the rest.
      </Lead>

      <Figure
        src="/images/blog/lid-match-inspection-system-shop.jpg"
        alt="Stainless lid-match inspection system with controls enclosure, touchscreen, and inspection shroud on one frame"
        caption="The lid-match inspection system before shipment: split-belt conveyor, inspection shroud, and controls enclosure on one frame. The system was commissioned under the EvacuPak name and is now supported as part of the VeriPak family; the machine in these photos carries the earlier badge."
        width={1800}
        height={1294}
        priority
      />

      <H2>Executive Summary</H2>
      <P>
        A round ice cream tub tells you what it is twice: once on the lid, once on the sidewall. On a lidding line
        running two dozen flavors, those two statements can disagree. A stack of French vanilla lids loaded onto a
        cookies-and-cream run produces a package that looks finished, weighs right, seals fine, and is mislabeled.
        Nothing upstream catches it, and the consequences land downstream: allergen exposure, retailer chargebacks, and
        the kind of recall that starts with a consumer photo.
      </P>
      <P>
        This paper walks through an inspection system AQS engineered, built, and commissioned for an ice cream plant in
        the Southeast that packs 48-ounce tubs for a national brand. The system sits directly after the lidder. It gaps
        each tub, spins it 180 degrees on a split belt, reads the lid with a vision sensor and the sidewall UPC with a
        code reader, checks both against the active product in the Product Configuration Library, and pushes any tub
        that fails out of the flow. Every tub, every read, and every reject is logged, with checkweigh data captured by
        SKU alongside.
      </P>
      <Bullets
        items={[
          "Inspects 100% of tubs at 65 per minute with no fixed orientation required at infeed",
          "Reads lid text and sidewall UPC on every tub and requires both to match the running SKU",
          "Replaces a six-reader ring array with two readers and one camera by rotating the product instead",
          "Ships pre-loaded with 24 SKUs and room for 40, changed from a single dropdown on the HMI",
          "Type 316 stainless, IP69K washdown, 56 by 47 inch footprint, one Meltric plug and one air drop",
        ]}
      />
      <Callout label="The short version">
        The tub proves it is what the lid says it is, or it leaves the line, and the plant has the record either way.
      </Callout>

      <H2>A Mislabel Is a Recall Waiting for a Reason</H2>
      <P>
        Most inspection equipment on a packaging line answers a physical question. Is there metal in it? Does it weigh
        enough? Is the seal intact? A lid-to-body mismatch passes every one of those tests. The package is complete and
        correct in every way except identity.
      </P>
      <P>
        Identity matters more in ice cream than almost anywhere else. Flavors share a filler, a lidder, and a case
        packer, and they change over often. Lids arrive in stacks and get loaded by hand. Bodies are printed and staged
        separately. The two streams meet at the lidder and nothing verifies they agree. One flavor contains egg,
        another contains tree nuts, and a third contains neither, and the allergen statement is on the body while the
        flavor name a consumer reads first is on the lid. When they disagree, the plant owns an undeclared-allergen
        risk it cannot see.
      </P>
      <P>
        The plant in this case wanted every tub verified before it reached the case packer, without adding operators
        and without asking the line to slow down. They had one more constraint that shaped the whole design: they did
        not want a wall of hardware to do it.
      </P>

      <H2>Fewer Readers, One Rotating Tub</H2>
      <P>
        {`The first proposal on the table, from the sensor vendor, was a ring of six fixed code readers around the conveyor so that a barcode at any orientation would land in someone's field of view. It would have worked. It would also have meant six readers, six mounts, six cables, and six things to clean, align, and keep in calibration.`}
      </P>
      <P>
        {`AQS took the opposite approach: move the product, not the sensors. If the tub rotates a controlled 180 degrees while it travels through the inspection zone, one code reader sees the entire sidewall and one camera sees the entire lid. The mechanism that makes that happen is a split belt: two independent 3-inch flat-top belts running side by side, each on its own hub motor and drive. Run them at different speeds and a round tub riding on both of them rolls as it travels. The speed ratio sets how far it turns in the length of the zone. The calculation is not exotic; with the tub's circumference, the zone length, and the line rate, the belt differential falls out directly, and the drives are set to match.`}
      </P>
      <P>
        {`The inspection zone came out at roughly 18 inches of travel, with two Keyence SR-2000W code readers covering the sidewall and a Keyence IV4 vision sensor covering the lid. The sensor sizing was verified against the vendor's own installation model at 1.4 pixels per cell on the barcode, comfortably above the 1.1 minimum, at the 14.7-inch standoff the mechanical layout allowed.`}
      </P>

      <Figure
        src="/images/blog/lid-match-side-view-render.jpg"
        alt="Side view render of the lid-match inspection system showing the split-belt conveyor under the inspection shroud"
        caption="Side view: the split-belt conveyor runs through the inspection shroud on a 56 inch long frame."
        width={1800}
        height={1013}
        light
      />

      <SpecTable
        head={["Parameter", "Specification"]}
        rows={[
          ["Line rate", "65 tubs per minute"],
          ["Product", "48 oz (1.5 qt) round ice cream tubs, presented lid down, no rotational orientation"],
          ["Inspection", "Lid text via Keyence IV4 vision sensor; sidewall UPC via two Keyence SR-2000W code readers"],
          ["Verification", "Lid read and 11-character UPC must both match the active SKU"],
          ["SKU library", "24 SKUs loaded at commissioning; capacity for 40"],
          ["Conveyance", "Split belt, two 3 in Intralox S1100 flat-top belts, 86 and 147 ft/min, OneMotion hub motors on Allen-Bradley PowerFlex drives"],
          ["Gapping", "Pneumatic infeed stop for consistent product spacing"],
          ["Reject", "RapidFire pneumatic pusher to customer reject table; audible alarm and upstream pause output on consecutive rejects"],
          ["Controls", "Allen-Bradley CompactLogix 5069 PLC, FactoryTalk Optix touchscreen HMI, IO-Link I/O"],
          ["Data", "Per-tub inspection log; checkweigh data captured by SKU; CSV export and FTP transfer to plant server"],
          ["Access", "Two credentialed levels: Operator and Maintenance"],
          ["Construction", "Type 316 stainless frame and shroud; NGI hygienic feet and bearings; IP69K washdown"],
          ["Utilities", "480 V, 15 A on a single Meltric plug; clean dry plant air at one drop"],
          ["Footprint", "56 in long by 47 in wide; 35.6 in belt height, adjustable ±3 in"],
        ]}
      />

      <H2>How an Inspection Cycle Works</H2>
      <Steps
        items={[
          { name: "Enter", body: "Tubs arrive from the lidder lid-down, at line pace, in whatever rotation they happen to be. The system does not ask the upstream line to orient anything." },
          { name: "Gap", body: "A photo eye sees the incoming tub and a pneumatic stop holds it for a fraction of a second, opening a consistent gap to the tub ahead. The read windows are timed off this gap, so spacing is what makes the rest of the cycle repeatable." },
          { name: "Spin", body: "The tub crosses onto the split belt. With one belt running 1.7 times faster than the other, it rolls a half turn through the inspection zone." },
          { name: "Read", body: "The vision sensor reads the lid text and color. The code readers pick up the sidewall UPC as it rotates past. Both results go to the PLC." },
          { name: "Decide", body: "The PLC compares both reads to the active SKU in the Product Configuration Library. A tub passes only when the lid and the barcode both match. A no-read on either counts as a fail; the system errs toward rejecting a good tub rather than passing a bad one." },
          { name: "Reject or release", body: "A failing tub is pushed onto the reject table for an operator to inspect. The conservative default kicks the following tub as well on a lid failure, since two mismatched lids in a row usually share a cause. Passing tubs continue to the case packer." },
          { name: "Log", body: "Every cycle is recorded with SKU, time, and result. Where the plant's checkweigher is connected, the weight rides along in the same record." },
        ]}
      />

      <Figure
        src="/images/blog/lid-match-split-belt-tunnel.jpg"
        alt="An ice cream tub riding two independent blue belts inside the stainless inspection tunnel"
        caption="Inside the inspection tunnel: a tub rides the two independent belts past the sidewall code reader."
        width={1024}
        height={682}
      />

      <P>
        Changing flavors is a dropdown and an Apply button. Each SKU profile holds the lid text, the sidewall
        identifier, and the checkweigh setpoints, and recipes can be browsed on the HMI while the current one is still
        running.
      </P>

      <H2>Verification Is the Product</H2>
      <P>
        {`The system's value is not that it moves ice cream. Plenty of conveyors do that. Its value is that it turns an assumption ("the lids loaded on this run are the right lids") into a verified fact for every tub, and it keeps the receipt.`}
      </P>
      <P>
        That is the pattern VeriPak is built around. The inspection devices do what they do well: a vision sensor reads
        text, a code reader reads codes. VeriPak supplies the part they cannot do on their own, which is knowing which
        product is supposed to be running, deciding what a pass looks like, acting on the result with a reject, and
        writing all of it into a production record. The plant did not buy two readers and a camera. It bought the
        answer to a question, delivered 65 times a minute, with a log.
      </P>
      <P>
        The record matters as much as the reject. When a retailer or a brand owner asks whether a lot was mislabeled,
        the plant does not reconstruct a shift from memory. It exports the run.
      </P>

      <H2>Engineered for the Wash</H2>
      <P>
        Ice cream plants sanitize hard and often. The frame and shroud are Type 316 stainless, formed from 10 and 12
        gauge sheet, with hygienic leveling feet and sealed bearings. The whole system is rated IP69K, with the
        touchscreen the one component that gets a cover before the hoses come out. Power arrives on a single Meltric
        plug, so the machine disconnects for cleaning without an electrician, and the only air connection is one
        half-inch drop.
      </P>
      <P>
        Commissioning turned up one lesson worth passing on. Within weeks of startup, one flavor began rejecting at a
        rate that made no sense. The cause was a polarizing filter on the vision sensor that had clouded under
        chlorinated washdown. Removing it fixed the reads. Sanitation chemistry is part of the operating environment,
        and optics that are fine in a lab or a dry plant are not automatically fine in a dairy. The system now runs
        without the filter, and it is on the checklist for every washdown vision application AQS builds.
      </P>

      <H2>Built Around the Line You Already Run</H2>
      <P>
        {`The system installed as a drop-in section between the lidder and the case packer: 56 inches of conveyor length, one power plug, one air drop, and a network cable. The upstream lidder did not change. The downstream case packer did not change. The plant's existing checkweigher was tied in rather than replaced, so its readings land in the same log as the inspection results.`}
      </P>

      <Figure
        src="/images/blog/lid-match-installed-line.jpg"
        alt="Lid-match inspection system installed on an ice cream packaging line with a reject table beside it"
        caption="Installed between the lidder and the case packer. Reject table at left, downstream conveyor at right."
        width={1800}
        height={1468}
      />

      <P>
        {`The reject table, the anchor points, and the network drop were the customer's scope. Everything the plant had to provide fit on one page of the punch list.`}
      </P>

      <H2>What the Plant Got</H2>
      <Bullets
        items={[
          "Every 48-ounce tub verified for lid-to-body match before it enters a case",
          "Mismatched tubs off the line automatically, with an alarm and an upstream pause if they start coming in bunches",
          "Flavor changeover from a single HMI dropdown, with 24 SKUs ready on day one",
          "A per-tub inspection and weight log that exports to CSV and transfers to the plant server",
          "Operator and Maintenance access levels so setpoints and recipes stay under controlled hands",
          "A washdown-rated machine that unplugs for sanitation",
        ]}
      />
      <P>The system was commissioned in late summer 2024 and is in daily production.</P>

      <H2>Thinking About Your Line?</H2>
      <P>
        If your plant runs multiple SKUs through shared lidding, capping, or labeling, the question this system answers
        applies to you: can you prove the outside of the package matches the inside, for every unit, with a record you
        can hand to an auditor? The pattern transfers. Present the product consistently, read what identifies it,
        verify against the running configuration, reject the exceptions, and log everything.
      </P>

      <PdfDownload
        href="/whitepapers/aqs-white-paper-veripak-ice-cream-lid-match.pdf"
        title="The Lid Says Vanilla. Does the Tub Agree?"
        pages="AQS white paper · September 2026"
      />

      <Closing>
        AQS engineers and builds sanitary automation for food and beverage processors, designed in Nampa, Idaho. Read
        the platform paper,{" "}
        <Link href="/blog/veripak-production-quality-platform" className="text-accent-primary hover:underline">
          VeriPak Proves a Good One
        </Link>
        , or{" "}
        <Link href="/solutions/veripak" className="text-accent-primary hover:underline">
          learn more about VeriPak &rarr;
        </Link>
      </Closing>
    </Article>
  );
}
