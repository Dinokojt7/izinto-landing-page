"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginSnackbar({ isOpen, onClose, onLogin }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:w-auto sm:transform sm:-translate-x-1/2 z-60"
        >
          <div className="bg-black text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3 sm:px-6 sm:py-4">
            <span className="font-medium text-sm sm:text-base truncate flex-1">
              Login to access referral program & earn rewards
            </span>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onLogin}
                className="bg-white text-black px-3 py-1 rounded-full font-bold text-xs sm:text-sm hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                LOGIN
              </button>
              <button
                onClick={onClose}
                className="text-gray-300 hover:text-white text-lg sm:text-base"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
