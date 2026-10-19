import Link from "next/link";
import { Article, Lead, H2, P, B, Bullets, Callout, SpecTable, Figure, PdfDownload, Closing } from "./whitepaper-parts";

/* White paper: welded box frame vs. tube spine vs. the AQS formed spline
   backbone. Comparison paper for the custom sanitary conveyor line and
   companion to the engineering paper "Three Corners, No Transfers" (held
   until that draft is finalized). Competitor figures are quoted from the
   named manufacturers' public pages and cited at the end; keep the sources
   list in step with any change to a competitor row. The corner speed AQS
   publishes here is the warranted 140 ft/min, not the model's headroom. */

const sources: { label: string; href: string }[] = [
  { label: "Dorner AquaPruf 7400 Ultimate series product page (frame construction, washdown rating, widths, speed, load, bolted sections over 10 ft)", href: "https://hmcross.dornerconveyors.com/products/sanitary/aquapruf-7400-ultimate-2" },
  { label: "Dorner AquaGard 7350 curved modular belt conveyor product page (bolt-together frame, curve angles, 260 ft/min, non-caustic wipe-down rating)", href: "https://avrex.dornerconveyors.com/?p=15450" },
  { label: "Motion Control Tips, AquaGard 7350 V2 (four curves on one motor, washdown level)", href: "https://www.motioncontroltips.com/dorners-sanitary-aquagard-7350-v2-conveyor-allows-four-curves-run-off-a-single-motor/" },
  { label: "Robotics Tomorrow, Dorner C3 belted curve preview at PACK EXPO 2024", href: "https://www.roboticstomorrow.com/news/2024/10/04/dorner-previewing-its-new-c3-belted-curve-conveyor-for-sanitary-applications-in-booth-n-5623-at-pack-expo-2024/23260/" },
  { label: "Multi-Conveyor tubular construction page", href: "https://www.multi-conveyor.com/conveyors/tubular-conveyors" },
  { label: "Nercon, Ultimate Guide to Sanitary Conveyor Design (elimination of tubular parts, 45-degree surfaces, continuous welds)", href: "https://www.nerconconveyors.com/Nercon-Blog/Ultimate-Guide-To-Sanitary-Conveyor-Design-Food-Beverage.htm" },
  { label: "Automation World, The 10 Principles of Sanitary Machine Design (Principles 1, 3, 4, 5)", href: "https://www.automationworld.com/home/article/13311182/the-10-principles-of-sanitary-machine-design" },
  { label: "Intralox Series 2400 Tight Turning Radius belt page (1.7 to 2.2 x belt width standard turn radius by width)", href: "https://www.intralox.com/belt-finder/modular-plastic-belting/series-2400/tight-turning-radius" },
];

