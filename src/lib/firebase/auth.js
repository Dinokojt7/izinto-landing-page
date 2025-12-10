// lib/firebase/auth.js
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./config";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";

// Session management for redirect flow
const REDIRECT_SESSION_KEY = "auth_redirect_path";
const AUTH_TYPE_KEY = "auth_type";

export const setRedirectPath = (path) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(
      REDIRECT_SESSION_KEY,
      path || window.location.pathname,
    );
  }
};

export const getRedirectPath = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(REDIRECT_SESSION_KEY) || "/";
  }
  return "/";
};

export const clearRedirectPath = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(REDIRECT_SESSION_KEY);
    sessionStorage.removeItem(AUTH_TYPE_KEY);
  }
};

export const setAuthType = (type) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(AUTH_TYPE_KEY, type);
  }
};

export const getAuthType = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(AUTH_TYPE_KEY);
  }
  return null;
};

// Google Auth with redirect
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    // Store where user came from
    const currentPath = window.location.pathname;
    setRedirectPath(currentPath);
    setAuthType("google");

    // Always use redirect - more reliable
    await signInWithRedirect(auth, provider);

    // The page will redirect, no need to return user data here
    return { success: true, redirect: true };
  } catch (error) {
    console.error("Google sign-in error:", error);
    clearRedirectPath();
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};

// Handle the redirect result when user returns from Google auth
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);

    if (result?.user) {
      const authType = getAuthType();
      const user = result.user;

      // Check/create user profile
      const profileStatus = await checkAndCreateUserProfile(user);

      // Get return path
      const returnPath = getRedirectPath();
      clearRedirectPath();

      return {
        success: true,
        user,
        authType,
        returnPath,
        ...profileStatus,
      };
    }

    return { success: false, authType: getAuthType() };
  } catch (error) {
    console.error("Redirect result error:", error);
    clearRedirectPath();
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};

