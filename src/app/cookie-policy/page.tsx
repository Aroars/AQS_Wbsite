import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Cookie Policy | Automated Quality Solutions",
  description:
    "Information about how Automated Quality Solutions uses cookies and tracking technologies on automatedqs.com, and how to manage your preferences.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <Navigation />
      <section className="pt-[140px] pb-[100px] px-8">
        <div className="max-w-[800px] mx-auto">
          <h1 className="font-sans text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold text-white mb-4">
            Cookie Policy
          </h1>
          <p className="font-mono text-[0.68rem] text-white/30 tracking-[0.1em] uppercase mb-10">
            Last Updated: March 9, 2026
          </p>

          <div className="space-y-8 font-sans text-[0.92rem] text-text-body leading-[1.8]">
            <p>
              This Cookie Policy explains how Automated Quality Solutions, Inc.
              (&ldquo;AQS,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) uses
              cookies and similar tracking technologies on our website at www.automatedqs.com (the
              &ldquo;Site&rdquo;).
            </p>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website.
                They help the website remember your preferences and understand how you interact with
                the site. Cookies can be &ldquo;session&rdquo; cookies (which expire when you close
                your browser) or &ldquo;persistent&rdquo; cookies (which remain on your device until
                they expire or you delete them).
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">How We Use Cookies</h2>

              <h3 className="text-white font-semibold text-[0.98rem] mt-5 mb-2">Essential Cookies</h3>
              <p className="mb-3">
                These cookies are necessary for the Site to function properly. They enable core
                functionality such as page navigation, security, and accessibility. You cannot opt
                out of essential cookies, as the Site cannot function without them.
              </p>
              <div className="overflow-x-auto mb-5">
                <table className="w-full text-[0.82rem]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white py-2 pr-4">Cookie</th>
                      <th className="text-left text-white py-2 pr-4">Purpose</th>
                      <th className="text-left text-white py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4">Cookie consent preference</td>
                      <td className="py-2 pr-4">Remembers your cookie choices so the banner is not shown on every visit</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4">Session ID</td>
                      <td className="py-2 pr-4">Maintains your browsing session</td>
                      <td className="py-2">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-white font-semibold text-[0.98rem] mt-5 mb-2">Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with our Site by collecting
                information about pages visited, time spent on pages, and navigation patterns. This
                data is aggregated and anonymous. Analytics cookies are only set after you provide
                consent.
              </p>

              <h3 className="text-white font-semibold text-[0.98rem] mt-5 mb-2">Preference Cookies</h3>
              <p>
                These cookies remember choices you make on the Site, such as language preferences or
                display settings, to provide a more personalized experience.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Managing Your Cookie Preferences</h2>
              <p className="mb-3">
                When you first visit our Site, a cookie consent banner will ask you to accept or
                decline non-essential cookies. You can change your preferences at any time by:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Clicking the &ldquo;Cookie Settings&rdquo; link in the Site footer.</li>
                <li>
                  Adjusting your browser settings to block or delete cookies. Note that blocking all
                  cookies may affect the functionality of the Site.
                </li>
              </ul>

              <h3 className="text-white font-semibold text-[0.98rem] mt-5 mb-2">Browser-Level Controls</h3>
              <p>
                Most web browsers allow you to manage cookies through their settings. You can
                typically find these options in the &ldquo;Privacy&rdquo; or &ldquo;Security&rdquo;
                section of your browser preferences. Please note that disabling cookies may limit
                certain features of the Site.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Third-Party Cookies</h2>
              <p>
                Our analytics provider may set cookies on your device when you visit our Site. These
                third-party cookies are governed by the respective provider&apos;s privacy policy. We
                do not allow third-party advertising cookies on our Site.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Do Not Track Signals</h2>
              <p>
                Some browsers include a &ldquo;Do Not Track&rdquo; feature that signals to websites
                that you do not want your activity tracked. Our Site respects Do Not Track signals
                and will not set non-essential cookies when such a signal is detected.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Changes to This Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in the cookies
                we use or for other operational, legal, or regulatory reasons. We will update the
                &ldquo;Last Updated&rdquo; date at the top of this page when changes are made.
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold text-[1.1rem] mb-3">Contact Us</h2>
              <p>If you have questions about our use of cookies, please contact us:</p>
              <p className="mt-3 text-white">
                Automated Quality Solutions, Inc.<br />
                1420 W. Karcher Rd.<br />
                Nampa, ID 83687<br />
                <br />
                <a href="mailto:sales@automatedqs.com" className="text-accent-primary hover:underline">
                  sales@automatedqs.com
                </a>
                <br />
                (208) 297-4420
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
