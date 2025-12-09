// middleware.js - FIXED VERSION
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Debug: Always log what's being checked
  console.log(`🛡️ Middleware checking: "${pathname}"`);

  // CRITICAL: Always allow these without any checks
  const alwaysAllow = [
    "/checkout/success", // This MUST be allowed
    "/not-found", // The not-found page itself
  ];

  // Check clean pathname (without query params) against alwaysAllow
  const cleanPathname = pathname.split("?")[0];

  if (alwaysAllow.some((route) => cleanPathname === route)) {
    console.log(`✅ Always allowed: ${cleanPathname}`);
    return NextResponse.next();
  }

  // Skip validation for internal paths and static files
  if (
    // Skip internal Next.js paths
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/_static/") ||
    pathname.startsWith("/_vercel/") ||
    pathname.startsWith("/_buildManifest") ||
    pathname.startsWith("/_ssgManifest") ||
    // Skip API routes
    pathname.startsWith("/api/") ||
    // Skip public files
    pathname.startsWith("/public/") ||
    // Skip known file extensions
    pathname.match(
      /\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|webp|mp4|webm|json)$/i,
    )
  ) {
    console.log(`⏭️ Skipping internal/static: ${pathname}`);
    return NextResponse.next();
  }

  // List of all valid routes
  const validRoutes = [
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
    "/services",
    "/laundry",
    "/gas-refill",
    "/carpet-care",
    "/pet-care",
    "/home-items",
  ];

  // Check exact matches
  if (validRoutes.includes(cleanPathname)) {
    console.log(`✅ Valid route: ${cleanPathname}`);
    return NextResponse.next();
  }

  // Check dynamic patterns
  const dynamicPatterns = [
    /^\/p\/[^/]+$/, // /p/[service]
    /^\/s\/[^/]+$/, // /s/[provider]
    /^\/help\/[^/]+$/, // /help/[categories]
    /^\/categories\/[^/]+$/, // /categories/[slug]
    /^\/categories\/[^/]+\/[^/]+$/, // /categories/[slug]/[section]
  ];

  for (const pattern of dynamicPatterns) {
    if (pattern.test(cleanPathname)) {
      console.log(`✅ Dynamic pattern match: ${cleanPathname}`);

      // For /p/ and /s/ routes, check if they exist
      if (cleanPathname.startsWith("/p/") || cleanPathname.startsWith("/s/")) {
        try {
          const routeType = cleanPathname.startsWith("/p/")
            ? "service"
            : "provider";
          const routeName = cleanPathname.split("/")[2];

          if (await checkRouteExists(routeType, routeName)) {
            console.log(`✅ Route exists: ${cleanPathname}`);
            return NextResponse.next();
          }
        } catch (error) {
          console.log(
            `⚠️ Route check failed for ${cleanPathname}:`,
            error.message,
          );
          // Continue to 404
        }
      } else {
        // For other dynamic patterns, allow them
        return NextResponse.next();
      }
    }
  }

  // Check service endpoints
  const serviceEndpoints = [
    "/laundry",
    "/gas-refill",
    "/carpet-care",
    "/pet-care",
    "/home-items",
  ];

  for (const endpoint of serviceEndpoints) {
    if (
      cleanPathname === endpoint ||
      cleanPathname.startsWith(endpoint + "/")
    ) {
      console.log(`✅ Service endpoint: ${cleanPathname}`);
      return NextResponse.next();
    }
  }

  // Route not found
  console.log(`❌ 404: ${pathname} -> Redirecting to /not-found`);

  const url = request.nextUrl.clone();
  url.pathname = "/not-found";
  url.searchParams.set("from", pathname);

  return NextResponse.rewrite(url);
}

async function checkRouteExists(routeType, routeSlug) {
  try {
    const routeName = routeSlug.replace(/-/g, " ");
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://your-netlify-app.netlify.app/.netlify/functions/api";

    const response = await fetch(`${apiUrl}/all-services`, {
      headers: { "Cache-Control": "no-cache" },
    });

    if (!response.ok) return false;

    const services = await response.json();

    if (routeType === "service") {
      return services.some((service) => {
        const serviceName = service.name?.toLowerCase().replace(/\s+/g, "-");
        return serviceName === routeSlug.toLowerCase();
      });
    } else {
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

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json).*)",
  ],
};
