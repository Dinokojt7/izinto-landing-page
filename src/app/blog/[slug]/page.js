// src/app/blog/[slug]/page.js
import { notFound } from "next/navigation";
import blogPosts from "@/data/blog-posts.json";

export async function generateStaticParams() {
  return blogPosts.posts.map((post) => ({
    slug: post.slug,
  }));
}

// Add proper async handling for params
export default async function BlogPost({ params }) {
  // Properly await the params
  const { slug } = await params;
  const post = blogPosts.posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="mb-4">
          <span className="text-sm font-semibold text-[#0096ff] uppercase tracking-wide">
            {post.category}
          </span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-sm text-gray-500">{post.readTime}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold italic text-gray-900 mb-6">
          {post.title}
        </h1>

        <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
          <span>By {post.author}</span>
          <span>•</span>
          <span>{formatDate(post.date)}</span>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-12 rounded-2xl overflow-hidden">
        <div className="h-64 sm:h-96 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
          <span className="text-gray-400">Featured Image: {post.title}</span>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          {post.excerpt}
        </p>

        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Key Takeaways
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Important safety considerations for your home</li>
            <li>• Step-by-step maintenance guidelines</li>
            <li>• Professional tips and best practices</li>
            <li>• Common mistakes to avoid</li>
          </ul>
        </div>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            This comprehensive guide provides detailed instructions and expert
            advice to help you maintain your home efficiently and safely.
            Whether you're dealing with household appliances, plants, or safety
            equipment, proper care ensures longevity and optimal performance.
          </p>

          <p>
            Remember that regular maintenance not only extends the life of your
            home essentials but also contributes to a safer and more comfortable
            living environment for you and your family.
          </p>
        </div>
      </div>
    </article>
  );
}
