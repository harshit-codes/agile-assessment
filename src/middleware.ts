import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
]);

export default clerkMiddleware((auth, req) => {
  // Only protect specific routes that actually need authentication
  if (isProtectedRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - results (public sharing routes - exclude from Clerk middleware)
     * - services (Terms of Service - public page)
     * - policy (Privacy Policy - public page)
     * - api/webhooks (webhook endpoints - exclude from Clerk middleware)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|results|services|policy).*)',
  ],
};