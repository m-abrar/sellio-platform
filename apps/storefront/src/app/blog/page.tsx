import { getActiveTheme } from '@/lib/theme';
import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';

export default async function BlogPage() {
  const { layout } = await getActiveTheme();
  try {
    const { default: Component } = await import(`@/themes/${layout}/BlogPage`);
    return <Component />;
  } catch {
    return <ThemeSubpageUnavailable layout={layout} pageName="Blog / Insights" />;
  }
}
