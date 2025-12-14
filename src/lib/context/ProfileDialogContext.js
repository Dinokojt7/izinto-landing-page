"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/lib/context/AuthContext";

const ProfileDialogContext = createContext({});

export const useProfileDialog = () => useContext(ProfileDialogContext);

export const ProfileDialogProvider = ({ children }) => {
  const { user, userProfile, profileComplete, isNewUser } = useAuth();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [forceShow, setForceShow] = useState(false);

  // Auto-show logic when profile is incomplete/new user
  useEffect(() => {
    if (user && (isNewUser || !profileComplete) && !forceShow) {
      // Delay slightly to avoid flashing during auth flow
      const timer = setTimeout(() => {
        setShowProfileDialog(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [user, isNewUser, profileComplete, forceShow]);

  // Manual show function (for buttons elsewhere in app)
  const openProfileDialog = useCallback(() => {
    setForceShow(true);
    setShowProfileDialog(true);
  }, []);

  // Manual close function
  const closeProfileDialog = useCallback(() => {
    setForceShow(false);
    setShowProfileDialog(false);
  }, []);

  // Check if profile needs completion
  const needsProfileCompletion = useCallback(() => {
    return user && (isNewUser || !profileComplete);
  }, [user, isNewUser, profileComplete]);

  const value = {
    showProfileDialog,
    openProfileDialog,
    closeProfileDialog,
    needsProfileCompletion,
    profileData: userProfile,
  };

  return (
    <ProfileDialogContext.Provider value={value}>
      {children}
    </ProfileDialogContext.Provider>
  );
};
