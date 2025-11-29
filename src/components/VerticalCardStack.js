// src/components/VerticalCardStack.js
"use client";
import { useRef, useState, useEffect } from "react";
import { Inter, Roboto } from "next/font/google";

const inter = Inter({ weight: ["400", "900"], subsets: ["latin"] });

const roboto = Roboto({
  weight: ["400", "900"],
  subsets: ["latin"],
});

export default function VerticalCardStack({
  tagline,
  header,
  punchline,
  description,
  image,
}) {
  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${inter.className}`}
    >
      <div className="bg-white rounded-3xl shadow-sm p-8 sm:p-12 lg:p-16 border border-gray-100">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight italic text-black">
          {tagline}
        </h2>
        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tight italic text-black mt-12 lg:mt-20">
          {header}
        </h1>
        <h2 className="text-[#0096FF] mt-6 lg:mt-4 text-base font-bold">
          {punchline}
        </h2>
        <h2 className="text-gray-500 mt-4 text-sm font-semibold max-w-2xl">
          {description}
        </h2>

        {/* Full-width image at the bottom - 1005x250 size */}
        <div className="mt-8 lg:mt-12 -mx-8 sm:-mx-12 lg:-mx-16 rounded-b-3xl overflow-hidden">
          <div
            className="w-full bg-gray-100 flex items-center justify-center"
            style={{ height: "250px" }}
          >
            {image ? (
              <img
                src={image}
                alt={header}
                className="w-full h-full object-cover"
                style={{
                  width: "1005px",
                  height: "250px",
                  maxWidth: "1005px",
                }}
              />
            ) : (
              <div
                className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center"
                style={{ width: "1005px", height: "250px" }}
              >
                <span className="text-gray-400 text-sm">{header} Image</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
