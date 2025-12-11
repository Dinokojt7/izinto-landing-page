"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/lib/context/AuthContext";

export default function LoginDialog({ isOpen, onClose }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const {
    setPhoneAuthError,
    phoneAuthState,
    handlePhoneSubmit,
    handleOTPVerify,
    handleGoogleSignIn,
    resetPhoneAuth,
  } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("dialog-open");
    } else {
      document.documentElement.classList.remove("dialog-open");
    }

    return () => {
      document.documentElement.classList.remove("dialog-open");
    };
  }, [isOpen]);

  useEffect(() => {
    if (phoneAuthState.step === "otp" && countdown === 0) {
      startCountdown();
    }
  }, [phoneAuthState.step]);

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

  const validateAndFormatPhoneNumber = (number) => {
    // Remove all non-digits
    const cleaned = number.replace(/\D/g, "");

    // South African numbers: 10 digits (e.g., 0821234567)
    const isSouthAfrican = cleaned.startsWith("0") && cleaned.length === 10;

    // If it's a South African number without country code, add +27
    if (isSouthAfrican) {
      const subscriberNumber = cleaned.substring(1); // Remove leading 0
      return `+27${subscriberNumber}`; // Returns "+27821234567"
    }

    // Already has country code (e.g., +27821234567)
    const hasCountryCode =
      cleaned.startsWith("27") || cleaned.startsWith("+27");
    if (hasCountryCode && cleaned.length >= 11) {
      return `+${cleaned.replace("+", "")}`;
    }

    return null; // Invalid format
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);

    // Check if valid South African format (10 digits starting with 0)
    const isValid = value.startsWith("0") && value.length === 10;
    setIsValidPhone(isValid);
  };

  const handleSendOTP = async () => {
    if (!isValidPhone) return;

    setIsLoading(true);

    // Format the number properly before sending
    const formattedNumber = validateAndFormatPhoneNumber(phoneNumber);

    if (!formattedNumber) {
      setPhoneAuthError(
        "Please enter a valid South African phone number (e.g., 0821234567)",
      );
      setIsLoading(false);
      return;
    }

    const result = await handlePhoneSubmit(formattedNumber);
    setIsLoading(false);

    if (result.success) {
      startCountdown();
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto submit when last digit entered
    if (value && index === 5) {
      const otpString = newOtp.join("");
      if (otpString.length === 6) {
        handleVerifyOTP(otpString);
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async (otpString = otp.join("")) => {
    if (otpString.length !== 6) return;

    setIsLoading(true);
    const result = await handleOTPVerify(otpString);
    setIsLoading(false);

    if (result.success) {
      setTimeout(() => {
        onClose();
        resetPhoneAuth();
      }, 1000);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    await handlePhoneSubmit(phoneNumber);
    setIsLoading(false);
    startCountdown();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const result = await handleGoogleSignIn();

    if (result.success && result.redirect) {
      setIsLoading(true);
    } else if (!result.success) {
      setIsLoading(false);
      setPhoneAuthError(result.error || "Google sign-in failed");
    }
  };

  const handleClose = () => {
    resetPhoneAuth();
    onClose();
  };

  // Instead of early return, conditionally render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 overflow-y-auto">
      {" "}
      <div className="bg-white rounded-xl w-[calc(100vw-2rem)] sm:w-11/12 max-w-md max-h-[calc(100vh-4rem)] sm:max-h-[90vh] overflow-hidden flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mx-4 sm:mx-0">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-gray-200">
          <img
            src="/images/try-retro.png"
            alt="Izinto"
            width={24}
            height={24}
            className="h-8 w-auto"
          />

          <button
            onClick={handleClose}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* Phone Input Step */}
            {phoneAuthState.step === "input" && (
              <motion.div
                key="phone-input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Introduction */}
                <div>
                  <h2 className="text-3xl font-black italic text-black mb-4">
                    Hi! Let's start with your phone number
                  </h2>
                </div>

                {/* Error Message */}
                {phoneAuthState.error && (
                  <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {phoneAuthState.error}
                  </div>
                )}

                {/* Phone Input */}
                <div className="space-y-4">
                  <div>
                    <div className="flex flex-col sm:flex-row gap-3 px-1">
                      {/* Country Code - Fixed width on mobile */}
                      <div className="w-full sm:w-24 p-3 border border-gray-300 text-black rounded-lg bg-gray-50 text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
                        <img
                          src="/flags/za-flag.png"
                          alt="ZA"
                          className="w-5 h-4 rounded-sm"
                        />
                        <span>+27</span>
                      </div>{" "}
                      {/* Phone Input - Better mobile sizing */}
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="e.g., 0821234567"
                        maxLength={10}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0096FF] focus:border-transparent transition-all text-base"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mx-2 mt-2">
                      We'll send a 6-digit verification code
                    </p>
                  </div>
                </div>

                {/* Send OTP Button */}
                <button
                  onClick={handleSendOTP}
                  disabled={!isValidPhone || isLoading}
                  className="w-full bg-[#0000ff] rounded-full italic text-sm text-white py-3 font-black cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    "SIGN IN / SIGN UP"
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Google Auth Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 p-3 border-2 border-gray-600 px-4 py-2 rounded-4xl font-extrabold italic hover:bg-white/20 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-black text-black/80">Google</span>
                </button>

                {/* Terms */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    By continuing, you agree to our{" "}
                    <button className="text-gray-600 hover:text-black">
                      Terms
                    </button>{" "}
                    and{" "}
                    <button className="text-gray-600 hover:text-black">
                      Privacy Policy
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* OTP Verification Step */}
            {phoneAuthState.step === "otp" && (
              <motion.div
                key="otp-verification"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Header */}
                <div>
                  <h3 className="text-lg font-bold text-black mb-2">
                    Enter Verification Code
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We sent a 6-digit code to{" "}
                    <span className="font-bold">{phoneNumber}</span>
                  </p>
                </div>

                {/* Error Message */}
                {phoneAuthState.error && (
                  <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {phoneAuthState.error}
                  </div>
                )}

                {/* OTP Inputs */}
                <div className="flex justify-center gap-2 px-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0096FF] focus:border-transparent transition-all"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  onClick={() => handleVerifyOTP()}
                  disabled={otp.join("").length !== 6 || isLoading}
                  className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    "VERIFY CODE"
                  )}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{" "}
                    <button
                      onClick={handleResendOTP}
                      disabled={!canResend || isLoading}
                      className="font-bold text-black hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {canResend ? "Resend Code" : `Resend in ${countdown}s`}
                    </button>
                  </p>
                </div>

                {/* Back to Phone Input */}
                <button
                  onClick={resetPhoneAuth}
                  className="w-full text-center text-gray-600 hover:text-black transition-colors text-sm"
                >
                  ← Use a different phone number
                </button>
              </motion.div>
            )}

            {/* Success Step */}
            {phoneAuthState.step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 mx-auto mb-6 text-green-500">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-black mb-2">
                  Verified Successfully!
                </h3>
                <p className="text-gray-600 text-sm">
                  Redirecting you to your account...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
