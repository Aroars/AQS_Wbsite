import Link from "next/link";
import { Article, Lead, H2, P, B, Bullets, Callout, SpecTable, Figure, PdfDownload, Closing } from "./whitepaper-parts";

/* White paper: the VeriPak Production Quality Platform. Terminology follows
   the VeriPak Product Language Guide: Production Quality Platform, Product
   Configuration Library, Continuous Package Awareness, Quality Management
   Dashboard. Keep it that way in this post. */

export default function PostVeriPakPlatform() {
  return (
    <Article>
      <Lead>
        How the VeriPak® Production Quality Platform gives every primary package a continuous digital identity, turns
        independent inspection devices into one coordinated quality system, and replaces the audit scramble with a
        query.
      </Lead>

      <Figure
        src="/images/blog/veripak-node-enclosure.jpg"
        alt="VeriPak node: stainless pedestal enclosure with touchscreen HMI, stack light, and hygienic feet"
        caption="The VeriPak® node: Allen-Bradley CompactLogix and FactoryTalk Optix™ in a NEMA 4X stainless enclosure, pedestal-mounted with hygienic feet and a Meltric power connection."
        width={891}
        height={1013}
        light
        narrow
        priority
      />

      <H2>Executive Summary</H2>
      <P>
        Most packaging lines already inspect every package. A metal detector, a checkweigher, a code date printer,
        maybe X-ray or vision. The devices work. They catch bad product and they pull it off the line. What they do not
        do is talk to each other, and what the plant cannot do as a result is prove, for any one specific package, that
        it was inspected, was in specification, and passed every check on its way out the door.
      </P>
      <P>
        {`That gap between "no bad product left" and "this package passed" is where quality programs lose audits, lose chargeback disputes, and lose margin they never see leaving. VeriPak closes it.`}
      </P>
      <P>
        VeriPak is a configurable Production Quality Platform built by AQS for food and beverage packaging lines. It
        does not replace the inspection equipment a plant already owns. It connects to it, coordinates it, and records
        every primary package as it moves through production, so that each package carries a continuous digital
        identity and a complete Production Quality Record. On top of that foundation, a plant adds only the
        capabilities it needs: inspection integration, automated quality sampling, secure sample storage, product
        handling, vision inspection, or leak detection.
      </P>
      <Bullets
        items={[
          "Continuous Package Awareness: every primary package is recorded by count, product, time, line, and connected-device status",
          "One product selection configures every supported inspection device on the line from a single Product Configuration Library",
          "Deterministic Quality Sampling™ executes the QA sampling plan on schedule, not on operator availability",
          "A Digital Chain of Custody follows retained samples from the line through storage to the lab",
          "Allen-Bradley CompactLogix and FactoryTalk Optix™ hardware, dual-network architecture, plant data stays on the plant's own network",
          "Brownfield by design: installs alongside existing equipment, expands one capability at a time",
        ]}
      />
      <Callout label="The short version">
        Every inspection system on the market can reject a bad package. VeriPak is the one that proves a good one, and
        keeps the receipt.
      </Callout>

      <H2>The Proof Gap</H2>
      <P>
        Walk any modern packaging line and you will find quality control everywhere. It is also everywhere in
        isolation. The metal detector logs to its own screen. The checkweigher keeps its own statistics. The code date
        printer runs on its own recipe. The retained-sample log is a clipboard on the wall of the QA cooler. Each of
        these does its job well. None of them knows the others exist.
      </P>
      <P>
        That arrangement works right up until someone asks a question that spans devices, shifts, or time. Three
        versions of that question show up in almost every plant.
      </P>
      <P>
        <B>The audit.</B> An auditor, a retailer, or a regulator wants proof that every package on a specific run was
        inspected, by whom, when, and with what result. Answering means pulling paper logs, exporting from three
        devices, lining up timestamps that were never meant to line up, and hoping the picture holds together. A
        two-week scramble is a good outcome. A finding is the other one.
      </P>
      <P>
        <B>The chargeback.</B> A customer claims a shipment arrived underweight, or a seal failed, or a case was
        damaged. The plant knows its equipment was running and that no rejected product shipped. What it cannot produce
        is the record for that specific package: its weight, its metal detection result, its seal image, the operator
        on duty when it passed. Without that record, the plant absorbs the cost, or a carrier does, and nobody can say
        for sure who should have.
      </P>
      <P>
        <B>The discovery.</B>{" "}
        {`Monday morning, someone opens Friday's data and finds that second shift ran a SKU heavy for six hours. The checkweigher was running. The trend was visible to anyone watching. Nobody was watching, and the product is already on a truck. The same pattern applies to a metal detector threshold that crept, a printer that drifted out of alignment, or a vision system that quietly started passing marginal seals.`}
      </P>
      <P>
        All three are backward-looking problems. The pain arrives after the fact, when the record either exists or it
        does not. VeriPak exists to make sure it does.
      </P>

      <H2>What VeriPak Is</H2>
      <P>
        VeriPak is a configurable Production Quality Platform. It is a real machine on the plant floor, an
        Allen-Bradley CompactLogix controller and a FactoryTalk Optix touchscreen in a stainless washdown enclosure, and
        it is the software that runs on it. Every installation starts from the same Core Platform, which has three
        parts.
      </P>
      <P>
        <B>The Production Interface</B> is the HMI on the line. Operators select the product, see production status
        and alarms, log in at their permission level, and interact with whichever modular capabilities are installed.
        It is one screen for the line&apos;s quality activity instead of one screen per device.
      </P>
      <P>
        <B>The Production Quality Engine</B> runs continuously in the background. It maintains Continuous Package
        Awareness, logs production and quality events, executes Deterministic Quality Sampling™ logic, communicates
        with connected devices, and writes everything to a secure production historian.
      </P>
      <P>
        <B>The Quality Management Dashboard</B> is desktop software on the QA and production workstations. It gives
        authorized people the production and quality history, reporting, KPIs, and multi-line visibility without anyone
        touching the line HMI, and it exports to CSV under credentialed access.
      </P>
      <SpecTable
        head={["Layer", "What it does", "Who uses it"]}
        rows={[
          ["Production Interface", "Product selection from the Product Configuration Library, status and alarms, credentialed login, manual quality functions, controls for installed capabilities", "Operators, line leads, maintenance"],
          ["Production Quality Engine", "Continuous Package Awareness, production and quality event logging, Deterministic Quality Sampling™ logic, connected-device communications, secure historian", "Runs unattended"],
          ["Quality Management Dashboard", "Production and quality historian, reporting, KPI dashboard, multi-line visibility, secure CSV export", "QA, production management, engineering"],
        ]}
      />
      <P>
        Everything VeriPak does builds on that Core Platform. Adding a capability extends the same foundation. It never
        creates another island.
      </P>

      <Figure
        src="/images/blog/veripak-platform-architecture.jpg"
        alt="VeriPak Production Quality Platform architecture diagram with the core platform in the center, existing inspection equipment on the right, optional modules on the left, and enterprise systems above"
        caption="VeriPak® Production Quality Platform architecture: the Core Platform in the center, existing inspection equipment on the right, optional AQS modules on the left, enterprise systems above."
        width={1536}
        height={1024}
      />

      <H2>Continuous Package Awareness: The Product Journey</H2>
      <P>
        The idea that makes VeriPak different from a dashboard is simple to state. As a package moves down the line,
        VeriPak knows it is there, knows what product it is supposed to be, and attaches to it whatever each connected
        device reports as it passes. The metal detector result, the weight, the code date verification, the vision
        result, the leak test, the operator on shift, the time. By the time the package reaches the case packer it is
        carrying a complete Production Quality Record, and VeriPak has written that record to the historian.
      </P>
      <P>Do that for every primary package and three things become possible that were not possible before.</P>
      <P>
        {`Any package can be looked up. The chargeback conversation changes from "our systems were running" to "here is the weight, the detector result, and the image for the package you are asking about."`}
      </P>
      <P>
        Any run can be queried. The audit response changes from a two-week reconstruction to a filter and an export.
      </P>
      <P>
        Any drift is visible as it happens. Because the data is flowing in real time through one engine, an
        out-of-tolerance trend at any station triggers the alarm chain immediately: stack light on the floor, then
        notification to a named person, then escalation to the next tier if nobody responds. The bleed stops during the
        shift, not the following week.
      </P>

      <H2>Modular Capabilities</H2>
      <P>
        A plant does not buy all of VeriPak on day one. It buys the Core Platform and the capabilities its quality
        program needs now, with the rest available later on the same foundation.
      </P>
      <SpecTable
        head={["Modular capability", "What it adds", "Typical trigger"]}
        rows={[
          ["Inspection Integration", "Centralized product configuration pushed to supported checkweighers, metal detectors, X-ray, and code date printers; unified verification prompts logged with operator identity", "“We set up the same product on four devices every changeover”"],
          ["Automated Quality Sampling™", "Recipe-driven sample selection by time, count, startup, changeover, or customer rule; automatic diversion and documentation; optional label printing", "“Sampling happens when someone gets to it”"],
          ["Secure Sample Storage", "Digital Chain of Custody on customer-provided coolers, cabinets, or lockers; access by sample label scan, badge, biometric, or HMI login; every storage event recorded", "“Our retain log is a clipboard on the cooler door”"],
          ["Product Handling", "AQS sanitary conveyors and IntelliPak® feed systems for spacing, presentation, transfer, reject, and sample diversion", "“The camera can't read what it can't see”"],
          ["Vision Inspection", "Presence and absence, OCR and OCV, label and code verification, custom applications; Package Image Historian", "“We need to know the outside matches the inside”"],
          ["Leak Detection", "Pressurized package testing and MAP leak detection (U.S. patent pending) for package integrity, integrated with the production record", "“Pinholes don't show up on camera”"],
        ]}
      />
      <P>
        Optional features cut across those capabilities: Credentialed Access, Automatic Sample Labeling, Automated
        Sample Diversion, Secure Reject Retention, the Quality Management Dashboard, the Production Historian, and
        Image Capture.
      </P>

      <H2>Built to Integrate, Built to Stay Out of IT&apos;s Way</H2>
      <P>
        VeriPak is built for the plant that already exists. It connects to installed inspection equipment over
        Ethernet/IP, Modbus TCP, or digital I/O, from any manufacturer, and where the device supports it, VeriPak
        becomes the single point of product configuration: select the SKU once and every connected device receives its
        parameters. Product selection can also arrive automatically from plant SCADA or MES.
      </P>
      <P>
        {`The network design is the part IT departments ask about first. VeriPak runs a dual-network architecture. The machine network, with the PLC and inspection devices, stays isolated. The HMI connects to the plant's user network for reporting and dashboard access without bridging the two. Data flows out to the people who need it. Nothing flows in. VeriPak never hosts customer data; the production record lives on the plant's own network, and even multi-plant dashboards read from the plant side as the authoritative source.`}
      </P>
      <P>
        Physically, the node is a NEMA 4X stainless enclosure with a sloped top, hygienic feet, and a single Meltric
        switch-rated power connection, wall- or pedestal-mounted, washdown-rated for the sanitary floor. Every node
        ships VPN-ready for secure remote support from AQS engineers.
      </P>
      <P>
        The commitment underneath all of this is brownfield first. Existing SOPs, HACCP plans, and lab procedures stay
        in place. VeriPak adds the digital record around them.
      </P>

      <H2>Deterministic Quality Sampling™</H2>
      <P>One capability deserves its own section because it changes a routine nobody has questioned in decades.</P>
      <P>
        On most lines, the retained quality sample is the first product handled manually after an otherwise automated
        process. Someone pulls a package on a schedule, writes a label, logs it on paper, and carries it to a cooler.
        The timing depends on who is free. The label depends on handwriting. The chain of custody depends on diligence.
        None of that is a criticism of QA staff. It is a description of a human-dependent process.
      </P>
      <P>
        {`Deterministic Quality Sampling™ moves the sampling plan into the Product Configuration Library under QA control. Every fifteen minutes, every five thousand packages, at startup, after changeover, or on a customer-specific rule, VeriPak identifies the correct package using Continuous Package Awareness, diverts it, documents it, and, where configured, prints its label. If Secure Sample Storage is installed, the sample's digital identity follows it into the cooler and out to the lab. QA still owns testing, investigation, and disposition. The platform owns the repetition.`}
      </P>

      <H2>Where Plants Start</H2>
      <P>Most VeriPak deployments begin on one line with one of three entry points.</P>
      <P>
        <B>Monitor what you have.</B> The Core Platform connects to existing devices, records every package, alarms
        and escalates, and reports. No new inspection hardware. This is where the audit story gets solved.
      </P>
      <P>
        <B>Unify the inspection suite.</B> Add Inspection Integration so that product changeover, device
        configuration, verification checks, and quality records run from one place. This is where changeover time and
        setup errors come down.
      </P>
      <P>
        <B>Solve a specific inspection problem.</B> Add Vision Inspection, Leak Detection, or Product Handling to
        address a gap the existing equipment cannot cover, with the Core Platform recording the result for every
        package. The companion case study,{" "}
        <Link href="/blog/ice-cream-lid-match-inspection" className="text-accent-primary hover:underline">
          an ice cream plant verifying lid-to-body match on every tub at 65 per minute
        </Link>
        , is an example of this path.
      </P>
      <P>
        Whichever door a plant comes in through, it ends up on the same platform, with the same record, and the same
        room to expand.
      </P>

      <H2>Why Now</H2>
      <P>
        Traceability expectations in food manufacturing are moving from lot-level to package-level, and the
        record-keeping requirements that come with them are getting more specific about who did what, when, and to
        which product. Retailer audits are asking for evidence, not assurances. Chargebacks are a recurring cost that
        nobody books as a single line item. Every one of those pressures rewards the plant that can produce a specific
        package&apos;s record on demand.
      </P>
      <P>
        {`VeriPak's architecture was designed as a long-term production quality foundation. What it records today, per package, is what future production genealogy, ingredient traceability, and enterprise quality visibility will be built on, without changing the methodology or the equipment underneath.`}
      </P>

      <H2>Thinking About Your Line?</H2>
      <P>
        Tell us what is on your line today: which checkweighers, which detectors, which printers, which cameras. We
        will show you what the Core Platform connects to as-is, which capability solves the problem you called about,
        and what a phased path looks like from there.
      </P>

      <PdfDownload
        href="/whitepapers/aqs-white-paper-veripak-production-quality-platform.pdf"
        title="Every Inspection System Can Reject a Bad Package. VeriPak Proves a Good One."
        pages="AQS white paper · September 2026"
      />

      <Closing>
        AQS engineers and builds sanitary automation for food and beverage processors, designed in Nampa, Idaho.{" "}
        <Link href="/solutions/veripak" className="text-accent-primary hover:underline">
          Learn more about VeriPak &rarr;
        </Link>
      </Closing>
    </Article>
  );
}
