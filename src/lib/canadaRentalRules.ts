export type ProvinceCode =
  | "BC" | "AB" | "SK" | "MB" | "ON" | "QC" | "NS" | "NB" | "PE" | "NL" | "YT" | "NT" | "NU";

export interface ProvinceRules {
  code: ProvinceCode;
  name: string;
  // Security/rent deposit rules
  securityDeposit: {
    allowed: boolean;
    // Multiplier of monthly rent (e.g., 0.5 means half month)
    maxMonths?: number;
    notes?: string;
  };
  rentDeposit?: {
    allowed: boolean;
    // Ontario last month's rent deposit behavior, etc.
    notes?: string;
  };
  petDeposit?: {
    allowed: boolean;
    maxMonths?: number;
    notes?: string;
  };
  lateFees?: {
    allowed: boolean;
    // Flat cap if applicable
    maxAmountCAD?: number;
    notes?: string;
  };
  lastUpdated?: string;
}

export const PROVINCES: Array<{ code: ProvinceCode; name: string }> = [
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "SK", name: "Saskatchewan" },
  { code: "MB", name: "Manitoba" },
  { code: "ON", name: "Ontario" },
  { code: "QC", name: "Quebec" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NB", name: "New Brunswick" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "YT", name: "Yukon" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
];

// Source notes (high level):
// - BC: security deposit up to 0.5 month; pet deposit up to 0.5 month; late fees capped at $25 (gov.bc.ca Tenancy deposits and fees)
// - AB: security deposit up to 1 month; interest owed; trust account (alberta.ca Starting a tenancy)
// - SK: security deposit up to 1 month; may be paid half up front and balance in 2 months (saskatchewan.ca Security Deposits)
// - MB: deposit typical up to 1/2 month for monthly tenancy historically; RTB manages interest; specifics vary—validate conservatively at 1 month with notes to consult RTB calculator
// - ON: no security (damage) deposit; rent deposit (last month) allowed up to one month’s rent; key deposit only at replacement cost; no pet deposits (ontario.ca + CLEO)
// - QC: no security deposits, no key deposits (TAL / Quebec info)
// - NS: security deposit up to 0.5 month; held in trust; interest; new regs 2025 (novascotia.ca)
// - NB: security deposit up to 1 week (weekly) or 1 month (others); paid to provincial trust fund (laws.gnb.ca)
// - PE: security deposit up to 1 month (or 1 week for weekly); trust + interest (peirentaloffice.ca)
// - NL: security deposit up to 0.75 month for monthly/term (Service NL summary); trust + interest
// - YT: security deposit up to 1 month; interest; can be applied to last month (tenant rights summary)
// - NT: treat as up to 1 month (common across territories); verify specifics per RTA; include notes
// - NU: security deposit up to 1 month (or 1 week if weekly); interest; return within 10 days (tenantrights.ca)

