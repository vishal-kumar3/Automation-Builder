import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server'

const publicRoutes = createRouteMatcher([
  '/',
  '/signin(.*)',
  '/singup(.*)',
  '/api/clerk-webhook',
  '/api/drive-activity/notification',
  '/api/payment/success'
])

const ignoredRoutes = createRouteMatcher([
  '/api/auth/callback/discord',
  '/api/auth/callback/notion',
  '/api/auth/callback/slack',
  '/api/flow',
  '/api/cron/wait',
])

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

export default clerkMiddleware((auth, req: NextRequest) => {
  if(!(publicRoutes(req) || ignoredRoutes(req))){
    auth().protect();
  }

  if(req.nextUrl.pathname.endsWith('/workflows/editor')){
    return NextResponse.redirect(new URL('/workflows', req.url))
  }

  return NextResponse.next();
});

