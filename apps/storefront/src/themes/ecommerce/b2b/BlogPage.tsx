'use client';

import { useState } from 'react';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

const POSTS: BlogPost[] = [
  {
    slug: 'specifying-tight-tolerances-guide',
    category: 'Engineering',
    title: 'How to specify tight tolerances without over-constraining your design',
    excerpt: 'Unnecessarily tight tolerances inflate cost and lead time without improving part performance. Our applications engineers explain how to specify what actually matters — and where looser tolerance is the right choice.',
    author: 'David Kirchner',
    date: '2026-05-28',
    readTime: '8 min read',
    featured: true,
  },
  {
    slug: 'material-selection-aerospace',
    category: 'Materials',
    title: 'Titanium vs aluminium alloy: choosing the right material for aerospace brackets',
    excerpt: 'Both materials appear in aerospace structural applications, but their weight, strength, machinability, and cost profiles differ significantly. Here is how we advise clients to choose between them.',
    author: 'Priya Nair',
    date: '2026-05-14',
    readTime: '7 min read',
  },
  {
    slug: 'iso-9001-what-it-means-for-buyers',
    category: 'Quality',
    title: 'What ISO 9001 certification actually means for buyers',
    excerpt: 'The certificate is common. Understanding what it guarantees — and what it does not — changes how you should evaluate a manufacturer. A plain-language breakdown for engineering buyers.',
    author: 'Sandra Mayer',
    date: '2026-04-30',
    readTime: '5 min read',
  },
  {
    slug: 'reading-technical-drawings-checklist',
    category: 'Engineering',
    title: 'The 10-point checklist we use to review customer drawings before quoting',
    excerpt: 'Incomplete or ambiguous drawings cause delays and inaccurate quotes. This is the checklist our estimating team runs through every time — share it with your engineering team to get better responses faster.',
    author: 'James Ofosu',
    date: '2026-04-15',
    readTime: '6 min read',
  },
  {
    slug: 'surface-finish-standards-explained',
    category: 'Materials',
    title: 'Ra, Rz, Rmax: surface finish standards explained for non-specialists',
    excerpt: 'Surface roughness parameters appear on nearly every technical drawing, yet many buyers are unsure what they mean for function or manufacturability. We clear up the confusion.',
    author: 'David Kirchner',
    date: '2026-03-22',
    readTime: '9 min read',
  },
  {
    slug: 'first-article-inspection-guide',
    category: 'Quality',
    title: 'First Article Inspection (FAI): when to require it and what to expect',
    excerpt: 'FAI is a critical quality gate before series production — but it adds lead time and cost. Our quality team explains when it is essential, when it is optional, and what the report should contain.',
    author: 'Priya Nair',
    date: '2026-03-08',
    readTime: '7 min read',
  },
];

const CATEGORIES = ['All', 'Engineering', 'Materials', 'Quality', 'Industry Insights'];

export default function BlogPage() {
  const themeLink = useEcommerceThemeLink();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = POSTS.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured || activeCategory !== 'All' || search);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="b2b-static-page">
      <section className="b2b-static-hero">
        <span className="b2b-kicker">Insights</span>
        <h1>Engineering knowledge for industrial buyers.</h1>
        <p>Practical guides on materials, tolerances, quality standards, and manufacturing processes — written by our technical team for the engineers and buyers we work with.</p>
      </section>

      {/* Search + categories */}
      <div className="b2b-blog-controls">
        <input
          type="text"
          className="b2b-blog-search"
          placeholder="Search articles…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search articles"
        />
        <div className="b2b-blog-categories" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              className={`b2b-blog-cat-btn${activeCategory === cat ? ' b2b-blog-cat-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="b2b-state" role="status" style={{ marginTop: '2rem' }}>
          <h3>No articles match your search.</h3>
          <p>Try a different category or clear the search field.</p>
        </div>
      ) : (
        <div className="b2b-blog-layout">
          {/* Featured post */}
          {featured && activeCategory === 'All' && !search && (
            <a href={themeLink(`/blog/${featured.slug}`)} className="b2b-blog-featured">
              <div className="b2b-blog-featured-meta">
                <span className="b2b-blog-category">{featured.category}</span>
                <span className="b2b-blog-read-time">{featured.readTime}</span>
              </div>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <div className="b2b-blog-author">
                <span className="b2b-blog-author-avatar">{featured.author.split(' ').map((n) => n[0]).join('')}</span>
                <span>{featured.author}</span>
                <span className="b2b-topbar-sep" aria-hidden="true">·</span>
                <span>{formatDate(featured.date)}</span>
              </div>
            </a>
          )}

          {/* Post grid */}
          <div className="b2b-blog-grid">
            {rest.map((post) => (
              <a key={post.slug} href={themeLink(`/blog/${post.slug}`)} className="b2b-blog-card">
                <div className="b2b-blog-card-meta">
                  <span className="b2b-blog-category">{post.category}</span>
                  <span className="b2b-blog-read-time">{post.readTime}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="b2b-blog-author">
                  <span className="b2b-blog-author-avatar">{post.author.split(' ').map((n) => n[0]).join('')}</span>
                  <span>{post.author}</span>
                  <span className="b2b-topbar-sep" aria-hidden="true">·</span>
                  <span>{formatDate(post.date)}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
