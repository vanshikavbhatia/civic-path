import React, { useState } from 'react';
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  FileText,
  Trash2,
  RefreshCw,
  Eye,
  ExternalLink,
  ArrowRight,
  Lock,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DocumentUploadSection({
  scenario,
  civicCase,
  onUploadDocument,
  onUpdateDocument,
  onDeleteDocument,
  onScrollToUpload
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedReqId, setSelectedReqId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [replacingDocId, setReplacingDocId] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  const requiredDocuments = scenario?.requiredDocuments || [];
  const uploadedDocuments = civicCase?.documents || [];
  const readiness = civicCase?.readiness || {
    isComplete: false,
    satisfiedCount: 0,
    totalRequired: requiredDocuments.length,
    missingRequirements: requiredDocuments,
    requirementStatuses: {}
  };

  // Quick helper to infer requirement from filename
  const inferRequirementFromFilename = (fileName) => {
    const lower = fileName.toLowerCase();
    for (const req of requiredDocuments) {
      const keywords = req.matchKeywords || [req.name.toLowerCase()];
      if (keywords.some(kw => lower.includes(kw.toLowerCase()))) {
        return req.id;
      }
    }
    return '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const inferred = inferRequirementFromFilename(file.name);
    setSelectedReqId(inferred || (requiredDocuments[0]?.id || ''));
  };

  const runVerificationAnimation = async () => {
    const stages = [
      'Uploading file to client session...',
      'Reading document structure...',
      'Comparing with required statutory document type...',
      'Checking prerequisites and metadata compliance...',
      'Demo verification complete!'
    ];

    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(stages[i]);
      await new Promise(resolve => setTimeout(resolve, 550));
    }
  };

  const handleUploadSubmit = async (e) => {
    e?.preventDefault();
    if (!selectedFile) return;

    setIsProcessing(true);
    await runVerificationAnimation();

    const matchedReq = requiredDocuments.find(r => r.id === selectedReqId);
    const fileNameLower = selectedFile.name.toLowerCase();

    // Simple matching logic (Part H): Check if filename or selected type matches
    const isUnmatched = selectedFile.name.toLowerCase().includes('random') || 
      selectedFile.name.toLowerCase().includes('wrong') || 
      selectedFile.name.toLowerCase().includes('invalid');

    const status = isUnmatched ? 'NOT_MATCHED' : 'DEMO_VERIFIED';

    const docPayload = {
      fileName: selectedFile.name,
      fileType: selectedFile.name.split('.').pop().toUpperCase(),
      fileSize: `${Math.max(120, Math.round(selectedFile.size / 1024) || 240)} KB`,
      requirementId: isUnmatched ? null : (matchedReq?.id || null),
      stepId: isUnmatched ? null : (matchedReq?.requiredForStep || null),
      status,
      matchedRequirementName: isUnmatched ? 'Unmatched File' : (matchedReq?.name || 'Supporting Document')
    };

    if (replacingDocId) {
      await onUpdateDocument(replacingDocId, docPayload);
      setReplacingDocId(null);
    } else {
      await onUploadDocument(docPayload);
    }

    if (status === 'DEMO_VERIFIED') {
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      } catch (err) {}
    }

    setSelectedFile(null);
    setIsProcessing(false);
    setProcessingStage('');
  };

  const handleTriggerReplace = (doc) => {
    setReplacingDocId(doc.id);
    setSelectedReqId(doc.requirementId || requiredDocuments[0]?.id || '');
    // trigger file picker
    document.getElementById('civic-doc-file-input')?.click();
  };

  const progressPercent = Math.round(
    ((readiness.satisfiedCount || 0) / (readiness.totalRequired || 1)) * 100
  );

  return (
    <div id="civic-documents-section" style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 12 }}>
      
      {/* ========================================================================= */}
      {/* PART J: DOCUMENT CHECKLIST                                                */}
      {/* ========================================================================= */}
      <div className="civic-card" style={{ padding: 24, backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-available">
                <FileCheck size={12} /> Compliance Checklist
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                DOCUMENT CHECKLIST
              </h3>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '4px 0 0' }}>
              Upload each required statutory document to unlock the dependent roadmap steps.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1e40af' }}>
              {readiness.satisfiedCount || 0} / {readiness.totalRequired || 0} requirements satisfied
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div style={{ width: '100%', height: 10, backgroundColor: '#e2e8f0', borderRadius: 9999, overflow: 'hidden', marginBottom: 20 }}>
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: progressPercent === 100 ? '#059669' : '#2563eb',
              borderRadius: 9999,
              transition: 'width 0.4s ease'
            }}
          />
        </div>

        {/* Checklist Items */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {requiredDocuments.map((req) => {
            const isVerified = readiness.requirementStatuses?.[req.id] === 'DEMO_VERIFIED';
            const linkedStep = scenario?.roadmapSteps?.find(s => s.id === req.requiredForStep);

            return (
              <div
                key={req.id}
                style={{
                  border: isVerified ? '1.5px solid #a7f3d0' : '1.5px solid #fee2e2',
                  backgroundColor: isVerified ? '#ecfdf5' : '#fff5f5',
                  borderRadius: 10,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: isVerified ? '#065f46' : '#991b1b' }}>
                      {req.name}
                    </span>
                    {isVerified ? (
                      <span className="badge badge-verified" style={{ fontSize: '0.625rem' }}>
                        <CheckCircle2 size={11} /> Demo Verified
                      </span>
                    ) : (
                      <span className="badge badge-blocked" style={{ fontSize: '0.625rem' }}>
                        <AlertTriangle size={11} /> Missing
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#475569', margin: '4px 0 0', lineHeight: 1.35 }}>
                    {req.description}
                  </p>
                </div>

                <div style={{ marginTop: 10, paddingTop: 8, borderTop: isVerified ? '1px solid #d1fae5' : '1px solid #fed7d7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6875rem' }}>
                  <span style={{ color: '#64748b' }}>
                    Required for: <strong>{linkedStep?.title || req.requiredForStep}</strong>
                  </span>
                  <span style={{ color: isVerified ? '#059669' : '#dc2626', fontWeight: 700 }}>
                    {isVerified ? '✓ Unlocked' : '🔒 Blocks Step'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PART E, F, G, H, I: DOCUMENTS & UPLOAD AREA                                */}
      {/* ========================================================================= */}
      <div className="civic-card" style={{ padding: 24, backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-available">
                <UploadCloud size={12} /> Pre-Flight Upload
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Upload Documents
              </h3>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '4px 0 0' }}>
              Upload test documents (PDF, JPG, JPEG, PNG). File names matching keywords will automatically associate with required items.
            </p>
          </div>
        </div>

        {/* Upload Form Box */}
        <div
          style={{
            border: '2px dashed #93c5fd',
            backgroundColor: '#eff6ff',
            borderRadius: 14,
            padding: '24px 20px',
            marginBottom: 20
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, alignItems: 'center' }}>
            
            {/* File Input */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>
                Select File (PDF, JPG, PNG):
              </label>
              <input
                id="civic-doc-file-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  fontSize: '0.8125rem',
                  padding: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8
                }}
              />
            </div>

            {/* Target Requirement Dropdown */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>
                Associate with Requirement:
              </label>
              <select
                value={selectedReqId}
                onChange={(e) => setSelectedReqId(e.target.value)}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  fontSize: '0.8125rem',
                  padding: '9px 10px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8
                }}
              >
                {requiredDocuments.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Button */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'transparent', marginBottom: 6, display: 'block' }}>
                Action
              </label>
              <button
                type="button"
                onClick={handleUploadSubmit}
                disabled={!selectedFile || isProcessing}
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px 16px', fontSize: '0.875rem' }}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} />
                    {replacingDocId ? 'Replace Document' : 'Upload & Verify'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Demo Pre-load Chips */}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af' }}>
              Quick Demo Files:
            </span>
            {requiredDocuments.map((r, i) => (
              <button
                key={r.id}
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  const sampleName = `${r.matchKeywords?.[0] || 'proof'}_document.pdf`;
                  const mockFile = new File(['mock content'], sampleName, { type: 'application/pdf' });
                  setSelectedFile(mockFile);
                  setSelectedReqId(r.id);
                }}
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#1e40af',
                  backgroundColor: '#ffffff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 6,
                  padding: '3px 8px',
                  cursor: 'pointer'
                }}
              >
                + {r.name.split(' ')[0]} File
              </button>
            ))}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => {
                const mockFile = new File(['unknown'], 'random_unmatched_file.pdf', { type: 'application/pdf' });
                setSelectedFile(mockFile);
                setSelectedReqId(requiredDocuments[0]?.id || '');
              }}
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#b45309',
                backgroundColor: '#fef3c7',
                border: '1px solid #fde68a',
                borderRadius: 6,
                padding: '3px 8px',
                cursor: 'pointer'
              }}
            >
              + Unmatched File (Demo Error)
            </button>
          </div>

          {/* Realistic Verification Animation (Part G) */}
          {isProcessing && (
            <div
              style={{
                marginTop: 16,
                backgroundColor: '#ffffff',
                border: '1px solid #bfdbfe',
                borderRadius: 10,
                padding: 14,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <RefreshCw size={18} color="#2563eb" className="animate-spin" />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e40af' }}>
                    {processingStage}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Simulating client-side pre-submission matching against scenario requirements...
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Uploaded Documents List */}
        <div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
            Uploaded Documents ({uploadedDocuments.length})
          </h4>

          {uploadedDocuments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', backgroundColor: '#f8fafc', borderRadius: 10, border: '1px dashed #cbd5e1' }}>
              <FileText size={32} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
                No documents uploaded yet
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>
                All requirements currently start as 🔒 Not Uploaded. Upload a document above to unlock roadmap steps.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {uploadedDocuments.map((doc) => {
                const isMatched = doc.status === 'DEMO_VERIFIED';
                const req = requiredDocuments.find(r => r.id === doc.requirementId);
                const step = scenario?.roadmapSteps?.find(s => s.id === (doc.stepId || req?.requiredForStep));

                return (
                  <div
                    key={doc.id}
                    style={{
                      border: isMatched ? '1px solid #cbd5e1' : '1.5px solid #fecaca',
                      backgroundColor: isMatched ? '#ffffff' : '#fff5f5',
                      borderRadius: 10,
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12
                    }}
                  >
                    {/* Left: Document Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 8,
                          backgroundColor: isMatched ? '#eff6ff' : '#fee2e2',
                          color: isMatched ? '#1e40af' : '#dc2626',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <FileText size={20} />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                            {doc.fileName}
                          </span>
                          <span style={{ fontSize: '0.6875rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: 4 }}>
                            {doc.fileType} • {doc.fileSize}
                          </span>
                          {isMatched ? (
                            <span className="badge badge-verified" style={{ fontSize: '0.625rem' }}>
                              ✓ Demo Verified
                            </span>
                          ) : (
                            <span className="badge badge-blocked" style={{ fontSize: '0.625rem' }}>
                              ⚠ Requirement Not Matched
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 3 }}>
                          Associated with: <strong>{req?.name || doc.matchedRequirementName || 'Unassigned'}</strong>
                          {step && (
                            <span style={{ color: '#1e40af', marginLeft: 8 }}>
                              • Unlocks Step: <strong>{step.title}</strong>
                            </span>
                          )}
                        </div>

                        {!isMatched && (
                          <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: 2 }}>
                            This file could not be matched to one of the required document types in this demo.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions (View, Replace, Remove) - Part I */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                      >
                        <Eye size={13} /> View
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTriggerReplace(doc)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                      >
                        <RefreshCw size={13} /> Replace
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteDocument(doc.id)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#dc2626', borderColor: '#fecaca' }}
                        title="Remove document and reset requirement to Not Uploaded"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mandatory Disclaimer (Part W) */}
        <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <Info size={16} color="#64748b" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
            <strong>Demo only:</strong> This check does not authenticate documents or confirm legal validity. Matched against predefined demo requirements.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PART M: SUBMISSION READINESS                                               */}
      {/* ========================================================================= */}
      <div
        className="civic-card"
        style={{
          padding: 24,
          backgroundColor: readiness.isComplete ? '#ecfdf5' : '#ffffff',
          borderLeft: readiness.isComplete ? '6px solid #059669' : '6px solid #d97706'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className={`badge ${readiness.isComplete ? 'badge-verified' : 'badge-blocked'}`}>
                {readiness.isComplete ? '✓ Ready' : '⚠ Action Required'}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: readiness.isComplete ? '#065f46' : '#0f172a', margin: 0 }}>
                SUBMISSION READINESS
              </h3>
            </div>

            {readiness.isComplete ? (
              <div>
                <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#065f46', margin: '6px 0 2px' }}>
                  ✓ READY TO SUBMIT
                </p>
                <p style={{ fontSize: '0.8125rem', color: '#166534', margin: 0 }}>
                  All demo prerequisites have been satisfied. You are prepared to proceed to the official government filing portal.
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#dc2626', margin: '6px 0 4px' }}>
                  ⚠ NOT READY TO SUBMIT
                </p>
                <div style={{ fontSize: '0.8125rem', color: '#475569' }}>
                  Missing required prerequisites:
                  <ul style={{ margin: '4px 0 0', paddingLeft: 18, color: '#991b1b', fontWeight: 600 }}>
                    {readiness.missingRequirements?.map((m) => (
                      <li key={m.id}>{m.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div>
            {readiness.isComplete ? (
              scenario?.applicationURL ? (
                <a
                  href={scenario.applicationURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success"
                  style={{ padding: '12px 24px', fontSize: '0.9375rem', textDecoration: 'none' }}
                >
                  <span>View Official Application</span>
                  <ExternalLink size={16} />
                </a>
              ) : (
                <button disabled className="btn btn-secondary" style={{ opacity: 0.7 }}>
                  Official application link not configured
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={onScrollToUpload}
                className="btn btn-primary"
                style={{ padding: '12px 20px', fontSize: '0.875rem' }}
              >
                <UploadCloud size={16} />
                Upload Missing Documents ({readiness.missingRequirements?.length || 0})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
        >
          <div
            className="civic-card"
            style={{ width: '100%', maxWidth: 520, backgroundColor: '#ffffff', borderRadius: 14, overflow: 'hidden' }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                {previewDoc.fileName}
              </h4>
              <button onClick={() => setPreviewDoc(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                ✕
              </button>
            </div>
            <div style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: '#eff6ff', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <FileText size={32} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{previewDoc.fileName}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                File Type: {previewDoc.fileType} • Size: {previewDoc.fileSize}
              </div>
              <div style={{ marginTop: 12, padding: 10, backgroundColor: '#f8fafc', borderRadius: 8, fontSize: '0.75rem', color: '#334155' }}>
                Status: <strong>{previewDoc.status}</strong> • Requirement: <strong>{previewDoc.matchedRequirementName}</strong>
              </div>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
              <button onClick={() => setPreviewDoc(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
