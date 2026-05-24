'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { EstateCard } from './components';

interface ProductPageProps {
  slug: string;
}

const FALLBACK_ESTATES: Property[] = [
  { id: 1, user_id: 1, category_id: 1, type_id: 1, location_id: 1, title: "The Pemberley Manor", slug: "pemberley-manor", description: "A majestic historic manor situated in the heart of Hertfordshire, featuring sweeping countryside views and rich architectural history. Built during the Regency period, Pemberley Manor offers exceptionally grand proportions, beautiful sash windows, and intricate original moldings.\n\nThe extensive grounds include pristine manicured lawns, a private serpentine lake, and mature oak forests. A truly unparalleled heritage opportunity.", base_price: 14200000, number_of_bedrooms: 6, number_of_bathrooms: 5, maximum_guests: 10, minimum_rental_days: 7, maximum_rental_days: 30, area_sq_ft: 12000, area_sq_m: 1114, number_of_parking_spots: 4, hoa: 200, year_built: 1815, address: "Pemberley Park", city: "Hertfordshire", state: "Herts", country: "UK", zip_code: "AL1 1AB", status: "active", is_published: true, is_featured: true, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 14200000, price_formatted: "$14,200,000", currency_symbol: "$" }, location: { id: 1, title: "Hertfordshire", country: "UK", slug: "hertfordshire" }, specs: { bedrooms: 6, bathrooms: 5, area_formatted: "12,000 Sq Ft", year_built: 1815, category: "Country Manors", property_type: "Sale" }, featured_image: "/themes/properties/classic/1.webp", short_description: "A majestic historic manor situated in the heart of Hertfordshire, featuring sweeping countryside views and rich architectural history." },
  { id: 2, user_id: 1, category_id: 2, type_id: 1, location_id: 2, title: "Florentine Palazzo", slug: "florentine-palazzo", description: "An authentic Renaissance palace in central Florence, with original frescoes, grand vaulted halls, and private courtyard gardens.", base_price: 22500000, number_of_bedrooms: 8, number_of_bathrooms: 7, maximum_guests: 16, minimum_rental_days: 3, maximum_rental_days: 14, area_sq_ft: 18500, area_sq_m: 1718, number_of_parking_spots: 2, hoa: 500, year_built: 1540, address: "Via dei Bardi", city: "Florence", state: "Tuscany", country: "Italy", zip_code: "50125", status: "active", is_published: true, is_featured: false, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 22500000, price_formatted: "$22,500,000", currency_symbol: "$" }, location: { id: 2, title: "Florence", country: "Italy", slug: "florence" }, specs: { bedrooms: 8, bathrooms: 7, area_formatted: "18,500 Sq Ft", year_built: 1540, category: "Historic Chateaus", property_type: "Sale" }, featured_image: "/themes/properties/classic/2.webp", short_description: "An authentic Renaissance palace in central Florence, with original frescoes, grand vaulted halls, and private courtyard gardens." },
  { id: 3, user_id: 1, category_id: 3, type_id: 1, location_id: 3, title: "Colonial River Estate", slug: "colonial-river-estate", description: "A meticulously preserved classic colonial estate on the banks of the James River, boasting rich heritage and timeless charm.", base_price: 8900000, number_of_bedrooms: 5, number_of_bathrooms: 4, maximum_guests: 8, minimum_rental_days: 1, maximum_rental_days: 365, area_sq_ft: 8200, area_sq_m: 761, number_of_parking_spots: 3, hoa: 100, year_built: 1742, address: "River Road", city: "Virginia", state: "VA", country: "USA", zip_code: "23220", status: "active", is_published: true, is_featured: false, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 8900000, price_formatted: "$8,900,000", currency_symbol: "$" }, location: { id: 3, title: "Virginia", country: "USA", slug: "virginia" }, specs: { bedrooms: 5, bathrooms: 4, area_formatted: "8,200 Sq Ft", year_built: 1742, category: "Colonial Estates", property_type: "Sale" }, featured_image: "/themes/properties/classic/3.webp", short_description: "A meticulously preserved classic colonial estate on the banks of the James River, boasting rich heritage and timeless charm." },
  { id: 4, user_id: 1, category_id: 2, type_id: 1, location_id: 3, title: "Loire Valley Chateau", slug: "loire-valley-chateau", description: "A breathtaking French chateau with spectacular turrets, exquisite manicured formal gardens, and extensive woodland acreage.", base_price: 35000000, number_of_bedrooms: 12, number_of_bathrooms: 10, maximum_guests: 20, minimum_rental_days: 5, maximum_rental_days: 30, area_sq_ft: 24000, area_sq_m: 2229, number_of_parking_spots: 10, hoa: 800, year_built: 1620, address: "Chateau Road", city: "Loire", state: "Centre-Val de Loire", country: "France", zip_code: "37000", status: "active", is_published: true, is_featured: true, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 35000000, price_formatted: "$35,000,000", currency_symbol: "$" }, location: { id: 3, title: "Loire Valley", country: "France", slug: "loire" }, specs: { bedrooms: 12, bathrooms: 10, area_formatted: "24,000 Sq Ft", year_built: 1620, category: "Historic Chateaus", property_type: "Sale" }, featured_image: "/themes/properties/classic/4.webp", short_description: "A breathtaking French chateau with spectacular turrets, exquisite manicured formal gardens, and extensive woodland acreage." },
  { id: 5, user_id: 1, category_id: 4, type_id: 1, location_id: 1, title: "Scottish Highland Castle", slug: "scottish-highland-castle", description: "A historic stone fortress overlooking the Scottish Highlands, complete with authentic battlements, grand hall, and private loch.", base_price: 12400000, number_of_bedrooms: 10, number_of_bathrooms: 8, maximum_guests: 18, minimum_rental_days: 2, maximum_rental_days: 14, area_sq_ft: 15000, area_sq_m: 1393, number_of_parking_spots: 6, hoa: 400, year_built: 1480, address: "Highland Way", city: "Inverness", state: "Highlands", country: "Scotland", zip_code: "IV1 1AA", status: "active", is_published: true, is_featured: false, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 12400000, price_formatted: "$12,400,000", currency_symbol: "$" }, location: { id: 1, title: "Inverness", country: "Scotland", slug: "inverness" }, specs: { bedrooms: 10, bathrooms: 8, area_formatted: "15,000 Sq Ft", year_built: 1480, category: "Royal Castles", property_type: "Sale" }, featured_image: "/themes/properties/classic/5.webp", short_description: "A historic stone fortress overlooking the Scottish Highlands, complete with authentic battlements, grand hall, and private loch." },
  { id: 6, user_id: 1, category_id: 1, type_id: 1, location_id: 1, title: "Bavarian Hunting Lodge", slug: "bavarian-hunting-lodge", description: "An alpine timber lodge surrounded by deep Bavarian forests, offering ultimate privacy, heated floors, and a gorgeous stone hearth.", base_price: 6500000, number_of_bedrooms: 4, number_of_bathrooms: 3, maximum_guests: 6, minimum_rental_days: 3, maximum_rental_days: 30, area_sq_ft: 5800, area_sq_m: 538, number_of_parking_spots: 2, hoa: 150, year_built: 1895, address: "Alpine Lodge Weg", city: "Bavaria", state: "Bavaria", country: "Germany", zip_code: "80331", status: "active", is_published: true, is_featured: false, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 6500000, price_formatted: "$6,500,000", currency_symbol: "$" }, location: { id: 1, title: "Bavaria", country: "Germany", slug: "bavaria" }, specs: { bedrooms: 4, bathrooms: 3, area_formatted: "5,800 Sq Ft", year_built: 1895, category: "Country Manors", property_type: "Sale" }, featured_image: "/themes/properties/classic/6.webp", short_description: "An alpine timber lodge surrounded by deep Bavarian forests, offering ultimate privacy, heated floors, and a gorgeous stone hearth." }
];