export default function PostThreeWaysToHoldUpAConveyor() {
  return (
    <Article>
      <Lead>
        Welded box frames, tube spines, and the AQS formed spline backbone: how the three frame architectures behind
        sanitary radius conveyors compare in a washdown plant, using each {`builder's`} published numbers.
      </Lead>

      <Figure
        src="/images/blog/spline-backbone-annotated.jpg"
        alt="Annotated technical illustration of the bare AQS spline frame: a continuous M-profile stainless backbone running through a faceted curve, tab-and-slot cross plates keyed onto it, a facet bend line, an obround cutout split across the bend, and the drive end housing"
        caption="The AQS open-frame spline backbone: one continuous 8-gauge stainless M-profile, faceted through curves, with self-fixturing tab-and-slot cross plates TIG-welded to flat stock."
        width={2084}
        height={1582}
        light
        priority
      />

      <H2>Executive Summary</H2>
      <P>
        Every sanitary conveyor is a belt, some plastic for the belt to slide on, and a structure that holds the
        plastic in the right place while a sanitation crew sprays it with hot chlorinated water every night. The belt
        and the plastic come from a handful of vendors and are much the same from one builder to the next. The
        structure is where builders actually differ, and it is the part most buyers never ask about.
      </P>
      <P>
        There are three ways to build that structure. A box frame uses two side rails tied together by cross members,
        and it is how the best catalog sanitary conveyors are built. A tube spine runs a round or rectangular tube down
        the centerline and hangs everything off it, which is how several builders make curves. The AQS open-frame
        spline does what the tube spine does, with a continuous formed solid-section stainless backbone instead of a
        hollow one. This paper puts the three side by side, including where each is the right answer.
      </P>
      <Bullets
        items={[
          "The leading catalog box-frame platform is an excellent straight conveyor; on its published pages the welded, high-pressure-washdown line is straight only, and the curved version is a bolt-together frame rated for wipe-down and occasional washdown with non-caustic solutions",
          "A tube spine makes a curve native to the frame, at the cost of a closed hollow body running the length of the conveyor, which sanitary design guidance says to eliminate wherever possible, and which at least one major conveyor builder has publicly engineered out of its own frames",
          "The AQS spline is one continuous 8-gauge stainless M-profile, laser cut flat and formed, faceted through curves, with tab-and-slot cross plates TIG-welded to flat stock; there is no interior to seal, no pan to pool water, and no horizontal surface along its length",
          "On the belting side, AQS S-conveyors are rated at 140 ft/min and above through corners, against a conventional radius-conveyor practice of roughly 80 to 100 ft/min",
          "Corners are sized from a 1.5-class radius belt by actual width, against the 1.7 to 2.2 times belt width that the most common tight-turn belt family publishes as standard",
        ]}
      />
      <Callout label="The short version">
        A tube spine solves the curve and creates a cavity. A box frame avoids the cavity and struggles with the curve.
        The spline solves the curve without the cavity.
      </Callout>

      <H2>Why the Frame Is the Question</H2>
      <P>
        A plant engineer comparing sanitary conveyors usually compares belts, speeds, widths, and price. Those matter,
        but they are nearly the same from every serious builder because they come from the same belt and plastics
        vendors. What the builder actually contributes is the structure, and the structure determines three things the
        datasheet never shows: whether the conveyor can follow the path the room needs without a transfer, where
        washdown water goes after it hits the frame, and whether a sanitation lead with a flashlight can see every
        surface the water touched.
      </P>
      <P>
        The hygienic design principles that food plants audit against are explicit on the last two points. Equipment
        should be accessible for inspection, maintenance, cleaning, and sanitation. It should allow no product or
        liquid collection. And hollow areas should be eliminated wherever possible or permanently sealed. Every frame
        architecture is a different answer to those three sentences.
      </P>

      <Figure
        src="/images/blog/spline-system-layout-top-view.jpg"
        alt="Top-view engineering layout of a multi-conveyor spline system: several S-curve and 180-degree radius belt conveyors threading between a wall penetration and packaging equipment, with a checkweigher and reject station mid-path"
        caption="The kind of path that makes the frame the question: a multi-conveyor spline system threading product through inspection, a wall, and around packaging equipment with no transfers at the corners."
        width={1472}
        height={1650}
        light
      />

      <H2>The Welded Box Frame</H2>
      <P>
        {`The box frame is the industry's default, and the best version of it is very good. Dorner's AquaPruf 7400 series, the reference point most buyers will know, is a continuous TIG-welded 304 stainless frame with a #4 polish, designed with no horizontal surfaces, with TIG-welded standoffs that keep fasteners out of the food zone. Its UHMW wear strips lift out without tools, the tail tips up for interior access, and it is rated for spray from 100 to 1,500 psi and chlorinated solutions. It runs belts from 6 to 36 inches wide at up to 233 ft/min with a 20 pound per square foot load rating. Conveyors over 10 feet ship in bolted sections that can be welded together on site. If a plant needs a straight sanitary conveyor from a catalog, this is the standard the rest of the catalog is measured against.`}
      </P>
      <P>
        {`The limitation is geometry. A box frame wants to be straight. Two side rails and a set of cross members have no natural way to follow a curve, so a curve becomes a separate product with a different frame, and that is exactly what the published catalog shows. Dorner's curved modular belt conveyor is the AquaGard 7350, a bolt-together stainless frame that runs 45, 90, 135, and 180 degree curves at up to 260 ft/min on belts to 24 inches, with up to four curves on one motor. Its published sanitary rating is wipe-down and occasional washdown with non-caustic solutions, suitable for wet environments. A belted curve for sanitary use, the C3, was previewed in late 2024 with fabric belting and BISSC compliance.`}
      </P>
      <P>
        Read those two pages together and the tradeoff is plain. In the catalog box-frame world, a plant that needs an
        S-path under high-pressure chlorinated washdown has two choices: several straight welded conveyors with
        transfers between them, or a single curved conveyor on a bolt-together frame with a lower washdown rating.
        Neither is wrong. Both are compromises the frame architecture forces.
      </P>

      <H2>The Tube Spine</H2>
      <P>
        The tube spine exists to fix that. Run a round or rectangular stainless tube down the centerline, bend it to
        the path, and hang the belt supports, legs, and guide rails off it, and curves become native to the frame
        instead of a different product. Builders who use it describe the result as open, rigid, and easy to clean, and
        compared to a box frame with a bedpan it often is. Multi-Conveyor, for example, describes its tubular line as
        built on or within square or round tubes that hold the belting in place, with an open concept that is easier
        to clean than enclosed side walls.
      </P>
      <P>
        {`The cost is the tube itself. A tube is a closed hollow body running the full length of the conveyor, and sanitary design guidance treats closed hollow bodies as something to eliminate where possible or permanently seal. "Permanently sealed" is the operative phrase, and it is harder than it sounds on a conveyor frame. Every cross member, leg bracket, rail post, and sensor mount that attaches to a tube spine is either a weld on the tube wall or a fastener through it. A weld with a pinhole, a fastener that penetrates, or a seam cracked by a forklift opens the interior, and from that moment the tube is an uncleanable, uninspectable cavity that fills with washdown water and product residue and cannot be verified from outside. The inside of a tube cannot be seen with a flashlight, reached with a hose, or swabbed.`}
      </P>
      <P>
        This is not an AQS-only view. Nercon, a large sanitary conveyor builder, publishes that its own frame approach
        eliminates tubular parts because they can harbor internal moisture and bacteria through microscopic pit holes.
        When a competitor engineers a feature out of its own product and says why, that is the clearest evidence a
        buyer will get that the concern is real.
      </P>
      <P>
        {`A tube spine is the right choice when the application is wet but not aggressively sanitized, when the tube can be fully sealed and never penetrated afterward, and when the plant's audit program does not treat closed hollow bodies as a finding. In a dairy, a ready-to-eat room, or any plant where the sanitation crew runs caustic and chlorine nightly, the tube becomes a question the engineer has to answer at every audit.`}
      </P>

      <H2>The AQS Open-Frame Spline</H2>
      <P>
        AQS wanted what the tube spine delivers, a single continuous backbone that follows the belt path through
        curves, without a hollow body anywhere in the frame. The answer is a spline: a single stainless member,
        laser-cut flat from 8-gauge stainless and press-brake formed into an M-shaped profile, that runs from tail to
        nose as one structural part.
      </P>
      <P>
        The M section does the structural work a tube does. Two inclined webs with their flanges sit under the
        centerline of the bed, where the bending load is, and behave like a pair of joined hat channels: deep section
        in bending, high torsional resistance from the cell geometry between the webs. It does that work as an open
        section. There is no interior. Every surface is a face a sanitation lead can see, spray, and swab, and every
        surface is inclined, so there is no horizontal shelf anywhere along the backbone for water to sit on.
      </P>
      <P>
        Through a corner the spline runs as a series of short flat chords with a press-brake bend at each joint, so the
        structure is flat plate and formed bends everywhere, with nothing roll-formed and no tube bender. The spline is
        relieved along its length with a staggered pattern of obround cutouts, and where a cutout row meets a facet
        joint the cutout is split across the bend line, so every cross plate lands on flat, continuous plate rather
        than across a bend. The cross plates are laser cut from the same 8-gauge stainless with the M-profile keyed
        into them, and they slot through the spline with tab-and-slot joints that locate every plate square and on
        station before the first weld. A curved frame goes together without a jig, the welds are short accessible TIG
        seams on flat stock, and the geometry that comes off the laser is the geometry that ships. Legs, caster plates,
        and the nose and drive housings all hang from the same cross plates.
      </P>

      <Figure
        src="/images/blog/spline-s-conveyor-annotated.jpg"
        alt="Annotated technical illustration of an AQS spline S-conveyor: blue UHMW carry and return channels on a stainless spline frame, a continuous 180-degree sweep, a bearinged nose bar at the infeed, and a drop drive hung below the deck at the discharge"
        caption="The complete S-conveyor on the spline frame. The only deck is the UHMW the belt needs; water passes through the cutouts, off the inclined profile, and onto the floor."
        width={2028}
        height={1322}
        light
      />

      <P>
        {`Open frame means open frame. The belt's carryway and return run in continuous UHMW channels carried on the cross plates, so the only deck on the conveyor is the plastic the belt actually needs. There is no stainless bedpan under the belt to collect water. Washdown water passes through the cutouts, off the inclined profile, between the plates, and onto the floor. The frame is continuous TIG-welded and mirror finished like every AQS conveyor, with no bolted lap joint to harbor anything and no closed cavity to seal.`}
      </P>
      <P>
        {`Because the spline is one parametric part, the conveyor's path, its facet and cutout pattern, its cross-plate stations, and its wear strip mounting are the same CAD object. Changing a corner radius regenerates the backbone, the bend table, and every plate keyed into it, which is a large part of how AQS turns custom S-conveyor layouts and quotes around in the customer's timeframe.`}
      </P>

      <H2>The Corner, Where the Comparison Gets Decided</H2>
      <P>
        A frame that can follow a curve is only useful if the belt can take the curve at production speed, and this is
        where most radius conveyors give ground. Tension through a corner multiplies rather than adds, the belt edge
        generates heat against the inside rail, and most builders answer by slowing the belt down. The conventional
        working ceiling for an acetal belt edge on standard UHMW rails is roughly 98 ft/min, and the common shop rule
        of 80 ft/min is that ceiling with a margin.
      </P>

      <Figure
        src="/images/blog/spline-s-curve-conveyor-render.jpg"
        alt="Engineering render of an AQS spline S-curve conveyor with a blue side-flexing modular belt running from a low infeed through two opposed turns to a discharge end with a below-deck drive housing"
        caption="An AQS spline S-conveyor: two opposed turns on one belt, the belt running on a zero-pretension catenary with the drive hung below the deck at the discharge."
        width={1798}
        height={1388}
        light
      />

      <P>
        AQS attacks the heat directly. The inside turn rails and capture plates in every corner run in bearing-grade
        UHMW with dry lubricant dispersed through the full cross-section of the material, which cuts frictional heat
        generation at the belt edge by roughly 45 percent at the same speed. The drive hangs below the deck as a sealed
        IP69K magnetic drum with 180 degrees of wrap, placed so the longest straight sits between the last corner and
        the drive, and the belt runs on a zero-pretension gravity catenary. Lower tension into the corner means lower
        rail pressure means lower heat. The result is that AQS rates its S-conveyors at 140 ft/min and above through
        corners as standard practice, roughly half again the conventional ceiling, with each layout carrying its own
        calculated corner tension and heat margin rather than a borrowed rule of thumb. The model shows headroom beyond
        that figure; AQS publishes the number it is prepared to warrant, not the theoretical limit.
      </P>
      <P>
        {`The corners are also tighter. AQS builds on a heavy-duty 2-inch-pitch side-flexing belt in the 1.5 collapse-factor class and sizes each corner from the belt vendor's width table rather than the nameplate number, so narrow belts turn tighter still; the reference S-conveyor layouts run near 1.45 times belt width. For comparison, the most widely specified tight-turn belt family publishes a standard turn radius of 1.7 times belt width up to 18 inches, rising to 2.2 times for belts over 30 inches. At the same belt width, that is a visibly smaller footprint for every turn and an S-path that fits rooms it otherwise would not.`}
      </P>
      <P>
        Where two same-direction corners sit close together, AQS merges them into one continuous 180-degree sweep. The
        tension math is identical, the friction of the straight between them disappears, and the belt collapses once
        instead of twice, which removes the expand-and-recollapse transition that limits radius belt life at tight
        ratios.
      </P>

      <H2>Side by Side</H2>
      <SpecTable
        head={["Criterion", "Welded catalog box frame", "Tube spine", "AQS open-frame spline"]}
        rows={[
          ["Backbone", "Two side rails plus cross members", "Round or rectangular tube on centerline", "Continuous formed 8 ga stainless M-profile on centerline"],
          ["Closed hollow bodies", "None in the frame", "The spine itself", "None"],
          [
            "Curves on the welded, high-pressure platform",
            "Not on the published welded line; curves move to a bolt-together frame rated for non-caustic wipe-down",
            "Native",
            "Native, up to 4 × 90° or continuous 180° sweeps",
          ],
          ["Joints", "Continuous TIG weld; bolted sections over 10 ft", "Welds and fasteners on a hollow wall", "Tab-and-slot cross plates, continuous TIG weld on flat stock, no fasteners through the backbone"],
          ["Horizontal surfaces", "Designed out", "Top of tube depends on profile and orientation", "None; every face inclined"],
          ["Deck under the belt", "UHMW wear strips in a frame, lift-out", "Varies by builder", "UHMW carry and return channels only, no bedpan"],
          ["Inspectability", "High", "Exterior only; interior cannot be seen or swabbed", "Every surface visible and reachable"],
          ["Published straight speed", "233 ft/min (AquaPruf 7400)", "Varies", "Application rated"],
          ["Corner speed", "260 ft/min on the bolt-together curved line", "Typically 80 to 100 ft/min practice", "140 ft/min and above as standard, per-layout rated"],
          ["Corner radius", "Not published for the curved line", "Belt dependent, commonly 1.7 to 2.2 × width", "1.5-class belt, sized by width; ~1.45 × on reference layouts"],
          ["Washdown rating of the curved platform", "Wipe-down, occasional non-caustic washdown", "Varies", "IP69K capable, chlorinated and caustic washdown"],
          ["Controls", "Gearmotor packages", "Varies", "Allen-Bradley CompactLogix and PowerFlex, VeriPak and IntelliPak integration"],
        ]}
      />
      <p className="-mt-3 mb-6 text-[0.78rem] leading-[1.55] text-text-dim">
        {`Competitor rows reflect the named manufacturers' published pages at the time of writing; see the sources at the end. "Varies" means the category does not publish a consistent figure.`}
      </p>

      <H2>When Each One Is the Right Answer</H2>
      <P>
        {`A catalog box frame is the right conveyor for a straight run that needs to be on site in two weeks, where a distributor is already under contract and the plant's maintenance team already stocks the parts. AQS does not pretend to beat a ten-day lead time on a standard straight section, and a plant with a dozen identical straight conveyors to buy should get that quote.`}
      </P>
      <P>
        A tube spine is a reasonable conveyor in a wet but lightly sanitized room, where the tube can be sealed once and
        left alone, and where no audit program is going to ask about closed hollow bodies.
      </P>
      <P>
        The spline is the right answer when the path has corners and the room has chlorine. That combination, an
        S-path through walls and around equipment in a plant that sanitizes aggressively every night, is where the box
        frame forces transfers or a lower washdown class, where the tube spine creates the cavity the auditor is
        looking for, and where the spline simply follows the path with nothing to hide. It is also the right answer
        when the conveyor is going to be part of something larger, because it runs on the same Allen-Bradley platform
        as VeriPak inspection and IntelliPak feed systems and the robotic cells AQS has been building conveyance into
        for years.
      </P>

      <H2>What to Ask Any Conveyor Vendor</H2>
      <P>
        Whatever frame a vendor proposes, five questions will tell a plant engineer most of what this paper covers.
        Where is the frame welded, and where is it bolted? If there is a tube anywhere in the frame, how is it sealed,
        and what happens to that seal at every attachment? Where does washdown water go after it hits the frame, and is
        there a surface it can sit on? Can the sanitation lead see every surface the water touched? And for a curve,
        what is the corner speed rating for this layout, and how was it calculated?
      </P>
      <P>
        A good answer to all five is a conveyor the plant will not be thinking about in five years. AQS will put its
        answers on the table, because they are how the conveyor was designed.
      </P>

      <H2>Thinking About Your Line?</H2>
      <P>
        {`If your product crosses a room, a wall, or three pieces of somebody else's equipment on the way to packaging, and your sanitation crew runs chlorine, tell us about the path. AQS will lay out the spline conveyor that follows it, with the corner speed and the sanitary design visible on the print.`}
      </P>
      <P>
        {`AQS engineers and builds sanitary automation for food and beverage processors: conveyance, inspection, palletizing, and the VeriPak Production Quality Platform that ties it together, designed in Nampa, Idaho and supported for life. Tell us about your product, your line, and your sanitation, and we'll tell you what we'd build.`}
      </P>

      <PdfDownload
        href="/whitepapers/aqs-white-paper-three-ways-to-hold-up-a-conveyor.pdf"
        title="Three Ways to Hold Up a Conveyor"
        pages="AQS white paper · 8 pages · October 2026"
      />

      <H2>Sources for Competitor and Industry Figures</H2>
      <ul className="mb-6 space-y-2 list-none p-0 text-[0.84rem] leading-[1.6]">
        {sources.map((s) => (
          <li key={s.href} className="flex gap-3">
            <span className="text-accent-text shrink-0 mt-[0.1rem]">&#9656;</span>
            <a href={s.href} target="_blank" rel="noopener" className="text-text-body hover:text-accent-text break-words">
              {s.label}
            </a>
          </li>
        ))}
      </ul>

      <Closing>
        AQS engineers and builds sanitary automation for food and beverage processors, designed in Nampa, Idaho. See
        the{" "}
        <Link href="/solutions/conveyors/belt/radius" className="text-accent-text hover:underline">
          radius, S-curve, and 180° belt conveyors
        </Link>{" "}
        this paper compares, or read why AQS builds its own conveyors in{" "}
        <Link href="/blog/we-bought-them-first" className="text-accent-text hover:underline">
          We Bought Them First &rarr;
        </Link>
      </Closing>
    </Article>
  );
}
