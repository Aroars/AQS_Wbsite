import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Privacy Policy | AQS — Automated Quality Solutions",
  description:
    "Privacy policy for Automated Quality Solutions, Inc. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navigation />
      <section className="pt-[140px] pb-[100px] px-8">
        <div className="max-w-[800px] mx-auto">
          <h1 className="font-sans text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="font-mono text-[0.68rem] text-white/30 tracking-[0.1em] uppercase mb-10">
            Last Updated: March 9, 2026
          </p>

          <div className="space-y-8 font-sans text-[0.92rem] text-text-body leading-[1.8]">
            <p>
              Automated Quality Solutions, Inc. (&ldquo;AQS,&rdquo; &ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy and is committed to
              protecting the personal information you share with us. This Privacy Policy explains how
              we collect, use, disclose, and safeguard your information when you visit our website at
              www.automatedqs.com (the &ldquo;Site&rdquo;) or interact with us in connection with
              our products and services.
            </p>
            <p>
              By using our Site, you agree to the collection and use of information in accordance
              with this policy.
            </p>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Information We Collect</h2>

              <h3 className="text-white font-semibold text-[1rem] mb-2 mt-4">
                Information You Provide to Us
              </h3>
              <p className="mb-3">
                We collect personal information that you voluntarily provide when you:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong className="text-white">Request a quote or contact us:</strong> Name, email
                  address, phone number, company name, job title, and details about your packaging
                  line or project requirements.
                </li>
                <li>
                  <strong className="text-white">Subscribe to communications:</strong> Email address
                  and communication preferences.
                </li>
                <li>
                  <strong className="text-white">Engage with our sales team:</strong> Business
                  contact information and project specifications shared during consultations.
                </li>
              </ul>

              <h3 className="text-white font-semibold text-[1rem] mb-2 mt-4">
                Information Collected Automatically
              </h3>
              <p className="mb-3">
                When you visit our Site, we may automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong className="text-white">Device and browser information:</strong> Browser
                  type, operating system, device type, and screen resolution.
                </li>
                <li>
                  <strong className="text-white">Usage data:</strong> Pages visited, time spent on
                  pages, referring URLs, and navigation paths through the Site.
                </li>
                <li>
                  <strong className="text-white">IP address and approximate location:</strong> Used
                  for analytics and to understand our audience geographically.
                </li>
                <li>
                  <strong className="text-white">Cookies and similar technologies:</strong> See our
                  Cookie Policy section below for details.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">
                How We Use Your Information
              </h2>
              <p className="mb-3">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong className="text-white">Responding to inquiries:</strong> To process quote
                  requests, answer questions about our VeriPak, IntelliPak, EvacuPak, Custom
                  Conveyor, and Sanitary Robotics solutions, and provide technical information.
                </li>
                <li>
                  <strong className="text-white">Improving our Site:</strong> To understand how
                  visitors interact with our content so we can improve the user experience.
                </li>
                <li>
                  <strong className="text-white">Communications:</strong> To send you information
                  about our products, services, and industry developments, where you have opted in to
                  receive such communications.
                </li>
                <li>
                  <strong className="text-white">Analytics:</strong> To analyze Site traffic, measure
                  the effectiveness of our content, and understand which solutions are of most
                  interest to visitors.
                </li>
                <li>
                  <strong className="text-white">Legal compliance:</strong> To comply with applicable
                  laws, regulations, and legal processes.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">
                Cookies and Tracking Technologies
              </h2>
              <p className="mb-3">
                Our Site uses cookies and similar tracking technologies to enhance your browsing
                experience and analyze Site usage.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong className="text-white">Essential cookies:</strong> Required for the Site to
                  function properly (e.g., session management, security).
                </li>
                <li>
                  <strong className="text-white">Analytics cookies:</strong> Help us understand how
                  visitors interact with our Site by collecting usage data.
                </li>
                <li>
                  <strong className="text-white">Preference cookies:</strong> Remember your choices,
                  such as cookie consent preferences.
                </li>
              </ul>
              <p className="mt-3">
                You can manage your cookie preferences through the cookie settings banner displayed
                when you first visit our Site, or by adjusting your browser settings. Declining
                non-essential cookies will not affect your ability to browse the Site or request a
                quote.
              </p>
              <p className="mt-3">
                For more information, see our{" "}
                <a href="/cookie-policy" className="text-accent-primary hover:underline">
                  Cookie Policy
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">
                How We Share Your Information
              </h2>
              <p className="mb-3">
                We do not sell your personal information. We may share your information in the
                following limited circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong className="text-white">Service providers:</strong> We work with third-party
                  service providers who assist us with website hosting, analytics, email delivery, and
                  customer relationship management. These providers are contractually obligated to
                  protect your information and use it only for the services they provide to us.
                </li>
                <li>
                  <strong className="text-white">Sales representatives:</strong> If you are located
                  in a territory served by one of our authorized sales representatives, we may share
                  your inquiry details with the appropriate representative to ensure you receive
                  timely, knowledgeable support.
                </li>
                <li>
                  <strong className="text-white">Legal requirements:</strong> We may disclose your
                  information if required by law, regulation, legal process, or governmental request.
                </li>
                <li>
                  <strong className="text-white">Business transfers:</strong> In the event of a
                  merger, acquisition, or sale of assets, your information may be transferred as part
                  of that transaction.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Data Retention</h2>
              <p>
                We retain your personal information only for as long as necessary to fulfill the
                purposes described in this policy, unless a longer retention period is required or
                permitted by law. Quote request information is typically retained for the duration of
                our business relationship and for a reasonable period thereafter to support follow-up
                communications and warranty obligations.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Your Rights and Choices</h2>
              <p className="mb-3">
                Depending on your location, you may have certain rights regarding your personal
                information:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong className="text-white">Access and correction:</strong> You may request
                  access to the personal information we hold about you and ask us to correct any
                  inaccuracies.
                </li>
                <li>
                  <strong className="text-white">Deletion:</strong> You may request that we delete
                  your personal information, subject to certain exceptions required by law.
                </li>
                <li>
                  <strong className="text-white">Opt-out of communications:</strong> You may
                  unsubscribe from marketing emails at any time by clicking the
                  &ldquo;unsubscribe&rdquo; link in any email or by contacting us directly.
                </li>
                <li>
                  <strong className="text-white">Cookie preferences:</strong> You may adjust your
                  cookie settings at any time through the cookie settings link in our Site footer.
                </li>
              </ul>

              <h3 className="text-white font-semibold text-[1rem] mb-2 mt-4">
                California Residents (CCPA)
              </h3>
              <p>
                If you are a California resident, you have additional rights under the California
                Consumer Privacy Act (CCPA), including the right to know what personal information we
                collect, the right to request deletion, and the right to opt out of the sale of
                personal information. As noted above, we do not sell personal information.
              </p>
              <p className="mt-2">
                To exercise any of these rights, contact us using the information below.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Data Security</h2>
              <p>
                We implement reasonable administrative, technical, and physical safeguards to protect
                your personal information against unauthorized access, alteration, disclosure, or
                destruction. Our Site uses HTTPS encryption for all data transmitted between your
                browser and our servers.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Third-Party Links</h2>
              <p>
                Our Site may contain links to third-party websites, including technology partner
                sites, industry resources, and social media platforms. We are not responsible for the
                privacy practices of these external sites. We encourage you to review the privacy
                policies of any third-party site you visit.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">
                Children&apos;s Privacy
              </h2>
              <p>
                Our Site is not directed to individuals under the age of 16, and we do not knowingly
                collect personal information from children. If we become aware that we have collected
                personal information from a child under 16, we will take steps to delete that
                information.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">
                Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our
                practices or applicable laws. When we make changes, we will update the &ldquo;Last
                Updated&rdquo; date at the top of this page. We encourage you to review this policy
                periodically.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, your personal information, or
                wish to exercise any of your rights, please contact us:
              </p>
              <p className="mt-3 text-white">
                Automated Quality Solutions, Inc.
                <br />
                1420 W. Karcher Rd.
                <br />
                Nampa, ID 83687
                <br />
                <br />
                Email:{" "}
                <a
                  href="mailto:sales@automatedqs.com"
                  className="text-accent-primary hover:underline"
                >
                  sales@automatedqs.com
                </a>
                <br />
                Phone:{" "}
                <a href="tel:+12082974420" className="text-accent-primary hover:underline">
                  (208) 297-4420
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
