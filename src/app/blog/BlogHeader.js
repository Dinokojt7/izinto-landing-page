// src/components/blog/BlogHeader.js - Alternative version
export default function BlogHeader() {
  return (
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

          {/* Center: Home Articles Dropdown - Responsive positioning */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-semibold text-sm sm:text-base">
                Home Articles
              </span>
              <svg
                className="w-4 h-4 text-gray-500"
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
            </div>
          </div>

          {/* Right: Order Now Button - Responsive sizing */}
          <button className="bg-[#0096ff] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-extrabold italic hover:bg-[#007acc] transition-colors transform whitespace-nowrap">
            ORDER NOW
          </button>
        </div>
      </div>
    </header>
  );
}
