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
            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Automated Quality Solutions (&ldquo;AQS&rdquo;) website
                at automatedqs.com, you agree to be bound by these Terms of Service. If you do not
                agree to these terms, please do not use our website.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">2. Use of Website</h2>
              <p>
                This website is provided for informational purposes about AQS products and services.
                You agree to use the website only for lawful purposes and in a manner that does not
                infringe upon the rights of others or restrict their use of the website.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">3. Intellectual Property</h2>
              <p className="mb-3">
                All content on this website — including text, graphics, logos, images, videos, and
                software — is the property of Automated Quality Solutions or its licensors and is
                protected by U.S. and international intellectual property laws.
              </p>
              <p>
                The following are trademarks of Automated Quality Solutions: VeriPak&reg;,
                IntelliPak&reg;, EvacuPak&trade;, and the AQS logo. Unauthorized use of these marks
                is strictly prohibited.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">4. Quote Requests & Submissions</h2>
              <p>
                Information submitted through our contact and quote request forms is used solely to
                respond to your inquiry and provide relevant product information. Submitting a quote
                request does not create a binding contract or obligation. All project proposals,
                pricing, and contracts are subject to separate written agreements.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">5. Product Information</h2>
              <p>
                While we strive to ensure the accuracy of product descriptions, specifications, and
                capabilities presented on this website, all information is subject to change without
                notice. Product images and videos may show optional configurations or features.
                Contact AQS directly for current specifications and availability.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">6. Limitation of Liability</h2>
              <p>
                AQS provides this website and its contents on an &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; basis. To the fullest extent permitted by law, AQS disclaims all
                warranties, express or implied, including warranties of merchantability, fitness for
                a particular purpose, and non-infringement. AQS shall not be liable for any direct,
                indirect, incidental, consequential, or punitive damages arising from your use of or
                inability to use this website.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">7. Third-Party Links</h2>
              <p>
                This website may contain links to third-party websites for your convenience. AQS
                does not endorse, control, or assume responsibility for the content or practices of
                any linked third-party sites.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">8. Governing Law</h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws
                of the State of Idaho, United States, without regard to its conflict of law
                provisions. Any disputes arising under these terms shall be subject to the exclusive
                jurisdiction of the courts located in Ada County, Idaho.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">9. Changes to Terms</h2>
              <p>
                AQS reserves the right to modify these Terms of Service at any time. Changes will be
                effective immediately upon posting to this page. Your continued use of the website
                following any changes constitutes acceptance of the revised terms.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">10. Contact</h2>
              <p>
                For questions about these Terms of Service, contact us at:
              </p>
              <p className="mt-3 text-white">
                Automated Quality Solutions<br />
                Boise, Idaho<br />
                <a href="mailto:info@automatedqs.com" className="text-accent-primary hover:underline">
                  info@automatedqs.com
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
