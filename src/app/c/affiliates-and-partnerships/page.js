"use client";

import { useState } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import LinkFooter from "@/app/policy/LinkFooter";

const inter = Inter({ subsets: ["latin"] });

// Audience type options
const AUDIENCE_TYPES = [
  "Students",
  "Professionals",
  "Entrepreneurs",
  "Influencers",
  "Community Leaders",
  "Content Creators",
  "Corporate Teams",
  "Other",
];

export default function ApplyToWorkWithUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    instagram: "",
    twitter: "",
    tiktok: "",
    youtube: "",
    audienceType: "",
    additionalInfo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAudienceTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      audienceType: type,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: "" });

    try {
      const response = await fetch("/api/send-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message:
            "Application submitted successfully! We'll contact you soon.",
        });
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          instagram: "",
          twitter: "",
          tiktok: "",
          youtube: "",
          audienceType: "",
          additionalInfo: "",
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message:
          "Failed to submit application. Please try again or email info@izinto.africa directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Partner & Affiliate Requests
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl">
            Join the Izinto team! Fill out this form to apply for partnerships,
            affiliates, or collaboration opportunities. We're looking for
            passionate individuals to grow with us.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <section className="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-6">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0096FF] focus:border-transparent transition-all"
                  placeholder="name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0096FF] focus:border-transparent transition-all"
                  placeholder="surname"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0096FF] focus:border-transparent transition-all"
                  placeholder="+27 123 456 7890"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0096FF] focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </section>

          {/* Social Media Handles Section */}
          <section className="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-6">
              Social Media Handles (Optional)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Instagram */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Instagram
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">@</span>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0096FF] focus:border-transparent transition-all"
                    placeholder="yourhandle"
                  />
                </div>
              </div>

              {/* Twitter/X */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Twitter / X
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">@</span>
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0096FF] focus:border-transparent transition-all"
                    placeholder="yourhandle"
                  />
                </div>
              </div>

              {/* TikTok */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  TikTok
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">@</span>
                  <input
                    type="text"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0096FF] focus:border-transparent transition-all"
                    placeholder="yourhandle"
                  />
                </div>
              </div>

              {/* YouTube */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  YouTube
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">@</span>
                  <input
                    type="text"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0096FF] focus:border-transparent transition-all"
                    placeholder="yourhandle"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Audience Type Section */}
          <section className="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-6">
              Type of Audience *
            </h2>
            <p className="text-gray-600 mb-6">
              Select the audience you represent or have access to:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {AUDIENCE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleAudienceTypeChange(type)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.audienceType === type
                      ? "bg-[#0096FF] text-white border-[#0096FF]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#0096FF] hover:text-[#0096FF]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Custom audience input if "Other" is selected */}
            {formData.audienceType === "Other" && (
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Please specify your audience type
                </label>
                <input
                  type="text"
                  name="audienceType"
                  value={formData.audienceType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0096FF] focus:border-transparent transition-all"
                  placeholder="Describe your audience..."
                />
              </div>
            )}
          </section>

          {/* Additional Information Section */}
          <section className="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-6">
              Additional Information
            </h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tell us more about yourself and why you want to work with Izinto
                *
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0096FF] focus:border-transparent transition-all resize-none"
                placeholder="Share your experience, skills, ideas for collaboration, or anything else we should know..."
              />
            </div>
          </section>

          {/* Submit Section */}
          <div className="text-center">
            {submitStatus.message && (
              <div
                className={`mb-6 p-4 rounded-lg ${submitStatus.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
              >
                {submitStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-4 text-lg font-bold rounded-lg transition-all ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0096FF] hover:bg-[#007acc] text-white"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
      <LinkFooter />
    </div>
  );
}
