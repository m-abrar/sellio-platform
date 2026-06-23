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
    slug: 'orthopedic-instrument-steel-grades',
    category: 'Materials',
    title: 'Which stainless steel grade for surgical instruments — and why it matters',
    excerpt: '316L, 420, and 410 are not interchangeable. Understanding the differences will help you avoid specification errors before production starts.',
    author: 'Aadab International',
    date: '2026-05-28',
    readTime: '7 min read',
    featured: true,
  },
  {
    slug: 'orthopedic-set-rfq-checklist',
    category: 'RFQ Guides',
    title: 'What to include in your first instrument enquiry',
    excerpt: 'A complete enquiry — item names, quantities, steel grade, finish, tray layout, destination, documents — gets a faster and more accurate quote. Here is what we need.',
    author: 'Aadab International',
    date: '2026-05-14',
    readTime: '5 min read',
  },
  {
    slug: 'passivation-and-finish-basics',
    category: 'Quality',
    title: 'Surface finish on reusable surgical instruments: what to check on arrival',
    excerpt: 'Satin, mirror, sandblast — each finish has a purpose and an expected standard. These are the incoming inspection points your team should know.',
    author: 'Aadab International',
    date: '2026-04-30',
    readTime: '8 min read',
  },
  {
    slug: 'private-label-orthopedic-instruments',
    category: 'OEM',
    title: 'Building a private-label surgical instrument line: the decisions that matter',
    excerpt: 'Logo engraving, catalog codes, tray layout, artwork files, sample approval, and lead times — the choices you need to make before the first unit is produced.',
    author: 'Aadab International',
    date: '2026-04-15',
    readTime: '5 min read',
  },
  {
    slug: 'export-documents-medical-instruments',
    category: 'Export',
    title: 'Export paperwork for surgical instrument shipments: a practical overview',
    excerpt: 'Commercial invoice, packing list, material certificate, inspection report — what each document covers, when it is required, and how to request it before shipment.',
    author: 'Aadab International',
    date: '2026-03-22',
    readTime: '6 min read',
  },
  {
    slug: 'supplier-audit-questions',
    category: 'Quality',
    title: 'How to tell a manufacturer from a trading company — and why it affects your price',
    excerpt: 'The questions that separate a factory from a middleman: process control, in-house finishing, packing capability, and who actually signs the material certificate.',
    author: 'Aadab International',
    date: '2026-03-08',
    readTime: '7 min read',
  },
];

const CATEGORIES = ['All', 'RFQ Guides', 'Materials', 'Quality', 'OEM', 'Export'];

export default function BlogPage() {
  const themeLink = useEcommerceThemeLink();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = POSTS.filter((post) => {
    const matchesCat = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = filtered.find((post) => post.featured);
  const rest = filtered.filter((post) => !post.featured || activeCategory !== 'All' || search);
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="b2b-static-page">
      <section className="b2b-static-hero">
        <span className="b2b-kicker">Resources</span>
        <h1>Notes from eighty years on the factory floor.</h1>
        <p>Practical articles on steel grades, finishing standards, export documentation, RFQ best practice, and what separates a good supplier from a convenient one.</p>
      </section>

      <div className="b2b-blog-controls">
        <input
          type="text"
          className="b2b-blog-search"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search articles"
        />
        <div className="b2b-blog-categories" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              className={`b2b-blog-cat-btn${activeCategory === category ? ' b2b-blog-cat-active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
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
          {featured && activeCategory === 'All' && !search && (
            <a href={themeLink(`/blog/${featured.slug}`)} className="b2b-blog-featured">
              <div className="b2b-blog-featured-meta">
                <span className="b2b-blog-category">{featured.category}</span>
                <span className="b2b-blog-read-time">{featured.readTime}</span>
              </div>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <div className="b2b-blog-author">
                <span className="b2b-blog-author-avatar">{featured.author.split(' ').map((name) => name[0]).join('')}</span>
                <span>{featured.author}</span>
                <span className="b2b-topbar-sep" aria-hidden="true">|</span>
                <span>{formatDate(featured.date)}</span>
              </div>
            </a>
          )}

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
                  <span className="b2b-blog-author-avatar">{post.author.split(' ').map((name) => name[0]).join('')}</span>
                  <span>{post.author}</span>
                  <span className="b2b-topbar-sep" aria-hidden="true">|</span>
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
