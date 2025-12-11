"use client";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Poppins } from "next/font/google";
import { useAuth } from "@/lib/context/AuthContext";
import CircularProgressIndicator from "@/components/ui/CircularProgessIndicator";
import { useAddress } from "@/providers/AddressProvider";
import { motion, AnimatePresence } from "framer-motion";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function ProfileDialog({ isOpen, onClose }) {
  const { user, getUserProfile, handleLogout } = useAuth();
  const { activeAddress } = useAddress();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    preferences: {
      notifications: true,
      marketing: false,
    },
  });

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

  // Also handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        if (showLogoutConfirm) {
          setShowLogoutConfirm(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, showLogoutConfirm]);

  useEffect(() => {
    if (isOpen && user) {
      loadUserProfile();
    }
  }, [isOpen, user]);

  // Load active address when it changes
  useEffect(() => {
    if (activeAddress) {
      const formattedAddress = `${activeAddress.street}, ${activeAddress.suburb || activeAddress.town}${activeAddress.zip ? `, ${activeAddress.zip}` : ""}, ${activeAddress.town}`;
      setProfile((prev) => ({
        ...prev,
        address: formattedAddress,
      }));
    }
  }, [activeAddress]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    const result = await getUserProfile(user.uid);

    if (result.success) {
      setProfile({
        name: result.data.name || "",
        surname: result.data.surname || "",
        email: result.data.email || user.email || "",
        phone: result.data.phone || user.phoneNumber || "",
        address: result.data.address || "",
        preferences: result.data.preferences || {
          notifications: true,
          marketing: false,
        },
      });
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked,
      },
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        name: profile.name.trim(),
        surname: profile.surname.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        address: profile.address.trim(), // This is just for backup
        preferences: profile.preferences,
        profileComplete: true,
        updatedAt: new Date().toISOString(),
      });

      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutClick = async () => {
    setShowLogoutConfirm(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);

    // Show loading for 2 seconds before actual logout
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await handleLogout();
    setIsLoggingOut(false);
    onClose();
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      console.log("Account deletion would happen here");
      alert("Account deletion feature needs to be implemented.");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black"
            onClick={onClose}
          />

          {/* Bottom Sheet Container */}
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center overflow-y-auto pointer-events-none">
            {/* Animated Bottom Sheet Content */}
            <motion.div
              initial={{
                y: "100%",
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: "100%",
                opacity: 0,
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3,
              }}
              className="pointer-events-auto bg-white w-full max-w-lg overflow-hidden flex flex-col 
                /* Mobile Styles - Bottom Sheet */
                h-[85vh] max-h-[85vh] mt-4 rounded-t-2xl
                /* Desktop Styles - Centered Modal */
                sm:h-auto sm:max-h-[90vh] sm:rounded-xl sm:w-11/12 sm:mx-4 sm:my-0
                sm:initial:opacity-0 sm:initial:scale-95 
                sm:animate:opacity-100 sm:animate:scale-100 
                sm:exit:opacity-0 sm:exit:scale-95"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle for mobile only */}
              <div className="sm:hidden flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="flex justify-between items-center p-6">
                <h2 className="text-2xl font-black italic text-black">
                  Your Profile
                </h2>

                <button
                  onClick={onClose}
                  className="text-gray-800 hover:text-black p-2 transition-colors"
                  disabled={isLoggingOut}
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

              {/* Content Area with Loading */}
              <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <AnimatePresence mode="wait">
                  {isLoggingOut ? (
                    // Logout Loading State
                    <motion.div
                      key="logout-loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full min-h-[400px] p-6"
                    >
                      <CircularProgressIndicator size={60} strokeWidth={4} />
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 text-lg font-medium text-gray-700"
                      >
                        Logging you out...
                      </motion.p>
                    </motion.div>
                  ) : isLoading ? (
                    // Initial Loading State
                    <motion.div
                      key="initial-loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full min-h-[400px] p-6"
                    >
                      <CircularProgressIndicator size={60} strokeWidth={4} />
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 text-lg font-medium text-gray-700"
                      >
                        Loading your profile...
                      </motion.p>
                    </motion.div>
                  ) : (
                    // Main Content
                    <motion.div
                      key="profile-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-6"
                    >
                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        {/* Personal Information */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-bold text-black">
                            Personal Information
                          </h3>

                          {/* Name & Surname - Separate Fields */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name *
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Surname *
                              </label>
                              <input
                                type="text"
                                name="surname"
                                value={profile.surname}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="surname"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={profile.email}
                              onChange={handleInputChange}
                              required
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="you@example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={profile.phone}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="+27 123 456 7890"
                            />
                          </div>
                        </motion.div>

                        {/* Current Address Display (Read Only) */}
                        {activeAddress && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200"
                          >
                            <h3 className="text-lg font-bold text-black">
                              Active Address
                            </h3>
                            <div className="text-sm text-gray-700 space-y-1">
                              <div className="flex items-start">
                                <span className="font-medium w-20">
                                  Street:
                                </span>
                                <span className="flex-1">
                                  {activeAddress.street}
                                </span>
                              </div>
                              {activeAddress.suburb && (
                                <div className="flex items-start">
                                  <span className="font-medium w-20">
                                    Suburb:
                                  </span>
                                  <span className="flex-1">
                                    {activeAddress.suburb}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-start">
                                <span className="font-medium w-20">Town:</span>
                                <span className="flex-1">
                                  {activeAddress.town}
                                </span>
                              </div>
                              {activeAddress.zip && (
                                <div className="flex items-start">
                                  <span className="font-medium w-20">
                                    ZIP Code:
                                  </span>
                                  <span className="flex-1">
                                    {activeAddress.zip}
                                  </span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {/* Preferences */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-bold text-black">
                            Preferences
                          </h3>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                name="notifications"
                                checked={profile.preferences.notifications}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 accent-black border-gray-300 rounded focus:ring-2 focus:ring-black"
                              />
                              <span className="text-gray-700">
                                Service notifications and updates
                              </span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                name="marketing"
                                checked={profile.preferences.marketing}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 accent-black border-gray-300 rounded focus:ring-2 focus:ring-black"
                              />
                              <span className="text-gray-700">
                                Promotional offers and news
                              </span>
                            </label>
                          </div>
                        </motion.div>

                        {/* Action Buttons Area */}
                        <div className="relative h-20 pt-6 pb-4">
                          <AnimatePresence mode="wait">
                            {showLogoutConfirm ? (
                              // Logout Confirmation Buttons
                              <motion.div
                                key="logout-confirm"
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{
                                  type: "spring",
                                  damping: 20,
                                  stiffness: 300,
                                }}
                                className="flex flex-col sm:flex-row gap-3 absolute inset-0 pt-6 pb-4 px-6"
                              >
                                <button
                                  type="button"
                                  onClick={handleCancelLogout}
                                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                                >
                                  Cancel
                                </button>

                                <button
                                  type="button"
                                  onClick={handleConfirmLogout}
                                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
                                >
                                  Confirm Logout
                                </button>
                              </motion.div>
                            ) : (
                              // Normal Action Buttons
                              <motion.div
                                key="normal-actions"
                                initial={{ x: -300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 300, opacity: 0 }}
                                transition={{
                                  type: "spring",
                                  damping: 20,
                                  stiffness: 300,
                                }}
                                className="flex flex-col sm:flex-row gap-3 absolute inset-0 pt-6 pb-4 px-6"
                              >
                                <button
                                  type="button"
                                  onClick={handleLogoutClick}
                                  className="flex-1 py-3 border border-red-300 text-red-500 rounded-lg font-bold hover:bg-red-50 transition-colors"
                                >
                                  Log out
                                </button>

                                <button
                                  type="submit"
                                  disabled={isSaving}
                                  className="flex-1 bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                                >
                                  {isSaving ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      Saving...
                                    </div>
                                  ) : (
                                    "Save Changes"
                                  )}
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
