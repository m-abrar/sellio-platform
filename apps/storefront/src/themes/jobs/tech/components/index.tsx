'use client';
import React from 'react';

export const Header = () => (
  <nav className="jt-terminal-nav">
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ fontWeight: 800, color: 'var(--jt-green)' }}>TERMINAL_V1.0</div>
      <div className="jt-tabs">
        {['jobs.sh', 'experts.md', 'registry.json'].map((tab, i) => (
          <div key={tab} className={`jt-tab ${i === 0 ? 'active' : ''}`}>
            {tab}
          </div>
        ))}
      </div>
    </div>
    
    <div style={{ display: 'flex', gap: '2rem', color: 'var(--jt-text-dim)' }}>
        <span>UTF-8</span>
        <span style={{ color: 'var(--jt-green)' }}>master*</span>
    </div>
  </nav>
);

export const StatusBar = () => (
  <div className="jt-status-bar">
    <div style={{ display: 'flex', gap: '2rem' }}>
        <span>NORMAL</span>
        <span>jobs.sh</span>
        <span>100%</span>
    </div>
    <div style={{ display: 'flex', gap: '2rem' }}>
        <span>javascript</span>
        <span>Ln 1, Col 1</span>
        <span>SELLIO_OS</span>
    </div>
  </div>
);

export const JobIDEEntry = ({ title, company, salary, tags, index }: any) => (
  <div className="jt-job-entry">
    <div className="jt-line-numbers">
        {index < 10 ? `0${index}` : index}<br/>
        {(index * 2)}<br/>
        {(index * 2) + 1}
    </div>
    <div className="jt-job-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <span className="jt-keyword">const</span> <span className="jt-function">{title.replace(/ /g, '_')}</span> = {'{'}<br/>
                &nbsp;&nbsp;company: <span className="jt-string">"{company}"</span>,<br/>
                &nbsp;&nbsp;salary: <span className="jt-string">"{salary}"</span>,<br/>
                &nbsp;&nbsp;stack: [<span className="jt-string">{tags.map((t: string) => `"${t}"`).join(', ')}</span>]<br/>
                {'}'};
            </div>
            <button className="jt-btn-primary" style={{ padding: '0.4rem 1.2rem', fontSize: '0.65rem' }}>
                --EXECUTE
            </button>
        </div>
    </div>
  </div>
);

export const TerminalBlock = ({ title, lines }: { title: string, lines: string[] }) => (
    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderLeft: '4px solid var(--jt-green)', marginTop: '4rem' }}>
        <div className="jt-comment" style={{ marginBottom: '1.5rem' }}>// {title}</div>
        {lines.map((line, i) => (
            <div key={i} style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--jt-green)', marginRight: '1rem' }}>&gt;</span>
                {line}
            </div>
        ))}
    </div>
);
