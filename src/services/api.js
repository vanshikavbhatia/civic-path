/**
 * CIVIC PATH Frontend API Client
 * Interfaces with Express Backend with Deterministic Fallbacks
 */

const BASE_URL = '/api';

export async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `HTTP error ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

// Intent Classification
export function classifyIntent(query) {
  return fetchJson('/classify-intent', {
    method: 'POST',
    body: JSON.stringify({ query })
  });
}

// Qualifier Questions
export function getQualifiers(type = 'home') {
  return fetchJson(`/qualifiers?type=${encodeURIComponent(type)}`);
}

import { SCENARIOS as FALLBACK_SCENARIOS, getScenarioById as getFallbackScenarioById } from '../data/fallbackScenarios';

// In-memory client-side case store if backend is offline
let clientSideActiveCase = null;

function computeClientReadiness(caseObj, scenario) {
  const requiredDocs = scenario?.requiredDocuments || [];
  const uploadedDocs = caseObj?.documents || [];
  const requirementStatuses = {};
  
  for (const req of requiredDocs) {
    const matched = uploadedDocs.find(d => d.requirementId === req.id && d.status === 'DEMO_VERIFIED');
    requirementStatuses[req.id] = matched ? 'DEMO_VERIFIED' : 'NOT_UPLOADED';
  }

  const missingRequirements = [];
  let satisfiedCount = 0;
  for (const req of requiredDocs) {
    if (requirementStatuses[req.id] === 'DEMO_VERIFIED') {
      satisfiedCount++;
    } else {
      missingRequirements.push(req);
    }
  }

  const completedStepSet = new Set(caseObj.completedSteps || []);
  const roadmapSteps = (scenario?.roadmapSteps || []).map((step) => {
    const prereqs = step.prerequisites || [];
    const missingPrereqs = prereqs.filter(pId => !completedStepSet.has(pId));
    const stepDocIds = step.requiredDocuments || [];
    const missingDocs = stepDocIds
      .filter(docId => requirementStatuses[docId] !== 'DEMO_VERIFIED')
      .map(docId => {
        const r = requiredDocs.find(d => d.id === docId);
        return r ? r.name : docId;
      });

    let status = 'AVAILABLE';
    let blockedReason = null;

    if (completedStepSet.has(step.id)) {
      status = 'COMPLETED';
    } else if (missingDocs.length > 0) {
      status = 'BLOCKED';
      blockedReason = {
        type: 'MISSING_DOCUMENT',
        stepTitle: step.title,
        missingDocs,
        message: `Blocked because: ✗ ${missingDocs.join(', ')} has not been uploaded.`,
        requiredDocName: missingDocs[0]
      };
    } else if (missingPrereqs.length > 0) {
      status = 'BLOCKED';
      const prereqObjs = scenario.roadmapSteps.filter(s => missingPrereqs.includes(s.id));
      blockedReason = {
        type: 'MISSING_PREREQUISITE_STEP',
        stepTitle: step.title,
        missingPrereqs: prereqObjs.map(p => p.title),
        message: `Blocked because: ✗ Prior prerequisite step (${prereqObjs.map(p => p.title).join(', ')}) must be completed first.`
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
    isComplete: missingRequirements.length === 0,
    satisfiedCount,
    totalRequired: requiredDocs.length,
    missingRequirements,
    requirementStatuses,
    roadmapSteps
  };
}

// Civic Case Management
export async function createCase(payload) {
  try {
    const res = await fetchJson('/cases', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    clientSideActiveCase = res;
    return res;
  } catch (err) {
    console.warn('API /cases unavailable, operating with client-side fallback state:', err);
    const scenario = getFallbackScenarioById(payload.scenarioId) || FALLBACK_SCENARIOS[0];
    const initialCase = {
      id: `case_client_${Date.now()}`,
      scenarioId: scenario.id,
      answers: payload.answers || {},
      documents: [],
      completedSteps: []
    };
    initialCase.readiness = computeClientReadiness(initialCase, scenario);
    clientSideActiveCase = initialCase;
    return initialCase;
  }
}

export async function getCase(caseId) {
  try {
    return await fetchJson(`/cases/${encodeURIComponent(caseId)}`);
  } catch (err) {
    return clientSideActiveCase;
  }
}

export async function toggleStepCompletion(caseId, stepId) {
  try {
    return await fetchJson(`/cases/${encodeURIComponent(caseId)}/toggle-step`, {
      method: 'POST',
      body: JSON.stringify({ stepId })
    });
  } catch (err) {
    if (clientSideActiveCase) {
      const set = new Set(clientSideActiveCase.completedSteps || []);
      if (set.has(stepId)) set.delete(stepId);
      else set.add(stepId);
      clientSideActiveCase.completedSteps = Array.from(set);
      const sc = getFallbackScenarioById(clientSideActiveCase.scenarioId) || FALLBACK_SCENARIOS[0];
      clientSideActiveCase.readiness = computeClientReadiness(clientSideActiveCase, sc);
      return { ...clientSideActiveCase };
    }
    throw err;
  }
}

// Scenarios API (Part P)
export async function getScenarios() {
  try {
    return await fetchJson('/scenarios');
  } catch (err) {
    console.warn('API /scenarios unavailable, using verified fallback data:', err);
    return FALLBACK_SCENARIOS;
  }
}

export async function getScenario(id) {
  try {
    return await fetchJson(`/scenarios/${encodeURIComponent(id)}`);
  } catch (err) {
    console.warn(`API /scenarios/${id} unavailable, using verified fallback scenario:`, err);
    return getFallbackScenarioById(id) || FALLBACK_SCENARIOS[0];
  }
}

// Case Documents API (Part P & Q)
export async function uploadCaseDocument(caseId, docData) {
  try {
    return await fetchJson(`/cases/${encodeURIComponent(caseId)}/documents`, {
      method: 'POST',
      body: JSON.stringify(docData)
    });
  } catch (err) {
    if (clientSideActiveCase) {
      const doc = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        uploadedAt: new Date().toISOString(),
        ...docData
      };
      clientSideActiveCase.documents = clientSideActiveCase.documents || [];
      clientSideActiveCase.documents.push(doc);
      const sc = getFallbackScenarioById(clientSideActiveCase.scenarioId) || FALLBACK_SCENARIOS[0];
      clientSideActiveCase.readiness = computeClientReadiness(clientSideActiveCase, sc);
      return { success: true, case: { ...clientSideActiveCase }, document: doc };
    }
    throw err;
  }
}

export async function updateCaseDocument(caseId, docId, updates) {
  try {
    return await fetchJson(`/cases/${encodeURIComponent(caseId)}/documents/${encodeURIComponent(docId)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  } catch (err) {
    if (clientSideActiveCase && clientSideActiveCase.documents) {
      const idx = clientSideActiveCase.documents.findIndex(d => d.id === docId);
      if (idx !== -1) {
        clientSideActiveCase.documents[idx] = { ...clientSideActiveCase.documents[idx], ...updates };
        const sc = getFallbackScenarioById(clientSideActiveCase.scenarioId) || FALLBACK_SCENARIOS[0];
        clientSideActiveCase.readiness = computeClientReadiness(clientSideActiveCase, sc);
      }
      return { success: true, case: { ...clientSideActiveCase } };
    }
    throw err;
  }
}

