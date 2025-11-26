import { COLORS } from "@/lib/utils/constants";

export default function BigText() {
  return (
    <>
      {/* Big Text Section */}
      <section className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-2">
          <h2
            className="text-6xl md:text-7xl font-extrabold italic"
            style={{ color: COLORS.blue }}
          >
            ESSENTIAL SERVICES.
          </h2>
          <h3 className="text-6xl md:text-7xl font-extrabold italic text-primary">
            AS FAST AS
          </h3>
          <h2
            className="text-6xl md:text-7xl font-extrabold italic"
            style={{ color: COLORS.blue }}
          >
            45 MINUTES.
          </h2>
        </div>
      </section>
    </>
  );
}
