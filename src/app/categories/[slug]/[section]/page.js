//src/app/categires/[slug]/[section]/page.js
"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import topics from "@/data/help-topics";
import HelpCenterHeader from "@/app/help/HelpCenterHeader";
import Breadcrumb from "@/app/help/BreadCrumb";
import HelpCenterFooter from "@/app/help/HelpCenterFooter";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});
export default function SectionDetailPage({ params }) {
  const [isHelpful, setIsHelpful] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [topic, setTopic] = useState(null);
  const [section, setSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Decode the URL parameters - FIXED: use use() hook
  const { slug, section: sectionParam } = use(params);
  const topicSlug = decodeURIComponent(slug);
  const sectionTitle = decodeURIComponent(sectionParam);

  useEffect(() => {
    // Find the topic and section
    const foundTopic = topics[topicSlug];
    const foundSection = foundTopic?.sections?.find(
      (s) => s.title === sectionTitle,
    );

    if (!foundTopic || !foundSection) {
      router.push("/404");
      return;
    }

    setTopic(foundTopic);
    setSection(foundSection);
    setIsLoading(false);
  }, [topicSlug, sectionTitle, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!topic || !section) {
    return null;
  }

  const breadcrumbItems = [
    { label: "Help Center", href: "/help" },
    { label: topic.title, href: `/categories/${topicSlug}` }, // FIXED: Use topicSlug
    { label: section.title, href: null },
  ];

  const formatUpdatedAt = (updatedAt) => {
    if (updatedAt.toLowerCase().includes("2025")) {
      return "Updated 6 months ago";
    }
    if (updatedAt.toLowerCase().includes("posted in")) {
      const year = updatedAt.match(/\d{4}/)?.[0];
      if (year) {
        const currentYear = new Date().getFullYear();
        const yearsAgo = currentYear - parseInt(year);
        return yearsAgo === 1
          ? "Updated 1 year ago"
          : `Updated ${yearsAgo} years ago`;
      }
    }
    return updatedAt;
  };

  const handleHelpful = (value) => {
    setIsHelpful(value);
    setShowFeedback(true);
  };

  return (
    <div className={`min-h-screen bg-white ${poppins.className}`}>
      <HelpCenterHeader />

      <section className="bg-[#0096FF] text-white h-[25vh] flex items-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-xl sm:text-2xl font-bold">HELP CENTER</h1>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />

          <div className="bg-white rounded-lg">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
              {section.title}
            </h1>

            <p className="text-gray-500 text-sm mb-8">
              {formatUpdatedAt(section.updatedAt)}
            </p>

            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {section.content}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-8">
              {!showFeedback ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Was this helpful?
                  </h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleHelpful(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      No
                    </button>
                    <button
                      onClick={() => handleHelpful(true)}
                      className="px-6 py-2 bg-[#0096FF] text-white rounded-lg font-medium hover:bg-[#0080e6] transition-colors"
                    >
                      Yes
                    </button>
                  </div>
                </>
              ) : (
                <div className="animate-fadeIn">
                  {isHelpful ? (
                    <p className="text-gray-700 italic text-sm">
                      Thank you for your feedback!
                    </p>
                  ) : (
                    <p className="text-gray-700 italic text-sm">
                      We're sorry this wasn't helpful. Please email us at{" "}
                      <a
                        href="mailto:support@izinto.africa"
                        className="text-[#0096FF] hover:underline"
                      >
                        support@izinto.africa
                      </a>{" "}
                      for further assistance.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <HelpCenterFooter />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
