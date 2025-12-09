"use client";
import { motion } from "framer-motion";

export default function PaymentMethodDialog({
  isOpen,
  onClose,
  selectedMethod,
  onSelect,
}) {
  const paymentMethods = [
    {
      id: "cash",
      name: "Cash on Delivery",
      description: "Pay when you receive your order",
      available: true,
    },
    {
      id: "card",
      name: "Card Payment",
      description: "Pay with credit/debit card",
      available: false,
    },
    {
      id: "yoco",
      name: "Yoco Payment",
      description: "Secure online payment via Yoco",
      available: false,
    },
    {
      id: "eft",
      name: "EFT Payment",
      description: "Bank transfer payment",
      available: false,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl w-11/12 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-black italic text-black">
            Select Payment Method
          </h2>
          <button
            onClick={onClose}
            className="text-gray-800 hover:text-gray-900 p-2"
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
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <motion.div
                key={method.id}
                whileHover={method.available ? { scale: 1.01 } : {}}
                whileTap={method.available ? { scale: 0.99 } : {}}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? "border-black bg-gray-50"
                    : method.available
                      ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      : "border-gray-200 opacity-60 cursor-not-allowed"
                }`}
                onClick={() => method.available && onSelect(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === method.id
                          ? "border-black bg-black"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedMethod === method.id && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-black text-sm">
                        {method.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  {!method.available && (
                    <span className="text-xs font-medium text-orange-500">
                      Temporarily unavailable
                    </span>
                  )}
                  {method.available && selectedMethod === method.id && (
                    <span className="text-xs font-bold text-black">
                      Selected
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 border border-[#0096FF] rounded-lg bg-blue-50">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-[#0096FF] mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-700">
                  Currently, only Cash on Delivery is available. Other payment
                  methods are coming soon.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
          >
            Confirm Selection
          </button>
        </div>
      </motion.div>
    </div>
  );
}
