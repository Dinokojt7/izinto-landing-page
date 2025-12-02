import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./config";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
      // Create new user profile
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        phone: firebaseUser.phoneNumber || "",
        displayName: firebaseUser.displayName || "",
        photoURL: firebaseUser.photoURL || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileComplete: false,
        address: null,
        preferences: {},
      };

      await setDoc(userRef, userData);
      return { newUser: true, profileComplete: false };
    }

    const userData = userSnap.data();
    return {
      newUser: false,
      profileComplete: userData.profileComplete || false,
    };
  } catch (error) {
    console.error("Profile check error:", error);
    return { newUser: false, profileComplete: false, error: error.message };
  }
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
