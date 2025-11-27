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
      <div className="my-6 py-5 h-110 px-4">
        <h2 className="text-2xl font-extrabold tracking-tight italic text-black ">
          {tagline}
        </h2>
        <h1 className="text-9xl font-extrabold  tracking-tight italic text-black mt-20">
          {header}
        </h1>
        <h2 className=" text-blue-600 mt-4 text-base font-bold">{punchline}</h2>
        <h2 className=" text-gray-500 mt-4 text-sm font-semibold">
          {description}
        </h2>
      </div>
    </>
  );
}
