'use client';
import React, { useState } from 'react';
import { PremiumHeader, PremiumCard, PremiumFooter } from './components';

interface AssetOpportunity {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  category: string;
  categoryLabel: string;
  image: string;
  description: string;
  origin: string;
  vaultId: string;
  grade: string;
  isFavorite: boolean;
}

export default function Page() {
  // Ultra-Exclusive Curated Asset Catalog
  const initialAssets: AssetOpportunity[] = [
    {
      id: 1,
      title: "1963 Ferrari 250 GTO Berlinetta",
      price: "$72,000,000",
      numericPrice: 72000000,
      category: "motors",
      categoryLabel: "Exotic Motors",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=400",
      description: "One of only 36 models ever built by Scaglietti. Completely documented ownership lineage, Ferrari Classiche certified. Features matching numbers, pristine race record, and iconic Rosso Corsa paintwork.",
      origin: "Maranello, Italy",
      vaultId: "VAULT_MILAN_98",
      grade: "Classiche A+",
      isFavorite: false
    },
    {
      id: 2,
      title: "Claude Monet 'Water Lilies' (1906 Oil)",
      price: "$54,000,000",
      numericPrice: 54000000,
      category: "art",
      categoryLabel: "Fine Art Portfolio",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400",
      description: "A signature oil on canvas masterpiece from Monet's highly coveted water garden series in Giverny. Flawless canvas preservation, documented in major museum exhibitions globally.",
      origin: "Paris, France",
      vaultId: "VAULT_GENEVA_12",
      grade: "Certified Museum Grade",
      isFavorite: true
    },
    {
      id: 3,
      title: "Macallan Fine & Rare 1926 Whisky (60 Year)",
      price: "$1,900,000",
      numericPrice: 1900000,
      category: "spirits",
      categoryLabel: "Rare Vintages",
      image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=400",
      description: "Voted the most collectible single-malt bottle in existence. Matured in seasoned sherry casks for 60 years. Hand-signed label from the master distiller with original presentation chest.",
      origin: "Speyside, Scotland",
      vaultId: "VAULT_EDINBURGH_44",
      grade: "Grade 10 Cask",
      isFavorite: false
    },
    {
      id: 4,
      title: "Patek Philippe Sky Moon Tourbillon",
      price: "$3,200,000",
      numericPrice: 3200000,
      category: "horology",
      categoryLabel: "Luxury Horology",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400",
      description: "One of the most complicated wristwatches in horological history. Dual-faced dial showing cathedral gongs minute repeater, perpetual calendar, solar time, and sky chart configurations.",
      origin: "Geneva, Switzerland",
      vaultId: "VAULT_ZURICH_87",
      grade: "Patek Seal Perfect",
      isFavorite: false
    },
    {
      id: 5,
      title: "The Pink Star Oval Vivid Diamond Ring",
      price: "$71,200,000",
      numericPrice: 71200000,
      category: "art",
      categoryLabel: "Fine Art Portfolio",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400",
      description: "A monumental 59.60 carat oval mixed-cut fancy vivid pink diamond. Flawless clarity grade, verified by GIA. Mounted on an elegant premium platinum band setting.",
      origin: "Sotheby's Auction Hub",
      vaultId: "VAULT_LONDON_02",
      grade: "Flawless Fancy Vivid",
      isFavorite: false
    },
    {
      id: 6,
      title: "Koenigsegg Jesko Absolut Hypercar",
      price: "$3,400,000",
      numericPrice: 3400000,
      category: "motors",
      categoryLabel: "Exotic Motors",
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=400",
      description: "The fastest car Koenigsegg will ever build. Custom carbon weave active bodywork, 1600 HP twin-turbo V8, and custom titanium exhaust components. 1 of 1 signature specification.",
      origin: "Ängelholm, Sweden",
      vaultId: "VAULT_GOTHENBURG_30",
      grade: "Factory Certified 1 of 1",
      isFavorite: false
    },
    {
      id: 7,
      title: "Andy Warhol 'Marilyn' Screenprint (1967)",
      price: "$195,000",
      numericPrice: 195000,
      category: "art",
      categoryLabel: "Fine Art Portfolio",
      image: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?q=80&w=400",
      description: "Authentic, signed portfolio screenprint of Marilyn Monroe in vibrant blue and pink tones. Factory Addendum certificate from the Andy Warhol Foundation included.",
      origin: "New York, USA",
      vaultId: "VAULT_NEWYORK_99",
      grade: "Warhol Seal A+",
      isFavorite: false
    },
    {
      id: 8,
      title: "Patek Philippe Grandmaster Chime (White Gold)",
      price: "$2,800,000",
      numericPrice: 2800000,
      category: "horology",
      categoryLabel: "Luxury Horology",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=400",
      description: "Stunning double-face wristwatch with 20 complications, including 5 striking modes (two patented acoustics). Crafted in fully hand-engraved white gold frames.",
      origin: "Geneva, Switzerland",
      vaultId: "VAULT_ZURICH_88",
      grade: "Mint Boxed Set",
      isFavorite: false
    },
    {
      id: 9,
      title: "Domaine de la Romanée-Conti 1945 case",
      price: "$558,000",
      numericPrice: 558000,
      category: "spirits",
      categoryLabel: "Rare Vintages",
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=400",
      description: "An incredibly rare, pristine case of legendary 1945 Romanée-Conti Burgundy. Kept in temperature-locked underground vaults since bottling. Unopened wax seals.",
      origin: "Vosne-Romanée, France",
      vaultId: "VAULT_BEAUNE_19",
      grade: "DRC Authenticated Grade",
      isFavorite: false
    }
  ];

  const categories = [
    { id: "all", name: "All Vaults" },
    { id: "art", name: "Fine Art" },
    { id: "horology", name: "Luxury Horology" },
    { id: "spirits", name: "Rare Vintages" },
    { id: "motors", name: "Exotic Motors" }
  ];

  // Carousel Spotlight Index
  const spotlightItems = [initialAssets[0], initialAssets[1], initialAssets[3]];
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  // Stateful items, filters, modals
  const [assets, setAssets] = useState<AssetOpportunity[]>(initialAssets);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Quick View Modal
  const [quickViewAsset, setQuickViewAsset] = useState<AssetOpportunity | null>(null);

  const toggleFavoriteAsset = (id: number) => {
    setAssets(
      assets.map((asset) => {
        if (asset.id === id) {
          const nextVal = !asset.isFavorite;
          console.log(`Curated asset favorited: ${asset.title} -> ${nextVal}`);
          return { ...asset, isFavorite: nextVal };
        }
        return asset;
      })
    );
  };

  const handleShareClick = (asset: AssetOpportunity, channel: string) => {
    alert(`🔒 Premium Share: Vetted investor invitation link for "${asset.title}" copied to ${channel} successfully.`);
  };

  const handleNextSpotlight = () => {
    setSpotlightIndex((prev) => (prev + 1) % spotlightItems.length);
  };

  const handlePrevSpotlight = () => {
    setSpotlightIndex((prev) => (prev - 1 + spotlightItems.length) % spotlightItems.length);
  };

  const activeSpotlight = spotlightItems[spotlightIndex];

  // Filter lists based on Category ribbon & Search bar
  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="classifieds-premium-wrapper">
      {/* Luxury Navbar component */}
      <PremiumHeader 
        onPostClick={() => alert("🔑 Secure Vault Authentication Required:\nPlease insert your physical Sellio Elite keycard or supply biometric broker pass keys.")} 
      />

      {/* Corporate/Brokerage Hero Showcase */}
      <section className="elite-hero">
        <div className="elite-hero-content">
          <span className="elite-hero-subtitle">Vetted Global Advisory Node</span>
          <h1 className="elite-hero-title">
            Curating high-value vaults for serious collectors.
          </h1>
          
          {/* Custom Search Box inside Hero */}
          <div className="elite-search-wrap">
            <input 
              type="text" 
              className="elite-search-input" 
              placeholder="Search by collection title, artist, country origin..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="elite-search-btn"
              onClick={() => console.log(`Search triggered: ${searchTerm}`)}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Category Pills Slider Ribbon */}
      <div className="elite-categories-wrap">
        {categories.map((cat) => (
          <button 
            key={cat.id} 
            className={`elite-cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Spotlight Carousel Section (Asset of the Week) */}
      <section className="spotlight-section">
        <div className="spotlight-header">
          <span className="spotlight-tag">CURATED SPOTLIGHT OF THE WEEK</span>
          <h2 className="spotlight-title">Featured High-Value Acquisitions</h2>
        </div>

        <div className="spotlight-carousel">
          <div className="spotlight-media-wrap">
            <img src={activeSpotlight.image} className="spotlight-img" alt={activeSpotlight.title} />
            
            <div className="spotlight-meta-overlay">
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--prem-accent)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                📍 {activeSpotlight.origin}
              </span>
            </div>

            {/* Carousel Navigation buttons */}
            <div className="spotlight-controls">
              <button className="spotlight-arrow" onClick={handlePrevSpotlight} title="Previous Spotlight">&lt;</button>
              <button className="spotlight-arrow" onClick={handleNextSpotlight} title="Next Spotlight">&gt;</button>
            </div>
          </div>

          <div className="spotlight-content">
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--prem-accent)', letterSpacing: '4px', textTransform: 'uppercase' }}>
              🛡️ {activeSpotlight.categoryLabel}
            </span>
            
            <h3 className="spotlight-name">{activeSpotlight.title}</h3>
            
            <p className="spotlight-desc">{activeSpotlight.description}</p>
            
            <div className="spotlight-price">{activeSpotlight.price}</div>
            
            <button 
              className="elite-modal-cta" 
              style={{ width: 'fit-content', marginTop: '1rem' }}
              onClick={() => setQuickViewAsset(activeSpotlight)}
            >
              Request Prospectus memorandum
            </button>
          </div>
        </div>
      </section>

      {/* Main Collections Grid */}
      <section className="elite-section">
        <div className="section-head">
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--prem-accent)', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Browse Curated Catalog
            </span>
            <h2 className="section-title">Exclusive Acquisitions</h2>
          </div>
          
          <div style={{ color: 'var(--prem-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
            Showing {filteredAssets.length} ultra-curated assets
          </div>
        </div>

        {/* Dynamic Grid Cards */}
        {filteredAssets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', border: '1px dashed var(--prem-border)', borderRadius: '12px' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>💎</span>
            <h4 style={{ fontFamily: 'var(--prem-serif)', fontWeight: 800, marginBottom: '0.5rem' }}>No Curated Assets Match Search</h4>
            <p style={{ color: 'var(--prem-muted)', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>Try clearing keywords or switching filter pills to display our private listings feed.</p>
            <button className="elite-modal-cta" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>Clear Refinements</button>
          </div>
        ) : (
          <div className="elite-grid">
            {filteredAssets.map((asset) => (
              <PremiumCard 
                key={asset.id}
                title={asset.title}
                price={asset.price}
                category={asset.categoryLabel}
                image={asset.image}
                isFavorite={asset.isFavorite}
                onQuickView={() => setQuickViewAsset(asset)}
                onToggleFavorite={() => toggleFavoriteAsset(asset.id)}
                onShare={() => handleShareClick(asset, 'clipboard')}
              />
            ))}
          </div>
        )}
      </section>

      {/* Breathtaking Center Glassmorphism Quick View Modal Box */}
      {quickViewAsset && (
        <div className="elite-modal-overlay" onClick={() => setQuickViewAsset(null)}>
          <div className="elite-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="elite-modal-close" onClick={() => setQuickViewAsset(null)}>×</button>
            
            <img src={quickViewAsset.image} className="elite-modal-img" alt={quickViewAsset.title} />
            
            <div className="elite-modal-price">{quickViewAsset.price}</div>
            <h4 className="elite-modal-title">{quickViewAsset.title}</h4>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--prem-accent)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
              {quickViewAsset.categoryLabel}
            </p>
            
            <p className="elite-modal-desc">{quickViewAsset.description}</p>
            
            {/* Vetted Custodian stats */}
            <div className="elite-modal-stats">
              <div className="elite-stat-item">
                Origin
                <span>{quickViewAsset.origin.split(',')[0]}</span>
              </div>
              <div className="elite-stat-item">
                Vault Location
                <span>{quickViewAsset.vaultId.split('_')[1]}</span>
              </div>
              <div className="elite-stat-item">
                Certification
                <span>{quickViewAsset.grade}</span>
              </div>
            </div>

            {/* Luxury Sharing Icons */}
            <div className="elite-modal-socials">
              <button className="elite-social-icon" onClick={() => handleShareClick(quickViewAsset, 'Encrypted Mail')} title="Send Encrypted Prospectus">✉️</button>
              <button className="elite-social-icon" onClick={() => handleShareClick(quickViewAsset, 'Wholesale Brokerage')} title="Broker Invitation">💼</button>
              <button className="elite-social-icon" onClick={() => handleShareClick(quickViewAsset, 'Private Terminal')} title="Interactive Terminal node">🖥️</button>
            </div>

            <button 
              className="elite-modal-cta"
              onClick={() => alert(`🔒 SECURE CONCIERGE LINK:\nDirect live terminal communication initiated with key vault custodian at ${quickViewAsset.vaultId} regarding acquisition of "${quickViewAsset.title}".`)}
            >
              Inquire Concierge Vault
            </button>
          </div>
        </div>
      )}

      {/* Luxury Footer component */}
      <PremiumFooter />
    </div>
  );
}
