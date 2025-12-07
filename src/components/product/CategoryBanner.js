"use client";
import { useState } from "react";
import { getProviderExplanation } from "@/lib/utils/providerExplanations";
import { useRouter } from "next/navigation";
import CircularProgressIndicator from "../ui/CircularProgessIndicator";

export default function CategoryBanner({ service }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const providerExplanation = getProviderExplanation(service.provider);

  const handleViewMore = () => {
    setIsLoading(true);
    // Navigate to category page with provider filter
    setTimeout(() => {
      router.push(
        `/category/${service.provider.toLowerCase().replace(/\s+/g, "-")}`,
      );
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return <CircularProgressIndicator isPageLoader={true} />;
  }

  return (
    <section className="w-full px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl px-3 xs:px-4 sm:px-6 py-4 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black italic text-black/70 mb-3 sm:mb-4 leading-tight">
              {service.provider}
            </h2>
            <p className="text-black/60 font-semibold text-sm xs:text-base leading-relaxed max-w-4xl">
              {providerExplanation}
            </p>
          </div>

          {/* Right Button */}
          <div className="flex justify-center lg:justify-end mt-2 lg:mt-0 lg:ml-6 xl:ml-8">
            <button
              onClick={handleViewMore}
              className="bg-[#0000ff] text-white px-5 xs:px-6 py-2.5 xs:py-3 rounded-full text-sm xs:text-base font-extrabold italic hover:bg-blue-800 transition-all transform whitespace-nowrap text-center tracking-tighter flex items-center justify-center gap-2 min-w-[120px] xs:min-w-[140px] hover:scale-105 active:scale-95"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  View More
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
