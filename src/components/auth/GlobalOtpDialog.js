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
    <AnimatePresence>
      {showOtpDialog && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-9999 bg-black"
            onClick={resetOtpDialog}
          />

          {/* Bottom Sheet Container */}
          <div className="fixed inset-0 z-9999 flex items-end justify-center sm:items-center overflow-y-auto pointer-events-none">
            {/* Bottom Sheet Content */}
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
              className="pointer-events-auto bg-white w-full max-w-md overflow-hidden flex flex-col 
                /* Mobile Styles - Bottom Sheet */
                h-auto max-h-[75vh] mt-4 rounded-t-2xl
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

              {/* Header with close button */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-black">
                  Verify Phone Number
                </h3>
                <button
                  onClick={resetOtpDialog}
                  className="text-gray-800 hover:text-black p-2"
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
              <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
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
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                    >
                      {phoneAuthState.error}
                    </motion.div>
                  )}

                  {/* OTP Inputs */}
                  <div className="flex justify-center gap-2 px-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <motion.input
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
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

                  {/* Verify Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => handleVerifyOtp()}
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
                  </motion.button>

                  {/* Resend Code */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="text-center"
                  >
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
                  </motion.div>
                </motion.div>
              </div>

              {/* Add some bottom padding for mobile safety area */}
              <div className="sm:hidden h-4" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
