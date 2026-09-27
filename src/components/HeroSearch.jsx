import React from 'react';
import { Cake, Utensils, FileText, Briefcase, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function HeroSearch({ onSelectScenario, activeScenarioId }) {
  const scenarioCards = [
    {
      id: 'homeBakery',
      title: 'I want to start a small home bakery',
      description: 'Start a domestic micro-bakery with FSSAI petty manufacturer exemptions, zero-fee municipal intimation, and residential society compliance.',
      icon: Cake,
      color: '#2563eb',
      bgColor: '#eff6ff',
      badge: 'Cottage Scale'
    },
    {
      id: 'smallRestaurant',
      title: 'I want to open a small restaurant',
      description: 'Establish a commercial eatery with commercial tenancy, Mumbai Fire Brigade safety clearance, MCGM Section 394 Health Trade License, and FSSAI State Licensing.',
      icon: Utensils,
      color: '#d97706',
      bgColor: '#fffbeb',
      badge: 'Commercial Trade'
    },
    {
      id: 'rentalAgreement',
      title: 'I want to register a rental agreement',
      description: 'Execute and e-register a statutory Leave and License Agreement under the Maharashtra Rent Control Act with digital biometric verification and stamp duty payment.',
      icon: FileText,
      color: '#059669',
      bgColor: '#ecfdf5',
      badge: 'Revenue & Stamps'
    },
    {
      id: 'localBusinessLicense',
      title: 'I want to apply for a local business license',
      description: 'Obtain general commercial trading licenses, Maharashtra Shops & Establishment certificate (Gumasta), and MSME registration for retail or service enterprises.',
      icon: Briefcase,
      color: '#4f46e5',
      bgColor: '#eef2ff',
      badge: 'Municipal & MSME'
    }
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)',
        borderBottom: '1px solid #e2e8f0',
        padding: '40px 24px 36px'
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        
        {/* Pitch Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 9999,
            padding: '4px 14px',
            marginBottom: 16,
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          <Sparkles size={14} color="#2563eb" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1e40af' }}>
            Dependency Intelligence Engine — Select a Civic Objective Below
          </span>
        </div>

        {/* Hero Headlines */}
        <h2
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            marginBottom: 10
          }}
        >
          Civic procedures shouldn't feel like a maze.
        </h2>
        <p
          style={{
            fontSize: '1.0625rem',
            color: '#475569',
            maxWidth: 680,
            margin: '0 auto 28px',
            lineHeight: 1.5
          }}
        >
          Select your civic task. Civic Path maps the sequential government dependencies, required documents, and prerequisites you need to complete.
        </p>

        {/* EXACTLY FOUR LARGE SCENARIO CARDS (Part A Requirement) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 20,
            textAlign: 'left'
          }}
        >
          {scenarioCards.map((sc) => {
            const Icon = sc.icon;
            const isSelected = activeScenarioId === sc.id;

            return (
              <div
                key={sc.id}
                className="civic-card"
                style={{
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 14,
                  backgroundColor: '#ffffff',
                  borderColor: isSelected ? sc.color : '#e2e8f0',
                  borderWidth: isSelected ? 2 : 1,
                  boxShadow: isSelected
                    ? `0 0 0 3px ${sc.bgColor}, 0 10px 25px -5px rgba(0,0,0,0.1)`
                    : '0 2px 8px rgba(0,0,0,0.04)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div>
                  {/* Top Bar with Icon and Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 16
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: sc.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: sc.color,
                        border: `1px solid ${sc.bgColor}`
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        color: sc.color,
                        backgroundColor: sc.bgColor,
                        padding: '3px 8px',
                        borderRadius: 6
                      }}
                    >
                      {sc.badge}
                    </span>
                  </div>

                  {/* Scenario Title */}
                  <h3
                    style={{
                      fontSize: '1.1875rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      lineHeight: 1.3,
                      marginBottom: 8
                    }}
                  >
                    {sc.title}
                  </h3>

                  {/* Short Description */}
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: '#475569',
                      lineHeight: 1.5,
                      marginBottom: 20
                    }}
                  >
                    {sc.description}
                  </p>
                </div>

                {/* Build Roadmap Action */}
                <button
                  type="button"
                  onClick={() => onSelectScenario(sc.id)}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    fontSize: '0.875rem',
                    borderRadius: 8,
                    backgroundColor: isSelected ? sc.color : '#1e40af'
                  }}
                >
                  <span>Build Roadmap</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
