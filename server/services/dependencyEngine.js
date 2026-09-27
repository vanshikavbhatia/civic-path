/**
 * Dependency Engine
 * CIVIC PATH - Core Innovation (Directed Dependency Graph & Unlocking Logic)
 * 
 * Rules:
 * IF prerequisite is incomplete -> current step = BLOCKED
 * IF all prerequisites are complete -> current step = AVAILABLE
 * IF user marks it complete -> dependent steps automatically unlock!
 */

const { db } = require('../db/database');

class DependencyEngine {
  /**
   * Builds the full directed dependency graph with nodes and directed edges
   * Computes node states: COMPLETED, AVAILABLE, BLOCKED, IN_PROGRESS
   */
  buildDependencyGraph(requirements, completedStepIds = [], inProgressStepIds = []) {
    const completedSet = new Set(completedStepIds);
    const inProgressSet = new Set(inProgressStepIds);

    const nodes = [];
    const edges = [];
    const stepMap = new Map();

    // Index all requirements
    for (const req of requirements) {
      stepMap.set(req.id, req);
    }

    // Determine state for each node
    for (const req of requirements) {
      const prereqs = Array.isArray(req.prerequisites) 
        ? req.prerequisites 
        : JSON.parse(req.prerequisites || '[]');

      let status = 'AVAILABLE';
      const missingPrereqs = [];

      if (completedSet.has(req.id)) {
        status = 'COMPLETED';
      } else if (inProgressSet.has(req.id)) {
        status = 'IN_PROGRESS';
      } else {
        for (const prereqId of prereqs) {
          if (!completedSet.has(prereqId)) {
            missingPrereqs.push(prereqId);
          }
        }
        if (missingPrereqs.length > 0) {
          status = 'BLOCKED';
        }
      }

      // Generate "Why am I blocked?" detailed rationale if blocked
      const blockedReason = status === 'BLOCKED' ? this.generateBlockedReason(req, missingPrereqs, stepMap) : null;

      nodes.push({
        id: req.id,
        procedureId: req.procedureId,
        title: req.title,
        description: req.description,
        requirementType: req.requirementType,
        department: req.department,
        authority: req.authority,
        fee: req.fee,
        feeExplanation: req.feeExplanation,
        deadline: req.deadline,
        estimatedProcessingDays: req.estimatedProcessingDays,
        documents: Array.isArray(req.documents) ? req.documents : JSON.parse(req.documents || '[]'),
        prerequisites: prereqs,
        missingPrerequisites: missingPrereqs,
        exemptions: Array.isArray(req.exemptions) ? req.exemptions : JSON.parse(req.exemptions || '[]'),
        officialSourceId: req.officialSourceId,
        officialSourceURL: req.officialSourceURL,
        lastVerified: req.lastVerified,
        status, // 'COMPLETED' | 'AVAILABLE' | 'BLOCKED' | 'IN_PROGRESS'
        blockedReason
      });

      // Create directed edges: Prerequisite -> Dependent Node
      for (const prereqId of prereqs) {
        if (stepMap.has(prereqId)) {
          const isEdgeActive = completedSet.has(prereqId);
          edges.push({
            id: `edge_${prereqId}_to_${req.id}`,
            source: prereqId,
            target: req.id,
            type: 'smoothstep',
            animated: isEdgeActive && status !== 'COMPLETED',
            style: {
              stroke: isEdgeActive ? '#10b981' : '#94a3b8',
              strokeWidth: isEdgeActive ? 2.5 : 1.5,
              strokeDasharray: isEdgeActive ? undefined : '5 5'
            }
          });
        }
      }
    }

    // Topological sort and depth assignment for layout
    const positionedNodes = this.layoutGraphNodes(nodes, edges);

    return {
      nodes: positionedNodes,
      edges,
      stats: {
        total: nodes.length,
        completed: nodes.filter(n => n.status === 'COMPLETED').length,
        available: nodes.filter(n => n.status === 'AVAILABLE').length,
        blocked: nodes.filter(n => n.status === 'BLOCKED').length,
        inProgress: nodes.filter(n => n.status === 'IN_PROGRESS').length,
        progressPercent: Math.round((nodes.filter(n => n.status === 'COMPLETED').length / (nodes.length || 1)) * 100)
      }
    };
  }

