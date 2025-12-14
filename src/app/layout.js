// src/app/layout.js
import { Inter, Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { ServicesProvider } from "@/providers/ServicesProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { GoogleMapsProvider } from "@/providers/GoogleMapsProvider";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import { AuthProvider } from "@/lib/context/AuthContext";
import { AddressProvider } from "@/providers/AddressProvider";
import { OtpProvider } from "@/lib/context/OtpContext";
import GlobalOtpDialog from "@/components/auth/GlobalOtpDialog";
import { ProfileDialogProvider } from "@/lib/context/ProfileDialogContext";
import ProfileDialog from "@/components/layout/ProfileDialog";

const inter = Inter({ weight: ["400", "900"], subsets: ["latin"] });

const roboto = Roboto({
  weight: ["400", "900"],
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Regular metadata
export const metadata = {
  title: "Izinto - On-Demand Home Services",
  description: "Professional home services at your doorstep",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Izinto",
  },
};

// Separate viewport export
export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.className} [&.dialog-open]:overflow-hidden`}
      suppressHydrationWarning
    >
      <head>
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Izinto" />

        {/* Viewport with cover support */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />

        {/* iOS Splash Screens */}
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
      </head>
      <body suppressHydrationWarning className="bg-white text-black">
        {/* Status bar spacer for iOS */}
        <div className="status-bar-area" />

        <ReactQueryProvider>
          <GoogleMapsProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <AuthProvider>
              <ProfileDialogProvider>
                <AddressProvider>
                  <ServicesProvider>
                    <ClientLayoutWrapper>
                      <OtpProvider>
                        {children}
                        <GlobalOtpDialog />
                        <ProfileDialog />
                      </OtpProvider>
                    </ClientLayoutWrapper>
                  </ServicesProvider>
                </AddressProvider>
              </ProfileDialogProvider>
            </AuthProvider>
          </GoogleMapsProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
