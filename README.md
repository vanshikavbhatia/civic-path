# CIVIC PATH — Intelligent Civic Procedure & Compliance Navigator

> **"Civic Path doesn't just tell citizens where to go. It tells them what needs to happen before they can get there."**

CIVIC PATH is a hackathon-ready, production-grade civic-tech web application designed to navigate citizens through fragmented and complicated government procedures. Powered by **Dependency Intelligence**, it transforms complex municipal, state, and central statutory regulations into a directed, visual compliance graph that explains prerequisites, uncovers verified exemptions, calculates official fees, and recalculates roadmaps when official circulars change.

---

## 🌟 Core Innovations & USPs

1. **Dependency Intelligence Over Fragmented Portals**:
   - Government portals (FSSAI, MCGM Aaple Sarkar, MSME Udyam) typically operate in silos.
   - Civic Path builds a directed dependency graph (`A → B → C`) determining the exact sequential order of requirements.

2. **"Why Am I Blocked?" Feature**:
   - Every blocked requirement provides a statutory explanation:
     > *"You cannot complete this step yet. Missing prerequisite: Potable Water Test (IS 10500). Why required: Regulation 2.1.3 of Food Safety & Standards Regulations mandates certified drinking water safety prior to FSSAI Form A registration."*
   - Includes a 1-click prerequisite completion action that automatically unlocks dependent nodes in real-time.

3. **Strict Data & Anti-Hallucination Policy**:
   - **VERIFIED OFFICIAL DATA**: Directly extracted and cited from official government authorities (`https://foscos.fssai.gov.in/`, `https://aaplesarkar.mahaonline.gov.in/`, `https://udyamregistration.gov.in/`).
   - Every verified fee, form, and exemption includes `officialSourceName`, `officialSourceURL`, and `lastVerified` date.
   - Any unverified sample data is explicitly tagged as **DEMO DATA**. No artificial costs or fake regulations are ever invented.

4. **"Change One Thing" Differential Comparator**:
   - Citizen alters a single parameter (e.g. *Home Bakery* → *Commercial Bakery* or *2 Helpers* → *15 Workers*).
   - The engine recalculates the graph and highlights:
     - ➕ **ADDED REQUIREMENTS** (e.g., Commercial Lease, MCGM Sec 394 Trade License, Mumbai Fire NOC, FoSTaC Certification, State License Form B).
     - ➖ **REMOVED REQUIREMENTS** (e.g., CHS Domestic Consent, Form F Intimation).
     - 🔄 **CHANGED REQUIREMENTS** (Fee escalation from ₹100 to ₹2,000; processing time from 7 to 30 days).

5. **Live Law / Rule Change Watchdog & Change Impact Engine**:
   - Simulates government circular changes (e.g., FSSAI 2026 Testing Mandate or MCGM Zero-Fee Micro Intimation).
   - Automatically determines how many citizen cases and roadmap steps are affected downstream.

6. **Citizen Toolkit**:
   - **Verified Exemption Finder**: Identifies statutory exemptions (e.g., Petty Manufacturer turnover under ₹12 Lakhs exempts from State Licensing and commercial fire clearances).
   - **Real Cost Calculator**: Itemized statutory fees with 100% source citations.
   - **Department Handoff Tracker**: Citizen → MSME → MCGM → Public Health Lab → FSSAI → Final Compliance.
   - **Document Quality Checker**: Pre-submission file resolution, format, and validity checks with official disclaimer.
   - **Universal Form Auto-Fill Profile**: Enter details once, reuse across supported portal filings.
   - **Escalation Path Finder**: Verified grievance escalation ladder (Helpdesk → Aaple Sarkar Grievance → Designated Officer → First Appellate Authority).

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, `@xyflow/react` (React Flow v12), Lucide Icons, Canvas Confetti.
- **Styling**: Vanilla CSS Design System with high-contrast civic-tech theme, glassmorphism, and responsive layouts.
- **Backend**: Node.js, Express 5 REST API.
- **Database**: SQLite (`better-sqlite3`) with WAL mode, foreign keys, and persistent schema.
- **Architecture Layers**:
  ```
  OFFICIAL GOVERNMENT SOURCE (FSSAI, MCGM, MSME, BIS, MPCB)
             ↓
     SOURCE FETCHER & INGESTION SERVICE
             ↓
     STRUCTURED REQUIREMENT EXTRACTION & VALIDATION
             ↓
     CIVIC KNOWLEDGE DATABASE (SQLite)
             ↓
     DEPENDENCY ENGINE (DAG, Topological Sort, Unlocking Logic)
             ↓
     PERSONALIZED ROADMAP & INTERACTIVE VISUAL GRAPH
             ↓
     CHANGE IMPACT ENGINE (Regulatory Propagation)
  ```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x recommended)
