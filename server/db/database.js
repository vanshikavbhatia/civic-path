const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'civic_path.db');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for reliability
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS GovernmentSources (
      id TEXT PRIMARY KEY,
      department TEXT NOT NULL,
      authority TEXT NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      sourceType TEXT NOT NULL,
      location TEXT NOT NULL,
      lastChecked TEXT NOT NULL,
      lastChanged TEXT,
      contentHash TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      verificationStatus TEXT NOT NULL DEFAULT 'verified'
    );

    CREATE TABLE IF NOT EXISTS CivicRequirements (
      id TEXT PRIMARY KEY,
      procedureId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      requirementType TEXT NOT NULL,
      department TEXT NOT NULL,
      authority TEXT NOT NULL,
      documents TEXT NOT NULL, /* JSON array */
      prerequisites TEXT NOT NULL, /* JSON array */
      fee REAL NOT NULL DEFAULT 0,
      feeExplanation TEXT,
      deadline TEXT,
      estimatedProcessingDays INTEGER NOT NULL DEFAULT 7,
      eligibility TEXT,
      exemptions TEXT, /* JSON array */
      officialSourceId TEXT,
      officialSourceURL TEXT,
      lastVerified TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      applicableEstablishmentTypes TEXT, /* JSON array: ['home', 'commercial'] */
      applicableScales TEXT, /* JSON array */
      minEmployees INTEGER DEFAULT 0,
      maxEmployees INTEGER DEFAULT 999999,
      maxTurnoverLakhs REAL DEFAULT NULL,
      FOREIGN KEY (officialSourceId) REFERENCES GovernmentSources(id)
    );

    CREATE TABLE IF NOT EXISTS CivicCases (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      userGoal TEXT NOT NULL,
      qualifiers TEXT NOT NULL, /* JSON string */
      completedSteps TEXT NOT NULL DEFAULT '[]', /* JSON array of step IDs */
      inProgressSteps TEXT NOT NULL DEFAULT '[]', /* JSON array of step IDs */
      customNotes TEXT DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS GovernmentUpdates (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      changeType TEXT NOT NULL, /* 'fee_changed', 'document_changed', 'rule_updated', 'exemption_added' */
      sourceId TEXT NOT NULL,
      affectedProcedureId TEXT NOT NULL,
      affectedRequirementId TEXT NOT NULL,
      circularReference TEXT NOT NULL,
      officialSourceURL TEXT NOT NULL,
      dateDetected TEXT NOT NULL,
      previousValue TEXT NOT NULL,
      newValue TEXT NOT NULL,
      impactSummary TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      FOREIGN KEY (sourceId) REFERENCES GovernmentSources(id)
    );

    CREATE TABLE IF NOT EXISTS CitizenProfile (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      businessName TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      city TEXT NOT NULL DEFAULT 'Mumbai',
      state TEXT NOT NULL DEFAULT 'Maharashtra',
      pincode TEXT NOT NULL DEFAULT '400001',
      panNumber TEXT NOT NULL DEFAULT '',
      aadhaarRef TEXT NOT NULL DEFAULT '',
      establishmentType TEXT NOT NULL DEFAULT 'home',
      turnoverBracket TEXT NOT NULL DEFAULT '<12L',
      employeeCount INTEGER NOT NULL DEFAULT 2
    );

    CREATE TABLE IF NOT EXISTS ApplicationRecords (
      id TEXT PRIMARY KEY,
      caseId TEXT NOT NULL,
      requirementId TEXT NOT NULL,
      department TEXT NOT NULL,
      serviceName TEXT NOT NULL,
      applicationRef TEXT NOT NULL,
      submissionDate TEXT NOT NULL,
      status TEXT NOT NULL, /* 'Pending', 'Under Scrutiny', 'Inspection Scheduled', 'Approved', 'Query Raised' */
      lastUpdated TEXT NOT NULL,
      remarks TEXT
    );

    CREATE TABLE IF NOT EXISTS DocumentChecks (
      id TEXT PRIMARY KEY,
      caseId TEXT,
      documentType TEXT NOT NULL,
      fileName TEXT NOT NULL,
      fileSize TEXT NOT NULL,
      fileType TEXT NOT NULL,
      isReadable INTEGER NOT NULL DEFAULT 1,
      hasRequiredPages INTEGER NOT NULL DEFAULT 1,
      expiryVerified INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL, /* 'Accepted', 'Warning', 'Rejected' */
      issues TEXT NOT NULL, /* JSON array */
      checkedAt TEXT NOT NULL
    );
  `);

  // Initialize single default profile if not exists
  const existingProfile = db.prepare('SELECT id FROM CitizenProfile WHERE id = ?').get('default_user');
  if (!existingProfile) {
    db.prepare(`
      INSERT INTO CitizenProfile (id, fullName, email, phone, businessName, address, city, state, pincode, panNumber, aadhaarRef, establishmentType, turnoverBracket, employeeCount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'default_user',
      'Priya Sunita Sharma',
      'priya.sharma@civicpath.demo',
      '+91 98200 12345',
      'Baker Street Confections',
      'Flat 402, Greenfield Heights, Linking Road, Bandra West',
      'Mumbai',
      'Maharashtra',
      '400050',
      'ABCPS1234F',
      'XXXX-XXXX-9821',
      'home',
      '<12L',
      2
    );
  }
}

initDb();

module.exports = {
  db,
  initDb
};
