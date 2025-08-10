export interface ProvinceSection {
  title: string;
  body: string[]; // paragraphs
}

export interface ProvinceTemplate {
  code: string;
  name: string;
  notes?: string[];
  sections: ProvinceSection[];
}

// Province-specific content derived from official guidance and common practice.
// Sources referenced in product docs:
// - British Columbia RTB-1 standard agreement and forms library
// - Ontario Standard Form of Lease (SFL) guidance
// - Québec TAL (official mandatory lease form)

export const templates: Record<string, ProvinceTemplate> = {
  BC: {
    code: 'BC',
    name: 'British Columbia',
    notes: [
      'BC: Follow RTB requirements for deposits (security + pet damage) and condition inspections.',
    ],
    sections: [
      {
        title: 'Standard Terms (BC)',
        body: [
          'This tenancy is subject to the Residential Tenancy Act (B.C.) and its regulations. Standard terms apply regardless of whether they are written into this agreement.',
          'The tenant has the right to quiet enjoyment, including reasonable privacy and freedom from unreasonable disturbance.',
        ],
      },
      {
        title: 'Right of Entry (BC)',
        body: [
          'Except in emergencies or with consent, the landlord must give proper written notice before entering the unit, including date, time, and reason. Entry should be at reasonable times.',
        ],
      },
      {
        title: 'Deposits (BC)',
        body: [
          'A security deposit of up to half of one month’s rent may be collected. A separate pet damage deposit of up to half of one month’s rent may be collected if pets are permitted.',
          'Deposits must be returned with interest as required, less lawful deductions. Pre- and post-tenancy condition inspection reports should be completed; failure to do so can affect deposit claims.',
        ],
      },
      {
        title: 'Inspections & Repairs (BC)',
        body: [
          'Move-in and move-out condition inspections should be conducted with the tenant present where possible.',
          'The landlord must maintain the premises in a state of repair that complies with health, safety, and housing standards and is suitable for occupancy.',
        ],
      },
      {
        title: 'Assignments/Sublets (BC)',
        body: [
          'A tenant may assign or sublet with the landlord’s consent, which must not be unreasonably withheld. Any lawful fees must be as permitted by statute.',
        ],
      },
      {
        title: 'Rent & Increases (BC)',
        body: [
          'Rent is payable on the due date specified in this agreement. Rent increases must comply with provincial rules and notice requirements.',
        ],
      },
      {
        title: 'Notice to End Tenancy (BC)',
        body: [
          'Ending a tenancy must follow the Act’s reasons and notice periods. Forms and timelines differ by reason (landlord use, cause, end of fixed term, etc.).',
        ],
      },
    ],
  },
  ON: {
    code: 'ON',
    name: 'Ontario',
    notes: [
      'Ontario: Security/damage deposits are not permitted. A rent deposit (Last Month’s Rent) may be collected.',
    ],
    sections: [
      {
        title: 'Standard Lease (ON)',
        body: [
          'Ontario’s Standard Form of Lease applies. If any added term conflicts with the Residential Tenancies Act, 2006 or the standard form, the standard terms prevail.',
        ],
      },
      {
        title: 'Deposits (ON)',
        body: [
          'A rent deposit equal to one rental period (typically Last Month’s Rent) may be collected. Security or damage deposits are not permitted.',
        ],
      },
      {
        title: 'Entry (ON)',
        body: [
          'A landlord may enter the unit only in limited circumstances (e.g., 24‑hour written notice for repairs, showings at specified times, or emergencies).',
        ],
      },
      {
        title: 'Utilities & Services (ON)',
        body: [
          'Any utilities or services included in rent must be listed. The tenant pays for other utilities unless specified otherwise in this agreement.',
        ],
      },
      {
        title: 'Rent Increases (ON)',
        body: [
          'Rent increases must comply with the annual guideline and notice requirements, unless exempted by law.',
        ],
      },
      {
        title: 'Ending a Tenancy (ON)',
        body: [
          'Terminations require proper forms and notice periods. Landlord‑initiated terminations (e.g., personal use, purchaser’s own use) include compensation and form requirements.',
        ],
      },
    ],
  },
  QC: {
    code: 'QC',
    name: 'Québec',
    notes: [
      'Québec: Use the mandatory lease form from the Tribunal administratif du logement (TAL). This document is a convenience summary; refer to the official TAL form for execution.',
    ],
    sections: [
      {
        title: 'Mandatory Lease Form (QC)',
        body: [
          'Residential leases must use the form prescribed by the TAL. This summary is provided for review and is not a substitute for the official form.',
        ],
      },
      {
        title: 'Rent & Adjustments (QC)',
        body: [
          'Rent changes and conditions must follow the Civil Code and TAL practices. Disputes can be addressed via TAL processes.',
        ],
      },
    ],
  },
  DEFAULT: {
    code: 'DEFAULT',
    name: 'Canada (General)',
    sections: [
      {
        title: 'Standard Terms',
        body: [
          'This agreement is subject to the residential tenancy legislation applicable in the property’s province or territory.',
          'Quiet enjoyment: The tenant is entitled to reasonable privacy and freedom from unreasonable disturbance.',
        ],
      },
      {
        title: 'Deposits',
        body: [
          'Deposits, if permitted, must follow provincial limits and return timelines.',
        ],
      },
      {
        title: 'Entry & Repairs',
        body: [
          'Entry requires notice as provided by local law, except in emergencies. The landlord must maintain habitability and comply with building standards.',
        ],
      },
      {
        title: 'Termination',
        body: [
          'Ending a tenancy must follow local notice forms, reasons, and timelines. Parties should use official forms where applicable.',
        ],
      },
    ],
  },
};

export function getProvinceTemplate(code?: string): ProvinceTemplate {
  if (!code) return templates.DEFAULT;
  return templates[code as keyof typeof templates] || templates.DEFAULT;
}


