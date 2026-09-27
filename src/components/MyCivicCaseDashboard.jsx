import React, { useState, useEffect } from 'react';
import { UserCheck, Clock, CheckCircle2, AlertTriangle, Layers, Calendar, Copy, Check, ExternalLink, ArrowRight, ShieldCheck, ChevronRight, FileText, Send } from 'lucide-react';
import { getDepartmentHandoffs, getCitizenProfile, updateCitizenProfile, getApplications, addApplication, getEscalationChain } from '../services/api';

export default function MyCivicCaseDashboard({ civicCase, qualifiers }) {
  const [activeSection, setActiveSection] = useState('handoffs'); // 'handoffs' | 'deadlines' | 'autofill' | 'applications' | 'escalation'
  const [handoffs, setHandoffs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [escalationChain, setEscalationChain] = useState([]);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [newAppForm, setNewAppForm] = useState({
    department: 'FSSAI FoSCoS',
    serviceName: 'Form A Food Registration',
    applicationRef: 'FOSCOS-2026-99120',
    status: 'Pending',
    remarks: 'Awaiting scrutiny by Food Safety Officer'
  });

  useEffect(() => {
    loadDashboardData();
  }, [civicCase]);

  const loadDashboardData = async () => {
    try {
      const caseId = civicCase?.id || 'case_demo';
      const [hData, pData, aData, eData] = await Promise.all([
        getDepartmentHandoffs(qualifiers, caseId),
        getCitizenProfile(),
        getApplications(caseId),
        getEscalationChain('FSSAI')
      ]);
      setHandoffs(hData);
      setProfile(pData);
      setApplications(aData);
      setEscalationChain(eData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const handleCopyProfile = () => {
    if (!profile) return;
    const jsonStr = JSON.stringify(profile, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleAddApp = async (e) => {
    e.preventDefault();
    if (!newAppForm.applicationRef) return;
    try {
      await addApplication({
        caseId: civicCase?.id || 'case_demo',
        ...newAppForm
      });
      const updated = await getApplications(civicCase?.id || 'case_demo');
      setApplications(updated);
      setNewAppForm({
        department: 'FSSAI FoSCoS',
        serviceName: 'Form A Food Registration',
        applicationRef: '',
        status: 'Pending',
        remarks: ''
      });
    } catch (err) {
      console.error('Add app failed:', err);
    }
  };

  const stats = civicCase?.graph?.stats || {
    total: 7,
    completed: 2,
    available: 1,
    blocked: 4,
    progressPercent: 29
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Top Header Card */}
      <div
        className="civic-card"
        style={{
          padding: 24,
          marginBottom: 24,
          backgroundColor: '#ffffff',
          borderLeft: '6px solid #1e40af',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Civic Case Dossier
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px' }}>
            HOME BAKERY — MUMBAI
          </h2>
          <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Case Reference: <code>{civicCase?.id || 'case_demo_mumbai_01'}</code> • Jurisdiction: Greater Mumbai (MCGM / FSSAI)
          </div>
        </div>

        {/* Progress Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#1e40af', lineHeight: 1 }}>
              {stats.progressPercent}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Total Progress</div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ backgroundColor: '#ecfdf5', padding: '8px 12px', borderRadius: 8, textAlign: 'center', minWidth: 64 }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#059669' }}>{stats.completed}</div>
              <div style={{ fontSize: '0.6875rem', color: '#065f46', fontWeight: 600 }}>Done</div>
            </div>
            <div style={{ backgroundColor: '#eff6ff', padding: '8px 12px', borderRadius: 8, textAlign: 'center', minWidth: 64 }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#2563eb' }}>{stats.available}</div>
              <div style={{ fontSize: '0.6875rem', color: '#1e40af', fontWeight: 600 }}>Ready</div>
            </div>
            <div style={{ backgroundColor: '#fef2f2', padding: '8px 12px', borderRadius: 8, textAlign: 'center', minWidth: 64 }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#dc2626' }}>{stats.blocked}</div>
              <div style={{ fontSize: '0.6875rem', color: '#991b1b', fontWeight: 600 }}>Blocked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Tabs for Dashboard Sections */}
      <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid #e2e8f0', marginBottom: 20, overflowX: 'auto', paddingBottom: 2 }}>
        {[
          { id: 'handoffs', label: 'Department Handoff Tracker' },
          { id: 'deadlines', label: 'Deadlines & Renewal Manager' },
          { id: 'autofill', label: 'Form Auto-Fill Profile' },
          { id: 'applications', label: 'Application Status Aggregator' },
          { id: 'escalation', label: 'Escalation Path Finder' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            style={{
              padding: '8px 16px',
              fontSize: '0.8125rem',
              fontWeight: activeSection === tab.id ? 700 : 500,
              color: activeSection === tab.id ? '#1e40af' : '#64748b',
              backgroundColor: activeSection === tab.id ? '#eff6ff' : 'transparent',
              border: 'none',
              borderBottom: activeSection === tab.id ? '2px solid #1e40af' : '2px solid transparent',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: DEPARTMENT HANDOFF TRACKER (Section 12 of prompt) */}
      {activeSection === 'handoffs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: 4 }}>
            Visualizes sequential handoffs across citizen self-service, municipal corporations, public laboratories, and central ministries:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {handoffs.map((ho) => (
              <div
                key={ho.stepNumber}
                className="civic-card"
                style={{
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16,
                  borderLeft: ho.status === 'Completed' ? '4px solid #10b981' : ho.status === 'Current Stage' ? '4px solid #3b82f6' : '4px solid #cbd5e1'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: ho.status === 'Completed' ? '#d1fae5' : ho.status === 'Current Stage' ? '#dbeafe' : '#f1f5f9',
                      color: ho.status === 'Completed' ? '#059669' : ho.status === 'Current Stage' ? '#1e40af' : '#64748b',
                      fontSize: '0.875rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {ho.stepNumber}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{ho.department}</div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>{ho.stage}</div>
                    <div style={{ fontSize: '0.75rem', color: '#1e40af', marginTop: 2 }}>
                      Next Action: <strong>{ho.nextAction}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    className={`badge ${
                      ho.status === 'Completed'
                        ? 'badge-completed'
                        : ho.status === 'Current Stage'
                        ? 'badge-available'
                        : 'badge-blocked'
                    }`}
                  >
                    {ho.status}
                  </span>
                  {ho.officialSource && (
                    <a
                      href={ho.officialSource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    >
                      Portal <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: DEADLINES & RENEWAL MANAGER (Section 17 of prompt) */}
      {activeSection === 'deadlines' && (
        <div className="civic-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
            Statutory Timeline & Renewal Calendar
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: 20 }}>
            Official deadlines extracted directly from statutory rules and license renewal provisions:
          </p>

          <div style={{ position: 'relative', paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Timeline Vertical Track */}
            <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, backgroundColor: '#e2e8f0' }} />

            {[
              { date: 'Day 1', title: 'Document Self-Preparation & Domestic Bill Retrieval', note: 'Immediate citizen action' },
              { date: 'Day 3', title: 'MSME Udyam Zero-Fee Certificate Generation', note: 'Instant electronic generation' },
              { date: 'Day 5', title: 'Potable Water Sample Lab Analysis (IS 10500)', note: '5-day microbiological incubation' },
              { date: 'Day 7', title: 'Maharashtra Shops Form F Online Intimation', note: 'Instant electronic intimation slip' },
              { date: 'Day 14', title: 'FSSAI FoSCoS Scrutiny Window (Form A)', note: '7-14 statutory processing days' },
              { date: '1 to 5 Years', title: 'FSSAI Registration Certificate Renewal', note: 'Must apply 30 days prior to validity expiry' }
            ].map((item, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: -24,
                    top: 4,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: idx <= 2 ? '#10b981' : '#3b82f6',
                    border: '3px solid #ffffff',
                    boxShadow: '0 0 0 2px #cbd5e1'
                  }}
                />
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>{item.date}</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: FORM AUTO-FILL PROFILE (Section 18 of prompt) */}
      {activeSection === 'autofill' && profile && (
        <div className="civic-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Citizen Universal Profile (Enter Once → Reuse Across Forms)
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0' }}>
                Reuses common citizen identity data across FSSAI FoSCoS, Aaple Sarkar, and Udyam portals without redundant re-typing.
              </p>
            </div>

            <button
              onClick={handleCopyProfile}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              {copiedPayload ? <Check size={14} color="#059669" /> : <Copy size={14} />}
              {copiedPayload ? 'Copied Auto-Fill Payload!' : 'Copy Auto-Fill Payload'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700 }}>PROPRIETOR NAME</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{profile.fullName}</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700 }}>BUSINESS TRADE NAME</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{profile.businessName}</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700 }}>PAN NUMBER</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{profile.panNumber}</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700 }}>PREMISES ADDRESS</div>
              <div style={{ fontSize: '0.8125rem', color: '#0f172a', marginTop: 2 }}>{profile.address}, {profile.city} - {profile.pincode}</div>
            </div>
          </div>

          <div style={{ marginTop: 16, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: 12, fontSize: '0.75rem', color: '#1e40af' }}>
            <strong>Notice:</strong> For the hackathon demonstration, Civic Path operates strictly as a client-side assistant and does not automatically submit filings without explicit citizen sign-off.
          </div>
        </div>
      )}

      {/* SECTION 4: APPLICATION STATUS AGGREGATOR (Section 19 of prompt) */}
      {activeSection === 'applications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="civic-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
              Track Government Filing References
            </h3>
            
            <form onSubmit={handleAddApp} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, alignItems: 'flex-end' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Department</label>
                <input
                  type="text"
                  value={newAppForm.department}
                  onChange={(e) => setNewAppForm({ ...newAppForm, department: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Application Ref / Ack No</label>
                <input
                  type="text"
                  value={newAppForm.applicationRef}
                  onChange={(e) => setNewAppForm({ ...newAppForm, applicationRef: e.target.value })}
                  placeholder="e.g. FSSAI-2026-1192"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Current Status</label>
                <select
                  value={newAppForm.status}
                  onChange={(e) => setNewAppForm({ ...newAppForm, status: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Scrutiny">Under Scrutiny</option>
                  <option value="Inspection Scheduled">Inspection Scheduled</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8125rem' }}>
                <Send size={14} /> Add Reference
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="civic-card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Department</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Service / Form</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Application Reference</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>{app.department}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.8125rem', color: '#475569' }}>{app.serviceName}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{app.applicationRef}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${app.status === 'Approved' ? 'badge-completed' : app.status === 'Under Scrutiny' ? 'badge-in-progress' : 'badge-demo'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748b' }}>{app.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 5: ESCALATION PATH FINDER (Section 20 of prompt) */}
      {activeSection === 'escalation' && (
        <div className="civic-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
            Official Statutory Grievance & Escalation Ladder
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: 20 }}>
            If your application is delayed past the statutory turnaround time or improperly blocked, follow the verified statutory escalation hierarchy:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {escalationChain.map((lvl) => (
              <div
                key={lvl.level}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: 16,
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      backgroundColor: '#eff6ff',
                      color: '#1e40af',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8125rem'
                    }}
                  >
                    L{lvl.level}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>{lvl.authority}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#475569' }}>{lvl.action}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: 2 }}>
                      Trigger condition: {lvl.conditions} • Expected turnaround: <strong>{lvl.turnaround}</strong>
                    </div>
                  </div>
                </div>

                {lvl.officialLink && (
                  <a
                    href={lvl.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    Official Portal <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
