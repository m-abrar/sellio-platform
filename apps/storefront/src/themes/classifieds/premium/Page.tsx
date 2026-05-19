'use client';
import React, { useState } from 'react';
import { PremiumHeader, PremiumCard, PremiumFooter } from './components';

interface OpportunityItem {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  description: string;
  location: string;
  category: string;
  image: string;
  isVerified?: boolean;
  isFeatured?: boolean;
}

export default function Page() {
  // Rich catalog of business acquisitions matching legacy listings
  const initialOpportunities: OpportunityItem[] = [
    // Featured Opportunities
    { 
      id: 1, 
      title: "Global SaaS Platform & API", 
      price: "$2,500,000", 
      numericPrice: 2500000,
      description: "Recurring revenue subscription model with high-margin customer base and fully automated delivery workflow.", 
      location: "Fully Remote", 
      category: "tech",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400",
      isVerified: true,
      isFeatured: true
    },
    { 
      id: 2, 
      title: "Upscale Urban Health Club", 
      price: "$950,000", 
      numericPrice: 950000,
      description: "Established high-tier brand in a fast-growing metropolitan area with stable recurring memberships.", 
      location: "New York City", 
      category: "hospitality",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400",
      isVerified: true,
      isFeatured: true
    },
    { 
      id: 3, 
      title: "B2B Logistics & Warehousing", 
      price: "$1,200,000", 
      numericPrice: 1200000,
      description: "Asset-heavy operation with stable long-term contracts and prime midwest hub access.", 
      location: "Chicago, IL", 
      category: "manufacturing",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400",
      isVerified: true,
      isFeatured: true
    },
    // Ordinary Listings
    { 
      id: 4, 
      title: "Niche E-Commerce Coffee Brand", 
      price: "$350,000", 
      numericPrice: 350000,
      description: "Fully custom Shopify setup specializing in organic micro-lot coffee blends with solid organic search presence.", 
      location: "Remote", 
      category: "retail",
      image: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=400",
      isVerified: true
    },
    { 
      id: 5, 
      title: "Local Cafe & Organic Bakery", 
      price: "$120,000", 
      numericPrice: 120000,
      description: "Highly rated local spot in historic district featuring state-of-the-art kitchen equipment and high foot traffic.", 
      location: "Seattle, WA", 
      category: "hospitality",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400",
      isVerified: true
    },
    { 
      id: 6, 
      title: "Regional Trucking Fleet Operation", 
      price: "$800,000", 
      numericPrice: 800000,
      description: "Operable fleet of 12 well-maintained semi-trucks, active CDL driver rosters, and contracted shipping lanes.", 
      location: "Dallas, TX", 
      category: "manufacturing",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=400",
      isVerified: true
    },
    { 
      id: 7, 
      title: "Software Reseller Agency Hub", 
      price: "$50,000", 
      numericPrice: 50000,
      description: "White-label distributor rights for CRM solutions in regional tech startup zones.", 
      location: "Global Remote", 
      category: "tech",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400",
      isVerified: false
    },
    { 
      id: 8, 
      title: "B2B Enterprise Consulting Firm", 
      price: "$450,000", 
      numericPrice: 450000,
      description: "Consultancy focused on restructuring and supply chain optimization with high-value contracts.", 
      location: "Remote", 
      category: "tech",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400",
      isVerified: true
    },
    { 
      id: 9, 
      title: "Vending Machine Route (22 spots)", 
      price: "$75,000", 
      numericPrice: 75000,
      description: "Lucrative route of smart vending machines in corporate campuses and school gyms with cash flows verified.", 
      location: "Phoenix, AZ", 
      category: "retail",
      image: "https://images.unsplash.com/photo-1575224300306-1b8da56134ec?q=80&w=400",
      isVerified: true
    },
    { 
      id: 10, 
      title: "Digital Marketing Agency (SaaS Focused)", 
      price: "$220,000", 
      numericPrice: 220000,
      description: "Marketing specialists with active monthly retainer arrangements and proven SEO traffic channels.", 
      location: "London, UK", 
      category: "tech",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400",
      isVerified: true
    },
    { 
      id: 11, 
      title: "Local Automated Laundromat", 
      price: "$90,000", 
      numericPrice: 90000,
      description: "Fully coinless automated laundromat featuring brand-new commercial washers with high-margin returns.", 
      location: "Miami, FL", 
      category: "retail",
      image: "https://images.unsplash.com/photo-1545173168-9f1947eebd01?q=80&w=400",
      isVerified: false
    }
  ];

  // Stateful interactive variables
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(initialOpportunities);
  
  // Search state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locationTerm, setLocationTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Active Filter Applied State
  const [appliedFilters, setAppliedFilters] = useState({
    category: 'all',
    location: '',
    min: '',
    max: ''
  });

  // Grid/List View Toggler state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Trigger Filter Application
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      category: selectedCategory,
      location: locationTerm,
      min: minPrice,
      max: maxPrice
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setLocationTerm('');
    setMinPrice('');
    setMaxPrice('');
    setAppliedFilters({
      category: 'all',
      location: '',
      min: '',
      max: ''
    });
  };

  const triggerInvestmentMemo = (title: string, price: string) => {
    alert(`🔒 Investment Memorandum Locked:\nYou are accessing the private prospectus for:\n"${title}" (${price})\n\nPlease sign the standard NDA document sent to your corporate email to review full audit records, lease agreements, and financials.`);
  };

  // Filter listings based on sidebar and search options
  const filterCatalog = (itemsList: OpportunityItem[]) => {
    return itemsList.filter((item) => {
      // Keyword search
      const matchesSearch = searchTerm === '' || 
                            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Sidebar Filters
      const matchesCategory = appliedFilters.category === 'all' || item.category === appliedFilters.category;
      
      const matchesLocation = appliedFilters.location === '' || 
                              item.location.toLowerCase().includes(appliedFilters.location.toLowerCase());
      
      const minVal = appliedFilters.min === '' ? 0 : parseInt(appliedFilters.min);
      const maxVal = appliedFilters.max === '' ? Infinity : parseInt(appliedFilters.max);
      const matchesPrice = item.numericPrice >= minVal && item.numericPrice <= maxVal;

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });
  };

  const featuredItems = filterCatalog(opportunities.filter(item => item.isFeatured));
  const ordinaryItems = filterCatalog(opportunities.filter(item => !item.isFeatured));

  return (
    <div className="classifieds-premium-wrapper">
      {/* High-Fidelity Premium Navbar Header */}
      <PremiumHeader 
        onPostClick={() => alert("🔑 Institutional M&A Hub:\nPlease authenticate using your brokerage secure key to list a new private memorandum opportunity.")} 
      />

      {/* Corporate Search Bar Banner */}
      <div className="cp-search-section">
        <div className="cp-search-box">
          <input 
            type="text" 
            className="cp-search-input" 
            placeholder="Search for Business Name, Industry keyword, or Acquisition profile..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="cp-search-btn" onClick={() => console.log("Opportunity search synced.")}>
            🔍 Find Opportunity
          </button>
        </div>
      </div>

      {/* Main Split Columns Grid */}
      <div className="cp-layout">
        
        {/* Left Sidebar Filter Section */}
        <aside>
          <form className="cp-sidebar" onSubmit={handleApplyFilters}>
            <div className="cp-sidebar-title">Refine Search</div>
            
            <div className="cp-field-group">
              <label className="cp-field-label">Category</label>
              <select 
                className="cp-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="tech">Technology & SaaS</option>
                <option value="retail">Real Estate & Retail</option>
                <option value="hospitality">Hospitality & F&B</option>
                <option value="manufacturing">Logistics & Industry</option>
              </select>
            </div>

            <div className="cp-field-group">
              <label className="cp-field-label">Location</label>
              <input 
                type="text" 
                className="cp-input" 
                placeholder="City, State, or Country" 
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
              />
            </div>

            <div className="cp-field-group">
              <label className="cp-field-label">Price Range (USD)</label>
              <div className="cp-price-range">
                <input 
                  type="number" 
                  className="cp-input" 
                  placeholder="Min ($)" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input 
                  type="number" 
                  className="cp-input" 
                  placeholder="Max ($)" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="cp-btn-apply">
              Apply Filters
            </button>
            
            <button 
              type="button" 
              onClick={handleResetFilters}
              style={{ background: 'transparent', border: 'none', color: 'var(--cp-teal)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', padding: '4px 0' }}
            >
              Clear Refinements
            </button>
          </form>
        </aside>

        {/* Right Opportunities Feeds Column */}
        <main>
          
          {/* Featured Header with linear gradient and subtle shadow */}
          <div className="cp-featured-header">
            💎 Featured Investment Opportunities
          </div>

          {featuredItems.length === 0 ? (
            <p style={{ color: '#64748b', fontStyle: 'italic', marginBottom: '3rem' }}>No featured opportunities match your refinements.</p>
          ) : (
            <div className="cp-grid-featured">
              {featuredItems.map((item) => (
                <PremiumCard 
                  key={item.id}
                  title={item.title}
                  price={item.price}
                  description={item.description}
                  location={item.location}
                  image={item.image}
                  isVerified={item.isVerified}
                  onViewDetails={() => triggerInvestmentMemo(item.title, item.price)}
                />
              ))}
            </div>
          )}

          {/* Locked Premium Gold Frame Membership Banner */}
          <section className="cp-banner">
            <h3 className="cp-banner-title">UNLOCK PREMIUM PRIVATE OPPORTUNITIES</h3>
            <p className="cp-banner-subtitle">
              Gain verified access to institutional-grade M&A prospectuses, audit-vetted tax returns, and coordinate direct negotiations with certified investment brokers.
            </p>
            <button 
              className="cp-banner-btn"
              onClick={() => alert("🔑 Premium Concierge: Exploring premium advisory fee charts and corporate investor vetting tiers.")}
            >
              Explore Membership Tiers
            </button>
          </section>

          {/* Grid / List Toolbar Header */}
          <div className="cp-toolbar">
            <h4 className="cp-toolbar-title">
              Available Listings ({ordinaryItems.length} opportunities)
            </h4>
            
            <div className="cp-toggle-group">
              <button 
                className={`cp-toggle-btn ${viewMode === 'grid' ? 'cp-active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </button>
              <button 
                className={`cp-toggle-btn ${viewMode === 'list' ? 'cp-active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
            </div>
          </div>

          {/* Ordinary Opportunities List/Grid Feed */}
          {ordinaryItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--cp-border)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.8rem' }}>💼</span>
              <h5 style={{ fontWeight: 800 }}>No Private Listings Found</h5>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Try clearing price ranges or location strings to expand search bounds.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'cp-grid-all' : 'cp-list-view'}>
              {ordinaryItems.map((item) => (
                <PremiumCard 
                  key={item.id}
                  title={item.title}
                  price={item.price}
                  description={item.description}
                  location={item.location}
                  image={item.image}
                  isVerified={item.isVerified}
                  onViewDetails={() => triggerInvestmentMemo(item.title, item.price)}
                />
              ))}
            </div>
          )}

          {/* Vetted Pagination */}
          <div className="cp-pagination">
            <button className="cp-page-btn cp-active">1</button>
            <button className="cp-page-btn" onClick={() => alert("Acquiring Listings Page 2...")}>2</button>
            <button className="cp-page-btn" onClick={() => alert("Acquiring Listings Page 3...")}>3</button>
          </div>

        </main>
      </div>

      {/* Footer component */}
      <PremiumFooter />
    </div>
  );
}
