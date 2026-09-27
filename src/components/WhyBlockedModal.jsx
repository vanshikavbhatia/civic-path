import React from 'react';
import { AlertOctagon, X, CheckCircle, ExternalLink, ArrowRight, ShieldCheck, UploadCloud, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WhyBlockedModal({
  isOpen,
  onClose,
  blockedData,
  onCompletePrerequisite,
  onNavigateToUpload
}) {
  if (!isOpen || !blockedData) return null;

  const {
    currentStepTitle,
    currentStepDepartment,
    stepTitle,
    missingSteps = [],
    missingDocs = [],
    message,
    requiredDocName,
    type,
    summary
  } = blockedData;

  const displayTitle = currentStepTitle || stepTitle || 'Step Locked';
  const isDocBlocked = type === 'MISSING_DOCUMENT' || (missingDocs && missingDocs.length > 0);

  const handleResolvePrereq = (stepId) => {
    if (onCompletePrerequisite) {
      onCompletePrerequisite(stepId);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
  };

  const handleUploadClick = () => {
    onClose();
    if (onNavigateToUpload) {
      onNavigateToUpload();
    } else {
      document.getElementById('civic-documents-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
    >
      <div
        className="civic-card"
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.25)',
          border: '2px solid #fecaca'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fef2f2'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <AlertOctagon size={24} />
            </div>
            <div>
              <span className="badge badge-blocked" style={{ fontSize: '0.6875rem', marginBottom: 2 }}>
                Dependency Gate Active
              </span>
              <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                WHY AM I BLOCKED?
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Target Step Alert */}
          <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fecaca', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Attempted Step
            </div>
            <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
              {displayTitle}
            </div>
            {currentStepDepartment && (
              <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: 2 }}>
                Governing Department: <strong>{currentStepDepartment}</strong>
              </div>
            )}
          </div>

          {/* Missing Document Case (Part L) */}
          {isDocBlocked && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #fecaca', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', marginBottom: 4 }}>
                  Blocked Because:
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 6 }}>
                  ✗ {missingDocs.join(', ') || requiredDocName || 'Required document has not been uploaded.'}
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#475569', margin: '6px 0 14px', lineHeight: 1.4 }}>
                  Government regulations mandate that verifiable proof must be uploaded and pre-verified before this step can become available.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: 12, borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={18} color="#2563eb" />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                      Required document: {requiredDocName || missingDocs[0]}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="btn btn-primary"
                    style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                  >
                    <UploadCloud size={14} /> Upload Document
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Missing Prerequisite Steps Case */}
          {missingSteps && missingSteps.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', lineHeight: 1.4 }}>
                Missing prior prerequisite step(s) in sequence:
              </div>

              {missingSteps.map((prereq, index) => (
                <div
                  key={prereq.id || index}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: 16,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {index + 1}
                        </span>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                          {prereq.title}
                        </h4>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4, marginLeft: 28 }}>
                        Department: {prereq.department}
                      </div>
                    </div>

                    <button
                      onClick={() => handleResolvePrereq(prereq.id)}
                      className="btn btn-success"
                      style={{ fontSize: '0.75rem', padding: '6px 12px', flexShrink: 0 }}
                      title="Mark this prerequisite as completed to unlock dependent step"
                    >
                      <CheckCircle size={14} /> Complete Prerequisite
                    </button>
                  </div>

                  {prereq.explanation && (
                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: 8,
                        padding: '10px 12px',
                        marginTop: 12,
                        borderLeft: '3px solid #3b82f6'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', marginBottom: 2 }}>
                        Why It Is Required:
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#334155', margin: 0, lineHeight: 1.4 }}>
                        {prereq.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* General summary fallback if no explicit list */}
          {!isDocBlocked && (!missingSteps || missingSteps.length === 0) && (
            <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
              {message || summary || 'This step is locked by prior compliance requirements in the statutory sequence.'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Uploading required documents automatically recalculates your graph.
          </span>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