- **npm**: v9.x or higher

### 2. Installation
Open PowerShell or Terminal and navigate to the project directory:
```bash
cd "C:\Users\daksh\.gemini\antigravity-ide\scratch\civic-path"
npm install
```

### 3. Seed Verified Government Knowledge Store
Initialize the SQLite database with official Indian government sources and procedures:
```bash
npm run seed
```

### 4. Run the Application
Start both the Express backend (`http://localhost:3001`) and Vite frontend (`http://localhost:3000`):
```bash
npm run dev
```

Alternatively, to run the production server (backend serving the optimized client bundle on port 3001):
```bash
npm run build
npm start
```
Then visit: **`http://localhost:3001`** in your browser.

---

## 🎯 Complete 12-Step Judge Presentation Demo Flow

Follow this exact walkthrough during your presentation:

1. **Step 1 (Homepage Search)**:
   - On the homepage, view the headline: *"Civic procedures shouldn't feel like a maze."*
   - Enter or click the starter prompt: `"I want to start a small home bakery in Mumbai."`
   - Click **"Build My Civic Path"**.

2. **Step 2 (Qualifier Questions)**:
   - The interactive Qualifier Modal appears.
   - Select:
     - Type: **Home-based Kitchen**
     - Location: **Mumbai (MCGM / BMC)**
     - Turnover: **Up to ₹12 Lakhs / Year (Petty Food Manufacturer)**
     - Employees: **1–5 Workers (Micro / Family)**
   - Notice the green statutory insight explaining why home bakeries qualify for exemptions.
   - Click **"Generate Personalized Roadmap"**.

3. **Step 3 & 4 (Dependency Graph)**:
   - The interactive React Flow dependency graph renders.
   - Observe node status badges:
     - ✓ **Completed** (Green)
     - → **Available** (Blue, glowing pulse)
     - 🔒 **Blocked** (Red, locked)
     - ⏳ **In Progress** (Indigo)

4. **Step 5 ("Why am I blocked?")**:
   - Locate the blocked node: **FSSAI Petty Food Business Operator Registration (Form 'A')**.
   - Click the red button **"Why am I blocked?"**.
   - Review the modal explaining the missing prerequisites (*MCGM Form F Intimation* and *Potable Water Test Report*) and the statutory reasons citing Regulation 2.1.3 of FSS Act.

5. **Step 6 (Interactive Unlocking)**:
   - Inside the modal or drawer, click **"Complete Prerequisite"**.
   - Watch confetti trigger as the prerequisite completes and the downstream node automatically transitions from **Blocked** to **Available**!

6. **Step 7 (Real Cost Calculator)**:
   - Click the **"Exemptions & Costs"** tab in the top navigation.
   - Select **"Real Cost Calculator"**.
   - Observe the itemized breakdown (FSSAI ₹100 + Water Testing ₹1,200 + MSME Udyam ₹0 + MCGM Intimation ₹0 = Total ₹1,300).
   - Point out that every single cost line item has an official source link, and unknown costs have the statutory disclaimer.

