/**
 * Simple In-Memory & JSON-Backed Case Storage & Readiness Engine
 * CIVIC PATH - Beginner Friendly Architecture (Part N, O, P, Q, R, S)
 */

const fs = require('fs');
const path = require('path');
const { getScenarioById } = require('./scenarios');

const CASES_FILE = path.join(__dirname, 'cases.json');

// Memory cache of active cases
let casesMap = new Map();

// Load persisted cases on startup if file exists
function loadCases() {
  try {
    if (fs.existsSync(CASES_FILE)) {
      const data = JSON.parse(fs.readFileSync(CASES_FILE, 'utf8'));
      for (const [id, c] of Object.entries(data)) {
        casesMap.set(id, c);
      }
    }
  } catch (err) {
    console.warn('[CasesStore] Initializing fresh cases store:', err.message);
  }
}

// Persist cases to JSON
function persistCases() {
  try {
    const obj = {};
    for (const [id, c] of casesMap.entries()) {
      obj[id] = c;
    }
    fs.writeFileSync(CASES_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (err) {
    console.error('[CasesStore] Failed to persist cases:', err.message);
  }
}

loadCases();

/**
 * Calculates submission readiness, document statuses, and roadmap states
 * Connects Documents -> Requirements -> Prerequisites -> Roadmap Steps (Part K & S)
 */
function calculateReadiness(caseObj) {
  const scenario = getScenarioById(caseObj.scenarioId);
  const requiredDocs = scenario.requiredDocuments || [];
  const uploadedDocs = caseObj.documents || [];

  // Determine verification status of each requirement
  const requirementStatuses = {};
  for (const req of requiredDocs) {
    // Check if an uploaded document matches this requirement and is DEMO_VERIFIED
    const matchedDoc = uploadedDocs.find(
      doc => doc.requirementId === req.id && doc.status === 'DEMO_VERIFIED'
    );
    requirementStatuses[req.id] = matchedDoc ? 'DEMO_VERIFIED' : 'NOT_UPLOADED';
  }

  // Calculate missing documents
  const missingRequirements = [];
  let satisfiedCount = 0;

  for (const req of requiredDocs) {
    if (requirementStatuses[req.id] === 'DEMO_VERIFIED') {
      satisfiedCount++;
    } else {
      missingRequirements.push({
        id: req.id,
        name: req.name,
        description: req.description,
        requiredForStep: req.requiredForStep,
        source: req.source,
        sourceType: req.sourceType || 'OFFICIAL',
        lastVerified: req.lastVerified,
        officialURL: req.officialURL
      });
    }
  }

  const isComplete = missingRequirements.length === 0;

  // Recalculate Roadmap Steps based on prerequisites AND required documents
  const completedStepSet = new Set(caseObj.completedSteps || []);
  const roadmapSteps = scenario.roadmapSteps.map((step) => {
    // 1. Check prerequisite steps
    const prereqs = step.prerequisites || [];
    const missingStepPrereqs = prereqs.filter(pId => !completedStepSet.has(pId));

    // 2. Check required documents for this step
    const stepDocIds = step.requiredDocuments || [];
    const missingDocsForStep = stepDocIds
      .filter(docId => requirementStatuses[docId] !== 'DEMO_VERIFIED')
      .map(docId => {
        const r = requiredDocs.find(d => d.id === docId);
        return r ? r.name : docId;
      });

    let status = 'AVAILABLE';
    let blockedReason = null;

    if (completedStepSet.has(step.id)) {
      status = 'COMPLETED';
    } else if (missingDocsForStep.length > 0) {
      status = 'BLOCKED';
      blockedReason = {
        type: 'MISSING_DOCUMENT',
        stepTitle: step.title,
        missingDocs: missingDocsForStep,
        message: `Blocked because: ✗ ${missingDocsForStep.join(', ')} has not been uploaded.`,
        requiredDocName: missingDocsForStep[0]
      };
    } else if (missingStepPrereqs.length > 0) {
      status = 'BLOCKED';
      const prereqStepObjs = scenario.roadmapSteps.filter(s => missingStepPrereqs.includes(s.id));
      blockedReason = {
        type: 'MISSING_PREREQUISITE_STEP',
        stepTitle: step.title,
        missingPrereqs: prereqStepObjs.map(p => p.title),
        message: `Blocked because: ✗ Prior prerequisite step (${prereqStepObjs.map(p => p.title).join(', ')}) must be completed first.`
      };
    }

    const numericFee = typeof step.cost === 'number' ? step.cost : (typeof step.fee === 'number' ? step.fee : 0);
    const displayCost = typeof step.cost === 'number'
      ? (step.cost === 0 ? '₹0 (Free)' : `₹${step.cost.toLocaleString('en-IN')}`)
      : (step.cost || (step.fee !== undefined ? (step.fee === 0 ? '₹0 (Free)' : `₹${step.fee}`) : '₹0 (Free)'));

    return {
      ...step,
      fee: numericFee,
      cost: displayCost,
      status,
      blockedReason
    };
  });

  return {
    isComplete,
    satisfiedCount,
    totalRequired: requiredDocs.length,
    missingRequirements,
    requirementStatuses,
    roadmapSteps
  };
}

/**
 * Creates a new civic case
 */
function createCivicCase({ scenarioId, answers = {} }) {
  const scenario = getScenarioById(scenarioId);
  const id = `case_${Date.now()}`;
  const now = new Date().toISOString();

  const newCase = {
    id,
    scenarioId: scenario.id,
    title: scenario.title,
    answers,
    documents: [],
    completedSteps: [],
    createdAt: now,
    updatedAt: now
  };

  const readiness = calculateReadiness(newCase);
  newCase.readiness = readiness;

  casesMap.set(id, newCase);
  persistCases();

  return newCase;
}

/**
 * Retrieves a case by ID with freshly computed readiness and roadmap
 */
function getCivicCase(caseId) {
  const c = casesMap.get(caseId);
  if (!c) return null;

  c.readiness = calculateReadiness(c);
  return c;
}

/**
 * Adds an uploaded document to the case
 */
function addDocument(caseId, docPayload) {
  const c = casesMap.get(caseId);
  if (!c) throw new Error('Case not found');

  const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const newDoc = {
    id: docId,
    caseId,
    fileName: docPayload.fileName || 'uploaded_document.pdf',
    fileType: docPayload.fileType || 'PDF',
    fileSize: docPayload.fileSize || '250 KB',
    requirementId: docPayload.requirementId || null,
    stepId: docPayload.stepId || null,
    status: docPayload.status || 'CHECKING', // 'NOT_UPLOADED' | 'CHECKING' | 'DEMO_VERIFIED' | 'NOT_MATCHED'
    matchedRequirementName: docPayload.matchedRequirementName || '',
    uploadedAt: new Date().toISOString()
  };

  if (!c.documents) c.documents = [];
  c.documents.push(newDoc);
  c.updatedAt = new Date().toISOString();

  c.readiness = calculateReadiness(c);
  persistCases();

  return { document: newDoc, case: c };
}

/**
 * Updates an uploaded document status or matching
 */
function updateDocument(caseId, docId, updates) {
  const c = casesMap.get(caseId);
  if (!c) throw new Error('Case not found');

  const doc = (c.documents || []).find(d => d.id === docId);
  if (!doc) throw new Error('Document not found');

  Object.assign(doc, updates);
  c.updatedAt = new Date().toISOString();

  c.readiness = calculateReadiness(c);
  persistCases();

  return { document: doc, case: c };
}

/**
 * Removes an uploaded document
 */
function deleteDocument(caseId, docId) {
  const c = casesMap.get(caseId);
  if (!c) throw new Error('Case not found');

  c.documents = (c.documents || []).filter(d => d.id !== docId);
  c.updatedAt = new Date().toISOString();

  c.readiness = calculateReadiness(c);
  persistCases();

  return c;
}

/**
 * Toggles a roadmap step completion
 */
function toggleStep(caseId, stepId) {
  const c = casesMap.get(caseId);
  if (!c) throw new Error('Case not found');

  if (!c.completedSteps) c.completedSteps = [];
  const set = new Set(c.completedSteps);

  if (set.has(stepId)) {
    set.delete(stepId);
  } else {
    set.add(stepId);
  }

  c.completedSteps = Array.from(set);
  c.updatedAt = new Date().toISOString();

  c.readiness = calculateReadiness(c);
  persistCases();

  return c;
}

module.exports = {
  createCivicCase,
  getCivicCase,
  addDocument,
  updateDocument,
  deleteDocument,
  toggleStep,
  calculateReadiness
};
