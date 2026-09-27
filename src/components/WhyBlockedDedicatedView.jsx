import React, { useState } from 'react';
import { AlertOctagon, Lock, CheckCircle2, ArrowRight, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WhyBlockedDedicatedView({ graphData, onResolvePrerequisite }) {
  const nodes = graphData?.nodes || [];
  const blockedNodes = nodes.filter(n => n.status === 'BLOCKED');
  const [selectedBlockedId, setSelectedBlockedId] = useState(blockedNodes[0]?.id || null);

  const selectedNode = nodes.find(n => n.id === selectedBlockedId) || blockedNodes[0];

  const handleResolve = (prereqId) => {
    if (onResolvePrerequisite) {
      onResolvePrerequisite(prereqId);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // fallback
      }
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            "Why Am I Blocked?" — Dependency Gate Intelligence
          </h2>
          <span className="badge badge-blocked">
            <Lock size={12} /> Core Innovation USP
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
          Government portals tell citizens where to apply. Civic Path explains: <em>"Before you can do this, you need these 2 things. Completing this requirement unlocks the next step."</em>
        </p>
      </div>

      {blockedNodes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #bbf7d0' }}>
          <CheckCircle2 size={48} color="#059669" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46', marginBottom: 6 }}>
            All Dependency Gates Clear!
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>
            Every prerequisite has been completed. All downstream civic procedures are now fully unlocked and available for submission.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'flex-start' }}>
          
          {/* Left: List of Blocked Steps */}
          <div className="civic-card" style={{ padding: 16 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
              Blocked Requirements ({blockedNodes.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {blockedNodes.map((bNode) => {
                const isSelected = selectedNode?.id === bNode.id;
                return (
                  <div
                    key={bNode.id}
                    onClick={() => setSelectedBlockedId(bNode.id)}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      border: isSelected ? '2px solid #dc2626' : '1px solid #fee2e2',
                      backgroundColor: isSelected ? '#fef2f2' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <Lock size={14} color="#dc2626" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                        {bNode.title}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {bNode.department}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed "Why am I blocked?" Breakdown */}
          {selectedNode && selectedNode.blockedReason ? (
            <div className="civic-card" style={{ padding: 24, borderLeft: '6px solid #dc2626' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span className="badge badge-blocked">
                  <AlertOctagon size={12} /> Statutory Dependency Lock
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Procedure: {selectedNode.department}
                </span>
              </div>

              <h3 style={{ fontSize: '1.375rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
                You cannot complete {selectedNode.title} yet.
              </h3>

              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: '0 0 20px' }}>
                {selectedNode.blockedReason.summary}
              </p>

              {/* Missing Prerequisites List */}
              <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                Missing Prerequisites to Fulfill First:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {selectedNode.blockedReason.missingSteps?.map((ms, idx) => (
                  <div
                    key={ms.id || idx}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      padding: 16,
                      backgroundColor: '#ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            {idx + 1}
                          </span>
                          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                            {ms.title}
                          </h4>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 26, marginTop: 2 }}>
                          Department: {ms.department}
                        </div>
                      </div>

                      {/* 1-Click Prerequisite Completion Button */}
                      <button
                        onClick={() => handleResolve(ms.id)}
                        className="btn btn-success"
                        style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                      >
                        <CheckCircle2 size={14} /> Complete This First (Demo)
                      </button>
                    </div>

                    {/* Statutory Reason */}
                    <div style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginTop: 12, borderLeft: '3px solid #2563eb' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', marginBottom: 2 }}>
                        Why It Is Statutorily Required:
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#334155', margin: 0, lineHeight: 1.45 }}>
                        {ms.explanation}
                      </p>
                    </div>

                    {/* Official Source Link */}
                    {ms.officialSourceURL && (
                      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <a
                          href={ms.officialSourceURL}
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
                          <ShieldCheck size={13} color="#059669" />
                          View Official Government Circular / Rule
                          <ExternalLink size={12} />
                        </a>
                        <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                          Verified Portal Citation
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="civic-card" style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>
              Select a blocked step on the left to analyze its statutory dependency gate.
            </div>
          )}

        </div>
      )}

    </div>
  );
}
