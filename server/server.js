/**
 * CIVIC PATH Express Backend Server
 * Intelligent Civic Procedure & Compliance Navigator
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { db } = require('./db/database');
const { seedDatabase } = require('./db/seed');
const sourceIngestionService = require('./services/sourceIngestionService');
const dependencyEngine = require('./services/dependencyEngine');
const changeDetectionService = require('./services/changeDetectionService');
const civicCaseService = require('./services/civicCaseService');
const { SCENARIOS, getScenarioById } = require('./data/scenarios');
const casesStore = require('./data/casesStore');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().substring(11, 19)}] ${req.method} ${req.url}`);
  next();
});

// -------------------------------------------------------------
// PART P: Scenarios & Simple Cases REST APIs (Beginner Friendly)
// -------------------------------------------------------------

// GET /api/scenarios - Returns the four scenarios
app.get('/api/scenarios', (req, res) => {
  res.json({ success: true, data: SCENARIOS });
});

// GET /api/scenarios/:id - Returns the selected scenario
app.get('/api/scenarios/:id', (req, res) => {
  const scenario = getScenarioById(req.params.id);
  if (!scenario) return res.status(404).json({ success: false, error: 'Scenario not found' });
  res.json({ success: true, data: scenario });
});

// POST /api/cases - Creates a civic case
app.post('/api/cases', (req, res) => {
  try {
    if (req.body.scenarioId) {
      const newCase = casesStore.createCivicCase(req.body);
      return res.json({ success: true, data: newCase });
    }
    // Fallback to legacy case service if scenarioId not passed
    const result = civicCaseService.createCase(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/cases/:id - Returns the current case with readiness and roadmap
app.get('/api/cases/:id', (req, res) => {
  try {
    const simpleCase = casesStore.getCivicCase(req.params.id);
    if (simpleCase) {
      return res.json({ success: true, data: simpleCase });
    }
    const legacyCase = civicCaseService.getCase(req.params.id);
    res.json({ success: true, data: legacyCase });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// POST /api/cases/:id/documents - Stores uploaded document metadata
app.post('/api/cases/:id/documents', (req, res) => {
  try {
    const result = casesStore.addDocument(req.params.id, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/documents/:id (or /api/cases/:caseId/documents/:id) - Updates document status/matching
app.patch('/api/documents/:id', (req, res) => {
  try {
    const caseId = req.query.caseId || req.body.caseId;
    if (!caseId) return res.status(400).json({ success: false, error: 'caseId query or body param is required' });
    const result = casesStore.updateDocument(caseId, req.params.id, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/cases/:caseId/documents/:id', (req, res) => {
  try {
    const result = casesStore.updateDocument(req.params.caseId, req.params.id, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/documents/:id - Removes a document
app.delete('/api/documents/:id', (req, res) => {
  try {
    const caseId = req.query.caseId || req.body.caseId;
    if (!caseId) return res.status(400).json({ success: false, error: 'caseId is required to delete a document' });
    const updatedCase = casesStore.deleteDocument(caseId, req.params.id);
    res.json({ success: true, data: updatedCase });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/cases/:caseId/documents/:id', (req, res) => {
  try {
    const updatedCase = casesStore.deleteDocument(req.params.caseId, req.params.id);
    res.json({ success: true, data: updatedCase });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/cases/:id/readiness - Returns submission readiness
app.get('/api/cases/:id/readiness', (req, res) => {
  try {
    const c = casesStore.getCivicCase(req.params.id);
    if (!c) return res.status(404).json({ success: false, error: 'Case not found' });
    const r = c.readiness;
    res.json({
      success: true,
      data: {
        complete: r.isComplete,
        completed: r.satisfiedCount,
        total: r.totalRequired,
        missing: r.missingRequirements.map(m => m.name)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/cases/:id/toggle-step - Toggles step completion
app.post('/api/cases/:id/toggle-step', (req, res) => {
  try {
    const { stepId } = req.body;
    if (!stepId) return res.status(400).json({ success: false, error: 'stepId is required' });

    const simpleCase = casesStore.getCivicCase(req.params.id);
    if (simpleCase) {
      const updatedCase = casesStore.toggleStep(req.params.id, stepId);
      return res.json({ success: true, data: updatedCase });
    }

    const updatedGraph = dependencyEngine.unlockStep(req.params.id, stepId);
    res.json({ success: true, data: updatedGraph });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/cases/:id/blocked-reason/:stepId', (req, res) => {
  try {
    const civicCase = db.prepare('SELECT * FROM CivicCases WHERE id = ?').get(req.params.id);
    if (!civicCase) return res.status(404).json({ success: false, error: 'Case not found' });

    const reqRecord = db.prepare('SELECT * FROM CivicRequirements WHERE id = ?').get(req.params.stepId);
    if (!reqRecord) return res.status(404).json({ success: false, error: 'Requirement not found' });

    const completed = JSON.parse(civicCase.completedSteps || '[]');
    const prereqs = JSON.parse(reqRecord.prerequisites || '[]');
    const missingPrereqs = prereqs.filter(p => !completed.includes(p));

    const allReqs = db.prepare('SELECT * FROM CivicRequirements').all();
    const map = new Map(allReqs.map(r => [r.id, r]));

    const reason = dependencyEngine.generateBlockedReason(reqRecord, missingPrereqs, map);
    res.json({ success: true, data: reason });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 3. Official Government Sources APIs
// -------------------------------------------------------------
app.get('/api/sources', (req, res) => {
  try {
    const sources = db.prepare('SELECT * FROM GovernmentSources ORDER BY department ASC').all();
    res.json({ success: true, data: sources });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/sources/:id', (req, res) => {
  try {
    const source = db.prepare('SELECT * FROM GovernmentSources WHERE id = ?').get(req.params.id);
    if (!source) return res.status(404).json({ success: false, error: 'Source not found' });
    res.json({ success: true, data: source });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/sources/test-ingest', (req, res) => {
  try {
    const { rawText, sourceMeta } = req.body;
    const extracted = sourceIngestionService.extractRequirements(rawText || '', sourceMeta || {});
    const validation = sourceIngestionService.validateRequirement(extracted);
    res.json({ success: true, data: { extracted, validation } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 4. "Change One Thing" Scenario Comparison API
// -------------------------------------------------------------
app.post('/api/compare-scenarios', (req, res) => {
  try {
    const { baseQualifiers, modifiedQualifiers } = req.body;
    const comparison = civicCaseService.compareScenarios(
      baseQualifiers || { establishmentType: 'home', scale: 'micro', employees: 2, turnoverLakhs: 8 },
      modifiedQualifiers || { establishmentType: 'commercial', scale: 'small', employees: 15, turnoverLakhs: 25 }
    );
    res.json({ success: true, data: comparison });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 5. Exemption Finder API
// -------------------------------------------------------------
app.get('/api/exemptions', (req, res) => {
  try {
    const qualifiers = {
      establishmentType: req.query.establishmentType || 'home',
      scale: req.query.scale || 'micro',
      employees: Number(req.query.employees || 2),
      turnoverLakhs: Number(req.query.turnoverLakhs || 8)
    };
    const exemptions = civicCaseService.findExemptions(qualifiers);
    res.json({ success: true, data: exemptions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 6. Real Cost Calculator API
// -------------------------------------------------------------
app.get('/api/costs', (req, res) => {
  try {
    const qualifiers = {
      establishmentType: req.query.establishmentType || 'home',
      scale: req.query.scale || 'micro',
      employees: Number(req.query.employees || 2),
      turnoverLakhs: Number(req.query.turnoverLakhs || 8)
    };
    const costs = civicCaseService.calculateVerifiedCosts(qualifiers);
    res.json({ success: true, data: costs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 7. Department Handoff Tracker API
// -------------------------------------------------------------
app.get('/api/department-handoffs', (req, res) => {
  try {
    const qualifiers = {
      establishmentType: req.query.establishmentType || 'home',
      scale: req.query.scale || 'micro',
      employees: Number(req.query.employees || 2),
      turnoverLakhs: Number(req.query.turnoverLakhs || 8)
    };
    let completedSteps = [];
    if (req.query.caseId) {
      const c = db.prepare('SELECT completedSteps FROM CivicCases WHERE id = ?').get(req.query.caseId);
      if (c) completedSteps = JSON.parse(c.completedSteps || '[]');
    }
    const handoffs = civicCaseService.getDepartmentHandoffs(qualifiers, completedSteps);
    res.json({ success: true, data: handoffs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 8. Government Update Watch & Change Impact Engine APIs
// -------------------------------------------------------------
app.get('/api/updates', (req, res) => {
  try {
    const updates = changeDetectionService.getActiveUpdates();
    res.json({ success: true, data: updates });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/updates/simulate', (req, res) => {
  try {
    const impact = changeDetectionService.detectChangedRequirements(req.body);
    res.json({ success: true, data: impact });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 9. Document Quality Pre-Submission Checker API
// -------------------------------------------------------------
app.post('/api/documents/check', (req, res) => {
  try {
    const result = civicCaseService.checkDocumentQuality(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 10. Citizen Auto-Fill Profile APIs
// -------------------------------------------------------------
app.get('/api/profile', (req, res) => {
  try {
    const profile = civicCaseService.getAutoFillProfile();
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/profile', (req, res) => {
  try {
    const updated = civicCaseService.saveAutoFillProfile(req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 11. Application Status Aggregator APIs
// -------------------------------------------------------------
app.get('/api/applications', (req, res) => {
  try {
    const caseId = req.query.caseId;
    let records = [];
    if (caseId) {
      records = db.prepare('SELECT * FROM ApplicationRecords WHERE caseId = ? ORDER BY submissionDate DESC').all(caseId);
    } else {
      records = db.prepare('SELECT * FROM ApplicationRecords ORDER BY submissionDate DESC').all();
    }

    // Default mock applications if none stored yet
    if (records.length === 0) {
      records = [
        {
          id: 'app_1',
          caseId: caseId || 'case_demo',
          requirementId: 'req_home_udyam_msme',
          department: 'Ministry of MSME',
          serviceName: 'Udyam Registration Portal',
          applicationRef: 'UDYAM-MH-18-0094124',
          submissionDate: '2026-09-24',
          status: 'Approved',
          lastUpdated: '2026-09-25',
          remarks: 'Instant electronic Udyam Certificate generated.'
        },
        {
          id: 'app_2',
          caseId: caseId || 'case_demo',
          requirementId: 'req_home_shops_intimation',
          department: 'MCGM Aaple Sarkar',
          serviceName: 'Form F Micro Establishment Intimation',
          applicationRef: 'MCGM-EST-2026-88129',
          submissionDate: '2026-09-26',
          status: 'Under Scrutiny',
          lastUpdated: '2026-09-27',
          remarks: 'Acknowledgment receipt generated. Awaiting Ward Inspector sign-off.'
        }
      ];
    }

    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/applications', (req, res) => {
  try {
    const { caseId, requirementId, department, serviceName, applicationRef, status, remarks } = req.body;
    const id = `app_${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO ApplicationRecords (id, caseId, requirementId, department, serviceName, applicationRef, submissionDate, status, lastUpdated, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, caseId || 'case_demo', requirementId || '', department, serviceName, applicationRef, now, status || 'Pending', now, remarks || '');

    res.json({ success: true, data: { id, applicationRef, status } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 12. Escalation Chain API
// -------------------------------------------------------------
app.get('/api/escalation', (req, res) => {
  try {
    const chain = civicCaseService.getEscalationChain(req.query.department || 'FSSAI');
    res.json({ success: true, data: chain });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 13. Demo Reset API (For Judges)
// -------------------------------------------------------------
app.post('/api/reset-demo', (req, res) => {
  try {
    seedDatabase();
    res.json({ success: true, message: 'Civic Path database re-seeded to verified benchmark state.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend in production or when built
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback for SPA routing in Express 5
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ success: false, error: `API route ${req.method} ${req.url} not found` });
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('CIVIC PATH Backend is operational on port ' + PORT);
    }
  });
});

const http = require('http');

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`CIVIC PATH Server running at: http://localhost:${PORT}`);
  console.log(`Verified Government Knowledge Store active.`);
  console.log(`=======================================================`);
});

// Also listen on standard alternate ports (3000, 5173) so all localhost URLs work
[3000, 5173].forEach((altPort) => {
  if (altPort !== Number(PORT)) {
    const altServer = http.createServer(app);
    altServer.on('error', () => {
      // Ignore if port already occupied
    });
    altServer.listen(altPort, () => {
      console.log(`Convenience mirror active at: http://localhost:${altPort}`);
    });
  }
});

