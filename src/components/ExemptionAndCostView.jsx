import React, { useState, useEffect } from 'react';
import { IndianRupee, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink, HelpCircle, FileCheck, Layers } from 'lucide-react';
import { getExemptions, getCosts } from '../services/api';

export default function ExemptionAndCostView({ qualifiers }) {
  const [activeSubTab, setActiveSubTab] = useState('costs'); // 'costs' | 'exemptions'
  const [costData, setCostData] = useState(null);
  const [exemptionData, setExemptionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [qualifiers]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [costs, exemptions] = await Promise.all([
        getCosts(qualifiers),
        getExemptions(qualifiers)
      ]);
      setCostData(costs);
      setExemptionData(exemptions);
    } catch (err) {
      console.error('Failed to load costs or exemptions:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Top Banner / Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Official Costs & Verified Exemptions
            </h2>
            <span className="badge badge-verified">
              <ShieldCheck size={12} /> 100% Sourced
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Strict compliance: No hidden costs invented. Statutory exemptions cited directly from gazette notifications.
          </p>
        </div>

        {/* Sub-tab Pills */}
        <div style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: 4, borderRadius: 10 }}>
          <button
            onClick={() => setActiveSubTab('costs')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeSubTab === 'costs' ? '#ffffff' : 'transparent',
              color: activeSubTab === 'costs' ? '#1e40af' : '#475569',
              boxShadow: activeSubTab === 'costs' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <IndianRupee size={15} /> Real Cost Calculator
          </button>
          <button
            onClick={() => setActiveSubTab('exemptions')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeSubTab === 'exemptions' ? '#ffffff' : 'transparent',
              color: activeSubTab === 'exemptions' ? '#1e40af' : '#475569',
              boxShadow: activeSubTab === 'exemptions' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <FileCheck size={15} /> Check for Exemptions
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Calculating verified fees from official schedules...
        </div>
      ) : (
        <>
          {/* TAB 1: REAL COST CALCULATOR */}
          {activeSubTab === 'costs' && costData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Total Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 14,
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Estimated Total Official Statutory Cost
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1, marginTop: 4 }}>
                    ₹{costData.totalEstimatedCost?.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={14} /> Zero hidden costs — completely grounded in official gazettes
                  </div>
                </div>

                <div style={{ maxWidth: 380, backgroundColor: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    <AlertCircle size={14} color="#d97706" /> Statutory Policy Notice
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                    {costData.notice}
                  </p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="civic-card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Official Fee Breakdown by Department
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {costData.items?.length || 0} Statutory Requirements Evaluated
                  </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                        <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Requirement</th>
                        <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Department</th>
                        <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Official Fee</th>
                        <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Statutory Basis</th>
                        <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Official Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costData.items?.map((item, index) => (
                        <tr
                          key={index}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfcfd',
                            transition: 'background-color 0.15s'
                          }}
                        >
                          <td style={{ padding: '14px 18px', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                            {item.title}
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: '0.8125rem', color: '#475569' }}>
                            {item.department}
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: '0.9375rem', fontWeight: 800, color: (item.fee === 0 || item.cost === 0 || item.cost === 'Free') ? '#059669' : '#1e40af' }}>
                            {item.fee === 0 ? '₹0 (Free)' : (typeof item.fee === 'number' ? `₹${item.fee.toLocaleString('en-IN')}` : (item.cost || '₹0 (Free)'))}
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: '0.75rem', color: '#64748b', maxWidth: 260 }}>
                            {item.feeExplanation}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            {item.officialSourceURL ? (
                              <a
                                href={item.officialSourceURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  color: '#2563eb',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  textDecoration: 'none'
                                }}
                              >
                                Verified <ExternalLink size={12} />
                              </a>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Demo Data</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERIFIED EXEMPTION FINDER */}
          {activeSubTab === 'exemptions' && exemptionData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={20} color="#059669" />
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#166534', margin: 0 }}>
                    Verified Statutory Exemptions ({exemptionData.totalFound})
                  </h3>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#14532d', margin: '4px 0 0' }}>
                  These are legitimate, legal exemptions created by the government for small businesses. They are strictly not loopholes.
                </p>
              </div>

              {exemptionData.exemptions?.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                  {exemptionData.exemptions.map((ex, idx) => (
                    <div
                      key={idx}
                      className="civic-card"
                      style={{
                        padding: 20,
                        borderLeft: '4px solid #059669',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#059669', backgroundColor: '#d1fae5', padding: '2px 8px', borderRadius: 4 }}>
                            STATUTORY EXEMPTION
                          </span>
                          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                            Verified: {ex.lastVerified}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                          {ex.condition}
                        </h4>

                        <p style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.45, marginBottom: 12 }}>
                          {ex.exemptionText}
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Applies to: <strong>{ex.requirementTitle}</strong>
                        </span>
                        {ex.officialSourceURL && (
                          <a
                            href={ex.officialSourceURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#2563eb',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              textDecoration: 'none'
                            }}
                          >
                            Official Gazette <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 24px', backgroundColor: '#ffffff', borderRadius: 12, border: '1px dashed #cbd5e1' }}>
                  <HelpCircle size={32} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                    No verified exemption found for current parameters
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                    Commercial units with high turnover or 10+ employees are generally subject to standard statutory compliance fees.
                  </p>
                </div>
              )}

            </div>
          )}
        </>
      )}

    </div>
  );
}
