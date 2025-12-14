// src/components/blog/BlogPostCard.js
import Link from "next/link";
import Image from "next/image";

export default function BlogPostCard({ post }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Default image if none provided
  const imageSrc = post.image || "/images/blog/placeholder.jpg";

  return (
    <div className="group">
      <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="h-48 relative overflow-hidden bg-gray-100">
          <Image
            src={imageSrc}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          />
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="text-xs font-semibold bg-white/90 text-[#0096ff] uppercase tracking-wide px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0096ff] transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          {/* Author, Date and Read Time */}
          <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
            <div>
              <span className="font-medium">By {post.author}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime}</span>
            </div>
            <span>{formatDate(post.date)}</span>
          </div>

          {/* Read More Link */}
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-[#0096ff] font-semibold text-sm hover:text-blue-700 transition-colors"
          >
            Read article
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </article>
    </div>
  );
}
