import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/kyc-verification",
  "/eligibility-check",
  "/withdraw-amount",
  "/transaction-processing",
  "/bank-verification",
  "/profile",
]

// Define public routes that should redirect to dashboard if already authenticated
const publicAuthRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value
  const profileCookie = request.cookies.get("profile")?.value

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the route is a public auth route (login/register)
  const isPublicAuthRoute = publicAuthRoutes.some((route) => pathname.startsWith(route))

  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    return redirectToLogin(request)
  }

  // If it's a public auth route and there is a token, redirect to dashboard
  if (isPublicAuthRoute && token) {
    let profileData = profileCookie ? JSON.parse(profileCookie) : null;
    console.log("Profile Data:", profileData);
    if (!profileData) {
      profileData = await fetchAndStoreProfile(request, token);
    }

    // Prevent infinite loop by ensuring we don't redirect to login if already there
    if (request.nextUrl.pathname === "/login") {
      return NextResponse.next();
    }

    return handleAuthRedirect(request, profileData);
  }
  return NextResponse.next()
}


// Redirect to login if no token
function redirectToLogin(request: NextRequest) {
  const url = new URL("/login", request.url)
  url.searchParams.set("from", request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

// Fetch profile data from API and store in cookies
async function fetchAndStoreProfile(request: NextRequest, token: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.status || res.status >= 400) {
      console.error(
        `Error fetching profile: ${res.status} ${res.statusText}`
      )
      return null
    }
    const profileData = await res.json()
    const response = NextResponse.next()
    // Store profile data in cookies for future requests
    response.cookies.set("profile", JSON.stringify(profileData.data.keys), {
      httpOnly: true,
      secure: true,
      path: "/",
    })

    return profileData.data.keys
  } catch (error) {
    console.error("Error fetching profile:", error)
    return null
  }
}

// Determine redirection based on profile state
function handleAuthRedirect(request: NextRequest, profileData: any) {
  let route = "/dashboard"

  if (!profileData) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  
  if (!profileData.isEmailVerified) {
    route = "/verify-email"
  } else if (!profileData.isProfileComplete) {
    route = "/onboarding"
  } else if (!profileData.isSelfieVerified) {
    route = "/verify-selfie"
  } else if (!profileData.isKycVerified) {
    route = "/kyc-verification"
  } else if (!profileData.isCreditScoreGood) {
    route = "/eligibility-check"
  } else if (!profileData.isBankAccountVerified) {
    route = "/bank-verification"
  } else if (!profileData.isWithDrawAmount) {
    route = "/withdraw-amount"
  }

  return NextResponse.redirect(new URL(route, request.url))
}

// Middleware configuration
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
