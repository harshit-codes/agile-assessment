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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "The Agile Assessment - Find Your Perfect Agile Role",
    template: "%s | The Agile Assessment"
  },
  description: "Discover your ideal Scrum team role with our comprehensive 4-dimensional personality assessment. Map your unique behavioral traits to 16 distinct personality types and accelerate your Agile career.",
  keywords: ["agile", "scrum", "assessment", "personality", "career", "team roles", "agile coach", "product owner", "scrum master", "agile methodology"],
  authors: [{ name: "The Agile Coach" }],
  creator: "The Agile Coach",
  publisher: "The Agile Coach",
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "The Agile Assessment - Find Your Perfect Agile Role",
    description: "Discover your ideal Scrum team role with our comprehensive 4-dimensional personality assessment. Map your unique behavioral traits to 16 distinct personality types.",
    url: "https://agile-assessment.com",
    siteName: "The Agile Assessment",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Agile Assessment - Discover Your Perfect Agile Role"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "The Agile Assessment - Find Your Perfect Agile Role",
    description: "Discover your ideal Scrum team role with our comprehensive 4-dimensional personality assessment.",
    creator: "@agileacademy",
    images: ["/twitter-image.png"]
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/site.webmanifest',
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