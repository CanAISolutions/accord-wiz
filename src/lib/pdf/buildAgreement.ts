import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getProvinceRules } from "@/lib/canadaRentalRules";

export interface BuildPdfOptions {
  data: any;
  signatures?: Array<{
    role: "landlord" | "tenant";
    name: string;
    imageDataUrl?: string; // optional drawn signature
    typed?: string; // fallback typed signature
    signedAtIso?: string;
    email?: string;
    ip?: string;
    hash?: string; // SHA-256 of signature payload
  }>;
}

export async function buildAgreementPdf(opts: BuildPdfOptions): Promise<Uint8Array> {
  const { data } = opts;
  const pdf = await PDFDocument.create();
  let page = pdf.addPage([595, 842]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();
  const margin = 50;
  const contentWidth = width - margin * 2;

  const formatCurrency = (v?: string) => {
    const n = Number.parseFloat(String(v || "0"));
    if (!Number.isFinite(n)) return "$0.00";
    return `$${n.toFixed(2)}`;
  };

  let y = height - margin;

  const addPageIfNeeded = (needed: number) => {
    if (y - needed < margin) {
      page = pdf.addPage([595, 842]);
      y = height - margin;
    }
  };

  const drawHeading = (text: string) => {
    addPageIfNeeded(26);
    page.drawText(text, { x: margin, y, size: 16, font, color: rgb(0, 0, 0) });
    y -= 22;
  };

  const wrapAndDraw = (text: string, size = 11, leading = 14) => {
    if (!text) return;
    const words = text.split(/\s+/);
    let line = "";
    const lines: string[] = [];
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) > contentWidth) {
        if (line) lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    for (const ln of lines) {
      addPageIfNeeded(leading);
      page.drawText(ln, { x: margin, y, size, font, color: rgb(0, 0, 0) });
      y -= leading;
    }
  };

  // Title and jurisdiction
  page.drawText("Residential Rental Agreement", { x: margin, y, size: 18, font });
  y -= 24;
  const prov = getProvinceRules(data.jurisdiction?.provinceCode || "");
  wrapAndDraw(`Jurisdiction: ${prov?.name ?? "N/A"}`);

  // Parties
  drawHeading("1. Parties");
  wrapAndDraw(`Landlord: ${data.landlord.name} — Email: ${data.landlord.email || "N/A"} — Phone: ${data.landlord.phone || "N/A"}`);
  wrapAndDraw(`Tenant: ${data.tenant.name} — Email: ${data.tenant.email || "N/A"} — Phone: ${data.tenant.phone || "N/A"}`);

  // Property
  drawHeading("2. Premises");
  wrapAndDraw(`Address: ${data.property.address}`);
  if (data.property.type) wrapAndDraw(`Type: ${data.property.type}`);

  // Term & Rent
  drawHeading("3. Term & Rent");
  wrapAndDraw(`Lease term: ${data.terms.leaseStart} to ${data.terms.leaseEnd}`);
  wrapAndDraw(`Rent: ${formatCurrency(data.terms.rentAmount)} per month; due on day ${data.terms.rentDueDate || "N/A"}.`);

  // Deposits (province-aware)
  drawHeading("4. Deposits");
  if (prov?.code === "ON") {
    wrapAndDraw(`Ontario: Security/damage deposits are not permitted. A rent deposit (last month's rent) may be collected: ${formatCurrency((data.terms as any).rentDeposit)}.`);
  } else {
    wrapAndDraw(`Security/Damage deposit: ${formatCurrency(data.terms.securityDeposit)} (subject to ${prov?.name || "provincial"} limits).`);
  }

  // Late fees (province-aware)
  drawHeading("5. Late Fees");
  if (prov?.lateFees?.allowed === false) {
    wrapAndDraw(`${prov.name}: Flat late fees are restricted. No fixed late fee is set in this agreement.`);
  } else if (data.terms.lateFeesAmount) {
    wrapAndDraw(`Late fee: ${formatCurrency(data.terms.lateFeesAmount)} after ${data.terms.lateFeesGracePeriod || 0} days.`);
  } else {
    wrapAndDraw(`No late fee specified.`);
  }

  // Policies
  drawHeading("6. Policies");
  if (data.clauses.petsAllowed) wrapAndDraw(`Pet policy: ${data.clauses.petsAllowed}`);
  if (data.clauses.smokingAllowed) wrapAndDraw(`Smoking policy: ${data.clauses.smokingAllowed}`);
  if (data.clauses.sublettingAllowed) wrapAndDraw(`Subletting: ${data.clauses.sublettingAllowed}`);

  // Maintenance & Repairs
  drawHeading("7. Maintenance & Repairs");
  if (data.clauses.maintenanceResponsibility) {
    wrapAndDraw(`Responsibility: ${data.clauses.maintenanceResponsibility}. Tenant must promptly report issues; landlord to maintain habitability as required by law.`);
  } else {
    wrapAndDraw(`Parties agree to comply with applicable maintenance and habitability requirements.`);
  }

  // Early Termination & Renewal
  drawHeading("8. Early Termination & Renewal");
  if (data.clauses.earlyTermination) wrapAndDraw(`Early termination: ${data.clauses.earlyTermination}.`);
  if (data.clauses.renewalTerms) wrapAndDraw(`Renewal terms: ${data.clauses.renewalTerms}.`);

  // Mandatory clauses
  drawHeading("9. Mandatory Legal Clauses");
  const actPrevails = (data.clauses as any).actPrevailsClause ||
    "If any term conflicts with the applicable residential tenancies law, the Act prevails over this agreement.";
  const humanRights = (data.clauses as any).humanRightsClause ||
    "The landlord and tenant must comply with human rights laws. Service animals are not pets and are permitted as required by law.";
  wrapAndDraw(`Act prevails: ${actPrevails}`);
  wrapAndDraw(`Human rights & service animals: ${humanRights}`);

  // Province notes / links
  drawHeading("10. Provincial Notices");
  if (prov?.code === "ON") {
    wrapAndDraw("Ontario: For standard lease guidance, refer to the official Standard Form of Lease.");
  } else if (prov?.code === "QC") {
    wrapAndDraw("Québec: This agreement must comply with TAL (Tribunal administratif du logement) rules. Refer to official forms where applicable.");
  } else if (prov) {
    wrapAndDraw(`${prov.name}: This agreement is intended to align with provincial requirements.`);
  }

  // Signatures
  drawHeading("11. Signatures");
  wrapAndDraw(`Landlord: ${data.landlord.name} ____________________ Date: __________`);
  wrapAndDraw(`Tenant:   ${data.tenant.name} ____________________ Date: __________`);

  // Compliance footer box
  addPageIfNeeded(52);
  page.drawRectangle({ x: margin, y: y - 40, width: contentWidth, height: 40, color: rgb(0.95, 0.95, 1) });
  page.drawText("Compliance: If any term conflicts with applicable law, the Act prevails.", { x: margin + 6, y: y - 12, size: 10, font });
  if (prov?.lastUpdated) page.drawText(`Rules last updated: ${prov.lastUpdated}`, { x: margin + 6, y: y - 26, size: 10, font });
  y -= 52;

  // Signature audit metadata block
  const signatures = opts.signatures || [];
  if (signatures.length > 0) {
    addPageIfNeeded(90);
    page.drawRectangle({ x: margin, y: y - 70, width: contentWidth, height: 70, color: rgb(0.98, 0.98, 0.98) });
    page.drawText("Signature Audit", { x: margin + 6, y: y - 12, size: 10, font });
    let lineY = y - 26;
    for (const sig of signatures) {
      const payload = JSON.stringify({ role: sig.role, name: sig.name, image: sig.imageDataUrl || sig.typed || "", at: sig.signedAtIso || new Date().toISOString(), email: sig.email || "", ip: sig.ip || "" });
      const hash = sig.hash || (await sha256Hex(payload));
      page.drawText(`${sig.role}: ${sig.name}  at: ${sig.signedAtIso || "N/A"}  hash: ${hash.slice(0, 16)}…`, { x: margin + 6, y: lineY, size: 9, font });
      lineY -= 12;
    }
    y = lineY - 8;
  }

  return await pdf.save();
}

async function sha256Hex(input: string): Promise<string> {
  try {
    // Browser Web Crypto
    // @ts-ignore
    const enc = new TextEncoder();
    // @ts-ignore
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(input));
    const bytes = Array.from(new Uint8Array(buf));
    return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback non-cryptographic hash
    let x = 0;
    for (let i = 0; i < input.length; i++) x = (x * 31 + input.charCodeAt(i)) >>> 0;
    return x.toString(16);
  }
}

