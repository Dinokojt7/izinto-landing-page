import HomeServicesComponent from "@/components/home/HomeServicesComponents";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function ServicesPage() {
  return (
    <div className={poppins.className}>
      <HomeServicesComponent />
    </div>
  );
}
