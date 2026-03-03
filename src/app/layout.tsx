import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
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
          <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
