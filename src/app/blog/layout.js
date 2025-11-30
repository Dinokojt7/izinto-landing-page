// src/app/blog/layout.js
import LinkFooter from "@/app/policy/LinkFooter";
import BlogHeader from "./BlogHeader";

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen bg-white pb-20 sm:pb-0">
      {" "}
      {/* Added bottom padding for mobile nav */}
      <BlogHeader />
      <main>{children}</main>
      <LinkFooter />
    </div>
  );
}