  /**
   * Generates statutory "Why am I blocked?" explanation payload
   */
  generateBlockedReason(currentReq, missingPrereqIds, stepMap) {
    const missingSteps = missingPrereqIds.map(id => {
      const step = stepMap.get(id);
      return {
        id,
        title: step ? step.title : id,
        department: step ? step.department : 'Government Department',
        officialSourceURL: step ? step.officialSourceURL : '',
        explanation: this.getPrerequisiteStatutoryRationale(step, currentReq)
      };
    });

    return {
      canComplete: false,
      currentStepTitle: currentReq.title,
      currentStepDepartment: currentReq.department,
      missingSteps,
      summary: `You cannot complete ${currentReq.title} yet because ${missingSteps.length} required prerequisite step(s) must be fulfilled first under applicable statutory rules.`
    };
  }

  /**
   * Explains why prerequisite A is strictly mandated before B
   */
  getPrerequisiteStatutoryRationale(prereqStep, targetStep) {
    if (!prereqStep) return 'Required by statutory compliance sequence.';

    if (prereqStep.id.includes('premise') || prereqStep.id.includes('lease')) {
      return `Government departments require verifiable proof of physical address and legal possession before issuing commercial identity numbers or municipal clearances.`;
    }
    if (prereqStep.id.includes('society_noc')) {
      return `Under the Maharashtra Co-operative Societies Act Model Bye-laws, residential premises require society consent/intimation for domestic non-nuisance kitchen operations before filing MCGM intimation.`;
    }
    if (prereqStep.id.includes('shops')) {
      return `FSSAI and commercial banking institutions mandate the Maharashtra Shops & Establishment Intimation/Certificate as primary local municipal registration proof.`;
    }
    if (prereqStep.id.includes('water')) {
      return `Under Regulation 2.1.3 of Food Safety and Standards Regulations, food business applications require certified potable water testing (IS 10500) within the last 12 months to verify public health safety.`;
    }
    if (prereqStep.id.includes('fire')) {
      return `Municipal Corporation Section 394 Health Trade licenses require a Fire Safety NOC to safeguard occupants against electrical oven or gas manifold fire hazards.`;
    }
    return `Statutory dependency: ${prereqStep.title} is an official prerequisite for ${targetStep.title}.`;
  }

  /**
   * Assigns grid / layered coordinates for visual React Flow rendering
   */
  layoutGraphNodes(nodes, edges) {
    // Build adjacency list for depth computation
    const inDegree = new Map();
    const childrenMap = new Map();
    for (const node of nodes) {
      inDegree.set(node.id, 0);
      childrenMap.set(node.id, []);
    }

    for (const edge of edges) {
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
      const list = childrenMap.get(edge.source) || [];
      list.push(edge.target);
      childrenMap.set(edge.source, list);
    }

    // Determine tiers / levels (BFS from root nodes with inDegree 0)
    const levelMap = new Map();
    const queue = [];

    for (const node of nodes) {
      if ((inDegree.get(node.id) || 0) === 0) {
        levelMap.set(node.id, 0);
        queue.push(node.id);
      }
    }

    while (queue.length > 0) {
      const curr = queue.shift();
      const currLevel = levelMap.get(curr) || 0;
      const children = childrenMap.get(curr) || [];

      for (const child of children) {
        const existingLevel = levelMap.get(child) || 0;
        if (currLevel + 1 > existingLevel) {
          levelMap.set(child, currLevel + 1);
          queue.push(child);
        }
      }
    }

    // Group nodes by level for clean columnar layout
    const levels = [];
    for (const node of nodes) {
      const lvl = levelMap.get(node.id) || 0;
      if (!levels[lvl]) levels[lvl] = [];
      levels[lvl].push(node);
    }

    const HORIZONTAL_SPACING = 340;
    const VERTICAL_SPACING = 210;

    return nodes.map(node => {
      const lvl = levelMap.get(node.id) || 0;
      const rowNodes = levels[lvl] || [node];
      const indexInRow = rowNodes.findIndex(n => n.id === node.id);
      const totalInRow = rowNodes.length;
      
      // Center items vertically in their column
      const yOffset = (indexInRow - (totalInRow - 1) / 2) * VERTICAL_SPACING + 180;
      const xOffset = lvl * HORIZONTAL_SPACING + 60;

      return {
        ...node,
        position: { x: xOffset, y: Math.max(50, yOffset) }
      };
    });
  }

