"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useOtp } from "@/lib/context/OtpContext";

export default function GlobalOtpDialog() {
  const {
    showOtpDialog,
    footerPhoneNumber,
    otp,
    isLoading,
    phoneAuthState,
    handleOtpChange,
    handleVerifyOtp,
    resetOtpDialog,
  } = useOtp();

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`global-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  if (!showOtpDialog) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-xl w-[calc(100vw-2rem)] sm:w-11/12 max-w-md max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col mx-4 sm:mx-0">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-bold text-black">Verify Phone Number</h3>
          <button
            onClick={resetOtpDialog}
            className="text-gray-800 hover:text-black p-2"
          >
            ✕
          </button>
        </div>

        {/* Content - Reuse your OTP JSX */}
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-black mb-2">
                Enter Verification Code
              </h3>
              <p className="text-gray-600 text-sm">
                We sent a 6-digit code to{" "}
                <span className="font-bold">{footerPhoneNumber}</span>
              </p>
            </div>

            {phoneAuthState.error && (
              <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {phoneAuthState.error}
              </div>
            )}

            <div className="flex justify-center gap-2 px-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  id={`global-otp-${index}`}
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

            <button
              onClick={() => handleVerifyOtp()}
              disabled={otp.join("").length !== 6 || isLoading}
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "VERIFY CODE"}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  onClick={() => {
                    /* Implement resend */
                  }}
                  className="font-bold text-black hover:underline"
                >
                  Resend Code
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
