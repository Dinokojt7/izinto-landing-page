"use client";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import {
  signInWithGoogle,
  sendPhoneOTP,
  verifyPhoneOTP,
  logoutUser,
  setupAuthListener,
  getUserProfile,
} from "@/lib/firebase/auth";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [phoneAuthState, setPhoneAuthState] = useState({
    step: "input", // "input", "otp", "success"
    phoneNumber: "",
    confirmationResult: null,
    recaptchaVerifier: null,
    error: "",
  });
  const router = useRouter();
  const recaptchaContainerRef = useRef(null);

  const loadUserProfile = async (firebaseUser) => {
    if (!firebaseUser) return null;

    try {
      const result = await getUserProfile(firebaseUser.uid);
      if (result.success) {
        const profileData = result.data;
        setUserProfile(profileData);
        setProfileComplete(profileData.profileComplete || false);
        return profileData;
      }
      return null;
    } catch (error) {
      console.error("Error loading user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = setupAuthListener(async (authData) => {
      if (authData) {
        setUser(authData.user);

        // Load user profile from Firestore
        const profile = await loadUserProfile(authData.user);

        if (!authData.profileComplete && router) {
          router.push("/profile");
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setProfileComplete(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Initialize reCAPTCHA
  const initializeRecaptcha = () => {
    if (!recaptchaContainerRef.current) return null;

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
  };

  // Handle phone number submission
  const handlePhoneSubmit = async (phoneNumber) => {
    try {
      setPhoneAuthState((prev) => ({ ...prev, error: "", phoneNumber }));

      let recaptchaVerifier = phoneAuthState.recaptchaVerifier;
      if (!recaptchaVerifier) {
        recaptchaVerifier = initializeRecaptcha();
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
        setPhoneAuthState((prev) => ({
          ...prev,
          step: "success",
          error: "",
        }));

        // Get user profile to check completeness
        const profile = await getUserProfile(result.user.uid);
        if (profile.success) {
          setProfileComplete(profile.data.profileComplete || false);
        }

        return { success: true };
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

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();

      if (result.success) {
        return { success: true };
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
        setProfileComplete(false);
        setPhoneAuthState({
          step: "input",
          phoneNumber: "",
          confirmationResult: null,
          recaptchaVerifier: null,
          error: "",
        });
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

  const getUserDisplayName = () => {
    if (!user) return null;

    // First priority: Name and surname from Firestore profile
    if (userProfile?.name && userProfile?.surname) {
      return `${userProfile.name} ${userProfile.surname}`;
    }

    // Second priority: Full name from Firestore
    if (userProfile?.displayName) {
      return userProfile.displayName;
    }

    // Third priority: Google/Firebase auth display name
    if (user.displayName) {
      return user.displayName;
    }

    // Fourth priority: Email username
    if (user.email) {
      return user.email.split("@")[0];
    }

    return "PROFILE";
  };

  const getUserFirstName = () => {
    if (!user) return null;

    // First priority: Name from Firestore
    if (userProfile?.name) {
      return userProfile.name;
    }

    // Second priority: First word from display name
    if (user.displayName) {
      return user.displayName.split(" ")[0];
    }

    // Third priority: Email username
    if (user.email) {
      return user.email.split("@")[0];
    }

    return null;
  };

  const getUserSurname = () => {
    if (!user) return null;

    // First priority: Surname from Firestore
    if (userProfile?.surname) {
      return userProfile.surname;
    }

    // Second priority: Last word from display name
    if (user.displayName) {
      const parts = user.displayName.split(" ");
      return parts.length > 1 ? parts[parts.length - 1] : null;
    }

    return null;
  };

  const value = {
    user,
    userProfile,
    loading,
    profileComplete,
    phoneAuthState,
    getUserDisplayName,
    getUserFirstName,
    getUserSurname,
    handlePhoneSubmit,
    handleOTPVerify,
    handleGoogleSignIn,
    handleLogout,
    resetPhoneAuth,
    getUserProfile: () => userProfile,
    loadUserProfile: (uid) => getUserProfile(uid),
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Hidden reCAPTCHA container */}
      <div
        ref={recaptchaContainerRef}
        className="fixed opacity-0 pointer-events-none"
      />
      {!loading && children}
    </AuthContext.Provider>
  );
};
