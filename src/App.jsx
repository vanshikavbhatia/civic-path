import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSearch from './components/HeroSearch';
import QualifierModal from './components/QualifierModal';
import DependencyGraphView from './components/DependencyGraphView';
import StepDetailDrawer from './components/StepDetailDrawer';
import WhyBlockedModal from './components/WhyBlockedModal';
import WhyBlockedDedicatedView from './components/WhyBlockedDedicatedView';
import DocumentUploadSection from './components/DocumentUploadSection';
import ExemptionAndCostView from './components/ExemptionAndCostView';
import GovernmentUpdateWatch from './components/GovernmentUpdateWatch';
import ChangeOneThingView from './components/ChangeOneThingView';
import DocumentChecker from './components/DocumentChecker';
import MyCivicCaseDashboard from './components/MyCivicCaseDashboard';
import OfficialSourcesDirectory from './components/OfficialSourcesDirectory';

import {
  getScenarios,
  getScenario,
  createCase,
  getCase,
  toggleStepCompletion,
  getBlockedReason,
  uploadCaseDocument,
  updateCaseDocument,
  deleteCaseDocument,
  resetDemoDatabase
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'why_blocked' | 'exemptions_costs' | 'update_watch' | 'change_one_thing' | 'doc_checker' | 'my_case' | 'official_sources'
  
  // Scenarios & Case State
  const [scenarios, setScenarios] = useState([]);
  const [activeScenarioId, setActiveScenarioId] = useState('homeBakery');
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentCase, setCurrentCase] = useState(null);

  // Modals & Drawer State
  const [qualifierModalOpen, setQualifierModalOpen] = useState(false);
  const [whyBlockedModalOpen, setWhyBlockedModalOpen] = useState(false);
  const [activeBlockedData, setActiveBlockedData] = useState(null);
  const [selectedDrawerStep, setSelectedDrawerStep] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load scenarios on mount
  useEffect(() => {
    loadInitialScenarios();
  }, []);

  const loadInitialScenarios = async () => {
    try {
      const data = await getScenarios();
      setScenarios(data || []);
      const defaultSc = (data && data[0]) || null;
      setCurrentScenario(defaultSc);
      if (defaultSc) {
        // Initialize default case for the first scenario
        const newCase = await createCase({
          scenarioId: defaultSc.id,
          answers: { location: 'Mumbai', scale: 'micro', employees: '1-2' }
        });
        setCurrentCase(newCase);
      }
    } catch (err) {
      console.error('Failed to load scenarios:', err);
    }
  };

  // PART A & B: User clicks one of the 4 scenario cards
  const handleSelectScenario = async (scenarioId) => {
    try {
      setActiveScenarioId(scenarioId);
      const sc = await getScenario(scenarioId);
      setCurrentScenario(sc);
      setQualifierModalOpen(true);
    } catch (err) {
      console.error('Error selecting scenario:', err);
    }
  };

  // User submits questions in QualifierModal
  const handleGenerateRoadmap = async (answeredQuestions) => {
    try {
      setQualifierModalOpen(false);
      const newCase = await createCase({
        scenarioId: activeScenarioId,
        answers: answeredQuestions
      });

      setCurrentCase(newCase);
      setActiveTab('roadmap');
      setNotification({
        type: 'success',
        message: `Personalized civic roadmap generated for ${currentScenario?.title || 'scenario'}!`
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      console.error('Failed to generate roadmap:', err);
    }
  };

  // Step Node click / Toggle completion
  const handleToggleStep = async (stepId) => {
    try {
      if (!currentCase?.id) return;
      const updated = await toggleStepCompletion(currentCase.id, stepId);
      setCurrentCase(updated);

      if (selectedDrawerStep?.id === stepId) {
        const found = updated.readiness?.roadmapSteps?.find(s => s.id === stepId);
        if (found) setSelectedDrawerStep(found);
      }

      setNotification({
        type: 'success',
        message: 'Step status updated! Downstream prerequisites recomputed.'
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Toggle step error:', err);
    }
  };

  // "Why am I blocked?" Click
  const handleOpenWhyBlocked = (stepData) => {
    if (stepData.blockedReason) {
      setActiveBlockedData(stepData.blockedReason);
      setWhyBlockedModalOpen(true);
    } else {
      setActiveBlockedData({
        stepTitle: stepData.title,
        message: 'This step is locked by prior statutory compliance requirements.'
      });
      setWhyBlockedModalOpen(true);
    }
  };

  // Document Upload Handlers (Part E, F, G, H, I, K, S)
  const handleUploadDocument = async (docPayload) => {
    try {
      if (!currentCase?.id) return;
      const res = await uploadCaseDocument(currentCase.id, docPayload);
      if (res.case) {
        setCurrentCase(res.case);
      }
      setNotification({
        type: docPayload.status === 'DEMO_VERIFIED' ? 'success' : 'warning',
        message: docPayload.status === 'DEMO_VERIFIED'
          ? `✓ ${docPayload.matchedRequirementName} demo-verified! Dependent roadmap steps unlocked.`
          : `⚠ File uploaded but could not be matched to an active requirement.`
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      console.error('Upload document error:', err);
    }
  };

  const handleUpdateDocument = async (docId, updates) => {
    try {
      if (!currentCase?.id) return;
      const res = await updateCaseDocument(currentCase.id, docId, updates);
      if (res.case) {
        setCurrentCase(res.case);
      }
      setNotification({
        type: 'success',
        message: 'Document replaced and re-verified against demo requirements.'
      });
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      console.error('Update document error:', err);
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      if (!currentCase?.id) return;
      const updatedCase = await deleteCaseDocument(currentCase.id, docId);
      setCurrentCase(updatedCase);
      setNotification({
        type: 'warning',
        message: 'Document removed. Associated requirement reset to 🔒 Not Uploaded.'
      });
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      console.error('Delete document error:', err);
    }
  };

  const scrollToDocuments = () => {
    document.getElementById('civic-documents-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset Demo benchmark
  const handleResetDemo = async () => {
    try {
      setIsResetting(true);
      await resetDemoDatabase();
      await loadInitialScenarios();
      setActiveTab('roadmap');
      setNotification({
        type: 'success',
        message: 'Civic Path database re-seeded to verified benchmark state!'
      });
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setIsResetting(false);
    }
  };

  // Prepare graph data from currentCase readiness
  const roadmapSteps = currentCase?.readiness?.roadmapSteps || currentScenario?.roadmapSteps || [];
  const graphData = {
    nodes: roadmapSteps,
    edges: [],
    stats: {
      total: roadmapSteps.length,
      completed: roadmapSteps.filter(s => s.status === 'COMPLETED').length,
      available: roadmapSteps.filter(s => s.status === 'AVAILABLE').length,
      blocked: roadmapSteps.filter(s => s.status === 'BLOCKED').length,
      progressPercent: Math.round(
        (roadmapSteps.filter(s => s.status === 'COMPLETED').length / (roadmapSteps.length || 1)) * 100
      )
    }
  };

  const defaultQualifiers = {
    establishmentType: activeScenarioId === 'smallRestaurant' ? 'commercial' : 'home',
    location: currentCase?.answers?.location || 'Mumbai',
    scale: 'micro',
    employees: 2,
    turnoverLakhs: 8
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      
      {/* Universal Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 100,
            backgroundColor: notification.type === 'success' ? '#065f46' : notification.type === 'warning' ? '#92400e' : '#991b1b',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 10,
            boxShadow: '0 10px 25px -3px rgba(0,0,0,0.2)',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        
        {/* VIEW 1: MAIN NAVIGATOR & ROADMAP */}
        {activeTab === 'roadmap' && (
          <div>
            {/* PART A: EXACTLY FOUR LARGE SCENARIO CARDS (NO GENERIC SEARCH BAR) */}
            <HeroSearch
              onSelectScenario={handleSelectScenario}
              activeScenarioId={activeScenarioId}
            />

            {/* Active Scenario Title Banner */}
            <div style={{ maxWidth: 1100, margin: '24px auto 16px', padding: '0 16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '14px 20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Scenario
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
                    {currentScenario?.title || 'Civic Procedure Roadmap'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setQualifierModalOpen(true)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                >
                  Edit Answers & Qualifiers
                </button>
              </div>
            </div>

            {/* PART C: YOUR CIVIC ROADMAP (EXISTING DEPENDENCY GRAPH DESIGN) */}
            <div style={{ maxWidth: 1100, margin: '0 auto 24px', padding: '0 16px' }}>
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  YOUR CIVIC ROADMAP
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '2px 0 0' }}>
                  Interactive dependency graph reacts in real time to required documents and prerequisite completion.
                </p>
              </div>

              <DependencyGraphView
                graphData={graphData}
                onNodeClick={(stepData) => setSelectedDrawerStep(stepData)}
                onToggleStep={handleToggleStep}
                onOpenWhyBlocked={handleOpenWhyBlocked}
              />
            </div>

            {/* PART E, F, G, H, I, J, K, M, W: DOCUMENT CHECKLIST, UPLOAD & READINESS */}
            <div style={{ maxWidth: 1100, margin: '0 auto 40px', padding: '0 16px' }}>
              <DocumentUploadSection
                scenario={currentScenario}
                civicCase={currentCase}
                onUploadDocument={handleUploadDocument}
                onUpdateDocument={handleUpdateDocument}
                onDeleteDocument={handleDeleteDocument}
                onScrollToUpload={scrollToDocuments}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: DEDICATED "WHY AM I BLOCKED?" VIEW */}
        {activeTab === 'why_blocked' && (
          <WhyBlockedDedicatedView
            graphData={graphData}
            onResolvePrerequisite={handleToggleStep}
          />
        )}

        {/* VIEW 3: EXEMPTIONS & COSTS */}
        {activeTab === 'exemptions_costs' && (
          <ExemptionAndCostView
            qualifiers={defaultQualifiers}
          />
        )}

        {/* VIEW 4: GOVERNMENT UPDATE WATCHDOG & CHANGE IMPACT ENGINE */}
        {activeTab === 'update_watch' && (
          <GovernmentUpdateWatch
            onUpdateApplied={() => loadInitialScenarios()}
          />
        )}

        {/* VIEW 5: CHANGE ONE THING (DIFFERENTIAL COMPARATOR) */}
        {activeTab === 'change_one_thing' && (
          <ChangeOneThingView
            baseQualifiers={defaultQualifiers}
            onApplyScenario={(mod) => handleGenerateRoadmap(mod)}
          />
        )}

        {/* VIEW 6: DOCUMENT QUALITY CHECKER */}
        {activeTab === 'doc_checker' && (
          <DocumentChecker />
        )}

        {/* VIEW 7: MY CIVIC CASE DASHBOARD */}
        {activeTab === 'my_case' && (
          <MyCivicCaseDashboard
            civicCase={currentCase}
            qualifiers={defaultQualifiers}
          />
        )}

        {/* VIEW 8: OFFICIAL SOURCES DIRECTORY */}
        {activeTab === 'official_sources' && (
          <OfficialSourcesDirectory />
        )}

      </main>

      {/* Qualifier Modal with scenario-specific questions */}
      <QualifierModal
        isOpen={qualifierModalOpen}
        onClose={() => setQualifierModalOpen(false)}
        onGenerate={handleGenerateRoadmap}
        scenario={currentScenario}
      />

      {/* "Why Am I Blocked?" Interactive Modal (Part L) */}
      <WhyBlockedModal
        isOpen={whyBlockedModalOpen}
        onClose={() => setWhyBlockedModalOpen(false)}
        blockedData={activeBlockedData}
        onCompletePrerequisite={handleToggleStep}
        onNavigateToUpload={scrollToDocuments}
      />

      {/* Node Inspection Slide-Out Drawer */}
      <StepDetailDrawer
        step={selectedDrawerStep}
        isOpen={Boolean(selectedDrawerStep)}
        onClose={() => setSelectedDrawerStep(null)}
        onToggleCompletion={handleToggleStep}
        onOpenWhyBlocked={handleOpenWhyBlocked}
      />

    </div>
  );
}
