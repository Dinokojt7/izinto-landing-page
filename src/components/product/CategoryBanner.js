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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-2">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Left Content */}
          <div className="flex-1">
            <h2 className="text-4xl font-black italic text-black/70 mb-4">
              {service.provider}
            </h2>
            <p className="text-black/60 font-semibold text-base">
              {providerExplanation}
            </p>
          </div>

          {/* Right Button */}
          <div className="mt-4 lg:mt-0 lg:ml-8">
            <button
              onClick={handleViewMore}
              className="bg-[#0000ff] text-white px-6 py-2 rounded-full text-base font-extrabold italic hover:bg-blue-800 transition-all transform whitespace-nowrap text-center tracking-tighter flex items-center justify-center gap-2 mx-auto"
            >
              View More
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
