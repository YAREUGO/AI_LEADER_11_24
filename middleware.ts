// 환경 변수가 있을 때만 Clerk middleware 사용
const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default async function middleware(request: any) {
  // Clerk 환경 변수가 없으면 그냥 통과
  if (!CLERK_PUBLISHABLE_KEY) {
    return;
  }
  
  // 환경 변수가 있을 때만 Clerk middleware 사용
  const { clerkMiddleware } = await import('@clerk/nextjs/server');
  return clerkMiddleware()(request);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};