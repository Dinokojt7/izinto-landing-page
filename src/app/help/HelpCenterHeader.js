import Link from "next/link";

export default function HelpCenterHeader() {
  return (
    <header className="bg-white border-b border-blue-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/images/try-retro.png"
              alt="Izinto"
              className="h-8 w-auto"
            />
          </div>

          {/* Back to Main Site Button */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-[#0096FF] font-bold text-xs sm:text-sm uppercase transition-colors hover:opacity-80"
          >
            <span className="hidden sm:inline">BACK TO MAIN SITE</span>
            <span className="sm:hidden">BACK</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