// Phone Auth - Send OTP (updated for redirect flow)
export const sendPhoneOTP = async (phoneNumber, recaptchaVerifier) => {
  try {
    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+${phoneNumber}`;

    // Store auth type for phone
    setAuthType("phone");

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      formattedPhone,
      recaptchaVerifier,
    );

    return {
      success: true,
      confirmationResult,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error("Send OTP error:", error);
    clearRedirectPath();
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};

// Phone Auth - Verify OTP (handles both new and returning users)
export const verifyPhoneOTP = async (confirmationResult, otp) => {
  try {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;

    // Check if user profile exists in Firestore
    const profileStatus = await checkAndCreateUserProfile(user);

    // Clear any stored redirect path for phone auth
    clearRedirectPath();

    return {
      success: true,
      user,
      ...profileStatus,
    };
  } catch (error) {
    console.error("Verify OTP error:", error);
    return { success: false, error: error.message };
  }
};

// Check and create user profile in Firestore (enhanced for redirect flow)
export const checkAndCreateUserProfile = async (firebaseUser) => {
  try {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    const isNewUser = !userSnap.exists();
    let profileComplete = false;
    let promoCode = null;

    if (isNewUser) {
      // Create new user profile with promo code
      let name = "";
      let surname = "";
      let displayName = firebaseUser.displayName || "";

      if (displayName) {
        const nameParts = displayName.split(" ");
        name = nameParts[0] || "";
        surname = nameParts.slice(1).join(" ") || "";
      }

      // Generate promo code
      const generatePromoCode = (name) => {
        const namePart = name ? name.substring(0, 3).toUpperCase() : "IZI";
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        return `${namePart}${randomPart}`;
      };

      promoCode = generatePromoCode(displayName || name || "User");

      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        phone: firebaseUser.phoneNumber || "",
        name: name,
        surname: surname,
        displayName: displayName,
        photoURL: firebaseUser.photoURL || "",
        // Add promo code fields
        promoCode: promoCode,
        promoCodeUsedBy: [],
        referralCredits: 0,
        referralEarnings: 0,
        totalReferrals: 0,
        // Basic profile fields
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileComplete: false,
        address: null,
        preferences: {
          notifications: true,
          marketing: false,
        },
        // Verification status
        emailVerified: firebaseUser.emailVerified || false,
        phoneVerified: !!firebaseUser.phoneNumber,
        // Account status
        isActive: true,
        lastLogin: new Date().toISOString(),
        // Track auth method
        authMethods: ["phone"],
        signupMethod: "phone",
      };

      await setDoc(userRef, userData);
      profileComplete = false;
    } else {
      // Existing user - update last login and merge auth methods
      const existingData = userSnap.data();
      const authMethods = new Set(existingData.authMethods || []);
      authMethods.add("phone");

      await updateDoc(userRef, {
        lastLogin: new Date().toISOString(),
        authMethods: Array.from(authMethods),
        updatedAt: new Date().toISOString(),
      });

      profileComplete = existingData.profileComplete || false;
      promoCode = existingData.promoCode || null;
    }

    return {
      newUser: isNewUser,
      profileComplete: profileComplete,
      promoCode: promoCode,
      requiresProfileCompletion: isNewUser || !profileComplete,
    };
  } catch (error) {
    console.error("Profile check error:", error);
    return {
      newUser: false,
      profileComplete: false,
      error: error.message,
    };
  }
};

// Enhanced version for updating user profile with more fields
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: "User not found" };
    }

    const existingData = userSnap.data();
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
      profileComplete: true, // Mark as complete when updating profile
    };

    await updateDoc(userRef, updateData);

    return {
      success: true,
      profileComplete: true,
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: error.message };
  }
};

// Get user's promo code info
export const getUserPromoInfo = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        success: true,
        promoCode: data.promoCode || null,
        referralCredits: data.referralCredits || 0,
        referralEarnings: data.referralEarnings || 0,
        totalReferrals: data.totalReferrals || 0,
        promoCodeUsedBy: data.promoCodeUsedBy || [],
      };
    }
    return { success: false, error: "User not found" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Check if promo code is valid and apply it
export const applyPromoCode = async (referrerCode, refereeUserId) => {
  try {
    // Find user with this promo code
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("promoCode", "==", referrerCode.toUpperCase()),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: "Invalid promo code" };
    }

    const referrerDoc = querySnapshot.docs[0];
    const referrerData = referrerDoc.data();

    // Check if user is trying to use their own code
    if (referrerDoc.id === refereeUserId) {
      return { success: false, error: "Cannot use your own promo code" };
    }

    // Check if this user already used this code
    if (
      referrerData.promoCodeUsedBy &&
      referrerData.promoCodeUsedBy.includes(refereeUserId)
    ) {
      return { success: false, error: "You've already used this code" };
    }

    // Update referrer's stats
    await updateDoc(referrerDoc.ref, {
      referralCredits: (referrerData.referralCredits || 0) + 50,
      referralEarnings: (referrerData.referralEarnings || 0) + 50,
      totalReferrals: (referrerData.totalReferrals || 0) + 1,
      promoCodeUsedBy: [...(referrerData.promoCodeUsedBy || []), refereeUserId],
      updatedAt: new Date().toISOString(),
    });

    // Update referee's record
    const refereeRef = doc(db, "users", refereeUserId);
    const refereeSnap = await getDoc(refereeRef);

    if (refereeSnap.exists()) {
      const refereeData = refereeSnap.data();
      await updateDoc(refereeRef, {
        usedPromoCode: referrerCode,
        referralDiscountApplied: true,
        updatedAt: new Date().toISOString(),
      });
    }

    return {
      success: true,
      discountAmount: 50,
      referrerName: referrerData.displayName || referrerData.name || "A friend",
    };
  } catch (error) {
    console.error("Apply promo code error:", error);
    return { success: false, error: error.message };
  }
};

// Helper to validate promo code format
export const validatePromoCodeFormat = (code) => {
  if (!code || typeof code !== "string") return false;

  // Format: 3 letters + 4 digits (e.g., IZI1234)
  const promoCodeRegex = /^[A-Z]{3}\d{4}$/;
  return promoCodeRegex.test(code.toUpperCase());
};

// Generate a unique promo code (for admin use or regeneration)
export const generateUniquePromoCode = async (baseName = "IZI") => {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const namePart = baseName.substring(0, 3).toUpperCase();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const promoCode = `${namePart}${randomPart}`;

    // Check if code already exists
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("promoCode", "==", promoCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return promoCode;
    }

    attempts++;
  }

  // Fallback: add timestamp
  const timestamp = Date.now().toString().slice(-4);
  return `${baseName.substring(0, 3).toUpperCase()}${timestamp}`;
};

// Logout
export const logoutUser = async () => {
  try {
    clearRedirectPath();
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Enhanced auth state listener for redirect flow
export const setupAuthListener = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profileStatus = await checkAndCreateUserProfile(user);
      callback({
        user,
        ...profileStatus,
        authType: getAuthType(),
      });
    } else {
      callback(null);
    }
  });
};

// Get current user profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        success: true,
        data: data,
        profileComplete: data.profileComplete || false,
        requiresProfileCompletion: !data.profileComplete,
      };
    } else {
      return { success: false, error: "User profile not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Check if user needs to complete profile
export const checkProfileCompletion = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const isComplete = data.profileComplete || false;
      const missingFields = [];

      // Check required fields
      if (!data.name || !data.name.trim()) missingFields.push("name");
      if (!data.surname || !data.surname.trim()) missingFields.push("surname");
      if (!data.phone) missingFields.push("phone");

      return {
        success: true,
        profileComplete: isComplete,
        requiresCompletion: !isComplete || missingFields.length > 0,
        missingFields,
        data,
      };
    }

    return { success: false, error: "User not found" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user by email (for admin or linking accounts)
export const getUserByEmail = async (email) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { success: true, user: { id: doc.id, ...doc.data() } };
    }

    return { success: false, error: "User not found" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Merge user data if user signs in with different method
export const mergeUserAccounts = async (primaryUserId, secondaryUserId) => {
  try {
    const primaryRef = doc(db, "users", primaryUserId);
    const secondaryRef = doc(db, "users", secondaryUserId);

    const [primarySnap, secondarySnap] = await Promise.all([
      getDoc(primaryRef),
      getDoc(secondaryRef),
    ]);

    if (!primarySnap.exists() || !secondarySnap.exists()) {
      return { success: false, error: "One or both users not found" };
    }

    const primaryData = primarySnap.data();
    const secondaryData = secondarySnap.data();

    // Merge data (primary takes precedence)
    const mergedData = {
      ...secondaryData,
      ...primaryData,
      authMethods: Array.from(
        new Set([
          ...(primaryData.authMethods || []),
          ...(secondaryData.authMethods || []),
        ]),
      ),
      updatedAt: new Date().toISOString(),
    };

    // Update primary user
    await setDoc(primaryRef, mergedData);

    // Delete secondary user
    // Note: In production, you might want to archive instead of delete
    // await deleteDoc(secondaryRef);

    return { success: true };
  } catch (error) {
    console.error("Merge accounts error:", error);
    return { success: false, error: error.message };
  }
};
