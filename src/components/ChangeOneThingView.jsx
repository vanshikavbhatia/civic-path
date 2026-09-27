import React, { useState, useEffect } from 'react';
import { GitCompare, PlusCircle, MinusCircle, RefreshCw, ArrowRight, IndianRupee, Clock, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { compareScenarios } from '../services/api';

export default function ChangeOneThingView({ baseQualifiers, onApplyScenario }) {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedChange, setSelectedChange] = useState('commercial_shift');

  const presetScenarios = [
    {
      id: 'commercial_shift',
      title: 'Shift: Home Kitchen → Commercial Bakery Shop',
      description: 'Changes establishment from domestic kitchen to high-street commercial premises with 15 staff and turnover > ₹12 Lakhs.',
      modified: {
        establishmentType: 'commercial',
        location: 'Mumbai',
        scale: 'small',
        employees: 15,
        turnoverLakhs: 25
      }
    },
    {
      id: 'scale_up_employees',
      title: 'Scale: 2 Helpers → 12 Full-Time Staff',
      description: 'Crosses the 10-worker threshold under Maharashtra Shops & Establishments Act 2017.',
      modified: {
        establishmentType: 'home',
        location: 'Mumbai',
        scale: 'micro',
        employees: 12,
        turnoverLakhs: 10
      }
    },
    {
      id: 'turnover_crossover',
      title: 'Turnover: Under ₹12L → Above ₹12L (Commercial FSSAI)',
      description: 'Exceeds the Petty Food Business threshold, triggering full FSSAI State Food License Form B.',
      modified: {
        establishmentType: 'home',
        location: 'Mumbai',
        scale: 'micro',
        employees: 4,
        turnoverLakhs: 20
      }
    }
  ];

  useEffect(() => {
    runComparison(presetScenarios[0].modified);
  }, []);

  const runComparison = async (modified) => {
    try {
      setLoading(true);
      const res = await compareScenarios(baseQualifiers, modified);
      setComparison(res);
    } catch (err) {
      console.error('Comparison failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (scenario) => {
    setSelectedChange(scenario.id);
    runComparison(scenario.modified);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            "Change One Thing" — Differential Dependency Comparator
          </h2>
          <span className="badge badge-available">
            <Sparkles size={12} /> Innovation USP
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
          Demonstrates that Civic Path synthesizes a <em>tailored statutory graph</em> instead of outputting generic checklists.
        </p>
      </div>

      {/* Preset Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12, marginBottom: 24 }}>
        {presetScenarios.map((sc) => {
          const isSelected = selectedChange === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => handleSelectPreset(sc)}
              className="civic-card"
              style={{
                padding: 16,
                cursor: 'pointer',
                borderColor: isSelected ? '#2563eb' : '#e2e8f0',
                backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                borderWidth: isSelected ? 2 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {sc.title}
                </h4>
                {isSelected && <Check size={16} color="#2563eb" />}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                {sc.description}
              </p>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Recalculating graph and statutory differences...
        </div>
      ) : comparison ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Delta Metrics Bar */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 14,
              padding: 20,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                Requirements Added
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#059669', marginTop: 2 }}>
                +{comparison.added?.length || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>New compliance mandates</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>
                Requirements Removed
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#dc2626', marginTop: 2 }}>
                -{comparison.removed?.length || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Waived home-specific steps</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>
                Requirements Modified
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#d97706', marginTop: 2 }}>
                ~{comparison.changed?.length || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Escalated tier / scrutiny</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                Statutory Cost Delta
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1e40af', marginTop: 2 }}>
                ₹{comparison.modifiedCost?.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Base was ₹{comparison.baseCost?.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Detailed Lists */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            
            {/* 1. Added Requirements */}
            <div className="civic-card" style={{ padding: 20, borderTop: '4px solid #059669' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <PlusCircle size={20} color="#059669" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#065f46', margin: 0 }}>
                  ADDED REQUIREMENTS ({comparison.added?.length})
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {comparison.added?.map((req) => (
                  <div key={req.id} style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#064e3b' }}>{req.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: 2 }}>
                      Department: {req.department}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', marginTop: 4 }}>
                      Statutory Fee: {req.cost || (typeof req.fee === 'number' ? `₹${req.fee.toLocaleString('en-IN')}` : '₹0 (Free)')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Removed Requirements */}
            <div className="civic-card" style={{ padding: 20, borderTop: '4px solid #dc2626' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <MinusCircle size={20} color="#dc2626" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                  REMOVED REQUIREMENTS ({comparison.removed?.length})
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {comparison.removed?.map((req) => (
                  <div key={req.id} style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#7f1d1d' }}>{req.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#991b1b', marginTop: 2 }}>
                      Department: {req.department}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: 4 }}>
                      Waived or replaced by commercial equivalent.
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Changed Requirements */}
            <div className="civic-card" style={{ padding: 20, borderTop: '4px solid #d97706' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <RefreshCw size={20} color="#d97706" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#92400e', margin: 0 }}>
                  CHANGED REQUIREMENTS ({comparison.changed?.length})
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {comparison.changed?.length > 0 ? (
                  comparison.changed.map((item, idx) => (
                    <div key={idx} style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#78350f' }}>{item.before?.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#92400e', marginTop: 4 }}>
                        {item.reasons?.join('; ')}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                    Core baseline standards remain consistent.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Action CTA to switch user's active roadmap */}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button
              onClick={() => {
                const sc = presetScenarios.find(s => s.id === selectedChange);
                if (sc && onApplyScenario) onApplyScenario(sc.modified);
              }}
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.9375rem' }}
            >
              Apply This Modified Scenario to My Active Roadmap
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      ) : null}

    </div>
  );
}
