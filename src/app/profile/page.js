"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import CircularProgressIndicator from "@/components/ui/CircularProgessIndicator";
import { Poppins } from "next/font/google";
import { useAuth } from "@/lib/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, getUserProfile, handleLogout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: "",
    preferences: {
      notifications: true,
      marketing: false,
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    } else if (user) {
      loadUserProfile();
    }
  }, [user, loading, router]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    const result = await getUserProfile(user.uid);

    if (result.success) {
      setProfile({
        displayName: result.data.displayName || "",
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
        displayName: profile.displayName.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        address: profile.address.trim(),
        preferences: profile.preferences,
        profileComplete: true,
        updatedAt: new Date().toISOString(),
      });

      router.push("/services");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkipForNow = () => {
    if (user) {
      updateDoc(doc(db, "users", user.uid), {
        profileComplete: true,
        updatedAt: new Date().toISOString(),
      });
    }
    router.push("/services");
  };

  const handleLogoutClick = async () => {
    if (user) {
      await handleLogout();
    }
    router.push("/");
  };

  if (loading || isLoading) {
    return <CircularProgressIndicator isPageLoader={true} />;
  }

  if (!user) {
    return null;
  }

  return (
    <AuthGuard requireAuth={true} redirectTo="/auth/login">
      <div className={`min-h-screen bg-white ${poppins.className}`}>
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-black italic text-black mb-2">
              Your Profile
            </h1>
            <p className="text-gray-600">
              Tell us a bit more about yourself to personalize your experience
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-black italic text-black mb-6">
                Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-black italic text-black mb-6">
                booking Address
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Address
                </label>
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  placeholder="Enter your full address for booking"
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-black"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This will be used for service booking
                </p>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-black italic text-black mb-6">
                Preferences
              </h2>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={profile.preferences.notifications}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 accent-black border-gray-300 rounded focus:ring-0"
                  />
                  <span className="text-gray-700">
                    Receive service notifications and updates
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="marketing"
                    checked={profile.preferences.marketing}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 accent-black border-gray-300 rounded focus:ring-0"
                  />
                  <span className="text-gray-700">
                    Receive promotional offers and news
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={handleLogoutClick}
                className="flex-1 border border-red-300 text-red-500 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors"
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
                  "Save changes"
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </AuthGuard>
  );
}
