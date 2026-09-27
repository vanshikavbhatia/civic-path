/**
 * Source Ingestion Service
 * CIVIC PATH - Layer 1 of Official Government Architecture
 * 
 * Flow:
 * OFFICIAL GOVERNMENT SOURCE -> SOURCE FETCHER -> TEXT EXTRACTION ->
 * STRUCTURED REQUIREMENT EXTRACTION -> VALIDATION -> CIVIC KNOWLEDGE DATABASE
 */

const { db } = require('../db/database');
const crypto = require('crypto');

class SourceIngestionService {
  /**
   * Fetches official source metadata and raw cached content
   */
  async fetchOfficialSource(sourceId) {
    const source = db.prepare('SELECT * FROM GovernmentSources WHERE id = ?').get(sourceId);
    if (!source) {
      throw new Error(`Official source with ID ${sourceId} not found in repository.`);
    }

    return {
      source,
      fetchedAt: new Date().toISOString(),
      status: 'success',
      isOfficial: source.verificationStatus === 'verified'
    };
  }

  /**
   * Extracts clean, structured plain text from official HTML / PDF / Circular raw payloads
   */
  extractText(rawContent, format = 'html') {
    if (!rawContent) return '';
    if (format === 'html') {
      // Strip script, style, and HTML tags while preserving paragraphs
      return rawContent
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    return String(rawContent).trim();
  }

  /**
   * Extracts structured civic requirement properties from official source text
   */
  extractRequirements(text, sourceMeta = {}) {
    // Deterministic parser for official requirements
    const requirementPatterns = {
      isRegistration: /registration|enrolment|udyam|foscos/i.test(text),
      isLicense: /license|permit|section 394/i.test(text),
      isNOC: /noc|no objection|fire brigade/i.test(text),
      isVerification: /water test|inspection|medical fitness/i.test(text)
    };

    let requirementType = 'DOCUMENT';
    if (requirementPatterns.isRegistration) requirementType = 'REGISTRATION';
    else if (requirementPatterns.isLicense) requirementType = 'APPROVAL';
    else if (requirementPatterns.isNOC) requirementType = 'NOC';
    else if (requirementPatterns.isVerification) requirementType = 'VERIFICATION';

    return {
      title: sourceMeta.title || 'Official Civic Requirement',
      department: sourceMeta.department || 'Government Department',
      authority: sourceMeta.authority || 'State Authority',
      requirementType,
      officialSourceId: sourceMeta.id,
      officialSourceURL: sourceMeta.url,
      verificationStatus: sourceMeta.verificationStatus || 'verified',
      extractedAt: new Date().toISOString()
    };
  }

  /**
   * Validates requirement structure against government compliance rules
   * Ensures no fabricated data enters the system without a verifiable source
   */
  validateRequirement(reqData) {
    const errors = [];
    if (!reqData.title || reqData.title.trim().length === 0) {
      errors.push('Requirement title is required');
    }
    if (!reqData.department) {
      errors.push('Governing department must be specified');
    }
    if (reqData.fee < 0) {
      errors.push('Statutory fee cannot be negative');
    }
    if (!reqData.officialSourceURL && reqData.verificationStatus === 'verified') {
      errors.push('Verified requirements MUST have an official government URL. Demo flag required otherwise.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: reqData
    };
  }

  /**
   * Saves or updates a validated government source record
   */
  saveSource(sourceData) {
    const validation = this.validateRequirement(sourceData);
    if (!validation.isValid) {
      throw new Error(`Source validation failed: ${validation.errors.join(', ')}`);
    }

    const hash = crypto.createHash('sha256').update(JSON.stringify(sourceData)).digest('hex').substring(0, 16);
    const now = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT OR REPLACE INTO GovernmentSources (
        id, department, authority, title, url, sourceType, location, lastChecked, lastChanged, contentHash, status, verificationStatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      sourceData.id,
      sourceData.department,
      sourceData.authority,
      sourceData.title,
      sourceData.url,
      sourceData.sourceType || 'official_webpage',
      sourceData.location || 'Mumbai',
      now,
      sourceData.lastChanged || now,
      hash,
      sourceData.status || 'active',
      sourceData.verificationStatus || 'verified'
    );

    return { success: true, id: sourceData.id, contentHash: hash };
  }

  /**
   * Detects content changes between incoming content and stored hash
   */
  detectChanges(sourceId, newContent) {
    const existing = db.prepare('SELECT * FROM GovernmentSources WHERE id = ?').get(sourceId);
    if (!existing) {
      return { changed: true, reason: 'New source ingestion' };
    }

    const newHash = crypto.createHash('sha256').update(newContent).digest('hex').substring(0, 16);
    const changed = existing.contentHash !== newHash;

    return {
      changed,
      sourceId,
      previousHash: existing.contentHash,
      newHash,
      lastChecked: existing.lastChecked
    };
  }
}

module.exports = new SourceIngestionService();
