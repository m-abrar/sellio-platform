import { getActiveTheme } from '@/lib/theme';
import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';

export default async function ContactPage() {
  const { layout } = await getActiveTheme();
  try {
    const { default: Component } = await import(`@/themes/${layout}/ContactPage`);
    return <Component />;
  } catch {
    return <ThemeSubpageUnavailable layout={layout} pageName="Contact" />;
  }
}
