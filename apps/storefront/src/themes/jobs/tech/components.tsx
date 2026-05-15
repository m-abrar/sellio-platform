import React from 'react';

export const TerminalHeader = () => (
  <header className="terminal-header">
    <div className="terminal-tabs">
      <div className="terminal-tab">jobs.ts</div>
      <div style={{ padding: '0.5rem 1rem', opacity: 0.3 }}>candidates.py</div>
      <div style={{ padding: '0.5rem 1rem', opacity: 0.3 }}>env.local</div>
    </div>
    <div className="terminal-path">~/sellio/src/themes/jobs/tech</div>
  </header>
);

export const StatusBar = () => (
  <footer className="status-bar-footer">
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      <span>UTF-8</span>
      <span>TypeScript</span>
      <span>main*</span>
    </div>
    <div>Ln 1, Col 1 // 100% SECURE</div>
  </footer>
);

export const JobIDEEntry = ({ title, company, salary, tags, index }: { title: string, company: string, salary: string, tags: string[], index: number }) => (
  <div className="job-card-ide">
    <div className="line-numbers">
      {String(index * 10 + 1).padStart(2, '0')}<br/>
      {String(index * 10 + 2).padStart(2, '0')}<br/>
      {String(index * 10 + 3).padStart(2, '0')}
    </div>
    <div className="job-content-ide">
      <h3 className="job-title-ide">export const {title.replace(/\s+/g, '')} = () =&gt; ...</h3>
      <div style={{ marginBottom: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>
        <span style={{ color: '#f472b6' }}>company:</span> "{company}",<br/>
        <span style={{ color: '#f472b6' }}>salary:</span> "{salary}"
      </div>
      <div className="tags-container">
        {tags.map(tag => (
          <span key={tag} className="tag-ide">[{tag}]</span>
        ))}
      </div>
    </div>
  </div>
);
