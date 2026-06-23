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
    title: '316L, 420, and 410 stainless steel in orthopedic instruments',
    excerpt: 'A practical guide to common surgical stainless-steel grades, where each one fits, and what buyers should confirm before approving an RFQ.',
    author: 'Nadia Farooq',
    date: '2026-05-28',
    readTime: '7 min read',
    featured: true,
  },
  {
    slug: 'orthopedic-set-rfq-checklist',
    category: 'RFQ Guides',
    title: 'The export RFQ checklist for orthopedic instrument sets',
    excerpt: 'Item codes, quantities, finish, marking, tray layout, destination port, certificates, and packing details that help suppliers quote accurately.',
    author: 'Sameer Malik',
    date: '2026-05-14',
    readTime: '6 min read',
  },
  {
    slug: 'passivation-and-finish-basics',
    category: 'Quality',
    title: 'Passivation, polishing, and finish checks buyers should understand',
    excerpt: 'Reusable surgical instruments need more than a good shape. This article explains finish expectations, passivation basics, and incoming inspection points.',
    author: 'Dr. Helena Ward',
    date: '2026-04-30',
    readTime: '8 min read',
  },
  {
    slug: 'private-label-orthopedic-instruments',
    category: 'OEM',
    title: 'Private-label orthopedic instruments: what to decide before production',
    excerpt: 'Logo marking, catalog codes, pouch labels, tray layouts, artwork files, and sample approval steps for distributors building their own instrument line.',
    author: 'Nadia Farooq',
    date: '2026-04-15',
    readTime: '5 min read',
  },
  {
    slug: 'export-documents-medical-instruments',
    category: 'Export',
    title: 'Common export documents for surgical instrument shipments',
    excerpt: 'Commercial invoices, packing lists, material certificates, inspection reports, and the paperwork importers usually request before shipment release.',
    author: 'Sameer Malik',
    date: '2026-03-22',
    readTime: '6 min read',
  },
  {
    slug: 'supplier-audit-questions',
    category: 'Quality',
    title: 'Questions to ask before qualifying an orthopedic instrument supplier',
    excerpt: 'A short supplier audit guide for buyers comparing factories, not trading companies: process control, traceability, finishing, packing, and documentation.',
    author: 'Dr. Helena Ward',
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
        <h1>Orthopedic instrument sourcing guides.</h1>
        <p>Practical notes on stainless steel, RFQs, finishing, private label, export documents, and supplier qualification for medical buyers.</p>
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
