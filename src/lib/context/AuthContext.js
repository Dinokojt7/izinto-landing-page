"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import {
  signInWithGoogle,
  sendPhoneOTP,
  verifyPhoneOTP,
  logoutUser,
  setupAuthListener,
  getUserProfile,
  handleRedirectResult,
  clearRedirectPath,
  checkProfileCompletion,
  updateUserProfile,
} from "@/lib/firebase/auth";
import CircularProgressIndicator from "@/components/ui/CircularProgessIndicator";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingRedirect, setIsCheckingRedirect] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [phoneAuthState, setPhoneAuthState] = useState({
    step: "input",
    phoneNumber: "",
    confirmationResult: null,
    recaptchaVerifier: null,
    error: "",
  });
  const router = useRouter();
  const pathname = usePathname();
  const recaptchaContainerRef = useRef(null);
  const hasCheckedRedirect = useRef(false);

  // Handle redirect result from Google auth
  const checkAndHandleRedirect = useCallback(async () => {
    if (hasCheckedRedirect.current) return;
    hasCheckedRedirect.current = true;

    try {
      const result = await handleRedirectResult();

      if (result.success && result.user) {
        setUser(result.user);
        setIsNewUser(result.newUser || false);

        // Get complete user profile
        const profile = await getUserProfile(result.user.uid);
        if (profile.success) {
          setUserProfile(profile.data);
          setProfileComplete(profile.profileComplete || false);
        }

        // Handle redirect based on user state
        const shouldCompleteProfile =
          result.newUser || !profile.profileComplete;

        if (shouldCompleteProfile) {
          // Redirect to profile completion if needed
          if (pathname !== "/profile") {
            router.push("/profile");
          }
        } else if (result.returnPath && result.returnPath !== pathname) {
          // Return to original page if profile is complete
          router.push(result.returnPath);
        }
      }
    } catch (error) {
      console.error("Error checking redirect result:", error);
    } finally {
      setIsCheckingRedirect(false);
    }
  }, [router, pathname]);

  // Auth listener and handle redirect
  useEffect(() => {
    let mounted = true;

    // handle auth state
    const unsubscribe = setupAuthListener(async (authData) => {
      if (!mounted) return;

      if (authData?.user) {
        console.log("Auth state changed:", authData.user.uid);
        setUser(authData.user);
        setIsNewUser(authData.newUser || false);
        setProfileComplete(authData.profileComplete || false);

        const profile = await getUserProfile(authData.user.uid);
        if (profile.success && mounted) {
          setUserProfile(profile.data);
        }

        const shouldCompleteProfile =
          authData.newUser || !authData.profileComplete;
        if (shouldCompleteProfile && pathname !== "/profile" && mounted) {
          router.push("/profile");
        }
      } else {
        console.log("No user authenticated");
        setUser(null);
        setUserProfile(null);
        setProfileComplete(false);
        setIsNewUser(false);
      }

      if (mounted) {
        setLoading(false);
      }
    });

    const handleInitialRedirect = async () => {
      if (!mounted) return;

      const result = await handleRedirectResult();

      if (result.success && result.user && mounted) {
        // Auth listener above will handle setting user state
        const shouldCompleteProfile = result.newUser || !result.profileComplete;

        if (shouldCompleteProfile && pathname !== "/profile") {
          router.push("/profile");
        } else if (result.returnPath && result.returnPath !== pathname) {
          router.push(result.returnPath);
        }
      }

      if (mounted) {
        setIsCheckingRedirect(false);
        hasCheckedRedirect.current = true;
      }
    };

    // Run initial redirect check once
    handleInitialRedirect();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [router]);

  // Initialize reCAPTCHA for phone auth
  const initializeRecaptcha = useCallback(() => {
    if (!recaptchaContainerRef.current || !auth) return null;

    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        recaptchaContainerRef.current,
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA solved");
          },
        },
      );

      setPhoneAuthState((prev) => ({
        ...prev,
        recaptchaVerifier,
      }));

      return recaptchaVerifier;
    } catch (error) {
      console.error("reCAPTCHA initialization error:", error);
      return null;
    }
  }, []);

  // Handle phone number submission
  const handlePhoneSubmit = async (phoneNumber) => {
    try {
      setPhoneAuthState((prev) => ({
        ...prev,
        error: "",
        phoneNumber,
        step: "input", // Reset to input while processing
      }));

      let recaptchaVerifier = phoneAuthState.recaptchaVerifier;
      if (!recaptchaVerifier) {
        recaptchaVerifier = initializeRecaptcha();
      }

      if (!recaptchaVerifier) {
        throw new Error("reCAPTCHA failed to initialize");
      }

      const result = await sendPhoneOTP(phoneNumber, recaptchaVerifier);

      if (result.success) {
        setPhoneAuthState((prev) => ({
          ...prev,
          step: "otp",
          confirmationResult: result.confirmationResult,
          error: "",
        }));
        return { success: true };
      } else {
        setPhoneAuthState((prev) => ({
          ...prev,
          error: result.error || "Failed to send OTP",
          step: "input",
        }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      setPhoneAuthState((prev) => ({
        ...prev,
        error: error.message,
        step: "input",
      }));
      return { success: false, error: error.message };
    }
  };

  // Handle OTP verification
  const handleOTPVerify = async (otp) => {
    try {
      setPhoneAuthState((prev) => ({ ...prev, error: "" }));

      const result = await verifyPhoneOTP(
        phoneAuthState.confirmationResult,
        otp,
      );

      if (result.success) {
        // 🔧 CRITICAL: Update the main auth state, just like Google redirect does
        setUser(result.user);
        setIsNewUser(result.newUser || false);
        setProfileComplete(result.profileComplete || false);

        // 🔧 Let the existing auth listener (in useEffect) handle the redirect/profile logic
        // It will check isNewUser/profileComplete and take appropriate action

        setPhoneAuthState((prev) => ({
          ...prev,
          step: "success",
          error: "",
        }));

        // Get complete user profile
        const profile = await getUserProfile(result.user.uid);
        if (profile.success) {
          setUserProfile(profile.data);
        }

        return {
          success: true,
          newUser: result.newUser,
          profileComplete: result.profileComplete,
        };
      } else {
        setPhoneAuthState((prev) => ({
          ...prev,
          error: result.error || "Invalid OTP",
          step: "otp",
        }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      setPhoneAuthState((prev) => ({
        ...prev,
        error: error.message,
        step: "otp",
      }));
      return { success: false, error: error.message };
    }
  };

  // Handle Google sign-in with redirect
  const handleGoogleSignIn = async () => {
    try {
      // Store current path to return after auth
      const returnPath = ["/login", "/auth/callback"].includes(pathname)
        ? "/"
        : pathname;

      const result = await signInWithGoogle();

      if (result.success) {
        // The page will redirect, no need to do anything here
        return { success: true, redirect: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        setUser(null);
        setUserProfile(null);
        setProfileComplete(false);
        setIsNewUser(false);
        setPhoneAuthState({
          step: "input",
          phoneNumber: "",
          confirmationResult: null,
          recaptchaVerifier: null,
          error: "",
        });
        clearRedirectPath();
        router.push("/");
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Reset phone auth state
  const resetPhoneAuth = () => {
    setPhoneAuthState({
      step: "input",
      phoneNumber: "",
      confirmationResult: null,
      recaptchaVerifier: null,
      error: "",
    });
  };

  // Update user profile
  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: "No user logged in" };

    try {
      const result = await updateUserProfile(user.uid, updates);
      if (result.success) {
        // Refresh user profile data
        const profile = await getUserProfile(user.uid);
        if (profile.success) {
          setUserProfile(profile.data);
          setProfileComplete(profile.profileComplete || false);
        }
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Check if profile needs completion
  const checkProfileNeedsCompletion = async () => {
    if (!user) return { success: false, error: "No user logged in" };

    try {
      const result = await checkProfileCompletion(user.uid);
      if (result.success) {
        return {
          success: true,
          needsCompletion: result.requiresCompletion,
          missingFields: result.missingFields,
        };
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Clear any stored redirect paths
  const clearAuthState = () => {
    clearRedirectPath();
    resetPhoneAuth();
  };

  // In AuthContext.js
  const setPhoneAuthError = (error) => {
    setPhoneAuthState((prev) => ({
      ...prev,
      error,
    }));
  };

  const value = {
    // User state
    user,
    loading: loading || isCheckingRedirect,
    profileComplete,
    isNewUser,
    userProfile,

    // Phone auth state
    phoneAuthState,
    setPhoneAuthError,
    // Auth methods
    handlePhoneSubmit,
    handleOTPVerify,
    handleGoogleSignIn,
    handleLogout,
    resetPhoneAuth,
    clearAuthState,

    // Profile methods
    getUserProfile: () =>
      userProfile ? { success: true, data: userProfile } : { success: false },
    updateProfile,
    checkProfileNeedsCompletion,

    // Status
    isCheckingRedirect,
    isAuthenticated: !!user,
    requiresProfileCompletion: !profileComplete && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Hidden reCAPTCHA container */}
      <div
        ref={recaptchaContainerRef}
        className="fixed opacity-0 pointer-events-none"
        id="recaptcha-container"
      />
      {!loading && !isCheckingRedirect ? (
        children
      ) : (
        // Show loading state while checking auth
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <CircularProgressIndicator isPageLoader={true} />
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
