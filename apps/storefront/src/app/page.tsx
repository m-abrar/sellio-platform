import { getActiveTheme } from "@/lib/theme";
import FashionPage from "@/themes/ecommerce/fashion/Page";
import ElectronicsPage from "@/themes/ecommerce/electronics/Page";
import GroceryPage from "@/themes/ecommerce/grocery/Page";
import UnifiedDefaultPage from "@/themes/unified/default/Page";
import UnifiedModernPage from "@/themes/unified/modern/Page";
import UnifiedMinimalPage from "@/themes/unified/minimal/Page";

export default async function Home() {
  const { layout } = await getActiveTheme();

  switch (layout) {
    case 'ecommerce/electronics': return <ElectronicsPage />;
    case 'ecommerce/grocery': return <GroceryPage />;
    case 'ecommerce/fashion': return <FashionPage />;
    case 'unified/modern': return <UnifiedModernPage />;
    case 'unified/minimal': return <UnifiedMinimalPage />;
    case 'unified/default': 
    default: return <UnifiedDefaultPage />;
  }
}