7. **Step 8 (Source Transparency)**:
   - Switch to the **"Check for Exemptions"** sub-tab.
   - Review the statutory exemptions (Petty food manufacturer turnover under ₹12 Lakhs exempts from State License and commercial fire NOC).
   - Click any **"Official Gazette / Portal"** link to demonstrate source transparency.

8. **Step 9 & 10 (Government Update Watchdog & Change Impact Engine)**:
   - Click the **"Update Watchdog"** tab.
   - Review active official regulatory circulars with before/after comparisons.
   - Click the blue button **"Simulate Official Circular (Demo Step 9)"**.
   - Watch the **Change Impact Engine** compute downstream impacts in real-time, displaying how citizen cases and roadmap steps are re-flagged!

9. **Step 11 ("Change One Thing")**:
   - Click the **"Change One Thing"** tab.
   - Select the preset: **"Shift: Home Kitchen → Commercial Bakery Shop"**.
   - Review the differential impact:
     - **+5 Requirements Added** (Commercial Lease, Section 394 Trade License, Fire Safety NOC, FoSTaC Certification, FSSAI State License).
     - **-2 Requirements Removed** (CHS Domestic Consent, Form F Micro Intimation).
     - **Cost Delta**: Increases from ₹1,300 to ₹18,000+.
   - Click **"Apply This Modified Scenario"** to watch the active roadmap transform into a commercial procedure!

10. **Step 12 (My Civic Case Dashboard)**:
    - Click **"My Civic Case"**.
    - Review:
      - Overall compliance progress percentage.
      - **Department Handoff Tracker** (Citizen → MSME → MCGM → Public Health Lab → FSSAI).
      - **Deadlines & Renewal Manager** timeline.
      - **Form Auto-Fill Profile** (1-click copyable universal identity payload).
      - **Application Status Aggregator** with reference tracking.
      - **Escalation Path Finder** (Helpdesk → Grievance Portal → Designated Officer → First Appellate Authority).

11. **Reset Demo**:
    - Click **"Reset Demo Benchmark"** in the top navigation header at any time to return the database to its clean initial state.

---

## 🏛️ Curated Official Government Sources Registry

| Authority | Department | Title / Act | Official Portal URL |
| :--- | :--- | :--- | :--- |
| **FSSAI** | Ministry of Health & Family Welfare | Food Safety Compliance System (FoSCoS) | `https://foscos.fssai.gov.in/` |
| **MCGM / BMC** | Shops & Establishment Dept | Maharashtra Shops & Establishments Act, 2017 (Aaple Sarkar) | `https://aaplesarkar.mahaonline.gov.in/` |
| **Ministry of MSME** | Govt of India | Udyam Registration (Zero-Fee Official Portal) | `https://udyamregistration.gov.in/` |
| **MCGM / BMC** | Public Health Department | Section 394 Trade License, MMC Act 1888 | `https://portal.mcgm.gov.in/` |
| **Mumbai Fire Brigade** | Fire Prevention Cell | Fire Safety Clearance & Commercial NOC | `https://portal.mcgm.gov.in/` |
| **MPCB** | Environment Dept, Maharashtra | White Category Non-Polluting Food Classification | `https://mpcb.gov.in/` |
| **BIS / Public Health** | Dept of Consumer Affairs | IS 10500:2012 Drinking Water Specification | `https://www.services.bis.gov.in/` |

---

## 🔒 Mandatory Legal Disclaimers
1. **Source Grounding**: Information presented as verified government data is referenced from publicly accessible statutory rules and official government portals.
2. **Pre-Submission Document Checks**: The document quality checker provides pre-flight checks for resolution, size, format, and common validity parameters. Final legal acceptance is strictly determined by the relevant government authority.
3. **No Automatic Government Filing**: For security and compliance, Civic Path serves as an intelligent advisory navigator and does not submit filings without citizen authorization.
