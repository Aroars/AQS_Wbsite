import Link from "next/link";
import { Article, Lead, H2, P, B, Bullets, Callout, SpecTable, Figure, PdfDownload, Closing } from "./whitepaper-parts";

/* White paper: diffuse vs retro-reflective photo eyes on pallet lines.
   Companion to the tote filling paper. Customer anonymized — "a frozen
   vegetable processor in the Upper Midwest" — do not name it. */

export default function PostPhotoEyesRetroreflective() {
  return (
    <Article>
      <Lead>
        Why diffuse-reflective photo eyes lose dark targets, why the older retro-reflective design is often the better
        choice on pallet and tote lines, and how to specify sensing that survives the things a plant adds after
        commissioning.
      </Lead>

      <Figure
        src="/images/blog/photo-eyes-blue-pallet-on-mdr-line.jpg"
        alt="A blue pooled rental pallet with a lined tote staged at the infeed of a stainless 24 VDC MDR pallet circuit in a processing plant"
        caption="The pallet circuit in production with a blue pooled rental pallet staged at the infeed. Every pallet seen during commissioning had been natural wood."
        width={1800}
        height={1188}
        priority
      />

      <H2>Executive Summary</H2>
      <P>
        A pallet conveyor that ran flawlessly through acceptance testing began missing pallets a few weeks into
        production. Nothing on the line had changed. The pallets had. The plant had added a pool of blue painted rental
        pallets to its fleet, and the diffuse-reflective photo eyes that had seen every natural-wood pallet during
        commissioning could not reliably see the blue ones.
      </P>
      <P>
        {`This paper explains why that happens, in enough optical detail to make the fix obvious rather than mysterious, and makes the case that for pallet handling, tote handling, and any application where the target's color or surface is outside the integrator's control, the older retro-reflective sensing mode is the more robust engineering choice. It is not a step backward. It is choosing the sensing principle that does not depend on the one variable you cannot specify.`}
      </P>
      <Bullets
        items={[
          "A diffuse sensor detects light scattered back from the target, so its signal depends on target reflectivity, and dark blue returns a small fraction of what pale wood returns at a red emitter wavelength",
          "Cold, frost, dust, and the gaps in a pallet deck all subtract from an already thin signal margin",
          "A retro-reflective sensor detects a beam interrupted by the target, so target color, texture, and finish do not enter the equation",
          "Polarized retro-reflective sensors ignore shiny wrap film and are the right default for pallet and tote zones",
          "The durable fix is specification, not replacement: list every pallet, tote, and container the plant owns or rents at design review, and sense across a feature that will always be there",
        ]}
      />
      <Callout label="The short version">
        If the thing you are detecting might change color after you leave, do not use a sensor whose answer depends on
        its color.
      </Callout>

      <H2>What Changed After Commissioning</H2>
      <P>
        {`The system in this case is a seven-zone, 24 VDC motorized-roller pallet circuit in a 0 to 20 °F room. Each zone has a photo eye that tells the zone controller a pallet has arrived, which is what makes zero-pressure accumulation work: a zone releases forward only when the zone ahead reports clear. The eyes were diffuse-reflective units with a rated range comfortably longer than the distance to the pallet, mounted at the end of each zone looking across the rollers at the pallet's side.`}
      </P>
      <P>
        Through build, factory acceptance, and commissioning, every pallet that ran was a standard natural-wood block or
        stringer pallet. The sensors saw them every time.
      </P>
      <P>
        {`After startup, the plant began running blue painted pooled rental pallets alongside its own fleet. Pooled pallets are common in food distribution and they come in the pool operator's color, usually blue, sometimes red or black. On the blue pallets, zone eyes began dropping out intermittently. A pallet would arrive and the zone would not register it, or would register it late, or would flicker between present and clear. In an accumulation system that is not a nuisance. It is a logic fault: zones release into occupied zones, or hold indefinitely waiting for a pallet that is already there.`}
      </P>
      <P>The sensors had not failed. They were doing exactly what diffuse sensors do.</P>

      <Figure
        src="/images/blog/photo-eyes-zone-sensor-blue-pallet.jpg"
        alt="A diffuse photo eye on a stainless MDR conveyor frame aimed at the painted stringer of a blue pallet, with the zone's 24 VDC motor-roller card mounted below"
        caption="Zone 1: a diffuse photo eye looking across the rollers at the painted stringer of a blue pallet, with the zone's 24 VDC motor-roller card below."
        width={1800}
        height={1392}
      />

      <H2>How a Diffuse Sensor Decides</H2>
      <P>
        A diffuse-reflective photo eye, often called a proximity-mode sensor, puts the emitter and receiver in the same
        housing pointed in the same direction. It shines light at whatever is in front of it and watches for light
        coming back. If enough comes back, it reports a target.
      </P>
      <P>
        {`Everything in that description depends on the target. The amount of light returned to the receiver is set by the target's reflectivity at the emitter's wavelength, its distance, its surface texture, and its angle to the sensor. The sensor manufacturer publishes a sensing range, and that range is measured on a standard white test card with roughly 90 percent reflectance. Real targets return less, often far less, and the published range shrinks with them.`}
      </P>
      <P>Three things worked against the blue pallets at once.</P>
      <P>
        <B>Color against a red emitter.</B> Most general-purpose photo eyes use a red LED or red laser emitter, around
        640 to 660 nanometers. A surface looks blue because it reflects the blue end of the spectrum and absorbs the
        rest, including red. Dark blue paint on weathered wood can return well under 10 percent of incident red light,
        compared with 50 percent or more for clean pale wood. For a sensor that only sees returned light, the blue
        pallet is a dim object at the same distance where the wood pallet was a bright one.
      </P>
      <P>
        <B>Everything that eats margin.</B> Sensor manufacturers describe the ratio of received signal to the minimum
        needed to switch as excess gain. A diffuse sensor sized for wood pallets had healthy excess gain on wood and
        little to spare on blue. Then the room took its share: frost or condensation on the lens, dust on the pallet, a
        sensor looking at a painted surface at a glancing angle rather than square on. Each one removes a slice of what
        was left.
      </P>
      <P>
        <B>Where the beam lands.</B> A pallet is not a solid wall. It is deck boards, stringers or blocks, and air. A
        sensor aimed at the side of a pallet may be looking at a board face, a board edge, a gap, or a chamfer depending
        on pallet build and exactly where it stopped. On a bright target the gaps do not matter much, because even a
        glancing return trips the sensor. On a dark one, the beam landing in a gap or on an edge is the difference
        between detect and no detect.
      </P>
      <P>
        Background-suppression diffuse sensors, which use the geometry of the returned light rather than its intensity
        to judge distance, are much less color-sensitive than basic energetic diffuse units and are a reasonable
        upgrade in some applications. They still need a minimum return to work with, and their rated ranges are still
        published on white and gray reference cards. On a dark pallet at a glancing angle in a frosty room, they help;
        they do not make the problem go away.
      </P>

      <Figure
        src="/images/blog/photo-eyes-sensing-modes-diagram.jpg"
        alt="Diagram of three sensing modes on the same pallet: diffuse on a pale wood pallet returns a strong signal, diffuse on a dark blue pallet returns a weak one, and a polarized retro-reflective beam to a reflector is broken by any pallet"
        caption="Three sensing modes on the same pallet. Only the retro-reflective arrangement makes a decision that does not depend on what the pallet looks like."
        width={2400}
        height={620}
        light
      />

      <H2>Why Retro-Reflective Does Not Care</H2>
      <P>
        A retro-reflective sensor also keeps emitter and receiver in one housing, but it does not look at the target.
        It looks at a reflector mounted on the far side of the conveyor. The reflector is a corner-cube prism array
        that sends light straight back the way it came, so the receiver normally sees a strong, stable return across
        the open conveyor. When a pallet moves into the path, the beam is interrupted and the return drops to near
        zero. That interruption is the detection.
      </P>
      <P>
        {`The target's job in this arrangement is only to block light. Color, paint, weathering, texture, moisture, and angle do not matter, because the sensor never relied on the target to send anything back. A blue pallet blocks a beam exactly as well as a wood one, as does a black tote, a wrapped load, or a cardboard gaylord.`}
      </P>
      <P>
        The signal margin also runs the other way. A retro-reflective pair with a good reflector returns a large
        multiple of the switching threshold at ranges of several meters, so frost, dust, and misalignment have far more
        room to eat into before detection suffers. On a 60-inch-wide pallet curve, a retro-reflective sensor is
        operating at a small fraction of its rated range with margin to spare.
      </P>
      <P>
        The one failure mode the design has to address is a shiny target. Stretch wrap, glossy plastic, or polished
        metal passing through the beam can bounce enough light back to the receiver to look like the reflector, and
        the sensor fails to see the object. The fix has been standard for decades: a polarized retro-reflective sensor.
        The emitter is polarized in one plane, the corner-cube reflector rotates the polarization by 90 degrees on the
        way back, and the receiver only accepts light in that rotated plane. A shiny surface reflects light without
        rotating it, so the receiver ignores it. For pallet and tote work, where loads are routinely wrapped, polarized
        retro-reflective is the default, not the option.
      </P>
      <SpecTable
        head={["Sensing mode", "How it detects", "Depends on target color or finish?", "Typical range on a pallet conveyor", "Watch for"]}
        rows={[
          ["Diffuse (energetic)", "Light scattered back from target", "Yes, strongly", "Short; shrinks sharply on dark targets", "Dark, matte, or glancing targets; frost and dust; gaps in pallet decks"],
          ["Diffuse with background suppression", "Position of returned light", "Less, but still needs a return", "Short to medium", "Rated on white and gray cards; glancing angles on dark paint"],
          ["Retro-reflective, polarized", "Beam to a reflector, broken by target", "No", "Long; large excess gain across a 60-inch curve", "Reflector cleanliness and alignment; mount across a feature that is always present"],
          ["Through-beam", "Separate emitter and receiver, beam broken by target", "No", "Longest; highest excess gain", "Two devices, two cables, two mounts; the heaviest-duty choice for the worst conditions"],
        ]}
      />

      <H2>Good Reasons to Choose Retro-Reflective</H2>
      <P>
        Retro-reflective sensing predates most of what is on a modern sensor catalog page, and the instinct to reach
        for the newer diffuse or background-suppression unit is understandable: one device, no reflector to mount, no
        alignment. On a lot of applications that instinct is correct. On these, it is not.
      </P>
      <P>
        <B>Pallet conveyors with mixed or changing fleets.</B> Plants own pallets, rent pallets, receive pallets from
        suppliers, and change all three without telling the integrator. Natural wood, blue, red, black, plastic, and
        heat-treated pallets with stamps and paint on the stringer face are all realistic on the same line in the same
        year. A sensing mode that treats them all the same is the only one that can be specified with confidence.
      </P>
      <P>
        <B>Dark or variable packaging.</B> Black totes, dark corrugated, printed cases, shrink bundles, and any product
        whose color changes with the SKU. Each new color is a new reflectivity, and a diffuse threshold set on one may
        not hold on the next.
      </P>
      <P>
        <B>Wrapped and glossy loads.</B> Polarized retro-reflective handles stretch wrap and glossy film without
        special tuning. Diffuse sensors on wrapped loads see whatever the wrap happens to be doing in that spot.
      </P>
      <P>
        <B>Wide conveyors and long sensing distances.</B> A pallet curve or a 48-inch-wide accumulation lane is well
        beyond the useful range of most diffuse units on anything but a bright target. Retro-reflective ranges are
        measured in meters.
      </P>
      <P>
        <B>Cold, dusty, or frosting environments.</B> Excess gain is what pays for a dirty lens. Retro-reflective has a
        great deal of it. Diffuse on a dark target has very little.
      </P>
      <P>
        <B>Zone sensing for accumulation.</B> Zero-pressure accumulation logic depends on a clean, repeatable
        present-or-clear signal at a fixed point in each zone. Flicker from a marginal diffuse return on a gapped
        pallet deck is exactly the signal that logic cannot tolerate.
      </P>
      <P>
        Diffuse remains the right choice where there is no second side to mount a reflector, where the sensor must look
        down at product on a belt against a distant background, where the targets are consistent and under the
        integrator&apos;s control, or in true washdown zones where a reflector would foul faster than the sensor. Those
        are real cases. A pallet conveyor is not one of them.
      </P>

      <H2>Doing the Retrofit Right</H2>
      <P>Switching sensing modes on an installed line is a small job if a few details are handled.</P>
      <P>
        <B>Aim across something that is always there.</B> On a pallet, that means the beam should cross a bottom deck
        board, a stringer, or the leading face at a height that every pallet style in the fleet presents. On a tote
        line, it means the tote body rather than a lid or a handle cutout. Checking this against the full pallet list is
        the whole point of the exercise.
      </P>
      <P>
        <B>Specify polarized, and use the matching reflector.</B> A polarized sensor needs a corner-cube reflector, not
        reflective tape, to rotate the beam correctly. Size the reflector for the range and the environment, and mount
        it where a forklift cannot clip it.
      </P>
      <P>
        <B>Keep the output and connection the same.</B> A polarized retro-reflective eye with the same output type,
        connector, and supply as the diffuse unit it replaces drops into the existing zone controller input with no
        program changes. Choose the replacement on that basis so the controls scope stays at zero.
      </P>
      <P>
        <B>Protect it in the cold.</B> Covered eyes and reflectors, lens heaters where the room calls for them, and a
        cleaning step on the sanitation checklist keep the margin that retro-reflective gives you.
      </P>
      <P>
        <B>Verify with the pallet that failed.</B> Commissioning the retrofit means running the blue pallet, the wood
        pallet, and anything else the plant has in the yard through every zone, not just the one that was convenient.
      </P>

      <H2>The Real Lesson Is in the Specification</H2>
      <P>The sensor swap is an afternoon. The reason it was needed is worth more attention than that.</P>
      <P>
        Plants change. Packaging changes with marketing. Pallets change with the logistics contract. Totes change with
        the supplier. Almost none of it is reported back to the integrator, and all of it arrives after the acceptance
        test was signed. A system designed around the samples that happened to be on the floor during commissioning is
        designed around a snapshot.
      </P>
      <P>
        AQS has taken three things from this project into its standard practice. The design review now asks for every
        pallet, tote, and container the plant owns, rents, or receives, in writing, before sensors are selected. Pallet
        and tote zone sensing is specified as polarized retro-reflective by default, with diffuse treated as the
        exception that has to justify itself. And the commissioning checklist includes the plant&apos;s full container
        fleet, not the subset that was handy that day.
      </P>
      <P>
        Specifying for what the plant will do next, instead of what it was doing when you measured, is cheaper than any
        retrofit. When the retrofit is needed anyway, choosing the sensing mode that is indifferent to the change means
        the next change will not need one.
      </P>

      <H2>Thinking About Your Line?</H2>
      <P>
        If a conveyor on your floor has started missing product after a packaging change, a pallet change, or a new
        supplier, there is a reasonable chance the sensors are doing exactly what they were asked to do with a target
        they were never shown. Tell us what the line is handling and what changed, and we will tell you whether it is a
        tuning problem or a sensing-mode problem, and how small the fix is.
      </P>

      <PdfDownload
        href="/whitepapers/aqs-white-paper-photo-eyes-retroreflective.pdf"
        title="The Pallet Was Blue. The Sensor Couldn't See It."
        pages="AQS white paper · October 2026"
      />

      <Closing>
        AQS engineers and builds sanitary automation for food and beverage processors, designed in Nampa, Idaho. This
        paper is a companion to{" "}
        <Link href="/blog/automated-tote-filling-frozen-vegetables" className="text-accent-primary hover:underline">
          Filling 1,800-Pound Totes at 20 °F
        </Link>
        ; the system itself is in the{" "}
        <Link href="/solutions/conveyors/projects/stainless-24v-pallet-tote-filling-system" className="text-accent-primary hover:underline">
          project spotlight &rarr;
        </Link>
      </Closing>
    </Article>
  );
}
