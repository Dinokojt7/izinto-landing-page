"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getDetailedServiceExplanation,
  getProviderBenefits,
} from "@/lib/utils/serviceExplanations";

export default function HowWeWork({ service }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!service) return null;

  const { provider, name: serviceName } = service;
  const { overview, howItWorks, benefits, specificServiceDetail } =
    getDetailedServiceExplanation(provider, serviceName);

  // Get preview content (first few sentences)
  const getPreviewContent = () => {
    if (!overview) return "";

    // Split by sentences
    const sentences = overview.match(/[^.!?]+[.!?]+/g) || [];

    // Take first 3 sentences
    const previewSentences = sentences.slice(0, 3).join(" ");

    // If we have less than 3 sentences, add first part of howItWorks
    if (sentences.length < 3 && howItWorks) {
      const howItWorksSentences = howItWorks.match(/[^.!?]+[.!?]+/g) || [];
      if (howItWorksSentences.length > 0) {
        return previewSentences + " " + howItWorksSentences[0];
      }
    }

    return previewSentences;
  };

  // Format content with bold highlights
  const formatContent = (content) => {
    return content.split("\n").map((line, index) => {
      // Handle sub-headers (## or ###)
      if (line.startsWith("### ") || line.startsWith("## ")) {
        const cleanLine = line.replace(/^#+\s/, "");
        return (
          <h3
            key={index}
            className="text-base font-bold text-black/80 mb-4 mt-8 first:mt-0"
          >
            {cleanLine}
          </h3>
        );
      }
      // Handle regular paragraphs with potential bold text
      else if (line.trim()) {
        // Split by **bold** patterns
        const parts = line.split(/(\*\*.*?\*\*)/g);

        return (
          <p key={index} className="text-black/80 mb-4 leading-relaxed">
            {parts.map((part, i) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                const boldText = part.slice(2, -2);
                return (
                  <span key={i} className="font-bold text-black/60">
                    {boldText}
                  </span>
                );
              }
              return part;
            })}
          </p>
        );
      }
      // Empty lines for spacing
      else if (line === "") {
        return <div key={index} className="h-4" />;
      }

      return null;
    });
  };

  // Get all content sections
  const getContentSections = () => {
    const sections = [];

    // Start with overview
    if (overview) {
      sections.push({
        title: `About ${serviceName}`,
        content: overview,
      });
    }

    // Add how it works
    if (howItWorks) {
      sections.push({
        title: "How It Works",
        content: howItWorks,
      });
    }

    // Add specific details
    if (specificServiceDetail) {
      sections.push({
        title: "Service Specifics",
        content: specificServiceDetail,
      });
    }

    // Add benefits as bullet points
    if (benefits && benefits.length > 0) {
      const benefitsContent = benefits
        .map((benefit) => `• ${benefit}`)
        .join("\n");
      sections.push({
        title: "What Makes Us Different",
        content: benefitsContent,
      });
    }

    return sections;
  };

  const previewContent = getPreviewContent();
  const contentSections = getContentSections();

  return (
    <section className="w-full lg:px-8 py-6 ">
      <div className="bg-blue-50 w-full sm:rounded-2xl px-6 sm:px-12 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl sm:text-4xl font-black italic text-black/70 mb-2">
            HOW WE WORK
          </h2>
        </div>

        {/* Collapsible Content Area */}
        <div className="relative">
          {/* Preview Content (always shown) */}
          <div
            className={`transition-all duration-300 ${isExpanded ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}
          >
            <div className="text-black/60 space-y-3">
              <p className="leading-relaxed line-clamp-3">{previewContent}</p>
            </div>

            {/* Show More Button */}
            <button
              onClick={() => setIsExpanded(true)}
              className="mt-4 text-black/60 font-bold transition-colors flex items-center gap-1 underline cursor-pointer text-sm"
            >
              Show more details
              <svg
                className="w-4 h-4"
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
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-8 pt-2">
                  {contentSections.map((section, index) => (
                    <div
                      key={index}
                      className="border-t border-blue-100 pt-6 first:border-0 first:pt-0"
                    >
                      <div className="space-y-4">
                        {formatContent(section.content)}
                      </div>
                    </div>
                  ))}

                  {/* Show Less Button */}
                  <div className="pt-4 border-t border-blue-100">
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="text-black/60 font-bold transition-colors flex items-center underline cursor-pointer gap-1 text-sm"
                    >
                      Show less
                      <svg
                        className="w-4 h-4 rotate-180"
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
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
