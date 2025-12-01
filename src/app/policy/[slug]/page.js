// src/app/policy/[slug]/page.js
import { notFound } from "next/navigation";
import Link from "next/link";
import policies from "@/data/policies";
import LinkFooter from "../LinkFooter";
import { Inter } from "next/font/google";

// Load Inter font for this page
const inter = Inter({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const policy = policies[slug];

  if (!policy) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${policy.title} | Izinto`,
    description: `Read our ${policy.title.toLowerCase()} to understand how we handle your information and services.`,
  };
}

export async function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({
    slug: slug,
  }));
}

export default async function PolicyPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const policy = policies[slug];

  if (!policy) {
    notFound();
  }

  return (
    <div className={`min-h-screen bg-white ${inter.className}`}>
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Logo - Centered */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <Link href="/">
            <img
              src="/images/try-retro.png"
              alt="Izinto"
              className="h-7 sm:h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        {/* Thin Grey Divider - Page Wide */}
        <div className="w-full h-px bg-gray-200 mb-6 sm:mb-8" />

        {/* Category Header - Responsive sizing */}
        <div className="text-left mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0096FF] leading-tight">
            {policy.title || "Policy"}
          </h1>
          {/* Last Updated Date */}
          {policy.lastUpdated && (
            <p className="text-gray-600 text-sm sm:text-base mt-2 sm:mt-3">
              Last updated: {policy.lastUpdated}
            </p>
          )}
        </div>
      </div>

      {/* Policy Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-left">
          {policy.sections.map((section, index) => (
            <div key={index} className="mb-8 sm:mb-12 last:mb-0">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4 leading-relaxed">
                {section.title}
              </h3>
              <div className="text-black leading-relaxed whitespace-pre-line text-sm sm:text-base lg:text-lg">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm sm:text-base">
            If you have any questions about our {policy.title.toLowerCase()},
            please contact us at{" "}
            <a
              href="mailto:info@izinto.africa"
              className="text-[#0096FF] hover:text-[#007acc] underline font-semibold"
            >
              info@izinto.africa
            </a>
          </p>
        </div>
      </div>

      {/* Link Footer */}
      <LinkFooter />
    </div>
  );
}
