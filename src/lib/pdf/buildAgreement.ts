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
  const page = pdf.addPage([595, 842]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const { width } = page.getSize();
  const margin = 50;

  const drawText = (text: string, y: number, size = 12) => {
    page.drawText(text, { x: margin, y, size, font, color: rgb(0, 0, 0) });
  };

  let y = 800;
  page.drawText("Residential Rental Agreement (Canada)", { x: margin, y, size: 18, font });
  y -= 24;
  const prov = getProvinceRules(data.jurisdiction?.provinceCode || "");
  drawText(`Jurisdiction: ${prov?.name ?? "N/A"}`, y); y -= 18;

  // Parties
  drawText("Landlord", y, 14); y -= 16;
  drawText(`Name: ${data.landlord.name}`, y); y -= 14;
  drawText(`Email: ${data.landlord.email}`, y); y -= 14;
  drawText(`Phone: ${data.landlord.phone}`, y); y -= 18;

  drawText("Tenant", y, 14); y -= 16;
  drawText(`Name: ${data.tenant.name}`, y); y -= 14;
  drawText(`Email: ${data.tenant.email}`, y); y -= 14;
  drawText(`Phone: ${data.tenant.phone}`, y); y -= 18;

  drawText("Property", y, 14); y -= 16;
  drawText(`Address: ${data.property.address}`, y); y -= 14;
  drawText(`Type: ${data.property.type}`, y); y -= 18;

  drawText("Terms", y, 14); y -= 16;
  drawText(`Rent: $${data.terms.rentAmount}/month`, y); y -= 14;
  if (prov?.code === "ON") {
    drawText(`Rent Deposit (L.M.R.): $${(data.terms as any).rentDeposit || "0"}`, y); y -= 14;
    drawText(`Security Deposit: Not permitted`, y); y -= 14;
  } else {
    drawText(`Security Deposit: $${data.terms.securityDeposit || "0"}`, y); y -= 14;
  }
  drawText(`Lease: ${data.terms.leaseStart} to ${data.terms.leaseEnd}`, y); y -= 14;
  if (data.terms.lateFeesAmount) {
    drawText(`Late Fee: $${data.terms.lateFeesAmount}`, y); y -= 14;
  }

  y -= 10;
  page.drawRectangle({ x: margin, y: y - 40, width: width - margin * 2, height: 40, color: rgb(0.95, 0.95, 1) });
  drawText("Compliance: If any term conflicts with applicable law, the Act prevails.", y - 12, 10);
  if (prov?.lastUpdated) drawText(`Rules last updated: ${prov.lastUpdated}`, y - 26, 10);
  y -= 52;

  // Signature block (simple)
  drawText("Signatures", y, 14); y -= 18;
  drawText(`Landlord: ${data.landlord.name} ____________________ Date: __________`, y); y -= 16;
  drawText(`Tenant:   ${data.tenant.name} ____________________ Date: __________`, y); y -= 16;

  // Signature audit metadata block
  const auditStartY = y - 10;
  const signatures = opts.signatures || [];
  if (signatures.length > 0) {
    page.drawRectangle({ x: margin, y: auditStartY - 70, width: width - margin * 2, height: 70, color: rgb(0.98, 0.98, 0.98) });
    drawText("Signature Audit", auditStartY - 12, 10);
    let lineY = auditStartY - 26;
    for (const sig of signatures) {
      const payload = JSON.stringify({ role: sig.role, name: sig.name, image: sig.imageDataUrl || sig.typed || "", at: sig.signedAtIso || new Date().toISOString(), email: sig.email || "", ip: sig.ip || "" });
      const hash = sig.hash || (await sha256Hex(payload));
      drawText(`${sig.role}: ${sig.name}  at: ${sig.signedAtIso || "N/A"}  hash: ${hash.slice(0, 16)}…`, lineY, 9);
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

