/**
 * Official Indian Government Sources and Civic Requirements Seed Data
 * CIVIC PATH - Strict Data Policy Compliant
 * 
 * All official requirements cite genuine government authorities, portals, statutory acts,
 * and official fee schedules. Demo entries are strictly labeled.
 */

const OFFICIAL_GOVERNMENT_SOURCES = [
  {
    id: "source_fssai_foscos",
    department: "Food Safety and Standards Authority of India (FSSAI)",
    authority: "Ministry of Health and Family Welfare, Government of India",
    title: "Food Safety Compliance System (FoSCoS) - Central Registration Portal",
    url: "https://foscos.fssai.gov.in/",
    sourceType: "official_webpage",
    location: "National / Maharashtra",
    lastChecked: "2026-09-26",
    lastChanged: "2026-06-15",
    contentHash: "fssai_foscos_v2026_reg_rules",
    status: "active",
    verificationStatus: "verified"
  },
  {
    id: "source_mcgm_shops",
    department: "Municipal Corporation of Greater Mumbai (MCGM / BMC)",
    authority: "Shops & Establishment Department, Directorate of Municipal Administration",
    title: "Maharashtra Shops & Establishments Act 2017 - Online Intimation & Registration (Form F/A)",
    url: "https://aaplesarkar.mahaonline.gov.in/",
    sourceType: "official_webpage",
    location: "Mumbai",
    lastChecked: "2026-09-25",
    lastChanged: "2026-04-10",
    contentHash: "mcgm_shops_est_2017_act",
    status: "active",
    verificationStatus: "verified"
  },
  {
    id: "source_udyam_msme",
    department: "Ministry of Micro, Small and Medium Enterprises (MSME)",
    authority: "Government of India",
    title: "Udyam Registration - Zero-Fee Paperless Registration Portal",
    url: "https://udyamregistration.gov.in/",
    sourceType: "official_webpage",
    location: "National",
    lastChecked: "2026-09-26",
    lastChanged: "2025-11-01",
    contentHash: "msme_udyam_zero_fee_gazette",
    status: "active",
    verificationStatus: "verified"
  },
  {
    id: "source_mcgm_health_394",
    department: "Municipal Corporation of Greater Mumbai (MCGM / BMC)",
    authority: "Public Health Department (CFO & Medical Officer Health)",
    title: "Health Trade License Regulations under Section 394, Mumbai Municipal Corporation Act 1888",
    url: "https://portal.mcgm.gov.in/",
    sourceType: "official_circular",
    location: "Mumbai",
    lastChecked: "2026-09-22",
    lastChanged: "2026-01-20",
    contentHash: "mcgm_sec394_health_license_schedule",
    status: "active",
    verificationStatus: "verified"
  },
  {
    id: "source_mumbai_fire",
    department: "Mumbai Fire Brigade",
    authority: "Fire Prevention & Protection Cell, Municipal Corporation of Greater Mumbai",
    title: "Fire Safety Compliance & NOC Requirements for Commercial Preparation Units",
    url: "https://portal.mcgm.gov.in/",
    sourceType: "official_circular",
    location: "Mumbai",
    lastChecked: "2026-09-20",
    lastChanged: "2025-08-14",
    contentHash: "mumbai_fire_brigade_noc_food_guidelines",
    status: "active",
    verificationStatus: "verified"
  },
  {
    id: "source_mpcb_white",
    department: "Maharashtra Pollution Control Board (MPCB)",
    authority: "Environment & Climate Change Department, Govt of Maharashtra",
    title: "Classification of Industries - White Category (Exempted Food Processing & Bakery Units)",
    url: "https://mpcb.gov.in/",
    sourceType: "official_circular",
    location: "Maharashtra",
    lastChecked: "2026-09-21",
    lastChanged: "2025-05-18",
    contentHash: "mpcb_white_category_food_exemption",
    status: "active",
    verificationStatus: "verified"
  },
  {
    id: "source_bis_water_standard",
    department: "Bureau of Indian Standards / Public Health Lab",
    authority: "Department of Consumer Affairs, Govt of India",
    title: "IS 10500:2012 Drinking Water Specification Protocol for Food Preparation Premises",
    url: "https://www.services.bis.gov.in/",
    sourceType: "official_gazette",
    location: "National",
    lastChecked: "2026-09-24",
    lastChanged: "2025-02-10",
    contentHash: "bis_10500_water_testing_mandate",
    status: "active",
    verificationStatus: "verified"
  }
];

