import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { pageMetadata, organizationSchema, localBusinessSchema } from "@/content/seo";
import { Analytics } from "@vercel/analytics/next";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { GoogleAnalytics } from "@/components/ui/google-analytics";
import "./globals.css";

// Set in Vercel → Project → Settings → Environment Variables (see .env.example)
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: pageMetadata.home.title,
  description: pageMetadata.home.description,
  metadataBase: new URL("https://automatedqs.com"),
  icons: {
    icon: "/images/logos/aqs-favicon.png",
    apple: "/images/logos/aqs-favicon.png",
  },
  openGraph: {
    title: pageMetadata.home.title,
    description: pageMetadata.home.description,
    url: "https://automatedqs.com",
    siteName: "Automated Quality Solutions",
    type: "website",
  },
  ...(GOOGLE_SITE_VERIFICATION ? { verification: { google: GOOGLE_SITE_VERIFICATION } } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body>
          <main className="relative z-10">{children}</main>
          <CookieConsent />
          <Analytics />
          {GA_MEASUREMENT_ID && <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />}
      </body>
    </html>
  );
}
