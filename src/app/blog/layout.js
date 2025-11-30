// src/app/blog/layout.js
import LinkFooter from "@/app/policy/LinkFooter";
import BlogHeader from "./BlogHeader";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen bg-white pb-20 sm:pb-0">
      <ClientLayoutWrapper>
        <BlogHeader />
        <main>{children}</main>
        <LinkFooter />
      </ClientLayoutWrapper>
    </div>
  );
}
