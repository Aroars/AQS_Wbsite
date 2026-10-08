import Link from "next/link";
import { Article, Lead, H2, P, B, Bullets, Callout, Figure, VideoFig, PdfDownload, Closing } from "./whitepaper-parts";

/* White paper: why AQS builds its own sanitary conveyors. Positioning paper
   for custom sanitary conveyors; answers "why AQS" for buyers who already
   have a conveyor vendor under contract. Customer-facing rules: the prior
   integrator, its acquirer, and the purchased-conveyor vendors are never
   named, and the principal engineer is not named. The frozen vegetable
   processor stays anonymized. */

export default function PostWeBoughtThemFirst() {
  return (
    <Article>
      <Lead>
        Why AQS builds its own sanitary conveyors, what the purchased ones taught us, and what that means for a plant
        deciding whether to let a new conveyor vendor onto the floor.
      </Lead>

      <Figure
        src="/images/blog/conveyor-origin-modular-belt-close-up.jpg"
        alt="Close-up of a sanitary modular belt conveyor on the AQS shop floor: blue modular belt, continuous stainless frame with cutaway side panels, quick-adjust guide rails on stainless hand knobs, and hygienic leveling feet"
        caption="Sanitary modular belt conveyor: continuous stainless frame, hygienic leveling feet, quick-adjust guide rails, and a frame cut away to shed water rather than hold it."
        width={1731}
        height={1800}
        priority
      />

      <H2>Executive Summary</H2>
      <P>
        {`When a plant engineer sees an AQS conveyor layout for the first time, the first question is usually not about the conveyor. It is about AQS. Why haven't I heard of you? Why should I bring in a new vendor when I already have one under a master agreement?`}
      </P>
      <P>
        Both are fair questions, and this paper answers them plainly. AQS is new to selling conveyors. It is not new to
        building them. For years AQS built sanitary conveyance only inside its own robotic systems, because the
        conveyors it bought from established 24 VDC and sanitary conveyor manufacturers were never quite right for
        sanitary washdown and tight product control. The conveyors AQS sells today exist because the purchased ones
        failed, and they are designed by people who have been putting conveyance into food plants for well over a
        decade.
      </P>
      <Bullets
        items={[
          "AQS conveyance ran inside AQS robotic cells for years before it was sold on its own",
          "The design decisions that define it, continuous TIG-welded frames, water-shedding geometry, application-matched belting, and open Allen-Bradley controls, are each a direct answer to something a purchased conveyor got wrong",
          "AQS began selling conveyor systems standalone at the beginning of 2025, when a gap opened in the market for high-control sanitary conveyance",
          "Layouts and quotes turn around in the customer's timeframe because the engineering is done by the people who build the system",
          "A vendor agreement is a procurement step, not an engineering one; AQS runs it in parallel with layouts rather than ahead of them",
        ]}
      />
      <Callout label="The short version">
        Nobody designs a product more carefully than the people who had to live with the alternative.
      </Callout>

      <H2>The Question Behind the Question</H2>
      <P>
        A conveyor is the most ordinary thing on a packaging line. It is also the thing that gets touched by sanitation
        every night, carries every package the plant makes, and sits between every piece of equipment that cost real
        money. A plant that has settled on a conveyor vendor has usually done so for defensible reasons: the vendor is
        known, the paperwork is done, and the last system worked well enough.
      </P>
      <P>
        {`So when a layout arrives from a company the buyer does not recognize, the question underneath "why AQS" is really "what do you know that my current vendor doesn't, and how would I know?" This paper is the answer AQS gives to that question, in enough detail to be checked.`}
      </P>

      <H2>What We Were Building Before</H2>
      <P>
        AQS has been building automation for food and beverage plants since before it sold a single conveyor. The core
        of the business was robotic systems: palletizing, case handling, and sanitary pick-and-place cells for dairy,
        protein, and frozen food, in washdown environments where the robots themselves had to be rated for caustic
        cleaning. Every one of those systems included conveyance. Product had to arrive at the robot presented
        consistently, cases had to accumulate without crushing, pallets had to move away clean.
      </P>

      <Figure
        src="/images/blog/conveyor-origin-robotic-cells-shop-floor.jpg"
        alt="Two stainless robotic pick-and-place cells under construction on the AQS shop floor, each with a delta robot overhead and a blue modular belt conveyor running through the cell, while a technician wires the control panel"
        caption="Sanitary modular belt conveyance built into robotic pick-and-place cells on the shop floor. The conveyor was part of the cell long before it was a product."
        width={1800}
        height={1394}
      />

      <P>
        In the early years, AQS did what most integrators do. It bought the conveyors. Motorized-roller sections from
        the established 24 VDC vendors for case and pallet handling, belt conveyors from the established sanitary
        conveyor manufacturers for product transport. These were good products from good companies, and for a dry
        warehouse they would have been the end of the story.
      </P>
      <P>They were not the end of the story in a dairy.</P>

      <H2>What the Purchased Conveyors Taught Us</H2>
      <P>
        The problems were never dramatic. A conveyor rarely fails outright. It falls short in ways the sanitation crew
        and the maintenance tech notice long before the buyer does, and each of those ways became a design rule once
        AQS started building its own.
      </P>

      <VideoFig
        src="/video/conveyor-origin-case-pack-cell.mp4"
        poster="/images/blog/conveyor-origin-case-pack-cell-poster.jpg"
        alt="Boxed pies advancing single file on a stainless roller conveyor into a robotic case-packing cell, where two robot arms pick each box from the stop position"
        caption="Stainless roller conveyance presenting boxed product to a robotic case-packing cell, designed by the AQS engineering team. Pitch, stop position, and product control all belong to the conveyor."
        aspect="aspect-[9/16]"
        narrow
      />

      <P>
        <B>Bolted frames held water.</B> Catalog frames are bolted together because bolts are cheap to ship and easy to
        assemble on site. Every bolted joint is a crevice, and every crevice holds the residue that washdown is
        supposed to remove. AQS conveyors are continuous TIG-welded, frame to cross member to leg, because a joint that
        does not exist cannot harbor anything. The same logic drove the mirror finish and the sloped and curved frame
        geometry: a surface that sheds water in seconds does not need a second pass with a hose.
      </P>
      <P>
        <B>Catalog zones did not fit the robot.</B> A robotic cell wants product presented at a precise pitch, a case
        stopped exactly where the gripper expects it, and a pallet held square while the load builds. Catalog zone
        lengths, roller pitches, and sensor positions were built for a generic warehouse and had to be worked around
        in the cell. AQS now designs the zone, the bed, and the sensing around the application first, which is also
        why the radius sections on a recent pallet system accept 40-inch and 48-inch pallets with either side leading
        instead of forcing the plant to orient them.
      </P>
      <P>
        <B>Washdown found the weak parts.</B> A conveyor rated for washdown on the datasheet still has a drive card, a
        photo eye, a bearing, and a belt that each have their own rating, and the lowest one wins. AQS now specifies
        every component on the sanitary path individually, from hygienic feet and sealed bearings to IP67 zone
        electronics and single-point Meltric power, and designs from the top rating down. Not every conveyor needs
        IP69K, but every AQS conveyor can be.
      </P>
      <P>
        <B>{`The controls were somebody else's.`}</B> Purchased conveyance came with its own logic, its own interface,
        and its own idea of how a zone should talk to the system around it. Integrating that into an Allen-Bradley
        robotic cell meant translating at every boundary. AQS conveyors run on the same CompactLogix and FactoryTalk
        Optix platform as its VeriPak and IntelliPak products, so a conveyor zone, an inspection result, and a robot
        handshake live in one program and one record.
      </P>
      <P>
        <B>Lead times belonged to the catalog.</B>{" "}
        {`A custom cell on a plant's outage schedule cannot wait for a vendor's production slot. Building conveyance in-house put the layout, the fabrication, and the controls under one roof, which is where AQS's ability to turn layouts and quotes around in the customer's timeframe comes from.`}
      </P>
      <P>
        None of these were discoveries AQS was looking for. They were the cost of living with equipment that was almost
        right, applied over years of cells, and the conveyors that came out of them have been running inside AQS
        robotic systems ever since.
      </P>

      <H2>Why Sell Them Now</H2>
      <P>
        {`AQS's principal engineer ran engineering at a food and beverage robotics integrator for eight years before AQS, designing sanitary conveyance into plants the entire time. When that integrator's robotics group was sold, the plants it had been serving lost a source for the kind of high-control sanitary conveyor systems it built. AQS had been building exactly that for its own cells for years.`}
      </P>

      <Figure
        src="/images/blog/photo-eyes-blue-pallet-on-mdr-line.jpg"
        alt="A stainless 24 VDC motorized-roller pallet circuit in production at a processing plant, with a wrapped tote on a blue pallet staged at the infeed and a radius section curving toward the fill station"
        caption="One of the first standalone AQS conveyor systems in production: a 24 VDC pallet filling circuit at a frozen vegetable processor."
        width={1800}
        height={1188}
      />

      <P>
        At the beginning of 2025, AQS started selling conveyor systems on their own. That is the whole reason it looks
        new to the conveyor space. The product is not new. The listing is.
      </P>
      <P>
        The first standalone systems went where the experience was deepest: a stainless 24 VDC pallet circuit for a
        frozen vegetable processor, a high-speed dairy accumulation line, and a set of sanitary freezer belt conveyors
        for a snack producer. Each one was a conveyor system first, with no robot attached, and each one was designed
        the way AQS had been designing conveyance inside its cells all along.
      </P>

      <H2>What That Means for Your Line</H2>
      <P>
        {`A buyer does not need to care about AQS's history. The buyer needs to know what changes if AQS does the conveyor instead of the incumbent. Three things do.`}
      </P>
      <P>
        <B>The layout is designed for the application instead of the application being fitted to a catalog.</B> The
        questions AQS asks first are about the product, the room, the sanitation chemistry, the pallet fleet, and the
        equipment on either end. The conveyor is what falls out of those answers. On a recent project, AQS was the only
        vendor at the table who understood what actually needed to be quoted, because the quote started from the line
        rather than from a price list.
      </P>
      <P>
        <B>{`Custom layouts and quotes turn around in the customer's timeframe.`}</B> The people drawing the layout are
        the people who will build and commission it, and they have been doing this work in food plants for well over a
        decade.
      </P>
      <P>
        <B>{`The conveyor comes with the rest of the platform if you want it, and stands alone if you don't.`}</B>{" "}
        Allen-Bradley controls, VeriPak integration, IntelliPak feed systems, and robotic palletizing are all the same
        engineering team and the same controls stack. A conveyor can be the first thing a plant buys from AQS or the
        last.
      </P>

      <H2>About That Vendor Agreement</H2>
      <P>
        {`The story above answers "why AQS." It does not remove a procurement hurdle, and AQS does not pretend it does. If a master equipment agreement or a vendor approval is what stands between a plant and an AQS conveyor, the right move is to ask early what the plant needs from AQS to get one in place, and run that paperwork in parallel with the layouts and quoting.`}
      </P>
      <P>
        AQS would rather solve the agreement alongside the engineering than watch a plant swap in a vendor that is
        starting from zero on the application. The engineering does not pause for the paperwork.
      </P>

      <H2>Thinking About Your Line?</H2>
      <P>
        If a conveyor layout from AQS has landed on your desk, the fastest way to evaluate it is to ask the questions
        this paper invites: where is the frame welded, where does the water go, what is the lowest-rated component on
        the sanitary path, whose controls run it, and who exactly is going to be on the floor at commissioning. Then
        ask your current vendor the same questions.
      </P>
      <P>
        {`AQS engineers and builds sanitary automation for food and beverage processors: conveyance, inspection, palletizing, and the VeriPak Production Quality Platform that ties it together, designed in Nampa, Idaho and supported for life. Tell us about your product, your line, and your sanitation, and we'll tell you what we'd build.`}
      </P>

      <PdfDownload
        href="/whitepapers/aqs-white-paper-we-bought-them-first.pdf"
        title="We Bought Them First."
        pages="AQS white paper · October 2026"
      />

      <Closing>
        AQS engineers and builds sanitary automation for food and beverage processors, designed in Nampa, Idaho. See
        the full{" "}
        <Link href="/solutions/conveyors" className="text-accent-primary hover:underline">
          custom sanitary conveyor line
        </Link>
        , or the first standalone system in the{" "}
        <Link href="/solutions/conveyors/projects/stainless-24v-pallet-tote-filling-system" className="text-accent-primary hover:underline">
          project spotlight &rarr;
        </Link>
      </Closing>
    </Article>
  );
}
