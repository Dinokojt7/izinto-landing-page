// src/lib/firebase/firestore.js
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// User profiles
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

export const createUserProfile = async (userId, userData) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Services
export const getServices = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "services"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting services:", error);
    return [];
  }
};

export const getServiceById = async (serviceId) => {
  try {
    const serviceDoc = await getDoc(doc(db, "services", serviceId));
    return serviceDoc.exists()
      ? { id: serviceDoc.id, ...serviceDoc.data() }
      : null;
  } catch (error) {
    console.error("Error getting service:", error);
    return null;
  }
};

// Orders
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: serverTimestamp(),
      status: "pending",
    });
    return { id: docRef.id, success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting user orders:", error);
    return [];
  }
};

// Favorites
export const addToFavorites = async (userId, serviceId) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      favorites: arrayUnion(serviceId),
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const removeFromFavorites = async (userId, serviceId) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      favorites: arrayRemove(serviceId),
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
