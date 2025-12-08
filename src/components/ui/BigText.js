import { COLORS } from "@/lib/utils/constants";
import { Inter, Poppins, Roboto } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({ weight: ["400", "900"], subsets: ["latin"] });

const roboto = Roboto({
  weight: ["400", "900"],
  subsets: ["latin"],
});

export default function BigText() {
  return (
    <>
      {/* Big Text Section */}
      <section
        className={`max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center ${poppins.className}`}
      >
        <div className="space-y-2">
          <h2
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black italic"
            style={{ color: COLORS.blue }}
          >
            ESSENTIAL SERVICES.
          </h2>
          <h3 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black italic text-primary">
            AS FAST AS
          </h3>
          <h2
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black italic"
            style={{ color: COLORS.blue }}
          >
            45 MINUTES.
          </h2>
        </div>
      </section>
    </>
  );
}
