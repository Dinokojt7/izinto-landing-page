"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AddressContext = createContext({});

export function AddressProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load address from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("userAddress");
    if (savedAddress) {
      try {
        setAddress(JSON.parse(savedAddress));
      } catch (error) {
        console.error("Error parsing saved address:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save address to localStorage and update state
  const saveAddress = useCallback((addressData) => {
    const addressWithTimestamp = {
      ...addressData,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem("userAddress", JSON.stringify(addressWithTimestamp));
    setAddress(addressWithTimestamp);

    // Return the saved address
    return addressWithTimestamp;
  }, []);

  // Clear address
  const clearAddress = useCallback(() => {
    localStorage.removeItem("userAddress");
    setAddress(null);
  }, []);

  // Check if address is valid (within service area)
  const isValidAddress = useCallback(() => {
    if (!address) return false;
    return address.isValid === true;
  }, [address]);

  // Get formatted address string
  const getFormattedAddress = useCallback(() => {
    if (!address) return "";
    return `${address.street}, ${address.town}`;
  }, [address]);

  const value = {
    address,
    isLoading,
    saveAddress,
    clearAddress,
    isValidAddress,
    getFormattedAddress,
    hasAddress: !!address,
    hasValidAddress: address?.isValid === true,
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
