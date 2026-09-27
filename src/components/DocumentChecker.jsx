import React, { useState } from 'react';
import { UploadCloud, FileCheck, CheckCircle2, AlertTriangle, XCircle, ShieldAlert, FileText, Info } from 'lucide-react';
import { checkDocumentQuality } from '../services/api';

export default function DocumentChecker() {
  const [selectedDocType, setSelectedDocType] = useState('Aadhaar Card / Photo ID');
  const [fileMeta, setFileMeta] = useState({
    fileName: 'aadhaar_card_scan.pdf',
    fileSizeKb: 340
  });
  const [checkResult, setCheckResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const docTypes = [
    'Aadhaar Card / Photo ID',
    'Residential Electricity Bill (Domestic Proof)',
    'Housing Society CHS NOC Undertaking',
    'Potable Water Quality Test Report (IS 10500)',
    'Registered Rent Agreement / Lease Deed',
    'Kitchen Layout Architectural Blueprint'
  ];

  const handleRunCheck = async () => {
    try {
      setIsChecking(true);
      const res = await checkDocumentQuality({
        fileName: fileMeta.fileName,
        fileSizeKb: fileMeta.fileSizeKb,
        documentType: selectedDocType
      });
      setCheckResult(res);
    } catch (err) {
      console.error('Check failed:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSelectSample = (name, size, type) => {
    setFileMeta({ fileName: name, fileSizeKb: size });
    setSelectedDocType(type);
    setCheckResult(null);
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Pre-Submission Document Quality Checker
          </h2>
          <span className="badge badge-available">
            <FileCheck size={12} /> Pre-Flight Scan
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
          Validates document resolution, file formats, required pages, and validity dates before uploading to government portals.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        
        {/* Upload & Configuration Card */}
        <div className="civic-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: 6 }}>
              Select Statutory Document Type:
            </label>
            <select
              value={selectedDocType}
              onChange={(e) => {
                setSelectedDocType(e.target.value);
                setCheckResult(null);
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                backgroundColor: '#f8fafc'
              }}
            >
              {docTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Drag & Drop Simulation Zone */}
          <div
            style={{
              border: '2px dashed #93c5fd',
              backgroundColor: '#eff6ff',
              borderRadius: 12,
              padding: '32px 20px',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <UploadCloud size={36} color="#2563eb" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e40af' }}>
              {fileMeta.fileName}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
              Size: {fileMeta.fileSizeKb} KB • Ready for automated pre-flight scan
            </div>
          </div>

          {/* Quick Demo File Presets */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
              Load Test Document Cases:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <button
                type="button"
                onClick={() => handleSelectSample('fssai_water_report_2026.pdf', 620, 'Potable Water Quality Test Report (IS 10500)')}
                style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 6, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer' }}
              >
                Water Report (Valid)
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('electricity_bill_2023.jpg', 180, 'Residential Electricity Bill (Domestic Proof)')}
                style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 6, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer' }}
              >
                Electricity Bill (Old)
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('society_noc_scan.png', 12, 'Housing Society CHS NOC Undertaking')}
                style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 6, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer' }}
              >
                Tiny File (&lt;15KB)
              </button>
            </div>
          </div>

          <button
            onClick={handleRunCheck}
            disabled={isChecking}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            {isChecking ? 'Performing Document Quality Scan...' : 'Run Pre-Submission Quality Check'}
          </button>
        </div>

        {/* Results Card */}
        <div className="civic-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Verification Diagnostic Report
              </h3>
              {checkResult && (
                <span
                  className={`badge ${
                    checkResult.status === 'Accepted'
                      ? 'badge-verified'
                      : checkResult.status === 'Warning'
                      ? 'badge-demo'
                      : 'badge-blocked'
                  }`}
                >
                  {checkResult.status}
                </span>
              )}
            </div>

            {checkResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* Checks Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {checkResult.checks?.map((chk, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: 8,
                        fontSize: '0.8125rem'
                      }}
                    >
                      <span style={{ color: '#1e293b', fontWeight: 500 }}>{chk.label}</span>
                      {chk.passed ? (
                        <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                          <CheckCircle2 size={15} /> Passed
                        </span>
                      ) : (
                        <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                          <AlertTriangle size={15} /> Issue
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Issues / Warnings */}
                {checkResult.issues?.length > 0 && (
                  <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', marginBottom: 4 }}>
                      Statutory Pre-Submission Notes:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem', color: '#78350f' }}>
                      {checkResult.issues.map((iss, idx) => (
                        <li key={idx} style={{ marginBottom: 2 }}>{iss}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                <FileText size={32} style={{ margin: '0 auto 8px' }} />
                <p style={{ fontSize: '0.8125rem', margin: 0 }}>
                  Click "Run Pre-Submission Quality Check" to inspect format, clarity, and statutory requirements.
                </p>
              </div>
            )}
          </div>

          {/* Mandatory Section 15 Legal Disclaimer */}
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Info size={16} color="#64748b" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
              <strong>Notice:</strong> Pre-submission document check. Final acceptance is determined by the relevant government authority.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
