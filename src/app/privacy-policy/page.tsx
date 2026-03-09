import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Privacy Policy | AQS — Automated Quality Solutions",
  description:
    "Privacy policy for Automated Quality Solutions. Learn how we collect, use, and protect your personal information.",
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
            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">1. Introduction</h2>
              <p>
                Automated Quality Solutions (&ldquo;AQS,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;
                or &ldquo;our&rdquo;) respects your privacy and is committed to protecting the
                personal information you share with us. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you visit our website at
                automatedqs.com or submit inquiries through our contact forms.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">2. Information We Collect</h2>
              <p className="mb-3">
                <strong className="text-white">Information You Provide:</strong> When you submit a
                quote request or contact form, we collect your name, email address, phone number
                (optional), company name, message content, and solution interests.
              </p>
              <p className="mb-3">
                <strong className="text-white">Automatically Collected Information:</strong> We may
                collect standard web analytics data including IP address, browser type, device
                information, pages visited, and referring URLs through cookies and similar
                technologies.
              </p>
              <p>
                <strong className="text-white">Cookies:</strong> Our site may use essential cookies
                for functionality and optional analytics cookies to understand how visitors use our
                site. You can manage cookie preferences through our cookie consent banner.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Respond to your quote requests and inquiries</li>
                <li>Provide information about our products and services</li>
                <li>Improve our website and user experience</li>
                <li>Comply with legal obligations</li>
                <li>Send follow-up communications related to your inquiry (you may opt out at any time)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">4. Information Sharing</h2>
              <p>
                We do not sell, rent, or trade your personal information to third parties. We may
                share information with trusted service providers who assist in operating our website
                and delivering services (e.g., email delivery, analytics), subject to confidentiality
                obligations. We may also disclose information when required by law or to protect our
                rights.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">5. Data Security</h2>
              <p>
                We implement reasonable technical and organizational measures to protect your
                personal information against unauthorized access, alteration, disclosure, or
                destruction. However, no method of transmission over the Internet is 100% secure,
                and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">6. Data Retention</h2>
              <p>
                We retain personal information for as long as necessary to fulfill the purposes for
                which it was collected, typically for the duration of any business relationship plus a
                reasonable period afterward for follow-up and legal compliance.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">7. Your Rights</h2>
              <p className="mb-3">
                Depending on your location, you may have the right to access, correct, delete, or
                restrict the processing of your personal information. You may also have the right to
                data portability and to withdraw consent where processing is based on consent.
              </p>
              <p>
                <strong className="text-white">California Residents (CCPA):</strong> You have the
                right to know what personal information we collect, request its deletion, and opt out
                of the sale of personal information (we do not sell personal information).
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">8. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites (e.g., LinkedIn, YouTube).
                We are not responsible for the privacy practices of these external sites. We
                encourage you to review their privacy policies.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this
                page with an updated &ldquo;Last Updated&rdquo; date. Your continued use of the
                website after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">10. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or wish to exercise your privacy
                rights, contact us at:
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
