import { getActiveTheme } from '@/lib/theme';
import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';

export default async function QuotePage() {
  const { layout } = await getActiveTheme();
  try {
    const { default: Component } = await import(`@/themes/${layout}/QuotePage`);
    return <Component />;
  } catch {
    return <ThemeSubpageUnavailable layout={layout} pageName="Quote" />;
  }
}
