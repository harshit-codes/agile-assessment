import HomePageClient from "./HomePageClient";


interface PageProps {
  params: Promise<{
    rest?: string[];
  }>;
  searchParams: Promise<{
    retakeFrom?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function HomePage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  console.log("🔍 Page - 1a. HomePage component rendering");
  console.log("🔍 Page - 1b. Environment in HomePage:", process.env.NODE_ENV);
  console.log("🔍 Page - 1c. Component execution time:", new Date().toISOString());
  console.log("🔍 Page - 1d. Clerk Publishable Key:", process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + "...");
  console.log("🔍 Page - 1e. Route params:", resolvedParams);
  console.log("🔍 Page - 1f. Search params:", resolvedSearchParams);
  
  // Handle catch-all routing - only show this page for root route
  if (resolvedParams.rest && resolvedParams.rest.length > 0) {
    // Allow specific routes to handle themselves (results, sign-in, sign-up, etc.)
    const firstSegment = resolvedParams.rest[0];
    
    // Exclude specific routes that should be handled by their own page.tsx files
    if (['results', 'sign-in', 'sign-up', 'policy', 'services'].includes(firstSegment)) {
      console.log(`🔍 Page - Allowing ${firstSegment} route to handle itself`);
      return null; // Let the specific route handle this
    }
    
    // For other non-root routes, return 404
    console.log("🔍 Page - Non-root route, should 404");
    return null; // Let Next.js handle the 404
  }

  // Extract retakeFrom parameter for client component
  const retakeFromSessionId = resolvedSearchParams.retakeFrom || null;

  // Return the client component for root route with extracted params
  return <HomePageClient retakeFromSessionId={retakeFromSessionId} />;
}