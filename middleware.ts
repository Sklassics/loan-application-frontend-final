import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "./utils/tokenUtils"

// Define protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/kyc-verification",
  "/eligibility-check",
  "/withdraw-amount",
  "/transaction-processing",
  "/profile",
]

// Define public routes that should redirect to dashboard if already authenticated
const publicAuthRoutes = ["/login", "/register"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token from the cookies
  const token = request.cookies.get("auth_token")?.value || getToken()

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the route is a public auth route (login/register)
  const isPublicAuthRoute = publicAuthRoutes.some((route) => pathname.startsWith(route))

  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // If it's a public auth route and there is a token, redirect to dashboard
  if (isPublicAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Continue with the request for all other cases
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
}

