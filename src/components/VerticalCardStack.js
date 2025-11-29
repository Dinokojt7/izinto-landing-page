// src/components/ScrollSections.js
"use client";
import { useRef, useState, useEffect } from "react";

export default function VerticalCardStack({
  tagline,
  header,
  punchline,
  description,
}) {
  return (
    <>
      <div className="my-6 py-5 h-auto min-h-80 lg:h-110 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight italic text-black">
          {tagline}
        </h2>
        <h1 className="text-7xl sm:text-5xl lg:text-9xl font-extrabold tracking-tight italic text-black mt-12 lg:mt-20">
          {header}
        </h1>
        <h2 className="text-blue-600 mt-6 lg:mt-4 text-base font-bold">
          {punchline}
        </h2>
        <h2 className="text-gray-500 mt-4 text-sm font-semibold max-w-2xl">
          {description}
        </h2>
      </div>
    </>
  );
}