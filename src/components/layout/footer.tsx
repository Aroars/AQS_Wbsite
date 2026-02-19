import Link from "next/link";
import Image from "next/image";

const solutionLinks = [
  { label: "VeriPak SCADA", href: "/solutions/veripak" },
  { label: "EvacuPak", href: "/solutions/evacupak" },
  { label: "Leak Detection", href: "/solutions/leak-detection" },
  { label: "Sanitary Robotics", href: "/solutions/robotics" },
  { label: "Conveyors", href: "/solutions/conveyors" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-default pt-11 pb-8 px-8">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-7">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Image
              src="/images/logos/aqs-favicon.png"
              alt="AQS"
              width={28}
              height={28}
              className="rounded-[5px]"
            />
            <span className="font-sans font-bold text-[0.88rem] text-white">
              Automated Quality Solutions
            </span>
          </div>
          <p className="font-sans text-[0.78rem] text-text-dim leading-[1.7] max-w-[320px]">
            Standalone SCADA, liquid recovery, leak detection, sanitary
            conveyors, and washdown robotics — engineered in Boise, Idaho.
          </p>
        </div>

        {/* Solutions */}
        <div>
          <div className="font-mono text-[0.58rem] text-text-dim tracking-[0.12em] uppercase mb-3">
            Solutions
          </div>
          {solutionLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block font-sans text-[0.78rem] text-text-dim hover:text-white transition-colors mb-1.5"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Company */}
        <div>
          <div className="font-mono text-[0.58rem] text-text-dim tracking-[0.12em] uppercase mb-3">
            Company
          </div>
          {companyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block font-sans text-[0.78rem] text-text-dim hover:text-white transition-colors mb-1.5"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.linkedin.com/company/automatedqs/"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-sans text-[0.78rem] text-text-dim hover:text-white transition-colors mb-1.5"
          >
            LinkedIn
          </a>
          <a
            href="https://www.youtube.com/@AutomatedQS"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-sans text-[0.78rem] text-text-dim hover:text-white transition-colors"
          >
            YouTube
          </a>
        </div>

        {/* Contact */}
        <div>
          <div className="font-mono text-[0.58rem] text-text-dim tracking-[0.12em] uppercase mb-3">
            Contact
          </div>
          <div className="font-sans text-[0.78rem] text-text-dim leading-[1.8]">
            Boise, Idaho
            <br />
            <a
              href="mailto:info@automatedqs.com"
              className="hover:text-white transition-colors"
            >
              info@automatedqs.com
            </a>
            <br />
            automatedqs.com
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1280px] mx-auto mt-6 pt-4 border-t border-border-default flex justify-between flex-wrap gap-2">
        <div className="font-sans text-[0.72rem] text-white/[0.18]">
          &copy; 2026 Automated Quality Solutions. All rights reserved.
        </div>
        <div className="font-sans text-[0.72rem] text-white/[0.18]">
          Privacy Policy &middot; Terms of Service
        </div>
      </div>
    </footer>
  );
}
