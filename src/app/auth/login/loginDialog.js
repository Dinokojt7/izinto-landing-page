// src/components/auth/LoginDialog.js
"use client";
import { useState } from "react";

export default function LoginDialog({ isOpen, onClose }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validatePhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, "");
    return cleaned.length >= 10 && cleaned.length <= 13;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
    setIsValid(validatePhoneNumber(value));
  };

  const handleContinue = () => {
    if (isValid) {
      // Handle login logic here
      console.log("Phone number:", phoneNumber);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-11/12 max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold italic text-primary">Login</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
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
        <div className="p-6">
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-3xl font-bold text-primary">Izinto</span>
          </div>

          <div className="space-y-6">
            {/* Introduction */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Hi! Let's start with your phone number
              </h3>
              <p className="text-gray-600 text-sm">
                Enter your number to log in, or to sign up for an account if
                you're new here.
              </p>
            </div>

            {/* Phone Input */}
            <div className="space-y-4">
              <div className="flex space-x-3">
                {/* Country Code */}
                <select className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cartBlue focus:border-transparent">
                  <option value="+27">+27</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>

                {/* Phone Number */}
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Phone number"
                  maxLength={13}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cartBlue focus:border-transparent"
                />
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!isValid}
              className="w-full bg-cartBlue text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Auth Button */}
            <button className="w-full flex items-center justify-center space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
              <span className="font-semibold text-gray-700">
                Continue with Google
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
