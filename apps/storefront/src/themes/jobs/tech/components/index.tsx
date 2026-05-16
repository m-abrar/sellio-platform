
'use client';
import React from 'react';

export const JobNexusEntry = ({ role, company, salary, tags, description, index }: any) => (
  <div className="jt-job-entry">
    <div className="jt-line-numbers" style={{ 
        padding: '2.5rem 1.5rem', 
        background: 'rgba(0,0,0,0.4)', 
        color: 'var(--jt-purple)', 
        textAlign: 'right', 
        fontSize: '0.7rem', 
        fontWeight: 800,
        fontFamily: 'var(--jt-font-mono)',
        borderRight: '1px solid var(--jt-border)'
    }}>
        {index < 10 ? `00${index}` : `0${index}`}<br/>
        {index + 100}<br/>
        {index + 200}<br/>
        {index + 300}
    </div>
    <div className="jt-job-content" style={{ padding: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '0.4rem 1rem', background: 'rgba(178, 123, 255, 0.1)', color: 'var(--jt-purple)', fontSize: '0.6rem', fontWeight: 900, borderRadius: '2px', border: '1px solid var(--jt-border)' }}>
                        DEPLOY_STATUS: ACTIVE
                    </div>
                    <span className="jt-comment" style={{ fontSize: '0.75rem' }}>// {company.toUpperCase()}</span>
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-1px' }}>{role}</h3>
                <p style={{ color: 'var(--jt-text-dim)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '800px' }}>
                    {description}
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {tags.map((tag: string) => (
                        <span key={tag} style={{ color: 'var(--jt-cyan)', fontFamily: 'var(--jt-font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>
                            #{tag.toLowerCase().replace(/ /g, '_')}
                        </span>
                    ))}
                </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: '150px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--jt-purple)', marginBottom: '0.5rem' }}>{salary}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--jt-text-dim)', fontWeight: 800, marginBottom: '3rem' }}>ANNUAL_COMPENSATION</div>
                <button className="jt-btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '0.7rem' }}>Initialize Apply</button>
            </div>
        </div>
    </div>
  </div>
);
