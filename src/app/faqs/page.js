// src/app/faqs/page.js
import Link from "next/link";
import { Inter } from "next/font/google";
import LinkFooter from "../policy/LinkFooter";
import faqs from "@/data/faqs.json";

const inter = Inter({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Frequently Asked Questions | Izinto",
  description:
    "Find answers to common questions about our laundry, car wash, gas refill, and other home services.",
};

export default function FAQPage() {
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

        {/* Page Header - Responsive sizing */}
        <div className="text-left mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0096FF] leading-tight mb-3 sm:mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl">
            Find answers to common questions about our services. Can't find what
            you're looking for?{" "}
            <Link
              href="/help"
              className="text-[#0096FF] hover:text-[#007acc] underline font-semibold"
            >
              Contact our support team
            </Link>
            .
          </p>
        </div>
      </div>

      {/* FAQ Content - Responsive spacing and typography */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-12 sm:space-y-16">
          {faqs.faqs.map((category, categoryIndex) => (
            <section
              key={categoryIndex}
              className="scroll-mt-20"
              id={category.slug}
            >
              {/* Category Header */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-3 sm:mb-4">
                  {category.category}
                </h2>
                <div className="w-16 h-1 bg-[#0096FF] rounded-full"></div>
              </div>

              {/* Questions Grid */}
              <div className="space-y-6 sm:space-y-8">
                {category.questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8"
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4 leading-relaxed">
                      {question.title}
                    </h3>
                    <div className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                      {question.text}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
              Still have questions?
            </h3>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed">
              Our support team is here to help you with any additional questions
              you might have about our services.
            </p>
            <Link
              href="/help"
              className="inline-block bg-[#0096FF] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-extrabold italic hover:bg-[#007acc] transition-colors transform"
            >
              CONTACT SUPPORT
            </Link>
          </div>
        </div>
      </div>

      {/* Link Footer */}
      <LinkFooter />
    </div>
  );
}
