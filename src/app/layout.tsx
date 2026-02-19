import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { pageMetadata, organizationSchema } from "@/content/seo";
import "./globals.css";

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
  metadataBase: new URL("https://www.automatedqs.com"),
  icons: {
    icon: "/images/logos/aqs-favicon.png",
    apple: "/images/logos/aqs-favicon.png",
  },
  openGraph: {
    title: pageMetadata.home.title,
    description: pageMetadata.home.description,
    url: "https://www.automatedqs.com",
    siteName: "Automated Quality Solutions",
    type: "website",
  },
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
      </head>
      <body>
        <SmoothScroll>
          {/* Background effects */}
          <div className="particle-grid" />
          <div className="noise-overlay" />
          <CursorGlow />
          <CustomCursor />

          {/* Page content */}
          <main className="relative z-10">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
