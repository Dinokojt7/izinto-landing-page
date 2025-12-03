// src/app/layout.js
import { Inter, Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { ServicesProvider } from "@/providers/ServicesProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { GoogleMapsProvider } from "@/providers/GoogleMapsProvider";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import { AuthProvider } from "@/lib/context/AuthContext";
import { AddressProvider } from "@/providers/AddressProvider";

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

export const metadata = {
  title: "Izinto - On-Demand Home Services",
  description: "Professional home services at your doorstep",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.className} [&.dialog-open]:overflow-hidden`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ReactQueryProvider>
          <GoogleMapsProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <AddressProvider>
              <AuthProvider>
                <ServicesProvider>
                  <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
                </ServicesProvider>
              </AuthProvider>
            </AddressProvider>
          </GoogleMapsProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