export async function deleteCaseDocument(caseId, docId) {
  try {
    return await fetchJson(`/cases/${encodeURIComponent(caseId)}/documents/${encodeURIComponent(docId)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    if (clientSideActiveCase && clientSideActiveCase.documents) {
      clientSideActiveCase.documents = clientSideActiveCase.documents.filter(d => d.id !== docId);
      const sc = getFallbackScenarioById(clientSideActiveCase.scenarioId) || FALLBACK_SCENARIOS[0];
      clientSideActiveCase.readiness = computeClientReadiness(clientSideActiveCase, sc);
      return { ...clientSideActiveCase };
    }
    throw err;
  }
}

export async function getCaseReadiness(caseId) {
  try {
    return await fetchJson(`/cases/${encodeURIComponent(caseId)}/readiness`);
  } catch (err) {
    if (clientSideActiveCase) {
      return clientSideActiveCase.readiness;
    }
    return { isComplete: false, satisfiedCount: 0, totalRequired: 4, missingRequirements: [] };
  }
}

export function getBlockedReason(caseId, stepId) {
  return fetchJson(`/cases/${encodeURIComponent(caseId)}/blocked-reason/${encodeURIComponent(stepId)}`).catch(() => null);
}

// Official Sources
export function getGovernmentSources() {
  return fetchJson('/sources');
}

export function testSourceIngestion(payload) {
  return fetchJson('/sources/test-ingest', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// "Change One Thing" Scenario Comparison
export function compareScenarios(baseQualifiers, modifiedQualifiers) {
  return fetchJson('/compare-scenarios', {
    method: 'POST',
    body: JSON.stringify({ baseQualifiers, modifiedQualifiers })
  });
}

// Verified Exemption Finder
export function getExemptions(qualifiers) {
  const query = new URLSearchParams(qualifiers).toString();
  return fetchJson(`/exemptions?${query}`);
}

// Real Cost Calculator
export function getCosts(qualifiers) {
  const query = new URLSearchParams(qualifiers).toString();
  return fetchJson(`/costs?${query}`);
}

// Department Handoff Tracker
export function getDepartmentHandoffs(qualifiers, caseId) {
  const params = new URLSearchParams({ ...qualifiers, caseId: caseId || '' }).toString();
  return fetchJson(`/department-handoffs?${params}`);
}

// Government Update Watchdog
export function getGovernmentUpdates() {
  return fetchJson('/updates');
}

export function simulateGovernmentUpdate(payload) {
  return fetchJson('/updates/simulate', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// Document Quality Pre-Submission Checker
export function checkDocumentQuality(fileMeta) {
  return fetchJson('/documents/check', {
    method: 'POST',
    body: JSON.stringify(fileMeta)
  });
}

// Citizen Auto-Fill Profile
export function getCitizenProfile() {
  return fetchJson('/profile');
}

export function updateCitizenProfile(profileData) {
  return fetchJson('/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
}

// Application Status Aggregator
export function getApplications(caseId) {
  return fetchJson(`/applications?caseId=${encodeURIComponent(caseId || '')}`);
}

export function addApplication(appData) {
  return fetchJson('/applications', {
    method: 'POST',
    body: JSON.stringify(appData)
  });
}

// Escalation Path Finder
export function getEscalationChain(department = 'FSSAI') {
  return fetchJson(`/escalation?department=${encodeURIComponent(department)}`);
}

// Demo Reset for Judges
export function resetDemoDatabase() {
  return fetchJson('/reset-demo', { method: 'POST' });
}
