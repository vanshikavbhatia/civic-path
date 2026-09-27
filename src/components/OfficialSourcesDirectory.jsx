import React, { useState, useEffect } from 'react';
import { BookOpen, ShieldCheck, ExternalLink, Search, CheckCircle2, Clock, Globe } from 'lucide-react';
import { getGovernmentSources } from '../services/api';

export default function OfficialSourcesDirectory() {
  const [sources, setSources] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      setLoading(true);
      const data = await getGovernmentSources();
      setSources(data);
    } catch (err) {
      console.error('Failed to load sources:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = sources.filter(s =>
    s.department?.toLowerCase().includes(search.toLowerCase()) ||
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.authority?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Government Source Transparency Registry
            </h2>
            <span className="badge badge-verified">
              <ShieldCheck size={12} /> Strict Anti-Hallucination Policy
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Every legal requirement in Civic Path is pinned to an official government portal, circular, or statutory act.
          </p>
        </div>

        {/* Search Filter */}
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 11 }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search departments or acts..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: '0.8125rem'
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading government sources registry...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          {filtered.map((src) => (
            <div
              key={src.id}
              className="civic-card"
              style={{
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: src.verificationStatus === 'verified' ? '4px solid #059669' : '4px solid #d97706'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span
                    className={`badge ${
                      src.verificationStatus === 'verified' ? 'badge-verified' : 'badge-demo'
                    }`}
                  >
                    {src.verificationStatus === 'verified' ? '✓ Official Source' : '⚠ Demo Data'}
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                    Type: {src.sourceType}
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                  {src.title}
                </h3>

                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1e40af', marginBottom: 2 }}>
                  {src.department}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 12 }}>
                  Authority: {src.authority} • Jurisdiction: {src.location}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: '0.75rem', color: '#64748b' }}>
                  <span>Last Checked: <strong>{src.lastChecked}</strong></span>
                  <span>Status: <strong style={{ color: '#059669' }}>{src.status}</strong></span>
                </div>

                {src.url ? (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{
                      width: '100%',
                      fontSize: '0.75rem',
                      padding: '8px',
                      color: '#1e40af',
                      borderColor: '#bfdbfe',
                      backgroundColor: '#eff6ff'
                    }}
                  >
                    <Globe size={13} /> Visit Official Portal ({src.url.replace('https://', '').split('/')[0]}) <ExternalLink size={12} />
                  </a>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', padding: 6 }}>
                    No public URL available (Curated statutory demo rule)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
