// src/app/blog/page.js
import blogPosts from "@/data/blog-posts.json";
import BlogPostCard from "./BlogPostCard";

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold italic text-gray-900 mb-4">
          Home Care Insights & Tips
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Expert advice on home maintenance, safety, and efficient living from
          the Izinto team
        </p>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
