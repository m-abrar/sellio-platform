import { getActiveTheme } from '@/lib/theme';
import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { layout } = await getActiveTheme();
  const { slug } = await params;
  try {
    const { default: Component } = await import(`@/themes/${layout}/BlogPage`);
    return <Component slug={slug} />;
  } catch {
    return <ThemeSubpageUnavailable layout={layout} pageName="Blog Post" />;
  }
}
