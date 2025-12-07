// components/product/BottomBreadCrumbSection.js
"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BottomBreadcrumbSection({ service }) {
  const router = useRouter();

  const handleProviderClick = () => {
    // Navigate to provider-specific section
    router.push(`/s/${service.provider.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div className="w-full bg-white py-6 border-b mt-6 border-gray-100">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        {/* Simple Breadcrumb with Provider Link */}
        <div className="flex items-center flex-wrap gap-2 xs:gap-3 text-sm">
          <Link
            href="/"
            className="text-black underline transition-colors hover:text-blue-600"
          >
            Home
          </Link>

          <span className="text-gray-400">/</span>

          {/* Provider Link - No dropdown */}
          <button
            onClick={handleProviderClick}
            className="text-black underline transition-colors hover:text-blue-600 cursor-pointer"
          >
            {service.provider}
          </button>

          <span className="text-gray-400">/</span>

          <span className="font-medium text-black">{service.name}</span>
        </div>
      </div>
    </div>
  );
}
