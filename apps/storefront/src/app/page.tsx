import { activeTheme } from "@/lib/theme";
import FashionPage from "@/themes/fashion/Page";
import ElectronicsPage from "@/themes/electronics/Page";
import GroceryPage from "@/themes/grocery/Page";

export default function Home() {
  // Theme Bridge Logic
  switch (activeTheme) {
    case 'electronics':
      return <ElectronicsPage />;
    case 'grocery':
      return <GroceryPage />;
    case 'fashion':
    default:
      return <FashionPage />;
  }
}
