import Link from "next/link";
import { notFound } from "next/navigation";
import topics from "@/data/help-topics";

const socialIcons = [
  {
    name: "instagram",
    svg: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z" />
      </svg>
    ),
    url: "https://instagram.com/brandclique",
  },
  {
    name: "x",
    svg: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18.9 2H22l-8.2 9.1L23 22h-5.6l-5.8-7.6L6 22H2l8.6-9.5L2 2h5.8l5.3 7.1L18.9 2zm-1.4 17.3h2.3L7.3 4.2H4.8l12.7 15.1z" />
      </svg>
    ),
    url: "https://x.com/brandclique",
  },
  {
    name: "tiktok",
    svg: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.6 5.82s.03.46.13.9c.12.4.32.77.6 1.08.28.3.63.53 1.02.66.42.15.86.18 1.3.12.02 0 .04.01.06.01v2.79a4.3 4.3 0 01-2.27-.63 4.44 4.44 0 01-1.62-1.66v6.45a6.45 6.45 0 11-6.45-6.45h.03v2.21a4.22 4.22 0 103.74 4.15l.03-10.84h2.2a4.9 4.9 0 002.13 3.62v-2.4z" />
      </svg>
    ),
    url: "https://tiktok.com/@brandclique",
  },
  {
    name: "youtube",
    svg: (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <path d="M23.498 6.186a2.986 2.986 0 0 0-2.103-2.103C19.479 3.5 12 3.5 12 3.5s-7.479 0-9.395.583a2.986 2.986 0 0 0-2.103 2.103C0.919 8.102 0.919 12 0.919 12s0 3.898.583 5.814a2.986 2.986 0 0 0 2.103 2.103C4.521 20.5 12 20.5 12 20.5s7.479 0 9.395-.583a2.986 2.986 0 0 0 2.103-2.103C24.081 15.898 24.081 12 24.081 12s0-3.898-.583-5.814zM9.75 15.5v-7l6 3.5-6 3.5z" />
      </svg>
    ),
    url: "https://youtube.com/@brandclique",
  },
];

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="bg-white border-b border-blue-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/images/try-retro.png"
                alt="Izinto"
                className="h-8 w-auto"
              />
            </div>

            {/* Back to Main Site Button */}
            <Link
              href="/"
              className="flex items-center space-x-2 text-[#0096FF] font-bold text-xs sm:text-sm uppercase transition-colors"
            >
              <span className="hidden sm:inline">BACK TO MAIN SITE</span>
              <span className="sm:hidden">BACK</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#0096FF] text-white h-[25vh] flex items-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-xl sm:text-2xl font-bold">HELP CENTER</h1>
        </div>
      </section>

      {/* Contact Tiles Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className=" mx-auto items-start">
            {/* Help Center Items */}
            <div className="flex-col items-center mx-auto text-center">
              <div className="bg-[#0096FF] rounded-lg p-2 flex mb-4 w-36 h-36">
                <img
                  src={topic.img}
                  alt={topic.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-4xl font-bold text-black">{topic.title}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-100  py-12">
        <div className="max-w-7xl mx-auto px-4 text-sm sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Column 1 - Logo */}
            <div className="flex flex-col items-center md:items-start">
              <img
                src="/images/try-retro.png"
                alt="Izinto"
                className="h-8 w-auto mb-4"
              />
            </div>

            {/* Column 2 - Terms  */}
            <div className="flex flex-col mt-2 items-center md:items-start space-y-2">
              <Link
                href="/topic/terms-of-use"
                className="text-[#0096FF] transition-colors font-bold"
              >
                TERMS OF USE
              </Link>
            </div>

            {/* Column 3 -  Privacy */}
            <div className="flex flex-col mt-2 items-center md:items-start space-y-2">
              <Link
                href="/topic/privacy-topic"
                className="text-[#0096FF] transition-colors font-bold"
              >
                PRIVACY topic
              </Link>
            </div>

            {/* Column 3 - FAQ */}
            <div className="flex flex-col mt-2 items-center md:items-start">
              <Link
                href="/faqs"
                className="text-[#0096FF] transition-colors font-bold"
              >
                FAQ
              </Link>
            </div>

            {/* Column 4 - Socials */}
            <div className="flex flex-col mt-2 items-center md:items-start">
              <div className="flex space-x-4">
                {socialIcons.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0096FF] transition-colors"
                  >
                    {social.svg}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
