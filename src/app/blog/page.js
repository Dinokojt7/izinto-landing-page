// src/app/blog/page.js
import blogPosts from "@/data/blog-posts.json";
import BlogPostCard from "./BlogPostCard";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function BlogPage() {
  // Get featured posts (first 3 for featured section)
  const featuredPosts = blogPosts.posts.slice(0, 3);
  const remainingPosts = blogPosts.posts.slice(3);

  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${poppins.className}`}
    >
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold italic text-gray-900 mb-4">
          Home Care Insights & Tips
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Expert advice on home maintenance, safety, and efficient living from
          the Izinto team
        </p>

        {/* Action Button */}
        <Link
          href="/services"
          className="inline-block bg-[#0096ff] text-white px-8 py-4 rounded-full text-lg font-extrabold italic hover:bg-[#007acc] transition-all transform shadow-lg hover:shadow-xl"
        >
          BOOK SERVICES NOW
        </Link>
      </div>

      {/* Featured Section */}
      {featuredPosts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* All Blog Posts */}
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">All Articles</h2>
          <Link
            href="/services"
            className="text-[#0096ff] font-semibold hover:text-blue-700 transition-colors"
          >
            Need services? Book now →
          </Link>
        </div>

        {remainingPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-600 text-lg">More articles coming soon!</p>
          </div>
        )}
      </div>

      {/* Call to Action Section */}
      <div className="mt-16 p-8 bg-linear-to-r from-blue-50 to-blue-100 rounded-2xl text-center">
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          Ready to Experience Izinto Services?
        </h3>
        <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
          Don't just read about home care - let us handle it for you! Book our
          professional services today.
        </p>
        <Link
          href="/services"
          className="inline-block bg-[#0096ff] text-white px-10 py-4 rounded-full text-lg font-extrabold italic hover:bg-[#007acc] transition-all transform shadow-lg hover:shadow-xl"
        >
          EXPLORE OUR SERVICES
        </Link>
      </div>
    </div>
  );
}
