import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { GraphQLProvider } from "@/lib/graphql-provider";
import SimpleGraphQLProvider from "@/lib/SimpleGraphQLProvider";
import Footer from "@/components/layout/Footer";
import WebVitals from "@/components/monitoring/WebVitals";
import ProductionDebugger from "@/components/debug/ProductionDebugger";
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
  // Always use GraphQLProvider in production layout
  // Individual pages can choose their own provider logic
  
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
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
          
          {/* Comprehensive Debug Script */}
          <script dangerouslySetInnerHTML={{
            __html: `
              console.log("🔍 Layout - 1. Layout script executing");
              console.log("🔍 Layout - 2. Window location:", window.location.href);
              console.log("🔍 Layout - 2a. Using provider:", "GraphQLProvider");
              
              // Environment variable client-side verification
              console.log("🔍 Layout - 4a. Client-side process.env check:", typeof window !== 'undefined' ? 'browser environment' : 'server environment');
              
              // DOM and component tree debugging
              window.addEventListener('DOMContentLoaded', function() {
                console.log("🔍 Layout - 5a. DOM Content Loaded");
                
                // Check for ConvexProvider in DOM
                setTimeout(() => {
                  console.log("🔍 Layout - 5b. Checking DOM for ConvexProvider traces...");
                  const scripts = document.querySelectorAll('script');
                  console.log("🔍 Layout - 5c. Total scripts loaded:", scripts.length);
                  
                  // Check for React root
                  const nextRoot = document.querySelector('#__next') || document.querySelector('body > div');
                  console.log("🔍 Layout - 5d. React root element found:", !!nextRoot);
                  
                  if (nextRoot) {
                    console.log("🔍 Layout - 5e. React root children count:", nextRoot.children.length);
                    console.log("🔍 Layout - 5f. React root innerHTML length:", nextRoot.innerHTML.length);
                  }
                }, 1000);
              });
              
              window.addEventListener('load', function() {
                console.log("🔍 Layout - 6a. Window fully loaded");
                
                // Extended debugging checks
                setTimeout(() => {
                  console.log("🔍 Layout - 6b. Performing extended diagnostics...");
                  
                  // Check if any errors occurred
                  console.log("🔍 Layout - 6c. Window.onerror events:", window.addEventListener ? 'available' : 'unavailable');
                  
                  // Check for React errors
                  if (window.React) {
                    console.log("🔍 Layout - 6d. React available globally:", !!window.React);
                  }
                  
                  // Check console for any suppressed errors
                  const originalError = console.error;
                  let errorCount = 0;
                  console.error = function(...args) {
                    errorCount++;
                    console.log("🔍 Layout - 6e. Console error #" + errorCount + ":", args);
                    return originalError.apply(console, args);
                  };
                  
                  console.log("🔍 Layout - 6f. Error monitoring initialized");
                }, 3000);
                
                // Final diagnostic after all scripts should have loaded
                setTimeout(() => {
                  console.log("🔍 Layout - 7a. Final diagnostic (5s delay)");
                  console.log("🔍 Layout - 7b. Total console entries since page load: check developer tools");
                  console.log("🔍 Layout - 7c. If ConvexProvider logs are missing, there's a module loading issue");
                }, 5000);
              });
              
              // Error boundary simulation
              window.addEventListener('error', function(event) {
                console.error("🔍 Layout - ERROR. Global error caught:", event.error);
                console.error("🔍 Layout - ERROR. Error message:", event.message);
                console.error("🔍 Layout - ERROR. Error filename:", event.filename);
                console.error("🔍 Layout - ERROR. Error lineno:", event.lineno);
              });
              
              window.addEventListener('unhandledrejection', function(event) {
                console.error("🔍 Layout - PROMISE ERROR. Unhandled promise rejection:", event.reason);
              });
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
          <script dangerouslySetInnerHTML={{
            __html: `
              console.log("🔍 Layout - 8a. Body script executing");
              console.log("🔍 Layout - 8b. About to render GraphQLProvider");
              console.log("🔍 Layout - 8c. About to render application");
            `
          }} />
          <GraphQLProvider>
            {/* Performance Monitoring */}
            <WebVitals debug={process.env.NODE_ENV === 'development'} />
            
            {/* Production Debugging */}
            <ProductionDebugger enabledInProduction={true} />
            
            <main className="flex-1" suppressHydrationWarning={true}>
              {children}
            </main>
            <Footer />
          </GraphQLProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}