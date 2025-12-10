"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAddress } from "@/providers/AddressProvider";
import AddressSearchDialog from "./AddressSearchDialog";

export default function AddressSelectionDialog({ isOpen, onClose }) {
  const {
    addresses,
    activeAddress,
    setActiveAddressById,
    deleteAddress,
    isLoggedIn,
  } = useAddress();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectAddress = (addressId) => {
    setActiveAddressById(addressId);
    onClose();
  };

  const handleDeleteAddress = async (addressId, e) => {
    e.stopPropagation();
    setDeletingId(addressId);

    if (confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(addressId);
    }

    setDeletingId(null);
  };

  const handleAddNewAddress = () => {
    setShowAddDialog(true);
  };

  const handleAddressSaved = () => {
    setShowAddDialog(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl w-11/12 max-w-md max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-3xl font-extrabold italic text-black">
                  Your Addresses
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-800 hover:text-black p-2 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Address List */}
              <div className="flex-1 overflow-y-auto p-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                      <svg
                        className="w-full h-full"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-4">No addresses saved yet</p>
                    {!isLoggedIn && (
                      <p className="text-sm text-gray-500 mb-4">
                        Login to save multiple addresses
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`relative p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          activeAddress?.id === address.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleSelectAddress(address.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-gray-900">
                                {address.street}
                              </span>
                              {activeAddress?.id === address.id && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                  Active
                                </span>
                              )}
                              {address.label && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                  {address.label}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {address.town}
                              {address.suburb ? `, ${address.suburb}` : ""}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span
                                className={`px-2 py-0.5 rounded-full ${
                                  address.isValid
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {address.isValid ? "Available" : "Unavailable"}
                              </span>
                              {address.zip && (
                                <>
                                  <span>•</span>
                                  <span>{address.zip}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Delete button */}
                          <button
                            onClick={(e) => handleDeleteAddress(address.id, e)}
                            disabled={deletingId === address.id}
                            className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Delete address"
                          >
                            {deletingId === address.id ? (
                              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100">
                <button
                  onClick={handleAddNewAddress}
                  className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                >
                  + Add New Address
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address Search Dialog for adding new addresses */}
      <AddressSearchDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddressSave={handleAddressSaved}
      />
    </>
  );
}
