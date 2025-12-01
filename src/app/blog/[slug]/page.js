// src/app/blog/[slug]/page.js
import { notFound } from "next/navigation";
import blogPosts from "@/data/blog-posts.json";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export async function generateStaticParams() {
  return blogPosts.posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }) {
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
    <article
      className={`w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${poppins.className}`}
    >
      {/* Header */}
      <header className="text-center mb-8 sm:mb-12">
        <div className="mb-3 sm:mb-4">
          <span className="text-xs sm:text-sm font-semibold text-[#0096ff] uppercase tracking-wide">
            {post.category}
          </span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-xs sm:text-sm text-gray-500">
            {post.readTime}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold italic text-gray-900 mb-4 sm:mb-6 leading-tight sm:leading-normal">
          {post.title}
        </h1>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
          <span>By {post.author}</span>
          <span className="hidden sm:inline">•</span>
          <span>{formatDate(post.date)}</span>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-8 sm:mb-12 rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="h-48 sm:h-64 lg:h-80 xl:h-96 bg-linear-to-br from-blue-100 to-green-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm sm:text-base">
            Featured Image: {post.title}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8">
          {post.excerpt}
        </p>

        <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Key Takeaways
          </h2>
          <ul className="space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
            <li>• Important safety considerations for your home</li>
            <li>• Step-by-step maintenance guidelines</li>
            <li>• Professional tips and best practices</li>
            <li>• Common mistakes to avoid</li>
          </ul>
        </div>

        <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
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

          <p>
            Our team of experts has compiled these insights based on years of
            experience in home care services, ensuring you get practical,
            actionable advice that you can implement right away.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-blue-50 rounded-xl sm:rounded-2xl text-center">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
            Need Professional Help?
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
            Let Izinto handle your home care needs with our expert services
          </p>
          <button className="bg-[#0096ff] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-extrabold italic hover:bg-[#007acc] transition-colors transform">
            BOOK NOW
          </button>
        </div>
      </div>
    </article>
  );
}
