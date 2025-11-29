// src/components/blog/BlogPostCard.js
import Link from "next/link";

export default function BlogPostCard({ post }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
        {/* Image */}
        <div className="h-48 bg-gray-200 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Featured Image</span>
          </div>
          {/* In production, use: <img src={post.image} alt={post.title} className="w-full h-full object-cover" /> */}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category and Read Time */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-[#0096ff] uppercase tracking-wide">
              {post.category}
            </span>
            <span className="text-xs text-gray-500">{post.readTime}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0096ff] transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Author and Date */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>By {post.author}</span>
            <span>{formatDate(post.date)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
