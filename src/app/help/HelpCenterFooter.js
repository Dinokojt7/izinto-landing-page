import Link from "next/link";
import HelpCenterSocialIcons from "./HelpCenterSocialIcons";

export default function HelpCenterFooter() {
  return (
    <footer className="bg-blue-100 py-12">
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

          {/* Column 2 - Terms */}
          <div className="flex flex-col mt-2 items-center md:items-start space-y-2">
            <Link
              href="/policy/terms-of-use"
              className="text-[#0096FF] transition-colors font-bold hover:opacity-80"
            >
              TERMS OF USE
            </Link>
          </div>

          {/* Column 3 - Privacy */}
          <div className="flex flex-col mt-2 items-center md:items-start space-y-2">
            <Link
              href="/policy/privacy-policy"
              className="text-[#0096FF] transition-colors font-bold hover:opacity-80"
            >
              PRIVACY POLICY
            </Link>
          </div>

          {/* Column 4 - FAQ */}
          <div className="flex flex-col mt-2 items-center md:items-start">
            <Link
              href="/faqs"
              className="text-[#0096FF] transition-colors font-bold hover:opacity-80"
            >
              FAQ
            </Link>
          </div>

          {/* Column 5 - Socials */}
          <div className="flex flex-col mt-2 items-center md:items-start">
            <HelpCenterSocialIcons />
          </div>
        </div>
      </div>
    </footer>
  );
}
