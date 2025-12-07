"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCartStore } from "@/lib/stores/cart-store";
import Sidebar from "@/components/layout/Sidebar";
import LoginDialog from "@/app/auth/login/loginDialog";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import ProfileDialog from "../layout/ProfileDialog";

export default function ProductHeader() {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { totalItems } = useCartStore();
  const { user, getUserProfile } = useAuth();
  const { scrollY } = useScroll();
  const [profile, setProfile] = useState({
    name: "",
    surname: "",
  });

  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,1)", "rgba(255,255,255,1)"],
  );
  const headerTextColor = useTransform(
    scrollY,
    [0, 100],
    ["rgb(18,18,18)", "rgb(18,18,18)"],
  );

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [isLoading, user]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const result = await getUserProfile(user.uid);
      if (result.success) {
        setProfile({
          name: result.data.name || "YOUR",
          surname: result.data.surname || "PROFILE",
        });
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-100 bg-white"
        style={{
          background: headerBackground,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:pl-5 lg:pr-9 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Left: Hamburger Menu & Logo */}
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setIsSidebarOpen(true)}
                style={{ color: headerTextColor }}
                className="p-2 pt-3 rounded-lg hover:bg-gray-100 transition-colors"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </motion.button>

              {/* Logo */}
              <motion.div className="flex items-center">
                <img
                  src="/images/try-retro.png"
                  alt="Izinto"
                  className="h-6 sm:h-8 w-auto"
                />
              </motion.div>
            </div>

            {/* Right: User Profile or Login & Cart */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* User Profile Link or Login Button */}
              {user ? (
                // User is logged in - show name/surname link to profile
                <motion.button
                  onClick={() => setIsProfileDialogOpen(true)}
                  style={{
                    color: headerTextColor,
                    borderColor: headerTextColor,
                  }}
                  className="flex items-center space-x-1 sm:space-x-2 border-2 px-3 sm:px-4 py-1 rounded-4xl font-extrabold italic hover:bg-gray-100 transition-colors text-xs sm:text-base cursor-pointer"
                >
                  <img
                    src="/images/user-avatar.png"
                    alt="User"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span>
                    {`${profile.name.toUpperCase()}  ${profile.surname.toUpperCase()}`}
                  </span>
                </motion.button>
              ) : (
                // No user - show login button
                <motion.button
                  onClick={() => setIsLoginDialogOpen(true)}
                  style={{
                    color: headerTextColor,
                    borderColor: headerTextColor,
                  }}
                  className="flex items-center space-x-1 sm:space-x-2 border-2 px-2 sm:px-4 py-1 rounded-4xl font-extrabold italic hover:bg-gray-100 transition-colors text-xs sm:text-base"
                >
                  <img
                    src="/images/user-avatar.png"
                    alt="User"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span>SIGN IN</span>
                </motion.button>
              )}

              {/* Cart Button */}
              <Link href="/cart">
                <motion.button
                  style={{
                    color: headerTextColor,
                    borderColor: headerTextColor,
                  }}
                  className="flex items-center space-x-1 sm:space-x-2 border-2 px-2 sm:px-4 py-1 rounded-4xl font-extrabold italic hover:bg-gray-100 transition-colors text-xs sm:text-base relative"
                >
                  <img
                    src="/images/bucket.png"
                    alt="Cart"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span className="hidden sm:inline">{totalItems}</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>
      {/* Dialogs */}
      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />
      {isProfileDialogOpen && (
        <ProfileDialog
          isOpen={isProfileDialogOpen}
          onClose={() => setIsProfileDialogOpen(false)}
        />
      )}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        showLoginDialog={() => setIsLoginDialogOpen(true)}
      />{" "}
    </>
  );
}
