import { getActiveTheme } from '@/lib/theme';
import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';

export default async function FaqPage() {
  const { layout } = await getActiveTheme();
  try {
    const { default: Component } = await import(`@/themes/${layout}/FaqPage`);
    return <Component />;
  } catch {
    return <ThemeSubpageUnavailable layout={layout} pageName="FAQ" />;
  }
}
