"use client";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Poppins } from "next/font/google";
import { useAuth } from "@/lib/context/AuthContext";
import CircularProgressIndicator from "@/components/ui/CircularProgessIndicator";
import { useAddress } from "@/providers/AddressProvider";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function ProfileDialog({ isOpen, onClose }) {
  const { user, getUserProfile, handleLogout } = useAuth();
  const { activeAddress } = useAddress();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
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
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

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

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeletingAccount(true);
    try {
      // Note: You'll need to implement Firebase auth account deletion
      // and Firestore document deletion here
      console.log("Account deletion would happen here");
      alert("Account deletion feature needs to be implemented.");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleLogoutClick = async () => {
    await handleLogout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 overflow-y-auto">
      <div className="bg-white rounded-xl w-[calc(100vw-2rem)] sm:w-11/12 max-w-lg max-h-[calc(100vh-4rem)] sm:max-h-[90vh] overflow-hidden flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mx-4 sm:mx-0">
        {/* Header - With "Your Profile" text only */}
        <div className="flex justify-between items-center p-6">
          <h2 className="text-2xl font-black italic text-black">
            Your Profile
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

        {isLoading ? (
          <div className="flex justify-center">
            <CircularProgressIndicator size={40} strokeWidth={4} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-black">
                  Personal Information
                </h3>

                {/* Name & Surname - Separate Fields */}
                <div className="grid grid-cols-2 gap-4">
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
              </div>

              {/* Current Address Display (Read Only) */}
              {activeAddress && (
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-black">
                    Active Address
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div className="flex items-start">
                      <span className="font-medium w-20">Street:</span>
                      <span className="flex-1">{activeAddress.street}</span>
                    </div>
                    {activeAddress.suburb && (
                      <div className="flex items-start">
                        <span className="font-medium w-20">Suburb:</span>
                        <span className="flex-1">{activeAddress.suburb}</span>
                      </div>
                    )}
                    <div className="flex items-start">
                      <span className="font-medium w-20">Town:</span>
                      <span className="flex-1">{activeAddress.town}</span>
                    </div>
                    {activeAddress.zip && (
                      <div className="flex items-start">
                        <span className="font-medium w-20">ZIP Code:</span>
                        <span className="flex-1">{activeAddress.zip}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-black">Preferences</h3>
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
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
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
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
