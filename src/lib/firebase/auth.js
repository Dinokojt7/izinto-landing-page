import {
  signInWithPopup,
  GoogleAuthProvider,
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

// Google Auth
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user profile exists in Firestore
    await checkAndCreateUserProfile(user);

    return { success: true, user };
  } catch (error) {
    console.error("Google sign-in error:", error);
    return { success: false, error: error.message };
  }
};

// Phone Auth - Send OTP
export const sendPhoneOTP = async (phoneNumber, recaptchaVerifier) => {
  try {
    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+${phoneNumber}`;

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
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};

// Phone Auth - Verify OTP
export const verifyPhoneOTP = async (confirmationResult, otp) => {
  try {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;

    // Check if user profile exists in Firestore
    await checkAndCreateUserProfile(user);

    return { success: true, user };
  } catch (error) {
    console.error("Verify OTP error:", error);
    return { success: false, error: error.message };
  }
};

// Check and create user profile in Firestore
export const checkAndCreateUserProfile = async (firebaseUser) => {
  try {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
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

      const promoCode = generatePromoCode(displayName || name || "User");

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
      };

      await setDoc(userRef, userData);
      return {
        newUser: true,
        profileComplete: false,
        promoCode: promoCode,
      };
    }

    // Update last login for existing users
    await updateDoc(userRef, {
      lastLogin: new Date().toISOString(),
    });

    const userData = userSnap.data();
    return {
      newUser: false,
      profileComplete: userData.profileComplete || false,
      promoCode: userData.promoCode || null,
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

    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(userRef, updateData);

    return { success: true };
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
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Auth state listener
export const setupAuthListener = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profileStatus = await checkAndCreateUserProfile(user);
      callback({ user, ...profileStatus });
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
      return { success: true, data: userSnap.data() };
    } else {
      return { success: false, error: "User profile not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
