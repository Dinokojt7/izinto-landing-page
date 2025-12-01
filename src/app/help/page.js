import Link from "next/link";
import HelpCenterHeader from "./HelpCenterHeader";
import HelpCenterFooter from "./HelpCenterFooter";

const topics = [
  {
    name: "Your Bookings",
    href: "/categories/your-bookings",
    img: "/images/bookings.png",
  },
  {
    name: "Feedback & Questions",
    href: "/categories/feedback-and-questions",
    img: "/images/questions.png",
  },
  {
    name: "Your Account",
    href: "/categories/your-account",
    img: "/images/account.png",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <HelpCenterHeader />

      {/* Hero Section */}
      <section className="bg-[#0096FF] text-white h-[25vh] flex items-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-xl sm:text-2xl font-bold">HELP CENTER</h1>
        </div>
      </section>

      {/* Contact Tiles Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 mx-auto items-center md:grid-cols-3 gap-12">
            {/* Help Center Items */}
            {topics.map((topic, index) => (
              <Link
                href={topic.href}
                key={index}
                className="flex-col items-center mx-auto text-center"
              >
                <div className="bg-[#0096FF] rounded-lg p-2 flex mb-4 w-40 h-40">
                  <img
                    src={topic.img}
                    alt={topic.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-bold capitalize text-gray-900">
                  {topic.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <HelpCenterFooter />
    </div>
  );
}