export default function ProductPage({ slug }: ProductPageProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [related, setRelated] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  // Inquiry form states
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // Estimator results
  const [estimatingPrice, setEstimatingPrice] = useState(false);
  const [estimation, setEstimation] = useState<{ total_nights: number; estimated_lodging_total: string } | null>(null);
  const [inquiryAdded, setInquiryAdded] = useState(false);

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        const themeKey = window.location.pathname.split('/')[2];
        return `/preview/${themeKey}${path}`;
      }
    }
    return path;
  };

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const response = await api.getPropertyDetails(slug);
        if (response && response.success && response.data) {
          setProperty(response.data);
          setRelated(response.related_properties || []);
          setUseFallback(false);
        } else {
          console.warn("Classic Property ProductPage: API returned unsuccessful details payload. Falling back to static data.");
          loadFallback();
        }
      } catch (err) {
        console.error("Classic Property ProductPage: Failed to fetch dynamic property details from API:", err);
        loadFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadFallback = () => {
      const matched = FALLBACK_ESTATES.find(e => e.slug === slug);
      if (matched) {
        setProperty(matched);
        setRelated(FALLBACK_ESTATES.filter(e => e.slug !== slug).slice(0, 3));
      } else {
        // Fallback to first if unmatched
        setProperty(FALLBACK_ESTATES[0]);
        setRelated(FALLBACK_ESTATES.slice(1, 4));
      }
      setUseFallback(true);
    };

    loadDetails();
  }, [slug]);

  // Estimator trigger for check-in / check-out changes
  useEffect(() => {
    const calculatePrice = async () => {
      if (!property || !checkIn || !checkOut) return;
      setEstimatingPrice(true);
      try {
        if (useFallback) {
          const inDate = new Date(checkIn);
          const outDate = new Date(checkOut);
          const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
          const pricePerNight = Number(property.price_per_night || 2500);
          setEstimation({
            total_nights: diffDays,
            estimated_lodging_total: (pricePerNight * diffDays).toFixed(2)
          });
        } else {
          const result = await api.calculateLodgingPrice(property.id, checkIn, checkOut);
          setEstimation(result);
        }
      } catch (err) {
        console.warn("Calculation of seasonal lodging failed.", err);
      } finally {
        setEstimatingPrice(false);
      }
    };
    calculatePrice();
  }, [checkIn, checkOut, property, useFallback]);

  // Check if already in Inquiry registry
  useEffect(() => {
    if (!property) return;
    const currentList = JSON.parse(localStorage.getItem('sellio_classic_inquiries') || '[]');
    const exists = currentList.some((item: any) => item.id === property.id);
    setInquiryAdded(exists);
  }, [property]);

  const handleAddToRegistry = () => {
    if (!property) return;
    const currentList = JSON.parse(localStorage.getItem('sellio_classic_inquiries') || '[]');
    
    // Check duplication
    if (!currentList.some((item: any) => item.id === property.id)) {
      const updatedList = [...currentList, {
        id: property.id,
        title: property.title,
        slug: property.slug,
        featured_image: property.featured_image || property.thumbnail_image,
        location: property.location?.title || property.city,
        price: property.pricing?.price_formatted || property.base_price,
        year: property.specs?.year_built || property.year_built,
        beds: property.specs?.bedrooms ?? property.number_of_bedrooms,
        baths: property.specs?.bathrooms ?? property.number_of_bathrooms,
        area: property.specs?.area_formatted || `${property.area_sq_ft} SQFT`,
        is_rental: property.is_rental,
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guests
      }];
      localStorage.setItem('sellio_classic_inquiries', JSON.stringify(updatedList));
      setInquiryAdded(true);
      alert('Sovereign Heritage Inquiry Panel: Estate added successfully to your Registry collection.');
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert("Please complete the required details before sending.");
      return;
    }
    alert(`Thank you, ${fullName}. An Estate Heritage Coordinator has been notified. We will verify architectural provenance and contact you at ${email} shortly.`);
    // Reset Form
    setFullName('');
    setEmail('');
    setMessage('');
    setCheckIn('');
    setCheckOut('');
  };

  if (loading) {
    return (
      <div style={{ background: 'var(--pc-bone)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'var(--pc-font-serif)' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--pc-teal)' }} className="pc-italic">Retrieving Provenance...</h2>
        <div style={{ width: '80px', height: '1px', background: 'var(--pc-teal)', marginTop: '2rem', opacity: 0.3 }} />
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ background: 'var(--pc-bone)', minHeight: '100vh', padding: '12rem 2rem', textAlign: 'center' }}>
        <h2 className="pc-serif" style={{ fontSize: '2.5rem', color: 'var(--pc-teal)', marginBottom: '2rem' }}>Estate Not Found</h2>
        <p style={{ color: 'var(--pc-text-muted)', marginBottom: '4rem' }}>The requested listing could not be found in the Global Heritage Registry.</p>
        <a href={getThemeLink('/')} className="pc-btn-primary" style={{ textDecoration: 'none' }}>Return to Registry Homepage</a>
      </div>
    );
  }

  const isRental = property.is_rental || property.status?.is_rental;

  const displayTitle = property.title;
  const displayPrice = property.pricing?.price_formatted || (property.base_price ? `$${Number(property.base_price).toLocaleString()}` : '$1,000,000');
  const displayLocation = property.location?.title 
    ? `${property.location.title}, ${property.location.country || ''}`
    : (property.city && property.country ? `${property.city}, ${property.country}` : 'Global Registry');
  const displayYear = property.specs?.year_built || property.year_built || '1800';
  const displayImage = property.featured_image || property.thumbnail_image || '/themes/properties/classic/1.webp';
  
  const beds = property.specs?.bedrooms ?? property.number_of_bedrooms ?? 4;
  const baths = property.specs?.bathrooms ?? property.number_of_bathrooms ?? 3;
  const area = property.specs?.area_formatted || (property.area_sq_ft ? `${property.area_sq_ft.toLocaleString()} SQFT` : '4,200 SQFT');
  const guestsCount = property.specs?.max_guests ?? property.maximum_guests ?? 4;
  const parking = property.specs?.parking_spots ?? property.number_of_parking_spots ?? 2;
  const categoryName = property.specs?.category || property.category?.title || 'Heritage Listing';

  return (
    <div style={{ background: 'var(--pc-bone)', minHeight: '100vh' }}>
      
      {/* Dynamic Parallax Hero */}
      <section style={{ height: '70vh', position: 'relative', overflow: 'hidden', background: 'var(--pc-teal)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
          <img src={displayImage} alt={displayTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))' }} />
        
        <div style={{ position: 'absolute', bottom: '6rem', left: '6%', right: '6%', zIndex: 10, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span className="pc-caps" style={{ color: 'var(--pc-beige)', fontSize: '0.75rem', opacity: 0.8 }}>{categoryName}</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--pc-beige)', opacity: 0.5 }} />
              <span className="pc-caps" style={{ color: 'var(--pc-beige)', fontSize: '0.75rem', opacity: 0.8 }}>EST. {displayYear}</span>
            </div>
            <h1 className="pc-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, color: 'var(--pc-white)', letterSpacing: '-2px', textShadow: '0 4px 10px rgba(0,0,0,0.3)', margin: 0 }}>
              {displayTitle}
            </h1>
          </div>
          <div style={{ background: 'rgba(252,251,248, 0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(252,251,248, 0.2)', padding: '2rem 3rem', color: 'var(--pc-white)', textAlign: 'right' }}>
            <div className="pc-caps" style={{ fontSize: '0.65rem', marginBottom: '0.5rem', opacity: 0.8, color: 'var(--pc-beige)' }}>Valuation</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '1px', color: 'var(--pc-beige)' }}>{displayPrice}</div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="pc-section" style={{ paddingTop: '8rem', paddingBottom: '10rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6rem', alignItems: 'start' }} className="pc-details-grid">
          <style dangerouslySetInnerHTML={{ __html: `
            @media (min-width: 1024px) {
              .pc-details-grid { grid-template-columns: 1fr 400px !important; }
            }
          ` }} />

          {/* Left Column: Provenance Description & Specs */}
          <div>
            <div style={{ borderBottom: '1px solid var(--pc-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
              <div className="pc-caps" style={{ color: 'var(--pc-teal)', marginBottom: '1.5rem', opacity: 0.4 }}>Historic Account</div>
              <h2 className="pc-serif" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--pc-teal)', marginBottom: '2.5rem', letterSpacing: '-1px' }}>
                Provenance <span className="pc-italic" style={{ fontWeight: 400 }}>Overview.</span>
              </h2>
              <div 
                style={{ fontSize: '1.15rem', color: 'var(--pc-text-muted)', lineHeight: 2, whiteSpace: 'pre-line' }}
              >
                {property.description}
              </div>
            </div>

            {/* Spec badging grid */}
            <div style={{ borderBottom: '1px solid var(--pc-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
              <div className="pc-caps" style={{ color: 'var(--pc-teal)', marginBottom: '2.5rem', opacity: 0.4 }}>Architectural Registry</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }} className="pc-specs-subgrid">
                <style dangerouslySetInnerHTML={{ __html: `
                  @media (min-width: 600px) {
                    .pc-specs-subgrid { grid-template-columns: repeat(3, 1fr) !important; }
                  }
                ` }} />
                {[
                  { label: "BEDROOMS", value: `${beds} Rooms` },
                  { label: "BATHROOMS", value: `${baths} Baths` },
                  { label: "TOTAL AREA", value: area },
                  { label: "GUESTS MAX", value: `${guestsCount} Guests` },
                  { label: "PARKING", value: `${parking} Spots` },
                  { label: "HOA FEES", value: property.hoa ? `$${property.hoa}/mo` : "Included" }
                ].map((s, i) => (
                  <div key={i} style={{ border: '1px solid var(--pc-border)', background: 'var(--pc-white)', padding: '2rem', textAlign: 'center' }}>
                    <div className="pc-caps" style={{ fontSize: '0.65rem', color: 'var(--pc-teal)', opacity: 0.4, marginBottom: '0.8rem' }}>{s.label}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--pc-teal)' }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Grid */}
            {property.amenities && property.amenities.length > 0 && (
              <div style={{ borderBottom: '1px solid var(--pc-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
                <div className="pc-caps" style={{ color: 'var(--pc-teal)', marginBottom: '2.5rem', opacity: 0.4 }}>Luxury Amenities</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {property.amenities.map(a => (
                    <div key={a.id} style={{ border: '1px solid var(--pc-teal)', padding: '1rem 2rem', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--pc-teal)', background: 'transparent' }}>
                      ❦ {a.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features list */}
            {property.features && property.features.length > 0 && (
              <div style={{ borderBottom: '1px solid var(--pc-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
                <div className="pc-caps" style={{ color: 'var(--pc-teal)', marginBottom: '2.5rem', opacity: 0.4 }}>Unique Fealty Features</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }} className="pc-feats-grid">
                  <style dangerouslySetInnerHTML={{ __html: `
                    @media (min-width: 600px) {
                      .pc-feats-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    }
                  ` }} />
                  {property.features.map(f => (
                    <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.95rem', color: 'var(--pc-text-muted)' }}>
                      <span style={{ color: 'var(--pc-accent)', fontSize: '1.5rem' }}>❖</span>
                      <span>{f.title} {f.pivot?.value ? `: ${f.pivot.value}` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {property.gallery && property.gallery.length > 0 && (
              <div>
                <div className="pc-caps" style={{ color: 'var(--pc-teal)', marginBottom: '2.5rem', opacity: 0.4 }}>Provenance Gallery</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="pc-gallery-grid">
                  <style dangerouslySetInnerHTML={{ __html: `
                    @media (min-width: 600px) {
                      .pc-gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    }
                  ` }} />
                  {property.gallery.map((img: string, idx: number) => (
                    <div key={idx} style={{ height: '300px', border: '1px solid var(--pc-border)', overflow: 'hidden' }}>
                      <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--pc-transition)' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Inquiry Reserve Form */}
          <aside style={{ position: 'sticky', top: '140px', zIndex: 10 }}>
            <div style={{ background: 'var(--pc-white)', border: '1px solid var(--pc-border)', padding: '3rem', boxShadow: 'var(--pc-shadow-premium)' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div className="pc-caps" style={{ opacity: 0.4, marginBottom: '1rem' }}>Inquiry Desk</div>
                <h3 className="pc-serif" style={{ fontSize: '1.8rem', color: 'var(--pc-teal)', fontWeight: 900 }}>
                  Manorial <span className="pc-italic" style={{ fontWeight: 400 }}>Inquiry.</span>
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--pc-text-muted)', marginTop: '0.5rem' }}>Location: {displayLocation}</div>
              </div>

              {/* Inquiry Action Registry collection */}
              <button 
                onClick={handleAddToRegistry} 
                className="pc-btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '1.5rem', 
                  marginBottom: '2rem', 
                  background: inquiryAdded ? 'transparent' : 'var(--pc-teal)',
                  border: inquiryAdded ? '1px solid var(--pc-teal)' : 'none',
                  color: inquiryAdded ? 'var(--pc-teal)' : 'var(--pc-white)'
                }}
              >
                {inquiryAdded ? '✓ ADDED TO HERITAGE COLLECTION' : '❦ COLLECT FOR INQUIRY'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--pc-border)' }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--pc-teal)', opacity: 0.3 }}>OR SUBMIT INQUIRY</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--pc-border)' }} />
              </div>

              <form onSubmit={handleInquirySubmit}>
                {/* Date Estimator if it is a rental listing */}
                {isRental && (
                  <div style={{ background: 'var(--pc-bone)', padding: '2rem 1.5rem', border: '1px solid var(--pc-border)', marginBottom: '2.5rem' }}>
                    <div className="pc-caps" style={{ fontSize: '0.65rem', marginBottom: '1.5rem', color: 'var(--pc-teal)', opacity: 0.5 }}>Estimated Lodging Rental</div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--pc-teal)', display: 'block', marginBottom: '0.5rem' }} className="pc-caps">CHECK IN DATE</label>
                        <input 
                          type="date" 
                          required 
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--pc-border)', background: 'white', fontFamily: 'var(--pc-font-body)', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--pc-teal)', display: 'block', marginBottom: '0.5rem' }} className="pc-caps">CHECK OUT DATE</label>
                        <input 
                          type="date" 
                          required 
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--pc-border)', background: 'white', fontFamily: 'var(--pc-font-body)', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--pc-teal)', display: 'block', marginBottom: '0.5rem' }} className="pc-caps">PATRON GUESTS</label>
                        <select 
                          value={guests} 
                          onChange={(e) => setGuests(e.target.value)}
                          style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--pc-border)', background: 'white', outline: 'none' }}
                        >
                          {[...Array(guestsCount)].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1} Patron{i > 0 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {checkIn && checkOut && (
                      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--pc-border)' }}>
                        {estimatingPrice ? (
                          <div style={{ fontSize: '0.85rem', color: 'var(--pc-text-muted)', fontStyle: 'italic' }}>Calculating Lodging rates...</div>
                        ) : estimation ? (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--pc-teal)' }}>{estimation.total_nights} Nights Rental</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--pc-teal)' }}>${Number(estimation.estimated_lodging_total).toLocaleString()}</span>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                )}

                <div className="pc-filter-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="pc-filter-label pc-caps" style={{ fontSize: '0.7rem' }}>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Grace Bennett"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pc-filter-input" 
                    style={{ background: 'white' }}
                  />
                </div>

                <div className="pc-filter-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="pc-filter-label pc-caps" style={{ fontSize: '0.7rem' }}>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="grace@pemberley.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pc-filter-input" 
                    style={{ background: 'white' }}
                  />
                </div>

                <div className="pc-filter-group" style={{ marginBottom: '3rem' }}>
                  <label className="pc-filter-label pc-caps" style={{ fontSize: '0.7rem' }}>Message</label>
                  <textarea 
                    rows={4}
                    placeholder="Inquire on the architectural provenance and deed allocation details..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="pc-filter-input" 
                    style={{ background: 'white', resize: 'none' }}
                  />
                </div>

                <button type="submit" className="pc-btn-primary" style={{ width: '100%', padding: '1.5rem' }}>
                  DISPATCH DIRECT INQUIRY
                </button>
              </form>
              
              <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '3px', opacity: 0.3 }}>
                  HERITAGE COORDINATION DESK
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Provenance properties */}
      {related && related.length > 0 && (
        <section style={{ background: 'var(--pc-beige)', padding: '10rem 6%' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
              <div className="pc-caps" style={{ color: 'var(--pc-teal)', marginBottom: '1.5rem', opacity: 0.4 }}>Heritage Affiliations</div>
              <h3 className="pc-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--pc-teal)' }}>
                Related <span className="pc-italic" style={{ fontWeight: 400 }}>Provenance.</span>
              </h3>
            </div>
            
            <div className="pc-estate-grid">
              {related.map(property => (
                <EstateCard 
                  key={property.id} 
                  property={property} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
