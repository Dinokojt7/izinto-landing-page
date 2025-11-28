// src/app/policy/[slug]/page.js
import { notFound } from "next/navigation";
import Link from "next/link";
import policies from "@/data/policies";
import LinkFooter from "../LinkFooter";

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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Logo - Centered */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <img
              src="/images/try-retro.png"
              alt="Izinto"
              className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        {/* Thin Grey Divider - Page Wide */}
        <div className="w-full h-px bg-gray-200 mb-8" />

        {/* Category Header - Big Blue Bold */}
        <div className="text-left mb-4">
          <h1 className="text-4xl font-extrabold text-blue-800">
            {policy.title || "Policy"}
          </h1>
        </div>
      </div>

      {/* Policy Content - No Container, No Shadow, Left Aligned */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-left">
          {policy.sections.map((section, index) => (
            <div key={index} className="mb-12 last:mb-0">
              <h3 className="text-2xl font-bold text-black mb-4">
                {section.title}
              </h3>
              <div className="text-black leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Link Footer */}
      <LinkFooter />
    </div>
  );
}
