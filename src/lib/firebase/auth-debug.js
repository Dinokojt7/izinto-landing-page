// lib/firebase/auth-debug.js
import { useEffect } from "react";
export const debugRedirectFlow = () => {
  if (typeof window === "undefined") return;

  console.log("=== FIREBASE REDIRECT DEBUG ===");
  console.log("Current URL:", window.location.href);
  console.log("Has hash:", window.location.hash);
  console.log("Has query params:", window.location.search);
  console.log(
    "Session storage redirect path:",
    sessionStorage.getItem("auth_redirect_path"),
  );
  console.log(
    "Session storage auth type:",
    sessionStorage.getItem("auth_type"),
  );

  // Check for Firebase redirect params in URL
  const urlParams = new URLSearchParams(window.location.search);
  console.log("URL parameters:", Object.fromEntries(urlParams.entries()));

  console.log("=== END DEBUG ===");
};

// Call this in your AuthContext
useEffect(() => {
  if (typeof window !== "undefined") {
    import("@/lib/firebase/auth-debug").then(({ debugRedirectFlow }) => {
      debugRedirectFlow();
    });
  }
}, []);
