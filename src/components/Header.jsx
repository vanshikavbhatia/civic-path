import React from 'react';
import { Compass, ShieldCheck, RefreshCw, Layers, Lock, IndianRupee, BellRing, GitCompare, FileCheck2, UserCheck, BookOpen } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onResetDemo, isResetting }) {
  const navTabs = [
    { id: 'roadmap', label: 'Civic Navigator', icon: Compass },
    { id: 'why_blocked', label: 'Why Am I Blocked?', icon: Lock },
    { id: 'exemptions_costs', label: 'Exemptions & Costs', icon: IndianRupee },
    { id: 'update_watch', label: 'Update Watchdog', icon: BellRing },
    { id: 'change_one_thing', label: 'Change One Thing', icon: GitCompare },
    { id: 'doc_checker', label: 'Document Checker', icon: FileCheck2 },
    { id: 'my_case', label: 'My Civic Case', icon: UserCheck },
    { id: 'official_sources', label: 'Official Sources', icon: BookOpen }
  ];

  return (
    <header className="civic-glass sticky top-0 z-40 border-b border-slate-200">
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '12px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          
          {/* Logo & Brand Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(30, 64, 175, 0.3)'
              }}
            >
              <Compass size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                  CIVIC PATH
                </h1>
                <span className="badge badge-verified" style={{ fontSize: '0.6875rem' }}>
                  <ShieldCheck size={12} /> Verified Gov Data
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Intelligent Civic Procedure & Compliance Navigator
              </p>
            </div>
          </div>

          {/* Judge / Demo Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={onResetDemo}
              disabled={isResetting}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              title="Reset case and database to clean benchmark state for presentation"
            >
              <RefreshCw size={13} className={isResetting ? 'animate-spin' : ''} />
              {isResetting ? 'Resetting...' : 'Reset Demo Benchmark'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: 4, overflowX: 'auto', marginTop: 12, paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#1e40af' : '#64748b',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #1e40af' : '2px solid transparent',
                  borderRadius: '6px 6px 0 0',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} color={isActive ? '#1e40af' : '#64748b'} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