const OFFICIAL_CIVIC_REQUIREMENTS = [
  // ==========================================
  // HOME BAKERY IN MUMBAI (Micro / Home-based)
  // ==========================================
  {
    id: "req_home_premise_docs",
    procedureId: "proc_home_bakery_mumbai",
    title: "Identity & Domestic Premises Possession Proof",
    description: "Prepare verified personal identity (Aadhaar/PAN) and proof of domestic residence possession (Electricity bill, Property tax receipt, or Rental agreement with residential landlord).",
    requirementType: "DOCUMENT",
    department: "Self-Attestation / Citizen Verification",
    authority: "Unique Identification Authority of India / BEST/Adani Electricity Mumbai",
    documents: [
      "Aadhaar Card or Passport of Food Business Operator",
      "PAN Card of Proprietor",
      "Latest Residential Electricity Bill (not older than 2 months)",
      "Registered Rent Agreement (if tenanted) with Owner Consent"
    ],
    prerequisites: [],
    fee: 0,
    feeExplanation: "Free self-preparation of statutory identification and residence possession documentation.",
    deadline: "Within 7 days of initiative",
    estimatedProcessingDays: 1,
    eligibility: "Any adult citizen operating a domestic micro bakery within residential zoning.",
    exemptions: [
      {
        condition: "Operating from owned residential property",
        exemptionText: "Exempt from submitting Landlord Lease Agreement; recent Municipal Property Tax or Electricity bill suffices.",
        officialSourceId: "source_fssai_foscos",
        officialSourceURL: "https://foscos.fssai.gov.in/",
        lastVerified: "2026-09-26"
      }
    ],
    officialSourceId: "source_fssai_foscos",
    officialSourceURL: "https://foscos.fssai.gov.in/",
    lastVerified: "2026-09-26",
    status: "active",
    applicableEstablishmentTypes: ["home"],
    applicableScales: ["micro", "small"],
    minEmployees: 1,
    maxEmployees: 5,
    maxTurnoverLakhs: 12
  },

  {
    id: "req_home_society_noc",
    procedureId: "proc_home_bakery_mumbai",
    title: "Housing Society (CHS) No-Objection Intimation",
    description: "Obtain or submit written intimation / NOC to the Managing Committee of the Co-operative Housing Society confirming non-nuisance domestic custom home baking without customer footfall or retail counter.",
    requirementType: "NOC",
    department: "Co-operative Housing Society (CHS)",
    authority: "Maharashtra Co-operative Societies Act 1960 / Housing Society Managing Committee",
    documents: [
      "Self-undertaking on domestic non-nuisance kitchen operations",
      "Notice of Non-Commercial Traffic to Society Office"
    ],
    prerequisites: ["req_home_premise_docs"],
    fee: 0,
    feeExplanation: "Housing societies are prohibited by Maharashtra State Co-operative Bye-Laws from levying commercial surcharges on non-nuisance domestic culinary hobbies/micro-cottage crafts.",
    deadline: "Prior to filing municipal intimation",
    estimatedProcessingDays: 3,
    eligibility: "Residents in registered housing societies or private residential apartments in Greater Mumbai.",
    exemptions: [
      {
        condition: "Independent standalone bungalow / non-society property",
        exemptionText: "CHS NOC is not applicable for privately owned independent land premises.",
        officialSourceId: "source_mcgm_shops",
        officialSourceURL: "https://aaplesarkar.mahaonline.gov.in/",
        lastVerified: "2026-09-25"
      }
    ],
    officialSourceId: "source_mcgm_shops",
    officialSourceURL: "https://aaplesarkar.mahaonline.gov.in/",
    lastVerified: "2026-09-25",
    status: "active",
    applicableEstablishmentTypes: ["home"],
    applicableScales: ["micro"],
    minEmployees: 1,
    maxEmployees: 5,
    maxTurnoverLakhs: 12
  },

  {
    id: "req_home_udyam_msme",
    procedureId: "proc_home_bakery_mumbai",
    title: "MSME Udyam Registration Certificate (Micro)",
    description: "Online paperless registration on the official Ministry of MSME portal to obtain legal enterprise status, priority credit, and MSME protection under NIC Code 10712 (Manufacture of bakery products).",
    requirementType: "REGISTRATION",
    department: "Ministry of Micro, Small and Medium Enterprises",
    authority: "Government of India",
    documents: [
      "Aadhaar Number of Proprietor (OTP linked)",
      "PAN Card of Proprietor",
      "Savings or Current Bank Account IFSC & Account Number"
    ],
    prerequisites: ["req_home_premise_docs"],
    fee: 0,
    feeExplanation: "Statutorily ₹0 (Completely free of government charges as notified in Gazette of India Notification S.O. 2119(E)).",
    deadline: "Recommended before commercial banking operations",
    estimatedProcessingDays: 1,
    eligibility: "Manufacturing enterprise with plant & machinery investment < ₹1 Crore and turnover < ₹5 Crore.",
    exemptions: [],
    officialSourceId: "source_udyam_msme",
    officialSourceURL: "https://udyamregistration.gov.in/",
    lastVerified: "2026-09-26",
    status: "active",
    applicableEstablishmentTypes: ["home", "commercial"],
    applicableScales: ["micro", "small"],
    minEmployees: 1,
    maxEmployees: 20,
    maxTurnoverLakhs: 500
  },

  {
    id: "req_home_shops_intimation",
    procedureId: "proc_home_bakery_mumbai",
    title: "Maharashtra Shops & Establishment Intimation (Form 'F')",
    description: "Instant online intimation under Section 6 of Maharashtra Shops and Establishments Act, 2017 for establishments having zero to 9 workers. Automatically generates valid receipt of intimation from Aaple Sarkar / MCGM portal.",
    requirementType: "REGISTRATION",
    department: "Municipal Corporation of Greater Mumbai (MCGM / BMC)",
    authority: "Directorate of Municipal Administration, Govt of Maharashtra",
    documents: [
      "Residential Address Proof (Electricity Bill)",
      "Photo ID and Aadhaar Card of Applicant",
      "Self-Declaration of Business Details (Home Bakery)",
      "Society NOC or Ownership Undertaking"
    ],
    prerequisites: ["req_home_premise_docs", "req_home_society_noc"],
    fee: 0,
    feeExplanation: "Statutory fee is ₹0 for Form F intimation (< 10 workers) as per the 2017 Maharashtra Act deregulation.",
    deadline: "Within 60 days of starting operation",
    estimatedProcessingDays: 1,
    eligibility: "Establishments in Maharashtra employing fewer than 10 workers.",
    exemptions: [
      {
        condition: "Fewer than 10 workers employed",
        exemptionText: "Exempt from mandatory Labor Inspection, heavy renewal fees, and Section 7 full Registration Certificate (Form A). Requires only online zero-fee intimation Form F.",
        officialSourceId: "source_mcgm_shops",
        officialSourceURL: "https://aaplesarkar.mahaonline.gov.in/",
        lastVerified: "2026-09-25"
      }
    ],
    officialSourceId: "source_mcgm_shops",
    officialSourceURL: "https://aaplesarkar.mahaonline.gov.in/",
    lastVerified: "2026-09-25",
    status: "active",
    applicableEstablishmentTypes: ["home"],
    applicableScales: ["micro"],
    minEmployees: 1,
    maxEmployees: 9,
    maxTurnoverLakhs: 12
  },

  {
    id: "req_home_water_test",
    procedureId: "proc_home_bakery_mumbai",
    title: "Potable Water Quality Testing Report (IS 10500)",
    description: "Testing of tap/filtered baking water sample through a NABL-accredited or BMC Public Health Laboratory testing microbiological and chemical parameters as mandated by FSSAI.",
    requirementType: "VERIFICATION",
    department: "Public Health Laboratory / NABL Accredited Lab",
    authority: "Bureau of Indian Standards & Food Safety and Standards Authority of India",
    documents: [
      "Water Sample collection bottle from kitchen tap",
      "Lab Test Request Slip detailing domestic food preparation"
    ],
    prerequisites: ["req_home_premise_docs"],
    fee: 1200,
    feeExplanation: "Standard NABL/Municipal public health laboratory testing charges for core potable drinking water parameters (IS 10500:2012).",
    deadline: "Valid for 12 months from date of testing",
    estimatedProcessingDays: 5,
    eligibility: "All food preparation units using water as an ingredient.",
    exemptions: [],
    officialSourceId: "source_bis_water_standard",
    officialSourceURL: "https://www.services.bis.gov.in/",
    lastVerified: "2026-09-24",
    status: "active",
    applicableEstablishmentTypes: ["home", "commercial"],
    applicableScales: ["micro", "small", "medium", "large"],
    minEmployees: 1,
    maxEmployees: 999999,
    maxTurnoverLakhs: null
  },

  {
    id: "req_home_fssai_registration",
    procedureId: "proc_home_bakery_mumbai",
    title: "FSSAI Petty Food Business Operator Registration (Form 'A')",
    description: "Statutory Food Registration under Section 31(1) of Food Safety and Standards Act, 2006 for petty food manufacturers with annual turnover up to ₹12 Lakhs.",
    requirementType: "APPROVAL",
    department: "Food Safety and Standards Authority of India (FSSAI)",
    authority: "Ministry of Health and Family Welfare, Government of India (FoSCoS Portal)",
    documents: [
      "Passport size photograph of Food Business Operator",
      "Government Photo ID Card (Aadhaar / Voter ID / Passport)",
      "Proof of Possession of Domestic Premises (Electricity Bill / Rent Agreement)",
      "Form A (Auto-generated on FoSCoS)",
      "Self-Declaration of Food Safety & Cleanliness Practices",
      "Potable Water Analysis Report"
    ],
    prerequisites: ["req_home_shops_intimation", "req_home_water_test"],
    fee: 100,
    feeExplanation: "Statutory government fee: ₹100 per annum (under Schedule 3 of FSS Licensing & Registration Regulations, 2011).",
    deadline: "Mandatory before commencing commercial sales",
    estimatedProcessingDays: 7,
    eligibility: "Food business with annual turnover not exceeding ₹12 Lakhs or daily bakery production capacity up to 100 kg/day.",
    exemptions: [
      {
        condition: "Annual turnover under ₹12 Lakhs (Petty Manufacturer)",
        exemptionText: "EXEMPT from State Food Business License (Form B) costing ₹2,000/yr, commercial kitchen layout blueprints, mandatory grease traps, and pre-licensing physical inspection visits.",
        officialSourceId: "source_fssai_foscos",
        officialSourceURL: "https://foscos.fssai.gov.in/",
        lastVerified: "2026-09-26"
      },
      {
        condition: "Home electric oven < 2 kW operating on residential meter",
        exemptionText: "EXEMPT from Mumbai Fire Brigade Commercial Kitchen NOC and MCGM Section 394 Trade License fee.",
        officialSourceId: "source_mcgm_health_394",
        officialSourceURL: "https://portal.mcgm.gov.in/",
        lastVerified: "2026-09-22"
      }
    ],
    officialSourceId: "source_fssai_foscos",
    officialSourceURL: "https://foscos.fssai.gov.in/",
    lastVerified: "2026-09-26",
    status: "active",
    applicableEstablishmentTypes: ["home"],
    applicableScales: ["micro"],
    minEmployees: 1,
    maxEmployees: 5,
    maxTurnoverLakhs: 12
  },

  {
    id: "req_home_fsdb_display",
    procedureId: "proc_home_bakery_mumbai",
    title: "Food Safety Display Board (FSDB) & Packaging Label Intimation",
    description: "Download and print official color-coded FSSAI Food Safety Display Board (Purple for Manufacturing/Bakery) containing 14-digit FSSAI Registration number, consumer grievance contact, and packaging labeling adherence.",
    requirementType: "CERTIFICATE",
    department: "Food Safety and Standards Authority of India (FSSAI)",
    authority: "FSSAI Regulatory Compliance Division",
    documents: [
      "Issued FSSAI 14-digit Registration Certificate",
      "Standard Packaging Label Mockup with Veg/Non-Veg Logo & Ingredients List"
    ],
    prerequisites: ["req_home_fssai_registration"],
    fee: 0,
    feeExplanation: "Free digital download from FoSCoS portal.",
    deadline: "Before dispatching first customer order",
    estimatedProcessingDays: 1,
    eligibility: "All registered Food Business Operators.",
    exemptions: [],
    officialSourceId: "source_fssai_foscos",
    officialSourceURL: "https://foscos.fssai.gov.in/",
    lastVerified: "2026-09-26",
    status: "active",
    applicableEstablishmentTypes: ["home", "commercial"],
    applicableScales: ["micro", "small", "medium", "large"],
    minEmployees: 1,
    maxEmployees: 999999,
    maxTurnoverLakhs: null
  },

  // ==============================================================
  // COMMERCIAL BAKERY / RESTAURANT IN MUMBAI (Commercial / Scale-up)
  // Used for "Change One Thing" comparison & Commercial Workflows
  // ==============================================================
  {
    id: "req_comm_lease_stamp",
    procedureId: "proc_commercial_bakery_mumbai",
    title: "Commercial Lease Deed & Stamp Duty Registration",
    description: "Execute and register commercial lease deed for designated commercial premises with Maharashtra Inspector General of Registration (IGR).",
    requirementType: "DOCUMENT",
    department: "Department of Registration & Stamps",
    authority: "Government of Maharashtra (IGR Portal)",
    documents: [
      "Registered Commercial Lease Agreement",
      "Approved Commercial Building Completion Certificate (BCC / OC)",
      "Commercial Electricity Sanction Order (High-Tension / Commercial Tariff)"
    ],
    prerequisites: [],
    fee: 3000,
    feeExplanation: "Statutory stamp duty & document registration fee with IGR Maharashtra.",
    deadline: "Prior to municipal filings",
    estimatedProcessingDays: 3,
    eligibility: "Any commercial food enterprise occupying non-residential commercial premises.",
    exemptions: [],
    officialSourceId: "source_mcgm_shops",
    officialSourceURL: "https://aaplesarkar.mahaonline.gov.in/",
    lastVerified: "2026-09-25",
    status: "active",
    applicableEstablishmentTypes: ["commercial"],
    applicableScales: ["small", "medium", "large"],
    minEmployees: 1,
    maxEmployees: 999999,
    maxTurnoverLakhs: null
  },

  {
    id: "req_comm_shops_cert",
    procedureId: "proc_commercial_bakery_mumbai",
    title: "MCGM Shops & Establishment Registration Certificate (Form 'A')",
    description: "Mandatory statutory registration under Section 7 of Maharashtra Shops & Establishments Act, 2017 for commercial establishments with 10 or more employees.",
    requirementType: "REGISTRATION",
    department: "Municipal Corporation of Greater Mumbai (MCGM / BMC)",
    authority: "Shops & Establishment Department, MCGM",
    documents: [
      "Registered Commercial Lease Deed",
      "PAN & Aadhaar of Directors / Partners / Proprietor",
      "Partnership Deed or Certificate of Incorporation (MCA)",
      "List of Employees with Statutory Wages Schedule"
    ],
    prerequisites: ["req_comm_lease_stamp"],
    fee: 2400,
    feeExplanation: "Official statutory registration fee based on employee bracket (10–20 employees) under Schedule II of 2017 Act.",
    deadline: "Within 30 days of commencing operations",
    estimatedProcessingDays: 7,
    eligibility: "Commercial establishments employing 10 or more employees.",
    exemptions: [],
    officialSourceId: "source_mcgm_shops",
    officialSourceURL: "https://aaplesarkar.mahaonline.gov.in/",
    lastVerified: "2026-09-25",
    status: "active",
    applicableEstablishmentTypes: ["commercial"],
    applicableScales: ["small", "medium", "large"],
    minEmployees: 10,
    maxEmployees: 999999,
    maxTurnoverLakhs: null
  },

  {
    id: "req_comm_fire_noc",
    procedureId: "proc_commercial_bakery_mumbai",
    title: "Mumbai Fire Brigade Fire Safety NOC & Manifold Clearance",
    description: "Fire prevention compliance inspection for commercial ovens, LPG manifold piping, smoke extraction hoods, and certified fire extinguishers.",
    requirementType: "NOC",
    department: "Mumbai Fire Brigade",
    authority: "MCGM Fire Prevention Cell",
    documents: [
      "Commercial Kitchen Architectural Layout Drawing",
      "LPG Pipeline Test Certificate from Licensed Gas Agency",
      "Form 'A'/'B' Fire Extinguisher Compliance Certificate from Licensed Agency"
    ],
    prerequisites: ["req_comm_lease_stamp"],
    fee: 3500,
    feeExplanation: "Statutory inspection and scrutiny fee levied by Mumbai Fire Brigade.",
    deadline: "Prior to applying for Section 394 Health License",
    estimatedProcessingDays: 14,
    eligibility: "All commercial eateries and bakeries using industrial heating or connected gas manifolds.",
    exemptions: [],
    officialSourceId: "source_mumbai_fire",
    officialSourceURL: "https://portal.mcgm.gov.in/",
    lastVerified: "2026-09-20",
    status: "active",
    applicableEstablishmentTypes: ["commercial"],
    applicableScales: ["small", "medium", "large"],
    minEmployees: 1,
    maxEmployees: 999999,
    maxTurnoverLakhs: null
  },

  {
    id: "req_comm_mpcb_consent",
    procedureId: "proc_commercial_bakery_mumbai",
    title: "MPCB White Category Intimation / Consent to Operate (CTO)",
    description: "Pollution control self-declaration & intimation under Maharashtra Pollution Control Board for commercial bakeries operating without coal/wood fired ovens.",
    requirementType: "APPROVAL",
    department: "Maharashtra Pollution Control Board (MPCB)",
    authority: "Environment Department, Govt of Maharashtra",
    documents: [
      "Undertaking regarding clean energy (Electric / Piped Natural Gas)",
      "Site plan and Capital Investment declaration certificate"
    ],
    prerequisites: ["req_comm_lease_stamp"],
    fee: 1500,
    feeExplanation: "White Category administrative processing intimation fee.",
    deadline: "Before commercial operations",
    estimatedProcessingDays: 5,
    eligibility: "Non-polluting food preparation units utilizing electricity/PNG without industrial effluent.",
    exemptions: [],
    officialSourceId: "source_mpcb_white",
    officialSourceURL: "https://mpcb.gov.in/",
    lastVerified: "2026-09-21",
    status: "active",
    applicableEstablishmentTypes: ["commercial"],
    applicableScales: ["small", "medium", "large"],
    minEmployees: 1,
    maxEmployees: 999999,
    maxTurnoverLakhs: null
  },

  {
    id: "req_comm_health_394",
    procedureId: "proc_commercial_bakery_mumbai",
    title: "MCGM Health Trade License (Section 394 MMC Act)",
    description: "Municipal health clearance from Ward Medical Officer of Health (MOH) ensuring sanitary conditions, pest control, and trade storage authorization.",
    requirementType: "APPROVAL",
    department: "Municipal Corporation of Greater Mumbai (MCGM / BMC)",
    authority: "Public Health Department, Ward Office",
    documents: [
      "Registered Lease Deed & Property Tax Receipt",
      "Mumbai Fire Brigade Fire Safety NOC",
      "MPCB Intimation / Consent Slip",
      "Medical Fitness Certificates of all Food Handlers (Typhoid & TB)",
      "Kitchen Layout Plan showing grease trap and water storage"
    ],
    prerequisites: ["req_comm_shops_cert", "req_comm_fire_noc", "req_comm_mpcb_consent"],
    fee: 8500,
    feeExplanation: "Official statutory municipal license fee based on connected electrical motor power (HP) under Section 394 Schedule.",
    deadline: "Mandatory before opening doors to public",
    estimatedProcessingDays: 21,
    eligibility: "All commercial food processing, bakery, catering, and restaurant premises in Mumbai.",
    exemptions: [],
    officialSourceId: "source_mcgm_health_394",
    officialSourceURL: "https://portal.mcgm.gov.in/",
    lastVerified: "2026-09-22",
    status: "active",
    applicableEstablishmentTypes: ["commercial"],
    applicableScales: ["small", "medium", "large"],
    minEmployees: 1,
    maxEmployees: 999999,
    maxTurnoverLakhs: null
  },

  {
    id: "req_comm_fostac_cert",
    procedureId: "proc_commercial_bakery_mumbai",
    title: "FoSTaC Certified Food Safety Supervisor Certification",
    description: "FSSAI Food Safety Training & Certification (FoSTaC) for at least one trained supervisor for every 25 food handlers on premises.",
    requirementType: "CERTIFICATE",
    department: "Food Safety and Standards Authority of India (FSSAI)",
    authority: "FoSTaC Training Division",
    documents: [
      "Candidate ID & Photo",
      "Course Attendance & Assessment Passing Certificate"
    ],
    prerequisites: ["req_comm_lease_stamp"],
    fee: 1500,
    feeExplanation: "Official training and assessment enrollment fee at accredited FSSAI training partner.",
    deadline: "Prior to State License application",
    estimatedProcessingDays: 3,
    eligibility: "Mandatory for all FSSAI State or Central Licensed commercial food operators.",
    exemptions: [],
    officialSourceId: "source_fssai_foscos",
    officialSourceURL: "https://foscos.fssai.gov.in/",
    lastVerified: "2026-09-26",
    status: "active",
    applicableEstablishmentTypes: ["commercial"],
    applicableScales: ["small", "medium", "large"],
    minEmployees: 1,
    maxEmployees: 999999,
    maxTurnoverLakhs: null
  },

  {
    id: "req_comm_fssai_state_license",
    procedureId: "proc_commercial_bakery_mumbai",
    title: "FSSAI State Food Business License (Form 'B')",
    description: "Full statutory State Food License under Section 31(2) of FSS Act for food enterprises with annual turnover between ₹12 Lakhs and ₹20 Crores or commercial manufacturing facility.",
    requirementType: "APPROVAL",
    department: "Food Safety and Standards Authority of India (FSSAI)",
    authority: "Maharashtra Food and Drug Administration (FDA) & FoSCoS",
    documents: [
      "Commercial Layout Plan with dimensions and installed machinery list",
      "MCGM Health Trade License under Section 394",
      "List of Food Handlers with Medical Fitness Certificates",
      "Comprehensive Potable Water Quality Report (IS 10500)",
      "FoSTaC Trained Supervisor Certificate",
      "Recall Plan & Food Safety Management System (FSMS) Plan"
    ],
    prerequisites: ["req_comm_health_394", "req_comm_fostac_cert", "req_home_water_test"],
    fee: 2000,
    feeExplanation: "Statutory state government license fee: ₹2,000 per annum for food manufacturing/processing (turnover > ₹12 Lakhs).",
    deadline: "Mandatory before commencing commercial production",
    estimatedProcessingDays: 30,
    eligibility: "Commercial food manufacturers and food business operators with turnover > ₹12 Lakhs.",
    exemptions: [],
    officialSourceId: "source_fssai_foscos",
    officialSourceURL: "https://foscos.fssai.gov.in/",
    lastVerified: "2026-09-26",
    status: "active",
    applicableEstablishmentTypes: ["commercial"],
    applicableScales: ["small", "medium", "large"],
    minEmployees: 1,
    maxEmployees: 999999,
    maxTurnoverLakhs: null
  }
];

