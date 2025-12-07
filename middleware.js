// middleware.js
import { NextResponse } from "next/server";

// Your static routes
const staticRoutes = [
  "/",
  "/help",
  "/faqs",
  "/blog",
  "/cart",
  "/checkout",
  "/auth/login",
  "/auth/register",
  "/profile",
  "/settings",
  "/policy/privacy-policy",
  "/policy/terms-of-use",
  "/c/affiliates-and-partnerships",
  // Service pages
  "/services",
  "/laundry",
  "/gas-refill",
  "/carpet-care",
  "/pet-care",
  "/home-items",
];

// Dynamic route patterns - only include patterns that actually exist
const dynamicRoutePatterns = [
  "/p/[service]", // Service detail pages: /p/laundry-service
  "/s/[provider]", // Provider pages: /s/carpet-care
  // Remove patterns that don't exist in your app
];

// API endpoints from your services-data.js - these should be in staticRoutes
const serviceEndpoints = [
  "/laundry",
  "/gas-refill",
  "/carpet-care",
  "/pet-care",
  "/home-items",
];

// Check if a path matches any dynamic pattern
function matchesDynamicPattern(pathname) {
  return dynamicRoutePatterns.some((pattern) => {
    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/\[.*?\]/g, "[^/]+")
      .replace(/\//g, "\\/");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  });
}

// Check if path is valid
function isValidPath(pathname) {
  // Skip API, internal, and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/_static/") ||
    pathname.startsWith("/_vercel/") ||
    pathname.startsWith("/public/") ||
    pathname.match(
      /\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|webp|mp4|webm)$/,
    )
  ) {
    return true;
  }

  // Check static routes
  if (staticRoutes.includes(pathname)) {
    return true;
  }

  // Check dynamic patterns
  if (matchesDynamicPattern(pathname)) {
    return true;
  }

  // Check if it's a service endpoint
  if (
    serviceEndpoints.some(
      (endpoint) =>
        pathname === endpoint || pathname.startsWith(endpoint + "/"),
    )
  ) {
    return true;
  }

  return false;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip validation for known valid paths
  if (isValidPath(pathname)) {
    return NextResponse.next();
  }

  // For dynamic service/provider routes, check if they exist
  if (pathname.startsWith("/p/") || pathname.startsWith("/s/")) {
    try {
      const routeType = pathname.startsWith("/p/") ? "service" : "provider";
      const routeName = pathname.split("/")[2];

      if (routeName) {
        const exists = await checkRouteExists(routeType, routeName);
        if (exists) {
          return NextResponse.next();
        }
      }
    } catch (error) {
      // Continue to 404 if check fails
    }
  }

  // Log the 404 for debugging
  console.log(`404: ${pathname} - Redirecting to not-found page`);

  // IMPORTANT: Rewrite to '/not-found' (not '/404')
  // Next.js App Router uses '/not-found' as the special route
  const url = request.nextUrl.clone();
  url.pathname = "/not-found";
  url.searchParams.set("from", pathname);

  return NextResponse.rewrite(url);
}

// Function to check if a dynamic route exists
async function checkRouteExists(routeType, routeSlug) {
  try {
    const routeName = routeSlug.replace(/-/g, " ");

    // Use your existing API to check for services
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://your-netlify-app.netlify.app/.netlify/functions/api";

    const response = await fetch(`${apiUrl}/all-services`, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) return false;

    const services = await response.json();

    if (routeType === "service") {
      // Check if service exists
      return services.some((service) => {
        const serviceName = service.name?.toLowerCase().replace(/\s+/g, "-");
        return serviceName === routeSlug.toLowerCase();
      });
    } else {
      // Check if provider exists
      const providers = [
        ...new Set(services.map((s) => s.provider).filter(Boolean)),
      ];
      return providers.some((provider) => {
        const providerSlug = provider.toLowerCase().replace(/\s+/g, "-");
        return providerSlug === routeSlug.toLowerCase();
      });
    }
  } catch (error) {
    console.log("Route check failed:", error.message);
    return false;
  }
}

// Apply middleware to all routes except static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json).*)",
  ],
};
