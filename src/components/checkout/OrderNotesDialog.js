"use client";
import { useState } from "react";

export default function OrderNotesDialog({ isOpen, onClose, notes, onSave }) {
  const [orderNotes, setOrderNotes] = useState(notes || "");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(orderNotes.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-11/12 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-black italic text-black">
            Add Order Notes
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes for your order (optional)
              </label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Add any special instructions, delivery notes, or requests..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-black min-h-[200px]"
                rows={6}
              />
              <p className="text-sm text-gray-500 mt-2">
                These notes will be shared with the service provider.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
