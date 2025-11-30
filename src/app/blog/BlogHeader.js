// src/components/blog/BlogHeader.js
"use client";
import { useState, useRef, useEffect } from "react";
import blogPosts from "@/data/blog-posts.json";

export default function BlogHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Left: Logo and Blog Text */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img
                src="/images/try-retro.png"
                alt="Izinto"
                className="h-6 sm:h-8 w-auto"
              />
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold italic text-[#0096ff]">
                Blog
              </span>
            </div>

            {/* Center: Home Articles Dropdown */}
            <div className="flex-1 flex justify-center sm:justify-center">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 hover:bg-gray-50 px-3 sm:px-4 py-2 rounded-lg transition-colors"
                >
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">
                    Home Articles
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu - Fixed mobile positioning */}
                {isDropdownOpen && (
                  <div className="fixed sm:absolute top-16 left-4 right-4 sm:top-full sm:left-1/2 sm:transform sm:-translate-x-1/2 mt-0 sm:mt-2 w-[calc(100vw-2rem)] sm:w-80 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      {blogPosts.posts.map((post) => (
                        <a
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                            {post.title}
                          </div>
                          <div className="text-xs text-gray-500 flex justify-between">
                            <span>{post.category}</span>
                            <span>{post.readTime}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Book Now Button - Hidden on mobile */}
            <button className="hidden sm:flex bg-[#0096ff] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-extrabold italic hover:bg-[#007acc] transition-colors transform whitespace-nowrap">
              BOOK NOW
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav Book Now Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white border-t border-gray-200 p-4 shadow-lg">
        <button className="bg-[#0096ff] text-white px-6 py-3 rounded-full text-sm font-extrabold italic hover:bg-[#007acc] transition-all transform whitespace-nowrap w-full text-center">
          BOOK NOW
        </button>
      </div>
    </>
  );
}
