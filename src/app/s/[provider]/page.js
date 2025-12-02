import { Poppins } from "next/font/google";
import ProviderCategoryPage from "../ProviderCategoryPage";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function CategoryPage() {
  return (
    <div className={poppins.className}>
      <ProviderCategoryPage />
    </div>
  );
}
