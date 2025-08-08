// Stub mapping for Ontario Standard Form of Lease
// In production, embed the latest PDF template and fill with pdf-lib form APIs.
export interface OntarioLeaseData {
  landlordName: string;
  tenantName: string;
  unitAddress: string;
  rentAmount: string;
  leaseStart: string;
  leaseEnd: string;
  rentDeposit?: string;
}

export async function buildOntarioStandardLeasePdf(data: OntarioLeaseData): Promise<Uint8Array | null> {
  // TODO: Attach official PDF, fill form fields, and return bytes.
  // For MVP, return null to trigger fallback to deep link.
  return null;
}

export function getOntarioLeaseDeepLink(): string {
  // Official resource page linking to latest SFL download
  return "https://www.ontario.ca/page/guide-ontarios-standard-lease";
}

