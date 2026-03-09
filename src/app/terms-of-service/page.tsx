import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Terms of Service | AQS — Automated Quality Solutions",
  description:
    "Terms of service for the Automated Quality Solutions website. Usage terms, intellectual property, and legal disclaimers.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navigation />
      <section className="pt-[140px] pb-[100px] px-8">
        <div className="max-w-[800px] mx-auto">
          <h1 className="font-sans text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold text-white mb-4">
            Terms of Service
          </h1>
          <p className="font-mono text-[0.68rem] text-white/30 tracking-[0.1em] uppercase mb-10">
            Last Updated: March 9, 2026
          </p>

          <div className="space-y-8 font-sans text-[0.92rem] text-text-body leading-[1.8]">
            <p>
              Welcome to the website of Automated Quality Solutions, Inc. (&ldquo;AQS,&rdquo;
              &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). These Terms of Service
              (&ldquo;Terms&rdquo;) govern your use of our website at www.automatedqs.com (the
              &ldquo;Site&rdquo;). By accessing or using the Site, you agree to be bound by these
              Terms. If you do not agree, please do not use the Site.
            </p>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Use of the Site</h2>
              <p className="mb-3">
                Our Site provides information about AQS and our automation solutions for packaging
                lines, including VeriPak SCADA systems, IntelliPak feed systems, EvacuPak liquid
                recovery systems, Custom Conveyors, and Sanitary Robotics. The Site is intended for
                use by businesses, packaging professionals, plant managers, and authorized sales
                representatives.
              </p>
              <p className="mb-3">
                You agree to use the Site only for lawful purposes and in accordance with these
                Terms. You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Use the Site in any way that violates applicable federal, state, or local law.
                </li>
                <li>
                  Attempt to gain unauthorized access to any portion of the Site, its servers, or any
                  systems connected to the Site.
                </li>
                <li>
                  Use any automated means (bots, scrapers, or similar tools) to access the Site for
                  purposes other than search engine indexing, except as permitted by our robots.txt
                  file.
                </li>
                <li>
                  Interfere with or disrupt the Site or the servers and networks connected to the
                  Site.
                </li>
                <li>
                  Impersonate any person or entity, or misrepresent your affiliation with any person
                  or entity.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Intellectual Property</h2>
              <p className="mb-3">
                All content on this Site, including but not limited to text, graphics, logos, images,
                product descriptions, technical specifications, animations, and software, is the
                property of Automated Quality Solutions, Inc. or its licensors and is protected by
                United States and international copyright, trademark, and other intellectual property
                laws.
              </p>

              <h3 className="text-white font-semibold text-[1rem] mb-2 mt-4">Trademarks</h3>
              <p className="mb-3">
                The following are trademarks or registered trademarks of Automated Quality
                Solutions, Inc.:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-3">
                <li>
                  <strong className="text-white">Automated Quality Solutions</strong> and the AQS
                  logo
                </li>
                <li>
                  <strong className="text-white">VeriPak</strong>
                </li>
                <li>
                  <strong className="text-white">IntelliPak</strong>
                </li>
                <li>
                  <strong className="text-white">EvacuPak</strong>
                </li>
              </ul>
              <p className="mb-3">
                Other product and company names mentioned on the Site, including One Motion,
                Allen-Bradley, Rockwell Automation, Keyence, KUKA, Intralox, PulseRoller, Habasit,
                and NGI, are trademarks of their respective owners and are used for identification
                purposes only. Their use does not imply endorsement or affiliation.
              </p>
              <p>
                You may not use any AQS trademarks without our prior written permission, except as
                necessary to accurately identify our products in the ordinary course of business.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">
                Quote Requests and Communications
              </h2>
              <p className="mb-3">
                When you submit a quote request or contact form through our Site, you are requesting
                information and are not entering into a binding contract for the purchase of any
                products or services. All quotes provided by AQS are subject to our standard terms
                and conditions of sale, which will be provided with any formal quotation.
              </p>
              <p>
                Information you provide in quote requests and contact forms will be handled in
                accordance with our{" "}
                <a href="/privacy-policy" className="text-accent-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">
                Product Information and Specifications
              </h2>
              <p className="mb-3">
                We make reasonable efforts to ensure that product descriptions, specifications, and
                other technical information on the Site are accurate and current. However, we do not
                warrant that such information is error-free, complete, or current. Product
                specifications, including but not limited to throughput rates, energy savings figures,
                and sanitation time reductions, represent typical or maximum performance under
                specific conditions and may vary based on application, product type, and operating
                environment.
              </p>
              <p className="mb-3">
                All product information is provided for general informational purposes. For
                specifications applicable to your specific application, please contact our sales team
                or request a quote.
              </p>
              <p>
                AQS reserves the right to modify product designs, specifications, and pricing at any
                time without notice.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Disclaimer of Warranties</h2>
              <p className="mb-3 uppercase text-[0.85rem]">
                The Site and all content, materials, and information provided on the Site are
                provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of
                any kind, either express or implied. To the fullest extent permitted by law, AQS
                disclaims all warranties, including but not limited to implied warranties of
                merchantability, fitness for a particular purpose, and non-infringement.
              </p>
              <p className="mb-3 uppercase text-[0.85rem]">
                AQS does not warrant that the Site will be uninterrupted, secure, or free of errors
                or viruses. Your use of the Site is at your own risk.
              </p>
              <p>
                This disclaimer applies only to the Site itself. Warranties for AQS products and
                systems are governed by the applicable product warranty provided at the time of sale.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Limitation of Liability</h2>
              <p className="mb-3 uppercase text-[0.85rem]">
                To the fullest extent permitted by applicable law, AQS, its officers, directors,
                employees, and agents shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, including but not limited to loss of profits,
                data, or business opportunities, arising out of or in connection with your use of or
                inability to use the Site, even if AQS has been advised of the possibility of such
                damages.
              </p>
              <p className="uppercase text-[0.85rem]">
                In no event shall AQS&apos;s total liability to you for all claims arising out of or
                relating to the Site exceed one hundred dollars ($100.00).
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless AQS and its officers, directors,
                employees, and agents from and against any claims, liabilities, damages, losses,
                costs, or expenses (including reasonable attorneys&apos; fees) arising out of or
                relating to your use of the Site or your violation of these Terms.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Third-Party Links</h2>
              <p>
                The Site may contain links to third-party websites, including those of our technology
                partners, industry organizations, and other resources. These links are provided for
                your convenience only. AQS does not endorse and is not responsible for the content,
                products, or services offered by third-party sites. Your use of any third-party site
                is subject to that site&apos;s own terms and conditions.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">
                For Authorized Sales Representatives
              </h2>
              <p>
                Certain areas of the Site, including the &ldquo;For Reps&rdquo; section, may contain
                information intended for authorized AQS sales representatives. Access to and use of
                representative-specific content is subject to the terms of your representative
                agreement with AQS. Unauthorized access to or distribution of representative-specific
                materials is prohibited.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">
                Governing Law and Jurisdiction
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the
                State of Idaho, without regard to its conflict of law provisions. Any legal action or
                proceeding arising out of or relating to these Terms or your use of the Site shall be
                brought exclusively in the state or federal courts located in Canyon County, Idaho,
                and you consent to the personal jurisdiction of such courts.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. When we do, we will revise the
                &ldquo;Last Updated&rdquo; date at the top of this page. Your continued use of the
                Site after any changes constitutes your acceptance of the updated Terms. We encourage
                you to review these Terms periodically.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Severability</h2>
              <p>
                If any provision of these Terms is found to be invalid or unenforceable by a court of
                competent jurisdiction, the remaining provisions shall remain in full force and
                effect.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Contact Us</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us:
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
