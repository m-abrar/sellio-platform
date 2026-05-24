'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

export const SilentHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Post Listing Modal States
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    function updateCount() {
      try {
        const cartStr = localStorage.getItem('sellio_cart') || '[]';
        const cart = JSON.parse(cartStr);
        const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      } catch (err) {
        console.error('Failed to parse cart badge:', err);
      }
    }
    updateCount();
    window.addEventListener('cartUpdated', updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener('cartUpdated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowModal(false);
        // Clear form fields
        setTitle('');
        setPrice('');
        setCategory('');
        setDescription('');
        setImageUrl('');
      }, 1500);
    }, 1500);
  };

  const handleOpenModal = () => {
    setIsOpen(false);
    setShowModal(true);
  };

  return (
    <header className="usm-header">
      <a href="/preview/unifieds_minimal" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="usm-logo" style={{ textTransform: 'none', letterSpacing: 'normal', fontSize: '1.4rem', fontWeight: 700 }}>
          Universal<span style={{ color: 'var(--usm-primary)' }}>.</span>
        </div>
      </a>
      
      <button 
          className={`usm-hamburger ${isOpen ? 'usm-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="usm-hamburger-toggle"
      >
          <span className="usm-hamburger-bar"></span>
          <span className="usm-hamburger-bar"></span>
          <span className="usm-hamburger-bar"></span>
      </button>

      <nav className={`usm-nav ${isOpen ? 'usm-nav-open' : ''}`}>
          <MenuNav
            location="main_header"
            flat
            linkClassName="usm-nav-link"
            onNavigate={() => setIsOpen(false)}
            renderItem={(item, { href, className, onNavigate }) => (
              <a
                href={href}
                className={className}
                style={{
                  textTransform: 'none',
                  letterSpacing: '0.02em',
                  fontSize: '0.9rem',
                  fontWeight: 400,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
                onClick={onNavigate}
              >
                {item.title}
                {item.title === 'Cart' && cartCount > 0 && (
                  <span
                    style={{
                      background: 'var(--usm-primary)',
                      color: '#fff',
                      borderRadius: '10px',
                      padding: '0.1rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                    id="usm-header-cart-badge"
                  >
                    {cartCount}
                  </span>
                )}
              </a>
            )}
          />
          <MenuNav
            location="utility_header"
            flat
            renderItem={(item, { className, onNavigate }) => (
              <button
                type="button"
                className="usm-btn-primary usm-mobile-btn"
                style={{ padding: '0.85rem 2rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%' }}
                onClick={() => {
                  onNavigate?.();
                  handleOpenModal();
                }}
              >
                {item.title}
              </button>
            )}
          />
      </nav>

      <MenuNav
        location="utility_header"
        flat
        renderItem={(item, { onNavigate }) => (
          <button
            type="button"
            className="usm-btn-primary usm-desktop-btn"
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem', borderRadius: '4px' }}
            onClick={() => {
              onNavigate?.();
              handleOpenModal();
            }}
            id="usm-btn-header-access"
          >
            {item.title}
          </button>
        )}
      />

      {/* Glassmorphic Post Listing Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          background: 'rgba(17, 17, 17, 0.4)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--usm-border)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '3rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            position: 'relative',
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#888',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close modal"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {success ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 0' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <svg fill="none" stroke="var(--usm-primary)" strokeWidth="1.5" viewBox="0 0 24 24" width="72" height="72" style={{ margin: '0 auto' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'var(--usm-font-heading)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--usm-ink)', marginBottom: '0.5rem' }}>Listing Published</h3>
                <p style={{ color: '#666', fontWeight: 300, fontSize: '0.95rem' }}>Your item was successfully added to the catalog registry.</p>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <span className="usm-mono" style={{ color: 'var(--usm-primary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>SELLER CONSOLE</span>
                  <h2 style={{ fontFamily: 'var(--usm-font-heading)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--usm-ink)', margin: 0 }}>Create a Listing</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#111' }}>Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Standing Walnut Desk" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      padding: '0.85rem 1.2rem',
                      border: '1px solid var(--usm-border)',
                      borderRadius: '8px',
                      fontFamily: 'var(--usm-font-body)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      backgroundColor: 'var(--usm-ghost)'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#111' }}>Category</label>
                    <select 
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{
                        padding: '0.85rem 1.2rem',
                        border: '1px solid var(--usm-border)',
                        borderRadius: '8px',
                        fontFamily: 'var(--usm-font-body)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        backgroundColor: 'var(--usm-ghost)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">Select category...</option>
                      <option value="properties">Properties</option>
                      <option value="autos">Vehicles</option>
                      <option value="products">Products</option>
                      <option value="services">Services</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#111' }}>Price ($)</label>
                    <input 
                      type="number" 
                      required 
                      placeholder="e.g. 1450" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      style={{
                        padding: '0.85rem 1.2rem',
                        border: '1px solid var(--usm-border)',
                        borderRadius: '8px',
                        fontFamily: 'var(--usm-font-body)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        backgroundColor: 'var(--usm-ghost)'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#111' }}>Image URL</label>
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/... (optional)" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{
                      padding: '0.85rem 1.2rem',
                      border: '1px solid var(--usm-border)',
                      borderRadius: '8px',
                      fontFamily: 'var(--usm-font-body)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      backgroundColor: 'var(--usm-ghost)'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#111' }}>Description</label>
                  <textarea 
                    rows={3} 
                    required
                    placeholder="Describe the item's specifications and premium details..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      padding: '0.85rem 1.2rem',
                      border: '1px solid var(--usm-border)',
                      borderRadius: '8px',
                      fontFamily: 'var(--usm-font-body)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      backgroundColor: 'var(--usm-ghost)',
                      resize: 'none'
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="silent-btn-primary" 
                  style={{ width: '100%', padding: '1rem', fontSize: '0.85rem', letterSpacing: '2px', fontWeight: 600, marginTop: '0.5rem' }}
                >
                  {submitting ? 'PUBLISHING...' : 'PUBLISH LISTING'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export const ZenFooter = () => (
    <footer className="usm-zen-footer" style={{ borderTop: '1px solid var(--usm-border)' }}>
        <div className="usm-footer-grid">
            <div>
                <div className="usm-logo" style={{ color: 'black', textTransform: 'none', letterSpacing: 'normal', fontSize: '1.4rem', fontWeight: 700, marginBottom: '2rem' }}>
                  Universal<span style={{ color: 'var(--usm-primary)' }}>.</span>
                </div>
                <p style={{ opacity: 0.6, lineHeight: 1.8, fontSize: '0.9rem', maxWidth: '300px', fontWeight: 300 }}>
                    The luxury standard in marketplace design. Simple, precise, elegant and timeless.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div style={{ color: 'black', marginBottom: '2rem', fontSize: '0.95rem', fontWeight: 600 }}>{title}</div>}
                listClassName="usm-footer-link-group"
                linkClassName="usm-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div style={{ color: 'black', marginBottom: '2rem', fontSize: '0.95rem', fontWeight: 600 }}>{title}</div>}
                listClassName="usm-footer-link-group"
                linkClassName="usm-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div style={{ color: 'black', marginBottom: '2rem', fontSize: '0.95rem', fontWeight: 600 }}>{title}</div>}
                listClassName="usm-footer-link-group"
                linkClassName="usm-footer-link"
            />
        </div>
        <div className="usm-footer-bottom" style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid var(--usm-border)' }}>
            <div style={{ opacity: 0.6, fontSize: '0.85rem', fontWeight: 300 }}>© 2026 Universal Marketplace. All rights reserved.</div>
            <div className="usm-footer-socials" style={{ display: 'flex', gap: '2rem' }}>
                <MenuNav
                    location="social_footer"
                    flat
                    renderItem={(item, { href, className, onNavigate }) => (
                        <span style={{ opacity: 0.6, fontSize: '0.85rem', cursor: 'pointer', fontWeight: 300 }}>
                            <a href={href} className={className} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                        </span>
                    )}
                />
            </div>
        </div>
    </footer>
);
