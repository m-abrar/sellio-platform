import { getActiveTheme } from '@/lib/theme';
import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';

export default async function AboutPage() {
  const { layout } = await getActiveTheme();
  try {
    const { default: Component } = await import(`@/themes/${layout}/AboutPage`);
    return <Component />;
  } catch {
    return <ThemeSubpageUnavailable layout={layout} pageName="About Us" />;
  }
}
