/**
 * CIVIC PATH - Centralized Scenario Configurations
 * Exactly Four Distinct Scenarios with Custom Questions, Documents, and Roadmaps
 */

const SCENARIOS = [
  // =========================================================================
  // SCENARIO 1: HOME BAKERY
  // =========================================================================
  {
    id: "homeBakery",
    title: "I want to start a small home bakery",
    subtitle: "Home Bakery & Cottage Confectionery",
    description: "Start a domestic kitchen micro-bakery in Mumbai with petty food manufacturer exemptions, zero-fee municipal intimation, and FSSAI basic registration.",
    icon: "Cake",
    applicationURL: "https://foscos.fssai.gov.in/",
    officialSources: [
      {
        name: "Food Safety and Standards Authority of India (FoSCoS)",
        url: "https://foscos.fssai.gov.in/",
        type: "OFFICIAL",
        lastVerified: "26 September 2026"
      },
      {
        name: "MCGM Aaple Sarkar Portal",
        url: "https://aaplesarkar.mahaonline.gov.in/",
        type: "OFFICIAL",
        lastVerified: "25 September 2026"
      }
    ],
    questions: [
      {
        id: "activityNature",
        question: "Is the bakery home-based or commercial?",
        helpText: "Home kitchens qualify for petty manufacturer exemptions under FSS Act Section 31(1).",
        options: [
          { value: "home", label: "Home-based Kitchen", description: "Domestic kitchen using residential appliances and residential electricity tariff." },
          { value: "commercial", label: "Commercial Premises", description: "Designated commercial space with customer footfall." }
        ],
        default: "home"
      },
      {
        id: "location",
        question: "Location?",
        helpText: "Determines local municipal corporation rules.",
        options: [
          { value: "Mumbai", label: "Greater Mumbai (MCGM / BMC)" },
          { value: "Pune", label: "Pune Municipal Corporation (PMC)" },
          { value: "Thane", label: "Thane Municipal Corporation (TMC)" }
        ],
        default: "Mumbai"
      },
      {
        id: "approximateScale",
        question: "Approximate scale?",
        helpText: "Turnover boundary determines FSSAI Basic Registration (₹100) vs State License (₹2,000).",
        options: [
          { value: "micro", label: "Micro Scale (Turnover under ₹12 Lakhs/year)" },
          { value: "small", label: "Small Scale (Turnover above ₹12 Lakhs/year)" }
        ],
        default: "micro"
      },
      {
        id: "employeeCount",
        question: "Number of employees?",
        helpText: "Under 10 workers qualifies for zero-fee Section 6 online intimation.",
        options: [
          { value: "1-2", label: "Family / 1–2 helpers (Zero-fee intimation Form F)" },
          { value: "3-5", label: "3–5 helpers" },
          { value: "6-9", label: "6–9 workers" }
        ],
        default: "1-2"
      },
      {
        id: "foodActivity",
        question: "Type of food activity?",
        helpText: "Specific baking categories covered under FSSAI Petty Manufacturer scope.",
        options: [
          { value: "dry_bakes", label: "Dry Baked Goods (Cookies, Breads, Biscuits, Muffins)" },
          { value: "cakes_pastries", label: "Pastries & Custom Decorative Cakes" },
          { value: "savory", label: "Savory Snack Baking & Confectionery" }
        ],
        default: "dry_bakes"
      }
    ],
    requiredDocuments: [
      {
        id: "doc_hb_identity",
        name: "Identity Proof",
        description: "Government-issued photo identification (Aadhaar Card / Voter ID / Passport) of Food Business Operator.",
        requiredForStep: "step_hb_identity",
        matchKeywords: ["identity", "aadhaar", "passport", "voter", "id"],
        source: "FSSAI FoSCoS Document Matrix",
        sourceType: "OFFICIAL",
        lastVerified: "26 September 2026",
        officialURL: "https://foscos.fssai.gov.in/"
      },
      {
        id: "doc_hb_address",
        name: "Address Proof",
        description: "Recent residential electricity bill or municipal tax receipt of domestic kitchen premises (not older than 2 months).",
        requiredForStep: "step_hb_intimation",
        matchKeywords: ["address", "electricity", "bill", "utility", "residence"],
        source: "Maharashtra Shops & Establishments Act 2017",
        sourceType: "OFFICIAL",
        lastVerified: "25 September 2026",
        officialURL: "https://aaplesarkar.mahaonline.gov.in/"
      },
      {
        id: "doc_hb_property",
        name: "Property/Occupancy Document",
        description: "Housing Society (CHS) written no-objection / intimation undertaking confirming domestic non-nuisance baking.",
        requiredForStep: "step_hb_society",
        matchKeywords: ["property", "society", "noc", "tenancy", "rent", "agreement"],
        source: "Maharashtra Co-operative Societies Model Bye-Laws",
        sourceType: "OFFICIAL",
        lastVerified: "25 September 2026",
        officialURL: "https://aaplesarkar.mahaonline.gov.in/"
      },
      {
        id: "doc_hb_certificate",
        name: "Applicable Certificate",
        description: "Potable drinking water test analysis certificate (BIS IS 10500 standard) from public health laboratory.",
        requiredForStep: "step_hb_fssai",
        matchKeywords: ["certificate", "water", "test", "is10500", "potable", "lab"],
        source: "FSSAI Regulation 2.1.3 Potable Water Testing Mandate",
        sourceType: "OFFICIAL",
        lastVerified: "26 September 2026",
        officialURL: "https://foscos.fssai.gov.in/"
      }
    ],
    roadmapSteps: [
      {
        id: "step_hb_identity",
        title: "Identity & Domestic Premises Verification",
        description: "Verify citizen identity card and domestic premise possession details.",
        department: "Citizen Self-Attestation",
        prerequisites: [],
        requiredDocuments: ["doc_hb_identity"],
        cost: 0,
        source: "FSSAI FoSCoS Documentation Standard",
        officialURL: "https://foscos.fssai.gov.in/"
      },
      {
        id: "step_hb_society",
        title: "Residential Society (CHS) Consent & Intimation",
        description: "Filing domestic non-nuisance kitchen intimation with housing society managing committee.",
        department: "Co-operative Housing Society (CHS)",
        prerequisites: ["step_hb_identity"],
        requiredDocuments: ["doc_hb_property"],
        cost: 0,
        source: "Maharashtra Co-operative Societies Act 1960",
        officialURL: "https://aaplesarkar.mahaonline.gov.in/"
      },
      {
        id: "step_hb_intimation",
        title: "Maharashtra Shops & Establishment Intimation (Form F)",
        description: "Online intimation under Section 6 for micro-units having fewer than 10 workers.",
        department: "MCGM / Aaple Sarkar Directorate",
        prerequisites: ["step_hb_identity", "step_hb_society"],
        requiredDocuments: ["doc_hb_address"],
        cost: 0,
        source: "Aaple Sarkar Municipal Portal",
        officialURL: "https://aaplesarkar.mahaonline.gov.in/"
      },
      {
        id: "step_hb_fssai",
        title: "FSSAI Petty Food Manufacturer Registration (Form A)",
        description: "Statutory Food Registration under Section 31(1) for turnover up to ₹12 Lakhs/year.",
        department: "Food Safety and Standards Authority of India (FSSAI)",
        prerequisites: ["step_hb_intimation"],
        requiredDocuments: ["doc_hb_certificate"],
        cost: 100,
        source: "FoSCoS Central Portal (Schedule 3)",
        officialURL: "https://foscos.fssai.gov.in/"
      },
      {
        id: "step_hb_final",
        title: "Food Safety Display Board (FSDB) & Operations Start",
        description: "Download color-coded purple Food Safety Display Board with 14-digit FSSAI number.",
        department: "FSSAI Compliance Division",
        prerequisites: ["step_hb_fssai"],
        requiredDocuments: [],
        cost: 0,
        source: "FSSAI Regulatory Division",
        officialURL: "https://foscos.fssai.gov.in/"
      }
    ]
  },

  // =========================================================================
  // SCENARIO 2: SMALL RESTAURANT
  // =========================================================================
  {
    id: "smallRestaurant",
    title: "I want to open a small restaurant",
    subtitle: "Commercial Dine-in & Eatery License",
    description: "Establish a commercial restaurant or cafe with commercial tenancy, fire prevention clearance, municipal health trade license (Sec 394), and FSSAI state licensing.",
    icon: "Utensils",
    applicationURL: "https://portal.mcgm.gov.in/",
    officialSources: [
      {
        name: "Municipal Corporation of Greater Mumbai (MCGM)",
        url: "https://portal.mcgm.gov.in/",
        type: "OFFICIAL",
        lastVerified: "26 September 2026"
      },
      {
        name: "FSSAI State Licensing Portal",
        url: "https://foscos.fssai.gov.in/",
        type: "OFFICIAL",
        lastVerified: "26 September 2026"
      }
    ],
    questions: [
      {
        id: "location",
        question: "Location?",
        helpText: "Governing municipal ward office handles Section 394 Health Licensing.",
        options: [
          { value: "Mumbai_South", label: "Mumbai Island City (Ward A to G)" },
          { value: "Mumbai_Suburbs", label: "Mumbai Western/Eastern Suburbs (Ward H to T)" },
          { value: "Pune", label: "Pune Municipal Corporation (PMC)" }
        ],
        default: "Mumbai_Suburbs"
      },
      {
        id: "restaurantType",
        question: "Restaurant type?",
        helpText: "Type of dine-in establishment dictates fire safety egress requirements.",
        options: [
          { value: "qsr", label: "Quick Service Restaurant (QSR) / Takeaway" },
          { value: "casual_dine", label: "Casual Dine-in Restaurant & Bistro" },
          { value: "cafe", label: "Cafe & Dessert Parlor" },
          { value: "cloud_kitchen", label: "Commercial Cloud Kitchen (Delivery Only)" }
        ],
        default: "casual_dine"
      },
      {
        id: "seatingCapacity",
        question: "Seating capacity?",
        helpText: "Eateries above 50 seats require additional municipal public assembly clearances.",
        options: [
          { value: "takeaway", label: "Takeaway Counter (Zero Seating)" },
          { value: "10-25", label: "10 to 25 Seats (Micro Dine-in)" },
          { value: "26-50", label: "26 to 50 Seats (Standard Dine-in)" },
          { value: "50+", label: "50+ Seats (Large Commercial Eatery)" }
        ],
        default: "10-25"
      },
      {
        id: "approximateSize",
        question: "Approximate size?",
        helpText: "Kitchen layout dimensions determine ventilation and hood extract requirements.",
        options: [
          { value: "under_500", label: "Under 500 sq. ft." },
          { value: "500_1200", label: "500 to 1,200 sq. ft." },
          { value: "over_1200", label: "Over 1,200 sq. ft." }
        ],
        default: "500_1200"
      },
      {
        id: "employees",
        question: "Number of employees?",
        helpText: "10 or more employees triggers mandatory full Form A registration under 2017 Act.",
        options: [
          { value: "under_10", label: "Fewer than 10 Workers" },
          { value: "10-20", label: "10 to 20 Workers (Mandatory Form A Registration)" },
          { value: "20+", label: "20+ Workers (Statutory EPF & ESIC provisions)" }
        ],
        default: "10-20"
      },
      {
        id: "premisesNature",
        question: "New establishment or existing premises?",
        helpText: "Transfer of existing trade license requires NOC from outgoing licensee.",
        options: [
          { value: "new", label: "New Commercial Establishment (Fresh Clearances)" },
          { value: "transfer", label: "Existing Premise (Trade License Transfer)" }
        ],
        default: "new"
      },
      {
        id: "foodServiceType",
        question: "Type of food service?",
        helpText: "Commercial gas pipeline manifolds mandate licensed agency testing.",
        options: [
          { value: "pure_veg", label: "Pure Vegetarian Hot Kitchen" },
          { value: "non_veg", label: "Multi-Cuisine (Vegetarian & Non-Vegetarian)" },
          { value: "bakery_cafe", label: "Bakery, Desserts & Hot Beverages" }
        ],
        default: "non_veg"
      }
    ],
    requiredDocuments: [
      {
        id: "doc_rest_identity",
        name: "Identity Proof",
        description: "PAN Card and Aadhaar verification of Directors, Partners, or Individual Proprietor.",
        requiredForStep: "step_rest_entity",
        matchKeywords: ["identity", "aadhaar", "pan", "partner", "director"],
        source: "MCGM Trade License Verification Rules",
        sourceType: "OFFICIAL",
        lastVerified: "26 September 2026",
        officialURL: "https://portal.mcgm.gov.in/"
      },
      {
        id: "doc_rest_address",
        name: "Address Proof",
        description: "Recent commercial electricity connection bill and property assessment tax receipt.",
        requiredForStep: "step_rest_shops",
        matchKeywords: ["address", "electricity", "tax", "commercial", "property_tax"],
        source: "Maharashtra Shops & Establishment Act 2017",
        sourceType: "OFFICIAL",
        lastVerified: "25 September 2026",
        officialURL: "https://aaplesarkar.mahaonline.gov.in/"
      },
      {
        id: "doc_rest_premises",
        name: "Premises Document",
        description: "Registered Commercial Lease Agreement (IGR Stamped) & Building Occupation Certificate (OC/BCC).",
        requiredForStep: "step_rest_health",
        matchKeywords: ["premises", "lease", "rent", "agreement", "oc", "commercial_lease"],
        source: "Section 394 Mumbai Municipal Corporation Act 1888",
        sourceType: "OFFICIAL",
        lastVerified: "22 September 2026",
        officialURL: "https://portal.mcgm.gov.in/"
      },
      {
        id: "doc_rest_business",
        name: "Business-related document applicable to the selected scenario",
        description: "Commercial Kitchen Architectural Layout Drawing showing fire extinguisher placements, gas manifold line, and grease traps.",
        requiredForStep: "step_rest_fire",
        matchKeywords: ["business", "fire", "layout", "plan", "drawing", "gas", "kitchen_plan"],
        source: "Mumbai Fire Brigade Fire Safety NOC Rules",
        sourceType: "OFFICIAL",
        lastVerified: "20 September 2026",
        officialURL: "https://portal.mcgm.gov.in/"
      }
    ],
    roadmapSteps: [
      {
        id: "step_rest_entity",
        title: "Commercial Entity & Tenancy Stamping",
        description: "Execute and register registered commercial lease deed with Maharashtra IGR.",
        department: "IGR Maharashtra / Commercial Registrar",
        prerequisites: [],
        requiredDocuments: ["doc_rest_identity"],
        cost: 3000,
        source: "IGR Maharashtra Commercial Registration",
        officialURL: "https://aaplesarkar.mahaonline.gov.in/"
      },
      {
        id: "step_rest_shops",
        title: "MCGM Shops & Establishment Registration (Form A)",
        description: "Mandatory Section 7 statutory certificate for commercial units with 10+ employees.",
        department: "MCGM Shops & Establishment Department",
        prerequisites: ["step_rest_entity"],
        requiredDocuments: ["doc_rest_address"],
        cost: 2400,
        source: "Maharashtra Shops Act Schedule II",
        officialURL: "https://aaplesarkar.mahaonline.gov.in/"
      },
      {
        id: "step_rest_fire",
        title: "Mumbai Fire Brigade Safety Clearance & Gas Manifold NOC",
        description: "Physical fire safety inspection of commercial ovens, smoke hoods, and gas piping.",
        department: "Mumbai Fire Brigade (Fire Prevention Cell)",
        prerequisites: ["step_rest_entity"],
        requiredDocuments: ["doc_rest_business"],
        cost: 3500,
        source: "MCGM Fire Prevention Regulations",
        officialURL: "https://portal.mcgm.gov.in/"
      },
      {
        id: "step_rest_health",
        title: "MCGM Health Trade License (Section 394 MMC Act)",
        description: "Municipal sanitary license issued by Ward Medical Officer of Health (MOH).",
        department: "MCGM Public Health Department",
        prerequisites: ["step_rest_shops", "step_rest_fire"],
        requiredDocuments: ["doc_rest_premises"],
        cost: 8500,
        source: "Mumbai Municipal Corporation Act 1888",
        officialURL: "https://portal.mcgm.gov.in/"
      },
      {
        id: "step_rest_fssai",
        title: "FSSAI State Food Business License (Form B)",
        description: "State food processing license for commercial restaurant operations above ₹12 Lakhs.",
        department: "Food Safety and Standards Authority of India (FSSAI)",
        prerequisites: ["step_rest_health"],
        requiredDocuments: [],
        cost: 2000,
        source: "FoSCoS Central Portal",
        officialURL: "https://foscos.fssai.gov.in/"
      }
    ]
  },

  // =========================================================================
  // SCENARIO 3: RENTAL AGREEMENT
  // =========================================================================
  {
    id: "rentalAgreement",
    title: "I want to register a rental agreement",
    subtitle: "Registered Leave & License Agreement",
    description: "Execute and legally register a residential or commercial Leave and License Agreement under the Maharashtra Rent Control Act with digital biometrics and stamp duty.",
    icon: "FileText",
    applicationURL: "https://efilingigr.maharashtra.gov.in/",
    officialSources: [
      {
        name: "Inspector General of Registration & Controller of Stamps (IGR Maharashtra)",
        url: "https://efilingigr.maharashtra.gov.in/",
        type: "OFFICIAL",
        lastVerified: "26 September 2026"
      }
    ],
    questions: [
      {
        id: "propertyType",
        question: "Residential or commercial property?",
        helpText: "Stamp duty calculation differs for residential (0.25%) vs commercial premises.",
        options: [
          { value: "residential", label: "Residential Flat / Apartment / Bungalow" },
          { value: "commercial", label: "Commercial Office / Shop / Showroom" }
        ],
        default: "residential"
      },
      {
        id: "location",
        question: "Location?",
        helpText: "Sub-Registrar jurisdiction depends on revenue district boundaries.",
        options: [
          { value: "Mumbai_Suburban", label: "Mumbai Suburban District (Bandra to Dahisar / Kurla to Mulund)" },
          { value: "Mumbai_City", label: "Mumbai City District (Colaba to Mahim / Sion)" },
          { value: "Pune", label: "Pune Urban Agglomeration" },
          { value: "Thane", label: "Thane City & Navi Mumbai" }
        ],
        default: "Mumbai_Suburban"
      },
      {
        id: "partyType",
        question: "Landlord/tenant type?",
        helpText: "Determines biometric authentication workflow.",
        options: [
          { value: "individual", label: "Direct Individual Owner & Individual Tenant" },
          { value: "poa", label: "Power of Attorney (POA) Holder on behalf of Owner" },
          { value: "corporate", label: "Company / Firm Leased Property" }
        ],
        default: "individual"
      },
      {
        id: "agreementDuration",
        question: "Agreement duration?",
        helpText: "Tenure impacts refundable deposit calculation and statutory stamp duty.",
        options: [
          { value: "11_months", label: "11 Months (Standard Tenure)" },
          { value: "22_months", label: "22 Months" },
          { value: "36_months", label: "36 Months (Long-term Lease)" },
          { value: "60_months", label: "60 Months" }
        ],
        default: "11_months"
      },
      {
        id: "tenantCount",
        question: "Number of tenants?",
        helpText: "All co-tenants listed on agreement must submit biometric authentication.",
        options: [
          { value: "single", label: "Single Tenant" },
          { value: "co_tenants", label: "2 Co-tenants / Joint Tenants" },
          { value: "family", label: "Family (Primary signatory)" }
        ],
        default: "single"
      },
      {
        id: "registrationRequired",
        question: "Is registration required for the selected scenario?",
        helpText: "Under Section 55 of Maharashtra Rent Control Act, 1999, registration is mandatory.",
        options: [
          { value: "mandatory", label: "Yes, Mandatory Legal Registration under Section 55" },
          { value: "notarized_inadequate", label: "Notarized Only (Inadmissible in Court without Registration)" }
        ],
        default: "mandatory"
      },
      {
        id: "entityType",
        question: "Are the parties individuals or organizations?",
        helpText: "Corporate entities must attach Board Resolutions and signing authority letters.",
        options: [
          { value: "individuals", label: "Both Parties are Private Citizens / Individuals" },
          { value: "corporate_tenant", label: "Landlord Individual, Tenant Corporate Entity" },
          { value: "both_corporate", label: "Both Parties Corporate Entities" }
        ],
        default: "individuals"
      }
    ],
    requiredDocuments: [
      {
        id: "doc_rent_landlord_id",
        name: "Landlord Identity Proof",
        description: "Aadhaar Card and PAN Card copy of legal property owner.",
        requiredForStep: "step_rent_verify",
        matchKeywords: ["landlord", "owner", "aadhaar", "pan", "identity"],
        source: "IGR Maharashtra e-Registration Protocol",
        sourceType: "OFFICIAL",
        lastVerified: "26 September 2026",
        officialURL: "https://efilingigr.maharashtra.gov.in/"
      },
      {
        id: "doc_rent_tenant_id",
        name: "Tenant Identity Proof",
        description: "Aadhaar Card and PAN Card copy of all incoming tenant licensees.",
        requiredForStep: "step_rent_verify",
        matchKeywords: ["tenant", "licensee", "aadhaar", "pan", "id"],
        source: "IGR Maharashtra e-Registration Protocol",
        sourceType: "OFFICIAL",
        lastVerified: "26 September 2026",
        officialURL: "https://efilingigr.maharashtra.gov.in/"
      },
      {
        id: "doc_rent_property",
        name: "Address/Property Proof",
        description: "Recent Municipal Property Tax Assessment Receipt or Index-II ownership deed proof.",
        requiredForStep: "step_rent_draft",
        matchKeywords: ["property", "index", "index2", "tax_receipt", "electricity_bill", "ownership"],
        source: "Inspector General of Registration Maharashtra",
        sourceType: "OFFICIAL",
        lastVerified: "26 September 2026",
        officialURL: "https://efilingigr.maharashtra.gov.in/"
      },
      {
        id: "doc_rent_agreement",
        name: "Agreement Document",
        description: "Draft Leave and License Agreement text with agreed monthly license fees, lock-in period, and security deposit terms.",
        requiredForStep: "step_rent_stamp",
        matchKeywords: ["agreement", "draft", "lease", "license", "contract", "terms"],
        source: "Maharashtra Rent Control Act 1999 Section 55",
        sourceType: "OFFICIAL",
        lastVerified: "26 September 2026",
        officialURL: "https://efilingigr.maharashtra.gov.in/"
      }
    ],
    roadmapSteps: [
      {
        id: "step_rent_verify",
        title: "Landlord & Tenant Identity Authentication",
        description: "Verify Aadhaar numbers and biometric thumbprint linkage for all parties.",
        department: "UIDAI / IGR e-Filing Cell",
        prerequisites: [],
        requiredDocuments: ["doc_rent_landlord_id", "doc_rent_tenant_id"],
        cost: 0,
        source: "IGR Maharashtra e-Filing Verification",
        officialURL: "https://efilingigr.maharashtra.gov.in/"
      },
      {
        id: "step_rent_draft",
        title: "Property Verification & Clause Customization",
        description: "Verify municipal property address and formulate non-standard covenants.",
        department: "Legal Document Drafting Services",
        prerequisites: ["step_rent_verify"],
        requiredDocuments: ["doc_rent_property"],
        cost: 500,
        source: "Model Leave & License Standard Template",
        officialURL: "https://efilingigr.maharashtra.gov.in/"
      },
      {
        id: "step_rent_stamp",
        title: "Stamp Duty & Government Registration Challan (GRAS)",
        description: "Calculate and pay 0.25% stamp duty on tenure sum and ₹1,000 statutory registration fee.",
        department: "Government Receipt Accounting System (GRAS Maharashtra)",
        prerequisites: ["step_rent_draft"],
        requiredDocuments: ["doc_rent_agreement"],
        cost: 1000,
        source: "Maharashtra Stamp Act Schedule 1 Article 36A",
        officialURL: "https://gras.mahakosh.gov.in/"
      },
      {
        id: "step_rent_biometrics",
        title: "Digital Biometric Capture & Witness Verification",
        description: "Fingerprint scanner capture and webcam photograph of landlord, tenant, and 2 witnesses.",
        department: "IGR Joint Sub-Registrar Electronic Portal",
        prerequisites: ["step_rent_stamp"],
        requiredDocuments: [],
        cost: 0,
        source: "IGR Maharashtra Paperless e-Registration",
        officialURL: "https://efilingigr.maharashtra.gov.in/"
      },
      {
        id: "step_rent_final",
        title: "Download Issued Registered Index-II & Executed Deed",
        description: "Download digitally signed government registered document with government barcode and registration seal.",
        department: "Sub-Registrar Office (Assurances)",
        prerequisites: ["step_rent_biometrics"],
        requiredDocuments: [],
        cost: 0,
        source: "IGR Public Record Registry",
        officialURL: "https://efilingigr.maharashtra.gov.in/"
      }
    ]
  },

  // =========================================================================
  // SCENARIO 4: LOCAL BUSINESS LICENSE
  // =========================================================================
  {
    id: "localBusinessLicense",
    title: "I want to apply for a local business license",
    subtitle: "General Commercial Trade & MSME License",
    description: "Obtain general commercial trading licenses, Maharashtra Shops & Establishment certificate, Profession Tax (PTEC), and MSME registration for trading or services.",
    icon: "Briefcase",
    applicationURL: "https://aaplesarkar.mahaonline.gov.in/",
    officialSources: [
      {
        name: "Aaple Sarkar Government of Maharashtra",
        url: "https://aaplesarkar.mahaonline.gov.in/",
        type: "OFFICIAL",
        lastVerified: "26 September 2026"
      },
      {
        name: "Ministry of Micro, Small and Medium Enterprises",
        url: "https://udyamregistration.gov.in/",
        type: "OFFICIAL",
        lastVerified: "26 September 2026"
      }
    ],
    questions: [
      {
        id: "businessType",
        question: "Business type?",
        helpText: "Classification determines applicable municipal trade and profession tax schedules.",
        options: [
          { value: "retail", label: "Retail Shop / Consumer Goods Trading" },
          { value: "consultancy", label: "Professional Consultancy & IT / ITES Services" },
          { value: "wholesale", label: "Wholesale Trade & Distribution Agency" },
          { value: "repair_service", label: "Repair, Maintenance & Personal Services" }
        ],
        default: "retail"
      },
      {
        id: "location",
        question: "Location?",
        helpText: "Municipal corporation jurisdiction.",
        options: [
          { value: "Mumbai", label: "Greater Mumbai (MCGM / BMC)" },
          { value: "Pune", label: "Pune Municipal Corporation (PMC)" },
          { value: "Thane", label: "Thane Municipal Corporation (TMC)" },
          { value: "Navi_Mumbai", label: "Navi Mumbai Municipal Corporation (NMMC)" }
        ],
        default: "Mumbai"
      },
      {
        id: "operationalPremises",
        question: "Home-based or commercial?",
        helpText: "Home offices qualify for professional occupancy exemptions.",
        options: [
          { value: "commercial_shop", label: "Commercial Shop / High-Street Office" },
          { value: "home_office", label: "Home-Based Professional Studio / Office" },
          { value: "coworking", label: "Shared Coworking Desk" }
        ],
        default: "commercial_shop"
      },
      {
        id: "employeeCount",
        question: "Number of employees?",
        helpText: "Establishments with 10+ employees require Form A Full Registration Certificate.",
        options: [
          { value: "solo", label: "Solo Proprietor (0 employees)" },
          { value: "1-9", label: "1 to 9 Workers (Form F Intimation)" },
          { value: "10-19", label: "10 to 19 Workers (Form A Full Registration)" },
          { value: "20+", label: "20+ Workers (Statutory Labor Regulations)" }
        ],
        default: "1-9"
      },
      {
        id: "businessSize",
        question: "Business size?",
        helpText: "Udyam enterprise classification based on machinery investment.",
        options: [
          { value: "micro", label: "Micro Enterprise (Plant/Machinery < ₹1 Cr)" },
          { value: "small", label: "Small Enterprise (Plant/Machinery ₹1 Cr - ₹10 Cr)" }
        ],
        default: "micro"
      },
      {
        id: "establishmentStatus",
        question: "New or existing business?",
        helpText: "Existing businesses transitioning from offline must provide inception date.",
        options: [
          { value: "new", label: "Brand New Commercial Venture" },
          { value: "existing_transition", label: "Existing Business Formalizing Operations" }
        ],
        default: "new"
      }
    ],
    requiredDocuments: [
      {
        id: "doc_lic_identity",
        name: "Identity Proof",
        description: "PAN Card and Aadhaar Card of Proprietor, Managing Partner, or Principal Officer.",
        requiredForStep: "step_lic_identity",
        matchKeywords: ["identity", "aadhaar", "pan", "proprietor", "id"],
        source: "Ministry of MSME / UIDAI",
        sourceType: "OFFICIAL",
        lastVerified: "26 September 2026",
        officialURL: "https://udyamregistration.gov.in/"
      },
      {
        id: "doc_lic_address",
        name: "Address Proof",
        description: "Registered Commercial Lease Agreement or Municipal Property Tax Bill of commercial establishment.",
        requiredForStep: "step_lic_premises",
        matchKeywords: ["address", "lease", "rent", "agreement", "electricity", "tax_bill"],
        source: "Aaple Sarkar Municipal Portal",
        sourceType: "OFFICIAL",
        lastVerified: "25 September 2026",
        officialURL: "https://aaplesarkar.mahaonline.gov.in/"
      },
      {
        id: "doc_lic_premises",
        name: "Business/Premises Document",
        description: "Photograph of shop entrance with prominent nameboard in Marathi (Devanagari script) as mandated by 2022 Amendment.",
        requiredForStep: "step_lic_shops",
        matchKeywords: ["business", "premises", "nameboard", "photo", "signboard", "marathi"],
        source: "Maharashtra Shops & Establishments (Amendment) Act 2022",
        sourceType: "OFFICIAL",
        lastVerified: "25 September 2026",
        officialURL: "https://aaplesarkar.mahaonline.gov.in/"
      },
      {
        id: "doc_lic_specific",
        name: "Other scenario-specific document",
        description: "Cancelled Bank Cheque or Partnership Deed / Udyam Registration Certificate.",
        requiredForStep: "step_lic_prof_tax",
        matchKeywords: ["specific", "cheque", "bank", "deed", "partnership", "udyam", "certificate"],
        source: "Maharashtra State Tax on Professions Act 1975",
        sourceType: "OFFICIAL",
        lastVerified: "24 September 2026",
        officialURL: "https://mahagst.gov.in/"
      }
    ],
    roadmapSteps: [
      {
        id: "step_lic_identity",
        title: "National MSME Udyam Registration Certificate",
        description: "Zero-fee digital registration on Ministry of MSME portal generating official Udyam Certificate.",
        department: "Ministry of Micro, Small and Medium Enterprises",
        prerequisites: [],
        requiredDocuments: ["doc_lic_identity"],
        cost: 0,
        source: "Udyam Registration Portal (Zero Fee)",
        officialURL: "https://udyamregistration.gov.in/"
      },
      {
        id: "step_lic_premises",
        title: "Commercial Premises Proof & Address Validation",
        description: "Validate legal possession of commercial office or store location.",
        department: "Citizen / Property Ownership Verification",
        prerequisites: ["step_lic_identity"],
        requiredDocuments: ["doc_lic_address"],
        cost: 0,
        source: "Municipal Trade Guidelines",
        officialURL: "https://aaplesarkar.mahaonline.gov.in/"
      },
      {
        id: "step_lic_shops",
        title: "Maharashtra Shops & Establishment Certificate (Gumasta)",
        description: "Statutory online filing generating Gumasta License under 2017 Act with Marathi nameboard adherence.",
        department: "MCGM / Directorate of Municipal Administration",
        prerequisites: ["step_lic_premises"],
        requiredDocuments: ["doc_lic_premises"],
        cost: 0,
        source: "Aaple Sarkar Municipal Portal",
        officialURL: "https://aaplesarkar.mahaonline.gov.in/"
      },
      {
        id: "step_lic_prof_tax",
        title: "Profession Tax Enrolment Certificate (PTEC / PTRC)",
        description: "Mandatory statutory tax enrolment under Maharashtra State Tax on Professions Act, 1975.",
        department: "Maharashtra Goods & Services Tax Department (MahaGST)",
        prerequisites: ["step_lic_shops"],
        requiredDocuments: ["doc_lic_specific"],
        cost: 2500,
        source: "MahaGST Profession Tax Division",
        officialURL: "https://mahagst.gov.in/"
      },
      {
        id: "step_lic_final",
        title: "Commercial Bank Current Account & Trade Authorization",
        description: "Obtain commercial operational authorization and open enterprise current banking account.",
        department: "Banking Institution & Municipal Trade Cell",
        prerequisites: ["step_lic_prof_tax"],
        requiredDocuments: [],
        cost: 0,
        source: "Reserve Bank of India KYC Directives",
        officialURL: "https://aaplesarkar.mahaonline.gov.in/"
      }
    ]
  }
];

function getScenarioById(id) {
  return SCENARIOS.find(s => s.id === id) || SCENARIOS[0];
}

module.exports = {
  SCENARIOS,
  getScenarioById
};