export const RULES: Record<ProvinceCode, ProvinceRules> = {
  BC: {
    code: "BC",
    name: "British Columbia",
    securityDeposit: { allowed: true, maxMonths: 0.5, notes: "Max half of first month’s rent." },
    rentDeposit: { allowed: false, notes: "No separate last month’s rent deposit distinct from security deposit." },
    petDeposit: { allowed: true, maxMonths: 0.5, notes: "Guide/service dogs excluded from pet deposits." },
    lateFees: { allowed: true, maxAmountCAD: 25, notes: "Non‑refundable late rent fees up to $25 if stated in agreement." },
    lastUpdated: "2025-01-01",
  },
  AB: {
    code: "AB",
    name: "Alberta",
    securityDeposit: { allowed: true, maxMonths: 1, notes: "Must be held in interest‑bearing trust; interest owed per regulation." },
    rentDeposit: { allowed: false },
    petDeposit: { allowed: false, notes: "No separate pet deposit; may charge non‑refundable pet fees if agreed (not part of deposit)." },
    lateFees: { allowed: true, notes: "No statutory cap; must be reasonable and disclosed." },
  },
  SK: {
    code: "SK",
    name: "Saskatchewan",
    securityDeposit: { allowed: true, maxMonths: 1, notes: "Up to one month; half due at start, remainder within 2 months." },
    rentDeposit: { allowed: false },
    petDeposit: { allowed: false, notes: "Separate pet deposits not permitted; use single security deposit." },
    lateFees: { allowed: true, notes: "Must be reasonable." },
  },
  MB: {
    code: "MB",
    name: "Manitoba",
    securityDeposit: { allowed: true, maxMonths: 0.5, notes: "Residential Tenancies Branch calculates interest; deposit paid/managed via RTB framework." },
    rentDeposit: { allowed: false },
    petDeposit: { allowed: false },
    lateFees: { allowed: true, notes: "Must comply with RTB policy; ensure reasonableness." },
  },
  ON: {
    code: "ON",
    name: "Ontario",
    securityDeposit: { allowed: false, notes: "Security/damage deposits prohibited." },
    rentDeposit: { allowed: true, notes: "Rent deposit (usually last month’s) up to one month; interest at guideline." },
    petDeposit: { allowed: false, notes: "Pet deposits/fees prohibited (service animals exempt from pet restrictions)." },
    lateFees: { allowed: false, notes: "No statutory late fee; NSF/admin fees only if permitted." },
    lastUpdated: "2025-01-01",
  },
  QC: {
    code: "QC",
    name: "Quebec",
    securityDeposit: { allowed: false, notes: "Security/key deposits prohibited by TAL guidance." },
    rentDeposit: { allowed: false, notes: "Rent deposits generally not permitted." },
    petDeposit: { allowed: false },
    lateFees: { allowed: false, notes: "Penalties must align with Civil Code; avoid flat late fees." },
  },
  NS: {
    code: "NS",
    name: "Nova Scotia",
    securityDeposit: { allowed: true, maxMonths: 0.5, notes: "Trust account, interest payable; return timelines and forms apply." },
    rentDeposit: { allowed: false },
    petDeposit: { allowed: false },
    lateFees: { allowed: true, notes: "Follow RTA/Regulations; termination after 3 late payments now possible." },
  },
  NB: {
    code: "NB",
    name: "New Brunswick",
    securityDeposit: { allowed: true, maxMonths: 1, notes: "One week for weekly, one month otherwise; paid to provincial Security Deposit Fund." },
    rentDeposit: { allowed: false },
    petDeposit: { allowed: false },
    lateFees: { allowed: true, notes: "Subject to Residential Tenancies Act reasonableness." },
  },
  PE: {
    code: "PE",
    name: "Prince Edward Island",
    securityDeposit: { allowed: true, maxMonths: 1, notes: "Or one week if weekly rent; must be held in interest‑bearing (trust if 3+ units)." },
    rentDeposit: { allowed: false },
    petDeposit: { allowed: false },
    lateFees: { allowed: true, notes: "Follow Director’s policies; must be reasonable." },
  },
  NL: {
    code: "NL",
    name: "Newfoundland and Labrador",
    securityDeposit: { allowed: true, maxMonths: 0.75, notes: "Up to three‑quarters of one month’s rent for monthly/term; trust + simple interest." },
    rentDeposit: { allowed: false },
    petDeposit: { allowed: false },
    lateFees: { allowed: true, notes: "Statutory late fee schedule applies (e.g., $5 first day + $2/day up to cap)." },
  },
  YT: {
    code: "YT",
    name: "Yukon",
    securityDeposit: { allowed: true, maxMonths: 1, notes: "Interest owed; may be applied to last rental period if agreed." },
    rentDeposit: { allowed: true, notes: "Can apply security deposit to last month with agreement; confirm current Act updates." },
    petDeposit: { allowed: false },
    lateFees: { allowed: true, notes: "Must be reasonable and disclosed." },
  },
  NT: {
    code: "NT",
    name: "Northwest Territories",
    securityDeposit: { allowed: true, maxMonths: 1, notes: "Verify specific caps with Rental Office; common practice up to one month." },
    rentDeposit: { allowed: false },
    petDeposit: { allowed: false },
    lateFees: { allowed: true, notes: "Must be reasonable; consider Rental Officer guidance." },
  },
  NU: {
    code: "NU",
    name: "Nunavut",
    securityDeposit: { allowed: true, maxMonths: 1, notes: "Up to one month (or one week for weekly); interest at Bank of Canada 30‑day rate; return within 10 days." },
    rentDeposit: { allowed: false },
    petDeposit: { allowed: false },
    lateFees: { allowed: true, notes: "Statutory interest‑based penalties apply for late rent; confirm annually." },
  },
};

export function getProvinceRules(code?: string | null): ProvinceRules | undefined {
  if (!code) return undefined;
  const upper = code.toUpperCase() as ProvinceCode;
  return RULES[upper];
}

export interface TermsValidationResult {
  warnings: string[];
  errors: string[];
}

export function validateTerms(
  province: ProvinceCode | undefined,
  rentAmount: number | undefined,
  securityDeposit: number | undefined,
  lateFeeAmount: number | undefined
): TermsValidationResult {
  const result: TermsValidationResult = { warnings: [], errors: [] };
  if (!province) return result;
  const rules = RULES[province];

  if (rules.securityDeposit.allowed === false && (securityDeposit ?? 0) > 0) {
    result.errors.push(`${rules.name}: Security/damage deposits are not permitted.`);
  }

  if (rules.securityDeposit.allowed && rentAmount && securityDeposit != null) {
    if (rules.securityDeposit.maxMonths != null) {
      const max = rentAmount * rules.securityDeposit.maxMonths;
      if (securityDeposit > max + 0.0001) {
        result.errors.push(
          `${rules.name}: Security deposit exceeds allowed maximum of ${rules.securityDeposit.maxMonths} month(s) of rent (max $${max.toFixed(2)}).`
        );
      }
    }
  }

  if (rules.rentDeposit?.allowed) {
    result.warnings.push(`${rules.name}: Rent deposit may be allowed (e.g., last month’s rent). Ensure you label deposits correctly and comply with interest rules.`);
  } else if (province === "ON") {
    result.warnings.push("Ontario: Use rent deposit (last month’s rent) if needed; security/damage deposits are not allowed.");
  }

  if (rules.petDeposit?.allowed && rules.petDeposit.maxMonths != null && rentAmount) {
    const maxPet = rentAmount * rules.petDeposit.maxMonths;
    result.warnings.push(`${rules.name}: Pet damage deposit up to $${maxPet.toFixed(2)} (${rules.petDeposit.maxMonths} month of rent).`);
  } else if (rules.petDeposit && rules.petDeposit.allowed === false) {
    result.warnings.push(`${rules.name}: Separate pet deposits are generally not permitted.`);
  }

  if (lateFeeAmount != null) {
    if (rules.lateFees?.allowed === false && lateFeeAmount > 0) {
      result.errors.push(`${rules.name}: Late fees are restricted; avoid setting a flat late fee.`);
    } else if (rules.lateFees?.maxAmountCAD != null && lateFeeAmount > rules.lateFees.maxAmountCAD) {
      result.errors.push(
        `${rules.name}: Late fee exceeds cap of $${rules.lateFees.maxAmountCAD.toFixed(2)}.`
      );
    }
  }

  return result;
}

