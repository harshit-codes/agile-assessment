import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from "@/lib/convex-provider";
import Footer from "@/components/layout/Footer";
import "./globals.css";

// Primary body font - Funnel Sans via Inter fallback for now
const funnelSans = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: 'swap',
  variable: '--font-body',
  preload: true,
});

// Heading font - Funnel Display via Inter fallback for now  
const funnelDisplay = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal"],
  display: 'swap',
  variable: '--font-head',
  preload: true,
});

// Keep Inter as system fallback
const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://quiz.theagilecoach.com'),
  title: {
    default: "The Agile Assessment - Find Your Perfect Agile Role",
    template: "%s | The Agile Assessment"
  },
  description: "Discover your ideal Scrum team role with our comprehensive 4-dimensional personality assessment. Map your unique behavioral traits to 16 distinct personality types and accelerate your Agile career.",
  keywords: [
    "agile assessment", "scrum team roles", "personality test", "agile methodology", 
    "career development", "team dynamics", "scrum master", "product owner", 
    "agile coach", "developer roles", "behavioral assessment", "workplace personality",
    "agile transformation", "team building", "professional development", "agile careers"
  ],
  authors: [{ name: "The Agile Coach", url: "https://theagilecoach.com" }],
  creator: "The Agile Coach",
  publisher: "The Agile Coach",
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
  alternates: {
    canonical: 'https://quiz.theagilecoach.com',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: 'business',
  classification: 'Assessment Tool',
  openGraph: {
    type: "website",
    locale: 'en_US',
    title: "The Agile Assessment - Find Your Perfect Agile Role",
    description: "Discover your ideal Scrum team role with our comprehensive 4-dimensional personality assessment. Map your unique behavioral traits to 16 distinct personality types and accelerate your Agile career.",
    url: "https://quiz.theagilecoach.com",
    siteName: "The Agile Assessment",
    images: [
      {
        url: "/api/og/personality-report?name=The%20Agile%20Assessment&shortName=QUIZ&description=Discover%20your%20ideal%20Scrum%20team%20role&characteristics=Comprehensive,4-Dimensional,Career-Focused,Team-Oriented&motto=Find%20Your%20Perfect%20Agile%20Role",
        width: 1200,
        height: 630,
        alt: "The Agile Assessment - Discover Your Perfect Agile Role",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@theagilecoach",
    creator: "@theagilecoach",
    title: "The Agile Assessment - Find Your Perfect Agile Role",
    description: "Discover your ideal Scrum team role with our comprehensive 4-dimensional personality assessment. Map your unique behavioral traits to 16 distinct personality types.",
    images: {
      url: "/api/og/personality-report?name=The%20Agile%20Assessment&shortName=QUIZ&description=Discover%20your%20ideal%20Scrum%20team%20role&characteristics=Comprehensive,4-Dimensional,Career-Focused,Team-Oriented&motto=Find%20Your%20Perfect%20Agile%20Role",
      alt: "The Agile Assessment - Find Your Perfect Agile Role"
    }
  },
  icons: {
    icon: [{ url: '/favicon.png', sizes: '32x32', type: 'image/png' }],
    shortcut: '/favicon.png',
    apple: [{ url: '/favicon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Agile Assessment',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#4F46E5',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#4F46E5',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${funnelSans.variable} ${funnelDisplay.variable} ${inter.variable}`} suppressHydrationWarning={true}>
        <head>
          {/* Google Fonts - Funnel Sans & Funnel Display */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link 
            href="https://fonts.googleapis.com/css2?family=Funnel+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800&display=swap" 
            rel="stylesheet" 
          />
          <link 
            href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300;400;500;600;700;800;900&display=swap" 
            rel="stylesheet" 
          />
          <link 
            href="https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap" 
            rel="stylesheet" 
          />
          
          {/* Debug script to verify JavaScript execution */}
          <script dangerouslySetInnerHTML={{
            __html: `
              console.log("🔍 Debug - Layout script executing");
              console.log("🔍 Debug - NEXT_PUBLIC_CONVEX_URL:", "${process.env.NEXT_PUBLIC_CONVEX_URL}");
              console.log("🔍 Debug - Window location:", window.location.href);
            `
          }} />
          
          {/* Critical CSS Variables Inlined to Prevent FOUC */}
          <style dangerouslySetInnerHTML={{
            __html: `
              :root {
                --background: 230 25% 9%;
                --foreground: 221.5 40% 96%;
                --card: 235 30% 15%;
                --primary: 240 65% 60%;
                --text-primary: 221.5 40% 96%;
                --text-secondary: 218 30% 78%;
                --border: 235 25% 25%;
                --muted: 235 30% 15%;
                --muted-foreground: 218 25% 65%;
                --font-body: 'Funnel Sans', sans-serif;
                --font-head: 'Funnel Display', serif;
              }
              body { 
                background-color: hsl(230 25% 9%);
                color: hsl(221.5 40% 96%);
                font-family: var(--font-body);
              }
              .font-head, .font-heading, h1, h2, h3, h4, h5, h6 {
                font-family: var(--font-head);
              }
              .font-body {
                font-family: var(--font-body);
              }
            `
          }} />
        </head>
        <body className={`${funnelSans.className} antialiased min-h-screen flex flex-col`} suppressHydrationWarning={true}>
          <ConvexClientProvider>
            <main className="flex-1" suppressHydrationWarning={true}>
              {children}
            </main>
            <Footer />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}