/**
 * Change Detection Service & Change Impact Engine
 * CIVIC PATH - Sections 13, 14, 26 of Requirements
 * 
 * Flow:
 * Official Website / Circular -> Change Detection -> Affected Civic Requirement ->
 * Dependency Engine -> Affected Procedure -> Affected Citizen Cases ("3 steps in your roadmap may be affected")
 */

const { db } = require('../db/database');
const dependencyEngine = require('./dependencyEngine');

class ChangeDetectionService {
  /**
   * Compares two snapshots of official government text or rules
   */
  compareSourceVersions(oldSnapshot, newSnapshot) {
    const isDifferent = oldSnapshot.trim() !== newSnapshot.trim();
    return {
      isDifferent,
      characterDelta: newSnapshot.length - oldSnapshot.length,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Applies an official government update circular and computes downstream impact
   */
  detectChangedRequirements(updatePayload) {
    const {
      title,
      changeType,
      sourceId,
      affectedRequirementId,
      circularReference,
      officialSourceURL,
      previousValue,
      newValue,
      impactSummary
    } = updatePayload;

    const id = `update_${Date.now()}`;
    const dateDetected = new Date().toISOString().split('T')[0];

    // Find affected requirement
    const req = db.prepare('SELECT * FROM CivicRequirements WHERE id = ?').get(affectedRequirementId);
    const affectedProcedureId = req ? req.procedureId : 'proc_home_bakery_mumbai';

    // Insert update record into GovernmentUpdates table
    db.prepare(`
      INSERT INTO GovernmentUpdates (
        id, title, changeType, sourceId, affectedProcedureId, affectedRequirementId,
        circularReference, officialSourceURL, dateDetected, previousValue, newValue, impactSummary, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `).run(
      id,
      title,
      changeType,
      sourceId,
      affectedProcedureId,
      affectedRequirementId,
      circularReference,
      officialSourceURL || (req ? req.officialSourceURL : ''),
      dateDetected,
      previousValue,
      newValue,
      impactSummary
    );

    // Apply change to the CivicRequirements table
    if (req) {
      if (changeType === 'fee_changed' && !isNaN(Number(newValue))) {
        db.prepare('UPDATE CivicRequirements SET fee = ?, lastVerified = ? WHERE id = ?')
          .run(Number(newValue), dateDetected, affectedRequirementId);
      } else if (changeType === 'rule_updated') {
        db.prepare('UPDATE CivicRequirements SET description = ?, lastVerified = ? WHERE id = ?')
          .run(`${req.description} [Updated per ${circularReference}]`, dateDetected, affectedRequirementId);
      }
    }

    // Run Change Impact Engine to find all downstream impacts
    const affectedProcedures = this.findAffectedProcedures(affectedRequirementId);
    const affectedCases = this.findAffectedCases(affectedRequirementId);

    return {
      updateId: id,
      title,
      affectedRequirement: req ? req.title : affectedRequirementId,
      affectedProcedures,
      affectedCasesCount: affectedCases.length,
      affectedCases,
      impactSummary
    };
  }

  /**
   * Finds procedures that use this requirement
   */
  findAffectedProcedures(requirementId) {
    const req = db.prepare('SELECT procedureId, title FROM CivicRequirements WHERE id = ?').get(requirementId);
    if (!req) return [];

    return [{
      procedureId: req.procedureId,
      requirementTitle: req.title
    }];
  }

  /**
   * Finds all citizen cases whose roadmap contains this requirement or depends on it
   */
  findAffectedCases(requirementId) {
    const allCases = db.prepare('SELECT * FROM CivicCases').all();
    const affected = [];

    for (const c of allCases) {
      const qualifiers = JSON.parse(c.qualifiers || '{}');
      const reqs = dependencyEngine.getFilteredRequirements(qualifiers);
      const containsTarget = reqs.some(r => r.id === requirementId);

      if (containsTarget) {
        // Also check if any steps depend on this requirement
        const dependentSteps = reqs.filter(r => {
          const prereqs = JSON.parse(r.prerequisites || '[]');
          return prereqs.includes(requirementId);
        });

        affected.push({
          caseId: c.id,
          caseTitle: c.title,
          directlyAffectedStepId: requirementId,
          downstreamStepsAffectedCount: dependentSteps.length,
          downstreamSteps: dependentSteps.map(d => ({ id: d.id, title: d.title }))
        });
      }
    }

    return affected;
  }

  /**
   * Returns all active government updates
   */
  getActiveUpdates() {
    return db.prepare(`
      SELECT u.*, s.authority, s.department as sourceDepartment, r.title as requirementTitle
      FROM GovernmentUpdates u
      LEFT JOIN GovernmentSources s ON u.sourceId = s.id
      LEFT JOIN CivicRequirements r ON u.affectedRequirementId = r.id
      ORDER BY u.dateDetected DESC
    `).all();
  }
}

module.exports = new ChangeDetectionService();
