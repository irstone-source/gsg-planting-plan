import type { Metadata } from "next";
import { Space_Grotesk, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://plantingplans.co.uk'),
  title: {
    default: "PlantingPlans – Designer results. DIY planting.",
    template: "%s | PlantingPlans"
  },
  description: "Precision planting plans built around your light, soil, and lifestyle. Architectural vision for UK gardens. Chelsea-inspired designs by AI.",
  keywords: [
    'garden design',
    'planting plan',
    'UK gardens',
    'Chelsea Flower Show',
    'Piet Oudolf',
    'Dan Pearson',
    'Monty Don',
    'landscape design',
    'garden planting',
    'AI garden design'
  ],
  authors: [{ name: 'PlantingPlans' }],
  creator: 'PlantingPlans',
  publisher: 'PlantingPlans',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://plantingplans.co.uk',
    siteName: 'PlantingPlans',
    title: 'PlantingPlans – Designer results. DIY planting.',
    description: 'Precision planting plans built around your light, soil, and lifestyle. Architectural vision for UK gardens.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PlantingPlans - AI-powered garden design',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlantingPlans – Designer results. DIY planting.',
    description: 'Precision planting plans built around your light, soil, and lifestyle.',
    images: ['/og-image.jpg'],
    creator: '@plantingplans',
  },
  alternates: {
    canonical: 'https://plantingplans.co.uk',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