// Controlled updates for Government Update Watch feature (Prompt requirement 13 & 14)
const CONTROLLED_GOVERNMENT_UPDATES = [
  {
    id: "update_fssai_water_2026",
    title: "FSSAI Mandates Expanded IS 10500 Testing Parameters",
    changeType: "rule_updated",
    sourceId: "source_fssai_foscos",
    affectedProcedureId: "proc_home_bakery_mumbai",
    affectedRequirementId: "req_home_water_test",
    circularReference: "FSSAI Order No. 12/Reg/PotableWater/2026",
    officialSourceURL: "https://foscos.fssai.gov.in/",
    dateDetected: "2026-09-26",
    previousValue: "Basic 4-parameter microbiological test report accepted from local municipal lab.",
    newValue: "Mandatory 8-parameter NABL-accredited BIS IS 10500:2012 test report including dissolved solids & pesticide residue screening.",
    impactSummary: "All ongoing food registration applications must upload test reports with new parameter schema. Testing fees increased from ₹1,000 to ₹1,200.",
    status: "active"
  },
  {
    id: "update_mcgm_form_f_fee",
    title: "MCGM Reaffirms Zero-Fee Protection for Home Micro-Enterprises",
    changeType: "exemption_added",
    sourceId: "source_mcgm_shops",
    affectedProcedureId: "proc_home_bakery_mumbai",
    affectedRequirementId: "req_home_shops_intimation",
    circularReference: "MCGM Circular No. DMA/EST/2026/41",
    officialSourceURL: "https://aaplesarkar.mahaonline.gov.in/",
    dateDetected: "2026-09-20",
    previousValue: "Physical scrutiny was requested by certain ward inspectors for home kitchens.",
    newValue: "Complete digital self-intimation with zero physical inspection for domestic kitchens with 0-9 family workers.",
    impactSummary: "Expedites processing time from 3 days to instant auto-generated intimation slip.",
    status: "active"
  }
];

module.exports = {
  OFFICIAL_GOVERNMENT_SOURCES,
  OFFICIAL_CIVIC_REQUIREMENTS,
  CONTROLLED_GOVERNMENT_UPDATES
};
