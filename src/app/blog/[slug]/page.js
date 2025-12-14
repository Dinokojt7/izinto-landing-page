// src/app/blog/[slug]/page.js
import { notFound } from "next/navigation";
import blogPosts from "@/data/blog-posts.json";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

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

const getRelatedArticles = (currentSlug, allPosts) => {
  if (!allPosts || allPosts.length <= 1) return [];

  const currentPost = allPosts.find((post) => post.slug === currentSlug);
  if (!currentPost) return [];

  // Get articles from same category, excluding current post
  const sameCategoryArticles = allPosts.filter(
    (post) =>
      post.slug !== currentSlug && post.category === currentPost.category,
  );

  // If we have at least 2 from same category, return them
  if (sameCategoryArticles.length >= 2) {
    return sameCategoryArticles.slice(0, 2);
  }

  // If not enough same-category articles, mix with other categories
  const otherArticles = allPosts.filter(
    (post) =>
      post.slug !== currentSlug && post.category !== currentPost.category,
  );

  // Return one from same category (if exists) + one from other category
  const result = [];
  if (sameCategoryArticles.length > 0) {
    result.push(sameCategoryArticles[0]);
    if (otherArticles.length > 0) {
      result.push(otherArticles[0]);
    } else {
      // Fallback: just get any other post
      const fallback = allPosts
        .filter((post) => post.slug !== currentSlug)
        .slice(0, 2 - result.length);
      result.push(...fallback);
    }
  } else {
    // No same category articles, get any 2 other posts
    return allPosts.filter((post) => post.slug !== currentSlug).slice(0, 2);
  }

  return result;
};

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

  // Function to parse and render HTML content
  const renderContent = (htmlContent) => {
    if (!htmlContent) return null;

    // Split content into sections and render with proper styling
    const sections = htmlContent.split(/<h2>/g);

    return (
      <>
        {sections.map((section, index) => {
          if (index === 0) {
            // First section (before first h2)
            return (
              <div
                key="intro"
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: section }}
              />
            );
          } else {
            // Sections with h2 headings
            const parts = section.split(/<\/h2>/);
            const heading = parts[0];
            const content = parts[1];

            return (
              <div key={index} className="mt-8 sm:mt-12">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {heading}
                </h2>
                <div
                  className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            );
          }
        })}
      </>
    );
  };

  const relatedArticles = getRelatedArticles(post.slug, blogPosts.posts);
  const keyTakeaways =
    post.keyTakeaways || extractKeyTakeaways(post.content, post.title);

  return (
    <article
      className={`w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 ${poppins.className}`}
    >
      {/* Header */}
      <header className="text-center mb-8 sm:mb-12 lg:mb-16">
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
      <div className="mb-8 sm:mb-12 lg:mb-16 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100">
        <div className="relative h-48 sm:h-64 lg:h-80 xl:h-96 w-full">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
            priority
          />
        </div>
      </div>

      {/* Excerpt */}
      <div className="mb-8 sm:mb-12">
        <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-l-4 border-[#0096ff]">
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed italic">
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-8 sm:mb-12">{renderContent(post.content)}</div>

      {/* Key Takeaways Box */}
      <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
          Key Takeaways
        </h2>
        <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
          {keyTakeaways.map((takeaway, index) => (
            <li key={index} className="flex items-start">
              <span className="text-[#0096ff] mr-2 mt-1">•</span>
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Call to Action */}
      <div className="mt-8 sm:mt-12 lg:mt-16 p-4 sm:p-6 lg:p-8 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl text-center border border-blue-200">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
          Need Professional Help?
        </h3>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto">
          Discover Izinto - your all-in-one solution for home care, laundry, gas
          refills, mobile car wash, and pet care services.
        </p>
        <Link
          href="/services"
          className="inline-block bg-[#0096ff] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-extrabold italic hover:bg-[#007acc] transition-all transform shadow-md hover:shadow-lg"
        >
          EXPLORE ALL SERVICES
        </Link>
        <p className="text-xs sm:text-sm text-gray-500 mt-4">
          Laundry • Gas Refill • Mobile Car Wash • Pet Care • Home Maintenance
        </p>
      </div>

      {/* Related Articles Section */}
      <div className="mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-12 border-t border-gray-200">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
          Related Articles
        </h3>

        {relatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {relatedArticles.map((article) => (
              <a
                key={article.id}
                href={`/blog/${article.slug}`}
                className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:bg-gray-100 transition-colors cursor-pointer block"
              >
                <span className="text-xs sm:text-sm font-semibold text-[#0096ff] uppercase tracking-wide">
                  {article.category}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mt-2 mb-2 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="mt-3 flex items-center text-xs text-gray-500">
                  <span>{article.readTime}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(article.date)}</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          // Fallback if no related articles exist yet
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {blogPosts.posts
              .filter((p) => p.slug !== post.slug)
              .slice(0, 2)
              .map((fallbackArticle) => (
                <a
                  key={fallbackArticle.id}
                  href={`/blog/${fallbackArticle.slug}`}
                  className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:bg-gray-100 transition-colors cursor-pointer block"
                >
                  <span className="text-xs sm:text-sm font-semibold text-[#0096ff] uppercase tracking-wide">
                    {fallbackArticle.category}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mt-2 mb-2 line-clamp-2">
                    {fallbackArticle.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">
                    {fallbackArticle.excerpt}
                  </p>
                  <div className="mt-3 flex items-center text-xs text-gray-500">
                    <span>{fallbackArticle.readTime}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(fallbackArticle.date)}</span>
                  </div>
                </a>
              ))}
          </div>
        )}

        {/* View All Articles Link */}
        <div className="mt-8 text-center">
          <a
            href="/blog"
            className="inline-flex items-center text-[#0096ff] font-semibold hover:text-blue-700 transition-colors cursor-pointer"
          >
            View all articles
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
          </a>
        </div>
      </div>
    </article>
  );
}
