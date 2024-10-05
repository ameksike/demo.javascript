import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)',
  '/'
])

export default clerkMiddleware((auth, req) => {
  const { userId, orgId, protect } = auth();

  // Protect private routes
  !isPublicRoute(req) && protect();

  // Redirect to the user's default organization or selected organization
  if (userId && isPublicRoute(req)) {
    let path = "/auth/org";
    if (orgId) {
      path = "/organization/" + orgId;
    }
    return NextResponse.redirect(new URL(path, req.url));
  }

  // Create an organization if there is no one
  if (userId && !orgId && req.nextUrl.pathname !== "/auth/org") {
    return NextResponse.redirect(new URL("/auth/org", req.url)); 
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}