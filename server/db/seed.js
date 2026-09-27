const { db } = require('./database');
const {
  OFFICIAL_GOVERNMENT_SOURCES,
  OFFICIAL_CIVIC_REQUIREMENTS,
  CONTROLLED_GOVERNMENT_UPDATES
} = require('../data/officialSources');

function seedDatabase() {
  console.log('[Seed] Seeding Government Sources...');
  const insertSource = db.prepare(`
    INSERT OR REPLACE INTO GovernmentSources (
      id, department, authority, title, url, sourceType, location, lastChecked, lastChanged, contentHash, status, verificationStatus
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const src of OFFICIAL_GOVERNMENT_SOURCES) {
    insertSource.run(
      src.id,
      src.department,
      src.authority,
      src.title,
      src.url,
      src.sourceType,
      src.location,
      src.lastChecked,
      src.lastChanged || null,
      src.contentHash,
      src.status,
      src.verificationStatus
    );
  }

  console.log('[Seed] Seeding Civic Requirements...');
  const insertReq = db.prepare(`
    INSERT OR REPLACE INTO CivicRequirements (
      id, procedureId, title, description, requirementType, department, authority,
      documents, prerequisites, fee, feeExplanation, deadline, estimatedProcessingDays,
      eligibility, exemptions, officialSourceId, officialSourceURL, lastVerified, status,
      applicableEstablishmentTypes, applicableScales, minEmployees, maxEmployees, maxTurnoverLakhs
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const req of OFFICIAL_CIVIC_REQUIREMENTS) {
    insertReq.run(
      req.id,
      req.procedureId,
      req.title,
      req.description,
      req.requirementType,
      req.department,
      req.authority,
      JSON.stringify(req.documents || []),
      JSON.stringify(req.prerequisites || []),
      req.fee || 0,
      req.feeExplanation || '',
      req.deadline || '',
      req.estimatedProcessingDays || 7,
      req.eligibility || '',
      JSON.stringify(req.exemptions || []),
      req.officialSourceId || null,
      req.officialSourceURL || '',
      req.lastVerified,
      req.status || 'active',
      JSON.stringify(req.applicableEstablishmentTypes || ['home']),
      JSON.stringify(req.applicableScales || ['micro']),
      req.minEmployees || 0,
      req.maxEmployees || 999999,
      req.maxTurnoverLakhs || null
    );
  }

  console.log('[Seed] Seeding Controlled Government Updates...');
  const insertUpdate = db.prepare(`
    INSERT OR REPLACE INTO GovernmentUpdates (
      id, title, changeType, sourceId, affectedProcedureId, affectedRequirementId,
      circularReference, officialSourceURL, dateDetected, previousValue, newValue, impactSummary, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const upd of CONTROLLED_GOVERNMENT_UPDATES) {
    insertUpdate.run(
      upd.id,
      upd.title,
      upd.changeType,
      upd.sourceId,
      upd.affectedProcedureId,
      upd.affectedRequirementId,
      upd.circularReference,
      upd.officialSourceURL,
      upd.dateDetected,
      upd.previousValue,
      upd.newValue,
      upd.impactSummary,
      upd.status
    );
  }

  console.log('[Seed] Database successfully seeded with official government sources and requirements.');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