  /**
   * Automatically calculates blocked steps given a set of completed step IDs
   */
  calculateBlockedSteps(requirements, completedStepIds) {
    const completedSet = new Set(completedStepIds);
    const blocked = [];

    for (const req of requirements) {
      if (completedSet.has(req.id)) continue;
      const prereqs = Array.isArray(req.prerequisites) ? req.prerequisites : JSON.parse(req.prerequisites || '[]');
      const isBlocked = prereqs.some(p => !completedSet.has(p));
      if (isBlocked) {
        blocked.push(req.id);
      }
    }
    return blocked;
  }

  /**
   * Toggles completion for a step in a Civic Case and returns updated graph
   */
  unlockStep(caseId, stepId) {
    const civicCase = db.prepare('SELECT * FROM CivicCases WHERE id = ?').get(caseId);
    if (!civicCase) {
      throw new Error(`Civic case with ID ${caseId} not found.`);
    }

    let completed = JSON.parse(civicCase.completedSteps || '[]');
    let inProgress = JSON.parse(civicCase.inProgressSteps || '[]');

    const completedSet = new Set(completed);
    const inProgressSet = new Set(inProgress);

    if (completedSet.has(stepId)) {
      // Toggle off (unmark)
      completedSet.delete(stepId);
    } else {
      // Mark completed & remove from inProgress
      completedSet.add(stepId);
      inProgressSet.delete(stepId);
    }

    const newCompleted = Array.from(completedSet);
    const newInProgress = Array.from(inProgressSet);
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE CivicCases 
      SET completedSteps = ?, inProgressSteps = ?, updatedAt = ?
      WHERE id = ?
    `).run(JSON.stringify(newCompleted), JSON.stringify(newInProgress), now, caseId);

    // Recalculate graph
    const qualifiers = JSON.parse(civicCase.qualifiers || '{}');
    const requirements = this.getFilteredRequirements(qualifiers);
    return this.buildDependencyGraph(requirements, newCompleted, newInProgress);
  }

  /**
   * Filters requirements based on citizen qualifiers (establishmentType, scale, employee count, turnover)
   */
  getFilteredRequirements(qualifiers = {}) {
    const type = qualifiers.establishmentType || 'home';
    const scale = qualifiers.scale || 'micro';
    const employees = Number(qualifiers.employees || 2);
    const turnover = Number(qualifiers.turnoverLakhs || 8);

    const allReqs = db.prepare('SELECT * FROM CivicRequirements WHERE status = ?').all('active');

    return allReqs.filter(req => {
      const types = JSON.parse(req.applicableEstablishmentTypes || '["home"]');
      if (!types.includes(type)) return false;

      const scales = JSON.parse(req.applicableScales || '["micro"]');
      if (scales.length > 0 && !scales.includes(scale)) return false;

      if (employees < req.minEmployees || employees > req.maxEmployees) return false;

      if (req.maxTurnoverLakhs !== null && turnover > req.maxTurnoverLakhs) return false;

      return true;
    });
  }

  /**
   * Recalculates roadmap for updated qualifiers
   */
  recalculateRoadmap(qualifiers, existingCaseId = null) {
    const requirements = this.getFilteredRequirements(qualifiers);
    let completedSteps = [];
    let inProgressSteps = [];

    if (existingCaseId) {
      const c = db.prepare('SELECT * FROM CivicCases WHERE id = ?').get(existingCaseId);
      if (c) {
        completedSteps = JSON.parse(c.completedSteps || '[]');
        inProgressSteps = JSON.parse(c.inProgressSteps || '[]');
      }
    }

    return this.buildDependencyGraph(requirements, completedSteps, inProgressSteps);
  }
}

module.exports = new DependencyEngine();
