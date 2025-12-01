"use client";
import Link from "next/link";
import { useState } from "react";

export default function Breadcrumb({ items }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const getTruncatedText = (text, maxLength = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <svg
              className="w-4 h-4 mx-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          <div className="relative">
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-[#0096FF] transition-colors cursor-pointer"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                {getTruncatedText(item.label)}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">
                {getTruncatedText(item.label)}
              </span>
            )}

            {/* Tooltip */}
            {hoveredItem === index && item.label.length > 30 && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white text-xs text-gray-700 rounded-lg shadow-lg whitespace-nowrap z-10 border border-gray-100">
                {item.label}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="w-2 h-2 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </nav>
  );
}
