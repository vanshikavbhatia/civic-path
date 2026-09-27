import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, Lock, ArrowRight, Clock, AlertTriangle, ExternalLink } from 'lucide-react';

function CivicStepNode({ data = {}, selected }) {
  const {
    title,
    department,
    requirementType,
    fee,
    cost,
    status,
    missingPrerequisites = [],
    officialSourceURL,
    onWhyBlockedClick,
    onToggleClick
  } = data || {};

  const isCompleted = status === 'COMPLETED';
  const isAvailable = status === 'AVAILABLE';
  const isBlocked = status === 'BLOCKED';
  const isInProgress = status === 'IN_PROGRESS';

  // State-specific styles
  let borderColor = '#cbd5e1';
  let bgColor = '#ffffff';
  let statusBadge = null;

  if (isCompleted) {
    borderColor = '#10b981';
    bgColor = '#f0fdf4';
    statusBadge = (
      <span className="badge badge-completed">
        <CheckCircle2 size={12} /> Completed
      </span>
    );
  } else if (isAvailable) {
    borderColor = '#3b82f6';
    bgColor = '#eff6ff';
    statusBadge = (
      <span className="badge badge-available pulse-available">
        <ArrowRight size={12} /> Available
      </span>
    );
  } else if (isBlocked) {
    borderColor = '#f87171';
    bgColor = '#fff5f5';
    statusBadge = (
      <span className="badge badge-blocked">
        <Lock size={12} /> Blocked
      </span>
    );
  } else if (isInProgress) {
    borderColor = '#6366f1';
    bgColor = '#eef2ff';
    statusBadge = (
      <span className="badge badge-in-progress">
        <Clock size={12} /> In Progress
      </span>
    );
  }

  return (
    <div
      style={{
        width: 290,
        backgroundColor: bgColor,
        borderColor: selected ? '#1e40af' : borderColor,
        borderWidth: selected ? 2 : 1.5,
        borderStyle: 'solid',
        borderRadius: 12,
        padding: '14px 16px',
        boxShadow: selected
          ? '0 0 0 4px rgba(30, 64, 175, 0.15), 0 8px 20px -2px rgba(0,0,0,0.1)'
          : '0 2px 8px -1px rgba(0,0,0,0.06)'
      }}
      className="civic-flow-node relative transition-all"
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: isCompleted ? '#10b981' : isAvailable ? '#3b82f6' : '#94a3b8',
          width: 10,
          height: 10
        }}
      />

      {/* Top Header: Type & Status Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: 800,
            color: '#64748b',
            letterSpacing: '0.05em',
            backgroundColor: '#f1f5f9',
            padding: '2px 6px',
            borderRadius: 4
          }}
        >
          {requirementType || 'PROCEDURE'}
        </span>
        {statusBadge}
      </div>

      {/* Title */}
      <h4
        style={{
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: isCompleted ? '#065f46' : '#0f172a',
          lineHeight: 1.3,
          marginBottom: 4
        }}
      >
        {title}
      </h4>

      {/* Department */}
      <p
        style={{
          fontSize: '0.75rem',
          color: '#64748b',
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}
      >
        <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#94a3b8' }} />
        {department}
      </p>

      {/* Footer Details: Fee & Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #e2e8f0',
          paddingTop: 8,
          marginTop: 6
        }}
      >
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: (fee === 0 || cost === 0 || cost === 'Free' || cost === '₹0 (Free)') ? '#059669' : '#1e40af'
          }}
        >
          {cost !== undefined && cost !== null
            ? (typeof cost === 'number' ? (cost === 0 ? '₹0 (Free)' : `₹${cost.toLocaleString('en-IN')}`) : cost)
            : typeof fee === 'number'
              ? (fee === 0 ? '₹0 (Free)' : `₹${fee.toLocaleString('en-IN')}`)
              : '₹0 (Free)'}
        </span>

        <div style={{ display: 'flex', gap: 6 }}>
          {isBlocked && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onWhyBlockedClick) onWhyBlockedClick(data);
              }}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#dc2626',
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: 6,
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
              title="Click to see why this step is blocked"
            >
              <AlertTriangle size={12} /> Why am I blocked?
            </button>
          )}

          {!isBlocked && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleClick) onToggleClick(data.id);
              }}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: isCompleted ? '#475569' : '#ffffff',
                backgroundColor: isCompleted ? '#e2e8f0' : '#1e40af',
                border: 'none',
                borderRadius: 6,
                padding: '4px 8px',
                cursor: 'pointer'
              }}
            >
              {isCompleted ? 'Mark Undone' : 'Mark Done'}
            </button>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: isCompleted ? '#10b981' : isAvailable ? '#3b82f6' : '#94a3b8',
          width: 10,
          height: 10
        }}
      />
    </div>
  );
}

export default memo(CivicStepNode);
