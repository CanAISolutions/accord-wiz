export interface ProvinceSection {
  title: string;
  body: string[]; // paragraphs
}

export interface ProvinceTemplate {
  code: string;
  name: string;
  lastUpdated?: string;
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
    lastUpdated: '2024-12-01',
    notes: [
      'BC: Deposits and condition inspections must follow the Residential Tenancy Act and RTB policy.',
      'See Residential Tenancy Branch resources for current forms and guidance.',
    ],
    sections: [
      {
        title: 'Standard Terms (BC)',
        body: [
          'This tenancy is governed by the Residential Tenancy Act (B.C.) and its regulations. Standard terms apply even if not reproduced in full here.',
          'The tenant is entitled to quiet enjoyment, including reasonable privacy and freedom from unreasonable disturbance.',
        ],
      },
      {
        title: 'Right of Entry (BC)',
        body: [
          'Except for emergencies or with consent, the landlord must provide written notice stating date, time, and reason for entry. Entry must occur at reasonable times.',
        ],
      },
      {
        title: 'Deposits (BC)',
        body: [
          'A security deposit of up to one‑half month’s rent may be collected. A separate pet damage deposit of up to one‑half month’s rent may be collected when pets are permitted.',
          'Deposits must be returned with interest as required, less any lawful deductions. Move‑in and move‑out condition inspection reports should be completed; failure to do so may affect deposit claims.',
        ],
      },
      {
        title: 'Inspections & Repairs (BC)',
        body: [
          'Move‑in and move‑out condition inspections should be conducted with the tenant present where practicable.',
          'The landlord must maintain the premises in a state of repair that complies with health, safety, and housing standards and remains suitable for occupancy.',
        ],
      },
      {
        title: 'Assignments/Sublets (BC)',
        body: [
          'A tenant may assign or sublet with the landlord’s consent, which must not be unreasonably withheld. Any fees must be permitted by statute.',
        ],
      },
      {
        title: 'Rent & Increases (BC)',
        body: [
          'Rent is payable on the due date specified in this agreement. Any rent increase must comply with provincial guidelines and notice requirements.',
        ],
      },
      {
        title: 'Notice to End Tenancy (BC)',
        body: [
          'Ending a tenancy must follow the Act’s reasons and notice periods. Forms and timelines differ by reason (e.g., landlord use, cause, end of fixed term).',
        ],
      },
    ],
  },
  ON: {
    code: 'ON',
    name: 'Ontario',
    lastUpdated: '2024-12-01',
    notes: [
      'Ontario: Security/damage deposits are not permitted. A rent deposit (Last Month’s Rent) may be collected.',
      'Standard Form of Lease (Form 2229E) is mandatory for most residential tenancies.',
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
          'Terminations require proper forms and notice periods. Landlord‑initiated terminations (e.g., personal use or purchaser’s own use) include compensation and specific form requirements.',
        ],
      },
    ],
  },
  QC: {
    code: 'QC',
    name: 'Québec',
    lastUpdated: '2024-12-01',
    notes: [
      'Québec: The Tribunal administratif du logement (TAL) lease form is mandatory. This summary is for convenience only; use the official TAL form for execution.',
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
          'Rent changes and conditions must follow the Civil Code and TAL practices. Disputes may be addressed through TAL processes.',
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


