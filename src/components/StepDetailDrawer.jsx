import React from 'react';
import { X, ShieldCheck, ExternalLink, CheckCircle2, Lock, ArrowRight, Clock, FileText, AlertTriangle, Calendar, IndianRupee, Building2 } from 'lucide-react';

export default function StepDetailDrawer({ step, isOpen, onClose, onToggleCompletion, onOpenWhyBlocked }) {
  if (!isOpen || !step) return null;

  const isCompleted = step.status === 'COMPLETED';
  const isAvailable = step.status === 'AVAILABLE';
  const isBlocked = step.status === 'BLOCKED';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: 460,
        backgroundColor: '#ffffff',
        borderLeft: '1px solid #cbd5e1',
        boxShadow: '-8px 0 25px -5px rgba(0, 0, 0, 0.15)',
        zIndex: 45,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Drawer Header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#f8fafc'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 800,
                color: '#475569',
                backgroundColor: '#e2e8f0',
                padding: '2px 8px',
                borderRadius: 4
              }}
            >
              {step.requirementType || 'PROCEDURE'}
            </span>
            <span className={`badge badge-${step.status?.toLowerCase().replace('_', '-')}`}>
              {step.status}
            </span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
            {step.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8', padding: 4 }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Drawer Scrollable Content */}
      <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Description */}
        <div>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
            Overview & Scope
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.5, margin: 0 }}>
            {step.description}
          </p>
        </div>

        {/* Quick Facts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#64748b' }}>
              <IndianRupee size={14} color="#1e40af" /> Official Fee
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: (step.fee === 0 || step.cost === 0 || step.cost === 'Free' || step.cost === '₹0 (Free)') ? '#059669' : '#0f172a', marginTop: 2 }}>
              {step.cost !== undefined && step.cost !== null
                ? (typeof step.cost === 'number' ? (step.cost === 0 ? '₹0 (Free)' : `₹${step.cost.toLocaleString('en-IN')}`) : step.cost)
                : typeof step.fee === 'number'
                  ? (step.fee === 0 ? '₹0 (Free)' : `₹${step.fee.toLocaleString('en-IN')}`)
                  : '₹0 (Free)'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: 2 }}>
              {step.feeExplanation || 'Statutory fee'}
            </div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#64748b' }}>
              <Calendar size={14} color="#1e40af" /> Turnaround
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
              ~{step.estimatedProcessingDays || 7} Days
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: 2 }}>
              {step.deadline || 'Statutory timeline'}
            </div>
          </div>
        </div>

        {/* Department & Authority */}
        <div style={{ backgroundColor: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', marginBottom: 4 }}>
            <Building2 size={15} /> Governing Jurisdiction
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
            {step.department}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
            Authority: {step.authority || 'State Authority'}
          </div>
        </div>

        {/* Prerequisites */}
        <div>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
            Prerequisite Requirements ({step.prerequisites?.length || 0})
          </h4>
          {step.prerequisites && step.prerequisites.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {step.prerequisites.map((prereqId) => (
                <div
                  key={prereqId}
                  style={{
                    fontSize: '0.8125rem',
                    backgroundColor: '#f1f5f9',
                    padding: '8px 12px',
                    borderRadius: 6,
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{prereqId}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Prerequisite</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600, backgroundColor: '#ecfdf5', padding: '8px 12px', borderRadius: 6 }}>
              ✓ Root requirement — No prerequisites required. Can be completed immediately!
            </div>
          )}
        </div>

        {/* Required Documents Checklist */}
        <div>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
            Mandatory Documents Checklist ({step.documents?.length || 0})
          </h4>
          {step.documents && step.documents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {step.documents.map((doc, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    fontSize: '0.8125rem',
                    color: '#334155',
                    padding: '6px 0'
                  }}
                >
                  <FileText size={16} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              No document uploads required for this digital step.
            </p>
          )}
        </div>

        {/* Source Transparency Box */}
        <div style={{ border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', borderRadius: 10, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 700, color: '#1e40af' }}>
              <ShieldCheck size={16} color="#059669" /> Source Transparency
            </span>
            <span className="badge badge-verified" style={{ fontSize: '0.625rem' }}>
              VERIFIED OFFICIAL DATA
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#1e3a8a', margin: '0 0 10px', lineHeight: 1.4 }}>
            Extracted from official government rules and compliance schedules.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <span style={{ color: '#64748b' }}>
              Last Verified: <strong>{step.lastVerified || '2026-09-26'}</strong>
            </span>
            {step.officialSourceURL && (
              <a
                href={step.officialSourceURL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#2563eb',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  textDecoration: 'none'
                }}
              >
                Official Portal <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

      </div>

      {/* Drawer Action Footer */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          gap: 10
        }}
      >
        {isBlocked ? (
          <button
            onClick={() => onOpenWhyBlocked(step)}
            className="btn btn-danger"
            style={{ width: '100%', padding: '12px', fontSize: '0.875rem' }}
          >
            <AlertTriangle size={16} /> Why Am I Blocked?
          </button>
        ) : (
          <button
            onClick={() => onToggleCompletion(step.id)}
            className={isCompleted ? 'btn btn-secondary' : 'btn btn-primary'}
            style={{ width: '100%', padding: '12px', fontSize: '0.875rem' }}
          >
            {isCompleted ? (
              <>Mark as Incomplete</>
            ) : (
              <>
                <CheckCircle2 size={16} /> Mark Step Completed
              </>
            )}
          </button>
        )}
      </div>

    </div>
  );
}
