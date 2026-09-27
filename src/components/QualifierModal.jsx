import React, { useState, useEffect } from 'react';
import { HelpCircle, Check, ArrowRight, X, Sparkles } from 'lucide-react';

export default function QualifierModal({ isOpen, onClose, onGenerate, scenario }) {
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (scenario && scenario.questions) {
      const defaults = {};
      scenario.questions.forEach((q) => {
        defaults[q.id] = q.default || (q.options && q.options[0]?.value) || '';
      });
      setAnswers(defaults);
    }
  }, [scenario]);

  if (!isOpen || !scenario) return null;

  const handleSelect = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleGenerate = () => {
    onGenerate(answers);
  };

  const questions = scenario.questions || [];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
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
          maxWidth: 720,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-available" style={{ fontSize: '0.6875rem' }}>
                Scenario Questionnaire
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {scenario.title}
              </h3>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '4px 0 0' }}>
              Answer the qualifying parameters below to generate your tailored statutory dependency roadmap.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scenario-Specific Questions */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {questions.map((q, idx) => (
            <div key={q.id}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: 6
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {idx + 1}
                </span>
                {q.question}
              </label>

              {q.helpText && (
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 8px 26px' }}>
                  {q.helpText}
                </p>
              )}

              {/* Options */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: q.options?.length <= 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 8,
                  marginLeft: 26
                }}
              >
                {q.options?.map((opt) => {
                  const isSelected = answers[q.id] === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => handleSelect(q.id, opt.value)}
                      style={{
                        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        borderRadius: 8,
                        padding: '10px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: isSelected ? 700 : 600, fontSize: '0.8125rem', color: isSelected ? '#1e40af' : '#1e293b' }}>
                          {opt.label}
                        </span>
                        {isSelected && <Check size={14} color="#2563eb" />}
                      </div>
                      {opt.description && (
                        <p style={{ fontSize: '0.6875rem', color: '#64748b', margin: '4px 0 0', lineHeight: 1.3 }}>
                          {opt.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Statutory Notice */}
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 12, marginTop: 4 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#166534' }}>
              ✓ Procedural Mapping Ready:
            </div>
            <p style={{ fontSize: '0.75rem', color: '#14532d', margin: '4px 0 0', lineHeight: 1.4 }}>
              Civic Path will map the required official documents, municipal dependencies, and statutory clearances for your selected answers.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            backgroundColor: '#f8fafc'
          }}
        >
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleGenerate} className="btn btn-primary" style={{ padding: '10px 22px' }}>
            Generate Personalized Roadmap
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
