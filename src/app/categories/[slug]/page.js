import Link from "next/link";
import { notFound } from "next/navigation";
import topics from "@/data/help-topics";
import Breadcrumb from "@/app/help/BreadCrumb";
import HelpCenterFooter from "@/app/help/HelpCenterFooter";
import HelpCenterHeader from "@/app/help/HelpCenterHeader";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const topic = topics[slug];

  if (!topic) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${topic.title} | Izinto`,
    description: `Get help on ${topic.title.toLowerCase()}.`,
  };
}

export async function generateStaticParams() {
  return Object.keys(topics).map((slug) => ({
    slug: slug,
  }));
}

export default async function TopicPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const topic = topics[slug];

  if (!topic) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Help Center", href: "/help" },
    { label: topic.title, href: null },
  ];

  return (
    <div className={`min-h-screen bg-white ${poppins.className}`}>
      <HelpCenterHeader />

      {/* Hero Section */}
      <section className="bg-[#0096FF] text-white h-[25vh] flex items-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-xl sm:text-2xl font-bold">HELP CENTER</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Topic Header - Image and Title inline */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="bg-[#0096FF] rounded-lg p-2 w-24 h-24 sm:w-32 sm:h-32 shrink-0">
              <img
                src={topic.img}
                alt={topic.title}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {topic.title}
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Last updated: {topic.lastUpdated}
              </p>
            </div>
          </div>

          {/* No Border Section */}
          <div className="border-t border-gray-200 pt-0">
            {/* Topic Sections List */}
            <div className="space-y-6">
              {topic.sections.map((section, index) => (
                <Link
                  key={index}
                  href={`/categories/${slug}/${encodeURIComponent(section.title)}`}
                  className="block p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {section.content}
                    </p>
                    <p className="text-gray-400 text-xs">{section.updatedAt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HelpCenterFooter />
    </div>
  );
}
