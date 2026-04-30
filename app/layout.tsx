import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const soriaFont = localFont({
  src: "../public/soria-font.ttf",
  variable: "--font-soria",
});

const vercettiFont = localFont({
  src: "../public/Vercetti-Regular.woff",
  variable: "--font-vercetti",
});

export const metadata: Metadata = {
  title: "Paul Zabotto",
  description: "A curious french nerdy business engineer who likes coding, travelling, and sports.",
  keywords: "Paul Zabotto, Business Engineer, Finance, Entrepreneurship, UC Berkeley, EDHEC, Strategy, M&A, Portfolio",
  authors: [{ name: "Paul Zabotto" }],
  creator: "Paul Zabotto",
  publisher: "Paul Zabotto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Paul Zabotto - Business Engineer",
    description: "A curious french nerdy business engineer who likes coding, travelling, and sports.",
    url: "https://paulzabotto.github.io",
    siteName: "Paul Zabotto's Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paul Zabotto - Business Engineer",
    description: "A curious french nerdy business engineer who likes coding, travelling, and sports.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overscroll-y-none">
      <body
        className={`${soriaFont.variable} ${vercettiFont.variable} font-sans antialiased`}
      >
        {children}
      </body>
      {/* <GoogleAnalytics gaId={'YOUR_GA4_ID'}/> */}
    </html>
  );
}
