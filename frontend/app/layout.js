// Root layout — fonts + global CSS + metadata + GA
import "./globals.css";
import Analytics from "@/components/Analytics";
import ChatWidget from "@/components/ChatWidget";

const SITE_URL = process.env.SITE_URL || "https://solarlc.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Indian Solar Light Centre — Solar Panel, Battery, Pump | Azamgarh",
  description:
    "Azamgarh me solar panel, battery, inverter aur solar pump — dukaan, khet, school, hospital, ghar ke liye. PM-KUSUM subsidy ke saath. 10+ saal ka tajurba, 500+ installs.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='34' fill='%23ffb628'/><g stroke='%23ffb628' stroke-width='7' stroke-linecap='round'><line x1='50' y1='2' x2='50' y2='14'/><line x1='50' y1='86' x2='50' y2='98'/><line x1='2' y1='50' x2='14' y2='50'/><line x1='86' y1='50' x2='98' y2='50'/></g></svg>",
  },
  openGraph: {
    siteName: "Indian Solar Light Centre",
    title: "Indian Solar Light Centre — Solar Panel, Battery, Pump | Azamgarh",
    description: "Azamgarh me solar panel, battery, pump — PM-KUSUM subsidy ke saath. 10+ saal ka tajurba, 500+ installs.",
    images: ["/logo.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
