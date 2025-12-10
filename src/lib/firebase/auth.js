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
export const signInWithGoogle = async (returnPath = null) => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    if (typeof window !== "undefined") {
      const path = returnPath || window.location.pathname;
      setRedirectPath(path);
      setAuthType("google");
    }

    await signInWithRedirect(auth, provider);

    return { success: true, redirect: true };
  } catch (error) {
    clearRedirectPath();
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};

// Handle the redirect result
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);

    if (result?.user) {
      const authType = getAuthType();
      const user = result.user;
      const profileStatus = await checkAndCreateUserProfile(user);
      const returnPath = getRedirectPath();

      clearRedirectPath();

      return {
        success: true,
        user,
        authType,
        returnPath,
        ...profileStatus,
      };
    } else if (result?.error) {
      clearRedirectPath();
      return {
        success: false,
        error: result.error.message,
        code: result.error.code,
      };
    }

    const currentUser = auth.currentUser;
    if (currentUser) {
      const profileStatus = await checkAndCreateUserProfile(currentUser);
      const returnPath = getRedirectPath();
      clearRedirectPath();

      return {
        success: true,
        user: currentUser,
        authType: getAuthType(),
        returnPath,
        ...profileStatus,
      };
    }

    return { success: false, authType: getAuthType() };
  } catch (error) {
    clearRedirectPath();
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};

// Phone Auth - Send OTP
export const sendPhoneOTP = async (phoneNumber, recaptchaVerifier) => {
  try {
    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+${phoneNumber}`;

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
    clearRedirectPath();
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
    const profileStatus = await checkAndCreateUserProfile(user);
    clearRedirectPath();

    return {
      success: true,
      user,
      ...profileStatus,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Check and create user profile
export const checkAndCreateUserProfile = async (firebaseUser) => {
  try {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    const isNewUser = !userSnap.exists();
    let profileComplete = false;
    let promoCode = null;

    if (isNewUser) {
      let name = "";
      let surname = "";
      let displayName = firebaseUser.displayName || "";

      if (displayName) {
        const nameParts = displayName.split(" ");
        name = nameParts[0] || "";
        surname = nameParts.slice(1).join(" ") || "";
      }

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
        promoCode: promoCode,
        promoCodeUsedBy: [],
        referralCredits: 0,
        referralEarnings: 0,
        totalReferrals: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileComplete: false,
        address: null,
        preferences: {
          notifications: true,
          marketing: false,
        },
        emailVerified: firebaseUser.emailVerified || false,
        phoneVerified: !!firebaseUser.phoneNumber,
        isActive: true,
        lastLogin: new Date().toISOString(),
        authMethods: ["phone"],
        signupMethod: "phone",
      };

      await setDoc(userRef, userData);
      profileComplete = false;
    } else {
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
    return {
      newUser: false,
      profileComplete: false,
      error: error.message,
    };
  }
};

// Rest of the functions remain the same but without console.logs
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: "User not found" };
    }

    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
      profileComplete: true,
    };

    await updateDoc(userRef, updateData);

    return {
      success: true,
      profileComplete: true,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

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

export const applyPromoCode = async (referrerCode, refereeUserId) => {
  try {
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

    if (referrerDoc.id === refereeUserId) {
      return { success: false, error: "Cannot use your own promo code" };
    }

    if (
      referrerData.promoCodeUsedBy &&
      referrerData.promoCodeUsedBy.includes(refereeUserId)
    ) {
      return { success: false, error: "You've already used this code" };
    }

    await updateDoc(referrerDoc.ref, {
      referralCredits: (referrerData.referralCredits || 0) + 50,
      referralEarnings: (referrerData.referralEarnings || 0) + 50,
      totalReferrals: (referrerData.totalReferrals || 0) + 1,
      promoCodeUsedBy: [...(referrerData.promoCodeUsedBy || []), refereeUserId],
      updatedAt: new Date().toISOString(),
    });

    const refereeRef = doc(db, "users", refereeUserId);
    const refereeSnap = await getDoc(refereeRef);

    if (refereeSnap.exists()) {
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
    return { success: false, error: error.message };
  }
};

export const validatePromoCodeFormat = (code) => {
  if (!code || typeof code !== "string") return false;
  const promoCodeRegex = /^[A-Z]{3}\d{4}$/;
  return promoCodeRegex.test(code.toUpperCase());
};

export const generateUniquePromoCode = async (baseName = "IZI") => {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const namePart = baseName.substring(0, 3).toUpperCase();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const promoCode = `${namePart}${randomPart}`;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("promoCode", "==", promoCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return promoCode;
    }

    attempts++;
  }

  const timestamp = Date.now().toString().slice(-4);
  return `${baseName.substring(0, 3).toUpperCase()}${timestamp}`;
};

export const logoutUser = async () => {
  try {
    clearRedirectPath();
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

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

export const checkProfileCompletion = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const isComplete = data.profileComplete || false;
      const missingFields = [];

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

    await setDoc(primaryRef, mergedData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
