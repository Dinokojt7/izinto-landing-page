"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "@/lib/context/AuthContext";

const OtpContext = createContext({});

export const useOtp = () => useContext(OtpContext);

// 🚨 MOVE THIS FUNCTION INSIDE THE COMPONENT
const validateAndFormatPhoneNumber = (number) => {
  const cleaned = number.replace(/\D/g, "");
  const isSouthAfrican = cleaned.startsWith("0") && cleaned.length === 10;

  if (isSouthAfrican) {
    const subscriberNumber = cleaned.substring(1);
    return `+27${subscriberNumber}`;
  }

  const hasCountryCode = cleaned.startsWith("27") || cleaned.startsWith("+27");
  if (hasCountryCode && cleaned.length >= 11) {
    return `+${cleaned.replace("+", "")}`;
  }

  return null;
};

export const OtpProvider = ({ children }) => {
  const {
    phoneAuthState,
    handlePhoneSubmit,
    handleOTPVerify,
    resetPhoneAuth,
    setPhoneAuthError,
  } = useAuth();

  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [footerPhoneNumber, setFooterPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(30);
    setCanResend(false);
  };

  // ✅ FIXED: Function is now accessible inside useCallback
  const triggerOtpFromAnywhere = useCallback(
    async (phoneNumber) => {
      const formattedNumber = validateAndFormatPhoneNumber(phoneNumber);

      if (!formattedNumber) {
        return { success: false, error: "Invalid phone number" };
      }

      setIsLoading(true);
      const result = await handlePhoneSubmit(formattedNumber);
      setIsLoading(false);

      if (result.success) {
        setFooterPhoneNumber(phoneNumber);
        setShowOtpDialog(true);
        startCountdown();
        return { success: true };
      }
      return result;
    },
    [handlePhoneSubmit],
  );

  // Resend OTP function
  const handleResendOtp = useCallback(async () => {
    if (!canResend || !footerPhoneNumber) return;

    setIsLoading(true);
    const formattedNumber = validateAndFormatPhoneNumber(footerPhoneNumber);
    const result = await handlePhoneSubmit(formattedNumber);
    setIsLoading(false);

    if (result.success) {
      startCountdown();
    }
  }, [canResend, footerPhoneNumber, handlePhoneSubmit]);

  // OTP input handlers
  const handleOtpChange = useCallback(
    (index, value) => {
      if (value.length > 1) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`global-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }

      if (value && index === 5) {
        const otpString = newOtp.join("");
        if (otpString.length === 6) {
          handleVerifyOtp(otpString);
        }
      }
    },
    [otp],
  );

  const handleVerifyOtp = async (otpString = otp.join("")) => {
    if (otpString.length !== 6) return;

    setIsLoading(true);
    const result = await handleOTPVerify(otpString);
    setIsLoading(false);

    if (result.success) {
      setOtp(["", "", "", "", "", ""]);
      setShowOtpDialog(false);
      setCountdown(0);
      setCanResend(true);
      resetPhoneAuth();
    }
  };

  const resetOtpDialog = () => {
    setOtp(["", "", "", "", "", ""]);
    setShowOtpDialog(false);
    setCountdown(0);
    setCanResend(true);
    resetPhoneAuth();
  };

  const value = {
    showOtpDialog,
    footerPhoneNumber,
    otp,
    isLoading,
    countdown,
    canResend,
    triggerOtpFromAnywhere,
    handleOtpChange,
    handleVerifyOtp,
    handleResendOtp,
    resetOtpDialog,
    phoneAuthState,
  };

  return <OtpContext.Provider value={value}>{children}</OtpContext.Provider>;
};
