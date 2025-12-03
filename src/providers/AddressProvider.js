"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { db } from "@/lib/firebase/config";
import {
  doc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";

const AddressContext = createContext({});

export function AddressProvider({ children }) {
  const { user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [activeAddress, setActiveAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAddresses = async () => {
      setIsLoading(true);
      console.log("Loading addresses, user:", user?.uid);

      try {
        if (user?.uid) {
          await loadFirestoreAddresses();
        } else {
          loadLocalStorageAddress();
        }
      } catch (error) {
        console.error("Error loading addresses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAddresses();
  }, [user]);

  // Load addresses from Firestore subcollection
  const loadFirestoreAddresses = async () => {
    if (!user?.uid) {
      console.log("No user UID, cannot load from Firestore");
      return;
    }

    try {
      console.log(
        "Loading addresses from Firestore subcollection for user:",
        user.uid,
      );

      // Reference to the addresses subcollection
      const addressesRef = collection(db, "users", user.uid, "addresses");

      // Query addresses, ordered by timestamp (newest first)
      const addressesQuery = query(addressesRef, orderBy("timestamp", "desc"));

      const querySnapshot = await getDocs(addressesQuery);
      console.log("Firestore query snapshot size:", querySnapshot.size);

      const firestoreAddresses = [];
      let activeAddr = null;

      querySnapshot.forEach((doc) => {
        const addressData = doc.data();
        console.log("Address document:", doc.id, addressData);

        const address = {
          id: doc.id, // Use Firestore document ID
          street: addressData.street || "",
          suburb: addressData.suburb || "",
          town: addressData.town || "",
          country: addressData.country || "South Africa",
          zip: addressData.zip || "",
          additionalInfo: addressData.additionalInfo || "",
          label: addressData.label || "Home",
          selected: addressData.selected || false,
          lat: addressData.lat || 0,
          lng: addressData.lng || 0,
          timestamp: addressData.timestamp || new Date().toISOString(),
          isValid:
            addressData.isValid !== undefined ? addressData.isValid : true,
          fullAddress:
            addressData.fullAddress ||
            `${addressData.street}, ${addressData.town}`,
        };

        firestoreAddresses.push(address);

        // Find active/selected address
        if (addressData.selected) {
          activeAddr = address;
        }
      });

      console.log(
        "Loaded addresses from Firestore:",
        firestoreAddresses.length,
      );
      console.log("Active address:", activeAddr);

      setAddresses(firestoreAddresses);

      // Set active address (selected one, or first, or null)
      if (activeAddr) {
        setActiveAddress(activeAddr);
      } else if (firestoreAddresses.length > 0) {
        setActiveAddress(firestoreAddresses[0]);
      } else {
        setActiveAddress(null);
      }

      // Also sync to localStorage for quick access
      if (activeAddr || (firestoreAddresses.length > 0 && !activeAddr)) {
        const addressToCache = activeAddr || firestoreAddresses[0];
        localStorage.setItem(
          "userAddress",
          JSON.stringify({
            id: addressToCache.id,
            street: addressToCache.street,
            town: addressToCache.town,
            lat: addressToCache.lat,
            lng: addressToCache.lng,
            isValid: addressToCache.isValid,
            selected: true,
          }),
        );
      }
    } catch (error) {
      console.error("Error loading Firestore addresses:", error);
      // Fallback to localStorage if Firestore fails
      loadLocalStorageAddress();
    }
  };

  const loadLocalStorageAddress = () => {
    console.log("Loading from localStorage");
    const savedAddress = localStorage.getItem("userAddress");
    if (savedAddress) {
      try {
        const address = JSON.parse(savedAddress);
        const formattedAddress = {
          id: address.id || `local_${Date.now()}`,
          street: address.street || "",
          suburb: address.suburb || "",
          town: address.town || "",
          country: address.country || "South Africa",
          zip: address.zip || "",
          additionalInfo: address.additionalInfo || "",
          label: address.label || "Home",
          selected: true,
          lat: address.lat || 0,
          lng: address.lng || 0,
          timestamp: address.timestamp || new Date().toISOString(),
          isValid: address.isValid !== undefined ? address.isValid : true,
          fullAddress:
            address.fullAddress || `${address.street}, ${address.town}`,
        };

        setAddresses([formattedAddress]);
        setActiveAddress(formattedAddress);
        console.log("Loaded address from localStorage:", formattedAddress);
      } catch (error) {
        console.error("Error parsing localStorage address:", error);
        setAddresses([]);
        setActiveAddress(null);
      }
    } else {
      console.log("No address in localStorage");
      setAddresses([]);
      setActiveAddress(null);
    }
  };

  // Transform address to Firestore schema
  const transformAddressToSchema = (addressData) => {
    return {
      street: addressData.street || "",
      suburb: addressData.suburb || addressData.town || "",
      town: addressData.town || "",
      country: addressData.country || "South Africa",
      zip: addressData.zip || "",
      additionalInfo: addressData.additionalInfo || "",
      label: addressData.label || this.getNextAvailableLabel(),
      selected: addressData.selected || false,
      lat: addressData.lat || 0,
      lng: addressData.lng || 0,
      timestamp: new Date().toISOString(),
      isValid: addressData.isValid !== undefined ? addressData.isValid : true,
      fullAddress:
        addressData.fullAddress || `${addressData.street}, ${addressData.town}`,
    };
  };

  // Get next available label
  const getNextAvailableLabel = useCallback(() => {
    const existingLabels = addresses.map((addr) => addr.label);
    const defaultLabels = ["Home", "Work", "Other 1", "Other 2", "Other 3"];

    for (const label of defaultLabels) {
      if (!existingLabels.includes(label)) {
        return label;
      }
    }

    let counter = 1;
    while (existingLabels.includes(`Other ${counter}`)) {
      counter++;
    }
    return `Other ${counter}`;
  }, [addresses]);

  // Save address to Firestore subcollection
  const saveAddress = useCallback(
    async (addressData) => {
      console.log("saveAddress called with:", addressData);

      const addressWithSchema = transformAddressToSchema(addressData);
      console.log("Transformed address:", addressWithSchema);

      // Generate a temporary ID for local state
      const tempId = `temp_${Date.now()}`;
      const addressWithId = {
        ...addressWithSchema,
        id: tempId,
      };

      // Update local state immediately for better UX
      setAddresses((prev) => {
        const newAddresses = addressWithSchema.selected
          ? prev.map((addr) => ({ ...addr, selected: false }))
          : [...prev];

        return [...newAddresses, addressWithId];
      });

      if (addressWithSchema.selected || addresses.length === 0) {
        setActiveAddress(addressWithId);
      }

      try {
        // Always save to localStorage for quick access
        saveAddressToLocalStorage(addressWithId);
        console.log("Saved to localStorage");

        // Save to Firestore if user is logged in
        if (user?.uid) {
          console.log(
            "User has UID, saving to Firestore subcollection:",
            user.uid,
          );

          let firestoreId = tempId;

          try {
            // Add to Firestore subcollection
            const addressesRef = collection(db, "users", user.uid, "addresses");
            const docRef = await addDoc(addressesRef, addressWithSchema);
            firestoreId = docRef.id;
            console.log("Address saved to Firestore with ID:", firestoreId);

            // If this address should be selected, update all other addresses
            if (addressWithSchema.selected) {
              await updateSelectedAddress(user.uid, firestoreId);
            }

            // Update local state with real Firestore ID
            setAddresses((prev) =>
              prev.map((addr) =>
                addr.id === tempId ? { ...addr, id: firestoreId } : addr,
              ),
            );

            if (activeAddress?.id === tempId) {
              setActiveAddress((prev) => ({ ...prev, id: firestoreId }));
            }
          } catch (firestoreError) {
            console.error("Firestore save error:", firestoreError);
            // Keep using tempId if Firestore fails
          }
        } else {
          console.log("No user UID, skipping Firestore save");
        }

        return addressWithId;
      } catch (error) {
        console.error("Error saving address:", error);
        // Rollback local state on error
        setAddresses((prev) => prev.filter((addr) => addr.id !== tempId));
        if (activeAddress?.id === tempId) {
          setActiveAddress(addresses.length > 0 ? addresses[0] : null);
        }
        throw error;
      }
    },
    [user, addresses, activeAddress, getNextAvailableLabel],
  );

  // Helper to update selected address in Firestore
  const updateSelectedAddress = async (userId, selectedAddressId) => {
    if (!userId) return;

    try {
      // Get all addresses for this user
      const addressesRef = collection(db, "users", userId, "addresses");
      const querySnapshot = await getDocs(addressesRef);

      // Update each address document
      const updatePromises = [];
      querySnapshot.forEach((doc) => {
        const updateData = {
          selected: doc.id === selectedAddressId,
        };
        updatePromises.push(updateDoc(doc.ref, updateData));
      });

      await Promise.all(updatePromises);
      console.log("Updated selected address in Firestore");
    } catch (error) {
      console.error("Error updating selected address:", error);
    }
  };

  const saveAddressToLocalStorage = (address) => {
    const localStorageAddress = {
      id: address.id,
      street: address.street,
      town: address.town,
      lat: address.lat,
      lng: address.lng,
      isValid: address.isValid,
      selected: true,
    };
    localStorage.setItem("userAddress", JSON.stringify(localStorageAddress));
    console.log("Saved to localStorage:", localStorageAddress);
  };

  // Set active address
  const setActiveAddressById = useCallback(
    async (addressId) => {
      console.log("Setting active address:", addressId);

      // Update local state
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        selected: addr.id === addressId,
      }));

      const newActive = updatedAddresses.find((addr) => addr.id === addressId);
      if (!newActive) {
        console.error("Address not found:", addressId);
        return;
      }

      setAddresses(updatedAddresses);
      setActiveAddress(newActive);

      // Update localStorage
      localStorage.setItem(
        "userAddress",
        JSON.stringify({
          id: newActive.id,
          street: newActive.street,
          town: newActive.town,
          lat: newActive.lat,
          lng: newActive.lng,
          isValid: newActive.isValid,
          selected: true,
        }),
      );

      // Update Firestore if user is logged in
      if (user?.uid) {
        try {
          await updateSelectedAddress(user.uid, addressId);
          console.log("Updated selected address in Firestore");
        } catch (error) {
          console.error("Error updating selected address in Firestore:", error);
        }
      }
    },
    [addresses, user],
  );

  // Delete address from Firestore subcollection
  const deleteAddress = useCallback(
    async (addressId) => {
      console.log("Deleting address:", addressId);

      if (user?.uid) {
        try {
          // Delete from Firestore
          const addressRef = doc(db, "users", user.uid, "addresses", addressId);
          await deleteDoc(addressRef);
          console.log("Deleted from Firestore");
        } catch (error) {
          console.error("Error deleting from Firestore:", error);
        }
      }

      // Update local state
      const updatedAddresses = addresses.filter(
        (addr) => addr.id !== addressId,
      );
      setAddresses(updatedAddresses);

      // If deleted address was active, set new active
      if (activeAddress?.id === addressId) {
        const newActive =
          updatedAddresses.find((addr) => addr.selected) ||
          updatedAddresses[0] ||
          null;
        setActiveAddress(newActive);

        if (newActive) {
          localStorage.setItem(
            "userAddress",
            JSON.stringify({
              id: newActive.id,
              street: newActive.street,
              town: newActive.town,
              lat: newActive.lat,
              lng: newActive.lng,
              isValid: newActive.isValid,
              selected: true,
            }),
          );
        } else {
          localStorage.removeItem("userAddress");
        }
      }
    },
    [addresses, activeAddress, user],
  );

  // Update address in Firestore subcollection
  const updateAddress = useCallback(
    async (addressId, updates) => {
      console.log("Updating address:", addressId, updates);

      // Update local state
      const updatedAddresses = addresses.map((addr) =>
        addr.id === addressId ? { ...addr, ...updates } : addr,
      );

      setAddresses(updatedAddresses);

      // Update active address if needed
      if (activeAddress?.id === addressId) {
        const updatedActive = updatedAddresses.find(
          (addr) => addr.id === addressId,
        );
        setActiveAddress(updatedActive);
        localStorage.setItem(
          "userAddress",
          JSON.stringify({
            id: updatedActive.id,
            street: updatedActive.street,
            town: updatedActive.town,
            lat: updatedActive.lat,
            lng: updatedActive.lng,
            isValid: updatedActive.isValid,
            selected: true,
          }),
        );
      }

      // Update Firestore if user is logged in
      if (user?.uid) {
        try {
          const addressRef = doc(db, "users", user.uid, "addresses", addressId);
          await updateDoc(addressRef, updates);
          console.log("Updated address in Firestore");
        } catch (error) {
          console.error("Error updating address in Firestore:", error);
        }
      }
    },
    [addresses, activeAddress, user],
  );

  const clearAllAddresses = useCallback(async () => {
    console.log("Clearing all addresses");

    if (user?.uid) {
      try {
        // Delete all addresses from Firestore subcollection
        const addressesRef = collection(db, "users", user.uid, "addresses");
        const querySnapshot = await getDocs(addressesRef);

        const deletePromises = [];
        querySnapshot.forEach((doc) => {
          deletePromises.push(deleteDoc(doc.ref));
        });

        await Promise.all(deletePromises);
        console.log("Cleared all addresses from Firestore");
      } catch (error) {
        console.error("Error clearing addresses from Firestore:", error);
      }
    }

    // Clear local state
    localStorage.removeItem("userAddress");
    setAddresses([]);
    setActiveAddress(null);
  }, [user]);

  const value = {
    // Address Management
    addresses,
    activeAddress,
    isLoading,
    saveAddress,
    deleteAddress,
    updateAddress,
    setActiveAddressById,
    clearAllAddresses,

    // Convenience methods
    hasAddresses: addresses.length > 0,
    hasValidAddress: activeAddress?.isValid === true,
    getFormattedAddress: (addr = activeAddress) => {
      if (!addr) return "";
      const parts = [addr.street];
      if (addr.suburb) parts.push(addr.suburb);
      if (addr.town) parts.push(addr.town);
      if (addr.zip) parts.push(addr.zip);
      return parts.join(", ");
    },
    getAddressCount: () => addresses.length,

    // User info
    isLoggedIn: !!user?.uid,

    // Legacy support
    address: activeAddress,
    clearAddress: () => deleteAddress(activeAddress?.id),
    isValidAddress: () => activeAddress?.isValid === true,
  };

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
}

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within AddressProvider");
  }
  return context;
};
