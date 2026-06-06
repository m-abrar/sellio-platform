import React from 'react';
import type { JobListing } from '@sellio/types';

const getThemeLink = (path: string) => {
  if (typeof window !== 'undefined') {
    const isPreview = window.location.pathname.startsWith('/preview/');
    if (isPreview) {
      const segments = window.location.pathname.split('/');
      const themeKey = segments[2];
      return `/preview/${themeKey}${path}`;
    }
  }
  return path;
};

interface OpportunityCardProps {
    job?: JobListing;
    // Fallback static fields for mock data:
    title?: string;
    company?: string;
    equity?: string;
    stage?: string;
    location?: string;
}

export const OpportunityCard = ({ job, title, company, equity, stage, location }: OpportunityCardProps) => {
    // Resolve dynamic properties if job listing is provided, otherwise use fallbacks
    const displayTitle = job ? job.title : (title || '');
    const displayCompany = job ? (job.company?.name || 'Venture Startup') : (company || '');
    const displayLocation = job ? job.location?.display : (location || '');
    const displayStage = job ? (job.employment?.workplace || 'Remote') : (stage || 'Seed');
    
    // Fallback dynamic equity calculations to keep startup style
    const displayEquity = job 
        ? (job.compensation?.range_compact || '$80k–$120k/yr') 
        : (equity || '0.5% - 1.5%');
    const hasEquityLabel = job ? false : true;

    const slug = job?.slug;
    const detailsUrl = slug ? getThemeLink(`/product/${slug}`) : '#';

    return (
        <div 
            className="opportunity-card growth-panel"
            style={{ 
                cursor: slug ? 'pointer' : 'default',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={() => {
                if (slug) window.location.href = detailsUrl;
            }}
        >
            <div>
                <span className="opp-badge">{displayStage.toUpperCase()}</span>
                <h3 className="opp-title" style={{ marginTop: '1rem', fontSize: '1.4rem' }}>{displayTitle}</h3>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--growth-neon)', marginBottom: '0.5rem' }}>{displayCompany}</div>
                <div style={{ color: 'var(--growth-dim)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>📍 {displayLocation}</div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--growth-border)' }}>
                <div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--growth-dim)', fontWeight: 800 }}>
                        {job ? 'COMPENSATION' : 'EQUITY_SHARE'}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                        {displayEquity}
                    </div>
                </div>
                {slug ? (
                    <a 
                        href={detailsUrl}
                        className="opp-join-btn"
                        style={{ 
                            background: 'none', 
                            border: '1px solid var(--growth-neon)', 
                            color: 'var(--growth-neon)', 
                            padding: '0.5rem 1.5rem', 
                            borderRadius: '8px', 
                            fontSize: '0.75rem', 
                            fontWeight: 700,
                            textDecoration: 'none',
                            transition: 'all 0.2s ease'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        APPLY
                    </a>
                ) : (
                    <button style={{ background: 'none', border: '1px solid var(--growth-neon)', color: 'var(--growth-neon)', padding: '0.5rem 1.5rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>JOIN</button>
                )}
            </div>
        </div>
    );
};

interface OpportunityGridProps {
    jobs?: JobListing[] | null;
    loading?: boolean;
}

export const OpportunityGrid = ({ jobs, loading }: OpportunityGridProps) => {
    // Rich default mock backups
    const fallbackOpportunities = [
        { title: "Founding Engineer (Rust)", company: "Nexus.AI", equity: "1.5% - 2.5%", stage: "Series A", location: "San Francisco / Remote" },
        { title: "Head of Protocol Growth", company: "Aether Labs", equity: "1.0% - 2.0%", stage: "Seed+", location: "Berlin / Hybrid" },
        { title: "Senior Solidity Architect", company: "Void Capital", equity: "2.0% - 3.5%", stage: "Series B", location: "Singapore / Remote" },
        { title: "Lead Product Designer", company: "Orbital Systems", equity: "0.5% - 1.2%", stage: "Series A", location: "Austin / On-site" },
        { title: "DevOps / Infrastructure", company: "Cyber Node", equity: "0.8% - 1.5%", stage: "Seed", location: "London / Remote" },
        { title: "Growth Marketing Lead", company: "Scale Protocol", equity: "1.2% - 2.2%", stage: "Series A", location: "New York / Hybrid" },
    ];

    if (loading) {
        return (
            <section className="opportunity-grid">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <div key={idx} className="opportunity-card growth-panel growth-skeleton-card" style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div className="growth-skeleton" style={{ width: '80px', height: '20px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
                            <div className="growth-skeleton" style={{ width: '70%', height: '28px', marginTop: '1.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
                            <div className="growth-skeleton" style={{ width: '40%', height: '20px', marginTop: '1rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="growth-skeleton" style={{ width: '100px', height: '24px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
                            <div className="growth-skeleton" style={{ width: '70px', height: '30px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
                        </div>
                    </div>
                ))}
            </section>
        );
    }

    const itemsToRender = jobs && jobs.length > 0 ? jobs : null;

    return (
        <section className="opportunity-grid">
            {itemsToRender ? (
                itemsToRender.map((job) => <OpportunityCard key={job.id} job={job} />)
            ) : (
                fallbackOpportunities.map((o, i) => <OpportunityCard key={i} {...o} />)
            )}
        </section>
    );
};
