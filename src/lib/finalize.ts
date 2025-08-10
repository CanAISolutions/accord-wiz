import { buildAgreementPdf } from "@/lib/pdf/buildAgreement";

export interface FinalizeOptions {
  paymentStatus?: "paid" | "simulated_paid" | "free";
  signatures?: Array<{
    role: "landlord" | "tenant";
    name: string;
    imageDataUrl?: string;
    signedAtIso?: string;
  }>;
}

/**
 * Build the agreement PDF, persist it locally, and return a stable ID.
 * Storage key: `agreements:<id>` with fields { pdfDataUrl, data, createdAt, paymentStatus }
 */
export async function finalizeAndGenerate(
  data: unknown,
  opts?: FinalizeOptions
): Promise<string> {
  const id = crypto.randomUUID();
  const bytes = await buildAgreementPdf({ data, signatures: opts?.signatures });
  const blob = new Blob([bytes], { type: "application/pdf" });
  const pdfDataUrl = await blobToDataUrl(blob);
  const record = {
    id,
    pdfDataUrl,
    data,
    createdAt: new Date().toISOString(),
    paymentStatus: opts?.paymentStatus ?? "free",
  };
  try {
    localStorage.setItem(`agreements:${id}`, JSON.stringify(record));
  } catch {}
  return id;
}

export function loadAgreement(id: string): { pdfDataUrl: string } | null {
  try {
    const raw = localStorage.getItem(`agreements:${id}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { pdfDataUrl: parsed.pdfDataUrl };
  } catch {
    return null;
  }
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}


